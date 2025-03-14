﻿import { readFileSync, writeFile, readFile } from 'fs';
import { chdir, cwd } from 'node:process';
import { dirname as pathDirname, join as pathJoin } from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url); //当前文件路径
const __dirname = pathDirname(__filename); //当前文件目录

chdir(__dirname);

const ljson = readFileSync("./chs.json", 'utf-8'); //使用同步读取
const ccard = JSON.parse(ljson);//将字符串转换为json对象
ccard.forEach(c => {
	// if (c.id>=4684 && c.id<=9899) {
	// 	c.name = c.name.replace(/^卡片：/,"卡牌：");
	// 	c.name = c.name.replace(/^(.+)的卡$/,"卡牌：$1");
	// }
	const tags = new Set(c.tags);
	if(c.name.includes("希石")){
		tags.add("希石");
	}
	if(c.name.includes("合作硬币")){
		tags.add("活动票/活动硬币");
	}
	c.tags = [...tags];
});

//按ID排序
ccard.sort((a,b)=>a.id-b.id);


//写入Cards
writeFile(`./chs.json`, JSON.stringify(ccard, null, '\t'), function (err) {
	if (err) {
		console.error(err);
	}
});

/*
导出未翻译数据
Cards.filter(card=>card.enabled && !card?.otLangName?.chs).map(card=>({id:card.id,name:card.name,tags:card.altName}))
*/