﻿//仿GM_xmlhttpRequest函数v1.5
const GM_xmlhttpRequest = function(GM_param) {
	const xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
	xhr.open(GM_param.method, GM_param.url, true);
	if (GM_param.responseType) xhr.responseType = GM_param.responseType;
	if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
	xhr.onreadystatechange = function(e) //设置回调函数
		{
			const _xhr = e.target;
			if (_xhr.readyState === _xhr.DONE) { //请求完成时
				console.debug("http状态码：",_xhr.status);
				if ((_xhr.status === 200 || (location.host === "" && _xhr.status === 0)) && GM_param.onload) //正确加载时
				{
					GM_param.onload(_xhr);
				}else if (_xhr.status !== 200 && GM_param.onerror) //发生错误时
				{
					GM_param.onerror(_xhr);
				}
			}
		};
	if (GM_param.onprogress)
		xhr.upload.onprogress = function(e){GM_param.onprogress(e.target)};
	//添加header
	for (let header in GM_param.headers) {
		xhr.setRequestHeader(header, GM_param.headers[header]);
	}
	//发送数据
	xhr.send(GM_param.data ? GM_param.data : null);
};

//获取URL参数
function getQueryString(name,url) {
	if (!!(window.URL && window.URLSearchParams))
	{ //浏览器原生支持的API
		const urlObj = new URL(url || document.location);
		return urlObj.searchParams.get(name);
	}else
	{
		const reg = new RegExp(`(?:^|&)${name}=([^&]*)(?:&|$)`, "i");
		const searchStr = url || location.search.substr(1);
		const r = searchStr.match(reg);
		if (r != null)
		{
			return decodeURIComponent(r[1]);
		}else
		{
			return null;
		}
	}
}

//数字补前导0
Number.prototype.prefixInteger = function(length, useGrouping = false)
{  
	return this.toLocaleString(undefined,
		{
			useGrouping: useGrouping,
			minimumIntegerDigits: length
		});
}
//大数字缩短长度，默认返回本地定义字符串
Number.prototype.bigNumberToString = function()
{  
	return this.toLocaleString();
}

//数组删除自己尾部的空元素
Array.prototype.DeleteLatter = function(item = null)
{
	let index = this.length - 1;
	for (; index>=0; index--)
	{
		if (this[index] !== item)
		{
			break;
		}
	}
	this.splice(index + 1);
	return this;
}

//▼ADPCM播放相关，来自 https://github.com/jy4340132/aaa
const pcmMemory = new WebAssembly.Memory({initial: 256, maximum: 256});

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

