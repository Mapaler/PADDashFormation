import { basename } from "https://deno.land/std/path/mod.ts";
const regions = [
	{path: 'pad', regionID: 'JA', baseJsonURL: 'https://dl.padsv.gungho.jp/base_adr.json'},
	{path: 'padEN', regionID: 'NA', baseJsonURL: 'https://dl-na.padsv.gungho.jp/base-na-adr.json'},
	{path: 'padKO', regionID: 'KO', baseJsonURL: 'https://dl-kr.padsv.gungho.jp/base.kr-adr.json'},
//	{path: 'padHT', regionID: 'HT', baseJsonURL: 'https://dl.padsv.gungho.jp/base.ht-adr.json'},
];
for (const region of regions)
{
	Deno.mkdirSync(`${region.path}`, { recursive: true });
	const baseUrl = region.baseJsonURL;
	console.log(`正在下载 ${baseUrl}`);
	const baseResponse = await fetch(baseUrl);
	const baseJsonData = await baseResponse.clone().json();
	const baseBody = new Uint8Array(await baseResponse.arrayBuffer());
	Deno.writeFileSync(`${region.path}/${basename(baseUrl)}`, baseBody);
	console.log(`正在下载 ${baseJsonData.extlist}/extlist.bin`);
	const extlistUrl = `${baseJsonData.extlist}/extlist.bin`;
	const extlistResponse = await fetch(extlistUrl);
	const extlistBody = new Uint8Array(await extlistResponse.arrayBuffer());
	Deno.writeFileSync(`${region.path}/${basename(extlistUrl)}`, extlistBody);
}