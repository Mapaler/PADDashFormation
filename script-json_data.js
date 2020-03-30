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
typekiller_for_type.forEach(t=>
	t.typeKiller.push(0,12,14,15) //补充4种特殊杀
);
//类型允许的潜觉杀
const type_allowable_latent = [];
typekiller_for_type.forEach(t=>
	type_allowable_latent[t.type] = t.typeKiller.map(tn=>
		typekiller_for_type.find(_t=>_t.type == tn).latent
	)
);
//等效觉醒列表
const equivalent_awoken = [
	{small:10,big:52,times:2}, //防封
	{small:11,big:68,times:5}, //防暗
	{small:12,big:69,times:5}, //防废
	{small:13,big:70,times:5}, //防毒
	{small:19,big:53,times:2}, //手指
	{small:21,big:56,times:2}, //SB
];
//排序程序列表
const sort_function_list = [
	{tag:"sort_none",name:"无",function:()=>0},
	{tag:"sort_id",name:"怪物ID",function:(a,b)=>a.id-b.id},
	{tag:"sort_evoRootId",name:"进化树",function:(a,b)=>a.evoRootId-b.evoRootId},
	{tag:"sort_skillLv1",name:"技能最大冷却时间",function:(a,b)=>Skills[a.activeSkillId].initialCooldown-Skills[b.activeSkillId].initialCooldown},
	{tag:"sort_skillLvMax",name:"技能最小冷却时间",function:(a,b)=>{
		const skill_a = Skills[a.activeSkillId],skill_b = Skills[b.activeSkillId];
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
	}},
	{tag:"sort_hpMax110",name:"最大HP(Lv110)",function:(a,b)=>a.hp.max * (1 + a.limitBreakIncr/100) - b.hp.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_atkMax110",name:"最大攻击(Lv110)",function:(a,b)=>a.atk.max * (1 + a.limitBreakIncr/100) - b.atk.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_rcvMax110",name:"最大回复(Lv110)",function:(a,b)=>a.rcv.max * (1 + a.limitBreakIncr/100) - b.rcv.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_rarity",name:"稀有度",function:(a,b)=>a.rarity-b.rarity},
	{tag:"sort_cost",name:"消耗",function:(a,b)=>a.cost-b.cost},
];