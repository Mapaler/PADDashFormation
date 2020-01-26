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
			};
		//添加header
		for (var header in GM_param.headers) {
			xhr.setRequestHeader(header, GM_param.headers[header]);
		}
		//发送数据
		xhr.send(GM_param.data ? GM_param.data : null);
	};
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
//计算所有队伍中有多少个该觉醒
function awokenCountInFormation(formationTeam,ak,solo)
{
	var allAwokenCount = formationTeam.reduce(function(fc,fm){
		return fc + awokenCountInTeam(fm,ak,solo);
	},0);
	return allAwokenCount;
}
//计算单个队伍中有多少个该觉醒
function awokenCountInTeam(team,awokenIndex,solo)
{
	var formationAwokenCount = team.reduce(function(tc,tm,isAssist){
		var teamAwokenCount = tm.reduce(function(c,m){
			const Card = Cards[m.id] || Cards[0];
			if (m.id<=0)
			{ //如果是特殊情况的
				return c;
			}
			const cdAwoken = Card.awakenings; //这个怪物的觉醒数据
			const cdSAwoken = Card.superAwakenings; //这个怪物的超觉醒数据
			if ((!cdAwoken && !cdSAwoken) || (isAssist && cdAwoken.indexOf(49)<0))
			{ //如果没有觉醒和超觉醒 || （如果是辅助队 &&第一个不是武器觉醒）
				return c;
			}
			//启用的觉醒数组片段
			const enableAwoken = cdAwoken.slice(0,m.awoken);
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
	},0);
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
//function calculateAbility(monid = 0, level = 1, plus = [0,0,0], awoken = 0, latent = [], weaponId = null, weaponAwoken = null, solo = true)
function calculateAbility(member = null, assist = null, solo = true)
{
	if (!member) return null;
	const monid = member.id || 0;
	const level = member.level || 1;
	const plus = member.plus || [0,0,0];
	const awoken = member.awoken || 0;
	const latent = member.latent || [];
	const sawoken = member.sawoken;
	const weaponId = assist ? assist.id : null;
	const weaponAwoken = assist ? assist.awoken : null;

	const card = Cards[monid]; //怪物数据
	if (monid == 0 || card == undefined || card.enabled == false) return null;

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
	var abilitys = [card.hp, card.atk, card.rcv].map((ab, idx)=>{
		const n_base = Math.round(curve(ab, card.maxLevel, card.limitBreakIncr)); //等级基础三维
		const n_plus = plus[idx] * plusAdd[idx]; //加值增加量
		let awokenList = card.awakenings.slice(0,awoken); //储存点亮的觉醒
		//单人时增加超觉醒
		if (solo && sawoken>=0)
		{
			awokenList = awokenList.concat(card.superAwakenings[sawoken]);
		}
		//如果有武器还要计算武器的觉醒
		if (weaponId>0)
		{
			const weaponCard = Cards[weaponId]; //武器数据
			if (weaponCard && weaponCard.enabled)
			{
				const weaponAwokenList = weaponCard.awakenings.slice(0,weaponAwoken); //储存武器点亮的觉醒
				if (weaponAwokenList.indexOf(49)>=0) //49是武器觉醒，确认已经点亮了武器觉醒
				{awokenList = awokenList.concat(weaponAwokenList);}
			}
		}
		//觉醒增加的数值
		const n_awoken = awoken ?
			Math.round(awokenAdd[idx].reduce(function(previous,aw){
					const awokenCount = awokenList.filter(function(a){return a==aw.index;}).length; //每个觉醒的数量
					return previous + aw.value * awokenCount; //那么多个觉醒的增加
				},0)) :
			0;
		//潜觉增加的倍率
		const n_latent = (latent && latent.length) ? 
			Math.round(latentScale[idx].reduce(function(previous,la){
					const latentCount = latent.filter(function(l){return l==la.index;}).length; //每个潜觉的数量
					return previous + n_base * la.scale * latentCount; //无加值与觉醒的基础值，乘以那么多个潜觉的增加倍数
				},0)) :
			0;
		//console.log("基础值：%d，加蛋值：%d，觉醒x%d增加：%d，潜觉增加：%d",n_base,n_plus,awokenCount,n_awoken,n_latent);
		let reValue = n_base + n_plus + n_awoken + n_latent;
		//协力觉醒的倍率
		reValue = Math.round(awokenScale[idx].reduce(function(previous,aw){
			const awokenCount = awokenList.filter(function(a){return a==aw.index;}).length; //每个协力觉醒的数量
			if (awokenCount>0)
			{
				return previous * aw.scale * awokenCount;
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
function searchCards(cards,attr1,attr2,fixMainColor,types,awokens,sawokens)
{
	let res = cards;
	if (attr1 != null && attr1 ===  attr2)
	{ //当两个颜色相同时，主副一样颜色的只需判断一次
		res = res.filter(c=>{return c.attrs[0] == attr1 && c.attrs[1] == attr1;});
	}else if (fixMainColor || attr2 == -1) //如果固定了顺序，或者副属性选的是无
	{
		if (attr1 != null)
		{
			res = res.filter(c=>{return c.attrs[0] == attr1;});
		}
		if (attr2 != null)
		{
			res = res.filter(c=>{return c.attrs[1] == attr2;});
		}
	}else //不限定顺序时
	{
		if (attr1 != null)
		{
			res = res.filter(c=>{return c.attrs.indexOf(attr1)>=0;});
		}
		if (attr2 != null)
		{
			res = res.filter(c=>{return c.attrs.indexOf(attr2)>=0;});
		}
	}
	if (types.length>0)
	{
		res = res.filter(c=>{return  types.some(t=>{return c.types.indexOf(t)>=0;});});
	}
	if (awokens.length>0)
	{
		res = res.filter(c=>{return  awokens.every(a=>{
			return c.awakenings.filter(ca=>{return ca == a.id;}).length >= a.num;
		});});
	}
	if (sawokens.length>0)
	{
		res = res.filter(c=>{return  sawokens.some(sa=>{return c.superAwakenings.indexOf(sa)>=0;});});
	}
	return res;
}
//产生一个怪物头像
function createCardA(id)
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
	str = str.replace("\n","<br>");
	str = str.replace(/\^(\w+)\^(.+)\^p/igm,'<span style="color:#$1;">$2</span>');
	return str;
}
//默认的技能解释的显示行为
function parseSkillDescription(skill)
{
	return descriptionToHTML(skill.description);
}