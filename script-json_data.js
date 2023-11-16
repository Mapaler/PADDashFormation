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
	force_reload_data: `Force refresh data`,
	request_input: tp`Please Input ${'info'}`,
	status_message: {
		loading_check_version: "Checking the data version, please wait...",
		loading_mon_info: "Loading monster data, please wait...",
		loading_skill_info: "Loading skill data, please wait...",
		prepare_capture: "Preparing a screenshot, please wait...",
	},
	link_read_message: {
		success: tp`Find the ${'type'} format.`,
		need_user_script: `Because PADDB is cross-domain, you need to install helper script within the User Script Manager to support this feature.`,
		user_script_link: `Link to the helper script`,
		type: {
			"PADDF": "PADDF",
			"PDC": "PDC",
			"PADDB": "PADDB",
		},
		error: {
			0: "Unknown Error",
			1: "Unsupported format",
			2: "No formation data",
			3: "The illegal JSON format",
			4: "The illegal URL format",
		},
		paddb_success: `Sucess`,
		paddb_unauthorized: `Certification Faild (ID or password is incorrect)`,
	},
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
	skill_parse: {
		skill: {
			error: tp`😫An error occurred in skill parsing, please feedback the Card ID to the developer.`,
			unknown: tp`Unkonwn skill type: ${'type'}`,
			active_turns: tp`Within ${'turns'} turns, ${'skills'}`,
			delay_active_turns: tp`${`icon`}[Activated after ${'turns'} turns]:${'skills'}`,
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
			ctw: tp`${'icon'}Move orbs freely for ${'time'}${'addition'}`,
			ctw_addition: tp`, ${'cond'} is achieved, ${'skill'}`,
			gravity: tp`${'icon'}Reduce ${'target'} ${'value'}`,
			resolve: tp`${'icon'}Survive a single hit when ${'stats'}≧${'min'}`,
			board_change: tp`Change all orbs to ${'orbs'}`,
			skill_boost: tp`Team's skills charge ${'icon'}${'turns_min'}${'turns_max'}`,
			skill_boost_range: tp`~${'turns'}`,
			add_combo: tp`Adds ${'value'} combos${'icon'}`,
			fixed_time: tp`[${'icon'}Fixed orb move time: ${'value'}]`,
			min_match_length: tp`[Only able to erase ≥${'matchable'} orbs]`, //matchable, unmatchable
			drop_refresh: tp`${'icon'}Replaces all orbs`,
			drum: tp`Plus a drumming sound is made when Orbs are moved`,
			auto_path: tp`Shows ${'matchesNumber'} ${'icon'}combo path guidance`,
			counter_attack: tp`When attacked by an ${'target'}, ${'chance'}${'value'} ${'attr'} ${'icon'}counterattack`,	
			change_orbs: tp`Changes ${'from'} to ${'to'} orbs`,
			generate_orbs: tp`Creates ${'value'} ${'orbs'} orbs each at random ${'exclude'}`,
			fixed_orbs: tp`Changes the ${'position'} to ${'orbs'} orbs`,
			orb_drop_increase: tp`Increases the skyfall of ${'orbs'} to ${'prob'}`,
			orb_drop_increase_flag: tp`${'orbs'} skyfall ${'prob'} chance for ${'flag'}${'value'}`,
			orb_thorn: tp`, reduces ${'value'} per encounter`,
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
			power_up: tp`${'condition'}${'targets'}${'each_time'}${'value'}${'reduceDamage'}${'additional'}`,
			power_up_targets: tp`[${'attrs_types'}]'s `, //attrs, types, attrs_types
			henshin: tp`Transforms into ${'cards'}`,
			random_henshin: tp`Random transforms into ${'cards'}`,
			void_poison: tp`Voids ${'poison'} damage`,
			skill_proviso: tp`The follow-up effect can only be activates ${'condition'}`,
			impart_awoken: tp`Impart ${'attrs_types'} additional ${'awakenings'}`,
			obstruct_opponent: tp`Apply obstruct skill effect to ${'target'}: ${'skills'}`,
			obstruct_opponent_after_me: tp`The opponent ranked lower than me`,
			obstruct_opponent_before_me: tp`The opponent ranked higher than me`,
			obstruct_opponent_designated_position: tp`No.${'positions'} ranked opponents`,
			increase_damage_cap: tp`The ${'icon'}damage cap of ${'targets'} is increased to ${'cap'}`,
			board_jamming_state: tp`Creates ${'count'} ${'icon'}${'state'} ${'size'} at ${'position'}${'comment'}`,
			board_size_change: tp`Board size changed to ${'icon'}${'size'}`,
			remove_assist: tp`${'icon'}Remove this assist card (until end of dungeon)`,
			prediction_falling: tp`${'icon'}Prediction of falling on board`,
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
			scale_cross: tp`When matching cross of 5 ${'orbs'} ${'each_time'}${'stats'}`,
			scale_state_kind: tp`${'stats'} for each [${'awakenings'}${'attrs'}${'types'}] in team`,
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
			exact_length: tp`exactly of ${'value'} `,
			exact_match_length: tp`When matching ${'length'}${'value'}${'orbs'}, `,
			exact_match_enhanced: tp` orbs including enhanced`,

			compo_type_card: tp`When ${'ids'} are all on team, `,
			compo_type_series: tp`When all subs from ${'ids'} collab (Needs at least 1 sub), `,
			compo_type_evolution: tp`When all monsters in team are ${'ids'}, `,
			compo_type_team_total_rarity: tp`When the total ★ rarity of the team is ≤${'rarity'}, `,
			compo_type_team_same_rarity: tp`When the ★ rarity of the team is ${'rarity'}, `,

			stage_less_or_equal: tp`When ${'stage'} ≤ ${'max'}, `,
			stage_greater_or_equal: tp`When ${'stage'} ≥ ${'min'}, `,

			orbs_less_or_equal: tp`When ${'orbs'} ≤ ${'max'} on board, `,
			orbs_greater_or_equal: tp`When ${'orbs'} ≥ ${'min'} on board, `,

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
			collab_id: tp`card with collab ID of ${'id'} `,
			gacha_id: tp`card with gacha ID of ${'id'} `,
			enemy: tp`Enemy`,
			enemy_all: tp`all enemys`,
			enemy_one: tp`1 enemy`,
			enemy_attr: tp`${'attr'} enemy`,
			the_attr: tp`attr of the matched Orbs`,
		},
		stats: {
			unknown: tp`[ Unknown: ${'type'}]`, //type
			maxhp: tp`${'icon'}Max HP`,
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
			comment: tp`(${'content'}) `,
			comma: tp`, `,
			semicolon: tp`; `,
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
			each_time: tp`each time `,
			different: tp`different`,
			same: tp`the same`,
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
			thorn: tp`${'icon'}Thorn`,
			_5color: tp`${'icon'}5 Att.`,
			_6color: tp`${'_5color'}+${'orb_rcv'}`,
			all: tp`All`,
			any: tp`Any ${'cotent'}`,
		},
		board: {
			clouds: tp`${'icon'}Clouds`,
			immobility: tp`${'icon'}Immobility`,
			roulette: tp`${'icon'}Roulette`,
			deep_dark: tp`${'icon'}Deep Dark`,
			roulette_time: tp`transforms every ${'duration'}`,
			roulette_attrs: tp`only ${'orbs'} will appear`,
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
			[83]: tp`${'icon'}Add Dragon Type`,
			[84]: tp`${'icon'}Add God Type`,
			[85]: tp`${'icon'}Add Devil Type`,
			[86]: tp`${'icon'}Add Machine Type`,
			[87]: tp`${'icon'}Add Balanced Type`,
			[88]: tp`${'icon'}Add Attacker Type`,
			[89]: tp`${'icon'}Add Physical Type`,
			[90]: tp`${'icon'}Add Healer Type`,
			[91]: tp`${'icon'}Change Sub Attribute: Fire`,
			[92]: tp`${'icon'}Change Sub Attribute: Water`,
			[93]: tp`${'icon'}Change Sub Attribute: Wood`,
			[94]: tp`${'icon'}Change Sub Attribute: Water`,
			[95]: tp`${'icon'}Change Sub Attribute: Dark`,
			[96]: tp`${'icon'}Two-Pronged Attack+`,
			[97]: tp`${'icon'}Skill Charge+`,
			[98]: tp`${'icon'}Auto-Recover+`,
			[99]: tp`${'icon'}Enhanced Fire Orbs+`,
			[100]: tp`${'icon'}Enhanced Water Orbs+`,
			[101]: tp`${'icon'}Enhanced Wood Orbs+`,
			[102]: tp`${'icon'}Enhanced Water Orbs+`,
			[103]: tp`${'icon'}Enhanced Dark Orbs+`,
			[104]: tp`${'icon'}Enhanced Heal Orbs+`,
			[105]: tp`${'icon'}Skill Boost Minus`,
			[106]: tp`${'icon'}Floating`,
			[107]: tp`${'icon'}Enhanced Combos+`,
			[108]: tp`${'icon'}L Increased Attack+`,
			[109]: tp`${'icon'}Damage Void Piercer+`,
			[110]: tp`${'icon'}Cross Attack+`,
			[111]: tp`${'icon'}Super Enhanced Combos+`,
			[112]: tp`${'icon'}3 Att. Enhanced Attack+`,
			[113]: tp`${'icon'}4 Att. Enhanced Attack+`,
			[114]: tp`${'icon'}5 Att. Enhanced Attack+`,
			[115]: tp`${'icon'}Recover Bind+`,
			[116]: tp`${'icon'}Enhanced Fire Rows×3`,
			[117]: tp`${'icon'}Enhanced Water Rows×3`,
			[118]: tp`${'icon'}Enhanced Wood Rows×3`,
			[119]: tp`${'icon'}Enhanced Water Rows×3`,
			[120]: tp`${'icon'}Enhanced Dark Rows×3`,
			[121]: tp`${'icon'}Enhanced Fire Combos+`,
			[122]: tp`${'icon'}Enhanced Water Combos+`,
			[123]: tp`${'icon'}Enhanced Wood Combos+`,
			[124]: tp`${'icon'}Enhanced Light Combos+`,
			[125]: tp`${'icon'}Enhanced Dark Combos+`,
			[126]: tp`${'icon'}T Increased Attack`,
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
typekiller_for_type.forEach(t=>
	{
		t.allowableLatent = t.typeKiller.concat([0,12,14,15]) //补充4种特殊杀
		.map(tn=>
			typekiller_for_type.find(_t=>_t.type == tn).latent
		);
	}
);
const allowable_latent = {
	common: [ //一般能打的潜觉
		1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
		28,29,30,31,32,33,34,35,36,37,38
	],
	killer: [16,17,18,19,20,21,22,23,24,25,26,27], //杀潜觉
	v120: [42,43,44,45,49], //120才能打的潜觉
	needAwoken: [ //需要觉醒才能打的潜觉
		{latent:39,awoken:62}, //C珠破吸
		{latent:40,awoken:20}, //心横解转转
		{latent:41,awoken:27}, //U解禁消
		{latent:46,awoken:45}, //心追解云封
		{latent:47,awoken:59}, //心L大SB
		{latent:48,awoken:60}, //L解禁武器
	]
}
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
	{small:43,big:107,times:2},//7c
	{small:60,big:108,times:2},//L
	{small:48,big:109,times:2},//破无效
	{small:78,big:110,times:2},//十字
	{small:61,big:111,times:2},//10c
	{small:79,big:112,times:2},//3色
	{small:80,big:113,times:2},//4色
	{small:81,big:114,times:2},//5色
	{small:20,big:115,times:2},//心解
	{small:22,big:116,times:3},//火横
	{small:23,big:117,times:3},//水横
	{small:24,big:118,times:3},//木横
	{small:25,big:119,times:3},//光横
	{small:26,big:120,times:3},//暗横
	{small:73,big:121,times:2},//火串
	{small:74,big:122,times:2},//水串
	{small:75,big:123,times:2},//木串
	{small:76,big:124,times:2},//光串
	{small:77,big:125,times:2},//暗串
];

//官方的觉醒排列顺序
const official_awoken_sorting = [
	 21, 43, 61, 10, 54, 11, 12, 13, 49,
	 56,107,111, 52, 55, 68, 69, 70, 28,
	 19, 48, 27, 78, 60,126, 59, 45, 50,
	 53,109, 96,110,108, 79, 80, 81, 51,
	106, 57, 58, 82, 62,112,113,114, 97,
	 14, 15, 16, 17, 18, 29,  9, 20, 44,
	 99,100,101,102,103,104, 98,115, 71,
	 22, 23, 24, 25, 26, 46, 47, 30, 72,
	116,117,118,119,120,  1,  2,  3,127,
	  4,  5,  6,  7,  8, 32, 31, 33, 34,
	 73, 74, 75, 76, 77, 35, 36, 37, 38,
	121,122,123,124,125, 39, 40, 41, 42,
	 91, 92, 93, 94, 95, 65, 66, 67,105,
	 84, 83, 85, 86, 87, 88, 89, 90, 64,
	 63,
];
const PAD_PASS_BADGE = 1<<7 | 1; //本程序的月卡徽章编号，129

//pdc的徽章对应数字
const pdcBadgeMap = [
	{pdf:undefined,pdc:0}, //什么都没有
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
	{pdf:PAD_PASS_BADGE,pdc:14}, //月卡
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
	{pdf:42,pdc:41}, //伤害上限×2
	{pdf:43,pdc:42}, //HP++
	{pdf:44,pdc:43}, //攻击++
	{pdf:45,pdc:44}, //回复++
	{pdf:46,pdc:51}, //心追解云封
	{pdf:46,pdc:52}, //心追解云封 ×1.5
	{pdf:47,pdc:53}, //心L大SB
	{pdf:47,pdc:54}, //心L大SB ×1.5
	{pdf:48,pdc:55}, //L解禁武器
	{pdf:48,pdc:56}, //L解禁武器 ×1.8
	{pdf:49,pdc:57}, //伤害上限×3
];
//paddb的徽章对应数字
const paddbBadgeMap = [
	{pdf:undefined,paddb:0}, //什么都没有
	{pdf:1,paddb:1}, //无限cost
	{pdf:2,paddb:2}, //小手指
	{pdf:3,paddb:3}, //全体攻击
	{pdf:4,paddb:4}, //小回复
	{pdf:5,paddb:5}, //小血量
	{pdf:6,paddb:6}, //小攻击
	{pdf:7,paddb:7}, //SB
	{pdf:8,paddb:8}, //队长防封
	{pdf:9,paddb:9}, //SX
	{pdf:11,paddb:14}, //无天降
	{pdf:17,paddb:10}, //大回复
	{pdf:18,paddb:11}, //大血量
	{pdf:19,paddb:12}, //大攻击
	{pdf:20,paddb:null}, //三维
	{pdf:21,paddb:13}, //大手指
	{pdf:10,paddb:18}, //加经验
	{pdf:12,paddb:15}, //墨镜
	{pdf:13,paddb:16}, //防废
	{pdf:14,paddb:17}, //防毒
	{pdf:129,paddb:19}, //月卡
];
//paddb的潜觉对应数字
const paddbLatentMap = [
	{pdf:1,paddb:13}, //HP
	{pdf:2,paddb:14}, //攻击
	{pdf:3,paddb:15}, //回复
	{pdf:4,paddb:16}, //手指
	{pdf:5,paddb:17}, //自回
	{pdf:6,paddb:19}, //火盾
	{pdf:7,paddb:20}, //水盾
	{pdf:8,paddb:21}, //木盾
	{pdf:9,paddb:22}, //光盾
	{pdf:10,paddb:23}, //暗盾
	{pdf:11,paddb:18}, //防坐
	{pdf:12,paddb:27}, //三维
	{pdf:13,paddb:38}, //不被换队长
	{pdf:14,paddb:37}, //不掉废
	{pdf:15,paddb:36}, //不掉毒
	{pdf:16,paddb:12}, //进化杀
	{pdf:17,paddb:9}, //觉醒杀
	{pdf:18,paddb:10}, //强化杀
	{pdf:19,paddb:11}, //卖钱杀
	{pdf:20,paddb:2}, //神杀
	{pdf:21,paddb:1}, //龙杀
	{pdf:22,paddb:3}, //恶魔杀
	{pdf:23,paddb:4}, //机械杀
	{pdf:24,paddb:8}, //平衡杀
	{pdf:25,paddb:5}, //攻击杀
	{pdf:26,paddb:6}, //体力杀
	{pdf:27,paddb:7}, //回复杀
	{pdf:28,paddb:24}, //大HP
	{pdf:29,paddb:25}, //大攻击
	{pdf:30,paddb:26}, //大回复
	{pdf:31,paddb:33}, //大手指
	{pdf:32,paddb:28}, //大火盾
	{pdf:33,paddb:29}, //大水盾
	{pdf:34,paddb:30}, //大木盾
	{pdf:35,paddb:31}, //大光盾
	{pdf:36,paddb:32}, //大暗盾
	{pdf:37,paddb:35}, //6色破无效
	{pdf:38,paddb:34}, //3色破属吸
	{pdf:39,paddb:41}, //C珠破吸
	{pdf:40,paddb:40}, //心横解转转
	{pdf:41,paddb:39}, //U解禁消
	{pdf:42,paddb:42}, //伤害上限×2
	{pdf:43,paddb:43}, //HP++
	{pdf:44,paddb:44}, //攻击++
	{pdf:45,paddb:45}, //回复++
	{pdf:46,paddb:46}, //心追解云封
	{pdf:47,paddb:47}, //心L大SB
	{pdf:48,paddb:48}, //L解禁武器
	{pdf:49,paddb:49}, //伤害上限×3
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
		return getActuallySkills(Skills[card.leaderSkillId], skillTypes, searchRandom)?.[0];
	}
	//返回卡片的技能
	function getCardActiveSkill(card, skillTypes, searchRandom = true)
	{
		return getActuallySkills(Skills[card.activeSkillId], skillTypes, searchRandom)?.[0];
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
			case 245:
				scale = sk[3]/100;
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
	
	function sortByParams(a,b,searchTypeArray,...pidxs)
	{
		const a_s = getCardLeaderSkill(a, searchTypeArray) || getCardActiveSkill(a, searchTypeArray),
			  b_s = getCardLeaderSkill(b, searchTypeArray) || getCardActiveSkill(b, searchTypeArray);
		if (pidxs.length==0) pidxs.push(0);
		let newPos = 0;
		//按所有顺序依次比较大小，凡是有一次比出来就使用，否则继续比较下一个大小
		for (let pidx of pidxs) {
			newPos = a_s.params[pidx] - b_s.params[pidx];
			if (newPos !== 0) break;
		}
		return newPos;
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
		const fragment = document.createDocumentFragment();
		const icons = [
			sk[1] && 'attr-absorb',
			sk[2] && 'combo-absorb',
			sk[3] && 'damage-absorb'
		].filter(buff => typeof buff === 'string').map(buff=>createSkillIcon(buff))
		fragment.append(...icons);
		fragment.append(`×${sk[0]}T`);
		return fragment;
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
		
		const fragment = document.createDocumentFragment();
		if (turns.normal > 0)
		{
			fragment.append(createSkillIcon('unbind-normal'));
			if (turns.normal != turns.awoken)
				fragment.append(`-${turns.normal>=9999 ? '全' : `${turns.normal}T` }`);
		}
		if (turns.awoken > 0)
		{
			fragment.append(createSkillIcon('unbind-awakenings'));
			fragment.append(`-${turns.awoken>=9999 ? '全' : `${turns.awoken}T` }`);
		}
		return fragment;
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
		fragment.appendChild(createSkillIcon('orb-locked'));
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
		fragment.appendChild(createOrbsList(flags(sk[0] != -1 ? sk[0] : 0b1111111111), 'locked'));
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
		fragment.appendChild(createOrbsList(colors, 'drop'));
		fragment.appendChild(document.createTextNode(`${sk[3]}%×${sk[1]}${sk[1] != sk[2]?`~${sk[2]}`:""}T`));
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
		const typeArray_Rate = [0,2,35,37,58,59,84,85,115];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		//const sk = skill.params;

		const colors = [getCannonAttr(skill)];
		
		const fragment = document.createDocumentFragment();
		fragment.append(`射`);
		fragment.append(createOrbsList(colors));

		if (typeArray_Rate.includes(skill.type)) {
			function getNumber(skill){
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
			fragment.append(`×${(getNumber(skill)/100).bigNumberToString()}倍`);
			
		}
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
	function dixedDamage_Addition(card)
	{
		const searchTypeArray = [55, 188, 56];
		const skills = getCardActiveSkills(card, searchTypeArray, true);
		if (!skills.length) return;
		const skill = skills[0];
		const sk = skill.params;
		return `${skill.type==56?"全体":"单体"}${sk[0].bigNumberToString()}点${skills.length>1?`×${skills.length}`:''}`;
	}
	function gravity_Addition(card)
	{
		const searchTypeArray = [6, 161];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;
		return `${skill.type==6?"当前":"最大"}${sk[0]}%`;
	}
	
	function healImmediately_Rate(card)
	{
		const searchTypeArray = [7, //自身回复力
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

	function shapeThisRowOk(line, lineNumber) {
		if (lineNumber <= 0) return true;
		return line >= 0 && (line & lineNumber) === lineNumber && //含有这个形状
		(line & lineNumber.notNeighbour()) === 0; //形状四周都没有
	}
	function shapeUpsideDownRowOk(line, lineNumber) {
		if (lineNumber <= 0) return true;
		return line > 0 ? (line & lineNumber) === 0 : true;
	}
	function shapeIsCross(sk) { //产珠是十字
		const baseLineNum = 0b111;
		const lineNumArr = []; //同一行内所有的可能存在 既 0b111, 0b1110, 0b11100, 0b111000
		for (let _lineNum=baseLineNum; _lineNum<0b1000000; _lineNum<<=1){
			lineNumArr.push(_lineNum);
		}

		for (let ri=1; ri<4; ri++)
		{
			//搜索所有可能的行存在
			let maybeLineNum = lineNumArr.filter(lineNum=>shapeThisRowOk(sk[ri], lineNum));
			if (maybeLineNum.length < 1) continue;
			
			maybeLineNum = maybeLineNum.filter(lineNum=>{
				const lineNum2 = (lineNum << 1) & (lineNum >> 1);
				return shapeThisRowOk(sk[ri-1], lineNum2) &&
					   shapeThisRowOk(sk[ri+1], lineNum2) &&
					   shapeUpsideDownRowOk(sk[ri-2], lineNum2) &&
					   shapeUpsideDownRowOk(sk[ri+2], lineNum2);
			});
			if (maybeLineNum.length > 0) return true;
		}
		return false;
	}
	function shapeIsLShape(sk) { //产珠是L字
		const baseLineNum = 0b111;
		const lineNumArr = []; //同一行内所有的可能存在 既 0b111, 0b1110, 0b11100, 0b111000
		for (let _lineNum=baseLineNum; _lineNum<0b1000000; _lineNum<<=1){
			lineNumArr.push(_lineNum);
		}

		for (let ri=0; ri<5; ri++)
		{
			//搜索所有可能的行存在
			let maybeLineNum = lineNumArr.filter(lineNum=>shapeThisRowOk(sk[ri], lineNum));
			if (maybeLineNum.length < 1) continue;
			
			maybeLineNum = maybeLineNum.filter(lineNum=>{
				const lineNum2 = lineNum & ~(lineNum >> 1); //左边
				const lineNum3 = lineNum & ~(lineNum << 1); //右边

				return  shapeUpsideDownRowOk(sk[ri+1], lineNum) && ( //朝上
						shapeThisRowOk(sk[ri-1], lineNum2) &&
						shapeThisRowOk(sk[ri-2], lineNum2) &&
						shapeUpsideDownRowOk(sk[ri-3], lineNum2) ||
						shapeThisRowOk(sk[ri-1], lineNum3) &&
						shapeThisRowOk(sk[ri-2], lineNum3) &&
						shapeUpsideDownRowOk(sk[ri-3], lineNum3)) 
						||
						shapeUpsideDownRowOk(sk[ri-1], lineNum) && ( //朝下
						shapeThisRowOk(sk[ri+1], lineNum2) &&
						shapeThisRowOk(sk[ri+2], lineNum2) &&
						shapeUpsideDownRowOk(sk[ri+3], lineNum2) ||
						shapeThisRowOk(sk[ri+1], lineNum3) &&
						shapeThisRowOk(sk[ri+2], lineNum3) &&
						shapeUpsideDownRowOk(sk[ri+3], lineNum3));
			});
			if (maybeLineNum.length > 0) return true;
		}
		return false;
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
	function createOrbsList(orbs, className)
	{
		if (orbs == undefined) orbs = [0];
		else if (!Array.isArray(orbs)) orbs = [orbs];
		const ul = document.createElement("ul");
		ul.className = "board";
		orbs.forEach(orbType => {
			const li = ul.appendChild(document.createElement("li"));
			li.className = className ? `orb ${className}` :`orb`;
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
				},
				addition:voidsAbsorption_Addition
			},
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
				},
				addition:voidsAbsorption_Addition
			},
			{name:"Voids both absorption(sort by turns)",otLangName:{chs:"双破吸 buff（按破吸回合排序）",cht:"雙破吸 buff（按破吸回合排序）"},
				function:cards=>{
					const searchTypeArray = [173];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && skill.params[1] && skill.params[3];
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:voidsAbsorption_Addition
			},
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('damage-void'));
					fragment.append(`×${sk[0]}T`);
					return fragment;
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('unbind-matches'));
					fragment.append(`-${sk[0]>=9999 ? '全' : `${sk[0]}T` }`);
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('skill-boost', 'boost-incr'), sk[0]);
					if (sk[1] !== undefined && sk[0]!=sk[1]) fragment.append(`~${sk[1]}`);
					return fragment;
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('skill-boost', 'boost-decr'), sk[0]);
					if (sk[1] !== undefined && sk[0]!=sk[1]) fragment.append(`~${sk[1]}`);
					return fragment;
				}
			},
			{name:"Change Leader",otLangName:{chs:"更换队长",cht:"更換隊長"},
				function:cards=>{
					const searchTypeArray = [93, 227];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray),
							  b_s = getCardActiveSkill(b, searchTypeArray);
						return a_s.type - b_s.type;
					});
				},
				addition:card=>{
					const searchTypeArray = [93, 227];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('leader-change'));
					fragment.append(skill.type == 93 ? '换自身' : '换最后');
					return fragment;
				}
			},
			{name:"Increase Damage Cap",otLangName:{chs:"增加伤害上限 buff",cht:"增加傷害上限 buff"},
				function:cards=>{
					function getIncreaseDamageCap(skill)
					{
						let cap = 0;
						switch (skill.type) {
							case 241:
								cap = skill.params[1];
								break;
							case 246:
								cap = skill.params[2];
								break;
							case 247:
								cap = skill.params[3];
								break;
						}
						return cap;
					}
					const searchTypeArray = [241, 246, 247];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
						let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
						return a_pC - b_pC;
					});
				},
				addition:card=>{
					const searchTypeArray = [241, 246, 247];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					let cap;
					switch (skill.type) {
						case 241:
							cap = sk[1];
							break;
						case 246:
							cap = sk[2];
							break;
						case 247:
							cap = sk[3];
							break;
					}
					if (skill.type == 241) {
						return `${(cap*1e8).bigNumberToString()}×${sk[0]}T`;
					} else {
						return `${(cap*1e8).bigNumberToString()} in ${sk[0]}S`;
					}
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
			{name:"Bind self active skill",otLangName:{chs:"自封技能 debuff",cht:"自封技能 debuff"},
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
			{name:"Remove assist",otLangName:{chs:"移除武器",cht:"移除武器"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [250];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('auto-heal'));
					fragment.append(`${sk[1]? sk[1].bigNumberToString() :`${sk[2]}%`}×${sk[0]}T`);
					return fragment;
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('heal', 'hp-incr'));
					if (heal.scale)
						fragment.append(`${heal.scale}%`);
					if (heal.const)
						fragment.append(`${heal.const.bigNumberToString()}点`);
					if (heal.selfRcv)
						fragment.append(`${heal.selfRcv/100}倍回复力`, );
					if (heal.vampire)
						fragment.append(`${heal.vampire}%伤害`);
					return fragment;
				}
			},
			{name:"Change team maximum HP",otLangName:{chs:"队伍最大 HP 变化",cht:"队伍最大 HP 變化"},
				function:cards=>{
					const searchTypeArray = [237];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
					const searchTypeArray = [237];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('maxhp-locked'), `${sk[1].bigNumberToString()}%×${sk[0]}T`);
					return fragment;
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
			{name:"Bind self matchable",otLangName:{chs:"自封消珠 debuff",cht:"自封消珠 debuff"},
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
		]},
		{group:true,name:"----- Buff -----",otLangName:{chs:"----- buff 类-----",cht:"----- buff 類-----"}, functions: [
			{name:"Seamless Buff (Round ≥CD)",otLangName:{chs:"无缝 Buff (回合≥CD)",cht:"無縫 Buff (回合≥CD)"},
				function:cards=>cards.filter(card=>{
					function isLoopBuff(parsedSkill, cd) {
						return parsedSkill.some(skill=>skill.kind == SkillKinds.ActiveTurns
							&& skill.turns >= cd);
					}
					//跳过0号技能的、会变身成别人的和无技能数据的
					if (card.activeSkillId == 0 || card.henshinTo?.length>0) return false;
					const skill = Skills[card.activeSkillId];
					if (!skill) return false;

					let cd = skill.initialCooldown - (skill.maxLevel - 1); //技能最短CD
					//解析技能，如果是一般的技能，直接搜索有没有就可以了
					let parsedActiveSkill = skillParser(card.activeSkillId);
					if (isLoopBuff(parsedActiveSkill, cd)) return true;
					//对于其他的多组类技能，则需要进一步判断，但是这类技能一般只需要看第一个就行
					let parsedGroupSkill = parsedActiveSkill?.[0];
					if (parsedGroupSkill.kind == SkillKinds.RandomSkills) { //随机类技能,CD固定,需要每个技能都符合
						return parsedGroupSkill.skills.every(parsedSubSkill=>isLoopBuff(parsedSubSkill, cd));
					}
					//进化类技能，排除循环进化，并只计算最后一级
					if (parsedGroupSkill.kind == SkillKinds.EvolvedSkills && !parsedGroupSkill.loop) {
						let lastIdx = parsedGroupSkill.params.length - 1;
						let subSkill = Skills[parsedGroupSkill.params[lastIdx]];
						let subCd = subSkill.initialCooldown - (subSkill.maxLevel - 1); //技能最短CD
						let parsedSubSkill = parsedGroupSkill.skills[lastIdx];
						if (isLoopBuff(parsedSubSkill, subCd)) return true;
					}
					return false;
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
			{name:"Rate by state count(Jewel Princess)",otLangName:{chs:"以状态数量为倍率类技能（宝石姬）",cht:"以狀態數量爲倍率類技能（寶石姬）"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [156,168,228,231];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
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
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1,0));
				},
				addition:card=>{
					const searchTypeArray = [19];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `破防${sk[1]}%×${sk[0]}T`;
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
		{group:true,name:"-----Board States Change-----",otLangName:{chs:"-----改变板面状态类-----",cht:"-----改變板面狀態類-----"}, functions: [
			{name:"Replaces all Orbs",otLangName:{chs:"刷版",cht:"刷版"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [10];
				const skill = getCardActiveSkill(card, searchTypeArray);
				return skill;
				})
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
			{name:"Creates Roulette Orb",otLangName:{chs:"生成轮盘位 buff（转转）",cht:"生成輪盤位 buff（轉轉）"},
				function:cards=>{
					const searchTypeArray = [207, 249];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_s = getCardActiveSkill(a, searchTypeArray),
							  b_s = getCardActiveSkill(b, searchTypeArray);
						return (a_s.type - b_s.type) || !a_s.params[7] - !b_s.params[7] || a_s.params[0] - b_s.params[0];
					});
				},
				addition:card=>{
					const searchTypeArray = [207, 249];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('board-roulette'));
					if (skill.type == 249) {
						fragment.append(createOrbsList(flags(sk[1])));
					}
					fragment.append(`${sk[7]? sk[7] : '固定'+sk.slice(2,7).flatMap(flags).length }`,`×${sk[0]}T`);
					return fragment;
				}
			},
			{name:"Creates Cloud",otLangName:{chs:"生成云 debuff",cht:"生成雲 debuff"},
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
					return `${sk[1] * sk[2]}个×${sk[0]}T`;
				}
			},
			{name:"Creates Cloud",otLangName:{chs:"生成封条 debuff",cht:"生成封条 debuff"},
				function:cards=>{
					const searchTypeArray = [239];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [239];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const colums = flags(sk[1]), rows = flags(sk[2]);
					const fragment = document.createDocumentFragment();
					if (colums.length)
						fragment.append(`${colums.length}竖`);
					if (rows.length)
						fragment.append(`${rows.length}横`);
					fragment.append(`×${sk[0]}T`);
					return fragment;
				}
			},
			{name:"Creates Deep Dark Orb",otLangName:{chs:"生成超暗闇 debuff",cht:"生成超暗闇 debuff"},
				function:cards=>{
					const searchTypeArray = [251];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [251];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `${sk[1] == sk[2] ? sk[1] : sk[1] +"~"+ sk[2]}个×${sk[0]}T`;
				}
			},
			{name:"Change Board Size",otLangName:{chs:"改变板面大小 buff",cht:"改變板面大小 buff"},
				function:cards=>{
					const searchTypeArray = [244];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
				},
				addition:card=>{
					const searchTypeArray = [244];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;

					let width, height;
					switch (sk[1]) {
						case 1: {
							width = 7;
							height = 6;
							break;
						}
						case 2: {
							width = 5;
							height = 3;
							break;
						}
						case 3: {
							width = 6;
							height = 5;
							break;
						}
						default: {
							width = 6;
							height = 5;
						}
					}
					return `[${width}×${height}]×${sk[0]}T`;
				}
			},
		]},
		{group:true,name:"-----Orbs Drop-----",otLangName:{chs:"----- 珠子掉落 类-----",cht:"----- 珠子掉落 類-----"}, functions: [
			{name:"Drop Enhanced Orbs(sort by turns)",otLangName:{chs:"掉落强化宝珠（按回合排序）buff",cht:"掉落強化寶珠（按回合排序）buff"},
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
			{name:"Drop rate increases",otLangName:{chs:"掉落率提升 buff",cht:"掉落率提升 buff"},
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
			{name:"Drop Nail Orbs(sort by turns)",otLangName:{chs:"掉落钉珠（按回合排序）buff",cht:"掉落釘珠（按回合排序）buff"},
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
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('orb-nail'), `${sk[1]}%×${sk[0]}T`);
					return fragment;
				}
			},
			{name:"Drop Thorn Orbs(sort by turns)",otLangName:{chs:"掉落荆棘（按回合排序）debuff",cht:"掉落荊棘（按回合排序）debuff"},
				function:cards=>{
					const searchTypeArray = [243];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [243];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('orb-thorn'));
					if ((sk[1] & 0b1111111111) != 1023) {
						let attrs = flags(sk[1]);
						fragment.append(createOrbsList(attrs));
					}
					fragment.append(`${sk[3]}%×${sk[0]}T`, document.createElement("br"), "/" ,createSkillIcon('maxhp-locked'), `${sk[2]}%`);
					return fragment;
				}
			},
			{name:"Prediction of falling",otLangName:{chs:"预测掉落 buff",cht:"預測掉落 buff"},
				function:cards=>{
					const searchTypeArray = [253];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [253];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.append(createSkillIcon('prediction-falling'));
					fragment.append(`×${sk[0]}T`);
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
				}),
				addition:card=>{
					const searchTypeArray = [176];
					const skills = getCardActiveSkills(card, searchTypeArray);
					if (!skills.length) return;
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`形状`));
					skills.forEach(skill=>fragment.appendChild(createOrbsList(skill.params[5])));
					return fragment;
				}
			},
			{name:"Create outer edges",otLangName:{chs:"生成四周一圈",cht:"生成四周一圈"},
				function:cards=>cards.filter(card=>{
					function isOuterEdges(sk)
					{
						const baseLineNum1 = 0b111111;
						const baseLineNum2 = 0b100001;
						return  shapeThisRowOk(sk[0], baseLineNum1) &&
								shapeThisRowOk(sk[1], baseLineNum2) && //第2行含有这个形状
								shapeThisRowOk(sk[2], baseLineNum2) && //第2行含有这个形状
								shapeThisRowOk(sk[3], baseLineNum2) && //第2行含有这个形状
								shapeThisRowOk(sk[4], baseLineNum1);
					}
					const searchTypeArray = [176];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && isOuterEdges(skill.params);
				}),
				addition:card=>{
					const searchTypeArray = [176];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`外圈`));
					fragment.appendChild(createOrbsList(sk[5]));
					return fragment;
				}
			},
			{name:"Create 3×3 block",otLangName:{chs:"生成3×3方块",cht:"生成3×3方塊"},
				function:cards=>cards.filter(card=>{
					function is3x3(sk)
					{
						const baseLineNum = 0b111;
						const lineNumArr = []; //同一行内所有的可能存在 既 0b111, 0b1110, 0b11100, 0b111000
						for (let _lineNum=baseLineNum; _lineNum<0b1000000; _lineNum<<=1)
						{
							lineNumArr.push(_lineNum);
						}

						for (let ri=0; ri<3; ri++)
						{
							//搜索所有可能的行存在
							let maybeLineNum = lineNumArr.filter(lineNum=>shapeThisRowOk(sk[ri], lineNum));
							if (maybeLineNum.length < 1) continue;
							
							maybeLineNum = maybeLineNum.filter(lineNum=>
								shapeUpsideDownRowOk(sk[ri-1], lineNum) && //如果上一行存在，并且无交集(and为0)
								shapeUpsideDownRowOk(sk[ri+3], lineNum) && //如果第四行存在，并且无交集(and为0)
								shapeThisRowOk(sk[ri+1], lineNum) && //第2行含有这个形状
								shapeThisRowOk(sk[ri+2], lineNum)    //第3行含有这个形状
							);
							if (maybeLineNum.length > 0) return true;
						}
						return false;
					}
					const searchTypeArray = [176];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && is3x3(skill.params.slice(0,5));
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
			{name:"Create cross",otLangName:{chs:"生成十字",cht:"生成十字"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [176];
					const skills = getCardActiveSkills(card, searchTypeArray);
					return skills.filter(skill=>shapeIsCross(skill.params.slice(0,5))).length;
				}),
				addition:function(card){
					const searchTypeArray = [176];
					const skills = getCardActiveSkills(card, searchTypeArray).filter(skill=>shapeIsCross(skill.params.slice(0,5)));
					if (!skills.length) return;
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`十字`));
					skills.forEach(skill=>fragment.appendChild(createOrbsList(skill.params[5])));
					return fragment;
				},
			},
			{name:"Create L shape",otLangName:{chs:"生成L字",cht:"生成L字"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [176];
					const skills = getCardActiveSkills(card, searchTypeArray);
					return skills.filter(skill=>shapeIsLShape(skill.params.slice(0,5))).length;
				}),
				addition:function(card){
					const searchTypeArray = [176];
					const skills = getCardActiveSkills(card, searchTypeArray).filter(skill=>shapeIsLShape(skill.params.slice(0,5)));
					if (!skills.length) return;
					const fragment = document.createDocumentFragment();
					fragment.appendChild(document.createTextNode(`L字`));
					skills.forEach(skill=>fragment.appendChild(createOrbsList(skill.params[5])));
					return fragment;
				},
			},
			{name:"Create verticals",otLangName:{chs:"产竖",cht:"產豎"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [127];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:generateColumnOrbs_Addition
			},
			{name:"Create vertical Heart",otLangName:{chs:"产竖心",cht:"產豎心"},
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
			{name:"Create horizontals",otLangName:{chs:"产横",cht:"產橫"},
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
						if (skill.type === 128) {//普通横
							return true;
						}
						else if (skill.type === 71) {//花火
							return sk.slice(0,sk.includes(-1)?sk.indexOf(-1):undefined).length === 1
						}
						else if (skill.type === 176) {//特殊形状
							return sk.some(n=>(n & 0b111111) === 0b111111)
						}
						return false;
					}
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill && isRow(skill);
				})
			},
		]},
		{group:true,name:"-----Damage Enemy - Gravity-----",otLangName:{chs:"-----对敌直接伤害类-重力-----",cht:"-----對敵直接傷害類-重力-----"}, functions: [
			{name:"Gravity - Any(sort by rate)",otLangName:{chs:"重力-任意（按比例排序）",cht:"重力-任意（按比例排序）"},
				function:cards=>{
					const searchTypeArray = [6, 161];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition: gravity_Addition
			},
			{name:"Gravity - Current HP(sort by rate)",otLangName:{chs:"重力-敌人当前血量（按比例排序）",cht:"重力-敵人當前血量（按比例排序）"},
				function:cards=>{
					const searchTypeArray = [6];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition: gravity_Addition
			},
			{name:"Gravity - Max HP(sort by rate)",otLangName:{chs:"重力-敌人最大血量（按比例排序）",cht:"重力-敵人最大血量（按比例排序）"},
				function:cards=>{
					const searchTypeArray = [161];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition: gravity_Addition
			},
		]},
		{group:true,name:"-----Damage Enemy - Fixed damage-----",otLangName:{chs:"-----对敌直接伤害类-无视防御固伤-----",cht:"-----對敵直接傷害類-無視防禦固傷-----"}, functions: [
			{name:"Fixed damage - Any(sort by damage)",otLangName:{chs:"无视防御固伤-任意（按总伤害排序）",cht:"無視防禦固傷-任意（按總傷害排序）"},
				function:cards=>{
					const searchTypeArray = [55,188,56];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>{
						const a_ss = getCardActiveSkills(a, searchTypeArray), b_ss = getCardActiveSkills(b, searchTypeArray);
						let a_pC = a_ss.reduce((p,v)=>p+v.params[0],0), b_pC = b_ss.reduce((p,v)=>p+v.params[0],0);
						return a_pC - b_pC;
					});
				},
				addition:dixedDamage_Addition
			},
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
				addition:dixedDamage_Addition
			},
			{name:"Fixed damage - Mass(sort by damage)",otLangName:{chs:"无视防御固伤-全体（按伤害数排序）",cht:"無視防禦固傷-全體（按傷害數排序）"},
				function:cards=>{
					const searchTypeArray = [56];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:dixedDamage_Addition
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
		{group:true,name:"-----Others Active Skills-----",otLangName:{chs:"-----其他主动技-----",cht:"-----其他主動技-----"}, functions: [
			{name:"1 CD",otLangName:{chs:"1 CD",cht:"1 CD"},
				function:cards=>cards.filter(card=>{
					if (card.activeSkillId == 0) return false;
					const skill = Skills[card.activeSkillId];
					return skill.initialCooldown - (skill.maxLevel - 1) <= 1;
				})
			},
			{name:"Less than 4 card can be loop use(Inaccurate)",otLangName:{chs:"除 1 CD 外，4 个队员以下能循环开（可能不精确）",cht:"除 1 CD 外，4 個隊員以下能循環開（可能不精確）"},
				function:cards=>cards.filter(card=>{
					if (card.activeSkillId == 0) return false;
					const skill = Skills[card.activeSkillId];
					const minCD = skill.initialCooldown - (skill.maxLevel - 1); //主动技最小的CD
					let realCD = minCD;
		
					const searchTypeArray = [14];
					const subSkill = getCardActiveSkill(card, searchTypeArray);
					if (subSkill)
					{
						realCD -= subSkill.params[0] * 3;
					}
					return minCD > 1 && realCD <= 4;
				})
			},
			{name:"Time pause(sort by time)",otLangName:{chs:"时间暂停（按停止时间排序）",cht:"時間暫停（按停止時間排序）"},
				function:cards=>{
					const searchTypeArray = [5, 246, 247];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
				},
				addition:card=>{
					const searchTypeArray = [5, 246, 247];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const value = skill.params[0];
					return `时停${value}s`;
				}
			},
			{
				name:"Random effect active",otLangName:{chs:"随机效果技能",cht:"隨機效果技能"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [118];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{
				name:"Evolved active",otLangName:{chs:"进化类技能",cht:"進化類技能"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [232, 233];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [232, 233];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const value = skill.params[0];
					return `${skill.type == 232 ? "单向进化" : "🔁循环变化"}`;
				}
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
			{name:"Delay active after skill use",otLangName:{chs:"技能使用后延迟生效",cht:"技能使用后延迟生效"},
				function:cards=>{
					const searchTypeArray = [248];
					return cards.filter(card=>{
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray))
				},
				addition:card=>{
					const searchTypeArray = [248];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `延迟${sk[0]}T`;
				}
			},
			{name:"Enable require number of Orbs",otLangName:{chs:"技能使用珠子数量要求",cht:"技能使用珠子数量要求"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [255];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [255];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const fragment = document.createDocumentFragment();
					fragment.append(createOrbsList(flags(sk[0])), sk[2] ? `≤${sk[2]}` : `≥${sk[1]}`);
					return fragment;
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
			{name:"5 Orbs including enhanced Matching",otLangName:{chs:"5珠含强化消除",cht:"5珠含強化消除"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [150];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Cross(十) of Heal Orbs",otLangName:{chs:"十字心",cht:"十字心"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [151,209];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Stacked Magnifications of Cross(十)",otLangName:{chs:"十字叠加倍率",cht:"十字疊加倍率"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [157];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Stacked Magnifications of Matching",otLangName:{chs:"指定长度消除叠加倍率",cht:"指定長度消除疊加倍率"},
				function:cards=>{
					const searchTypeArray = [235];
					return cards.filter(card=>{
						const skill = getCardLeaderSkill(card, searchTypeArray);
						if (!skill) return false;
						const sk = skill.params;
						if (!sk[3] || sk[3] === 100) return false;
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray,2));
				},
				addition:card=>{
					const searchTypeArray = [235];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					if (!sk[3] || sk[3] === 100) return;
					const fragment = document.createDocumentFragment();
					const sup = document.createElement("sup");
					sup.textContent = "N";
					const orbs = createOrbsList(flags(sk[0]));
					fragment.append(`ATK×${sk[3]/100}`,sup,"/",orbs);
					if (sk[1]) {
						fragment.append(`×≥${sk[1]}`);
					} else {
						fragment.append(`×${sk[2]}`);
					}
					return fragment;
				}
			},
			{name:"Less remain on the board",otLangName:{chs:"剩珠倍率",cht:"剩珠倍率"},
				function:cards=>cards.filter(card=>{
				const searchTypeArray = [177];
				const skill = getCardLeaderSkill(card, searchTypeArray);
				return skill?.params[5];
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
			{name:"[7×6 board]",otLangName:{chs:"【7×6 板面】",cht:"【7×6 板面】"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [162,186];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"[No skyfall]",otLangName:{chs:"【无天降板面】",cht:"【無天降板面】"},
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
				}),
				addition:card=>{
					const searchTypeArray = [125];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					
					return `队员:${sk.slice(0,5).filter(Boolean).join('\n')}`;
				}
			},
			{name:"Designate collab ID",otLangName:{chs:"指定队伍队员合作编号",cht:"指定隊伍隊員合作編號"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [175];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [175];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `合作:${sk[0]}`;
				}
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
				}),
				addition:card=>{
					const searchTypeArray = [229];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					const attrs = flags(sk[0]), types = flags(sk[1]);
					const fragment = document.createDocumentFragment();
					if (attrs.length)
						fragment.appendChild(createOrbsList(attrs));
					if (types.length)
						fragment.appendChild(createTypesList(types));
					return fragment;
				}
			},
			{name:"Limit the total rarity of the team",otLangName:{chs:"限制队伍总稀有度",cht:"限制隊伍總稀有度"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [217];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [217];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `★≤${sk[0]}`;
				}
			},
			{name:"Team's rarity required different",otLangName:{chs:"要求队员稀有度相同/各不相同",cht:"要求隊員稀有度相同/各不相同"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [245];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [245];
					const skill = getCardLeaderSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					switch (sk[0]) {
						case -1:
							return `★各不相同`;
						case -2:
							return `★全部相同`;
						default:
							return `★全为${sk[0]}`;
					}
				}
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
					if (value <= 0 ) return;
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
					if (value <= 0 ) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
					const value = skill.params[0];
					return `HP≥${value}%`;
				}
			},
			{name:"Prediction of falling (LS)",otLangName:{chs:"预测掉落 队长技",cht:"預測掉落 队长技"},
				function:cards=>{
					const searchTypeArray = [254];
					return cards.filter(card=>{
						const skill = getCardLeaderSkill(card, searchTypeArray);
						return skill;
					}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
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
					if (!skill) return;
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
					if (!skill) return;
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
					if (!skill) return;
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
					const scale = getReduceScale_unconditional(skill)
					return scale > 0 && `无条件${Math.round(getReduceScale_unconditional(skill) * 100)}%`;
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
			{name:"Random Henshin",otLangName:{chs:"随机变身",cht:"隨機變身"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [236];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Except Before Henshin(No Henshin+After Henshin)",otLangName:{chs:"除了变身前（非变身+变身后）",cht:"除了變身前（非變身+變身后）"},
				function:cards=>cards.filter(card=>!Array.isArray(card.henshinTo))
			},
			{name:"Pixel Evo",otLangName:{chs:"像素进化",cht:"像素進化"},
				function:cards=>cards.filter(card=>card.evoMaterials.includes(3826))
			},
			//{name:"",otLangName:{chs:"非8格潜觉",cht:"非8格潛覺"},function:cards=>cards.filter(card=>!card.is8Latent)},
			{name:"Reincarnation/Super Re..",otLangName:{chs:"转生、超转生进化",cht:"轉生、超轉生進化"},
				function:cards=>cards.filter(isReincarnated)
			}, //evoBaseId可能为0
			//{name:"",otLangName:{chs:"仅超转生进化",cht:"僅超轉生進化"},function:cards=>cards.filter(card=>isReincarnated(card) && !Cards[card.evoBaseId].isUltEvo)},
			{name:"Super Ult Evo",otLangName:{chs:"超究极进化",cht:"超究極進化"},
				function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].isUltEvo)
			},
			{name:"Evo from Weapon",otLangName:{chs:"由武器进化而来",cht:"由武器進化而來"},
				function:cards=>cards.filter(card=>card.isUltEvo && Cards[card.evoBaseId].awakenings.includes(49))
			},
			{name:"Ordeal Evo",otLangName:{chs:"试练进化",cht:"試練進化"},
				function:cards=>cards.filter(card=>card.evoMaterials[0] === 0xFFFF),
				addition:card=>card.evoMaterials[0] === 0xFFFF && `地下城ID:${card.evoMaterials[1]}`
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
								typekiller_for_type.find(t=>t.type==type).allowableLatent //得到允许打的潜觉杀
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
			// {name:"8P dedicated hostile skills",otLangName:{chs:"8P专用敌对技能",cht:"8P專用敵對技能"},
			// 	function:cards=>cards.filter(card=>{
			// 		const searchTypeArray = [1000];
			// 		const skill = getCardActiveSkill(card, searchTypeArray);
			// 		return skill;
			// 	})
			// },
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
			{name:"Tradable(Less than 100MP)",otLangName:{chs:"可交易(低于100MP)",cht:"可交易(低於100MP)"},
				function:cards=>cards.filter(card=>card.sellMP<100)
			},
			{name:"Have 3 types",otLangName:{chs:"有3个type",cht:"有3個type"},
				function:cards=>cards.filter(card=>card.types.filter(t=>t>=0).length>=3)
			},
			{name:"Have 2 Attrs",otLangName:{chs:"有两个属性",cht:"有兩個屬性"},
				function:cards=>cards.filter(card=>card.attrs.filter(a=>a>=0 && a<6))
			},
			{name:"2 attrs are different",otLangName:{chs:"主副属性不一致",cht:"主副屬性不一致"},
				function:cards=>cards.filter(({attrs:[attr1, attr2]})=>attr1<6 && attr2>=0 && attr1 != attr2)
			},
			{name:"Will get Orbs skin",otLangName:{chs:"能获得宝珠皮肤",cht:"能獲得寶珠皮膚"},
				function:cards=>cards.filter(({blockSkinOrBgmId})=>blockSkinOrBgmId>0 && blockSkinOrBgmId<1e4),
				addition:({blockSkinOrBgmId})=>`ID.${blockSkinOrBgmId}`
			},
			{name:"Will get BGM",otLangName:{chs:"能获得背景音乐",cht:"能獲得背景音樂"},
				function:cards=>cards.filter(({blockSkinOrBgmId})=>blockSkinOrBgmId>=1e4),
				addition:({blockSkinOrBgmId})=>`ID.${blockSkinOrBgmId}`
			},
			{name:"Hava banner when use skill",otLangName:{chs:"使用技能时有横幅",cht:"使用技能時有橫幅"},
				function:cards=>cards.filter(card=>card.skillBanner)
			},
			{name:"All Latent TAMADRA",otLangName:{chs:"所有潜觉蛋龙",cht:"所有潛覺蛋龍"},
				function:cards=>cards.filter(card=>card.latentAwakeningId>0).sort((a,b)=>a.latentAwakeningId-b.latentAwakeningId)
			},
			{name:"Stacked material",otLangName:{chs:"堆叠的素材",cht:"堆疊的素材"},
				function:cards=>cards.filter(card=>card.stacking),
			},
			{name:"Not stacked material",otLangName:{chs:"不堆叠的素材",cht:"不堆疊的素材"},
				function:cards=>cards.filter(card=>!card.stacking && card.types.some(t=>[0,12,14,15].includes(t))),
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
			{name:"Sell Monster Point(MP)",otLangName:{chs:"售卖怪物点数(MP)",cht:"售賣怪物點數(MP)"},
				function:cards=>cards,
				addition:card=>`MP ${card.sellMP.bigNumberToString()}`
			},
			{name:"Card Types",otLangName:{chs:"角色类型",cht:"角色類型"},
				function:cards=>cards,
				addition:card=>createTypesList(card.types)
			},
			{name:"Card Cost",otLangName:{chs:"角色消耗",cht:"角色消耗"},
				function:cards=>cards,
				addition:card=>`COST ${card.cost}`
			},
		]},
	];
	return functions;
})();