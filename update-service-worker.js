console.time('生成哈希');
const fs = require('fs');
const path = require('path');
// const crypto = require('crypto');
const xxhash = require('xxhash-wasm');


let hasher = null;
async function initHasher() {
	if (!hasher) {
		// 调用 xxhash() 来初始化 WebAssembly 实例
		hasher = await xxhash();
	}
	return hasher;
}

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
async function filesHashArr(dirName, extName, excludeName) {
	const hashArr = [];
	if (!fs.existsSync(dirName)) {
		console.warn(`目录不存在，已跳过: ${dirName}`);
		return hashArr;
	}
	const dirFiles = fs.readdirSync(dirName);
	const h = await initHasher();
	
	for (let fileName of dirFiles) {
		// 过滤逻辑
		if (
			typeof(extName) == "string" && path.extname(fileName) !== extName || //如果扩展名是字符串，不匹配则跳过
			extName instanceof RegExp && !extName.test(path.extname(fileName)) || //如果扩展名是正则表达式，不匹配则跳过
			Array.isArray(extName) && extName.every(ext=>path.extname(fileName) !== ext) //如果扩展名是数组，则多次匹配字符串，不匹配则跳过
			)
			continue;
		if (excludeName && (
			typeof(excludeName) == "string" && fileName.includes(excludeName) || //如果文件名包含排除名则跳过
			excludeName instanceof RegExp && excludeName.test(fileName) || //如果是正则表达式，匹配则跳过
			Array.isArray(excludeName) && excludeName.some(exclude=>fileName.includes(exclude)) //如果扩展名是数组，则多次匹配字符串，不匹配则跳过
			))
			continue;
		
		// 从 MD5 切换到 xxhash 以加快速度
		// const fileBuffer = fs.readFileSync(fullFileName);
		// const cardHash = crypto.createHash('md5');
		// cardHash.update(fileBuffer);
		// const md5 = cardHash.digest('hex');
		// //console.log(fullFileName, md5);
		// hashArr.push([fullFileName.replaceAll("\\", "\/"), md5]);

		const fullFileName = path.join(dirName, fileName);
		const fileBuffer = fs.readFileSync(fullFileName);
		try {
			const fileBuffer = fs.readFileSync(fullFileName);
			const hashHex = h.h64Raw(fileBuffer).toString(16).padStart(16, '0');
			hashArr.push([fullFileName.replaceAll("\\", "/"), hashHex]);
		} catch (fileError) {
			console.warn(`读取文件失败，已跳过: ${fullFileName}`, fileError.message);
			// 不 push，继续下一个
		}
	}
	return hashArr;
}


// 把顶层的 await 调用全部包进一个 async 函数
async function main() {
	const cachesArr = [];
	for (let server of servers) {
		const cardsHash = await filesHashArr(`./images/cards_${server.code}`);
		cachesArr.push(...cardsHash);
		const voiceHash = await filesHashArr(`./sound/voice/${server.code}`);
		cachesArr.push(...voiceHash);
	}
	//字体
	const fontsHash = await filesHashArr("./fonts", /\.woff2?$/i);
	cachesArr.push(...fontsHash);
	//程序
	const programHash = await filesHashArr("./", /\.(js|html|css)$/i, ["package", "service-worker", "caches-map", "update-service-worker"]);
	cachesArr.push(...programHash);
	//语言
	const languageHash = await filesHashArr("./languages", /\.(js|css)$/i);
	cachesArr.push(...languageHash);
	//UI图片
	const UiImageHash = await filesHashArr("./images", /\.(png|webp|svg)$/i);
	cachesArr.push(...UiImageHash);
	//第三方库
	const libraryHash = await filesHashArr("./library", /\.js/i); //第三方库
	cachesArr.push(...libraryHash);
	const library_aaaHash = await filesHashArr("./library/jy4340132-aaa", /\.(js|wasm)$/i); //播放语音的库
	cachesArr.push(...library_aaaHash);
	//数据
	// const dataHash = filesHashArr("./monsters-info", /\.json$/i);
	// cachesArr.push(...dataHash);
	//文档
	const docHash = await filesHashArr("./doc", /\.html$/i);
	cachesArr.push(...docHash);
	const docImageHash = await filesHashArr("./doc/images", /\.(png|webp|svg)$/i);
	cachesArr.push(...docImageHash);

	// 不再读取和修改 service-worker.js
	// 改为直接写入 caches-map.js
	const mapContent = `const cachesMap = new Map(${JSON.stringify(cachesArr, undefined, "\t")});`;
	fs.writeFileSync('./caches-map.js', mapContent, 'utf-8');
	console.log("更新 caches-map.js 完毕");
	console.timeEnd('生成哈希');
}

// 执行 main 函数
main().catch(console.error);
