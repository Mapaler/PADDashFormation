const _localTranslating = {
	webpage_title: `パズル＆ドラゴンズ${teamsCount}人のチーム図作成ツール`,
	addition_display: "追加の表示",
	title_blank: "入力タイトル",
	detail_blank: "入力詳細",
	sort_name:{
		sort_none: "いいえ",
		sort_id: "カード ID",
		sort_attrs : "属性",
		sort_evoRootId: "カード進化ルート",
		sort_evoRoot_Attrs : "カード進化ルートの属性",
		sort_rarity: "レアリティ",
		sort_cost: "コスト",
		sort_mp: "MP",
		sort_skillLv1: "最大スキルターン",
		sort_skillLvMax: "最小スキルターン",
		sort_skillLvMax: "最小スキルターン (最終的な進化)",
		sort_hpMax120: "最大 HP",
		sort_atkMax120: "最大攻撃",
		sort_rcvMax120: "最大回復",
		sort_hpMax120_awoken: "最大 HP (+覚醒)",
		sort_atkMax120_awoken: "最大攻撃 (+覚醒)",
		sort_rcvMax120_awoken: "最大回復 (+覚醒)",
		sort_abilityIndex_awoken: "最大加重能力指数 (+覚醒)",
	},
	force_reload_data: "データの強制更新",
}
deepMerge(localTranslating, _localTranslating);
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = function()
{
	let numTemp = this.valueOf();
	if (!numTemp) return "0";
	const grouping = Math.pow(10, 4);
	const unit = ['','万','億','兆','京','垓'];
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