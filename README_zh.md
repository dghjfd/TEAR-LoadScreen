**中文** | [English](README.md)

---

# TEA-LoadScreen — 图片/视频轮播加载屏

[![Version](https://img.shields.io/badge/version-2.1.3-blue.svg)](fxmanifest.lua)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)
[![Game](https://img.shields.io/badge/game-FiveM-orange.svg)](https://fivem.net/)

> FiveM 加载屏：**自动识别** `images` 文件夹内图片并轮播，**支持视频背景**、**多种音频来源**，交互性强。

## ✨ 功能特性

### 核心功能
- 🎬 **视频背景**：支持使用视频作为首页轮播
- 🖼️ **大量图片**：支持最多 **80 张** 图片，**多种格式可混用**
- 🔍 **大窗查看**：点击当前轮播图进入全屏大图模式
- 🎵 **多源音频**：支持视频音频、本地文件、外部链接
- 🎛️ **音量控制**：可配置默认音量，实时调节
- 📊 **加载进度**：底部进度条与 FiveM `loadProgress` 事件同步
- 💬 **自定义提示**：多条提示轮播，支持中英文双语
- 🏷️ **LOGO 开关**：可控制左上角服务器 LOGO 显示

### 交互方式
- ⌨️ 键盘 **← / →** 切换上一张 / 下一张
- 👆 点击 **左右两侧按钮** 切换
- ⚫ 点击 **底部圆点** 跳转到对应张
- 📱 **触摸滑动** 左/右切换（移动端）
- 🔇 点击 **迷你播放器** 控制播放/暂停和音量

## 📦 安装

1. 将整个 `TEA-LoadScreen` 文件夹放到 `resources` 下
2. 在 `server.cfg` 中**仅保留一个** loadscreen 资源并启动：
   ```cfg
   loadscreen 'TEA-LoadScreen'
   ```
   或若放在子目录：
   ```cfg
   loadscreen '你的目录/TEA-LoadScreen'
   ```
3. 放置媒体文件（详见下方说明）

## 🎬 视频配置

### 启用视频
在 `config.js` 中设置：
```javascript
window.LOADSCREEN_USE_VIDEO = true;
window.LOADSCREEN_VIDEO_URL = 'videos/intro.mp4';
window.LOADSCREEN_VIDEO_MUTED = false;  // 是否静音
window.LOADSCREEN_VIDEO_LOOP = true;    // 是否循环
```

### 支持的视频格式
- `.mp4` (推荐)
- `.webm`
- `.ogg`

> 将视频文件放入 `videos/` 文件夹

## 🖼️ 图片配置

### 使用方法

**方法一：自动编号（最简单）**
- 将图片命名为 `1.jpg`, `2.jpg`, `3.jpg`… 或 `1.png`, `2.png`…
- 系统会自动按顺序加载 1~80 号图片

**方法二：配置文件指定**
```javascript
window.LOADSCREEN_IMAGE_NAMES = ['logo', 'bg', 'intro'];
```

**方法三：使用 list.txt**
- 在 `images/` 文件夹中创建 `list.txt`
- 每行写一个图片路径

### 支持的图片格式
| 格式 | 示例 | 说明 |
|------|------|------|
| jpg/jpeg | 1.jpg, 2.jpg | 已列入 manifest |
| png | 1.png, 2.png | 已列入 manifest |
| webp | 1.webp, 2.webp | 已列入 manifest |
| gif | 1.gif, 2.gif | 已列入 manifest |
| bmp | 1.bmp, 2.bmp | 已列入 manifest |

> 将图片文件放入 `images/` 文件夹

## 🎵 音频配置

### 音频来源类型
在 `config.js` 中选择音频来源：
```javascript
window.LOADSCREEN_BGM_SOURCE = 1;  // 1=视频音频, 2=本地文件, 3=外部链接
```

#### 1. 使用视频音频
```javascript
window.LOADSCREEN_BGM_SOURCE = 1;
window.LOADSCREEN_USE_VIDEO = true;  // 确保视频已启用
```

#### 2. 使用本地音频文件
```javascript
window.LOADSCREEN_BGM_SOURCE = 2;
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';
```

#### 3. 使用外部链接
```javascript
window.LOADSCREEN_BGM_SOURCE = 3;
window.LOADSCREEN_BGM_URL = 'http://example.com/music.mp3';
```

### 音量配置
```javascript
window.LOADSCREEN_DEFAULT_VOLUME = 80;  // 0-100
```

### 支持的音频格式
- `.mp3` (推荐)
- `.wav`
- `.ogg`

> 将音频文件放入 `audio/` 文件夹

## 🏷️ LOGO 配置

```javascript
window.LOADSCREEN_LOGO_ENABLED = true;  // 显示/隐藏 LOGO
window.LOADSCREEN_LOGO_URL = 'images/logo.png';
```

## 💬 自定义提示

在 `config.js` 中修改提示数组：

```javascript
window.LOADSCREEN_TIPS = [
    '正在连接服务器…',
    '加载资源中，请稍候',
    '即将进入游戏',
    ['欢迎来到本服', 'Welcome to our server'],  // 双语格式
    '你的其他提示…'
];
```

## 📂 文件结构

```
TEA-LoadScreen/
├── fxmanifest.lua
├── index.html
├── style.css
├── config.js          ← 主要配置文件
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

## ⚙️ 高级配置

在 `script.js` 顶部可调整：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `AUTO_INTERVAL` | 自动轮播间隔（毫秒） | 5500 |
| `TIP_ROTATE_INTERVAL` | 提示轮播间隔（毫秒） | 3000 |

### 隐藏默认加载旋转图标
在 `server.cfg` 中添加：
```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

## 📋 依赖

- FiveM 客户端，无额外依赖

## 📄 许可证

本项目采用 GPL-3.0 许可证 - 详见 [LICENSE](LICENSE) 文件

---

**版本：2.1.3** | **作者：TEA**
