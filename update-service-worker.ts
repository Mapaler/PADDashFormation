//import { basename } from "https://deno.land/std/path/mod.ts";
import { createHash } from "https://deno.land/std/hash/mod.ts";

let dirName = "images/cards_ja";
for await (const dirEntry of Deno.readDir(dirName)) {
	if (dirEntry.isFile) {
		const fileName = `${dirName}/${dirEntry.name}`;
		const hash = createHash("md5");
		const file = await Deno.readFile(fileName);
		hash.update(file);
		const hashInHex = hash.toString(); // returns 5fe084ee423ff7e0c7709e9437cee89d
		console.log(hashInHex);
	}
  }