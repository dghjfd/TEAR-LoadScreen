--[[
    TEAR-LoadScreen 验证模块 (服务端)
    - GitHub 版本检查
    - GitHub 文件对比（排除媒体文件）
    - 资源名称验证
    - 作者名称验证
    - 加密反篡改保护
]]

local VALIDATION = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME = "TEAR",
    GITHUB_REPO = "https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen/releases/latest",
    GITHUB_API = "https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen",
    REQUIRED_VERSION = "2.1.5",
    ENCRYPTION_KEY = nil,
    INITIALIZED = false
}

--[[
    媒体文件扩展名列表（不进行对比）
]]
local MEDIA_EXTENSIONS = {
    ['.png'] = true,
    ['.jpg'] = true,
    ['.jpeg'] = true,
    ['.gif'] = true,
    ['.webp'] = true,
    ['.bmp'] = true,
    ['.mp3'] = true,
    ['.wav'] = true,
    ['.ogg'] = true,
    ['.mp4'] = true,
    ['.webm'] = true,
    ['.avi'] = true,
    ['.mkv'] = true
}

local function is_media_file(filename)
    if not filename then return false end
    local lower = string.lower(filename)
    for ext, _ in pairs(MEDIA_EXTENSIONS) do
        if string.find(lower, ext, 1, true) then
            return true
        end
    end
    return false
end

