document.title = `智龙迷城${teamsCount}人队伍图制作工具`;
const localTranslating = {
    skill_parse: {
        skill: {
			unknown: tp`未知的技能类型：${'type'}`, //type
			active_turns: tp`${'active'}，效果 ${'turns'} 回合`, //turns, active
			random_skills: tp`随机发动以下技能：${'skill-list'}`, //skill-list
			delay: tp`${'icon'}延迟敌人的攻击`, //icon
			mass_attack: tp`${'icon'}所有攻击变为全体攻击`,
			leader_change: tp`${'icon'}将自身换为队长，再次使用则换回来`,
			no_skyfall: tp`${'icon'}天降的宝珠不会消除`,
            heal: tp`${'icon'}回复 ${'value'} 的 HP`,
            defense_break:  (valueElement)=> [`敌方的防御力减少`, valueElement],
            poison: (valueElement)=> [`使敌方全体中毒，每回合损失`, valueElement, `的 HP`],
			time_extend: (valueElement)=> [`宝珠移动时间`, valueElement],
			follow_attack: (valueElement)=> [`消除宝珠的回合，以`, valueElement, `的伤害追打敌人`],
            auto_heal: (valueElement)=> [`消除宝珠的回合，回复`, valueElement, `的 HP`],
			ctw: (valueElement)=> [valueElement, `内时间停止，可以任意移动宝珠`],
			gravity: tp`造成${'target'}${'value'}的伤害`,//(valueElement)=> [`造成敌方`, valueElement, `的伤害`],
            resolve: (stats, valueElement, probability)=> [probability ? `有${(probability* 100).keepCounts()}%的几率`:'',`如当前`,valueElement,`，受到单一次致命攻击时，将会以1点 HP 生还`],
            resolve: (stats, valueElement, probability)=> [`如`, stats, `≧` , valueElement, probability<100 ? `，有${probability}%的几率`:'',`受到单一次致命攻击时，将会以1点 HP 生还`],
		},
        value: {
            unknown: tp`[ 未知数值: ${'type'}]`, //type
			const: tp`${'value'}${'unit'}`, // (value, unit)=> `${value}${unit ? ` ${unit}` : ''}`,
			mul_percent: tp`${'value'}%`,
			mul_times: tp`×${'value'}倍`,
			mul_of_percent: tp`${'stats'}的${'value'}%`,
			mul_of_times: tp`${'stats'}×${'value'}倍`,
		},
		target: {
			self: tp`自身`,
			enemy: tp`敌人`,
		},
        stats: {
            unknown: tp`[ 未知状态: ${'type'}]`, //type
            maxhp: tp`最大HP`,
            hp: tp`HP`,
            atk: tp`攻击力`,
			rcv: tp`回复力`,
            teamatk: tp`队伍攻击力`,
            teamrcv: tp`队伍回复力`,
        },
		unit: {
			seconds : tp`秒`,
		},
    },
}

//大数字缩短长度
Number.prototype.bigNumberToString = function() {
    let numTemp = this.valueOf();
    if (!numTemp) return "0";
    const grouping = Math.pow(10, 4);
    const unit = ['', '万', '亿', '兆', '京', '垓'];
    const numParts = [];
    do {
        numParts.push(numTemp % grouping);
        numTemp = Math.floor(numTemp / grouping);
    } while (numTemp > 0 && numParts.length < (unit.length - 1))
    if (numTemp > 0) {
        numParts.push(numTemp);
    }
    let numPartsStr = numParts.map((num, idx) => {
        if (num > 0) {
            return (num < 1e3 ? "零" : "") + num + unit[idx];
        } else
            return "零";
    });

    numPartsStr.reverse(); //反向
    let outStr = numPartsStr.join("");
    outStr = outStr.replace(/(^零+|零+$)/g, ''); //去除开头的零
    outStr = outStr.replace(/零{2,}/g, '零'); //去除多个连续的零
    return outStr;
}

//查找原先完整技能
function findFullSkill(subSkill) {
    const parentSkill = Skills.find(ss => (ss.type === 116 || ss.type === 118 || ss.type === 138) && ss.params.includes(subSkill.id)) || subSkill;
    const aCard = Cards.find(card => card.activeSkillId == parentSkill.id || card.leaderSkillId == parentSkill.id);
    return { skill: parentSkill, card: aCard };
}
//document.querySelector(".edit-box .row-mon-id .m-id").type = "number";
/* 快速搜索指定类型的技能
var result = Skills.filter(s=>{const sk = s.params; return [130,131].includes(s.type);}).map(findFullSkill);
showSearch(result.map(o=>o.card).filter(c=>c));
console.table(result);
*/

//返回flag里值为true的数组，如[1,4,7]
function flags(num) {
    /*
    return Array.from(new Array(32),(i,n)=>n).filter(n => num & (1 << n)); //性能太差
    return new Array(32).fill(null).map((i,n)=>n).filter(n => num & (1 << n)); //性能比上者好，但还是不够快
    */
    const arr = [];
    for (let i = 0; i < 32; i++) {
        if (num & (1 << i)) {
            arr.push(i);
        }
    }
    return arr;
}

//按住Ctrl点击技能在控制台输出技能的对象
function fastShowSkill(event) {
    if (event.ctrlKey) {
        const skillId = parseInt(this.getAttribute("data-skillid"), 10);
        console.log(Skills[skillId]);
    }
}
//技能介绍里的头像的切换
function changeToIdInSkillDetail(event) {
    const settingBox = editBox.querySelector(".setting-box");
    const monstersID = settingBox.querySelector(".row-mon-id .m-id");
    const mid = this.getAttribute("data-cardid");
    monstersID.value = mid;
    monstersID.onchange();
    return false; //取消链接的默认操作
}

