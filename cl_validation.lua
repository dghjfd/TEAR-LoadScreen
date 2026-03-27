--[[
    TEAR-LoadScreen 验证模块 (客户端)
    - 验证资源完整性
    - 与服务端通信进行验证
    - 验证失败时阻止资源使用
]]

local VALIDATION_CONFIG = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME = "TEAR",
    REQUIRED_VERSION = "2.1.5",
    GITHUB_API_URL = "https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen/releases/latest",
    VALIDATION_TIMEOUT = 10000,
    CHECK_INTERVAL = 3000,
    MAX_RETRIES = 3
}

--[[
    验证状态管理
]]
local validation_state = {
    passed = false,
    errors = {},
    initialized = false,
    block_ui = false,
    retries = 0
}

--[[
    记录错误日志
    @param msg 错误信息
]]
local function log_error(msg)
    print("[TEAR-LoadScreen 客户端验证错误] " .. msg)
end

--[[
    记录信息日志
    @param msg 信息内容
]]
local function log_info(msg)
    print("[TEAR-LoadScreen 客户端验证] " .. msg)
end

--[[
    验证本地资源名称
    检查当前资源名称是否正确
    @return 验证结果和消息
]]
local function validate_local_resource_name()
    local current_name = GetParentResourceName() or GetCurrentResourceName()
    if current_name ~= VALIDATION_CONFIG.RESOURCE_NAME then
        return false, string.format("资源名称不匹配! 预期: '%s', 当前: '%s'. 请勿重命名此资源。", VALIDATION_CONFIG.RESOURCE_NAME, current_name)
    end
    return true, "本地资源名称验证通过"
end

--[[
    验证作者名称
    从 fxmanifest.lua 内容中检查作者名称
    @param manifest_content fxmanifest.lua 文件内容
    @return 验证结果和消息
]]
local function validate_author(manifest_content)
    if not manifest_content then
        return false, "无法读取 fxmanifest.lua"
    end

    local author_match = string.match(manifest_content, "author%s+['\"]([^'\"]+)['\"]")
    if not author_match then
        return false, "无法在 fxmanifest.lua 中找到作者字段"
    end

    if author_match ~= VALIDATION_CONFIG.AUTHOR_NAME then
        return false, string.format("作者名称不匹配! 预期: '%s', 当前: '%s'. 请勿修改作者名称。", VALIDATION_CONFIG.AUTHOR_NAME, author_match)
    end

    return true, "作者名称验证通过"
end

--[[
    验证版本号
    检查当前版本是否满足最低要求
    @param version_str 版本号字符串
    @return 验证结果和消息
]]
local function validate_version(version_str)
    if not version_str then
        return false, "无法从 fxmanifest.lua 获取版本号"
    end

    --[[
        解析版本号字符串
        @param v 版本号字符串 (如 "1.2.3")
        @return 版本号部分数组
    ]]
    local function parse_version(v)
        local parts = {}
        for part in string.gmatch(v, "[^.]+") do
            table.insert(parts, tonumber(part) or 0)
        end
        while #parts < 3 do table.insert(parts, 0) end
        return parts
    end

    --[[
        比较两个版本号
        @param v1 版本号1
        @param v2 版本号2
        @return 1 (v1>v2), -1 (v1<v2), 0 (相等)
    ]]
    local function compare_versions(v1, v2)
        local p1, p2 = parse_version(v1), parse_version(v2)
        for i = 1, 3 do
            if p1[i] > p2[i] then return 1
            elseif p1[i] < p2[i] then return -1 end
        end
        return 0
    end

    local result = compare_versions(version_str, VALIDATION_CONFIG.REQUIRED_VERSION)
    if result < 0 then
        return false, string.format("版本过旧! 当前: '%s', 最低要求: '%s'. 请从 GitHub 更新。", version_str, VALIDATION_CONFIG.REQUIRED_VERSION)
    end

    return true, "版本验证通过"
end

--[[
    阻止资源使用
    禁用所有控件并显示错误信息
    @param reason 阻止原因
]]
local function block_resource(reason)
    log_error("资源已被阻止: " .. reason)
    log_error("========================================")
    log_error("此资源现已禁用")
    log_error("原因: " .. reason)
    log_error("请恢复原始配置")
    log_error("========================================")

    validation_state.block_ui = true

    CreateThread(function()
        while true do
            Wait(0)
            SetMusicVolume(0)
            DisableAllControlActions(0)
        end
    end)

    AddTextEntry("TEAR_VALIDATION_ERROR", reason)
    BeginTextCommandDisplayError("TEAR_VALIDATION_ERROR")
    EndTextCommandDisplayError(0)
end

