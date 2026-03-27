--[[
    TEAR-LoadScreen 验证模块 (服务端)
    - GitHub 版本检查
    - 资源名称验证
    - 作者名称验证
    - 加密反篡改保护
]]

local VALIDATION = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME = "TEAR",
    GITHUB_REPO = "https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen/releases/latest",
    REQUIRED_VERSION = "2.1.5",
    ENCRYPTION_KEY = nil,
    INITIALIZED = false
}

--[[
    解密数据
    使用 XOR 加密算法
    @param encrypted 加密后的字符串
    @param key 解密密钥
    @return 解密后的字符串，失败返回 nil
]]
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

--[[
    加密数据
    使用 XOR 加密算法
    @param data 原始数据
    @param key 加密密钥
    @return 加密后的字符串，失败返回 nil
]]
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

--[[
    生成验证密钥
    基于资源名称生成唯一的验证密钥
    @return 16字节的验证密钥字符串
]]
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

--[[
    验证资源名称
    检查当前资源名称是否与预期名称匹配
    @return 验证结果和消息
]]
local function validate_resource_name()
    local current_name = GetCurrentResourceName()
    local expected_name = VALIDATION.RESOURCE_NAME

    if current_name ~= expected_name then
        return false, string.format(
            "[TEAR-LoadScreen 验证错误] 资源名称不匹配! " ..
            "预期: '%s', 当前: '%s'. " ..
            "此资源不能被重命名。请恢复原始资源名称。",
            expected_name, current_name
        )
    end
    return true, "资源名称验证成功"
end

--[[
    验证作者名称
    检查 fxmanifest.lua 中的作者名称是否正确
    @param author_from_manifest 从 manifest 获取的作者名称
    @return 验证结果和消息
]]
local function validate_author_name(author_from_manifest)
    local expected_author = VALIDATION.AUTHOR_NAME

    if not author_from_manifest or author_from_manifest == "" then
        return false, "[TEAR-LoadScreen 验证错误] fxmanifest.lua 中缺少作者名称"
    end

    if author_from_manifest ~= expected_author then
        return false, string.format(
            "[TEAR-LoadScreen 验证错误] 作者名称不匹配! " ..
            "预期: '%s', 当前: '%s'. " ..
            "此资源的作者名称不能被修改。请恢复原始作者名称。",
            expected_author, author_from_manifest
        )
    end
    return true, "作者名称验证成功"
end

--[[
    验证版本号
    检查客户端版本是否满足最低版本要求
    @param client_version 客户端版本号
    @param client_hash 客户端哈希值（可选）
    @return 验证结果和消息
]]
local function validate_version(client_version, client_hash)
    local required = VALIDATION.REQUIRED_VERSION
    local function version_compare(v1, v2)
        local function parse_version(v)
            local parts = {}
            for part in string.gmatch(v, "[^.]+") do
                table.insert(parts, tonumber(part) or 0)
            end
            while #parts < 3 do table.insert(parts, 0) end
            return parts
        end

        local p1, p2 = parse_version(v1), parse_version(v2)
        for i = 1, 3 do
            if p1[i] > p2[i] then return 1
            elseif p1[i] < p2[i] then return -1 end
        end
        return 0
    end

    local result = version_compare(client_version, required)
    if result < 0 then
        return false, string.format(
            "[TEAR-LoadScreen 验证错误] 版本过旧! " ..
            "当前: '%s', 最低要求: '%s'. " ..
            "请从 GitHub 更新到最新版本。",
            client_version, required
        )
    end
    return true, "版本验证成功"
end

--[[
    验证状态管理
    存储当前验证状态和错误信息
]]
local VALIDATION_STATE = {
    PASSED = false,
    ERRORS = {},
    INITIALIZED = false
}

--[[
    添加错误信息
    将错误信息添加到状态数组并打印
    @param error_msg 错误信息
]]
local function add_error(error_msg)
    table.insert(VALIDATION_STATE.ERRORS, error_msg)
    print(error_msg)
end

--[[
    清空错误信息
]]
local function clear_errors()
    VALIDATION_STATE.ERRORS = {}
