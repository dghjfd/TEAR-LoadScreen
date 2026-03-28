--[[
    TEAR-LoadScreen 验证模块 (客户端)
    负责客户端资源验证
]]

local VALIDATION_CONFIG = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME    = "TEARLESSVVOID",   -- 与 fxmanifest.lua 保持一致
    REQUIRED_VERSION = "2.2.3",         -- 与 sv_validation.lua / fxmanifest.lua 保持一致
    VALIDATION_TIMEOUT = 10000,
    MAX_RETRIES = 3
}

local validation_state = {
    passed = false,
    errors = {},
    retries = 0,
    block_ui = false,
    validation_complete = false,
    server_validated = false
}

local function log_info(msg)
    print("[TEAR-LoadScreen Lua 验证] " .. msg)
end

local function log_error(msg)
    print("[TEAR-LoadScreen Lua 验证错误] " .. msg)
end

local function validate_local_resource_name()
    local current_name = GetParentResourceName() or GetCurrentResourceName()
    local marker = GetResourcePath(VALIDATION_CONFIG.RESOURCE_NAME)

    if current_name == VALIDATION_CONFIG.RESOURCE_NAME then
        return true, "资源名称验证成功"
    else
        return false, "资源名称不匹配: " .. current_name
    end
end

local function validate_author(manifest_content)
    if not manifest_content then
        return false, "无法加载 fxmanifest.lua"
    end

    local author_match = string.match(manifest_content, "author%s+['\"]([^'\"]+)['\"]")
    if author_match then
        if author_match == VALIDATION_CONFIG.AUTHOR_NAME then
            return true, "作者名称验证成功"
        else
            return false, "作者名称不匹配: " .. author_match
        end
    end
    return false, "无法解析作者名称"
end

local function validate_version(version)
    if not version then
        return false, "无法获取版本信息"
    end

    local required = VALIDATION_CONFIG.REQUIRED_VERSION
    local function parse_version(v)
        local parts = {}
        for part in string.gmatch(v, "[^.]+") do
            table.insert(parts, tonumber(part) or 0)
        end
        while #parts < 3 do table.insert(parts, 0) end
        return parts
    end

    local function compare_versions(v1, v2)
        local p1, p2 = parse_version(v1), parse_version(v2)
        for i = 1, 3 do
            if p1[i] > p2[i] then return 1
            elseif p1[i] < p2[i] then return -1 end
        end
        return 0
    end

    local result = compare_versions(version, required)
    if result < 0 then
        return false, "版本过旧: " .. version .. " (最低要求: " .. required .. ")"
    end
    return true, "版本验证成功"
end

local function show_validation_error(errors)
    if not errors or #errors == 0 then return end

    validation_state.block_ui = true

    local error_text = "TEAR-LoadScreen VALIDATION FAILED\n"
    error_text = error_text .. "THIS RESOURCE IS PROTECTED\n\n"

    for i, err in ipairs(errors) do
        error_text = error_text .. err .. "\n"
    end

    error_text = error_text .. "\nPlease restore the original configuration"
    error_text = error_text .. "\nResource: " .. VALIDATION_CONFIG.RESOURCE_NAME

    log_error(error_text)

    SendNUIMessage({
        event = "TEAR_VALIDATION_BLOCK",
        errors = errors,
        resource = VALIDATION_CONFIG.RESOURCE_NAME,
        show = true
    })

    CreateThread(function()
        Wait(100)
        AddTextEntry("TEAR_VALIDATION_ERRORS", error_text)
        BeginTextCommandDisplayHelp("TEAR_VALIDATION_ERRORS")
        EndTextCommandDisplayHelp(0, 0, false, 0, false, false)
    end)
end

local function hide_validation_error()
    validation_state.block_ui = false
    SendNUIMessage({
        event = "TEAR_VALIDATION_BLOCK",
        show = false
    })
end

