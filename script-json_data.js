const dataSourceList = [ //几个不同的游戏服务区
	{
		code:"ja",
		source:"パズル＆ドラゴンズ"
	},
	{
		code:"en",
		source:"Puzzle & Dragons"
	},
	{
		code:"ko",
		source:"퍼즐앤드래곤"
	},
];
//类型和觉醒杀和潜觉杀的对应编号，还有类型可以打什么类型的潜觉杀
const typekiller_for_type = [
	{type:0,awoken:39,latent:16,typeKiller:[]}, //0进化
	{type:12,awoken:40,latent:17,typeKiller:[]}, //12觉醒
	{type:14,awoken:41,latent:18,typeKiller:[]}, //14强化
	{type:15,awoken:42,latent:19,typeKiller:[]}, //15卖钱
	{type:5,awoken:32,latent:20,typeKiller:[7]}, //5神
	{type:4,awoken:31,latent:21,typeKiller:[8,3]}, //4龙
	{type:7,awoken:33,latent:22,typeKiller:[5]}, //7恶魔
	{type:8,awoken:34,latent:23,typeKiller:[5,1]}, //8机械
	{type:1,awoken:35,latent:24,typeKiller:[5,4,7,8,1,6,2,3]}, //1平衡
	{type:6,awoken:36,latent:25,typeKiller:[7,2]}, //6攻击
	{type:2,awoken:37,latent:26,typeKiller:[8,3]}, //2体力
	{type:3,awoken:38,latent:27,typeKiller:[4,6]}, //3回复
	{type:9,awoken:null,latent:null,typeKiller:[]}, //特殊保护
];
//类型允许的潜觉杀
const type_allowable_latent = [];
typekiller_for_type.forEach(t=>
	{
		t.allowableLatent = t.typeKiller.concat([0,12,14,15]) //补充4种特殊杀
		.map(tn=>
			typekiller_for_type.find(_t=>_t.type == tn).latent
		);
		type_allowable_latent[t.type] = t.allowableLatent;
	}
);
//一般共同能打的潜觉
const common_allowable_latent = [
	1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
	28,29,30,31,32,33,34,35,36,37,38,
	39,40,41, //需要拥有觉醒的才能打，但是有武器
];
//120级才能打的潜觉
const v120_allowable_latent = [
	42,43,44,45
];
//等效觉醒列表
const equivalent_awoken = [
	{small:10,big:52,times:2}, //防封
	{small:11,big:68,times:5}, //防暗
	{small:12,big:69,times:5}, //防废
	{small:13,big:70,times:5}, //防毒
	{small:19,big:53,times:2}, //手指
	{small:21,big:56,times:2}, //SB
];
//官方的觉醒排列顺序
const official_awoken_sorting = [
          21, 19, 43, 45, 10, 11, 12, 13, 49,
          56, 53, 61, 50, 52, 68, 69, 70, 28,
          27, 48, 62, 57, 58, 60, 59, 54, 55,
          14, 15, 16, 17, 18, 29, 20, 44, 51,
          22, 23, 24, 25, 26, 32, 31, 33, 34,
           4,  5,  6,  7,  8, 35, 36, 37, 38,
           1,  2,  3, 46, 47, 39, 40, 41, 42,
          65, 66, 67,  9, 71, 72, 30, 64, 63,
          73, 74, 75, 76, 77, 78, 79, 80, 81
];