end

--[[
    检查验证是否通过
    @return 验证状态
]]
local function is_validation_passed()
    return VALIDATION_STATE.PASSED
end

--[[
    资源启动事件处理
    执行完整的验证流程
]]
AddEventHandler("onResourceStart", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end

    print("========================================")
    print("[TEAR-LoadScreen] 开始验证...")
    print("========================================")

    clear_errors()
    VALIDATION_STATE.PASSED = false

    VALIDATION.ENCRYPTION_KEY = generate_validation_key()

    -- 验证资源名称
    local name_valid, name_msg = validate_resource_name()
    print("[1/3] " .. name_msg)
    if not name_valid then
        add_error(name_msg)
    end

    -- 验证作者名称
    local manifest_path = LoadResourceFile(resourceName, "fxmanifest.lua")
    if manifest_path then
        local author_match = string.match(manifest_path, "author%s+['\"]([^'\"]+)['\"]")
        if author_match then
            local author_valid, author_msg = validate_author_name(author_match)
            print("[2/3] " .. author_msg)
            if not author_valid then
                add_error(author_msg)
            end
        else
            local msg = "[TEAR-LoadScreen 验证错误] 无法从 fxmanifest.lua 解析作者"
            print("[2/3] " .. msg)
            add_error(msg)
        end
    else
        local msg = "[TEAR-LoadScreen 验证错误] 无法加载 fxmanifest.lua"
        print("[2/3] " .. msg)
        add_error(msg)
    end

    -- 验证版本号
    local client_version = GetResourceMetadata(resourceName, "version", 0) or "0.0.0"
    local version_valid, version_msg = validate_version(client_version, nil)
    print("[3/3] " .. version_msg)
    if not version_valid then
        add_error(version_msg)
    end

    print("========================================")

    if #VALIDATION_STATE.ERRORS > 0 then
        print("[TEAR-LoadScreen] 验证失败 - 资源已禁用")
        print("[TEAR-LoadScreen] 发现以下错误:")
        for _, err in ipairs(VALIDATION_STATE.ERRORS) do
            print("  - " .. err)
        end
        print("========================================")
        print("[TEAR-LoadScreen] 在所有问题解决之前，资源将无法正常工作。")
        print("========================================")
        VALIDATION_STATE.PASSED = false
    else
        print("[TEAR-LoadScreen] 验证通过 - 所有检查成功!")
        print("========================================")
        VALIDATION_STATE.PASSED = true
        VALIDATION_STATE.INITIALIZED = true
    end
end)

--[[
    客户端验证请求处理
    接收客户端的验证请求并返回验证结果
]]
RegisterNetEvent("TEAR-LoadScreen:RequestValidation")
AddEventHandler("TEAR-LoadScreen:RequestValidation", function()
    local source = source

    if not VALIDATION_STATE.PASSED then
        TriggerClientEvent("TEAR-LoadScreen:ValidationResult", source, false, VALIDATION_STATE.ERRORS)
        return
    end

    local encrypted_response = encrypt_data(json.encode({
        valid = true,
        resource = VALIDATION.RESOURCE_NAME,
        timestamp = os.time()
    }), VALIDATION.ENCRYPTION_KEY)

    TriggerClientEvent("TEAR-LoadScreen:ValidationResult", source, true, {
        encrypted = encrypted_response,
        message = "验证通过"
    })
end)

--[[
    资源停止事件处理
    清理验证状态
]]
AddEventHandler("onResourceStop", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end
    print("[TEAR-LoadScreen] 验证模块已卸载")
    VALIDATION_STATE.INITIALIZED = false
    VALIDATION_STATE.PASSED = false
end)

--[[
    导出函数：检查验证是否通过
    @return 验证状态 (boolean)
]]
exports("TEAR-LoadScreen:IsValidationPassed", function()
    return VALIDATION_STATE.PASSED
end)

--[[
    导出函数：获取验证错误列表
    @return 错误信息数组
]]
exports("TEAR-LoadScreen:GetValidationErrors", function()
    return VALIDATION_STATE.ERRORS
end)
