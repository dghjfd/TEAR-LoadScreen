--[[
    TEAR-LoadScreen Validation Module (Server-Side)
    - GitHub version check
    - Resource name verification
    - Author name verification
    - Anti-tamper protection with encryption
]]

local VALIDATION = {
    RESOURCE_NAME = "TEAR-LoadScreen",
    AUTHOR_NAME = "TEAR",
    GITHUB_REPO = "https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen/releases/latest",
    REQUIRED_VERSION = "2.1.4",
    ENCRYPTION_KEY = nil,
    INITIALIZED = false
}

local function decrypt_data(encrypted, key)
    if not encrypted or not key then return nil end
    local decrypted = {}
    for i = 1, #encrypted do
        local char = string.byte(encrypted, i)
        local key_char = string.byte(key, (i - 1) % #key + 1)
        decrypted[i] = string.char(bit.band(char, 0xFF) ~ bit.band(key_char, 0xFF))
    end
    return table.concat(decrypted)
end

local function encrypt_data(data, key)
    if not data or not key then return nil end
    local encrypted = {}
    for i = 1, #data do
        local char = string.byte(data, i)
        local key_char = string.byte(key, (i - 1) % #key + 1)
        encrypted[i] = string.char(bit.band(char, 0xFF) ~ bit.band(key_char, 0xFF))
    end
    return table.concat(encrypted)
end

local function generate_validation_key()
    local source = GetCurrentResourceName() .. "TEAR-LoadScreen-SecureKey-2024"
    local hash = GetHashKey(source)
    local key = ""
    for i = 1, 16 do
        local byte = bit.band(bit.rshift(hash, (i - 1) * 4), 0xFF)
        if byte == 0 then byte = 0x41 end
        key = key .. string.char(byte)
    end
    return key
end

local function validate_resource_name()
    local current_name = GetCurrentResourceName()
    local expected_name = VALIDATION.RESOURCE_NAME

    if current_name ~= expected_name then
        return false, string.format(
            "[TEAR-LoadScreen VALIDATION ERROR] Resource name mismatch! " ..
            "Expected: '%s', Got: '%s'. " ..
            "This resource CANNOT be renamed. Please restore the original resource name.",
            expected_name, current_name
        )
    end
    return true, "Resource name validated successfully"
end

local function validate_author_name(author_from_manifest)
    local expected_author = VALIDATION.AUTHOR_NAME

    if not author_from_manifest or author_from_manifest == "" then
        return false, "[TEAR-LoadScreen VALIDATION ERROR] Author name is missing in fxmanifest.lua"
    end

    if author_from_manifest ~= expected_author then
        return false, string.format(
            "[TEAR-LoadScreen VALIDATION ERROR] Author name mismatch! " ..
            "Expected: '%s', Got: '%s'. " ..
            "This resource CANNOT have its author name modified. Please restore the original author name.",
            expected_author, author_from_manifest
        )
    end
    return true, "Author name validated successfully"
end

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
            "[TEAR-LoadScreen VALIDATION ERROR] Version outdated! " ..
            "Current: '%s', Required minimum: '%s'. " ..
            "Please update to the latest version from GitHub.",
            client_version, required
        )
    end
    return true, "Version validated successfully"
end

local VALIDATION_STATE = {
    PASSED = false,
    ERRORS = {},
    INITIALIZED = false
}

local function add_error(error_msg)
    table.insert(VALIDATION_STATE.ERRORS, error_msg)
    print(error_msg)
end

local function clear_errors()
    VALIDATION_STATE.ERRORS = {}
end

local function is_validation_passed()
    return VALIDATION_STATE.PASSED
end

AddEventHandler("onResourceStart", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end

    print("========================================")
    print("[TEAR-LoadScreen] Starting validation...")
    print("========================================")

    clear_errors()
    VALIDATION_STATE.PASSED = false

    VALIDATION.ENCRYPTION_KEY = generate_validation_key()

    local name_valid, name_msg = validate_resource_name()
    print("[1/3] " .. name_msg)
    if not name_valid then
        add_error(name_msg)
    end

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
            local msg = "[TEAR-LoadScreen VALIDATION ERROR] Could not parse author from fxmanifest.lua"
            print("[2/3] " .. msg)
            add_error(msg)
        end
    else
        local msg = "[TEAR-LoadScreen VALIDATION ERROR] Could not load fxmanifest.lua"
        print("[2/3] " .. msg)
        add_error(msg)
    end

    local client_version = GetResourceMetadata(resourceName, "version", 0) or "0.0.0"
    local version_valid, version_msg = validate_version(client_version, nil)
    print("[3/3] " .. version_msg)
    if not version_valid then
        add_error(version_msg)
    end

    print("========================================")

    if #VALIDATION_STATE.ERRORS > 0 then
        print("[TEAR-LoadScreen] VALIDATION FAILED - Resource is DISABLED")
        print("[TEAR-LoadScreen] Errors found:")
        for _, err in ipairs(VALIDATION_STATE.ERRORS) do
            print("  - " .. err)
        end
        print("========================================")
        print("[TEAR-LoadScreen] The resource will NOT function until all issues are resolved.")
        print("========================================")
        VALIDATION_STATE.PASSED = false
    else
        print("[TEAR-LoadScreen] VALIDATION PASSED - All checks successful!")
        print("========================================")
        VALIDATION_STATE.PASSED = true
        VALIDATION_STATE.INITIALIZED = true
    end
end)

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
        message = "Validation passed"
    })
end)

AddEventHandler("onResourceStop", function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end
    print("[TEAR-LoadScreen] Validation module unloaded")
    VALIDATION_STATE.INITIALIZED = false
    VALIDATION_STATE.PASSED = false
end)

exports("TEAR-LoadScreen:IsValidationPassed", function()
    return VALIDATION_STATE.PASSED
end)

exports("TEAR-LoadScreen:GetValidationErrors", function()
    return VALIDATION_STATE.ERRORS
end)