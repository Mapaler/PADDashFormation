document.title = `智龙迷城${teamsCount}人队伍图制作工具`;

//查找原先完整技能
function findFullSkill(subSkill){
	let search = Skills.filter(ss=>{return (ss.type == 116 || ss.type == 118 || ss.type == 138) && ss.params.indexOf(subSkill.id)>=0;});
	if(search.length)
		{return [search[0],subSkill];}
	else
		{return subSkill;}
}
//document.querySelector(".edit-box .row-mon-id .m-id").type = "number";
//Skills.filter(s=>{const sk = s.params; return s.type == 156;}).map(findFullSkill)

//高级技能解释
function parseSkillDescription(skill)
{
	const id = skill.id;
	if (id == 0) return "";
	const type = skill.type;
	const sk = skill.params;
	
	//珠子名和属性名数组
	const attrsName = ["火","水","木","光","暗","回复","废","毒","剧毒","炸弹"];
	//类型名数组
	const typeName = ["进化","平衡","体力","回复","龙","神","攻击","恶魔","机械","特别保护","10","11","觉醒","13","强化","卖钱"];
	//觉醒名数组
	const awokenName = ["HP+","攻击+","回复+","火盾","水盾","木盾","光盾","暗盾","自回","防封","防暗","防废","防毒","火+","水+","木+","光+","暗+","手指","心解","SB","火横","水横","木横","光横","暗横","U","SX","心+","协力","龙杀","神杀","恶魔杀","机杀","平衡杀","攻击杀","体力杀","回复杀","进化杀","觉醒杀","强化杀","卖钱杀","7c","5色破防","心追","全体 HP ","全体回复","破无效","武器觉醒","方块心追","5色溜","大防封","大手指","防云","防封条","大SB","满血强化","下半血强化","L盾","L解锁","10c","c珠","语音","奖励增加"," HP -","攻击-","回复-","大防暗","大防废","大防毒","掉废","掉毒"];
	const ClumsN = ["左边第1竖列","左边第2竖列","左边第3竖列","右边第3竖列","右边第2竖列","右边第1竖列"];
	const RowsN = ["最上1横行","上方第2横行","中间横行","下方第2横行","最下1横行"];
	//返回属性名
	function attrN(i){return attrsName[i || 0] || ("未知属性" + i);}
	//返回类型名
	function typeN(i){return typeName[i || 0] || ("未知类型" + i);}
	//返回觉醒名
	function awokenN(i){return awokenName[(i || 0)-1] || ("未知觉醒" + i);}
	//从二进制的数字中获得布尔值数组
	function getBooleanFromBinary(num,reverse=true)
	{	/*num是输入的数字，2的N次方在2进制下表示1后面跟着N个0。
		如果num和2的N次方同时存在某位1，则返回这个数，逻辑上转换为true。*/
		let arr = num.toString(2).split("").map(c=>{return parseInt(c);});
		if (reverse) arr.reverse();
		return arr;
	}
	//返回flag里值为true的数组，如[1,4,7]
	function flags(num){
		return Array.from(new Array(32)).map((a,i)=>{return i;}).filter(i => num & (1 << i));
	}
	//从二进制的数字中获得有哪些内容
	function getNamesFromBinary(num,dataArr)
	{	/*num是输入的数字，2的N次方在2进制下表示1后面跟着N个0。
		如果num和2的N次方同时存在某位1，则返回这个数，逻辑上转换为true。
		filter就可以返回所有有这个数的数据*/
		/*以珠子名称为例，num是输入的数字，比如10进制465转二进制=>111010001。
		二进制数从低位到高位表示火水木光暗……
		用逻辑运算AND序号来获得有没有这个值*/
		var results = dataArr.filter(function(pn,pi){
			return num & Math.pow(2,pi); //Math.pow(x,y)计算以x为底的y次方值
		});
		return results;
	}
	const nb = getNamesFromBinary; //化简名称

	function getAttrTypeString(attrsArray = [],typesArray = [])
	{
		let outArr = [];
		if (attrsArray && attrsArray.indexOf(0)>=0 &&
			attrsArray.indexOf(1)>=0 &&
			attrsArray.indexOf(2)>=0 &&
			attrsArray.indexOf(3)>=0 &&
			attrsArray.indexOf(4)>=0)
		{
			return "所有属性";
		}
		if (attrsArray && attrsArray.length)
		{
			outArr.push(attrsArray.map(attrN).join("、") + "属性");
		}
		if (typesArray && typesArray.length)
		{
			outArr.push(typesArray.map(typeN).join("、") + "类型");
		}
		return outArr.join("和");
	}
	function getOrbsAttrString(orbFlag)
	{
		let outStr = ``;
		if (orbFlag == 1023) //1023-1111111111
		{ //单纯5色
			outStr += '任何';
		}else if (orbFlag == 31) //31-11111
		{ //单纯5色
			outStr += '5色';
		}else if((orbFlag & 31) == 31)
		{ //5色加其他色
			outStr += `5色+${nb(orbFlag ^ 31, attrsName).join("、")}`;
		}else
		{
			outStr += `${nb(orbFlag, attrsName).join("、")}`;
		}
		return outStr;
	}
	function stats(value, statTypes)
	{
		return [
			statTypes.indexOf(1) >= 0 ? value : 100, //攻击
			statTypes.indexOf(2) >= 0 ? value : 100  //回复
		];
	}
	const mulName = ["HP","攻击力","回复力"];
	//获取固定的三维成长的名称
	function getFixedHpAtkRcvString(values)
	{
		let mulArr = null;
		if (Array.isArray(values)) {
			mulArr = [
				1,
				values[0] / 100,
				values[1] / 100,
			];
		} else
		{
			mulArr = [
				(values.hp || 100) / 100,
				(values.atk || 100) / 100,
				(values.rcv || 100) / 100
			];
		}
		const hasMul = mulArr.filter(m=>{return m != 1;}); //不是1的数值
		let str = "";
		if (hasMul.length>0)
		{
			const hasDiff = hasMul.filter(m=>{return m != hasMul[0];}).length > 0; //存在不一样的值
			if (hasDiff)
			{
				str += mulArr.map((m,i)=>{
					return (m>0 && m!=1)?(mulName[i]+(m>=1?`×${m}倍`:`变为${m*100}%`)):null;
				}).filter(s=>{return s!=null;}).join("，");
			}else
			{
				let hasMulName = mulName.filter((n,i)=>{return mulArr[i] != 1;});
				if (hasMulName.length>=3)
				{
					str+=hasMulName.slice(0,hasMulName.length-1).join("、") + "和" + hasMulName[hasMulName.length-1];
				}else
				{
					str+=hasMulName.join("和");
				}
				str += hasMul[0]>=1?`×${hasMul[0]}倍`:`变为${hasMul[0]*100}%`;
			}
		}else
		{
			str += "能力值没有变化";
		}
		return str;
	}
	const mul = getFixedHpAtkRcvString;
	function getScaleAtkRcvString(ATK,RCV)
	{
		//{base,min,max,bonus}
		//if (tyof(HP) == "number")
	}

	let str = null;
	let strArr = null,fullColor = null,atSameTime = null,hasDiffOrbs = null;
	switch(type)
	{
		case 0:
			str = `对敌方全体造成自身攻击力×${sk[1]/100}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 1:
			str = `对敌方全体造成${sk[1]}的${attrN(sk[0])}属性攻击`;
			break;
		case 2:
			str = `对敌方1体造成自身攻击力×${sk[0]/100}倍的伤害`;
			break;
		case 3:
			str = `${sk[0]}回合内，受到的伤害减少${sk[1]}%`;
			break;
		case 4:
			str = `使敌方全体中毒，每回合损失宠物自身攻击力×${sk[0]/100}倍的 HP `;
			break;
		case 5:
			str = `${sk[0]}秒内时间停止，可以任意移动宝珠`;
			break;
		case 6:
			str = `敌人的 HP 减少${sk[0]}%`;
			break;
		case 7:
			str = `回复宠物自身回复力×${sk[0]/100}倍的 HP`;
			break;
		case 8:
			str = `回复${sk[0]} HP `;
			break;
		case 9:
			str = `${attrN(sk[0])}宝珠变为${attrN(sk[1])}宝珠`;
			break;
		case 10:
			str = `全版刷新`;
			break;
		case 11:
			str = `${attrN(sk[0])}属性宠物的攻击力×${sk[1]/100}倍`;
			break;
		case 12:
			str = `消除宝珠的回合，以自身攻击力×${sk[0]/100}倍的伤害追打敌人`;
			break;
		case 13:
			str = `消除宝珠的回合，回复自身回复力×${sk[0]/100}倍的 HP `;
			break;
		case 14:
			str = `如当前 HP 在 HP 上限的${sk[0]}%以上的话，受到单一次致命攻击时，${sk[1]<100?`有${sk[1]}的几率`:"将"}会以1点 HP 生还`;
			break;
		case 15:
			str = `操作时间延长${sk[0]>0?`延长`:`减少`}${Math.abs(sk[0]/100)}秒`;
			break;
		case 16:
			str = `受到的所有伤害减少${sk[0]}%`;
			break;
		case 17:
			str = `受到的${attrN(sk[0])}属性伤害减少${sk[1]}%`;
			break;
		case 18:
			str = `将敌人的攻击延迟${sk[0]}回合`;
			break;
		case 19:
			str = `${sk[0]}回合内敌方防御力减少${sk[1]}%`;
			break;
		case 20: //单色A转B，C转D
			strArr = [];
			if (sk.length>=3 && sk.length<=4 && sk[1] == (sk[3]))
			{
				str = `${attrN(sk[0])}、${attrN(sk[2])}宝珠变为${attrN(sk[1])}`;
			}else
			{
				for (let ai=0;ai<sk.length;ai+=2)
				{
					strArr.push(`${attrN(sk[ai])}宝珠变为${attrN(sk[ai+1])}`);
				}
				str = strArr.join("，");
			}
			break;
		case 21:
			str = `${sk[0]}回合内${attrN(sk[1])}属性的伤害减少${sk[2]}%`;
			break;
		case 22: case 31:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 23: case 30:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的 HP ×${sk[sk.length-1]/100}倍`;
			break;
		case 24:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 28:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 29: case 114:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的 HP、攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 33:
			str = `宝珠移动和消除的声音变成太鼓达人的音效`;
			break;
		case 35:
			str = `对敌方1体造成自身攻击力×${sk[0]/100}倍的伤害，并回复${sk[1]}%的 HP`;
			break;
		case 36:
			str = `受到的${attrN(sk[0])}属性${sk[1]>=0?`和${attrN(sk[1])}属性`:""}的伤害减少${sk[2]}%`;
			break;
		case 37:
			str = `对敌方1体造成自身攻击力×${sk[1]/100}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 38:
			str = `HP ${sk[0] == 100?"全满":`${sk[0]}%以下`}时${sk[1]<100?`有${sk[1]}的几率使`:""}受到的伤害减少${sk[2]}`;
			if (sk[1]!=100) str+=`未知的 参数1 ${sk[1]}`;
			break;
		case 39:
			strArr = [sk[1],sk[2]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以下`}时所有宠物的${strArr.join("和")}×${sk[3]/100}倍`;
			break;
		case 40:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 41:
			str = `受到敌人攻击时${sk[0]==100?"":`有${sk[0]}的几率`}进行受到伤害${sk[1]/100}倍的${attrN(sk[2])}属性反击`;
			break;
		case 42:
			str = `对${attrN(sk[0])}属性敌人造成${sk[2]}点${attrN(sk[1])}属性伤害`;
			break;
		case 43:
			str = `HP ${sk[0]==100 ?"全满":`${sk[0]}%以上`}时${sk[1]<100?`有${sk[1]}的几率使`:""}受到的伤害减少${sk[2]}`;
			break;
		case 44:
			strArr = [sk[1],sk[2]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时所有宠物的${strArr.join("和")}×${sk[3]/100}倍`;
			break;
		case 45: case 111:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的 HP 和攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 46:case 48:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的 HP ${sk[sk.length-1]/100}倍`;
			break;
		//case 48:见上
		case 49:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 50:
			str = `${sk[0]}回合内${(sk[1]==5?"回复力":`${attrN(sk[1])}属性的攻击力`)}${sk[2]>0?`×${sk[2]/100}倍`:"变为0"}`;
			break;
		case 51:
			str = `${sk[0]}回合内，所有攻击转为全体攻击`;
			break;
		case 52:
			str = `${attrN(sk[0])}宝珠强化（每颗强化珠伤害/回复增加${sk[1]}%）`;
			break;
		case 53:
			str = `进入地下城时为队长的话，掉落率×${sk[0]/100}倍（协力时无效）`;
			break;
		case 54:
			str = `进入地下城时为队长的话，获得的金币×${sk[0]/100}倍`;
			break;
		case 55:
			str = `对敌方1体造成${sk[0]}点无视防御的固定伤害`;
			break;
		case 56:
			str = `对敌方全体造成${sk[0]}点无视防御的固定伤害`;
			break;
		case 58:
			str = `对敌方全体造成自身攻击力×${sk[1]==sk[2]?sk[1]/100:`${sk[1]/100}~${sk[2]/100}`}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 59:
			str = `对敌方1体造成自身攻击力×${sk[1]==sk[2]?sk[1]/100:`${sk[1]/100}~${sk[2]/100}`}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 60:
			str = `${sk[0]}回合内，受到伤害时进行受到伤害${sk[1]/100+"倍的"+attrN(sk[2])}属性反击`;
			break;
		case 61:
			fullColor = nb(sk[0], attrsName);
			atSameTime = fullColor.length == sk[1];
			if (sk[0] == 31) //31-11111
			{ //单纯5色
				str = '';
			}else if((sk[0] & 31) == 31)
			{ //5色加其他色
				str = `5色+${nb(sk[0] ^ 31, attrsName).join("、")}`;
				if (!atSameTime) str+="中";
			}else
			{
				str = `${fullColor.join("、")}`;
				if (!atSameTime) str+="中";
			}
			if (!atSameTime) str+=`${sk[1]}种属性以上`;
			else if(sk[0] == 31) str += `5色`;
			str += `同时攻击时，所有宠物的攻击力×${sk[2]/100}倍`;
			if (sk[3])
			{str += `，每多一种属性+${sk[3]/100}倍，最大${fullColor.length}种时${(sk[2]+sk[3]*(fullColor.length-sk[1]))/100}倍`;}
			break;
		case 62: case 77:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的 HP 和攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 63:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的 HP 和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 64: case 79:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 65:
			str = `${sk.slice(0,sk.length-1).map(t=>{return typeN(t);}).join("、")}类型宠物的 HP、攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 66:
			str = `${sk[0]}连击以上所有宠物的攻击力${sk[1]/100}倍`;
			break;
		case 67:
			str = `${sk.slice(0,sk.length-1).map(t=>{return attrN(t);}).join("、")}属性宠物的 HP 和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 69:
			str = `${attrN(sk[0])}属性和${typeN(sk[1])}类型宠物的攻击力×${sk[2]/100}倍`;
			break;
		case 71:
			//这个类型，所有颜色是直接显示的，但是最后一位有个-1表示结束
			strArr = sk;
			if (sk.indexOf(-1)>=0)
			{
				strArr = sk.slice(0,sk.indexOf(-1));
			}
			str = "全画面的宝珠变成" + strArr.map((o)=>{return attrN(o);}).join("、");
			break;
		case 73:
			str = `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[2]})}`;
			break;
		case 75:
			str = `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物的${getFixedHpAtkRcvString({atk:sk[2],rcv:sk[2]})}`;
			break;
		case 76:
			str = `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[2],rcv:sk[2]})}`;
			break;
		case 84:
			str = `HP ${(sk[3]?(`减少${100-sk[3]}%`):"变为1")}，对敌方1体造成自身攻击力×${sk[1]/100}${sk[1]!=sk[2]?`~${+sk[2]/100}`:""}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 85:
			str = `HP 减少${sk[3]}%，对敌方全体造成自身攻击力×${sk[1]/100}${sk[1]!=sk[2]?`~${+sk[2]/100}`:""}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 86:
			str = `HP 变为1，，对敌方1体造成${sk[1]}点${attrN(sk[0])}属性伤害`;
			break;
		case 87:
			str = `HP 变为1，，对敌方全体造成${sk[1]}点${attrN(sk[0])}属性伤害`;
			break;
		case 88:
			str = `${sk[0]}回合内${typeN(sk[1])}类型的攻击力×${sk[2]/100}倍`;
			break;
		case 90:
			strArr = sk.slice(1,sk.length-1);
			str = `${sk[0]}回合内${strArr.map(attrN).join("、")}属性的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 91:
			str = `${sk.slice(0,sk.length-1).map(attrN).join("、")}属性宝珠强化`;
			if (sk[sk.length-1] != 6) str += `未知 参数${sk.length-1} ${sk[sk.length-1]}`;
			break;
		case 92:
			strArr = sk.slice(1,sk.length-1);
			str = `${sk[0]}回合内${strArr.map(typeN).join("、")}类型的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 93:
			str = `将自己换成队长，再次使用此技能则换为原来的队长。`;
			if (sk[0]) str += `未知 参数0 ${sk[0]}`;
			break;
		case 94:
			strArr = [sk[2],sk[3]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以下`}时${attrN(sk[1])}属性宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 95:
			strArr = [sk[2],sk[3]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以下`}时${typeN(sk[1])}类型宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 96:
			strArr = [sk[2],sk[3]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时${attrN(sk[1])}属性宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 97:
			strArr = [sk[2],sk[3]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时${typeN(sk[1])}类型宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 98:
			str = `${sk[0]}连击时，所有宠物的攻击力${sk[1]/100}倍，每多1连击+${sk[2]/100}倍，最大${sk[3]}连击时${(sk[1]+sk[2]*(sk[3]-sk[0]))/100}倍`;
			break;
		case 100:
			strArr = [sk[0],sk[1]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `使用技能时，所有宠物的${strArr.join("和")}×${sk[2]/100}倍`;
			break;
		case 101:
			str = `刚刚好${sk[0]}连击时，所有宠物的${getFixedHpAtkRcvString({atk:sk[1]})}`;
			break;
		case 103:
			strArr = [sk[1],sk[2]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `${sk[0]}连击或以上时所有宠物的${strArr.join("和")}×${sk[3]/100}倍`;
			break;
		case 104:
			strArr = [sk[2],sk[3]].filter(s=>{return s>0;}).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `${sk[0]}连击以上时时${nb(sk[1],attrsName).join("、")}属性宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 105:
			str = `所有宠物的${getFixedHpAtkRcvString({rcv:sk[0],atk:sk[1]})}`;
			break;
		case 106:
			str = `所有宠物的${getFixedHpAtkRcvString({hp:sk[0],atk:sk[1]})}`;
			break;
		case 107:
			str = `所有宠物的${getFixedHpAtkRcvString({hp:sk[0]})}`;
			break;
		case 108:
			str = `所有宠物的${getFixedHpAtkRcvString({hp:sk[0]})}，${typeN(sk[1])}类型宠物的攻击力×${sk[2]/100}倍`;
			break;
		case 109:
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2]) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			break;
		case 110:
			str = `根据余下 HP 对敌方${sk[0]?"1":"全"}体造成${attrN(sk[1])}属性伤害（100% HP 时为自身攻击力×${sk[2]/100}倍，1 HP 时为自身攻击力×${sk[3]/100}倍）`;
			break;
		//case 111: 在45
		case 115:
			str = `对敌方1体造成自身攻击力×${sk[1]/100}倍的${attrN(sk[0])}属性伤害，并回复伤害${sk[2]}%的 HP `;
			break;
		case 116: //多内容主动技能，按顺序组合发动如下主动技能：
			str = `<ul class="active-skill-ul">`;
			//处理多次单人固伤
			let repeatDamage = sk.filter(subSkill => {return Skills[subSkill].type == 188;});
			if (repeatDamage.length>1)
			{
				strArr = sk.filter(subSkill => {return Skills[subSkill].type != 188;}).map(subSkill => {return `<li class="active-skill-li">${parseSkillDescription(Skills[subSkill])}</li>`;});
				strArr.splice(sk.indexOf(repeatDamage[0]),0,`<li class="active-skill-li">${parseSkillDescription(Skills[repeatDamage[0]])}×${repeatDamage.length}次</li>`);
				str += strArr.join("");
			}else
			{
				str += sk.map(subSkill => {return `<li class="active-skill-li">${parseSkillDescription(Skills[subSkill])}</li>`;}).join("");
			}
			str += `</ul>`;
			break;
		case 117:
			strArr = [];
			if(sk[1]>0) strArr.push(`回复宠物自身回复力x${sk[1]/100}倍的 HP `);
			if(sk[3]) strArr.push(`回复 HP 上限${sk[3]}%的 HP `);
			if(sk[2]) strArr.push(`回复${sk[2]} HP `);
			if(sk[0]>0) strArr.push(`封锁状态减少${sk[0]}回合`);
			if(sk[4]>0) strArr.push(`觉醒无效状态减少${sk[4]}回合`);
			str = strArr.join("，");
			break;
		case 118: //随机内容主动技能
			str = `随机发动以下技能：<ul class="active-skill-ul random-active-skill">`;
			str += sk.map(subSkill => {return `<li class="active-skill-li">${parseSkillDescription(Skills[subSkill])}</li>`;}).join("");
			str += `</ul>`;
			break;
		case 119: //相連消除4個的水寶珠時，所有寵物的攻擊力2.5倍，每多1個+0.5倍，最大5個時3倍
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时，所有宠物的攻击力${sk[2]/100}倍`;
			if (sk[3]>0)
			{
				str += `，每多1个+${sk[3]/100}倍`;
			}
			if (sk[4]>0)
			{
				str += `，最大${sk[4]}个时${(sk[2]+sk[3]*(sk[4]-sk[1]))/100}倍`;
			}
			break;
		case 121:
			str = `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]})}`;
			break;
		case 122:
			str = `HP ${sk[0]}%以下时`;
			str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			break;
		case 123:
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时`;
			str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			break;
		case 124:
			strArr = sk.slice(0,5).filter(c=>{return c>0;}); //最多5串珠
			hasDiffOrbs = strArr.filter(s=>{return s!= strArr[0];}).length > 0; //是否存在不同色的珠子
			if (sk[5] < strArr.length) //有阶梯的
			{
				if (hasDiffOrbs)
				{//「光光火/光火火」組合的3COMBO時，所有寵物的攻擊力3.5倍；「光光火火」組合的4COMBO或以上時，所有寵物的攻擊力6倍 
					str = `${strArr.map(a=>{return nb(a, attrsName);}).join("、")}中${sk[5]}串同时攻击时，所有宠物的攻击力×${sk[6]/100}倍，每多1串+${sk[7]/100}倍，最大${strArr.length}串时×${(sk[6]+sk[7]*(strArr.length-sk[5]))/100}倍`;
				}else
				{//木寶珠有2COMBO時，所有寵物的攻擊力3倍，每多1COMBO+4倍，最大5COMBO時15倍 
					str = `${nb(strArr[0], attrsName).join("、")}宝珠有${sk[5]}串时，所有宠物的攻击力×${sk[6]/100}倍，每多1串+${sk[7]/100}倍，最大${strArr.length}串时×${(sk[6]+sk[7]*(strArr.length-sk[5]))/100}倍`;
				}
			}else
			{
				if (hasDiffOrbs)
				{//火光同時攻擊時，所有寵物的攻擊力2倍
					str = `${strArr.map(a=>{return nb(a, attrsName);}).join("、")}同时攻击时，所有宠物的攻击力×${sk[6]/100}倍`;
				}else
				{//光寶珠有2COMBO或以上時，所有寵物的攻擊力3倍
					str = `${nb(strArr[0], attrsName).join("、")}宝珠有${sk[5]}串或以上时，所有宠物的攻击力×${sk[6]/100}倍`;
				}
			}
			break;
		case 125: //隊伍中同時存在 時，所有寵物的攻擊力3.5倍
			strArr = sk.slice(0,5).filter(s=>{return s>0;});
			str = `队伍中${strArr.length>1?"同时":""}存在`;
			str += strArr.map(cardN).join("");
			str += "时所有宠物的";
			strArr =[];
			if (sk[5]) {strArr.push(`HP×${sk[5]/100}倍`);}
			if (sk[6]) {strArr.push(`攻击力×${sk[6]/100}倍`);}
			if (sk[7]) {strArr.push(`回复力×${sk[7]/100}倍`);}
			str += strArr.join("、");
			break;
		case 126:
			str = `${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}回合内${nb(sk[0], attrsName).join("、")}珠的掉落率提高${sk[3]}%`;
			break;
		case 127: //生成竖列
			strArr = [];
			for (let ai=0;ai<sk.length;ai+=2)
			{
				strArr.push(`${nb(sk[ai],ClumsN).join("、")}的宝珠变为${nb(sk[ai+1],attrsName).join("、")}`);
			}
			str = strArr.join("，");
			break;
		case 128: //生成横
			strArr = [];
			for (let ai=0;ai<sk.length;ai+=2)
			{
				strArr.push(`${nb(sk[ai],RowsN).join("、")}的宝珠变为${nb(sk[ai+1],attrsName).join("、")}`);
			}
			str = strArr.join("，");
			break;
		case 129:
			str = `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${nb(sk[5],attrsName).join("、")}属性伤害减少${sk[6]}%`;
			break;
		case 130:
			str = `HP ${sk[0]}%以下时`;
			str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${nb(sk[5],attrsName).join("、")}属性伤害减少${sk[6]}%`;
			break;
		case 131:
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时`;
			str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${nb(sk[5],attrsName).join("、")}属性伤害减少${sk[6]}%`;
			break;
		case 132:
			str = `${sk[0]}回合内，宝珠移动时间`;
			if (sk[1]) str += (sk[1]>0?`增加`:`减少`) + Math.abs(sk[1]/10) + `秒`;
			if (sk[2]) str += sk[2]>100 ? `变为${sk[2]/100}倍` : `变为${sk[2]}%`;
			break;
		case 133:
			str = `使用技能时，`;
			str += `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3]) str += `的${getFixedHpAtkRcvString({atk:sk[2],rcv:sk[3]})}`;
			break;
		case 136:
			str = "";
			str += `${getAttrTypeString(flags(sk[0]))}宠物的${getFixedHpAtkRcvString({hp:sk[1],atk:sk[2],rcv:sk[3]})}`;
			if (sk[4]) str += `，${getAttrTypeString(flags(sk[4]))}宠物的${getFixedHpAtkRcvString({hp:sk[5],atk:sk[6],rcv:sk[7]})}`;
			break;
		case 137:
			str = "";
			str += `${getAttrTypeString(null,flags(sk[0]))}宠物的${getFixedHpAtkRcvString({hp:sk[1],atk:sk[2],rcv:sk[3]})}`;
			if (sk[4]) str += `，${getAttrTypeString(null,flags(sk[4]))}宠物的${getFixedHpAtkRcvString({hp:sk[5],atk:sk[6],rcv:sk[7]})}`;
			break;
		case 138: //多内容队长技能，按顺序组合发动如下队长技能：
			str = `<ul class="leader-skill-ul">`;
			str += sk.map(subSkill => {return `<li class="leader-skill-li">${parseSkillDescription(Skills[subSkill])}</li>`;}).join("");
			str += `</ul>`;
			break;
		case 139:
			str = ``;
			strArr =[];
			str += getAttrTypeString(flags(sk[0]),flags(sk[1])) + "宠物的";
			str += ` HP ${sk[3]?`${sk[2]}%以下`:(sk[2]==100?`全满`:`${sk[2]}%以上`)}时攻击力${getFixedHpAtkRcvString({atk:sk[4]})}`;
			str += `，HP ${sk[3]?(sk[6]?`${sk[2]}%~${sk[5]}%`:`${sk[5]}%以上`):(sk[6]?`${sk[5]}%以下`:(sk[2]==100?`${sk[5]}以上`:`${sk[5]}%~${sk[2]}%`))}时攻击力${getFixedHpAtkRcvString({atk:sk[7]})}`;
			break;
		case 140:
			str = `${getOrbsAttrString(sk[0])}宝珠强化（每颗强化珠伤害/回复增加${sk[1]}%）`;
			break;
		case 141:
			let otherAttrs = sk[1] ^ sk[2]; //异或，sk[2]表示在什么珠以外生成，平时等于sk[1]
			str = `${otherAttrs?`${getOrbsAttrString(otherAttrs)}以外`:""}随机生成${getOrbsAttrString(sk[1])}宝珠各${sk[0]}个`;
			break;
		case 142:
			str = `${sk[0]}回合内自身的属性变为${attrN(sk[1])}`;
			break;
		case 143:
			str = `对敌方全体造成队伍总 HP×${sk[0]/100}倍的${attrN(sk[1])}属性伤害`;
			break;
		case 144:
			str = `对敌方${sk[2]?sk[2]:"全"}体造成${nb(sk[0],attrsName).join("、")}属性总攻击力×${sk[1]/100}倍的${attrN(sk[3])}属性伤害`;
			break;
		case 145:
			str = `回复队伍总回复力×${sk[0]/100}倍的 HP`;
			break;
		case 146:
			str = `自身以外的宠物技能冷却减少${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}回合`;
			break;
		case 148:
			str = `进入地下城时为队长的话，获得的等级经验值×${sk[0]/100}倍`;
			break;
		case 149: //相連消除4個回復寶珠時，所有寵物的回復力2.5倍；
			str = `相连消除4粒${getOrbsAttrString(1<<5)}宝珠时，所有宠物的${getFixedHpAtkRcvString({rcv:sk[0]})}`;
			break;
		case 150: //相連消除5粒寶珠，而當中包含至少1粒強化寶珠時，該屬性的攻擊力1.5倍
			str = `相连消除5粒宝珠，而当中包含至少1粒强化宝珠时，该属性的${getFixedHpAtkRcvString({atk:sk[1]})}`;
			if (sk[0]) str += `未知的 参数0 ${sk[0]}`;
			break;
		case 151:
			str = `以十字形式消除5个${getOrbsAttrString(1<<5)}宝珠时`;
			if (sk[0] || sk[1]) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[0],rcv:sk[1]})}`;
			if (sk[2]) str += `，受到的伤害减少${sk[2]}%`;
			break;
		case 152:
			str = `将${getOrbsAttrString(sk[0])}宝珠锁定`;
			if (sk[1]!=42 && sk[1]!=99) str += `，还有未知 参数[1]：${sk[1]}`;
			break;
		case 153:
			str = `敌人全体变为${attrN(sk[0])}属性。（${sk[1]?"不":""}受防护盾的影响）`;
			break;
		case 154:
			str = `${getOrbsAttrString(sk[0])}宝珠变为${nb(sk[1],attrsName).join("、")}`;
			break;
		case 155:
			str = `协力时${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]})}`;
			break;
		case 156: //宝石姬技能
			strArr = sk.slice(1,4);
			str = `${sk[0]?`${sk[0]}回合内，`:""}根据队伍内觉醒技能 ${strArr.filter(s=>{return s>0;}).map(s=>{return awokenN(s);}).join("、")} 的数目`;
			if (sk[4]==1)
				str += `回复 HP ，每个觉醒回复${sk[5]}点`;
			else if (sk[4]==2)
				str += `提升所有属性的攻击力，每个觉醒可以提升${sk[5]-100}%`;
			else if (sk[4]==3)
				str += `减少受到的伤害，每个觉醒可以减少${sk[5]}%`;
			else
				str = `156宝石姬技能，未知buff类型 参数[4]：${sk[4]}`;
			break;
		case 157:
			fullColor = [sk[0],sk[2],sk[4]].filter(s=>{return s!=null;});
			strArr = [sk[1],sk[3],sk[5]].filter(s=>{return s>0;});
			hasDiffOrbs = strArr.filter(c=>{return c != strArr[0];}).length > 0;
			str = ``;
			if (hasDiffOrbs)
			{
				if (sk[0] != null) str += `以十字形式消除5个${attrN(sk[0])}宝珠，当消除N个十字时，所有宠物的攻击力×${sk[1]/100}<sup>N</sup>倍`;
				if (sk[2] != null) str += `以十字形式消除5个${attrN(sk[2])}宝珠，当消除N个十字时，所有宠物的攻击力×${sk[3]/100}<sup>N</sup>倍`;
				if (sk[4] != null) str += `以十字形式消除5个${attrN(sk[4])}宝珠，当消除N个十字时，所有宠物的攻击力×${sk[5]/100}<sup>N</sup>倍`;
			}else
			{
				str += `以十字形式消除5个${getAttrTypeString(fullColor)}宝珠，当消除N个十字时，所有宠物的攻击力×${sk[1]/100}<sup>N</sup>倍`;
			}
			break;
		case 158:
			str = `<span class="spColor">每组${sk[0]-1}珠或以下无法消除</span>`;
			if (sk[1] || sk[2])
			str += "，" + getAttrTypeString(flags(sk[1]),flags(sk[2])) + "宠物的" + getFixedHpAtkRcvString({atk:sk[3],hp:sk[4],rcv:sk[5]});
			break;
		case 159:
			//"相連消除5個或以上的火寶珠或光寶珠時攻擊力和回復力4倍，每多1個+1倍，最大7個時6倍；"
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时，所有宠物的`;
			strArr = [];
			if (sk[2]>0)
			{
				strArr.push(`攻击力×${sk[2]/100}倍`);
				if (sk[3]>0)
				{
					strArr.push(`每多1个+${sk[3]/100}倍`);
				}
				if (sk[4]>0)
				{
					strArr.push(`最大${sk[4]}个时×${(sk[2]+sk[3]*(sk[4]-sk[1]))/100}倍`);
				}
			}
			str += strArr.join("，");
			break;
		case 160:
			str = `${sk[0]}回合内，结算时连击数+${sk[1]}`;
			break;
		case 161:
			str = `造成敌人 HP 上限${sk[0]}%的伤害`;
			break;
		case 162:
			str = '<span class="spColor">【7×6版面】</span>';
			break;
		case 163:
			str = '<span class="spColor">【没有天降消除】</span>';
			if (sk[0] || sk[1]) str += `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += "的"+getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]});
			if (sk[5] || sk[6]) str += `，受到的${getAttrTypeString(flags(sk[5]))}伤害减少${sk[6]}`;
			break;
		case 164:
			fullColor = sk.slice(0,4).filter(c=>{return c>0;}); //最多4串珠
			hasDiffOrbs = fullColor.filter(s=>{return s!= fullColor[0];}).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (sk[4] < fullColor.length) //有阶梯的
			{
				if (hasDiffOrbs)
				{//「光光火/光火火」組合的3COMBO時，所有寵物的攻擊力3.5倍；「光光火火」組合的4COMBO或以上時，所有寵物的攻擊力6倍 
					str = `${fullColor.map(a=>{return nb(a, attrsName);}).join("、")}中${sk[4]}串同时攻击时，所有宠物的攻击力和回复力×${sk[5]/100}倍，每多1串+${sk[7]/100}倍，最大${fullColor.length}串时×${(sk[6]+sk[7]*(fullColor.length-sk[4]))/100}倍`;
				}else
				{//木寶珠有2COMBO時，所有寵物的攻擊力3倍，每多1COMBO+4倍，最大5COMBO時15倍 
					str = `${nb(fullColor[0], attrsName).join("、")}宝珠有${fullColor.length}串时，所有宠物的攻击力和回复力×${sk[6]/100}倍，每多1串+${sk[7]/100}倍，最大${fullColor.length}串时×${(sk[6]+sk[7]*(fullColor.length-sk[5]))/100}倍`;
				}
				if (sk[5]) strArr.push(`攻击力×${sk[5]/100}倍，每多1串+${sk[7]/100}倍，最大${fullColor.length}串时×${(sk[5]+sk[7]*(fullColor.length-sk[4]))/100}倍`);
				if (sk[6]) strArr.push(`回复力×${sk[6]/100}倍，每多1串+${sk[7]/100}倍，最大${fullColor.length}串时×${(sk[6]+sk[7]*(fullColor.length-sk[4]))/100}倍`);
				str += strArr.join("、");
			}else
			{
				if (hasDiffOrbs)
				{//木暗同時攻擊時，所有寵物的攻擊力和回復力2倍
					str = `${fullColor.map(a=>{return nb(a, attrsName);}).join("、")}同时攻击时，所有宠物的`;
				}else
				{//光寶珠有2COMBO或以上時，所有寵物的攻擊力3倍
					str = `${nb(fullColor[0], attrsName).join("、")}宝珠有${fullColor.length}串或以上时，所有宠物的`;
				}
				if (sk[5]) strArr.push(`攻击力×${sk[5]/100}倍`);
				if (sk[6]) strArr.push(`回复力×${sk[6]/100}倍`);
				str += strArr.join("、");
			}
			break;
		case 165:
			fullColor = nb(sk[0], attrsName);
			atSameTime = fullColor.length == sk[1];
			if (sk[0] == 31) //31-11111
			{ //单纯5色
				str = '';
			}else if((sk[0] & 31) == 31)
			{ //5色加其他色
				str = `5色+${nb(sk[0] ^ 31, attrsName).join("、")}`;
				if (!atSameTime) str+="中";
			}else
			{
				str = `${fullColor.join("、")}`;
				if (!atSameTime) str+="中";
			}
			if (!atSameTime) str+=`${sk[1]}种属性以上`;
			else if(sk[0] == 31) str += `5色`;
			str += `同时攻击时，所有宠物的`;
			strArr = [];
			if (sk[2]==sk[3] && sk[4] == sk[5])
			{
				strArr.push(`攻击力和回复力×${sk[2]/100}倍`);
				if (sk[4]>0)
				{
					strArr.push(`每多1种属性+${sk[4]/100}倍`);
				}
				if (sk[6]>0)
				{
					strArr.push(`最大${sk[6]}种属性时×${((sk[6]-sk[1])*sk[4]+sk[2])/100}倍`);
				}
			}else
			{
				if (sk[2]>0)
				{
					strArr.push(`攻击力×${sk[2]/100}倍`);
					if (sk[4]>0)
					{
						strArr.push(`每多1种属性+${sk[4]/100}倍`);
					}
					if (sk[6]>0)
					{
						strArr.push(`最大${sk[6]}种属性时×${((sk[6]-sk[1])*sk[4]+sk[2])/100}倍`);
					}
				}
				if (sk[3]>0)
				{
					strArr.push(`回复力×${sk[3]/100}倍`);
					if (sk[5]>0)
					{
						strArr.push(`每多1种属性+${sk[5]/100}倍`);
					}
					if (sk[6]>0)
					{
						strArr.push(`最大${sk[6]}种属性时×${((sk[6]-sk[1])*sk[5]+sk[3])/100}倍`);
					}
				}
			}
			str += strArr.join("，");
			break;
		case 166:
			str = `${sk[0]}连击时，所有宠物的`;
			strArr = [];
			if (sk[1]==sk[2] && sk[3] == sk[4])
			{
				strArr.push(`攻击力和回复力×${sk[1]/100}倍`);
				if (sk[3]>0)
				{
					strArr.push(`每多1种属性+${sk[3]/100}倍`);
				}
				if (sk[5]>sk[0])
				{
					strArr.push(`最大${sk[5]}种属性时×${((sk[5]-sk[0])*sk[1]+sk[3])/100}倍`);
				}
			}else
			{
				if (sk[1]>0)
				{
					strArr.push(`攻击力×${sk[1]/100}倍`);
					if (sk[3]>0)
					{
						strArr.push(`每多1种属性+${sk[3]/100}倍`);
					}
					if (sk[5]>sk[0])
					{
						strArr.push(`最大${sk[5]}种属性时×${((sk[5]-sk[0])*sk[1]+sk[3])/100}倍`);
					}
				}
				if (sk[2]>0)
				{
					strArr.push(`回复力×${sk[2]/100}倍`);
					if (sk[4]>0)
					{
						strArr.push(`每多1种属性+${sk[4]/100}倍`);
					}
					if (sk[5]>sk[0])
					{
						strArr.push(`最大${sk[5]}种属性时×${((sk[5]-sk[0])*sk[2]+sk[4])/100}倍`);
					}
				}
			}
			str += strArr.join("，");
			break;
		case 167:
			//"相連消除5個或以上的火寶珠或光寶珠時攻擊力和回復力4倍，每多1個+1倍，最大7個時6倍；"
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时，所有宠物的`;
			strArr = [];
			if (sk[2]==sk[3] && sk[4] == sk[5])
			{
				strArr.push(`攻击力和回复力×${sk[2]/100}倍`);
				if (sk[4]>0)
				{
					strArr.push(`每多1个+${sk[4]/100}倍`);
				}
				if (sk[6]>0)
				{
					strArr.push(`最大${sk[6]}个时×${(sk[2]+sk[4]*(sk[6]-sk[1]))/100}倍`);
				}
			}else
			{
				if (sk[2]>0)
				{
					strArr.push(`攻击力×${sk[2]/100}倍`);
					if (sk[4]>0)
					{
						strArr.push(`每多1个+${sk[4]/100}倍`);
					}
					if (sk[6]>0)
					{
						strArr.push(`最大${sk[6]}个时×${(sk[2]+sk[4]*(sk[6]-sk[1]))/100}倍`);
					}
				}
				if (sk[3]>0)
				{
					strArr.push(`回复力×${sk[3]/100}倍`);
					if (sk[5]>0)
					{
						strArr.push(`每多1个+${sk[5]/100}倍`);
					}
					if (sk[6]>0)
					{
						strArr.push(`最大${sk[6]}个时×${(sk[3]+sk[5]*(sk[6]-sk[1]))/100}倍`);
					}
				}
			}
			str += strArr.join("，");
			break;
		case 168: //宝石姬技能2
			strArr = sk.slice(1,7); //目前只有2个，而且2-6都是0，不知道是不是真的都是觉醒
			str = `${sk[0]?`${sk[0]}回合内，`:""}根据队伍内觉醒技能 ${strArr.filter(s=>{return s>0;}).map(s=>{return awokenN(sk[1]);}).join("、")} 的数目`;
			str += `提升所有属性的攻击力，每个觉醒可以提升${sk[7]}%`;
			break;
		case 169: //5COMBO或以上時受到的傷害減少25%、攻擊力6倍；
			str = `${sk[0]}连击或以上时，所有宠物的攻击力×${sk[1]/100}倍，受到的伤害减少${sk[2]}%`;
			break;
		case 170:
			fullColor = nb(sk[0], attrsName);
			atSameTime = fullColor.length == sk[1];
			if (sk[0] == 31) //31-11111
			{ //单纯5色
				str = '';
			}else if((sk[0] & 31) == 31)
			{ //5色加其他色
				str = `5色+${nb(sk[0] ^ 31, attrsName).join("、")}`;
				if (!atSameTime) str+="中";
			}else
			{
				str = `${fullColor.join("、")}`;
				if (!atSameTime) str+="中";
			}
			if (!atSameTime) str+=`${sk[1]}种属性以上`;
			else if(sk[0] == 31) str += `5色`;
			str += `同时攻击时`;
			if (sk[2]) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			if (sk[3]) str += `，受到的伤害减少${sk[3]}%`;
			break;
		case 171:
			fullColor = sk.slice(0,4).filter(c=>{return c>0;}); //最多4串珠
			hasDiffOrbs = fullColor.filter(s=>{return s!= fullColor[0];}).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (hasDiffOrbs)
			{//木暗同時攻擊時，所有寵物的攻擊力和回復力2倍
				str = `${fullColor.map(a=>{return nb(a, attrsName);}).join("、")}${sk[4] < fullColor.length?`中有${sk[4]}串`:""}同时攻击时`;
			}else
			{//光寶珠有2COMBO或以上時，所有寵物的攻擊力3倍
				str = `${nb(fullColor[0], attrsName).join("、")}宝珠有${sk[4]}串或以上时`;
			}
			if (sk[5] && sk[5] !== 100) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[5]})}`;
			if (sk[6]) str += `，受到的伤害减少${sk[6]}%`;
			break;
		case 172:
			str = `解锁所有宝珠`;
			break;
		case 173:
			strArr = [];
			if (sk[1]) strArr.push("属性吸收");
			if (sk[2]) strArr.push("连击吸收？目前是猜测");
			if (sk[3]) strArr.push("伤害吸收");
			str = `${sk[0]}回合内敌人的${strArr.join("、")}无效化`;
			break;
		case 175: //隊員編成均為「マガジン」合作活動角色時，所有寵物的攻擊力8倍
			str = `队员组成全是`;
			strArr = sk.slice(0,3).filter(s=>{return s>0;}); //最多3种id
			str += strArr.map(s=>{
				return `<a class="detail-search monster-collabId" data-collabId="${s}" onclick="searchColla(this.getAttribute('data-collabId'));">${s}</a>`;
			}).join("、");
			str += `系列角色时，所有宠物的${getFixedHpAtkRcvString({hp:sk[3],atk:sk[4],rcv:sk[5]})}`;
			break;
		case 176:
		//●◉○◍◯
			var table = [sk[0],sk[1],sk[2],sk[3],sk[4]];
			str = `以如下形状生成${attrN(sk[5])}宝珠<br>`;
			str += table.map(r=>{
				const orbs = flags(r);
				const line = Array.from(new Array(6)).map((a,i)=>{return orbs.indexOf(i)>=0?"●":"○";});
				return line.join("");
			}).join("<br>");
			break;
		case 177:
/*
火柱：【無天降COMBO】消除寶珠後畫面剩下3個或以下的寶珠時，所有寵物的攻擊力10倍；
鞍馬夜叉丸：【無天降COMBO】HP和回復力2倍；消除寶珠後畫面剩下15個寶珠時攻擊力1.5倍，每少1個時+0.5倍，不剩任何寶珠時攻擊力9倍；
破壞龍鋼多拉：【無天降COMBO】HP2倍；消除寶珠後畫面剩下10個寶珠時攻擊力6倍，每少1個時+0.5倍，不剩任何寶珠時攻擊力11倍；
*/
			str = '<span class="spColor">【没有天降消除】</span>';
			if (sk[0] || sk[1]) str += `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += "的"+getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]})+"，";
			if (sk[5])
			{
				if (sk[7]) //有阶梯
				{
					str += `消除宝珠后画面剩下${sk[5]}个宝珠时，${getFixedHpAtkRcvString({atk:sk[6]})}，每少1个+${sk[7]/100}倍，不剩任何宝珠时${getFixedHpAtkRcvString({atk:sk[6]+sk[7]*sk[5]})}`;
				}else
				{
					str += `消除宝珠后画面剩下${sk[5]}个或以下的宝珠时，${getFixedHpAtkRcvString({atk:sk[6]})}`;
				}
			}
			break;
		case 178:
			str = `<span class="spColor">【操作时间固定${sk[0]}秒】</span>`;
			if (sk[1] || sk[2]) str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4] || sk[5]) str += "的"+getFixedHpAtkRcvString({hp:sk[3],atk:sk[4],rcv:sk[5]});
			break;
		case 179:
			str = `${sk[0]}回合内每回合回复${sk[1]?`${sk[1]}点`:` HP 上限 ${sk[2]}%`}的 HP`;
			break;
		case 180:
			str = `${sk[0]}回合内，${sk[1]}%概率掉落强化宝珠`;
			break;
		case 182:
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2]) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			if (sk[3]) str += `，受到的伤害减少${sk[3]}%`;
			break;
		case 183:
			str = getAttrTypeString(flags(sk[0]),flags(sk[1])) + "宠物的";
			if (sk[3] || sk[4]) str+= ` HP ${sk[2]}%以上时`; 
			if (sk[3]) str+= `${getFixedHpAtkRcvString({atk:sk[3]})}`; 
			if (sk[4]) str += `，受到的伤害减少${sk[4]}%`;
			if (sk[6] || sk[7]) str+= ` HP ${sk[5]||sk[2]}%以下时`;
			if (sk[6]) str+= `${getFixedHpAtkRcvString({atk:sk[6]})}`;
			if (sk[7]) str+= `，受到的伤害减少${sk[7]}%`;
			break;
		case 184:
			str = `${sk[0]}回合内，天降的宝珠不会产生COMBO`;
			break;
		case 185: //ドラゴンと悪魔タイプの攻撃力が4倍、回復力は2.5倍。\nドロップ操作を3秒延長。
			str = "";
			if (sk[1] || sk[2]) str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4] || sk[5]) str += "的"+getFixedHpAtkRcvString({hp:sk[3],atk:sk[4],rcv:sk[5]});
			if (sk[0]) str += `，操作时间${sk[0]>0?`延长`:`减少`}${Math.abs(sk[0]/100)}秒`;
			break;
		case 186:
			str = '<span class="spColor">【7×6版面】</span>';
			if (sk[0] || sk[1]) str += getAttrTypeString(flags(sk[0]),flags(sk[1])) + "宠物的" + getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]});
			break;
		case 188:
			str = `对敌方1体造成${sk[0]}点无视防御的固定伤害`;
			break;
		case 189: 
		//解除寶珠的鎖定狀態；所有寶珠變成火、水、木、光；顯示3COMBO的轉珠路徑（只適用於普通地下城＆3個消除）
			str = `解除宝珠的锁定状态；所有宝珠变成火、水、木、光；显示3连击的转珠路径（只适用于普通地下城 & 3珠消除）`;
			break;
		case 191:
			str = `${sk[0]}回合内可以贯穿伤害无效盾`;
			break;
		case 192:
			//相連消除9個或以上的火寶珠時攻擊力4倍、結算增加2COMBO
			//同時消除光寶珠和水寶珠各4個或以上時攻擊力3倍、結算增加1COMBO；
			fullColor = nb(sk[0], attrsName);
			str = fullColor.length>1?"同时":"相连";
			str += `消除${sk[1]}个或以上的${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2]) str += `，攻击力×${sk[2]/100}倍`;
			if (sk[3]) str += `，结算时连击数+${sk[3]}`;
			break;
		case 193:
			fullColor = nb(sk[0], attrsName);
			str = `以L字形消除5个${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[1] || sk[2]) str+=getFixedHpAtkRcvString({atk:sk[1],rcv:sk[2]});
			if (sk[3]) str+=`，受到的伤害减少${sk[3]}%`;
			break;
		case 194:
			fullColor = nb(sk[0], attrsName);
			atSameTime = fullColor.length == sk[1];
			if (sk[0] == 31) //31-11111
			{ //单纯5色
				str = '';
			}else if((sk[0] & 31) == 31)
			{ //5色加其他色
				str = `5色+${nb(sk[0] ^ 31, attrsName).join("、")}`;
				if (!atSameTime) str+="中";
			}else
			{
				str = `${fullColor.join("、")}`;
				if (!atSameTime) str+="中";
			}
			if (!atSameTime) str+=`${sk[1]}种属性以上`;
			else if(sk[0] == 31) str += `5色`;
			str += `同时攻击时`;
			if (sk[2] != 100) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			if (sk[3]) str += `，结算时连击数+${sk[3]}`;
			break;
		case 195:
			str = `HP 减` + (sk[0]?`少${sk[0]}%`:`为1`);
			break;
		case 196:
			str = `无法消除宝珠状态减少${sk[0]}回合`;
			break;
		case 197: //消除毒/猛毒宝珠时不会受到毒伤害
			str = `消除${getOrbsAttrString(1<<7|1<<8)}宝珠时不会受到毒伤害`;
			break;
		case 198:
			//以回復寶珠回復40000HP或以上時，受到的傷害減少50%
			str = `以回复宝珠回复${sk[0]}或以上时`;
			if (sk[1]) str += `所有宠物的${getFixedHpAtkRcvString({atk:sk[1]})}`;
			if (sk[2]) str += `，受到的伤害减少${sk[2]}%`;
			if (sk[3]) str += `，觉醒无效状态减少${sk[3]}回合`;
			break;
		case 199:
			fullColor = nb(sk[0], attrsName);
			atSameTime = fullColor.length == sk[1];
			if (sk[0] == 31) //31-11111
			{ //单纯5色
				str = '';
			}else if((sk[0] & 31) == 31)
			{ //5色加其他色
				str = `5色+${nb(sk[0] ^ 31, attrsName).join("、")}`;
				if (!atSameTime) str+="中";
			}else
			{
				str = `${fullColor.join("、")}`;
				if (!atSameTime) str+="中";
			}
			if (!atSameTime) str+=`${sk[1]}种属性以上`;
			else if(sk[0] == 31) str += `5色`;
			str += `同时攻击时，追加${sk[2]}点固定伤害`;
			break;
		case 200:
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时，追加${sk[2]}点固定伤害`;
			break;
		case 201:
			fullColor = sk.slice(0,4).filter(c=>{return c>0;}); //最多4串珠
			hasDiffOrbs = fullColor.filter(s=>{return s!= fullColor[0];}).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (hasDiffOrbs)
			{//木暗同時攻擊時，所有寵物的攻擊力和回復力2倍
				str = `${fullColor.map(a=>{return nb(a, attrsName);}).join("、")}${sk[4] < fullColor.length?`中有${sk[4]}串`:""}同时攻击时`;
			}else
			{//光寶珠有2COMBO或以上時，所有寵物的攻擊力3倍
				str = `${nb(fullColor[0], attrsName).join("、")}宝珠有${sk[4]}串或以上时`;
			}
			if (sk[5]) str += `，追加${sk[5]}点固定伤害`;
			break;
		case 202:
			str = `变身为${cardN(sk[0])}`;
			break;
		case 203:
			str = `队员组成全是像素进化时，`;
			if (sk[0]) str += getAttrTypeString(flags(sk[0]));
			str += "宠物的" + getFixedHpAtkRcvString({hp:sk[1],atk:sk[2],rcv:sk[3]});
			break;
		case 205:
			str = `${sk[1]}回合内，${getOrbsAttrString(sk[0])}宝珠会以锁定形式掉落`;
			break;
		default:
			str = `未知的技能类型${type}(No.${id})`;
			//开发部分
			//const copySkill = JSON.parse(JSON.stringify(skill));
			//copySkill.params = copySkill.params.map(p=>{return [p,getBooleanFromBinary(p).join("")];});
			console.log(`未知的技能类型${type}(No.${id})`,findFullSkill(skill));
			break;
	}
	//(skill.description.length?(descriptionToHTML(skill.description) + "<hr>"):"") + str
	return str;
}
//大数字缩短长度
function parseBigNumber(number)
{
	if (number === 0)
	{
		return number.toLocaleString();
	}else if (number % 1e8 === 0)
	{
		return (number / 1e8).toLocaleString() + " 亿";
	}else if (number % 1e4 === 0)
	{
		return (number / 1e4).toLocaleString() + " 万";
	}else
	{
		return number.toLocaleString();
	}
	
}