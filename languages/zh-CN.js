localTranslating = {
    webpage_title: `智龙迷城${teamsCount}人队伍图制作工具`,
	addition_display: "附加显示",
    title_blank: "输入队伍标题",
    detail_blank: "输入说明",
    sort_name:{
        sort_none: "无",
        sort_id: "怪物ID",
        sort_attrs: "属性",
        sort_evoRootId: "进化树",
        sort_evoRoot_Attrs : "进化根怪物的属性",
        sort_rarity: "稀有度",
        sort_cost: "消耗",
        sort_mp: "MP",
        sort_skillLv1: "技能最大冷却时间",
        sort_skillLvMax: "技能最小冷却时间",
        sort_hpMax110: "最大 HP",
        sort_atkMax110: "最大攻击",
        sort_rcvMax110: "最大回复",
        sort_hpMax110_awoken: "最大 HP（+觉醒）",
        sort_atkMax110_awoken: "最大攻击（+觉醒）",
        sort_rcvMax110_awoken: "最大回复（+觉醒）",
        sort_abilityIndex_awoken: "最大加权能力指数（+觉醒）",
    },
    force_reload_data: "强制刷新数据",
    skill_parse: {
        skill: {
			unknown: tp`未知的技能类型：${'type'}`, //type
			active_turns: tp`${'actionSkill'}，效果 ${'turns'} 回合`, //turns, actionSkill
			random_skills: tp`随机发动以下技能：${'skills'}`, //skills
			damage_enemy: tp`对${'target'}造成${'damage'}的${'attr'}伤害`, //target, damage, attr
			vampire: tp`对${'target'}造成${'damage'}的${'attr'}伤害，并${'icon'}回复伤害值${'heal'}的HP`, //target, damage, attr
			delay: tp`${'icon'}延迟敌人的攻击`, //icon
			mass_attack: tp`所有攻击变为${'icon'}全体攻击`,
			leader_change: tp`${'icon'}将${'target'}换为队长，再次使用则换回来`,
			no_skyfall: tp`${'icon'}天降的宝珠不会消除`,
			self_harm: tp`${'icon'}${'stats'}减少${'value'}`,
            heal: tp`${'icon'}回复 ${'value'} 的 ${'stats'}`,
			unbind_normal: tp`${'icon'}封锁状态减少${'turns'}`,
			unbind_awakenings: tp`${'icon'}觉醒无效状态减少${'turns'}回合`,
			unbind_matches: tp`${'icon'}无法消除宝珠状态减少${'turns'}回合`,
            defense_break: tp`${'icon'}敌方的防御力减少${'value'}回合`,
            poison: tp`${'icon'}使${'target'}全体中毒，每回合损失${'belong_to'} ${'value'} 的 ${'stats'}`,
			time_extend: tp`${'icon'}宝珠移动时间 ${'value'}`,
			follow_attack: tp`${'icon'}消除宝珠的回合，以${'belong_to'}${'value'}的伤害追打${'target'}（计算防御力）`,
			follow_attack_fixed: tp`追加${'target'}的${'icon'}固定伤害`,
            auto_heal_buff: tp`行动结束后${'icon'}回复${'value'}的${'stats'}`,
			auto_heal: tp`${'icon'}消除宝珠的回合，回复${'belong_to'}${'value'}的${'stats'}`,
			ctw: tp`${'icon'}${'value'}内时间停止，可以任意移动宝珠`,
			gravity: tp`${'icon'}造成${'target'}${'value'}的伤害`,
			resolve: tp`${'icon'}如${'stats'}≧${'value'}，受到单一次致命攻击时，${'prob'}将会以1点 HP 生还`,
			board_change: tp`全画面的宝珠变为${'orbs'}`,
			skill_boost: tp`自身以外成员的技能冷却储备${'icon'}${'turns'}`,
			add_combo: tp`结算时连击数增加${'value'}${'icon'}`,
			fixed_time: tp`【${'icon'}操作时间固定${'value'}】`,
			min_match_length: tp`【限定≥${'value'}珠才能消除】`,
			drop_refresh: tp`全板刷新`,
			drum: tp`宝珠移动和消除的声音变成太鼓达人的音效`,
			board7x6: tp`【${'icon'}7×6版面】`,
			counter_attack: tp`受到${'target'}攻击时，${'prob'}进行受到伤害${'value'}的${'attr'}${'icon'}反击`,	
			change_orbs: tp`${'from'}→${'to'}`,
			generate_orbs: tp`${'exclude'}生成${'orbs'}各${'value'}个`,
			fixed_orbs: tp`在${'position'}产生${'orbs'}`,
			orb_drop_increase: tp`${'orbs'}的掉落率提高到${'value'}`,
			attr_absorb: tp`${'icon'}属性吸收`,
			combo_absorb: tp`${'icon'}连击吸收`,
			damage_absorb: tp`${'icon'}伤害吸收`,
			damage_void: tp`${'icon'}伤害无效`,
			void_enemy_buff: tp`敌人的 ${'buff'} 无效化`,
			change_attribute: tp`将${'target'}变为${'attrs'}`,
			set_orb_state_enhanced: tp`强化${'orbs'}（每颗宝珠效力增加${'value'}）`,
			set_orb_state_locked: tp`将${'orbs'}锁定${'value'}`,
			set_orb_state_unlocked: tp`${'icon'}解除所有宝珠的锁定状态`,
			set_orb_state_bound: tp`无法消除${'orbs'}`,
			rate_multiply: tp`作为队长进入地下城时，${'rate'}变为${'value'}`,
			rate_multiply_drop: tp`${'icon'}怪物蛋掉落率`,
			rate_multiply_coin: tp`${'icon'}金币掉落率`,
			rate_multiply_exp: tp`${'icon'}等级经验倍率`,
			reduce_damage: tp`${'condition'}受到的${'attrs'}伤害${'icon'}减少${'value'}`,
			power_up: tp`${'condition'}${'targets'}${'value'}${'reduceDamage'}${'addCombo'}${'followAttack'}`,
		},
		power: {
            unknown: tp`[ 未知能力提升: ${'type'} ]`,
			scale_attributes: tp`${'attrs'}中${'min'}种属性同时攻击时${'stats'}${'bonus'}`,
			scale_attributes_bonus: tp`，每多1种${'bonus'}，最大${'max'}种时${'stats_max'}`,
			scale_combos: tp`${'min'}连击时，${'stats'}${'bonus'}`,
			scale_combos_bonus: tp`，每多1连击${'bonus'}，最大${'max'}连击时${'stats_max'}`,
			scale_match_attrs: tp`${'matches'}中${'min'}串匹配时，${'stats'}${'bonus'}`,
			scale_match_attrs_bonus: tp`，每多1串${'bonus'}，最大${'max'}串时${'stats_max'}`,
			scale_match_length: tp`相连消除${'min'}个${'attrs'}时${'stats'}${'bonus'}`,
			scale_match_length_bonus: tp`，每多1个${'bonus'}，最大${'max'}个时${'stats_max'}`,
		},
		cond: {
            unknown: tp`[ 未知条件 ]`,
			hp_equal: tp`${'hp'} == ${'min'} 时`,
			hp_less_or_equal: tp`${'hp'} ≤ ${'max'} 时`,
			hp_greater_or_equal: tp`${'hp'} ≥ ${'min'} 时`,
			hp_belong_to_range: tp`${'hp'} ∈ [${'min'},${'max'}] 时`,
			use_skill: tp`使用技能时`,
			multi_player: tp`协力时`,
			remain_orbs: tp`剩余宝珠 ≤ ${'value'} 时`,
			exact_combo: tp`刚好${'value'}连击时`,
			exact_match_length: tp`相连消除刚好${'value'}${'orbs'}时`,
			exact_match_enhanced: tp`并且其中包含至少一个强化宝珠`,

			compo_type_card: tp`队伍中同时存在 ${'ids'} 时`,
			compo_type_series: tp`队员组成全为 ${'ids'} 系列时`,
			compo_type_evolution: tp`队员组成全为 ${'ids'} 进化时`,
		},
		position: {
			top: tp`上方第${'pos'}横行`,
			bottom: tp`下方第${'pos'}横行`,
			left: tp`左方第${'pos'}竖列`,
			right: tp`右方第${'pos'}竖列`,
			shape: tp`指定位置`,
		},
        value: {
            unknown: tp`[ 未知数值: ${'type'}]`, //type
			const: tp`${'value'}${'unit'}`,
			const_to: tp`到${'value'}`,
			mul_percent: tp`${'value'}%`,
			mul_times: tp`×${'value'}倍`,
			mul_of_percent: tp`${'stats'}的${'value'}%`,
			mul_of_times: tp`${'stats'}×${'value'}倍`,
			hp_scale: tp`${'hp'}为100%时${'min'}，${'hp'}为1时${'max'}`,
			random_atk: tp`${'atk'}×${'min'}${'max'}倍`,
			prob: tp`有${'value'}几率`,
		},
		target: {
			self: tp`发动者自身`,
			enemy: tp`敌人`,
			team: tp`队伍`,
			team_last: tp`队伍最后一位队员`,
			enemy_all: tp`敌方全体`,
			enemy_one: tp`敌方1体`,
			enemy_attr: tp`${'attr'}敌人`,
		},
        stats: {
            unknown: tp`[ 未知状态: ${'type'}]`, //type
            maxhp: tp`最大HP`,
            hp: tp`HP`,
            chp: tp`当前HP`,
            atk: tp`攻击力`,
			rcv: tp`回复力`,
            teamhp: tp`队伍总HP`,
            teamatk: tp`队伍${'attrs'}总攻击力`,
            teamrcv: tp`队伍回复力`,
        },
		unit: {
			unit: tp`个`,
			seconds: tp`秒`,
			point: tp`点`,
			turns: tp`回合`,
		},
		word: {
			comma: tp`，`, //逗号
			slight_pause: tp`、`, //顿号
			range_hyphen: tp`~`, //范围连字符
			affix_attr: tp`${'cotent'}属性`, //词缀-属性
			affix_orb: tp`${'cotent'}宝珠`, //词缀-宝珠
			affix_type: tp`${'cotent'}类型`, //词缀-类型
			affix_exclude: tp`${'cotent'}以外`, //词缀-属性
		},
		attrs: {
			[0]: tp`${'icon'}火`,
			[1]: tp`${'icon'}水`,
			[2]: tp`${'icon'}木`,
			[3]: tp`${'icon'}光`,
			[4]: tp`${'icon'}暗`,
			[5]: tp`${'icon'}回复`,
			[6]: tp`${'icon'}空`,
			all: tp`所有`,
			self: tp`${'icon'}自身属性`,
			fixed: tp`${'icon'}无视防御固定`,
		},
		types: {
			[0]: tp`${'icon'}进化用`,
			[1]: tp`${'icon'}平衡`,
			[2]: tp`${'icon'}体力`,
			[3]: tp`${'icon'}回复`,
			[4]: tp`${'icon'}龙`,
			[5]: tp`${'icon'}神`,
			[6]: tp`${'icon'}攻击`,
			[7]: tp`${'icon'}恶魔`,
			[8]: tp`${'icon'}攻击`,
			[9]: tp`${'icon'}特别保护`,
			[12]: tp`${'icon'}能力觉醒用`,
			[14]: tp`${'icon'}强化合成用`,
			[15]: tp`${'icon'}贩卖用`,
		},
		orbs: {
			[0]: tp`${'icon'}火`,
			[1]: tp`${'icon'}水`,
			[2]: tp`${'icon'}木`,
			[3]: tp`${'icon'}光`,
			[4]: tp`${'icon'}暗`,
			[5]: tp`${'icon'}回复`,
			[6]: tp`${'icon'}干扰`,
			[7]: tp`${'icon'}毒`,
			[8]: tp`${'icon'}剧毒`,
			[9]: tp`${'icon'}炸弹`,
			_5color: tp`${'icon'}5色`,
			_6color: tp`${'_5color'}+${'orb_rcv'}`,
			all: tp`所有`,
			any: tp`任何`,
		},
    },
}
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = function() {
	const negative = this < 0;

    let numTemp = negative ? Math.abs(this) : this.valueOf();
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
    return (negative ? "-" : "") + outStr;
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
    function getFixedHpAtkRcvString(values, scale = true) {
        let mulArr = null;
        if (Array.isArray(values)) {
            mulArr = [
                100,
                values[0],
                values[1],
            ];
        } else {
            mulArr = [
                (values.hp || 100),
                (values.atk || 100),
                (values.rcv || 100)
            ];
        }
		let hasMul = new Set(mulArr);
		hasMul.delete(100);
		hasMul = Array.from(hasMul);
        let str = "";
        if (hasMul.length > 0) {
            if (hasMul.length > 1) { //存在不一样的值
                str += mulArr.map((m, i) => (m > 0 && m != 100) ? (mulName[i] + (scale ? (m >= 1 ? `×${m/100}倍` : `变为${m}%`) : `增加${m}%`)) : null).filter(s => s != null).join("，");
            } else {
                let hasMulName = mulName.filter((n, i) => mulArr[i] != 100);
                if (hasMulName.length >= 3) {
                    str += hasMulName.slice(0, hasMulName.length - 1).join("、") + "和" + hasMulName[hasMulName.length - 1];
                } else {
                    str += hasMulName.join("和");
                }
                str += scale ? (hasMul[0] >= 1 ? `×${hasMul[0]/100}倍` : `变为${hasMul[0]}%`) : `增加${hasMul[0]}%`;
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
    switch (skill.type) {
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
            str = `回复 ${sk[0]} 点 HP `;
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
		/*case 50:
			str = `${sk[0]}回合内，${(sk[1]==5?"回复力":`${attrN(sk[1])}属性的攻击力`)}${sk[2]>0?`×${sk[2]/100}倍`:"变为0"}`;*/
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
		/*case 88:
			str = `${sk[0]}回合内，${typeN(sk[1])}类型的攻击力×${sk[2]/100}倍`;
			break;*/
		case 50:
		case 90:
		{
			let attrs = sk.slice(1, skill.type == 50 ? 2 : 3);
			let turns = sk[0];
			let rate = sk[skill.type == 50 ? 2 : 3] /100;
			str = `${turns}回合内，`;
			if (attrs.includes(5) && attrs.length == 1)
			{
				str += "回复力";
			}else
			{
				str += `${getAttrTypeString(attrs)}的攻击力${attrs.includes(5) ? "、回复力" : ""}`;
			}
			str += `${rate>0?`×${rate}倍`:"变为0"}`;
			break;
		}
		case 91:
			str = `${sk.slice(0,-1).map(attrN).join("、")}属性宝珠强化（每颗强化珠伤害/回复增加${sk[sk.length-1]}%）`;
			break;
		case 88:
		case 92:
		{
			let types = sk.slice(1, skill.type == 88 ? 2 : 3);
			let turns = sk[0];
			let rate = sk[skill.type == 50 ? 2 : 3] /100;
			str = `${turns}回合内，${getAttrTypeString(null,types)}的攻击力${rate>0?`×${rate}倍`:"变为0"}`;
			break;
		}
		case 93:
			str = `将自己换成队长，再次使用此技能则换为原来的队长。（进入地下城时为队长的话无效）`;
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
					str = `${strArr.map(a=>nb(a, attrsName)).join("、")}中${sk[5]}串同时攻击时，所有宠物的攻击力×${sk[6]/100}倍`;
				}else
				{//木寶珠有2COMBO時，所有寵物的攻擊力3倍，每多1COMBO+4倍，最大5COMBO時15倍 
					str = `${nb(strArr[0], attrsName).join("、")}宝珠有${sk[5]}串时，所有宠物的攻击力×${sk[6]/100}倍`;
				}
				if (sk[7]) str += `，每多1串+${sk[7]/100}倍，最大${strArr.length}串时×${(sk[6]+sk[7]*(strArr.length-sk[5]))/100}倍`;
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
			str = `${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}回合内，${nb(sk[0], attrsName).join("、")}宝珠的掉落率提高到${sk[3]}%`;
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
			if (sk[5]) str += `${str.length>0?"，":""}受到的${getAttrTypeString(flags(sk[5]))}伤害减少${sk[6]}%`;
			break;
		case 130:
			str = `HP ${sk[0]}%以下时`;
			if (sk[1] || sk[2]) str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${getAttrTypeString(flags(sk[5]))}伤害减少${sk[6]}%`;
			break;
		case 131:
			str = `HP ${sk[0]==100?"全满":`${sk[0]}%以上`}时`;
			if (sk[1] || sk[2]) str += `${getAttrTypeString(flags(sk[1]),flags(sk[2]))}宠物`;
			if (sk[3] || sk[4]) str += `的${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]})}`;
			if (sk[5]) str += `，受到的${getAttrTypeString(flags(sk[5]))}伤害减少${sk[6]}%`;
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
			str = `自身以外的宠物技能冷却减少↑${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}回合`;
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
		{
			let awokenArr = sk.slice(1,4).filter(s=>s>0);
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
		}
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
			if (sk[1] && sk[1] !== 100) str += `，所有宠物的攻击力×${sk[1]/100}倍`;
			if (sk[2]) str += `，受到的伤害减少${sk[2]}%`;
			if (sk[4]) str += `；此后每多1连击攻击力+${sk[3]/100}倍，最大${sk[4]}连击时×${(sk[4] - sk[0]) * sk[3]/100 + sk[1]/100}倍`;
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
			if (sk[2] && sk[2] !== 100) str += `，所有宠物的攻击力×${sk[2]/100}倍`;
			if (sk[3]) str += `，受到的伤害减少${sk[3]}%`;
			if (sk[4]) str += `；此后每多1种属性攻击力+${sk[4]/100}倍，最大${sk[1] + (sk[5] - 1)}种属性时×${(sk[5] - 1) * sk[4]/100 + sk[2]/100}倍`;
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
			fragment.appendChild(document.createTextNode(`系列角色时，所有宠物的${getFixedHpAtkRcvString({hp:sk[3],atk:sk[4],rcv:sk[5]})}`));
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
			if (sk[6]) str += `，受到的${getAttrTypeString(flags(sk[6]))}属性伤害减少${sk[7]}%`;
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
			str = `相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0], true)}宝珠时`;
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
		case 192: //192同时消除多色中所有色,219任意消除多色中1色
			//相連消除9個或以上的火寶珠時攻擊力4倍、結算增加2COMBO
			//同時消除光寶珠和水寶珠各4個或以上時攻擊力3倍、結算增加1COMBO；
			str = `${flags(sk[0]).length>1?"同时且":""}相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0])}宝珠时`;
			if (sk[2] && sk[2] != 100) str += `，所有宠物的攻击力×${sk[2]/100}倍`;
			if (sk[3]) str += `，结算时连击数+${sk[3]}`;
			break;
		case 193:
			str = `以L字形消除5个${getOrbsAttrString(sk[0], true)}宝珠时`;
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
		case 215: //封自己的珠子
			str = `${sk[0]}回合内，${getOrbsAttrString(sk[1])}宝珠无法消除`;
			break;
		case 218: //坐自己
			str = `自身以外的宠物技能坐下↓${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}回合`;
			break;
		case 219: //192同时消除多色中所有色,219任意消除多色中1色
			str = `相连消除${sk[1]}个或以上的${getOrbsAttrString(sk[0], true)}宝珠时，结算时连击数+${sk[2]}`;
			break;
		case 220:
			str = `以L字形消除5个${getOrbsAttrString(sk[0], true)}宝珠时，结算时连击数+${sk[1]}`;
			break;
		case 223:
			str = `${sk[0]}连击以上时，追加${sk[1].bigNumberToString()}点固定伤害`;
			break;
		case 224:
			str = `${sk[0]}回合内，敌人全体变为${attrN(sk[1])}属性。（不受防护盾的影响）`;
			break;
		case 225:{
			let strArr = [];
			if (sk[0]) strArr.push(`大于${sk[0]}%`);
			if (sk[1]) strArr.push(`小于${sk[1]}%`);
			str = `HP${strArr.join("或")}时才能发动后续效果`;
			break;
		}
		case 226:{
			str = `${sk[0]}回合内，${sk[1]}%概率掉落带钉宝珠`;
			break;
		}
		case 227:{
			str = `指使当前队长与最后一位队员交换位置，再次使用此技能则换回来。`;
			break;
		}
		case 228:
			str = `${sk[0]}回合内，队伍中每存在1个${getAttrTypeString(flags(sk[1]), flags(sk[2]))}时，${getFixedHpAtkRcvString({atk:sk[3],rcv:sk[4]}, false)}`;
			break;
		case 229:
			str = `队伍中每存在1个${getAttrTypeString(flags(sk[0]), flags(sk[1]))}时，${getFixedHpAtkRcvString({hp:sk[2],atk:sk[3],rcv:sk[4]}, false)}`;
			break;
		default:
			str = `未知的技能类型${skill.type}(No.${id})`;
			//开发部分
			//const copySkill = JSON.parse(JSON.stringify(skill));
			//copySkill.params = copySkill.params.map(p=>[p,getBooleanFromBinary(p).join("")]);
			console.log(`未知的技能类型${skill.type}(No.${id})`,findFullSkill(skill));
			break;
	}
	const span = fragment.appendChild(document.createElement("span"));
	span.innerHTML = str;
	//(skill.description.length?(descriptionToHTML(skill.description) + "<hr>"):"") + str
	return fragment;
}