local function decrypt_data(encrypted, key)
    if not encrypted or not key then return nil end
    local decrypted = {}
    for i = 1, #encrypted do
        local char = string.byte(encrypted, i)
        local key_char = string.byte(key, (i - 1) % #key + 1)
        local xor_val = char ~ key_char
        xor_val = (xor_val >= 0 and xor_val <= 255) and xor_val or (xor_val % 256)
        decrypted[i] = string.char(xor_val)
    end
    return table.concat(decrypted)
end

local function encrypt_data(data, key)
    if not data or not key then return nil end
    local encrypted = {}
    for i = 1, #data do
        local char = string.byte(data, i)
        local key_char = string.byte(key, (i - 1) % #key + 1)
        local xor_val = char ~ key_char
        xor_val = (xor_val >= 0 and xor_val <= 255) and xor_val or (xor_val % 256)
        encrypted[i] = string.char(xor_val)
    end
    return table.concat(encrypted)
end

local function generate_validation_key()
    local source = GetCurrentResourceName() .. "TEAR-LoadScreen-SecureKey-2024"
    local hash = GetHashKey(source)
    local key = ""
    for i = 1, 16 do
        local shifted = math.floor(hash / math.pow(2, (i - 1) * 4))
        local byte = shifted % 256
        if byte == 0 then byte = 65 end
        key = key .. string.char(byte)
    end
    return key
end

local function validate_resource_name()
    local current_name = GetCurrentResourceName()
    local expected_name = VALIDATION.RESOURCE_NAME

    if current_name ~= expected_name then
        return false, string.format(
            "[TEAR-LoadScreen 验证错误] 资源名称不匹配! 预期: '%s', 当前: '%s'. 此资源不能被重命名。",
            expected_name, current_name
        )
    end
    return true, "资源名称验证成功"
end

local function validate_author_name(author_from_manifest)
    local expected_author = VALIDATION.AUTHOR_NAME

    if not author_from_manifest or author_from_manifest == "" then
        return false, "[TEAR-LoadScreen 验证错误] fxmanifest.lua 中缺少作者名称"
    end

    if author_from_manifest ~= expected_author then
        return false, string.format(
            "[TEAR-LoadScreen 验证错误] 作者名称不匹配! 预期: '%s', 当前: '%s'. 此资源的作者名称不能被修改。",
            expected_author, author_from_manifest
        )
    end
    return true, "作者名称验证成功"
end

local function validate_version(client_version, client_hash)
    local required = VALIDATION.REQUIRED_VERSION

    local function parse_version(v)
        local parts = {}
        for part in string.gmatch(v, "[^.]+") do
            table.insert(parts, tonumber(part) or 0)
        end
        while #parts < 3 do table.insert(parts, 0) end
        return parts
    end

    local function version_compare(v1, v2)
        local p1, p2 = parse_version(v1), parse_version(v2)
        for i = 1, 3 do
            if p1[i] > p2[i] then return 1
            elseif p1[i] < p2[i] then return -1 end
        end
        return 0
    end

    local p_client = parse_version(client_version)
    local p_required = parse_version(required)
    local major_diff = p_client[1] - p_required[1]

    if major_diff < 0 then
        if math.abs(major_diff) > 1 then
            return false, string.format(
                "[TEAR-LoadScreen 强制更新] 版本严重过旧! 当前: '%s', 最低要求: '%s'. 大版本相差 %d，已超过允许范围(1)。请立即从 GitHub 下载最新版本。",
                client_version, required, math.abs(major_diff)
            )
        else
            return false, string.format(
                "[TEAR-LoadScreen 验证错误] 版本过旧! 当前: '%s', 最低要求: '%s'. 请更新到最新版本。",
                client_version, required
            )
        end
    end

    local result = version_compare(client_version, required)
    if result < 0 then
        return false, string.format(
            "[TEAR-LoadScreen 验证错误] 版本过旧! 当前: '%s', 最低要求: '%s'. 请更新到最新版本。",
            client_version, required
        )
    end
    return true, "版本验证成功"
end

local VALIDATION_STATE = {
    PASSED = false,
    ERRORS = {},
    SUSPICIOUS = {},
    INITIALIZED = false,
    VERSION_OUTDATED = false,
    LATEST_VERSION = nil,
    UPDATE_INFO = nil
}

local function add_error(error_msg)
    table.insert(VALIDATION_STATE.ERRORS, error_msg)
end

local function add_suspicious(file_info)
    table.insert(VALIDATION_STATE.SUSPICIOUS, file_info)
end

local function clear_errors()
    VALIDATION_STATE.ERRORS = {}
    VALIDATION_STATE.SUSPICIOUS = {}
    VALIDATION_STATE.VERSION_OUTDATED = false
    VALIDATION_STATE.LATEST_VERSION = nil
    VALIDATION_STATE.UPDATE_INFO = nil
end

local function fetch_url(url)
    local result, status = nil, 0

    if PerformHttpRequest then
        PerformHttpRequest(url, function(errorCode, response, responseHeaders)
            if errorCode == 200 then
                result = response
            end
            status = errorCode
        end, "GET", "", {
            ["Content-Type"] = "application/json",
            ["Accept"] = "application/json",
            ["User-Agent"] = "TEAR-LoadScreen-Validator/2.1.5"
        })
    end

    return result, status
end

local function get_github_latest_version()
    local url = VALIDATION.GITHUB_REPO
    local result, status = fetch_url(url)

    if not result or status ~= 200 then
        return nil
    end

    local success, data = pcall(json.decode, result)
    if not success or not data then
        return nil
    end

    local version = data.tag_name and data.tag_name:gsub("^v", "") or data.name
    local body = data.body or ""
    local download_url = data.html_url or ""

    return {
        version = version,
        body = body,
        url = download_url
    }
end

local function get_github_file_tree()
    local url = VALIDATION.GITHUB_API .. "/git/trees/main?recursive=1"
    local result, status = fetch_url(url)

    if not result or status ~= 200 then
        url = VALIDATION.GITHUB_API .. "/git/trees/master?recursive=1"
        result, status = fetch_url(url)
    end

    if not result or status ~= 200 then
        return nil
    end

    local success, data = pcall(json.decode, result)
    if not success or not data or not data.tree then
        return nil
    end

    local files = {}
    for _, item in ipairs(data.tree) do
        if item.path then
            table.insert(files, item.path)
        end
    end

    return files
end

local function local_file_exists(filepath)
    local path = LoadResourceFile(GetCurrentResourceName(), filepath)
    return path ~= nil
end

local function compare_files_with_github()
    local github_files = get_github_file_tree()

    if not github_files then
        return { skipped = true }
    end

    local result = {
        total = 0,
        checked = 0,
        media_excluded = 0,
        missing = {},
        extra = {}
    }

    local github_map = {}
    for _, f in ipairs(github_files) do
        github_map[f] = true
    end

    for _, filepath in ipairs(github_files) do
        result.total = result.total + 1

        local ext = string.match(filepath, "%.[^.]+$") or ""
        if is_media_file(ext) or is_media_file(filepath) then
            result.media_excluded = result.media_excluded + 1
        else
            result.checked = result.checked + 1
            if not local_file_exists(filepath) then
                table.insert(result.missing, filepath)
                add_suspicious("文件缺失: " .. filepath)
            end
        end
    end

    local manifest_files = {
        'index.html', 'style.css', 'config.js', 'script.js',
        'cl_validation.js', 'sv_validation.lua', 'cl_validation.lua', 'fxmanifest.lua'
    }

    local media_patterns = { 'images/', 'videos/', 'audio/' }

    local function is_media_path(path)
        for _, pattern in ipairs(media_patterns) do
            if string.find(path, pattern, 1, true) then
                return true
            end
        end
        return is_media_file(path)
    end

    for _, filepath in ipairs(manifest_files) do
        if not is_media_path(filepath) and not github_map[filepath] then
            table.insert(result.extra, filepath)
            add_suspicious("疑似多余文件: " .. filepath)
        end
    end

    return result
end

local function print_header()
    print("")
    print("  _______  _______  _______  _______     ____   ____  _______ ")
    print(" |  ____||  ____||  ____||  ____ \\   |  __ \\ / __||  ____|")
    print(" | |     | |     | |     | |__) |   | |__) || |   | |")
    print(" | |     | |     | |     |  _  /    |  _  / | |   | |")
    print(" | |____ | |____ | |____ | | \\ \\   | | \\ \\ | |___| |____")
    print(" |______||______||______||_|  \\_\\  |_|  \\_\\|______||______|")
    print("")
    print("    TEAR-LoadScreen v" .. VALIDATION.REQUIRED_VERSION)
    print("    Protected by TEAR Validation System")
    print("")
end

local function print_update_info()
    if not VALIDATION_STATE.VERSION_OUTDATED then
        return
    end

    local info = VALIDATION_STATE.UPDATE_INFO
    if not info or not info.body or info.body == "" then
        return
    end

    print("")
    print("  ========== 版本更新日志 ==========")
    print("  最新版本: v" .. (info.version or "未知"))
    print("  下载地址: " .. (info.url or "未知"))
    print("")
    print("  更新内容:")
    print("  -----------------------------------------")

    local lines = {}
    for line in string.gmatch(info.body, "[^\r\n]+") do
        line = line:gsub("^%s*(.-)%s*$", "%1")
        if line ~= "" and line ~= " " then
            table.insert(lines, line)
        end
    end

    for i, line in ipairs(lines) do
        if i <= 10 then
            local display_line = line
            if #display_line > 50 then
                display_line = display_line:sub(1, 47) .. "..."
            end
            print("    " .. display_line)
        end
    end

    if #lines > 10 then
        print("    ... (更多内容请查看 GitHub)")
    end

    print("  =========================================")
    print("")
end

local function print_result()
    if #VALIDATION_STATE.ERRORS > 0 then
        print("")
        print("  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        print("       验证失败 - 资源已禁用")
        print("  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        print("")
        print("  发现以下错误:")
        for _, err in ipairs(VALIDATION_STATE.ERRORS) do
            print("    - " .. err)
        end

        if #VALIDATION_STATE.SUSPICIOUS > 0 then
            print("")
            print("  疑似修改的文件:")
            for _, info in ipairs(VALIDATION_STATE.SUSPICIOUS) do
                print("    - " .. info)
            end
        end

        print("")
        print("  请恢复原始配置后重试")
        print("  =========================================")
    else
        if #VALIDATION_STATE.SUSPICIOUS > 0 then
            print("")
            print("  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print("       验证通过 - 但检测到疑似修改")
            print("  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print("")
            print("  疑似修改的文件:")
            for _, info in ipairs(VALIDATION_STATE.SUSPICIOUS) do
                print("    - " .. info)
            end
            print("")
            print("  如需帮助请联系作者")
            print("  =========================================")
        else
            print("")
            print("  =========================================")
            print("       验证通过 - 所有检查成功!")
            print("  =========================================")
        end
    end
end

AddEventHandler("onResourceStart", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end

    print_header()

    clear_errors()
    VALIDATION_STATE.PASSED = false

    VALIDATION.ENCRYPTION_KEY = generate_validation_key()

    local github_info = get_github_latest_version()
    if github_info then
        VALIDATION_STATE.LATEST_VERSION = github_info.version
        VALIDATION_STATE.UPDATE_INFO = github_info
    end

    print("  ----------------------------------------")
    print("  开始验证...")
    print("  ----------------------------------------")

    local name_valid, name_msg = validate_resource_name()
    print("  [1/4] " .. name_msg)
    if not name_valid then
        add_error(name_msg)
    end

    local manifest_path = LoadResourceFile(resourceName, "fxmanifest.lua")
    if manifest_path then
        local author_match = string.match(manifest_path, "author%s+['\"]([^'\"]+)['\"]")
        if author_match then
            local author_valid, author_msg = validate_author_name(author_match)
            print("  [2/4] " .. author_msg)
            if not author_valid then
                add_error(author_msg)
            end
        else
            local msg = "[TEAR-LoadScreen 验证错误] 无法从 fxmanifest.lua 解析作者"
            print("  [2/4] " .. msg)
            add_error(msg)
        end
    else
        local msg = "[TEAR-LoadScreen 验证错误] 无法加载 fxmanifest.lua"
        print("  [2/4] " .. msg)
        add_error(msg)
    end

    local client_version = GetResourceMetadata(resourceName, "version", 0) or "0.0.0"
    local version_valid, version_msg = validate_version(client_version, nil)
    print("  [3/4] " .. version_msg)
    if not version_valid then
        add_error(version_msg)
        VALIDATION_STATE.VERSION_OUTDATED = true
    end

    print("  [4/4] 正在执行 GitHub 文件对比...")
    local compare_result = compare_files_with_github()

    if not compare_result.skipped then
        print("")
        print("  ----------------------------------------")
        print("  GitHub 文件对比结果:")
        print("    总文件数: " .. compare_result.total)
        print("    已检查: " .. compare_result.checked)
        print("    媒体文件已排除: " .. compare_result.media_excluded)

        if #compare_result.missing > 0 then
            print("    缺失文件: " .. #compare_result.missing)
            for _, f in ipairs(compare_result.missing) do
                print("      - " .. f)
            end
        end

        if #compare_result.extra > 0 then
            print("    疑似多余文件: " .. #compare_result.extra)
            for _, f in ipairs(compare_result.extra) do
                print("      - " .. f)
            end
        end
    end

    print_update_info()
    print_result()

    if #VALIDATION_STATE.ERRORS > 0 then
        VALIDATION_STATE.PASSED = false
    else
        VALIDATION_STATE.PASSED = true
        VALIDATION_STATE.INITIALIZED = true
    end
end)

RegisterNetEvent("TEAR-LoadScreen:RequestValidation")
AddEventHandler("TEAR-LoadScreen:RequestValidation", function()
    local source = source

    if not VALIDATION_STATE.PASSED then
        TriggerClientEvent("TEAR-LoadScreen:ValidationResult", source, false, {
            errors = VALIDATION_STATE.ERRORS,
            suspicious = VALIDATION_STATE.SUSPICIOUS,
            version_outdated = VALIDATION_STATE.VERSION_OUTDATED,
            update_info = VALIDATION_STATE.VERSION_OUTDATED and VALIDATION_STATE.UPDATE_INFO or nil
        })
        return
    end

    local encrypted_response = encrypt_data(json.encode({
        valid = true,
        resource = VALIDATION.RESOURCE_NAME,
        timestamp = os.time(),
        suspicious = VALIDATION_STATE.SUSPICIOUS
    }), VALIDATION.ENCRYPTION_KEY)

    TriggerClientEvent("TEAR-LoadScreen:ValidationResult", source, true, {
        encrypted = encrypted_response,
        message = "验证通过",
        suspicious = VALIDATION_STATE.SUSPICIOUS,
        version_outdated = VALIDATION_STATE.VERSION_OUTDATED,
        update_info = VALIDATION_STATE.VERSION_OUTDATED and VALIDATION_STATE.UPDATE_INFO or nil
    })
end)

exports("TEAR-LoadScreen:IsValidationPassed", function()
    return VALIDATION_STATE.PASSED
end)

exports("TEAR-LoadScreen:GetValidationErrors", function()
    return VALIDATION_STATE.ERRORS
end)

exports("TEAR-LoadScreen:GetSuspiciousFiles", function()
    return VALIDATION_STATE.SUSPICIOUS
end)
