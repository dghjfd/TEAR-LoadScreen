<div align="center">

# 🎬 TEAR-LoadScreen

**A feature-rich, highly customizable loading screen for FiveM**

[![Version](https://img.shields.io/badge/version-2.2.7-4f8ef7?style=for-the-badge&logo=github)](fxmanifest.lua)
[![License](https://img.shields.io/badge/license-GPL--3.0-22c55e?style=for-the-badge)](LICENSE)
[![FiveM](https://img.shields.io/badge/platform-FiveM-f97316?style=for-the-badge)](https://fivem.net/)
[![Protection](https://img.shields.io/badge/protection-TEAR--Validation-ef4444?style=for-the-badge)]()

[中文版](README_zh.md) · **English**

</div>

---

## 📖 Overview

TEAR-LoadScreen is a fully-featured FiveM loading screen resource with video backgrounds, image carousels, fullscreen lightbox, background music, and a complete dual-sided validation protection system — ready to use out of the box and highly configurable.

---

## ⚠️ Protected Resource

> **This resource is protected by TEAR-Validation. The following fields must NOT be modified, or the resource will be automatically disabled.**

| Field | Value | Note |
|-------|-------|------|
| Resource Name | `TEAR-LoadScreen` | Cannot be renamed |
| Author | `TEARLESSVVOID` | Cannot be modified |
| Validation | Server-side + Client-side | Enabled |
| Anti-tamper | Active | — |

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🎬 Media Support**
- Video background (MP4 / WebM / OGG)
- Image carousel (up to 80 images)
- Fullscreen lightbox viewer
- Mixed format support

</td>
<td width="50%">

**🎵 Audio System**
- Video built-in audio track
- Local BGM file playback
- External audio URL streaming
- Real-time volume control

</td>
</tr>
<tr>
<td>

**📊 Loading System**
- Native FiveM progress bar sync
- Custom rotating tip messages
- Bilingual tip support (CN/EN)
- Server logo display

</td>
<td>

**🖱️ Interaction**
- `← / →` keyboard navigation
- Left/Right button controls
- Bottom dot indicators
- Touch swipe (mobile-friendly)
- Mini player controls

</td>
</tr>
</table>

---

## 📦 Installation

**Step 1** — Place the `TEAR-LoadScreen` folder into your server's `resources` directory

**Step 2** — Register the loading screen in `server.cfg`:

```cfg
# Root directory
loadscreen 'TEAR-LoadScreen'

# Or from a subfolder
loadscreen 'your_folder/TEAR-LoadScreen'
```

**Step 3** — Edit `config.js` to customize your setup

**Step 4** — Add your media files to the appropriate directories (`images/`, `videos/`, `audio/`)

---

## ⚙️ Configuration

### 🎬 Video Background

```javascript
window.LOADSCREEN_USE_VIDEO   = true;               // Enable video mode
window.LOADSCREEN_VIDEO_URL   = 'videos/intro.mp4'; // Path to video file
window.LOADSCREEN_VIDEO_MUTED = false;              // Mute video audio
window.LOADSCREEN_VIDEO_LOOP  = true;               // Loop video
```

> **Supported formats:** `.mp4` `.webm` `.ogg` — Place files in the `videos/` directory

---

### 🖼️ Image Carousel

Three methods are available — pick whichever suits you:

**Method 1: Auto Numbering** (simplest)

Name your images `1.jpg`, `2.jpg`, `3.jpg`... up to **80** images.

**Method 2: Config List**

```javascript
window.LOADSCREEN_IMAGE_NAMES = ['banner1', 'banner2', 'city'];
```

**Method 3: List File**

Create a `list.txt` file inside `images/`, one path per line:

```
images/banner1.jpg
images/city.png
images/night.webp
```

> **Supported formats:** `.jpg` `.jpeg` `.png` `.webp` `.gif` `.bmp` — Place files in the `images/` directory

---

### 🎵 Audio Configuration

```javascript
window.LOADSCREEN_BGM_SOURCE    = 1;                            // 1=Video track  2=Local file  3=External URL
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';              // Local audio path
window.LOADSCREEN_BGM_URL       = 'https://example.com/bgm.mp3'; // External audio URL
window.LOADSCREEN_DEFAULT_VOLUME = 80;                          // Default volume (0-100)
```

> **Supported formats:** `.mp3` `.wav` `.ogg` — Place files in the `audio/` directory

---

### 🏷️ Server Logo

```javascript
window.LOADSCREEN_LOGO_ENABLED = true;
window.LOADSCREEN_LOGO_URL     = 'images/logo.png';
```

---

### 💬 Custom Tips

```javascript
window.LOADSCREEN_TIPS = [
    'Connecting to server...',
    'Loading resources, please wait...',
    ['Welcome to our server', '欢迎来到服务器'],  // Bilingual format [EN, CN]
    'Your custom tip message here'
];
```

---

### 🔧 Advanced Parameters

Adjust the following constants at the top of `script.js`:

| Parameter | Description | Default |
|-----------|-------------|:-------:|
| `AUTO_INTERVAL` | Auto-slide interval (ms) | `5500` |
| `TIP_ROTATE_INTERVAL` | Tip rotation interval (ms) | `3000` |

**Hide the default loading spinner** — add to `server.cfg`:

```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

---

## 📂 File Structure

```
TEAR-LoadScreen/
├── 📄 fxmanifest.lua       — FiveM resource manifest
├── 📄 index.html           — Main HTML page
├── 🎨 style.css            — Stylesheet
├── ⚙️  config.js            — User configuration (edit this)
├── 📜 script.js            — Core logic
├── 🔐 cl_validation.lua    — Client-side validation (Lua)
├── 🔐 cl_validation.js     — Client-side validation (JS)
├── 🔐 sv_validation.lua    — Server-side validation
├── 🖼️  images/              — Image directory
│   ├── logo.png
│   ├── 1.jpg
│   └── ...
├── 🎬 videos/              — Video directory
│   └── intro.mp4
├── 🎵 audio/               — Audio directory
│   └── bgm.mp3
├── 📄 LICENSE
├── 📄 README.md
└── 📄 README_zh.md
```

---

## 📋 Requirements

- FiveM Client (no additional dependencies)

## 📄 License

This project is licensed under **GPL-3.0** — see the [LICENSE](LICENSE) file for details

---

<div align="center">

**Version 2.2.7** · Author **TEARLESSVVOID**

*Keep the resource name `TEAR-LoadScreen` and author info unchanged,  
or the validation system will automatically disable this resource.*

</div>