local function draw_validation_overlay()
    while validation_state.block_ui do
        Wait(0)

        SetTextFont(4)
        SetTextScale(0.6, 0.6)
        SetTextColour(255, 50, 50, 255)
        SetTextCentre(true)
        SetTextOutline()

        BeginTextCommandDisplayText("STRING")
        AddTextComponentString("TEAR-LoadScreen VALIDATION FAILED")
        EndTextCommandDisplayText(0.5, 0.35, true)

        SetTextFont(3)
        SetTextScale(0.5, 0.5)
        SetTextColour(255, 255, 255, 255)

        BeginTextCommandDisplayText("STRING")
        AddTextComponentString("THIS RESOURCE IS PROTECTED")
        EndTextCommandDisplayText(0.5, 0.42, true)

        SetTextFont(2)
        SetTextScale(0.4, 0.4)
        SetTextColour(255, 200, 200, 255)

        local y_offset = 0.50
        for i, err in ipairs(validation_state.errors) do
            BeginTextCommandDisplayText("STRING")
            AddTextComponentString(err)
            EndTextCommandDisplayText(0.5, y_offset, true)
            y_offset = y_offset + 0.03
        end

        SetTextColour(200, 200, 200, 255)
        BeginTextCommandDisplayText("STRING")
        AddTextComponentString("Please restore the original configuration")
        EndTextCommandDisplayText(0.5, y_offset + 0.03, true)

        BeginTextCommandDisplayText("STRING")
        AddTextComponentString("Resource: " .. VALIDATION_CONFIG.RESOURCE_NAME)
        EndTextCommandDisplayText(0.5, y_offset + 0.06, true)

        DrawRect(0.5, 0.5, 0.8, 0.6, 0, 0, 0, 200)
    end
end

RegisterNetEvent("TEAR-LoadScreen:ValidationResult")
AddEventHandler("TEAR-LoadScreen:ValidationResult", function(passed, data)
    validation_state.server_validated = true

    if passed then
        log_info("服务端验证通过")
        validation_state.passed = true
        hide_validation_error()

        if data and data.suspicious and #data.suspicious > 0 then
            log_error("========================================")
            log_error("检测到疑似修改的文件:")
            for _, info in ipairs(data.suspicious) do
                log_error("  - " .. info)
            end
            log_error("========================================")

            SendNUIMessage({
                event = "TEAR_VALIDATION_SUSPICIOUS",
                suspicious = data.suspicious
            })
        end
    else
        log_error("服务端验证失败")
        if data and data.errors then
            for _, err in ipairs(data.errors) do
                log_error(err)
            end
        end
        validation_state.errors = data and data.errors or validation_state.errors
        validation_state.passed = false
        show_validation_error(validation_state.errors)

        CreateThread(draw_validation_overlay)
    end
end)

AddEventHandler("onResourceDataLoaded", function(resName)
    if resName ~= GetCurrentResourceName() then return end
    log_info("资源数据已加载，开始验证...")
end)

AddEventHandler("onResourceStart", function(resName)
    if resName ~= GetCurrentResourceName() then return end

    -- 在协程中运行，避免阻塞主线程
    CreateThread(function()
        log_info("========================================")
        log_info("开始客户端验证...")
        log_info("========================================")

        local name_valid, name_msg = validate_local_resource_name()
        log_info("[1/4] " .. name_msg)
        if not name_valid then
            validation_state.errors[#validation_state.errors + 1] = name_msg
        end

        local manifest_content = LoadResourceFile(GetCurrentResourceName(), "fxmanifest.lua")
        local author_valid, author_msg = validate_author(manifest_content)
        log_info("[2/4] " .. author_msg)
        if not author_valid then
            validation_state.errors[#validation_state.errors + 1] = author_msg
        end

        local version = GetResourceMetadata(GetCurrentResourceName(), "version", 0)
        local version_valid, version_msg = validate_version(version)
        log_info("[3/4] " .. version_msg)
        if not version_valid then
            validation_state.errors[#validation_state.errors + 1] = version_msg
        end

        log_info("[4/4] 正在请求服务端验证...")
        TriggerServerEvent("TEAR-LoadScreen:RequestValidation")

        -- 在协程内安全等待，不阻塞主线程
        Wait(VALIDATION_CONFIG.VALIDATION_TIMEOUT)

        if not validation_state.server_validated and not validation_state.passed then
            validation_state.retries = validation_state.retries + 1
            if validation_state.retries < VALIDATION_CONFIG.MAX_RETRIES then
                log_info("正在重试服务端验证... (尝试 " .. validation_state.retries .. "/" .. VALIDATION_CONFIG.MAX_RETRIES .. ")")
                TriggerServerEvent("TEAR-LoadScreen:RequestValidation")
            else
                log_error("服务端验证超时，已达到最大重试次数 " .. VALIDATION_CONFIG.MAX_RETRIES)
                validation_state.errors[#validation_state.errors + 1] = "服务端验证超时"
            end
        end

        if not validation_state.passed and #validation_state.errors > 0 then
            log_info("========================================")
            show_validation_error(validation_state.errors)
            CreateThread(draw_validation_overlay)
        end

        log_info("========================================")
        validation_state.validation_complete = true
    end)
end)
