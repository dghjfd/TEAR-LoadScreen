**中文** | [English](README.md)

---

# TEA-LoadScreen — 图片轮播加载屏

FiveM 加载屏：**自动识别** `images` 文件夹内图片并轮播，**支持大量图片**（最多 80 张），**可点击大窗查看**，交互性强。

## 功能

- **大量图片**：支持最多 **80 张** 图片，**多种格式可混用**：每张按数字命名（`1`、`2`、`3`…），扩展名可为 **jpg / jpeg / png / webp / gif / bmp** 任意一种，例如 `1.jpg`、`2.png`、`3.png`、`4.jpg`、`5.webp`… 每个数字只取第一个存在的文件，按 1、2、3… 顺序轮播。
- **大窗查看**：**点击当前轮播图** 进入全屏大图模式，可左右切换、Esc 或点击背景关闭；大窗内同样支持 ←/→ 与触摸滑动。
- **高交互**：
  - 键盘 **← / →** 切换上一张 / 下一张
  - 点击 **左右两侧按钮** 切换
  - 点击 **底部圆点** 跳转到对应张（图片多时圆点可滚动）
  - **触摸滑动** 左/右切换（移动端）
- **加载进度**：底部进度条与 FiveM `loadProgress` 事件同步，显示加载百分比。
- **底部提示条**：进度条下方的一行文字（如「正在连接服务器…」）用于在加载过程中显示状态或宣传语，**可自定义多条**并在加载时轮播显示（见下方「自定义多条 tips」）。

## 安装

1. 将整个 `TEA-LoadScreen` 文件夹放到 `resources` 下（若路径含空格，建议改为无空格，如 `TEA-LoadScreen`）。
2. 在 `server.cfg` 中**仅保留一个** loadscreen 资源并启动：
   ```cfg
   loadscreen 'TEA-LoadScreen'
   ```
   或若放在子目录：
   ```cfg
   loadscreen '你的目录/TEA-LoadScreen'
   ```
3. 在 `images` 文件夹内放入你的图片，命名为 `1.jpg`, `2.jpg`, … 或 `1.png`, `2.png`, …。

## 图片命名规则

- **按数字命名**：`1`、`2`、`3`… 至 `80`，扩展名任选一种即可。
- **格式可混用**：同一文件夹里可以是 `1.jpg`、`2.png`、`3.png`、`4.jpg`、`5.webp` 等，每个数字只使用**第一个存在的格式**（检测顺序：jpg → jpeg → png → webp → gif → bmp），按数字顺序轮播。

| 格式   | 示例       | 说明 |
|--------|------------|------|
| jpg/jpeg | 1.jpg, 2.jpg | 已列入 manifest |
| png    | 1.png, 2.png | 已列入 manifest |
| webp   | 1.webp, 2.webp | 已列入 manifest |
| gif    | 1.gif, 2.gif | 已列入 manifest |
| bmp    | 1.bmp, 2.bmp | 已列入 manifest |

当前 `fxmanifest.lua` 已预列 1～80 的 jpg、png、webp、gif、bmp。若使用自定义文件名（如 `banner_01.png`），需在 `files` 中手动添加路径。

## 自定义多条 tips（底部提示条）

底部那一行提示文字（如「正在连接服务器…」）可自定义为多条，加载过程中会按进度切换，并每隔约 4 秒轮播下一条。

**方法一（推荐）**：编辑 **`config.js`**，修改 `window.LOADSCREEN_TIPS` 数组即可：

```javascript
window.LOADSCREEN_TIPS = [
    '正在连接服务器…',
    '加载资源中，请稍候',
    '即将进入游戏',
    '欢迎来到本服',
    '你的其他提示…'
];
```

**方法二**：在 `index.html` 里在 `script.js` 之前增加一行：

```html
<script>window.LOADSCREEN_TIPS = ['提示1','提示2','提示3'];</script>
```

## 底部迷你播放器

底部横条**最左侧**为迷你播放器：**播放/暂停** + **音量**，样式为玻璃拟态 + 紫蓝渐变。  
背景音乐使用**外部链接**：在 **`config.js`** 中设置 `window.LOADSCREEN_BGM_URL = 'https://你的域名或CDN/xxx.mp3'`，留空则不播放。无需本地文件。

## 可选配置

- **自动轮播间隔**：在 `script.js` 顶部修改 `AUTO_INTERVAL`（毫秒），默认 5500。
- **tips 轮播间隔**：在 `script.js` 顶部修改 `TIP_ROTATE_INTERVAL`（毫秒），默认 4000。
- **隐藏默认加载旋转图标**：在 `server.cfg` 中加一行：
  ```cfg
  setr sv_showBusySpinnerOnLoadingScreen false
  ```

## 文件结构

```
TEA-LoadScreen/
├── fxmanifest.lua
├── index.html
├── style.css
├── config.js   ← 可编辑，自定义多条底部 tips
├── script.js
├── images/
│   ├── 请将图片放于此文件夹.txt
│   ├── 1.jpg
│   ├── 2.jpg
│   └── …
├── README.md
└── README_zh.md
```

## 依赖

- FiveM 客户端，无额外依赖。
