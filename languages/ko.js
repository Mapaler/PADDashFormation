const _localTranslating = {
	webpage_title: `퍼즐앤드래곤 ${teamsCount} 명의 팀 다이어그램 작성 도구`,
	addition_display: "추가 표시입니다",
	title_blank: "입력 제목",
	detail_blank: "입력 내용",
	sort_name:{
		sort_none: "없음",
		sort_id: "카드 ID",
		sort_attrs : "속성",
		sort_evoRootId: "카드 진화 루트",
		sort_evoRoot_Attrs : "카드 진화 루트의 특성",
		sort_rarity: "래리티",
		sort_cost: "비용",
		sort_mp: "MP",
		sort_skillLv1: "최대 스킬 턴",
		sort_skillLvMax: "최소 스킬 턴",
		sort_evoSkillLastCD: "최소 스킬 턴 (최종 진화)",
		sort_hpMax120: "최대 HP",
		sort_atkMax120: "최대 공격",
		sort_rcvMax120: "최대 회복",
		sort_hpMax120_awoken: "최대 HP (+각성)",
		sort_atkMax120_awoken: "최대 공격 (+각성)",
		sort_rcvMax120_awoken: "최대 회복 (+각성)",
		sort_abilityIndex_awoken: "최대 가중 능력 지수 (+각성)",
	},
	force_reload_data: "데이터 강제 새로 고침",
}
deepMerge(localTranslating, _localTranslating);
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = function()
{
	let numTemp = this.valueOf();
	if (!numTemp) return "0";
	const grouping = Math.pow(10, 4);
	const unit = ['','만','억','조'];
	const numParts = [];
	do{
		numParts.push(numTemp % grouping);
		numTemp = Math.floor(numTemp / grouping);
	}while(numTemp>0 && numParts.length<(unit.length-1))
	if (numTemp>0)
	{
		numParts.push(numTemp);
	}
	let numPartsStr = numParts.map((num,idx)=>{
		if (num > 0)
		{
			return (num < 1e3 ? "と" : "") + num.toLocaleString() + unit[idx];
		}else
			return "と";
	});

	numPartsStr.reverse(); //反向
	let outStr = numPartsStr.join("");
	outStr = outStr.replace(/(^と+|と+$)/g,''); //去除开头的零
	outStr = outStr.replace(/と{2,}/g,'と'); //去除多个连续的零
	return outStr;
}