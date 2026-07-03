@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

if not exist config_sync.bat (
    echo 未找到 config_sync.bat，正在从 config_sync_default.bat 复制...
    copy config_sync_default.bat config_sync.bat
    echo 请编辑 config_sync.bat，填写必要参数后重新运行本脚本。
    pause
    exit /b 1
)

call config_sync.bat
if errorlevel 1 (
    echo 错误：无法加载 config_sync.bat，请检查文件格式。
    pause
    exit /b 1
)

:: 检查必要变量
if not exist "%FASTCOPYPATH%" (
    echo 错误：FASTCOPYPATH 指定的文件不存在，请检查路径。
    pause
    exit /b 1
)
if "%DATAPATH%"=="" (
    echo 错误：DATAPATH 未设置。
    pause
    exit /b 1
)
if not exist "%DATAPATH%" (
    echo 警告：DATAPATH 指定的目录不存在，请检查路径。
    pause
)

echo 正在复制语音文件...
title 正在复制语音文件
"%FASTCOPYPATH%" /cmd=diff /open_window /auto_close "%DATAPATH%\mon2\padv*.wav" /to=.\ja
"%FASTCOPYPATH%" /cmd=diff /open_window /auto_close "%DATAPATH%\cards_EN\padv*.wav" /to=.\en
"%FASTCOPYPATH%" /cmd=diff /open_window /auto_close "%DATAPATH%\cards_KO\padv*.wav" /to=.\ko
echo 语音文件复制完成
pause