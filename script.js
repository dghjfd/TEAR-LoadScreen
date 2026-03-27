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
    var _0xTearHash = 0x544541522024;

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

    function _0xTearIsFiveMEnv() {
        return window.location.protocol === 'nui:' || 
               window.location.href.includes('nui://') ||
               (typeof window.postMessage === 'function' && typeof window.addEventListener === 'function' && 
                typeof window.parent !== 'undefined' && window.parent !== window);
    }

    function _0xTearCheck() {
        var _0xIsFiveM = _0xTearIsFiveMEnv();
        
        if (!_0xIsFiveM) {
            console.log('[TEAR-Check] 非 FiveM 环境，返回 true');
            return true;
        }

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

        if (typeof window.TEAR_VALIDATION !== 'undefined' && typeof window.TEAR_VALIDATION.isPassed === 'function') {
            var _0xResult = window.TEAR_VALIDATION.isPassed();
            console.log('[TEAR-Check] 验证结果:', _0xResult);
            return _0xResult;
        }

        console.log('[TEAR-Check] 无验证模块，返回 true');
        return true;
    }

    function _0xTearValidate() {
        try {
            var _0xResult = _0xTearCheck();
            Object.defineProperty(window, 'TEAR_LOADSCREEN_ACTIVE', { get: function() { return true; } });
            return true;
        } catch (_0xE) {
            console.error('\x54\x45\x41\x52\x20\x56\x61\x6c\x69\x64\x61\x74\x69\x6f\x6e\x20\x45\x72\x72\x6f\x72', _0xE);
            return true;
        }
    }

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

    let $slides, $slideVideo, $slideVideoOverlay, $dots, $prev, $next, $tip, $progressFill, $progressText,
        $lightbox, $lightboxImg, $lightboxCounter, $lightboxClose, $lightboxPrev, $lightboxNext, $lightboxBackdrop,
        $app, $gridWrap, $gridInner;

    function initDOMElements() {
        $slides = document.getElementById('slides');
        $slideVideo = document.getElementById('slide-video');
        $slideVideoOverlay = document.querySelector('.slide-video-overlay');
        $dots = document.getElementById('dots');
        $prev = document.getElementById('prev');
        $next = document.getElementById('next');
        $tip = document.getElementById('tip');
        $progressFill = document.getElementById('progress-fill');
        $progressText = document.getElementById('progress-text');
        $lightbox = document.getElementById('lightbox');
        $lightboxImg = document.getElementById('lightbox-img');
        $lightboxCounter = document.getElementById('lightbox-counter');
        $lightboxClose = document.getElementById('lightbox-close');
        $lightboxPrev = document.getElementById('lightbox-prev');
        $lightboxNext = document.getElementById('lightbox-next');
        $lightboxBackdrop = document.getElementById('lightbox-backdrop');
        $app = document.getElementById('app');
        $gridWrap = document.getElementById('grid-wrap');
        $gridInner = document.getElementById('grid-inner');
        
        console.log('[TEAR-LoadScreen] DOM 元素初始化完成');
        console.log('[TEAR-LoadScreen] $slideVideo:', $slideVideo ? '存在' : '不存在');
        console.log('[TEAR-LoadScreen] $slides:', $slides ? '存在' : '不存在');
    }

    var viewMode = 'carousel';
    var gridSize = 1;
    var displayMode = 'video'; // 'video' or 'image'
    var $modeBtns, $videoModeBtn, $imageModeBtn;

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
        
        console.log('[TEAR-LoadScreen] buildSlides 开始，useVideo:', useVideo);
        
        // 首先添加视频（如果启用）
        if (useVideo) {
            $slideVideo.style.display = '';
            $slideVideo.style.opacity = '1';
            $slideVideo.style.zIndex = '10';
            if ($slideVideoOverlay) {
                $slideVideoOverlay.style.display = '';
                $slideVideoOverlay.style.zIndex = '11';
            }
            $slideVideo.classList.add('active');
            $slides.appendChild($slideVideo);
            if ($slideVideoOverlay) {
                $slides.appendChild($slideVideoOverlay);
            }
            console.log('[TEAR-LoadScreen] 视频模式已启用');
        } else {
            $slideVideo.style.display = 'none';
            $slideVideo.style.opacity = '0';
            $slideVideo.style.zIndex = '0';
            if ($slideVideoOverlay) {
                $slideVideoOverlay.style.display = 'none';
            }
            $slideVideo.classList.remove('active');
        }
        
        // 然后添加图片
        imageList.forEach(function (src, i) {
            const div = document.createElement('div');
            const actualIndex = useVideo ? i + 1 : i;
            div.className = 'slide' + (actualIndex === currentIndex ? ' active' : '');
            div.style.backgroundImage = "url('" + src + "')";
            div.style.zIndex = useVideo ? '5' : '1';
            div.dataset.index = String(actualIndex);
            div.setAttribute('aria-hidden', 'true');
            $slides.appendChild(div);
        });
        
        // 如果没有视频也没有图片，显示占位背景
        if (imageList.length === 0 && !useVideo) {
            $slides.classList.add('placeholder');
            const div = document.createElement('div');
            div.className = 'slide active';
            div.style.zIndex = '1';
            div.style.backgroundImage = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
            $slides.appendChild(div);
            console.log('[TEAR-LoadScreen] 无视频无图片，显示占位背景');
        }
        
        console.log('[TEAR-LoadScreen] buildSlides 完成，useVideo:', useVideo, 'imageList.length:', imageList.length);
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
        
        // 显示模式切换按钮事件（视频/图片）
        $modeBtns = document.getElementById('mode-btns');
        if ($modeBtns) {
            $videoModeBtn = $modeBtns.querySelector('[data-mode="video"]');
            $imageModeBtn = $modeBtns.querySelector('[data-mode="image"]');
            
            $modeBtns.addEventListener('click', function (e) {
                var btn = e.target.closest('.view-btn');
                if (!btn || btn.dataset.mode === undefined) return;
                
                var newMode = btn.dataset.mode;
                if (newMode === displayMode) return;
                
                displayMode = newMode;
                
                // 更新按钮状态
                document.querySelectorAll('#mode-btns .view-btn').forEach(function (b) { 
                    b.classList.remove('view-btn-active'); 
                });
                btn.classList.add('view-btn-active');
                
                // 根据配置决定是否启用视频
                if (displayMode === 'video' && typeof window.LOADSCREEN_USE_VIDEO !== 'undefined') {
                    useVideo = window.LOADSCREEN_USE_VIDEO;
                } else {
                    useVideo = false;
                }
                
                console.log('[TEAR-LoadScreen] 显示模式切换为:', displayMode, 'useVideo:', useVideo);
                
                // 重新构建幻灯片
                buildSlides();
                buildDots();
                goTo(0);
            });
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
        
        /* 樱花特效 */
        (function () {
            var sakuraContainer = document.getElementById('sakura-container');
            if (!sakuraContainer) return;
            
            function createSakura(x, y) {
                var petal = document.createElement('div');
                petal.className = 'sakura-petal';
                
                // 随机大小
                var size = Math.random() * 10 + 8;
                petal.style.width = size + 'px';
                petal.style.height = size + 'px';
                
                // 设置位置
                petal.style.left = x + 'px';
                petal.style.top = y + 'px';
                
                // 随机动画时长
                var duration = Math.random() * 2 + 3;
                petal.style.animationDuration = duration + 's';
                
                // 随机延迟
                petal.style.animationDelay = (Math.random() * 0.5) + 's';
                
                sakuraContainer.appendChild(petal);
                
                // 清理
                setTimeout(function () {
                    if (petal.parentNode) {
                        petal.parentNode.removeChild(petal);
                    }
                }, (duration + 1) * 1000);
            }
            
            // 点击时生成樱花
            document.addEventListener('click', function (e) {
                if (e.target.closest('button') || e.target.closest('input')) return;
                
                // 生成 3-5 片樱花
                var count = Math.floor(Math.random() * 3) + 3;
                for (var i = 0; i < count; i++) {
                    var offsetX = (Math.random() - 0.5) * 60;
                    var offsetY = (Math.random() - 0.5) * 60;
                    createSakura(e.clientX + offsetX, e.clientY + offsetY);
                }
            });
        })();
        if (typeof window.onmessage !== 'undefined') {
            window.addEventListener('message', onMessage);
        }
        window.onmessage = onMessage;
    }

    function initVideo() {
        useVideo = typeof window.LOADSCREEN_USE_VIDEO !== 'undefined' ? window.LOADSCREEN_USE_VIDEO : false;
        console.log('[TEAR-LoadScreen] initVideo 开始，useVideo:', useVideo);
        
        if (useVideo) {
            const videoUrl = typeof window.LOADSCREEN_VIDEO_URL !== 'undefined' ? window.LOADSCREEN_VIDEO_URL : '';
            let videoMuted = typeof window.LOADSCREEN_VIDEO_MUTED !== 'undefined' ? window.LOADSCREEN_VIDEO_MUTED : true;
            const videoLoop = typeof window.LOADSCREEN_VIDEO_LOOP !== 'undefined' ? window.LOADSCREEN_VIDEO_LOOP : true;
            const bgmSource = typeof window.LOADSCREEN_BGM_SOURCE !== 'undefined' ? window.LOADSCREEN_BGM_SOURCE : 3;
            const defaultVolume = typeof window.LOADSCREEN_DEFAULT_VOLUME !== 'undefined' ? Math.max(0, Math.min(100, window.LOADSCREEN_DEFAULT_VOLUME)) : 80;
            
            console.log('[TEAR-LoadScreen] 视频配置:', { videoUrl, videoMuted, videoLoop, bgmSource });
            
            if (bgmSource === 1 || bgmSource === 'video' || bgmSource === 'A' || bgmSource === 'a') {
                videoMuted = false;
            }
            
            if (videoUrl) {
                console.log('[TEAR-LoadScreen] 设置视频源:', videoUrl);
                
                var $videoSource = $slideVideo.querySelector('source');
                if ($videoSource) {
                    $videoSource.src = videoUrl;
                } else {
                    $slideVideo.src = videoUrl;
                }
                
                $slideVideo.muted = videoMuted;
                $slideVideo.loop = videoLoop;
                $slideVideo.playsInline = true;
                $slideVideo.volume = defaultVolume / 100;
                $slideVideo.load();
                console.log('[TEAR-LoadScreen] 视频元素已加载，src:', $slideVideo.src);
                
                $slideVideo.addEventListener('loadedmetadata', function() {
                    console.log('[TEAR-LoadScreen] 视频元数据加载成功');
                    if (currentIndex === 0) {
                        $slideVideo.currentTime = 0;
                        $slideVideo.play().catch(function(err) {
                            console.log('[TEAR-LoadScreen] 视频自动播放失败:', err);
                        });
                    }
                });
                
                $slideVideo.addEventListener('canplay', function() {
                    console.log('[TEAR-LoadScreen] 视频可以播放');
                    if (currentIndex === 0 && $slideVideo.paused) {
                        $slideVideo.play().catch(function() {});
                    }
                });
                
                $slideVideo.addEventListener('error', function(err) {
                    console.error('[TEAR-LoadScreen] 视频加载错误:', err);
                    console.error('[TEAR-LoadScreen] 视频 URL:', videoUrl);
                    console.warn('[TEAR-LoadScreen] 视频加载失败，但保持显示第一帧');
                    useVideo = false;
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
            } else {
                console.warn('[TEAR-LoadScreen] 视频 URL 未设置');
                useVideo = false;
            }
        } else {
            console.log('[TEAR-LoadScreen] 视频模式已禁用');
        }
    }

    function init() {
        console.log('[TEAR-LoadScreen] ========================================');
        console.log('[TEAR-LoadScreen] 开始初始化 Loadscreen');
        console.log('[TEAR-LoadScreen] ========================================');
        
        initDOMElements();
        
        // 检查是否启用视频模式，决定是否显示模式切换按钮
        var videoEnabled = typeof window.LOADSCREEN_USE_VIDEO !== 'undefined' && window.LOADSCREEN_USE_VIDEO;
        var hasImages = typeof window.LOADSCREEN_IMAGE_NAMES !== 'undefined' || 
                       typeof window.LOADSCREEN_IMAGE_LIST_URL !== 'undefined';
        
        $modeBtns = document.getElementById('mode-btns');
        if ($modeBtns && videoEnabled && hasImages) {
            $modeBtns.style.display = 'flex';
            displayMode = 'video';
            console.log('[TEAR-LoadScreen] 显示模式切换按钮已启用（配置检测）');
        } else if ($modeBtns) {
            $modeBtns.style.display = 'none';
            console.log('[TEAR-LoadScreen] 显示模式切换按钮已隐藏（配置检测）');
        }
        
        updateProgress(0);
        setTipText(0);
        startTipRotate();
        bindEvents();
        
        console.log('[TEAR-LoadScreen] 初始化视频...');
        initVideo();
        
        console.log('[TEAR-LoadScreen] 开始加载图片列表...');
        discoverImages().then(function (list) {
            console.log('[TEAR-LoadScreen] 图片加载完成，数量:', list.length);
            imageList = list;
            
            // 图片加载完成后再次检查是否显示模式按钮
            if ($modeBtns && videoEnabled && list.length > 0) {
                $modeBtns.style.display = 'flex';
                console.log('[TEAR-LoadScreen] 显示模式切换按钮已启用（图片加载完成）');
            } else if ($modeBtns && list.length === 0) {
                $modeBtns.style.display = 'none';
                console.log('[TEAR-LoadScreen] 显示模式切换按钮已隐藏（无图片）');
            }
            
            buildSlides();
            buildDots();
            applyViewMode();
            resetAuto();
        }).catch(function(err) {
            console.error('[TEAR-LoadScreen] 图片加载失败:', err);
            imageList = [];
            
            // 图片加载失败后隐藏按钮
            if ($modeBtns) {
                $modeBtns.style.display = 'none';
                console.log('[TEAR-LoadScreen] 显示模式切换按钮已隐藏（加载失败）');
            }
            
            buildSlides();
            buildDots();
            applyViewMode();
        }).finally(function() {
            console.log('[TEAR-LoadScreen] ========================================');
            console.log('[TEAR-LoadScreen] Loadscreen 初始化完成');
            console.log('[TEAR-LoadScreen] 模式:', useVideo ? '视频' : '图片');
            console.log('[TEAR-LoadScreen] 图片数量:', imageList.length);
            console.log('[TEAR-LoadScreen] ========================================');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
        });
    } else {
        init();
    }
})();
