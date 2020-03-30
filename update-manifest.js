const fs = require('fs');
const path = require('path');//解析需要遍历的文件夹
const crypto = require('crypto');
//const runDate = new Date();
const cacheList = [
	{typeName:"JS库",list:[
		'library/html2canvas.min.js',
		'library/localforage.min.js',
	]},
	{typeName:"ADPCM播放库",list:[
		'library/jy4340132-aaa/std.js',
		'library/jy4340132-aaa/pcm_player.js',
		'library/jy4340132-aaa/adpcm.js',
		'library/jy4340132-aaa/adpcm.wasm',
	]},
	{typeName:"语言表",list:[
		'languages/language-list.js',
	]},
	/*{typeName:"怪物数据",list:[
		'monsters-info/mon_ja.json',
		'monsters-info/mon_en.json',
		'monsters-info/mon_ko.json',
		'monsters-info/skill_ja.json',
		'monsters-info/skill_en.json',
		'monsters-info/skill_ko.json',
	]},*/
	{typeName:"字体",list:[
		'fonts/FOT-KurokaneStd-EB.woff2',
		'fonts/FOT-KurokaneStd-EB.woff',
		'fonts/FOT-KurokaneStd-EB.ttf',
		'fonts/FOT-KurokaneStd-EB.eot',
		'fonts/FOT-KurokaneStd-EB.svg',
	]},
	{typeName:"UI图片",list:[
		'images/icon.png',
		'images/awoken.png',
		'images/awoken-count-bg.png',
		'images/badge.png',
		'images/badge-bg.png',
		'images/CARDFRAME2.PNG',
		'images/latent.png',
		'images/orb-small-dark.png',
		'images/orb-small-fire.png',
		'images/orb-small-light.png',
		'images/orb-small-water.png',
		'images/orb-small-wood.png',
		'images/type.png',
	]},
];

const cardsLang = [
	{name:"日服、港台服图片",path:"images/cards_ja"},
	{name:"国际服图片",path:"images/cards_en"},
	{name:"韩服图片",path:"images/cards_ko"},
];
const cardsReg = "CARDS_\\d+\\.PNG";
cardsLang.forEach(lang=>{
	console.log('正在添加 %s',lang.name);
	const list = [];
	const langPath = lang.path;
	const files = fs.readdirSync(langPath);
	files.forEach(function (filename) {
		if (new RegExp(cardsReg,"i").test(filename))
		{
			list.push(path.join(langPath, filename));
		}
	});
	const newType = {
		typeName:lang.name,
		list:list,
	};
	cacheList.push(newType);
});

const csoundLang = [
	{name:"日服、港台服语音",path:"sound/voice/ja"},
	{name:"国际服语音",path:"sound/voice/en"},
	{name:"韩服语音",path:"sound/voice/ko"},
];
const soundsReg = "padv\\d+\\.wav";
csoundLang.forEach(lang=>{
	console.log('正在添加 %s',lang.name);
	const list = [];
	const langPath = lang.path;
	const files = fs.readdirSync(langPath);
	files.forEach(function (filename) {
		if (new RegExp(soundsReg,"i").test(filename))
		{
			list.push(path.join(langPath, filename));
		}
	});
	const newType = {
		typeName:lang.name,
		list:list,
	};
	cacheList.push(newType);
});

const outTextArray = cacheList.map(type=>{
	const typeTextArray = [];
	typeTextArray.push(`# ${type.typeName}`);
	type.list.forEach(path=>{
		console.log('正在添加 %s',path);
		//读取一个Buffer
		const buffer = fs.readFileSync(path);
		const fsHash = crypto.createHash('md5');
		fsHash.update(buffer);
		const md5 = fsHash.digest('hex');
		typeTextArray.push(`# ▼${md5}`);
		typeTextArray.push(path);
	});
	return typeTextArray.join('\n');
});
const outText = `CACHE MANIFEST

CACHE:
${outTextArray.join('\n\n')}`;

fs.writeFile('./manifest.appcache',outText,function(err){
	if(err){
		console.error(err);
	}
	console.log('manifest.appcache 导出成功');
});