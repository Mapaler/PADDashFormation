const languageList = [
	{
		name:"English",i18n:"en",searchlist:["en","ja"],
		guideURL:id=>`http://www.puzzledragonx.com/en/monster.asp?n=${id}` //or (id,name)=>`http://www.puzzledragonx.com/en/search.asp?q=${name}`
	},
	{
		name:"中文（繁體）",i18n:"zh-TW",i18n_RegExp:/^zh-(?:hant-)?TW/i,searchlist:["cht","ja"],
		guideURL:id=>`https://pad.skyozora.com/pets/${id}`
	},
	{
		name:"中文（简体）技能解析",i18n:"zh-CN",i18n_RegExp:/^zh-(?:hans-)?/i,searchlist:["chs","ja"],
		guideURL:id=>`https://pad.skyozora.com/pets/${id}`
	},
	{
		name:"中文（简体）原版技能",i18n:"zh",searchlist:["chs","ja"],
		guideURL:id=>`https://pad.skyozora.com/pets/${id}`
	},
	{
		name:"日本語",i18n:"ja",searchlist:["ja"],
		guideURL:id=>`https://pd.appbank.net/m${id}` //or id=>`https://pd.appbank.net/m${id}`
	},
	{
		name:"한국어",i18n:"ko",searchlist:["ko","ja"],
		guideURL:id=>`http://www.thisisgame.com/pad/info/monster/detail.php?code=${id}`
	},
];