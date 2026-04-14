--[[
    TEAR-LoadScreen - auto image detection + interactive loadscreen
    - Auto-detects image extensions in images/ with no numbering required
    - Supports list.txt or config-defined image order
    - Keyboard / mouse / progress / touch interactions

    This resource is protected by the TEAR validation system
    - Resource name: TEAR-LoadScreen (do not modify)
    - Author: TEARLESSVVOID (do not modify)
    - GitHub version checks: enabled
    - Anti-tamper protection: active
]]

fx_version 'cerulean'
game 'gta5'

author 'TEARLESSVVOID'
description 'FiveM loadscreen: image carousel with lightbox viewing [PROTECTED]'
version '2.2.8'

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