//pdc的徽章对应数字
const pdcBadgeMap = [
	{pdf:0,pdc:10}, //无限cost
	{pdf:1,pdc:12}, //小手指
	{pdf:2,pdc:9}, //全体攻击
	{pdf:3,pdc:5}, //小回复
	{pdf:4,pdc:1}, //小血量
	{pdf:5,pdc:3}, //小攻击
	{pdf:6,pdc:8}, //SB
	{pdf:7,pdc:18}, //队长防封
	{pdf:8,pdc:19}, //SX
	{pdf:9,pdc:7}, //无天降
	{pdf:10,pdc:6}, //大回复
	{pdf:11,pdc:2}, //大血量
	{pdf:12,pdc:4}, //大攻击
	{pdf:13,pdc:13}, //大手指
	{pdf:14,pdc:11}, //加经验
	{pdf:15,pdc:15}, //墨镜
	{pdf:16,pdc:17}, //防废
	{pdf:17,pdc:16}, //防毒
	{pdf:18,pdc:14}, //月卡
];
//pdc的潜觉对应数字
const pdcLatentMap = [
	{pdf:1,pdc:1}, //HP
	{pdf:2,pdc:0}, //攻击
	{pdf:3,pdc:2}, //回复
	{pdf:4,pdc:19}, //手指
	{pdf:5,pdc:13}, //自回
	{pdf:6,pdc:14}, //火盾
	{pdf:7,pdc:15}, //水盾
	{pdf:8,pdc:16}, //木盾
	{pdf:9,pdc:17}, //光盾
	{pdf:10,pdc:18}, //暗盾
	{pdf:11,pdc:12}, //防坐
	{pdf:12,pdc:3}, //三维
	{pdf:13,pdc:35}, //不被换队长
	{pdf:14,pdc:37}, //不掉废
	{pdf:15,pdc:36}, //不掉毒
	{pdf:16,pdc:24}, //进化杀
	{pdf:17,pdc:25}, //觉醒杀
	{pdf:18,pdc:26}, //强化杀
	{pdf:19,pdc:27}, //卖钱杀
	{pdf:20,pdc:4}, //神杀
	{pdf:21,pdc:5}, //龙杀
	{pdf:22,pdc:6}, //恶魔杀
	{pdf:23,pdc:7}, //机械杀
	{pdf:24,pdc:8}, //平衡杀
	{pdf:25,pdc:9}, //攻击杀
	{pdf:26,pdc:10}, //体力杀
	{pdf:27,pdc:11}, //回复杀
	{pdf:28,pdc:20}, //大HP
	{pdf:29,pdc:21}, //大攻击
	{pdf:30,pdc:22}, //大回复
	{pdf:31,pdc:23}, //大手指
	{pdf:32,pdc:28}, //大火盾
	{pdf:33,pdc:29}, //大水盾
	{pdf:34,pdc:30}, //大木盾
	{pdf:35,pdc:31}, //大光盾
	{pdf:36,pdc:32}, //大暗盾
	{pdf:37,pdc:33}, //6色破无效
	{pdf:38,pdc:34}, //3色破属吸
	{pdf:39,pdc:40}, //C珠破吸
	{pdf:40,pdc:39}, //心横解转转
	{pdf:41,pdc:38}, //U解禁消
	{pdf:42,pdc:41}, //伤害上限解除
	{pdf:43,pdc:42}, //HP++
	{pdf:44,pdc:43}, //攻击++
	{pdf:45,pdc:44}, //回复++
];
//排序程序列表
const sort_function_list = [
	{tag:"sort_none",name:"",otLangName:{chs:"无"},function:()=>0},
	{tag:"sort_id",name:"",otLangName:{chs:"怪物ID"},function:(a,b)=>a.id-b.id},
	{tag:"sort_attrs",name:"",otLangName:{chs:"属性"},function:(a,b)=>{
		let num = a.attrs[0] - b.attrs[0];
		if (num === 0) num = a.attrs[1] - b.attrs[1];
		return num;
	}},
	{tag:"sort_evoRootId",name:"",otLangName:{chs:"进化树"},function:(a,b)=>a.evoRootId-b.evoRootId},
	{tag:"sort_evoRoot_Attrs",name:"",otLangName:{chs:"进化根怪物的属性"},function:(a,b)=>{
		const card_a = Cards[a.evoRootId],card_b = Cards[b.evoRootId];
		let num = card_a.attrs[0] - card_b.attrs[0];
		if (num === 0) num = card_a.attrs[1] - card_b.attrs[1];
		return num;
	}},
	{tag:"sort_rarity",name:"",otLangName:{chs:"稀有度"},function:(a,b)=>a.rarity-b.rarity},
	{tag:"sort_cost",name:"",otLangName:{chs:"消耗"},function:(a,b)=>a.cost-b.cost},
	{tag:"sort_mp",name:"",otLangName:{chs:"MP"},function:(a,b)=>a.mp-b.mp},
	{tag:"sort_skillLv1",name:"",otLangName:{chs:"技能最大冷却时间"},function:(a,b)=>Skills[a.activeSkillId].initialCooldown-Skills[b.activeSkillId].initialCooldown},
	{tag:"sort_skillLvMax",name:"",otLangName:{chs:"技能最小冷却时间"},function:(a,b)=>{
		const skill_a = Skills[a.activeSkillId],skill_b = Skills[b.activeSkillId];
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
	}},
	{tag:"sort_hpMax110",name:"",otLangName:{chs:"Lv110最大HP"},function:(a,b)=>a.hp.max * (1 + a.limitBreakIncr/100) - b.hp.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_atkMax110",name:"",otLangName:{chs:"Lv110最大攻击"},function:(a,b)=>a.atk.max * (1 + a.limitBreakIncr/100) - b.atk.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_rcvMax110",name:"",otLangName:{chs:"Lv110最大回复"},function:(a,b)=>a.rcv.max * (1 + a.limitBreakIncr/100) - b.rcv.max * (1 + b.limitBreakIncr/100)},
	
	{tag:"sort_hpMax110_awoken",name:"",otLangName:{chs:"Lv110最大攻击(+觉醒)"},function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.atk : 0,
				  abB = abilities_2statusB ? abilities_2statusB.withAwoken.atk : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax110_awoken",name:"",otLangName:{chs:"Lv110最大HP(+觉醒)"},function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax110_awoken",name:"",otLangName:{chs:"Lv110最大回复(+觉醒)"},function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.rcv : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.rcv : 0;
			return abA - abB;
		}
	},
	{tag:"sort_abilityIndex_awoken",name:"",otLangName:{chs:"Lv110最大加权能力指数(+觉醒)"},function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp / 10 + abilities_2statusA.withAwoken.atk / 5 + abilities_2statusA.withAwoken.rcv / 3 : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp / 10 + abilities_2statusB.withAwoken.atk / 5 + abilities_2statusB.withAwoken.rcv / 3 : 0;
			return abA - abB;
		}
	},
];