function decodeAudio(fileName, decodeCallback)
{
	if(pcmPlayer != null)
	{
		pcmPlayer.close();
	}
	pcmPlayer = new PCMPlayer(1, 44100);
	fetch(fileName).then((response) => response.arrayBuffer())
	.then((bytes) => {
		let audioData = new Uint8Array(bytes);
		let step = 160;
		for(let i = 0; i < audioData.byteLength; i += step)
		{
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
function latentUseHole(latentId)
{
	switch (true)
	{
		case (latentId === 12):
		case (latentId >= 16 && latentId <= 36 || latentId >= 43):
			return 2;
		case (latentId >= 13 && latentId <= 15):
		case (latentId >= 37 && latentId <= 42):
			return 6;
		case (latentId < 12):
		default:
			return 1;
	}
}
//获取最大潜觉数量
function getMaxLatentCount(id)
{ //转生2和超转生3为8个格子
	const card = Cards[id];
	return card && card.is8Latent ? 8 : 6;
}
//计算用了多少潜觉格子
function usedHole(latents)
{
	return latents.reduce((usedHole, latentId) => usedHole + latentUseHole(latentId), 0);
}
//计算所有队伍中有多少个该觉醒
function awokenCountInFormation(formationTeams,awokenIndex,solo,teamsCount)
{
	const formationAwokenCount = formationTeams.reduce(function(previous,team){
		return previous + awokenCountInTeam(team,awokenIndex,solo,teamsCount);
	},0);
	return formationAwokenCount;
}
//计算单个队伍中有多少个该觉醒
function awokenCountInTeam(team,awokenIndex,solo,teamsCount)
{
	const memberArray = team[0];
	const assistArray = team[1];

	const teamAwokenCount = memberArray.reduce(function(previous,mon,idx){
		if (mon.id<=0)
		{ //如果是delay和null
			return previous;
		}
		const card = Cards[mon.id];
		if (!card || !card.enabled)
		{ //如果卡片未启用
			return previous;
		}

		const assist = assistArray[idx];
		const assistCard = Cards[assist.id];
		//启用的觉醒数组片段
		let enableAwoken = card.awakenings.slice(0, mon.awoken);
		//单人、3人时,大于等于100级时增加超觉醒
		if ((solo || teamsCount === 3) && mon.sawoken>=0 && mon.level>=100)
		{
			const sAwokenT = card.superAwakenings[mon.sawoken];
			if (sAwokenT >= 0)
				enableAwoken = enableAwoken.concat(sAwokenT);
		}
		if (assistCard && assistCard.enabled && assistCard.awakenings.includes(49))
		{ //如果卡片未启用
			enableAwoken = enableAwoken.concat(assistCard.awakenings.slice(0, assist.awoken));
		}

		//相同的觉醒数
		const hasAwoken = enableAwoken.filter(ak=>{return ak == awokenIndex;}).length;
		return previous + hasAwoken;
	},0);
	return teamAwokenCount;
}
//返回可用的怪物名称
function returnMonsterNameArr(card, lsList, defaultCode)
{
	const monNameArr = lsList.map(lc=>{ //取出每种语言
		if (lc == defaultCode)
			return card.name;
		else if(card.otLangName)
			return card.otLangName[lc];
	}).filter(ln=> //去掉空值和问号
		typeof(ln) == "string" && ln.length>0 && !new RegExp("^(?:초월\\s*)?[\\?\\*]+","i").test(ln)
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
	return curve.min + (curve.max - curve.min) * Math.pow(f, curve.scale);
}
//Code From pad-rikuu
function curve(c, level, maxLevel, limitBreakIncr, limitBreakIncr120) {
	let value = valueAt(level, maxLevel, {
		min: c.min,
		max: c.max!==undefined ? c.max : (c.min * maxLevel),
		scale: c.scale || 1
	});

	if (level > maxLevel) {
		const exceed99 = Math.min(level - maxLevel, 11);
		const exceed110 = Math.max(0, level - 110);
		value += c.max!==undefined ?
			((c.max * (limitBreakIncr / 100) * (exceed99 / 11)) + (c.max * (limitBreakIncr120 / 100) * (exceed110 / 10))) :
			(c.min * exceed99 + c.min * exceed110);
	}
	return value;
}
//计算怪物的经验值
function calculateExp(member)
{
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
function calculateAbility(member, assist = null, solo = true, teamsCount = 1)
{
	if (!member) return null;

	const memberCard = Cards[member.id];
	const assistCard = assist ? Cards[assist.id] : null;
	if (!memberCard || memberCard.id == 0 || !memberCard.enabled) return null;

	const bonusScale = [0.1,0.05,0.15]; //辅助宠物附加的属性倍率
	const plusAdd = [10,5,3]; //加值的增加值
	const limitBreakIncr120 = [10,5,5]; //120三维增加比例
	
	const awokenAdd = [ //对应加三维觉醒的序号与增加值
		[{index:1,value:500},{index:65,value:-2500}], //HP
		[{index:2,value:100},{index:66,value:-1000}], //ATK
		[{index:3,value:200},{index:67,value:-2000}]  //RCV
	];
	const previousAwokenScale = [ //在297之前，对应比例加三维觉醒的序号与倍率值，就是语音觉醒
		[{index:63,scale:1.1}], //HP
		[{index:63,scale:1.1}], //ATK
		[{index:63,scale:1.1}]  //RCV
	];
	const latterAwokenScale = [ //对应比例加三维觉醒的序号与倍率值
		[], //HP
		[], //ATK
		[]  //RCV
	];

	if (!solo)
	{ //协力时计算协力觉醒
		latterAwokenScale.forEach(ab=>{
			ab.push({index:30,scale:1.5});
		});
	}
	const latentScale = [ //对应加三维潜在觉醒的序号与增加比例
		[{index:1,scale:0.015},{index:12,scale:0.03},{index:28,scale:0.045},{index:43,scale:0.10}], //HP
		[{index:2,scale:0.01},{index:12,scale:0.02},{index:29,scale:0.03},{index:44,scale:0.05}], //ATK
		[{index:3,scale:0.1},{index:12,scale:0.2},{index:30,scale:0.3},{index:45,scale:0.35}]  //RCV
	];
	const memberCurves = [memberCard.hp, memberCard.atk, memberCard.rcv];
	const assistCurves = assistCard ? [assistCard.hp, assistCard.atk, assistCard.rcv] : null;


	const abilitys = memberCurves.map((ab, idx)=>{
		const n_base = Math.round(curve(ab, member.level, memberCard.maxLevel, memberCard.limitBreakIncr, limitBreakIncr120[idx])); //等级基础三维
		const n_plus = member.plus[idx] * plusAdd[idx]; //加值增加量
		let n_assist_base = 0,n_assist_plus=0; //辅助的bonus
		let awokenList = memberCard.awakenings.slice(0,member.awoken); //储存点亮的觉醒
		//单人、3人时,大于等于100级时增加超觉醒
		if ((solo || teamsCount === 3) && member.sawoken>=0 && member.level>=100)
		{
			const sAwokenT = memberCard.superAwakenings[member.sawoken];
			if (sAwokenT >= 0)
				awokenList = awokenList.concat(sAwokenT);
		}
		//如果有武器还要计算武器的觉醒
		if (assistCard && assistCard.id > 0 && assistCard.enabled)
		{
			const assistAwokenList = assistCard.awakenings.slice(0, assist.awoken); //储存武器点亮的觉醒
			if (assistAwokenList.includes(49)) //49是武器觉醒，确认已经点亮了武器觉醒
			{
				awokenList = awokenList.concat(assistAwokenList);
			}
			if (memberCard.attrs[0] === assistCard.attrs[0] || memberCard.attrs[0] == 6 || assistCard.attrs[0] == 6)
			{
				
				n_assist_base = Math.round(curve(assistCurves[idx], assist.level, assistCard.maxLevel, assistCard.limitBreakIncr, limitBreakIncr120[idx])); //辅助等级基础三维
				n_assist_plus = assist.plus[idx] * plusAdd[idx]; //辅助加值增加量
			}
		}

		//用来计算倍率觉醒的最终倍率是多少，reduce用
		function calculateAwokenScale(previous,aw)
		{
			const awokenCount = awokenList.filter(ak=>ak==aw.index).length; //每个倍率觉醒的数量
			return previous * Math.pow(aw.scale, awokenCount);
		}
		
		//倍率类觉醒的比例，直接从1开始乘
		const n_awokenScale = previousAwokenScale[idx].reduce(calculateAwokenScale,1);

		//觉醒增加的数值
		const n_awoken = awokenList.length>0 ?
			Math.round(awokenAdd[idx].reduce((previous,aw)=>{
					const awokenCount = awokenList.filter(ak=>ak==aw.index).length; //每个觉醒的数量
					if (awokenCount>0)
						return previous + aw.value * awokenCount;
					else
						return previous;
				},0)) :
			0;

		//潜觉增加的倍率，从0开始，增加比例小于1，是加法不是乘法
		const n_latentScale = (member.latent && member.latent.length>0) ? 
			latentScale[idx].reduce((previous,la)=>{
					const latentCount = member.latent.filter(l=>l===la.index).length; //每个潜觉的数量
					return previous + la.scale * latentCount;
				},0) :
			0;
		
		let reValue = n_base * n_awokenScale + n_base * n_latentScale + n_plus + n_awoken + (n_assist_base + n_assist_plus) * bonusScale[idx];
		//因为语音觉醒觉醒无效也生效，所以这里需要计算
		let reValueNoAwoken = n_base * n_awokenScale + n_plus + (n_assist_base + n_assist_plus) * bonusScale[idx];

		//觉醒生效时的协力、语音觉醒等的倍率
		reValue = reValue * latterAwokenScale[idx].reduce(calculateAwokenScale,1);

		//都要做四舍五入
		reValue = Math.round(reValue);
		reValueNoAwoken = Math.round(reValueNoAwoken);
		if (idx<2) //idx顺序为HP、ATK、RCV
		{ //HP和ATK最低为1
			reValue = Math.max(reValue,1);
			reValueNoAwoken = Math.max(reValueNoAwoken,1);
		}
		return [reValue,reValueNoAwoken];
	});
	return abilitys;
}
function calculateAbility_max(id, solo, teamsCount)
{
	const card = Cards[id];
	const tempMon = {
		id: id,
		level: card.limitBreakIncr ? 110 : card.maxLevel,
		plus: (card.overlay || card.types[0] == 15 && card.types[1] == -1) ? [0,0,0] : [99,99,99],  //当可以叠加时，不能打297
		awoken: card.awakenings.length,
	};
	const abilities = calculateAbility(tempMon, null, solo, teamsCount);
	if (abilities)
	{
		return {
			noAwoken:{
				hp:abilities[0][1],
				atk:abilities[1][1],
				rcv:abilities[2][1],
			},
			withAwoken:{
				hp:abilities[0][0],
				atk:abilities[1][0],
				rcv:abilities[2][0],
			},
		};
	}else
	{
		return null;
	}
}
//搜索卡片用
function searchCards(cards,attr1,attr2,fixMainColor,types,typeAndOr,rares,awokens,sawokens,equalAk,incSawoken)
{
	let cardsRange = cards.concat(); //这里需要复制一份原来的数组，不然若无筛选，后面的排序会改变初始Cards
	//属性
	if (attr1 != null && attr1 ===  attr2 || //主副属性一致并不为空
		(attr1 === 6 && attr2 === -1)) //主副属性都为“无”
	{ //当两个颜色相同时，主副一样颜色的只需判断一次
		cardsRange = cardsRange.filter(c=>c.attrs[0] === attr1 && c.attrs[1] === attr1);
	}else if (fixMainColor) //如果固定了顺序
	{
		const a1null = attr1 === null, a2null = attr2 === null;
		cardsRange = cardsRange.filter(c=>
			(a1null ? true : c.attrs[0] === attr1) &&
			(a2null ? true : c.attrs[1] === attr2)
		);
	}else //不限定顺序时
	{
		const search_attrs = [attr1, attr2].filter(a => a !== null && a >= 0 && a<=5); //所有非空属性
		const anone = attr1 === 6 || attr2 === -1; //是否有“无”属性
		cardsRange = cardsRange.filter(c=>
			search_attrs.every(a=>c.attrs.includes(a)) &&
			(anone ? (c.attrs.includes(6) || c.attrs.includes(-1)) : true)
		);
	}
	//类型
	if (types.length>0)
	{
		cardsRange = cardsRange.filter(c=>typeAndOr ?
			types.every(t=>c.types.includes(t)) : //所有type都满足
			types.some(t=>c.types.includes(t))  //只需要满足一个type
			);
	}
	//稀有度
	if (rares.length>1)
	{
		cardsRange = cardsRange.filter(c=>c.rarity >= rares[0] && c.rarity <= rares[1]);
	}
	//觉醒
	//等效觉醒时，事先去除大觉醒
	if (equalAk)
	{
		const bigEqualAwokens = awokens.filter(ak => equivalent_awoken.findIndex(eak => eak.big === ak.id) >= 0); //所有存在的大觉醒
		bigEqualAwokens.forEach(bak=>{
			const equivalentAwoken = equivalent_awoken.find(eak => eak.big === bak.id);
			let smallEqualAwoken = awokens.find(ak => equivalentAwoken.small === ak.id);
			if (!smallEqualAwoken)
			{
				smallEqualAwoken = {id:equivalentAwoken.small,num:0}; //如果没有就新建一个
				awokens.push(smallEqualAwoken);
			}
			smallEqualAwoken.num += bak.num * equivalentAwoken.times; //小觉醒添加大觉醒的数字
		});
		awokens = awokens.filter(ak => equivalent_awoken.findIndex(eak => eak.big === ak.id) < 0); //去除大觉醒
	}

	if (awokens.length>0)
	{
		cardsRange = cardsRange.filter(card => {
			let cardAwakeningsArray = [];
			if (incSawoken && card.superAwakenings.length > 0)
			{ //如果搜索超觉醒，产生原始觉醒分别加上每个超觉醒的多个数组
				cardAwakeningsArray = card.superAwakenings.map(sak=>card.awakenings.concat(sak));
			}else
			{ //单个原始觉醒数组
				cardAwakeningsArray.push(card.awakenings);
			}

			return cardAwakeningsArray.some(cardAwakening=> //重复每种包含超觉醒的觉醒数组，只要有一组符合要求就行
				awokens.every(ak=>{ //判断需要搜索的觉醒是不是全都在觉醒数组里
					if (equalAk) //如果开启等效觉醒
					{
						//搜索等效觉醒
						const equivalentAwoken = equivalent_awoken.find(eak => eak.small === ak.id);
						if (equivalentAwoken)
						{
							const totalNum = cardAwakening.filter(cak=>cak == equivalentAwoken.small).length + 
											 cardAwakening.filter(cak=>cak == equivalentAwoken.big).length * equivalentAwoken.times;
							return totalNum >= ak.num;
						}
					}
					return cardAwakening.filter(cak=>cak == ak.id).length >= ak.num;
				})
			);
		});
	}

	//超觉醒
	if (sawokens.length>0 && !incSawoken)
	{
		cardsRange = cardsRange.filter(card=> sawokens.some(sak=>{
			const equivalentAwoken = equivalent_awoken.find(eak => eak.small === sak);
			return card.superAwakenings.includes(sak) || 
				   equalAk && equivalentAwoken && card.superAwakenings.includes(equivalentAwoken.big); //如果开启等效觉醒
		}) );
	}

	cardsRange = cardsRange.filter(card=>card.id); //去除Cards[0]
	return cardsRange;
}
//产生一个怪物头像
function createCardA()
{
	const cdom = document.createElement("a");
	cdom.className = "monster";
	cdom.target = "_blank";
	const property = cdom.appendChild(document.createElement("div"));
	property.className = "property";
	const subproperty = cdom.appendChild(document.createElement("div"));
	subproperty.className = "subproperty";
	const cid = cdom.appendChild(document.createElement("div"));
	cid.className = "id";
	const cawoken = cdom.appendChild(document.createElement("div"));
	cawoken.className = "awoken-count-num";
	return cdom;
}
//返回文字说明内怪物Card的纯HTML
function cardN(id){
	const monOuterDom = document.createElement("span");
	monOuterDom.className = "detail-mon";
	const monDom = createCardA(id);
	monOuterDom.appendChild(monDom);
	monOuterDom.monDom = monDom;
	changeid({id:id},monDom);
	return monOuterDom;
}
//将怪物的文字介绍解析为HTML
function descriptionToHTML(str)
{
	str = str.replace(/\n/ig,"<br>"); //换行
	//str = str.replace(/ /ig,"&nbsp;"); //换行
	str = str.replace(/\^([a-fA-F0-9]+?)\^([^\^]+?)\^p/igm,'<span style="color:#$1;">$2</span>'); //文字颜色
	str = str.replace(/\%\{m([0-9]{1,4})\}/g,function (str, p1, offset, s){return cardN(parseInt(p1,10)).outerHTML;}); //怪物头像
	return str;
}
//默认的技能解释的显示行为
function parseSkillDescription(skill)
{
	const span = document.createElement("span");
	span.innerHTML = descriptionToHTML(skill.description);
	return span;
}
//大数字缩短长度，默认返回本地定义字符串
function parseBigNumber(number)
{
	return number.toLocaleString();
}
//判断是否是转生和超转生
function isReincarnated(card)
{
	return card.is8Latent && !card.isUltEvo && (card.evoBaseId || card.evoRootId) != card.id && (card.awakenings.includes(49) ? isReincarnated(Cards[card.evoBaseId]) : true);
}
//获取类型允许的潜觉
function getAllowLatent(card)
{
	const latentSet = new Set(common_allowable_latent);
	card.types.filter(i => i >= 0)
		.map(type => type_allowable_latent[type])
		.forEach(tA => tA.forEach(t => latentSet.add(t)));
	if (card.limitBreakIncr)
	{
		v120_allowable_latent.forEach(t=>latentSet.add(t));
	}
	return Array.from(latentSet);
}
//计算队伍中有多少血量
function countTeamHp(memberArr, leader1id, leader2id, solo, noAwoken=false)
{
	const ls1 = Skills[Cards[leader1id].leaderSkillId];
	const ls2 = Skills[Cards[leader2id].leaderSkillId];
	const mHpArr = memberArr.map(m=>{
		const ability = noAwoken ? m.abilityNoAwoken : m.ability;
		let hp = ability ? ability[0] : 0;
		if (!hp) return 0;
		const card = Cards[m.id];
		hp = hp1 = Math.round(hp * memberHpMul(card,ls2,memberArr,solo));//战友队长技
		hp = hp2 = Math.round(hp * memberHpMul(card,ls1,memberArr,solo));//我方队长技

/* 演示用代码
		let hp1,hp2;
		hp1 = hp * memberHpMul(card,ls2,memberArr,solo); 
		hp = Math.round(hp1);
		hp2 = hp * memberHpMul(card,ls1,memberArr,solo); 
		hp = Math.round(hp2);
		console.log("%s 第1次倍率血量：%s(%s)，第2次倍率血量：%s(%s)",Cards[m.id].otLangName["chs"],Math.round(hp1),hp1,Math.round(hp2),hp2);
		*/
		return hp;

	});

	//console.log('单个队伍血量：',mHpArr,mHpArr.reduce((p,c)=>p+c));

	function memberHpMul(card,ls,memberArr,solo)
	{
		function flags(num){
			const arr = [];
			for (let i = 0; i<32;i++)
			{
				if (num & (1<<i))
				{
					arr.push(i);
				}
			}
			return arr;
		}
		function hpMul(parm,scale)
		{
			if (scale == undefined || scale == 0) return 1;
			if (parm.attrs && card.attrs.some(a => parm.attrs.includes(a)))
			{
				return scale / 100;
			}
			if (parm.types && card.types.some(t => parm.types.includes(t)))
			{
				return scale / 100;
			}
			return 1;
		}
		const sk = ls.params;
		let scale = 1;
		switch (ls.type)
		{
			case 23: case 30: case 62: case 77: case 63: case 65:
				scale = hpMul({types:sk.slice(0,sk.length-1)}, sk[sk.length-1]);
				break;
			case 29: case 114: case 45: case 111: case 46: case 48: case 67:
				scale = hpMul({attrs:sk.slice(0,sk.length-1)}, sk[sk.length-1]);
				break;
			case 73: case 76:
				scale = hpMul({attrs:sk[0],types:sk[1]}, sk[2]);
				break;
			case 106: case 107: case 108:
				scale = sk[0] / 100;
				break;
			case 121: case 129: case 163: case 186:
				scale = hpMul({attrs:flags(sk[0]),types:flags(sk[1])}, sk[2]);
				break;
			case 125: //队伍中必须有指定队员
				const needMonIdArr = sk.slice(0,5).filter(s=>s>0);
				const memberIdArr = memberArr.map(m=>m.id); //包括队长，所以不需要筛选出队员
				scale = needMonIdArr.every(mid=>memberIdArr.includes(mid)) ? sk[5]/100 : 1;
				break;
			case 136:
				scale = hpMul({attrs:flags(sk[0])}, sk[1]) *
				sk[4]? hpMul({attrs:flags(sk[4])}, sk[5]) : 1;
				break;
			case 137:
				scale = hpMul({types:flags(sk[0])}, sk[1]) *
				sk[4]? hpMul({types:flags(sk[4])}, sk[5]) : 1;
				break;
			case 155:
				scale = solo ? 1 : hpMul({attrs:flags(sk[0]),types:flags(sk[1])}, sk[2]);
				break;
			case 158:
				scale = hpMul({attrs:flags(sk[1]),types:flags(sk[2])}, sk[4]);
				break;
			case 175: //队伍组成全为合作
				const needCollabIdIdArr = sk.slice(0,3).filter(s=>s>0);
				const memberCollabIdArr = memberArr.slice(1,5).filter(m=>m.id>0).map(m=>Cards[m.id].collabId);
				scale = memberCollabIdArr.every(cid=>needCollabIdIdArr.includes(cid)) ? sk[3]/100 : 1;
				break;
			case 178: case 185:
				scale = hpMul({attrs:flags(sk[1]),types:flags(sk[2])}, sk[3]);
				break;
			case 203: //队员为指定类型，不包括双方队长，且队员数大于0
				let trueMemberCardsArr = memberArr.slice(1,5).filter(m=>m.id>0).map(m=>Cards[m.id]);
				switch (sk[0])
				{
					case 0: //全是像素进化
						scale = (trueMemberCardsArr.length>0 && trueMemberCardsArr.every(card=>card.evoMaterials.includes(3826))) ? sk[1]/100 : 1;
						break;
					case 2: //全是转生、超转生（8格潜觉）
						scale = (trueMemberCardsArr.length>0 && trueMemberCardsArr.every(card=>isReincarnated(card))) ? sk[1]/100 : 1;
						break;
				}
				break;
			case 138: //调用其他队长技
				scale = sk.reduce((pmul,skid)=>pmul * memberHpMul(card,Skills[skid],memberArr,solo),1)
				break;
			default:
		}
		return scale || 1;
	}
	return mHpArr;
}

//返回卡片的队长技能
function getCardLeaderSkill(card, skillTypes)
{
	return getActuallySkill(Skills[card.leaderSkillId], skillTypes, false);
}
//查找到真正起作用的那一个技能
function getActuallySkill(skill, skillTypes, searchRandom = true)
{
	if (skillTypes.includes(skill.type))
	{
		return skill;
	}else if (skill.type == 116 || (searchRandom && skill.type == 118) || skill.type == 138)
	{
		const subSkills = skill.params.map(id=>Skills[id]);
		for(let i = 0;i < subSkills.length; i++)
		{ //因为可能有多层调用，特别是随机118再调用组合116的，所以需要递归
			let foundSubSkill = getActuallySkill(subSkills[i], skillTypes, searchRandom);
			if (foundSubSkill)
			{
				return foundSubSkill;
			}
		}
		return null;
	}else
	{
		return null;
	}
}
	
//计算队伍是否为76
function tIf_Effect_76board(leader1id, leader2id)
{
	const searchTypeArray = [162, 186];
	const ls1 = getCardLeaderSkill(Cards[leader1id], searchTypeArray);
	const ls2 = getCardLeaderSkill(Cards[leader2id], searchTypeArray);

	return Boolean(ls1 || ls2);
}
//计算队伍是否为无天降
function tIf_Effect_noSkyfall(leader1id, leader2id)
{
	const searchTypeArray = [163, 177];
	const ls1 = getCardLeaderSkill(Cards[leader1id], searchTypeArray);
	const ls2 = getCardLeaderSkill(Cards[leader2id], searchTypeArray);
	
	return Boolean(ls1 || ls2);
}
//计算队伍是否为毒无效
function tIf_Effect_poisonNoEffect(leader1id, leader2id)
{
	const searchTypeArray = [197];
	const ls1 = getCardLeaderSkill(Cards[leader1id], searchTypeArray);
	const ls2 = getCardLeaderSkill(Cards[leader2id], searchTypeArray);
	
	return Boolean(ls1 || ls2);
}
//计算队伍的+C
function tIf_Effect_addCombo(leader1id, leader2id)
{
	const searchTypeArray = [192,194,206,209,210];
	const ls1 = getCardLeaderSkill(Cards[leader1id], searchTypeArray);
	const ls2 = getCardLeaderSkill(Cards[leader2id], searchTypeArray);

	function getSkillAddCombo(skill)
	{
		if (!skill) return 0;
		switch (skill.type)
		{
			case 192: case 194:
				return skill.params[3];
			case 206:
				return skill.params[6];
			case 209:
				return skill.params[0];
			case 210:
				return skill.params[2];
			default:
				return 0;
		}
	}
	
	return [getSkillAddCombo(ls1),getSkillAddCombo(ls2)];
}
//计算队伍的追打
function tIf_Effect_inflicts(leader1id, leader2id)
{
	const searchTypeArray = [199,200,201];
	const ls1 = getCardLeaderSkill(Cards[leader1id], searchTypeArray);
	const ls2 = getCardLeaderSkill(Cards[leader2id], searchTypeArray);

	function getSkillFixedDamage(skill)
	{
		if (!skill) return 0;
		switch (skill.type)
		{
			case 199: case 200:
				return skill.params[2];
			case 201:
				return skill.params[5];
			default:
				return 0;
		}
	}
	
	return [getSkillFixedDamage(ls1),getSkillFixedDamage(ls2)];
}
//计算队伍操作时间
function countMoveTime(team, leader1id, leader2id, teamIdx)
{
	const ls1 = Skills[Cards[leader1id].leaderSkillId];
	const ls2 = Skills[Cards[leader2id].leaderSkillId];
	const time1 = leaderSkillMoveTime(ls1);
	const time2 = leaderSkillMoveTime(ls2);

	let moveTime = {
		fixed:false,
		duration:{
			default:5,
			leader:0,
			badge:0,
			awoken:0,
		}
	}; //基础5秒
	//固定操作时间的直接返回
	if (time1.fixed || time2.fixed)
	{
		moveTime.fixed = true;
		moveTime.duration.leader = time1.fixed ?
		(time2.fixed ? Math.min(time1.duration, time2.duration) : time1.duration) :
		time2.duration;
	} else
	{
		moveTime.duration.leader = time1.duration + time2.duration;

		//1人、3人计算徽章
		if (solo || teamsCount === 3)
		{
			//徽章部分
			if (team[2] == 1) //小手指
			{
				moveTime.duration.badge = 1;
			} else if (team[2] == 13) //大手指
			{
				moveTime.duration.badge = 2;
			} else if (team[2] == 18) //月卡
			{
				moveTime.duration.badge = 3;
			}
		}
		else if (teamsCount === 2) //2人协力时的特殊处理
		{
			const teams = formation.teams;
			const team2 = teamIdx === 1 ? teams[0] : teams[1]; //获取队伍2
			//复制队伍1，这里参数里的 team 换成了一个新的数组
			team = [
				team[0].concat(),
				team[1].concat()
			];
			//把队伍2的队长和武器添加到复制的队伍1里面
			team[0].push(team2[0][0]);
			team[1].push(team2[1][0]);
		}

		//觉醒
		const awokenMoveTime = [
			{index:19,value:0.5}, //小手指
			{index:53,value:1}, //大手指
		];
		moveTime.duration.awoken += awokenMoveTime.reduce((duration,aw)=>
			duration + awokenCountInTeam(team, aw.index, solo, teamsCount) * aw.value
		,0);
		//潜觉
		const latentMoveTime = [
			{index:4,value:0.05}, //小手指潜觉
			{index:31,value:0.12}, //大手指潜觉
		];

		moveTime.duration.awoken += latentMoveTime.reduce((duration,la)=>
			duration + team[0].reduce((count,menber)=>
				count + (menber.latent ? menber.latent.filter(l=>l==la.index).length : 0)
			,0) * la.value
		,0);

	}
	
	function leaderSkillMoveTime(ls)
	{
		let moveTime = {fixed:false,duration:0};
		const sk = ls.params;
		switch (ls.type)
		{
			case 178: //固定操作时间
				moveTime.fixed = true;
				moveTime.duration = sk[0];
				break;
			case 15: case 185:
				moveTime.duration += sk[0]/100;
				break;
			case 138: //调用其他队长技
				return sk.reduce((pmul,skid)=>{
					const subMoveTime = leaderSkillMoveTime(Skills[skid]);
					if (subMoveTime.fixed)
					{
						pmul.fixed = true;
						pmul.duration = subMoveTime.duration
					}else
					{
						pmul.duration += subMoveTime.duration;
					}
					return pmul;
				},moveTime);
			default:
		}
		return moveTime;
	}
	return moveTime;
}
//获取盾减伤比例
function getReduceScale(ls, allAttr = false, noHPneed = false, noProbability = false)
{
	const sk = ls.params;
	let scale = 0;
	switch (ls.type)
	{
		case 16: //无条件盾
			scale = sk[0]/100;
			break;
		case 17: //单属性盾
			scale = allAttr ? 0 : sk[1]/100;
			break;
		case 36: //2个属性盾
			scale = allAttr ? 0 : sk[2]/100;
			break;
		case 38: //血线下 + 可能几率
		case 43: //血线上 + 可能几率
			scale = (noHPneed || noProbability && sk[1] !== 100) ? 0 : sk[2]/100;
			break;
		case 129: //无条件盾，属性个数不固定
		case 163: //无条件盾，属性个数不固定
			scale = (allAttr && (sk[5] & 31) != 31) ? 0 : sk[6]/100;
			break;
		case 130: //血线下 + 属性个数不固定
		case 131: //血线上 + 属性个数不固定
			scale = (noHPneed || allAttr && (sk[5] & 31) != 31) ? 0 : sk[6]/100;
			break;
		case 151: //十字心触发
		case 169: //C触发
		case 198: //回血触发
			scale = sk[2]/100;
			break;
		case 170: //多色触发
		case 182: //长串触发
		case 193: //L触发
			scale = sk[3]/100;
			break;
		case 171: //多串触发
			scale = sk[6]/100;
			break;
		case 183: //又是个有两段血线的队长技
			scale = noHPneed ? 0 : sk[4]/100;
			break;

		case 138: //调用其他队长技
			scale = sk.reduce((pmul,skid)=> 1 - (1-pmul) * (1-getReduceScale(Skills[skid], allAttr, noHPneed)),0);
			break;
		default:
	}
	return scale || 0;
}