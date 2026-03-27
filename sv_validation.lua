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
    REQUIRED_VERSION = "2.2.1",
    ENCRYPTION_KEY = nil
}

local MEDIA_EXTENSIONS = {
    ['.png'] = true, ['.jpg'] = true, ['.jpeg'] = true, ['.gif'] = true,
    ['.webp'] = true, ['.bmp'] = true, ['.mp3'] = true, ['.wav'] = true,
    ['.ogg'] = true, ['.mp4'] = true, ['.webm'] = true, ['.avi'] = true, ['.mkv'] = true
}

local C = {
    RED = "^1",
    GREEN = "^2",
    YELLOW = "^3",
    BLUE = "^4",
    CYAN = "^5",
    WHITE = "^7",
    GREY = "^8",
    RESET = "^0"
}

local function is_media_file(filename)
    if not filename then return false end
    local lower = string.lower(filename)
    for ext, _ in pairs(MEDIA_EXTENSIONS) do
        if string.find(lower, ext, 1, true) then return true end
    end
    return false
end

local function encrypt_data(data, key)
    if not data or not key then return nil end
    local encrypted = {}
    for i = 1, #data do
        local char = string.byte(data, i)
        local key_char = string.byte(key, (i - 1) % #key + 1)
        local xor_val = bit.bxor(char, key_char)
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
    if current_name ~= VALIDATION.RESOURCE_NAME then
        return false, C.RED .. "[TEAR-LoadScreen 验证错误] 资源名称不匹配: " .. current_name .. C.RESET
    end
    return true, C.GREEN .. "资源名称验证成功" .. C.RESET
end

local function validate_author_name(author_from_manifest)
    if not author_from_manifest or author_from_manifest == "" then
        return false, C.RED .. "[TEAR-LoadScreen 验证错误] fxmanifest.lua 中缺少作者名称" .. C.RESET
    end
    if author_from_manifest ~= VALIDATION.AUTHOR_NAME then
        return false, C.RED .. "[TEAR-LoadScreen 验证错误] 作者名称不匹配: " .. author_from_manifest .. C.RESET
    end
    return true, C.GREEN .. "作者名称验证成功" .. C.RESET
end

local function validate_version(client_version)
    local required = VALIDATION.REQUIRED_VERSION

    local function parse_version(v)
        local parts = {}
        for part in string.gmatch(v, "[^.]+") do
            table.insert(parts, tonumber(part) or 0)
        end
        while #parts &lt; 3 do table.insert(parts, 0) end
        return parts
    end

    local p_client = parse_version(client_version)
    local p_required = parse_version(required)

    local diffs = {
        major = p_client[1] - p_required[1],
        minor = p_client[2] - p_required[2],
        patch = p_client[3] - p_required[3]
    }

    local forced = math.abs(diffs.major) &gt; 1 or
                   math.abs(diffs.minor) &gt; 1 or
                   math.abs(diffs.patch) &gt; 1

    if diffs.major &lt; 0 or diffs.minor &lt; 0 or diffs.patch &lt; 0 then
        if forced then
            return false, C.RED .. "[TEAR-LoadScreen 强制更新] 版本过旧! 当前: " .. client_version .. " → 最低要求: " .. required .. C.RESET
        else
            return false, C.YELLOW .. "[TEAR-LoadScreen 验证错误] 版本过旧! 当前: " .. client_version .. " → 最低要求: " .. required .. C.RESET
        end
    end

    if p_client[1] &gt; p_required[1] or p_client[2] &gt; p_required[2] or p_client[3] &gt; p_required[3] then
        return true, C.GREEN .. "版本验证成功 (检测到更新版本)" .. C.RESET
    end

    return true, C.GREEN .. "版本验证成功" .. C.RESET
end

local VALIDATION_STATE = {
    PASSED = false,
    ERRORS = {},
    SUSPICIOUS = {},
    VERSION_OUTDATED = false,
    UPDATE_INFO = nil
}

local function add_error(msg)
    table.insert(VALIDATION_STATE.ERRORS, msg)
end

local function add_suspicious(info)
    table.insert(VALIDATION_STATE.SUSPICIOUS, info)
end

local function clear_state()
    VALIDATION_STATE.ERRORS = {}
    VALIDATION_STATE.SUSPICIOUS = {}
    VALIDATION_STATE.VERSION_OUTDATED = false
    VALIDATION_STATE.UPDATE_INFO = nil
end

local function fetch_url(url)
    local result, status = nil, 0
    if PerformHttpRequest then
        PerformHttpRequest(url, function(errorCode, response)
            if errorCode == 200 then result = response end
            status = errorCode
        end, "GET", "", {
            ["Content-Type"] = "application/json",
            ["Accept"] = "application/json",
            ["User-Agent"] = "TEAR-LoadScreen-Validator/2.2.1"
        })
    end
    return result, status
end

local function get_github_latest_version()
    local result, status = fetch_url(VALIDATION.GITHUB_REPO)
    if not result or status ~= 200 then return nil end

    local success, data = pcall(json.decode, result)
    if not success or not data then return nil end

    return {
        version = data.tag_name and data.tag_name:gsub("^v", "") or data.name,
        body = data.body or "",
        url = data.html_url or ""
    }
end

local function get_github_file_tree()
    local result, status = fetch_url(VALIDATION.GITHUB_API .. "/git/trees/main?recursive=1")
    if not result or status ~= 200 then
        result, status = fetch_url(VALIDATION.GITHUB_API .. "/git/trees/master?recursive=1")
    end
    if not result or status ~= 200 then return nil end

    local success, data = pcall(json.decode, result)
    if not success or not data or not data.tree then return nil end

    local files = {}
    for _, item in ipairs(data.tree) do
        if item.path then table.insert(files, item.path) end
    end
    return files
end

local function local_file_exists(filepath)
    return LoadResourceFile(GetCurrentResourceName(), filepath) ~= nil
end

local function compare_files_with_github()
    local github_files = get_github_file_tree()
    if not github_files then return { skipped = true } end

    local result = { total = 0, checked = 0, media_excluded = 0, missing = {}, extra = {} }
    local github_map = {}
    for _, f in ipairs(github_files) do github_map[f] = true end

    for _, filepath in ipairs(github_files) do
        result.total = result.total + 1
        local ext = string.match(filepath, "%.[^.]+$") or ""
        if is_media_file(ext) or is_media_file(filepath) then
            result.media_excluded = result.media_excluded + 1
        else
            result.checked = result.checked + 1
            if not local_file_exists(filepath) then
                table.insert(result.missing, filepath)
                add_suspicious(C.YELLOW .. "文件缺失: " .. filepath .. C.RESET)
            end
        end
    end

    local manifest_files = {
        'index.html', 'style.css', 'config.js', 'script.js',
        'cl_validation.js', 'sv_validation.lua', 'cl_validation.lua', 'fxmanifest.lua'
    }

    for _, filepath in ipairs(manifest_files) do
        if not is_media_file(filepath) and not github_map[filepath] then
            table.insert(result.extra, filepath)
            add_suspicious(C.YELLOW .. "疑似多余文件: " .. filepath .. C.RESET)
        end
    end

    return result
end

local function print_header()
    print("")
    print(C.CYAN .. "╔════════════════════════════════════════════════════════════╗" .. C.RESET)
    print(C.CYAN .. "║" .. C.GREEN .. "  ████████╗███████╗ █████╗ ██████╗ " .. C.CYAN .. "║" .. C.RESET)
    print(C.CYAN .. "║" .. C.GREEN .. "  ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗" .. C.CYAN .. "║" .. C.RESET)
    print(C.CYAN .. "║" .. C.GREEN .. "     ██║   █████╗  ███████║██████╔╝" .. C.CYAN .. "║" .. C.RESET)
    print(C.CYAN .. "║" .. C.GREEN .. "     ██║   ██╔══╝  ██╔══██║██╔══██╗" .. C.CYAN .. "║" .. C.RESET)
    print(C.CYAN .. "║" .. C.GREEN .. "     ██║   ███████╗██║  ██║██║  ██║" .. C.CYAN .. "║" .. C.RESET)
    print(C.CYAN .. "║" .. C.GREEN .. "     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝" .. C.CYAN .. "║" .. C.RESET)
    print(C.CYAN .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
    print(C.CYAN .. "║" .. C.WHITE .. "                                                            ║" .. C.RESET)
    print(C.CYAN .. "║" .. C.WHITE .. "  " .. C.GREEN .. "TEAR-LoadScreen" .. C.WHITE .. "          " .. C.WHITE .. "版本: " .. C.CYAN .. "v" .. VALIDATION.REQUIRED_VERSION .. C.WHITE .. "          ║" .. C.RESET)
    print(C.CYAN .. "║" .. C.WHITE .. "  " .. C.YELLOW .. "作者: TEAR" .. C.WHITE .. "                                                  ║" .. C.RESET)
    print(C.CYAN .. "║" .. C.WHITE .. "  " .. C.GREY .. "Protected by TEAR Validation System" .. C.WHITE .. "                        ║" .. C.RESET)
    print(C.CYAN .. "║" .. C.WHITE .. "                                                            ║" .. C.RESET)
    print(C.CYAN .. "╚════════════════════════════════════════════════════════════╝" .. C.RESET)
    print("")
end

local function print_result()
    if #VALIDATION_STATE.ERRORS &gt; 0 then
        print("")
        print(C.RED .. "╔════════════════════════════════════════════════════════════╗" .. C.RESET)
        print(C.RED .. "║" .. C.WHITE .. "  ❌ 验证失败 - 资源已禁用" .. string.rep(" ", 29) .. "║" .. C.RESET)
        print(C.RED .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
        for _, err in ipairs(VALIDATION_STATE.ERRORS) do
            print(C.RED .. "║" .. C.WHITE .. "  " .. err .. string.rep(" ", 50 - #err) .. "║" .. C.RESET)
        end
        print(C.RED .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
        if #VALIDATION_STATE.SUSPICIOUS &gt; 0 then
            for _, info in ipairs(VALIDATION_STATE.SUSPICIOUS) do
                print(C.YELLOW .. "║" .. C.WHITE .. "  ⚠️  " .. info .. string.rep(" ", 47 - #info) .. "║" .. C.RESET)
            end
            print(C.YELLOW .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
        end
        print(C.YELLOW .. "║" .. C.WHITE .. "  请恢复原始配置后重试" .. string.rep(" ", 32) .. "║" .. C.RESET)
        print(C.RED .. "╚════════════════════════════════════════════════════════════╝" .. C.RESET)
        print("")
    else
        if #VALIDATION_STATE.SUSPICIOUS &gt; 0 then
            print("")
            print(C.YELLOW .. "╔════════════════════════════════════════════════════════════╗" .. C.RESET)
            print(C.YELLOW .. "║" .. C.WHITE .. "  ⚠️ 验证通过 - 检测到疑似修改" .. string.rep(" ", 26) .. "║" .. C.RESET)
            print(C.YELLOW .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
            for _, info in ipairs(VALIDATION_STATE.SUSPICIOUS) do
                print(C.YELLOW .. "║" .. C.WHITE .. "  " .. info .. string.rep(" ", 50 - #info) .. "║" .. C.RESET)
            end
            print(C.YELLOW .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
            print(C.WHITE .. "║" .. C.GREY .. "  如需帮助请联系作者" .. string.rep(" ", 36) .. "║" .. C.RESET)
            print(C.YELLOW .. "╚════════════════════════════════════════════════════════════╝" .. C.RESET)
            print("")
        else
            print("")
            print(C.GREEN .. "╔════════════════════════════════════════════════════════════╗" .. C.RESET)
            print(C.GREEN .. "║" .. C.WHITE .. "  ✅ 验证通过 - 所有检查成功!" .. string.rep(" ", 28) .. "║" .. C.RESET)
            print(C.GREEN .. "╚════════════════════════════════════════════════════════════╝" .. C.RESET)
            print("")
        end
    end
end

local function perform_validation()
    local resourceName = GetCurrentResourceName()
    
    print_header()
    clear_state()
    VALIDATION_STATE.PASSED = false
    VALIDATION.ENCRYPTION_KEY = generate_validation_key()

    local github_info = get_github_latest_version()
    if github_info then
        VALIDATION_STATE.UPDATE_INFO = github_info
    end

    print(C.WHITE .. "╔════════════════════════════════════════════════════════════╗" .. C.RESET)
    print(C.WHITE .. "║" .. C.CYAN .. "  开始验证..." .. string.rep(" ", 43) .. "║" .. C.RESET)
    print(C.WHITE .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)

    local name_valid, name_msg = validate_resource_name()
    local name_prefix = name_valid and C.GREEN .. "  ✓" or C.RED .. "  ✗"
    print(C.WHITE .. "║" .. name_prefix .. " [1/4] " .. name_msg .. string.rep(" ", 45 - #name_msg) .. "║" .. C.RESET)
    if not name_valid then add_error(name_msg) end

    local manifest_path = LoadResourceFile(resourceName, "fxmanifest.lua")
    if manifest_path then
        local author_match = string.match(manifest_path, "author%s+['\"]([^'\"]+)['\"]")
        if author_match then
            local author_valid, author_msg = validate_author_name(author_match)
            local author_prefix = author_valid and C.GREEN .. "  ✓" or C.RED .. "  ✗"
            print(C.WHITE .. "║" .. author_prefix .. " [2/4] " .. author_msg .. string.rep(" ", 45 - #author_msg) .. "║" .. C.RESET)
            if not author_valid then add_error(author_msg) end
        else
            local author_msg = C.RED .. "无法解析作者" .. C.RESET
            print(C.WHITE .. "║" .. C.RED .. "  ✗ [2/4] " .. author_msg .. string.rep(" ", 45 - #author_msg) .. "║" .. C.RESET)
            add_error(C.RED .. "[TEAR-LoadScreen 验证错误] 无法从 fxmanifest.lua 解析作者" .. C.RESET)
        end
    else
        local author_msg = C.RED .. "无法加载 fxmanifest.lua" .. C.RESET
        print(C.WHITE .. "║" .. C.RED .. "  ✗ [2/4] " .. author_msg .. string.rep(" ", 45 - #author_msg) .. "║" .. C.RESET)
        add_error(C.RED .. "[TEAR-LoadScreen 验证错误] 无法加载 fxmanifest.lua" .. C.RESET)
    end

    local client_version = GetResourceMetadata(resourceName, "version", 0) or "0.0.0"
    local version_valid, version_msg = validate_version(client_version)
    local version_prefix = version_valid and C.GREEN .. "  ✓" or C.YELLOW .. "  !"
    print(C.WHITE .. "║" .. version_prefix .. " [3/4] " .. version_msg .. string.rep(" ", 45 - #version_msg) .. "║" .. C.RESET)
    if not version_valid then
        add_error(version_msg)
        VALIDATION_STATE.VERSION_OUTDATED = true
    end

    print(C.WHITE .. "║" .. C.CYAN .. "  🔍 [4/4] 正在执行 GitHub 文件对比..." .. string.rep(" ", 21) .. "║" .. C.RESET)
    local compare_result = compare_files_with_github()

    if not compare_result.skipped then
        print(C.WHITE .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
        local file_msg = "  GitHub 文件对比: " .. compare_result.checked .. "/" .. compare_result.total .. " (排除 " .. compare_result.media_excluded .. " 个媒体文件)"
        print(C.WHITE .. "║" .. C.WHITE .. file_msg .. string.rep(" ", 50 - #file_msg) .. "║" .. C.RESET)
        if #compare_result.missing &gt; 0 then
            for _, f in ipairs(compare_result.missing) do
                local missing_msg = "  - 缺失: " .. f
                print(C.WHITE .. "║" .. C.RED .. missing_msg .. string.rep(" ", 50 - #missing_msg) .. "║" .. C.RESET)
            end
        end
        if #compare_result.extra &gt; 0 then
            for _, f in ipairs(compare_result.extra) do
                local extra_msg = "  - 多余: " .. f
                print(C.WHITE .. "║" .. C.YELLOW .. extra_msg .. string.rep(" ", 50 - #extra_msg) .. "║" .. C.RESET)
            end
        end
        if #compare_result.missing == 0 and #compare_result.extra == 0 then
            local success_msg = "  ✅ 全部文件匹配"
            print(C.WHITE .. "║" .. C.GREEN .. success_msg .. string.rep(" ", 50 - #success_msg) .. "║" .. C.RESET)
        end
    end
    print(C.WHITE .. "╚════════════════════════════════════════════════════════════╝" .. C.RESET)

    if VALIDATION_STATE.VERSION_OUTDATED and VALIDATION_STATE.UPDATE_INFO then
        local info = VALIDATION_STATE.UPDATE_INFO
        if info.body and info.body ~= "" then
            print("")
            print(C.YELLOW .. "╔════════════════════════════════════════════════════════════╗" .. C.RESET)
            print(C.YELLOW .. "║" .. C.WHITE .. "  📦 版本更新日志" .. string.rep(" ", 38) .. "║" .. C.RESET)
            print(C.YELLOW .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
            local latest_msg = "  最新版本: v" .. (info.version or "")
            print(C.WHITE .. "║" .. C.GREEN .. latest_msg .. string.rep(" ", 50 - #latest_msg) .. "║" .. C.RESET)
            local url_msg = "  下载地址: " .. (info.url or "")
            if #url_msg &gt; 50 then url_msg = url_msg:sub(1, 47) .. "..." end
            print(C.WHITE .. "║" .. C.BLUE .. url_msg .. string.rep(" ", 50 - #url_msg) .. "║" .. C.RESET)
            print(C.WHITE .. "╠════════════════════════════════════════════════════════════╣" .. C.RESET)
            local lines = {}
            for line in string.gmatch(info.body, "[^\r\n]+") do
                line = line:gsub("^%s*(.-)%s*$", "%1")
                if line ~= "" then table.insert(lines, line) end
            end
            for i = 1, math.min(#lines, 8) do
                local display_line = lines[i]
                if #display_line &gt; 48 then display_line = display_line:sub(1, 45) .. "..." end
                print(C.WHITE .. "║" .. C.WHITE .. "  " .. display_line .. string.rep(" ", 48 - #display_line) .. "║" .. C.RESET)
            end
            if #lines &gt; 8 then
                local more_msg = "  ... (更多内容请查看 GitHub)"
                print(C.WHITE .. "║" .. C.GREY .. more_msg .. string.rep(" ", 50 - #more_msg) .. "║" .. C.RESET)
            end
            print(C.YELLOW .. "╚════════════════════════════════════════════════════════════╝" .. C.RESET)
        end
    end

    print_result()

    VALIDATION_STATE.PASSED = (#VALIDATION_STATE.ERRORS == 0)
end

AddEventHandler("onResourceStart", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end
    
    SetTimeout(2000, function()
        perform_validation()
    end)
end)

RegisterNetEvent("TEAR-LoadScreen:RequestValidation")
AddEventHandler("TEAR-LoadScreen:RequestValidation", function()
    local source = source

    if not VALIDATION_STATE.PASSED then
        TriggerClientEvent("TEAR-LoadScreen:ValidationResult", source, false, {
            errors = VALIDATION_STATE.ERRORS,
            suspicious = VALIDATION_STATE.SUSPICIOUS
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
        suspicious = VALIDATION_STATE.SUSPICIOUS
    })
end)

exports("TEAR-LoadScreen:IsValidationPassed", function() return VALIDATION_STATE.PASSED end)
exports("TEAR-LoadScreen:GetValidationErrors", function() return VALIDATION_STATE.ERRORS end)
exports("TEAR-LoadScreen:GetSuspiciousFiles", function() return VALIDATION_STATE.SUSPICIOUS end)
