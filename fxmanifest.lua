--[[
    TEA-LoadScreen - Auto-detect images + high-interaction loadscreen
    - Auto-detect images in images/ by extension, no numbers needed; supports list.txt or config-specified order
    - Keyboard/click/progress bar/touch swipe
]]

fx_version 'cerulean'
game 'gta5'

author 'TEAR'
description 'FiveM loadscreen: image carousel with lightbox viewing'
version '2.1.3'

loadscreen 'index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'no'

-- Fixed files + wildcard by extension in images folder (no numbers needed, auto-detect png/jpg/jpeg/webp/gif/bmp)
-- When using list.txt, add 'images/list.txt' to files
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
    'images/*.bmp',
    'videos/*.mp4',
    'videos/*.webm',
    'videos/*.ogg',
    'audio/*.mp3',
    'audio/*.wav',
    'audio/*.ogg'
}
