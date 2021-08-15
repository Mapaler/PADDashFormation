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
let localTranslating = {
    webpage_title: `智龙迷城${teamsCount}人队伍图制作工具`,
	addition_display: "💬",
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
			active_turns: tp`${'turns'} 回合内，${'actionSkill'}`, //turns, actionSkill
			random_skills: tp`随机发动以下技能：${'skills'}`, //skills
			damage_enemy: tp`对${'target'}造成${'damage'}的${'attr'}伤害${'times'}${'totalDamage'}`, //target, damage, attr
			damage_enemy_times: tp`×${'times'}`,
			damage_enemy_count: tp`(共${'damage'})`,
			vampire: tp`${'damage_enemy'}，并${'icon'}回复伤害值${'heal'}的HP`, //target, damage, attr
			delay: tp`延迟敌人的攻击${'icon'}`, //icon
			mass_attack: tp`所有攻击变为${'icon'}全体攻击`,
			leader_change: tp`${'icon'}将${'target'}换为队长，再次使用则换回来`,
			no_skyfall: tp`${'icon'}天降的宝珠不会消除`,
			self_harm: tp`${'icon'}${'stats'}减少${'value'}`,
            heal: tp`${'icon'}回复 ${'value'} 的 ${'stats'}`,
			unbind_normal: tp`${'icon'}封锁状态减少${'turns'}回合`,
			unbind_awakenings: tp`${'icon'}觉醒无效状态减少${'turns'}回合`,
			unbind_matches: tp`${'icon'}无法消除宝珠状态减少${'turns'}回合`,
			bind_skill: tp`${'icon'}自身无法使用技能`,
            defense_break: tp`${'icon'}敌方的防御力减少${'value'}`,
            poison: tp`${'icon'}使${'target'}中毒，每回合损失${'belong_to'} ${'value'} 的 ${'stats'}`,
			time_extend: tp`${'icon'}宝珠移动时间 ${'value'}`,
			follow_attack: tp`${'icon'}消除宝珠的回合，以${'belong_to'}${'value'}的伤害追打${'target'}（计算防御力）`,
			follow_attack_fixed: tp`追加${'damage'}的${'attr'}伤害`,
            auto_heal_buff: tp`行动结束后${'icon'}回复${'value'}的${'stats'}`,
			auto_heal: tp`${'icon'}消除宝珠的回合，回复${'belong_to'}${'value'}的${'stats'}`,
			ctw: tp`${'icon'}${'value'}内时间停止，可以任意移动宝珠`,
			gravity: tp`${'icon'}造成${'target'}${'value'}的伤害`,
			resolve: tp`${'icon'}如${'stats'}≧${'min'}，受到单一次致命攻击时，将会以1点 HP 生还`,
			board_change: tp`全画面的宝珠变为${'orbs'}`,
			skill_boost: tp`自身以外成员的技能冷却储备${'icon'}${'turns'}`,
			add_combo: tp`结算时连击数增加${'value'}${'icon'}`,
			fixed_time: tp`【${'icon'}操作时间固定${'value'}】`,
			min_match_length: tp`【限定≥${'matchable'}珠才能消除】`,
			drop_refresh: tp`全板刷新`,
			drum: tp`宝珠移动和消除的声音变成太鼓达人的音效`,
			auto_path: tp`显示3连击的转珠路径（只匹配3珠，并只适用于普通地下城）`,
			board7x6: tp`【${'icon'}7×6版面】`,
			counter_attack: tp`受到${'target'}攻击时，${'chance'}进行受到伤害${'value'}的${'attr'}${'icon'}反击`,	
			change_orbs: tp`${'from'}→${'to'}`,
			generate_orbs: tp`${'exclude'}生成${'orbs'}各${'value'}个`,
			fixed_orbs: tp`在${'position'}产生${'orbs'}`,
			orb_drop_increase: tp`${'orbs'}的掉落率提高到${'value'}`,
			orb_drop_increase_flag: tp`${'chance'}掉落${'flag'}${'orbs'}`,
			attr_absorb: tp`${'icon'}属性吸收`,
			combo_absorb: tp`${'icon'}连击吸收`,
			damage_absorb: tp`${'icon'}伤害吸收`,
			damage_void: tp`${'icon'}伤害无效`,
			void_enemy_buff: tp`敌人的 ${'buff'} 无效化`,
			change_attribute: tp`将${'target'}变为${'attrs'}`,
			set_orb_state_enhanced: tp`${'icon'}强化${'orbs'}（每颗宝珠效力增加${'value'}）`,
			set_orb_state_locked: tp`将${'orbs'}${'icon'}锁定${'value'}`,
			set_orb_state_unlocked: tp`${'icon'}解除所有宝珠的锁定状态`,
			set_orb_state_bound: tp`无法消除${'orbs'}`,
			rate_multiply: tp`作为队长进入地下城时，${'rate'}变为${'value'}`,
			rate_multiply_drop: tp`${'icon'}怪物蛋掉落率`,
			rate_multiply_coin: tp`${'icon'}金币掉落率`,
			rate_multiply_exp: tp`${'icon'}等级经验倍率`,
			reduce_damage: tp`${'condition'}受到的${'attrs'}伤害${'icon'}减少${'value'}`,
			power_up: tp`${'condition'}${'targets'}${'value'}${'reduceDamage'}${'addCombo'}${'followAttack'}`,
			power_up_targets: tp`${'attrs_types'}的 `,
			henshin: tp`变身为${'card'}`,
			void_poison: tp`消除${'poison'}时不会受到毒伤害`,
			skill_proviso: tp`${'condition'}才能发动后续效果`,
		},
		power: {
            unknown: tp`[ 未知能力提升: ${'type'} ]`,
			scale_attributes: tp`${'orbs'}中${'min'}种属性同时攻击时${'stats'}${'bonus'}`,
			scale_attributes_bonus: tp`，每多1种${'bonus'}，最大${'max'}种时${'stats_max'}`,
			scale_combos: tp`${'min'}连击以上时${'stats'}${'bonus'}`,
			scale_combos_bonus: tp`，每多1连击${'bonus'}，最大${'max'}连击时${'stats_max'}`,
			scale_match_attrs: tp`${'matches'}中${'min'}串匹配时${'stats'}${'bonus'}`,
			scale_match_attrs_bonus: tp`，每多1串${'bonus'}，最大${'max'}串时${'stats_max'}`,
			scale_match_length: tp`${'in_once'}相连消除${'min'}个${'orbs'}时${'stats'}${'bonus'}`,
			scale_match_length_bonus: tp`，每多1个${'bonus'}，最大${'max'}个时${'stats_max'}`,
			scale_cross: tp`每以十字形式消除5个${'orbs'}1次时${'stats'}`,
			scale_cross_single: tp`以十字形式消除5个${'orbs'}时${'stats'}`,
			scale_state_kind_count: tp`以队伍中[${'awakenings'}${'attrs'}${'types'}]的数量提升，每个${'stats'}`,
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
			compo_type_series: tp`队员组成全为 ${'ids'} 合作时`,
			compo_type_evolution: tp`队员组成全为 ${'ids'} 进化时`,

			L_shape: tp`以L字形式消除5个${'orbs'}时`,
			heal: tp`以${'orbs'}回复${'heal'}${'stats'}时`,
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
			x_awakenings: tp`${'awakenings'}数量×${'value'}`,
		},
		target: {
			self: tp`怪物自身`,
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
			orbs: tp`个`,
			times: tp`次`,
			seconds: tp`秒`,
			point: tp`点`,
			turns: tp`回合`,
		},
		word: {
			comma: tp`，`, //逗号
			slight_pause: tp`、`, //顿号
			range_hyphen: tp`~`, //范围连字符
			in_once: tp`同时`,
			evo_type_pixel: tp`像素进化`,
			evo_type_reincarnation: tp`转生或超转生进化`,
			evo_type_unknow: tp`未知进化`,
			affix_attr: tp`${'cotent'}属性`, //词缀-属性
			affix_orb: tp`${'cotent'}宝珠`, //词缀-宝珠
			affix_type: tp`${'cotent'}类型`, //词缀-类型
			affix_awakening: tp`${'cotent'}觉醒`, //词缀-觉醒
			affix_exclude: tp`${'cotent'}以外`, //词缀-属性
		},
		attrs: {
			[0]: tp`${'icon'}火`,
			[1]: tp`${'icon'}水`,
			[2]: tp`${'icon'}木`,
			[3]: tp`${'icon'}光`,
			[4]: tp`${'icon'}暗`,
			[5]: tp`${'icon'}回复力`,
			[6]: tp`${'icon'}空`,
			all: tp`所有`,
			self: tp`${'icon'}自身属性`,
			fixed: tp`${'icon'}无视防御固定`,
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
			enhanced: tp`${'icon'}强化`,
			locked: tp`${'icon'}锁定`,
			nail: tp`${'icon'}钉子`,
			variation: tp`${'icon'}变换珠（每${'time'}变换）`,
			_5color: tp`${'icon'}5色`,
			_6color: tp`${'_5color'}+${'orb_rcv'}`,
			all: tp`所有`,
			any: tp`任何${'cotent'}`,
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
			[8]: tp`${'icon'}机械`,
			[9]: tp`${'icon'}特别保护`,
			[12]: tp`${'icon'}能力觉醒用`,
			[14]: tp`${'icon'}强化合成用`,
			[15]: tp`${'icon'}贩卖用`,
		},
		awokens: {
			[0]: tp`${'icon'}未知觉醒`,
			[1]: tp`${'icon'}HP+`,
			[2]: tp`${'icon'}攻击+`,
			[3]: tp`${'icon'}回复+`,
			[4]: tp`${'icon'}火盾`,
			[5]: tp`${'icon'}水盾`,
			[6]: tp`${'icon'}木盾`,
			[7]: tp`${'icon'}光盾`,
			[8]: tp`${'icon'}暗盾`,
			[9]: tp`${'icon'}自回`,
			[10]: tp`${'icon'}防封`,
			[11]: tp`${'icon'}防暗`,
			[12]: tp`${'icon'}防废`,
			[13]: tp`${'icon'}防毒`,
			[14]: tp`${'icon'}火+`,
			[15]: tp`${'icon'}水+`,
			[16]: tp`${'icon'}木+`,
			[17]: tp`${'icon'}光+`,
			[18]: tp`${'icon'}暗+`,
			[19]: tp`${'icon'}手指`,
			[20]: tp`${'icon'}心解`,
			[21]: tp`${'icon'}SB`,
			[22]: tp`${'icon'}火横`,
			[23]: tp`${'icon'}水横`,
			[24]: tp`${'icon'}木横`,
			[25]: tp`${'icon'}光横`,
			[26]: tp`${'icon'}暗横`,
			[27]: tp`${'icon'}U`,
			[28]: tp`${'icon'}SX`,
			[29]: tp`${'icon'}心+`,
			[30]: tp`${'icon'}协力`,
			[31]: tp`${'icon'}龙杀`,
			[32]: tp`${'icon'}神杀`,
			[33]: tp`${'icon'}恶魔杀`,
			[34]: tp`${'icon'}机杀`,
			[35]: tp`${'icon'}平衡杀`,
			[36]: tp`${'icon'}攻击杀`,
			[37]: tp`${'icon'}体力杀`,
			[38]: tp`${'icon'}回复杀`,
			[39]: tp`${'icon'}进化杀`,
			[40]: tp`${'icon'}觉醒杀`,
			[41]: tp`${'icon'}强化杀`,
			[42]: tp`${'icon'}卖钱杀`,
			[43]: tp`${'icon'}7c`,
			[44]: tp`${'icon'}5色破防`,
			[45]: tp`${'icon'}心追`,
			[46]: tp`${'icon'}全体 HP `,
			[47]: tp`${'icon'}全体回复`,
			[48]: tp`${'icon'}破无效`,
			[49]: tp`${'icon'}武器`,
			[50]: tp`${'icon'}方块心追`,
			[51]: tp`${'icon'}5色溜`,
			[52]: tp`${'icon'}大防封`,
			[53]: tp`${'icon'}大手指`,
			[54]: tp`${'icon'}防云`,
			[55]: tp`${'icon'}防封条`,
			[56]: tp`${'icon'}大SB`,
			[57]: tp`${'icon'}上血`,
			[58]: tp`${'icon'}下血`,
			[59]: tp`${'icon'}L盾`,
			[60]: tp`${'icon'}L解锁`,
			[61]: tp`${'icon'}10c`,
			[62]: tp`${'icon'}c珠`,
			[63]: tp`${'icon'}语音`,
			[64]: tp`${'icon'}奖励增加`,
			[65]: tp`${'icon'} HP -`,
			[66]: tp`${'icon'}攻击-`,
			[67]: tp`${'icon'}回复-`,
			[68]: tp`${'icon'}大防暗`,
			[69]: tp`${'icon'}大防废`,
			[70]: tp`${'icon'}大防毒`,
			[71]: tp`${'icon'}掉废`,
			[72]: tp`${'icon'}掉毒`,
			[73]: tp`${'icon'}火串`,
			[74]: tp`${'icon'}水串`,
			[75]: tp`${'icon'}木串`,
			[76]: tp`${'icon'}光串`,
			[77]: tp`${'icon'}暗串`,
			[78]: tp`${'icon'}十字`,
			[79]: tp`${'icon'}3色`,
			[80]: tp`${'icon'}4色`,
			[81]: tp`${'icon'}5色`,
		}
    },
}

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
		}
			},
	{tag:"sort_evoRootId",name:"进化树",function:(a,b)=>a.evoRootId-b.evoRootId},
	{tag:"sort_evoRoot_Attrs",name:"进化根怪物的属性",function:(a,b)=>{
		const card_a = Cards[a.evoRootId],card_b = Cards[b.evoRootId];
		let num = card_a.attrs[0] - card_b.attrs[0];
		if (num === 0) num = card_a.attrs[1] - card_b.attrs[1];
		return num;
		}
			},
	{tag:"sort_rarity",name:"稀有度",function:(a,b)=>a.rarity-b.rarity},
	{tag:"sort_cost",name:"消耗",function:(a,b)=>a.cost-b.cost},
	{tag:"sort_mp",name:"MP",function:(a,b)=>a.mp-b.mp},
	{tag:"sort_skillLv1",name:"技能最大冷却时间",function:(a,b)=>Skills[a.activeSkillId].initialCooldown-Skills[b.activeSkillId].initialCooldown},
	{tag:"sort_skillLvMax",name:"技能最小冷却时间",function:(a,b)=>{
		const skill_a = Skills[a.activeSkillId],skill_b = Skills[b.activeSkillId];
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
		}
			},
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
				return getCardLeaderSkill(card, skillTypes, searchRandom) || getCardActiveSkill(card, skillTypes, searchRandom);
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
	
	function sortByParams(a,b,searchTypeArray,pidx = 0)
	{
		const a_s = getCardSkill(a, searchTypeArray), b_s = getCardSkill(b, searchTypeArray);
		let a_pC = a_s.params[pidx],b_pC = b_s.params[pidx];
		return a_pC - b_pC;
	}
	function voidsAbsorption_Addition(card)
	{
		const searchTypeArray = [173];
		const skill = getCardActiveSkill(card, searchTypeArray);
		const sk = skill.params;
		if (sk[1] && sk[3])
		{
			return `双吸×${sk[0]}T`;
		}else
		{
			return `${['属','C','伤'][sk.slice(1).indexOf(1)]}吸×${sk[0]}T`;
		}
	}
	function unbind_Turns(card)
	{
		const outObj = {
			normal: 0,
			awoken: 0
		};
		const searchTypeArray = [117,179];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (skill)
		{
			const sk = skill.params;
			outObj.normal = sk[skill.type == 179 ? 3 : 0] || 0;
			outObj.awoken = sk[4] || 0;
		}
		return outObj;
	}
	function unbind_Addition(card)
	{
		const turns = unbind_Turns(card);
		let strArr = [];
		if (turns.normal > 0 && turns.normal == turns.awoken)
		{
			return `${turns.normal == 9999 ? "全" : turns.normal + "T"}解封+觉`;
		}
		if (turns.normal > 0)
		{
			strArr.push(`${turns.normal >= 9999 ? "全" : turns.normal + "T"}解封`);
		}
		if (turns.awoken > 0)
		{
			strArr.push(`${turns.awoken >= 9999 ? "全" : turns.awoken + "T"}解觉`);
		}
		return strArr.join('，');
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
		const skill = getCardActiveSkill(card, searchTypeArray);
		const colors = boardChange_ColorTypes(skill);
		return createOrbsList(colors);
	}
	function orbsChangeParse(skill)
	{
		function changes(from, to)
		{
			return {from:from,to:to};
		}
		let outArr = [];
		if (!skill) return outArr;
		const sk = skill.params;
		switch (skill.type)
		{
			case 9:{
				outArr.push(changes([sk[0] || 0], [sk[1] || 0]));
				break;
			}
			case 20:{
				if (sk.length >= 3 && sk[1] == (sk[3] || 0))
				{
					outArr.push(changes([sk[0] || 0, sk[2] || 0], [sk[1] || 0]));
				}
				else
				{
					outArr.push(changes([sk[0] || 0], [sk[1] || 0]));
					outArr.push(changes([sk[2] || 0], [sk[3] || 0]));
				}
				break;
			}
			case 154:{
				outArr.push(changes(flags(sk[0] || 1), flags(sk[1] || 1)));
				break;
			}
		}
		return outArr;
	}
	function changeOrbs_Addition(card)
	{
		const searchTypeArray = [9,20,154];
		const skills = getCardActiveSkills(card, searchTypeArray);
		let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
		const fragment = document.createDocumentFragment();
		parsedSkills.forEach(p=>{
			fragment.appendChild(createOrbsList(p.from));
			fragment.appendChild(document.createTextNode(`→`));
			fragment.appendChild(createOrbsList(p.to));
		});
		return fragment;
	}
	function generateOrbsParse(card)
	{
		let outArr = [];
		const searchTypeArray = [141, 208];
		const skills = getCardActiveSkills(card, searchTypeArray);
		if (!skills.length) return outArr;
		for (let skill of skills)
		{
			const sk = skill.params;
			if (skill.type == 141)
			{
				outArr.push({
					count: sk[0],
					to: flags(sk[1] || 1),
					exclude: flags(sk[2]),
				});
			}else
			{
				outArr.push({
					count: sk[0],
					to: flags(sk[1] || 1),
					exclude: flags(sk[2]),
				});
				outArr.push({
					count: sk[3],
					to: flags(sk[4] || 1),
					exclude: flags(sk[5]),
				});
			}
		}
		return outArr;
	}
	function generateOrbs_Addition(card)
	{
		const gens = generateOrbsParse(card);
		const searchTypeArray = [141, 208];
		const skill = getCardActiveSkill(card, searchTypeArray);
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		for (let gen of gens)
		{
			fragment.appendChild(createOrbsList(gen.to));
			fragment.appendChild(document.createTextNode(`×${gen.count}`));
		}
		return fragment;
	}
	function healImmediately_Rate(card)
	{
		const searchTypeArray = [7, //宠物回复力
			8, //固定点数
			35,115, //吸血
			117
		];
		const skills = getCardActiveSkills(card, searchTypeArray);

		const outObj = {
			vampire: 0,
			selfRcv: 0,
			const: 0,
			scale: 0,
		};
		if (!skills.length) return outObj;
		skills.forEach(skill=>{
			const sk = skill.params;
			if (skill.type == 7)
			{
				outObj.selfRcv += sk[0];
			}
			else if(skill.type == 8)
			{
				outObj.const += sk[0];
			}
			else if(skill.type == 35)
			{
				outObj.vampire += sk[1];
			}
			else if(skill.type == 115)
			{
				outObj.vampire += sk[2];
			}
			else if(skill.type == 117)
			{
				outObj.selfRcv += sk[1] || 0;
				outObj.const += sk[2] || 0;
				outObj.scale += sk[3] || 0;
			}
		});
		return outObj;
	}
	function atkBuff_Rate(card)
	{
		const searchTypeArray = [
			88,92, //类型的
			50,90, //属性的，要排除回复力
			156,168, //宝石姬
			228, //属性、类型数量
		];
		const skill = getCardActiveSkill(card, searchTypeArray);

		const outObj = {
			skilltype: 0, //0为没有，1为宝石姬类，2为指定类型、属性
			types: [],
			attrs: [],
			awoken: [],
			rate: 0,
			turns: 0,
		};
		if (!skill) return outObj;
		const sk = skill.params;
		if (skill.type == 88 || skill.type == 92)
		{
			outObj.skilltype = 2;
			outObj.types = sk.slice(1, skill.type == 88 ? 2 : 3);
			outObj.turns = sk[0];
			outObj.rate = sk[skill.type == 88 ? 2 : 3];
		}
		else if(skill.type == 50 || skill.type == 90)
		{
			outObj.attrs = sk.slice(1, skill.type == 50 ? 2 : 3);
			if (outObj.attrs.includes(5))  //去除回复力
				return outObj;
			outObj.skilltype = 2;
			outObj.turns = sk[0];
			outObj.rate = sk[skill.type == 50 ? 2 : 3];
		}
		else if(skill.type == 156 && sk[4] == 2 //必须要是加攻击力
			|| skill.type == 168)
		{
			outObj.skilltype = 1;
			outObj.awoken = sk.slice(1, skill.type == 168 ? 7 : 4).filter(s=>s>0);
			outObj.turns = sk[0];
			outObj.rate = skill.type == 168 ? sk[7] : sk[5] - 100;
		}
		else if(skill.type == 228 && sk[3] > 0)
		{
			outObj.skilltype = 1;
			outObj.attrs = flags(sk[1]);
			outObj.types = flags(sk[2]);
			outObj.turns = sk[0];
			outObj.rate = sk[3];
		}
		return outObj;
	}
	function damageSelf_Rate(card)
	{
		const searchTypeArray = [84,85,86,87,195];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return 0;
		const sk = skill.params;
		return 100 - (sk[skill.type == 195 ? 0 : 3] || 0);
	}
	function changeEnemiesAttr_Attr(card)
	{
		const outObj = {
			attr: null,
			turns: 0
		}
		const searchTypeArray = [153, 224];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return outObj;
		const sk = skill.params;
		if (skill.type == 153)
		{
			outObj.attr = sk[0];
		}
		else if (skill.type == 224)
		{
			outObj.attr = sk[1] || 0;
			outObj.turns = sk[0];
		}
		return outObj;
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
	//产生类型列表
	function createTypesList(types)
	{
		if (types == undefined) types = [0];
		else if (!Array.isArray(types)) types = [types];
		const ul = document.createElement("ul");
		ul.className = "types-ul";
		types.forEach(type => {
			const li = ul.appendChild(document.createElement("li"));
			li.className = `type-icon`;
			li.setAttribute("data-type-icon", type);
		});	
		return ul;
	}

	const functions = [
		{name:"No Filter",otLangName:{chs:"不做筛选"},
				function:cards=>cards},
		{group:true,name:"======Leader Skills=====",otLangName:{chs:"======队长技======"}, functions: [
			{name:"Fixed damage inflicts(sort by damage)",otLangName:{chs:"队长技固伤追击（按伤害排序）"},
				function:cards=>{
				return cards.filter(card=>{
					return getSkillFixedDamage(card) > 0;
				}).sort((a,b)=>{
					let a_pC = getSkillFixedDamage(a),b_pC = getSkillFixedDamage(b);
					return a_pC - b_pC;
				});
				},
				addition:card=>{
				return getSkillFixedDamage(card).bigNumberToString() + "固伤";
				}
			},
			{name:"Adds combo(sort by combo)",otLangName:{chs:"队长技+C（按+C数排序）"},
				function:cards=>{
				return cards.filter(card=>{
					return getSkillAddCombo(card) > 0;
				}).sort((a,b)=>{
					let a_pC = getSkillAddCombo(a),b_pC = getSkillAddCombo(b);
					return a_pC - b_pC;
				});
				},
				addition:card=>{
				const value = getSkillAddCombo(card);
				const searchTypeArray = [210];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return `+${value.bigNumberToString()}C${skill?`/十字`:""}`;
				}
			},
			{name:"[7×6 board]",otLangName:{chs:"【7×6 版面】"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [162,186];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"[No skyfall]",otLangName:{chs:"【无天降版面】"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [163,177];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Move time changes(sort by time)",otLangName:{chs:"队长技加/减秒（按秒数排序）"},
				function:cards=>{
				const searchTypeArray = [15,185];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [15,185];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `${value > 0 ? "+" : ""}${value/100}s`;
				}
			},
			{name:"Fixed move time(sort by time)",otLangName:{chs:"固定操作时间（按时间排序）"},
				function:cards=>{
				const searchTypeArray = [178];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [178];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `固定${value}s`;
				}
			},
			{name:"Bonus attack when matching Orbs(sort by rate)",otLangName:{chs:"消除宝珠时计算防御的追打（按追打比率排序）"},
				function:cards=>{
				const searchTypeArray = [12];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [12];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `攻击×${(value/100).bigNumberToString()}倍`;
				}
			},
			{name:"Recovers HP when matching Orbs(sort by rate)",otLangName:{chs:"消除宝珠时回血（按回复比率排序）"},
				function:cards=>{
				const searchTypeArray = [13];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [13];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `回复×${(value/100).bigNumberToString()}倍`;
				}
			},
			{name:"Counterattack(sort by rate)",otLangName:{chs:"队长技受伤反击"},
				function:cards=>{
				const searchTypeArray = [41];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
				const searchTypeArray = [41];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				const fragment = document.createDocumentFragment();
				fragment.appendChild(createOrbsList(sk[2] || 0));
				fragment.appendChild(document.createTextNode(`×${(sk[1]/100).bigNumberToString()}倍`));
				if (sk[0] < 100)fragment.appendChild(document.createTextNode(`(${sk[0]}%)`));
				return fragment;
				}
			},
			{name:"Voids Poison dmg",otLangName:{chs:"毒无效"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [197];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Reduce damage when rcv(sort by rate)",otLangName:{chs:"回血加盾（以减伤比例排序）"},
				function:cards=>{
				const searchTypeArray = [198];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill && skill.params[2];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,2));
				},
				addition:card=>{
				const searchTypeArray = [198];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return `回复${sk[0].bigNumberToString()}，减伤${sk[2]}%`;
				}
			},
			{name:"Recover Awkn Skill bind when rcv(sort by turns)",otLangName:{chs:"回血解觉（以解觉数排序）"},
				function:cards=>{
				const searchTypeArray = [198];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill && skill.params[3];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,3));
				},
				addition:card=>{
				const searchTypeArray = [198];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return `回复${sk[0].bigNumberToString()}，解觉${sk[3]}T`;
				}
			},
			{name:"Cross(十) of Heal Orbs",otLangName:{chs:"十字心"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [151,209];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Cross(十) of Color Orbs",otLangName:{chs:"N个十字"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [157];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Less remain on the board",otLangName:{chs:"剩珠倍率"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [177];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Unable to less match(sort by orbs need)",otLangName:{chs:"要求长串消除（按珠数排序）"},
				function:cards=>{
				const searchTypeArray = [158];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [158];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `≥${value}珠`;
				}
			},
			{name:"Resolve",otLangName:{chs:"根性"},
				function:cards=>{
				const searchTypeArray = [14];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [14];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `HP≥${value}%`;
				}
			},
			{name:"Designate member ID",otLangName:{chs:"指定队伍队员编号"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [125];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Designate collab ID",otLangName:{chs:"指定队伍队员合作编号"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [175];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Designate Evo type",otLangName:{chs:"指定队伍队员进化类型"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [203];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Floating rate based on the number of attrs/types",otLangName:{chs:"根据属性/类型个数浮动倍率"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [229];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Increase item drop rate(sort by rate)",otLangName:{chs:"增加道具掉落率（按增加倍率排序）"},
				function:cards=>{
				const searchTypeArray = [53];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [53];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return `掉率x${sk[0]/100}`;
				}
			},
			{name:"Increase coin rate(sort by rate)",otLangName:{chs:"增加金币掉落倍数（按增加倍率排序）"},
				function:cards=>{
				const searchTypeArray = [54];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [54];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return `金币x${sk[0]/100}`;
				}
			},
			{name:"Increase Exp rate(sort by rate)",otLangName:{chs:"增加经验获取倍数（按增加倍率排序）"},
				function:cards=>{
				const searchTypeArray = [148];
				return cards.filter(card=>{
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [148];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				const sk = skill.params;
				return `经验x${sk[0]/100}`;
				}
			},
		]},
		{group:true,name:"-----HP Scale-----",otLangName:{chs:"-----血倍率-----"}, functions: [
			{name:"HP Scale [2, ∞) (sort by rate)",otLangName:{chs:"队长血倍率[2, ∞)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale >= 2;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
				})
			},
			{name:"HP Scale [1.5, 2) (sort by rate)",otLangName:{chs:"队长血倍率[1.5, 2)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale >= 1.5 && HPscale < 2;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
				})
			},
			{name:"HP Scale (1, 1.5) (sort by rate)",otLangName:{chs:"队长血倍率(1, 1.5)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale > 1 && HPscale < 1.5;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
				})
			},
			{name:"HP Scale == 1 (sort by rate)",otLangName:{chs:"队长血倍率 == 1"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale === 1;
				})
			},
			{name:"HP Scale [0, 1) (sort by rate)",otLangName:{chs:"队长血倍率[0, 1)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const HPscale = getHPScale(skill);
				return HPscale < 1;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getHPScale(a_s) - getHPScale(b_s);
				})
			},
		]},
		{group:true,name:"-----Reduce Shield-----",otLangName:{chs:"-----减伤盾-----"}, functions: [
			{name:"Reduce Damage [75%, 100%] (sort by rate)",otLangName:{chs:"队长盾减伤[75%, 100%]（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.75;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
				})
			},
			{name:"Reduce Damage [50%, 75%) (sort by rate)",otLangName:{chs:"队长盾减伤[50%, 75%)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.5 && reduceScale < 0.75;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
				})
			},
			{name:"Reduce Damage [25%, 50%) (sort by rate)",otLangName:{chs:"队长盾减伤[25%, 50%)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale >= 0.25 && reduceScale < 0.5;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
				})
			},
			{name:"Reduce Damage (0%, 25%) (sort by rate)",otLangName:{chs:"队长盾减伤(0%, 25%)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale > 0 && reduceScale < 0.25;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
				})
			},
			{name:"Reduce Damage == 0",otLangName:{chs:"队长盾减伤 == 0"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale === 0;
				})
			},
			{name:"Reduce Damage - Must all Att.",otLangName:{chs:"队长盾减伤-必须全属性减伤"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, true) > 0;
				})
			},
			{name:"Reduce Damage - Exclude HP-line",otLangName:{chs:"队长盾减伤-排除血线盾"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, undefined, true) > 0;
				})
			},
			{name:"Reduce Damage - Exclude chance",otLangName:{chs:"队长盾减伤-排除几率盾"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				return getReduceScale(skill, undefined, undefined, true) > 0;
				})
			},
			{name:"More than half with 99% gravity[29%, 100%)",otLangName:{chs:"满血99重力不下半血-队长盾减伤[29%, 100%)"},
				function:cards=>cards.filter(card=>{
				const skill = Skills[card.leaderSkillId];
				const reduceScale = getReduceScale(skill);
				return reduceScale>=0.29;
			}).sort((a,b)=>{
				const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
				return getReduceScale(a_s) - getReduceScale(b_s);
				})
			},
			{name:"Reduce Damage - Unconditional",otLangName:{chs:"队长盾减伤-无条件盾"},
				function:cards=>cards.filter(card=>{
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
				})
			},
		]},
		{group:true,name:"======Active Skill======",otLangName:{chs:"======主动技======"}, functions: [
			{name:"1 CD",otLangName:{chs:"1 CD"},
				function:cards=>cards.filter(card=>{
				if (card.activeSkillId == 0) return false;
				const skill = Skills[card.activeSkillId];
				return skill.initialCooldown - (skill.maxLevel - 1) <= 1;
				})
			},
			{name:"Less than 4 can be cycled use(Inaccurate)",otLangName:{chs:"除 1 CD 外，4 个以下能永动开（可能不精确）"},
				function:cards=>cards.filter(card=>{
				if (card.activeSkillId == 0) return false;
				const skill = Skills[card.activeSkillId];
				const minCD = skill.initialCooldown - (skill.maxLevel - 1); //主动技最小的CD
				let realCD = minCD;
	
				const searchTypeArray = [14];
				const subSkill = getCardLeaderSkill(card, searchTypeArray);
				if (subSkill)
				{
					realCD -= subSkill.params[0] * 3;
				}
				return minCD > 1 && realCD <= 4;
				})
			},
			{name:"Time pause(sort by time)",otLangName:{chs:"时间暂停（按停止时间排序）"},
				function:cards=>{
				const searchTypeArray = [5];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [5];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const value = skill.params[0];
				return `时停${value}s`;
				}
			},
			{name:"Random effect active",otLangName:{chs:"随机效果技能"},
				function:cards=>cards.filter(card=>Skills[card.activeSkillId].type == 118)},
			{name:"Enable require HP range",otLangName:{chs:"技能使用血线要求"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [225];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [225];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				let strArr = [];
				if (sk[0]) strArr.push(`≥${sk[0]}%`);
				if (sk[1]) strArr.push(`≤${sk[1]}%`);
				return `HP ${strArr.join(" ")}`;
				}
			},
		]},
		{group:true,name:"-----Voids Absorption-----",otLangName:{chs:"-----破吸类-----"}, functions: [
			{name:"Voids attribute absorption(sort by turns)",otLangName:{chs:"破属吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[1];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},
			/*{name:"Voids combo absorption(sort by turns)",otLangName:{chs:"破C吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[2];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},*/
			{name:"Voids damage absorption(sort by turns)",otLangName:{chs:"破伤吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[3];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},
			{name:"Voids both absorption(sort by turns)",otLangName:{chs:"双破吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[1] && skill.params[3];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},
			{name:"Pierce through damage void(sort by turns)",otLangName:{chs:"贯穿无效盾 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [191];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [191];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`破贯×${sk[0]}T`);
				}
			},
		]},
		{group:true,name:"-----Recovers Bind Status-----",otLangName:{chs:"-----解封类-----"}, functions: [
			{
				name:"Unbind normal(sort by turns)",otLangName:{chs:"解封（按解封回合排序）"},
				function:cards=>{
					return cards.filter(card=>{
						const turns = unbind_Turns(card);
						return turns.normal > 0;
					}).sort((a,b)=>{
						const a_s = unbind_Turns(a), b_s = unbind_Turns(b);
						let a_pC = a_s.normal, b_pC = b_s.normal;
						return a_pC - b_pC;
					});
				},
				addition:unbind_Addition
			},
			{
				name:"Unbind awoken(sort by turns)",otLangName:{chs:"解觉醒（按解觉回合排序）"},
				function:cards=>{
					return cards.filter(card=>{
						const turns = unbind_Turns(card);
						return turns.awoken > 0;
					}).sort((a,b)=>{
						const a_s = unbind_Turns(a), b_s = unbind_Turns(b);
						let a_pC = a_s.awoken, b_pC = b_s.awoken;
						return a_pC - b_pC;
					});
				},
				addition:unbind_Addition
			},
			{
				name:"Unbind both(sort by awoken turns)",otLangName:{chs:"解封+觉醒（按解觉醒回合排序）"},
				function:cards=>{
					return cards.filter(card=>{
						const turns = unbind_Turns(card);
						return turns.normal && turns.awoken > 0;
					}).sort((a,b)=>{
						const a_s = unbind_Turns(a), b_s = unbind_Turns(b);
						let a_pC = a_s.awoken, b_pC = b_s.awoken;
						return a_pC - b_pC;
					});
				},
				addition:unbind_Addition
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
	
					},
				addition:card=>{
					const searchTypeArray = [196];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
	
					const value = sk[0];
					return document.createTextNode(`${value == 9999 ? "全" : value + "T"}解禁消`);
				}
			},
			{name:"Bind self active skill",otLangName:{chs:"自封技能"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [214];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [214];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return document.createTextNode(`自封技${sk[0]}T`);
				}
			},
			{name:"Bind self matchable",otLangName:{chs:"自封消珠"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [215];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [215];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`自封`));
				fragment.appendChild(createOrbsList(flags(sk[1] || 1)));
				fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
				return fragment;
				}
			},
		]},
		{group:true,name:"----- Buff -----",otLangName:{chs:"----- buff 类-----"}, functions: [
			{name:"Rate by state count(Jewel Princess)",otLangName:{chs:"以状态数量为倍率类技能（宝石姬）"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [156,168,228];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"RCV rate change",otLangName:{chs:"回复力 buff（顶回复）"},
				function:cards=>{
					const searchTypeArray = [50,90,228];
					function getRecScale(as)
					{
						const sk = as.params;
						if (as.type == 228)
						{
							return sk[4];
						}else
						{
							return sk.slice(1,sk.length>2?-1:undefined).includes(5) ? (sk.length > 2 ? sk[sk.length-1] : 0) : null;
						}
					}
					return cards.filter(card=>{
						const skills = getCardActiveSkills(card, searchTypeArray);
						if (skills.length)
						{
							return skills.some(as=>getRecScale(as) != null);
						}else return false;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkills(a, searchTypeArray), b_s = getCardActiveSkills(b, searchTypeArray);
						const a_sv = a_s.map(a_s=>getRecScale(a_s)).filter(n=>n!==null).sort().reverse()[0],
						b_sv = b_s.map(b_s=>getRecScale(b_s)).filter(n=>n!==null).sort().reverse()[0];
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
							return sk[4];
						}else
						{
							return sk.slice(1,sk.length>2?-1:undefined).includes(5) ? (sk.length > 2 ? sk[sk.length-1] : 0) : null;
						}
					}
					const skills = getCardActiveSkills(card, searchTypeArray);
					const skill = skills.find(as=>getRecScale(as) != null);
					if (skill.type == 228)
						return `回+${getRecScale(skill) / 100}×N`;
					else
						return `回x${getRecScale(skill) / 100}`;
				}
			},
			{name:"ATK rate change",otLangName:{chs:"攻击力 buff（顶攻击）"},
				function:cards=>{
					return cards.filter(card=>{
						const atkbuff = atkBuff_Rate(card);
						return atkbuff.skilltype > 0;
					}).sort((a,b)=>{
						let a_pC = atkBuff_Rate(a), b_pC = atkBuff_Rate(b);
						let sortNum = a_pC.skilltype - b_pC.skilltype;
						if (sortNum == 0)
							sortNum = a_pC.rate - b_pC.rate;
						if (sortNum == 0)
							sortNum = a_pC.turns - b_pC.turns;
						return sortNum;
					});
				},
				addition:card=>{
					const atkbuff = atkBuff_Rate(card);
					const fragment = document.createDocumentFragment();
					if (atkbuff.skilltype == 0) return fragment;
					if (atkbuff.skilltype == 1)
					{
						fragment.appendChild(document.createTextNode(`+${atkbuff.rate}%/`));
						if (atkbuff.awoken.length)
							fragment.appendChild(creatAwokenList(atkbuff.awoken));
						if (atkbuff.attrs.length)
							fragment.appendChild(createOrbsList(atkbuff.attrs));
						if (atkbuff.types.length)
							fragment.appendChild(createTypesList(atkbuff.types));
						fragment.appendChild(document.createTextNode(`×${atkbuff.turns}T`));
					}else if (atkbuff.skilltype == 2)
					{
						if (atkbuff.attrs.length)
							fragment.appendChild(createOrbsList(atkbuff.attrs));
						if (atkbuff.types.length)
							fragment.appendChild(createTypesList(atkbuff.types));
						fragment.appendChild(document.createTextNode(`×${atkbuff.rate / 100}`));
						fragment.appendChild(document.createTextNode(`×${atkbuff.turns}T`));
					}
					return fragment;
				}
			},
			{name:"Move time change",otLangName:{chs:"操作时间 buff（顶手指）"},
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
					let str = "👆";
					if (sk[1]) str += `${sk[1]>0?`+`:``}${sk[1]/10}S`;
					if (sk[2]) str += `x${sk[2]/100}`;
					return str;
				}
			},
			{name:"Creates Roulette Orb",otLangName:{chs:"生成变换位（转转珠）"},
				function:cards=>{
					const searchTypeArray = [207];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [207];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					if (sk[7])
						return `${sk[7]}个×${sk[0]}T`;
					else
						return `特殊形状×${sk[0]}T`;
				}
			},
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
					return `+${sk[1]}C×${sk[0]}T`;
				}
			},
			{name:"Reduce Damage for all Attr(sort by rate)",otLangName:{chs:"全属减伤 buff（按减伤比率排序）"},
				function:cards=>{
					const searchTypeArray = [3,156];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						if (!skill) return false;
						if (skill.type == 156)
							return skill.params[4]==3;
						else
							return true;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let sortNum = b_s.type - a_s.type; //先分开宝石姬与非宝石姬
						if (!sortNum)
						{
							let a_pC = a_s.params[a_s.type == 3 ? 1 : 5],b_pC = b_s.params[b_s.type == 3 ? 1 : 5];
							sortNum = a_pC - b_pC;
						}
						return sortNum;
					});
				},
				addition:card=>{
					const searchTypeArray = [3,156];
					const skill = getCardActiveSkill(card, searchTypeArray);
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
				}
			},
			{name:"Reduce 100% Damage(invincible, sort by turns)",otLangName:{chs:"全属减伤 100%（无敌）"},
				function:cards=>{
					const searchTypeArray = [3];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && skill.params[1]>=100;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [3];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return `无敌×${sk[0]}T`;
				}
			},
			{name:"Reduce all Damage for designated Attr(sort by turns)",otLangName:{chs:"限属减伤 buff（按回合排序排序）"},
				function:cards=>{
					const searchTypeArray = [21];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [21];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					
					const colors = [sk[1]];
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`-`));
					fragment.appendChild(createOrbsList(colors));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
		
					return fragment;
				}
			},
			{name:"Mass Attacks(sort by turns)",otLangName:{chs:"变为全体攻击（按回合数排序）"},
				function:cards=>{
					const searchTypeArray = [51];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [51];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return `全体×${sk[0]}T`;
				}
			},
		]},
		{group:true,name:"-----For Enemy-----",otLangName:{chs:"-----对敌 buff 类-----"}, functions: [
			{name:"Menace(sort by turns)",otLangName:{chs:"威吓（按推迟回合排序）"},
				function:cards=>{
					const searchTypeArray = [18];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,0));
				},
				addition:card=>{
					const searchTypeArray = [18];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return document.createTextNode(`威吓×${sk[0]}T`);
				}
			},
			{name:"Reduces enemies' DEF(sort by rate)",otLangName:{chs:"破防（按防御减少比例排序）"},
				function:cards=>{
					const searchTypeArray = [19];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
					const searchTypeArray = [19];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
		
					return `破防${sk[1]}%`;
				}
			},
			{name:"Voids enemies' DEF(sort by turns)",otLangName:{chs:"100% 破防（按回合排序）"},
				function:cards=>{
					const searchTypeArray = [19];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && skill.params[1]>=100;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [19];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
		
					return `全破×${sk[0]}T`;
				}
			},
			{name:"Poisons enemies(sort by rate)",otLangName:{chs:"中毒（按毒伤比率排序）"},
				function:cards=>{
					const searchTypeArray = [4];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [4];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
		
					return `攻击力×${sk[0]/100}倍`;
				}
			},
			{name:"Change enemies's Attr(sort by attr)",otLangName:{chs:"改变敌人属性（按属性排序）"},
				function:cards=>{
					return cards.filter(card=>{
						return changeEnemiesAttr_Attr(card).attr != null;
					}).sort((a,b)=>{
						let a_pC = changeEnemiesAttr_Attr(a),b_pC = changeEnemiesAttr_Attr(b);
						return a_pC.attr - b_pC.attr;
					})
				},
				addition:card=>{
					let change = changeEnemiesAttr_Attr(card);
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`敌→`));
					fragment.appendChild(createOrbsList(change.attr));
					if (change.turns > 0)
						fragment.appendChild(document.createTextNode(`×${change.turns}T`));
					return fragment;
				}
			},
			{name:"Counterattack buff(sort by rate)",otLangName:{chs:"受伤反击 buff（按倍率排序）"},
				function:cards=>{
					const searchTypeArray = [60];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
					const searchTypeArray = [60];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`${sk[1]/100}倍`));
					fragment.appendChild(createOrbsList(sk[2]));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
		
					return fragment;
				}
			},
		]},
		{group:true,name:"-----For player team-----",otLangName:{chs:"-----对自身队伍生效类-----"}, functions: [
			{name:"↑Increase skills charge(sort by turns)",otLangName:{chs:"【溜】减少CD（按回合排序）"},
				function:cards=>{
					const searchTypeArray = [146];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [146];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return document.createTextNode(`${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}溜`);
				}
			},
			{name:"↓Reduce skills charge(sort by turns)",otLangName:{chs:"【坐】增加CD（按回合排序）"},
				function:cards=>{
					const searchTypeArray = [218];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [218];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return document.createTextNode(`坐下${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}`);
				}
			},
			{name:"Change Leader",otLangName:{chs:"更换队长"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [93, 227];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Change self's Attr(sort by turns)",otLangName:{chs:"转换自身属性（按回合数排序）"},
				function:cards=>{
					const searchTypeArray = [142];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [142];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;

					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`自→`));
					fragment.appendChild(createOrbsList(sk[1]));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
		
					return fragment;
				}
			},
		]},
		{group:true,name:"-----Player's HP change-----",otLangName:{chs:"-----玩家HP操纵类-----"}, functions: [
			{name:"Heal after turn",otLangName:{chs:"回合结束回血 buff"},
				function:cards=>{
				const searchTypeArray = [179];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [179];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return `回复${sk[1]?`${sk[1].bigNumberToString()}`:`${sk[2]}%`}×${sk[0]}T`;
				}
			},
			{name:"Heal immediately",otLangName:{chs:"玩家立刻回血"},
				function:cards=>{
				return cards.filter(card=>{
					const heal = healImmediately_Rate(card);
					return Object.values(heal).some(v=>v);
				})
				.sort((a,b)=>{
					const a_h = healImmediately_Rate(a), b_h = healImmediately_Rate(b);
					const a_vs = Object.values(a_h), b_vs = Object.values(b_h);
					const a_i = a_vs.findIndex(v=>v), b_i = b_vs.findIndex(v=>v);
					let sortNum = a_i - b_i;
					if (!sortNum)
					{
						sortNum = a_vs[a_i] - b_vs[b_i];
					}
					return sortNum;
				});
				},
				addition:card=>{
				const heal = healImmediately_Rate(card);
				let strArr = [];
				if (heal.scale)
					strArr.push(`${heal.scale}%最大HP`);
				if (heal.const)
					strArr.push(`${heal.const.bigNumberToString()}点HP`);
				if (heal.selfRcv)
					strArr.push(`${heal.selfRcv/100}倍回复力`);
				if (heal.vampire)
					strArr.push(`${heal.vampire}%伤害`);
				return strArr.join(',');
				}
			},
			{name:"Damage self(sort by rate)",otLangName:{chs:"玩家自残（HP 减少，按减少比率排序）"},
				function:cards=>{
				return cards.filter(card=>damageSelf_Rate(card)>0)
					.sort((a,b)=>damageSelf_Rate(a) - damageSelf_Rate(b));
				},
				addition:card=>{
				let rate = damageSelf_Rate(card);
				if (rate < 100)
					return `减少${rate}%`;
				else
					return `减少到1`;
				}
			},
		]},
		{group:true,name:"----- Orbs Lock -----",otLangName:{chs:"-----锁珠类-----"}, functions: [
			{name:"Unlock",otLangName:{chs:"解锁"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [172];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Lock(Any color)",otLangName:{chs:"上锁（不限色）"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [152];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [152];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`锁`));
				fragment.appendChild(createOrbsList(flags(sk[0] || 1)));
				return fragment;
				}
			},
			{name:"Lock(≥5 color)",otLangName:{chs:"上锁5色+心或全部"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [152];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && (skill.params[0] & 63) === 63;
				})
			},
		]},
		{group:true,name:"----- Orbs Drop -----",otLangName:{chs:"----- 珠子掉落 类-----"}, functions: [
			{name:"Drop locked orbs(any color, sort by turns)",otLangName:{chs:"掉锁（不限色，按回合排序）"},
				function:cards=>{
				const searchTypeArray = [205];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
				const searchTypeArray = [205];
				const skill = getCardActiveSkill(card, searchTypeArray, 1);
				const sk = skill.params;
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`掉锁`));
				fragment.appendChild(createOrbsList(flags(sk[0] != -1 ? sk[0] : 1023)));
				fragment.appendChild(document.createTextNode(`×${sk[1]}T`));
				return fragment;
				}
			},
			{name:"Drop locked orbs(≥5 color, sort by turns)",otLangName:{chs:"掉锁5色+心或全部（按回合排序）"},
				function:cards=>{
				const searchTypeArray = [205];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && (skill.params[0] & 63) === 63;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				}
			},
			{name:"Drop Enhanced Orbs(sort by turns)",otLangName:{chs:"掉落强化宝珠（按回合排序）"},
				function:cards=>{
				const searchTypeArray = [180];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
				const searchTypeArray = [180];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return `${sk[1]}%×${sk[0]}T`;
				}
			},
			{name:"No Skyfall(sort by turns)",otLangName:{chs:"无天降 buff（按回合排序）"},
				function:cards=>{
				const searchTypeArray = [184];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [184];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				
				return `无↓×${sk[0]}T`;
				}
			},
			{name:"Drop rate increases",otLangName:{chs:"掉落率提升"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [126];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [126];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
	
				const colors = flags(sk[0]);
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(createOrbsList(colors));
				fragment.appendChild(document.createTextNode(`↓${sk[3]}%×${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}T`));
				return fragment;
				}
			},
			{name:"Drop rate - Attr. - Jammers/Poison",otLangName:{chs:"掉落率提升-属性-毒、废（顶毒）"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [126];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && (skill.params[0] & 960); // 960 = 二进制 1111000000
				})
			},
			{name:"Drop rate - 99 turns",otLangName:{chs:"掉落率提升-持续99回合"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [126];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && skill.params[1] >= 99;
				})
			},
			{name:"Drop rate - 100% rate",otLangName:{chs:"掉落率提升-100%几率"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [126];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && skill.params[3] == 100;
				})
			},
			{name:"Drop Nail Orbs(sort by turns)",otLangName:{chs:"掉落钉珠（按回合排序）"},
				function:cards=>{
				const searchTypeArray = [226];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
				const searchTypeArray = [226];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				return `${sk[1]}%×${sk[0]}T`;
				}
			},
		]},
		{group:true,name:"-----Damage Enemy - Gravity-----",otLangName:{chs:"-----对敌直接伤害类-重力-----"}, functions: [
			{name:"Gravity - Current HP(sort by rate)",otLangName:{chs:"重力-敌人当前血量（按比例排序）"},
				function:cards=>{
					const searchTypeArray = [6];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = a_s.params[0],b_pC = b_s.params[0];
						return a_pC - b_pC;
					})
				},
				addition:card=>{
					const searchTypeArray = [6];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return `当前${sk[0]}%`;
				}
			},
			{name:"Gravity - Max HP(sort by rate)",otLangName:{chs:"重力-敌人最大血量（按比例排序）"},
				function:cards=>{
					const searchTypeArray = [161];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
						let a_pC = a_s.params[0],b_pC = b_s.params[0];
						return a_pC - b_pC;
					})
				},
				addition:card=>{
					const searchTypeArray = [161];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
					return `最大${sk[0]}%`;
				}
			},
		]},
		{group:true,name:"-----Damage Enemy - Fixed damage-----",otLangName:{chs:"-----对敌直接伤害类-无视防御固伤-----"}, functions: [
			{name:"Fixed damage - Single(sort by damage)",otLangName:{chs:"无视防御固伤-单体（按总伤害排序）"},
				function:cards=>{
					const searchTypeArray = [55,188];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_ss = getCardActiveSkills(a, searchTypeArray), b_ss = getCardActiveSkills(b, searchTypeArray);
						let a_pC = a_ss.reduce((p,v)=>p+v.params[0],0), b_pC = b_ss.reduce((p,v)=>p+v.params[0],0);
						return a_pC - b_pC;
					});
				},
				addition:card=>{
					const searchTypeArray = [55,188];
					const skills = getCardActiveSkills(card, searchTypeArray, true);
					const sk = skills[0].params;
		
					return `${sk[0].bigNumberToString()}点` + (skills.length > 1 ? `×${skills.length}` : '');
				}
			},
			{name:"Fixed damage - Mass(sort by damage)",otLangName:{chs:"无视防御固伤-全体（按伤害数排序）"},
				function:cards=>{
					const searchTypeArray = [56];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [56];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const sk = skill.params;
		
					return `固伤${sk[0].bigNumberToString()}`;
				}
			},
		]},
		{group:true,name:"-----Damage Enemy - Numerical damage-----",otLangName:{chs:"-----对敌直接伤害类-大炮-----"}, functions: [
			{name:"Numerical ATK - Target - Single",otLangName:{chs:"大炮-对象-敌方单体"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [2,35,37,59,84,86,110,115,144];
				function isSingle(skill)
				{
					if (skill.type == 110)
						return Boolean(skill.params[0]);
					else if (skill.type == 144)
						return Boolean(skill.params[2]);
					else
						return true;
				}
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && isSingle(skill);
				})
			},
			{name:"Numerical ATK - Target - Mass",otLangName:{chs:"大炮-对象-敌方全体"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [0,1,58,85,87,110,143,144];
				function isAll(skill)
				{
					if (skill.type == 110)
						return !Boolean(skill.params[0]);
					else if (skill.type == 144)
						return !Boolean(skill.params[2]);
					else
						return true;
				}
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && skill.id!=0 && isAll(skill);
				})
			},
			{name:"Numerical ATK - Target - Designate Attr",otLangName:{chs:"大炮-对象-指定属性敌人"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [42];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
	
			{name:"Numerical ATK - Attr - Any",otLangName:{chs:"大炮-属性-不限"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [0,1,2,35,37,42,58,59,84,85,86,87,110,115,143,144];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && skill.id!=0;
				}),
				addition:card=>{
				const searchTypeArray = [0,1,2,35,37,42,58,59,84,85,86,87,110,115,143,144];
				const skill = getCardActiveSkill(card, searchTypeArray);
				//const sk = skill.params;
	
				const colors = [getCannonAttr(skill)];
				
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`射`));
				fragment.appendChild(createOrbsList(colors));
				return fragment;
				}
			},
			{name:"Numerical ATK - Attr - Actors self",otLangName:{chs:"大炮-属性-释放者自身"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [2,35];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
	
			{name:"Numerical ATK - Damage - Rate by Actors self ATK(sort by rate)",otLangName:{chs:"大炮-伤害-自身攻击倍率（按倍率排序，范围取小）"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [0,2,35,37,58,59,84,85,115];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && skill.id!=0;
			}).sort((a,b)=>{
				const searchTypeArray = [0,2,35,37,58,59,84,85,115];
				const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
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
				let a_pC = getNumber(a_s),b_pC = getNumber(b_s);
				return a_pC - b_pC;
				})
			},
			{name:"Numerical ATK - Damage - Fixed Attr Number (sort by number)",otLangName:{chs:"大炮-伤害-指定属性数值（按数值排序）"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [1,42,86,87];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
			}).sort((a,b)=>{
				const searchTypeArray = [1,42,86,87];
				const a_s = getCardActiveSkill(a, searchTypeArray), b_s = getCardActiveSkill(b, searchTypeArray);
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
				let a_pC = getNumber(a_s),b_pC = getNumber(b_s);
				return a_pC - b_pC;
				})
			},
			{name:"Numerical ATK - Damage - By remaining HP (sort by rate at HP 1)",otLangName:{chs:"大炮-伤害-根据剩余血量（按 1 HP 时倍率排序）"},
				function:cards=>{
				const searchTypeArray = [110];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,3));
				}
			},
			{name:"Numerical ATK - Damage - Team total HP (sort by rate)",otLangName:{chs:"大炮-伤害-队伍总 HP（按倍率排序）"},
				function:cards=>{
				const searchTypeArray = [143];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				}
			},
			{name:"Numerical ATK - Damage - Team attrs ATK (sort by rate)",otLangName:{chs:"大炮-伤害-队伍某属性总攻击（按倍率排序）"},
				function:cards=>{
				const searchTypeArray = [144];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				}
			},
			{name:"Numerical ATK - Special - Vampire",otLangName:{chs:"大炮-特殊-吸血"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [35,115];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
		]},
		{group:true,name:"-----Board Change-----",otLangName:{chs:"-----洗版类-----"}, functions: [
			{name:"Replaces all Orbs",otLangName:{chs:"刷版"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [10];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Changes all Orbs to 1 color(Farm)",otLangName:{chs:"洗版-1色（花火）"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 1;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 2 color",otLangName:{chs:"洗版-2色"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 2;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 3 color",otLangName:{chs:"洗版-3色"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 3;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 4 color",otLangName:{chs:"洗版-4色"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 4;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to 5 color",otLangName:{chs:"洗版-5色"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length == 5;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs to ≥6 color",otLangName:{chs:"洗版-6色以上"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).length >= 6;
			}),addition:boardChange_Addition},
			{name:"Changes all Orbs - include Fire",otLangName:{chs:"洗版-含火"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(0);
				})
			},
			{name:"Changes all Orbs - include Water",otLangName:{chs:"洗版-含水"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(1);
				})
			},
			{name:"Changes all Orbs - include Wood",otLangName:{chs:"洗版-含木"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(2);
				})
			},
			{name:"Changes all Orbs - include Light",otLangName:{chs:"洗版-含光"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(3);
				})
			},
			{name:"Changes all Orbs - include Dark",otLangName:{chs:"洗版-含暗"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(4);
				})
			},
			{name:"Changes all Orbs - include Heart",otLangName:{chs:"洗版-含心"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return boardChange_ColorTypes(skill).includes(5);
				})
			},
			{name:"Changes all Orbs - include Jammers/Poison",otLangName:{chs:"洗版-含毒废"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [71];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const colors = boardChange_ColorTypes(skill);
				return colors.includes(6)
					|| colors.includes(7)
					|| colors.includes(8)
					|| colors.includes(9);
				})
			},
		]},
		{group:true,name:"-----Orbs Change-----",otLangName:{chs:"-----指定色转珠类-----"}, functions: [
			{name:"Orbs Change - to Fire",otLangName:{chs:"转珠-变为-火"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(0));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Water",otLangName:{chs:"转珠-变为-水"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(1));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Wood",otLangName:{chs:"转珠-变为-木"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(2));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Light",otLangName:{chs:"转珠-变为-光"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(3));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Dark",otLangName:{chs:"转珠-变为-暗"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(4));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Heal",otLangName:{chs:"转珠-变为-心"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(5));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Jammers/Poison",otLangName:{chs:"转珠-变为-毒废"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(6) || p.to.includes(7) || p.to.includes(8) || p.to.includes(9));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Fire",otLangName:{chs:"转珠-转走-火"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(0));
				}),
			},
			{name:"Orbs Change - from Water",otLangName:{chs:"转珠-转走-水"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(1));
				}),
			},
			{name:"Orbs Change - from Wood",otLangName:{chs:"转珠-转走-木"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(2));
				}),
			},
			{name:"Orbs Change - from Light",otLangName:{chs:"转珠-转走-光"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(3));
				}),
			},
			{name:"Orbs Change - from Dark",otLangName:{chs:"转珠-转走-暗"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(4));
				}),
			},
			{name:"Orbs Change - from Heart",otLangName:{chs:"转珠-转走-心"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(5));
				}),
			},
			{name:"Orbs Change - from Jammers/Poison",otLangName:{chs:"转珠-转走-毒废"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(6) || p.to.includes(7) || p.to.includes(8) || p.to.includes(9));
				}),
			},
			{name:"Enhanced Orbs",otLangName:{chs:"强化宝珠"},
				function:cards=>{
				const searchTypeArray = [52,91,140];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				});
				},
				addition:card=>{
				const searchTypeArray = [52,91,140];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				let attrs = [];
				switch (skill.type)
				{
					case 52:{
						attrs.push(sk[0]); break;
					}
					case 91:{
						attrs = sk.slice(0,-1); break;
					}
					case 140:{
						attrs = flags(sk[0]); break;
					}
				}
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`强化`));
				fragment.appendChild(createOrbsList(attrs));
				return fragment;
				}
			},
		]},
		{group:true,name:"-----Create Orbs-----",otLangName:{chs:"-----随机产珠类-----"}, functions: [
			{name:"Create 30 Orbs",otLangName:{chs:"固定30个产珠"},
				function:cards=>cards.filter(card=>{
				function is30(sk)
				{
					return Boolean(flags(sk[1]).length * sk[0] == 30);
				}
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && is30(skill.params);
			}),addition:generateOrbs_Addition},
			{name:"Create 15×2 Orbs",otLangName:{chs:"固定15×2产珠"},
				function:cards=>cards.filter(card=>{
				function is1515(sk)
				{
					return Boolean(flags(sk[1]).length == 2 && sk[0] == 15);
				}
				const searchTypeArray = [141];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && is1515(skill.params);
			}),addition:generateOrbs_Addition},
			{name:"Create Fire Orbs",otLangName:{chs:"产珠-生成-火"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(0));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Water Orbs",otLangName:{chs:"产珠-生成-水"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(1));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Wood Orbs",otLangName:{chs:"产珠-生成-木"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(2));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Light Orbs",otLangName:{chs:"产珠-生成-光"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(3));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Dark Orbs",otLangName:{chs:"产珠-生成-暗"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(4));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Heart Orbs",otLangName:{chs:"产珠-生成-心"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(5));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Jammers/Poison Orbs",otLangName:{chs:"产珠-生成-毒废"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(6) || gen.to.includes(7) || gen.to.includes(8) || gen.to.includes(9));
				}),
				addition:generateOrbs_Addition
			},
		]},
		{group:true,name:"-----Create Fixed Position Orbs-----",otLangName:{chs:"-----固定位置产珠类-----"}, functions: [
			{name:"Create designated shape",otLangName:{chs:"生成指定形状的"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [176];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Create 3×3 block",otLangName:{chs:"生成3×3方块"},
				function:cards=>cards.filter(card=>{
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
				const searchTypeArray = [176];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && is3x3(skill.params);
				}),
				addition:card=>{
				const searchTypeArray = [176];
				const skill = getCardActiveSkill(card, searchTypeArray);
				const sk = skill.params;
				const fragment = document.createDocumentFragment();
				fragment.appendChild(document.createTextNode(`3×3`));
				fragment.appendChild(createOrbsList(sk[5]));
				return fragment;
				}
			},
			{name:"Create a vertical",otLangName:{chs:"产竖"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [127];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [127];
				const skill = getCardActiveSkill(card, searchTypeArray);
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
				}
			},
			{name:"Create a vertical include Heart",otLangName:{chs:"产竖（含心）"},
				function:cards=>cards.filter(card=>{
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
				const searchTypeArray = [127];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && isHeart(skill.params);
				})
			},
			{name:"Create a horizontal",otLangName:{chs:"产横"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [128];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				}),
				addition:card=>{
				const searchTypeArray = [128];
				const skill = getCardActiveSkill(card, searchTypeArray);
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
				}
			},
			{name:"Create ≥2 horizontals",otLangName:{chs:"2横或以上"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [128];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && (skill.params.length>=3 || flags(skill.params[0]).length>=2);
				})
			},
			{name:"Create 2 color horizontals",otLangName:{chs:"2色横"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [128];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && skill.params[3]>=0 && (skill.params[1] & skill.params[3]) != skill.params[1];
				})
			},
			{name:"Create horizontal not Top or Bottom",otLangName:{chs:"非顶底横"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [128];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && ((skill.params[0] | skill.params[2]) & 14);
				})
			},
			{name:"Extensive horizontal(include Farm and outer edges)",otLangName:{chs:"泛产横（包含花火与四周一圈等）"},
				function:cards=>cards.filter(card=>{
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
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && isRow(skill);
				})
			},
		]},
		{group:true,name:"======Evo type======",otLangName:{chs:"======进化类型======"}, functions: [
			{name:"No Henshin",otLangName:{chs:"非变身"},
				function:cards=>cards.filter(card=>!card.henshinFrom && !card.henshinTo)
			},
			{name:"Before Henshin",otLangName:{chs:"变身前"},
				function:cards=>cards.filter(card=>card.henshinTo)
			},
			{name:"After Henshin",otLangName:{chs:"变身后"},
				function:cards=>cards.filter(card=>card.henshinFrom)
			},
			{name:"Pixel Evo",otLangName:{chs:"像素进化"},
				function:cards=>cards.filter(card=>card.evoMaterials.includes(3826))
			},
			{name:"8 latent grids",otLangName:{chs:"8格潜觉"},
				function:cards=>cards.filter(card=>card.is8Latent)
			},
			//{name:"",otLangName:{chs:"非8格潜觉"},function:cards=>cards.filter(card=>!card.is8Latent)},
			{name:"Reincarnation/Super Re..",otLangName:{chs:"转生、超转生进化"},
				function:cards=>cards.filter(card=>isReincarnated(card))
			}, //evoBaseId可能为0
			//{name:"",otLangName:{chs:"仅超转生进化"},function:cards=>cards.filter(card=>isReincarnated(card) && !Cards[card.evoBaseId].isUltEvo)},
			{name:"Super Ult Evo",otLangName:{chs:"超究极进化"},
				function:cards=>cards.filter(card=>card.is8Latent && card.isUltEvo && !card.awakenings.includes(49))
			},
			/*{name:"",otLangName:{chs:"变身前"},
				function:cards=>cards.filter(card=>{
				const searchType = 202;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType);
				}
				})
			},
			{name:"",otLangName:{chs:"变身前后队长技保持不变"},
				function:cards=>cards.filter(card=>{
				const searchType = 202;
				const skill = Skills[card.activeSkillId];
				if (skill.type == searchType && card.leaderSkillId == Cards[skill.params[0]].leaderSkillId)
					return true;
				else if (skill.type == 116 || skill.type == 118){
					const subskills = skill.params.map(id=>Skills[id]);
					return subskills.some(subskill=>subskill.type == searchType && card.leaderSkillId == Cards[subskill.params[0]].leaderSkillId);
				}
				})
			},*/
			{name:"Evo from Weapon",otLangName:{chs:"由武器进化而来"},
				function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].awakenings.includes(49))
			},
		]},
		{group:true,name:"======Others Search======",otLangName:{chs:"======其他搜索======"}, functions: [
			{name:"Water Att. & Attacker Type(Tanjiro)",otLangName:{chs:"攻击型或水属性（炭治郎队员）"},
				function:cards=>cards.filter(card=>card.attrs.includes(1) || card.types.includes(6))
			},
			{name:"Fire & Water Att.(Seina)",otLangName:{chs:"火属性或水属性（火车队员）"},
				function:cards=>cards.filter(card=>card.attrs.includes(0) || card.attrs.includes(1))
			},
			{name:"Level limit unable break",otLangName:{chs:"不能突破等级限制"},
				function:cards=>cards.filter(card=>card.limitBreakIncr===0)
			},
			{name:"Raise ≥50% at lv110",otLangName:{chs:"110级三维成长≥50%"},
				function:cards=>cards.filter(card=>card.limitBreakIncr>=50).sort((a,b)=>a.limitBreakIncr - b.limitBreakIncr),
				addition:card=>`成长${card.limitBreakIncr}%`
			},
			{name:"Max level is lv1",otLangName:{chs:"满级只有1级"},
				function:cards=>cards.filter(card=>card.maxLevel==1)
			},
			{name:"Less than 100mp",otLangName:{chs:"低于100mp"},
				function:cards=>cards.filter(card=>card.sellMP<100)
			},
			{name:"Have 3 types",otLangName:{chs:"有3个type"},
				function:cards=>cards.filter(card=>card.types.filter(t=>t>=0).length>=3)
			},
			{name:"Have 2 Attrs",otLangName:{chs:"有两个属性"},
				function:cards=>cards.filter(card=>card.attrs.filter(a=>a>=0 && a<6))
			},
			{name:"2 attrs are different",otLangName:{chs:"主副属性不一致"},
				function:cards=>cards.filter(card=>card.attrs[0]<6 && card.attrs[1]>=0 && card.attrs[0] != card.attrs[1])
			},
			{name:"Will get Orbs skin",otLangName:{chs:"能获得宝珠皮肤"},
				function:cards=>cards.filter(card=>card.blockSkinId>0)
			},
			{name:"All Latent TAMADRA",otLangName:{chs:"所有潜觉蛋龙"},
				function:cards=>cards.filter(card=>card.latentAwakeningId>0).sort((a,b)=>a.latentAwakeningId-b.latentAwakeningId)
			},
		]},
		{group:true,name:"----- Awoken -----",otLangName:{chs:"-----觉醒类-----"}, functions: [
			{name:"Have 9 awokens",otLangName:{chs:"有9个觉醒"},
				function:cards=>cards.filter(card=>card.awakenings.length>=9)
			},
			{name:"Can be assist",otLangName:{chs:"可以做辅助"},
				function:cards=>cards.filter(card=>card.canAssist)
			},
			{name:"Not weapon",otLangName:{chs:"不是武器"},
				function:cards=>cards.filter(card=>!card.awakenings.includes(49))
			},
			{name:"Able to lv110, but no Super Awoken",otLangName:{chs:"能突破等级限制但没有超觉醒"},
				function:cards=>cards.filter(card=>card.limitBreakIncr > 0 && card.superAwakenings.length == 0)
			},
			{name:"3 same Killer Awoken, or 2 with same latent",otLangName:{chs:"3个相同杀觉醒，或2个杀觉醒并可打相同潜觉"},
				function:cards=>cards.filter(card=>{
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
				})
			},
			{name:"3 same Killer Awoken(include super awoken), or 2 with same latent",otLangName:{chs:"3个相同杀觉醒（含超觉），或相同潜觉"},
				function:cards=>cards.filter(card=>{
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
				})
			},
			{name:"4 same Killer Awoken(include super awoken), or 3 with same latent",otLangName:{chs:"4个相同杀觉醒（含超觉），或相同潜觉"},
				function:cards=>cards.filter(card=>{
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
				})
			},
		]},
	];
	return functions;
})();