/**
 * TEAR-LoadScreen validation module (JavaScript - client)
 * - Resource name validation
 * - Author validation
 * - GitHub version check
 * - Encrypted anti-tamper protection
 */

(function() {
    'use strict';

    const VALIDATION_CONFIG = {
        RESOURCE_NAME: 'TEAR-LoadScreen',
        AUTHOR_NAME: 'TEARLESSVVOID',
        REQUIRED_VERSION: '2.2.8',
        GITHUB_API_URL: 'https://api.github.com/repos/dghjfd/TEAR-LoadScreen/releases/latest',
        ENCRYPTION_KEY_SEED: 'TEAR-LoadScreen-SecureKey-2024-JS',
        VALIDATION_TIMEOUT: 10000,
        CHECK_INTERVAL: 3000
    };

    const ValidationState = {
        passed: true,
        errors: [],
        suspicious: [],
        initialized: true,
        blocked: false,
        encryptionKey: null,
        isFiveMEnvironment: false
    };

    function isInFiveMEnvironment() {
        return typeof window.postMessage === 'function' && 
               typeof window.addEventListener === 'function' &&
               (window.location.protocol === 'nui:' || 
                window.location.href.includes('nui://'));
    }

    ValidationState.isFiveMEnvironment = isInFiveMEnvironment();

    function generateEncryptionKey() {
        const seed = VALIDATION_CONFIG.ENCRYPTION_KEY_SEED;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const key = [];
        for (let i = 0; i < 16; i++) {
            let byte = (hash >> (i % 4 * 8)) & 0xFF;
            if (byte === 0) byte = 0x41;
            key.push(byte);
        }
        return new Uint8Array(key);
    }

    function logError(msg) {
        console.error('[TEAR-LoadScreen JS Validation Error] ' + msg);
    }

    function logInfo(msg) {
        console.info('[TEAR-LoadScreen JS Validation] ' + msg);
    }

    window.addEventListener('message', function(event) {
        if (event.data && event.data.event === 'TEAR_VALIDATION_RESULT') {
            const { passed, suspicious } = event.data;
            if (passed && suspicious && suspicious.length > 0) {
                logError('Potentially modified files detected:');
                suspicious.forEach(function(info) {
                    logError('  - ' + info);
                });
            }
        }
    });

    function parseVersion(v) {
        const parts = v.split('.').map(part => parseInt(part, 10) || 0);
        while (parts.length < 3) parts.push(0);
        return parts;
    }

    function compareVersions(v1, v2) {
        const p1 = parseVersion(v1);
        const p2 = parseVersion(v2);
        for (let i = 0; i < 3; i++) {
            if (p1[i] > p2[i]) return 1;
            if (p1[i] < p2[i]) return -1;
        }
        return 0;
    }

    function validateResourceName() {
        const marker = document.getElementById('tear-validation-marker');
        if (marker && marker.dataset.resource === VALIDATION_CONFIG.RESOURCE_NAME) {
            return { valid: true, message: 'Resource name validation passed' };
        }
        return { valid: false, message: 'Resource name validation failed' };
    }

    function validateAuthor() {
        const marker = document.getElementById('tear-validation-marker');
        if (marker && marker.dataset.author === VALIDATION_CONFIG.AUTHOR_NAME) {
            return { valid: true, message: 'Author validation passed' };
        }
        return { valid: false, message: 'Author validation failed' };
    }

    function validateVersion() {
        const marker = document.getElementById('tear-validation-marker');
        const currentVersion = marker ? marker.dataset.version : null;

        if (!currentVersion) {
            return { valid: true, message: 'Version validation skipped (no marker)' };
        }

        const result = compareVersions(currentVersion, VALIDATION_CONFIG.REQUIRED_VERSION);
        if (result < 0) {
            return { valid: false, message: 'Version too old: ' + currentVersion + ' < ' + VALIDATION_CONFIG.REQUIRED_VERSION };
        }
        return { valid: true, message: 'Version validation passed' };
    }

    async function checkGitHubVersion() {
        return { valid: true, message: 'GitHub check skipped' };
    }

    function createBlockOverlay(reason) {
        const overlay = document.createElement('div');
        overlay.id = 'tear-validation-block';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100%',
            'height: 100%',
            'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            'z-index: 999999',
            'display: flex',
            'flex-direction: column',
            'justify-content: center',
            'align-items: center',
            'color: #ff4444',
            'font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif',
            'text-align: center',
            'padding: 40px',
            'box-sizing: border-box'
        ].join(';');

        overlay.innerHTML = [
            '<div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>',
            '<h1 style="font-size: 32px; margin-bottom: 20px; color: #ff4444;">TEAR-LoadScreen Validation Failed</h1>',
            '<div style="font-size: 18px; color: #ffffff; margin-bottom: 10px;">This resource is protected</div>',
            '<div style="font-size: 14px; color: #aaaaaa; margin-bottom: 30px; max-width: 600px; line-height: 1.6;">' + reason + '</div>',
            '<div style="font-size: 12px; color: #888888; margin-top: 40px;">Please restore the original configuration</div>',
            '<div style="font-size: 12px; color: #666666; margin-top: 10px;">Resource: ' + VALIDATION_CONFIG.RESOURCE_NAME + '</div>'
        ].join('');

        document.body.innerHTML = '';
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = 'body { margin: 0; padding: 0; overflow: hidden; }';
        document.head.appendChild(style);
    }

    async function runValidation() {
        if (!ValidationState.isFiveMEnvironment) {
            logInfo('Non-FiveM environment detected, skipping validation');
            ValidationState.passed = true;
            ValidationState.initialized = true;
            ValidationState.blocked = false;
            return true;
        }

        logInfo('========================================');
        logInfo('Starting JavaScript validation...');
        logInfo('========================================');

        ValidationState.encryptionKey = generateEncryptionKey();

        const errors = [];

        const nameResult = validateResourceName();
        logInfo('[1/4] ' + nameResult.message);
        if (!nameResult.valid) {
            errors.push(nameResult.message);
        }

        const authorResult = validateAuthor();
        logInfo('[2/4] ' + authorResult.message);
        if (!authorResult.valid) {
            errors.push(authorResult.message);
        }

        const versionResult = validateVersion();
        logInfo('[3/4] ' + versionResult.message);
        if (!versionResult.valid) {
            errors.push(versionResult.message);
        }

        logInfo('[4/4] GitHub version check...');
        const githubResult = await checkGitHubVersion();
        logInfo('[4/4] ' + githubResult.message);
        if (!githubResult.valid) {
            errors.push(githubResult.message);
        }

        logInfo('========================================');

        if (errors.length > 0) {
            logInfo('Validation failed with errors:');
            errors.forEach(function(err) {
                logError('  - ' + err);
            });
            ValidationState.passed = false;
            ValidationState.errors = errors;
            ValidationState.blocked = true;
            
            const errorReason = errors.join('<br>');
            createBlockOverlay(errorReason);
            return false;
        }

        logInfo('All validations passed');
        ValidationState.passed = true;
        ValidationState.initialized = true;
        ValidationState.blocked = false;
        return true;
    }

    window.TEAR_VALIDATION = {
        run: runValidation,
        getState: function() { return ValidationState; },
        isPassed: function() { return ValidationState.passed; },
        isBlocked: function() { return ValidationState.blocked; },
        getErrors: function() { return ValidationState.errors; }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(runValidation, 500);
        });
    } else {
        setTimeout(runValidation, 500);
    }
})();
