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
				if ((_xhr.status === 200 || (location.host === "" && _xhr.status === 0)) && GM_param.onload) //正确加载时
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
function getQueryString(name, url) {
	const urlObj = new URL(url || document.location);
	if (!Array.isArray(name)) name = [name];
	let n_e = name.entries(), n;
	let value;
	do
	{
		n = n_e.next();
		if (!n.done)
		{
			value = urlObj.searchParams.get(n.value[1]);
		}
	}while(!n.done && value == undefined)
	return value;
}

function localStorage_getBoolean(name, defaultValue = false){
	let value = localStorage.getItem(name);
	if (value === "true") return true;
	else return Boolean(Number(localStorage.getItem(name) ?? defaultValue));
}

// 将字符串转为二进制字符串
String.prototype.toUTF16BinaryString = function() {
	const charCodes16Arr = [...this].map(char=>char.charCodeAt(0)); //将每个字符转为数字
	const codeUnits = new Uint16Array(charCodes16Arr); //将每个字符存入 2 字节中。警告：仅限 0xFFFF 前的Unicode字符，之后的就得换 Uint32Array
	const charCodes = new Uint8Array(codeUnits.buffer); //每两个存入中
	const result = [...charCodes].map(code=>String.fromCharCode(code)).join('');
	return result;
}

String.fromBinaryString = function(binary) {
	const bytes = new Uint8Array([...binary].map(char=>char.charCodeAt(0)));
	const charCodes = new Uint16Array(bytes.buffer);
	const result = [...charCodes].map(code=>String.fromCharCode(code)).join('');
	return result;
}
String.fromBase64 = function(base64) {
	return String.fromBinaryString(atob(base64));
}
//Buffer转16进制字符串
Uint8Array.prototype.toHex = function() {
	return [...this].map(n=>n.toString(16).padStart(2,'0')).join('');
}

