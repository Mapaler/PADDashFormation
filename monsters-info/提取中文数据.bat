@echo off
echo ��ʼ��ȡ��ҳ����
node.exe extract_CHT.js
echo ���ڽ���������ת��Ϊ��������
opencc\opencc.exe -i custom\CHT.json -o custom\CHS.json -c opencc\t2s.json
echo ת�����
pause