--[[
    TEAR-LoadScreen - 自动检测图片 + 高交互性加载屏幕
    - 自动检测 images/ 中的图片扩展名，无需编号；支持 list.txt 或配置指定的顺序
    - 键盘/鼠标点击/进度条/触摸滑动

    此资源受 TEAR 验证系统保护
    - 资源名称：TEAR-LoadScreen（禁止修改）
    - 作者：TEARLESSVVOID（禁止修改）
    - GitHub 版本检查：已启用
    - 防篡改保护：已激活
]]

fx_version 'cerulean'
game 'gta5'

author 'TEARLESSVVOID'
description 'FiveM loadscreen: image carousel with lightbox viewing [PROTECTED]'
version '2.2.7'

loadscreen 'index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'no'

server_scripts {
    'sv_validation.lua'
}

client_script 'cl_validation.lua'

files {
    'index.html',
    'style.css',
    'config.js',
    'script.js',
    'cl_validation.js',
    'images/*.png',
    'images/*.jpg',
    'images/*.jpeg',
    'images/*.webp',
    'images/*.gif',
    'images/*.bmp',
    'videos/*.mp4',
    'videos/*.webm',
    'videos/*.ogg',
    'audio/*.mp3',
    'audio/*.wav',
    'audio/*.ogg'
}