--[[
    显示验证错误
    在屏幕上显示错误信息
    @param errors 错误信息数组
]]
local function show_validation_error(errors)
    if not errors or #errors == 0 then return end

    local error_text = "TEAR-LoadScreen 验证失败:\n"
    for i, err in ipairs(errors) do
        error_text = error_text .. "\n" .. i .. ". " .. err
    end

    log_error(error_text)

    validation_state.block_ui = true

    CreateThread(function()
        Wait(100)
        AddTextEntry("TEAR_VALIDATION_ERRORS", error_text)
        BeginTextCommandDisplayHelp("TEAR_VALIDATION_ERRORS")
        EndTextCommandDisplayHelp(0, 0, true, -1)
    end)
end

--[[
    服务端验证结果事件处理
    接收服务端的验证结果
]]
RegisterNetEvent("TEAR-LoadScreen:ValidationResult")
AddEventHandler("TEAR-LoadScreen:ValidationResult", function(passed, data)
    if passed then
        log_info("服务端验证通过")
        validation_state.passed = true
        -- 显示疑似修改信息（如果有）
        if data and data.suspicious and #data.suspicious > 0 then
            log_error("========================================")
            log_error("检测到疑似修改的文件:")
            for _, info in ipairs(data.suspicious) do
                log_error("  - " .. info)
            end
            log_error("========================================")
        end
    else
        log_error("服务端验证失败")
        if data and data.errors then
            for _, err in ipairs(data.errors) do
                log_error(err)
            end
            show_validation_error(data.errors)
        end
        -- 显示疑似修改信息（如果有）
        if data and data.suspicious and #data.suspicious > 0 then
            log_error("疑似修改的文件:")
            for _, info in ipairs(data.suspicious) do
                log_error("  - " .. info)
            end
        end
        validation_state.passed = false
    end
end)

--[[
    资源数据加载事件处理
]]
AddEventHandler("onResourceDataLoaded", function(resName)
    if resName ~= GetCurrentResourceName() then return end
    log_info("资源数据已加载，开始验证...")
end)

--[[
    资源启动事件处理
    执行完整的客户端验证流程
]]
AddEventHandler("onResourceStart", function(resName)
    if resName ~= GetCurrentResourceName() then return end

    log_info("========================================")
    log_info("开始客户端验证...")
    log_info("========================================")

    -- 验证资源名称
    local name_valid, name_msg = validate_local_resource_name()
    log_info("[1/4] " .. name_msg)
    if not name_valid then
        validation_state.errors[#validation_state.errors + 1] = name_msg
    end

    -- 验证作者名称
    local manifest_content = LoadResourceFile(GetCurrentResourceName(), "fxmanifest.lua")
    local author_valid, author_msg = validate_author(manifest_content)
    log_info("[2/4] " .. author_msg)
    if not author_valid then
        validation_state.errors[#validation_state.errors + 1] = author_msg
    end

    -- 验证版本号
    local version = GetResourceMetadata(GetCurrentResourceName(), "version", 0)
    local version_valid, version_msg = validate_version(version)
    log_info("[3/4] " .. version_msg)
    if not version_valid then
        validation_state.errors[#validation_state.errors + 1] = version_msg
    end

    -- 请求服务端验证
    log_info("[4/4] 正在请求服务端验证...")
    TriggerServerEvent("TEAR-LoadScreen:RequestValidation")

    Wait(VALIDATION_CONFIG.VALIDATION_TIMEOUT)

    -- 重试机制
    if not validation_state.passed then
        validation_state.retries = validation_state.retries + 1
        if validation_state.retries < VALIDATION_CONFIG.MAX_RETRIES then
            log_info("正在重试服务端验证... (尝试 " .. validation_state.retries .. "/" .. VALIDATION_CONFIG.MAX_RETRIES .. ")")
            TriggerServerEvent("TEAR-LoadScreen:RequestValidation")
        else
            log_error("服务端验证超时，已达到最大重试次数 " .. VALIDATION_CONFIG.MAX_RETRIES)
            validation_state.errors[#validation_state.errors + 1] = "服务端验证超时"
        end
    end

    log_info("========================================")

    -- 检查验证结果
    if #validation_state.errors > 0 then
        log_error("验证失败 - 资源已被阻止!")
        for _, err in ipairs(validation_state.errors) do
            log_error("  - " .. err)
        end
        log_error("========================================")
        show_validation_error(validation_state.errors)
        validation_state.block_ui = true
    else
        log_info("所有客户端验证通过")
        validation_state.initialized = true
    end
end)

--[[
    资源停止事件处理
    清理验证状态
]]
AddEventHandler("onResourceStop", function(resName)
    if resName ~= GetCurrentResourceName() then return end
    log_info("验证模块已卸载")
    validation_state.initialized = false
    validation_state.block_ui = false
end)

--[[
    导出函数：检查验证是否通过
    @return 验证状态 (boolean)
]]
exports("TEAR-LoadScreen:IsValidationPassed", function()
    return validation_state.passed
end)

--[[
    导出函数：检查资源是否被阻止
    @return 阻止状态 (boolean)
]]
exports("TEAR-LoadScreen:IsResourceBlocked", function()
    return validation_state.block_ui
end)
