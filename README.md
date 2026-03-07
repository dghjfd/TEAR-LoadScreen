**[中文版](README_zh.md)** | English

---

# TEA-LoadScreen — Image Carousel Loading Screen

FiveM loading screen: **auto-detects** images in the `images` folder and runs a carousel, **supports many images** (up to 80), **click to view fullscreen**, with rich interaction.

## Features

- **Many images**: Up to **80 images**, **mixed formats**: name each by number (`1`, `2`, `3`…). Extension can be **jpg / jpeg / png / webp / gif / bmp**, e.g. `1.jpg`, `2.png`, `3.png`, `4.jpg`, `5.webp`. For each number only the first existing format is used; order is 1, 2, 3…
- **Fullscreen view**: **Click the current slide** to open fullscreen; use ←/→ or tap to switch, Esc or click background to close. Fullscreen also supports ←/→ and touch swipe.
- **Rich interaction**:
  - **← / →** keys: previous / next image
  - **Left/right buttons**: switch slides
  - **Bottom dots**: jump to that slide (dots scroll when there are many)
  - **Touch swipe** left/right (mobile)
- **Loading progress**: Bottom progress bar is synced with FiveM `loadProgress`, showing load percentage.
- **Bottom tip line**: One line of text below the progress bar (e.g. “Connecting to server…”) for status or slogans; **multiple tips** can be set and rotated during load (see “Custom tips” below).

## Installation

1. Put the whole `TEA-LoadScreen` folder under `resources` (avoid spaces in path, e.g. use `TEA-LoadScreen`).
2. In `server.cfg`, use **only one** loadscreen resource:
   ```cfg
   loadscreen 'TEA-LoadScreen'
   ```
   Or if in a subfolder:
   ```cfg
   loadscreen 'your_folder/TEA-LoadScreen'
   ```
3. Add your images in the `images` folder, named `1.jpg`, `2.jpg`, … or `1.png`, `2.png`, …

## Image Naming

- **Numbered names**: `1`, `2`, `3`… up to `80`; any of the supported extensions.
- **Mixed formats**: You can have `1.jpg`, `2.png`, `3.png`, `4.jpg`, `5.webp` etc. in the same folder. For each number the **first existing format** is used (order: jpg → jpeg → png → webp → gif → bmp); order is by number.

| Format   | Example       | Note |
|----------|---------------|------|
| jpg/jpeg | 1.jpg, 2.jpg  | Listed in manifest |
| png      | 1.png, 2.png  | Listed in manifest |
| webp     | 1.webp, 2.webp | Listed in manifest |
| gif      | 1.gif, 2.gif  | Listed in manifest |
| bmp      | 1.bmp, 2.bmp  | Listed in manifest |

`fxmanifest.lua` already lists 1–80 for jpg, png, webp, gif, bmp. For custom names (e.g. `banner_01.png`), add the path in `files` manually.

## Custom Tips (Bottom Tip Line)

The line under the progress bar (e.g. “Connecting to server…”) can be multiple tips; they rotate during load and change about every 4 seconds.

**Option 1 (recommended)** — Edit **`config.js`** and set the `window.LOADSCREEN_TIPS` array:

```javascript
window.LOADSCREEN_TIPS = [
    'Connecting to server…',
    'Loading resources, please wait',
    'Entering game soon',
    'Welcome to the server',
    'Your other tips…'
];
```

**Option 2** — In `index.html`, before `script.js`, add:

```html
<script>window.LOADSCREEN_TIPS = ['Tip 1','Tip 2','Tip 3'];</script>
```

## Bottom Mini Player

The **left side** of the bottom bar is a mini player: **play/pause** and **volume**, with a glassmorphism + purple-blue gradient style.  
Background music uses an **external URL**: in **`config.js`** set `window.LOADSCREEN_BGM_URL = 'https://your-domain-or-cdn/xxx.mp3'`. Leave empty to disable. No local file required.

## Optional Config

- **Slide interval**: In `script.js` top, change `AUTO_INTERVAL` (milliseconds), default 5500.
- **Tip rotation interval**: In `script.js` top, change `TIP_ROTATE_INTERVAL` (milliseconds), default 4000.
- **Hide default loading spinner**: In `server.cfg` add:
  ```cfg
  setr sv_showBusySpinnerOnLoadingScreen false
  ```

## File Structure

```
TEA-LoadScreen/
├── fxmanifest.lua
├── index.html
├── style.css
├── config.js   ← edit for tips & BGM
├── script.js
├── images/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── …
├── README.md
└── README_zh.md
```

## Requirements

- FiveM client; no other dependencies.