//大数字缩短长度，默认返回本地定义字符串
Number.prototype.bigNumberToString = function() {
	return this.toLocaleString();
}
//最多保留N位小数，不留0
Number.prototype.keepCounts = function(decimalDigits = 2, plusSign = false)
{
	let newNumber = Number(this.toFixed(decimalDigits));
	return (plusSign && this > 0 ? '+' : '') + newNumber.bigNumberToString();
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
//数组去重
Array.prototype.distinct = function() {
	let _set = new Set(this);
	return Array.from(_set)
}
Array.prototype.randomShift = function() {
	return this.splice(Math.random() * this.length, 1)?.[0];
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

Math.randomInteger = function(max, min = 0) {
	return this.floor(this.random() * (max - min + 1) + min);
}


//将二进制flag转为数组
function flags(num) {
	const arr = [];
	for (let i = 0; i < 32; i++) {
		if (num & (1 << i)) {
			arr.push(i);
		}
	}
	return arr;
}
//将二进制flag转为数组
function reflags(arr) {
	return arr.reduce((pre,cur)=>pre | 1 << cur, 0);
}

//带标签的模板字符串
function tp(strings, ...keys) {
	return (function(...values) {
		let dict = values[values.length - 1] || {};
		let fragment = document.createDocumentFragment();
		fragment.appendChild(document.createTextNode(strings[0]));
		//let result = [strings[0]];
		keys.forEach(function(key, i, arr) {
			let value = Number.isInteger(key) ? values[key] : dict[key];
			if (value == undefined)
			{
				//console.debug("模板字符串中 %s 未找到输入数据",key);
			}else
			{
				if (!(value instanceof Node))
				{
					value = document.createTextNode(value);
				}
				try{
					fragment.appendChild(arr.lastIndexOf(key) == i ? value : value.cloneNode(true));
				}catch(e)
				{
					console.log(value, e);
					console.log(keys, values);
				}
			}
			fragment.appendChild(document.createTextNode(strings[i + 1]));
		});
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

function decodeAudio(fileName, decodeCallback) {
	if (pcmPlayer != null) {
		pcmPlayer.close();
	}
	pcmPlayer = new PCMPlayer(1, 44100);
	fetch(fileName).then((response) => response.arrayBuffer())
		.then((bytes) => {
			let audioData = new Uint8Array(bytes);
			let step = 160;
			for (let i = 0; i < audioData.byteLength; i += step) {
				let pcm16BitData = decodeCallback(audioData.slice(i, i + step));
				let pcmFloat32Data = Std.shortToFloatData(pcm16BitData);
				pcmPlayer.feed(pcmFloat32Data);
			}
		});
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
//▲ADPCM播放相关

// 加载 image
function loadImage(url) {
	return new Promise(function(resolve, reject) {
		var image = new Image();

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
		let datas = [];
		const transaction = db.transaction([tableName]);
		const objectStore = transaction.objectStore(tableName);
		const request = objectStore.openCursor();
		request.onsuccess = function(event) {
			var cursor = event.target.result;
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

function latentUseHole(latentId) {
	switch (true) {
		case (latentId === 12):
		case (latentId >= 16 && latentId <= 36):
		case (latentId >= 43 && latentId <= 45):
		{
			return 2;
		}
		case (latentId >= 13 && latentId <= 15):
		case (latentId >= 37 && latentId <= 42):
		case (latentId == 46):
		{
			return 6;
		}
		case (latentId < 12):
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
	const memberArray = team[0];
	const assistArray = team[1];

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
		if ((solo || teamsCount === 3) && mon.sawoken >= 0 && mon.level >= 100 && mon.plus.every(p=>p>=99)) {
			const sAwokenT = card.superAwakenings[mon.sawoken];
			if (sAwokenT >= 0)
				enableAwoken = enableAwoken.concat(sAwokenT);
		}
		if (assistCard && assistCard.enabled && assistCard.awakenings.includes(49)) { //如果卡片未启用
			enableAwoken = enableAwoken.concat(assistCard.awakenings.slice(0, assist.awoken));
		}

		//相同的觉醒数
		const hasAwoken = enableAwoken.filter(ak => { return ak == awokenIndex; }).length;
		return previous + hasAwoken;
	}, 0);
	return teamAwokenCount;
}
//返回可用的怪物名称
function returnMonsterNameArr(card, lsList, defaultCode) {
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
		max: c.max !== undefined ? c.max : (c.min * maxLevel),
		scale: c.scale || 1
	});

	if (level > maxLevel) {
		const exceed99 = Math.min(level - maxLevel, 11);
		const exceed110 = Math.max(0, level - 110);
		value += c.max !== undefined ?
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
	const previousAwokenScale = [ //在297之前，对应比例加三维觉醒的序号与倍率值，就是语音觉醒
		[{ index: 63, scale: 1.1 }], //HP
		[{ index: 63, scale: 1.1 }], //ATK
		[{ index: 63, scale: 1.1 }] //RCV
	];
	const latterAwokenScale = [ //对应比例加三维觉醒的序号与倍率值
		[], //HP
		[], //ATK
		[] //RCV
	];

	if (!solo) { //协力时计算协力觉醒
		latterAwokenScale.forEach(ab => {
			ab.push({ index: 30, scale: 1.5 });
		});
	}
	const latentScale = [ //对应加三维潜在觉醒的序号与增加比例
		[{ index: 1, scale: 0.015 }, { index: 12, scale: 0.03 }, { index: 28, scale: 0.045 }, { index: 43, scale: 0.10 }], //HP
		[{ index: 2, scale: 0.01 }, { index: 12, scale: 0.02 }, { index: 29, scale: 0.03 }, { index: 44, scale: 0.05 }], //ATK
		[{ index: 3, scale: 0.1 }, { index: 12, scale: 0.2 }, { index: 30, scale: 0.3 }, { index: 45, scale: 0.35 }] //RCV
	];
	const memberCurves = [memberCard.hp, memberCard.atk, memberCard.rcv];
	const assistCurves = assistCard ? [assistCard.hp, assistCard.atk, assistCard.rcv] : null;

	const dge = formation.dungeonEnchance;
	const dgeRate = [dge.rate.hp, dge.rate.atk, dge.rate.rcv];
	const isDge = dge.rarities.includes(memberCard.rarity) || memberCard.attrs.some(attr=>dge.attrs.includes(attr)) || memberCard.types.some(type=>dge.types.includes(type));
	
	//储存点亮的觉醒
	let awokenList = memberCard.awakenings.slice(0, member.awoken);
	//单人、3人时,大于等于100级且297时增加超觉醒
	if ((solo || teamsCount === 3) && member.sawoken >= 0 && member.level >= 100 && member.plus.every(p=>p>=99)) {
		const sAwokenT = memberCard.superAwakenings[member.sawoken];
		if (sAwokenT >= 0) awokenList.push(sAwokenT)
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


	const abilitys = memberCurves.map((ab, idx) => {
		const n_base = Math.round(curve(ab, member.level, memberCard.maxLevel, memberCard.limitBreakIncr, limitBreakIncr120[idx])); //等级基础三维
		const n_plus = member.plus[idx] * plusAdd[idx]; //加值增加量
		let n_assist_base = 0,
			n_assist_plus = 0; //辅助的bonus
		//计算辅助的额外血量
		if (assistCard?.id > 0 && assistCard.enabled && enableBouns) {
			n_assist_base = Math.round(curve(assistCurves[idx], assist.level, assistCard.maxLevel, assistCard.limitBreakIncr, limitBreakIncr120[idx])); //辅助等级基础三维
			n_assist_plus = assist.plus[idx] * plusAdd[idx]; //辅助加值增加量
		}

		//用来计算倍率觉醒的最终倍率是多少，reduce用
		function calculateAwokenScale(previous, aw) {
			const awokenCount = awokenList.filter(ak => ak == aw.index).length; //每个倍率觉醒的数量
			return previous * aw.scale ** awokenCount;
		}

		//倍率类觉醒的比例，直接从1开始乘
		const n_awokenScale = previousAwokenScale[idx].reduce(calculateAwokenScale, 1);

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

		let reValue = n_base * n_awokenScale + n_base * n_latentScale + n_plus + n_awoken + (n_assist_base + n_assist_plus) * bonusScale[idx];
		//因为语音觉醒觉醒无效也生效，所以这里需要计算
		let reValueNoAwoken = n_base * n_awokenScale + n_plus + (n_assist_base + n_assist_plus) * bonusScale[idx];

		//觉醒生效时的协力、语音觉醒等的倍率
		reValue = reValue * latterAwokenScale[idx].reduce(calculateAwokenScale, 1);

		//都要做四舍五入
		if (isDge && dgeRate[idx] != 1)
		{
			let rate = dgeRate[idx];
			reValue = Math.round(reValue * rate);
			reValueNoAwoken = Math.round(reValueNoAwoken * rate);
		}else
		{
			reValue = Math.round(reValue);
			reValueNoAwoken = Math.round(reValueNoAwoken);
		}
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
		plus: (card.overlay || card.types[0] == 15 && card.types[1] == -1) ? [0, 0, 0] : [99, 99, 99], //当可以叠加时，不能打297
		awoken: card.awakenings.length,
	};
	const abilities = calculateAbility(tempMon, null, solo, teamsCount);
	if (abilities) {
		return {
			noAwoken: {
				hp: abilities[0][1],
				atk: abilities[1][1],
				rcv: abilities[2][1],
			},
			withAwoken: {
				hp: abilities[0][0],
				atk: abilities[1][0],
				rcv: abilities[2][0],
			},
		};
	} else {
		return null;
	}
}
//搜索卡片用
function searchCards(cards, attr1, attr2, fixMainColor, types, typeAndOr, rares, awokens, sawokens, equalAk, incSawoken, canAssist, noHenshin) {
	let cardsRange = cards.concat(); //这里需要复制一份原来的数组，不然若无筛选，后面的排序会改变初始Cards
	if (canAssist) cardsRange = cardsRange.filter(card=>card.canAssist);
	if (noHenshin) cardsRange = cardsRange.filter(card=>!Array.isArray(card.henshinFrom) || card.limitBreakIncr);
	//属性
	if (attr1 != null && attr1 === attr2 || //主副属性一致并不为空
		(attr1 === 6 && attr2 === -1)) //主副属性都为“无”
	{ //当两个颜色相同时，主副一样颜色的只需判断一次
		cardsRange = cardsRange.filter(c => c.attrs[0] === attr1 && c.attrs[1] === attr2);
	}
	else if (fixMainColor) //如果固定了顺序
	{
		const a1IsNull = attr1 === null,
			a2IsNull = attr2 === null;
		if (!a1IsNull || !a2IsNull) { //当a1、a2任一不为null（任意）时才需要筛选
			cardsRange = cardsRange.filter(c =>
				(a2IsNull ? c.attrs[0] === 6 && c.attrs[1] === attr1 : false) || //当2为随机，只有属性1时，也专门搜只有副属性=属性1的怪物
				(a1IsNull ? true : c.attrs[0] === attr1) &&
				(a2IsNull ? true : c.attrs[1] === attr2)
			);
		}
	}
	else //不限定顺序时
	{
		const search_attrs = [attr1, attr2].filter(a => a != null && a >= 0 && a <= 5); //所有非空属性
		const aNone = attr1 === 6 || attr2 === -1; //是否有“无”属性
		cardsRange = cardsRange.filter(c =>
			search_attrs.every(a => c.attrs.includes(a)) &&
			(aNone ? (c.attrs.includes(6) || c.attrs.includes(-1)) : true)
		);
	}
	//类型
	if (types.length > 0) {
		cardsRange = cardsRange.filter(c => typeAndOr ?
			types.every(t => c.types.includes(t)) : //所有type都满足
			types.some(t => c.types.includes(t)) //只需要满足一个type
		);
	}
	//稀有度
	if (rares.length > 1) {
		cardsRange = cardsRange.filter(c => c.rarity >= rares[0] && c.rarity <= rares[1]);
	}
	//觉醒
	//等效觉醒时，事先去除大觉醒
	if (equalAk) {
		const bigEqualAwokens = awokens.filter(ak => equivalent_awoken.findIndex(eak => eak.big === ak.id) >= 0); //所有存在的大觉醒
		bigEqualAwokens.forEach(bak => {
			const equivalentAwoken = equivalent_awoken.find(eak => eak.big === bak.id);
			let smallEqualAwoken = awokens.find(ak => equivalentAwoken.small === ak.id);
			if (!smallEqualAwoken) {
				smallEqualAwoken = { id: equivalentAwoken.small, num: 0 }; //如果没有就新建一个
				awokens.push(smallEqualAwoken);
			}
			smallEqualAwoken.num += bak.num * equivalentAwoken.times; //小觉醒添加大觉醒的数字
		});
		awokens = awokens.filter(ak => equivalent_awoken.findIndex(eak => eak.big === ak.id) < 0); //去除大觉醒
	}

	if (awokens.length > 0) {
		cardsRange = cardsRange.filter(card => {
			let cardAwakeningsArray = [];
			if (incSawoken && card.superAwakenings.length > 0) { //如果搜索超觉醒，产生原始觉醒分别加上每个超觉醒的多个数组
				cardAwakeningsArray = card.superAwakenings.map(sak => card.awakenings.concat(sak));
			} else { //单个原始觉醒数组
				cardAwakeningsArray.push(card.awakenings);
			}

			return cardAwakeningsArray.some(cardAwakening => //重复每种包含超觉醒的觉醒数组，只要有一组符合要求就行
				awokens.every(ak => { //判断需要搜索的觉醒是不是全都在觉醒数组里
					if (equalAk) //如果开启等效觉醒
					{
						//搜索等效觉醒
						const equivalentAwoken = equivalent_awoken.find(eak => eak.small === ak.id);
						if (equivalentAwoken) {
							const totalNum = cardAwakening.filter(cak => cak == equivalentAwoken.small).length +
								cardAwakening.filter(cak => cak == equivalentAwoken.big).length * equivalentAwoken.times;
							return totalNum >= ak.num;
						}
					}
					return cardAwakening.filter(cak => cak == ak.id).length >= ak.num;
				})
			);
		});
	}

	//超觉醒
	if (sawokens.length > 0 && !incSawoken) {
		cardsRange = cardsRange.filter(card => sawokens.some(sak => {
			const equivalentAwoken = equivalent_awoken.find(eak => eak.small === sak);
			return card.superAwakenings.includes(sak) ||
				equalAk && equivalentAwoken && card.superAwakenings.includes(equivalentAwoken.big); //如果开启等效觉醒
		}));
	}

	cardsRange = cardsRange.filter(card => card.id); //去除Cards[0]
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
//产生一个怪物头像
function createCardA(option) {
	const t = document.body.querySelector('#template-card-a');
	const clone = document.importNode(t.content, true);
	const monster = clone.querySelector(".monster");
	if (option?.noTreeCount) monster.querySelector(".count-in-box .evo-tree").remove();
	if (option?.noBoxCount) monster.querySelector(".count-in-box").remove();
	return monster;
}
//返回文字说明内怪物Card的纯HTML
function cardN(id) {
	const monOuterDom = document.createElement("span");
	monOuterDom.className = "detail-mon";
	const monDom = createCardA({noBoxCount: true});
	monOuterDom.appendChild(monDom);
	monOuterDom.monDom = monDom;
	changeid({ id: id }, monDom);
	return monOuterDom;
}
//返回文字说明内怪物Card的纯HTML
function cardNClick() {
	const id = parseInt(this.getAttribute("data-cardid"), 10);
	editBox.show();
	editBox.mid = id;
	editBoxChangeMonId(id);
	//showSearch([id]);
	return false;
}
//技能介绍里的头像的切换
function changeToIdInSkillDetail(event) {
	const settingBox = editBox.querySelector(".setting-box");
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	const mid = this.getAttribute("data-cardid");
	monstersID.value = mid;
	monstersID.onchange();
	return false; //取消链接的默认操作
}
//搜索并显示合作
function searchCollab(event) {
	const collabId = parseInt(this.getAttribute('data-collabId'), 10);
	showSearch(Cards.filter(card => card.collabId == collabId));
	return false;
}

//将怪物的文字介绍解析为HTML
function descriptionToHTML(str)
{
	function formatParse(arr, reg, subMatchCount, returnFunc){
		//const subMatchCount = returnFunc.length;
		return arr.flatMap(item=>{
			if (typeof item == "string") {
				const subArr = item.split(new RegExp(reg));
				const newArr = [];
				for (let i = 0; i < subArr.length; i += (subMatchCount+1)) {
					newArr.push(subArr[i]);
					if (subArr[i+subMatchCount] !== undefined) {
						newArr.push(returnFunc(...subArr.slice(i + 1, i + subMatchCount + 1)));
					}
				}
				return newArr;
			} else {
				return item;
			}
		});
	}
	let nodeArr = [str];
	nodeArr = formatParse(nodeArr, /\^(\w+?)\^([^\^]+?)\^p/igm, 2,
		(color, content)=>{
			const sp = document.createElement("span");
			sp.textContent = content;
			if (/^[a-fA-F0-9]+$/g.test(color)) {
				sp.style.color = `#${color}`;
			} else if (/qs/i.test(color)) {
				sp.style.color = `blue`;
			}
			return sp;
		});
	nodeArr = formatParse(nodeArr, /\%\{m([0-9]{1,5})\}/g, 1,
		(id)=>{
			const avatar = cardN(parseInt(id,10));
			avatar.monDom.onclick = cardNClick;
			return avatar;
		});
	nodeArr = formatParse(nodeArr, /\%\{a([0-9]{1,3})\}/g, 1,
		(id)=>{
			const awokenList = renderAwakenings(parseInt(id,10));
			return awokenList;
		});

/*	arr = arr.flatMap(item=>{
		if (typeof item == "string") {
			const subArr = item.split(/\^([a-fA-F0-9]+?)\^([^\^]+?)\^p/igm);
			const newArr = [];
			for (let i = 0; i < subArr.length; i += 3) {
				newArr.push(subArr[i]);
				if (subArr[i+2] !== undefined) {
					const sp = document.createElement("span");
					sp.style.color = `#${subArr[i+1]}`;
					sp.textContent = subArr[i+2];
					newArr.push(sp);
				}
			}
			return newArr;
		} else {
			return item;
		}
	});

	arr = arr.flatMap(item=>{
		if (typeof item == "string") {
			const subArr = item.split(/\%\{m([0-9]{1,4})\}/g);
			const newArr = [];
			for (let i = 0; i < subArr.length; i += 2) {
				newArr.push(subArr[i]);
				if (subArr[i+1] !== undefined) {
					const avatar = cardN(parseInt(subArr[i+1],10));
					avatar.monDom.onclick = cardNClick;
					newArr.push(avatar);
				}
			}
			return newArr;
		} else {
			return item;
		}
	});*/

	//str = str.replace(/\n/ig,"<br>"); //换行
	//str = str.replace(/ /ig,"&nbsp;"); //换行

	//str = str.replace(/\^([a-fA-F0-9]+?)\^([^\^]+?)\^p/igm,'<span style="color:#$1;">$2</span>'); //文字颜色
	//str = str.replace(/\%\{m([0-9]{1,4})\}/g,function (str, p1, offset, s){return cardN(parseInt(p1,10)).outerHTML;}); //怪物头像
	return nodeArr.nodeJoin();
}
//默认的技能解释的显示行为
function parseSkillDescription(skill) {
	//const span = document.createElement("span");
	//span.innerHTML = descriptionToHTML(skill.description);
	
	return descriptionToHTML(skill.description);
}
//大数字缩短长度，默认返回本地定义字符串
function parseBigNumber(number) {
	return number.toLocaleString();
}
//判断是否是转生和超转生
function isReincarnated(card) {
	return card.is8Latent && !card.isUltEvo && (card.evoBaseId || card.evoRootId) != card.id && (card.awakenings.includes(49) ? isReincarnated(Cards[card.evoBaseId]) : true);
}
//获取类型允许的潜觉
function getAllowLatent(card) {
	const latentSet = new Set(common_allowable_latent);
	card.types.filter(i => i >= 0)
		.map(type => type_allowable_latent[type])
		.forEach(tA => tA.forEach(t => latentSet.add(t)));
	if (card.limitBreakIncr) {
		v120_allowable_latent.forEach(t => latentSet.add(t));
	}
	return Array.from(latentSet);
}
//计算队伍中有多少血量
function countTeamHp(team, leader1id, leader2id, solo, noAwoken = false) {
	let memberArr = team[0], assistArr = team[1];
	const ls1 = Skills[(Cards[leader1id] || Cards[0]).leaderSkillId];
	const ls2 = Skills[(Cards[leader2id] || Cards[0]).leaderSkillId];
	const mHpArr = memberArr.map((member, idx) => {
		const ability = noAwoken ? member.abilityNoAwoken : member.ability;
		let hp = ability ? ability[0] : 0;
		if (!hp) return 0;
		let hp1 = hp = Math.round(hp * memberHpMul(member, assistArr[idx], ls2, memberArr, solo)); //战友队长技
		let hp2 = hp = Math.round(hp * memberHpMul(member, assistArr[idx], ls1, memberArr, solo)); //我方队长技

		//演示用代码
		//console.log("%s 第1次倍率血量：%s，第2次倍率血量：%s",Cards[m.id].otLangName["chs"],hp1,hp2);
				
		return hp;

	});

	//console.log('单个队伍血量：',mHpArr,mHpArr.reduce((p,c)=>p+c));

	function memberHpMul(member, assist, ls, memberArr, solo) {
		let memberAttrsTypes = member.getAttrsTypesWithWeapon(assist);

		function hpMul(parm, scale) {
			if (scale == undefined || scale == 0) return 1;
			if (parm.attrs && memberAttrsTypes.attrs.some(a => parm.attrs.includes(a))) {
				return scale / 100;
			}
			if (parm.types && memberAttrsTypes.types.some(t => parm.types.includes(t))) {
				return scale / 100;
			}
			return 1;
		}
		const sk = ls.params;
		let scale = 1;
		switch (ls.type) {
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
				scale = hpMul({ attrs: flags(sk[0]), types: flags(sk[1]) }, sk[2]);
				break;
			case 125: //队伍中必须有指定队员
				const needMonIdArr = sk.slice(0, 5).filter(s => s > 0);
				const memberIdArr = memberArr.map(m => m.id); //包括队长，所以不需要筛选出队员
				scale = needMonIdArr.every(mid => memberIdArr.includes(mid)) ? sk[5] / 100 : 1;
				break;
			case 136:
				scale = hpMul({ attrs: flags(sk[0]) }, sk[1]);
				if (sk[4]) scale *= hpMul({ attrs: flags(sk[4]) }, sk[5]);
				break;
			case 137:
				scale = hpMul({ types: flags(sk[0]) }, sk[1]);
				if (sk[4]) scale *= hpMul({ types: flags(sk[4]) }, sk[5]);
				break;
			case 155:
				scale = solo ? 1 : hpMul({ attrs: flags(sk[0]), types: flags(sk[1]) }, sk[2]);
				break;
			case 158:
				scale = hpMul({ attrs: flags(sk[1]), types: flags(sk[2]) }, sk[4]);
				break;
			case 175: //队伍组成全为合作
				const needCollabIdIdArr = sk.slice(0, 3).filter(s => s > 0);
				const memberCollabIdArr = memberArr.slice(1, 5).filter(m => m.id > 0).map(m => Cards[m.id].collabId);
				scale = memberCollabIdArr.every(cid => needCollabIdIdArr.includes(cid)) ? sk[3] / 100 : 1;
				break;
			case 178:
			case 185:
				scale = hpMul({ attrs: flags(sk[1]), types: flags(sk[2]) }, sk[3]);
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
					return pre + memberCard.rarity;
				}, 0);
				scale = rarityCount <= sk[0] ? sk[1] / 100 : 1;
				break;
			}
			case 229:{ //队员中存在每个属性或Type都算一次
				const atCount = countTeamTotalAttrsTypes(memberArr, assistArr);

				let correAttrs = flags(sk[0]), correTypes = flags(sk[1]); //符合的属性/类型
				 //符合的次数
				let correTimes = correAttrs.reduce((pre,attr)=>pre + (atCount.attrs.get(attr) || 0),0) +
								 correTypes.reduce((pre,type)=>pre + (atCount.types.get(type) || 0),0);
				scale = sk[2] * correTimes / 100 + 1;
				console.debug('属性、类型个数动态倍率，当前队长HP倍率为 %s (匹配 %d 次)', scale, correTimes);
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
	let attrsCount = new Map();
	let typesCount = new Map();
	for (let idx = 0; idx < memberArr.length; idx++) {
		const member = memberArr[idx], assist = assistArr[idx];

		let memberAttrsTypes = member.getAttrsTypesWithWeapon(assist);
		if (memberAttrsTypes) {
			for (let attr of memberAttrsTypes.attrs) {
				attrsCount.set(attr, (attrsCount.get(attr) || 0) + 1);
			}
			for (let type of memberAttrsTypes.types) {
				typesCount.set(type, (typesCount.get(type) || 0) + 1);
			}
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
	if (skillTypes.includes(skill.type))
	{
		return [skill];
	}
	else if (skill.type == 116 || (searchRandom && skill.type == 118) || skill.type == 138 || skill.type == 232 || skill.type == 233)
	{
		//因为可能有多层调用，特别是随机118再调用组合116的，所以需要递归
		let subSkills = skill.params.flatMap(id => getActuallySkills(Skills[id], skillTypes, searchRandom));
		subSkills = subSkills.filter(s=>s);
		return subSkills;
	}
	else
	{
		return [];
	}
}

//计算队伍是否为76
function tIf_Effect_76board(leader1id, leader2id) {
	const searchTypeArray = [162, 186];
	function henshinBase(cardid, firstId)
	{
		if (firstId == undefined) firstId = cardid;
		let card = Cards[cardid];
		if (card && Array.isArray(card.henshinFrom) && card.henshinFrom[0] !== firstId)
		{
			card = henshinBase(card.henshinFrom[0], firstId);
		}
		return card;
	}
	const ls1 = getCardLeaderSkills(henshinBase(leader1id), searchTypeArray)[0];
	const ls2 = getCardLeaderSkills(henshinBase(leader2id), searchTypeArray)[0];

	return Boolean(ls1 || ls2);
}
//计算队伍是否为无天降
function tIf_Effect_noSkyfall(leader1id, leader2id) {
	const searchTypeArray = [163, 177];
	const ls1 = getCardLeaderSkills(Cards[leader1id], searchTypeArray)[0];
	const ls2 = getCardLeaderSkills(Cards[leader2id], searchTypeArray)[0];

	return Boolean(ls1 || ls2);
}
//计算队伍是否为毒无效
function tIf_Effect_poisonNoEffect(leader1id, leader2id) {
	const searchTypeArray = [197];
	const ls1 = getCardLeaderSkills(Cards[leader1id], searchTypeArray)[0];
	const ls2 = getCardLeaderSkills(Cards[leader2id], searchTypeArray)[0];

	return Boolean(ls1 || ls2);
}
//计算队伍的+C
function tIf_Effect_addCombo(leader1id, leader2id) {
	return [
		getSkillAddCombo(Cards[leader1id]),
		getSkillAddCombo(Cards[leader2id])
	];
}
function getSkillAddCombo(card) {
	const searchTypeArray = [192, 194, 206, 209, 210, 219, 220, 235];
	const skill = getCardLeaderSkills(card, searchTypeArray)[0];
	if (!skill) return 0;
	switch (skill.type) {
		case 192:
		case 194:
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
}
//计算队伍的追打
function tIf_Effect_inflicts(leader1id, leader2id) {
	return [
		getSkillFixedDamage(Cards[leader1id]),
		getSkillFixedDamage(Cards[leader2id])
	];
}
function getSkillFixedDamage(card) {
	const searchTypeArray = [199, 200, 201, 223, 235];
	const skill = getCardLeaderSkills(card, searchTypeArray)[0];
	if (!skill) return 0;
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
		default:
			return 0;
	}
}
//计算队伍操作时间
function countMoveTime(team, leader1id, leader2id, teamIdx) {
	const searchTypeArray = [178, 15, 185];
	const ls1 = getCardLeaderSkills(Cards[leader1id], searchTypeArray)[0];
	const ls2 = getCardLeaderSkills(Cards[leader2id], searchTypeArray)[0];
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
			default: 5,
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

		//1人、3人计算徽章
		if (solo || teamsCount === 3) {
			switch (team[2]) {
				case 2: //小手指
					moveTime.duration.badge = 1;
					break;
				case 21: //大手指
					moveTime.duration.badge = 2;
					break;
				case 50: //月卡
					moveTime.duration.badge = 3;
					break;
			}
		} else if (teamsCount === 2) //2人协力时的特殊处理
		{
			const teams = formation.teams;
			const team2 = teamIdx === 1 ? teams[0] : teams[1]; //获取队伍2
			//复制队伍1，这里参数里的 team 换成了一个新的数组
			team = [
				team[0].concat(),
				team[1].concat()
			];
			//把队伍2的队长和武器添加到复制的队伍1里面
			team[0].push(team2[0][team2[3]]);
			team[1].push(team2[1][team2[3]]);
		}

		//觉醒
		const awokenMoveTime = [
			{ index: 19, value: 0.5 }, //小手指
			{ index: 53, value: 1 }, //大手指
		];
		moveTime.duration.awoken += awokenMoveTime.reduce((duration, aw) =>
			duration + awokenCountInTeam(team, aw.index, solo, teamsCount) * aw.value, 0);
		//潜觉
		const latentMoveTime = [
			{ index: 4, value: 0.05 }, //小手指潜觉
			{ index: 31, value: 0.12 }, //大手指潜觉
		];

		moveTime.duration.awoken += latentMoveTime.reduce((duration, la) =>
			duration + team[0].reduce((count, menber) =>
				count + (menber.latent ? menber.latent.filter(l => l == la.index).length : 0), 0) * la.value, 0);

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
			const attrs = flags(scale.attrs); //得到属性数组
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
//获取盾减伤比例组
function getReduceScales(leaderid) {
	const searchTypeArray = [16, 17, 36, 38, 43, 129, 163, 130, 131, 178, 151, 169, 198, 170, 182, 193, 171, 183, 235];
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