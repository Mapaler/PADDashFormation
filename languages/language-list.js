const languageList = [
	{
		name:"English",i18n:"en",searchlist:["en","ja"],
		guideURL:sanbonGuideUrl //or (id,name)=>`http://www.puzzledragonx.com/en/search.asp?q=${name}`
	},
	{
		name:"中文（傳統）",i18n:"zh-hant",i18n_RegExp:/^zh-(?:hant-)?(TW|HK)/i,searchlist:["cht","ja"],
		guideURL:mydelfGuideUrl
	},
	{
		name:"中文（简体）",i18n:"zh-hans",i18n_RegExp:/^zh-(?:hans-)?/i,searchlist:["chs","ja"],
		guideURL:mydelfGuideUrl
	},
	{
		name:"日本語",i18n:"ja",searchlist:["ja"],
		guideURL:sanbonGuideUrl
	},
	{
		name:"한국어",i18n:"ko",searchlist:["ko","ja"],
		guideURL:sanbonGuideUrl
	},
];
function sanbonTranslateRegion(code) {
	switch (code) {
		case "ja": return "jp";
		case "ko": return "kr";
		case "en": return "na";
	}
};
function sanbonGuideUrl(id) {
	return `https://sanbon.me/${sanbonTranslateRegion(currentDataSource.code)}/monster/${id}`;
}
function mydelfGuideUrl(id) {
	const url = new URL(location);
	url.searchParams.delete('d');
	url.searchParams.set("guide",1);
	url.searchParams.set("id",id);
	return url;
}