//增加特殊搜索模式
const specialSearchFunctions = (function() {
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
			case 178: //无条件盾，属性个数不固定
				scale = (allAttr && (sk[6] & 31) != 31) ? 0 : sk[7]/100;
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
	
	function boardChange_ColorTypes(skill)
	{
		if (!skill) return [];
		const sk = skill.params;
		const colors = sk.slice(0, sk.includes(-1)?sk.indexOf(-1):undefined);
		return colors;
	}
	function boardChange_Addition(card)
	{
		const searchTypeArray = [71];
		const skill = getCardSkill(card, searchTypeArray);
		const colors = boardChange_ColorTypes(skill);
		return createOrbsList(colors);
	}
	function changeOrbs_Addition(card)
	{
		const searchTypeArray = [154];
		const skill = getCardActiveSkill(card, searchTypeArray);
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		fragment.appendChild(createOrbsList(flags(sk[0] || 1)));
		fragment.appendChild(document.createTextNode(`→`));
		fragment.appendChild(createOrbsList(flags(sk[1] || 1)));
		return fragment;
	}
	function generateOrbs_Addition(card)
	{
		const searchTypeArray = [141];
		const skill = getCardActiveSkill(card, searchTypeArray);
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		fragment.appendChild(createOrbsList(flags(sk[1] || 1)));
		fragment.appendChild(document.createTextNode(`×${sk[0]}`));
		return fragment;
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
		if (orbs == undefined) orbs = [0];
		else if (!Array.isArray(orbs)) orbs = [orbs];
		const ul = document.createElement("ul");
		ul.className = "board";
		orbs.forEach(orbType => {
			const li = ul.appendChild(document.createElement("li"));
			li.className = `orb-icon`;
			li.setAttribute("data-orb-icon", orbType);
		});	
		return ul;
	}

	const functions = [
		{name:"No Filter",otLangName:{chs:"不做筛选"},function:cards=>cards},
		{group:true,name:"======Leader Skills=====",otLangName:{chs:"======队长技======"}, functions: [
			{name:"Fixed damage inflicts(sort by damage)",otLangName:{chs:"队长技固伤追击（按伤害排序）"},function:cards=>{
				const searchTypeArray = [199,200,201,223];
				function getSkillFixedDamage(skill)
				{
					switch (skill.type)
					{
						case 199: case 200:
							return skill.params[2];
						case 201:
							return skill.params[5];
						case 223:
							return skill.params[1];
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
				const searchTypeArray = [199,200,201,223];
				function getSkillFixedDamage(skill)
				{
					switch (skill.type)
					{
						case 199: case 200:
							return skill.params[2];
						case 201:
							return skill.params[5];
						case 223:
							return skill.params[1];
						default:
							return 0;
					}
				}
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				const value = getSkillFixedDamage(skill);
				return document.createTextNode(value.bigNumberToString() + "固伤");
			}},
			{name:"Adds combo(sort by combo)",otLangName:{chs:"队长技+C（按+C数排序）"},function:cards=>{
				const searchTypeArray = [192,194,206,209,210,219];
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
						case 219:
							return skill.params[2];
						case 220:
							return skill.params[1];
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
				const searchTypeArray = [192,194,206,209,210,219];
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
						case 219:
							return skill.params[2];
						case 220:
							return skill.params[1];
						default:
							return 0;
					}
				}
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				const value = getSkillAddCombo(skill);
				return document.createTextNode(`+${value.bigNumberToString()}C${skill.type==210?`/十字`:""}`);
			}},
			{name:"7×6 board",otLangName:{chs:"7×6 版面"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [162,186];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"No skyfall",otLangName:{chs:"无天降版面"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [163,177];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"Move time changes(sort by time)",otLangName:{chs:"队长技加/减秒（按秒数排序）"},function:cards=>cards.filter(card=>{
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
				return document.createTextNode((value > 0 ? "+" : "") + (value/100) + "s");
			}},
			{name:"Fixed move time(sort by time)",otLangName:{chs:"固定操作时间（按时间排序）"},function:cards=>cards.filter(card=>{
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
				return document.createTextNode("固定" + value + "s");
			}},
			{name:"Bonus attack when matching Orbs(sort by rate)",otLangName:{chs:"消除宝珠时计算防御的追打（按追打比率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Recovers HP when matching Orbs(sort by rate)",otLangName:{chs:"消除宝珠时回血（按回复比率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Counterattack(sort by rate)",otLangName:{chs:"队长技受伤反击"},function:cards=>cards.filter(card=>{
				const searchType = 41;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Voids Poison dmg",otLangName:{chs:"毒无效"},function:cards=>cards.filter(card=>{
				const searchType = 197;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			/*{name:"",otLangName:{chs:"回血加盾"},function:cards=>cards.filter(card=>{
				const searchType = 198;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType && skill.params[2])
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[2]);
				}
			})},*/
			{name:"Recover Awkn Skill bind when rcv",otLangName:{chs:"回血解觉"},function:cards=>cards.filter(card=>{
				const searchType = 198;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType && skill.params[3])
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3]);
				}
			})},
			{name:"Cross(十) of Heal Orbs",otLangName:{chs:"十字心"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [151,209];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"Cross(十) of Color Orbs",otLangName:{chs:"N个十字"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [157];
				const skill = Skills[card.leaderSkillId];
				if (searchTypeArray.some(t=>skill.type == t))
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.some(t=>subskill.type == t));
				}
			})},
			{name:"Less remain on the board",otLangName:{chs:"剩珠倍率"},function:cards=>cards.filter(card=>{
				const searchType = 177;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Unable to less match(sort by orbs need)",otLangName:{chs:"要求长串消除（按珠数排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Resolve",otLangName:{chs:"根性"},function:cards=>cards.filter(card=>{
				const searchType = 14;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Designate member ID",otLangName:{chs:"指定队伍队员编号"},function:cards=>cards.filter(card=>{
				const searchType = 125;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Designate collab ID",otLangName:{chs:"指定队伍队员合作编号"},function:cards=>cards.filter(card=>{
				const searchType = 175;
				const skill = Skills[card.leaderSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 138){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Designate Evo type",otLangName:{chs:"指定队伍队员进化类型"},function:cards=>cards.filter(card=>{
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
			{name:"Increase item drop rate(sort by rate)",otLangName:{chs:"增加道具掉落率（按增加倍率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Increase coin rate(sort by rate)",otLangName:{chs:"增加金币掉落倍数（按增加倍率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Increase Exp rate(sort by rate)",otLangName:{chs:"增加经验获取倍数（按增加倍率排序）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----HP Scale-----",otLangName:{chs:"-----血倍率-----"}, functions: [
			{name:"HP Scale [2, ∞) (sort by rate)",otLangName:{chs:"队长血倍率[2, ∞)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale >= 2;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
			{name:"HP Scale [1.5, 2) (sort by rate)",otLangName:{chs:"队长血倍率[1.5, 2)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale >= 1.5 && HPscale < 2;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
			{name:"HP Scale (1, 1.5) (sort by rate)",otLangName:{chs:"队长血倍率(1, 1.5)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale > 1 && HPscale < 1.5;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
			{name:"HP Scale == 1 (sort by rate)",otLangName:{chs:"队长血倍率 == 1"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale === 1;
			})},
			{name:"HP Scale [0, 1) (sort by rate)",otLangName:{chs:"队长血倍率[0, 1)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale < 1;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
			})},
		]},
		{group:true,name:"-----Reduce Shield-----",otLangName:{chs:"-----减伤盾-----"}, functions: [
			{name:"Reduce Damage [75%, 100%] (sort by rate)",otLangName:{chs:"队长盾减伤[75%, 100%]（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.75;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"Reduce Damage [50%, 75%) (sort by rate)",otLangName:{chs:"队长盾减伤[50%, 75%)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.5 && reduceScale < 0.75;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"Reduce Damage [25%, 50%) (sort by rate)",otLangName:{chs:"队长盾减伤[25%, 50%)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.25 && reduceScale < 0.5;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"Reduce Damage (0%, 25%) (sort by rate)",otLangName:{chs:"队长盾减伤(0%, 25%)（按倍率排序）"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale > 0 && reduceScale < 0.25;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"Reduce Damage == 0",otLangName:{chs:"队长盾减伤 == 0"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale === 0;
			})},
			{name:"Reduce Damage - Must all Att.",otLangName:{chs:"队长盾减伤-必须全属性减伤"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, true) > 0;
			})},
			{name:"Reduce Damage - Exclude HP-line",otLangName:{chs:"队长盾减伤-排除血线盾"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, undefined, true) > 0;
			})},
			{name:"Reduce Damage - Exclude chance",otLangName:{chs:"队长盾减伤-排除几率盾"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, undefined, undefined, true) > 0;
			})},
			{name:"More than half with 99% gravity[29%, 100%)",otLangName:{chs:"满血99重力不下半血-队长盾减伤[29%, 100%)"},function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale>=0.29;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
			})},
			{name:"Reduce Damage - Unconditional",otLangName:{chs:"队长盾减伤-无条件盾"},function:cards=>cards.filter(card=>{
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

		{group:true,name:"======Active Skill======",otLangName:{chs:"======主动技======"}, functions: [
			{name:"1 CD",otLangName:{chs:"1 CD"},function:cards=>cards.filter(card=>{
				if (card.activeSkillId == 0) return false;
				const skill = Skills[card.activeSkillId];
				return skill.initialCooldown - (skill.maxLevel - 1) <= 1;
			})},
			{name:"Less than 4 can be cycled use(Inaccurate)",otLangName:{chs:"除 1 CD 外，4 个以下能永动开（可能不精确）"},function:cards=>cards.filter(card=>{
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
			{name:"Time pause(sort by time)",otLangName:{chs:"时间暂停（按停止时间排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Random effect active",otLangName:{chs:"随机效果技能"},function:cards=>cards.filter(card=>Skills[card.activeSkillId].type == 118)},
		]},
		{group:true,name:"-----Voids Absorption-----",otLangName:{chs:"-----破吸类-----"}, functions: [
			{name:"Voids attribute absorption(sort by turns)",otLangName:{chs:"破属吸 buff（按破吸回合排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Voids damage absorption(sort by turns)",otLangName:{chs:"破伤吸 buff（按破吸回合排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Voids both absorption(sort by turns)",otLangName:{chs:"双破吸 buff（按破吸回合排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Pierce through damage void(sort by turns)",otLangName:{chs:"贯穿无效盾 buff（按破吸回合排序）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----Recovers Bind Status-----",otLangName:{chs:"-----解封类-----"}, functions: [
			{
				name:"Unbind normal(sort by turns)",otLangName:{chs:"解封（按解封回合排序）"},
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
				name:"Unbind awoken(sort by turns)",otLangName:{chs:"解觉醒（按解觉回合排序）"},
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
				name:"Unbind both(sort by awoken turns)",otLangName:{chs:"解封+觉醒（按解觉醒回合排序）"},
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
				name:"Unbind unmatchable(sort by turns)",otLangName:{chs:"解禁消珠（按消除回合排序）"},
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
			{name:"Bind self active skill",otLangName:{chs:"自封技能"},function:cards=>cards.filter(card=>{
				const searchType = 214;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Bind self matchable",otLangName:{chs:"自封消珠"},function:cards=>cards.filter(card=>{
				const searchType = 215;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
		]},
		{group:true,name:"-----Orbs Lock-----",otLangName:{chs:"-----锁珠类-----"}, functions: [
			{name:"Unlock",otLangName:{chs:"解锁"},function:cards=>cards.filter(card=>{
				const searchType = 172;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Lock(Any color)",otLangName:{chs:"上锁（不限色）"},function:cards=>cards.filter(card=>{
				const searchType = 152;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Lock(≥5 color)",otLangName:{chs:"上锁5色+心或全部"},function:cards=>cards.filter(card=>{
				const searchType = 152;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params[0] & 63) === 63)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params[0] & 63) === 63);
				}
			})},
			{name:"Locked orbs skyfall(any color, sort by turns)",otLangName:{chs:"掉锁（不限色，按回合排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Locked orbs skyfall(≥5 color, sort by turns)",otLangName:{chs:"掉锁5色+心或全部（按回合排序）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----Board Change-----",otLangName:{chs:"-----洗版类-----"}, functions: [
			{name:"Replaces all Orbs",otLangName:{chs:"刷版"},function:cards=>cards.filter(card=>{
				const searchType = 10;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Changes all Orbs to 1 color(Farm)",otLangName:{chs:"洗版-1色（花火）"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 1;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 2 color",otLangName:{chs:"洗版-2色"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 2;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 3 color",otLangName:{chs:"洗版-3色"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 3;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 4 color",otLangName:{chs:"洗版-4色"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 4;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 5 color",otLangName:{chs:"洗版-5色"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 5;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to ≥6 color",otLangName:{chs:"洗版-6色以上"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length >= 6;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs - include Fire",otLangName:{chs:"洗版-含火"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(0);
			})},
			{name:"Changes all Orbs - include Water",otLangName:{chs:"洗版-含水"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(1);
			})},
			{name:"Changes all Orbs - include Wood",otLangName:{chs:"洗版-含木"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(2);
			})},
			{name:"Changes all Orbs - include Light",otLangName:{chs:"洗版-含光"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(3);
			})},
			{name:"Changes all Orbs - include Dark",otLangName:{chs:"洗版-含暗"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(4);
			})},
			{name:"Changes all Orbs - include Heart",otLangName:{chs:"洗版-含心"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(5);
			})},
			{name:"Changes all Orbs - include Jammers/Poison",otLangName:{chs:"洗版-含毒废"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const colors = boardChange_ColorTypes(skill);
				return colors.includes(6)
					|| colors.includes(7)
					|| colors.includes(8)
					|| colors.includes(9);
			})},
		]},
		{group:true,name:"-----Orbs Change-----",otLangName:{chs:"-----指定色转珠类-----"}, functions: [
			{name:"Orbs Change - to Fire",otLangName:{chs:"转珠-变为-火"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(0);
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - to Water",otLangName:{chs:"转珠-变为-水"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(1);
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - to Wood",otLangName:{chs:"转珠-变为-木"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(2);
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - to Light",otLangName:{chs:"转珠-变为-光"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(3);
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - to Dark",otLangName:{chs:"转珠-变为-暗"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(4);
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - to Heart",otLangName:{chs:"转珠-变为-心"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(5);
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - to Jammers/Poison",otLangName:{chs:"转珠-变为-毒废"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return (sk[1] & 960) > 0;
			}),addition:changeOrbs_Addition},
			{name:"Orbs Change - from Fire",otLangName:{chs:"转珠-转走-火"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[0] || 1).includes(0);
			})},
			{name:"Orbs Change - from Water",otLangName:{chs:"转珠-转走-水"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[0] || 1).includes(1);
			})},
			{name:"Orbs Change - from Wood",otLangName:{chs:"转珠-转走-木"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[0] || 1).includes(2);
			})},
			{name:"Orbs Change - from Light",otLangName:{chs:"转珠-转走-光"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[0] || 1).includes(3);
			})},
			{name:"Orbs Change - from Dark",otLangName:{chs:"转珠-转走-暗"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[0] || 1).includes(4);
			})},
			{name:"Orbs Change - from Heart",otLangName:{chs:"转珠-转走-心"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[0] || 1).includes(5);
			})},
			{name:"Orbs Change - from Jammers/Poison",otLangName:{chs:"转珠-转走-毒废"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [154];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return (sk[0] & 960) > 0;
			})},
		]},
		{group:true,name:"-----Create Orbs-----",otLangName:{chs:"-----随机产珠类-----"}, functions: [
			{name:"Create 30 Orbs",otLangName:{chs:"固定30个产珠"},function:cards=>cards.filter(card=>{
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
			}),addition:generateOrbs_Addition},
			{name:"Create 15×2 Orbs",otLangName:{chs:"固定15×2产珠"},function:cards=>cards.filter(card=>{
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
			}),addition:generateOrbs_Addition},
			{name:"Create Fire Orbs",otLangName:{chs:"产珠-生成-火"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(0);
			}),addition:generateOrbs_Addition},
			{name:"Create Water Orbs",otLangName:{chs:"产珠-生成-水"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(1);
			}),addition:generateOrbs_Addition},
			{name:"Create Wood Orbs",otLangName:{chs:"产珠-生成-木"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(2);
			}),addition:generateOrbs_Addition},
			{name:"Create Light Orbs",otLangName:{chs:"产珠-生成-光"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(3);
			}),addition:generateOrbs_Addition},
			{name:"Create Dark Orbs",otLangName:{chs:"产珠-生成-暗"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(4);
			}),addition:generateOrbs_Addition},
			{name:"Create Heart Orbs",otLangName:{chs:"产珠-生成-心"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return flags(sk[1] || 1).includes(5);
			}),addition:generateOrbs_Addition},
			{name:"Create Jammers/Poison Orbs",otLangName:{chs:"产珠-生成-毒废"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				if (!skill) return false;
				const sk = skill.params;
				return (sk[1] & 960) > 0;
			}),addition:generateOrbs_Addition},
		]},
		{group:true,name:"-----Create Fixed Position Orbs-----",otLangName:{chs:"-----固定位置产珠类-----"}, functions: [
			{name:"Create designated shape",otLangName:{chs:"生成指定形状的"},function:cards=>cards.filter(card=>{
				const searchType = 176;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}),addition:card=>{
				const searchTypeArray = [176];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return createOrbsList(sk[5]);
			}},
			{name:"Create 3×3 block",otLangName:{chs:"生成3×3方块"},function:cards=>cards.filter(card=>{
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
			}),addition:card=>{
				const searchTypeArray = [176];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`3×3`));
				fragment.appendChild(createOrbsList(sk[5]));
				return fragment;
			}},
			{name:"Create a vertical",otLangName:{chs:"产竖"},function:cards=>cards.filter(card=>{
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
					colors.push(flags(sk[ai+1]));
				}
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`竖`));
				fragment.appendChild(createOrbsList(colors.flat()));
				return fragment;
			}},
			{name:"Create a vertical include Heart",otLangName:{chs:"产竖（含心）"},function:cards=>cards.filter(card=>{
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
			{name:"Create a horizontal",otLangName:{chs:"产横"},function:cards=>cards.filter(card=>{
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
					colors.push(flags(sk[ai+1]));
				}
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`横`));
				fragment.appendChild(createOrbsList(colors.flat()));
				return fragment;
			}},
			{name:"Create ≥2 horizontals",otLangName:{chs:"2横或以上"},function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params.length>=3 || flags(skill.params[0]).length>=2))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params.length>=3 || flags(subskill.params[0]).length>=2));
				}
			})},
			{name:"Create 2 color horizontals",otLangName:{chs:"2色横"},function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[3]>=0 && (skill.params[1] & skill.params[3]) != skill.params[1])
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3]>=0 && (subskill.params[1] & subskill.params[3]) != subskill.params[1]);
				}
			})},
			{name:"Create horizontal not Top or Bottom",otLangName:{chs:"非顶底横"},function:cards=>cards.filter(card=>{
				const searchType = 128;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && ((skill.params[0] | skill.params[2]) & 14))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && ((subskill.params[0] | subskill.params[2]) & 14));
				}
			})},
			{name:"Extensive horizontal(include Farm and outer edges)",otLangName:{chs:"泛产横（包含花火与四周一圈等）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"----- Buff -----",otLangName:{chs:"----- buff 类-----"}, functions: [
			{name:"Drop rate increases",otLangName:{chs:"掉落率提升"},function:cards=>cards.filter(card=>{
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
			{name:"Drop rate - Attr. - Jammers/Poison",otLangName:{chs:"掉落率提升-属性-毒、废（顶毒）"},function:cards=>cards.filter(card=>{
				const searchType = 126;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && (skill.params[0] & 960)) // 960 = 二进制 1111000000
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && (subskill.params[0] & 960));
				}
			})},
			{name:"Drop rate - 99 turns",otLangName:{chs:"掉落率提升-持续99回合"},function:cards=>cards.filter(card=>{
				const searchType = 126;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[1] >= 99)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[1] >= 99);
				}
			})},
			{name:"Drop rate - 100% rate",otLangName:{chs:"掉落率提升-100%几率"},function:cards=>cards.filter(card=>{
				const searchType = 126;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && skill.params[3] >= 100)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && subskill.params[3] >= 100);
				}
			})},
			{name:"Rate by awoken count(Jewel Princess)",otLangName:{chs:"以觉醒数量为倍率类技能（宝石姬）"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [156,168,228];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
			{name:"RCV rate change",otLangName:{chs:"回复力 buff（顶降回复）"},
				function:cards=>{
					const searchTypeArray = [50,90,228];
					function getRecScale(as)
					{
						const sk = as.params;
						if (as.type == 228)
						{
							return sk[4] || 0;
						}else
						{
							return sk.slice(1,sk.length>2?-1:undefined).includes(5) && sk.length > 2 ? sk[sk.length-1] : 0;
						}
					}
					return cards.filter(card=>{
						const skills = getCardActiveSkills(card, searchTypeArray);
						if (skills.length)
						{
							return skills.some(as=>getRecScale(as) > 0);
						}else return false;
					}).sort((a,b)=>{
						const a_ss = getCardActiveSkills(a, searchTypeArray), b_ss = getCardActiveSkills(b, searchTypeArray);
						const a_sv = a_ss.map(a_s=>getRecScale(a_s)).sort().reverse()[0], b_sv = b_ss.map(b_s=>getRecScale(b_s)).sort().reverse()[0];
						return a_sv - b_sv;
					});
				},
				addition:card=>{
					const searchTypeArray = [50,90,228];
					function getRecScale(as)
					{
						const sk = as.params;
						if (as.type == 228)
						{
							return sk[4] || 0;
						}else
						{
							return sk.slice(1,sk.length>2?-1:undefined).includes(5) && sk.length > 2 ? sk[sk.length-1] : 0;
						}
					}
					const skills = getCardActiveSkills(card, searchTypeArray);
					const skill = skills.find(as=>getRecScale(as) > 0);
					return document.createTextNode(`回x${getRecScale(skill) / 100}`);
				}
			},
			{name:"ATK rate change",otLangName:{chs:"攻击力 buff（顶降攻击）"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [
					88,92, //类型的
					50,90, //属性的，要排除回复力
					156,168, //宝石姬
					228, //属性、类型数量
				];
				const skill = Skills[card.activeSkillId];
				if ((skill.type==88 || skill.type==92) || //类型的
					(skill.type==50 || skill.type==90) && skill.params.slice(1,skill.params.length>2?-1:undefined).some(sk=>sk!=5) || //属性的，要排除回复力
					skill.type==156 && skill.params[4] == 2 || skill.type==168 || //宝石姬的
					skill.type==228 && skill.params[3] > 0 //属性、类型数量
				)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>
						(subskill.type==88 || subskill.type==92) || //类型的
						(subskill.type==50 || subskill.type==90) && subskill.params.slice(1,subskill.params.length>2?-1:undefined).some(sk=>sk!=5) || //属性的，要排除回复力
						subskill.type==156 && subskill.params[4] == 2 || subskill.type==168 ||//宝石姬的
						subskill.type==228 && subskill.params[3] > 0 //属性、类型数量
					);
				}
			})},
			{name:"Move time change",otLangName:{chs:"操作时间 buff（顶减手指）"},
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
			{name:"No skyfall",otLangName:{chs:"无天降 buff（顶无天降）"},function:cards=>cards.filter(card=>{
				const searchType = 184;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Creates Roulette Orb",otLangName:{chs:"生成变换位（顶变换珠）"},function:cards=>cards.filter(card=>{
				const searchType = 207;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"Adds combo(sort by combo)",otLangName:{chs:"加C buff（按C数排列）"},
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
			{name:"Reduce Damage for all Attr(sort by rate)",otLangName:{chs:"全属减伤 buff（按减伤比率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Reduce 100% Damage(invincible, sort by turns)",otLangName:{chs:"全属减伤 100%（无敌）"},function:cards=>cards.filter(card=>{
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
			{name:"Reduce all Damage for designated Attr(sort by turns)",otLangName:{chs:"限属减伤 buff（按回合排序排序）"},function:cards=>{
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
			{name:"Mass Attacks(sort by turns)",otLangName:{chs:"变为全体攻击（按回合数排序）"},function:cards=>{
				const searchTypeArray = [51];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>{
					const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
					let a_pC = a_s.params[0],b_pC = b_s.params[0];
					return a_pC - b_pC;
				});
			}},
		]},
		{group:true,name:"-----Player's HP change-----",otLangName:{chs:"-----玩家HP操纵类-----"}, functions: [
			{name:"Heal after turn",otLangName:{chs:"回合结束回血 buff"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [179];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
			{name:"Heal now",otLangName:{chs:"玩家回血"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [7,8,35,115];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type) || skill.type == 117 && (skill.params[1] || skill.params[2] || skill.params[3]))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type) || subskill.type == 117 && (subskill.params[1] || subskill.params[2] || subskill.params[3]));
				}
			})},
			{name:"Damage self(sort by rate)",otLangName:{chs:"玩家自残（HP 减少，按减少比率排序）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----For player team-----",otLangName:{chs:"-----对自身队伍生效类-----"}, functions: [
			{name:"↑Increase skills charge(sort by turns)",otLangName:{chs:"【溜】减少CD（按回合排序）"},function:cards=>cards.filter(card=>{
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
			{name:"↓Reduce skills charge(sort by turns)",otLangName:{chs:"【坐】增加CD（按回合排序）"},function:cards=>cards.filter(card=>{
				const searchType = 218;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			}).sort((a,b)=>{
				const searchType = 218;
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
				const searchTypeArray = [218];
				const skill = getCardSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`坐下${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}`);
			}},
			{name:"Change Leader",otLangName:{chs:"更换队长"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [93, 227];
				const skill = getCardSkill(card, searchTypeArray);
				return skill != null;
			})},
			{name:"Change self's Attr(sort by turns)",otLangName:{chs:"转换自身属性（按回合数排序）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----For Enemy-----",otLangName:{chs:"-----对敌 buff 类-----"}, functions: [
			{name:"Menace(sort by turns)",otLangName:{chs:"威吓（按推迟回合排序）"},function:cards=>{
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
			{name:"Reduces enemies' DEF(sort by rate)",otLangName:{chs:"破防（按防御减少比例排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Voids enemies' DEF(sort by turns)",otLangName:{chs:"100% 破防（按回合排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Poisons enemies(sort by rate)",otLangName:{chs:"中毒（按毒伤比率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Change enemies's Attr(sort by attr)",otLangName:{chs:"改变敌人属性（按属性排序）"},
				function:cards=>{
					//获取属性变化
					function getAttrChange(ls)
					{
						if (!ls) return null;
						const sk = ls.params;
						switch (ls.type)
						{
							case 153: //永久变色
								return sk[0];
							case 224: //回合变色
								return sk[1] || 0;
							default:
								return null;
						}
					}
					const searchTypeArray = [153, 224];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return getAttrChange(skill) != null;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = getAttrChange(a_s),b_pC = getAttrChange(b_s);
						return a_pC - b_pC;
					})
				},
				addition:card=>{
					//获取属性变化
					function getAttrChange(ls)
					{
						if (!ls) return null;
						const sk = ls.params;
						switch (ls.type)
						{
							case 153: //永久变色
								return sk[0];
							case 224: //回合变色
								return sk[1] || 0;
							default:
								return null;
						}
					}
					const searchTypeArray = [153, 224];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					
					const colors = [getAttrChange(skill)];
					const fragment = document.createDocumentFragment();
					if (skill.type == 224)
						fragment.appendChild(document.createTextNode(`${sk[0]}T,`));
					fragment.appendChild(document.createTextNode(`敌→`));
					fragment.appendChild(createOrbsList(colors));
					return fragment;
				}
			},
			{name:"Counterattack buff",otLangName:{chs:"受伤反击 buff"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----Damage Enemy - Gravity-----",otLangName:{chs:"-----对敌直接伤害类-重力-----"}, functions: [
			{name:"Gravity - Current HP(sort by rate)",otLangName:{chs:"重力-敌人当前血量（按比例排序）"},function:cards=>{
				const searchTypeArray = [6];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>{
					const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
					let a_pC = a_s.params[0],b_pC = b_s.params[0];
					return a_pC - b_pC;
				})
			},addition:card=>{
				const searchTypeArray = [6];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return `当前${sk[0]}%`;
			}},
			{name:"Gravity - Max HP(sort by rate)",otLangName:{chs:"重力-敌人最大血量（按比例排序）"},function:cards=>{
				const searchTypeArray = [161];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>{
					const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
					let a_pC = a_s.params[0],b_pC = b_s.params[0];
					return a_pC - b_pC;
				})
			},addition:card=>{
				const searchTypeArray = [161];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return `最大${sk[0]}%`;
			}},
		]},
		{group:true,name:"-----Damage Enemy - Fixed damage-----",otLangName:{chs:"-----对敌直接伤害类-无视防御固伤-----"}, functions: [
			{name:"Fixed damage - Single(sort by damage)",otLangName:{chs:"无视防御固伤-单体（按总伤害排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Fixed damage - Mass(sort by damage)",otLangName:{chs:"无视防御固伤-全体（按伤害数排序）"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"-----Damage Enemy - Numerical damage-----",otLangName:{chs:"-----对敌直接伤害类-大炮-----"}, functions: [
			{name:"Numerical ATK - Target - Single",otLangName:{chs:"大炮-对象-敌方单体"},function:cards=>cards.filter(card=>{
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
			{name:"Numerical ATK - Target - Mass",otLangName:{chs:"大炮-对象-敌方全体"},function:cards=>cards.filter(card=>{
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
			{name:"Numerical ATK - Target - Designate Attr",otLangName:{chs:"大炮-对象-指定属性敌人"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [42];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
	
			{name:"Numerical ATK - Attr - Any",otLangName:{chs:"大炮-属性-不限"},function:cards=>cards.filter(card=>{
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
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = [getCannonAttr(skill)];
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`射`));
				fragment.appendChild(createOrbsList(colors));
				return fragment;
			}},
			{name:"Numerical ATK - Attr - Actors self",otLangName:{chs:"大炮-属性-释放者自身"},function:cards=>cards.filter(card=>{
				const searchTypeArray = [2,35];
				const skill = Skills[card.activeSkillId];
				if (searchTypeArray.includes(skill.type))
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>searchTypeArray.includes(subskill.type));
				}
			})},
	
			{name:"Numerical ATK - Damage - Rate by Actors self ATK(sort by rate)",otLangName:{chs:"大炮-伤害-自身攻击倍率（按倍率排序，范围取小）"},function:cards=>cards.filter(card=>{
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
			{name:"Numerical ATK - Damage - Fixed Attr Number (sort by number)",otLangName:{chs:"大炮-伤害-指定属性数值（按数值排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Numerical ATK - Damage - By remaining HP (sort by rate at HP 1)",otLangName:{chs:"大炮-伤害-根据剩余血量（按 1 HP 时倍率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Numerical ATK - Damage - Team total HP (sort by rate)",otLangName:{chs:"大炮-伤害-队伍总 HP（按倍率排序）"},function:cards=>cards.filter(card=>{
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
			{name:"Numerical ATK - Damage - Team attrs ATK (sort by rate)",otLangName:{chs:"大炮-伤害-队伍某属性总攻击（按倍率排序）"},function:cards=>cards.filter(card=>{
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
	
			{name:"Numerical ATK - Special - Vampire",otLangName:{chs:"大炮-特殊-吸血"},function:cards=>cards.filter(card=>{
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
		{group:true,name:"======Evo type======",otLangName:{chs:"======进化类型======"}, functions: [
			{name:"No Henshin",otLangName:{chs:"非变身"},function:cards=>cards.filter(card=>!card.henshinFrom && !card.henshinTo)},
			{name:"Before Henshin",otLangName:{chs:"变身前"},function:cards=>cards.filter(card=>card.henshinTo)},
			{name:"After Henshin",otLangName:{chs:"变身后"},function:cards=>cards.filter(card=>card.henshinFrom)},
			{name:"Pixel Evo",otLangName:{chs:"像素进化"},function:cards=>cards.filter(card=>card.evoMaterials.includes(3826))},
			{name:"8 latent grids",otLangName:{chs:"8格潜觉"},function:cards=>cards.filter(card=>card.is8Latent)},
			//{name:"",otLangName:{chs:"非8格潜觉"},function:cards=>cards.filter(card=>!card.is8Latent)},
			{name:"Reincarnation/Super Re..",otLangName:{chs:"转生、超转生进化"},function:cards=>cards.filter(card=>isReincarnated(card))}, //evoBaseId可能为0
			//{name:"",otLangName:{chs:"仅超转生进化"},function:cards=>cards.filter(card=>isReincarnated(card) && !Cards[card.evoBaseId].isUltEvo)},
			{name:"Super Ult Evo",otLangName:{chs:"超究极进化"},function:cards=>cards.filter(card=>card.is8Latent && card.isUltEvo && !card.awakenings.includes(49))},
			/*{name:"",otLangName:{chs:"变身前"},function:cards=>cards.filter(card=>{
				const searchType = 202;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
			})},
			{name:"",otLangName:{chs:"变身前后队长技保持不变"},function:cards=>cards.filter(card=>{
				const searchType = 202;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && card.leaderSkillId == Cards[skill.params[0]].leaderSkillId)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && card.leaderSkillId == Cards[subskill.params[0]].leaderSkillId);
				}
			})},*/
			{name:"Evo from Weapon",otLangName:{chs:"由武器进化而来"},function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].awakenings.includes(49))},
		]},
		{group:true,name:"======Others Search======",otLangName:{chs:"======其他搜索======"}, functions: [
			{name:"Water Att. & Attacker Type(Tanjiro)",otLangName:{chs:"攻击型或水属性（炭治郎队员）"},function:cards=>cards.filter(card=>card.attrs.includes(1) || card.types.includes(6))},
			{name:"Fire & Water Att.(Seina)",otLangName:{chs:"火属性或水属性（火车队员）"},function:cards=>cards.filter(card=>card.attrs.includes(0) || card.attrs.includes(1))},
			{name:"Level limit unable break",otLangName:{chs:"不能突破等级限制"},function:cards=>cards.filter(card=>card.limitBreakIncr===0)},
			{name:"Raise 100% at lv110",otLangName:{chs:"110级三维成长100%"},function:cards=>cards.filter(card=>card.limitBreakIncr>=100)},
			{name:"Max level is lv1",otLangName:{chs:"满级只有1级"},function:cards=>cards.filter(card=>card.maxLevel==1)},
			{name:"Less than 100mp",otLangName:{chs:"低于100mp"},function:cards=>cards.filter(card=>card.sellMP<100)},
			{name:"Have 3 types",otLangName:{chs:"有3个type"},function:cards=>cards.filter(card=>card.types.filter(t=>t>=0).length>=3)},
			{name:"Have 2 Attrs",otLangName:{chs:"有两个属性"},function:cards=>cards.filter(card=>card.attrs.filter(a=>a>=0 && a<6))},
			{name:"2 attrs are different",otLangName:{chs:"主副属性不一致"},function:cards=>cards.filter(card=>card.attrs[0]<6 && card.attrs[1]>=0 && card.attrs[0] != card.attrs[1])},
			{name:"Will get Orbs skin",otLangName:{chs:"能获得宝珠皮肤"},function:cards=>cards.filter(card=>card.blockSkinId>0)},
			{name:"All Latent TAMADRA",otLangName:{chs:"所有潜觉蛋龙"},function:cards=>cards.filter(card=>card.latentAwakeningId>0).sort((a,b)=>a.latentAwakeningId-b.latentAwakeningId)},
			//{name:"",otLangName:{chs:"龙契士&龙唤士（10001）"},function:cards=>cards.filter(card=>card.collabId==10001)},
		]},
		{group:true,name:"----- Awoken -----",otLangName:{chs:"-----觉醒类-----"}, functions: [
			{name:"Have 9 awokens",otLangName:{chs:"有9个觉醒"},function:cards=>cards.filter(card=>card.awakenings.length>=9)},
			{name:"Can be assist",otLangName:{chs:"可以做辅助"},function:cards=>cards.filter(card=>card.canAssist)},
			{name:"Not weapon",otLangName:{chs:"不是武器"},function:cards=>cards.filter(card=>!card.awakenings.includes(49))},
			{name:"Able to lv110, but no Super Awoken",otLangName:{chs:"能突破等级限制但没有超觉醒"},function:cards=>cards.filter(card=>card.limitBreakIncr > 0 && card.superAwakenings.length == 0)},
			{name:"3 same Killer Awoken, or 2 with same latent",otLangName:{chs:"3个相同杀觉醒，或2个杀觉醒并可打相同潜觉"},function:cards=>cards.filter(card=>{
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
			{name:"3 same Killer Awoken(include super awoken), or 2 with same latent",otLangName:{chs:"3个相同杀觉醒（含超觉），或相同潜觉"},function:cards=>cards.filter(card=>{
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
			{name:"4 same Killer Awoken, or 2 with same latent",otLangName:{chs:"4个相同杀觉醒（含超觉），或相同潜觉"},function:cards=>cards.filter(card=>{
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
	return functions;
})();