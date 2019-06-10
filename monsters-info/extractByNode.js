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

		var mArr = [];
		for (var mi=0;mi<msja.length;mi++)
		{
			var m = msja[mi],m2 = msen[mi];
			if (m[0] != mi) //id超了，都是些怪物了
			{
				break;
			}else
			{
				if (m2[0] != m[0]) //英文的会提前没有内容
				{
					m2 = null;
				}
				//类型'
				var type = [m[5]];
				if (m[6]!=-1) //第二个type
					type.push(m[6]);
				if (m[m.length-9]!=-1) //第三个type要倒着来
					type.push(m[m.length-9]);

				var awokenCIdx = 58+m[57]*3; //awoken Count Index
				var awoken = m.slice(awokenCIdx+1,awokenCIdx+1+m[awokenCIdx]);

				var mon = {
					id:	m[0],
					name: m[1],
					ename: (m2?m2[1]:""), //英文存在则储存英文名
					ppt: [m[2],m[3]], //属性property
					type: type,
					rare: m[7],
					awoken: awoken
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