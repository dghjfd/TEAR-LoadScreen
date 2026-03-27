--[[
    TEAR-LoadScreen Validation Module (Client-Side)
    - Validates resource integrity
    - Communicates with server for validation
    - Blocks resource usage if validation fails
]]

local VALIDATION_CONFIG = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME = "TEAR",
    REQUIRED_VERSION = "2.1.4",
    GITHUB_API_URL = "https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen/releases/latest",
    VALIDATION_TIMEOUT = 10000,
    CHECK_INTERVAL = 3000,
    MAX_RETRIES = 3
}

local validation_state = {
    passed = false,
    errors = {},
    initialized = false,
    block_ui = false,
    retries = 0
}

local function log_error(msg)
    print("[TEAR-LoadScreen Client Validation ERROR] " .. msg)
end

local function log_info(msg)
    print("[TEAR-LoadScreen Client Validation] " .. msg)
end

local function validate_local_resource_name()
    local current_name = GetParentResourceName() or GetCurrentResourceName()
    if current_name ~= VALIDATION_CONFIG.RESOURCE_NAME then
        return false, string.format("Resource name mismatch! Expected: '%s', Got: '%s'. DO NOT RENAME THIS RESOURCE.", VALIDATION_CONFIG.RESOURCE_NAME, current_name)
    end
    return true, "Local resource name valid"
end

local function validate_author(manifest_content)
    if not manifest_content then
        return false, "Could not read fxmanifest.lua"
    end

    local author_match = string.match(manifest_content, "author%s+['\"]([^'\"]+)['\"]")
    if not author_match then
        return false, "Could not find author field in fxmanifest.lua"
    end

    if author_match ~= VALIDATION_CONFIG.AUTHOR_NAME then
        return false, string.format("Author name mismatch! Expected: '%s', Got: '%s'. DO NOT MODIFY THE AUTHOR NAME.", VALIDATION_CONFIG.AUTHOR_NAME, author_match)
    end

    return true, "Author name valid"
end

local function validate_version(version_str)
    if not version_str then
        return false, "Could not get version from fxmanifest.lua"
    end

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

    local result = compare_versions(version_str, VALIDATION_CONFIG.REQUIRED_VERSION)
    if result < 0 then
        return false, string.format("Version outdated! Current: '%s', Required minimum: '%s'. PLEASE UPDATE FROM GITHUB.", version_str, VALIDATION_CONFIG.REQUIRED_VERSION)
    end

    return true, "Version valid"
end

local function block_resource(reason)
    log_error("RESOURCE BLOCKED: " .. reason)
    log_error("========================================")
    log_error("THIS RESOURCE IS NOW DISABLED")
    log_error("Reason: " .. reason)
    log_error("Please restore the original configuration")
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

local function show_validation_error(errors)
    if not errors or #errors == 0 then return end

    local error_text = "TEAR-LoadScreen Validation Failed:\n"
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

RegisterNetEvent("TEAR-LoadScreen:ValidationResult")
AddEventHandler("TEAR-LoadScreen:ValidationResult", function(passed, data)
    if passed then
        log_info("Server validation passed")
        validation_state.passed = true
    else
        log_error("Server validation failed")
        if data and data.errors then
            for _, err in ipairs(data.errors) do
                log_error(err)
            end
            show_validation_error(data.errors)
        end
        validation_state.passed = false
    end
end)

AddEventHandler("onResourceDataLoaded", function(resName)
    if resName ~= GetCurrentResourceName() then return end
    log_info("Resource data loaded, validation starting...")
end)

AddEventHandler("onResourceStart", function(resName)
    if resName ~= GetCurrentResourceName() then return end

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

    log_info("[4/4] Requesting server validation...")
    TriggerServerEvent("TEAR-LoadScreen:RequestValidation")

    Wait(VALIDATION_CONFIG.VALIDATION_TIMEOUT)

    if not validation_state.passed then
        validation_state.retries = validation_state.retries + 1
        if validation_state.retries < VALIDATION_CONFIG.MAX_RETRIES then
            log_info("Retrying server validation... (attempt " .. validation_state.retries .. "/" .. VALIDATION_CONFIG.MAX_RETRIES .. ")")
            TriggerServerEvent("TEAR-LoadScreen:RequestValidation")
        else
            log_error("Server validation timeout after " .. VALIDATION_CONFIG.MAX_RETRIES .. " attempts")
            validation_state.errors[#validation_state.errors + 1] = "Server validation timeout"
        end
    end

    log_info("========================================")

    if #validation_state.errors > 0 then
        log_error("VALIDATION FAILED - Resource blocked!")
        for _, err in ipairs(validation_state.errors) do
            log_error("  - " .. err)
        end
        log_error("========================================")
        show_validation_error(validation_state.errors)
        validation_state.block_ui = true
    else
        log_info("All client validations passed")
        validation_state.initialized = true
    end
end)

AddEventHandler("onResourceStop", function(resName)
    if resName ~= GetCurrentResourceName() then return end
    log_info("Validation module unloaded")
    validation_state.initialized = false
    validation_state.block_ui = false
end)

exports("TEAR-LoadScreen:IsValidationPassed", function()
    return validation_state.passed
end)

exports("TEAR-LoadScreen:IsResourceBlocked", function()
    return validation_state.block_ui
end)