var fs = require('fs');

console.log('正在读取日文怪物信息');
fs.readFile('./ja.json',function(err,data){
	if(err){
		return console.error(err);
	}
	var ja_json = data.toString();//将二进制的数据转换为字符串
	var ja = JSON.parse(ja_json);//将字符串转换为json对象
	var msja = ja.card;

	console.log('正在读取英文怪物信息');
	fs.readFile('./en.json',function(err,data){
		if(err){
			return console.error(err);
		}
		var en_json = data.toString();//将二进制的数据转换为字符串
		var en = JSON.parse(en_json);//将字符串转换为json对象
		var msen = en.card;

		console.log('正在读取韩文怪物信息');
		fs.readFile('./ko.json',function(err,data){
			if(err){
				return console.error(err);
			}
			var ko_json = data.toString();//将二进制的数据转换为字符串
			var ko = JSON.parse(ko_json);//将字符串转换为json对象
			var msko = ko.card;
	
			var mArr = [];
			for (var mi=0;mi<msja.length;mi++)
			{
				var m = msja[mi],m2 = msen[mi],m3 = msko[mi];
				if (m[0] != mi) //id超了，都是些怪物了
				{
					break;
				}else
				{
					if (m2[0] != m[0]){m2 = null;} //ID不一致时则没有内容
					if (m3[0] != m[0]){m3 = null;} //ID不一致时则没有内容

					//名字
					var nameObj = {
						ja:m[1],
						en:((m2 && !/^\*+/.test(m2[1]))?m2[1]:""), //没有数据，或者名字是星号都为空
						ko:((m3 && !/^\*+/.test(m3[1]))?m3[1]:""),
					}
					//类型
					var type = [m[5]];
					if (m[6]!=-1) //第二个type
						type.push(m[6]);
					if (m[m.length-9]!=-1) //第三个type要倒着来
						type.push(m[m.length-9]);
	
					var awokenCIdx = 58+m[57]*3; //awoken Count Index
					var awoken = m.slice(awokenCIdx+1,awokenCIdx+1+m[awokenCIdx]);
	
					var mon = {
						id:	m[0],
						name: nameObj,
						ppt: [m[2],m[3]], //属性property
						type: type,
						rare: m[7],
						awoken: awoken,
						maxLevel: m[m.length-3]>0?110:m[10],
						assist: (m[m.length-5]>2 && [303,305,307,600,602].indexOf(m[0])<0)?1:0, //但是5种小企鹅是特殊情况
					}
					mArr.push(mon);
				}
			}
			var str = JSON.stringify(mArr);
			fs.writeFile('./mon.json',str,function(err){
				if(err){
					console.error(err);
				}
				console.log('----------导出成功-------------');
			})
		})
	})
})