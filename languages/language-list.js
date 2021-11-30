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
		name:"中文（简体）",i18n:"zh",i18n_RegExp:/^zh-(?:hans-)?/i,searchlist:["chs","ja"],
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
	/*{
		name:"Debug用",i18n:"zh-CN",searchlist:["chs","ja"],
		guideURL:id=>`https://pad.skyozora.com/pets/${id}`
	},*/
];