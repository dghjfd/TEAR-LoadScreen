**[中文版](README_zh.md)** | English

---

# TEA-LoadScreen — Image/Video Carousel Loading Screen

[![Version](https://img.shields.io/badge/version-2.1.4-blue.svg)](fxmanifest.lua)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Game](https://img.shields.io/badge/game-FiveM-orange.svg)](https://fivem.net/)

> FiveM loading screen: **auto-detects** images in the `images` folder and runs a carousel, **supports video backgrounds**, **multiple audio sources**, with rich interaction.

## ✨ Features

### Core Features
- 🎬 **Video Background**: Support using video as the first slide
- 🖼️ **Many Images**: Up to **80 images**, **mixed formats**
- 🔍 **Fullscreen View**: Click current slide to open fullscreen lightbox
- 🎵 **Multiple Audio Sources**: Support video audio, local files, external URLs
- 🎛️ **Volume Control**: Configurable default volume, real-time adjustment
- 📊 **Loading Progress**: Bottom progress bar synced with FiveM `loadProgress`
- 💬 **Custom Tips**: Multiple rotating tips, supports bilingual (Chinese/English)
- 🏷️ **Logo Toggle**: Control server logo display in top-left corner

### Interaction Methods
- ⌨️ **← / →** keys: previous / next image
- 👆 **Left/right buttons**: switch slides
- ⚫ **Bottom dots**: jump to specific slide
- 📱 **Touch swipe** left/right (mobile)
- 🔇 **Mini player** to control play/pause and volume

## 📦 Installation

1. Put the whole `TEA-LoadScreen` folder under `resources`
2. In `server.cfg`, use **only one** loadscreen resource:
   ```cfg
   loadscreen 'TEA-LoadScreen'
   ```
   Or if in a subfolder:
   ```cfg
   loadscreen 'your_folder/TEA-LoadScreen'
   ```
3. Add your media files (see instructions below)

## 🎬 Video Configuration

### Enable Video
Set in `config.js`:
```javascript
window.LOADSCREEN_USE_VIDEO = true;
window.LOADSCREEN_VIDEO_URL = 'videos/intro.mp4';
window.LOADSCREEN_VIDEO_MUTED = false;  // Muted or not
window.LOADSCREEN_VIDEO_LOOP = true;    // Loop or not
```

### Supported Video Formats
- `.mp4` (recommended)
- `.webm`
- `.ogg`

> Place video files in `videos/` folder

## 🖼️ Image Configuration

### Usage Methods

**Method 1: Auto Numbering (Simplest)**
- Name images as `1.jpg`, `2.jpg`, `3.jpg`… or `1.png`, `2.png`…
- System will automatically load images 1~80 in order

**Method 2: Config File Specification**
```javascript
window.LOADSCREEN_IMAGE_NAMES = ['logo', 'bg', 'intro'];
```

**Method 3: Using list.txt**
- Create `list.txt` in `images/` folder
- Write one image path per line

### Supported Image Formats
| Format | Example | Note |
|--------|---------|------|
| jpg/jpeg | 1.jpg, 2.jpg | Listed in manifest |
| png | 1.png, 2.png | Listed in manifest |
| webp | 1.webp, 2.webp | Listed in manifest |
| gif | 1.gif, 2.gif | Listed in manifest |
| bmp | 1.bmp, 2.bmp | Listed in manifest |

> Place image files in `images/` folder

## 🎵 Audio Configuration

### Audio Source Types
Choose audio source in `config.js`:
```javascript
window.LOADSCREEN_BGM_SOURCE = 1;  // 1=video audio, 2=local file, 3=external URL
```

#### 1. Use Video Audio
```javascript
window.LOADSCREEN_BGM_SOURCE = 1;
window.LOADSCREEN_USE_VIDEO = true;  // Ensure video is enabled
```

#### 2. Use Local Audio File
```javascript
window.LOADSCREEN_BGM_SOURCE = 2;
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';
```

#### 3. Use External URL
```javascript
window.LOADSCREEN_BGM_SOURCE = 3;
window.LOADSCREEN_BGM_URL = 'http://example.com/music.mp3';
```

### Volume Configuration
```javascript
window.LOADSCREEN_DEFAULT_VOLUME = 80;  // 0-100
```

### Supported Audio Formats
- `.mp3` (recommended)
- `.wav`
- `.ogg`

> Place audio files in `audio/` folder

## 🏷️ Logo Configuration

```javascript
window.LOADSCREEN_LOGO_ENABLED = true;  // Show/hide logo
window.LOADSCREEN_LOGO_URL = 'images/logo.png';
```

## 💬 Custom Tips

Modify the tips array in `config.js`:

```javascript
window.LOADSCREEN_TIPS = [
    'Connecting to server…',
    'Loading resources, please wait',
    'Entering game soon',
    ['Welcome to our server', '欢迎来到本服'],  // Bilingual format
    'Your other tips…'
];
```

## 📂 File Structure

```
TEA-LoadScreen/
├── fxmanifest.lua
├── index.html
├── style.css
├── config.js          ← Main configuration file
├── script.js
├── images/
│   ├── Please place images here.txt
│   ├── 请将图片放于此文件夹.txt
│   ├── logo.png
│   ├── 1.jpg
│   ├── 2.jpg
│   └── …
├── videos/
│   ├── Please place video files here.txt
│   ├── 请将视频放于此文件夹.txt
│   ├── intro.mp4
│   └── …
├── audio/
│   ├── Please place audio files here.txt
│   ├── 请将音频放于此文件夹.txt
│   ├── bgm.mp3
│   └── …
├── README.md
└── README_zh.md
```

## ⚙️ Advanced Configuration

Adjust at the top of `script.js`:

| Config | Description | Default |
|--------|-------------|---------|
| `AUTO_INTERVAL` | Auto-slide interval (ms) | 5500 |
| `TIP_ROTATE_INTERVAL` | Tip rotation interval (ms) | 3000 |

### Hide Default Loading Spinner
Add to `server.cfg`:
```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

## 📋 Requirements

- FiveM client; no other dependencies

## 📄 License

This project is licensed under GPL-3.0 - see [LICENSE](LICENSE) file for details

---

**Version: 2.1.4** | **Author: TEA**
