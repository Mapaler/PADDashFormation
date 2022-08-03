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

async function main({directory, idPre, svgFilename}) {
	const files = fs.readdirSync(directory);

	const iconArr = [];
	for (const file of files)
	{
		const icon = new Icon(file, directory);
		await icon.init();
		iconArr.push(icon);
	}
	iconArr.sort((a,b)=>{
		function nameNum(fileName){return parseInt(/^\d+/.exec(fileName)[0] || 0)}
		return (nameNum(a.fileName) - nameNum(b.fileName)) || //先判断数字
				(a.fileName.length - b.fileName.length); //然后判断文件名长度
	});
	const svgDoc = new DOMImplementation().createDocument(svgNS, 'svg');

	for (const icon of iconArr)
	{
		console.log('正在处理 %s %s', directory, icon.fileName);
		const symbol = svgDoc.createElement('symbol');
		const parseName = path.parse(icon.fileName);
		
		const regRes = /^(\d+)(.*)$/ig.exec(parseName.name);
		let aid = regRes ? `${parseInt(regRes[1])}${regRes[2]}` : parseName.name;
		symbol.setAttribute('id', `${idPre}-${aid}`);
		symbol.setAttribute('viewBox', `0 0 32 32`);
		svgDoc.documentElement.appendChild(symbol);
		const image = svgDoc.createElement('image');
		image.setAttribute('width', icon.webpInfo.width);
		image.setAttribute('height', icon.webpInfo.height);
		image.setAttribute('href', icon.webpBase64());

		symbol.appendChild(image);
	}
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
];

tasks.forEach(main);