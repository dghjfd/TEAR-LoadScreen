--[[
    TEAR-LoadScreen validation module (client)
    Handles client-side resource validation
]]

local VALIDATION_CONFIG = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME    = "TEARLESSVVOID",   -- Must match fxmanifest.lua
    REQUIRED_VERSION = "2.2.8",         -- Must match sv_validation.lua / fxmanifest.lua
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
    print("[TEAR-LoadScreen Lua Validation] " .. msg)
end

local function log_error(msg)
    print("[TEAR-LoadScreen Lua Validation Error] " .. msg)
end

local function validate_local_resource_name()
    local current_name = GetParentResourceName() or GetCurrentResourceName()
    local marker = GetResourcePath(VALIDATION_CONFIG.RESOURCE_NAME)

    if current_name == VALIDATION_CONFIG.RESOURCE_NAME then
        return true, "Resource name validation passed"
    else
        return false, "Resource name mismatch: " .. current_name
    end
end

local function validate_author(manifest_content)
    if not manifest_content then
        return false, "Failed to load fxmanifest.lua"
    end

    local author_match = string.match(manifest_content, "author%s+['\"]([^'\"]+)['\"]")
    if author_match then
        if author_match == VALIDATION_CONFIG.AUTHOR_NAME then
            return true, "Author validation passed"
        else
            return false, "Author mismatch: " .. author_match
        end
    end
    return false, "Failed to parse author name"
end

local function validate_version(version)
    if not version then
        return false, "Failed to get version info"
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
        return false, "Version too old: " .. version .. " (minimum required: " .. required .. ")"
    end
    return true, "Version validation passed"
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
        log_info("Server-side validation passed")
        validation_state.passed = true
        hide_validation_error()

        if data and data.suspicious and #data.suspicious > 0 then
            log_error("========================================")
            log_error("Potentially modified files detected:")
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
        log_error("Server-side validation failed")
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
    log_info("Resource data loaded, starting validation...")
end)

AddEventHandler("onResourceStart", function(resName)
    if resName ~= GetCurrentResourceName() then return end

    -- Run in a coroutine to avoid blocking the main thread
    CreateThread(function()
        log_info("========================================")
        log_info("Starting client-side validation...")
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

        log_info("[4/4] Requesting server-side validation...")
        TriggerServerEvent("TEAR-LoadScreen:RequestValidation")

        -- Safe wait inside coroutine without blocking main thread
        Wait(VALIDATION_CONFIG.VALIDATION_TIMEOUT)

        if not validation_state.server_validated and not validation_state.passed then
            validation_state.retries = validation_state.retries + 1
            if validation_state.retries < VALIDATION_CONFIG.MAX_RETRIES then
                log_info("Retrying server-side validation... (attempt " .. validation_state.retries .. "/" .. VALIDATION_CONFIG.MAX_RETRIES .. ")")
                TriggerServerEvent("TEAR-LoadScreen:RequestValidation")
            else
                log_error("Server-side validation timed out after max retries: " .. VALIDATION_CONFIG.MAX_RETRIES)
                validation_state.errors[#validation_state.errors + 1] = "Server-side validation timeout"
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
