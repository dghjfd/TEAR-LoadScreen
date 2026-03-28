<div align="center">

# 🎬 TEAR-LoadScreen

**专为 FiveM 打造的高颜值加载屏幕**

[![Version](https://img.shields.io/badge/版本-2.2.8-4f8ef7?style=for-the-badge&logo=github)](fxmanifest.lua)
[![License](https://img.shields.io/badge/许可证-GPL--3.0-22c55e?style=for-the-badge)](LICENSE)
[![FiveM](https://img.shields.io/badge/平台-FiveM-f97316?style=for-the-badge)](https://fivem.net/)
[![Protection](https://img.shields.io/badge/保护-TEAR--Validation-ef4444?style=for-the-badge)]()

**[English](README.md)** · 中文版

</div>

---

## 📖 简介

TEAR-LoadScreen 是一款功能全面的 FiveM 加载屏幕资源，支持视频背景、图片轮播、全屏灯箱、背景音乐以及完整的双端验证保护系统，开箱即用，高度可配置。

---

## ⚠️ 受保护资源

> **本资源使用 TEAR-Validation 保护机制，以下信息禁止修改，否则资源将被自动禁用。**

| 字段 | 值 | 说明 |
|------|-----|------|
| 资源名称 | `TEAR-LoadScreen` | 禁止重命名 |
| 作者 | `TEARLESSVVOID` | 禁止修改 |
| 验证 | 服务端 + 客户端 | 已启用 |
| 反篡改 | 已激活 | — |

---

## ✨ 功能特性

<table>
<tr>
<td width="50%">

**🎬 媒体支持**
- 视频背景（MP4 / WebM / OGG）
- 图片轮播（最多 80 张）
- 全屏灯箱预览
- 多格式混合支持

</td>
<td width="50%">

**🎵 音频系统**
- 视频内置音轨
- 本地 BGM 文件
- 外部音频链接
- 实时音量调节

</td>
</tr>
<tr>
<td>

**📊 加载系统**
- FiveM 原生进度条同步
- 自定义轮播提示文字
- 中英文双语提示支持
- 服务器 LOGO 显示

</td>
<td>

**🖱️ 交互方式**
- `← / →` 键盘切换
- 左右导航按钮
- 底部圆点跳转
- 触摸滑动（移动端）
- 迷你播放器控制

</td>
</tr>
</table>

---

## 📦 安装

**第一步** — 将 `TEAR-LoadScreen` 文件夹放入服务器 `resources` 目录

**第二步** — 在 `server.cfg` 中注册加载屏幕：

```cfg
# 根目录
loadscreen 'TEAR-LoadScreen'

# 或子目录
loadscreen '你的目录/TEAR-LoadScreen'
```

**第三步** — 编辑 `config.js` 完成个性化配置

**第四步** — 将媒体文件放入对应目录（`images/`、`videos/`、`audio/`）

---

## ⚙️ 配置说明

### 🎬 视频背景

```javascript
window.LOADSCREEN_USE_VIDEO   = true;              // 启用视频模式
window.LOADSCREEN_VIDEO_URL   = 'videos/intro.mp4'; // 视频路径
window.LOADSCREEN_VIDEO_MUTED = false;             // 是否静音
window.LOADSCREEN_VIDEO_LOOP  = true;              // 是否循环
```

> **支持格式：** `.mp4` `.webm` `.ogg` — 存放于 `videos/` 目录

---

### 🖼️ 图片轮播

提供三种图片加载方式，按需选择：

**方式一：自动编号**（最简单）

将图片命名为 `1.jpg`、`2.jpg`、`3.jpg`... 最多支持 **80** 张。

**方式二：配置指定**

```javascript
window.LOADSCREEN_IMAGE_NAMES = ['banner1', 'banner2', 'city'];
```

**方式三：列表文件**

在 `images/` 目录中创建 `list.txt`，每行填写一个图片路径：

```
images/banner1.jpg
images/city.png
images/night.webp
```

> **支持格式：** `.jpg` `.jpeg` `.png` `.webp` `.gif` `.bmp` — 存放于 `images/` 目录

---

### 🎵 音频配置

```javascript
window.LOADSCREEN_BGM_SOURCE    = 1;                       // 1=视频音轨  2=本地文件  3=外部链接
window.LOADSCREEN_BGM_LOCAL_URL = 'audio/bgm.mp3';         // 本地文件路径
window.LOADSCREEN_BGM_URL       = 'https://example.com/bgm.mp3'; // 外部链接
window.LOADSCREEN_DEFAULT_VOLUME = 80;                     // 默认音量 (0-100)
```

> **支持格式：** `.mp3` `.wav` `.ogg` — 存放于 `audio/` 目录

---

### 🏷️ 服务器 LOGO

```javascript
window.LOADSCREEN_LOGO_ENABLED = true;
window.LOADSCREEN_LOGO_URL     = 'images/logo.png';
```

---

### 💬 自定义提示

```javascript
window.LOADSCREEN_TIPS = [
    '正在连接服务器...',
    '加载资源中，请稍候...',
    ['欢迎来到服务器', 'Welcome to our server'],  // 双语格式 [中文, 英文]
    '你的自定义提示文字'
];
```

---

### 🔧 高级参数

在 `script.js` 顶部可调整以下参数：

| 参数 | 说明 | 默认值 |
|------|------|:------:|
| `AUTO_INTERVAL` | 自动轮播间隔（毫秒） | `5500` |
| `TIP_ROTATE_INTERVAL` | 提示切换间隔（毫秒） | `3000` |

**隐藏默认加载转圈图标**，在 `server.cfg` 中添加：

```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

---

## 📂 文件结构

```
TEAR-LoadScreen/
├── 📄 fxmanifest.lua       — FiveM 资源清单
├── 📄 index.html           — 主页面
├── 🎨 style.css            — 样式文件
├── ⚙️  config.js            — 用户配置（在此修改）
├── 📜 script.js            — 主逻辑
├── 🔐 cl_validation.lua    — 客户端验证（Lua）
├── 🔐 cl_validation.js     — 客户端验证（JS）
├── 🔐 sv_validation.lua    — 服务端验证
├── 🖼️  images/              — 图片目录
│   ├── logo.png
│   ├── 1.jpg
│   └── ...
├── 🎬 videos/              — 视频目录
│   └── intro.mp4
├── 🎵 audio/               — 音频目录
│   └── bgm.mp3
├── 📄 LICENSE
├── 📄 README.md
└── 📄 README_zh.md
```

---

## 📋 依赖

- FiveM 客户端（无额外依赖）

## 📄 许可证

本项目基于 **GPL-3.0** 许可证开源 — 详见 [LICENSE](LICENSE) 文件

---

<div align="center">

**版本 2.2.8** · 作者 **TEARLESSVVOID**

*保持 `TEAR-LoadScreen` 资源名称和作者信息不变，否则验证系统将自动禁用本资源。*

</div>
