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
	has_sub_filter: "📁",
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
	active_skill_title: "Skill",
	evolved_skill_title: "Evoveld Skill",
	leader_skill_title: "Leader Skill",
	link_read_message: {
		success: tp`Find the ${'type'} format.`,
		need_user_script: `Because PADDB is cross-domain, you need to install helper script within the User Script Manager to support this feature.`,
		user_script_link: `Link to the helper script`,
		type: {
			"PADDF": "PADDF",
			"PDC": "PDC",
			"PADDB": "PADDB",
			"DADDB": "DADDB",
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
			bind_card: tp`${'icon'}Bind the card itself`,
			defense_break: tp`${'icon'}Reduce enemy defense by ${'value'}`,
			poison: tp`${'icon'}Poisons ${'target'}, reduce ${'stats'} with ${'belong_to'} ${'value'} per turns`,
			time_extend: tp`${'icon'}Orb move time ${'value'}`,
			follow_attack: tp`${'icon'}Bonus attack equal to ${'belong_to'} ${'value'} when matching Orbs (Consider the ${'target'}'s defense)`,
			follow_attack_fixed: tp`inflicts ${'damage'} ${'attr'} damage`,
			auto_heal_buff: tp`${'icon'}Heal ${'value'} ${'stats'} every turn`,
			auto_heal: tp`${'icon'}Heal ${'stats'} by ${'belong_to'} ${'value'} after matching orbs`,
			ctw: tp`${'icon'}Move orbs freely for ${'time'}${'addition'}`,
			ctw_addition: tp`, ${'cond'} is achieved, ${'skill'}`,
			gravity: tp`Reduce ${'target'} ${'icon'}${'value'}`,
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
			set_orb_state_combo_drop: tp`Add ${'value'} ${'icon'}combo drop on ${'orbs'}`,
			set_orb_state_nail: tp`Add ${'value'} ${'icon'}nail on ${'orbs'}`,
			rate_multiply: tp`${'rate'} ${'value'} when entering as leader`,
			rate_multiply_drop: tp`${'icon'}Drop rate`,
			rate_multiply_coin: tp`${'icon'}Coins`,
			rate_multiply_exp: tp`${'icon'}Rank EXP`,
			rate_multiply_plus_point: tp`${'icon'}Plus Point`,
			rate_multiply_part_break: tp`${'icon'}Part Break Drop rate`,
			reduce_damage: tp`${'condition'}${'chance'}${'icon'}Reduces ${'attrs'} damage taken by ${'value'}`,
			power_up: tp`${'condition'}${'targets'}${'each_time'}${'value'}${'reduceDamage'}${'additional'}`,
			power_up_targets: tp`[${'attrs_types'}]'s `, //attrs, types, attrs_types
			henshin: tp`Changes to ${'cards'}`,
			random_henshin: tp`Random changes to ${'cards'}`,
			void_poison: tp`Voids ${'poison'} damage`,
			skill_proviso: tp`The follow-up effect can only be activates ${'condition'}`,
			impart_awoken: tp`Impart ${'attrs_types'} additional ${'awakenings'}`,
			obstruct_opponent: tp`Apply obstruct skill effect to ${'target'}: ${'skills'}`,
			obstruct_opponent_after_me: tp`The opponent ranked lower than me`,
			obstruct_opponent_before_me: tp`The opponent ranked higher than me`,
			obstruct_opponent_designated_position: tp`No.${'positions'} ranked opponents`,
			slot_power_up: tp`The slot of [${'targets'}]'s ${'icon'}${'value'}`,
			increase_damage_cap: tp`The ${'icon'}damage cap of ${'targets'} is change to ${'cap'}`,
			board_jamming_state: tp`Creates ${'count'} ${'icon'}${'state'} ${'size'} at ${'position'}${'comment'}`,
			board_size_change: tp`Board size changed to ${'icon'}${'size'}`,
			remove_assist: tp`${'icon'}Remove this assist card (until end of dungeon)`,
			prediction_falling: tp`${'icon'}Prediction of falling on board`,
			play_voice: tp`Play voice of the phase ${'stage'} of active skill ${'icon'}`,
			times_limit: tp`[Number of times skill can be used: ${'turns'}]`,
			fixed_starting_position: tp`${'icon'}Fixed starting position`,
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
			use_skill: tp`When skills used ${'times'}`,
			use_skill_times: tp`${'times'} times `,
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
			awakening_activated: tp`When [${'awakenings'}] activated `,
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
			self: tp`card self`,
			team: tp`team`,
			team_last: tp`the lastest member`,
			team_leader: tp`leader`,
			sub_members: tp`sub-members`,
			leader_self: tp`left leader`,
			leader_helper: tp`right leader`,
			left_neighbor: tp`left neighbor`,
			right_neighbor: tp`left neighbor`,
			collab_id: tp`Cards with Collaboration ID of ${'id'} `,
			gacha_id: tp`Cards with Egg Machine ID of ${'id'} `,
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
			shield: tp`shield`,
			atk: tp`ATK`,
			rcv: tp`RCV`,
			teamhp: tp`Team HP`,
			teamatk: tp`Team ${'attrs'} ATK`,
			teamrcv: tp`Team RCV`,
			cstage: tp`current Stage of Dungeon`,
			broken_parts: tp`number of Broken Parts`,
			state_is: tp`${'icon'}${'state'}: ${'num'}`,
		},
		unit: {
			orbs: tp``,
			times: tp`times`,
			seconds: tp`seconds`,
			point: tp`point`,
			turns: tp`turns`,
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
			affix_awakening: tp`${'cotent'} awakenings`,
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
			[46]: tp`${'icon'}Enhanced Team HP`,
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
			[59]: tp`${'icon'}[L] Heal Matching`,
			[60]: tp`${'icon'}[L] Increased Attack`,
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
			[105]: tp`${'icon'}Anti-Skill Boost`,
			[106]: tp`${'icon'}Levitation`,
			[107]: tp`${'icon'}Enhanced Combos+`,
			[108]: tp`${'icon'}[L] Increased Attack+`,
			[109]: tp`${'icon'}Damage Void Piercer+`,
			[110]: tp`${'icon'}Cross Attack+`,
			[111]: tp`${'icon'}Super Enhanced Combos+`,
			[112]: tp`${'icon'}3 Att. Enhanced Attack+`,
			[113]: tp`${'icon'}4 Att. Enhanced Attack+`,
			[114]: tp`${'icon'}5 Att. Enhanced Attack+`,
			[115]: tp`${'icon'}Recover Bind+`,
			[116]: tp`${'icon'}Triple Enhanced Fire Rows`,
			[117]: tp`${'icon'}Triple Enhanced Water Rows`,
			[118]: tp`${'icon'}Triple Enhanced Wood Rows`,
			[119]: tp`${'icon'}Triple Enhanced Water Rows`,
			[120]: tp`${'icon'}Triple Enhanced Dark Rows`,
			[121]: tp`${'icon'}Enhanced Fire Combos+`,
			[122]: tp`${'icon'}Enhanced Water Combos+`,
			[123]: tp`${'icon'}Enhanced Wood Combos+`,
			[124]: tp`${'icon'}Enhanced Light Combos+`,
			[125]: tp`${'icon'}Enhanced Dark Combos+`,
			[126]: tp`${'icon'}[T] Increased Attack`,
			[127]: tp`${'icon'}Enhanced Stats`,
			[128]: tp`${'icon'}Yang Protection`,
			[129]: tp`${'icon'}Yin Protection`,
			[130]: tp`${'icon'}Aging`,
			[131]: tp`${'icon'}Part Break`,
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
	v120: [42,43,44,45,49], //120才能打的潜觉，3倍上限潜觉需要特殊处理
	needAwoken: [ //需要觉醒才能打的潜觉
		{latent:39,awoken:62}, //C珠破吸
		{latent:40,awoken:20}, //心横解转转
		{latent:41,awoken:27}, //U解禁消
		{latent:46,awoken:45}, //心追解云封
		{latent:47,awoken:59}, //心L大SB
		{latent:48,awoken:60}, //L解禁武器
	],
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

const PAD_PASS_BADGE = 1<<7 | 1; //本程序的月卡徽章编号，129
//官方的徽章排列顺序
const official_badge_sorting = [ //20是没有启用的全属性徽章，现在也不在游戏内显示了
	  1, PAD_PASS_BADGE, 22, 23,  2,  3,  4,  5,  6,
	  7,  8,  9, 11, 17, 18, 19, 21,
	 10, 12, 13, 14, 41, 42, 43, 44,
	 45, 46, 47, 48, 24, 25, 26, 53, 27,
	 28, 29, 30, 31, 15, 16, 32, 33,
	 34, 35, 36, 37, 38, 62, 39, 40, 49,
	 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61,
	
]
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
	 84, 83, 85, 86, 87, 88, 89, 90, 63,
	128,129,130, 64,131,
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
			case 271: //激活觉醒触发
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
	function directParseSkills(skillDataArr) {
		return skillDataArr.flatMap(skill=>skillObjectParsers?.[skill.type]?.apply({ parser: skillParser }, skill.params))
	}
	function voidsAbsorption_Turns(card) {
		const outObj = {
			"attr-absorb": 0,
			"combo-absorb": 0,
			"damage-absorb": 0,
			"damage-void": 0,
		};
		const searchTypeArray = [
			173,
			191
		];
		const skills = getCardActiveSkills(card, searchTypeArray);
		skills.reduce((pre,skill)=>{
			if (skill.type === 173) {
				if(skill.params[1]) pre["attr-absorb"] ||= skill.params[0];
				if(skill.params[2]) pre["combo-absorb"] ||= skill.params[0];
				if(skill.params[3]) pre["damage-absorb"] ||= skill.params[0];
			} else if (skill.type === 191) {
				pre["damage-void"] ||= skill.params[0];
			}
			return pre
		}, outObj);
		return outObj;
	}
	function voidsAbsorption_Addition(card)
	{
		const turnsObj = voidsAbsorption_Turns(card);
		const namesArr = ["attr-absorb", "combo-absorb", "damage-absorb", "damage-void"];
		const turns = namesArr.map(name=>turnsObj[name]);
		const turnsSet = new Set(turns.filter(Boolean));
		const turnsCount = turnsSet.size;

		const fragment = document.createDocumentFragment();
		for (let i = 0; i < namesArr.length; i++) {
			if (turns[i] > 0) {
				fragment.append(createSkillIcon(namesArr[i]));
				if (turnsCount > 1)
					fragment.append(`-${turns[i]>=9999 ? '全' : `${turns[i]}T` }`);
			}
		}
		if (turnsCount === 1) {
			const turn = Array.from(turnsSet)[0];
			fragment.append(`-${turn>=9999 ? '全' : `${turn}T` }`);
		}
		return fragment;
	}
	function unbind_Turns(card)
	{
		const outObj = {
			normal: 0,
			awakenings: 0,
			matches: 0
		};
		const searchTypeArray = [
			117, 179,
			196
		];
		const skills = getCardActiveSkills(card, searchTypeArray);
		const parsedSkills = directParseSkills(skills);
		
		parsedSkills.reduce((pre,cur)=>{
			pre.normal ||= cur.normal;
			pre.awakenings ||= cur.awakenings;
			pre.matches ||= cur.matches;
			return pre
		}, outObj);
		return outObj;
	}
	function unbind_Addition(card)
	{
		const turnsObj = unbind_Turns(card);
		const namesArr = ["normal", "awakenings", "matches"];
		const turns = namesArr.map(name=>turnsObj[name]);
		const turnsSet = new Set(turns.filter(Boolean));
		const turnsCount = turnsSet.size;

		const fragment = document.createDocumentFragment();
		for (let i = 0; i < namesArr.length; i++) {
			if (turns[i] > 0) {
				fragment.append(createSkillIcon(`unbind-${namesArr[i]}`));
				if (turnsCount > 1)
					fragment.append(`-${turns[i]>=9999 ? '全' : `${turns[i]}T` }`);
			}
		}
		if (turnsCount === 1) {
			const turn = Array.from(turnsSet)[0];
			fragment.append(`-${turn>=9999 ? '全' : `${turn}T` }`);
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
				outArr.push(changes(Bin.unflags(sk[0] || 1), Bin.unflags(sk[1] || 1)));
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
		const outArr = [];
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
					to: sk[1] || 1,
					exclude: sk[2],
				});
			}else
			{
				outArr.push({
					count: sk[0],
					to: sk[1] || 1,
					exclude: sk[2],
				});
				outArr.push({
					count: sk[3],
					to: sk[4] || 1,
					exclude: sk[5],
				});
			}
		}
		return outArr;
	}
	function generateOrbs_Addition(card)
	{
		const gens = generateOrbsParse(card);
		if (!gens.length) return;
		const fragment = document.createDocumentFragment();
		for (const gen of gens)
		{
			fragment.appendChild(createOrbsList(Bin.unflags(gen.to)));
			fragment.appendChild(document.createTextNode(`×${gen.count}`));
		}
		return fragment;
	}
	function lock_Addition(card)
	{
		const searchTypeArray = [152, 190, 262];
		const skills = getCardActiveSkills(card, searchTypeArray, true);
		if (!skills.length) return;
		return skills.map(skill=>{
			const sk = skill.params;
			const fragment = document.createDocumentFragment();
			switch (skill.type) {
				case 152:{
					fragment.append(
						createSkillIcon('orb-locked')
					);
					if (sk[1] < 42) fragment.append(`×${sk[1]}`);
					fragment.append(
						createOrbsList(Bin.unflags(sk[0] || 1))
					);
					break;
				}
				case 190:{
					fragment.append(
						createSkillIcon('orb-combo-drop')
					);
					if (sk[1] < 42) fragment.append(`×${sk[1]}`);
					fragment.append(
						createOrbsList(Bin.unflags(sk[0] || 1))
					);
					break;
				}
				case 262:{
					fragment.append(
						createSkillIcon('orb-nail')
					);
					if (sk[0] < 42) fragment.append(`×${sk[0]}`);
					fragment.append(
						createOrbsList(Attributes.orbs())
					);
					break;
				}
			}
			return fragment;
		}).nodeJoin('');
	}
	function dropLock_Addition(card)
	{
		const searchTypeArray = [205];
		const skill = getCardActiveSkill(card, searchTypeArray, 1);
		if (!skill) return;
		const sk = skill.params;
		const fragment = document.createDocumentFragment();
		fragment.appendChild(createOrbsList(Bin.unflags(sk[0] != -1 ? sk[0] : 0b1111111111), 'locked'));
		fragment.appendChild(document.createTextNode(`×${sk[1]}T`));
		return fragment;
	}
	function dropOrb_Addition(card)
	{
		const searchTypeArray = [126];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;

		const colors = Bin.unflags(sk[0]);
		
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
			colors.push(Bin.unflags(sk[ai+1]));
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
			colors.push(Bin.unflags(sk[ai+1]));
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
		const searchTypeArray = [230, 269];
		const skills = getCardActiveSkills(card, searchTypeArray, true);
		return skills.map(skill=>{
			const sk = skill.params;
			const fragment = document.createDocumentFragment();
			fragment.appendChild(createTeamFlags(sk[1], skill.type == 269 ? 2 : 1));
			fragment.append(`${sk[2] / 100}倍×${sk[0]}T`);
			return fragment;
		}).nodeJoin(document.createElement("br"));
	}
	function getIncreaseDamageCap(skill)
	{
		let cap = 0;
		switch (skill.type) {
			case 241:case 258:case 263:case 266:
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
	function memberCap_Addition(card)
	{
		const searchTypeArray = [241, 246, 247, 258, 263, 266];
		const skills = getCardActiveSkills(card, searchTypeArray, true);
		return skills.map(skill=>{
			const sk = skill.params;
			let cap = getIncreaseDamageCap(skill);
			const fragment = document.createDocumentFragment();
			switch (skill.type) {
				case 258:
				case 266: {
					fragment.appendChild(createTeamFlags(sk[2], skill.type == 266 ? 2 : 1));
					break;
				}
				case 241:
				case 246:
				case 247: {
					fragment.appendChild(createTeamFlags(1));
					break;
				}
				case 263: {
					const attrs = Bin.unflags(sk[2]);
					if (attrs?.length)
					{
						fragment.appendChild(createOrbsList(attrs));
					}
					const types = Bin.unflags(sk[3]);
					if (types?.length)
					{
						fragment.appendChild(createTypesList(types));
					}
					break;
				}
			}
			//fragment.append(createSkillIcon(SkillKinds.IncreaseDamageCapacity, cap > 21 ? "cap-incr" : "cap-decr"));
			switch (skill.type) {
				case 258:
				case 241:
				case 263:
				case 266: {
					fragment.append(`${(cap*1e8).bigNumberToString()}×${sk[0]}T`);
					break;
				}
				case 246: {
					fragment.append(`${(cap*1e8).bigNumberToString()}←${sk[1]}C in ${sk[0]}S`);
					break;
				}
				case 247: {
					fragment.append(`${(cap*1e8).bigNumberToString()}←${sk[2]} of `, createOrbsList(Bin.unflags(sk[1])), ` in ${sk[0]}S`);
					break;
				}
			}
			return fragment;
		}).nodeJoin(document.createElement("br"));
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
		const searchTypeArray = [6, 161, 261];
		const skill = getCardActiveSkill(card, searchTypeArray);
		if (!skill) return;
		const sk = skill.params;

		const denominator = skill.type === 161 ? 
			localTranslating.skill_parse.stats.maxhp() : 
			localTranslating.skill_parse.stats.chp();
		const percent = `${sk[0]}%`;
		const target = skill.type === 261 ? 
			localTranslating.skill_parse.target.enemy_one() : 
			localTranslating.skill_parse.target.enemy_all();
		
		const fragment = document.createDocumentFragment();
		//fragment.append(target, denominator, percent);
		return [target, denominator, percent].nodeJoin(" ");
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
				outObj.attrs = Bin.unflags(sk[1]);
				outObj.types = Bin.unflags(sk[2]);
				outObj.turns = sk[0];
				outObj.rate = sk[3];
			}
			else if(skill.type == 231 && sk[6] > 0)
			{
				outObj.skilltype = 1;
				outObj.awoken = sk.slice(1, 5).filter(Boolean);
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
				outObj.attrs = Bin.unflags(sk[1]);
				outObj.types = Bin.unflags(sk[2]);
				outObj.turns = sk[0];
				outObj.rate = sk[4];
			} else if (skill.type == 231 && sk[7] > 0) {
				outObj.skilltype = 1;
				outObj.awoken = sk.slice(1, 5).filter(Boolean);
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
		{group:true,name:"Active Skill",otLangName:{chs:"主动技",cht:"主動技"}, functions: [
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
					if (parsedGroupSkill.kind == SkillKinds.EvolvedSkills) {
						const subSkills = parsedGroupSkill.params.map(id=>Skills[id]);
						if (parsedGroupSkill.loop) { //循环的
							let subCd = subSkills.reduce((p,subSkill)=>{
								p += subSkill.initialCooldown - (subSkill.maxLevel - 1);
								return p;
							}, 0);
							return parsedGroupSkill.skills.some(skill=>isLoopBuff(skill, subCd));
						} else { //不循环的
							let subSkill = subSkills.at(-1);
							let subCd = subSkill.initialCooldown - (subSkill.maxLevel - 1); //技能最短CD
							return isLoopBuff(parsedGroupSkill.skills.at(-1), subCd);
						}
					}
					return false;
				})
			},
			{group:true,name:"Voids Absorption",otLangName:{chs:"破吸类",cht:"破吸類"}, functions: [
				{name:"Voids attribute absorption",otLangName:{chs:"破属吸 buff",cht:"破屬吸 buff"},
					function:cards=>{
						const attrName = "attr-absorb";
						return cards.filter(card=>{
							const turns = voidsAbsorption_Turns(card);
							return turns[attrName] > 0;
						}).sort((a,b)=>{
							const a_s = voidsAbsorption_Turns(a), b_s = voidsAbsorption_Turns(b);
							let a_pC = a_s[attrName], b_pC = b_s[attrName];
							return a_pC - b_pC;
						});
					},
					addition:voidsAbsorption_Addition
				},
				{name:"Voids combo absorption",otLangName:{chs:"破C吸 buff",cht:"破C吸 buff"},
					function:cards=>{
						const attrName = "combo-absorb";
						return cards.filter(card=>{
							const turns = voidsAbsorption_Turns(card);
							return turns[attrName] > 0;
						}).sort((a,b)=>{
							const a_s = voidsAbsorption_Turns(a), b_s = voidsAbsorption_Turns(b);
							let a_pC = a_s[attrName], b_pC = b_s[attrName];
							return a_pC - b_pC;
						});
					},
					addition:voidsAbsorption_Addition
				},
				{name:"Voids damage absorption",otLangName:{chs:"破伤吸 buff",cht:"破傷吸 buff"},
					function:cards=>{
						const attrName = "damage-absorb";
						return cards.filter(card=>{
							const turns = voidsAbsorption_Turns(card);
							return turns[attrName] > 0;
						}).sort((a,b)=>{
							const a_s = voidsAbsorption_Turns(a), b_s = voidsAbsorption_Turns(b);
							let a_pC = a_s[attrName], b_pC = b_s[attrName];
							return a_pC - b_pC;
						});
					},
					addition:voidsAbsorption_Addition
				},
				{name:"Pierce through damage void",otLangName:{chs:"贯穿无效盾 buff",cht:"貫穿無效盾 buff"},
					function:cards=>{
						const attrName = "damage-void";
						return cards.filter(card=>{
							const turns = voidsAbsorption_Turns(card);
							return turns[attrName] > 0;
						}).sort((a,b)=>{
							const a_s = voidsAbsorption_Turns(a), b_s = voidsAbsorption_Turns(b);
							let a_pC = a_s[attrName], b_pC = b_s[attrName];
							return a_pC - b_pC;
						});
					},
					addition:voidsAbsorption_Addition
				},
				{group:true,name:"Combination",otLangName:{chs:"常用组合",cht:"常用組合"}, functions: [
					{name:"2 Voids (attr. & damage)",otLangName:{chs:"双破(属+伤)",cht:"双破(属+伤)"},
						function:cards=>{
							return cards.filter(card=>{
								const turns = voidsAbsorption_Turns(card);
								return turns["attr-absorb"] > 0 && turns["damage-absorb"] > 0;
							}).sort((a,b)=>{
								const a_s = voidsAbsorption_Turns(a), b_s = voidsAbsorption_Turns(b);
								let a_pC = a_s["attr-absorb"], b_pC = b_s["attr-absorb"];
								return a_pC - b_pC;
							});
						},
						addition:voidsAbsorption_Addition
					},
					{name:"3 Voids (attr. & damage & void)",otLangName:{chs:"三破(属+伤+无)",cht:"三破(属+伤+无)"},
						function:cards=>{
							return cards.filter(card=>{
								const turns = voidsAbsorption_Turns(card);
								return turns["attr-absorb"] > 0 && turns["damage-absorb"] > 0 && turns["damage-void"] > 0;
							}).sort((a,b)=>{
								const a_s = voidsAbsorption_Turns(a), b_s = voidsAbsorption_Turns(b);
								let a_pC = a_s["attr-absorb"], b_pC = b_s["attr-absorb"];
								return a_pC - b_pC;
							});
						},
						addition:voidsAbsorption_Addition
					},
				]},
			]},
			{group:true,name:"Recovers Bind Status",otLangName:{chs:"解封类",cht:"解封類"}, functions: [
				{
					name:"Unbind menber bind",otLangName:{chs:"解封角色",cht:"解封角色"},
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
					name:"Unbind awakenings bind",otLangName:{chs:"解觉醒",cht:"解覺醒"},
					function:cards=>{
						return cards.filter(card=>{
							const turns = unbind_Turns(card);
							return turns.awakenings > 0;
						}).sort((a,b)=>{
							const a_s = unbind_Turns(a), b_s = unbind_Turns(b);
							let a_pC = a_s.awakenings, b_pC = b_s.awakenings;
							return a_pC - b_pC;
						});
					},
					addition:unbind_Addition
				},
				{
					name:"Unbind unmatchable",otLangName:{chs:"解禁消珠",cht:"解禁消珠"},
					function:cards=>{
						return cards.filter(card=>{
							const turns = unbind_Turns(card);
							return turns.matches > 0;
						}).sort((a,b)=>{
							const a_s = unbind_Turns(a), b_s = unbind_Turns(b);
							let a_pC = a_s.matches, b_pC = b_s.matches;
							return a_pC - b_pC;
						});
					},
					addition:unbind_Addition
				},
				{group:true,name:"Combination",otLangName:{chs:"常用组合",cht:"常用組合"}, functions: [
					{
						name:"3 Unbinds",otLangName:{chs:"三解",cht:"三解"},
						function:cards=>{
							return cards.filter(card=>{
								const turns = unbind_Turns(card);
								return turns.normal > 0 && turns.awakenings > 0 && turns.matches > 0;
							}).sort((a,b)=>{
								const a_s = unbind_Turns(a), b_s = unbind_Turns(b);
								let a_pC = a_s.normal, b_pC = b_s.normal;
								return a_pC - b_pC;
							});
						},
						addition:unbind_Addition
					},
				]},
			]},
			{group:true,name:"For player team",otLangName:{chs:"对自身队伍生效类",cht:"對自身隊伍生效類"}, functions: [
				{name:"↑Increase skills charge",otLangName:{chs:"【溜】减少CD",cht:"【溜】減少CD"},
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
						skill.type === 227 && fragment.append('换👉');
						return fragment;
					}
				},
				{group:true,name:"Increase Damage Cap",otLangName:{chs:"增加伤害上限",cht:"增加傷害上限"}, functions: [
					{name:"Increase Damage Cap - Any",otLangName:{chs:"增加伤害上限 - 任意",cht:"增加傷害上限 - 任意"},
						function:cards=>{
							const searchTypeArray = [241, 246, 247, 258, 263, 266];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill;
							}).sort((a,b)=>{
								const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
								let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
								return a_pC - b_pC;
							});
						},
						addition:memberCap_Addition
					},
					{name:"Increase Damage Cap - Self",otLangName:{chs:"增加伤害上限 - 自身",cht:"增加傷害上限 - 自身"},
						function:cards=>{
							const searchTypeArray = [241, 246, 247, 258, 266];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								switch (skill?.type) {
									case 258: {
										return Boolean(skill.params[2] & 0b1);
									}
									case 266: {
										return Boolean(skill.params[2] & 0b100);
									}
									default: {
										return skill;
									}
								}
							}).sort((a,b)=>{
								const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
								let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
								return a_pC - b_pC;
							});
						},
						addition:memberCap_Addition
					},
					{name:"Increase Damage Cap - Leader",otLangName:{chs:"增加伤害上限 - 队长",cht:"增加傷害上限 - 隊長"},
						function:cards=>{
							const searchTypeArray = [258];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill && Boolean(skill.params[2] & 0b110);
							}).sort((a,b)=>{
								const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
								let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
								return a_pC - b_pC;
							});
						},
						addition:memberCap_Addition
					},
					{name:"Increase Damage Cap - Sub",otLangName:{chs:"增加伤害上限 - 队员",cht:"增加傷害上限 - 隊員"},
						function:cards=>{
							const searchTypeArray = [258];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill && Boolean(skill.params[2] & 0b1000);
							}).sort((a,b)=>{
								const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
								let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
								return a_pC - b_pC;
							});
						},
						addition:memberCap_Addition
					},
					{name:"Increase Damage Cap - Neighbor",otLangName:{chs:"增加伤害上限 - 相邻",cht:"增加傷害上限 - 相鄰"},
						function:cards=>{
							const searchTypeArray = [266];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill && Boolean(skill.params[2] & 0b11);
							}).sort((a,b)=>{
								const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
								let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
								return a_pC - b_pC;
							});
						},
						addition:memberCap_Addition
					},
					{name:"Increase Damage Cap - Attr./Types",otLangName:{chs:"增加伤害上限 - 属性/类型",cht:"增加傷害上限 - 屬性/類型"},
						function:cards=>{
							const searchTypeArray = [263];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill;
							}).sort((a,b)=>{
								const a_ss = getCardActiveSkill(a, searchTypeArray), b_ss = getCardActiveSkill(b, searchTypeArray);
								let a_pC = getIncreaseDamageCap(a_ss), b_pC = getIncreaseDamageCap(b_ss);
								return a_pC - b_pC;
							});
						},
						addition:memberCap_Addition
					},
				]},
				{group:true,name:"Card slot ATK rate change",otLangName:{chs:"卡片位置攻击力",cht:"卡片位置攻擊力"}, functions: [
					{name:"Card slot ATK rate change - Any",otLangName:{chs:"卡片位置攻击力 - 任意",cht:"卡片位置攻擊力 - 任意"},
						function:cards=>{
							const searchTypeArray = [230, 269];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill;
							}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
						},
						addition:memberATK_Addition
					},
					{name:"Card slot ATK rate change - Self",otLangName:{chs:"卡片位置攻击力 - 自身",cht:"卡片位置攻擊力 - 自身"},
						function:cards=>{
							const searchTypeArray = [230, 269];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								switch (skill?.type) {
									case 230: {
										return Boolean(skill.params[1] & 0b1);
									}
									case 269: {
										return Boolean(skill.params[1] & 0b100);
									}
									default: {
										return skill;
									}
								}
							}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
						},
						addition:memberATK_Addition
					},
					{name:"Card slot ATK rate change - Leader",otLangName:{chs:"卡片位置攻击力 - 队长",cht:"卡片位置攻擊力 - 隊長"},
						function:cards=>{
							const searchTypeArray = [230];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill && Boolean(skill.params[1] & 0b110);
							}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
						},
						addition:memberATK_Addition
					},
					{name:"Card slot ATK rate change - Sub",otLangName:{chs:"卡片位置攻击力 - 队员",cht:"卡片位置攻擊力 - 隊員"},
						function:cards=>{
							const searchTypeArray = [230];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill && Boolean(skill.params[1] & 0b1000);
							}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
						},
						addition:memberATK_Addition
					},
					{name:"Card slot ATK rate change - Neighbor",otLangName:{chs:"卡片位置攻击力 - 相邻",cht:"卡片位置攻擊力 - 相鄰"},
						function:cards=>{
							const searchTypeArray = [269];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill && Boolean(skill.params[1] & 0b11);
							}).sort((a,b)=>sortByParams(a, b, searchTypeArray, 2));
						},
						addition:memberATK_Addition
					},
				]},
				{name:"Change card self's Attr",otLangName:{chs:"转换自身属性",cht:"轉換自身屬性"},
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
				{name:"↓Reduce skills charge",otLangName:{chs:"【坐】增加CD",cht:"【坐】增加CD"},
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
				{name:"Bind team active skill",otLangName:{chs:"自封队伍技能 debuff",cht:"自封队伍技能 debuff"},
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
				{name:"Bind card self",otLangName:{chs:"角色自身被绑定",cht:"角色自身被綁定"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [267];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}),
					addition:card=>{
						const searchTypeArray = [267];
						const skill = getCardActiveSkill(card, searchTypeArray);
						if (!skill) return;
						const sk = skill.params;
						return document.createTextNode(`自绑定${sk[0]}T`);
					}
				},
				{name:"Remove card self's assist",otLangName:{chs:"移除卡片武器",cht:"移除卡片武器"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [250];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					})
				},
			]},
			{group:true,name:"Player's HP change",otLangName:{chs:"玩家HP操纵类",cht:"玩家HP操縱類"}, functions: [
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
				{name:"Damage self",otLangName:{chs:"玩家自残",cht:"玩家自殘"},
					function:cards=>{
						return cards.filter(card=>damageSelf_Rate(card)>0)
							.sort((a,b)=>damageSelf_Rate(a) - damageSelf_Rate(b));
					},
					addition:card=>{
						let rate = damageSelf_Rate(card);
						const fragment = document.createDocumentFragment();
						fragment.append(createSkillIcon('heal', 'hp-decr'));
						if (rate < 100)
							fragment.append(`减少${rate}%`);
						else
							fragment.append(`减少到1`);
						return fragment;
					}
				},
			]},
			{group:true,name:"Buff",otLangName:{chs:"buff 类",cht:"buff 類"}, functions: [
				{name:"RCV rate change",otLangName:{chs:"回复力 buff",cht:"回覆力 buff"},
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
				{name:"Move time change",otLangName:{chs:"操作时间 buff",cht:"操作時間 buff"},
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
				{name:"Adds combo",otLangName:{chs:"加C buff",cht:"加C buff"},
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
				{name:"Reduce Damage for all Attr",otLangName:{chs:"全属减伤 buff",cht:"全屬減傷 buff"},
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
				{name:"Reduce 100% Damage",otLangName:{chs:"全属减伤 100%",cht:"全屬減傷 100%"},
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
				{name:"Reduce all Damage for designated Attr",otLangName:{chs:"限属减伤 buff",cht:"限屬減傷 buff"},
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
				{name:"Mass Attacks",otLangName:{chs:"变为全体攻击",cht:"變爲全體攻擊"},
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
			{group:true,name:"For Enemy",otLangName:{chs:"对敌 buff 类",cht:"對敵 buff 類"}, functions: [
				{name:"Menace",otLangName:{chs:"威吓",cht:"威嚇"},
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
						const fragment = document.createDocumentFragment();
						fragment.appendChild(createSkillIcon('delay'));
						fragment.append(`×${sk[0]}T`);
						return fragment;
					}
				},
				{name:"Reduces enemies' DEF",otLangName:{chs:"破防",cht:"破防"},
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
						const fragment = document.createDocumentFragment();
						fragment.appendChild(createSkillIcon('def-break'));
						fragment.append(`${sk[1]}%×${sk[0]}T`);
						return fragment;
					}
				},
				{name:"Poisons enemies",otLangName:{chs:"中毒",cht:"中毒"},
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
						const fragment = document.createDocumentFragment();
						fragment.appendChild(createSkillIcon('poison'));
						fragment.append(`ATK×${sk[0]/100}`);
						return fragment;
					}
				},
				{name:"Change enemies's Attr",otLangName:{chs:"改变敌人属性",cht:"改變敵人屬性"},
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
				{name:"Counterattack buff",otLangName:{chs:"受伤反击 buff",cht:"受傷反擊 buff"},
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
						fragment.appendChild(createSkillIcon('counter-attack'));
						fragment.appendChild(createOrbsList(sk[2]));
						fragment.appendChild(document.createTextNode(`×${sk[1]/100}倍`));
						fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
			
						return fragment;
					}
				},
			]},
			{group:true,name:"Orbs States Change",otLangName:{chs:"改变宝珠状态类",cht:"改變寶珠狀態類"}, functions: [
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
				{name:"Lock(≥6 color)",otLangName:{chs:"上锁5色+心或全部",cht:"上鎖5色+心或全部"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [152];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && (skill.params[0] & 0b11_1111) === 0b11_1111;
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
								attrs = Bin.unflags(sk[0]); break;
							}
						}
						const fragment = document.createDocumentFragment();
						fragment.appendChild(createSkillIcon('orb-enhanced'));
						fragment.appendChild(createOrbsList(attrs));
						return fragment;
					}
				},
				{name:"Add Combo Drop",otLangName:{chs:"加豆荚",cht:"加豆莢"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [190];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}),
					addition:lock_Addition
				},
				{name:"Add Nail",otLangName:{chs:"加钉子",cht:"加釘子"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [262];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}),
					addition:lock_Addition
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
						fragment.appendChild(createOrbsList(Bin.unflags(sk[1] || 1)));
						fragment.appendChild(document.createTextNode(`×${sk[0]}T`));
						return fragment;
					}
				},
			]},
			{group:true,name:"Board States Change",otLangName:{chs:"改变板面状态类",cht:"改變板面狀態類"}, functions: [
				{name:"Replaces all Orbs",otLangName:{chs:"刷版",cht:"刷版"},
					function:cards=>cards.filter(card=>{
					const searchTypeArray = [10];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
					})
				},
				{name:"No Skyfall",otLangName:{chs:"无天降 buff",cht:"無天降 buff"},
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
				{name:"Creates Roulette Orb",otLangName:{chs:"生成轮盘位 buff",cht:"生成輪盤位 buff"},
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
							fragment.append(createOrbsList(Bin.unflags(sk[1])));
						}
						fragment.append(`${sk[7]? sk[7] : '固定'+sk.slice(2,7).flatMap(Bin.unflags).length }`,`×${sk[0]}T`);
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
						const colums = Bin.unflags(sk[1]), rows = Bin.unflags(sk[2]);
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
				{name:"Fixed starting position",otLangName:{chs:"固定起手位置",cht:"固定起手位置"},
					function:cards=>cards.filter(card=>{
					const searchTypeArray = [273];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
					})
				},
			]},
			{group:true,name:"Orbs Drop",otLangName:{chs:"珠子掉落 类",cht:"珠子掉落 類"}, functions: [
				{name:"Drop Enhanced Orbs",otLangName:{chs:"掉落强化宝珠 buff",cht:"掉落強化寶珠 buff"},
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
				{name:"Drop locked orbs(any color)",otLangName:{chs:"掉锁（不限色）",cht:"掉鎖（不限色）"},
					function:cards=>{
						const searchTypeArray = [205];
						return cards.filter(card=>{
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
					},
					addition:dropLock_Addition
				},
				{name:"Drop locked orbs(≥6 color)",otLangName:{chs:"掉锁5色+心或全部",cht:"掉鎖5色+心或全部"},
					function:cards=>{
						const searchTypeArray = [205];
						return cards.filter(card=>{
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b11_1111) === 0b11_1111;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray,1));
					},
					addition:dropLock_Addition
				},
				{group:true,name:"Drop rate increases",otLangName:{chs:"掉落率提升",cht:"掉落率提升"}, functions: [
					{name:"Drop rate increases",otLangName:{chs:"掉落率提升 buff",cht:"掉落率提升 buff"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Fire",otLangName:{chs:"掉落率提升-属性-火",cht:"掉落率提升-屬性-火"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b1);
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Water",otLangName:{chs:"掉落率提升-属性-水",cht:"掉落率提升-屬性-水"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b10);
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Wood",otLangName:{chs:"掉落率提升-属性-木",cht:"掉落率提升-屬性-木"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b100);
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Light",otLangName:{chs:"掉落率提升-属性-光",cht:"掉落率提升-屬性-光"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b1000);
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Dark",otLangName:{chs:"掉落率提升-属性-暗",cht:"掉落率提升-屬性-暗"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b1_0000);
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Heart",otLangName:{chs:"掉落率提升-属性-心",cht:"掉落率提升-屬性-心"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b10_0000);
						}),
						addition:dropOrb_Addition
					},
					{name:"Drop rate - Attr. - Jammers/Poison",otLangName:{chs:"掉落率提升-属性-毒、废",cht:"掉落率提升-屬性-毒、廢"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [126];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill && (skill.params[0] & 0b11_1100_0000);
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
				]},
				{name:"Drop Nail Orbs",otLangName:{chs:"掉落钉珠 buff",cht:"掉落釘珠 buff"},
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
				{name:"Drop Thorn Orbs",otLangName:{chs:"掉落荆棘 debuff",cht:"掉落荊棘 debuff"},
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
							let attrs = Bin.unflags(sk[1]);
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
			{group:true,name:"Change all Orbs on Board",otLangName:{chs:"洗板类",cht:"洗板類"}, functions: [
				{name:"Changes all Orbs to any",otLangName:{chs:"洗版-任意",cht:"洗版-任意"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [71];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					}),
					addition:boardChange_Addition
				},
				{group:true,name:"Colors Count",otLangName:{chs:"颜色数量",cht:"颜色数量"}, functions: [
					{name:"To 1 color(Farm)",otLangName:{chs:"1色（花火）",cht:"1色（花火）"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).length == 1;
						}),
						addition:boardChange_Addition
					},
					{name:"To 2 color",otLangName:{chs:"2色",cht:"2色"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).length == 2;
						}),
						addition:boardChange_Addition
					},
					{name:"To 3 color",otLangName:{chs:"3色",cht:"3色"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).length == 3;
						}),
						addition:boardChange_Addition
					},
					{name:"To 4 color",otLangName:{chs:"4色",cht:"4色"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).length == 4;
						}),
						addition:boardChange_Addition
					},
					{name:"To 5 color",otLangName:{chs:"5色",cht:"5色"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).length == 5;
						}),
						addition:boardChange_Addition
					},
					{name:"To ≥6 color",otLangName:{chs:"6色以上",cht:"6色以上"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).length >= 6;
						}),
						addition:boardChange_Addition
					},
				]},
				{group:true,name:"Include Color",otLangName:{chs:"包含颜色",cht:"包含颜色"}, functions: [
					{name:"Include Fire",otLangName:{chs:"含火",cht:"含火"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).includes(0);
						}),
						addition:boardChange_Addition
					},
					{name:"Include Water",otLangName:{chs:"含水",cht:"含水"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).includes(1);
						}),
						addition:boardChange_Addition
					},
					{name:"Include Wood",otLangName:{chs:"含木",cht:"含木"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).includes(2);
						}),
						addition:boardChange_Addition
					},
					{name:"Include Light",otLangName:{chs:"含光",cht:"含光"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).includes(3);
						}),
						addition:boardChange_Addition
					},
					{name:"Include Dark",otLangName:{chs:"含暗",cht:"含暗"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).includes(4);
						}),
						addition:boardChange_Addition
					},
					{name:"Include Heart",otLangName:{chs:"含心",cht:"含心"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [71];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return boardChange_ColorTypes(skill).includes(5);
						}),
						addition:boardChange_Addition
					},
					{name:"Include Jammers/Poison",otLangName:{chs:"含毒废",cht:"含毒廢"},
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
			]},
			{group:true,name:"Orbs Color Change",otLangName:{chs:"指定色转珠类",cht:"指定色轉珠類"}, functions: [
				{group:true,name:"To Color",otLangName:{chs:"转为颜色",cht:"转为颜色"}, functions: [
					{name:"To Fire",otLangName:{chs:"变为-火",cht:"變爲-火"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(0));
						}),
						addition:changeOrbs_Addition
					},
					{name:"To Water",otLangName:{chs:"变为-水",cht:"變爲-水"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(1));
						}),
						addition:changeOrbs_Addition
					},
					{name:"To Wood",otLangName:{chs:"变为-木",cht:"變爲-木"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(2));
						}),
						addition:changeOrbs_Addition
					},
					{name:"To Light",otLangName:{chs:"变为-光",cht:"變爲-光"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(3));
						}),
						addition:changeOrbs_Addition
					},
					{name:"To Dark",otLangName:{chs:"变为-暗",cht:"變爲-暗"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(4));
						}),
						addition:changeOrbs_Addition
					},
					{name:"To Heal",otLangName:{chs:"变为-心",cht:"變爲-心"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(5));
						}),
						addition:changeOrbs_Addition
					},
					{name:"To Jammers/Poison",otLangName:{chs:"变为-毒废",cht:"變爲-毒廢"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.to.includes(6) || p.to.includes(7) || p.to.includes(8) || p.to.includes(9));
						}),
						addition:changeOrbs_Addition
					},
				]},
				{group:true,name:"From Color",otLangName:{chs:"转走颜色",cht:"转走颜色"}, functions: [
					{name:"From Fire",otLangName:{chs:"转走-火",cht:"轉走-火"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.from.includes(0));
						}),
						addition:changeOrbs_Addition
					},
					{name:"From Water",otLangName:{chs:"转走-水",cht:"轉走-水"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.from.includes(1));
						}),
						addition:changeOrbs_Addition
					},
					{name:"From Wood",otLangName:{chs:"转走-木",cht:"轉走-木"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.from.includes(2));
						}),
						addition:changeOrbs_Addition
					},
					{name:"From Light",otLangName:{chs:"转走-光",cht:"轉走-光"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.from.includes(3));
						}),
						addition:changeOrbs_Addition
					},
					{name:"From Dark",otLangName:{chs:"转走-暗",cht:"轉走-暗"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.from.includes(4));
						}),
						addition:changeOrbs_Addition
					},
					{name:"From Heart",otLangName:{chs:"转走-心",cht:"轉走-心"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [9,20,154];
							const skills = getCardActiveSkills(card, searchTypeArray);
							if (!skills.length) return false;
							let parsedSkills = skills.flatMap(skill=>orbsChangeParse(skill));
							return parsedSkills.some(p=>p.from.includes(5));
						}),
						addition:changeOrbs_Addition
					},
					{name:"From Jammers/Poison",otLangName:{chs:"转走-毒废",cht:"轉走-毒廢"},
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
				
			]},
			{group:true,name:"Random Create Orbs",otLangName:{chs:"随机产珠类",cht:"隨機產珠類"}, functions: [
				{name:"Create 15×2 color Orbs",otLangName:{chs:"产珠15个×2色",cht:"產珠15個×2色"},
					function:cards=>cards.filter(card=>{
						function is1515(sk)
						{
							return Boolean(Bin.unflags(sk[1]).length == 2 && sk[0] == 15);
						}
						const searchTypeArray = [141];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && is1515(skill.params);
					}),
					addition:generateOrbs_Addition
				},
				{name:"Create 30 Orbs",otLangName:{chs:"产珠30个",cht:"產珠30個"},
					function:cards=>cards.filter(card=>{
						function is30(sk)
						{
							return Boolean(Bin.unflags(sk[1]).length * sk[0] == 30);
						}
						const searchTypeArray = [141];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill && is30(skill.params);
					}),
					addition:generateOrbs_Addition
				},
				{group:true,name:"Orb Color",otLangName:{chs:"生成颜色",cht:"生成颜色"}, functions: [
					{name:"6 color Orbs",otLangName:{chs:"6色",cht:"6色"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>(gen.to & 0b111111) === 0b111111);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Fire Orbs",otLangName:{chs:"火",cht:"火"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b000001);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Water Orbs",otLangName:{chs:"水",cht:"水"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b000010);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Wood Orbs",otLangName:{chs:"木",cht:"木"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b000100);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Light Orbs",otLangName:{chs:"光",cht:"光"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b001000);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Dark Orbs",otLangName:{chs:"暗",cht:"暗"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b010000);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Heart Orbs",otLangName:{chs:"心",cht:"心"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b100000);
						}),
						addition:generateOrbs_Addition
					},
					{name:"Jammers/Poison Orbs",otLangName:{chs:"毒废",cht:"毒廢"},
						function:cards=>cards.filter(card=>{
							const gens = generateOrbsParse(card);
							return gens.some(gen=>gen.to & 0b1111000000);
						}),
						addition:generateOrbs_Addition
					},
				]},
			]},
			{group:true,name:"Create Fixed Position Orbs",otLangName:{chs:"固定位置产珠类",cht:"固定位置產珠類"}, functions: [
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
						return skill && (skill.params.length>=3 || Bin.unflags(skill.params[0]).length>=2);
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
						return skill && ((skill.params[0] | skill.params[2]) & 0b1110);
					}),
					addition:generateRowOrbs_Addition
				},
				{name:"Extensive horizontal(Farm and outer edges)",otLangName:{chs:"泛产横（包含花火与四周一圈等）",cht:"泛產橫（包含花火與四周一圈等）"},
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
			{group:true,name:"Damage Enemy - Gravity",otLangName:{chs:"对敌直接伤害类-重力",cht:"對敵直接傷害類-重力"}, functions: [
				{name:"Any",otLangName:{chs:"任意",cht:"任意"},
					function:cards=>{
						const searchTypeArray = [6, 161, 261];
						return cards.filter(card=>{
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
					},
					addition: gravity_Addition
				},
				{name:"Current HP",otLangName:{chs:"敌人当前血量",cht:"敵人當前血量"},
					function:cards=>{
						const searchTypeArray = [6, 261];
						return cards.filter(card=>{
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
					},
					addition: gravity_Addition
				},
				{name:"Max HP",otLangName:{chs:"敌人最大血量",cht:"敵人最大血量"},
					function:cards=>{
						const searchTypeArray = [161];
						return cards.filter(card=>{
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
					},
					addition: gravity_Addition
				},
				{name:"Breaking Shield",otLangName:{chs:"破白盾",cht:"破白盾"},
					function:cards=>{
						const searchTypeArray = [259];
						return cards.filter(card=>{
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
					},
					addition:card=>{
						const searchTypeArray = [259];
						const skill = getCardActiveSkill(card, searchTypeArray);
						if (!skill) return;
						const sk = skill.params;
						const fragment = document.createDocumentFragment();
						fragment.appendChild(createSkillIcon('breaking-shield'));
						fragment.append(`-${sk[0]}%`);
						return fragment;
					}
				},
			]},
			{group:true,name:"Damage Enemy - Fixed damage",otLangName:{chs:"对敌直接伤害类-固伤",cht:"對敵直接傷害類-固傷"}, functions: [
				{name:"Any",otLangName:{chs:"任意",cht:"任意"},
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
				{name:"Single",otLangName:{chs:"单体",cht:"單體"},
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
				{name:"Mass",otLangName:{chs:"全体",cht:"全體"},
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
			{group:true,name:"Damage Enemy - Numerical damage",otLangName:{chs:"对敌直接伤害类-大炮",cht:"對敵直接傷害類-大炮"}, functions: [
				{group:true,name:"Target",otLangName:{chs:"对象",cht:"對象"}, functions: [
					{name:"Target - Single",otLangName:{chs:"对象-敌方单体",cht:"對象-敵方單體"},
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
					{name:"Target - Mass",otLangName:{chs:"对象-敌方全体",cht:"對象-敵方全體"},
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
					{name:"Target - Designate Attr",otLangName:{chs:"对象-指定属性敌人",cht:"對象-指定屬性敵人"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [42];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						})
					},
				]},
				{group:true,name:"Attribute",otLangName:{chs:"属性",cht:"屬性"}, functions: [
					{name:"Actors self attr.",otLangName:{chs:"释放者自身属性",cht:"釋放者自身屬性"},
						function:cards=>cards.filter(card=>{
							const searchTypeArray = [2,35];
							const skill = getCardActiveSkill(card, searchTypeArray);
							return skill;
						})
					},
				]},
				{group:true,name:"Damage",otLangName:{chs:"伤害",cht:"傷害"}, functions: [
					{name:"Damage - Rate by Actors self ATK",otLangName:{chs:"伤害-自身攻击倍率",cht:"傷害-自身攻擊倍率"},
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
					{name:"Damage - Fixed Attr Number",otLangName:{chs:"伤害-指定属性数值",cht:"傷害-指定屬性數值"},
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
					{name:"Damage - By remaining HP",otLangName:{chs:"伤害-根据剩余血量",cht:"傷害-根據剩餘血量"},
						function:cards=>{
							const searchTypeArray = [110];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill;
							}).sort((a,b)=>sortByParams(a,b,searchTypeArray,3));
						},
						addition: numericalATK_Addition
					},
					{name:"Damage - Team total HP",otLangName:{chs:"伤害-队伍总 HP",cht:"傷害-隊伍總 HP"},
						function:cards=>{
							const searchTypeArray = [143];
							return cards.filter(card=>{
								const skill = getCardActiveSkill(card, searchTypeArray);
								return skill;
							}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
						},
						addition: numericalATK_Addition
					},
					{name:"Damage - Team attrs ATK",otLangName:{chs:"伤害-队伍某属性总攻击",cht:"傷害-隊伍某屬性總攻擊"},
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
		
			]},
			{name:"1 CD",otLangName:{chs:"1 CD",cht:"1 CD"},
				function:cards=>cards.filter(card=>{
					if (card.activeSkillId == 0) return false;
					let skill = Skills[card.activeSkillId];
					//单向进化技能，采用最后一个子技能
					if (skill.type == 232) skill = Skills[skill.params.at(-1)];
					return getSkillMinCD(skill) <= 1;
				})
			},
			{name:"Skill Loop less than 4 card",otLangName:{chs:"4 个队员能循环开",cht:"4 個隊員能循環開"},
				function:cards=>cards.filter(card=>{
					if (card.activeSkillId == 0) return false;
					let skill = Skills[card.activeSkillId];
					//单向进化技能，采用最后一个子技能
					if (skill.type === 232) skill = Skills[skill.params.at(-1)];

					/*
					 * 202,变身，只能用一次
					 * 214,自封技能
					 * 218,坐CD，永远都无法循环
					 * 250,移除武器，作为基底时直接无法使用
					 * 268,使用次数限制
					 */
					const cantLoopSkill = getActuallySkills(skill, [202, 214, 218, 250, 268]);
					if (cantLoopSkill.length) return false;

					const minCD = getSkillMinCD(skill); //主动技最小的CD
					let realCD = minCD;
					const skillBoost = getActuallySkills(skill, [146], false); //溜
					if (skillBoost.length) {
						realCD = skillBoost.reduce((cd,subSkill)=>{
							return cd - subSkill.params[0] * 3; //第一个参数是溜几回合，3个角色就是×3
						}, realCD);
					}
					return minCD > 1 && realCD <= 4;
				})
			},
			{name:"Time pause",otLangName:{chs:"时间暂停",cht:"時間暫停"},
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
			{name:"Random effect active",otLangName:{chs:"随机效果技能",cht:"隨機效果技能"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [118];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				})
			},
			{name:"Evolved active",otLangName:{chs:"进化类技能",cht:"進化類技能"},
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
			{name:"Not Evolved active",otLangName:{chs:"非进化类技能",cht:"非進化類技能"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [232, 233];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return !skill;
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
					fragment.append(createOrbsList(Bin.unflags(sk[0])), sk[2] ? `≤${sk[2]}` : `≥${sk[1]}`);
					return fragment;
				}
			},
			{name:"Has limit of times a skill can be used",otLangName:{chs:"技能使用有次数限制",cht:"技能使用有次數限制"},
				function:cards=>cards.filter(card=>{
					const searchTypeArray = [268];
					const skill = getCardActiveSkill(card, searchTypeArray);
					return skill;
				}),
				addition:card=>{
					const searchTypeArray = [268];
					const skill = getCardActiveSkill(card, searchTypeArray);
					if (!skill) return;
					const sk = skill.params;
					return `限${sk[0]}次`;
				}
			},
		]},
		
		{group:true,name:"Leader Skills",otLangName:{chs:"队长技",cht:"隊長技"}, functions: [
		
			{group:true,name:"Matching Style",otLangName:{chs:"匹配模式",cht:"匹配模式"}, functions: [
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
						const orbs = createOrbsList(Bin.unflags(sk[0]));
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
				{name:"Awakening active",otLangName:{chs:"激活觉醒",cht:"激活覺醒"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [271];
						const skill = getCardLeaderSkill(card, searchTypeArray);
						return skill;
					}),
					addition:card=>{
						const searchTypeArray = [271];
						const skill = getCardLeaderSkill(card, searchTypeArray);
						if (!skill) return;
						const parsedSkills = skillParser(skill.id);
						const parsedSkill = parsedSkills.find(subSkil=>
							subSkil
							?.condition
							?.awakeningActivated
							?.awakenings?.length);
						const fragment = document.createDocumentFragment();
						fragment.append("要",creatAwokenList(parsedSkill.condition.awakeningActivated.awakenings));
						return fragment;
					}
				},
			]},
			{group:true,name:"Restriction/Bind",otLangName:{chs:"限制",cht:"限制"}, functions: [
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
				{name:"Unable to less match",otLangName:{chs:"要求长串消除",cht:"要求長串消除"},
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
						const attrs = Bin.unflags(sk[0]), types = Bin.unflags(sk[1]);
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
			{group:true,name:"Extra Effects",otLangName:{chs:"附加效果",cht:"附加效果"}, functions: [
				{name:"Fixed damage inflicts",otLangName:{chs:"队长技固伤追击",cht:"隊長技固傷追擊"},
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
						const fragment = document.createDocumentFragment();
						
						const icon = document.createElement("icon");
						icon.className = "attr";
						icon.setAttribute("data-attr-icon", "fixed");

						fragment.append(icon, value.bigNumberToString());
						let skill = getCardLeaderSkill(card, [235]);
						if (skill) {
							fragment.append("/",
								createOrbsList(Bin.unflags(skill.params[0])),
								`×${skill.params[2]}`);
						}
						return fragment;
					}
				},
				{name:"Adds combo",otLangName:{chs:"队长技+C",cht:"隊長技+C"},
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
						const fragment = document.createDocumentFragment();
						fragment.append(createSkillIcon('add-combo'), value.bigNumberToString());
						let skill;
						if (skill = getCardLeaderSkill(card, [210])) {
							fragment.append("/十字");
						} else if (skill = getCardLeaderSkill(card, [235])) {
							if (skill?.params?.[5]) {
								fragment.append("/",
									createOrbsList(Bin.unflags(skill.params[0])),
									`×${skill.params[2]}`);
							}
						}
						return fragment;
					}
				},
				{name:"Move time changes",otLangName:{chs:"队长技加/减秒",cht:"隊長技加/減秒"},
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
						const fragment = document.createDocumentFragment();
						fragment.append(createSkillIcon("status-time", value < 0 ? "time-decr" : "time-incr"),
							value > 0 ? "+" : "-",
							Math.abs(value/100),
							"s");
						return fragment;
					}
				},
				{name:"Fixed move time",otLangName:{chs:"固定操作时间",cht:"固定操作時間"},
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
						const fragment = document.createDocumentFragment();
						fragment.append(createSkillIcon("fixed-time"),
							Math.abs(value),
							"s");
						return fragment;
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
						let attrs = Bin.unflags(sk[0]), types = Bin.unflags(sk[1]), awakenings = sk.slice(2);
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
				{name:"Bonus attack when matching Orbs",otLangName:{chs:"消除宝珠时计算防御的追打",cht:"消除寶珠時計算防禦的追打"},
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
				{name:"Recovers HP when matching Orbs",otLangName:{chs:"消除宝珠时回血",cht:"消除寶珠時回血"},
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
				{name:"Reduce damage when rcv",otLangName:{chs:"回血加盾",cht:"回血加盾"},
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
				{name:"Recover Awkn Skill bind when rcv",otLangName:{chs:"回血解觉",cht:"回血解覺"},
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
				{name:"Counterattack",otLangName:{chs:"队长技受伤反击",cht:"隊長技受傷反擊"},
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
				{group:true,name:"Increased drop rewards",otLangName:{chs:"增加掉落奖励",cht:"增加掉落獎勵"}, functions: [
					{name:"Increase Item Drop rate",otLangName:{chs:"增加道具掉落率",cht:"增加道具掉落率"},
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
							const fragment = document.createDocumentFragment();
							fragment.appendChild(createSkillIcon('rate-mul-drop'));
							fragment.append(`x${sk[0]/100}`);
							return fragment;
						}
					},
					{name:"Increase Coin rate",otLangName:{chs:"增加金币掉落倍数",cht:"增加金幣掉落倍數"},
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
							const fragment = document.createDocumentFragment();
							fragment.appendChild(createSkillIcon('rate-mul-coin'));
							fragment.append(`x${sk[0]/100}`);
							return fragment;
						}
					},
					{name:"Increase Exp rate",otLangName:{chs:"增加经验获取倍数",cht:"增加經驗獲取倍數"},
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
							const fragment = document.createDocumentFragment();
							fragment.appendChild(createSkillIcon('rate-mul-exp'));
							fragment.append(`x${sk[0]/100}`);
							return fragment;
						}
					},
					{name:"Increase Plus Point rate",otLangName:{chs:"增加加蛋值掉落倍数",cht:"增加加蛋值掉落倍數"},
						function:cards=>{
						const searchTypeArray = [264];
						return cards.filter(card=>{
							const skill = getCardLeaderSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
						},
						addition:card=>{
							const searchTypeArray = [264];
							const skill = getCardLeaderSkill(card, searchTypeArray);
							if (!skill) return;
							const sk = skill.params;
							const fragment = document.createDocumentFragment();
							fragment.appendChild(createSkillIcon('rate-mul-plus_point'));
							fragment.append(`x${sk[0]/100}`);
							return fragment;
						}
					},
					{name:"Increase Part Break drop rate",otLangName:{chs:"增加部位破坏素材掉率",cht:"增加部位破壞素材掉率"},
						function:cards=>{
						const searchTypeArray = [265];
						return cards.filter(card=>{
							const skill = getCardLeaderSkill(card, searchTypeArray);
							return skill;
						}).sort((a,b)=>sortByParams(a,b,searchTypeArray));
						},
						addition:card=>{
							const searchTypeArray = [265];
							const skill = getCardLeaderSkill(card, searchTypeArray);
							if (!skill) return;
							const sk = skill.params;
							const fragment = document.createDocumentFragment();
							fragment.appendChild(createSkillIcon('rate-mul-part_break'));
							fragment.append(`x${sk[0]/100}`);
							return fragment;
						}
					},
				]},
			]},
			{group:true,name:"HP Scale",otLangName:{chs:"血倍率",cht:"血倍率"}, functions: [
				{name:"HP Scale [3, ∞)",otLangName:{chs:"队长血倍率[2, ∞)",cht:"隊長血倍率[2, ∞)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const HPscale = getHPScale(skill);
						return HPscale >= 3;
					}).sort(sortByHPScal),
					addition: HPScal_Addition
				},
				{name:"HP Scale [2, 3)",otLangName:{chs:"队长血倍率[2, ∞)",cht:"隊長血倍率[2, ∞)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const HPscale = getHPScale(skill);
						return HPscale >= 2 && HPscale < 3;
					}).sort(sortByHPScal),
					addition: HPScal_Addition
				},
				{name:"HP Scale [1.5, 2)",otLangName:{chs:"队长血倍率[1.5, 2)",cht:"隊長血倍率[1.5, 2)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const HPscale = getHPScale(skill);
						return HPscale >= 1.5 && HPscale < 2;
					}).sort(sortByHPScal),
					addition: HPScal_Addition
				},
				{name:"HP Scale (1, 1.5)",otLangName:{chs:"队长血倍率(1, 1.5)",cht:"隊長血倍率(1, 1.5)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const HPscale = getHPScale(skill);
						return HPscale > 1 && HPscale < 1.5;
					}).sort(sortByHPScal),
					addition: HPScal_Addition
				},
				{name:"HP Scale == 1",otLangName:{chs:"队长血倍率 == 1",cht:"隊長血倍率 == 1"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const HPscale = getHPScale(skill);
						return HPscale === 1;
					}),
					addition: HPScal_Addition
				},
				{name:"HP Scale [0, 1)",otLangName:{chs:"队长血倍率[0, 1)",cht:"隊長血倍率[0, 1)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const HPscale = getHPScale(skill);
						return HPscale < 1;
					}).sort(sortByHPScal),
					addition: HPScal_Addition
				},
			]},
			{group:true,name:"Reduce Shield",otLangName:{chs:"减伤盾",cht:"減傷盾"}, functions: [
				{name:"Reduce Damage [75%, 100%]",otLangName:{chs:"队长盾减伤[75%, 100%]",cht:"隊長盾減傷[75%, 100%]"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const reduceScale = getReduceScale(skill);
						return reduceScale >= 0.75;
					}).sort(sortByReduceScale),
					addition: ReduceScale_Addition
				},
				{name:"Reduce Damage [50%, 75%)",otLangName:{chs:"队长盾减伤[50%, 75%)",cht:"隊長盾減傷[50%, 75%)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const reduceScale = getReduceScale(skill);
						return reduceScale >= 0.5 && reduceScale < 0.75;
					}).sort(sortByReduceScale),
					addition: ReduceScale_Addition
				},
				{name:"Reduce Damage [25%, 50%)",otLangName:{chs:"队长盾减伤[25%, 50%)",cht:"隊長盾減傷[25%, 50%)"},
					function:cards=>cards.filter(card=>{
						const skill = Skills[card.leaderSkillId];
						const reduceScale = getReduceScale(skill);
						return reduceScale >= 0.25 && reduceScale < 0.5;
					}).sort(sortByReduceScale),
					addition: ReduceScale_Addition
				},
				{name:"Reduce Damage (0%, 25%)",otLangName:{chs:"队长盾减伤(0%, 25%)",cht:"隊長盾減傷(0%, 25%)"},
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
		]},
		{group:true,name:"Evo type",otLangName:{chs:"进化类型",cht:"進化類型"}, functions: [
			{group:true,name:"Transform",otLangName:{chs:"变身相关",cht:"變身相關"}, functions: [
				{name:"No Transform",otLangName:{chs:"非变身",cht:"非變身"},
					function:cards=>cards.filter(card=>
						!Array.isArray(card.henshinFrom) &&
						!Array.isArray(card.henshinTo))
				},
				{name:"After Transform",otLangName:{chs:"变身后",cht:"變身後"},
					function:cards=>cards.filter(card=>Array.isArray(card.henshinFrom))
				},
				{name:"Before Transform",otLangName:{chs:"变身前",cht:"變身前"},
					function:cards=>cards.filter(card=>Array.isArray(card.henshinTo))
				},
				{name:"Not Before Transform",otLangName:{chs:"除了变身前",cht:"除了變身前"},
					function:cards=>cards.filter(card=>!Array.isArray(card.henshinTo))
				},
				{name:"Random Transform",otLangName:{chs:"随机变身",cht:"隨機變身"},
					function:cards=>cards.filter(card=>{
						const searchTypeArray = [236];
						const skill = getCardActiveSkill(card, searchTypeArray);
						return skill;
					})
				},
			]},
			{name:"Pixel Evo",otLangName:{chs:"像素进化",cht:"像素進化"},
				function:cards=>cards.filter(card=>card.evoMaterials.includes(3826))
			},
			//{name:"",otLangName:{chs:"非8格潜觉",cht:"非8格潛覺"},function:cards=>cards.filter(card=>!card.is8Latent)},
			{name:"Reincarnation/Super Rein..",otLangName:{chs:"转生、超转生进化",cht:"轉生、超轉生進化"},
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
		{group:true,name:"Awakenings",otLangName:{chs:"觉醒类",cht:"覺醒類"}, functions: [
			{name:"Have Sync Awoken",otLangName:{chs:"有同步觉醒",cht:"有同步覺醒"},
				function:cards=>cards.filter(card=>card.syncAwakening),
				addition:card=>{if (card.syncAwakeningConditions) {
					return card.syncAwakeningConditions.map(c=>cardN(c.id)).nodeJoin();
				}}
			},
			{name:"Full Awakening (9 / 8 for weapon)",otLangName:{chs:"满觉醒（9个/武器8个）",cht:"滿覺醒（9個/武器8個）"},
				function:cards=>cards.filter(card=>card.awakenings.length >= ( card.awakenings.includes(49) ? 8 : 9))
			},
			{name:"Has, but not full Awakening",otLangName:{chs:"有，但觉醒未满",cht:"有，覺醒未滿"},
				function:cards=>cards.filter(card=>card.awakenings.length > 0 && card.awakenings.length < ( card.awakenings.includes(49) ? 8 : 9))
			},
			{name:"3 same Killer, or 2 with latent",otLangName:{chs:"3个相同杀觉醒，或2+潜觉",cht:"3個相同殺覺醒，或2+潛覺"},
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
			{group:true,name:"Kind of Awakening (No Super Awoken)",otLangName:{chs:"某类觉醒（无超觉）",cht:"某類覺醒（无超觉）"}, functions: [
				{name:"Any Reduce Attr. Damage Awakening",otLangName:{chs:"任意颜色盾觉醒",cht:"任意顏色盾覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=4 && ak<=8))
				},
				{name:"Any Killer Awakening",otLangName:{chs:"任意杀手觉醒",cht:"任意殺手覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=31 && ak<=42))
				},
				{name:"Any Enhanced Orbs Awakening",otLangName:{chs:"任意+珠觉醒",cht:"任意+珠覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=14 && ak<=18 || ak === 29 || ak>=99 && ak<=104))
				},
				{name:"Any Enhanced Rows Awakening",otLangName:{chs:"任意横行强化觉醒",cht:"任意横行強化覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=22 && ak<=26 || ak>=116 && ak<=120))
				},
				{name:"Any Enhanced Combos Awakening",otLangName:{chs:"任意连击强化（章鱼烧）觉醒",cht:"任意連擊強化（章魚燒）覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=73 && ak<=77 || ak>=121 && ak<=125))
				},
				{name:"Any Multi Attr. Enhanced Awakening",otLangName:{chs:"任意杂色强化觉醒",cht:"任意雜色強化覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak === 44 || ak === 51 || ak>=79 && ak<=81 || ak === 97 || ak>=112 && ak<=114))
				},
				{name:"Any Add Type Awakening",otLangName:{chs:"任意附加类型觉醒",cht:"任意附加類型覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=83 && ak<=90))
				},
				{name:"Any Change Sub Attr. Awakening",otLangName:{chs:"任意更改副属性觉醒",cht:"任意更改副屬性覺醒"},
					function:cards=>cards.filter(card=>card.awakenings.some(ak=>ak>=91 && ak<=95))
				},
			]},
		]},
		{group:true,name:"Others Search",otLangName:{chs:"其他搜索",cht:"其他搜索"}, functions: [
			{name:"Water Att. & Attacker Type(Tanjiro)",otLangName:{chs:"攻击型或水属性（炭治郎）",cht:"攻擊型或水屬性（炭治郎）"},
				function:cards=>cards.filter(card=>card.attrs.includes(1) || card.types.includes(6))
			},
			{name:"Level limit unable break",otLangName:{chs:"不能突破等级限制",cht:"不能突破等級限制"},
				function:cards=>cards.filter(card=>card.limitBreakIncr===0)
			},
			{name:"Able to lv110, but no Super Awoken",otLangName:{chs:"能突破等级限制但没有超觉醒",cht:"能突破等級限制但沒有超覺醒"},
				function:cards=>cards.filter(card=>card.limitBreakIncr > 0 && card.superAwakenings.length == 0)
			},
			{name:"Raise ≥50% at lv110",otLangName:{chs:"110级三维成长≥50%",cht:"110級三維成長≥50%"},
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
			{name:"Have 3 Attrs",otLangName:{chs:"有3个属性",cht:"有3個屬性"},
				function:cards=>cards.filter(card=>card.attrs.filter(a=>a>=0 && a<6).length >= 3)
			},
			{name:"3 attrs are different",otLangName:{chs:"3属性不一致",cht:"3屬性不一致"},
				function:cards=>cards.filter(({attrs})=>(new Set(attrs.filter(a=>a>=0 && a<6))).size >= 3)
			},
			{name:"All Latent TAMADRA",otLangName:{chs:"所有潜觉蛋龙",cht:"所有潛覺蛋龍"},
				function:cards=>cards.filter(card=>card.latentAwakeningId>0).sort((a,b)=>a.latentAwakeningId-b.latentAwakeningId)
			},
			{name:"Stacked material",otLangName:{chs:"堆叠的素材",cht:"堆疊的素材"},
				function:cards=>cards.filter(card=>card.stackable),
			},
			{name:"Not stacked material",otLangName:{chs:"不堆叠的素材",cht:"不堆疊的素材"},
				function:cards=>cards.filter(card=>!card.stackable && card.types.some(t=>[0,12,14,15].includes(t))),
			},
			{group:true,name:"Sold in stores",otLangName:{chs:"直接售卖",cht:"直接售賣"}, functions: [
				{name:"Will get Orbs skin",otLangName:{chs:"能获得宝珠皮肤",cht:"能獲得寶珠皮膚"},
					function:cards=>cards.filter(({orbSkinOrBgmId})=>orbSkinOrBgmId>0 && orbSkinOrBgmId<1e4),
					addition:({orbSkinOrBgmId})=>Boolean(orbSkinOrBgmId) && `ID.${orbSkinOrBgmId}`
				},
				{name:"Will get BGM",otLangName:{chs:"能获得背景音乐",cht:"能獲得背景音樂"},
					function:cards=>cards.filter(({orbSkinOrBgmId})=>orbSkinOrBgmId>=1e4),
					addition:({orbSkinOrBgmId})=>Boolean(orbSkinOrBgmId) && `ID.${orbSkinOrBgmId}`
				},
				{name:"Will get Team Badge",otLangName:{chs:"能获得队伍徽章",cht:"能獲得隊伍徽章"},
					function:cards=>cards.filter(({badgeId})=>badgeId),
					addition:({badgeId})=>{
						if (!badgeId) return;
						const fragment = document.createDocumentFragment();
						fragment.append(`ID.${badgeId}`);
						const icon = document.createElement("icon");
						icon.className = "badge";
						icon.setAttribute("data-badge-icon", badgeId);
						fragment.append(icon);
						return fragment;
					}
				},
			]},
			{name:"Hava banner when use skill",otLangName:{chs:"使用技能时有横幅",cht:"使用技能時有橫幅"},
				function:cards=>cards.filter(card=>card.skillBanner)
			},
			{group:true,name:"Only Additional display",otLangName:{chs:"附加显示",cht:"附加显示"}, functions: [
				{name:"Show Original Name",otLangName:{chs:"显示怪物原始名称",cht:"显示怪物原始名稱"},
					function:cards=>cards,
					addition:card=>card.name
				},
				{name:"Show Feed EXP",otLangName:{chs:"显示合成经验值",cht:"显示合成經驗值"},
					function:cards=>cards.filter(card=>card.feedExp > 0).sort((a,b)=>a.feedExp * a.maxLevel - b.feedExp * b.maxLevel),
					addition:card=>`EXP ${Math.round(card.feedExp * card.maxLevel / 4).bigNumberToString()}`
				},
				{name:"Show Sell Price",otLangName:{chs:"显示售卖金钱",cht:"显示售賣金錢"},
					function:cards=>cards.filter(card=>card.sellPrice > 0).sort((a,b)=>a.sellPrice * a.maxLevel - b.sellPrice * b.maxLevel),
					addition:card=>`Coin ${Math.round(card.sellPrice * card.maxLevel / 10).bigNumberToString()}`
				},
				{name:"Show Sell Monster Point(MP)",otLangName:{chs:"显示售卖怪物点数(MP)",cht:"显示售賣怪物點數(MP)"},
					function:cards=>cards,
					addition:card=>`MP ${card.sellMP.bigNumberToString()}`
				},
				{name:"Show Card Types",otLangName:{chs:"显示角色类型",cht:"显示角色類型"},
					function:cards=>cards,
					addition:card=>createTypesList(card.types)
				},
				{name:"Show Card Cost",otLangName:{chs:"显示角色消耗",cht:"显示角色消耗"},
					function:cards=>cards,
					addition:card=>`COST ${card.cost}`
				},
				{name:"Show Card Group ID",otLangName:{chs:"显示角色分组ID",cht:"顯示角色分組ID"},
					function:cards=>cards,
					addition:card=>{
						const ul = document.createElement("ul");
						ul.className = "monsterinfo-groupId";
						const mSeriesId = ul.appendChild(document.createElement("li"));
						mSeriesId.className = "monster-seriesId";
						mSeriesId.textContent = card.seriesId;
						mSeriesId.setAttribute(dataAttrName, card.seriesId);
						mSeriesId.classList.toggle(className_displayNone, !card.seriesId);
						const mCollabId = ul.appendChild(document.createElement("li"));
						mCollabId.className = "monster-collabId";
						mCollabId.textContent = card.collabId;
						mCollabId.setAttribute(dataAttrName, card.collabId);
						mCollabId.classList.toggle(className_displayNone, !card.collabId);
						const mGachaId = ul.appendChild(document.createElement("li"));
						mGachaId.className = "monster-gachaId";
						mGachaId.textContent = card.gachaIds.join();
						mGachaId.setAttribute(dataAttrName, card.gachaIds.join());
						mGachaId.classList.toggle(className_displayNone, !card.gachaIds.length);
						return ul;
					}
				},
			]},
		]},
	];
	return {
		name:"All Functions",
		functions: functions
	};
})();