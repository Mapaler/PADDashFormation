const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc');
const converter = new OpenCC('s2t.json');

const code = fs.readFileSync("script-json_data.js", {encoding:"utf-8"});
function toCHT(match, p1){
	const cht = converter.convertSync(p1);
	return `{chs:"${p1}",cht:"${cht}"}`;
}
let newcode = code.replaceAll(/\{chs:"(.+)?"\}/ig, toCHT);
fs.writeFileSync("script-json_data2.js", newcode, {encoding:"utf-8"})