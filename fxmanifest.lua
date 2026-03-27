--[[
    TEA-LoadScreen - Auto-detect images + high-interaction loadscreen
    - Auto-detect images in images/ by extension, no numbers needed; supports list.txt or config-specified order
    - Keyboard/click/progress bar/touch swipe

    THIS RESOURCE IS PROTECTED BY TEAR VALIDATION SYSTEM
    - Resource name: TEAR-LoadScreen (CANNOT BE MODIFIED)
    - Author: TEAR (CANNOT BE MODIFIED)
    - GitHub Version Check: ENABLED
    - Tamper Protection: ACTIVE
]]

fx_version 'cerulean'
game 'gta5'

author 'TEAR'
description 'FiveM loadscreen: image carousel with lightbox viewing [PROTECTED]'
version '2.1.4'

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
