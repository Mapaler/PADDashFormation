//类型允许的潜觉杀，前面的数字是官方数据的类型编号，后面的杀是自己做的图片中的潜觉序号
const type_allowable_latent = {
	"0":[], //0进化
	"12":[], //12觉醒
	"14":[], //14强化
	"15":[], //15卖钱
	"9":[],//特殊保护
	"1":[17,18,19,20,21,22,23,24], //1平衡
	"2":[20,24],//2体力
	"3":[18,22],//3回复
	"4":[20,24],//4龙
	"5":[19],//5神
	"6":[19,23],//6攻击
	"7":[17],//7恶魔
	"8":[17,20,21,24],//8机械
};
//等效觉醒列表
const equivalent_awoken = [
	{small:10,big:52,times:2}, //防封
	{small:11,big:68,times:5}, //防暗
	{small:12,big:69,times:5}, //防废
	{small:13,big:70,times:5}, //防毒
	{small:19,big:53,times:2}, //手指
	{small:21,big:56,times:2}, //SB
];
//仿GM_xmlhttpRequest函数v1.3
const GM_xmlhttpRequest = function(GM_param) {
	const xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
	xhr.open(GM_param.method, GM_param.url, true);
	if (GM_param.responseType) xhr.responseType = GM_param.responseType;
	if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
	xhr.onreadystatechange = function() //设置回调函数
		{
			if (xhr.readyState === xhr.DONE) { //请求完成时
				if (xhr.status === 200 && GM_param.onload) //正确加载时
				{
					GM_param.onload(xhr);
				}
				if (xhr.status !== 200 && GM_param.onerror) //发生错误时
				{
					GM_param.onerror(xhr);
				}
			}
		};
	//添加header
	for (let header in GM_param.headers) {
		xhr.setRequestHeader(header, GM_param.headers[header]);
	}
	//发送数据
	xhr.send(GM_param.data ? GM_param.data : null);
};