//insertAdjacentHTML 可以只增加部分 HTML
//高级技能解释
function parseSkillDescription(skill) {
    const id = skill.id;
    let fragment = document.createDocumentFragment(); //创建节点用的临时空间
    if (id == 0) return fragment;
    const type = skill.type;
    const sk = skill.params;

    //珠子名和属性名数组
    const attrsName = ["火", "水", "木", "光", "暗", "回复", "废", "毒", "剧毒", "炸弹"];
    //类型名数组
    const typeName = ["进化", "平衡", "体力", "回复", "龙", "神", "攻击", "恶魔", "机械", "特别保护", "10", "11", "觉醒", "13", "强化", "卖钱"];
    //觉醒名数组
    const awokenName = ["HP+", "攻击+", "回复+", "火盾", "水盾", "木盾", "光盾", "暗盾", "自回", "防封", "防暗", "防废", "防毒", "火+", "水+", "木+", "光+", "暗+", "手指", "心解", "SB", "火横", "水横", "木横", "光横", "暗横", "U", "SX", "心+", "协力", "龙杀", "神杀", "恶魔杀", "机杀", "平衡杀", "攻击杀", "体力杀", "回复杀", "进化杀", "觉醒杀", "强化杀", "卖钱杀", "7c", "5色破防", "心追", "全体 HP ", "全体回复", "破无效", "武器觉醒", "方块心追", "5色溜", "大防封", "大手指", "防云", "防封条", "大SB", "满血强化", "下半血强化", "L盾", "L解锁", "10c", "c珠", "语音", "奖励增加", " HP -", "攻击-", "回复-", "大防暗", "大防废", "大防毒", "掉废", "掉毒", "2串火", "2串水", "2串木", "2串光", "2串暗"];
    const ClumsN = ["左边第1竖列", "左边第2竖列", "左边第3竖列", "右边第3竖列", "右边第2竖列", "右边第1竖列"];
    const RowsN = ["最上1横行", "上方第2横行", "下方第3横行", "下方第2横行", "最下1横行"];
    //返回属性名
    function attrN(i) { return attrsName[i || 0] || ("未知属性" + i); }
    //返回类型名
    function typeN(i) { return typeName[i || 0] || ("未知类型" + i); }
    //返回觉醒名
    function awokenN(i) { return awokenName[(i || 0) - 1] || ("未知觉醒" + i); }
    //从二进制的数字中获得有哪些内容
    function getNamesFromBinary(num, dataArr) {
        /*num是输入的数字，2的N次方在2进制下表示1后面跟着N个0。
        	如果num和2的N次方同时存在某位1，则返回这个数，逻辑上转换为true。
        	filter就可以返回所有有这个数的数据*/
        /*以珠子名称为例，num是输入的数字，比如10进制465转二进制=>111010001。
        二进制数从低位到高位表示火水木光暗……
        用逻辑运算AND序号来获得有没有这个值*/
        var results = dataArr.filter(function(pn, pi) {
            return num & Math.pow(2, pi); //Math.pow(x,y)计算以x为底的y次方值
        });
        return results;
    }

    const nb = getNamesFromBinary; //化简名称

    function getAttrTypeString(attrsArray = [], typesArray = []) {
        let outArr = [];
        if (attrsArray && attrsArray.indexOf(0) >= 0 &&
            attrsArray.indexOf(1) >= 0 &&
            attrsArray.indexOf(2) >= 0 &&
            attrsArray.indexOf(3) >= 0 &&
            attrsArray.indexOf(4) >= 0) {
            return "所有属性";
        }
        if (attrsArray && attrsArray.length) {
            outArr.push(attrsArray.map(attrN).join("、") + "属性");
        }
        if (typesArray && typesArray.length) {
            outArr.push(typesArray.map(typeN).join("、") + "类型");
        }
        return outArr.join("和");
    }

    function getOrbsAttrString(orbFlag, isOr = false) {
        let outStr = ``;
        if ((orbFlag & 1023) == 1023) //1023-1111111111
        { //单纯5色
            outStr += '任何';
        } else if (orbFlag == 31) //31-11111
        { //单纯5色
            outStr += '5色';
        } else if ((orbFlag & 31) == 31) { //5色加其他色
            outStr += `5色+${nb(orbFlag ^ 31, attrsName).join(isOr?"或":"、")}`;
        } else {
            outStr += `${nb(orbFlag, attrsName).join(isOr?"或":"、")}`;
        }
        return outStr;
    }

    function stats(value, statTypes) {
        return [
            statTypes.indexOf(1) >= 0 ? value : 100, //攻击
            statTypes.indexOf(2) >= 0 ? value : 100 //回复
        ];
    }
    const mulName = ["HP", "攻击力", "回复力"];
    //获取固定的三维成长的名称
    function getFixedHpAtkRcvString(values) {
        let mulArr = null;
        if (Array.isArray(values)) {
            mulArr = [
                1,
                values[0] / 100,
                values[1] / 100,
            ];
        } else {
            mulArr = [
                (values.hp || 100) / 100,
                (values.atk || 100) / 100,
                (values.rcv || 100) / 100
            ];
        }
        const hasMul = mulArr.filter(m => m != 1); //不是1的数值
        let str = "";
        if (hasMul.length > 0) {
            const hasDiff = hasMul.filter(m => m != hasMul[0]).length > 0; //存在不一样的值
            if (hasDiff) {
                str += mulArr.map((m, i) => (m > 0 && m != 1) ? (mulName[i] + (m >= 1 ? `×${m}倍` : `变为${m*100}%`)) : null).filter(s => s != null).join("，");
            } else {
                let hasMulName = mulName.filter((n, i) => mulArr[i] != 1);
                if (hasMulName.length >= 3) {
                    str += hasMulName.slice(0, hasMulName.length - 1).join("、") + "和" + hasMulName[hasMulName.length - 1];
                } else {
                    str += hasMulName.join("和");
                }
                str += hasMul[0] >= 1 ? `×${hasMul[0]}倍` : `变为${hasMul[0]*100}%`;
            }
        } else {
            str += "能力值没有变化";
        }
        return str;
    }
    const mul = getFixedHpAtkRcvString;
    //技能介绍里的头像的切换
    function createBoard(boardData) {
        const table = document.createElement("table");
        table.className = "board fixed-shape-orb";
        //console.table(boardData);
        boardData.forEach((rowData, ri, rArr) => {
            const row = table.insertRow();
            if (ri == 2 && rArr.length > 5) row.classList.add("board-row4");

            rowData.forEach((orbType, ci, cArr) => {
                const cell = row.insertCell();
                cell.className = "orb-icon";
                if (orbType != null) {
                    cell.setAttribute("data-orb-icon", orbType);
                }
                if (ci == 3 && cArr.length > 6) cell.classList.add("board-cell5");
            });
        });
        table.onclick = function() {
            this.classList.toggle("board-76");
        };
        return table;
    }

    function boardData_fixed(dataArr, orbType) {
        const data = dataArr.map(flag => new Array(6).fill(null).map((a, i) => (1 << i & flag) ? (orbType || 0) : null));
        data.splice(3, 0, data[2].concat()); //将第2行复制插入为第3行
        data.forEach(rowData =>
            rowData.splice(4, 0, rowData[3]) //将第3个复制插入为第4个
        );
        return data;
    }

    function boardData_line(data) {
        data.splice(3, 0, data[2].concat()); //将第2行复制插入为第3行
        data.forEach(row => row.splice(3, 0, null)); //插入全空为第4个
        return data;
    }

    function boardData_row(data) {
        data.splice(2, 0, new Array(6).fill(null)); //插入全空为第3行
        data.forEach(row => row.splice(4, 0, row[3])); //将第3个复制插入为第4个
        return data;
    }

    let str = null;
    let strArr = null,
        fullColor = null,
        atSameTime = null,
        hasDiffOrbs = null;
    switch (type) {
        case 0:
            str = `对敌方全体造成自身攻击力×${sk[1]/100}倍的${attrN(sk[0])}属性伤害`;
            break;
        case 1:
            str = `对敌方全体造成${sk[1].bigNumberToString()}点${attrN(sk[0])}属性伤害`;
            break;
        case 2:
            str = `对敌方1体造成自身攻击力×${sk[0]/100}${sk[1]&&sk[1]!=sk[0]?'~'+sk[1]/100:''}倍的自身属性伤害`;
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
			str = `操作时间${sk[0]>0?`延长`:`减少`}${Math.abs(sk[0]/100)}秒`;
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
			str = `${sk[0]}回合内，敌方防御力减少${sk[1]}%`;
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
			str = `${sk[0]}回合内，${attrN(sk[1])}属性的伤害减少${sk[2]}%`;
			break;
		case 22: case 31:
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 23: case 30:
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的 HP ×${sk[sk.length-1]/100}倍`;
			break;
		case 24:
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 28:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 29: case 114:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的 HP、攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 33:
			str = `宝珠移动和消除的声音变成太鼓达人的音效`;
			break;
		case 35:
			str = `对敌方1体造成自身攻击力×${sk[0]/100}倍的自身属性伤害，并回复伤害${sk[1]}%的 HP`;
			break;
		case 36:
			str = `受到的${attrN(sk[0])}属性${sk[1]>=0?`和${attrN(sk[1])}属性`:""}的伤害减少${sk[2]}%`;
			break;
		case 37:
			str = `对敌方1体造成自身攻击力×${sk[1]/100}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 38:
			str = `HP ${sk[0] == 100?"全满":`${sk[0]}%以下`}时${sk[1]<100?`有${sk[1]}%的几率使`:""}受到的伤害减少${sk[2]}%`;
			break;
		case 39:
			strArr = [sk[1],sk[2]].filter(s=>s>0).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以下`}时所有宠物的${strArr.join("和")}×${sk[3]/100}倍`;
			break;
		case 40:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 41:
			str = `受到敌人攻击时${sk[0]==100?"":`有${sk[0]}的几率`}进行受到伤害${sk[1]/100}倍的${attrN(sk[2])}属性反击`;
			break;
		case 42:
			str = `对${attrN(sk[0])}属性敌人造成${sk[2].bigNumberToString()}点${attrN(sk[1])}属性伤害`;
			break;
		case 43:
			str = `HP ${sk[0]==100 ?"全满":`${sk[0]}%以上`}时${sk[1]<100?`有${sk[1]}%的几率使`:""}受到的伤害减少${sk[2]}%`;
			break;
		case 44:
			strArr = [sk[1],sk[2]].filter(s=>s>0).map(s=>{if(s==1) return "攻击力"; else if(s==2) return "回复力";});
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时所有宠物的${strArr.join("和")}×${sk[3]/100}倍`;
			break;
		case 45: case 111:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的 HP 和攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 46:case 48:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的 HP ${sk[sk.length-1]/100}倍`;
			break;
		//case 48:见上
		case 49:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 50:
			str = `${sk[0]}回合内，${(sk[1]==5?"回复力":`${attrN(sk[1])}属性的攻击力`)}${sk[2]>0?`×${sk[2]/100}倍`:"变为0"}`;
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
			str = `对敌方1体造成${sk[0].bigNumberToString()}点无视防御的固定伤害`;
			break;
		case 56:
			str = `对敌方全体造成${sk[0].bigNumberToString()}点无视防御的固定伤害`;
			break;
		case 58:
			str = `对敌方全体造成自身攻击力×${sk[1]/100}${sk[2]&&sk[2]!=sk[1]?'~'+sk[2]/100:''}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 59:
			str = `对敌方1体造成自身攻击力×${sk[1]/100}${sk[2]&&sk[2]!=sk[1]?'~'+sk[2]/100:''}倍的${attrN(sk[0])}属性伤害`;
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
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的 HP 和攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 63:
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的 HP 和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 64: case 79:
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 65:
			str = `${sk.slice(0,sk.length-1).map(t=>typeN(t)).join("、")}类型宠物的 HP、攻击力和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 66:
			str = `${sk[0]}连击以上所有宠物的攻击力${sk[1]/100}倍`;
			break;
		case 67:
			str = `${sk.slice(0,sk.length-1).map(t=>attrN(t)).join("、")}属性宠物的 HP 和回复力×${sk[sk.length-1]/100}倍`;
			break;
		case 69:
			str = `${attrN(sk[0])}属性和${typeN(sk[1])}类型宠物的攻击力×${sk[2]/100}倍`;
			break;
		case 71:
			//这个类型，所有颜色是直接显示的，但是最后一位有个-1表示结束
			let attrArr = sk.includes(-1) ? sk.slice(0,sk.indexOf(-1)) : sk;
			strArr = [];
			strArr.push(`全画面的宝珠变成${attrArr.map(o=>attrN(o)).join("、")}`);

			const rowC = 5, columC = 6;
			let valueArray = new Uint8Array(rowC * columC);
			window.crypto.getRandomValues(valueArray); //获取符合密码学要求的安全的随机值
			valueArray = Array.from(valueArray.map(x => attrArr[x % attrArr.length])); //用所有宝珠填充
			//之后用每种颜色填充前3个
			attrArr.forEach((attr,idx)=>{
				valueArray.fill(attr, idx * 3, idx * 3 + 3);
			});

			//将上方数据重新乱序排列
			let dataArray = [];
			while(valueArray.length > 0)
			{
				dataArray.push(valueArray.splice(Math.randomInteger(valueArray.length - 1),1));
			}
			
			//创建版面数据，依次填入
			var data = new Array(5).fill(null).map(()=>new Array(6).fill(null));

			let da = dataArray.entries();
			for (let ri=0;ri<rowC;ri++)
			{
				for (let ci=0;ci<columC;ci++)
				{
					let v = da.next().value;
					if (v == undefined)
					{
						atrr = attrArr.entries();
						v = atrr.next().value;
					}
					data[ri][ci] = v[1];
				}
			}

			data = boardData_row(data);
			fragment.appendChild(document.createTextNode(strArr.join("，")));
			var table = createBoard(data);
			fragment.appendChild(table);
			return fragment;
			break;
		case 73:
			str = `${getAttrTypeString([sk[0]],[sk[1]])}宠物的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[2]})}`;
			break;
		case 75:
			str = `${getAttrTypeString([sk[0]],[sk[1]])}宠物的${getFixedHpAtkRcvString({atk:sk[2],rcv:sk[2]})}`;
			break;
		case 76:
			str = `${getAttrTypeString([sk[0]],[sk[1]])}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[2],rcv:sk[2]})}`;
			break;
		case 84:
			str = `HP ${(sk[3]?(`减少${100-sk[3]}%`):"变为1")}，对敌方1体造成自身攻击力×${sk[1]/100}${sk[2]&&sk[2]!=sk[1]?'~'+sk[2]/100:''}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 85:
			str = `HP ${(sk[3]?(`减少${100-sk[3]}%`):"变为1")}，对敌方全体造成自身攻击力×${sk[1]/100}${sk[2]&&sk[2]!=sk[1]?'~'+sk[2]/100:''}倍的${attrN(sk[0])}属性伤害`;
			break;
		case 86:
			str = `HP ${(sk[3]?(`减少${100-sk[3]}%`):"变为1")}，对敌方1体造成${sk[1].bigNumberToString()}点${attrN(sk[0])}属性伤害`;
			if (sk[2]) str += `未知 参数2 ${sk[2]}`;
			break;
		case 87:
			str = `HP ${(sk[3]?(`减少${100-sk[3]}%`):"变为1")}，对敌方全体造成${sk[1].bigNumberToString()}点${attrN(sk[0])}属性伤害`;
			if (sk[2]) str += `未知 参数2 ${sk[2]}`;
			break;
		case 88:
			str = `${sk[0]}回合内，${typeN(sk[1])}类型的攻击力×${sk[2]/100}倍`;
			break;
		case 90:
			strArr = sk.slice(1,-1);
			str = `${sk[0]}回合内，${strArr.filter(sk=>sk<5).map(attrN).join("、")}属性的攻击力${strArr.includes(5)?'、回复力':''}×${sk[sk.length-1]/100}倍`;
			break;
		case 91:
			str = `${sk.slice(0,-1).map(attrN).join("、")}属性宝珠强化`;
			if (sk[sk.length-1] != 6) str += `未知 参数${sk.length-1} ${sk[sk.length-1]}`;
			break;
		case 92:
			strArr = sk.slice(1,-1);
			str = `${sk[0]}回合内，${strArr.map(typeN).join("、")}类型的攻击力×${sk[sk.length-1]/100}倍`;
			break;
		case 93:
			str = `将自己换成队长，再次使用此技能则换为原来的队长。`;
			if (sk[0]) str += `未知 参数0 ${sk[0]}`;
			break;
		case 94:
			strArr = [sk[2],sk[3]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以下`}时${attrN(sk[1])}属性宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 95:
			strArr = [sk[2],sk[3]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以下`}时${typeN(sk[1])}类型宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 96:
			strArr = [sk[2],sk[3]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时${attrN(sk[1])}属性宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 97:
			strArr = [sk[2],sk[3]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时${typeN(sk[1])}类型宠物的${strArr.join("和")}×${sk[4]/100}倍`;
			break;
		case 98:
			str = `${sk[0]}连击时，所有宠物的攻击力${sk[1]/100}倍，每多1连击+${sk[2]/100}倍，最大${sk[3]}连击时${(sk[1]+sk[2]*(sk[3]-sk[0]))/100}倍`;
			break;
		case 100:
			strArr = [sk[0],sk[1]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
			str = `使用技能时，所有宠物的${strArr.join("和")}×${sk[2]/100}倍`;
			break;
		case 101:
			str = `刚刚好${sk[0]}连击时，所有宠物的${getFixedHpAtkRcvString({atk:sk[1]})}`;
			break;
		case 103:
			strArr = [sk[1],sk[2]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
			str = `${sk[0]}连击或以上时所有宠物的${strArr.join("和")}×${sk[3]/100}倍`;
			break;
		case 104:
			strArr = [sk[2],sk[3]].filter(s=>s>0).map(s=>s==1?"攻击力":"回复力");
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
			if (sk[1])
			str += `，${getAttrTypeString(flags(sk[1]),null)}宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			break;
		case 108:
			str = `所有宠物的${getFixedHpAtkRcvString({hp:sk[0]})}，${typeN(sk[1])}类型宠物的攻击力×${sk[2]/100}倍`;
			break;
		case 109:
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2]) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			break;
		case 110:
			str = `根据余下 HP 对敌方${sk[0] || "全"}体造成${attrN(sk[1])}属性伤害（100% HP 时为自身攻击力×${sk[2]/100}倍，1 HP 时为自身攻击力×${sk[3]/100}倍）`;
			break;
		//case 111: 在45
		//case 114: 在29
		case 115:
			str = `对敌方1体造成自身攻击力×${sk[1]/100}倍的${attrN(sk[0])}属性伤害，并回复伤害${sk[2]}%的 HP `;
			break;
		case 116: //多内容主动技能，按顺序组合发动如下主动技能：
			var ul = fragment.appendChild(document.createElement("ul"));
			ul.className = "active-skill-ul";
			//处理多次单人固伤
			let repeatSkill = sk.filter(subSkill => Skills[subSkill].type == 188);
			let repeatDamage = repeatSkill.map(subSkill => Skills[subSkill].params[0]);
			let noRepeatSk;
			if (repeatSkill.length>1 &&
				repeatDamage.every((dmg,idx,arr) => dmg === arr[0])
			){
				const li = ul.appendChild(document.createElement("li"))
				li.className = "active-skill-li";
				li.setAttribute("data-skillid", repeatSkill[0]);
				li.addEventListener("click",fastShowSkill);
				li.appendChild(parseSkillDescription(Skills[repeatSkill[0]]));
				li.appendChild(document.createTextNode(`×${repeatSkill.length}次（共${(repeatDamage[0]*repeatSkill.length).bigNumberToString()}）`));
				noRepeatSk = sk.filter(subSkill => Skills[subSkill].type !== 188);
			}else
			{
				noRepeatSk = sk;
			}

			noRepeatSk.forEach(subSkill => {
				const li = ul.appendChild(document.createElement("li"))
				li.className = "active-skill-li";
				li.setAttribute("data-skillid", subSkill);
				li.addEventListener("click",fastShowSkill);
				li.appendChild(parseSkillDescription(Skills[subSkill]));
			});
			return fragment;
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
			fragment.appendChild(document.createTextNode("随机发动以下技能："));
			var ul = fragment.appendChild(document.createElement("ul"));
			ul.className = "active-skill-ul random-active-skill";
			sk.forEach(subSkill => {
				const li = ul.appendChild(document.createElement("li"))
				li.className = "active-skill-li";
				li.setAttribute("data-skillid", subSkill);
				li.addEventListener("click",fastShowSkill);
				li.appendChild(parseSkillDescription(Skills[subSkill]));
			});
			return fragment;
			break;
		case 119: //相連消除4個的水寶珠時，所有寵物的攻擊力2.5倍，每多1個+0.5倍，最大5個時3倍
			str = `相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0],true)}宝珠时，所有宠物的攻击力${sk[2]/100}倍`;
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
			strArr = sk.slice(0,5).filter(c=>c>0); //最多5串珠
			hasDiffOrbs = strArr.filter(s=>s!= strArr[0]).length > 0; //是否存在不同色的珠子
			if (sk[5] < strArr.length) //有阶梯的
			{
				if (hasDiffOrbs)
				{//「光光火/光火火」組合的3COMBO時，所有寵物的攻擊力3.5倍；「光光火火」組合的4COMBO或以上時，所有寵物的攻擊力6倍 
					str = `${strArr.map(a=>nb(a, attrsName)).join("、")}中${sk[5]}串同时攻击时，所有宠物的攻击力×${sk[6]/100}倍，每多1串+${sk[7]/100}倍，最大${strArr.length}串时×${(sk[6]+sk[7]*(strArr.length-sk[5]))/100}倍`;
				}else
				{//木寶珠有2COMBO時，所有寵物的攻擊力3倍，每多1COMBO+4倍，最大5COMBO時15倍 
					str = `${nb(strArr[0], attrsName).join("、")}宝珠有${sk[5]}串时，所有宠物的攻击力×${sk[6]/100}倍，每多1串+${sk[7]/100}倍，最大${strArr.length}串时×${(sk[6]+sk[7]*(strArr.length-sk[5]))/100}倍`;
				}
			}else
			{
				if (hasDiffOrbs)
				{//火光同時攻擊時，所有寵物的攻擊力2倍
					str = `${strArr.map(a=>nb(a, attrsName)).join("、")}同时攻击时，所有宠物的攻击力×${sk[6]/100}倍`;
				}else
				{//光寶珠有2COMBO或以上時，所有寵物的攻擊力3倍
					str = `${nb(strArr[0], attrsName).join("、")}宝珠有${sk[5]}串或以上时，所有宠物的攻击力×${sk[6]/100}倍`;
				}
			}
			break;
		case 125: //隊伍中同時存在 時，所有寵物的攻擊力3.5倍
			let needMons = sk.slice(0,5).filter(s=>s>0);
			fragment.appendChild(document.createTextNode(`队伍中${needMons.length>1?"同时":""}存在`));
			needMons.forEach(mid=>{
				let cardDom = cardN(mid);
				cardDom.monDom.onclick = changeToIdInSkillDetail;
				fragment.appendChild(cardDom);
			});
			fragment.appendChild(document.createTextNode(`时，所有宠物的${getFixedHpAtkRcvString({hp:sk[5],atk:sk[6],rcv:sk[7]})}`));
			return fragment;
			break;
		case 126:
			str = `${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}回合内，${nb(sk[0], attrsName).join("、")}宝珠的掉落率提高${sk[3]}%`;
			break;
		case 127: //生成竖列
			strArr = [];
			var data = new Array(5).fill(null).map(()=>new Array(6).fill(null));
			for (let ai=0;ai<sk.length;ai+=2)
			{
				strArr.push(`${nb(sk[ai],ClumsN).join("、")}的宝珠变为${nb(sk[ai+1],attrsName).join("、")}`);

				const orbType = flags(sk[ai+1])[0];
				flags(sk[ai]).forEach(line=>
					data.forEach(row=>row[line] = orbType)
				);
			}
			data = boardData_line(data);
			fragment.appendChild(document.createTextNode(strArr.join("，")));
			var table = createBoard(data);
			fragment.appendChild(table);
			return fragment;
			break;
		case 128: //生成横
			strArr = [];
			var data = new Array(5).fill(null).map(()=>new Array(6).fill(null));
			for (let ai=0;ai<sk.length;ai+=2)
			{
				strArr.push(`${nb(sk[ai],RowsN).join("、")}的宝珠变为${nb(sk[ai+1],attrsName).join("、")}`);

				const orbType = flags(sk[ai+1])[0];
				flags(sk[ai]).forEach(row=>
					data[row] = new Array(6).fill(orbType)
				);
			}
			data = boardData_row(data);
			fragment.appendChild(document.createTextNode(strArr.join("，")));
			var table = createBoard(data);
			fragment.appendChild(table);
			return fragment;
			break;
		case 129:
			str = "";
			if (sk[0] || sk[1]) str += `${getAttrTypeString(flags(sk[0]),flags(sk[1]))}宠物`;
			if (sk[2] || sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `${str.length>0?"，":""}受到的${getAttrTypeString(flags(sk[5]))}属性伤害减少${sk[6]}%`;
			break;
		case 130:
			str = `HP ${sk[0]}%以下时`;
			if (sk[1] || sk[2]) str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${getAttrTypeString(flags(sk[5]))}属性伤害减少${sk[6]}%`;
			break;
		case 131:
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时`;
			if (sk[1] || sk[2]) str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${getAttrTypeString(flags(sk[5]))}属性伤害减少${sk[6]}%`;
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
			var ul = fragment.appendChild(document.createElement("ul"));
			ul.className = "leader-skill-ul";
			sk.forEach(subSkill => {
				const li = ul.appendChild(document.createElement("li"))
				li.className = "leader-skill-li";
				li.setAttribute("data-skillid", subSkill);
				li.addEventListener("click",fastShowSkill);
				li.appendChild(parseSkillDescription(Skills[subSkill]));
			});
			return fragment;
			break;
		case 139:
			str = ``;
			strArr =[];
			str += getAttrTypeString(flags(sk[0]),flags(sk[1])) + "宠物的";
			str += ` HP ${sk[3]?`${sk[2]}%以下`:(sk[2]==100?`全满`:`${sk[2]}%以上`)}时攻击力${getFixedHpAtkRcvString({atk:sk[4]})}`;
			if (sk[5] != undefined) str += `，HP ${sk[3]?(sk[6]?`${sk[2]}%~${sk[5]}%`:`${sk[5]}%以上`):(sk[6]?`${sk[5]}%以下`:(sk[2]==100?`${sk[5]}以上`:`${sk[5]}%~${sk[2]}%`))}时攻击力${getFixedHpAtkRcvString({atk:sk[7]})}`;
			break;
		case 140:
			str = `${getOrbsAttrString(sk[0])}宝珠强化（每颗强化珠伤害/回复增加${sk[1]}%）`;
			break;
		case 141:
			str = `${sk[2]?`${getOrbsAttrString(sk[2])}以外`:""}随机生成${getOrbsAttrString(sk[1])}宝珠各${sk[0]}个`;
			break;
		case 142:
			str = `${sk[0]}回合内，自身的属性变为${attrN(sk[1])}`;
			break;
		case 143:
			str = `对敌方全体造成队伍总 HP×${sk[0]/100}倍的${attrN(sk[1])}属性伤害`;
			break;
		case 144:
			str = `对敌方${sk[2] || "全"}体造成${nb(sk[0],attrsName).join("、")}属性总攻击力×${sk[1]/100}倍的${attrN(sk[3])}属性伤害`;
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
			str = `以十字形式消除5个${attrN(5)}宝珠时`;
			if (sk[0] || sk[1]) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[0],rcv:sk[1]})}`;
			if (sk[2]) str += `，受到的伤害减少${sk[2]}%`;
			break;
		case 152:
			str = `将${getOrbsAttrString(sk[0])}宝珠锁定`;
			if (sk[1] < 42) str += `${sk[1]}个`;
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
			awokenArr = sk.slice(1,4).filter(s=>s>0);
			fragment.appendChild(document.createTextNode(`${sk[0]?`${sk[0]}回合内，`:""}根据队伍内觉醒技能`));
			awokenArr.forEach((aid,idx,arr)=>{
				const icon = fragment.appendChild(document.createElement("icon"));
				icon.className ="awoken-icon";
				icon.setAttribute("data-awoken-icon",aid);
				icon.title = awokenN(aid);
				if (idx < arr.length-1) icon.insertAdjacentText('afterend', "、");;
			});
			fragment.appendChild(document.createTextNode(`的数目`));
			if (sk[4]==1)
				fragment.appendChild(document.createTextNode(`回复 HP ，每个觉醒回复自身回复力的${sk[5]/100}倍`));
			else if (sk[4]==2)
				fragment.appendChild(document.createTextNode(`提升所有属性的攻击力，每个觉醒可以提升${sk[5]-100}%`));
			else if (sk[4]==3)
				fragment.appendChild(document.createTextNode(`减少受到的伤害，每个觉醒可以减少${sk[5]}%`));
			else
				fragment.appendChild(document.createTextNode(`宝石姬技能，未知buff类型 参数[4]：${sk[4]}`));
			return fragment;
			break;
		case 157:
			fullColor = [sk[0],sk[2],sk[4]].filter(s=>s!=null);
			strArr = [sk[1],sk[3],sk[5]].filter(s=>s>0);
			hasDiffOrbs = strArr.filter(c=>c != strArr[0]).length > 0;
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
			str = `<span class="spColor">每组${sk[0]}珠或以上才能消除</span>`;
			if (sk[1] || sk[2])
			str += "，" + getAttrTypeString(flags(sk[1]),flags(sk[2])) + "宠物的" + getFixedHpAtkRcvString({atk:sk[3],hp:sk[4],rcv:sk[5]});
			break;
		case 159:
			//"相連消除5個或以上的火寶珠或光寶珠時攻擊力和回復力4倍，每多1個+1倍，最大7個時6倍；"
			str = `相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0])}宝珠时，所有宠物的`;
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
			if (sk[2] || sk[3] || sk[4]) str += "的"+getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]}) + "，";
			if (sk[5] || sk[6]) str += `受到的${getAttrTypeString(flags(sk[5]))}伤害减少${sk[6]}%`;
			break;
		case 164:
			fullColor = sk.slice(0,4).filter(c=>c>0); //最多4串珠
			hasDiffOrbs = fullColor.filter(s=>s!= fullColor[0]).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (sk[4] < fullColor.length) //有阶梯的
			{
				if (hasDiffOrbs)
				{//「光光火/光火火」組合的3COMBO時，所有寵物的攻擊力3.5倍；「光光火火」組合的4COMBO或以上時，所有寵物的攻擊力6倍 
					str = `${fullColor.map(a=>nb(a, attrsName)).join("、")}中${sk[4]}串同时攻击时，所有宠物的攻击力和回复力×${sk[5]/100}倍，每多1串+${sk[7]/100}倍，最大${fullColor.length}串时×${(sk[6]+sk[7]*(fullColor.length-sk[4]))/100}倍`;
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
					str = `${fullColor.map(a=>nb(a, attrsName)).join("、")}同时攻击时，所有宠物的`;
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
					strArr.push(`最大${sk[1]+sk[6]}种属性时×${(sk[2]+sk[4]*sk[6])/100}倍`);
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
						strArr.push(`最大${sk[1]+sk[6]}种属性时×${(sk[2]+sk[4]*sk[6])/100}倍`);
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
						strArr.push(`最大${sk[1]+sk[6]}种属性时×${(sk[3]+sk[5]*sk[6])/100}倍`);
					}
				}
			}
			str += strArr.join("，");
			break;
		case 166:
			str = `${sk[0]}连击时，所有宠物的`;
			strArr = [];
			let scale_diff = sk[5] - sk[0];
			if (sk[1]==sk[2] && sk[3] == sk[4])
			{
				strArr.push(`攻击力和回复力×${sk[1]/100}倍`);
				if (sk[3]>0)
				{
					strArr.push(`每多1种属性+${sk[3]/100}倍`);
				}
				if (scale_diff)
				{
					strArr.push(`最大${sk[5]}种属性时×${(scale_diff*sk[1]+sk[3])/100}倍`);
				}
			}else
			{
				if (sk[1] && sk[1] !== 100)
				{
					strArr.push(`攻击力×${sk[1]/100}倍`);
					if (sk[3]>0)
					{
						strArr.push(`每多1种属性+${sk[3]/100}倍`);
					}
					if (scale_diff)
					{
						strArr.push(`最大${sk[5]}种属性时×${(scale_diff*sk[1]+sk[3])/100}倍`);
					}
				}
				if (sk[2] && sk[2] !== 100)
				{
					strArr.push(`回复力×${sk[2]/100}倍`);
					if (sk[4]>0)
					{
						strArr.push(`每多1种属性+${sk[4]/100}倍`);
					}
					if (scale_diff)
					{
						strArr.push(`最大${sk[5]}种属性时×${(scale_diff*sk[2]+sk[4])/100}倍`);
					}
				}
			}
			str += strArr.join("，");
			break;
		case 167:
			//"相連消除5個或以上的火寶珠或光寶珠時攻擊力和回復力4倍，每多1個+1倍，最大7個時6倍；"
			str = `相连消除${sk[1]}个或以上${getOrbsAttrString(sk[0],true)}宝珠时，所有宠物的`;
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
				if (sk[2] && sk[2] !== 100)
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
				if (sk[3] && sk[3] !== 100)
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
			str = `${sk[0]?`${sk[0]}回合内，`:""}根据队伍内觉醒技能 ${strArr.filter(s=>s>0).map(s=>awokenN(sk[1])).join("、")} 的数目`;
			str += `提升所有属性的攻击力，每个觉醒可以提升${sk[7]}%`;
			break;
		case 169: //5COMBO或以上時受到的傷害減少25%、攻擊力6倍；
			str = `${sk[0]}连击或以上时`;
			if (sk[1] && sk[1] !== 100) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[1]})}`;
			if (sk[2]) str += `，受到的伤害减少${sk[2]}%`;
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
			if (sk[2] && sk[2] !== 100) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			if (sk[3]) str += `，受到的伤害减少${sk[3]}%`;
			break;
		case 171:
			fullColor = sk.slice(0,4).filter(c=>c>0); //最多4串珠
			hasDiffOrbs = fullColor.filter(s=>s!= fullColor[0]).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (hasDiffOrbs)
			{//木暗同時攻擊時，所有寵物的攻擊力和回復力2倍
				str = `${fullColor.map(a=>nb(a, attrsName)).join("、")}${sk[4] < fullColor.length?`中有${sk[4]}串`:""}同时攻击时`;
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
			str = `${sk[0]}回合内，敌人的${strArr.join("、")}无效化`;
			break;
		case 175: //隊員編成均為「マガジン」合作活動角色時，所有寵物的攻擊力8倍
			let needCollabs = sk.slice(0,3).filter(s=>s>0); //最多3种id
			fragment.appendChild(document.createTextNode(`队员组成全是`));
			
			//搜索并显示合作
			function searchCollab(event) {
				const collabId = parseInt(this.getAttribute('data-collabId'), 10);
				showSearch(Cards.filter(card => card.collabId == collabId));
			}

			needCollabs.forEach((cid,idx,arr)=>{
				const lnk = fragment.appendChild(document.createElement("a"));
				lnk.className ="detail-search monster-collabId";
				lnk.setAttribute("data-collabId",cid);
				lnk.onclick = searchCollab;
				lnk.textContent = cid;
				if (idx < arr.length-1) lnk.insertAdjacentText('afterend', "、");;
			});
			fragment.appendChild(document.createTextNode(`合作角色时，所有宠物的${getFixedHpAtkRcvString({hp:sk[3],atk:sk[4],rcv:sk[5]})}`));
			return fragment;
			break;
		case 176:
		//●◉○◍◯
			fragment.appendChild(document.createTextNode(`以如下形状生成${attrN(sk[5])}宝珠`));
			var data = boardData_fixed([sk[0],sk[1],sk[2],sk[3],sk[4]], sk[5]);
			var table = createBoard(data);
			table.classList.add("fixed-shape-orb");
			fragment.appendChild(table);
			return fragment;
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
			str = `${sk[0]}回合内，每回合回复${sk[1]?`${sk[1].bigNumberToString()}点`:` HP 上限 ${sk[2]}%`}的 HP`;
			if(sk[3] || sk[4])
			{
				str += `，并将`;
				strArr = [];
				if(sk[3]>0) strArr.push(`封锁状态减少${sk[3]}回合`);
				if(sk[4]>0) strArr.push(`觉醒无效状态减少${sk[4]}回合`);
				str += strArr.join("，");
			}
			break;
		case 180:
			str = `${sk[0]}回合内，${sk[1]}%概率掉落强化宝珠`;
			break;
		case 182:
			str = `相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2] && sk[2] !== 100) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			if (sk[3]) str += `，受到的伤害减少${sk[3]}%`;
			break;
		case 183:
			str = getAttrTypeString(flags(sk[0]),flags(sk[1])) + "宠物的";
			if (sk[3] || sk[4]) str+= ` HP ${sk[2]==100?"全满":`${sk[2]}%以上`}时`; 
			if (sk[3] && sk[3] !== 100) str+= `${getFixedHpAtkRcvString({atk:sk[3]})}`; 
			if (sk[4]) str += `，受到的伤害减少${sk[4]}%`;
			if (sk[6] || sk[7]) str+= ` HP ${sk[5]||sk[2]}%以下时`;
			if (sk[6] || sk[7]) str+= `${getFixedHpAtkRcvString({atk:sk[6],rcv:sk[7]})}`;
			//if (sk[7]) str+= `，受到的伤害减少${sk[7]}%`;
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
		case 188: //多次单体固伤
			str = `对敌方1体造成${sk[0].bigNumberToString()}点无视防御的固定伤害`;
			break;
		case 189: 
		//解除寶珠的鎖定狀態；所有寶珠變成火、水、木、光；顯示3COMBO的轉珠路徑（只適用於普通地下城＆3個消除）
			str = `解除宝珠的锁定状态；所有宝珠变成火、水、木、光；显示3连击的转珠路径（只适用于普通地下城 & 3珠消除）`;
			break;
		case 191:
			str = `${sk[0]}回合内，可以贯穿伤害无效盾`;
			break;
		case 192:
			//相連消除9個或以上的火寶珠時攻擊力4倍、結算增加2COMBO
			//同時消除光寶珠和水寶珠各4個或以上時攻擊力3倍、結算增加1COMBO；
			fullColor = nb(sk[0], attrsName);
			str = fullColor.length>1?"同时":"相连";
			str += `消除${sk[1]}个或以上的${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2] && sk[2] != 100) str += `，所有宠物的攻击力×${sk[2]/100}倍`;
			if (sk[3]) str += `，结算时连击数+${sk[3]}`;
			break;
		case 193:
			fullColor = nb(sk[0], attrsName);
			str = `以L字形消除5个${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[1] && sk[1] != 100 || sk[2] && sk[2] != 100) str+=`，所有宠物的${getFixedHpAtkRcvString({atk:sk[1],rcv:sk[2]})}`;
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
			if (sk[2] && sk[2] != 100) str += `，所有宠物的${getFixedHpAtkRcvString({atk:sk[2]})}`;
			if (sk[3]) str += `，结算时连击数+${sk[3]}`;
			break;
		case 195:
			str = `HP ${(sk[0]?(`减少${100-sk[0]}%`):"变为1")}`;
			break;
		case 196:
			str = `无法消除宝珠状态减少${sk[0]}回合`;
			break;
		case 197: //消除毒/猛毒宝珠时不会受到毒伤害
			str = `消除${getOrbsAttrString(1<<7|1<<8)}宝珠时不会受到毒伤害`;
			break;
		case 198:
			//以回復寶珠回復40000HP或以上時，受到的傷害減少50%
			str = `以回复宝珠回复${sk[0].bigNumberToString()}点或以上时`;
			if (sk[1] && sk[1] != 100) str += `所有宠物的${getFixedHpAtkRcvString({atk:sk[1]})}`;
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
			str += `同时攻击时，追加${sk[2].bigNumberToString()}点固定伤害`;
			break;
		case 200:
			str = `相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0],true)}宝珠时，追加${sk[2].bigNumberToString()}点固定伤害`;
			break;
		case 201:
			fullColor = sk.slice(0,4).filter(c=>c>0); //最多4串珠
			hasDiffOrbs = fullColor.filter(s=>s!= fullColor[0]).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (hasDiffOrbs)
			{//木暗同時攻擊時
				str = `${fullColor.map(a=>nb(a, attrsName)).join("、")}${sk[4] < fullColor.length?`中有${sk[4]}串`:""}同时攻击时`;
			}else
			{//光寶珠有2COMBO或以上時
				str = `${nb(fullColor[0], attrsName).join("、")}宝珠有${sk[4]}串或以上时`;
			}
			if (sk[5]) str += `，追加${sk[5].bigNumberToString()}点固定伤害`;
			break;
		case 202:
			fragment.appendChild(document.createTextNode("变身为"));
			let cardDom = cardN(sk[0]);
			cardDom.monDom.onclick = changeToIdInSkillDetail;
			fragment.appendChild(cardDom);
			return fragment;
			break;
		case 203:
			fragment.appendChild(document.createTextNode(`队员组成全是`));
			const lnk = fragment.appendChild(document.createElement("a"));
			lnk.className ="detail-search";
			if (sk[0] === 0)
			{
				lnk.textContent = "像素进化";
				lnk.onclick = function(){
					showSearch(Cards.filter(card=>card.evoMaterials.includes(3826)));
				};
			}else if (sk[0] === 2)
			{
				lnk.textContent = "转生或超转生";
				lnk.onclick = function(){
					showSearch(Cards.filter(card=>isReincarnated(card)));
				};
			}else
				lnk.textContent = "未知新类型";

			fragment.appendChild(document.createTextNode(`时，所有宠物的${getFixedHpAtkRcvString({hp:sk[1],atk:sk[2],rcv:sk[3]})}`));
			return fragment;
			break;
		case 205:
			str = `${sk[1]}回合内，${getOrbsAttrString(sk[0])}宝珠会以锁定形式掉落`;
			break;
		case 206:
			fullColor = sk.slice(0,5).filter(c=>c>0); //最多5串珠
			hasDiffOrbs = fullColor.filter(s=>s!= fullColor[0]).length > 0; //是否存在不同色的珠子
			strArr = [];
			if (hasDiffOrbs)
			{//木暗同時攻擊時
				str = `${fullColor.map(a=>nb(a, attrsName)).join("、")}${sk[5] < fullColor.length?`中有${sk[5]}串`:""}同时攻击时`;
			}else
			{//光寶珠有2COMBO或以上時
				str = `${nb(fullColor[0], attrsName).join("、")}宝珠有${sk[5]}串或以上时`;
			}
			if (sk[6]) str += `，结算时连击数+${sk[6]}`;
			break;
		case 207:
			fragment.appendChild(document.createTextNode(`${sk[0]}回合内，`));
			if (sk[7])
			{
				fragment.appendChild(document.createTextNode(`随机${sk[7]}个位置上的宝珠，`));
			}else
			{
				fragment.appendChild(document.createTextNode(`以下位置上的宝珠，`));
			}
			fragment.appendChild(document.createTextNode(`每隔${Math.abs(sk[1]/100)}秒不断转换`));
			if (!sk[7])
			{
				var data = boardData_fixed([sk[2],sk[3],sk[4],sk[5],sk[6]], 6);
				var table = createBoard(data);
				table.classList.add("fixed-shape-orb");
				fragment.appendChild(table);
			}
			return fragment;
			break;
		case 208:
			str = `${sk[2]?`${getOrbsAttrString(sk[2])}以外`:""}随机生成${getOrbsAttrString(sk[1])}宝珠各${sk[0]}个`;
			str += `，${sk[5]?`${getOrbsAttrString(sk[5])}以外`:""}随机生成${getOrbsAttrString(sk[4])}宝珠各${sk[3]}个`;
			break;
		case 209: //十字心+C
			str = `以十字形式消除5个${attrN(5)}宝珠时`;
			if(sk[0]) str += `，结算时连击数+${sk[0]}`;
			break;
		case 210: //十字属性珠+C
			str = `以十字形式消除5个${getOrbsAttrString(sk[0])}属性宝珠，当消除N个十字时，结算时连击数+${sk[2]>1?sk[2]:""}N`;
			if (sk[1]) str += `未知的参数${sk[1]}`;
			break;
		case 214: //封自己的技能
			str = `${sk[0]}回合内，玩家自身队伍无法使用主动技能`;
			break;
		default:
			str = `未知的技能类型${type}(No.${id})`;
			//开发部分
			//const copySkill = JSON.parse(JSON.stringify(skill));
			//copySkill.params = copySkill.params.map(p=>[p,getBooleanFromBinary(p).join("")]);
			console.log(`未知的技能类型${type}(No.${id})`,findFullSkill(skill));
			break;
	}
	const span = fragment.appendChild(document.createElement("span"));
	span.innerHTML = str;
	//(skill.description.length?(descriptionToHTML(skill.description) + "<hr>"):"") + str
	return fragment;
}

//增加特殊搜索模式
(function() {
	'use strict';
	//返回卡片的队长技能
	function getCardLeaderSkill(card, skillTypes, searchRandom = true)
	{
		return getActuallySkill(Skills[card.leaderSkillId], skillTypes, searchRandom);
	}
	//返回卡片的技能
	function getCardActiveSkill(card, skillTypes, searchRandom = true)
	{
		return getActuallySkill(Skills[card.activeSkillId], skillTypes, searchRandom);
	}
	//返回卡片的技能
	function getCardSkill(card, skillTypes, searchRandom = true, skillGreatType = 0)
	{
		switch(skillGreatType)
		{
			case 1:
			case "leader":
				return getCardLeaderSkill(card, skillTypes, searchRandom);
			case 2:
			case "active":
				return getCardActiveSkill(card, skillTypes, searchRandom);
			default:
				return getCardLeaderSkill(card, skillTypes, searchRandom) || getCardActiveSkill(card, skillTypes, searchRandom)
		}
	}
	//查找到真正起作用的那一个技能
	function getActuallySkill(skill, skillTypes, searchRandom = true)
	{
		if (skillTypes.includes(skill.type))
		{
			return skill;
		}else if (skill.type == 116 || (searchRandom && skill.type == 118) || skill.type == 138)
		{
			const subSkills = skill.params.map(id=>Skills[id]);
			for(let i = 0;i < subSkills.length; i++)
			{ //因为可能有多层调用，特别是随机118再调用组合116的，所以需要递归
				let foundSubSkill = getActuallySkill(subSkills[i], skillTypes, searchRandom);
				if (foundSubSkill)
				{
					return foundSubSkill;
				}
			}
			return null;
		}else
		{
			return null;
		}
	}
	//获取血倍率
	function getHPScale(ls)
	{
		const sk = ls.params;
		let scale = 1;
		switch (ls.type)
		{
			case 23: case 30: case 62: case 77: case 63: case 65:
			case 29: case 114: case 45: case 111: case 46: case 48: case 67:
				scale = sk[sk.length-1]/100;
				break;
			case 73: case 76:
			case 121: case 129: case 163: case 186:
			case 155:
				scale = sk[2]/100;
				break;
			case 106: case 107: case 108:
				scale = sk[0]/100;
				break;
			case 125:
				scale = sk[5]/100;
				break;
			case 136:
			case 137:
				scale = (sk[1]/100 || 1) * (sk[5]/100 || 1);
				break;
			case 158:
				scale = sk[4]/100;
				break;
			case 175:
			case 178: case 185:
				scale = sk[3]/100;
				break;
			case 203:
				scale = sk[1]/100;
				break;
			case 138: //调用其他队长技
				scale = sk.reduce((pmul,skid)=>pmul * getHPScale(Skills[skid]),1);
				break;
			default:
		}
		return scale || 1;
	}
	//获取盾减伤比例
	function getReduceScale(ls, allAttr = false, noHPneed = false)
	{
		const sk = ls.params;
		let scale = 0;
		switch (ls.type)
		{
			case 16: //无条件盾
				scale = sk[0]/100;
				break;
			case 17: //单属性盾
				scale = allAttr ? 0 : sk[1]/100;
				break;
			case 36: //2个属性盾
				scale = allAttr ? 0 : sk[2]/100;
				break;
			case 38: //血线下 + 几率
			case 43: //血线上 + 几率
				scale = (noHPneed || allAttr) ? 0 : sk[2]/100;
				break;
			case 129: //无条件盾，属性个数不固定
			case 163: //无条件盾，属性个数不固定
				scale = (allAttr && (sk[5] & 31) != 31) ? 0 : sk[6]/100;
				break;
			case 130: //血线下 + 属性个数不固定
			case 131: //血线上 + 属性个数不固定
				scale = (noHPneed || allAttr && (sk[5] & 31) != 31) ? 0 : sk[6]/100;
				break;
			case 151: //十字心触发
			case 169: //C触发
			case 198: //回血触发
				scale = sk[2]/100;
				break;
			case 170: //多色触发
			case 182: //长串触发
			case 193: //L触发
				scale = sk[3]/100;
				break;
			case 171: //多串触发
				scale = sk[6]/100;
				break;
			case 183: //又是个有两段血线的队长技
				scale = noHPneed ? 0 : sk[4]/100;
				break;

			case 138: //调用其他队长技
				scale = sk.reduce((pmul,skid)=> 1 - (1-pmul) * (1-getReduceScale(Skills[skid], allAttr, noHPneed)),0);
				break;
			default:
		}
		return scale || 0;
	}
	
	function getCannonAttr(skill)
	{
		const sk = skill.params;
		switch(skill.type)
		{
			case 0:
			case 1:
			case 37:
			case 58:
			case 59:
			case 84:
			case 85:
			case 86:
			case 87:
			case 115:
				return sk[0];
			case 110:
			case 143:
				return sk[1];
			case 42:
				return sk[1];
			case 144:
				return sk[3];
			default:
				return -1;
		}
	}

	//创建1个觉醒图标
	function createAwokenIcon(awokenId)
	{
		const icon = document.createElement("icon");
		icon.className ="awoken-icon";
		icon.setAttribute("data-awoken-icon", awokenId);
		return icon;
	}
	//产生一个觉醒列表
	function creatAwokenList(awokens) {
		const ul = document.createElement("ul");
		ul.className = "awoken-ul";
		awokens.forEach(ak=>{
			const li = ul.appendChild(document.createElement("li"));
			const icon = li.appendChild(createAwokenIcon(ak));
		});
		return ul;
	}
	//产生宝珠列表
	function createOrbsList(orbs)
	{
		const ul = document.createElement("ul");
		ul.className = "board";
		orbs.forEach(orbType => {
			const li = ul.appendChild(document.createElement("li"));
			li.className = `orb-icon`;
			li.setAttribute("data-orb-icon", orbType);
		});	
		return ul;
	}

	const specialSearchFunctions = [
		{name:"不做筛选",function:cards=>cards},
		{group:"======队长技======", functions: [
			{name:"队长技固伤追击（按伤害排序）",function:cards=>{
				const searchTypeArray = [199,200,201];
				function getSkillFixedDamage(skill)
				{
					switch (skill.type)
					{
						case 199: case 200:
							return skill.params[2];
						case 201:
							return skill.params[5];
						default:
							return 0;
					}
				}
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill ? (getSkillFixedDamage(skill)>0) : false;
				}).sort((a,b)=>{
					const a_s = getCardLeaderSkill(a, searchTypeArray), b_s = getCardLeaderSkill(b, searchTypeArray);
					let a_pC = getSkillFixedDamage(a_s), b_pC = getSkillFixedDamage(b_s);
					return a_pC - b_pC;
				});
			},addition:card=>{
				const searchTypeArray = [199,200,201];
				function getSkillFixedDamage(skill)
				{
					switch (skill.type)
					{
						case 199: case 200:
							return skill.params[2];
						case 201:
							return skill.params[5];
						default:
							return 0;
					}
				}
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				const value = getSkillFixedDamage(skill);
				return document.createTextNode(value.bigNumberToString() + "固伤");
			}},
			{name:"队长技+C（按+C数排序）",function:cards=>{
				const searchTypeArray = [192,194,206,209,210];
				function getSkillAddCombo(skill)
				{
					switch (skill.type)
					{
						case 192: case 194:
							return skill.params[3];
						case 206:
							return skill.params[6];
						case 209:
							return skill.params[0];
						case 210:
							return skill.params[2];
						default:
							return 0;
					}
				}
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill ? (getSkillAddCombo(skill)>0) : false;
				}).sort((a,b)=>{
					const a_s = getCardLeaderSkill(a, searchTypeArray), b_s = getCardLeaderSkill(b, searchTypeArray);
					let a_pC = getSkillAddCombo(a_s),b_pC = getSkillAddCombo(b_s);
					return a_pC - b_pC;
				});
			},addition:card=>{
				const searchTypeArray = [192,194,206,209,210];
				function getSkillAddCombo(skill)
				{
					switch (skill.type)
					{
						case 192: case 194:
							return skill.params[3];
						case 206:
							return skill.params[6];
						case 209:
							return skill.params[0];
						case 210:
							return skill.params[2];
						default:
							return 0;
					}
				}
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				const value = getSkillAddCombo(skill);
				return document.createTextNode(`+${value.bigNumberToString()}C${skill.type==210?`/十字`:""}`);
			}},
			{name:"7×6 版面",function:cards=>cards.filter(card=>{
				const searchTypeArray = [162,186];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"无天降版面",function:cards=>cards.filter(card=>{
				const searchTypeArray = [163,177];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"队长技加/减秒（按秒数排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [15,185];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [15,185];
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (searchTypeArray.some(t=>a_s.type == t)) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.some(t=>subskill.type == t)).params[0];
				b_pC = (searchTypeArray.some(t=>b_s.type == t)) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.some(t=>subskill.type == t)).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [15,185];
				const skill = Skills[card.leaderSkillId];
				const value = searchTypeArray.includes(skill.type) ?
					skill.params[0] :
					skill.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[0];
				return document.createTextNode((value > 0 ? "+" : "") + (value/100) + "秒");
			}},
			{name:"固定操作时间（按时间排序）",function:cards=>cards.filter(card=>{
				const searchType = 178;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 178;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchType = 178;
				const skill = Skills[card.leaderSkillId];
				const value = skill.type == searchType ?
					skill.params[0] :
					skill.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return document.createTextNode("固定" + value + "秒");
			}},
			{name:"消除宝珠时计算防御的追打（按追打比率排序）",function:cards=>cards.filter(card=>{
				const searchType = 12;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 12;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"消除宝珠时回血（按回复比率排序）",function:cards=>cards.filter(card=>{
				const searchType = 13;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 13;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"队长技受伤反击",function:cards=>cards.filter(card=>{
				const searchType = 41;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"毒无效",function:cards=>cards.filter(card=>{
				const searchType = 197;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			/*{name:"回血加盾",function:cards=>cards.filter(card=>{
				const searchType = 198;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType && skill.params[2])
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[2]);
				}
			})},*/
			{name:"回血解觉",function:cards=>cards.filter(card=>{
				const searchType = 198;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType && skill.params[3])
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3]);
				}
			})},
			{name:"十字心",function:cards=>cards.filter(card=>{
				const searchTypeArray = [151,209];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"N个十字",function:cards=>cards.filter(card=>{
				const searchTypeArray = [157];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"剩珠倍率",function:cards=>cards.filter(card=>{
				const searchType = 177;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"要求长串消除（按珠数排序）",function:cards=>cards.filter(card=>{
				const searchType = 158;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 158;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"根性",function:cards=>cards.filter(card=>{
				const searchType = 14;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"指定队伍队员编号",function:cards=>cards.filter(card=>{
				const searchType = 125;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"指定队伍队员合作编号",function:cards=>cards.filter(card=>{
				const searchType = 175;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"指定队伍队员进化类型",function:cards=>cards.filter(card=>{
				const searchType = 203;
				const skill = Skills[card.leaderSkillId];
				if (!skill) console.log(card,card.leaderSkillId);
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"增加道具掉落率（按增加倍率排序）",function:cards=>cards.filter(card=>{
				const searchType = 53;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 53;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),
			addition:card=>{
				const searchTypeArray = [53];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`掉率x${sk[0]/100}`);
			}},
			{name:"增加金币掉落倍数（按增加倍率排序）",function:cards=>cards.filter(card=>{
				const searchType = 54;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 54;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),
			addition:card=>{
				const searchTypeArray = [54];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`金币x${sk[0]/100}`);
			}},
			{name:"增加经验获取倍数（按增加倍率排序）",function:cards=>cards.filter(card=>{
				const searchType = 148;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 148;
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),
			addition:card=>{
				const searchTypeArray = [148];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`经验x${sk[0]/100}`);
			}},
		]},
		{group:"-----血倍率-----", functions: [
			{name:"队长血倍率[2, ∞)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale >= 2;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
			{name:"队长血倍率[1.5, 2)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale >= 1.5 && HPscale < 2;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
			{name:"队长血倍率(1, 1.5)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale > 1 && HPscale < 1.5;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
			{name:"队长血倍率 == 1",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale === 1;
			})},
			{name:"队长血倍率[0, 1)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale < 1;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
		]},
		{group:"-----减伤盾-----", functions: [
			{name:"队长盾减伤[75%, 100%]（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.75;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"队长盾减伤[50%, 75%)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.5 && reduceScale < 0.75;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"队长盾减伤[25%, 50%)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.25 && reduceScale < 0.5;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"队长盾减伤(0%, 25%)（按倍率排序）",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale > 0 && reduceScale < 0.25;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"队长盾减伤 == 0",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale === 0;
			})},
			{name:"队长盾减伤-必须全属性减伤",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, true) > 0;
			})},
			{name:"队长盾减伤-排除血线盾",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, undefined, true) > 0;
			})},
			{name:"队长盾减伤-排除几率盾",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, undefined, undefined, true) > 0;
			})},
			{name:"满血99重力不下半血-队长盾减伤[29%, 100%)",function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale>=0.29;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"队长盾减伤-无条件盾",function:cards=>cards.filter(card=>{
				//获取盾减伤比例
				function getReduceScale_unconditional(ls)
				{
					const sk = ls.params;
					let scale = 0;
					switch (ls.type)
					{
						case 16: //无条件盾
							scale = sk[0]/100;
							break;
						case 129: //无条件盾，属性个数不固定
						case 163: //无条件盾，属性个数不固定
							scale = (sk[5] & 31) != 31 ? 0 : sk[6]/100;
							break;
			
						case 138: //调用其他队长技
							scale = sk.reduce((pmul,skid)=> 1 - (1-pmul) * (1-getReduceScale_unconditional(Skills[skid])),0);
							break;
						default:
					}
					return scale || 0;
				}
				const skill = Skills[card.leaderSkillId];
				return getReduceScale_unconditional(skill) > 0;
			})},
		]},

		{group:"======主动技======", functions: [
			{name:"1 CD",function:cards=>cards.filter(card=>{
				if (card.activeSkillId == 0) return false;
				const skill = Skills[card.activeSkillId];
				return skill.initialCooldown - (skill.maxLevel - 1) <= 1;
			})},
			{name:"除 1 CD 外，4 个以下能永动开（可能不精确）",function:cards=>cards.filter(card=>{
				if (card.activeSkillId == 0) return false;
				const skill = Skills[card.activeSkillId];
				const minCD = skill.initialCooldown - (skill.maxLevel - 1); //主动技最小的CD
				let realCD = minCD;
	
				const searchType = 146;
				if (skill.type == searchType)
					realCD -= skill.params[0] * 3;
				else if (skill.type == 116){
					const subskills = skill.params.map(id=>Skills[id]);
					const subskill = subskills.find(subs=>subs.type == searchType);
					if (subskill) realCD -= subskill.params[0] * 3;
				}
				return minCD > 1 && realCD <= 4;
			})},
			{name:"时间暂停（按停止时间排序）",function:cards=>cards.filter(card=>{
				const searchType = 5;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 5;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"随机效果技能",function:cards=>cards.filter(card=>Skills[card.activeSkillId].type == 118)},
		]},
		{group:"-----破吸类-----", functions: [
			{name:"破属吸 buff（按破吸回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 173;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[1])
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[1]);
				}
			}).sort((a,b)=>{
				const searchType = 173;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [173];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`属吸×${sk[0]}T`);
			}},
			{name:"破伤吸 buff（按破吸回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 173;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[3])
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3]);
				}
			}).sort((a,b)=>{
				const searchType = 173;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [173];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`伤吸×${sk[0]}T`);
			}},
			{name:"双破吸 buff（按破吸回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 173;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[1] && skill.params[3])
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[1] && subskill.params[3]);
				}
			}).sort((a,b)=>{
				const searchType = 173;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [173];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`双破×${sk[0]}T`);
			}},
			{name:"贯穿无效盾 buff（按破吸回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 191;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 191;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [191];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`破贯×${sk[0]}T`);
			}},
		]},
		{group:"-----解封类-----", functions: [
			{
				name:"解封（按解封回合排序）",
				function:cards=>{
					const searchTypeArray = [117,179];
					function getJieFengHuiHe(skill)
					{
						return skill.type == 179 ? skill.params[3] : skill.params[0];
					}
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill ? getJieFengHuiHe(skill) : false;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = getJieFengHuiHe(a_s), b_pC = getJieFengHuiHe(b_s);
						return a_pC - b_pC;
					});
				},
				addition:card=>{
					const searchTypeArray = [117,179];
					const skill = getCardSkill(card, searchTypeArray);
					const sk = skill.params;
	
					const JieFengTurn = skill=>skill.type == 179 ? skill.params[3] : skill.params[0];
					const value = JieFengTurn(skill);
					return document.createTextNode(`${value == 9999 ? "全" : value + "T"}解封`);
				}
			},
			{
				name:"解觉醒（按解觉回合排序）",
				function:cards=>{
					const searchTypeArray = [117,179];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill ? skill.params[4] : false;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = a_s.params[4], b_pC = b_s.params[4];
						return a_pC - b_pC;
					})
				},
				addition:card=>{
					const searchTypeArray = [117,179];
					const skill = getCardSkill(card, searchTypeArray);
					const sk = skill.params;
	
					const value = sk[4];
					return document.createTextNode(`${value == 9999 ? "全" : value + "T"}解觉`);
				}
			},
			{
				name:"解封+觉醒（按解觉醒回合排序）",
				function:cards=>{
					const searchTypeArray = [117,179];
					function getJieFengHuiHe(skill)
					{
						return skill.type == 179 ? skill.params[3] : skill.params[0];
					}
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill ? (skill.params[4] && getJieFengHuiHe(skill)) : false;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = a_s.params[4], b_pC = b_s.params[4];
						return a_pC - b_pC;
					});
				},
				addition:card=>{
					const searchTypeArray = [117,179];
					const skill = getCardSkill(card, searchTypeArray);
					const sk = skill.params;
	
					function getJieFengHuiHe(skill)
					{
						return skill.type == 179 ? skill.params[3] : skill.params[0];
					}
					const value1 = getJieFengHuiHe(skill);
					const value2 = sk[4];
					
					return document.createTextNode(value1 == value2 ?
						`${value1 == 9999 ? "全" : value1 + "T"}解封+觉` :
						`${value1 == 9999 ? "全" : value1 + "T"}解封，${value2 == 9999 ? "全" : value2 + "T"}解觉`);
				}
			},
			{
				name:"解禁消珠（按消除回合排序）",
				function:cards=>{
					const searchTypeArray = [196];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = a_s.params[0], b_pC = b_s.params[0];
						return a_pC - b_pC;
					})
	
				},addition:card=>{
					const searchTypeArray = [196];
					const skill = getCardSkill(card, searchTypeArray);
					const sk = skill.params;
	
					const value = sk[0];
					return document.createTextNode(`${value == 9999 ? "全" : value + "T"}解禁消`);
				}
			},
			{name:"自封技能（能干啥？）",function:cards=>cards.filter(card=>{
				const searchType = 214;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
		]},
		{group:"-----锁珠类-----", functions: [
			{name:"解锁",function:cards=>cards.filter(card=>{
				const searchType = 172;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"上锁（不限色）",function:cards=>cards.filter(card=>{
				const searchType = 152;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"上锁5色+心或全部",function:cards=>cards.filter(card=>{
				const searchType = 152;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params[0] & 63) === 63)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params[0] & 63) === 63);
				}
			})},
			{name:"掉锁（不限色，按回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 205;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 205;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[1];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[1];
				return a_pC - b_pC;
			})},
			{name:"掉锁5色+心或全部（按回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 205;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params[0] & 63) === 63)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params[0] & 63) === 63);
				}
			}).sort((a,b)=>{
				const searchType = 205;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[1];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[1];
				return a_pC - b_pC;
			})},
		]},
		{group:"-----洗版类-----", functions: [
			{name:"普通洗版-含心",function:cards=>cards.filter(card=>{
				function includeHeart(sk)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.includes(5);
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && includeHeart(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && includeHeart(subskill.params));
				}
			})},
			{name:"普通洗版-不含心",function:cards=>cards.filter(card=>{
				function excludeHeart(sk)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return !color.includes(5);
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && excludeHeart(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && excludeHeart(subskill.params));
				}
			})},
			{name:"普通洗版-含毒废",function:cards=>cards.filter(card=>{
				function includeHeart(sk)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.includes(6) || color.includes(7) || color.includes(8) || color.includes(9);
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && includeHeart(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && includeHeart(subskill.params));
				}
			})},
			{name:"普通洗版1色（花火）",function:cards=>cards.filter(card=>{
				function isOnlyColor(sk, colorTypeCount)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.length == colorTypeCount;
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isOnlyColor(skill.params, 1))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isOnlyColor(subskill.params, 1));
				}
			}),addition:card=>{
				const searchTypeArray = [71];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
				
				return createOrbsList(colors);
			}},
			{name:"普通洗版2色",function:cards=>cards.filter(card=>{
				function isOnlyColor(sk, colorTypeCount)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.length == colorTypeCount;
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isOnlyColor(skill.params, 2))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isOnlyColor(subskill.params, 2));
				}
			}),addition:card=>{
				const searchTypeArray = [71];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
				
				return createOrbsList(colors);
			}},
			{name:"普通洗版3色",function:cards=>cards.filter(card=>{
				function isOnlyColor(sk, colorTypeCount)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.length == colorTypeCount;
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isOnlyColor(skill.params, 3))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isOnlyColor(subskill.params, 3));
				}
			}),addition:card=>{
				const searchTypeArray = [71];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
				
				return createOrbsList(colors);
			}},
			{name:"普通洗版4色",function:cards=>cards.filter(card=>{
				function isOnlyColor(sk, colorTypeCount)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.length == colorTypeCount;
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isOnlyColor(skill.params, 4))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isOnlyColor(subskill.params, 4));
				}
			}),addition:card=>{
				const searchTypeArray = [71];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
				
				return createOrbsList(colors);
			}},
			{name:"普通洗版5色",function:cards=>cards.filter(card=>{
				function isOnlyColor(sk, colorTypeCount)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.length == colorTypeCount;
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isOnlyColor(skill.params, 5))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isOnlyColor(subskill.params, 5));
				}
			}),addition:card=>{
				const searchTypeArray = [71];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
				
				return createOrbsList(colors);
			}},
			{name:"普通洗版6色以上",function:cards=>cards.filter(card=>{
				function isOnlyColor(sk, colorTypeCount)
				{
					const color = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
					return color.length >= colorTypeCount;
				}
				const searchType = 71;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isOnlyColor(skill.params, 6))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isOnlyColor(subskill.params, 6));
				}
			}),addition:card=>{
				const searchTypeArray = [71];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined);
				
				return createOrbsList(colors);
			}},
			{name:"刷版",function:cards=>cards.filter(card=>{
				const searchType = 10;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
		]},
		{group:"~~~转珠类有些复杂我没空做~~~"},
		{group:"-----随机产珠类-----", functions: [
			{name:"固定30个产珠",function:cards=>cards.filter(card=>{
				function is30(sk)
				{
					return Boolean(flags(sk[1]).length * sk[0] == 30);
				}
				const searchType = 141;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && is30(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && is30(subskill.params));
				}
			})},
			{name:"固定15×2产珠",function:cards=>cards.filter(card=>{
				function is1515(sk)
				{
					return Boolean(flags(sk[1]).length == 2 && sk[0] == 15);
				}
				const searchType = 141;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && is1515(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && is1515(subskill.params));
				}
			})},
		]},
		{group:"-----固定产珠类-----", functions: [
			{name:"生成特殊形状的",function:cards=>cards.filter(card=>{
				const searchType = 176;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"生成3x3方块",function:cards=>cards.filter(card=>{
				function is3x3(sk)
				{
					for (let si=0;si<3;si++)
					{
						if (sk[si] === sk[si+1] && sk[si] === sk[si+2] && //3行连续相等
							(si>0?(sk[si-1] & sk[si]) ===0:true) && //如果上一行存在，并且无交集(and为0)
							(si+2<4?(sk[si+3] & sk[si]) ===0:true) && //如果下一行存在，并且无交集(and为0)
							(sk[si] === 7 || sk[si] === 7<<1 || sk[si] === 7<<2 || sk[si] === 7<<3) //如果这一行满足任意2珠并联（二进制111=十进制7）
						)
						return true;
					}
					return false;
				}
				const searchType = 176;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && is3x3(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && is3x3(subskill.params));
				}
			})},
			{name:"产竖",function:cards=>cards.filter(card=>{
				const searchType = 127;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}),addition:card=>{
				const searchTypeArray = [127];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = [];
				for (let ai=0;ai<sk.length;ai+=2)
				{
					colors.push(flags(sk[ai+1])[0]);
				}
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`竖`));
				fragment.appendChild(createOrbsList(colors));
				return fragment;
			}},
			{name:"产竖（含心）",function:cards=>cards.filter(card=>{
				function isHeart(sk)
				{
					for (let i=1;i<sk.length;i+=2)
					{
						if (sk[i] & 32)
						{
							return true;
						}
					}
				}
				const searchType = 127;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && isHeart(skill.params))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && isHeart(subskill.params));
				}
			})},
			{name:"产横",function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}),addition:card=>{
				const searchTypeArray = [128];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = [];
				for (let ai=0;ai<sk.length;ai+=2)
				{
					colors.push(flags(sk[ai+1])[0]);
				}
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`横`));
				fragment.appendChild(createOrbsList(colors));
				return fragment;
			}},
			{name:"2横或以上",function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params.length>=3 || flags(skill.params[0]).length>=2))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params.length>=3 || flags(subskill.params[0]).length>=2));
				}
			})},
			{name:"2色横",function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[3]>=0 && (skill.params[1] & skill.params[3]) != skill.params[1])
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3]>=0 && (subskill.params[1] & subskill.params[3]) != subskill.params[1]);
				}
			})},
			{name:"非顶底横",function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && ((skill.params[0] | skill.params[2]) & 14))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && ((subskill.params[0] | subskill.params[2]) & 14));
				}
			})},
			{name:"泛产横（包含花火与四周一圈等）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [128,71,176];
				function isRow(skill)
				{
					const sk = skill.params;
					if (skill.type === 128) //普通横
					{return true;}
					else if (skill.type === 71) //花火
					{return sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined).length === 1}
					else if (skill.type === 176) //特殊形状
					{
						for (let si=0;si<5;si++)
						{
							if ((sk[si] & 63) === 63)
								return true;
						}
					}
					return false;
				}
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type) && isRow(skill))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type) && isRow(subskill));
				}
			})},
		]},
		{group:"----- buff 类-----", functions: [
			{name:"掉落率提升",function:cards=>cards.filter(card=>{
				const searchTypeArray = [126];
				const skill = getCardSkill(card, searchTypeArray);
				return skill;
			}),addition:card=>{
				const searchTypeArray = [126];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = flags(sk[0]);
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(createOrbsList(colors));
				fragment.appendChild(document.createTextNode(`↓${sk[3]}%×${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}T`));
				return fragment;
			}},
			{name:"掉落率提升-属性-毒、废（顶毒）",function:cards=>cards.filter(card=>{
				const searchType = 126;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params[0] & 960)) // 960 = 二进制 1111000000
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params[0] & 960));
				}
			})},
			{name:"掉落率提升-持续99回合",function:cards=>cards.filter(card=>{
				const searchType = 126;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[1] >= 99)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[1] >= 99);
				}
			})},
			{name:"掉落率提升-100%几率",function:cards=>cards.filter(card=>{
				const searchType = 126;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[3] >= 100)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3] >= 100);
				}
			})},
			{name:"以觉醒数量为倍率类技能（宝石姬）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [156,168];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
			{
				name:"回复力 buff（顶降回复）",
				function:cards=>{
					const searchTypeArray = [50,90];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						if (skill)
						{
							const sk = skill.params;
							return sk.slice(1,sk.length>2?-1:undefined).includes(5);
						}else return false;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						//将技能的手指类型转换为二进制01、10、11等形式，低位表示加固定秒，高位表示手指加倍
						const a_ss = a_s.params.length > 2 ? a_s.params[a_s.params.length-1] : 0, b_ss = b_s.params.length > 2 ? b_s.params[b_s.params.length-1] : 0;
						return a_ss - b_ss;
					});
				},
				addition:card=>{
					const searchTypeArray = [50,90];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return document.createTextNode(`回x${sk.length > 2 ? sk[sk.length-1]/100 : 0}`);
				}
			},
			{name:"攻击力 buff（顶降攻击）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [
					88,92, //类型的
					50,90, //属性的，要排除回复力
					156,168, //宝石姬
				];
				const skill = Skills[card.activeSkillId];
				if ((skill.type==88 || skill.type==92) || //类型的
					(skill.type==50 || skill.type==90) && skill.params.slice(1,skill.params.length>2?-1:undefined).some(sk=>sk!=5) || //属性的，要排除回复力
					skill.type==156 && skill.params[4] == 2 || skill.type==168 //宝石姬的
				)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>
						(subskill.type==88 || subskill.type==92) || //类型的
						(subskill.type==50 || subskill.type==90) && subskill.params.slice(1,subskill.params.length>2?-1:undefined).some(sk=>sk!=5) || //属性的，要排除回复力
						subskill.type==156 && subskill.params[4] == 2 || subskill.type==168 //宝石姬的
					);
				}
			})},
			{
				name:"操作时间 buff（顶减手指）",
				function:cards=>{
					const searchTypeArray = [132];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						//将技能的手指类型转换为二进制01、10、11等形式，低位表示加固定秒，高位表示手指加倍
						const a_t =  Boolean(a_s.params[1]) | Boolean(a_s.params[2])<<1, b_t = Boolean(b_s.params[1]) | Boolean(b_s.params[2])<<1;
						return (a_t - b_t) || ((a_t & b_t & 1) ? a_s.params[1] - b_s.params[1] : a_s.params[2] - b_s.params[2]);
					});
				},
				addition:card=>{
					const searchTypeArray = [132];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					let str = "";
					if (sk[1]) str += `${sk[1]>0?`+`:``}${sk[1]/10}S`;
					if (sk[2]) str += `👆x${sk[2]/100}`;
					return document.createTextNode(str);
				}
			},
			{name:"无天降 buff（顶无天降）",function:cards=>cards.filter(card=>{
				const searchType = 184;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"生成变换位（顶变换珠）",function:cards=>cards.filter(card=>{
				const searchType = 207;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{
				name:"加C buff（按C数排列）",
				function:cards=>{
					const searchTypeArray = [160];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						return a_s.params[1] - b_s.params[1];
					});
				},
				addition:card=>{
					const searchTypeArray = [160];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					let str = "";
					if (sk[1]) str += `${sk[1]>0?`+`:``}${sk[1]/10}S`;
					if (sk[2]) str += `👆x${sk[2]/100}`;
					return document.createTextNode(`+${sk[1]}C×${sk[0]}T`);
				}
			},
			{name:"全属减伤 buff（按减伤比率排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [3,156];
				const skill = Skills[card.activeSkillId];
				if (skill.type == 3 ||
					skill.type == 156 && skill.params[4]==3
				)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>
						subskill.type == 3 ||
						subskill.type == 156 && subskill.params[4]==3
					);
				}
			}).sort((a,b)=>{
				const searchTypeArray = [3,156];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				
				//找到真正生效的子技能			
				const a_ss = searchTypeArray.includes(a_s.type) ?
					a_s :
					a_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type));
				const b_ss = searchTypeArray.includes(b_s.type) ?
					b_s :
					b_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type));
				let sortNum = b_ss.type - a_ss.type; //先分开宝石姬与非宝石姬
				if (!sortNum)
				{
					let a_pC = 0,b_pC = 0;
					if (a_ss.type == 3)
					{
						a_pC = a_ss.params[1];
						b_pC = b_ss.params[1];
					}else
					{
						a_pC = a_ss.params[5];
						b_pC = b_ss.params[5];
					}
					sortNum = a_pC - b_pC;
				}
				return sortNum;
			}),addition:card=>{
				const searchTypeArray = [3,156];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const fragment = document.createDocumentFragment();
				if (skill.type == 156)
				{
					fragment.appendChild(document.createTextNode(`${sk[5]}%/`));
					const awokenArr = sk.slice(1,4).filter(s=>s>0);
					fragment.appendChild(creatAwokenList(awokenArr));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
				}else
				{
					fragment.appendChild(document.createTextNode(`${sk[1]}%×${sk[0]}T`));
				}
				return fragment;
			}},
			{name:"全属减伤 100%（无敌）",function:cards=>cards.filter(card=>{
				const searchType = 3;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[1]>=100)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[1]>=100);
				}
			}).sort((a,b)=>{
				const searchType = 3;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"限属减伤 buff（按回合排序排序）",function:cards=>{
				const searchType = 21;
				return cards.filter(card=>{
					const skill = Skills[card.activeSkillId];
					if (skill.type == searchType)
						return true;
					else if (skill.type == 116 || skill.type == 118){
						const subskills = skill.params.map(id=>Skills[id]);
						return subskills.some(subskill=>subskill.type == searchType);
					}
				}).sort((a,b)=>{
					const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
					let a_pC = 0,b_pC = 0;
					a_pC = (a_s.type == searchType) ?
						a_s.params[0] :
						a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
					b_pC = (b_s.type == searchType) ?
						b_s.params[0] :
						b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
					return a_pC - b_pC;
				});
			},addition:card=>{
				const searchTypeArray = [21];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				
				const colors = [sk[1]];
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`-`));
				fragment.appendChild(createOrbsList(colors));
				fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
	
				return fragment;
			}},
			{name:"变为全体攻击（按回合数排序）",function:cards=>cards.filter(card=>{
				const searchType = 51;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 5;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
		]},
		{group:"-----玩家HP操纵类-----", functions: [
			{name:"回合结束回血 buff",function:cards=>cards.filter(card=>{
				const searchTypeArray = [179];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
			{name:"玩家回血",function:cards=>cards.filter(card=>{
				const searchTypeArray = [7,8,35,115];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type) || skill.type == 117 && (skill.params[1] || skill.params[2] || skill.params[3]))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type) || subskill.type == 117 && (subskill.params[1] || subskill.params[2] || subskill.params[3]));
				}
			})},
			{name:"玩家自残（HP 减少，按减少比率排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [84,85,86,87,195];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [84,85,86,87,195];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				function getReduceScale(skill)
				{
					const sk = skill.params;
					if (skill.type == 195)
					{
						return sk[0] ? sk[0] : 0.1;
					}else
					{
						return sk[3] ? sk[3] : 0.1;
					}
				}
				function getSubskill(skill)
				{
					const subSkill = skill.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type));
					return subSkill;
				}
				a_pC = searchTypeArray.includes(a_s.type) ?
					getReduceScale(a_s) :
					getReduceScale(getSubskill(a_s));
				b_pC = searchTypeArray.includes(b_s.type) ?
					getReduceScale(b_s) :
					getReduceScale(getSubskill(b_s));
				return b_pC - a_pC;
			})},
		]},
		{group:"-----对自身队伍生效类-----", functions: [
			{name:"减少CD（按溜数排序，有范围的取小）",function:cards=>cards.filter(card=>{
				const searchType = 146;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 146;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [146];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}溜`);
			}},
			{name:"将自身换为队长",function:cards=>cards.filter(card=>{
				const searchType = 93;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"转换自身属性（按回合数排序）",function:cards=>cards.filter(card=>{
				const searchType = 142;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 142;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
		]},
		{group:"-----对敌 buff 类-----", functions: [
			{name:"威吓（按推迟回合排序）",function:cards=>{
				const searchTypeArray = [18];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>{
					const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
					let a_pC = a_s.params[0],b_pC = b_s.params[0];
					return a_pC - b_pC;
				});
			},addition:card=>{
				const searchTypeArray = [18];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`威吓×${sk[0]}T`);
			}},
			{name:"破防（按防御减少比例排序）",function:cards=>cards.filter(card=>{
				const searchType = 19;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 19;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[1] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[1];
				b_pC = (b_s.type == searchType) ?
					b_s.params[1] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[1];
				return a_pC - b_pC;
			})},
			{name:"100% 破防（按回合排序）",function:cards=>cards.filter(card=>{
				const searchType = 19;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[1]>=100)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[1]>=100);
				}
			}).sort((a,b)=>{
				const searchType = 19;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"中毒（按毒伤比率排序）",function:cards=>cards.filter(card=>{
				const searchType = 4;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 4;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"改变敌人属性（按属性排序）",function:cards=>cards.filter(card=>{
				const searchType = 153;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 153;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			}),addition:card=>{
				const searchTypeArray = [153];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				
				const colors = [sk[0]];
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`敌→`));
				fragment.appendChild(createOrbsList(colors));
				return fragment;
			}},
			{name:"受伤反击 buff",function:cards=>cards.filter(card=>{
				const searchType = 60;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
		]},
		{group:"-----对敌直接伤害类-重力-----", functions: [
			{name:"重力-敌人当前血量（按比例排序）",function:cards=>cards.filter(card=>{
				const searchType = 6;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 6;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
			{name:"重力-敌人最大血量（按比例排序）",function:cards=>cards.filter(card=>{
				const searchType = 161;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 161;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
		]},
		{group:"-----对敌直接伤害类-无视防御固伤-----", functions: [
			{name:"无视防御固伤-单体（按总伤害排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [55,188];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [55,188];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				function totalDamage(skill)
				{
					const subSkill = skill.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type));
					return subSkill.params[0] * skill.params.filter(p=>p==subSkill.id).length;
				}
				a_pC = searchTypeArray.includes(a_s.type) ?
					a_s.params[0] :
					totalDamage(a_s);
				b_pC = searchTypeArray.includes(b_s.type) ?
					b_s.params[0] :
					totalDamage(b_s);
				return a_pC - b_pC;
			})},
			{name:"无视防御固伤-全体（按伤害数排序）",function:cards=>cards.filter(card=>{
				const searchType = 56;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 56;
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (a_s.type == searchType) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				b_pC = (b_s.type == searchType) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => subskill.type == searchType).params[0];
				return a_pC - b_pC;
			})},
		]},
		{group:"-----对敌直接伤害类-大炮-----", functions: [
			{name:"大炮-对象-敌方单体",function:cards=>cards.filter(card=>{
				const searchTypeArray = [2,35,37,59,84,86,110,115,144];
				const skill = Skills[card.activeSkillId];
				function isSingle(skill)
				{
					if (skill.type == 110)
						return Boolean(skill.params[0]);
					else if (skill.type == 144)
						return Boolean(skill.params[2]);
					else
						return true;
				}
				if (searchTypeArray.includes(skill.type) && isSingle(skill))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type) && isSingle(subskill));
				}
			})},
			{name:"大炮-对象-敌方全体",function:cards=>cards.filter(card=>{
				const searchTypeArray = [0,1,58,85,87,110,143,144];
				const skill = Skills[card.activeSkillId];
				function isAll(skill)
				{
					if (skill.type == 110)
						return !Boolean(skill.params[0]);
					else if (skill.type == 144)
						return !Boolean(skill.params[2]);
					else
						return true;
				}
				if (searchTypeArray.includes(skill.type) && skill.id!=0 && isAll(skill))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type) && isAll(subskill));
				}
			})},
			{name:"大炮-对象-指定属性敌人",function:cards=>cards.filter(card=>{
				const searchTypeArray = [42];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
	
			{name:"大炮-属性-不限",function:cards=>cards.filter(card=>{
				const searchTypeArray = [0,1,2,35,37,42,58,59,84,85,86,87,110,115,143,144];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type) && skill.id!=0)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}),addition:card=>{
				const searchTypeArray = [0,1,2,35,37,42,58,59,84,85,86,87,110,115,143,144];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = [getCannonAttr(skill)];
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`射`));
				fragment.appendChild(createOrbsList(colors));
				return fragment;
			}},
			{name:"大炮-属性-释放者自身",function:cards=>cards.filter(card=>{
				const searchTypeArray = [2,35];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
	
			{name:"大炮-伤害-自身攻击倍率（按倍率排序，范围取小）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [0,2,35,37,58,59,84,85,115];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type) && skill.id!=0)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [0,2,35,37,58,59,84,85,115];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				function getSkillOrSub(skill)
				{
					if (searchTypeArray.includes(skill.type))
						return skill;
					else
						return skill.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type));
				}
				function getNumber(skill)
				{
					const sk = skill.params;
					switch(skill.type)
					{
						case 0:
						case 37:
						case 58:
						case 59:
						case 84:
						case 85:
						case 115:
							return sk[1];
						case 2:
						case 35:
							return sk[0];
						default:
							return 0;
					}
				}
				let a_pC = 0,b_pC = 0;
				a_pC = getNumber(getSkillOrSub(a_s));
				b_pC = getNumber(getSkillOrSub(b_s));
				return a_pC - b_pC;
			})},
			{name:"大炮-伤害-指定属性数值（按数值排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [1,42,86,87];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [1,42,86,87];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				function getSkillOrSub(skill)
				{
					if (searchTypeArray.includes(skill.type))
						return skill;
					else
						return skill.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type));
				}
				function getNumber(skill)
				{
					const sk = skill.params;
					switch(skill.type)
					{
						case 1:
						case 86:
						case 87:
							return sk[1];
						case 42:
							return sk[2];
						default:
							return 0;
					}
				}
				let a_pC = 0,b_pC = 0;
				a_pC = getNumber(getSkillOrSub(a_s));
				b_pC = getNumber(getSkillOrSub(b_s));
				return a_pC - b_pC;
			})},
			{name:"大炮-伤害-根据剩余血量（按 1 HP 时倍率排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [110];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type) && skill.id!=0)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [110];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (searchTypeArray.includes(a_s.type)) ?
					a_s.params[3] :
					a_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[3];
				b_pC = (searchTypeArray.includes(b_s.type)) ?
					b_s.params[3] :
					b_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[3];
				return a_pC - b_pC;
			})},
			{name:"大炮-伤害-队伍总 HP（按倍率排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [143];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [143];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (searchTypeArray.includes(a_s.type)) ?
					a_s.params[0] :
					a_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[0];
				b_pC = (searchTypeArray.includes(b_s.type)) ?
					b_s.params[0] :
					b_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[0];
				return a_pC - b_pC;
			})},
			{name:"大炮-伤害-队伍某属性总攻击（按倍率排序）",function:cards=>cards.filter(card=>{
				const searchTypeArray = [144];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			}).sort((a,b)=>{
				const searchTypeArray = [144];
				const a_s = Skills[a.activeSkillId], b_s = Skills[b.activeSkillId];
				let a_pC = 0,b_pC = 0;
				a_pC = (searchTypeArray.includes(a_s.type)) ?
					a_s.params[1] :
					a_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[1];
				b_pC = (searchTypeArray.includes(b_s.type)) ?
					b_s.params[1] :
					b_s.params.map(id=>Skills[id]).find(subskill => searchTypeArray.includes(subskill.type)).params[1];
				return a_pC - b_pC;
			})},
	
			{name:"大炮-特殊-吸血",function:cards=>cards.filter(card=>{
				const searchTypeArray = [35,115];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
		]},
		{group:"======进化类型======", functions: [
			{name:"8格潜觉",function:cards=>cards.filter(card=>card.is8Latent)},
			{name:"非8格潜觉",function:cards=>cards.filter(card=>!card.is8Latent)},
			{name:"像素进化",function:cards=>cards.filter(card=>card.evoMaterials.includes(3826))},
			{name:"转生、超转生进化",function:cards=>cards.filter(card=>isReincarnated(card))}, //evoBaseId可能为0
			{name:"仅超转生进化",function:cards=>cards.filter(card=>isReincarnated(card) && !Cards[card.evoBaseId].isUltEvo)},
			{name:"超究极进化",function:cards=>cards.filter(card=>card.is8Latent && card.isUltEvo && !card.awakenings.includes(49))},
			{name:"变身前",function:cards=>cards.filter(card=>{
				const searchType = 202;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"变身后",function:cards=>cards.filter(card=>card.henshinFrom)},
			{name:"变身前后队长技保持不变",function:cards=>cards.filter(card=>{
				const searchType = 202;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && card.leaderSkillId == Cards[skill.params[0]].leaderSkillId)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && card.leaderSkillId == Cards[subskill.params[0]].leaderSkillId);
				}
			})},
			{name:"非变身",function:cards=>cards.filter(card=>!card.henshinFrom && !card.henshinTo)},
			{name:"用三神面进化",function:cards=>cards.filter(card=>card.evoMaterials.includes(3795))},
			{name:"用彩龙果进化",function:cards=>cards.filter(card=>card.evoMaterials.includes(3971))},
			{name:"由武器进化而来",function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].awakenings.includes(49))},
		]},
		{group:"======其他搜索======", functions: [
			{name:"攻击型或水属性（炭治郎队员）",function:cards=>cards.filter(card=>card.attrs.includes(1) || card.types.includes(6))},
			{name:"火属性或水属性（火车队员）",function:cards=>cards.filter(card=>card.attrs.includes(0) || card.attrs.includes(1))},
			{name:"不能破除等级限制",function:cards=>cards.filter(card=>card.limitBreakIncr===0)},
			{name:"110级三维成长100%",function:cards=>cards.filter(card=>card.limitBreakIncr>=100)},
			{name:"满级不是1级（可强化）",function:cards=>cards.filter(card=>card.maxLevel>1)},
			{name:"低于100mp",function:cards=>cards.filter(card=>card.sellMP<100)},
			{name:"有3个type",function:cards=>cards.filter(card=>card.types.filter(t=>t>=0).length>=3)},
			{name:"有副属性",function:cards=>cards.filter(card=>card.attrs[1]>=0)},
			{name:"有副属性且主副属性不一致",function:cards=>cards.filter(card=>card.attrs[0]>=0 && card.attrs[1]>=0 && card.attrs[0] != card.attrs[1])},
			{name:"能获得珠子皮肤",function:cards=>cards.filter(card=>card.blockSkinId>0)},
			{name:"所有潜觉蛋龙",function:cards=>cards.filter(card=>card.latentAwakeningId>0).sort((a,b)=>a.latentAwakeningId-b.latentAwakeningId)},
			{name:"龙契士&龙唤士（10001）",function:cards=>cards.filter(card=>card.collabId==10001)},
		]},
		{group:"-----觉醒类-----", functions: [
			{name:"有9个觉醒",function:cards=>cards.filter(card=>card.awakenings.length>=9)},
			{name:"可以做辅助",function:cards=>cards.filter(card=>card.canAssist)},
			{name:"不是武器",function:cards=>cards.filter(card=>!card.awakenings.includes(49))},
			{name:"有超觉醒",function:cards=>cards.filter(card=>card.superAwakenings.length > 0)},
			{name:"有110，但没有超觉醒",function:cards=>cards.filter(card=>card.limitBreakIncr>0 && card.superAwakenings.length<1)},
			{name:"3个相同杀觉醒，或2个杀觉醒并可打相同潜觉",function:cards=>cards.filter(card=>{
				const hasAwokenKiller = typekiller_for_type.find(type=>card.awakenings.filter(ak=>ak===type.awoken).length>=2);
				if (hasAwokenKiller)
				{ //大于2个杀的进行判断
					if (card.awakenings.filter(ak=>ak===hasAwokenKiller.awoken).length>=3)
					{ //大于3个杀的直接过
						return true;
					}else
					{ //2个杀的
						const isAllowLatent = card.types.filter(i=>
								i>=0 //去掉-1的type
							).map(type=>
								type_allowable_latent[type] //得到允许打的潜觉杀
							).some(ls=>
								ls.includes(hasAwokenKiller.latent) //判断是否有这个潜觉杀
							);
						return isAllowLatent
					}
				}else
				{
					return false;
				}
			})},
			{name:"3个相同杀觉醒（含超觉），或相同潜觉",function:cards=>cards.filter(card=>{
				const hasAwokenKiller = typekiller_for_type.find(type=>card.awakenings.filter(ak=>ak===type.awoken).length+(card.superAwakenings.includes(type.awoken)?1:0)>=2);
				if (hasAwokenKiller)
				{ //大于2个杀的进行判断
					if (card.awakenings.filter(ak=>ak===hasAwokenKiller.awoken).length+(card.superAwakenings.includes(hasAwokenKiller.awoken)?1:0)>=3)
					{ //大于3个杀的直接过
						return true;
					}else
					{ //2个杀的
						const isAllowLatent = card.types.filter(i=>
								i>=0 //去掉-1的type
							).map(type=>
								type_allowable_latent[type] //得到允许打的潜觉杀
							).some(ls=>
								ls.includes(hasAwokenKiller.latent) //判断是否有这个潜觉杀
							);
						return isAllowLatent
					}
				}else
				{
					return false;
				}
			})},
			{name:"4个相同杀觉醒（含超觉），或相同潜觉",function:cards=>cards.filter(card=>{
				const hasAwokenKiller = typekiller_for_type.find(type=>card.awakenings.filter(ak=>ak===type.awoken).length+(card.superAwakenings.includes(type.awoken)?1:0)>=3);
				if (hasAwokenKiller)
				{ //大于2个杀的进行判断
					if (card.awakenings.filter(ak=>ak===hasAwokenKiller.awoken).length+(card.superAwakenings.includes(hasAwokenKiller.awoken)?1:0)>=4)
					{ //大于3个杀的直接过
						return true;
					}else
					{ //2个杀的
						const isAllowLatent = card.types.filter(i=>
								i>=0 //去掉-1的type
							).map(type=>
								type_allowable_latent[type] //得到允许打的潜觉杀
							).some(ls=>
								ls.includes(hasAwokenKiller.latent) //判断是否有这个潜觉杀
							);
						return isAllowLatent
					}
				}else
				{
					return false;
				}
			})},
		]},
	];

	const searchBox = editBox.querySelector(".search-box");
	const controlDiv = searchBox.querySelector(".control-div");
	let fragment = document.createDocumentFragment();
	const specialSearchDiv = fragment.appendChild(document.createElement("ul"))
	specialSearchDiv.className = "specialSearch";
	function newSearchList(index)
	{
		const searchLi = document.createElement("li");
		//const searchLabel = searchLi.appendChild(document.createElement("label"));
		//searchLabel.appendChild(document.createTextNode(`筛选${index}:`));
		const specialSearch = searchLi.appendChild(document.createElement("select"));
		specialSearchFunctions.forEach((sfunc,idx)=>{
			if (sfunc.group)
			{
				const optgroup = specialSearch.appendChild(document.createElement("optgroup"));
				optgroup.label = sfunc.group;
				if (sfunc.functions)
				{
					sfunc.functions.forEach((_sfunc,_idx)=>{
						optgroup.appendChild(new Option(_sfunc.name + (_sfunc.addition ? "+附加显示" : ""),`${idx}|${_idx}`));
					});
				}
			}else
			{
				specialSearch.options.add(new Option(sfunc.name + (sfunc.addition ? "+附加显示" : ""),idx));
			}
		});
		return {dom:searchLi,list:specialSearch};
	}
	const specialSearchArray = []; //储存多个搜索列表的数组
	function addNewList()
	{
		const newSearch = newSearchList(specialSearchArray.length + 1);
		specialSearchDiv.appendChild(newSearch.dom);
		specialSearchArray.push(newSearch.list);
	}

	const specialSearchClear = specialSearchDiv.appendChild(document.createElement("button"));
	specialSearchClear.className = "specialSearch-clear";
	specialSearchClear.title = "筛选框全部归零";
	specialSearchClear.onclick = function(){
		specialSearchArray.forEach(ss=>ss.selectedIndex = 0);
	};

	const specialSearchAdd = specialSearchDiv.appendChild(document.createElement("button"));
	specialSearchAdd.className = "specialSearch-add";
	specialSearchAdd.title = "增加筛选框个数";
	specialSearchAdd.onclick = addNewList;

	addNewList(); //增加第1个
	addNewList(); //增加第2个

	//将搜索按钮强制改成特殊搜索
	const searchStart = controlDiv.querySelector(".search-start");
	searchStart.onclick = function(){
		const result = specialSearchArray.reduce((pre,ss)=>
			{
				const indexs = ss.value.split("|").map(Number);
				const funcObj = indexs.length > 1 ? specialSearchFunctions[indexs[0]].functions[indexs[1]] : specialSearchFunctions[indexs[0]];
				if (!funcObj) return pre;
				pre.result = funcObj.function(pre.result); //结果进一步筛选
				if (funcObj.addition) pre.addition.push(funcObj.addition); //如果有附加显示，则添加到列表
				return pre;
			}, {result: Cards, addition: []});
		searchBox.startSearch(result.result, result.addition);
	};
	controlDiv.insertBefore(fragment,controlDiv.firstElementChild);
	const searchClear = controlDiv.querySelector(".search-clear");
	searchClear.addEventListener("click",function(e){
		specialSearchArray.forEach(ss=>
			ss.selectedIndex = 0
		);
	});

	const settingBox = editBox.querySelector(".setting-box");
	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");

	const rowLederSkill = settingBox.querySelector(".row-mon-leader-skill");
	const lskillBox = rowLederSkill.querySelector(".skill-box");
	const lskillTitle = lskillBox.querySelector(".skill-name");

	skillTitle.addEventListener("click",fastShowSkill);
	lskillTitle.addEventListener("click",fastShowSkill);
})();