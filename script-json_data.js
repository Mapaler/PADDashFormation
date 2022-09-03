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
	webpage_title: `P&D ${teamsCount}P Formation Maker`,
	addition_display: "💬",
	title_blank: "Input Formation Title",
	detail_blank: "Input Detail",
	sort_name:{
		sort_none: "Nope",
		sort_id: "Cards Id",
		sort_attrs : "Attribute",
		sort_evoRootId: "Cards Evolution Root",
		sort_evoRoot_Attrs : "Cards Evolution Root's Attribute",
		sort_rarity: "Rarity",
		sort_cost: "Cost",
		sort_skillLv1: "Maximum Skill Turn",
		sort_skillLvMax: "Minimum Skill Turn",
		sort_evoSkillLastCD: "Minimum Skill Turn(latest in Evo Skill)",
		sort_hpMax120: "Max HP",
		sort_atkMax120: "Max ATK",
		sort_rcvMax120: "Max RCV",
		sort_hpMax120_awoken: "Max HP (+Awoken)",
		sort_atkMax120_awoken: "Max ATK (+Awoken)",
		sort_rcvMax120_awoken: "Max RCV (+Awoken)",
		sort_abilityIndex_awoken: "Maximum Weighted Ability Index (+Awakening)",
	},
	force_reload_data: `Force refresh data`,
	skill_parse: {
		skill: {
			unknown: tp`Unkonwn skill type: ${'type'}`,
			active_turns: tp`${'actionSkill'}, for ${'turns'} turns`,
			random_skills: tp`Random Activates these skills:${'skills'}`,
			evolved_skills: tp`Skills evolve to the next stage when used:${'skills'}`,
			evolved_skills_loop: tp`${`icon`}Returns to the first stage after use`,
			damage_enemy: tp`Inflicts ${'times'}${'damage'} ${'attr'} attack on ${'target'}${'totalDamage'}`,
			damage_enemy_times: tp`${'times'} `,
			damage_enemy_count: tp` (${'damage'} in total)`,
			//Inflicts a 50x attack to 1 enemy and recover 100% of the damage. Reduces unmatchable orb status by 9999 turns. 9999 turn awoken bind recovery.
			vampire: tp`${'damage_enemy'} and ${'icon'}recover ${'heal'} of the damage`,
			delay: tp`${'icon'}Delays enemies' next move`,
			mass_attack: tp`${'icon'}Mass attacks`,
			leader_change: tp`${'icon'}Switches ${'target'} with Leader Monster, use again to switch back`,
			no_skyfall: tp`${'icon'}No Skyfall Combos`,
			self_harm: tp`${'icon'}Reduces ${'stats'} by ${'value'}`,
			heal: tp`${'icon'}Recover ${'value'} ${'stats'}`,
			unbind: tp`Recovery ${'stats'} by ${'turns'} turns`,
			unbind_normal: tp`${'icon'}Bind`,
			unbind_awakenings: tp`${'icon'}Awoken bind`,
			unbind_matches: tp`${'icon'}Unmatchable orb`,
			bind_skill: tp`${'icon'}Unable to use skills`,
			defense_break: tp`${'icon'}Reduce enemy defense by ${'value'}`,
			poison: tp`${'icon'}Poisons ${'target'}, reduce ${'stats'} with ${'belong_to'} ${'value'} per turns`,
			time_extend: tp`${'icon'}Orb move time ${'value'}`,
			follow_attack: tp`${'icon'}Bonus attack equal to ${'belong_to'} ${'value'} when matching Orbs (Consider the ${'target'}'s defense)`,
			follow_attack_fixed: tp`inflicts ${'damage'} ${'attr'} damage`,
			auto_heal_buff: tp`${'icon'}Heal ${'value'} ${'stats'} every turn`,
			auto_heal: tp`${'icon'}Heal ${'stats'} by ${'belong_to'} ${'value'} after matching orbs`,
			ctw: tp`${'icon'}Move orbs freely for ${'value'}`,
			gravity: tp`${'icon'}Reduce ${'target'} ${'value'}`,
			resolve: tp`${'icon'}Survive a single hit when ${'stats'}≧${'min'}`,
			board_change: tp`Change all orbs to ${'orbs'}`,
			skill_boost: tp`Team's skills charge ${'icon'}${'turns_min'}${'turns_max'}`,
			skill_boost_range: tp`~${'turns'}`,
			add_combo: tp`Adds ${'value'} combos${'icon'}`,
			fixed_time: tp`[${'icon'}Fixed orb move time: ${'value'}]`,
			min_match_length: tp`[Only able to erase ≥${'matchable'} orbs]`, //matchable, unmatchable
			drop_refresh: tp`Replaces all orbs`,
			drum: tp`Plus a drumming sound is made when Orbs are moved`,
			auto_path: tp`Shows 3 combo path (Norm. Dungeon & 3 linked Orbs only)`,
			board7x6: tp`[${'icon'}7x6 board]`,
			counter_attack: tp`When attacked by an ${'target'}, ${'chance'}${'value'} ${'attr'} ${'icon'}counterattack`,	
			change_orbs: tp`Changes ${'from'} to ${'to'} orbs`,
			generate_orbs: tp`Creates ${'value'} ${'orbs'} orbs each at random ${'exclude'}`,
			fixed_orbs: tp`Changes the ${'position'} to ${'orbs'} orbs`,
			orb_drop_increase: tp`Increases the skyfall of ${'orbs'} to ${'value'}`,
			orb_drop_increase_flag: tp`${'orbs'} skyfall ${'chance'}${'flag'}`,
			orb_drop_increase_chance: tp`by ${'value'}`,
			attr_absorb: tp`${'icon'}Attribute absorption`,
			combo_absorb: tp`${'icon'}Combo absorption`,
			damage_absorb: tp`${'icon'}Damage absorption`,
			damage_void: tp`${'icon'}Damage void`,
			void_enemy_buff: tp`Voids enemies' ${'buff'}`,
			change_attribute: tp`${'target'} Att. changes to ${'attrs'}`,
			set_orb_state_enhanced: tp`${'orbs'} ${'icon'}enhanced (${'value'} per orb)`,
			set_orb_state_locked: tp`${'icon'}Locks ${'value'}${'orbs'}`,
			set_orb_state_unlocked: tp`${'icon'}Unlocks ${'orbs'}`,
			set_orb_state_bound: tp`${'orbs'} are unmatchable`,
			rate_multiply: tp`${'rate'} ${'value'} when entering as leader`,
			rate_multiply_drop: tp`${'icon'}Drop rate`,
			rate_multiply_coin: tp`${'icon'}Coins`,
			rate_multiply_exp: tp`${'icon'}Rank EXP`,
			reduce_damage: tp`${'condition'}${'chance'}${'icon'}Reduces ${'attrs'} damage taken by ${'value'}`,
			power_up: tp`${'condition'}${'targets'}${'value'}${'reduceDamage'}${'addCombo'}${'followAttack'}`,
			power_up_targets: tp`[${'attrs_types'}]'s `, //attrs, types, attrs_types
			henshin: tp`Transforms into ${'card'}`,
			random_henshin: tp`Random transforms into ${'cards'}`,
			void_poison: tp`Voids ${'poison'} damage`,
			skill_proviso: tp`The follow-up effect can only be activates ${'condition'}`,
			impart_awoken: tp`Impart ${'attrs_types'} additional ${'awakenings'}`,
			obstruct_opponent: tp`Apply obstruct skill effect to ${'target'}: ${'skills'}`,
			obstruct_opponent_after_me: tp`The opponent ranked lower than me`,
			obstruct_opponent_before_me: tp`The opponent ranked higher than me`,
			obstruct_opponent_designated_position: tp`No.${'positions'} ranked opponents`,
			increase_damage_cap: tp`The ${'icon'}damage cap of ${'targets'} is increased to ${'cap'}`,
			board_jamming_state: tp`Creates ${'count'} ${'state'} ${'size'} at ${'position'}${'time'}`,
		},
		power: {
			unknown: tp`[ Unkonwn power up: ${'type'} ]`,
			scale_attributes: tp`When matching ${'min'} attr. of ${'orbs'} ${'stats'}${'bonus'}`,
			scale_attributes_bonus: tp`, ${'bonus'} per attr. additional, up to ${'stats_max'} for ${'max'} attr.`,
			scale_combos: tp`When ${'min'} combos ${'stats'}${'bonus'}`,
			scale_combos_bonus: tp`, ${'bonus'} per combos additional, up to ${'stats_max'} for ${'max'} combos`,
			scale_match_attrs: tp`When matching ${'min'} combos in [${'matches'}] ${'stats'}${'bonus'}`,
			scale_match_attrs_bonus: tp`, ${'bonus'} per matches additional，up to ${'stats_max'} for ${'max'} matches`,
			scale_match_length: tp`When matching ${'min'} of ${'orbs'} ${'in_once'}${'stats'}${'bonus'}`,
			scale_match_length_bonus: tp`, ${'bonus'} per orbs additional，up to ${'stats_max'} for ${'max'} orbs`,
			scale_remain_orbs: tp`When ≤ ${'max'} orbs remain on the board ${'stats'}${'bonus'}`,
			scale_remain_orbs_bonus: tp`, ${'bonus'} for each fewer orb, up to ${'stats_max'} for ${'min'} orbs`,
			scale_cross: tp`When matching each cross of 5 ${'orbs'} ${'stats'}`,
			scale_cross_single: tp`When matching a cross of 5 ${'orbs'} ${'stats'}`,
			scale_state_kind_count: tp`${'stats'} for each [${'awakenings'}${'attrs'}${'types'}] in team`,
		},
		cond: {
			unknown: tp`[ Unknown condition ]`,
			hp_equal: tp`When ${'hp'} == ${'min'} `,
			hp_less_or_equal: tp`When ${'hp'} ≤ ${'max'} `,
			hp_greater_or_equal: tp`When ${'hp'} ≥ ${'min'} `,
			hp_belong_to_range: tp`When ${'hp'} ∈ [${'min'},${'max'}] `,
			use_skill: tp`When skills used `,
			multi_player: tp`When in Multiplayer Mode `,
			remain_orbs: tp`When ≤ ${'value'} Orbs on the board `,
			exact_combo: tp`When exactly ${'value'} combos `,
			exact_match_length: tp`When matching exactly of ${'value'}${'orbs'} `,
			exact_match_enhanced: tp` orbs including enhanced`,
			exact_match_length_multiple: tp`When matching each exactly of ${'value'}${'orbs'} `,

			compo_type_card: tp`When ${'ids'} are all on team, `,
			compo_type_series: tp`When all subs from ${'ids'} collab (Needs at least 1 sub), `,
			compo_type_evolution: tp`When all monsters in team are ${'ids'}, `,
			compo_type_rarity: tp`When the total ★ rarity of the team is ≤${'rarity'}, `,

			stage_less_or_equal: tp`When ${'stage'} ≤ ${'max'}, `,
			stage_greater_or_equal: tp`When ${'stage'} ≥ ${'min'}, `,

			L_shape: tp`When matching an L shape of 5 ${'orbs'} `,
			heal: tp`When healing at least ${'heal'} ${'stats'} with ${'orbs'} `,
		},
		position: {
			top: tp`${'pos'} of top rows`,
			bottom: tp`${'pos'} of bottom rows`,
			left: tp`${'pos'} of left columns`,
			right: tp`${'pos'} of right columns`,
			random: tp`random location`,
			shape: tp`specified location`,
		},
		value: {
			unknown: tp`[ Unknown value: ${'type'}]`, //type
			const: tp`${'value'} ${'unit'}`,
			const_to: tp`to ${'value'}`,
			mul_percent: tp`${'value'}%`,
			mul_times: tp`×${'value'}`,
			mul_of_percent: tp`${'stats'}'s ${'value'}%`,
			mul_of_times: tp`${'stats'} ×${'value'}`,
			hp_scale: tp`when ${'hp'} == 100% is ${'min'} and ${'hp'} == 1 is ${'max'}`,
			random_atk: tp`${'atk'} ×${'min'}${'max'}`,
			prob: tp`${'value'} chance for `,
			x_awakenings: tp`count of ${'awakenings'} ×${'value'}`,
			size: tp`${'width'}×${'height'}`,
			pos: tp`${'x'}×${'y'}`,
		},
		target: {
			unknown: tp`Unkown Target`,
			self: tp`card's`,
			team: tp`team`,
			team_last: tp`the lastest member`,
			team_leader: tp`leader`,
			sub_members: tp`sub-members`,
			leader_self: tp`left leader`,
			leader_helper: tp`right leader`,
			enemy: tp`Enemy`,
			enemy_all: tp`all enemys`,
			enemy_one: tp`1 enemy`,
			enemy_attr: tp`${'attr'} enemy`,
			the_attr: tp`attr of the matched Orbs`,
		},
		stats: {
			unknown: tp`[ Unknown: ${'type'}]`, //type
			maxhp: tp`Max HP`,
			hp: tp`HP`,
			chp: tp`current HP`,
			atk: tp`ATK`,
			rcv: tp`RCV`,
			teamhp: tp`Team HP`,
			teamatk: tp`Team ${'attrs'} ATK`,
			teamrcv: tp`Team RCV`,
			cstage: tp`current Stage of Dungeon`,
		},
		unit: {
			orbs: tp``,
			times: tp` times`,
			seconds: tp` seconds`,
			point: tp` point`,
			turns: tp` turns`,
		},
		word: {
			comma: tp`, `,
			slight_pause: tp`, `,
			range_hyphen: tp`~`,
			in_once: tp`in once `,
			evo_type_pixel: tp`Pixel Evo`,
			evo_type_reincarnation: tp`Reinc. or Super Reinc. Evo`,
			evo_type_unknow: tp`Unknown Evo: ${'type'}`,
			affix_attr: tp`${'cotent'} attr.`,
			affix_orb: tp`${'cotent'} orbs`,
			affix_type: tp`${'cotent'} types`,
			affix_awakening: tp`${'cotent'} awoken`,
			affix_exclude: tp`, exclude ${'cotent'}`,
		},
		attrs: {
			[0]: tp`${'icon'}Fire`,
			[1]: tp`${'icon'}Water`,
			[2]: tp`${'icon'}Wood`,
			[3]: tp`${'icon'}Light`,
			[4]: tp`${'icon'}Dark`,
			[5]: tp`${'icon'}Recover`,
			[6]: tp`${'icon'}Null`,
			all: tp`All`,
			self: tp`${'icon'}Self's Attr`,
			fixed: tp`${'icon'}Fixed`,
		},
		orbs: {
			[0]: tp`${'icon'}Fire`,
			[1]: tp`${'icon'}Water`,
			[2]: tp`${'icon'}Wood`,
			[3]: tp`${'icon'}Light`,
			[4]: tp`${'icon'}Dark`,
			[5]: tp`${'icon'}Heal`,
			[6]: tp`${'icon'}Jammer`,
			[7]: tp`${'icon'}Poison`,
			[8]: tp`${'icon'}Lethal Poison`,
			[9]: tp`${'icon'}Bomb`,
			enhanced: tp`${'icon'}Enhanced`,
			locked: tp`${'icon'}Locked`,
			nail: tp`${'icon'}Nail`,
			_5color: tp`${'icon'}5 Att.`,
			_6color: tp`${'_5color'}+${'orb_rcv'}`,
			all: tp`All`,
			any: tp`Any ${'cotent'}`,
		},
		board: {
			cloud: tp`${'icon'}Cloud`,
			roulette: tp`${'icon'}Roulette`,
			roulette_time: tp`(transforms every ${'duration'})`,
		},
		types: {
			[0]: tp`${'icon'}Evo Material`,
			[1]: tp`${'icon'}Balanced`,
			[2]: tp`${'icon'}Physical`,
			[3]: tp`${'icon'}Healer`,
			[4]: tp`${'icon'}Dragon`,
			[5]: tp`${'icon'}God`,
			[6]: tp`${'icon'}Attacker`,
			[7]: tp`${'icon'}Devil`,
			[8]: tp`${'icon'}Machine`,
			[9]: tp`${'icon'}Special Protection`,
			[12]: tp`${'icon'}Awaken`,
			[14]: tp`${'icon'}Enhance Material`,
			[15]: tp`${'icon'}Redeemable`,
		},
		awokens: {
			[0]: tp`${'icon'}Unknown awoken`,
			[1]: tp`${'icon'}Enhanced HP`,
			[2]: tp`${'icon'}Enhanced Attack`,
			[3]: tp`${'icon'}Enhanced Recovery`,
			[4]: tp`${'icon'}Reduce Fire Damage`,
			[5]: tp`${'icon'}Reduce Water Damage`,
			[6]: tp`${'icon'}Reduce Wood Damage`,
			[7]: tp`${'icon'}Reduce Light Damage`,
			[8]: tp`${'icon'}Reduce Dark Damage`,
			[9]: tp`${'icon'}Auto-Recover`,
			[10]: tp`${'icon'}Resistance-Bind`,
			[11]: tp`${'icon'}Resistance-Blind`,
			[12]: tp`${'icon'}Resistance-Jammers`,
			[13]: tp`${'icon'}Resistance-Poison`,
			[14]: tp`${'icon'}Enhanced Fire Orbs`,
			[15]: tp`${'icon'}Enhanced Water Orbs`,
			[16]: tp`${'icon'}Enhanced Wood Orbs`,
			[17]: tp`${'icon'}Enhanced Water Orbs`,
			[18]: tp`${'icon'}Enhanced Dark Orbs`,
			[19]: tp`${'icon'}Extend Time`,
			[20]: tp`${'icon'}Recover Bind`,
			[21]: tp`${'icon'}Skill Boost`,
			[22]: tp`${'icon'}Enhanced Fire Rows`,
			[23]: tp`${'icon'}Enhanced Water Rows`,
			[24]: tp`${'icon'}Enhanced Wood Rows`,
			[25]: tp`${'icon'}Enhanced Water Rows`,
			[26]: tp`${'icon'}Enhanced Dark Rows`,
			[27]: tp`${'icon'}Two-Pronged Attack`,
			[28]: tp`${'icon'}Resistance-Skill Bind`,
			[29]: tp`${'icon'}Enhanced Heal Orbs`,
			[30]: tp`${'icon'}Multi Boost`,
			[31]: tp`${'icon'}Dragon Killer`,
			[32]: tp`${'icon'}God Killer`,
			[33]: tp`${'icon'}Devil Killer`,
			[34]: tp`${'icon'}Machine Killer`,
			[35]: tp`${'icon'}Balanced Killer`,
			[36]: tp`${'icon'}Attacker Killer`,
			[37]: tp`${'icon'}Physical Killer`,
			[38]: tp`${'icon'}Healer Killer`,
			[39]: tp`${'icon'}Evo Killer`,
			[40]: tp`${'icon'}Awaken Killer`,
			[41]: tp`${'icon'}Enhance Killer`,
			[42]: tp`${'icon'}Redeemable Killer`,
			[43]: tp`${'icon'}Enhanced Combos`,
			[44]: tp`${'icon'}Guard Break`,
			[45]: tp`${'icon'}Bonus Attack`,
			[46]: tp`${'icon'}Enhanced Team HP `,
			[47]: tp`${'icon'}Enhanced Team Recovery`,
			[48]: tp`${'icon'}Damage Void Piercer`,
			[49]: tp`${'icon'}Awoken Assist`,
			[50]: tp`${'icon'}Super Bonus Attack`,
			[51]: tp`${'icon'}Skill Charge`,
			[52]: tp`${'icon'}Resistance-Bind+`,
			[53]: tp`${'icon'}Extend Time+`,
			[54]: tp`${'icon'}Resistance-Clouds`,
			[55]: tp`${'icon'}Resistance-Immobility`,
			[56]: tp`${'icon'}Skill Boost+`,
			[57]: tp`${'icon'}50% or more HP Enhanced`,
			[58]: tp`${'icon'}50% or less HP Enhanced`,
			[59]: tp`${'icon'}L Damage Reduction`,
			[60]: tp`${'icon'}L Increased Attack`,
			[61]: tp`${'icon'}Super Enhanced Combos`,
			[62]: tp`${'icon'}Combo Orbs`,
			[63]: tp`${'icon'}Skill Voice`,
			[64]: tp`${'icon'}Dungeon Bonus`,
			[65]: tp`${'icon'}Reduced HP`,
			[66]: tp`${'icon'}Reduced Attack`,
			[67]: tp`${'icon'}Reduced RCV`,
			[68]: tp`${'icon'}Resistance-Blind+`,
			[69]: tp`${'icon'}Resistance-Jammers+`,
			[70]: tp`${'icon'}Resistance-Poison+`,
			[71]: tp`${'icon'}Blessing of Jammers`,
			[72]: tp`${'icon'}Blessing of Poison Orbs`,
			[73]: tp`${'icon'}Enhanced Fire Combos`,
			[74]: tp`${'icon'}Enhanced Water Combos`,
			[75]: tp`${'icon'}Enhanced Wood Combos`,
			[76]: tp`${'icon'}Enhanced Light Combos`,
			[77]: tp`${'icon'}Enhanced Dark Combos`,
			[78]: tp`${'icon'}Cross Attack`,
			[79]: tp`${'icon'}3 Att. Enhanced Attack`,
			[80]: tp`${'icon'}4 Att. Enhanced Attack`,
			[81]: tp`${'icon'}5 Att. Enhanced Attack`,
			[82]: tp`${'icon'}Super Enhanced Matching`,
			[83]: tp`${'icon'}Append Dragon Type`,
			[84]: tp`${'icon'}Append God Type`,
			[85]: tp`${'icon'}Append Devil Type`,
			[86]: tp`${'icon'}Append Machine Type`,
			[87]: tp`${'icon'}Append Balanced Type`,
			[88]: tp`${'icon'}Append Attacker Type`,
			[89]: tp`${'icon'}Append Physical Type`,
			[90]: tp`${'icon'}Append Healer Type`,
			[91]: tp`${'icon'}Append Fire Attr.`,
			[92]: tp`${'icon'}Append Water Attr.`,
			[93]: tp`${'icon'}Append Wood Attr.`,
			[94]: tp`${'icon'}Append Water Attr.`,
			[95]: tp`${'icon'}Append Dark Attr.`,
			[96]: tp`${'icon'}Two-Pronged Attack+`,
			[97]: tp`${'icon'}Skill Charge+`,
			[98]: tp`${'icon'}Auto-Recover+`,
			[99]: tp`${'icon'}Enhanced Fire Orbs+`,
			[100]: tp`${'icon'}Enhanced Water Orbs+`,
			[101]: tp`${'icon'}Enhanced Wood Orbs+`,
			[102]: tp`${'icon'}Enhanced Water Orbs+`,
			[103]: tp`${'icon'}Enhanced Dark Orbs+`,
			[104]: tp`${'icon'}Enhanced Heal Orbs+`,
		}
	},
};

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
	39,40,41,46,47 //需要拥有觉醒的才能打，但是有武器
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
	{small:27,big:96,times:2}, //U
	{small:51,big:97,times:2}, //5色溜
	{small:9,big:98,times:2},  //自回
	{small:14,big:99,times:2}, //火+
	{small:15,big:100,times:2},//水+
	{small:16,big:101,times:2},//木+
	{small:17,big:102,times:2},//光+
	{small:18,big:103,times:2},//暗+
	{small:29,big:104,times:2},//心+
];
//官方的觉醒排列顺序
const official_awoken_sorting = [
	21, 19, 43, 45, 10, 11, 12, 13, 49,
	56, 53, 61, 50, 52, 68, 69, 70, 28,
	48, 62, 57, 58, 60, 59, 54, 55, 44,
	14, 15, 16, 17, 18, 29,  9, 27, 51,
	99,100,101,102,103,104, 98, 96, 97,
	22, 23, 24, 25, 26, 32, 31, 33, 34,
	 4,  5,  6,  7,  8, 35, 36, 37, 38,
	 1,  2,  3, 46, 47, 39, 40, 41, 42,
	65, 66, 67, 20, 71, 72, 30, 64, 63,
	73, 74, 75, 76, 77, 78, 79, 80, 81,
	82, 84, 83, 85, 86, 87, 88, 89, 90,
	91, 92, 93, 94, 95, 
];

