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

officialAPI.forEach(function(lang){
	console.log("正在读取官方 " + lang.code + " 信息");
	let json = fs.readFileSync("official-API/" + lang.code +".json", 'utf-8'); //使用同步读取
	let card = lang.cardOriginal = JSON.parse(json).card;//将字符串转换为json对象
	let monArray = lang.monArray = []; //储存输出内容

	for (let mi=0; mi<card.length && card[mi][0] == mi; mi++)//id不等于索引时，都是些怪物了
	{
		let m = card[mi];

		//名字对象
		let nameObj = {};
		nameObj[lang.code] = m[1];

		//因为觉醒数量的不一样，所以需要制定序号
		let awokenCountIdx = 58+m[57]*3; //awoken Count Index，觉醒数量的序号
		let superAwokenIdx = awokenCountIdx+1+m[awokenCountIdx]; //super awoken Index，超觉醒的序号

		//类型
		let type = [m[5]];
		if (m[6]!=-1) //第二个type
			type.push(m[6]);
		if (m[superAwokenIdx+3]!=-1) //第三个type
			type.push(m[superAwokenIdx+3]);

		let awokens = m.slice(awokenCountIdx+1,awokenCountIdx+1+m[awokenCountIdx]); //具体觉醒编号的数组

		let mon = {
			id:	m[0],
			name: nameObj,
			ppt: [m[2],m[3]], //属性property
			type: type,
			rare: m[7], //稀有度
			awoken: awokens, //觉醒
			maxLv: m[10],
			assist: (m[superAwokenIdx+7]>2 && [303,305,307,600,602].indexOf(m[0])<0)?1:0, //但是5种小企鹅是特殊情况
			ability: [ //三维
				[m[14],m[15]], //HP
				[m[17],m[18]], //ATK
				[m[20],m[21]], //RCV
			],
		}
		if (m[superAwokenIdx+9]>0) //如果可以110级
		{
			mon.a110 = m[superAwokenIdx+9];
			let superAwoken = //超觉醒
				m[superAwokenIdx].length>0
				? (m[superAwokenIdx].split(",").map(function(sa){return parseInt(sa);}))
				: null;
			if (superAwoken)
			{
				mon.sAwoken = superAwoken;
			}
		}
		monArray.push(mon);
	}

	//加入自定义的语言
	lang.customName.forEach(function(lcode){
		console.log("正在读取自定义 " + lcode + " 信息");
		let json = fs.readFileSync("custom/" + lcode +".json", 'utf-8'); //使用同步读取
		let ccard = JSON.parse(json);//将字符串转换为json对象
		ccard.forEach(function(cm,idx){ //每个文件内的名字循环
			let m = monArray[cm.id];
			if (m)
				m.name[lcode] = cm.name;
		});
	});
})

//比较两只怪物是否是同一只（在不同语言服务器）
function sameCard(m1,m2)
{
	//因为觉醒数量的不一样，所以需要制定序号
	//let awokenCountIdx1 = 58+m1[57]*3; //觉醒数量的序号
	//let superAwokenIdx1 = awokenCountIdx1+1+m1[awokenCountIdx1]; //超觉醒的序号
	//let awokenCountIdx2 = 58+m2[57]*3; //觉醒数量的序号
	//let superAwokenIdx2 = awokenCountIdx2+1+m2[awokenCountIdx2]; //超觉醒的序号

	let res = true;
	if (m1 == undefined || m2 == undefined) return false; //是否存在
	if (m1[2] != m2[2]) return false; //主属性
	if (m1[3] != m2[3]) return false; //副属性
	if (m1[5] != m2[5]) return false; //type1
	if (m1[6] != m2[6]) return false; //type2
	//if (m1[superAwokenIdx+3] != m2[superAwokenIdx+3]) return false; //type3
	if (m1[10] != m2[10]) return false; //最大等级
	return res;
}
//加入其他语言
for (let li = 0;li < officialAPI.length; li++)
{
	let otherLangs = officialAPI.concat(); //复制一份原始数组，储存其他语言
	let lang = otherLangs.splice(li,1)[0]; //删掉并取得当前的语言
	let monArray = lang.monArray; //储存输出内容

	for (let mi=0; mi<monArray.length; mi++)
	{
		let m = monArray[mi];

		//名字对象
		otherLangs.forEach(function(olang){
			let _m = olang.monArray[mi]; //获得这种语言的当前这个怪物数据
			if (_m,sameCard(m,_m)) //如果有这个怪物，且与原语言怪物是同一只
			{
				let oname = _m.name[olang.code];
				if (!/^\*+/.test(oname) //名字不是星号开头
					&& !/^\?+/.test(oname)) //名字不是问号开头
				{
					m.name = Object.assign(m.name, _m.name); //增加储存当前语言的全部
				}
			}
		})

	}
}

//最后批量保存
officialAPI.forEach(function(lang){
	let str = JSON.stringify(lang.monArray);
	fs.writeFile('./mon_'+lang.code+'.json',str,function(err){
		if(err){
			console.error(err);
		}
		console.log('mon_'+lang.code+'.json 导出成功');
	})
})