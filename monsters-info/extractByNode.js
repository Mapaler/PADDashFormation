const fs = require('fs');
var officialAPI = [ //来源于官方API
	{
		code:"ja",
		customName:["cht","chs"]
	},
	{
		code:"en",
		customName:[]
	},
	{
		code:"ko",
		customName:[]
	}
];

//分析卡片的函数,Code From https://github.com/kiootic/pad-rikuu
class Card{
    constructor(data){
		let card = this;
		card.attrs=[];
		card.types=[];
		let i = 0;
		function readCurve() {
			return {
				min: data[i++],
				max: data[i++],
				scale: data[i++],
			};
		}
		card.id = data[i++]; //ID
		card.name = data[i++]; //名字
		card.attrs.push(data[i++]); //属性1
		card.attrs.push(data[i++]); //属性2
		card.isUltEvo = data[i++] !== 0; //是否究极进化
		card.types.push(data[i++]); //类型1
		card.types.push(data[i++]); //类型2
		card.rarity = data[i++]; //星级
		card.cost = data[i++]; //cost
		card.unk01 = data[i++]; //未知01
		card.maxLevel = data[i++]; //最大等级
		card.feedExp = data[i++]; //1级喂食经验，需要除以4
		card.isEmpty = data[i++] === 1; //空卡片？
		card.sellPrice = data[i++]; //1级卖钱，需要除以10
		card.hp = readCurve(); //HP增长
		card.atk = readCurve(); //攻击增长
		card.rcv = readCurve(); //回复增长
		card.exp = { min: 0, max: data[i++], scale: data[i++] }; //经验增长
		card.activeSkillId = data[i++]; //主动技
		card.leaderSkillId = data[i++]; //队长技
		card.enemy = { //作为怪物的数值
			countdown: data[i++],
			hp: readCurve(),
			atk: readCurve(),
			def: readCurve(),
			maxLevel: data[i++],
			coin: data[i++],
			exp: data[i++]
		};
		card.evoBaseId = data[i++]; //进化基础ID
		card.evoMaterials = [data[i++], data[i++], data[i++], data[i++], data[i++]]; //进化素材
		card.unevoMaterials = [data[i++], data[i++], data[i++], data[i++], data[i++]]; //退化素材
		card.unk02 = data[i++]; //未知02
		card.unk03 = data[i++]; //未知03
		card.unk04 = data[i++]; //未知04
		card.unk05 = data[i++]; //未知05
		card.unk06 = data[i++]; //未知06
		card.unk07 = data[i++]; //未知07
		const numSkills = data[i++]; //几种敌人技能
		card.enemy.skills = Array.from(new Array(numSkills)).map(() => ({
			id: data[i++],
			ai: data[i++],
			rnd: data[i++]
		}));
		const numAwakening = data[i++]; //觉醒个数
		card.awakenings = Array.from(new Array(numAwakening)).map(() => data[i++]);
		const sAwakeningStr = data[i++];
		card.superAwakenings = (sAwakeningStr.length>0?sAwakeningStr.split(','):[]).map(Number); //超觉醒
		card.evoRootId = data[i++]; //进化链根ID
		card.seriesId = data[i++]; //系列ID
		card.types.push(data[i++]); //类型3
		card.sellMP = data[i++]; //卖多少MP
		card.latentAwakeningId = data[i++]; //潜在觉醒ID
		card.collabId = data[i++]; //合作ID
		const flags = data[i++]; //一个旗子？
		card.unk08 = flags; //未知08
		card.canAssist = (flags & 1) !== 0; //是否能当二技
		card.altName = data[i++]; //替换名字
		card.limitBreakIncr = data[i++]; //110级增长
		card.unk09 = data[i++]; //未知09
		card.blockSkinId = data[i++]; //珠子皮肤ID
		card.specialAttribute = data[i++]; //特别属性字符串，比如黄龙
		if (i !== data.length)
			console.log(`residue data for #${card.id}: ${i} ${data.length}`);
	}
}