//数字补前导0
function PrefixInteger(num, length)
{  
	return (Array(length).join('0') + num).slice(-length); 
}
//获取URL参数
function getQueryString(name,url) {
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

//数组去重
/* https://www.cnblogs.com/baiyangyuanzi/p/6726258.html
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）*/
function uniq(array){
	let temp = [];
	const l = array.length;
	for(let i = 0; i < l; i++) {
		for(let j = i + 1; j < l; j++){
			if (array[i] === array[j]){
				i++;
				j = i;
			}
		}
		temp.push(array[i]);
	}
	return temp;
}
//计算用了多少潜觉格子
function usedHole(latent)
{
	return latent.reduce(function(previous,current){
		return previous + (current>= 12?2:1); //12号以后都是2格的潜觉
	},0);
}
//计算所有队伍中有多少个该觉醒
function awokenCountInFormation(formationTeams,awokenIndex,solo)
{
	const formationAwokenCount = formationTeams.reduce(function(previous,team){
		return previous + awokenCountInTeam(team,awokenIndex,solo);
	},0);
	return formationAwokenCount;
}
//计算单个队伍中有多少个该觉醒
function awokenCountInTeam(team,awokenIndex,solo)
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
		if (solo) //单人增加超觉醒
		{
			enableAwoken = enableAwoken.concat(card.superAwakenings[mon.sawoken]);
		}
		if (assistCard && assistCard.enabled && assistCard.awakenings.indexOf(49)>=0)
		{ //如果卡片未启用
			enableAwoken = enableAwoken.concat(assistCard.awakenings);
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
	let monNameArr = lsList.map(function(lc){ //取出每种语言
		if (lc == defaultCode)
		{return card.name;}
		else if(card.otLangName)
		{return card.otLangName[lc];}
	}).filter(function(ln){ //去掉空值和问号
		return (ln?(ln.length>0):false) && !/^(?:초월\s*)?\?+/.test(ln);
	});

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
function curve(c, level, maxLevel, limitBreakIncr) {
	let value = valueAt(level, maxLevel, {
		min: c.min,
		max: c.max || (c.min * maxLevel),
		scale: c.scale || 1
	});

	if (level > maxLevel) {
	const exceed = level - maxLevel;
	value += c.max ? (c.max * (limitBreakIncr / 100) * (exceed / 11)) : c.min * exceed;
	}
	return value;
}
//计算怪物的经验值
function calculateExp(member)
{
	if (!member) return null;
	const memberCard = Cards[member.id];
	if (!memberCard || memberCard.id == 0 || !memberCard.enabled) return null;
	const v99Exp = valueAt(member.level, 99, memberCard.exp);
	const v110Exp = member.level > 99 ? Math.max(0, member.level - memberCard.maxLevel - 1) * 5000000 : 0;
	return [Math.round(v99Exp),v110Exp];
}
//计算怪物的能力
//function calculateAbility(monid = 0, level = 1, plus = [0,0,0], awoken = 0, latent = [], weaponId = null, weaponAwoken = null, solo = true)
function calculateAbility(member = null, assist = null, solo = true)
{
	if (!member) return null;
	/*
	const monid = member.id || 0;
	const level = member.level || 1;
	const plus = member.plus || [0,0,0];
	const awoken = member.awoken || 0;
	const latent = member.latent || [];
	const sawoken = member.sawoken;
	const weaponId = assist ? assist.id : null;
	const weaponAwoken = assist ? assist.awoken : null;
	const card = Cards[monid]; //怪物数据
*/
	const memberCard = Cards[member.id];
	const assistCard = assist ? Cards[assist.id] : null;
	if (!memberCard || memberCard.id == 0 || !memberCard.enabled) return null;

	const bonusScale = [0.1,0.05,0.15]; //辅助宠物附加的属性倍率
	const plusAdd = [10,5,3]; //加值的增加值
	const awokenAdd = [ //对应加三维觉醒的序号与增加值
		[{index:1,value:500},{index:65,value:-5000}], //HP
		[{index:2,value:100},{index:66,value:-1000}], //ATK
		[{index:3,value:200},{index:67,value:-2000}]  //RCV
	];
	const awokenScale = [ //对应比例加三维觉醒的序号与倍率值
		[], //HP
		[], //ATK
		[]  //RCV
	];
	if (!solo)
	{ //协力时计算协力觉醒
		awokenScale.forEach(ab=>{
			ab.push({index:30,scale:1.5});
		});
	}
	const latentScale = [ //对应加三维潜在觉醒的序号与增加比例
		[{index:1,scale:0.015},{index:12,scale:0.03},{index:25,scale:0.045}], //HP
		[{index:2,scale:0.01},{index:12,scale:0.02},{index:26,scale:0.03}], //ATK
		[{index:3,scale:0.1},{index:12,scale:0.2},{index:27,scale:0.3}]  //RCV
	];
	const memberCurves = [memberCard.hp, memberCard.atk, memberCard.rcv];
	const assistCurves = assistCard ? [assistCard.hp, assistCard.atk, assistCard.rcv] : null;

	let abilitys = memberCurves.map((ab, idx)=>{
		const n_base = Math.round(curve(ab, member.level, memberCard.maxLevel, memberCard.limitBreakIncr)); //等级基础三维
		const n_plus = member.plus[idx] * plusAdd[idx]; //加值增加量
		let n_assist_base = 0,n_assist_plus=0; //辅助的bonus
		let awokenList = memberCard.awakenings.slice(0,member.awoken); //储存点亮的觉醒
		//单人时增加超觉醒
		if (solo && member.sawoken>=0)
		{
			awokenList = awokenList.concat(memberCard.superAwakenings[member.sawoken]);
		}
		//如果有武器还要计算武器的觉醒
		if (assistCard && assistCard.id > 0 && assistCard.enabled)
		{
			const assistAwokenList = assistCard.awakenings.slice(0, assist.awoken); //储存武器点亮的觉醒
			if (assistAwokenList.indexOf(49)>=0) //49是武器觉醒，确认已经点亮了武器觉醒
			{
				awokenList = awokenList.concat(assistAwokenList);
			}
			if (memberCard.attrs[0] === assistCard.attrs[0])
			{
				n_assist_base = Math.round(curve(assistCurves[idx], assist.level, assistCard.maxLevel, assistCard.limitBreakIncr)); //辅助等级基础三维
				n_assist_plus = assist.plus[idx] * plusAdd[idx]; //辅助加值增加量
			}
		}
		//觉醒增加的数值
		const n_awoken = awokenList.length>0 ?
			Math.round(awokenAdd[idx].reduce(function(previous,aw){
					const awokenCount = awokenList.filter(function(a){return a==aw.index;}).length; //每个觉醒的数量
					if (awokenCount>0)
						return previous + aw.value * awokenCount;
					else
						return previous;
				},0)) :
			0;
		//潜觉增加的倍率
		const n_latent = (member.latent && member.latent.length>0) ? 
			Math.round(latentScale[idx].reduce(function(previous,la){
					const latentCount = member.latent.filter(function(l){return l==la.index;}).length; //每个潜觉的数量
					return previous + n_base * la.scale * latentCount; //无加值与觉醒的基础值，乘以那么多个潜觉的增加倍数
				},0)) :
			0;
		//console.log("基础值：%d，加蛋值：%d，觉醒x%d增加：%d，潜觉增加：%d",n_base,n_plus,awokenCount,n_awoken,n_latent);
		let reValue = n_base + n_plus + n_awoken + n_latent + (n_assist_base + n_assist_plus) * bonusScale[idx];

		//协力觉醒的倍率
		reValue = Math.round(awokenScale[idx].reduce(function(previous,aw){
			const awokenCount = awokenList.filter(function(a){return a==aw.index;}).length; //每个协力觉醒的数量
			if (awokenCount>0)
			{
				return previous * Math.pow(aw.scale,awokenCount);
			}
			else
			{
				return previous;
			}
		},reValue));

		if (idx<2 && reValue<1) reValue = 1; //HP和ATK最低为1
		return reValue;
	});
	return abilitys;
}
//搜索卡片用
function searchCards(cards,attr1,attr2,fixMainColor,types,awokens,sawokens,equalAk,incSawoken)
{
	let cardsRange = cards;
	//属性
	if (attr1 != null && attr1 ===  attr2)
	{ //当两个颜色相同时，主副一样颜色的只需判断一次
		cardsRange = cardsRange.filter(c=>c.attrs[0] == attr1 && c.attrs[1] == attr1);
	}else if (fixMainColor || attr2 == -1) //如果固定了顺序，或者副属性选的是无
	{
		if (attr1 != null)
		{
			cardsRange = cardsRange.filter(c=>c.attrs[0] == attr1);
		}
		if (attr2 != null)
		{
			cardsRange = cardsRange.filter(c=>c.attrs[1] == attr2);
		}
	}else //不限定顺序时
	{
		if (attr1 != null)
		{
			cardsRange = cardsRange.filter(c=>c.attrs.indexOf(attr1)>=0);
		}
		if (attr2 != null)
		{
			cardsRange = cardsRange.filter(c=>c.attrs.indexOf(attr2)>=0);
		}
	}
	//类型
	if (types.length>0)
	{
		cardsRange = cardsRange.filter(c=>types.some(t=>c.types.indexOf(t)>=0));
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

			return cardAwakeningsArray.some(cardAwakening=>{ //重复每种包含超觉醒的觉醒数组，只要有一组符合要求就行
				return awokens.every(ak=>{ //判断需要搜索的觉醒是不是全都在觉醒数组里
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
				});
			});
		});
	}

	//超觉醒
	if (sawokens.length>0 && !incSawoken)
	{
		cardsRange = cardsRange.filter(card=>{return sawokens.some(sak=>{
			const equivalentAwoken = equivalent_awoken.find(eak => eak.small === sak);
			return card.superAwakenings.indexOf(sak)>=0 || 
				   equalAk && equivalentAwoken && card.superAwakenings.indexOf(equivalentAwoken.big)>=0; //如果开启等效觉醒
		});});
	}
	return cardsRange;
}
//产生一个怪物头像
function createCardA()
{
	const cdom = document.createElement("a");
	cdom.class = "monster";
	cdom.target = "_blank";
	const property = cdom.appendChild(document.createElement("div"));
	property.className = "property";
	const subproperty = cdom.appendChild(document.createElement("div"));
	subproperty.className = "subproperty";
	const cid = cdom.appendChild(document.createElement("div"));
	cid.className = "id";
	return cdom;
}
//将怪物的文字介绍解析为HTML
function descriptionToHTML(str)
{
	str = str.replace(/\n/ig,"<br>"); //换行
	str = str.replace(/\^([a-fA-F0-9]{6})\^([^\^]+)\^p/igm,'<span style="color:#$1;">$2</span>'); //文字颜色
	str = str.replace(/\%\{m([0-9]{1,4})\}/g,function (str, p1, offset, s){return cardN(parseInt(p1,10));}); //怪物头像
	return str;
}
//返回怪物名
function cardN(id){
	let card = Cards[id || 0];
	if (!card)
	{
		return "没有该宠物 " + id;
	}else
	{
		const monOuterDom = document.createElement("span");
		monOuterDom.className = "detail-mon";
		const monDom = createCardA(id);
		monOuterDom.appendChild(monDom);
		changeid({id:id},monDom);
		return monOuterDom.outerHTML;
	}
}
//默认的技能解释的显示行为
function parseSkillDescription(skill)
{
	return descriptionToHTML(skill.description);
}
//大数字缩短长度，默认返回本地定义字符串
function parseBigNumber(number)
{
	/*	//千位分隔符
	const res=number.toString().replace(/\d+/, function(n){ // 先提取整数部分
		return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
			return $1+",";
		});
	})
	*/
	return number.toLocaleString();
}