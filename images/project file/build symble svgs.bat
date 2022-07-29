@ECHO off
title 开始更新 SVG 图标
::powershell -File "./build symble svgs.ps1"
node "build symble svgs.js"
PAUSE