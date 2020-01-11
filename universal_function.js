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
}
//仿GM_xmlhttpRequest函数v1.3
if (typeof(GM_xmlhttpRequest) == "undefined") {
	var GM_xmlhttpRequest = function(GM_param) {
		var xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
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
			}
		//添加header
		for (var header in GM_param.headers) {
			xhr.setRequestHeader(header, GM_param.headers[header]);
		}
		//发送数据
		xhr.send(GM_param.data ? GM_param.data : null);
	}
}
//数字补前导0
function PrefixInteger(num, length)
{  
	return (Array(length).join('0') + num).slice(-length); 
}
//获取URL参数
function getQueryString(name,url) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var search = url || window.location.search.substr(1);
	var r = search.match(reg);
	if (r != null)
	{
		return decodeURIComponent(r[2]);
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
	var temp = [];
	var l = array.length;
	for(var i = 0; i < l; i++) {
		for(var j = i + 1; j < l; j++){
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
		return previous + (current>= 12?2:1);
	},0);
}
//计算队伍中有多少个该觉醒
function awokenCountInFormation(formationTeam,ak,solo)
{
	var allAwokenCount = formationTeam.reduce(function(fc,fm){
		return fc + awokenCountInTeam(fm,ak,solo);
	},0)
	return allAwokenCount;
}
//计算队伍中有多少个该觉醒
function awokenCountInTeam(team,awokenIndex,solo)
{
	var formationAwokenCount = team.reduce(function(tc,tm,isAssist){
		var teamAwokenCount = tm.reduce(function(c,m){
			let Card = Cards[m.id];
			if (m.id<=0)
			{ //如果是特殊情况的
				return c;
			}
			let cdAwoken = Card.awakenings; //这个怪物的觉醒数据
			let cdSAwoken = Card.superAwakenings; //这个怪物的超觉醒数据
			if ((!cdAwoken && !cdSAwoken) || (isAssist && cdAwoken.indexOf(49)<0))
			{ //如果没有觉醒和超觉醒 || （如果是辅助队 &&第一个不是武器觉醒）
				return c;
			}
			//启用的觉醒数组片段
			let enableAwoken = cdAwoken.slice(0,m.awoken);
			//相同的觉醒数
			let hasAwoken = enableAwoken.filter(function(a){return a == awokenIndex;}).length;
			//如果是单人，有超觉醒，且超觉醒id和计数的id相同
			if (solo && cdSAwoken && (cdSAwoken[m.sawoken] == awokenIndex))
			{
				hasAwoken++;
			}
			return c + hasAwoken;
		},0);
		return tc + teamAwokenCount;
	},0)
	return formationAwokenCount;
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
//计算怪物的能力
function calculateAbility(monid = 0,level = 1,plus = [0,0,0],awoken = 0,latent = [],weaponId,weaponAwoken)
{
	const card = Cards[monid]; //怪物数据
	if (monid == 0 || card == undefined) return null;

	//Code From pad-rikuu
	function valueAt(level, maxLevel, curve) {
		const f = maxLevel === 1 ? 1 : (level - 1) / (maxLevel - 1);
		return curve.min + (curve.max - curve.min) * Math.pow(f, curve.scale);
	}
	//Code From pad-rikuu
	function curve(c, maxLevel, limitBreakIncr) {
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
	const plusAdd = [10,5,3]; //加值的增加值
	const awokenAdd = [ //对应加三维觉醒的序号与增加值
		[{index:1,value:500},{index:65,value:-5000}],
		[{index:2,value:100},{index:66,value:-1000}],
		[{index:3,value:200},{index:67,value:-2000}]
	];
	const latentAdd = [ //对应加三维潜在觉醒的序号与增加比例
		[{index:1,scale:0.015},{index:12,scale:0.03},{index:25,scale:0.045}],
		[{index:2,scale:0.01},{index:12,scale:0.02},{index:26,scale:0.03}],
		[{index:3,scale:0.1},{index:12,scale:0.2},{index:27,scale:0.3}]
	];
	var abilitys = [card.hp, card.atk, card.rcv].map((ab, idx)=>{
		const n_base = Math.round(curve(ab, card.maxLevel, card.limitBreakIncr)); //等级基础三维
		const n_plus = plus[idx]*plusAdd[idx]; //加值增加量
		let awokenList = card.awakenings.slice(0,awoken); //储存点亮的觉醒
		if (weaponId>0) //如果有武器还要计算武器的觉醒
		{
			const weaponAwokenList = Cards[weaponId].awakenings.slice(0,weaponAwoken); //储存武器点亮的觉醒
			if (weaponAwokenList.indexOf(49)>=0) //49是武器觉醒，确认已经点亮了武器觉醒
			{awokenList = awokenList.concat(weaponAwokenList);}
		}
		const n_awoken = awoken //觉醒增加的数值
			?Math.round(awokenAdd[idx].reduce(function(previous,aw){
					const awokenCount = awokenList.filter(function(a){return a==aw.index;}).length; //每个潜觉的数量
					return previous + aw.value * awokenCount; //无加值与觉醒的基础值，乘以那么多个潜觉的增加倍数
				},0))
			:0;
		const n_latent = (latent && latent.length) //潜觉增加的数值
			?Math.round(latentAdd[idx].reduce(function(previous,la){
					const latentCount = latent.filter(function(l){return l==la.index;}).length; //每个潜觉的数量
					return previous + n_base * la.scale * latentCount; //无加值与觉醒的基础值，乘以那么多个潜觉的增加倍数
				},0))
			:0;
		//console.log("基础值：%d，加蛋值：%d，觉醒x%d增加：%d，潜觉增加：%d",n_base,n_plus,awokenCount,n_awoken,n_latent);
		let reValue = n_base + n_plus + n_awoken + n_latent;
		if (idx<2 && reValue<1) reValue = 1; //HP和ATK最低为1
		return reValue;
	})
	return abilitys;
}
function searchCards(cards,attr1,attr2,fixMainColor,types,awokens,sawokens)
{
	let res = cards;
	if (fixMainColor || attr2 == -1) //如果固定了顺序，或者副属性选的是无
	{
		if (attr1 != null)
		{
			res = res.filter(c=>{return c.attrs[0] == attr1;})
		}
		if (attr2 != null)
		{
			res = res.filter(c=>{return c.attrs[1] == attr2;})
		}
	}else
	{
		if (attr1 != null)
		{
			res = res.filter(c=>{return c.attrs.indexOf(attr1)>=0;})
		}
		if (attr2 != null)
		{
			res = res.filter(c=>{return c.attrs.indexOf(attr2)>=0;})
		}
	}
	if (types.length>0)
	{
		res = res.filter(c=>{return  types.some(t=>{return c.types.indexOf(t)>=0});})
	}
	if (awokens.length>0)
	{
		res = res.filter(c=>{return  awokens.every(a=>{
			return c.awakenings.filter(ca=>{return ca == a.id}).length >= a.num;
		});});
	}
	if (sawokens.length>0)
	{
		res = res.filter(c=>{return  sawokens.some(sa=>{return c.superAwakenings.indexOf(sa)>=0});})
	}
	return res;
}