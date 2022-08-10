const fs = require('fs');
const path = require('path');
const mime = require('mime'); //需要安装
const { DOMImplementation, XMLSerializer } = require('@xmldom/xmldom'); //需要安装
const xmlFormatter = require('xml-formatter'); //需要安装
const sharp = require('sharp'); //需要安装

const svgNS = 'http://www.w3.org/2000/svg';

class Icon {
	constructor(file, dir) {
		this.fileName = file;
		this.directory = dir;
		this.buffer = fs.readFileSync(this.path());
		this.sharp = sharp(this.buffer);
		this.init();
	}
	async init() {
		this.buffer = await this.sharp.metadata();
		const {data, info} = await this.sharp.webp({ nearLossless : true}) //近似无损，而非绝对无损
			.toBuffer({ resolveWithObject: true });
		this.webpBuffer = data;
		this.webpInfo = info;
	}
	path() {
		return path.join(this.directory, this.fileName);
	}
	base64() {
		return `data:${mime.getType(this.fileName)};base64,${this.buffer.toString('base64')}`;
	}
	webpBase64() {
		return `data:${mime.getType('webp')};base64,${this.webpBuffer.toString('base64')}`;
	}
}


//const dt = new DOMImplementation().createDocumentType('svg:svg', '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
//const svg = new DOMImplementation().createDocument(svgNS, 'svg', dt);

async function main({directory, idPre, svgFilename, rectFunc}) {
	const files = fs.readdirSync(directory);

	const iconArr = files.map(file=>new Icon(file, directory));

	for (const icon of iconArr) {
		await icon.init();
	}

	iconArr.sort((a,b)=>{
		function nameNum(fileName){return parseInt(/^\d+/.exec(fileName)?.[0] || 0)}
		return (nameNum(a.fileName) - nameNum(b.fileName)) || //先判断数字
				(a.fileName.length - b.fileName.length); //然后判断文件名长度
	});
	
	const svgDoc = new DOMImplementation().createDocument(svgNS, 'svg');

	let heightSum = 0;
	for (let i = 0; i < iconArr.length; i++)
	{
		const icon = iconArr[i];
		console.log('正在处理 %s %s', directory, icon.fileName);
		const parseName = path.parse(icon.fileName);
		const regRes = /^(\d+)(.*)$/ig.exec(parseName.name);
		const iconId = regRes ? `${parseInt(regRes[1])}${regRes[2]}` : parseName.name;
		const symbolId = `${idPre}-${iconId}`;

		const imgWidth = icon.webpInfo.width, imgHeight = icon.webpInfo.height;
		const {x=0, y=0, width=imgWidth, height=imgHeight} = rectFunc ? rectFunc(imgWidth, imgHeight, parseName.name) : {};
		const image = svgDoc.createElement('image');
		image.setAttribute('width', imgWidth);
		image.setAttribute('height', imgHeight);
		image.setAttribute('href', icon.webpBase64());

		const symbol = svgDoc.createElement('symbol');
		symbol.setAttribute('id', symbolId);
		symbol.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
		symbol.appendChild(image);
		svgDoc.documentElement.appendChild(symbol);

		const use = svgDoc.createElement('use');
		use.setAttribute('href',`#${symbolId}`);
		use.setAttribute('width', width);
		use.setAttribute('height', height);
		use.setAttribute('y', heightSum);
		svgDoc.documentElement.appendChild(use);

		const text = svgDoc.createElement('text');
		text.textContent = symbolId;
		text.setAttribute('dominant-baseline', "hanging");
		text.setAttribute('x', width);
		text.setAttribute('y', heightSum);
		svgDoc.documentElement.appendChild(text);

		heightSum += height;
	}
	svgDoc.documentElement.setAttribute('height', heightSum);

	const serialized = new XMLSerializer().serializeToString(svgDoc);
	const formattedXml = xmlFormatter(serialized, {
		indentation: '\t', 
		filter: (node) => node.type !== 'Comment', 
		collapseContent: true, 
		lineSeparator: '\n'
	});
	fs.writeFileSync(svgFilename, formattedXml);
}

const tasks = [
	{directory: './awokens', idPre: 'awoken', svgFilename: '../icon-awoken.svg'},
	{directory: './types', idPre: 'type', svgFilename: '../icon-type.svg'},
	{directory: './card-frame', idPre: 'card-frame', svgFilename: '../card-frame.svg', rectFunc: (imgWidth, imgHeight, fileName)=>{
		return {x: fileName.includes("sub") ? -4 : 0, y: fileName.includes("sub") ? -4 : 0, width: 100, height: 100};
	}},
];

tasks.forEach(main);