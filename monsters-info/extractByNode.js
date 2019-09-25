var fs = require('fs');
var officialAPI = ["ja","en","ko"]; //来源于官方API
var custom = ["cht","chs"]; //来源于自定义文件

var cards = officialAPI.map(function(code){
	console.log("正在读取官方 " + code + " 信息");
	var json = fs.readFileSync("official-API/" + code +".json", 'utf-8'); //使用同步读取
	var card = JSON.parse(json).card;//将字符串转换为json对象
	return card;
})

var mainCard = cards[0]; //数据的主要card
var mArr = []; //储存输出内容

var maxLength = cards.map(function(card){ //获取最大怪物id
	var length = card.length;
	for (var mi=0;mi<card.length;mi++)
	{
		if (card[mi][0] != mi) //id超了，都是些怪物了
		{
			length = mi;
			break;
		}
	}
	return length;
}).sort(function(a,b){return b-a;})[0];

for (var mi=0;mi<maxLength;mi++)
{
	var m = mainCard[mi]; //预设默认的数据

	//名字对象
	var nameObj = {};
	officialAPI.forEach(function(code,idx){
		var _m = cards[idx][mi];
		if (_m[0] == mi) //如果id是一致的才添加，否则是怪物，不添加
		{
			if (_m && !/^\*+/.test(_m[1])) //没有数据，或者名字是星号，则为空
			{
				nameObj[code] = _m[1]; //储存当前语言，问号也存
				if (m[0] != mi || /^\?+/.test(m[1])) //如果日服没有基础数据，或日服是问号而后面的有内容，则使用后面服的数据
				{
					m = _m;
				}
			}
		}
	})

	//因为觉醒数量的不一样，所以需要制定序号
	var awokenCIdx = 58+m[57]*3; //awoken Count Index，觉醒数量的序号
	var superAwokenIdx = awokenCIdx+1+m[awokenCIdx]; //super awoken Index，超觉醒的序号

	//类型
	var type = [m[5]];
	if (m[6]!=-1) //第二个type
		type.push(m[6]);
	if (m[superAwokenIdx+3]!=-1) //第三个type要倒着来
		type.push(m[superAwokenIdx+3]);

	var awoken = m.slice(awokenCIdx+1,awokenCIdx+1+m[awokenCIdx]); //具体觉醒编号的数组

	var mon = {
		id:	m[0],
		name: nameObj,
		ppt: [m[2],m[3]], //属性property
		type: type,
		rare: m[7], //稀有度
		awoken: awoken, //觉醒
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
		var superAwoken = //超觉醒
			m[superAwokenIdx].length>0
			? (m[superAwokenIdx].split(",").map(function(sa){return parseInt(sa);}))
			: null;
		if (superAwoken)
		{
			mon.sAwoken = superAwoken;
		}
	}
	mArr.push(mon);
}

var cards_c = custom.map(function(code){
	console.log("正在读取自定义 " + code + " 信息");
	var json = fs.readFileSync("custom/" + code +".json", 'utf-8'); //使用同步读取
	var card = JSON.parse(json);//将字符串转换为json对象
	return card;
})

cards_c.forEach(function(card,cidx){ //每个文件循环
	card.forEach(function(cm,idx){ //每个文件内的名字循环
		var m = mArr[cm.id];
		m.name[custom[cidx]] = cm.name;
	});
});

var str = JSON.stringify(mArr);
fs.writeFile('./mon.json',str,function(err){
	if(err){
		console.error(err);
	}
	console.log('----------导出成功-------------');
})