//比较两只怪物是否是同一只（在不同语言服务器）
function sameCard(m1,m2)
{
	if (m1 == undefined || m2 == undefined) return false; //是否存在
	if (m1.attrs[0] != m2.attrs[0]) return false; //主属性
	if (m1.attrs[1] != m2.attrs[1]) return false; //副属性
	if (m1.types.length != m2.types.length) return false; //类型长度
	if (m1.types.some(function(t1,ti){
		return m2.types[ti] == undefined || m2.types[ti] != t1;
	})) return false; //全部类型有任意不同的时候也返回false
	if (m1.maxLevel != m2.maxLevel) return false; //最大等级
	if (m1.collabId != m2.collabId) return false; //合作ID
	return true;
}

/*
 * 正式流程
 */
officialAPI.forEach(function(lang){
	console.log("正在读取官方 " + lang.code + " 信息");
	let json = fs.readFileSync("official-API/" + lang.code +".json", 'utf-8'); //使用同步读取
	let oCards = lang.cardOriginal = JSON.parse(json).card;//将字符串转换为json对象


	let maxCardIndex = 0;
	while (oCards[maxCardIndex][0] == maxCardIndex)
	{
		maxCardIndex++;
	}
	let monCards = lang.cards = oCards
		.slice(0,maxCardIndex)  //切出前面id相等部分(id不等于索引时，都是敌人)
		.map((oc)=>{return new Card(oc)}); //每一项生成分析对象

	//加入自定义的语言
	lang.customName.forEach(function(lcode){
		console.log("正在读取自定义 " + lcode + " 信息");
		let json = fs.readFileSync("custom/" + lcode +".json", 'utf-8'); //使用同步读取
		let ccard = JSON.parse(json);//将字符串转换为json对象
		ccard.forEach(function(cm,idx){ //每个文件内的名字循环
			let m = monCards[cm.id];
			if (m)
			{
				if (!m.otLangName) //如果没有其他语言名称属性，则添加一个对象属性
					m.otLangName = {};
				m.otLangName[lcode] = cm.name;
			}
		});
	});
})

//加入其他服务器相同角色的名字
for (let li = 0;li < officialAPI.length; li++)
{
	let otherLangs = officialAPI.concat(); //复制一份原始数组，储存其他语言
	let lang = otherLangs.splice(li,1)[0]; //删掉并取得当前的语言
	let monCard = lang.cards //储存输出内容

	for (let mi=0; mi<monCard.length; mi++)
	{
		let m = monCard[mi];
		let name = m.name; //当前语言的名字

		//名字对象
		otherLangs.forEach(function(otLang){
			let _m = otLang.cards[mi]; //获得这种其他语言的当前这个怪物数据
			if (_m && sameCard(m,_m)) //如果有这个怪物，且与原语言怪物是同一只
			{
				let otName = _m.name; //另一个语言的名字
				if (!/^\*+/.test(name) && //名字不是星号开头
					!/^\*+/.test(otName) && //另一个语言名字不是星号开头
					!/^\?+/.test(name) && //名字不是问号开头
					!/^\?+/.test(otName) && //另一个语言名字不是问号开头
					!/^초월\s*\?+/.test(name) && //名字不是韩文的问号开头
					!/^초월\s*\?+/.test(otName) //另一个语言名字不是韩文的问号开头
				) //以上情况全符合才添加
				{
					if (!m.otLangName) //如果没有其他语言名称属性，则添加一个对象属性
						m.otLangName = {};
					m.otLangName[otLang.code] = otName;
					if (_m.otLangName)
						m.otLangName = Object.assign(m.otLangName, _m.otLangName); //增加储存当前语言的全部其他语言
				}
			}
		})

	}
}

//最后批量保存
officialAPI.forEach(function(lang){
	let lcode = lang.code;
	let str = JSON.stringify(lang.cards);
	fs.writeFile('./mon_'+lcode+'.json',str,function(err){
		if(err){
			console.error(err);
		}
		console.log('mon_'+lcode+'.json 导出成功');
	})
})