@echo off
echo ��ʼ��ȡ��ҳ����
node.exe extract_CHT.js
echo ���ڽ���������ת��Ϊ��������
opencc\opencc.exe -i custom\cht.json -o custom\chs.json -c opencc\hk2s.json
echo ת�����
pause