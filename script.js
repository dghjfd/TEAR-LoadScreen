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
            console.log('[TEAR-Check] Non-FiveM environment, returning true');
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
            console.log('[TEAR-Check] Validation result:', _0xResult);
            return _0xResult;
        }

        console.log('[TEAR-Check] No validation module found, returning true');
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
    /* Auto-detect image extensions (matching images/*.xxx in fxmanifest) */
    const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    const AUTO_INTERVAL = 5500;
    /** Bottom tip text, customizable via window.LOADSCREEN_TIPS before index.html loads */
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
        
        console.log('[TEAR-LoadScreen] DOM elements initialized');
        console.log('[TEAR-LoadScreen] $slideVideo:', $slideVideo ? 'exists' : 'missing');
        console.log('[TEAR-LoadScreen] $slides:', $slides ? 'exists' : 'missing');
    }

    var viewMode = 'carousel';
    var gridSize = 1;

    /** Try loading one image; returns path on success, null on failure */
    function tryLoadImage(path) {
        return new Promise(function (resolve) {
            const img = new Image();
            img.onload = function () { resolve(path); };
            img.onerror = function () { resolve(null); };
            img.src = path;
        });
    }

    /** Try extensions in order and return the first existing path */
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

    /** Priority: list.txt -> config LOADSCREEN_IMAGE_NAMES -> fallback 1~80 */
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
        // Keep references before innerHTML reset
        var savedVideo   = $slideVideo;
        var savedOverlay = $slideVideoOverlay;

        // Clear image slides (video nodes will be reinserted)
        $slides.innerHTML = '';
        $slides.classList.remove('placeholder');

        console.log('[TEAR-LoadScreen] buildSlides started, useVideo:', useVideo);

        if (useVideo) {
            savedVideo.style.display   = '';
            savedVideo.classList.add('active');
            if (savedOverlay) savedOverlay.style.display = '';
            $slides.appendChild(savedVideo);
            if (savedOverlay) $slides.appendChild(savedOverlay);
            console.log('[TEAR-LoadScreen] Video mode enabled');
        } else {
            savedVideo.style.display = 'none';
            savedVideo.classList.remove('active');
            if (savedOverlay) savedOverlay.style.display = 'none';
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
            console.log('[TEAR-LoadScreen] No video/images found, showing placeholder background');
        }

        // Sync global refs after node reinsertion
        $slideVideo       = savedVideo;
        $slideVideoOverlay = savedOverlay;

        console.log('[TEAR-LoadScreen] buildSlides completed, useVideo:', useVideo, 'imageList.length:', imageList.length);
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
        // Cannot switch when only video exists and no images
        if (useVideo && imageList.length === 0) return;
        goTo(currentIndex + 1);
    }

    function prev() {
        // Cannot switch when only video exists and no images
        if (useVideo && imageList.length === 0) return;
        goTo(currentIndex - 1);
    }

    function resetAuto() {
        if (autoTimer) clearInterval(autoTimer);
        // Do not auto-advance while video frame is active
        if (useVideo && currentIndex === 0) return;
        if ((useVideo ? imageList.length : imageList.length) > 1 ||
            (useVideo && imageList.length >= 1)) {
            autoTimer = setInterval(next, AUTO_INTERVAL);
        }
    }

    /** Convert a single tip to HTML: supports string or [primary, secondary] */
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
        /* Avoid rewriting tips by progress to prevent flicker with timed rotation */
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
        // In video mode index 0 is video, so skip lightbox
        if (useVideo && currentIndex === 0) return;
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
        // In video mode currentIndex=0 is video, images are offset by +1
        var imgIndex = useVideo ? currentIndex - 1 : currentIndex;
        var src = imageList[imgIndex];
        if (!src) return;
        var alreadyShown = $lightboxImg.src && String($lightboxImg.src).length > 10;
        if (alreadyShown) {
            $lightboxImg.classList.add('swapping');
            setTimeout(function () {
                $lightboxImg.src = src;
                $lightboxImg.alt = 'Image ' + (imgIndex + 1) + ' / ' + imageList.length;
                $lightboxCounter.textContent = (imgIndex + 1) + ' / ' + imageList.length;
                $lightboxImg.classList.remove('swapping');
            }, 180);
        } else {
            $lightboxImg.src = src;
            $lightboxImg.alt = 'Image ' + (imgIndex + 1) + ' / ' + imageList.length;
            $lightboxCounter.textContent = (imgIndex + 1) + ' / ' + imageList.length;
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
        /* Main view arrows are hidden, no switch binding */
        $dots.addEventListener('click', function (e) {
            var btn = e.target.closest('.dot');
            if (btn && btn.dataset.index !== undefined) {
                var targetIndex = parseInt(btn.dataset.index, 10);
                if (useVideo && currentIndex === 0 && targetIndex !== 0) return;
                goTo(targetIndex);
            }
        });
        /* Background carousel click is disabled */
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
            /* Main view ignores left/right keys; autoplay only */
        });
        /* Touch swipe only works inside lightbox */
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
        
        /* Mouse click ripple effect */
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
        
        /* Sakura effect */
        (function () {
            var sakuraContainer = document.getElementById('sakura-container');
            if (!sakuraContainer) return;
            
            // Check whether sakura effect is enabled
            var sakuraEnabled = typeof window.LOADSCREEN_SAKURA_ENABLED !== 'undefined' && window.LOADSCREEN_SAKURA_ENABLED;
            if (!sakuraEnabled) {
                console.log('[TEAR-LoadScreen] Sakura effect disabled by config');
                return;
            }
            
            console.log('[TEAR-LoadScreen] Sakura effect enabled');
            
            // Sakura color options
            var sakuraColors = [
                'linear-gradient(135deg, #ffb7c5 0%, #ff69b4 100%)',  // pink
                'linear-gradient(135deg, #ffc0cb 0%, #ff1493 100%)',  // deep pink
                'linear-gradient(135deg, #ffe4e1 0%, #db7093 100%)',  // light pink
                'linear-gradient(135deg, #ffd1dc 0%, #c71585 100%)'   // purple pink
            ];
            
            function createSakura(x, y) {
                var petal = document.createElement('div');
                petal.className = 'sakura-petal';
                
                // Random size (8-20px)
                var size = Math.random() * 12 + 8;
                petal.style.width = size + 'px';
                petal.style.height = size + 'px';
                
                // Random color
                var colorIndex = Math.floor(Math.random() * sakuraColors.length);
                petal.style.background = sakuraColors[colorIndex];
                
                // Random start offset around click point
                var offsetX = (Math.random() - 0.5) * 100;
                var offsetY = (Math.random() - 0.5) * 100;
                petal.style.left = (x + offsetX) + 'px';
                petal.style.top = (y + offsetY) + 'px';
                
                // Random rotation
                var rotation = Math.random() * 360;
                petal.style.transform = 'rotate(' + rotation + 'deg)';
                
                // Random animation duration (3-6 seconds)
                var duration = Math.random() * 3 + 3;
                petal.style.animationDuration = duration + 's';
                
                // Random animation delay (0-0.5 seconds)
                petal.style.animationDelay = (Math.random() * 0.5) + 's';
                
                // Random opacity (0.6-0.9)
                petal.style.opacity = Math.random() * 0.3 + 0.6;
                
                // Random horizontal drift (-150px to 150px)
                var driftX = (Math.random() - 0.5) * 300;
                petal.style.setProperty('--sakura-drift', driftX + 'px');
                
                sakuraContainer.appendChild(petal);
                
                // Cleanup
                setTimeout(function () {
                    if (petal.parentNode) {
                        petal.parentNode.removeChild(petal);
                    }
                }, (duration + 1) * 1000);
            }
            
            // Spawn sakura on click
            document.addEventListener('click', function (e) {
                if (e.target.closest('button') || e.target.closest('input')) return;
                
                // Spawn 3-8 petals randomly
                var count = Math.floor(Math.random() * 6) + 3;
                for (var i = 0; i < count; i++) {
                    createSakura(e.clientX, e.clientY);
                }
            });
            
            // Occasionally auto-spawn petals for ambience
            setInterval(function () {
                if (Math.random() > 0.7) { // 30% probability
                    var x = Math.random() * window.innerWidth;
                    createSakura(x, -20);
                }
            }, 2000);
        })();
        // Use addEventListener only to avoid duplicate message handling
        window.addEventListener('message', onMessage);
    }

    function initVideo() {
        useVideo = typeof window.LOADSCREEN_USE_VIDEO !== 'undefined' ? window.LOADSCREEN_USE_VIDEO : false;
        console.log('[TEAR-LoadScreen] initVideo started, useVideo:', useVideo);
        
        if (useVideo) {
            const videoUrl = typeof window.LOADSCREEN_VIDEO_URL !== 'undefined' ? window.LOADSCREEN_VIDEO_URL : '';
            let videoMuted = typeof window.LOADSCREEN_VIDEO_MUTED !== 'undefined' ? window.LOADSCREEN_VIDEO_MUTED : true;
            const videoLoop = typeof window.LOADSCREEN_VIDEO_LOOP !== 'undefined' ? window.LOADSCREEN_VIDEO_LOOP : true;
            const bgmSource = typeof window.LOADSCREEN_BGM_SOURCE !== 'undefined' ? window.LOADSCREEN_BGM_SOURCE : 3;
            const defaultVolume = typeof window.LOADSCREEN_DEFAULT_VOLUME !== 'undefined' ? Math.max(0, Math.min(100, window.LOADSCREEN_DEFAULT_VOLUME)) : 80;
            
            console.log('[TEAR-LoadScreen] Video config:', { videoUrl, videoMuted, videoLoop, bgmSource });
            
            if (bgmSource === 1 || bgmSource === 'video' || bgmSource === 'A' || bgmSource === 'a') {
                videoMuted = false;
            }
            
            if (videoUrl) {
                console.log('[TEAR-LoadScreen] Setting video source:', videoUrl);
                
                var $videoSource = $slideVideo.querySelector('source');
                if ($videoSource) {
                    $videoSource.src = videoUrl;
                } else {
                    $slideVideo.src = videoUrl;
                }
                
                $slideVideo.muted = videoMuted;
                $slideVideo.loop = videoLoop;
                if (videoLoop) {
                    $slideVideo.setAttribute('loop', 'loop');
                } else {
                    $slideVideo.removeAttribute('loop');
                }
                $slideVideo.playsInline = true;
                $slideVideo.volume = defaultVolume / 100;
                $slideVideo.load();
                console.log('[TEAR-LoadScreen] Video element loaded, src:', $slideVideo.src);
                
                $slideVideo.addEventListener('loadedmetadata', function() {
                    console.log('[TEAR-LoadScreen] Video metadata loaded');
                    if (currentIndex === 0) {
                        $slideVideo.currentTime = 0;
                        $slideVideo.play().catch(function(err) {
                            console.log('[TEAR-LoadScreen] Video autoplay failed:', err);
                        });
                    }
                });
                
                $slideVideo.addEventListener('canplay', function() {
                    console.log('[TEAR-LoadScreen] Video can play');
                    if (currentIndex === 0 && $slideVideo.paused) {
                        $slideVideo.play().catch(function() {});
                    }
                });

                // In some FiveM CEF environments loop can be unreliable, add ended fallback
                $slideVideo.addEventListener('ended', function() {
                    if (!useVideo || currentIndex !== 0) return;
                    if (!videoLoop) return;
                    $slideVideo.currentTime = 0;
                    $slideVideo.play().catch(function(err) {
                        console.log('[TEAR-LoadScreen] Replay after ended failed:', err);
                    });
                });
                
                $slideVideo.addEventListener('error', function(err) {
                    console.error('[TEAR-LoadScreen] Video load error:', err);
                    console.error('[TEAR-LoadScreen] Video URL:', videoUrl);
                    console.warn('[TEAR-LoadScreen] Video load failed, falling back to image carousel mode');
                    useVideo = false;
                    // Rebuild DOM on video load failure to keep UI/state in sync
                    buildSlides();
                    buildDots();
                    resetAuto();
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
                console.warn('[TEAR-LoadScreen] Video URL is not set');
                useVideo = false;
            }
        } else {
            console.log('[TEAR-LoadScreen] Video mode disabled');
        }
    }

    function init() {
        console.log('[TEAR-LoadScreen] ========================================');
        console.log('[TEAR-LoadScreen] Starting loadscreen initialization');
        console.log('[TEAR-LoadScreen] ========================================');
        
        initDOMElements();
        
        updateProgress(0);
        setTipText(0);
        startTipRotate();
        bindEvents();
        
        console.log('[TEAR-LoadScreen] Initializing video...');
        initVideo();
        
        console.log('[TEAR-LoadScreen] Starting image discovery...');
        discoverImages().then(function (list) {
            console.log('[TEAR-LoadScreen] Image discovery completed, count:', list.length);
            imageList = list;
            buildSlides();
            buildDots();
            applyViewMode();
            resetAuto();
        }).catch(function(err) {
            console.error('[TEAR-LoadScreen] Image discovery failed:', err);
            imageList = [];
            buildSlides();
            buildDots();
            applyViewMode();
        }).finally(function() {
            console.log('[TEAR-LoadScreen] ========================================');
            console.log('[TEAR-LoadScreen] Loadscreen initialization completed');
            console.log('[TEAR-LoadScreen] Mode:', useVideo ? 'video' : 'image');
            console.log('[TEAR-LoadScreen] Image count:', imageList.length);
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
