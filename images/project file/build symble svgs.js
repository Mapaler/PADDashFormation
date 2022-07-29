const fs = require('fs');
const path = require('path');
const mime = require('mime'); //需要安装
const sizeOf = require('image-size'); //需要安装
const { DOMImplementation, XMLSerializer } = require('@xmldom/xmldom'); //需要安装

const directory = './awokens';
const files = fs.readdirSync(directory);

class Icon {
	constructor(file, dir) {
		this.fileName = file;
		this.directory = dir;
		this.buffer = fs.readFileSync(this.path());
		this.size = sizeOf(this.buffer);
	}
	path() {
		return path.join(this.directory, this.fileName);
	}
	base64() {
		return `data:${mime.getType(this.fileName)};base64,${this.buffer.toString('base64')}`;
	}
}
const iconArr = [];
for (const file of files)
{
	const icon = new Icon(file, directory);
	iconArr.push(icon);
}
iconArr.sort((a,b)=>{
	function nameNum(fileName){return parseInt(/^\d+/.exec(fileName)[0])}
	return nameNum(a.fileName) - nameNum(b.fileName);
});

const svgNS = 'http://www.w3.org/2000/svg';
//const dt = new DOMImplementation().createDocumentType('svg:svg', '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
//const svg = new DOMImplementation().createDocument(svgNS, 'svg', dt);
const svg = new DOMImplementation().createDocument(svgNS, 'svg');

for (const icon of iconArr)
{
	console.log('正在处理 %s', icon.fileName);
	const symbol = svg.createElement('symbol');
	symbol.setAttribute('id', `awoken-${parseInt(path.parse(icon.fileName).name)}`);
	symbol.setAttribute('viewBox', `0 0 32 32`);
	svg.documentElement.appendChild(symbol);
	const image = svg.createElement('image');
	image.setAttribute('width', icon.size.width);
	image.setAttribute('height', icon.size.height);
	image.setAttribute('href', icon.base64());
	symbol.appendChild(image);
}
const serialized = new XMLSerializer().serializeToString(svg);
fs.writeFileSync('../icon-awoken.svg', serialized);