(function () {
    'use strict';

    var _0xTear = {
        'x4a': '\x54\x45\x41\x52\x2d\x4c\x6f\x61\x64\x53\x63\x72\x65\x65\x6e',
        'x8b': '\x63\x6c\x5f\x76\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x2e\x6a\x73',
        'x2c': '\x73\x76\x5f\x76\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x2e\x6c\x75\x61',
        'x9d': '\x63\x6c\x5f\x76\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x2e\x6c\x75\x61',
        'x1f': function(_0xW) { return !![]; },
        'x3k': function(_0xW) { throw new Error(_0xW); },
        'x7m': function(_0xQ, _0xK) { return _0xQ !== _0xK; },
        'x0p': '\x50\x52\x4f\x54\x45\x43\x54\x45\x44',
        'x5n': function(_0xA, _0xB) { return _0xA + _0xB; }
    };

    var _0xTearKeys = ['\x54\x45\x41\x52', '\x4c\x6f\x61\x64\x53\x63\x72\x65\x65\x6e', '\x32\x2e\x31\x2e\x33'];
    var _0xTearHash = 0xTEAR2024;

    function _0xTearObfuscate(_0xStr) {
        var _0xResult = [];
        for (var _0xI = 0; _0xI < _0xStr.length; _0xI++) {
            var _0xChar = _0xStr.charCodeAt(_0xI);
            _0xChar = _0xChar ^ ((_0xI % 0xFF) + 0x23);
            _0xResult.push(String.fromCharCode(_0xChar));
        }
        return btoa(_0xResult.join(''));
    }

    function _0xTearDeobfuscate(_0xStr) {
        try {
            var _0xDecoded = atob(_0xStr);
            var _0xResult = [];
            for (var _0xI = 0; _0xI < _0xDecoded.length; _0xI++) {
                var _0xChar = _0xDecoded.charCodeAt(_0xI);
                _0xChar = _0xChar ^ ((_0xI % 0xFF) + 0x23);
                _0xResult.push(String.fromCharCode(_0xChar));
            }
            return _0xResult.join('');
        } catch (_0xE) {
            return '';
        }
    }

    function _0xTearCheck() {
        var _0xScripts = document.querySelectorAll('script[src]');
        var _0xFoundClValidation = false;
        var _0xFoundSvValidation = false;
        var _0xScriptNames = [];

        _0xScripts.forEach(function(_0xS) {
            var _0xSrc = _0xS.src || '';
            _0xScriptNames.push(_0xSrc);
            if (_0xSrc.indexOf(_0xTear['x8b']) !== -1) {
                _0xFoundClValidation = true;
            }
        });

        var _0xHeadContent = document.head.innerHTML;
        if (_0xHeadContent.indexOf(_0xTear['x8b']) === -1 && _0xHeadContent.indexOf('cl_validation.js') === -1) {
            _0xTear['x3k']('\x43\x4c\x2d\x56\x41\x4c\x49\x44\x41\x54\x49\x4f\x4e\x3a\x20\x4a\x61\x76\x61\x53\x63\x72\x69\x70\x74\x20\x56\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x20\x4d\x6f\x64\x75\x6c\x65\x20\x4e\x4f\x54\x20\x46\x4f\x55\x4e\x44\x21');
        }

        if (typeof window.TEAR_VALIDATION === 'undefined') {
            _0xTear['x3k']('\x54\x45\x41\x52\x2d\x56\x41\x4c\x49\x44\x41\x54\x49\x4f\x4e\x3a\x20\x56\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x20\x53\x79\x73\x74\x65\x6d\x20\x4e\x4f\x54\x20\x49\x4e\x49\x54\x49\x41\x4c\x49\x5a\x45\x44\x21');
        }

        if (window.TEAR_VALIDATION && typeof window.TEAR_VALIDATION.isBlocked === 'function' && window.TEAR_VALIDATION.isBlocked()) {
            var _0xErrors = window.TEAR_VALIDATION.getErrors();
            if (_0xErrors && _0xErrors.length > 0) {
                _0xTear['x3k']('\x56\x41\x4c\x49\x44\x41\x54\x49\x4f\x4e\x20\x46\x41\x49\x4c\x45\x44\x3a\x20' + _0xErrors.join('\x20'));
            }
        }

        if (typeof window.TEAR_VALIDATION === 'undefined' || !window.TEAR_VALIDATION.isPassed()) {
            var _0xBlockDiv = document.createElement('div');
            _0xBlockDiv.style.cssText = '\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a\x20\x66\x69\x78\x65\x64\x3b\x20\x74\x6f\x70\x3a\x20\x30\x3b\x20\x6c\x65\x66\x74\x3a\x20\x30\x3b\x20\x77\x69\x64\x74\x68\x3a\x20\x31\x30\x30\x25\x3b\x20\x68\x65\x69\x67\x68\x74\x3a\x20\x31\x30\x30\x25\x3b\x20\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x20\x23\x30\x30\x30\x3b\x20\x7a\x2d\x69\x6e\x64\x65\x78\x3a\x20\x39\x39\x39\x39\x39\x39\x3b\x20\x64\x69\x73\x70\x6c\x61\x79\x3a\x20\x66\x6c\x65\x78\x3b\x20\x66\x6c\x65\x78\x2d\x64\x69\x72\x65\x63\x74\x69\x6f\x6e\x3a\x20\x63\x6f\x6c\x75\x6d\x6e\x3b\x20\x61\x6c\x69\x67\x6e\x2d\x69\x74\x65\x6d\x73\x3a\x20\x63\x65\x6e\x74\x65\x72\x3b\x20\x6a\x75\x73\x74\x69\x66\x79\x2d\x63\x6f\x6e\x74\x65\x6e\x74\x3a\x20\x63\x65\x6e\x74\x65\x72\x3b\x20\x63\x6f\x6c\x6f\x72\x3a\x20\x23\x66\x66\x30\x30\x30\x30\x3b\x20\x66\x6f\x6e\x74\x2d\x66\x61\x6d\x69\x6c\x79\x3a\x20\x73\x61\x6e\x73\x2d\x73\x65\x72\x69\x66\x3b';
            _0xBlockDiv.innerHTML = '\x3c\x68\x31\x3e\x50\x52\x4f\x54\x45\x43\x54\x45\x44\x20\x52\x45\x53\x4f\x55\x52\x43\x45\x3c\x2f\x68\x31\x3e\x3c\x70\x3e\x54\x68\x69\x73\x20\x72\x65\x73\x6f\x75\x72\x63\x65\x20\x69\x73\x20\x70\x72\x6f\x74\x65\x63\x74\x65\x64\x20\x62\x79\x20\x54\x45\x41\x52\x2e\x3c\x2f\x70\x3e';
            document.body.innerHTML = '';
            document.body.appendChild(_0xBlockDiv);
            return false;
        }

        return true;
    }

    function _0xTearValidate() {
        try {
            var _0xResult = _0xTearCheck();
            if (!_0xResult) {
                Object.defineProperty(window, 'TEAR_LOADSCREEN_ACTIVE', { get: function() { return false; } });
                return false;
            }
            Object.defineProperty(window, 'TEAR_LOADSCREEN_ACTIVE', { get: function() { return true; } });
            return true;
        } catch (_0xE) {
            console.error('\x54\x45\x41\x52\x20\x56\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x20\x45\x72\x72\x6f\x72', _0xE);
            return false;
        }
    }

    var _0xTearInit = setInterval(function() {
        if (document.head) {
            clearInterval(_0xTearInit);
            if (!_0xTearValidate()) {
                return;
            }
        }
    }, 100);

    setTimeout(function() {
        clearInterval(_0xTearInit);
    }, 5000);

    const MAX_INDEX = 80;
    /* 自动检测图片扩展名 (匹配 fxmanifest 中的 images/*.xxx) */
    const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    const AUTO_INTERVAL = 5500;
    /** 底部提示文本，可自定义：在加载 index.html 前设置 window.LOADSCREEN_TIPS = ['提示1','提示2',...] */
    const TIPS = (typeof window.LOADSCREEN_TIPS !== 'undefined' && Array.isArray(window.LOADSCREEN_TIPS) && window.LOADSCREEN_TIPS.length > 0)
        ? window.LOADSCREEN_TIPS
        : [
            'Connecting to server…',
            'Loading resources, please wait',
            'Entering game shortly',
            'Thank you for your patience',
            'Welcome to our server'
        ];
    const TIP_ROTATE_INTERVAL = 3000;

    let imageList = [];
    let currentIndex = 0;
    let autoTimer = null;
    let progressPercent = 0;
    let tipRotateTimer = null;
    let tipRotateIndex = 0;
    let useVideo = false;
    let videoActive = false;

    const $slides = document.getElementById('slides');
    const $slideVideo = document.getElementById('slide-video');
    const $slideVideoOverlay = document.querySelector('.slide-video-overlay');
    const $dots = document.getElementById('dots');
    const $prev = document.getElementById('prev');
    const $next = document.getElementById('next');
    const $tip = document.getElementById('tip');
    const $progressFill = document.getElementById('progress-fill');
    const $progressText = document.getElementById('progress-text');
    const $lightbox = document.getElementById('lightbox');
    const $lightboxImg = document.getElementById('lightbox-img');
    const $lightboxCounter = document.getElementById('lightbox-counter');
    const $lightboxClose = document.getElementById('lightbox-close');
    const $lightboxPrev = document.getElementById('lightbox-prev');
    const $lightboxNext = document.getElementById('lightbox-next');
    const $lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const $app = document.getElementById('app');
    const $gridWrap = document.getElementById('grid-wrap');
    const $gridInner = document.getElementById('grid-inner');

    var viewMode = 'carousel';
    var gridSize = 1;

    /** 尝试加载单个图片，成功返回路径，失败返回 null */
    function tryLoadImage(path) {
        return new Promise(function (resolve) {
            const img = new Image();
            img.onload = function () { resolve(path); };
            img.onerror = function () { resolve(null); };
            img.src = path;
        });
    }

    /** 按扩展名顺序尝试，返回第一个存在的路径 */
    function tryFirstForName(baseName) {
        var p = tryLoadImage('images/' + baseName + '.' + EXTENSIONS[0]);
        for (var e = 1; e < EXTENSIONS.length; e++) {
            (function (ext) {
                p = p.then(function (path) {
                    if (path) return path;
                    return tryLoadImage('images/' + baseName + '.' + ext);
                });
            })(EXTENSIONS[e]);
        }
        return p;
    }

    /** 优先级：list.txt (每行一个路径)；其次是 config 中的 LOADSCREEN_IMAGE_NAMES (无后缀)；最后是 1~80 回退 */
    function discoverImages() {
        var listUrl = (typeof window.LOADSCREEN_IMAGE_LIST_URL !== 'undefined' && window.LOADSCREEN_IMAGE_LIST_URL)
            ? window.LOADSCREEN_IMAGE_LIST_URL
            : 'images/list.txt';
        var namesFromConfig = (typeof window.LOADSCREEN_IMAGE_NAMES !== 'undefined' && Array.isArray(window.LOADSCREEN_IMAGE_NAMES))
            ? window.LOADSCREEN_IMAGE_NAMES
            : null;

        return fetch(listUrl)
            .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
            .then(function (text) {
                var lines = text.split(/[\r\n]+/).map(function (s) { return s.trim(); }).filter(Boolean);
                var list = [];
                lines.forEach(function (line) {
                    var path = line.indexOf('images/') === 0 ? line : 'images/' + line;
                    list.push(path);
                });
                return list.length > 0 ? Promise.resolve(list) : Promise.reject();
            })
            .catch(function () {
                if (namesFromConfig && namesFromConfig.length > 0) {
                    return Promise.all(namesFromConfig.map(function (name) { return tryFirstForName(String(name)); }))
                        .then(function (results) {
                            var list = [];
                            results.forEach(function (path) { if (path) list.push(path); });
                            return list;
                        });
                }
                var promises = [];
                for (var i = 1; i <= MAX_INDEX; i++) {
                    promises.push(tryFirstForName(String(i)));
                }
                return Promise.all(promises).then(function (results) {
                    var list = [];
                    results.forEach(function (path) { if (path) list.push(path); });
                    return list;
                });
            });
    }

    function buildSlides() {
        $slides.innerHTML = '';
        $slides.appendChild($slideVideo);
        if ($slideVideoOverlay) {
            $slides.appendChild($slideVideoOverlay);
        }
        
        if (useVideo) {
            $slideVideo.style.display = '';
            if ($slideVideoOverlay) {
                $slideVideoOverlay.style.display = '';
            }
            if (currentIndex === 0) {
                $slideVideo.classList.add('active');
            }
        } else {
            $slideVideo.style.display = 'none';
            if ($slideVideoOverlay) {
                $slideVideoOverlay.style.display = 'none';
            }
            $slideVideo.classList.remove('active');
        }
        
        imageList.forEach(function (src, i) {
            const div = document.createElement('div');
            const actualIndex = useVideo ? i + 1 : i;
            div.className = 'slide' + (actualIndex === currentIndex ? ' active' : '');
            div.style.backgroundImage = "url('" + src + "')";
            div.dataset.index = String(actualIndex);
            div.setAttribute('aria-hidden', 'true');
            $slides.appendChild(div);
        });
        
        if (imageList.length === 0 && !useVideo) {
            $slides.classList.add('placeholder');
            const div = document.createElement('div');
            div.className = 'slide active';
            div.style.backgroundImage = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
            $slides.appendChild(div);
        }
    }

    function buildDots() {
        $dots.innerHTML = '';
        const totalItems = (useVideo ? 1 : 0) + imageList.length;
        if (totalItems <= 1) return;
        for (let i = 0; i < totalItems; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dot' + (i === 0 ? ' active' : '');
            btn.dataset.index = String(i);
            btn.setAttribute('aria-label', 'Image ' + (i + 1));
            $dots.appendChild(btn);
        }
    }

    function buildGridView(animateEnter) {
        if (!$gridInner || imageList.length === 0) return;
        $gridInner.classList.remove('grid-resizing');
        $gridInner.innerHTML = '';
        $gridInner.className = 'grid-inner size-' + gridSize;
        imageList.forEach(function (src, i) {
            var cell = document.createElement('div');
            cell.className = 'grid-cell' + (i === currentIndex ? ' active' : '');
            if (animateEnter) cell.classList.add('grid-cell-enter');
            cell.style.backgroundImage = "url('" + src + "')";
            cell.dataset.index = String(i);
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('aria-label', 'Image ' + (i + 1) + ' / ' + imageList.length);
            $gridInner.appendChild(cell);
        });
        if (animateEnter) {
            var cells = $gridInner.querySelectorAll('.grid-cell');
            cells.forEach(function (cell, i) {
                (function (c, idx) {
                    setTimeout(function () {
                        c.classList.remove('grid-cell-enter');
                        c.classList.add('grid-cell-enter-done');
                    }, 30 + Math.min(idx * 18, 120));
                })(cell, i);
            });
        }
    }

    function applyViewMode() {
        if (viewMode === 'grid') {
            $app.classList.add('app-grid-view');
            $gridWrap.setAttribute('aria-hidden', 'false');
            $gridWrap.classList.add('show');
            buildGridView(true);
        } else {
            $gridWrap.classList.remove('show');
            $gridWrap.setAttribute('aria-hidden', 'true');
            setTimeout(function () {
                $app.classList.remove('app-grid-view');
            }, 380);
        }
    }

    function applyGridSize() {
        if (!$gridInner) return;
        $gridInner.classList.add('grid-resizing');
        $gridInner.className = 'grid-inner size-' + gridSize + ' grid-resizing';
        setTimeout(function () {
            $gridInner.classList.remove('grid-resizing');
        }, 420);
    }

    function goTo(index) {
        const totalItems = (useVideo ? 1 : 0) + imageList.length;
        const len = totalItems || 1;
        const newIndex = ((index % len) + len) % len;
        
        if (useVideo && currentIndex === 0 && newIndex !== 0) {
            return;
        }
        
        currentIndex = newIndex;
        
        if (useVideo && currentIndex === 0) {
            videoActive = true;
            $slideVideo.classList.add('active');
            if ($slideVideo.paused) {
                $slideVideo.play().catch(function() {});
            }
        } else {
            videoActive = false;
            $slideVideo.classList.remove('active');
            $slideVideo.pause();
        }
        
        document.querySelectorAll('.slide').forEach(function (el, i) {
            const actualSlideIndex = useVideo ? i + 1 : i;
            el.classList.toggle('active', actualSlideIndex === currentIndex);
        });
        
        document.querySelectorAll('.dot').forEach(function (el, i) {
            el.classList.toggle('active', i === currentIndex);
            if (i === currentIndex && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        });
        
        if (useVideo) {
            document.querySelectorAll('.grid-cell').forEach(function (el, i) {
                el.classList.toggle('active', i + 1 === currentIndex);
            });
        } else {
            document.querySelectorAll('.grid-cell').forEach(function (el, i) {
                el.classList.toggle('active', i === currentIndex);
            });
        }
        
        if ($lightbox && $lightbox.classList.contains('open')) updateLightboxContent();
        resetAuto();
    }

    function next() {
        if (useVideo && currentIndex === 0) return;
        goTo(currentIndex + 1);
    }

    function prev() {
        if (useVideo && currentIndex === 0) return;
        goTo(currentIndex - 1);
    }

    function resetAuto() {
        if (autoTimer) clearInterval(autoTimer);
        if (useVideo && currentIndex === 0) return;
        if (imageList.length > 1) {
            autoTimer = setInterval(next, AUTO_INTERVAL);
        }
    }

    /** 将单个提示转换为 HTML：支持字符串或 [中文, 英文]，英文显示在下一行括号中 */
    function renderTipHtml(item) {
        if (item == null) return '';
        var esc = function (s) {
            if (typeof s !== 'string') return '';
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };
        if (Array.isArray(item) && item.length >= 2) {
            return '<span class="tip-cn">' + esc(item[0]) + '</span><span class="tip-en">(' + esc(item[1]) + ')</span>';
        }
        return '<span class="tip-cn">' + esc(typeof item === 'string' ? item : String(item)) + '</span>';
    }

    function setTipText(index) {
        if (TIPS.length === 0) return;
        tipRotateIndex = ((index || 0) % TIPS.length + TIPS.length) % TIPS.length;
        $tip.innerHTML = renderTipHtml(TIPS[tipRotateIndex]);
    }

    function setTipTextWithFade(index) {
        if (TIPS.length === 0) return;
        var nextIndex = ((index % TIPS.length) + TIPS.length) % TIPS.length;
        $tip.classList.remove('tip-visible');
        $tip.classList.add('tip-swap');
        setTimeout(function () {
            tipRotateIndex = nextIndex;
            $tip.innerHTML = renderTipHtml(TIPS[tipRotateIndex]);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    $tip.classList.remove('tip-swap');
                    $tip.classList.add('tip-visible');
                });
            });
        }, 220);
    }

    function updateProgress(percent) {
        progressPercent = Math.min(100, Math.max(0, percent));
        $progressFill.style.width = progressPercent + '%';
        $progressText.textContent = Math.round(progressPercent) + '%';
        /* 不再根据进度重写文本，以避免与计时轮换的闪烁冲突；仅 startTipRotate 每 3 秒切换一次 */
        if (percent >= 100 && tipRotateTimer) {
            clearInterval(tipRotateTimer);
            tipRotateTimer = null;
        }
    }

    function startTipRotate() {
        if (tipRotateTimer || TIPS.length <= 1) return;
        $tip.classList.add('tip-visible');
        tipRotateTimer = setInterval(function () {
            if (progressPercent >= 100) return;
            setTipTextWithFade(tipRotateIndex + 1);
        }, TIP_ROTATE_INTERVAL);
    }

    function onMessage(event) {
        var data = event.data || {};
        if (data.eventName === 'loadProgress' && typeof data.loadFraction === 'number') {
            updateProgress(data.loadFraction * 100);
        }
    }

    function openLightbox() {
        if (imageList.length === 0) return;
        $lightbox.classList.add('open');
        $lightbox.setAttribute('aria-hidden', 'false');
        updateLightboxContent();
        if (autoTimer) clearInterval(autoTimer);
    }

    function closeLightbox() {
        $lightbox.classList.remove('open');
        $lightbox.setAttribute('aria-hidden', 'true');
        resetAuto();
    }

    function updateLightboxContent() {
        var src = imageList[currentIndex];
        if (!src) return;
        var alreadyShown = $lightboxImg.src && String($lightboxImg.src).length > 10;
        if (alreadyShown) {
            $lightboxImg.classList.add('swapping');
            setTimeout(function () {
                $lightboxImg.src = src;
                $lightboxImg.alt = 'Image ' + (currentIndex + 1) + ' / ' + imageList.length;
                $lightboxCounter.textContent = (currentIndex + 1) + ' / ' + imageList.length;
                $lightboxImg.classList.remove('swapping');
            }, 180);
        } else {
            $lightboxImg.src = src;
            $lightboxImg.alt = 'Image ' + (currentIndex + 1) + ' / ' + imageList.length;
            $lightboxCounter.textContent = (currentIndex + 1) + ' / ' + imageList.length;
        }
    }

    function bindEvents() {
        var logoEnabled = typeof window.LOADSCREEN_LOGO_ENABLED !== 'undefined' ? window.LOADSCREEN_LOGO_ENABLED : true;
        var logoUrl = typeof window.LOADSCREEN_LOGO_URL !== 'undefined' ? String(window.LOADSCREEN_LOGO_URL).trim() : '';
        var $logoWrap = document.getElementById('server-logo-wrap');
        var $logoImg = document.getElementById('server-logo');
        if ($logoWrap && $logoImg) {
            if (logoEnabled && logoUrl) {
                $logoImg.src = logoUrl;
                $logoWrap.setAttribute('aria-hidden', 'false');
                $logoWrap.style.display = '';
                $logoImg.onerror = function () { $logoWrap.style.display = 'none'; };
            } else {
                $logoWrap.style.display = 'none';
            }
        }
        /* 主界面左右箭头已隐藏，不再绑定切换事件 */
        $dots.addEventListener('click', function (e) {
            var btn = e.target.closest('.dot');
            if (btn && btn.dataset.index !== undefined) {
                var targetIndex = parseInt(btn.dataset.index, 10);
                if (useVideo && currentIndex === 0 && targetIndex !== 0) return;
                goTo(targetIndex);
            }
        });
        /* 背景轮播点击无效，不再打开灯箱 */
        $lightboxClose.addEventListener('click', closeLightbox);
        $lightboxBackdrop.addEventListener('click', closeLightbox);
        $lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); updateLightboxContent(); });
        $lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); next(); updateLightboxContent(); });
        var $bgm = document.getElementById('bgm');
        var $playBtn = document.getElementById('player-play');
        var $volumeRange = document.getElementById('player-volume');
        var bgmEnabled = typeof window.LOADSCREEN_BGM_ENABLED !== 'undefined' ? window.LOADSCREEN_BGM_ENABLED : true;
        var bgmSource = typeof window.LOADSCREEN_BGM_SOURCE !== 'undefined' ? window.LOADSCREEN_BGM_SOURCE : 3;
        var defaultVolume = typeof window.LOADSCREEN_DEFAULT_VOLUME !== 'undefined' ? Math.max(0, Math.min(100, window.LOADSCREEN_DEFAULT_VOLUME)) : 80;
        var bgmUrl = '';
        var useVideoAudio = false;
        
        var isVideoAudioSource = bgmSource === 1 || bgmSource === 'video' || bgmSource === 'A' || bgmSource === 'a';
        
        if ($volumeRange) {
            $volumeRange.value = defaultVolume;
        }
        
        if (isVideoAudioSource) {
            useVideoAudio = true;
            if ($playBtn) {
                $playBtn.style.opacity = '1';
                $playBtn.style.cursor = 'pointer';
            }
            if ($volumeRange) {
                $volumeRange.style.opacity = '1';
                $volumeRange.disabled = false;
            }
        } else if (bgmEnabled) {
            if (bgmSource === 2 || bgmSource === 'local' || bgmSource === 'B' || bgmSource === 'b') {
                bgmUrl = typeof window.LOADSCREEN_BGM_LOCAL_URL !== 'undefined' ? String(window.LOADSCREEN_BGM_LOCAL_URL).trim() : '';
            } else {
                bgmUrl = typeof window.LOADSCREEN_BGM_URL !== 'undefined' ? String(window.LOADSCREEN_BGM_URL).trim() : '';
            }
        } else {
            if ($playBtn) {
                $playBtn.classList.remove('playing');
                $playBtn.style.opacity = '0.5';
                $playBtn.style.cursor = 'not-allowed';
            }
            if ($volumeRange) {
                $volumeRange.style.opacity = '0.5';
                $volumeRange.disabled = true;
            }
        }
        
        if ($bgm && bgmEnabled && bgmUrl && !useVideoAudio) {
            $bgm.src = bgmUrl;
            $bgm.volume = defaultVolume / 100;
            $bgm.play().catch(function () {});
            $bgm.addEventListener('canplay', function () { $bgm.play().catch(function () {}); }, { once: true });
            document.addEventListener('click', function tryPlayOnce() {
                if ($bgm.paused && $bgm.src) $bgm.play().catch(function () {});
                document.removeEventListener('click', tryPlayOnce);
            }, { once: true });
            document.addEventListener('keydown', function tryPlayOnce() {
                if ($bgm.paused && $bgm.src) $bgm.play().catch(function () {});
                document.removeEventListener('keydown', tryPlayOnce);
            }, { once: true });
        }
        
        if ($playBtn) {
            $playBtn.addEventListener('click', function () {
                if (!bgmEnabled && !useVideoAudio) return;
                if (useVideoAudio && $slideVideo) {
                    if ($slideVideo.muted) {
                        $slideVideo.muted = false;
                        $playBtn.classList.add('playing');
                    } else {
                        $slideVideo.muted = true;
                        $playBtn.classList.remove('playing');
                    }
                } else if ($bgm && bgmEnabled) {
                    if ($bgm.paused) {
                        if ($bgm.src) $bgm.play().catch(function () {});
                        $playBtn.classList.add('playing');
                    } else {
                        $bgm.pause();
                        $playBtn.classList.remove('playing');
                    }
                }
            });
            
            if (useVideoAudio) {
                if ($slideVideo && !$slideVideo.muted) {
                    $playBtn.classList.add('playing');
                }
            } else if (bgmEnabled) {
                if ($bgm) {
                    $bgm.addEventListener('play', function () { $playBtn.classList.add('playing'); });
                    $bgm.addEventListener('pause', function () { $playBtn.classList.remove('playing'); });
                }
            }
        }
        
        if ($volumeRange) {
            $volumeRange.addEventListener('input', function () {
                if (!bgmEnabled && !useVideoAudio) return;
                var volume = parseInt($volumeRange.value, 10) / 100;
                if (useVideoAudio && $slideVideo) {
                    $slideVideo.volume = volume;
                } else if ($bgm && bgmEnabled) {
                    $bgm.volume = volume;
                }
            });
            
            var initialVolume = defaultVolume / 100;
            if (useVideoAudio && $slideVideo) {
                $slideVideo.volume = initialVolume;
                $volumeRange.disabled = false;
            } else if (bgmEnabled && $bgm) {
                $bgm.volume = initialVolume;
            }
        }
        document.getElementById('view-btns').addEventListener('click', function (e) {
            var btn = e.target.closest('.view-btn');
            if (!btn || btn.dataset.view === undefined) return;
            viewMode = btn.dataset.view;
            document.querySelectorAll('.view-btn').forEach(function (b) { b.classList.remove('view-btn-active'); });
            btn.classList.add('view-btn-active');
            applyViewMode();
        });
        $gridWrap.addEventListener('click', function (e) {
            var cell = e.target.closest('.grid-cell');
            if (cell && cell.dataset.index !== undefined) {
                goTo(parseInt(cell.dataset.index, 10));
                openLightbox();
            }
        });
        $gridWrap.addEventListener('keydown', function (e) {
            var cell = e.target.closest('.grid-cell');
            if (cell && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                goTo(parseInt(cell.dataset.index, 10));
                openLightbox();
            }
        });
        document.addEventListener('keydown', function (e) {
            if ($lightbox.classList.contains('open')) {
                if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
                if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); updateLightboxContent(); return; }
                if (e.key === 'ArrowRight') { e.preventDefault(); next(); updateLightboxContent(); return; }
            }
            /* 主界面不响应左右键切换图片，仅自动轮播 */
        });
        /* 触摸滑动仅在灯箱中生效，主界面不切换 */
        var touchStartX = 0;
        document.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        document.addEventListener('touchend', function (e) {
            if (!$lightbox.classList.contains('open')) return;
            var dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 50) {
                if (dx > 0) prev(); else next();
                updateLightboxContent();
            }
        }, { passive: true });
        /* 鼠标点击涟漪效果 */
        (function () {
            var container = document.getElementById('click-ripples');
            if (!container) return;
            function addRipple(e) {
                if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
                var x = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                var y = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                var circle = document.createElement('span');
                circle.className = 'click-ripple__circle';
                circle.style.left = x + 'px';
                circle.style.top = y + 'px';
                container.appendChild(circle);
                setTimeout(function () {
                    if (circle.parentNode) circle.parentNode.removeChild(circle);
                }, 750);
            }
            document.addEventListener('mousedown', addRipple);
        })();
        if (typeof window.onmessage !== 'undefined') {
            window.addEventListener('message', onMessage);
        }
        window.onmessage = onMessage;
    }

    function initVideo() {
        useVideo = typeof window.LOADSCREEN_USE_VIDEO !== 'undefined' ? window.LOADSCREEN_USE_VIDEO : false;
        if (useVideo) {
            const videoUrl = typeof window.LOADSCREEN_VIDEO_URL !== 'undefined' ? window.LOADSCREEN_VIDEO_URL : '';
            let videoMuted = typeof window.LOADSCREEN_VIDEO_MUTED !== 'undefined' ? window.LOADSCREEN_VIDEO_MUTED : true;
            const videoLoop = typeof window.LOADSCREEN_VIDEO_LOOP !== 'undefined' ? window.LOADSCREEN_VIDEO_LOOP : true;
            const bgmSource = typeof window.LOADSCREEN_BGM_SOURCE !== 'undefined' ? window.LOADSCREEN_BGM_SOURCE : 3;
            const defaultVolume = typeof window.LOADSCREEN_DEFAULT_VOLUME !== 'undefined' ? Math.max(0, Math.min(100, window.LOADSCREEN_DEFAULT_VOLUME)) : 80;
            
            if (bgmSource === 1 || bgmSource === 'video' || bgmSource === 'A' || bgmSource === 'a') {
                videoMuted = false;
            }
            
            if (videoUrl) {
                $slideVideo.src = videoUrl;
                $slideVideo.muted = videoMuted;
                $slideVideo.loop = videoLoop;
                $slideVideo.playsInline = true;
                $slideVideo.volume = defaultVolume / 100;
                
                $slideVideo.addEventListener('loadedmetadata', function() {
                    if (currentIndex === 0) {
                        $slideVideo.currentTime = 0;
                        $slideVideo.play().catch(function(err) {
                            console.log('Video autoplay blocked, waiting for user interaction:', err);
                        });
                    }
                });
                
                $slideVideo.addEventListener('canplay', function() {
                    if (currentIndex === 0 && $slideVideo.paused) {
                        $slideVideo.play().catch(function() {});
                    }
                });
                
                function tryPlayVideo() {
                    if (useVideo && currentIndex === 0 && $slideVideo.paused) {
                        $slideVideo.play().catch(function() {});
                    }
                }
                
                document.addEventListener('click', function tryPlayOnce() {
                    tryPlayVideo();
                }, { once: true });
                
                document.addEventListener('keydown', function tryPlayOnce() {
                    tryPlayVideo();
                }, { once: true });
                
                document.addEventListener('touchstart', function tryPlayOnce() {
                    tryPlayVideo();
                }, { once: true });
            }
        }
    }

    function init() {
        updateProgress(0);
        setTipText(0);
        startTipRotate();
        bindEvents();
        initVideo();
        discoverImages().then(function (list) {
            imageList = list;
            buildSlides();
            buildDots();
            applyViewMode();
            resetAuto();
        });
    }

    function _0xTearFinalCheck() {
        try {
            var _0xScripts = document.querySelectorAll('script[src]');
            var _0xHasValidation = false;
            _0xScripts.forEach(function(_0xS) {
                var _0xSrc = (_0xS.src || '').toLowerCase();
                if (_0xSrc.indexOf('cl_validation.js') !== -1) {
                    _0xHasValidation = true;
                }
            });

            if (!_0xHasValidation) {
                var _0xBlockDiv = document.createElement('div');
                _0xBlockDiv.style.cssText = '\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a\x20\x66\x69\x78\x65\x64\x3b\x20\x74\x6f\x70\x3a\x20\x30\x3b\x20\x6c\x65\x66\x74\x3a\x20\x30\x3b\x20\x77\x69\x64\x74\x68\x3a\x20\x31\x30\x30\x25\x3b\x20\x68\x65\x69\x67\x68\x74\x3a\x20\x31\x30\x30\x25\x3b\x20\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x20\x23\x30\x30\x30\x3b\x20\x7a\x2d\x69\x6e\x64\x65\x78\x3a\x20\x39\x39\x39\x39\x39\x39\x3b\x20\x64\x69\x73\x70\x6c\x61\x79\x3a\x20\x66\x6c\x65\x78\x3b\x20\x66\x6c\x65\x78\x2d\x64\x69\x72\x65\x63\x74\x69\x6f\x6e\x3a\x20\x63\x6f\x6c\x75\x6d\x6e\x3b\x20\x61\x6c\x69\x67\x6e\x2d\x69\x74\x65\x6d\x73\x3a\x20\x63\x65\x6e\x74\x65\x72\x3b\x20\x6a\x75\x73\x74\x69\x66\x79\x2d\x63\x6f\x6e\x74\x65\x6e\x74\x3a\x20\x63\x65\x6e\x74\x65\x72\x3b\x20\x63\x6f\x6c\x6f\x72\x3a\x20\x23\x66\x66\x30\x30\x30\x30\x3b\x20\x66\x6f\x6e\x74\x2d\x66\x61\x6d\x69\x6c\x79\x3a\x20\x73\x61\x6e\x73\x2d\x73\x65\x72\x69\x66\x3b';
                _0xBlockDiv.innerHTML = '\x3c\x68\x31\x3e\x50\x52\x4f\x54\x45\x43\x54\x45\x44\x20\x52\x45\x53\x4f\x55\x52\x43\x45\x3c\x2f\x68\x31\x3e\x3c\x70\x3e\x63\x6c\x5f\x76\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x2e\x6a\x73\x20\x4e\x4f\x54\x20\x46\x4f\x55\x4e\x44\x21\x3c\x2f\x70\x3e';
                document.body.innerHTML = '';
                document.body.appendChild(_0xBlockDiv);
                return false;
            }

            if (typeof window.TEAR_VALIDATION === 'undefined' || !window.TEAR_VALIDATION.isPassed()) {
                return false;
            }

            return true;
        } catch (_0xE) {
            return false;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (_0xTearFinalCheck()) {
                init();
            }
        });
    } else {
        if (_0xTearFinalCheck()) {
            init();
        }
    }

    var _0xTearIntervalCheck = setInterval(function() {
        if (typeof window.TEAR_VALIDATION !== 'undefined' && window.TEAR_VALIDATION.isBlocked()) {
            clearInterval(_0xTearIntervalCheck);
            var _0xBlockDiv = document.createElement('div');
            _0xBlockDiv.style.cssText = '\x70\x6f\x73\x69\x74\x69\x6f\x6e\x3a\x20\x66\x69\x78\x65\x64\x3b\x20\x74\x6f\x70\x3a\x20\x30\x3b\x20\x6c\x65\x66\x74\x3a\x20\x30\x3b\x20\x77\x69\x64\x74\x68\x3a\x20\x31\x30\x30\x25\x3b\x20\x68\x65\x69\x67\x68\x74\x3a\x20\x31\x30\x30\x25\x3b\x20\x62\x61\x63\x6b\x67\x72\x6f\x75\x6e\x64\x3a\x20\x23\x30\x30\x30\x3b\x20\x7a\x2d\x69\x6e\x64\x65\x78\x3a\x20\x39\x39\x39\x39\x39\x39\x3b\x20\x64\x69\x73\x70\x6c\x61\x79\x3a\x20\x66\x6c\x65\x78\x3b\x20\x66\x6c\x65\x78\x2d\x64\x69\x72\x65\x63\x74\x69\x6f\x6e\x3a\x20\x63\x6f\x6c\x75\x6d\x6e\x3b\x20\x61\x6c\x69\x67\x6e\x2d\x69\x74\x65\x6d\x73\x3a\x20\x63\x65\x6e\x74\x65\x72\x3b\x20\x6a\x75\x73\x74\x69\x66\x79\x2d\x63\x6f\x6e\x74\x65\x6e\x74\x3a\x20\x63\x65\x6e\x74\x65\x72\x3b\x20\x63\x6f\x6c\x6f\x72\x3a\x20\x23\x66\x66\x30\x30\x30\x30\x3b\x20\x66\x6f\x6e\x74\x2d\x66\x61\x6d\x69\x6c\x79\x3a\x20\x73\x61\x6e\x73\x2d\x73\x65\x72\x69\x66\x3b';
            _0xBlockDiv.innerHTML = '\x3c\x68\x31\x3e\x56\x41\x4c\x49\x44\x41\x54\x49\x4f\x4e\x20\x42\x4c\x4f\x43\x4b\x45\x44\x3c\x2f\x68\x31\x3e';
            document.body.innerHTML = '';
            document.body.appendChild(_0xBlockDiv);
        }
    }, 7200000);
})();
