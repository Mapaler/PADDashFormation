@echo off
echo 开始提取网页数据
node.exe extract_CHT.js
echo 正在将繁体中文转换为简体中文
opencc\opencc.exe -i custom\CHT.json -o custom\CHS.json -c opencc\t2s.json
echo 转换完成
pause