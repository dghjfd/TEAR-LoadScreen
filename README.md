**[中文版](README_zh.md)** | English

---

# TEAR-LoadScreen — FiveM Loading Screen

[![Version](https://img.shields.io/badge/version-2.1.6-blue.svg)](fxmanifest.lua)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Game](https://img.shields.io/badge/game-FiveM-orange.svg)](https://fivem.net/)
[![Protection](https://img.shields.io/badge/protection-TEAR--Validation-red.svg)]()

> FiveM loadscreen with image carousel, video background support, and comprehensive validation protection system.

## ⚠️ Protected Resource

**TEAR-LoadScreen is a protected resource.**

- Resource name: `TEAR-LoadScreen` (CANNOT be renamed)
- Author: `TEAR` (CANNOT be modified)
- Validation: Enabled (server-side + client-side)
- Anti-tamper: Active

Modifying any of the above will result in the resource being blocked.

## ✨ Features

### Core Features
- 🎬 **Video Background**: Support for MP4, WebM, OGG video playback
- 🖼️ **Image Carousel**: Up to 80 images with mixed format support
- 🔍 **Fullscreen Lightbox**: Click to view images in fullscreen mode
- 🎵 **Multi-Source Audio**: Video audio, local files, or external URLs
- 🎛️ **Volume Control**: Configurable default volume with real-time adjustment
- 📊 **Loading Progress**: Progress bar synced with FiveM `loadProgress`
- 💬 **Custom Tips**: Rotating tips with bilingual support
- 🏷️ **Server Logo**: Toggle-able server logo display

### Interaction Methods
- ⌨️ **← / →** keys: Previous / Next image
- 👆 **Left/Right buttons**: Navigate slides
- ⚫ **Bottom dots**: Jump to specific slide
- 📱 **Touch swipe**: Mobile-friendly navigation
- 🔇 **Mini player**: Play/pause and volume control

## 📦 Installation

1. Download `TEAR-LoadScreen` and place the folder in your `resources` directory
2. Add to `server.cfg`:
   ```cfg
   loadscreen 'TEAR-LoadScreen'
   ```
   Or for subfolder:
   ```cfg
   loadscreen 'your_folder/TEAR-LoadScreen'
   ```
3. Configure `config.js` as needed
4. Add your media files to the appropriate folders

## 🎬 Video Configuration

Edit `config.js`:

```javascript
window.LOADSCREEN_USE_VIDEO = true;
window.LOADSCREEN_VIDEO_URL = 'videos/intro.mp4';
window.LOADSCREEN_VIDEO_MUTED = false;
window.LOADSCREEN_VIDEO_LOOP = true;
```

**Supported formats:** `.mp4`, `.webm`, `.ogg`
**Location:** `videos/` folder

## 🖼️ Image Configuration

### Method 1: Auto Numbering
Name images as `1.jpg`, `2.jpg`, `3.jpg`... up to 80 images.

### Method 2: Config Specification
```javascript
window.LOADSCREEN_IMAGE_NAMES = ['image1', 'image2', 'image3'];
```

### Method 3: list.txt
Create `list.txt` in `images/` with one image path per line.

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.bmp`
**Location:** `images/` folder

## 🎵 Audio Configuration

```javascript
window.LOADSCREEN_BGM_SOURCE = 1;  // 1=Video, 2=Local file, 3=External URL

// For local file:
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';

// For external URL:
window.LOADSCREEN_BGM_URL = 'https://example.com/music.mp3';

window.LOADSCREEN_DEFAULT_VOLUME = 80;  // 0-100
```

**Supported formats:** `.mp3`, `.wav`, `.ogg`
**Location:** `audio/` folder

## 🏷️ Logo Configuration

```javascript
window.LOADSCREEN_LOGO_ENABLED = true;
window.LOADSCREEN_LOGO_URL = 'images/logo.png';
```

## 💬 Custom Tips

```javascript
window.LOADSCREEN_TIPS = [
    'Connecting to server...',
    'Loading resources...',
    ['Welcome', '欢迎'],  // Bilingual format
    'Your custom tips...'
];
```

## 📂 File Structure

```
TEAR-LoadScreen/
├── fxmanifest.lua
├── index.html
├── style.css
├── config.js
├── script.js
├── cl_validation.lua
├── cl_validation.js
├── sv_validation.lua
├── images/
│   ├── logo.png
│   ├── 1.jpg
│   └── ...
├── videos/
│   └── intro.mp4
├── audio/
│   └── bgm.mp3
├── LICENSE
├── README.md
└── README_zh.md
```

## ⚙️ Advanced Configuration

In `script.js`:

| Config | Description | Default |
|--------|-------------|---------|
| `AUTO_INTERVAL` | Auto-slide interval (ms) | 5500 |
| `TIP_ROTATE_INTERVAL` | Tip rotation interval (ms) | 3000 |

### Hide Default Spinner

In `server.cfg`:
```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

## 📋 Requirements

- FiveM Client
- No additional dependencies

## 📄 License

GPL-3.0 License - See [LICENSE](LICENSE) file for details

---

**Version: 2.1.6** | **Author: TEAR**
