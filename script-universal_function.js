//仿GM_xmlhttpRequest函数v1.5
const GM_xmlhttpRequest = function(GM_param) {
	const xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
	xhr.open(GM_param.method, GM_param.url, true);
	if (GM_param.responseType) xhr.responseType = GM_param.responseType;
	if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
	xhr.onreadystatechange = function(e) //设置回调函数
		{
			const _xhr = e.target;
			if (_xhr.readyState === _xhr.DONE) { //请求完成时
				console.debug("http状态码：", _xhr.status);
				if ((_xhr.status === 200) && GM_param.onload) //正确加载时
				{
					GM_param.onload(_xhr);
				} else if (_xhr.status !== 200 && GM_param.onerror) //发生错误时
				{
					GM_param.onerror(_xhr);
				}
			}
		};
	if (GM_param.onprogress)
		xhr.upload.onprogress = function(e) { GM_param.onprogress(e.target) };
	//添加header
	for (let header in GM_param.headers) {
		xhr.setRequestHeader(header, GM_param.headers[header]);
	}
	//发送数据
	xhr.send(GM_param.data ? GM_param.data : null);
};

//获取URL参数
function getQueryString(name, inputURL = document.location) {
	const url = new URL(inputURL);
	if (!Array.isArray(name)) name = [name];
	//可以以数组形式传递 name 的多个别名，比如 getQueryString(["l","lang"])
	let value;
	for (let index = 0; index < name.length; index++) {
		value = url.searchParams.get(name[index]);
		if (value) break;
	}
	return value;
}

const localStorage_getBoolean = function(name, defaultValue = false) {
	const value = localStorage.getItem(name);
	if (value === null) return defaultValue;
	else if (typeof value === 'string' && /^\s*true\s*$/i.test(value)) return true;
	else return Boolean(Number(value));
}

// 将字符串转为 Blob
String.prototype.toUTF8Blob = function() {
	return new Blob([this.valueOf()], {
		type: 'text/plain'
	});
}
//将 Blob 转为 Base64
Blob.prototype.toBase64 = function() {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = (event) => {
			resolve(event.target?.result);
		};
		// readAsDataURL
		fileReader.readAsDataURL(this.valueOf());
		fileReader.onerror = () => {
			reject(new Error('blobToBase64 error'));
		};
	});
}

/**
 * @readonly
 * @enum {boolean}
 */
const Endian = {
	little: true,
	big: false
};

const ArrayConvert = {
	/**
	 * 将数字数组转为 ArrayBuffer
	 * @typedef {(Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array)} TypedArray
	 * @param {number[]} arr - 传入数据数组
	 * @param {TypedArray} typed - 输出什么 TypedArray
	 * @param {boolean=} endian - True 是小端序(Little Endian), False 是大端序(Big Endian)
	 * @returns {TypedArray} 输出 ArrayBuffer
	 */
	NumberArrayToBuffer: function(arr, typed, endian = true){
		const typedArray = new typed(arr.length);
		const buffer = typedArray.buffer;
		const typedName = typed.name.replace(/(?:Clamped)?Array$/i,"") ;
		const dv = new DataView(buffer);
		arr.forEach((num, idx)=>{
			dv[`set${typedName}`](idx * typed.BYTES_PER_ELEMENT, num, endian);
		});
		return typedArray;
	},
	/**
	 * 将 ArrayBuffer 或 TypedArray 转为数字数组
	 * @typedef {(Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array)} TypedArray
	 * @param {(TypedArray|ArrayBuffer)} data - 传入数据
	 * @param {TypedArray} typed - 读取什么 TypedArray
	 * @param {boolean=} endian - True 是小端序(Little Endian), False 是大端序(Big Endian)
	 * @returns {number[]} 输出的数字数组
	 */
	BufferToNumberArray: function(data, typed, endian = true){
		const buffer = (data instanceof ArrayBuffer) ? data : data.buffer;
		const arr = new Array(buffer.byteLength / typed.BYTES_PER_ELEMENT);
		const typedName = typed.name.replace(/(?:Clamped)?Array$/i,"") ;
		const dv = new DataView(buffer);
		for (let i = 0; i < arr.length; i ++) {
			arr[i] = dv[`get${typedName}`](i * typed.BYTES_PER_ELEMENT, endian);
		}
		return arr;
	}
}

const Base64 = {
	strToBase64: function(str) {
		const encoder = new TextEncoder()
		const view = encoder.encode(str);
		const base64 = view.toBase64(view);
		return base64;
	},
	base64ToStr: function(base64) {
		const decoder = new TextDecoder()
		const view = Uint8Array.fromBase64(base64);
		const str = decoder.decode(view);
		return str;
	},
	bytesToBase64DataUrl: async function(bytes, type = "application/octet-stream") {
		return await new Promise((resolve, reject) => {
			const reader = Object.assign(new FileReader(), {
				onload: () => resolve(reader.result),
				onerror: () => reject(reader.error),
			});
			reader.readAsDataURL(new File([bytes], "", { type }));
		});
	},
	dataUrlToBytes: async function(dataUrl) {
		const res = await fetch(dataUrl);
		return new Uint8Array(await res.arrayBuffer());
	}
	/*
	//Base64还原成Uint8Array，已经被原生的 Uint8Array.fromBase64() 替代。
	decodeToUint8Array: function base64DecToArr(sBase64, nBlocksSize) {
		function b64ToUint6(nChr) {
			return nChr > 64 && nChr < 91
				? nChr - 65
				: nChr > 96 && nChr < 123
				? nChr - 71
				: nChr > 47 && nChr < 58
				? nChr + 4
				: nChr === 43
				? 62
				: nChr === 47
				? 63
				: 0;
		}
		const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, ""); // Remove any non-base64 characters, such as trailing "=", whitespace, and more.
		const nInLen = sB64Enc.length;
		const nOutLen = nBlocksSize
			? Math.ceil(((nInLen * 3 + 1) >> 2) / nBlocksSize) * nBlocksSize
			: (nInLen * 3 + 1) >> 2;
		const taBytes = new Uint8Array(nOutLen);
	
		let nMod3;
		let nMod4;
		let nUint24 = 0;
		let nOutIdx = 0;
		for (let nInIdx = 0; nInIdx < nInLen; nInIdx++) {
			nMod4 = nInIdx & 3;
			nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << (6 * (3 - nMod4));
			if (nMod4 === 3 || nInLen - nInIdx === 1) {
				nMod3 = 0;
				while (nMod3 < 3 && nOutIdx < nOutLen) {
					taBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255;
					nMod3++;
					nOutIdx++;
				}
				nUint24 = 0;
			}
		}
	
		return taBytes;
	},
	//Uint8Array编码成Base64，已经被原生的 Uint8Array.prototype.toBase64() 替代。
	encodeFromUint8Array: function base64EncArr(aBytes) {
		function uint6ToB64(nUint6) {
			return nUint6 < 26
				? nUint6 + 65
				: nUint6 < 52
				? nUint6 + 71
				: nUint6 < 62
				? nUint6 - 4
				: nUint6 === 62
				? 43
				: nUint6 === 63
				? 47
				: 65;
		}
		let nMod3 = 2;
		let sB64Enc = "";
	
		const nLen = aBytes.length;
		let nUint24 = 0;
		for (let nIdx = 0; nIdx < nLen; nIdx++) {
			nMod3 = nIdx % 3;
			// To break your base64 into several 80-character lines, add:
			//   if (nIdx > 0 && ((nIdx * 4) / 3) % 76 === 0) {
			//      sB64Enc += "\r\n";
			//    }
	
			nUint24 |= aBytes[nIdx] << ((16 >>> nMod3) & 24);
			if (nMod3 === 2 || aBytes.length - nIdx === 1) {
				sB64Enc += String.fromCodePoint(
					uint6ToB64((nUint24 >>> 18) & 63),
					uint6ToB64((nUint24 >>> 12) & 63),
					uint6ToB64((nUint24 >>> 6) & 63),
					uint6ToB64(nUint24 & 63)
				);
				nUint24 = 0;
			}
		}
		return (
			sB64Enc.substring(0, sB64Enc.length - 2 + nMod3) +
			(nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==")
		);
	},
	*/
}

/**
 * 大数字以数字量级分隔符形式输出
 * @param {Array} separators 数字量级分隔符数组，从低到高排列
 * @param {number} splitDigits 分隔位数
 * @returns {function} 数字量级分隔符形式输出数字的函数
 */
