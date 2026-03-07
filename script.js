(function () {
    'use strict';

    const MAX_INDEX = 80;
    /* 自动识别的图片后缀（与 fxmanifest 中 images/*.xxx 一致） */
    const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    const AUTO_INTERVAL = 5500;
    /** 底部提示条文案，可自定义：在加载 index.html 前设置 window.LOADSCREEN_TIPS = ['提示1','提示2',...] */
    const TIPS = (typeof window.LOADSCREEN_TIPS !== 'undefined' && Array.isArray(window.LOADSCREEN_TIPS) && window.LOADSCREEN_TIPS.length > 0)
        ? window.LOADSCREEN_TIPS
        : [
            '正在连接服务器…',
            '加载资源中，请稍候',
            '即将进入游戏',
            '感谢您的耐心等待',
            '欢迎来到本服'
        ];
    const TIP_ROTATE_INTERVAL = 3000;

    let imageList = [];
    let currentIndex = 0;
    let autoTimer = null;
    let progressPercent = 0;
    let tipRotateTimer = null;
    let tipRotateIndex = 0;

    const $slides = document.getElementById('slides');
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

    /** 尝试加载单张图，成功返回路径，失败返回 null */
    function tryLoadImage(path) {
        return new Promise(function (resolve) {
            const img = new Image();
            img.onload = function () { resolve(path); };
            img.onerror = function () { resolve(null); };
            img.src = path;
        });
    }

    /** 对某个名称（无后缀）按扩展名顺序尝试，返回第一个存在的路径 */
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

    /** 优先 list.txt（每行一个路径）；否则 config 中 LOADSCREEN_IMAGE_NAMES（无后缀）；最后 1~80 兜底 */
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
        imageList.forEach(function (src, i) {
            const div = document.createElement('div');
            div.className = 'slide' + (i === 0 ? ' active' : '');
            div.style.backgroundImage = "url('" + src + "')";
            div.dataset.index = String(i);
            div.setAttribute('aria-hidden', 'true');
            $slides.appendChild(div);
        });
        if (imageList.length === 0) {
            $slides.classList.add('placeholder');
            const div = document.createElement('div');
            div.className = 'slide active';
            div.style.backgroundImage = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
            $slides.appendChild(div);
        }
    }

    function buildDots() {
        $dots.innerHTML = '';
        if (imageList.length <= 1) return;
        for (let i = 0; i < imageList.length; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dot' + (i === 0 ? ' active' : '');
            btn.dataset.index = String(i);
            btn.setAttribute('aria-label', '第' + (i + 1) + '张');
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
            cell.setAttribute('aria-label', '图片 ' + (i + 1) + ' / ' + imageList.length);
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
        const len = imageList.length || 1;
        currentIndex = ((index % len) + len) % len;
        document.querySelectorAll('.slide').forEach(function (el, i) {
            el.classList.toggle('active', i === currentIndex);
        });
        document.querySelectorAll('.dot').forEach(function (el, i) {
            el.classList.toggle('active', i === currentIndex);
            if (i === currentIndex && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        });
        document.querySelectorAll('.grid-cell').forEach(function (el, i) {
            el.classList.toggle('active', i === currentIndex);
        });
        if ($lightbox && $lightbox.classList.contains('open')) updateLightboxContent();
        resetAuto();
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function prev() {
        goTo(currentIndex - 1);
    }

    function resetAuto() {
        if (autoTimer) clearInterval(autoTimer);
        if (imageList.length > 1) {
            autoTimer = setInterval(next, AUTO_INTERVAL);
        }
    }

    /** 将单条文案转为 HTML：支持字符串或 [中文, 英文]，英文显示在下一行括号内 */
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
        /* 不再根据进度改写文案，避免与定时轮播冲突导致闪烁；仅由 startTipRotate 每 3 秒切换 */
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
                $lightboxImg.alt = '图片 ' + (currentIndex + 1) + ' / ' + imageList.length;
                $lightboxCounter.textContent = (currentIndex + 1) + ' / ' + imageList.length;
                $lightboxImg.classList.remove('swapping');
            }, 180);
        } else {
            $lightboxImg.src = src;
            $lightboxImg.alt = '图片 ' + (currentIndex + 1) + ' / ' + imageList.length;
            $lightboxCounter.textContent = (currentIndex + 1) + ' / ' + imageList.length;
        }
    }

    function bindEvents() {
        var logoUrl = typeof window.LOADSCREEN_LOGO_URL !== 'undefined' ? String(window.LOADSCREEN_LOGO_URL).trim() : '';
        var $logoWrap = document.getElementById('server-logo-wrap');
        var $logoImg = document.getElementById('server-logo');
        if ($logoWrap && $logoImg) {
            if (logoUrl) {
                $logoImg.src = logoUrl;
                $logoWrap.setAttribute('aria-hidden', 'false');
                $logoImg.onerror = function () { $logoWrap.style.display = 'none'; };
            } else {
                $logoWrap.style.display = 'none';
            }
        }
        /* 主界面左右箭头已隐藏，不再绑定切换 */
        $dots.addEventListener('click', function (e) {
            var btn = e.target.closest('.dot');
            if (btn && btn.dataset.index !== undefined) {
                goTo(parseInt(btn.dataset.index, 10));
            }
        });
        /* 背景轮播图点击无效果，不再打开大图 */
        $lightboxClose.addEventListener('click', closeLightbox);
        $lightboxBackdrop.addEventListener('click', closeLightbox);
        $lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); updateLightboxContent(); });
        $lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); next(); updateLightboxContent(); });
        var $bgm = document.getElementById('bgm');
        var $playBtn = document.getElementById('player-play');
        var $volumeRange = document.getElementById('player-volume');
        var bgmUrl = typeof window.LOADSCREEN_BGM_URL !== 'undefined' ? String(window.LOADSCREEN_BGM_URL).trim() : '';
        if ($bgm && bgmUrl) {
            $bgm.src = bgmUrl;
            if ($volumeRange) $bgm.volume = parseInt($volumeRange.value, 10) / 100;
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
        if ($bgm && $playBtn) {
            $playBtn.addEventListener('click', function () {
                if ($bgm.paused) {
                    if ($bgm.src) $bgm.play().catch(function () {});
                    $playBtn.classList.add('playing');
                } else {
                    $bgm.pause();
                    $playBtn.classList.remove('playing');
                }
            });
            $bgm.addEventListener('play', function () { $playBtn.classList.add('playing'); });
            $bgm.addEventListener('pause', function () { $playBtn.classList.remove('playing'); });
        }
        if ($bgm && $volumeRange) {
            $volumeRange.addEventListener('input', function () {
                $bgm.volume = parseInt($volumeRange.value, 10) / 100;
            });
            $bgm.volume = parseInt($volumeRange.value, 10) / 100;
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
        /* 触摸滑动仅在大图灯箱内生效，主界面不切换 */
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
        /* 鼠标点击涟漪特效 */
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

    function init() {
        updateProgress(0);
        setTipText(0);
        startTipRotate();
        bindEvents();
        discoverImages().then(function (list) {
            imageList = list;
            buildSlides();
            buildDots();
            applyViewMode();
            resetAuto();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
