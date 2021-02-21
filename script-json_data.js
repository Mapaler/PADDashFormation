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
const official_awoken_sorting = [21,19,43,45,10,11,12,13,49,56,53,61,50,52,68,69,70,28,27,48,62,57,58,60,59,54,55,14,15,16,17,18,29,20,44,51,22,23,24,25,26,32,31,33,34,4,5,6,7,8,35,36,37,38,1,2,3,46,47,39,40,41,42,65,66,67,9,71,72,30,64,63,73,74,75,76,77,78];
//排序程序列表
const sort_function_list = [
	{tag:"sort_none",name:"无",function:()=>0},
	{tag:"sort_id",name:"怪物ID",function:(a,b)=>a.id-b.id},
	{tag:"sort_attrs",name:"属性",function:(a,b)=>{
		let num = a.attrs[0] - b.attrs[0];
		if (num === 0) num = a.attrs[1] - b.attrs[1];
		return num;
	}},
	{tag:"sort_evoRootId",name:"进化树",function:(a,b)=>a.evoRootId-b.evoRootId},
	{tag:"sort_evoRoot_Attrs",name:"进化根怪物的属性",function:(a,b)=>{
		const card_a = Cards[a.evoRootId],card_b = Cards[b.evoRootId];
		let num = card_a.attrs[0] - card_b.attrs[0];
		if (num === 0) num = card_a.attrs[1] - card_b.attrs[1];
		return num;
	}},
	{tag:"sort_rarity",name:"稀有度",function:(a,b)=>a.rarity-b.rarity},
	{tag:"sort_cost",name:"消耗",function:(a,b)=>a.cost-b.cost},
	{tag:"sort_skillLv1",name:"技能最大冷却时间",function:(a,b)=>Skills[a.activeSkillId].initialCooldown-Skills[b.activeSkillId].initialCooldown},
	{tag:"sort_skillLvMax",name:"技能最小冷却时间",function:(a,b)=>{
		const skill_a = Skills[a.activeSkillId],skill_b = Skills[b.activeSkillId];
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
	}},
	{tag:"sort_hpMax110",name:"最大HP",function:(a,b)=>a.hp.max * (1 + a.limitBreakIncr/100) - b.hp.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_atkMax110",name:"最大攻击",function:(a,b)=>a.atk.max * (1 + a.limitBreakIncr/100) - b.atk.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_rcvMax110",name:"最大回复",function:(a,b)=>a.rcv.max * (1 + a.limitBreakIncr/100) - b.rcv.max * (1 + b.limitBreakIncr/100)},
	
	{tag:"sort_hpMax110_awoken",name:"最大攻击(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.atk : 0,
				  abB = abilities_2statusB ? abilities_2statusB.withAwoken.atk : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax110_awoken",name:"最大HP(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax110_awoken",name:"最大回复(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.rcv : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.rcv : 0;
			return abA - abB;
		}
	},
	{tag:"sort_abilityIndex_awoken",name:"最大加权能力指数(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp / 10 + abilities_2statusA.withAwoken.atk / 5 + abilities_2statusA.withAwoken.rcv / 3 : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp / 10 + abilities_2statusB.withAwoken.atk / 5 + abilities_2statusB.withAwoken.rcv / 3 : 0;
			return abA - abB;
		}
	},
];