const languageList = [
	{
		name:"English",i18n:"en",searchlist:["en","ja"],
		guideURL:id=>`https://ilmina.com/#/CARD/${id}` //or (id,name)=>`http://www.puzzledragonx.com/en/search.asp?q=${name}`
	},
	{
		name:"中文（傳統）",i18n:"zh-TW",i18n_RegExp:/^zh-(?:hant-)?(TW|HK)/i,searchlist:["cht","ja"],
		guideURL:id=>`https://pad.chesterip.cc/${id}/`
	},
	{
		name:"中文（规范）",i18n:"zh",i18n_RegExp:/^zh-(?:hans-)?/i,searchlist:["chs","ja"],
		guideURL:id=>{
			const url = new URL(location);
			url.searchParams.set("guide",1);
			url.searchParams.set("id",id);
			return url;
		}
	},
	{
		name:"日本語",i18n:"ja",searchlist:["ja"],
		guideURL:id=>`https://pad.chesterip.cc/${id}`
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