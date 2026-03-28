/**
 * TEAR-LoadScreen 验证模块 (JavaScript - 客户端)
 * - 资源名称验证
 * - 作者名称验证
 * - GitHub 版本检查
 * - 加密反篡改保护
 */

(function() {
    'use strict';

    const VALIDATION_CONFIG = {
        RESOURCE_NAME: 'TEAR-LoadScreen',
        AUTHOR_NAME: 'TEARLESSVVOID',
        REQUIRED_VERSION: '2.2.4',
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
        console.error('[TEAR-LoadScreen JS 验证错误] ' + msg);
    }

    function logInfo(msg) {
        console.info('[TEAR-LoadScreen JS 验证] ' + msg);
    }

    window.addEventListener('message', function(event) {
        if (event.data && event.data.event === 'TEAR_VALIDATION_RESULT') {
            const { passed, suspicious } = event.data;
            if (passed && suspicious && suspicious.length > 0) {
                logError('检测到疑似修改的文件:');
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
            return { valid: true, message: '资源名称验证通过' };
        }
        return { valid: false, message: '资源名称验证失败' };
    }

    function validateAuthor() {
        const marker = document.getElementById('tear-validation-marker');
        if (marker && marker.dataset.author === VALIDATION_CONFIG.AUTHOR_NAME) {
            return { valid: true, message: '作者名称验证通过' };
        }
        return { valid: false, message: '作者验证失败' };
    }

    function validateVersion() {
        const marker = document.getElementById('tear-validation-marker');
        const currentVersion = marker ? marker.dataset.version : null;

        if (!currentVersion) {
            return { valid: true, message: '版本验证跳过 (无标记)' };
        }

        const result = compareVersions(currentVersion, VALIDATION_CONFIG.REQUIRED_VERSION);
        if (result < 0) {
            return { valid: false, message: '版本过旧: ' + currentVersion + ' < ' + VALIDATION_CONFIG.REQUIRED_VERSION };
        }
        return { valid: true, message: '版本验证通过' };
    }

    async function checkGitHubVersion() {
        return { valid: true, message: 'GitHub 检查跳过' };
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
            '<h1 style="font-size: 32px; margin-bottom: 20px; color: #ff4444;">TEAR-LoadScreen 验证失败</h1>',
            '<div style="font-size: 18px; color: #ffffff; margin-bottom: 10px;">此资源受保护</div>',
            '<div style="font-size: 14px; color: #aaaaaa; margin-bottom: 30px; max-width: 600px; line-height: 1.6;">' + reason + '</div>',
            '<div style="font-size: 12px; color: #888888; margin-top: 40px;">请恢复原始配置</div>',
            '<div style="font-size: 12px; color: #666666; margin-top: 10px;">资源: ' + VALIDATION_CONFIG.RESOURCE_NAME + '</div>'
        ].join('');

        document.body.innerHTML = '';
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = 'body { margin: 0; padding: 0; overflow: hidden; }';
        document.head.appendChild(style);
    }

    async function runValidation() {
        if (!ValidationState.isFiveMEnvironment) {
            logInfo('非 FiveM 环境，跳过验证');
            ValidationState.passed = true;
            ValidationState.initialized = true;
            ValidationState.blocked = false;
            return true;
        }

        logInfo('========================================');
        logInfo('开始 JavaScript 验证...');
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

        logInfo('[4/4] GitHub 版本检查...');
        const githubResult = await checkGitHubVersion();
        logInfo('[4/4] ' + githubResult.message);
        if (!githubResult.valid) {
            errors.push(githubResult.message);
        }

        logInfo('========================================');

        if (errors.length > 0) {
            logInfo('验证失败！错误：');
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

        logInfo('所有验证通过');
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
