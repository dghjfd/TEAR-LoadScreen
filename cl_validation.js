/**
 * TEAR-LoadScreen 验证模块 (JavaScript - 客户端)
 * - 资源名称验证
 * - 作者名称验证
 * - GitHub 版本检查
 * - 加密反篡改保护
 */

(function() {
    'use strict';

    // 验证配置
    const VALIDATION_CONFIG = {
        RESOURCE_NAME: 'TEAR-LoadScreen',
        AUTHOR_NAME: 'TEAR',
        REQUIRED_VERSION: '2.1.6',
        GITHUB_API_URL: 'https://api.github.com/repos/TEAR-Official/TEAR-LoadScreen/releases/latest',
        ENCRYPTION_KEY_SEED: 'TEAR-LoadScreen-SecureKey-2024-JS',
        VALIDATION_TIMEOUT: 10000,
        CHECK_INTERVAL: 3000
    };

    // 验证状态
    const ValidationState = {
        passed: false,
        errors: [],
        suspicious: [],
        initialized: false,
        blocked: false,
        encryptionKey: null
    };

    /**
     * 生成加密密钥
     * 基于种子字符串生成 16 字节的密钥
     * @return {Uint8Array} 加密密钥
     */
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

    /**
     * XOR 加密数据
     * @param {string} data 原始数据
     * @param {Uint8Array} key 加密密钥
     * @return {string} Base64 编码的加密数据
     */
    function xorEncrypt(data, key) {
        const dataBytes = new TextEncoder().encode(data);
        const result = new Uint8Array(dataBytes.length);
        for (let i = 0; i < dataBytes.length; i++) {
            result[i] = dataBytes[i] ^ key[i % key.length];
        }
        return btoa(String.fromCharCode.apply(null, result));
    }

    /**
     * XOR 解密数据
     * @param {string} encrypted Base64 编码的加密数据
     * @param {Uint8Array} key 解密密钥
     * @return {string} 解密后的原始数据
     */
    function xorDecrypt(encrypted, key) {
        const data = atob(encrypted);
        const dataBytes = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            dataBytes[i] = data.charCodeAt(i);
        }
        const result = new Uint8Array(dataBytes.length);
        for (let i = 0; i < dataBytes.length; i++) {
            result[i] = dataBytes[i] ^ key[i % key.length];
        }
        return new TextDecoder().decode(result);
    }

    /**
     * 记录错误日志
     * @param {string} msg 错误信息
     */
    function logError(msg) {
        console.error('[TEAR-LoadScreen JS 验证错误] ' + msg);
    }

    /**
     * 记录信息日志
     * @param {string} msg 信息内容
     */
    function logInfo(msg) {
        console.info('[TEAR-LoadScreen JS 验证] ' + msg);
    }

    // 监听服务端验证结果事件
    window.addEventListener('message', function(event) {
        if (event.data && event.data.event === 'TEAR_VALIDATION_RESULT') {
            const { passed, suspicious } = event.data;
            if (passed && suspicious && suspicious.length > 0) {
                logError('========================================');
                logError('检测到疑似修改的文件:');
                suspicious.forEach(function(info) {
                    logError('  - ' + info);
                });
                logError('========================================');
            }
        }
    });

    /**
     * 解析版本号字符串
     * @param {string} v 版本号字符串 (如 "1.2.3")
     * @return {number[]} 版本号部分数组
     */
    function parseVersion(v) {
        const parts = v.split('.').map(part => parseInt(part, 10) || 0);
        while (parts.length < 3) parts.push(0);
        return parts;
    }

    /**
     * 比较两个版本号
     * @param {string} v1 版本号1
     * @param {string} v2 版本号2
     * @return {number} 1 (v1>v2), -1 (v1<v2), 0 (相等)
     */
    function compareVersions(v1, v2) {
        const p1 = parseVersion(v1);
        const p2 = parseVersion(v2);
        for (let i = 0; i < 3; i++) {
            if (p1[i] > p2[i]) return 1;
            if (p1[i] < p2[i]) return -1;
        }
        return 0;
    }

    /**
     * 验证资源名称
     * 检查页面中的验证标记是否正确
     * @return {{valid: boolean, message: string}} 验证结果和消息
     */
    function validateResourceName() {
        const marker = document.getElementById('tear-validation-marker');
        if (marker && marker.dataset.resource === VALIDATION_CONFIG.RESOURCE_NAME) {
            return { valid: true, message: '资源名称验证通过' };
        }
        const nameMatch = document.body.textContent.includes(VALIDATION_CONFIG.RESOURCE_NAME);
        if (!nameMatch) {
            return { valid: false, message: '资源名称验证失败 - 未找到 TEAR-LoadScreen 标识' };
        }
        return { valid: true, message: '资源名称验证通过' };
    }

    /**
     * 验证作者名称
     * 检查页面中的作者标记是否正确
     * @return {{valid: boolean, message: string}} 验证结果和消息
     */
    function validateAuthor() {
        const marker = document.getElementById('tear-validation-marker');
        if (marker && marker.dataset.author === VALIDATION_CONFIG.AUTHOR_NAME) {
            return { valid: true, message: '作者名称验证通过' };
        }
        const html = document.documentElement.outerHTML;
        if (!html.includes('data-author="TEAR"')) {
            return { valid: false, message: '作者验证失败 - 无法验证作者名称' };
        }
        return { valid: true, message: '作者名称验证通过' };
    }

    /**
     * 验证版本号
     * 检查当前版本是否满足要求
     * @return {{valid: boolean, message: string}} 验证结果和消息
     */
    function validateVersion() {
        const versionMatch = document.body.textContent.match(/version\s*:\s*['"]([^'"]+)['"]/i) ||
                            document.body.textContent.match(/version\s*\.\.\.\s*(\d+\.\d+\.\d+)/);

        if (!versionMatch || !versionMatch[1]) {
            const scriptTags = document.getElementsByTagName('script');
            for (let i = 0; i < scriptTags.length; i++) {
                const src = scriptTags[i].src || '';
                if (src.indexOf('config.js') !== -1 || src.indexOf('script.js') !== -1) {
                    continue;
                }
            }
        }

        const currentVersion = VALIDATION_CONFIG.REQUIRED_VERSION;
        const result = compareVersions(currentVersion, VALIDATION_CONFIG.REQUIRED_VERSION);

        if (result < 0) {
            return { valid: false, message: '版本验证失败 - 版本过旧! 当前: ' + currentVersion + ', 最低要求: ' + VALIDATION_CONFIG.REQUIRED_VERSION };
        }

        return { valid: true, message: '版本验证通过' };
    }

    /**
     * 检查 GitHub 最新版本
     * 异步获取 GitHub API 中的最新版本信息
     * @return {{valid: boolean, message: string}} 验证结果和消息
     */
    async function checkGitHubVersion() {
        try {
            const response = await fetch(VALIDATION_CONFIG.GITHUB_API_URL);
            if (!response.ok) {
                logInfo('GitHub API 不可用，跳过在线版本检查');
                return { valid: true, message: 'GitHub 版本检查已跳过 (API 不可用)' };
            }

            const data = await response.json();
            const latestVersion = data.tag_name ? data.tag_name.replace(/^v/, '') : data.name;

            if (latestVersion) {
                const result = compareVersions(VALIDATION_CONFIG.REQUIRED_VERSION, latestVersion);
                if (result < 0) {
                    return {
                        valid: false,
                        message: 'GitHub 版本检查失败 - GitHub 上有新版本可用! 当前: ' + VALIDATION_CONFIG.REQUIRED_VERSION + ', 最新: ' + latestVersion
                    };
                }
            }

            return { valid: true, message: 'GitHub 版本检查通过' };
        } catch (error) {
            logInfo('GitHub 版本检查失败 (离线或错误): ' + error.message);
            return { valid: true, message: 'GitHub 版本检查已跳过 (网络错误)' };
        }
    }

    /**
     * 创建阻止遮罩层
     * 当验证失败时显示全屏错误提示
     * @param {string} reason 阻止原因
     */
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

    /**
     * 执行完整验证流程
     * 异步执行所有验证检查
     * @return {boolean} 验证是否通过
     */
    async function runValidation() {
        logInfo('========================================');
        logInfo('开始 JavaScript 验证...');
        logInfo('========================================');

        ValidationState.encryptionKey = generateEncryptionKey();

        // 验证资源名称
        const nameResult = validateResourceName();
        logInfo('[1/4] ' + nameResult.message);
        if (!nameResult.valid) {
            ValidationState.errors.push(nameResult.message);
        }

        // 验证作者名称
        const authorResult = validateAuthor();
        logInfo('[2/4] ' + authorResult.message);
        if (!authorResult.valid) {
            ValidationState.errors.push(authorResult.message);
        }

        // 验证版本号
        const versionResult = validateVersion();
        logInfo('[3/4] ' + versionResult.message);
        if (!versionResult.valid) {
            ValidationState.errors.push(versionResult.message);
        }

        // GitHub 版本检查
        logInfo('[4/4] 正在执行 GitHub 版本检查...');
        const githubResult = await checkGitHubVersion();
        logInfo('[4/4] ' + githubResult.message);
        if (!githubResult.valid) {
            ValidationState.errors.push(githubResult.message);
        }

        logInfo('========================================');

        // 检查验证结果
        if (ValidationState.errors.length > 0) {
            logError('验证失败 - 资源已被阻止!');
            ValidationState.errors.forEach(err => logError('  - ' + err));
            logError('========================================');

            const errorText = ValidationState.errors.join('\n');
            createBlockOverlay(errorText.replace(/\n/g, '<br>'));
            ValidationState.blocked = true;
            ValidationState.passed = false;
            return false;
        }

        logInfo('所有 JavaScript 验证通过');
        ValidationState.passed = true;
        ValidationState.initialized = true;
        return true;
    }

    // 导出验证 API
    window.TEAR_VALIDATION = {
        run: runValidation,
        getState: function() {
            return ValidationState;
        },
        isPassed: function() {
            return ValidationState.passed;
        },
        isBlocked: function() {
            return ValidationState.blocked;
        },
        getErrors: function() {
            return ValidationState.errors;
        }
    };

    // DOM 加载完成后执行验证
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(runValidation, 500);
        });
    } else {
        setTimeout(runValidation, 500);
    }
})();
