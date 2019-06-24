使用Fidder从游戏内抓包获得怪物信息  
Use Fidder to capture monster information from in-game capture  

目前的获取时间为
The current acquisition time is

| 语言 | 时间 | API |
| --- | --- | --- |
| 日语(ja) | 2019-6-21 15:00 | https://api-adrv2.padsv.gungho.jp/api.php?action=download_card_data |
| 英语(en) | 2019-6-21 14:00 | https://api-na-adrv2.padsv.gungho.jp/api.php?action=download_card_data |
| 韩语(ko) | 2019-6-21 14:00 | https://api-kr-adrv2.padsv.gungho.jp/api.php?action=download_card_data |

经研究后得出如下结论，JSON里数字指的数组下标。  
The following conclusions were drawn from the research. The number in JSON refers to the array subscript.(no translate)

* 0为id，一样的时候是可以获得的，之后的就是敌人怪物了。
* 1为名字
* 2为主属性，3为副属性，为-1的时候表示没有副属性。
* 4似乎是表示这个怪物是否可以究极退化
* 5是第一个类型，6是第二个，没有时为-1，第三个类型则是倒着数第9个，没有时为-1。
* 7是几星
* 8是cost
* 10是一般等级，倒着数第3个大于0时表示110级比99级增长多少属性。
* 57的值乘以3加58就是觉醒数量。后面则继续跟着数量对应的觉醒id。
* 倒数第8个是MP。
* 倒数第5个2不能绑，3能绑。

```js
function g(id)
{
	var m = data.card[id];
	var pn = ["火","水","木","光","暗"];
	var p1 = pn[m[2]]||"无",p2 = pn[m[3]]||"无";
	var tn = ["0进化","1平衡","2体力","3回复","4龙","5神","6攻击","7恶魔","8机械","9","10","11","12觉醒","13","14强化","15卖钱"];
	var type = [];
	type.push(tn[m[5]]);
	if (m[6]!=-1) //第二个type
		type.push(tn[m[6]]);
	if (m[m.length-9]!=-1) //第三个type要倒着来
		type.push(tn[m[m.length-9]]);
	console.log(m);
	console.log("编号：%d,名字：%s，属性：%s/%s，%s退化，类型：%s，%d星，COST：%d，%s个觉醒，110级增长%d%%，卖%d MP，%s当二技",m[0],m[1],p1,p2,m[4]?"可":"不可",type.join("|"),m[7],m[8],
	m[58+m[57]*3],m[m.length-3],m[m.length-8],m[m.length-5]>2?"能":"不能"
	);
}
```

`CHT.json`与`CHS.json`信息来源于战友网，见子项目 https://github.com/Mapaler/Download-pad.skyozora.com

运行`提取整合怪物信息.bat`   
Execute the following code in CMD
```bat
node.exe extractByNode.js
```
会将几种语言的信息提取到一个文件内  
Extract information from several languages into one file  
`mon.json`

运行`提取中文数据.bat`，将战友网页面内容抽出，再使用Win64版exe`opencc`来繁转简。