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
for (var mi=0;mi<mainCard.length;mi++)
{
	var m = mainCard[mi];
	if (m[0] != mi) //id超了，都是些怪物了
	{
		break;
	}else
	{
		//名字
		var nameObj = {};
		officialAPI.forEach(function(code,idx){
			var _m = cards[idx][mi];
			if (_m && !/^\*+/.test(_m[1])) //没有数据，或者名字是星号，则为空
				nameObj[code] = _m[1];
		})

		//类型
		var type = [m[5]];
		if (m[6]!=-1) //第二个type
			type.push(m[6]);
		if (m[m.length-9]!=-1) //第三个type要倒着来
			type.push(m[m.length-9]);

		var awokenCIdx = 58+m[57]*3; //awoken Count Index
		var awoken = m.slice(awokenCIdx+1,awokenCIdx+1+m[awokenCIdx]);
		var superAwoken = m[awokenCIdx+1+m[awokenCIdx]].length>0?(m[awokenCIdx+1+m[awokenCIdx]].split(",").map(function(ns){return parseInt(ns);})):null; //超觉醒

		var mon = {
			id:	m[0],
			name: nameObj,
			ppt: [m[2],m[3]], //属性property
			type: type,
			rare: m[7],
			awoken: awoken,
			maxLv: m[m.length-3]>0?110:m[10],
			assist: (m[m.length-5]>2 && [303,305,307,600,602].indexOf(m[0])<0)?1:0, //但是5种小企鹅是特殊情况
		}
		if (mon.maxLv>99 && superAwoken)
		{
			mon.sAwoken = superAwoken;
		}
		mArr.push(mon);
	}
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