//pdc的徽章对应数字
const pdcBadgeMap = [
	{pdf:1,pdc:10}, //无限cost
	{pdf:2,pdc:12}, //小手指
	{pdf:3,pdc:9}, //全体攻击
	{pdf:4,pdc:5}, //小回复
	{pdf:5,pdc:1}, //小血量
	{pdf:6,pdc:3}, //小攻击
	{pdf:7,pdc:8}, //SB
	{pdf:8,pdc:18}, //队长防封
	{pdf:9,pdc:19}, //SX
	{pdf:11,pdc:7}, //无天降
	{pdf:17,pdc:6}, //大回复
	{pdf:18,pdc:2}, //大血量
	{pdf:19,pdc:4}, //大攻击
	{pdf:20,pdc:null}, //三维
	{pdf:21,pdc:13}, //大手指
	{pdf:10,pdc:11}, //加经验
	{pdf:12,pdc:15}, //墨镜
	{pdf:13,pdc:17}, //防废
	{pdf:14,pdc:16}, //防毒
	{pdf:50,pdc:14}, //月卡
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
	{pdf:13,pdc:47}, //不被换队长 ×1.5
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
	{pdf:37,pdc:45}, //6色破无效 ×1.5
	{pdf:38,pdc:34}, //3色破属吸
	{pdf:38,pdc:46}, //3色破属吸 ×1.5
	{pdf:39,pdc:40}, //C珠破吸
	{pdf:39,pdc:50}, //C珠破吸 ×1.5
	{pdf:40,pdc:39}, //心横解转转
	{pdf:40,pdc:49}, //心横解转转 ×1.5
	{pdf:41,pdc:38}, //U解禁消
	{pdf:41,pdc:48}, //U解禁消 ×1.5
	{pdf:42,pdc:41}, //伤害上限解除
	{pdf:43,pdc:42}, //HP++
	{pdf:44,pdc:43}, //攻击++
	{pdf:45,pdc:44}, //回复++
	{pdf:46,pdc:51}, //心追解云封
	{pdf:46,pdc:52}, //心追解云封 ×1.5
	{pdf:47,pdc:53}, //心L大SB
	{pdf:47,pdc:54}, //心L大SB ×1.5
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
	{tag:"sort_mp",name:"MP",function:(a,b)=>a.sellMP-b.sellMP},
	{tag:"sort_skillLv1",name:"技能最大冷却时间",function:(a,b)=>Skills[a.activeSkillId].initialCooldown-Skills[b.activeSkillId].initialCooldown},
	{tag:"sort_skillLvMax",name:"技能最小冷却时间",function:(a,b)=>{
		const skill_a = Skills[a.activeSkillId],skill_b = Skills[b.activeSkillId];
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
		}
	},
	{tag:"sort_evoSkillLastCD",name:"技能最小冷却时间（进化后）",function:(a,b)=>{
		function getEvoSkill(skill) {
			//232为进化后不循环技能，233为循环技能
			if (skill.type === 232 || skill.type === 233) return Skills[skill.params[skill.params.length-1]];
			else return skill;
		}
		const skill_a = getEvoSkill(Skills[a.activeSkillId]),skill_b = getEvoSkill(Skills[b.activeSkillId]);
		return (skill_a.initialCooldown - skill_a.maxLevel) - (skill_b.initialCooldown - skill_b.maxLevel);
		}
	},
	{tag:"sort_hpMax120",name:"Lv120最大HP",function:(a,b)=>a.hp.max * (a.limitBreakIncr ? (1 + a.limitBreakIncr/100) * 1.1 : 1) - b.hp.max * (b.limitBreakIncr ? (1 + b.limitBreakIncr/100) * 1.1 : 1)},
	{tag:"sort_atkMax120",name:"Lv120最大攻击",function:(a,b)=>a.atk.max * (a.limitBreakIncr ? (1 + a.limitBreakIncr/100) * 1.05 : 1) - b.atk.max * (b.limitBreakIncr ? (1 + b.limitBreakIncr/100) * 1.05 : 1)},
	{tag:"sort_rcvMax120",name:"Lv120最大回复",function:(a,b)=>a.rcv.max * (a.limitBreakIncr ? (1 + a.limitBreakIncr/100) * 1.05 : 1) - b.rcv.max * (b.limitBreakIncr ? (1 + b.limitBreakIncr/100) * 1.05 : 1)},
	
	{tag:"sort_atkMax120_awoken",name:"Lv120最大攻击(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount, 120),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount, 120);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.atk : 0,
				  abB = abilities_2statusB ? abilities_2statusB.withAwoken.atk : 0;
			return abA - abB;
		}
	},
	{tag:"sort_hpMax120_awoken",name:"Lv120最大HP(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount, 120),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount, 120);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.hp : 0,
				  abB = abilities_2statusB ? abilities_2statusB.withAwoken.hp : 0;
			return abA - abB;
		}
	},
	{tag:"sort_rcvMax120_awoken",name:"Lv120最大回复(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount, 120),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount, 120);
			const abA = abilities_2statusA ? abilities_2statusA.withAwoken.rcv : 0,
				  abB = abilities_2statusB ? abilities_2statusB.withAwoken.rcv : 0;
			return abA - abB;
		}
	},
	{tag:"sort_abilityIndex_awoken",name:"Lv120最大加权能力指数(+觉醒)",function:(a,b)=>
		{
			const abilities_2statusA = calculateAbility_max(a.id, solo, teamsCount, 120),
				  abilities_2statusB = calculateAbility_max(b.id, solo, teamsCount, 120);
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
		}else if (skill.type == 116 || (searchRandom && skill.type == 118) || skill.type == 138 || skill.type == 232 || skill.type == 233)
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
			case 121: case 129: case 163: case 177: case 186:
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
			case 203: case 217:
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
			case 210: //十字触发
				scale = sk[1]/100;
				break;
			case 235: { //可多次触发
				scale = (sk[4] || 0) / 100;
				break;
			}

			case 138: //调用其他队长技
				scale = sk.reduce((pmul,skid)=> 1 - (1-pmul) * (1-getReduceScale(Skills[skid], allAttr, noHPneed)),0);
				break;
			default:
		}
		return scale || 0;
	}
	//获取无条件盾减伤比例
	function getReduceScale_unconditional(ls)
	{
		const sk = ls.params;
		let scale = 0;
		switch (ls.type)
		{
			case 16: //无条件盾
			{
				scale = sk[0]/100;
				break;
			}
			case 129: //无条件盾，属性个数不固定
			case 163: //无条件盾，属性个数不固定
			{
				scale = (sk[5] & 31) != 31 ? 0 : sk[6]/100;
				break;
			}
			case 178: //无条件盾，属性个数不固定
			{
				scale = (sk[6] & 31) != 31 ? 0 : sk[7]/100;
				break;
			}
			case 138: //调用其他队长技
				scale = sk.reduce((pmul,skid)=> 1 - (1-pmul) * (1-getReduceScale_unconditional(Skills[skid])),0);
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
				return sk[3] ?? 0;
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
	
	function sortByHPScal(a,b)
	{
		const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
		return getHPScale(a_s) - getHPScale(b_s);
	}
	function HPScal_Addition(card)
	{
		const skill = Skills[card.leaderSkillId];
		return `💟${Math.round(getHPScale(skill) * 100)}%`;
	}
	function sortByReduceScale(a,b)
	{
		const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
		return getReduceScale(a_s) - getReduceScale(b_s);
	}
	function ReduceScale_Addition(card)
	{
		const skill = Skills[card.leaderSkillId];
		return `🛡️${Math.round(getReduceScale(skill) * 100)}%`;
	}

	function voidsAbsorption_Addition(card)
	{
		const searchTypeArray = [173];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;
		if (sk[1] && sk[3])
		{
			return `双吸×${sk[0]}T`;
		}else
		{
			return `${['属','C','伤'][sk.slice(1).findIndex(Boolean)]}吸×${sk[0]}T`;
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
		for (const skill of skills)
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
		if (!skill) return;
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		for (const gen of gens)
		{
			fragment.appendChild(createOrbsList(gen.to));
			fragment.appendChild(document.createTextNode(`×${gen.count}`));
		}
		return fragment;
	}
	function lock_Addition(card)
	{
		const searchTypeArray = [152];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		fragment.appendChild(document.createTextNode(`锁`));
		fragment.appendChild(createOrbsList(flags(sk[0] || 1)));
		return fragment;
	}
	function dropLock_Addition(card)
	{
		const searchTypeArray = [205];
		const skill = getCardActiveSkill(card, searchTypeArray, 1);
		if (!skill) return;
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		fragment.appendChild(document.createTextNode(`掉锁`));
		fragment.appendChild(createOrbsList(flags(sk[0] != -1 ? sk[0] : 0b1111111111)));
		fragment.appendChild(document.createTextNode(`×${sk[1]}T`));
		return fragment;
	}
	function dropOrb_Addition(card)
	{
		const searchTypeArray = [126];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;

		const colors = flags(sk[0]);
		
		const fragment = document.createDocumentFragment();
		fragment.appendChild(createOrbsList(colors));
		fragment.appendChild(document.createTextNode(`↓${sk[3]}%×${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}T`));
		return fragment;
	}
	function generateColumnOrbs_Addition(card)
	{
		const searchTypeArray = [127];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
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
	function generateRowOrbs_Addition(card)
	{
		const searchTypeArray = [128];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
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
	function numericalATK_Addition(card)
	{
		const searchTypeArray = [0,1,2,35,37,42,58,59,84,85,86,87,110,115,143,144];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		//const sk = skill.params;

		const colors = [getCannonAttr(skill)];
		
		const fragment = document.createDocumentFragment();
		fragment.appendChild(document.createTextNode(`射`));
		fragment.appendChild(createOrbsList(colors));
		return fragment;
	}
	function memberATK_Addition(card)
	{
		const searchTypeArray = [230];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		const ul = fragment.appendChild(document.createElement("ul"));
		ul.className = "team-flags";
		for (let i = 0; i<6; i++) {
			const li = ul.appendChild(document.createElement("li"));
			li.className = "team-member-icon";
		}
		const targetTypes = ["self","leader-self","leader-helper","sub-members"];
		flags(sk[1]).forEach(n=>ul.classList.add(targetTypes[n]));
		let str = '';
		str +=`${sk[2] / 100}倍×${sk[0]}T`;
		fragment.appendChild(document.createTextNode(str));
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
			156,168,231, //宝石姬
			228, //属性、类型数量
		];
		const skills = getCardActiveSkills(card, searchTypeArray);
		return skills.map(atkBuffParse).find(s=>s.rate != 0) || atkBuffParse();
		function atkBuffParse(skill) {
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
				outObj.attrs = sk.slice(1, skill.type == 50 ? 2 : 3).filter(a=>a !== 5);
				if (!outObj.attrs.length)  //去除回复力
					return outObj;
				outObj.skilltype = 2;
				outObj.turns = sk[0];
				outObj.rate = sk[skill.type == 50 ? 2 : 3];
			}
			else if(skill.type == 156 && sk[4] == 2 //必须要是加攻击力
				|| skill.type == 168)
			{
				outObj.skilltype = 1;
				outObj.awoken = sk.slice(1, skill.type == 168 ? 7 : 4).filter(Boolean);
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
			else if(skill.type == 231 && sk[6] > 0)
			{
				outObj.skilltype = 1;
				outObj.awoken = sk.slice(1, 5).filter(Boolean).filter(flags);
				outObj.turns = sk[0];
				outObj.rate = sk[6];
			}
			return outObj;
		}

	}
	function rcvBuff_Rate(card)
	{
		const searchTypeArray = [
			50,90,
			228, 231, //宝石姬
		];
		const skills = getCardActiveSkills(card, searchTypeArray);
		return skills.map(rcvBuffParse).find(s=>s.rate != 0) || rcvBuffParse();
		function rcvBuffParse(skill) {
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
			if (skill.type == 228 && sk[4] > 0) {
				outObj.skilltype = 1;
				outObj.attrs = flags(sk[1]);
				outObj.types = flags(sk[2]);
				outObj.turns = sk[0];
				outObj.rate = sk[4];
			} else if (skill.type == 231 && sk[7] > 0) {
				outObj.skilltype = 1;
				outObj.awoken = sk.slice(1, 5).filter(Boolean).filter(flags);
				outObj.turns = sk[0];
				outObj.rate = sk[7];
			} else if (skill.type == 50 || skill.type == 90) {
				outObj.skilltype = sk.slice(1,sk.length>2?-1:undefined).includes(5) ? 2 : 0;
				outObj.turns = sk[0];
				outObj.rate = sk.length > 2 ? sk[sk.length-1] : 0;
			}
			return outObj;
		}
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
		{name:"No Filter",otLangName:{chs:"不做筛选",cht:"不做篩選"},function:cards=>cards},
		{group:true,name:"======Active Skill======",otLangName:{chs:"======主动技======",cht:"======主動技======"}, functions: [
		]},
		{group:true,name:"-----Voids Absorption-----",otLangName:{chs:"-----破吸类-----",cht:"-----破吸類-----"}, functions: [
			{name:"Voids attribute absorption(sort by turns)",otLangName:{chs:"破属吸 buff（按破吸回合排序）",cht:"破屬吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[1];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},
			/*{name:"Voids combo absorption(sort by turns)",otLangName:{chs:"破C吸 buff（按破吸回合排序）",cht:"破C吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[2];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},*/
			{name:"Voids damage absorption(sort by turns)",otLangName:{chs:"破伤吸 buff（按破吸回合排序）",cht:"破傷吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[3];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},
			{name:"Voids both absorption(sort by turns)",otLangName:{chs:"双破吸 buff（按破吸回合排序）",cht:"雙破吸 buff（按破吸回合排序）"},
				function:cards=>{
				const searchTypeArray = [173];
				return cards.filter(card=>{
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[1] && skill.params[3];
				}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
			},addition:voidsAbsorption_Addition},
			{name:"Pierce through damage void(sort by turns)",otLangName:{chs:"贯穿无效盾 buff（按破吸回合排序）",cht:"貫穿無效盾 buff（按破吸回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return document.createTextNode(`破贯×${sk[0]}T`);
				}
			},
		]},
		{group:true,name:"-----Recovers Bind Status-----",otLangName:{chs:"-----解封类-----",cht:"-----解封類-----"}, functions: [
			{
				name:"Unbind normal(sort by turns)",otLangName:{chs:"解封（按解封回合排序）",cht:"解封（按解封回合排序）"},
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
				name:"Unbind awoken(sort by turns)",otLangName:{chs:"解觉醒（按解觉回合排序）",cht:"解覺醒（按解覺回合排序）"},
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
				name:"Unbind both(sort by awoken turns)",otLangName:{chs:"解封+觉醒（按解觉醒回合排序）",cht:"解封+覺醒（按解覺醒回合排序）"},
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
				name:"Unbind unmatchable(sort by turns)",otLangName:{chs:"解禁消珠（按消除回合排序）",cht:"解禁消珠（按消除回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					const value = sk[0];
					return document.createTextNode(`${value == 9999 ? "全" : value + "T"}解禁消`);
				}
			},
			{name:"Bind self matchable",otLangName:{chs:"自封消珠",cht:"自封消珠"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [215];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [215];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`自封`));
					fragment.appendChild(createOrbsList(flags(sk[1] || 1)));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
					return fragment;
				}
			},
			{name:"Bind self active skill",otLangName:{chs:"自封技能",cht:"自封技能"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [214];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [214];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return document.createTextNode(`自封技${sk[0]}T`);
				}
			},
		]},
		{group:true,name:"----- Buff -----",otLangName:{chs:"----- buff 类-----",cht:"----- buff 類-----"}, functions: [
			{name:"Rate by state count(Jewel Princess)",otLangName:{chs:"以状态数量为倍率类技能（宝石姬）",cht:"以狀態數量爲倍率類技能（寶石姬）"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [156,168,228,231];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"RCV rate change",otLangName:{chs:"回复力 buff（顶回复）",cht:"回覆力 buff（頂回復）"},
				function:cards=>{
					return cards.filter(card=>{
						const atkbuff = rcvBuff_Rate(card);
						return atkbuff.skilltype > 0;
					}).sort((a,b)=>{
						let a_pC = rcvBuff_Rate(a), b_pC = rcvBuff_Rate(b);
						let sortNum = a_pC.skilltype - b_pC.skilltype;
						if (sortNum == 0)
							sortNum = a_pC.rate - b_pC.rate;
						if (sortNum == 0)
							sortNum = a_pC.turns - b_pC.turns;
						return sortNum;
					});
				},
				addition:card=>{
					const atkbuff = rcvBuff_Rate(card);
					const fragment = document.createDocumentFragment();
					fragment.appendChild(createOrbsList([5]));
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
			{name:"Team ATK rate change",otLangName:{chs:"全队攻击力 buff",cht:"全隊攻擊力 buff"},
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
			{name:"Move time change",otLangName:{chs:"操作时间 buff（顶手指）",cht:"操作時間 buff（頂手指）"},
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
					if (!skill) return;
					const sk = skill.params;
					let str = "👆";
					if (sk[1]) str += `${sk[1]>0?`+`:``}${sk[1]/10}S`;
					if (sk[2]) str += `x${sk[2]/100}`;
					str += `x${sk[0]}T`;
					return str;
				}
			},
			{name:"No Skyfall(sort by turns)",otLangName:{chs:"无天降 buff（按回合排序）",cht:"無天降 buff（按回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `无↓×${sk[0]}T`;
				}
			},
			{name:"Adds combo(sort by combo)",otLangName:{chs:"加C buff（按C数排列）",cht:"加C buff（按C數排列）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `+${sk[1]}C×${sk[0]}T`;
				}
			},
			{name:"Reduce Damage for all Attr(sort by rate)",otLangName:{chs:"全属减伤 buff（按减伤比率排序）",cht:"全屬減傷 buff（按減傷比率排序）"},
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
					if (!skill) return;
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
			{name:"Reduce 100% Damage(invincible, sort by turns)",otLangName:{chs:"全属减伤 100%（无敌）",cht:"全屬減傷 100%（無敵）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `无敌×${sk[0]}T`;
				}
			},
			{name:"Reduce all Damage for designated Attr(sort by turns)",otLangName:{chs:"限属减伤 buff（按回合排序排序）",cht:"限屬減傷 buff（按回合排序排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					
					const colors = [sk[1]];
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`-`));
					fragment.appendChild(createOrbsList(colors));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
		
					return fragment;
				}
			},
			{name:"Mass Attacks(sort by turns)",otLangName:{chs:"变为全体攻击（按回合数排序）",cht:"變爲全體攻擊（按回合數排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `全体×${sk[0]}T`;
				}
			},
		]},
		{group:true,name:"-----Orbs Drop-----",otLangName:{chs:"----- 珠子掉落 类-----",cht:"----- 珠子掉落 類-----"}, functions: [
			{name:"Drop locked orbs(any color, sort by turns)",otLangName:{chs:"掉锁（不限色，按回合排序）",cht:"掉鎖（不限色，按回合排序）"},
				function:cards=>{
					const searchTypeArray = [205];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:dropLock_Addition
			},
			{name:"Drop locked orbs(≥5 color, sort by turns)",otLangName:{chs:"掉锁5色+心或全部（按回合排序）",cht:"掉鎖5色+心或全部（按回合排序）"},
				function:cards=>{
					const searchTypeArray = [205];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && (skill.params[0] & 63) === 63;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:dropLock_Addition
			},
			{name:"Drop Enhanced Orbs(sort by turns)",otLangName:{chs:"掉落强化宝珠（按回合排序）",cht:"掉落強化寶珠（按回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `${sk[1]}%×${sk[0]}T`;
				}
			},
			{name:"Drop rate increases",otLangName:{chs:"掉落率提升",cht:"掉落率提升"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [126];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:dropOrb_Addition
			},
			{name:"Drop rate - Attr. - Jammers/Poison",otLangName:{chs:"掉落率提升-属性-毒、废（顶毒）",cht:"掉落率提升-屬性-毒、廢（頂毒）"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [126];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && (skill.params[0] & 960); // 960 = 二进制 1111000000
				}),
				addition:dropOrb_Addition
			},
			{name:"Drop rate - 99 turns",otLangName:{chs:"掉落率提升-持续99回合",cht:"掉落率提升-持續99回合"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [126];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[1] >= 99;
				}),
				addition:dropOrb_Addition
			},
			{name:"Drop rate - 100% rate",otLangName:{chs:"掉落率提升-100%几率",cht:"掉落率提升-100%幾率"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [126];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[3] == 100;
				}),
				addition:dropOrb_Addition
			},
			{name:"Drop Nail Orbs(sort by turns)",otLangName:{chs:"掉落钉珠（按回合排序）",cht:"掉落釘珠（按回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `📌${sk[1]}%×${sk[0]}T`;
				}
			},
		]},
		{group:true,name:"-----For Enemy-----",otLangName:{chs:"-----对敌 buff 类-----",cht:"-----對敵 buff 類-----"}, functions: [
			{name:"Menace(sort by turns)",otLangName:{chs:"威吓（按推迟回合排序）",cht:"威嚇（按推遲迴合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return document.createTextNode(`威吓×${sk[0]}T`);
				}
			},
			{name:"Reduces enemies' DEF(sort by rate)",otLangName:{chs:"破防（按防御减少比例排序）",cht:"破防（按防禦減少比例排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `破防${sk[1]}%`;
				}
			},
			{name:"Voids enemies' DEF(sort by turns)",otLangName:{chs:"100% 破防（按回合排序）",cht:"100% 破防（按回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
							return `全破×${sk[0]}T`;
				}
			},
			{name:"Poisons enemies(sort by rate)",otLangName:{chs:"中毒（按毒伤比率排序）",cht:"中毒（按毒傷比率排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `攻击力×${sk[0]/100}倍`;
				}
			},
			{name:"Change enemies's Attr(sort by attr)",otLangName:{chs:"改变敌人属性（按属性排序）",cht:"改變敵人屬性（按屬性排序）"},
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
			{name:"Counterattack buff(sort by rate)",otLangName:{chs:"受伤反击 buff（按倍率排序）",cht:"受傷反擊 buff（按倍率排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`${sk[1]/100}倍`));
					fragment.appendChild(createOrbsList(sk[2]));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
		
					return fragment;
				}
			},
		]},
		{group:true,name:"-----For player team-----",otLangName:{chs:"-----对自身队伍生效类-----",cht:"-----對自身隊伍生效類-----"}, functions: [
			{name:"↑Increase skills charge(sort by turns)",otLangName:{chs:"【溜】减少CD（按回合排序）",cht:"【溜】減少CD（按回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return document.createTextNode(`${sk[0]}${sk[0]!=sk[1]?`~${sk[1]}`:""}溜`);
				}
			},
			{name:"↓Reduce skills charge(sort by turns)",otLangName:{chs:"【坐】增加CD（按回合排序）",cht:"【坐】增加CD（按回合排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return document.createTextNode(`坐下${sk[0]}${sk[1] && sk[0]!=sk[1]?`~${sk[1]}`:""}`);
				}
			},
			{name:"Change Leader",otLangName:{chs:"更换队长",cht:"更換隊長"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [93, 227];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Increase Damage Cap",otLangName:{chs:"增加伤害上限 buff",cht:"增加傷害上限 buff"},
				function:cards=>{
					const searchTypeArray = [241];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 1));
				},
				addition:card=>{
					const searchTypeArray = [241];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `${sk[1].bigNumberToString()}×${sk[0]}T`;
				}
			},
			{name:"Member ATK rate change",otLangName:{chs:"队员攻击力 buff",cht:"隊員攻擊力 buff"},
				function:cards=>{
					const searchTypeArray = [230];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
				},
				addition:memberATK_Addition
			},
			{name:"Member ATK rate change - Self",otLangName:{chs:"队员攻击力 buff - 自身",cht:"隊員攻擊力 buff - 自身"},
				function:cards=>{
					const searchTypeArray = [230];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && Boolean(skill.params[1] & 1<<0);
					}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
				},
				addition:memberATK_Addition
			},
			{name:"Member ATK rate change - Leader",otLangName:{chs:"队员攻击力 buff - 队长",cht:"隊員攻擊力 buff - 隊長"},
				function:cards=>{
					const searchTypeArray = [230];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && Boolean(skill.params[1] & (1<<1 | 1<<2));
					}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
				},
				addition:memberATK_Addition
			},
			{name:"Member ATK rate change - Member",otLangName:{chs:"队员攻击力 buff - 队员",cht:"隊員攻擊力 buff - 隊員"},
				function:cards=>{
					const searchTypeArray = [230];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && Boolean(skill.params[1] & 1<<3);
					}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
				},
				addition:memberATK_Addition
			},
			{name:"Change self's Attr(sort by turns)",otLangName:{chs:"转换自身属性（按回合数排序）",cht:"轉換自身屬性（按回合數排序）"},
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
					if (!skill) return;
					const sk = skill.params;

					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`自→`));
					fragment.appendChild(createOrbsList(sk[1]));
					fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
		
					return fragment;
				}
			},
		]},
		{group:true,name:"-----Player's HP change-----",otLangName:{chs:"-----玩家HP操纵类-----",cht:"-----玩家HP操縱類-----"}, functions: [
			{name:"Heal after turn",otLangName:{chs:"回合结束回血 buff",cht:"回合結束回血 buff"},
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
					if (!skill) return;
					const sk = skill.params;
					return `回复${sk[1]?`${sk[1].bigNumberToString()}`:`${sk[2]}%`}×${sk[0]}T`;
				}
			},
			{name:"Heal immediately",otLangName:{chs:"玩家立刻回血",cht:"玩家立刻回血"},
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
			{name:"Damage self(sort by rate)",otLangName:{chs:"玩家自残（HP 减少，按减少比率排序）",cht:"玩家自殘（HP 減少，按減少比率排序）"},
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
		{group:true,name:"-----Damage Enemy - Gravity-----",otLangName:{chs:"-----对敌直接伤害类-重力-----",cht:"-----對敵直接傷害類-重力-----"}, functions: [
			{name:"Gravity - Current HP(sort by rate)",otLangName:{chs:"重力-敌人当前血量（按比例排序）",cht:"重力-敵人當前血量（按比例排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `当前${sk[0]}%`;
				}
			},
			{name:"Gravity - Max HP(sort by rate)",otLangName:{chs:"重力-敌人最大血量（按比例排序）",cht:"重力-敵人最大血量（按比例排序）"},
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
					if (!skill) return;
					const sk = skill.params;
					return `最大${sk[0]}%`;
				}
			},
		]},
		{group:true,name:"-----Damage Enemy - Fixed damage-----",otLangName:{chs:"-----对敌直接伤害类-无视防御固伤-----",cht:"-----對敵直接傷害類-無視防禦固傷-----"}, functions: [
			{name:"Fixed damage - Single(sort by damage)",otLangName:{chs:"无视防御固伤-单体（按总伤害排序）",cht:"無視防禦固傷-單體（按總傷害排序）"},
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
			{name:"Fixed damage - Mass(sort by damage)",otLangName:{chs:"无视防御固伤-全体（按伤害数排序）",cht:"無視防禦固傷-全體（按傷害數排序）"},
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
					if (!skill) return;
					const sk = skill.params;
		
					return `固伤${sk[0].bigNumberToString()}`;
				}
			},
		]},
		{group:true,name:"-----Damage Enemy - Numerical damage-----",otLangName:{chs:"-----对敌直接伤害类-大炮-----",cht:"-----對敵直接傷害類-大炮-----"}, functions: [
			{name:"Numerical ATK - Target - Single",otLangName:{chs:"大炮-对象-敌方单体",cht:"大炮-對象-敵方單體"},
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
				}),
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Target - Mass",otLangName:{chs:"大炮-对象-敌方全体",cht:"大炮-對象-敵方全體"},
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
				}),
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Target - Designate Attr",otLangName:{chs:"大炮-对象-指定属性敌人",cht:"大炮-對象-指定屬性敵人"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [42];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Numerical ATK - Attr - Actors self",otLangName:{chs:"大炮-属性-释放者自身",cht:"大炮-屬性-釋放者自身"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [2,35];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
	
			{name:"Numerical ATK - Damage - Rate by Actors self ATK(sort by rate)",otLangName:{chs:"大炮-伤害-自身攻击倍率（按倍率排序，范围取小）",cht:"大炮-傷害-自身攻擊倍率（按倍率排序，範圍取小）"},
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
				}),
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Damage - Fixed Attr Number (sort by number)",otLangName:{chs:"大炮-伤害-指定属性数值（按数值排序）",cht:"大炮-傷害-指定屬性數值（按數值排序）"},
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
				}),
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Damage - By remaining HP (sort by rate at HP 1)",otLangName:{chs:"大炮-伤害-根据剩余血量（按 1 HP 时倍率排序）",cht:"大炮-傷害-根據剩餘血量（按 1 HP 時倍率排序）"},
				function:cards=>{
					const searchTypeArray = [110];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,3));
				},
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Damage - Team total HP (sort by rate)",otLangName:{chs:"大炮-伤害-队伍总 HP（按倍率排序）",cht:"大炮-傷害-隊伍總 HP（按倍率排序）"},
				function:cards=>{
					const searchTypeArray = [143];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Damage - Team attrs ATK (sort by rate)",otLangName:{chs:"大炮-伤害-队伍某属性总攻击（按倍率排序）",cht:"大炮-傷害-隊伍某屬性總攻擊（按倍率排序）"},
				function:cards=>{
					const searchTypeArray = [144];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition: numericalATK_Addition
			},
			{name:"Numerical ATK - Special - Vampire",otLangName:{chs:"大炮-特殊-吸血",cht:"大炮-特殊-吸血"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [35,115];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
		]},
		{group:true,name:"-----Board States Change-----",otLangName:{chs:"-----改变板面状态类-----",cht:"-----改變板面狀態類-----"}, functions: [
			{name:"Replaces all Orbs",otLangName:{chs:"刷版",cht:"刷版"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [10];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Creates Roulette Orb",otLangName:{chs:"生成轮盘位（转转珠）",cht:"生成輪盤位（轉轉珠）"},
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
					if (!skill) return;
					const sk = skill.params;
					if (sk[7])
						return `${sk[7]}个×${sk[0]}T`;
					else
						return `特殊形状×${sk[0]}T`;
				}
			},
			{name:"Creates Cloud",otLangName:{chs:"生成云",cht:"生成雲"},
				function:cards=>{
					const searchTypeArray = [238];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [238];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `${sk[1]}个×${sk[0]}T`;
				}
			},
		]},
		{group:true,name:"-----Orbs States Change-----",otLangName:{chs:"-----改变宝珠状态类-----",cht:"-----改變寶珠狀態類-----"}, functions: [
			{name:"Unlock",otLangName:{chs:"解锁",cht:"解鎖"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [172];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Lock(Any color)",otLangName:{chs:"上锁（不限色）",cht:"上鎖（不限色）"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [152];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:lock_Addition
			},
			{name:"Lock(≥5 color)",otLangName:{chs:"上锁5色+心或全部",cht:"上鎖5色+心或全部"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [152];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill && (skill.params[0] & 63) === 63;
				}),
				addition:lock_Addition
			},
			{name:"Enhanced Orbs",otLangName:{chs:"强化宝珠",cht:"強化寶珠"},
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
				if (!skill) return;
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
		{group:true,name:"-----Change all Orbs-----",otLangName:{chs:"-----洗板类-----",cht:"-----洗板類-----"}, functions: [
			{name:"Changes all Orbs to any",otLangName:{chs:"洗版-任意色",cht:"洗版-任意色"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs to 1 color(Farm)",otLangName:{chs:"洗版-1色（花火）",cht:"洗版-1色（花火）"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).length == 1;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs to 2 color",otLangName:{chs:"洗版-2色",cht:"洗版-2色"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).length == 2;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs to 3 color",otLangName:{chs:"洗版-3色",cht:"洗版-3色"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).length == 3;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs to 4 color",otLangName:{chs:"洗版-4色",cht:"洗版-4色"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).length == 4;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs to 5 color",otLangName:{chs:"洗版-5色",cht:"洗版-5色"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).length == 5;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs to ≥6 color",otLangName:{chs:"洗版-6色以上",cht:"洗版-6色以上"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).length >= 6;
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Fire",otLangName:{chs:"洗版-含火",cht:"洗版-含火"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).includes(0);
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Water",otLangName:{chs:"洗版-含水",cht:"洗版-含水"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).includes(1);
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Wood",otLangName:{chs:"洗版-含木",cht:"洗版-含木"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).includes(2);
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Light",otLangName:{chs:"洗版-含光",cht:"洗版-含光"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).includes(3);
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Dark",otLangName:{chs:"洗版-含暗",cht:"洗版-含暗"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).includes(4);
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Heart",otLangName:{chs:"洗版-含心",cht:"洗版-含心"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return boardChange_ColorTypes(skill).includes(5);
				}),
				addition:boardChange_Addition
			},
			{name:"Changes all Orbs - include Jammers/Poison",otLangName:{chs:"洗版-含毒废",cht:"洗版-含毒廢"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [71];
					const skill = getCardActiveSkill(card, searchTypeArray);
					const colors = boardChange_ColorTypes(skill);
					return colors.includes(6)
						|| colors.includes(7)
						|| colors.includes(8)
						|| colors.includes(9);
				}),
				addition:boardChange_Addition
			},
		]},
		{group:true,name:"-----Orbs Change-----",otLangName:{chs:"-----指定色转珠类-----",cht:"-----指定色轉珠類-----"}, functions: [
			{name:"Orbs Change - to Fire",otLangName:{chs:"转珠-变为-火",cht:"轉珠-變爲-火"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(0));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Water",otLangName:{chs:"转珠-变为-水",cht:"轉珠-變爲-水"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(1));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Wood",otLangName:{chs:"转珠-变为-木",cht:"轉珠-變爲-木"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(2));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Light",otLangName:{chs:"转珠-变为-光",cht:"轉珠-變爲-光"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(3));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Dark",otLangName:{chs:"转珠-变为-暗",cht:"轉珠-變爲-暗"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(4));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Heal",otLangName:{chs:"转珠-变为-心",cht:"轉珠-變爲-心"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(5));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - to Jammers/Poison",otLangName:{chs:"转珠-变为-毒废",cht:"轉珠-變爲-毒廢"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.to.includes(6) || p.to.includes(7) || p.to.includes(8) || p.to.includes(9));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Fire",otLangName:{chs:"转珠-转走-火",cht:"轉珠-轉走-火"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(0));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Water",otLangName:{chs:"转珠-转走-水",cht:"轉珠-轉走-水"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(1));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Wood",otLangName:{chs:"转珠-转走-木",cht:"轉珠-轉走-木"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(2));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Light",otLangName:{chs:"转珠-转走-光",cht:"轉珠-轉走-光"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(3));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Dark",otLangName:{chs:"转珠-转走-暗",cht:"轉珠-轉走-暗"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(4));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Heart",otLangName:{chs:"转珠-转走-心",cht:"轉珠-轉走-心"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(5));
				}),
				addition:changeOrbs_Addition
			},
			{name:"Orbs Change - from Jammers/Poison",otLangName:{chs:"转珠-转走-毒废",cht:"轉珠-轉走-毒廢"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [9,20,154];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return false;
					let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
					return parsedSkills.some(p=>p.from.includes(6) || p.to.includes(7) || p.to.includes(8) || p.to.includes(9));
				}),
				addition:changeOrbs_Addition
			},
		]},
		{group:true,name:"-----Create Orbs-----",otLangName:{chs:"-----随机产珠类-----",cht:"-----隨機產珠類-----"}, functions: [
			{name:"Create 30 Orbs",otLangName:{chs:"固定30个产珠",cht:"固定30個產珠"},
				function:cards=>cards.filter(card=>{
					function is30(sk)
					{
						return Boolean(flags(sk[1]).length * sk[0] == 30);
					}
					const searchTypeArray = [141];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && is30(skill.params);
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create 15×2 Orbs",otLangName:{chs:"固定15×2产珠",cht:"固定15×2產珠"},
				function:cards=>cards.filter(card=>{
					function is1515(sk)
					{
						return Boolean(flags(sk[1]).length == 2 && sk[0] == 15);
					}
					const searchTypeArray = [141];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && is1515(skill.params);
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Fire Orbs",otLangName:{chs:"产珠-生成-火",cht:"產珠-生成-火"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(0));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Water Orbs",otLangName:{chs:"产珠-生成-水",cht:"產珠-生成-水"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(1));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Wood Orbs",otLangName:{chs:"产珠-生成-木",cht:"產珠-生成-木"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(2));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Light Orbs",otLangName:{chs:"产珠-生成-光",cht:"產珠-生成-光"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(3));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Dark Orbs",otLangName:{chs:"产珠-生成-暗",cht:"產珠-生成-暗"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(4));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Heart Orbs",otLangName:{chs:"产珠-生成-心",cht:"產珠-生成-心"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(5));
				}),
				addition:generateOrbs_Addition
			},
			{name:"Create Jammers/Poison Orbs",otLangName:{chs:"产珠-生成-毒废",cht:"產珠-生成-毒廢"},
				function:cards=>cards.filter(card=>{
					const gens = generateOrbsParse(card);
					return gens.some(gen=>gen.to.includes(6) || gen.to.includes(7) || gen.to.includes(8) || gen.to.includes(9));
				}),
				addition:generateOrbs_Addition
			},
		]},
		{group:true,name:"-----Create Fixed Position Orbs-----",otLangName:{chs:"-----固定位置产珠类-----",cht:"-----固定位置產珠類-----"}, functions: [
			{name:"Create designated shape",otLangName:{chs:"生成指定形状的",cht:"生成指定形狀的"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [176];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Create 3×3 block",otLangName:{chs:"生成3×3方块",cht:"生成3×3方塊"},
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
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`3×3`));
					fragment.appendChild(createOrbsList(sk[5]));
					return fragment;
				}
			},
			{name:"Create a vertical",otLangName:{chs:"产竖",cht:"產豎"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [127];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:generateColumnOrbs_Addition
			},
			{name:"Create a vertical Heart",otLangName:{chs:"产竖心",cht:"產豎心"},
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
				}),
				addition:generateColumnOrbs_Addition
			},
			{name:"Create a horizontal",otLangName:{chs:"产横",cht:"產橫"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [128];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:generateRowOrbs_Addition
			},
			{name:"Create ≥2 horizontals",otLangName:{chs:"2横或以上",cht:"2橫或以上"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [128];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && (skill.params.length>=3 || flags(skill.params[0]).length>=2);
				}),
				addition:generateRowOrbs_Addition
			},
			{name:"Create 2 color horizontals",otLangName:{chs:"2色横",cht:"2色橫"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [128];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && skill.params[3]>=0 && (skill.params[1] & skill.params[3]) != skill.params[1];
				}),
				addition:generateRowOrbs_Addition
			},
			{name:"Create horizontal not Top or Bottom",otLangName:{chs:"非顶底横",cht:"非頂底橫"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [128];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && ((skill.params[0] | skill.params[2]) & 14);
				}),
				addition:generateRowOrbs_Addition
			},
			{name:"Extensive horizontal(include Farm and outer edges)",otLangName:{chs:"泛产横（包含花火与四周一圈等）",cht:"泛產橫（包含花火與四周一圈等）"},
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
		{group:true,name:"-----Others Active Skills-----",otLangName:{chs:"-----其他主动技-----",cht:"-----其他主動技-----"}, functions: [
			{name:"1 CD",otLangName:{chs:"1 CD",cht:"1 CD"},
				function:cards=>cards.filter(card=>{
				if (card.activeSkillId == 0) return false;
				const skill = Skills[card.activeSkillId];
				return skill.initialCooldown - (skill.maxLevel - 1) <= 1;
				})
			},
			{name:"Less than 4 can be cycled use(Inaccurate)",otLangName:{chs:"除 1 CD 外，4 个以下能永动开（可能不精确）",cht:"除 1 CD 外，4 個以下能永動開（可能不精確）"},
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
			{name:"Time pause(sort by time)",otLangName:{chs:"时间暂停（按停止时间排序）",cht:"時間暫停（按停止時間排序）"},
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
			{
				name:"Random effect active",otLangName:{chs:"随机效果技能",cht:"隨機效果技能"},
				function:cards=>cards.filter(card=>Skills[card.activeSkillId].type == 118)
			},
			{
				name:"Evolved active",otLangName:{chs:"进化类技能",cht:"進化類技能"},
				function:cards=>cards.filter(card=>{
					let skType = Skills[card.activeSkillId].type;
					return skType == 232 || skType == 233;
				})
			},
			{name:"Enable require HP range",otLangName:{chs:"技能使用血线要求",cht:"技能使用血線要求"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [225];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [225];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					let strArr = [];
					if (sk[0]) strArr.push(`≥${sk[0]}%`);
					if (sk[1]) strArr.push(`≤${sk[1]}%`);
					return `HP ${strArr.join(" ")}`;
				}
			},
			{name:"Enable require Dungeon Stage",otLangName:{chs:"技能使用地下城层数要求",cht:"技能使用地下城層數要求"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [234];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [234];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					let strArr = [];
					if (sk[0]) strArr.push(`≥${sk[0]}`);
					if (sk[1]) strArr.push(`≤${sk[1]}`);
					return `层 ${strArr.join(" ")}`;
				}
			},
		]},
		
		{group:true,name:"======Leader Skills=====",otLangName:{chs:"======队长技======",cht:"======隊長技======"}, functions: [
		]},
		{group:true,name:"-----Matching Style-----",otLangName:{chs:"-----匹配模式-----",cht:"-----匹配模式-----"}, functions: [
			{name:"Multiple Att.",otLangName:{chs:"杂色",cht:"雜色"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.matchMode.multipleAttr)
			},
			{name:"Orb Matching",otLangName:{chs:"长串消除",cht:"長串消除"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.matchMode.rowMatch)
			},
			{name:"Combo Matching",otLangName:{chs:"连击",cht:"連擊"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.matchMode.combo)
			},
			{name:"Same Attribute Combo Matching",otLangName:{chs:"同色多串",cht:"同色多串"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.matchMode.sameColor)
			},
			{name:"L Shape Matching",otLangName:{chs:"L消除",cht:"L消除"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.matchMode.LShape)
			},
			{name:"Cross(十) of Heal Orbs",otLangName:{chs:"十字心",cht:"十字心"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [151,209];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Cross(十) of Color Orbs",otLangName:{chs:"N个十字",cht:"N個十字"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [157];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Less remain on the board",otLangName:{chs:"剩珠倍率",cht:"剩珠倍率"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [177];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
		]},
		{group:true,name:"-----Restriction/Bind-----",otLangName:{chs:"-----限制-----",cht:"-----限制-----"}, functions: [
			{name:"Attribute Enchantment",otLangName:{chs:"属性增强",cht:"屬性增强"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.restriction.attrEnhance)
			},
			{name:"Type Enchantment",otLangName:{chs:"类型增强",cht:"類型增强"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.restriction.typeEnhance)
			},
			{name:"[7×6 board]",otLangName:{chs:"【7×6 版面】",cht:"【7×6 版面】"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [162,186];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"[No skyfall]",otLangName:{chs:"【无天降版面】",cht:"【無天降版面】"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [163,177];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"HP Percentage Activation",otLangName:{chs:"HP 比例激活",cht:"HP 比例激活"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.restriction.HpRange)
			},
			{name:"Skill Use Activation",otLangName:{chs:"使用技能激活",cht:"使用技能激活"},
				function:cards=>cards.filter(card=>card.leaderSkillTypes.restriction.useSkill)
			},
			{name:"Unable to less match(sort by orbs need)",otLangName:{chs:"要求长串消除（按珠数排序）",cht:"要求長串消除（按珠數排序）"},
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
			{name:"Designate member ID",otLangName:{chs:"指定队伍队员编号",cht:"指定隊伍隊員編號"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [125];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Designate collab ID",otLangName:{chs:"指定队伍队员合作编号",cht:"指定隊伍隊員合作編號"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [175];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Designate Evo type",otLangName:{chs:"指定队伍队员进化类型",cht:"指定隊伍隊員進化類型"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [203];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Floating rate based on the number of attrs/types",otLangName:{chs:"根据属性/类型个数浮动倍率",cht:"根據屬性/類型個數浮動倍率"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [229];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
		]},
		{group:true,name:"-----Extra Effects-----",otLangName:{chs:"-----附加效果-----",cht:"-----附加效果-----"}, functions: [
			{name:"Fixed damage inflicts(sort by damage)",otLangName:{chs:"队长技固伤追击（按伤害排序）",cht:"隊長技固傷追擊（按傷害排序）"},
				function:cards=>{
					return cards.filter(card=>{
						return getSkillFixedDamage(card) > 0;
					}).sort((a,b)=>{
						let a_pC = getSkillFixedDamage(a),b_pC = getSkillFixedDamage(b);
						return a_pC - b_pC;
					});
				},
				addition:card=>{
					const value = getSkillFixedDamage(card);
					let nodeArr = [`${value.bigNumberToString()}固伤`];
					let skill;
					if (skill = getCardLeaderSkill(card, [235])) {
						nodeArr.push("/");
						nodeArr.push(createOrbsList(flags(skill.params[0])));
						nodeArr.push(`×${skill.params[2]}`);
					}
					return nodeArr.nodeJoin();
				}
			},
			{name:"Adds combo(sort by combo)",otLangName:{chs:"队长技+C（按+C数排序）",cht:"隊長技+C（按+C數排序）"},
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
					let nodeArr = [`+${value.bigNumberToString()}C`];
					let skill;
					if (skill = getCardLeaderSkill(card, [210])) {
						nodeArr.push("/十字");
					} else if (skill = getCardLeaderSkill(card, [235])) {
						nodeArr.push("/");
						nodeArr.push(createOrbsList(flags(skill.params[0])));
						nodeArr.push(`×${skill.params[2]}`);
					}
					return nodeArr.nodeJoin();
				}
			},
			{name:"Move time changes(sort by time)",otLangName:{chs:"队长技加/减秒（按秒数排序）",cht:"隊長技加/減秒（按秒數排序）"},
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
			{name:"Fixed move time(sort by time)",otLangName:{chs:"固定操作时间（按时间排序）",cht:"固定操作時間（按時間排序）"},
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
			{name:"Impart Awakenings",otLangName:{chs:"赋予觉醒",cht:"賦予覺醒"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [213];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [213];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					const sk = skill.params;
					let attrs = flags(sk[0]), types = flags(sk[1]), awakenings = sk.slice(2);
					const fragment = document.createDocumentFragment();
					if (attrs.length)
						fragment.appendChild(createOrbsList(attrs));
					if (types.length)
						fragment.appendChild(createTypesList(types));
					fragment.appendChild(document.createTextNode(`:+`));
					if (awakenings.length)
						fragment.appendChild(creatAwokenList(awakenings));
					return fragment;
				}
			},
			{name:"Bonus attack when matching Orbs(sort by rate)",otLangName:{chs:"消除宝珠时计算防御的追打（按追打比率排序）",cht:"消除寶珠時計算防禦的追打（按追打比率排序）"},
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
			{name:"Recovers HP when matching Orbs(sort by rate)",otLangName:{chs:"消除宝珠时回血（按回复比率排序）",cht:"消除寶珠時回血（按回複比率排序）"},
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
			{name:"Reduce damage when rcv(sort by rate)",otLangName:{chs:"回血加盾（以减伤比例排序）",cht:"回血加盾（以減傷比例排序）"},
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
			{name:"Recover Awkn Skill bind when rcv(sort by turns)",otLangName:{chs:"回血解觉（以解觉数排序）",cht:"回血解覺（以解覺數排序）"},
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
			{name:"Counterattack(sort by rate)",otLangName:{chs:"队长技受伤反击",cht:"隊長技受傷反擊"},
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
					if (sk[0] < 100) fragment.appendChild(document.createTextNode(`(${sk[0]}%)`));
					return fragment;
				}
			},
			{name:"Voids Poison dmg",otLangName:{chs:"毒无效",cht:"毒無效"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [197];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill;
				})
			},
			{name:"Resolve",otLangName:{chs:"根性",cht:"根性"},
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
			{name:"Increase item drop rate(sort by rate)",otLangName:{chs:"增加道具掉落率（按增加倍率排序）",cht:"增加道具掉落率（按增加倍率排序）"},
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
			{name:"Increase coin rate(sort by rate)",otLangName:{chs:"增加金币掉落倍数（按增加倍率排序）",cht:"增加金幣掉落倍數（按增加倍率排序）"},
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
			{name:"Increase Exp rate(sort by rate)",otLangName:{chs:"增加经验获取倍数（按增加倍率排序）",cht:"增加經驗獲取倍數（按增加倍率排序）"},
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
		{group:true,name:"-----HP Scale-----",otLangName:{chs:"-----血倍率-----",cht:"-----血倍率-----"}, functions: [
			{name:"HP Scale [3, ∞) (sort by rate)",otLangName:{chs:"队长血倍率[2, ∞)（按倍率排序）",cht:"隊長血倍率[2, ∞)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const HPscale = getHPScale(skill);
					return HPscale >= 3;
				}).sort(sortByHPScal),
				addition: HPScal_Addition
			},
			{name:"HP Scale [2, 3) (sort by rate)",otLangName:{chs:"队长血倍率[2, ∞)（按倍率排序）",cht:"隊長血倍率[2, ∞)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const HPscale = getHPScale(skill);
					return HPscale >= 2 && HPscale < 3;
				}).sort(sortByHPScal),
				addition: HPScal_Addition
			},
			{name:"HP Scale [1.5, 2) (sort by rate)",otLangName:{chs:"队长血倍率[1.5, 2)（按倍率排序）",cht:"隊長血倍率[1.5, 2)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const HPscale = getHPScale(skill);
					return HPscale >= 1.5 && HPscale < 2;
				}).sort(sortByHPScal),
				addition: HPScal_Addition
			},
			{name:"HP Scale (1, 1.5) (sort by rate)",otLangName:{chs:"队长血倍率(1, 1.5)（按倍率排序）",cht:"隊長血倍率(1, 1.5)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const HPscale = getHPScale(skill);
					return HPscale > 1 && HPscale < 1.5;
				}).sort(sortByHPScal),
				addition: HPScal_Addition
			},
			{name:"HP Scale == 1 (sort by rate)",otLangName:{chs:"队长血倍率 == 1",cht:"隊長血倍率 == 1"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const HPscale = getHPScale(skill);
					return HPscale === 1;
				}),
				addition: HPScal_Addition
			},
			{name:"HP Scale [0, 1) (sort by rate)",otLangName:{chs:"队长血倍率[0, 1)（按倍率排序）",cht:"隊長血倍率[0, 1)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const HPscale = getHPScale(skill);
					return HPscale < 1;
				}).sort(sortByHPScal),
				addition: HPScal_Addition
			},
		]},
		{group:true,name:"-----Reduce Shield-----",otLangName:{chs:"-----减伤盾-----",cht:"-----減傷盾-----"}, functions: [
			{name:"Reduce Damage [75%, 100%] (sort by rate)",otLangName:{chs:"队长盾减伤[75%, 100%]（按倍率排序）",cht:"隊長盾減傷[75%, 100%]（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const reduceScale = getReduceScale(skill);
					return reduceScale >= 0.75;
				}).sort(sortByReduceScale),
				addition: ReduceScale_Addition
			},
			{name:"Reduce Damage [50%, 75%) (sort by rate)",otLangName:{chs:"队长盾减伤[50%, 75%)（按倍率排序）",cht:"隊長盾減傷[50%, 75%)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const reduceScale = getReduceScale(skill);
					return reduceScale >= 0.5 && reduceScale < 0.75;
				}).sort(sortByReduceScale),
				addition: ReduceScale_Addition
			},
			{name:"Reduce Damage [25%, 50%) (sort by rate)",otLangName:{chs:"队长盾减伤[25%, 50%)（按倍率排序）",cht:"隊長盾減傷[25%, 50%)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const reduceScale = getReduceScale(skill);
					return reduceScale >= 0.25 && reduceScale < 0.5;
				}).sort(sortByReduceScale),
				addition: ReduceScale_Addition
			},
			{name:"Reduce Damage (0%, 25%) (sort by rate)",otLangName:{chs:"队长盾减伤(0%, 25%)（按倍率排序）",cht:"隊長盾減傷(0%, 25%)（按倍率排序）"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const reduceScale = getReduceScale(skill);
					return reduceScale > 0 && reduceScale < 0.25;
				}).sort(sortByReduceScale),
				addition: ReduceScale_Addition
			},
			{name:"Reduce Damage == 0",otLangName:{chs:"队长盾减伤 == 0",cht:"隊長盾減傷 == 0"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const reduceScale = getReduceScale(skill);
					return reduceScale === 0;
				})
			},
			{name:"Reduce Damage - Must all Att.",otLangName:{chs:"队长盾减伤-必须全属性减伤",cht:"隊長盾減傷-必須全屬性減傷"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					return getReduceScale(skill, true) > 0;
				})
			},
			{name:"Reduce Damage - Exclude HP-line",otLangName:{chs:"队长盾减伤-排除血线盾",cht:"隊長盾減傷-排除血線盾"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					return getReduceScale(skill, undefined, true) > 0;
				})
			},
			{name:"Reduce Damage - Exclude chance",otLangName:{chs:"队长盾减伤-排除几率盾",cht:"隊長盾減傷-排除幾率盾"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					return getReduceScale(skill, undefined, undefined, true) > 0;
				})
			},
			/*{name:"More than half with 99% gravity[29%, 100%)",otLangName:{chs:"满血99重力不下半血-队长盾减伤[29%, 100%)",cht:"滿血99重力不下半血-隊長盾減傷[29%, 100%)"},
				function:cards=>cards.filter(card=>{
					const skill = Skills[card.leaderSkillId];
					const reduceScale = getReduceScale(skill);
					return reduceScale>=0.29;
				}).sort(sortByReduceScale)
			},*/
			{name:"Reduce Damage - Unconditional",otLangName:{chs:"队长盾减伤-无条件盾",cht:"隊長盾減傷-無條件盾"},
				function:cards=>{
					return cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						return getReduceScale_unconditional(skill) > 0;
					}).sort((a,b)=>{
						const a_s = Skills[a.leaderSkillId], b_s = Skills[b.leaderSkillId];
						return getReduceScale_unconditional(a_s) - getReduceScale_unconditional(b_s);
					});
				},
				addition:card=>{
					const skill = Skills[card.leaderSkillId];
					return `无条件${Math.round(getReduceScale_unconditional(skill) * 100)}%`;
				}
			},
		]},
		{group:true,name:"======Evo type======",otLangName:{chs:"======进化类型======",cht:"======進化類型======"}, functions: [
			{name:"No Henshin",otLangName:{chs:"非变身",cht:"非變身"},
				function:cards=>cards.filter(card=>
					!Array.isArray(card.henshinFrom) &&
					!Array.isArray(card.henshinTo))
			},
			{name:"Before Henshin",otLangName:{chs:"变身前",cht:"變身前"},
				function:cards=>cards.filter(card=>Array.isArray(card.henshinTo))
			},
			{name:"After Henshin",otLangName:{chs:"变身后",cht:"變身後"},
				function:cards=>cards.filter(card=>Array.isArray(card.henshinFrom))
			},
			{name:"Except Before Henshin(No Henshin+After Henshin)",otLangName:{chs:"除了变身前（非变身+变身后）",cht:"除了變身前（非變身+變身后）"},
				function:cards=>cards.filter(card=>!Array.isArray(card.henshinTo))
			},
			{name:"Pixel Evo",otLangName:{chs:"像素进化",cht:"像素進化"},
				function:cards=>cards.filter(card=>card.evoMaterials.includes(3826))
			},
			//{name:"",otLangName:{chs:"非8格潜觉",cht:"非8格潛覺"},function:cards=>cards.filter(card=>!card.is8Latent)},
			{name:"Reincarnation/Super Re..",otLangName:{chs:"转生、超转生进化",cht:"轉生、超轉生進化"},
				function:cards=>cards.filter(card=>isReincarnated(card))
			}, //evoBaseId可能为0
			//{name:"",otLangName:{chs:"仅超转生进化",cht:"僅超轉生進化"},function:cards=>cards.filter(card=>isReincarnated(card) && !Cards[card.evoBaseId].isUltEvo)},
			{name:"Super Ult Evo",otLangName:{chs:"超究极进化",cht:"超究極進化"},
				function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].isUltEvo)
			},
			{name:"Evo from Weapon",otLangName:{chs:"由武器进化而来",cht:"由武器進化而來"},
				function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].awakenings.includes(49))
			},
		]},
		{group:true,name:"====== Awoken ======",otLangName:{chs:"======觉醒类======",cht:"======覺醒類======"}, functions: [
			{name:"8 latent grids",otLangName:{chs:"8格潜觉",cht:"8格潛覺"},
				function:cards=>cards.filter(card=>card.is8Latent)
			},
			{name:"Have 9 awokens",otLangName:{chs:"有9个觉醒",cht:"有9個覺醒"},
				function:cards=>cards.filter(card=>card.awakenings.length>=9)
			},
			{name:"Less than 9 awokens",otLangName:{chs:"不足9个觉醒",cht:"不足9個覺醒"},
				function:cards=>cards.filter(card=>card.awakenings.length<9)
			},
			{name:"Not weapon",otLangName:{chs:"不是武器",cht:"不是武器"},
				function:cards=>cards.filter(card=>!card.awakenings.includes(49))
			},
			{name:"3 same Killer Awoken(include super awoken), or 2 with same latent",otLangName:{chs:"3个相同杀觉醒（含超觉），或相同潜觉",cht:"3個相同殺覺醒（含超覺），或相同潛覺"},
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
			/*
			{name:"3 same Killer Awoken, or 2 with same latent",otLangName:{chs:"3个相同杀觉醒，或2个杀觉醒并可打相同潜觉",cht:"3個相同殺覺醒，或2個殺覺醒並可打相同潛覺"},
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
			{name:"4 same Killer Awoken(include super awoken), or 3 with same latent",otLangName:{chs:"4个相同杀觉醒（含超觉），或相同潜觉",cht:"4個相同殺覺醒（含超覺），或相同潛覺"},
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
			{name:"8P dedicated hostile skills",otLangName:{chs:"8P专用敌对技能",cht:"8P專用敵對技能"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [1000];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},*/
		]},
		{group:true,name:"======Others Search======",otLangName:{chs:"======其他搜索======",cht:"======其他搜索======"}, functions: [
			{name:"Water Att. & Attacker Type(Tanjiro)",otLangName:{chs:"攻击型或水属性（炭治郎队员）",cht:"攻擊型或水屬性（炭治郎隊員）"},
				function:cards=>cards.filter(card=>card.attrs.includes(1) || card.types.includes(6))
			},
			{name:"Fire & Water Att.(Seina)",otLangName:{chs:"火属性或水属性（火车队员）",cht:"火屬性或水屬性（火車隊員）"},
				function:cards=>cards.filter(card=>card.attrs.includes(0) || card.attrs.includes(1))
			},
			{name:"Level limit unable break",otLangName:{chs:"不能突破等级限制",cht:"不能突破等級限制"},
				function:cards=>cards.filter(card=>card.limitBreakIncr===0)
			},
			{name:"Able to lv110",otLangName:{chs:"能突破等级限制",cht:"能突破等級限制"},
				function:cards=>cards.filter(card=>card.limitBreakIncr > 0)
			},
			{name:"Able to lv110, but no Super Awoken",otLangName:{chs:"能突破等级限制但没有超觉醒",cht:"能突破等級限制但沒有超覺醒"},
				function:cards=>cards.filter(card=>card.limitBreakIncr > 0 && card.superAwakenings.length == 0)
			},
			{name:"Raise ≥50% at lv110(sort by scale)",otLangName:{chs:"110级三维成长≥50%（按比例排序）",cht:"110級三維成長≥50%（按比例排序）"},
				function:cards=>cards.filter(card=>card.limitBreakIncr>=50).sort((a,b)=>a.limitBreakIncr - b.limitBreakIncr),
				addition:card=>`成长${card.limitBreakIncr}%`
			},
			{name:"Max level is lv1",otLangName:{chs:"满级只有1级",cht:"滿級只有1級"},
				function:cards=>cards.filter(card=>card.maxLevel==1)
			},
			{name:"Less than 100mp",otLangName:{chs:"低于100mp",cht:"低於100mp"},
				function:cards=>cards.filter(card=>card.sellMP<100)
			},
			{name:"Have 3 types",otLangName:{chs:"有3个type",cht:"有3個type"},
				function:cards=>cards.filter(card=>card.types.filter(t=>t>=0).length>=3)
			},
			{name:"Have 2 Attrs",otLangName:{chs:"有两个属性",cht:"有兩個屬性"},
				function:cards=>cards.filter(card=>card.attrs.filter(a=>a>=0 && a<6))
			},
			{name:"2 attrs are different",otLangName:{chs:"主副属性不一致",cht:"主副屬性不一致"},
				function:cards=>cards.filter(card=>card.attrs[0]<6 && card.attrs[1]>=0 && card.attrs[0] != card.attrs[1])
			},
			{name:"Will get Orbs skin",otLangName:{chs:"能获得宝珠皮肤",cht:"能獲得寶珠皮膚"},
				function:cards=>cards.filter(card=>card.blockSkinId>0)
			},
			{name:"All Latent TAMADRA",otLangName:{chs:"所有潜觉蛋龙",cht:"所有潛覺蛋龍"},
				function:cards=>cards.filter(card=>card.latentAwakeningId>0).sort((a,b)=>a.latentAwakeningId-b.latentAwakeningId)
			},
			{name:"Original Name",otLangName:{chs:"怪物原始名称",cht:"怪物原始名稱"},
				function:cards=>cards,
				addition:card=>card.name
			},
			{name:"Feed EXP",otLangName:{chs:"合成经验值",cht:"合成經驗值"},
				function:cards=>cards.filter(card=>card.feedExp > 0).sort((a,b)=>a.feedExp * a.maxLevel - b.feedExp * b.maxLevel),
				addition:card=>`EXP ${Math.round(card.feedExp * card.maxLevel / 4).bigNumberToString()}`
			},
			{name:"Sell Price",otLangName:{chs:"售卖金钱",cht:"售賣金錢"},
				function:cards=>cards.filter(card=>card.sellPrice > 0).sort((a,b)=>a.sellPrice * a.maxLevel - b.sellPrice * b.maxLevel),
				addition:card=>`Coin ${Math.round(card.sellPrice * card.maxLevel / 10).bigNumberToString()}`
			},
		]},
	];
	return functions;
})();