function BigNumberToStringLocalise(separators, splitDigits = 3 ) {
	if (!Array.isArray(separators)) throw new TypeError('分隔符需要使用数组列出数字量级');
	if (!Number.isInteger(splitDigits)) throw new TypeError('数字分隔位数必须为整数');
	if (splitDigits < 1) throw new RangeError('数字分隔位数至少是1位');

	const grouping = 10 ** splitDigits;
	separators = separators.map(String); //确保所有的分割符都是字符串
	
	return function(options = {}){
		const thisValue = this.valueOf();
		if (thisValue === 0 ||
			thisValue === Infinity ||
			thisValue === -Infinity
		) {
			return this.toLocaleString();
		}
		if (Number.isNaN(thisValue)) return 0..bigNumberToString();
		
		const numLevels = [];
		let numTemp = Math.abs(thisValue);

		do {
			numLevels.push(numTemp % grouping); //这一段数量级的数字
			numTemp = Math.floor(numTemp / grouping);
		} while (numTemp > 0 && numLevels.length < (separators.length - 1))
		if (numTemp > 0) {
			numLevels.push(numTemp);
		}
		
		const { sub: useSubElement } = options;
		const outArr = [];
		if (thisValue < 0) outArr.push('-'); //小于0的添加负号
		for (let i = numLevels.length - 1; i >= 0; i--) {
			if (numLevels[i] == 0) continue; //如果这一段是0，直接不显示

			let numberStr = numLevels[i].toString(10);
			if (i == numLevels.length - 1) numberStr = numberStr.padStart(i == numLevels.length - 1 ? 1 : splitDigits, "0");
			outArr.push(numberStr);
			if (useSubElement) {
				const separator = document.createElement("sub");
				separator.textContent = separators[i];
				outArr.push(separator);
			} else {
				outArr.push(separators[i]);
			}
		}
		return useSubElement ? outArr.nodeJoin() : outArr.join('').trim();
	}
}
Number.prototype.bigNumberToString = BigNumberToStringLocalise(['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'R', 'Q'], 3);

//最多保留N位小数，不留0
Number.prototype.keepCounts = function(decimalDigits = 2, plusSign = false) {
	let newNumber = Number(this.toFixed(decimalDigits));
	return (plusSign && this > 0 ? '+' : '') + newNumber.bigNumberToString();
}
//Bitwise
Number.prototype.notNeighbour = function() {
	const num = this.valueOf();
	return ~num & (num << 1 | num >> 1);
}
//数组删除自己尾部的空元素
Array.prototype.deleteLatter = function(item = null) {
	let index = this.length - 1;
	for (; index >= 0; index--) {
		if (this[index] !== item) {
			break;
		}
	}
	this.splice(index + 1);
	return this;
}
//数组去重，改变自身
Array.prototype.distinct = function() {
	const _set = new Set(this);
	this.length = 0;
	this.push(..._set);
	return this.valueOf();
}
//数组交换元素
Array.prototype.switch = function(i1, i2) {
	if (Math.max(i1, i2) >= this.length) return false;
	let temp = this[i1];
	this[i1] = this[i2];
	this[i2] = temp;
    return true;
}
//数组随机排序
Array.prototype.shuffle = function() {
    let length = this.length;
    while (length) {
        randomIndex = Math.floor(Math.random() * length--);
		this.switch(length, randomIndex);
    }
    return this;
}
//数组随机移除元素
Array.prototype.randomShift = function() {
	if (this.length === 0) {
		return null;
	} else if (this.length === 1) {
		return this.shift();
	} else {
		return this.splice(Math.random() * this.length, 1)?.[0];
	}
}
//数组分组函数，用法：array.groupBy((a,b)=>a.type === b.type)
Array.prototype.groupBy = function(func) {
	const groups = this.reduce((pre,cur)=>{
		const grp = pre.find(grp=>grp?.[0] && func(grp?.[0], cur));
		if (grp)
			grp.push(cur);
		else
			pre.push([cur]);
		return pre;
	}, []);
	return groups;
}
//将内容添加到代码片段
DocumentFragment.prototype.ap = function(...args)
{
	const items = args.flat(Infinity).filter(item=>item !== null && item !== void 0);
	this.append(...items);
	return this;
}

/**
 * 将数组和分隔符添加到一个代码片段，类似join
 * @param {(string | Node)} separator 每个对象之间合并的分割符或代码片段
 * @returns {DocumentFragment} 一个文档片段
 */
Array.prototype.nodeJoin = function(separator)
{
	const frg = document.createDocumentFragment();
	this.forEach((item, idx, arr)=>{
		frg.ap(item);
		if (idx < (arr.length - 1) && separator !== null && separator !== void 0) {
			frg.ap(separator instanceof Node ? separator.cloneNode(true) : separator);
		}
	});
	return frg;
}
//数组随机选择一个元素
Array.prototype.randomItem = function(){
	if (this.length === 0) {
		return null;
	} else if (this.length === 1) {
		return this[0];
	} else {
		return this[Math.randomInteger(this.length-1)];
	}
};

Math.randomInteger = function(max, min = 0) {
	let _max = Math.max(max, min),
		_min = Math.min(max, min);
	return this.floor(this.random()*(_max-_min+1)+_min);
}
Math.isPowerOfTwo = function(n) {
	if (Number.isInteger(n) && n > 0)
		return (n & (n - 1)) === 0;
	else
		return false;
}
class Bin extends Set {
	static #typeError_Constructor = "传入的不是 number 和 bigint 类型或这个两个类型的数组";
	static #typeError_FlagsNum = "传入的不是 number 和 bigint 类型";
	static #typeError_FlagsArray = "传入的不是 number 类型的数组";
	static #typeError_NotInteger = "传入的不是 整数";
	static #rangeError_NotSafe = "传入的 number 大于 53 位";
	/**
	 * 构建函数
	 * @param {(number | bigint | number[])} arg 传入参数
	 */
	constructor (arg) {
		if (typeof arg === "number" || typeof arg === "bigint") {
			super(Bin.unflags(arg));
		} else if (Array.isArray(arg) &&
			arg.every(item=>typeof item === "number" && Number.isSafeInteger(item))
		){
			super(arg);
		} else {
			throw new TypeError(Bin.#typeError_Constructor);
		}
	}
	/**
	 * 将数字或大整形flag转换为数组
	 * @param {(number | bigint)} number 输入的数字
 	 * @returns {number[]} 输出数组
	 */
	static unflags(number) {
		const arr = [];
		if (!number) return arr;
		const inputType = typeof number;
		if (inputType === "number" || inputType === "bigint"){
			if (inputType === "number" && number > Number.MAX_SAFE_INTEGER) {
				throw new RangeError(Bin.#rangeError_NotSafe);
			}
			const isBigint = inputType === "bigint";
			for (let i = 0, flag = isBigint ? 1n : 1; flag <= number; i++, flag = (isBigint ? 2n : 2) ** (isBigint ? BigInt(i) : i)) {
				if (number & flag) {
					arr.push(i);
				}
			}
			return arr;
		} else {
			throw new TypeError(Bin.#typeError_FlagsNum + " " + number);
		}
	}
	/**
	 * 将数字序号转换为数字
	 * @param {number[]} indexArr 输入的序号数组
	 * @returns {(number | bigint)} 输出的数字
	 */
	static enflags(indexArr) {
		if (Array.isArray(indexArr) &&
			indexArr.every(item=>typeof item === "number" && Number.isSafeInteger(item))
		){
			let result = 0, isBigint = false, baseNum = 2;
			for (let i = 0; i < indexArr.length; i++) {
				let value = indexArr[i];
				//当数值大于52位，即需要换BigInt
				if (value > 52 && !isBigint) {
					isBigint = true;
					result = BigInt(result);
					baseNum = BigInt(baseNum);
				}
				isBigint && (value = BigInt(value)); //一旦需要BigInt了，就转换
				result = result + baseNum ** value; //用乘方相加而不是位移的优点是可以得到 0xFFFFFFFF 而不是 -1
			}
			return result;
		} else {
			throw new TypeError(Bin.#typeError_FlagsArray);
		}
	}
	get int() {
		return Bin.enflags(Array.from(this.values()));
	}
	add(index) {
		if (typeof index === "number" && Number.isSafeInteger(index)){
			super.add(index);
		} else {
			throw new TypeError(Bin.#typeError_NotInteger);
		}
	}
}

//带标签的模板字符串
function tp(stringsArr, ...keys) {
	return ((...values)=>{
		const dict = values[values.length - 1] || {};
		const fragment = document.createDocumentFragment();
		for (let i = 0; i < keys.length; i++) {
			fragment.append(stringsArr[i]);
			const key = keys[i];
			const value = Number.isInteger(key) ? values[key] : dict[key];
			if (value !== null && value !== void 0) {
				try {
					fragment.append((value instanceof Node && keys.lastIndexOf(key) !== i) ? value.cloneNode(true) : value); //如果是不最后一个匹配的标签，就插入克隆的DOM，否则可以插入原始的DOM（保留行为）
				}
				catch(e) {
					console.error("模板字符串错误： %o，", e, values, keys, value);
				}
			}
		}
		//补上最后一个字符串
		fragment.append(stringsArr[keys.length]);

		return fragment;
	});
}

//来自于 https://www.cnblogs.com/zhenguo-chen/p/14672332.html
function deepMerge(obj1, obj2) {
	let key;
	for (key in obj2) {
	  // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
	  // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
		obj1[key] =
			obj1[key] &&
				obj1[key].toString() === "[object Object]" &&
				(obj2[key] && obj2[key].toString() === "[object Object]")
				? deepMerge(obj1[key], obj2[key])
				: (obj1[key] = obj2[key]);
	}
	return obj1;
}
//▼ADPCM播放相关，来自 https://github.com/jy4340132/aaa
const pcmMemory = new WebAssembly.Memory({ initial: 256, maximum: 256 });

const pcmImportObj = {
	env: {
		abortStackOverflow: () => { throw new Error("overflow"); },
		table: new WebAssembly.Table({ initial: 0, maximum: 0, element: "anyfunc" }),
		tableBase: 0,
		memory: pcmMemory,
		memoryBase: 102400,
		STACKTOP: 0,
		STACK_MAX: pcmMemory.buffer.byteLength,
	}
};

let pcmPlayer = null;
let adpcm_wasm = null;

async function decodeAudio(fileName, decodeCallback) {
	if (pcmPlayer != null) {
		pcmPlayer.close();
	}
	pcmPlayer = new PCMPlayer(1, 44100);
	let request = await fetch(fileName);
	let buffer = await request.arrayBuffer();
	
	let audioData = new Uint8Array(buffer);
	if (audioData[16] == 0x10) { //普通WAV，建立一个audio来播放
		console.debug('当前 WAV 为 普通 WAV');
		const audioCtx = new AudioContext();
		const decodedData = await audioCtx.decodeAudioData(buffer);
		const source = new AudioBufferSourceNode(audioCtx);
		source.buffer = decodedData;
		source.connect(audioCtx.destination);
		source.start(0);
	} else { //audioData[16] == 0x14
		console.debug('当前 WAV 为 PCM WAV');
		let step = 160;
		for (let i = 0; i < audioData.byteLength; i += step) {
			let pcm16BitData = decodeCallback(audioData.slice(i, i + step));
			let pcmFloat32Data = Std.shortToFloatData(pcm16BitData);
			pcmPlayer.feed(pcmFloat32Data);
		}
	}
}

fetch("library/jy4340132-aaa/adpcm.wasm").then((response) => response.arrayBuffer())
	.then((bytes) => WebAssembly.instantiate(bytes, pcmImportObj))
	.then((wasm) => {
		adpcm_wasm = wasm;
		/*addButton("adpcm").onclick = function () {
			let decoder = new Adpcm(wasm, pcmImportObj);
			decoder.resetDecodeState(new Adpcm.State(0, 0));
			decodeAudio("demo.adpcm", decoder.decode.bind(decoder));
		}*/
	});

function playVoiceById(id) { //点击label才播放语音
	if (!Number.isInteger(id)) {
		throw new TypeError("传入的音频 ID 不是整数");
	}
	const sndURL = `sound/voice/${currentDataSource.code}/padv${id.toString().padStart(3,'0')}.wav`;
	const decoder = new Adpcm(adpcm_wasm, pcmImportObj);
	decoder.resetDecodeState(new Adpcm.State(0, 0));
	decodeAudio(sndURL, decoder.decode.bind(decoder));
}
//▲ADPCM播放相关

// 加载 image
function loadImage(url) {
	return new Promise(function(resolve, reject) {
		const image = new Image();

		image.src = url;
		image.type = "svg"
		image.crossOrigin = 'Anonymous';
		image.onload = function() {
			resolve(this);
		};

		image.onerror = function(err) {
			reject(err);
		};
	});
}

//代码来自 https://segmentfault.com/a/1190000004451095
function fileReader (file, options = {}) {
	return new Promise(function (resolve, reject) {
		const reader = new FileReader();

		reader.onload = function () {
			resolve(reader);
		};
		reader.onerror = reject;

		if (options.accept && !new RegExp(options.accept).test(file.type)) {
			reject({
				code: 1,
				msg: 'wrong file type'
			});
		}

		if (!file.type || /^text\//i.test(file.type) || options.readType == "text") {
			reader.readAsText(file);
		} else {
			reader.readAsDataURL(file);
		}
	});
}

function dbReadKey (db, tableName, keys) {
	return new Promise(function (resolve, reject) {
		const transaction = db.transaction([tableName]);
		const objectStore = transaction.objectStore(tableName);
		const request = objectStore.get(keys);
		request.onsuccess = function(event) {
			resolve(request.result);
		};
		request.onerror = reject;
	});
}

function dbCount (db, tableName, key) {
	return new Promise(function (resolve, reject) {
		const transaction = db.transaction([tableName]);
		const objectStore = transaction.objectStore(tableName);
		const request = objectStore.count(key);
		request.onsuccess = function() {
			resolve(request.result);
		}
		request.onerror = reject;
	});
}

function dbReadAll (db, tableName) {
	return new Promise(async function (resolve, reject) {
		const datas = [];
		const transaction = db.transaction([tableName]);
		const objectStore = transaction.objectStore(tableName);
		const request = objectStore.openCursor();
		request.onsuccess = function(event) {
			const cursor = event.target.result;
			if (cursor) {
				// cursor.value 包含正在被遍历的当前记录
				// 这里你可以对 result 做些什么
				datas.push(cursor.value);
				cursor.continue();
			} else {
				// 没有更多 results
				resolve(datas);
			}
		};
		request.onerror = reject;
	});
}

function dbWrite (db, tableName, data, keys) {
	return new Promise(function (resolve, reject) {
		const transaction = db.transaction([tableName], "readwrite");
		const objectStore = transaction.objectStore(tableName);
		const request = objectStore.put(data, keys);
		request.onsuccess = function(event) {
			resolve(event);
		};
		request.onerror = reject;
	});
}

function dbDelete (db, tableName, keys) {
	return new Promise(function (resolve, reject) {
		const transaction = db.transaction([tableName], "readwrite");
		const objectStore = transaction.objectStore(tableName);
		const request = objectStore.delete(keys);
		request.onsuccess = function(event) {
			resolve(event);
		};
		request.onerror = reject;
	});
}
//1个潜觉需要用多少格子
function latentUseHole(latentId) {
	switch (latentId) {
		case 12: case 16: case 17: case 18: case 19:
		case 20: case 21: case 22: case 23: case 24:
		case 25: case 26: case 27: case 28: case 29:
		case 30: case 31: case 32: case 33: case 34:
		case 35: case 36: case 43: case 44: case 45:
		{
			return 2;
		}
		case 13: case 14: case 15: case 37: case 38:
		case 39: case 40: case 41: case 42: case 46:
		case 47: case 48: case 49:
		{
			return 6;
		}
		case  1: case  2: case  3: case  4: case  5:
		case  6: case  7: case  8: case  9: case 10:
		case 11: case 12:
		default:
		{
			return 1;
		}
	}
}
//获取最大潜觉数量
function getMaxLatentCount(id) { //转生2和超转生3为8个格子
	const card = Cards[id];
	return card && card.is8Latent ? 8 : 6;
}
//计算用了多少潜觉格子
function usedHole(latents) {
	return latents.reduce((usedHole, latentId) => usedHole + latentUseHole(latentId), 0);
}
//计算所有队伍中有多少个该觉醒
function awokenCountInFormation(formationTeams, awokenIndex, solo, teamsCount) {
	const formationAwokenCount = formationTeams.reduce(function(previous, team) {
		return previous + awokenCountInTeam(team, awokenIndex, solo, teamsCount);
	}, 0);
	return formationAwokenCount;
}
//计算单个队伍中有多少个该觉醒
function awokenCountInTeam(team, awokenIndex, solo, teamsCount) {
	const [memberArray, assistArray] = team;

	const teamAwokenCount = memberArray.reduce(function(previous, mon, idx) {
		if (mon.id <= 0) { //如果是delay和null
			return previous;
		}
		const card = Cards[mon.id];
		if (!card || !card.enabled) { //如果卡片未启用
			return previous;
		}

		const assist = assistArray[idx];
		const assistCard = Cards[assist.id];
		//启用的觉醒数组片段
		let enableAwoken = card.awakenings.slice(0, mon.awoken);
		//单人、3人时,大于等于100级且297时增加超觉醒
		if ((solo || teamsCount === 3) && mon.sawoken > 0 &&
			(mon.level >= 100 && mon.plus.every(p=>p>=99) ||
			mon.sawoken === card.syncAwakening)
		) {
			enableAwoken.push(mon.sawoken);
		}
		if (assistCard && assistCard.enabled && assistCard.awakenings.includes(49)) { //如果卡片未启用
			enableAwoken.push(...assistCard.awakenings.slice(0, assist.awoken));
		}

		//相同的觉醒数
		const hasAwoken = enableAwoken.filter(ak => { return ak == awokenIndex; }).length;
		return previous + hasAwoken;
	}, 0);
	return teamAwokenCount;
}
//返回可用的怪物名称
function returnMonsterNameArr(card, lsList = currentLanguage.searchlist, defaultCode = currentDataSource.code) {
	const monNameArr = lsList.map(lc => { //取出每种语言
		if (lc == defaultCode)
			return card.name;
		else if (card.otLangName)
			return card.otLangName[lc];
	}).filter(ln => //去掉空值和问号
		typeof(ln) == "string" && ln.length > 0 && !new RegExp("^(?:초월\\s*)?[\\?\\*]+", "i").test(ln)
	);

	if (monNameArr.length < 1) //如果本来的列表里没有名字
	{
		monNameArr.push(card.name); //只添加默认名字
	}
	return monNameArr;
}
//Code From pad-rikuu
function valueAt(level, maxLevel, curve) {
	const f = (maxLevel === 1 || level >= maxLevel) ? 1 : ((level - 1) / (maxLevel - 1));
	return curve.min + (curve.max - curve.min) * f ** curve.scale;
}
//Code From pad-rikuu
function curve(c, level, maxLevel, limitBreakIncr, limitBreakIncr120) {
	let value = valueAt(level, maxLevel, {
		min: c.min,
		max: c.max !== void 0 ? c.max : (c.min * maxLevel),
		scale: c.scale || 1
	});

	if (level > maxLevel) {
		const exceed99 = Math.min(level - maxLevel, 11);
		const exceed110 = Math.max(0, level - 110);
		value += c.max !== void 0 ?
			((c.max * (limitBreakIncr / 100) * (exceed99 / 11)) + (c.max * (limitBreakIncr120 / 100) * (exceed110 / 10))) :
			(c.min * exceed99 + c.min * exceed110);
	}
	return value;
}
//计算怪物的经验值
function calculateExp(member) {
	if (!member) return null;
	const memberCard = Cards[member.id];
	if (!memberCard || memberCard.id == 0 || !memberCard.enabled) return null;
	const expArray = [
		Math.round(valueAt(member.level, 99, memberCard.exp)) //99级以内的经验
	];
	if (member.level > 99)
		expArray.push(Math.max(0, Math.min(member.level, 110) - 100) * 5000000);
	if (member.level > 110)
		expArray.push(Math.max(0, Math.min(member.level, 120) - 110) * 20000000);
	return expArray;
}
//计算怪物的能力
function calculateAbility(member, assist = null, solo = true, teamsCount = 1) {
	if (!member) return null;

	const memberCard = Cards[member.id];
	const assistCard = assist ? Cards[assist.id] : null;
	if (!memberCard || memberCard.id == 0 || !memberCard.enabled) return null;

	const bonusScale = [0.1, 0.05, 0.15]; //辅助宠物附加的属性倍率
	const plusAdd = [10, 5, 3]; //加值的增加值
	const limitBreakIncr120 = [10, 5, 5]; //120三维增加百分比例

	const awokenAdd = [ //对应加三维觉醒的序号与增加值
		[{ index: 1, value: 500 }, { index: 65, value: -2500 }], //HP
		[{ index: 2, value: 100 }, { index: 66, value: -1000 }], //ATK
		[{ index: 3, value: 200 }, { index: 67, value: -2000 }] //RCV
	];
	const previousAwokenScale = [ //在297之前，对应比例加三维觉醒的序号与倍率值，63 语音觉醒、132 下午茶觉醒
		[{ index: 63, scale: 1.1 }, { index: 132, scale: 1.25 }], //HP
		[{ index: 63, scale: 1.1 }, { index: 132, scale: 1.25 }], //ATK
		[{ index: 63, scale: 1.1 }, { index: 132, scale: 1.25 }] //RCV
	];
	const latterAwokenScale = [ //在297之后，对应比例加三维觉醒的序号与倍率值，30 协力觉醒、127 三维觉醒
		[{ index: 127, scale: 1.5 }], //HP
		[{ index: 127, scale: 1.5 }], //ATK
		[{ index: 127, scale: 1.5 }] //RCV
	];

	if (!solo) { //协力时计算协力觉醒
		latterAwokenScale.forEach(ab => {
			ab.push({ index: 30, scale: 1.5 });
		});
	}

	const latentScale = [ //对应加三维潜在觉醒的序号与增加比例
		[{ index: 1, scale: 0.015 }, { index: 12, scale: 0.03 }, { index: 28, scale: 0.045 }, { index: 43, scale: 0.10 }], //HP
		[{ index: 2, scale: 0.01 }, { index: 12, scale: 0.02 }, { index: 29, scale: 0.03 }, { index: 44, scale: 0.08 }], //ATK
		[{ index: 3, scale: 0.1 }, { index: 12, scale: 0.2 }, { index: 30, scale: 0.3 }, { index: 45, scale: 0.35 }] //RCV
	];
	const memberCurves = [memberCard?.hp, memberCard?.atk, memberCard?.rcv];
	const assistCurves = assistCard?.canAssist && [assistCard.hp, assistCard.atk, assistCard.rcv];
	
	//储存点亮的觉醒
	let awokenList = memberCard.awakenings.slice(0, member.awoken);
	//单人、3人时,大于等于100级且297时增加超觉醒
	if ((solo || teamsCount === 3) && member.sawoken > 0 &&
		(member.level >= 100 && member.plus.every(p=>p>=99) ||
		member.sawoken === memberCard.syncAwakening)
	) {
		awokenList.push(member.sawoken)
	}
	//如果有武器还要计算武器的觉醒
	let enableBouns = false;
	if (assistCard?.id > 0 && assistCard.enabled) {
		const assistAwokenList = assistCard.awakenings.slice(0, assist.awoken); //储存武器点亮的觉醒
		if (assistAwokenList.includes(49)) { //49是武器觉醒，确认已经点亮了武器觉醒
			awokenList.push(...assistAwokenList);
		}
		enableBouns = memberCard.attrs[0] === assistCard.attrs[0] || memberCard.attrs[0] == 6 || assistCard.attrs[0] == 6;
	}

	//地下城强化
	const dge = formation.dungeonEnchance;
	const dgeRate = [dge.rate.hp, dge.rate.atk, dge.rate.rcv];
	const isDge = (()=>{
		const memberAttrsTypesWithWeapon = typeof member.getAttrsTypesWithWeapon === "function" ? member.getAttrsTypesWithWeapon(assist) : memberCard;
		const baseBool = dge.rarities.includes(memberCard.rarity) //符合星级
			|| dge?.collabs?.includes(memberCard.collabId) //符合合作
			|| dge?.gachas?.some(n=>memberCard.gachaIds.includes(n)); //符合抽蛋桶
		return {
			awoken: baseBool //计算武器觉醒
				|| memberAttrsTypesWithWeapon.attrs.some(attr=>dge.attrs.includes(attr)) //符合属性
				|| memberAttrsTypesWithWeapon.types.some(type=>dge.types.includes(type)) //符合类型
				,
			noAwoken: baseBool //不计算武器觉醒
				|| memberCard.attrs.some(attr=>dge.attrs.includes(attr)) //符合属性
				|| memberCard.types.some(type=>dge.types.includes(type)) //符合类型
				,
		};
	})();

	//地下城阴阳加护强化
	if (dge.benefit) { //当存在加护
		const benefitAwokens = [128 , 129]; //0b1是阳，0b10是阴，可以两者都强化
		Bin.unflags(dge.benefit).forEach(idx=>{
			const akId = benefitAwokens[idx]; //得到加护觉醒编号
			latterAwokenScale[0].push({ index: akId, scale: 1.2 }); //HP
			latterAwokenScale[1].push({ index: akId, scale: 5 }); //ATK
			latterAwokenScale[2].push({ index: akId, scale: 1.2 }); //RCV
		});
	}

	if (dge.stage > 1) { //当存在地下城层数
		let scale = 1;
		if (dge.stage>=10) scale = 2;
		else if (dge.stage>=5) scale = 1.5;

		const akId = 130; //130号熟成觉醒
		latterAwokenScale.forEach(ab => {
			ab.push({ index: akId, scale: scale });
		});
	}

	if (dge.brokens > 0) { //破坏部位个数
		//131号部位破坏觉醒
		latterAwokenScale.forEach(ab => {
			ab.push({ index: 131, scale: 1.2 ** dge.brokens });
		});
	}

	const abilitys = memberCurves.map((ab, idx) => {
		const n_base = Math.round(curve(ab, member.level, memberCard.maxLevel, memberCard.limitBreakIncr, limitBreakIncr120[idx])); //等级基础三维
		const n_plus = member.plus[idx] * plusAdd[idx]; //加值增加量
		let n_assist_base = 0,
			n_assist_plus = 0; //辅助的bonus
		//计算辅助的额外血量
		if (assistCurves && enableBouns) {
			n_assist_base = Math.round(curve(assistCurves[idx], assist.level, assistCard.maxLevel, assistCard.limitBreakIncr, limitBreakIncr120[idx])); //辅助等级基础三维
			n_assist_plus = assist.plus[idx] * plusAdd[idx]; //辅助加值增加量
		}

		//用来计算倍率觉醒的最终倍率是多少，reduce用
		function calculateAwokenScale(previous, aw) {
			const awokenCount = awokenList.filter(ak => ak == aw.index).length; //每个倍率觉醒的数量
			return previous * aw.scale ** awokenCount;
		}

		//倍率类觉醒的比例，直接从1开始乘
		const n_previousAwokenScale = previousAwokenScale[idx].reduce(calculateAwokenScale, 1);
		//觉醒增加的数值
		const n_awoken = awokenList.length > 0 ?
			Math.round(awokenAdd[idx].reduce((previous, aw) => {
				const awokenCount = awokenList.filter(ak => ak == aw.index).length; //每个觉醒的数量
				if (awokenCount > 0)
					return previous + aw.value * awokenCount;
				else
					return previous;
			}, 0)) :
			0;

		//潜觉增加的倍率，从0开始，增加比例小于1，是加法不是乘法
		const n_latentScale = (member.latent && member.latent.length > 0) ?
			latentScale[idx].reduce((previous, la) => {
				const latentCount = member.latent.filter(l => l === la.index).length; //每个潜觉的数量
				return previous + la.scale * latentCount;
			}, 0) :
			0;


		const dgeScale = { //地下城强化比例
			awoken: isDge.awoken && dgeRate[idx] !== 1 ? dgeRate[idx] : 1,
			noAwoken: isDge.noAwoken && dgeRate[idx] !== 1 ? dgeRate[idx] : 1,
		};
		if (idx === 1 && dgeScale.awoken < 1 && awokenList.includes(106)) {
			//觉醒有浮游，比例乘以20
			dgeScale.awoken = Math.min(1, dgeScale.awoken * 20);
		}

		let reValue = Math.round(n_base * n_previousAwokenScale) + n_plus +
					Math.round(n_base * n_latentScale) + n_awoken +
					Math.round((n_assist_base + n_assist_plus) * bonusScale[idx]);
		//觉醒生效时的协力、1.5三维、阴阳、熟成等的倍率
		reValue = Math.floor(reValue * latterAwokenScale[idx].reduce(calculateAwokenScale, 1) * dgeScale.awoken);
		//因为语音觉醒觉醒无效也生效，所以这里需要计算
		let reValueNoAwoken = Math.round(n_base * n_previousAwokenScale) + n_plus +
					Math.round((n_assist_base + n_assist_plus) * bonusScale[idx]);
		reValueNoAwoken = Math.floor(reValueNoAwoken * dgeScale.noAwoken)

		if (idx < 2) //idx顺序为HP、ATK、RCV
		{ //HP和ATK最低为1
			reValue = Math.max(reValue, 1);
			reValueNoAwoken = Math.max(reValueNoAwoken, 1);
		}
		return [reValue, reValueNoAwoken];
	});
	return abilitys;
}

function calculateAbility_max(id, solo, teamsCount, maxLevel = 110) {
	const card = Cards[id];
	const tempMon = {
		id: id,
		level: card.limitBreakIncr ? maxLevel : card.maxLevel,
		plus: (card.stackable || card.types[0] == 15 && card.types[1] == -1) ? [0, 0, 0] : [99, 99, 99], //当可以叠加时，不能打297
		awoken: card.awakenings.length,
		sawoken: 0
	};
	/*强制计算超觉醒
	if (card.superAwakenings.includes(127)) {
		tempMon.sawoken = 127;
	}*/
	const abilities = calculateAbility(tempMon, null, solo, teamsCount);
	if (abilities) {
	const [[hp,hpNA], [atk,atkNA], [rcv,rcvNA]] = abilities;
		return {
			withAwoken: {
				hp: hp,
				atk: atk,
				rcv: rcv,
			},
			noAwoken: {
				hp: hpNA,
				atk: atkNA,
				rcv: rcvNA,
			},
		};
	} else {
		return null;
	}
}
//搜索卡片用
function searchCards(cards, {attrs: sAttrs, fixMainColor, types, typeAndOr, rares, awokens, sawokens, equalAk, incSawoken, canAssist, canLv110, is8Latent, notWeapon}) {
	let cardsRange = [...cards]; //这里需要复制一份原来的数组，不然若无筛选，后面的排序会改变初始Cards
	if (canAssist) cardsRange = cardsRange.filter(card=>card.canAssist);
	if (canLv110) cardsRange = cardsRange.filter(card=>card.limitBreakIncr>0);
	if (is8Latent) cardsRange = cardsRange.filter(card=>card.is8Latent);
	if (notWeapon) cardsRange = cardsRange.filter(card=>!card.awakenings.includes(49) && //不是武器
					!card.stackable); //不可堆叠
	//属性
	const anyAttrsFlag = 0b101_1111; //所有颜色的查找，注意右边才是最低位
	sAttrs = sAttrs.map(attr=>attr || anyAttrsFlag); //如果传入搜索为0，提高到任意色

	if (sAttrs.some(attr=>(attr & anyAttrsFlag) !== anyAttrsFlag)) { //当任一属性不为任意颜色时才需要筛选属性，否则跳过属性筛选
		//如果固定顺序就直接使用当前颜色顺序；否则不考虑顺序时，去除任意色
		// const attrNums = sAttrs.filter(attr=>fixMainColor || attr > 0 && (attr & anyAttrsFlag) !== anyAttrsFlag)
		// 	.map(attr=>{
		// 		const attrNum = Bin.unflags(attr);
		// 		if (attrNum.includes(6)) attrNum.push(undefined,-1); //如果是包含6的，就添加-1和undefined的值
		// 		return attrNum;
		// 	});
		if (fixMainColor) {//如果固定了顺序
			//只有第一属性有搜索内容时才搜索无主属性
			const isSearchNoMainAttr = (sAttrs[0] ^ 0b100_0000) > 0 && sAttrs.slice(1).every(attr=>(attr & anyAttrsFlag) === anyAttrsFlag);
			cardsRange = cardsRange.filter(({attrs:cAttrs}) => {
				//默认逻辑为，只要不是any，就判断这个颜色是否包含了对应的颜色
				//不能用怪物颜色来查找，因为怪物只有一个颜色就会提前退出循环，导致不搜索副属性
				return sAttrs.every((sAttr, idx)=>{				
					if (idx === 0 && isSearchNoMainAttr && //第一属性搜索，需要搜索无主属性时
						 //只选第一属性的时候，且第一属性为无主属性的时候，也显示副属性等于主属性的
						cAttrs[0] === 6 && //角色第一属性为无主属性
						(sAttr & 1 << cAttrs[1])) return true; //第二属性计算flag
					
					const flag = 1 << (Number.isInteger(cAttrs[idx]) ? cAttrs[idx] : 6);
					return sAttr & flag;
				});
				
				// (isAnyAttrs[0] || attrNums[0].includes(cAttrs[0]) ||
				// 		isAnyAttrs[1] && cAttrs[0] === 6 && attrNums[0].includes(cAttrs[1])) && //只选第一属性的时候，且第一属性为无主属性的时候，也显示副属性等于主属性的
				// 	   (isAnyAttrs[1] || attrNums[1].includes(cAttrs[1])) &&
				// 	   (isAnyAttrs[2] || attrNums[2].includes(cAttrs[2]));
			});
		}
		else {//不限定顺序时
			//const notAnyAttrsCount = isAnyAttrs.filter(b=>!b).length;
			cardsRange = cardsRange.filter(({attrs:cAttrs, id}) => {
				cAttrs = [...cAttrs];
				for (let i = 1; i < sAttrs.length; i++) {
					if (!Number.isInteger(cAttrs[i])) cAttrs[i] = 6;
				}
				/*
					我也不知道为什么这个代码可以跑，没学过矩阵运算，乱猜的，好像结果可以用，结果发现矩阵好像根本没用
				*/
				const matrix3x3 = sAttrs.map(sAttr=>{
					return cAttrs.map(cAttr=>1 << cAttr & sAttr);
				});
				const rowValues = matrix3x3.map(row=>row.reduce((p,v)=>p | v,0)); //每个属性都有 filter 匹配
				// const columValues = []; //每个 filter 都能匹配属性
				// for (let i = 0; i < notAnyAttrsCount; i++) {
				// 	const columValue = matrix3x3.reduce((p,v)=>p | v[i],0);
				// 	columValues.push(columValue);
				// }
				if (!rowValues.every(Boolean)) return false; //如果有哪个选择器没有匹配上，直接跳过

				const crossValue = cAttrs.map((cAttr, idx, arr)=> {
					return arr.filter(item=>item===cAttr).length <= rowValues.filter(item=>item & 1 << cAttr).length;
				});
				const match = crossValue.every(Boolean);
				// if (match) {
				// 	console.debug("id: %d, matrix3x3: %o, rowValues: %o, columValues: %o, crossValue: %o", id, matrix3x3, rowValues, columValues, crossValue);
				// }
				return match;
			});
		}
	}
	//类型
	if (types.length > 0) {
		//所有type都满足，或只需要满足一个type
		const logicFunc = typeAndOr ? Array.prototype.every : Array.prototype.some;
		cardsRange = cardsRange.filter(({types: cTypes}) => logicFunc.call(types, t => cTypes.includes(t)));
	}
	//稀有度
	if (rares.length > 0 && rares.length < 10) { //不是1~10时才进行筛选
		cardsRange = cardsRange.filter(({rarity}) => rares.includes(rarity));
	}
	//觉醒
	const searchAwokens = [];
	//等效觉醒时，把大觉醒数量变成小觉醒数量
	if (equalAk) {
		awokens.forEach(ak=>{
			const equivalentAwoken = equivalent_awoken.find(eak => eak.big === ak.id); //搜索是否是大觉醒
			if (equivalentAwoken) {
				let smallAwoken = awokens.find(_ak => equivalentAwoken.small === _ak.id); //搜索对应小觉醒
				if (!smallAwoken) {
					smallAwoken = { id: equivalentAwoken.small, num: 0 }; //如果没有对应小觉醒就新建一个
				}
				smallAwoken.num += ak.num * equivalentAwoken.times;
				searchAwokens.push(smallAwoken);
			} else {
				searchAwokens.push(ak);
			}
		});
	} else {
		searchAwokens.push(...awokens);
	}
	if (searchAwokens.length > 0) {
		cardsRange = cardsRange.filter(card => {
			let cardAwakeningsCombos= []; //加上超觉醒的数种组合
			if (incSawoken && //搜索超觉醒
				card.superAwakenings.length > 0 && //卡片有超觉醒
				!searchAwokens.includes(49) //搜索觉醒里不包含武器觉醒，因为武器觉醒必定不考虑超觉醒，这一条是属于优化，可以不要
			) { //如果搜索超觉醒，产生原始觉醒分别加上每个超觉醒的多个数组
				cardAwakeningsCombos = card.superAwakenings.map(sak => card.awakenings.concat(sak));
			} else { //单个原始觉醒数组
				cardAwakeningsCombos.push(card.awakenings);
			}

			return cardAwakeningsCombos.some(cardAwakening => //重复每种包含超觉醒的觉醒数组，只要有一组符合要求就行
				searchAwokens.every(ak => { //判断需要搜索的觉醒是不是全都在觉醒数组里
					let akNum = cardAwakening.filter(cak => cak === ak.id).length;
					let equivalentAwoken;
					if (equalAk && (equivalentAwoken = equivalent_awoken.find(eak => eak.small === ak.id))) //如果开启等效觉醒。比较的都是小觉醒的数量
					{
						akNum += cardAwakening.filter(cak => cak === equivalentAwoken.big).length * equivalentAwoken.times;
					}
					return akNum >= ak.num;
				})
			);
		});
	}

	//超觉醒
	if (sawokens.length > 0 && !incSawoken) {
		cardsRange = cardsRange.filter(card => sawokens.some(sak => {
			let equivalentAwoken;
			return card.superAwakenings.includes(sak) ||
				//如果开启等效觉醒
				equalAk && (equivalentAwoken = equivalent_awoken.find(eak => eak.small === sak)) &&
				card.superAwakenings.includes(equivalentAwoken.big);
		}));
	}

	cardsRange = cardsRange.filter(card => card.id > 0); //去除Cards[0]
	return cardsRange;
}
function searchByString(str)
{ // 考虑了一下onlyInTag被废弃了，因为和游戏内搜索不符
	str = str.trim();
	if (str.length>0)
	{
		return Cards.filter(card =>
			{
				const names = [card.name];
				if (card.otLangName)
				{
					names.push(...Object.values(card.otLangName));
				}
				const tags = card.altName.concat();
				if (card.otTags)
				{
					tags.push(...card.otTags);
				}
				return tags.some(astr=>astr.toLowerCase().includes(str.toLowerCase())) ||
				names.some(astr=>astr.toLowerCase().includes(str.toLowerCase()));
			}
		);
	}else
	{
		return [];
	}
}
function copyString(input) {
	input.focus(); //设input为焦点
	input.select(); //选择全部
	
	navigator.clipboard.writeText(input.value).then(function() {
		/* clipboard successfully set */
		//复制成功
	}, function() {
		/* clipboard write failed */
		document.execCommand('copy'); //尝试废弃的老方法
	});
	//input.blur(); //取消焦点
}
function cardAOnDragStart(event){
	if (event.dataTransfer) {
		event.dataTransfer.setData("card-id", this.dataset.cardid);
	}
}
//产生一个怪物头像
function createCardA(option) {
	const t = document.body.querySelector('#template-card-a');
	const clone = document.importNode(t.content, true);
	const monster = clone.querySelector(".monster");
	if (option?.noTreeCount) monster.querySelector(".count-in-box .evo-tree").remove();
	if (option?.noBoxCount) monster.querySelector(".count-in-box").remove();
	monster.ondragstart = cardAOnDragStart; //拖拽怪物头像时，记录怪物id到拖拽
	return monster;
}
//返回文字说明内怪物Card的纯HTML
function cardN(id) {
	const monOuterDom = document.createElement("span");
	monOuterDom.className = "detail-mon";
	const monDom = createCardA({noBoxCount: true});
	monDom.onclick = cardNClick
	changeid({ id: id }, monDom);
	monOuterDom.monDom = monDom;
	monOuterDom.appendChild(monDom);

	return monOuterDom;
}
function cardNClick(event) {
	event?.preventDefault();
	const monstersID = document.getElementById("card-id");
	const formIdSearch = document.getElementById("form-id-search");
	monstersID.value = this.getAttribute("data-cardid");
	formIdSearch.onchange();
	editBox.show();
}

//产生队伍目标类型
function createTeamFlags(target, type)
{
	const ul = document.createElement("ul");
	ul.className = "team-flags";
	for (let i = 0; i<6; i++) {
		const li = ul.appendChild(document.createElement("li"));
		li.className = "team-member-icon";
	}
	const targetTypes = type == 2 ? SkillTarget.type2 : SkillTarget.type1;

	let _target = [];
	if (Number.isInteger(target)) {
		_target = Bin.unflags(target).map(n=>targetTypes[n]);
	}
	else if (Array.isArray(target)) {
		if (target.every(item=>Number.isInteger(item))) {
			_target = target.map(n=>targetTypes[n]);
		}
		else if (target.every(item=>typeof(item) === 'string')) {
			_target = target;
		}
	}
	_target.forEach(tar=>ul.classList.add(tar));
	return ul;
}

function searchBySeriesId(sId, sType) {
	switch (sType) {
		case "collab": {//合作
			if (!Number.isInteger(sId))
				sId = parseInt(sId, 10);
			return Cards.filter(card => card.collabId == sId);
		}
		case "gacha": {//桶，是数组
			if (!sId.every(id=>Number.isInteger(id)))
				sId = sId.map(id=>parseInt(id, 10));
			return sId.flatMap(gachaId=>
				Cards.filter(card => card.gachaIds.includes(gachaId)));
		}
		case "series":
		default: { //系列
			if (!Number.isInteger(sId))
				sId = parseInt(sId, 10);
			return Cards.filter(card => card.seriesId == sId);
		}
	}
}

function richTextCardNClick(){
	this.querySelector(".monster").onclick();
}
//创建序号类图标
function createIndexedIcon(type, index, noFocus = false) {
	const className = "drag-able-icon";
	let icon;
	if (type == 'card') {//卡片头像
		icon = cardN(index);
	} else {
		icon = document.createElement("icon");
		switch(type) {
			case 'awoken': { //觉醒
				icon.className = "awoken-icon";
				icon.setAttribute("data-awoken-icon", index);
				break;
			}
			case 'type': { //类型
				icon.className = "type-icon";
				icon.setAttribute("data-type-icon", index);
				break;
			}
			case 'orb': { //宝珠
				icon.className = "orb";
				icon.setAttribute("data-orb-icon", index);
				break;
			}
			case 'latent': { //潜觉
				icon.className = `latent-icon`;
				icon.setAttribute("data-latent-icon", index);
				icon.setAttribute("data-latent-hole", 1);
				break;
			}
		}
	}
	icon.classList.add(className);
	icon.contentEditable = false;
	icon.draggable = true;
	//icon.tabIndex = 0; // 为了让 :focus 生效
	icon.ondragstart = indexedIconOnDragStart;
	if (!noFocus) icon.addEventListener("click", indexedIconFocusSelf);
	icon.indexedIcon = {type, index}; //拖拽用的
	return icon;
}
function indexedIconOnDragStart(event){
	if (event.dataTransfer) {
		draggedNode = this; // 记录原始节点
		event.dataTransfer.effectAllowed = 'copyMove';
		event.dataTransfer.setData("indexed-icon", JSON.stringify(this.indexedIcon));
	}
}
function indexedIconFocusSelf(event){
	const selectRange = document.createRange();
	const selection = document.getSelection();
	if (!event?.ctrlKey) {
		//调整为只选中节点开始的部位
		selectRange.setEndBefore(this);
		selectRange.setStartBefore(this);
		// //调整为只选中节点结束的部位
		// selectRange.setEndAfter(this);
		// selectRange.setStartAfter(this);
		selection.removeAllRanges();
	}
	else {
		selectRange.selectNode(this); //按住Ctrl时选中整个节点
	}
	selection.addRange(selectRange);
}

//获取光标插入点位置（惰性函数）
const getCaretRange = (()=>{
	if (document.caretPositionFromPoint) {
		return function(event){
			const pos = document.caretPositionFromPoint(event.clientX, event.clientY);
			const range = document.createRange();
			range.setStart(pos.offsetNode, pos.offset);
			return range;
		}
	}
	else if (document.caretRangeFromPoint) {
		return function(event){
			const range = document.caretRangeFromPoint(event.clientX, event.clientY);
			return range;
		}
	} else {
		return ()=>{};
	}
})();

//将怪物的文字介绍解析为HTML
function descriptionToHTML(str)
{
	function formatParse(reg, subMatchCount, transFunc) {
		//const subMatchCount = transFunc.length;
		return function(item){
			if (typeof item == "string") {
				const subArr = item.split(new RegExp(reg));
				const newArr = [];
				for (let i = 0; i < subArr.length; i += (subMatchCount+1)) {
					newArr.push(subArr[i]);
					if (subArr[i+subMatchCount] !== undefined) {
						newArr.push(transFunc(...subArr.slice(i + 1, i + subMatchCount + 1)));
					}
				}
				return newArr;
			} else {
				return item;
			}
		};
	}
	let nodeArr = [str];
	nodeArr = nodeArr.flatMap(formatParse(/\^(\w+?)\^([^\^]+?)\^p/igm, 2, fontcolorTrans)); //文字颜色
	nodeArr = nodeArr.flatMap(formatParse(/\%\{([a-z]+)(\d+)\}/ig, 2, iconTrans)); //抛弃的老格式%{m1}
	nodeArr = nodeArr.flatMap(formatParse(/\{(\w+)\.(\w+)\}/ig, 2, iconTrans)); //新格式{m.1}

	function fontcolorTrans(color, content){
		const sp = document.createElement("span");
		sp.appendChild(descriptionToHTML(content))
		if (/^[a-fA-F0-9]+$/g.test(color)) {
			sp.style.color = `#${color}`;
		} else if (/qs/i.test(color)) {
			sp.style.color = `blue`;
		} else {
			sp.style.color = color;
		}
		return sp;
	}
	function iconTrans(type, id){
		id = parseInt(id,10);
		type = type.toLowerCase();
		switch(type) {
			case 'card':case 'm': { //卡片头像
				return createIndexedIcon('card', id);
			}
			case 'awoken':case 'a': { //觉醒
				return createIndexedIcon('awoken', id);
			}
			case 'type':case 't': { //类型
				return createIndexedIcon('type', id);
			}
			case 'orb':case 'o': { //宝珠
				return createIndexedIcon('orb', id);
			}
			case 'latent':case 'l': { //潜觉
				return createIndexedIcon('latent', id);
			}
			default: {
				return `{${type}.${id}}`;
			}
		}
	}
	return nodeArr.nodeJoin();
}
//默认的技能解释的显示行为
function parseSkillDescription(skill) {
	return descriptionToHTML(skill?.description);
}
//判断是否是转生和超转生
function isReincarnated(card) {
	return card.is8Latent && !card.isUltEvo && (card.evoBaseId || card.evoRootId) != card.id && (card.awakenings.includes(49) ? isReincarnated(Cards[card.evoBaseId]) : true);
}
//计算队伍中有多少血量
function countTeamHp(team, leader1id, leader2id, solo, noAwoken = false) {
	let memberArr = team[0], assistArr = team[1];
	const ls1 = Skills[(Cards[leader1id] || Cards[0])?.leaderSkillId];
	const ls2 = Skills[(Cards[leader2id] || Cards[0])?.leaderSkillId];
	const mHpArr = [];
	for (let idx = 0; idx < memberArr.length ; idx++) {
		let tMember = new MemberTeam(),
			tAssist = new MemberAssist();
		tMember.loadFromMember(memberArr[idx]);
		tAssist.loadFromMember(assistArr[idx]);
		if (noAwoken) { //封觉醒时本体有语音觉醒，不能直接去掉觉醒
			tAssist.awoken = 0;
		}
		const ability = noAwoken ? tMember.abilityNoAwoken : tMember.ability;
		const hp = ability?.[0] ?? 0;
		if (!hp) continue;
		
		const mulHP = hp * memberHpMul(tMember, tAssist, ls2, memberArr, solo) //战友队长技
						 * memberHpMul(tMember, tAssist, ls1, memberArr, solo);//我方队长技

		//演示用代码
		//console.log("%s 第1次倍率血量：%s，第2次倍率血量：%s",Cards[m.id].otLangName["chs"],hp1,hp2);

		mHpArr.push(mulHP);
	}

	//console.log('单个队伍血量：',mHpArr,mHpArr.reduce((p,c)=>p+c));

	function memberHpMul(member, assist, ls, memberArr, solo) {
		let memberAttrsTypes = member.getAttrsTypesWithWeapon(assist);

		function hpMul(parm, scale) {
			if (scale == undefined || scale == 0) return 1;
			if (parm.attrs && memberAttrsTypes?.attrs?.some(a => parm.attrs.includes(a))) {
				return scale / 100;
			}
			if (parm.types && memberAttrsTypes?.types?.some(t => parm.types.includes(t))) {
				return scale / 100;
			}
			return 1;
		}
		const sk = ls?.params;
		let scale = 1;
		switch (ls?.type) {
			case 23:
			case 30:
			case 62:
			case 77:
			case 63:
			case 65:
				scale = hpMul({ types: sk.slice(0, sk.length - 1) }, sk[sk.length - 1]);
				break;
			case 29:
			case 114:
			case 45:
			case 111:
			case 46:
			case 48:
			case 67:
				scale = hpMul({ attrs: sk.slice(0, sk.length - 1) }, sk[sk.length - 1]);
				break;
			case 73:
			case 76:
				scale = hpMul({ attrs: sk[0], types: sk[1] }, sk[2]);
				break;
			case 106:
			case 107:
			case 108:
				scale = sk[0] / 100;
				break;
			case 121:
			case 129:
			case 163:
			case 177:
			case 186:
				scale = hpMul({ attrs: Bin.unflags(sk[0]), types: Bin.unflags(sk[1]) }, sk[2]);
				break;
			case 125: //队伍中必须有指定队员
				const needMonIdArr = sk.slice(0, 5).filter(s => s > 0);
				const memberIdArr = memberArr.map(m => m.id); //包括队长，所以不需要筛选出队员
				scale = needMonIdArr.every(mid => memberIdArr.includes(mid)) ? sk[5] / 100 : 1;
				break;
			case 136:
				scale = hpMul({ attrs: Bin.unflags(sk[0]) }, sk[1]);
				if (sk[4]) scale *= hpMul({ attrs: Bin.unflags(sk[4]) }, sk[5]);
				break;
			case 137:
				scale = hpMul({ types: Bin.unflags(sk[0]) }, sk[1]);
				if (sk[4]) scale *= hpMul({ types: Bin.unflags(sk[4]) }, sk[5]);
				break;
			case 155:
				scale = solo ? 1 : hpMul({ attrs: Bin.unflags(sk[0]), types: Bin.unflags(sk[1]) }, sk[2]);
				break;
			case 158:
				scale = hpMul({ attrs: Bin.unflags(sk[1]), types: Bin.unflags(sk[2]) }, sk[4]);
				break;
			case 175: //队伍组成全为合作，不包括双方队长
				const needCollabIdIdArr = sk.slice(0, 3).filter(s => s > 0);
				const memberCollabIdArr = memberArr.slice(1, 5).filter(m => m.id > 0).map(m => Cards[m.id].collabId);
				scale = memberCollabIdArr.every(cid => needCollabIdIdArr.includes(cid)) ? sk[3] / 100 : 1;
				break;
			case 178:
			case 185:
				scale = hpMul({ attrs: Bin.unflags(sk[1]), types: Bin.unflags(sk[2]) }, sk[3]);
				break;
			case 203:{ //队员为指定类型，不包括双方队长，且队员数大于0
				let trueMemberCardsArr = memberArr.slice(1, 5).filter(m => m.id > 0).map(m => m.card);
				switch (sk[0]) {
					case 0: //全是像素进化
						scale = (trueMemberCardsArr.length > 0 && trueMemberCardsArr.every(memberCard => memberCard.evoMaterials.includes(3826))) ? sk[1] / 100 : 1;
						break;
					case 2: //全是转生、超转生（8格潜觉）
						scale = (trueMemberCardsArr.length > 0 && trueMemberCardsArr.every(memberCard => isReincarnated(memberCard))) ? sk[1] / 100 : 1;
						break;
				}
				break;
			}
			case 217:{ //限定队伍星级，不包括好友队长
				let cardsArr = memberArr.slice(0, 5).filter(m => m.id > 0).map(m => m.card); //所有的卡片
				const rarityCount = cardsArr.reduce((pre, memberCard)=>{
					return pre + (memberCard?.rarity || 1);
				}, 0);
				scale = rarityCount <= sk[0] ? sk[1] / 100 : 1;
				break;
			}
			case 229:{ //队员中存在每个属性或Type都算一次
				const {attrs, types} = countTeamTotalAttrsTypes(memberArr, assistArr);

				let correAttrs = Bin.unflags(sk[0]), correTypes = Bin.unflags(sk[1]); //符合的属性/类型
				 //符合的次数
				let correTimes = correAttrs.reduce((pre,attr)=>pre + (attrs[attr] || 0),0) +
								 correTypes.reduce((pre,type)=>pre + (types[type] || 0),0);
				scale = sk[2] * correTimes / 100 + 1;
				console.debug('属性、类型个数动态倍率，当前队长HP倍率为 %s (匹配 %d 次)', scale, correTimes);
				break;
			}
			case 245: { //全员满足某种情况，不包括好友队长，现在是全部星级不一样
				const cardsRarity = memberArr.slice(0, 5).filter(m => m.id > 0).map(m => m.card?.rarity); //所有的卡片星级
				const distinctRarity = cardsRarity.concat().distinct(); //数组拷贝去重
				if (sk[0] == -1 && distinctRarity.length === cardsRarity.length || //全部不同
					sk[0] == -2 && distinctRarity.length === 1 || //全部相同
					sk[0] > 0 && distinctRarity.length === 1 && distinctRarity[0] === sk[0] //指定稀有度
				) {
					scale = sk[3] / 100;
				}
				break;
			}
			case 138: //调用其他队长技
				scale = sk.reduce((pmul, skid) => pmul * memberHpMul(member, assist, Skills[skid], memberArr, solo), 1)
				break;
			default:
		}
		return scale || 1;
	}
	return mHpArr;
}

//由于有了更改属性和类型的武器，所以需要更改计算方法
function countTeamTotalAttrsTypes(memberArr, assistArr) {
	//之前用的Map，现在为了性能改成数组
	const attrsCount = [];
	const typesCount = [];
	for (let idx = 0; idx < memberArr.length; idx++) {
		const member = memberArr[idx], assist = assistArr[idx];

		const memberAttrsTypes = member.getAttrsTypesWithWeapon(assist);
		if (memberAttrsTypes) {
			memberAttrsTypes.attrs.forEach(attr=>attrsCount[attr]++||(attrsCount[attr]=1));
			memberAttrsTypes.types.forEach(type=>typesCount[type]++||(typesCount[type]=1));
		}
	}
	return {attrs: attrsCount, types: typesCount};
}
//返回卡片的队长技能
function getCardLeaderSkills(card, skillTypes) {
	if (!card) return [];
	return getActuallySkills(Skills[card.leaderSkillId], skillTypes, false);
}
//返回卡片的主动技能
function getCardActiveSkills(card, skillTypes, searchRandom = false) {
	if (!card) return [];
	return getActuallySkills(Skills[card.activeSkillId], skillTypes, searchRandom);
}
//查找到真正起作用的那一个技能
function getActuallySkills(skill, skillTypes, searchRandom = true) {
	if (!skill) return [];
	if (skillTypes.includes(skill.type))
	{
		return [skill];
	}
	else if (skill.type == 116 || //多个主动技
		(searchRandom && skill.type == 118) || //随机主动技
		skill.type == 138 || //多个队长技
		skill.type == 232 || //进化技能不循环
		skill.type == 233 || //进化技能循环
		skill.type == 248 //延迟生效技能
	){
		let params = skill.type == 248 ? skill.params.slice(1) : skill.params.concat();
		params.reverse(); //将技能反转，让进化类技能优先搜索最终技能
		//因为可能有多层调用，特别是随机118再调用组合116的，所以需要递归
		const subSkills = params.flatMap(id => getActuallySkills(Skills[id], skillTypes, searchRandom)).filter(s=>s);
		return subSkills;
	}
	else
	{
		return [];
	}
}
function getSkillMinCD(skill){
	return skill.initialCooldown - (skill.maxLevel - 1);
}
//返回变身宠的初级
function henshinBase(cardid, firstId)
{
	let member;
	if (cardid instanceof Member) {
		member = cardid;
		cardid = member.id;
	}
	if (firstId == undefined) firstId = cardid;
	let card = Cards[cardid];
	if (card && Array.isArray(card.henshinFrom) && card.henshinFrom[0] !== firstId
		&& (member?.level ?? 1) <= card.maxLevel
	)
	{
		card = henshinBase(card.henshinFrom[0], firstId);
	}
	return card;
}
//计算卡片队长技+C
function getSkillAddCombo(card) {
	const searchTypeArray = [192, 194, 206, 209, 210, 219, 220, 235, 271];
	const skills = getCardLeaderSkills(card, searchTypeArray);
	return skills.map(skill=>{
		switch (skill.type) {
			case 192:
			case 194:
			case 271:
				return skill.params[3] ?? 0;
			case 206:
				return skill.params[6] ?? 0;
			case 209:
				return skill.params[0] ?? 0;
			case 210:
			case 219:
				return skill.params[2] ?? 0;
			case 220:
				return skill.params[1] ?? 0;
			case 235:
				return skill.params[5] ?? 0;
			default:
				return 0;
		}
	}).reduce((p,v)=>p+v, 0);
}
//计算卡片队长技追打
function getSkillFixedDamage(card) {
	const searchTypeArray = [199, 200, 201, 223, 235, 271];
	const skills = getCardLeaderSkills(card, searchTypeArray);
	return skills.map(skill=>{
		switch (skill.type) {
			case 199:
			case 200:
				return skill.params[2] ?? 0;
			case 201:
				return skill.params[5] ?? 0;
			case 223:
				return skill.params[1] ?? 0;
			case 235:
				return skill.params[6] ?? 0;
			case 271:
				return skill.params[4] ?? 0;
			default:
				return 0;
		}
	}).reduce((p,v)=>p+v, 0);
}
function tIf_Effect(leader1id, leader2id, leader1id_original,leader2id_original) {
	let effect = {
		board76: false,
		noSkyfall: false,
		poisonNoEffect: false,
		resolve: false,
		addCombo: [0,0],
		inflicts: [0,0],
	};
	const card1 = Cards[leader1id], card2 = Cards[leader2id];
	const card1_original = henshinBase(leader1id_original), card2_original = henshinBase(leader2id_original);
	{ //计算队伍是否为76，判断初始队长+变身前
		const searchTypeArray = [162, 186];
		effect.board76 = Boolean(getCardLeaderSkills(card1_original, searchTypeArray).length) ||
						 Boolean(getCardLeaderSkills(card2_original, searchTypeArray).length);
	}
	{ //计算队伍是否为无天降
		const searchTypeArray = [163, 177];
		effect.noSkyfall = Boolean(getCardLeaderSkills(card1, searchTypeArray).length) ||
						   Boolean(getCardLeaderSkills(card2, searchTypeArray).length);
	}
	{ //计算队伍是否为毒无效
		const searchTypeArray = [197];
		effect.poisonNoEffect = Boolean(getCardLeaderSkills(card1, searchTypeArray).length) ||
								Boolean(getCardLeaderSkills(card2, searchTypeArray).length);
	}
	{ //计算队伍是否有根性
		const searchTypeArray = [14];
		effect.resolve = Boolean(getCardLeaderSkills(card1, searchTypeArray).length) ||
						 Boolean(getCardLeaderSkills(card2, searchTypeArray).length);
	}
	{ //计算队伍的+C
		effect.addCombo[0] = getSkillAddCombo(card1);
		effect.addCombo[1] = getSkillAddCombo(card2);
	}
	{ //计算队伍的追打
		effect.inflicts[0] = getSkillFixedDamage(card1);
		effect.inflicts[1] = getSkillFixedDamage(card2);
	}
	return effect;
}

//计算队伍SB
function countTeamSB(team, solo) {
	let sbn = 0;
	const [members, assists, badge] = team;
	
	for (let mi = 0; mi < members.length; mi++) {
		const member = members[mi];
		const assist = assists[mi];
		if (member.id < 0) continue;
		const memberCard = henshinBase(member);
		let enableAwoken = memberCard?.awakenings?.slice(0, member.awoken) || [];
		//单人、3人时,大于等于100级且297时增加超觉醒
		if ((solo || teamsCount === 3) && member.sawoken > 0 &&
			(member.level >= 100 && member.plus.every(p=>p>=99) ||
			member.sawoken === memberCard.syncAwakening)
		) {
			enableAwoken.push(member.sawoken);
		}
		if (assist.card && assist.card.enabled && assist.card.awakenings.includes(49)) {
			enableAwoken.push(...assist.card.awakenings.slice(0, assist.awoken));
		}

		//大SB 56，小SB 21
		sbn += enableAwoken.filter(n=>n===21).length;
		sbn += enableAwoken.filter(n=>n===56).length * 2;
		//负sb 105
		sbn -= enableAwoken.filter(n=>n===105).length;
		//心L 59，心L大SB潜觉 47
		sbn += enableAwoken.filter(n=>n===59).length ? member.latent.filter(n=>n===47).length * 3 : 0;
	}
	if (solo || teamsCount === 3) {
		switch (badge) {
			case 7: //SB
				sbn += 2;
				break;
			case 23: //SB++ 辅助无效 +20
				sbn += 20;
				break;
		}
	}

	return sbn;
}
//判断两个角色是否是同一进化链
function isSameEvoTree(mon1, mon2) {
	if (mon1.id <= 0 || mon2.id <= 0) return false;
	//返回一个角色的根ID
	function returnRootId(mid, henshin = true)
	{
		let rootid = Cards[mid].evoRootId;
		const m = Cards[rootid];
		if (henshin && Array.isArray(m.henshinFrom) && m.henshinFrom[0] < m.id)
		{ //只有变身来源小于目前id的，才继续找base,为了解决黑魔导女孩的问题，将来如果需要要可以改成检测是否能110级
			rootid = returnRootId(m.henshinFrom[0]);
		}
		return rootid;
	}
	const mon1RootId = returnRootId(mon1.id, mon1.level <= mon1.card.maxLevel);
	const mon2RootId = returnRootId(mon2.id, mon2.level <= mon2.card.maxLevel);

	return mon1RootId == mon2RootId;
}
//计算队伍操作时间
function countMoveTime(team, leader1id, leader2id, teamIdx) {
	const [members, assists, badge] = team;
	const searchTypeArray = [178, 15, 185];
	const ls1 = getCardLeaderSkills(Cards[leader1id], searchTypeArray)?.[0];
	const ls2 = getCardLeaderSkills(Cards[leader2id], searchTypeArray)?.[0];
	const time1 = leaderSkillMoveTime(ls1);
	const time2 = leaderSkillMoveTime(ls2);

	function leaderSkillMoveTime(ls) {
		const moveTime = { fixed: false, duration: 0 };
		if (!ls) return moveTime;
		const sk = ls.params;
		switch (ls.type) {
			case 178: //固定操作时间
				moveTime.fixed = true;
				moveTime.duration = sk[0];
				break;
			case 15:
			case 185:
				moveTime.duration += sk[0] / 100;
				break;
			default:
		}
		return moveTime;
	}
	
	let moveTime = {
		fixed: false,
		duration: {
			default: 6,
			leader: 0,
			badge: 0,
			awoken: 0,
		}
	}; //基础5秒
	//固定操作时间的直接返回
	if (time1.fixed || time2.fixed) {
		moveTime.fixed = true;
		moveTime.duration.leader = time1.fixed ?
			(time2.fixed ? Math.min(time1.duration, time2.duration) : time1.duration) :
			time2.duration;
	} else {
		moveTime.duration.leader = time1.duration + time2.duration;

		let _team = team.concat();
		//1人、3人计算徽章
		if (solo || teamsCount === 3) {
			switch (badge) {
				case 2: //小手指
					moveTime.duration.badge = 3;
					break;
				case 21: //大手指
					moveTime.duration.badge = 4;
					break;
				case PAD_PASS_BADGE: //月卡
					moveTime.duration.badge = 4;
					break;
				case 22: case 23: //状态异常耐性&SB++ 辅助无效
					moveTime.duration.badge = 3;
					break;
			}
		} else if (teamsCount === 2) //2人协力时的特殊处理
		{
			const teams = formation.teams;
			const team2 = teamIdx === 1 ? teams[0] : teams[1]; //获取队伍2
			const [members2, assists2, badge2, swapId2] = team2;
			//复制队伍1，这里参数里的 team 换成了一个新的数组
			_team = [
				members.concat(),
				assists.concat()
			];
			//把队伍2的队长和武器添加到复制的队伍1里面
			_team[0].push(members2[swapId2]);
			_team[1].push(assists2[swapId2]);
		}

		//觉醒
		const awokenMoveTime = [
			{ index: 19, value: 0.5 }, //小手指
			{ index: 53, value: 1 }, //大手指
		];
		moveTime.duration.awoken += awokenMoveTime.reduce((duration, aw) =>
			duration + awokenCountInTeam(_team, aw.index, solo, teamsCount) * aw.value, 0);
		//潜觉
		const latentMoveTime = [
			{ index: 4, value: 0.05 }, //小手指潜觉
			{ index: 31, value: 0.12 }, //大手指潜觉
		];

		moveTime.duration.awoken += latentMoveTime.reduce((duration, la) =>
			duration + _team[0].reduce((count, member) =>
				count + (member?.latent?.filter(l => l == la.index)?.length ?? 0), 0) * la.value, 0);

	}

	return moveTime;
}
//将盾减伤比例组叠加为一个减伤范围组
function getReduceRange(reduceScales)
{
	class reduceRange{
		constructor(obj)
		{
			this.min = 0;
			this.max = 100;
			this.scale = 0;
			this.probability = 1;
			if (typeof obj == "object") Object.assign(this, obj);
		}
	}
	const ranges = [new reduceRange()];
	const attrsRanges = new Array(5).fill(ranges); //5中属性的，默认填充第一个ranges的指针
	function processingRanges(ranges, scale)
	{
		//先找scale.min在某个范围内的
		const rgLessIdx = ranges.findIndex(range=>scale.hp.min > range.min && scale.hp.min < range.max),
		//再找scale.max在某个范围内的
			rgMoreIdx = ranges.findIndex(range=>scale.hp.max > range.min && scale.hp.max < range.max);
		//先只拆分不乘比例
		if (rgLessIdx >= 0)
		{
			const range = ranges[rgLessIdx];
			ranges.splice(rgLessIdx, 1,
				new reduceRange({min:range.min, max:scale.hp.min, scale: range.scale, probability: range.probability}),
				new reduceRange({min:scale.hp.min, max:range.max, scale: range.scale, probability: range.probability})
			);
		}
		if (rgMoreIdx >= 0)
		{
			const range = ranges[rgMoreIdx];
			ranges.splice(rgMoreIdx, 1,
				new reduceRange({min:range.min, max:scale.hp.max, scale: range.scale, probability: range.probability}),
				new reduceRange({min:scale.hp.max, max:range.max, scale: range.scale, probability: range.probability})
			);
		}
		const needChangeScaleRanges = ranges.filter(range=>range.min >= scale.hp.min && range.max <= scale.hp.max);
		needChangeScaleRanges.forEach(range=>{
			range.scale = 1 - (1 - range.scale) * (1 - scale.scale);
			range.probability *= scale.probability;
		});
	}
	//对scale进行排序，将所有全属性减伤的靠前，部分属性的靠后，这样前面的就只需要计算一次，后面的计算多次
	reduceScales.sort((a,b)=>b.attrs - a.attrs);

	reduceScales.forEach(scale=>{
		if (scale.attrs == 0) //没有属性的
		{
			return;
		}
		else if ((scale.attrs & 31) != 31) //不符合全属性的
		{
			const attrs = Bin.unflags(scale.attrs); //得到属性数组
			attrs.forEach(n=>{
				attrsRanges[n] = attrsRanges[n].map(range=>new reduceRange(range)); //复制一个新数组
				processingRanges(attrsRanges[n], scale); //计算这个数组的减伤比例
			});
		}
		else
		{ //只处理第一数组
			processingRanges(ranges, scale);
		}
	});
	return attrsRanges;
}
//获取盾潜觉的减伤比例组
function getAttrShieldAwokenReduceScales(team) {
	//5种盾潜觉
	return [
		{awoken:4,latent1:6,latent2:32},
		{awoken:5,latent1:7,latent2:33},
		{awoken:6,latent1:8,latent2:34},
		{awoken:7,latent1:9,latent2:35},
		{awoken:8,latent1:10,latent2:36},
	].map((shield, attrIdx)=>{
		const akNum = awokenCountInTeam(team, shield.awoken, solo, teamsCount); //获取盾觉醒个数，没有大觉醒
		const latent1Num = team[0].reduce((count, member) => count + (member?.latent?.filter(l => l == shield.latent1)?.length ?? 0), 0);
		const latent2Num = team[0].reduce((count, member) => count + (member?.latent?.filter(l => l == shield.latent2)?.length ?? 0), 0);
		
		const reduce = {
			scale: 0,
			hp: {
				max: 100,
				min: 0
			},
			probability: 1,
			attrs: 31, //5色是31
		};

		reduce.scale = Math.min(akNum * 0.07 + latent1Num * 0.01 + latent2Num * 0.025, 1);
		if (reduce.scale == 0) return false;
		reduce.attrs = 1 << attrIdx;
		return reduce;
	}).filter(Boolean);
}
//获取盾减伤比例组
function getReduceScales(leaderid) {
	const searchTypeArray = [16, 17, 36, 38, 43, 129, 163, 130, 131, 178, 151, 169, 198, 170, 182, 193, 171, 183, 235, 271];
	const lss = getCardLeaderSkills(Cards[leaderid], searchTypeArray);
	
	function leaderReduceScale(ls) {
		const reduce = {
			scale: 0,
			hp: {
				max: 100,
				min: 0
			},
			probability: 1,
			attrs: 31, //5色是31
		};
		if (!ls) return reduce;
		const sk = ls.params;
		switch (ls.type) {
			case 16: //无条件盾
				reduce.scale = sk[0] / 100;
				break;
			case 17: //单属性盾
				reduce.scale = sk[1] / 100;
				reduce.attrs = 0 | (sk[0] >= 0 ? 1 << sk[0] : 0);
				break;
			case 36: //2个属性盾
				reduce.scale = sk[2] / 100;
				reduce.attrs = 0 | (sk[0] >= 0 ? 1 << sk[0] : 0) | (sk[1] >= 0 ? 1 << sk[1] : 0);
				break;
			case 38: //血线下 + 可能几率
			case 43: //血线上 + 可能几率
				reduce.scale = (sk[2] || 0) / 100;
				reduce.probability = sk[1] / 100;
				if (sk[0] == 100)
				{
					reduce.hp.max = sk[0];
					reduce.hp.min = 99;
				}else
				{
					if(ls.type == 38)
					{
						reduce.hp.max = sk[0];
						reduce.hp.min = 0;
					}else
					{
						reduce.hp.max = 100;
						reduce.hp.min = sk[0];
					}
				}
				break;
			case 129: //无条件盾，属性个数不固定
			case 163: //无条件盾，属性个数不固定
			case 130: //血线下 + 属性个数不固定
			case 131: //血线上 + 属性个数不固定
				reduce.scale = (sk[6] || 0) / 100;
				reduce.attrs = 0 | sk[5];
				if (ls.type == 130 || ls.type == 131)
				{
					if (sk[0] == 100)
					{
						reduce.hp.max = sk[0];
						reduce.hp.min = 99;
					}else
					{
						if(ls.type == 130)
						{
							reduce.hp.max = sk[0];
							reduce.hp.min = 0;
						}else
						{
							reduce.hp.max = 100;
							reduce.hp.min = sk[0];
						}
					}
				}
				break;
			case 178: //无条件盾，属性个数不固定
				reduce.scale = (sk[7] || 0) / 100;
				reduce.attrs = 0 | sk[6];
				break;
			case 151: //十字心触发
			case 169: //C触发
			case 198: //回血触发
			case 271: //激活觉醒触发
				reduce.scale = (sk[2] || 0) / 100;
				break;
			case 170: //多色触发
			case 182: //长串触发
			case 193: //L触发
				reduce.scale = (sk[3] || 0) / 100;
				break;
			case 171: //多串触发
				reduce.scale = (sk[6] || 0) / 100;
				break;
			case 183: //又是个有两段血线的队长技
				reduce.scale = (sk[4] || 0) / 100;
				if (sk[2] == 100)
				{
					reduce.hp.max = sk[2];
					reduce.hp.min = 99;
				}else
				{
					reduce.hp.max = 100;
					reduce.hp.min = sk[2];
				}
				break;
			case 210: //十字触发
				reduce.scale = (sk[1] || 0) / 100;
				break;
			case 235: { //可多次触发
				reduce.scale = (sk[4] || 0) / 100;
				break;
			}
			default:
		}
		return reduce;
	}
	return lss.map(leaderReduceScale).filter(re=>re.scale > 0);
}
function cardFixId(id, reverse = false) {
	if (id === 0xFFFF) return id;
	return reverse ? (id >= 9900 ? id + 100 : id) : (id >= 10000 ? id - 100 : id);
}