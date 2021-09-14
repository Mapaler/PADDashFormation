const _localTranslating = {
	webpage_title: `龍族拼圖${teamsCount}人隊伍圖製作工具`,
	addition_display: "附加顯示",
	title_blank: "輸入隊伍標題",
	detail_blank: "輸入說明",
	sort_name:{
		sort_none: "無",
		sort_id: "怪物ID",
		sort_attrs : "屬性",
		sort_evoRootId: "進化樹",
		sort_evoRoot_Attrs : "進化根怪物的屬性",
		sort_rarity: "稀有度",
		sort_cost: "消耗",
		sort_mp: "MP",
		sort_skillLv1: "技能最大冷卻時間",
		sort_skillLvMax: "技能最小冷卻時間",
		sort_hpMax120: "最大 HP",
		sort_atkMax120: "最大攻擊",
		sort_rcvMax120: "最大回復",
		sort_hpMax120_awoken: "最大 HP(+覺醒)",
		sort_atkMax120_awoken: "最大攻擊(+覺醒)",
		sort_rcvMax120_awoken: "最大回復(+覺醒)",
		sort_abilityIndex_awoken: "最大加權能力指數（+覺醒）",
	},
	force_reload_data: "強制刷新數據",
};
deepMerge(localTranslating, _localTranslating);
localisation(localTranslating);

//大數字縮短長度
Number.prototype.bigNumberToString = function()
{
	let numTemp = this.valueOf();
	if (!numTemp) return "0";
	const grouping = 1e4;
	const unit = ['','萬','億','兆','京','垓'];
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
			return (num < 1e3 ? "零" : "") + num.toLocaleString() + unit[idx];
		}else
			return "零";
	});

	numPartsStr.reverse(); //反向
	let outStr = numPartsStr.join("");
	outStr = outStr.replace(/(^零+|零+$)/g,''); //去除開頭的零
	outStr = outStr.replace(/零{2,}/g,'零'); //去除多個連續的零
	return outStr;
}