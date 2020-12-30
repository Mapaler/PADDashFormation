const localTranslating = {
    webpage_title: `P&D ${teamsCount}P Formation Maker`,
    title_blank: `Input Formation Title`,
    detail_blank: `Input Detail`,
    sort_name: {
        sort_none: `Nope`,
        sort_id: `Cards Id`,
        sort_attrs : `Attribute`,
        sort_evoRootId: `Cards Evolution Root`,
        sort_evoRoot_Attrs : `Cards Evolution Root's Attribute`,
        sort_rarity: `Rarity`,
        sort_cost: `Cost`,
        sort_skillLv1: `Maximum Skill Turn`,
        sort_skillLvMax: `Minimum Skill Turn`,
        sort_hpMax110: `Max HP`,
        sort_atkMax110: `Max ATK`,
        sort_rcvMax110: `Max RCV`,
        sort_hpMax110_awoken: `Max HP (+Awoken)`,
        sort_atkMax110_awoken: `Max ATK (+Awoken)`,
        sort_rcvMax110_awoken: `Max RCV (+Awoken)`,
        sort_abilityIndex_awoken: `Maximum Weighted Ability Index (+Awakening)`,
    },
    force_reload_data: `Force refresh data`,
    skill_parse: {
        unknown_skill_type: ()=>`Unknown skill type.`,
		active_turns: (turns, activeElement)=> [activeElement,`, for ${turns} turns.`],
        random_skills: (skillList)=>[`Activates these random skills:`, skillList],
        delay: ()=> `Delays enemies' next move`,
		mass_attack: ()=> `plus Mass Attack`,
        leader_change: ()=> `Switches places with Leader Monster; use again to switch back`,
        no_skyfall: ()=> `No Skyfall Combos`,
        value: {
            unknown_value: (type)=>`[ unknown value: ${type}]`,
        }
    },
}

localisation(localTranslating);