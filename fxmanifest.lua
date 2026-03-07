--[[
    TEA-LoadScreen - 自动识别图片 + 高交互加载屏
    - images/ 下按后缀自动识别，不写数字；支持 list.txt 或配置指定顺序
    - 键盘/点击/进度条/触摸滑动
]]

fx_version 'cerulean'
game 'gta5'

author 'TEA'
description 'FiveM 加载屏：图片轮播，支持大窗查看'
version '1.2.0'

loadscreen 'index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'no'

-- 固定文件 + images 下按后缀通配（不写数字，自动识别 png/jpg/jpeg/webp/gif/bmp）
-- 使用 list.txt 时在 files 中增加 'images/list.txt'
files {
    'index.html',
    'style.css',
    'config.js',
    'script.js',
    'images/*.png',
    'images/*.jpg',
    'images/*.jpeg',
    'images/*.webp',
    'images/*.gif',
    'images/*.bmp'
}
