const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const servers = [
	{
		code:"ja"
	},
	{
		code:"en"
	},
	{
		code:"ko"
	}
];
function filesHashArr(dirName, extName) {
	const dirFiles = fs.readdirSync(dirName);
	const hashArr = [];
	for (let fileName of dirFiles) {
		if (
			typeof(extName) == "string" && path.extname(fileName) !== extName || //如果扩展名是字符串，不匹配则跳过
			extName instanceof RegExp && !extName.test(path.extname(fileName)) || //如果扩展名是正则表达式，不匹配则跳过
			Array.isArray(extName) && extName.every(ext=>path.extname(fileName) !== ext) //如果扩展名是数组，则多次匹配字符串，不匹配则跳过
			) continue;
		const fullFileName = path.join(dirName, fileName);
		const file = fs.readFileSync(fullFileName);
		const cardHash = crypto.createHash('md5');
		cardHash.update(file);
		const md5 = cardHash.digest('hex');
		//console.log(fullFileName, md5);
		hashArr.push([fullFileName.replaceAll("\\", "\/"), md5]);
	}
	return hashArr;
}
const cachesArr = [];
for (let server of servers) {
	const cardsHash = filesHashArr(`./images/cards_${server.code}`);
	const voiceHash = filesHashArr(`./sound/voice/${server.code}`);
	cachesArr.push(...cardsHash);
	cachesArr.push(...voiceHash);
}
//字体
const fontsHash = filesHashArr("./fonts", /\.woff2?$/i);
cachesArr.push(...fontsHash);
//程序
const programHash = filesHashArr("./", /\.(js|html|css)$/i);
programHash.splice(programHash.findIndex(item=>item[0] === "service-worker.js"), 1); //不要把service-worker自身加入
cachesArr.push(...programHash);
//语言
const lanuageHash = filesHashArr("./languages", /\.(js|css)$/i);
cachesArr.push(...lanuageHash);
//UI图片
const UiImageHash = filesHashArr("./images", /\.(png|webp|svg)$/i);
cachesArr.push(...UiImageHash);
//第三方库
const libraryHash = filesHashArr("./library", /\.js/i); //第三方库
cachesArr.push(...libraryHash);
const library_aaaHash = filesHashArr("./library/jy4340132-aaa", /\.(js|wasm)$/i); //播放语音的库
cachesArr.push(...library_aaaHash);
//数据
const dataHash = filesHashArr("./monsters-info", /\.json$/i);
cachesArr.push(...dataHash);
//文档
const docHash = filesHashArr("./doc", /\.html$/i);
const docImageHash = filesHashArr("./doc/images", /\.(png|webp|svg)$/i);
cachesArr.push(...docHash.concat(docImageHash));

const swJs = fs.readFileSync('./service-worker.js', 'utf-8');
let formatterHashes = true;
const newSwJs = swJs.replace(/(const\s+cachesMap\s*=\s*)[\s\S]+?;/i, `$1new Map(${JSON.stringify(cachesArr, undefined, formatterHashes ? "\t" : undefined)});`);
fs.writeFileSync('./service-worker.js', newSwJs, 'utf-8');
console.log("更新 service-worker.js 完毕");