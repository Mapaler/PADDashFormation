import { basename } from "https://deno.land/std/path/mod.ts";
import { Extlist } from './extlist.ts';
const regions = [
	{path: 'pad', regionID: 'JA', baseJsonURL: 'https://dl.padsv.gungho.jp/base_adr.json'},
	{path: 'padEN', regionID: 'NA', baseJsonURL: 'https://dl-na.padsv.gungho.jp/base-na-adr.json'},
	{path: 'padKO', regionID: 'KO', baseJsonURL: 'https://dl-kr.padsv.gungho.jp/base.kr-adr.json'},
//	{path: 'padHT', regionID: 'HT', baseJsonURL: 'https://dl.padsv.gungho.jp/base.ht-adr.json'},
];
async function downloadFile(url: string, path: string) {
	const response = await fetch(url);
	const headers = response.headers;
	//console.log(headers);
	const body = new Uint8Array(await response.clone().arrayBuffer());
	Deno.writeFileSync(`${path}/${basename(response.url)}`, body);
	const fileData = new Date(headers.get("date") as string); //获取修改时间
	Deno.utimeSync(`${path}/${basename(response.url)}`, fileData, fileData);
	return response;
}
for (const region of regions) {
	Deno.mkdirSync(`${region.path}`, { recursive: true });
	const baseUrl = region.baseJsonURL;
	console.log(`正在下载 ${baseUrl}`);
	const baseResponse = await downloadFile(baseUrl, region.path);
	const baseJsonData = await baseResponse.json();
	const extlistUrl = `${baseJsonData.extlist}/extlist.bin`;
	console.log(`正在下载 ${extlistUrl}`);
	const extlistResponse = await downloadFile(extlistUrl, region.path);
	const extdllistUrl = `${baseJsonData.efl}/extdllist.bin`;
	console.log(`正在下载 ${extdllistUrl}`);
	const extdllistResponse = await downloadFile(extdllistUrl, region.path);
	const extlist = Extlist.load(extlistResponse);
	extlist.entries.forEach((item)=>{console.log(item)});
} 