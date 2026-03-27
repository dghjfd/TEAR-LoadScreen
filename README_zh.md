**[English](README.md)** | 中文版

---

# TEAR-LoadScreen — FiveM 加载屏幕

[![Version](https://img.shields.io/badge/version-2.1.6-blue.svg)](fxmanifest.lua)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Game](https://img.shields.io/badge/game-FiveM-orange.svg)](https://fivem.net/)
[![Protection](https://img.shields.io/badge/protection-TEAR--Validation-red.svg)]()

> FiveM 加载屏幕，支持图片轮播、视频背景，以及完整的验证保护系统。

## ⚠️ 受保护的资源

**TEAR-LoadScreen 是一个受保护的资源。**

- 资源名称：`TEAR-LoadScreen`（禁止修改）
- 作者：`TEAR`（禁止修改）
- 验证：已启用（服务端 + 客户端）
- 反篡改：已激活

修改以上任何一项将导致资源被禁用。

## ✨ 功能特性

### 核心功能
- 🎬 **视频背景**：支持 MP4、WebM、OGG 格式视频播放
- 🖼️ **图片轮播**：最多支持 80 张图片，混合格式支持
- 🔍 **全屏灯箱**：点击图片进入全屏查看模式
- 🎵 **多源音频**：视频音频、本地文件或外部链接
- 🎛️ **音量控制**：可配置默认音量，实时调节
- 📊 **加载进度**：进度条与 FiveM `loadProgress` 同步
- 💬 **自定义提示**：轮播提示，支持中英文双语
- 🏷️ **服务器 LOGO**：可开关的服务器标识显示

### 交互方式
- ⌨️ **← / →** 键：上一张 / 下一张
- 👆 **左右按钮**：切换幻灯片
- ⚫ **底部圆点**：跳转到指定图片
- 📱 **触摸滑动**：移动端友好导航
- 🔇 **迷你播放器**：播放/暂停和音量控制

## 📦 安装

1. 下载 `TEAR-LoadScreen` 并将文件夹放入 `resources` 目录
2. 在 `server.cfg` 中添加：
   ```cfg
   loadscreen 'TEAR-LoadScreen'
   ```
   或子目录：
   ```cfg
   loadscreen '你的目录/TEAR-LoadScreen'
   ```
3. 根据需要配置 `config.js`
4. 将媒体文件添加到对应文件夹

## 🎬 视频配置

编辑 `config.js`：

```javascript
window.LOADSCREEN_USE_VIDEO = true;
window.LOADSCREEN_VIDEO_URL = 'videos/intro.mp4';
window.LOADSCREEN_VIDEO_MUTED = false;
window.LOADSCREEN_VIDEO_LOOP = true;
```

**支持格式：** `.mp4`、`.webm`、`.ogg`
**位置：** `videos/` 文件夹

## 🖼️ 图片配置

### 方法一：自动编号
将图片命名为 `1.jpg`、`2.jpg`、`3.jpg`... 最多 80 张。

### 方法二：配置指定
```javascript
window.LOADSCREEN_IMAGE_NAMES = ['图片1', '图片2', '图片3'];
```

### 方法三：list.txt
在 `images/` 中创建 `list.txt`，每行写一个图片路径。

**支持格式：** `.jpg`、`.jpeg`、`.png`、`.webp`、`.gif`、`.bmp`
**位置：** `images/` 文件夹

## 🎵 音频配置

```javascript
window.LOADSCREEN_BGM_SOURCE = 1;  // 1=视频, 2=本地文件, 3=外部链接

// 本地文件：
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';

// 外部链接：
window.LOADSCREEN_BGM_URL = 'https://example.com/music.mp3';

window.LOADSCREEN_DEFAULT_VOLUME = 80;  // 0-100
```

**支持格式：** `.mp3`、`.wav`、`.ogg`
**位置：** `audio/` 文件夹

## 🏷️ LOGO 配置

```javascript
window.LOADSCREEN_LOGO_ENABLED = true;
window.LOADSCREEN_LOGO_URL = 'images/logo.png';
```

## 💬 自定义提示

```javascript
window.LOADSCREEN_TIPS = [
    '正在连接服务器...',
    '加载资源中...',
    ['欢迎', 'Welcome'],  // 双语格式
    '你的自定义提示...'
];
```

## 📂 文件结构

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

## ⚙️ 高级配置

在 `script.js` 中调整：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `AUTO_INTERVAL` | 自动轮播间隔（毫秒） | 5500 |
| `TIP_ROTATE_INTERVAL` | 提示轮播间隔（毫秒） | 3000 |

### 隐藏默认旋转图标

在 `server.cfg` 中：
```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

## 📋 依赖

- FiveM 客户端
- 无额外依赖

## 📄 许可证

GPL-3.0 许可证 - 详见 [LICENSE](LICENSE) 文件

---

**版本：2.1.6** | **作者：TEAR**
