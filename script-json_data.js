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
	{tag:"sort_mp",name:"MP",function:(a,b)=>a.mp-b.mp},
	{tag:"sort_skillLv1",name:"技能最大冷却时间",function:(a,b)=>Skills[a.activeSkillId].initialCooldown-Skills[b.activeSkillId].initialCooldown},
	{tag:"sort_skillLvMax",name:"技能最小冷却时间",function:(a,b)=>{
		const skill_a = Skills[a.activeSkillId],skill_b = Skills[b.activeSkillId];
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
	}},
	{tag:"sort_hpMax110",name:"Lv110最大HP",function:(a,b)=>a.hp.max * (1 + a.limitBreakIncr/100) - b.hp.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_atkMax110",name:"Lv110最大攻击",function:(a,b)=>a.atk.max * (1 + a.limitBreakIncr/100) - b.atk.max * (1 + b.limitBreakIncr/100)},
	{tag:"sort_rcvMax110",name:"Lv110最大回复",function:(a,b)=>a.rcv.max * (1 + a.limitBreakIncr/100) - b.rcv.max * (1 + b.limitBreakIncr/100)},
	
	{tag:"sort_hpMax110_awoken",name:"Lv110最大攻击(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.atk : 0,
				  abB = abilities_2statusB ? abilities_2statusB.withAwoken.atk : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax110_awoken",name:"Lv110最大HP(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax110_awoken",name:"Lv110最大回复(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.rcv : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.rcv : 0;
			return abA - abB;
		}
	},
	{tag:"sort_abilityIndex_awoken",name:"Lv110最大加权能力指数(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount),
				abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp / 10 + abilities_2statusA.withAwoken.atk / 5 + abilities_2statusA.withAwoken.rcv / 3 : 0,
				abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp / 10 + abilities_2statusB.withAwoken.atk / 5 + abilities_2statusB.withAwoken.rcv / 3 : 0;
			return abA - abB;
		}
	},
];