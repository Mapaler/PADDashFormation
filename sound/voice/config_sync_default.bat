@echo off
:: ====================================================================
::  复制语音 配置模板 - 请根据本机实际情况修改以下变量
::  复制为 config_sync.bat 后生效，config_sync.bat 会被 .gitignore 忽略
:: ====================================================================

:: FastCopy 可执行文件路径（若已在 PATH 中则直接写 FastCopy.exe）
set FASTCOPY_PATH=FastCopy.exe
:: 如果未在 PATH，可指定完整路径，例如：
:: set WINSCP_PATH=C:\Users\Mapaler\FastCopy\FastCopy.exe

:: 数据目录（包含 mon2、cards_EN、cards_KO 三个子目录的父目录）
set DATAPATH=D:\PAD\Puzzle-and-Dragons-Data-Files\