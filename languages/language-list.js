var languageList = [
    {
        name:"English",i18n:"en",searchlist:["en","ja"],
        guideURL:id=>`http://www.puzzledragonx.com/en/monster.asp?n=${id}` //or (id,name)=>`http://www.puzzledragonx.com/en/search.asp?q=${name}`
    },
    {
        name:"中文（繁體）",i18n:"zh-TW",searchlist:["cht","ja"],
        guideURL:id=>`http://pad.skyozora.com/pets/${id}`
    },
    {
        name:"中文（简体）技能解析",i18n:"zh-CN",searchlist:["chs","ja"],
        guideURL:id=>{const url = new URL(location);url.search = '';url.searchParams.set("guide",1);url.searchParams.set("id",id); return url;}
    },
    {
        name:"中文（简体）原版技能",i18n:"zh",searchlist:["chs","ja"],
        guideURL:id=>`http://pad.skyozora.com/pets/${id}`
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