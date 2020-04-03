@echo off
if not exist variables.txt copy variables_default.txt variables.txt
:0
for /f "skip=1 delims=" %%a in (variables.txt) do (
set fastcopypath=%%~a
goto :1
)
:1
for /f "skip=3 delims=" %%a in (variables.txt) do (
set datapath=%%~a
goto :2
)
:2
"%fastcopypath%" /cmd=diff /open_window /auto_close "%datapath%\mon2\padv*.wav" /to=.\ja
"%fastcopypath%" /cmd=diff /open_window /auto_close "%datapath%\cards_EN\padv*.wav" /to=.\en
"%fastcopypath%" /cmd=diff /open_window /auto_close "%datapath%\cards_KO\padv*.wav" /to=.\ko