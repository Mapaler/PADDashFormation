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

var Cards; //怪物数据
var Skills; //技能数据
var currentLanguage; //当前语言
var currentDataSource; //当前数据
var newCkeys; //当前的Ckey
var lastCkeys; //以前Ckey们
var interchangeSvg; //储存划线的SVG
var interchangePath; //储存划线的线
var changeSwapToCopy; //储存交换“复制”和“替换”
var controlBox; //储存整个controlBox
var statusLine; //储存状态栏
var formationBox; //储存整个formationBox
var teamBigBoxs = []; //储存全部teamBigBox
var allMembers = []; //储存所有成员，包含辅助
var editBox; //储存整个editBox
var showSearch; //整个程序都可以用的显示搜索函数

//队员基本的留空
var Member = function(){
	this.id=0;
	this.ability = [0,0,0];
};
Member.prototype.outObj = function(){
	const m = this;
	let obj = [m.id];
	if (m.level != undefined) obj[1] = m.level;
	if (m.awoken != undefined) obj[2] = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length>=3 && (m.plus[0]+m.plus[1]+m.plus[2])!=0)
	{
		if (m.plus[0] === m.plus[1] && m.plus[0] === m.plus[2])
		{ //当3个加值一样时只生成第一个减少长度
			obj[3] = m.plus[0];
		}else
		{
			obj[3] = m.plus;
		}
	}
	if (m.latent != undefined && m.latent instanceof Array && m.latent.length>=1) obj[4] = m.latent;
	if (m.sawoken != undefined && m.sawoken>=0) obj[5] = m.sawoken;
	const card = Cards[m.id] || Cards[0]; //怪物固定数据
	const skill = Skills[card.activeSkillId];
	//有技能等级，并且技能等级低于最大等级时才记录技能
	if (m.skilllevel != undefined && m.skilllevel < skill.maxLevel) obj[6] = m.skilllevel;
	return obj;
};
Member.prototype.loadObj = function(m,dataVersion){
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	if (dataVersion == undefined) dataVersion = 1;
	this.id = dataVersion>1 ? m[0] : m.id;
	this.level = dataVersion>1 ? m[1] : m.level;
	this.awoken = dataVersion>1 ? m[2] : m.awoken;
	if (dataVersion>1)
	{
		if (isNaN(m[3]) || m[3]==null)
		{
			this.plus = m[3];
		}else
		{
			const singlePlus = parseInt(m[3],10);//如果只有一个数字时，复制3份
			this.plus = [singlePlus,singlePlus,singlePlus];
		}
	}else
	{
		this.plus = m.plus;
	}
	if (!(this.plus instanceof Array)) this.plus = [0,0,0]; //如果加值不是数组，则改变
	this.latent = dataVersion>1 ? m[4] : m.latent;
	if (!(this.latent instanceof Array)) this.latent = []; //如果潜觉不是数组，则改变
	this.sawoken = dataVersion>1 ? m[5] : m.sawoken;
	this.skilllevel = m[6] || null;
};
Member.prototype.loadFromMember = function(m){
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	this.id = m.id;
};
//只用来防坐的任何队员
var MemberDelay = function(){
	this.id=-1;
};
MemberDelay.prototype = Object.create(Member.prototype);
MemberDelay.prototype.constructor = MemberDelay;
//辅助队员
var MemberAssist = function(){
	this.level = 0;
	this.awoken = 0;
	this.plus = [0,0,0];
	Member.call(this);
};
MemberAssist.prototype = Object.create(Member.prototype);
MemberAssist.prototype.constructor = MemberAssist;
MemberAssist.prototype.loadFromMember = function(m){
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	this.id = m.id;
	if (m.level != undefined) this.level = m.level;
	if (m.awoken != undefined) this.awoken = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length>=3 && (m.plus[0]+m.plus[1]+m.plus[2])>0) this.plus = JSON.parse(JSON.stringify(m.plus));
	if (m.skilllevel != undefined) this.skilllevel = m.skilllevel;
};
//正式队伍
var MemberTeam = function(){
	this.latent = [];
	this.ability = [0,0,0];
	MemberAssist.call(this);
	//sawoken作为可选项目，默认不在内
};
MemberTeam.prototype = Object.create(MemberAssist.prototype);
MemberTeam.prototype.constructor = MemberTeam;
MemberTeam.prototype.loadFromMember = function(m){
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	this.id = m.id;
	if (m.level != undefined) this.level = m.level;
	if (m.awoken != undefined) this.awoken = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length>=3 && (m.plus[0]+m.plus[1]+m.plus[2])>0) this.plus = JSON.parse(JSON.stringify(m.plus));
	if (m.latent != undefined && m.latent instanceof Array && m.latent.length>=1) this.latent = JSON.parse(JSON.stringify(m.latent));
	if (m.sawoken != undefined) this.sawoken = m.sawoken;
	if (m.ability != undefined && m.ability instanceof Array && m.plus.length>=3) this.ability = JSON.parse(JSON.stringify(m.ability));
	if (m.skilllevel != undefined) this.skilllevel = m.skilllevel;
};

var Formation = function(teamCount,memberCount){
	this.title = "";
	this.detail = "";
	this.teams = [];
	this.badge = 0;
	for (let ti=0;ti<teamCount;ti++)
	{
		const team = [[],[]];
		for (let mi=0;mi<memberCount;mi++)
		{
			team[0].push(new MemberTeam());
			team[1].push(new MemberAssist());
		}
		this.teams.push(team);
	}
};
Formation.prototype.outObj= function(){
	let obj = {};
	if (this.title != undefined && this.title.length>0) obj.t = this.title;
	if (this.detail != undefined && this.detail.length>0) obj.d = this.detail;
	obj.f = this.teams.map(function(t){
			return t.map(function(st){
				return st.map(function(m){
					return m.outObj();
				});
			});
		});
	if (this.badge != undefined && this.badge>0) obj.b = this.badge; //徽章
	return obj;
};
Formation.prototype.loadObj= function(f){
	const dataVeision = f.f?2:1; //是第几版格式
	this.title = dataVeision>1 ? f.t : f.title;
	this.detail = dataVeision>1 ? f.d : f.detail;
	this.badge = f.b ? f.b : 0; //徽章
	const teamArr = dataVeision>1 ? f.f : f.team;
	this.teams.forEach(function(t,ti){
		let tf = teamArr[ti] || [];
		t.forEach(function(st,sti){
			let fst = tf[sti] || [];
			st.forEach(function(m,mi){
				let fm = fst[mi];
				m.loadObj(fm,dataVeision);
			});
		});
	});
};
//获取最大潜觉数量
function getMaxLatentCount(id)
{ //转生2和超转生3为8个格子
	if (Cards[id])
	{
		return Cards[id].is8Latent ? 8 : 6;
	}else
	{
		return 6;
	} 
}
//切换怪物ID显示
function toggleShowMonId()
{
	if (controlBox.querySelector("#show-mon-id").checked)
	{
		document.body.classList.remove("not-show-mon-id");
	}else
	{
		document.body.classList.add("not-show-mon-id");
	}
}
//切换怪物技能CD显示
function toggleShowMonSkillCd()
{
	if (controlBox.querySelector("#btn-show-mon-skill-cd").checked)
	{
		document.body.classList.add("show-mon-skill-cd");
	}else
	{
		document.body.classList.remove("show-mon-skill-cd");
	}
}
//清除数据
function clearData()
{
	location.search = "";
}
//轮换ABC队伍
function swapABCteam()
{
	if (formation.teams.length>1)
	{
		formation.teams.push(formation.teams.splice(0,1)[0]); //将队伍1移动到最后
		creatNewUrl();
		refreshAll(formation);
	}
}
//在单人和多人之间转移数据
function turnPage(toPage)
{
	let pagename = null;
	switch(toPage)
	{
		case 1:
			if (formation.teams[0][0].length<6)
			{
				//把第二支队伍的队长添加到最后方
				formation.teams[0][0].push(formation.teams[1][0][0]);
				formation.teams[0][1].push(formation.teams[1][1][0]);
			}
			//删掉第2支开始的队伍
			formation.teams.splice(1);
			pagename = "solo.html";
			break;
		case 2:
			if (formation.teams.length<2)
			{ //从1人到2人
				formation.teams[1] = [[],[]];
				//把右边的队长加到第二支队伍最后面
				formation.teams[1][0].splice(0,0,formation.teams[0][0].splice(5,1)[0]);
				formation.teams[1][1].splice(0,0,formation.teams[0][1].splice(5,1)[0]);
			}else
			{ //从3人到2人，直接删除后面两个队伍
				//删掉第3支开始的队伍
				formation.teams.splice(2);
				//删掉前面两支队伍的战友
				formation.teams[0][0].splice(5);
				formation.teams[0][1].splice(5);
				formation.teams[1][0].splice(5);
				formation.teams[1][1].splice(5);
			}
			formation.badge = 0;
			pagename = "multi.html";
			break;
		case 3:
			if (formation.teams.length<2)
			{ //从1人到3人
			}else
			{ //从2人到3人
				formation.teams[0][0].push(formation.teams[1][0][0]);
				formation.teams[0][1].push(formation.teams[1][1][0]);
				formation.teams[1][0].push(formation.teams[0][0][0]);
				formation.teams[1][1].push(formation.teams[0][1][0]);
			}
			formation.badge = 0;
			pagename = "triple.html";
			break;
	}
	location.href = creatNewUrl({url:pagename, notPushState:true});
}
window.onload = function()
{
	controlBox = document.body.querySelector(".control-box");
	statusLine = controlBox.querySelector(".status"); //显示当前状态的
	const helpLink = controlBox.querySelector(".help-link");
	changeSwapToCopy = controlBox.querySelector("#change-swap-to-copy");
	interchangeSVG = document.body.querySelector("#interchange-line");
	interchangePath = interchangeSVG.querySelector("g line");
	toggleShowMonId();
	toggleShowMonSkillCd();

	formationBox = document.body.querySelector(".formation-box");

	editBox = document.body.querySelector(".edit-box");


	if (location.hostname.indexOf("gitee")>=0)
	{
		helpLink.hostname = "gitee.com";
	}

	//▼添加语言列表开始
	const langSelectDom = controlBox.querySelector(".languages");
	languageList.forEach(function(l){
		langSelectDom.options.add(new Option(l.name,l.i18n));
	});

	const parameter_i18n =  getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
	const browser_i18n = (navigator.language || navigator.userLanguage); //获取浏览器语言
	let havingLanguage = languageList.filter(function(l){ //筛选出符合的语言
		if (parameter_i18n) //如果已指定就用指定的语言
			return parameter_i18n.indexOf(l.i18n)>=0;
		else //否则筛选浏览器默认语言
			return browser_i18n.indexOf(l.i18n)>=0;
	});
	currentLanguage = havingLanguage.length ?
					havingLanguage.pop() : //有语言使用最后一个
					languageList[0]; //没有找到指定语言的情况下，自动用第一个语言（英语）
	document.head.querySelector("#language-css").href = "languages/"+currentLanguage.i18n+".css";

	const langOptionArray = Array.prototype.slice.call(langSelectDom.options);
	langOptionArray.some(function(langOpt){
		if (langOpt.value == currentLanguage.i18n)
		{
			langOpt.selected = true;
			return true;
		}
	});
	//▲添加语言列表结束
	//▼添加数据来源列表开始
	const dataSelectDom = controlBox.querySelector(".datasource");
	dataSourceList.forEach(function(ds){
		dataSelectDom.options.add(new Option(ds.source,ds.code));
	});
	const parameter_dsCode =  getQueryString("s"); //获取参数指定的数据来源
	let havingDataSource = dataSourceList.filter(function(ds){ //筛选出符合的数据源
		return ds.code == parameter_dsCode;
	});
	currentDataSource = havingDataSource.length ? havingDataSource[0]: dataSourceList[0];
	document.body.classList.add("ds-"+currentDataSource.code);
	let dataSourceOptionArray = Array.prototype.slice.call(dataSelectDom.options);
	dataSourceOptionArray.some(function(dataOpt){
		if (dataOpt.value == currentDataSource.code)
		{
			dataOpt.selected = true;
			return true;
		}
	});
	const sourceDataFolder = "monsters-info";
	statusLine.classList.add("loading-check-version");
	GM_xmlhttpRequest({
		method: "GET",
		url: `${sourceDataFolder}/ckey.json`, //版本文件
		onload: function(response) {
			dealCkeyData(response.response);
		},
		onerror: function(response) {
			let isChrome = navigator.userAgent.indexOf("Chrome") >=0;
			if (isChrome && location.host.length==0 && response.response.length>0)
			{
				console.info("因为是Chrome本地打开，正在尝试读取JSON");
				dealCkeyData(response.response);
			}else
			{
				console.error("Ckey JSON数据获取失败",response);
			}
		}
	});
	//处理返回的数据
	function dealCkeyData(responseText)
	{ //处理数据版本
		try
		{
			newCkeys = JSON.parse(responseText);
		}catch(e)
		{
			console.log("Ckey数据JSON解码出错",e);
			return;
		}
		const currentCkey = newCkeys.find(ckey=>ckey.code == currentDataSource.code); //获取当前语言的ckey
		lastCkeys = GM_getValue("PADDF-ckey"); //读取本地储存的原来的ckey
		try
		{
			lastCkeys = JSON.parse(lastCkeys);
			if (lastCkeys == null || !(lastCkeys instanceof Array))
				lastCkeys = [];
		}catch(e)
		{
			console.log("上次的Ckey数据JSON解码出错",e);
			return;
		}
		let lastCurrentCkeys = lastCkeys.find(ckey=>ckey.code == currentDataSource.code);
		if (!lastCurrentCkeys)
		{ //如果未找到上个ckey，则添加个新的
			lastCurrentCkeys = {
				code: currentDataSource.code,
				ckey: {},
				updateTime: null
			}
			lastCkeys.push(lastCurrentCkeys);
		}

		statusLine.classList.remove("loading-check-version");
		statusLine.classList.add("loading-mon-info");
		if (currentCkey.ckey.card == lastCurrentCkeys.ckey.card)
		{
			console.log("Cards ckey相等，直接读取已有的数据",currentCkey.ckey.card);
			localforage.getItem(`PADDF-${currentDataSource.code}-cards`).then(function(value) {
				// This code runs once the value has been loaded
				// from the offline store.
				dealCardsData(value);
			}).catch(function(err) {
				// This code runs if there were any errors
				alert("Local Database error. Please refresh.");
				GM_deleteValue("PADDF-ckey");
				console.log(err);
			});
		}else
		{
			GM_xmlhttpRequest({
				method: "GET",
				url:`${sourceDataFolder}/mon_${currentDataSource.code}.json`, //Cards数据文件
				onload: function(response) {
					console.log("Cards ckey变化，储存新数据",currentCkey.ckey.card);
					localforage.setItem(`PADDF-${currentDataSource.code}-cards`, response.response).then(function(){
						lastCurrentCkeys.ckey.card = currentCkey.ckey.card;
						lastCurrentCkeys.updateTime = currentCkey.updateTime;
						GM_setValue("PADDF-ckey", JSON.stringify(lastCkeys));
						dealCardsData(response.response);
					}).catch(function(err) {
						// This code runs if there were any errors
						console.log(err);
					});
				},
				onerror: function(response) {
					let isChrome = navigator.userAgent.indexOf("Chrome") >=0;
					if (isChrome && location.host.length==0 && response.response.length>0)
					{
						console.info("因为是Chrome本地打开，正在尝试读取JSON");
						dealCardsData(response.response);
					}else
					{
						console.error("Cards JSON数据获取失败",response);
					}
				}
			});
		}
	}
	function dealCardsData(responseText)
	{
		try
		{
			Cards = JSON.parse(responseText);
		}catch(e)
		{
			console.log("Cards数据JSON解码出错",e);
			return;
		}
		statusLine.classList.remove("loading-mon-info");

		statusLine.classList.add("loading-skill-info");
		const currentCkey = newCkeys.find(ckey=>ckey.code == currentDataSource.code); //获取当前语言的ckey
		const lastCurrentCkeys = lastCkeys.find(ckey=>ckey.code == currentDataSource.code);
		if (currentCkey.ckey.skill == lastCurrentCkeys.ckey.skill)
		{
			console.log("Skills ckey相等，直接读取已有的数据",currentCkey.ckey.skill);
			localforage.getItem(`PADDF-${currentDataSource.code}-skills`).then(function(value) {
				// This code runs once the value has been loaded
				// from the offline store.
				dealSkillData(value);
			}).catch(function(err) {
				// This code runs if there were any errors
				alert("Local Database error. Please refresh.");
				GM_deleteValue("PADDF-ckey");
				console.log(err);
			});
		}else
		{
			GM_xmlhttpRequest({
				method: "GET",
				url:`${sourceDataFolder}/skill_${currentDataSource.code}.json`, //Skills数据文件
				onload: function(response) {
					console.log("Skills ckey变化，储存新数据",currentCkey.ckey.skill);
					localforage.setItem(`PADDF-${currentDataSource.code}-skills`, response.response).then(function(){
						lastCurrentCkeys.ckey.skill = currentCkey.ckey.skill;
						lastCurrentCkeys.updateTime = currentCkey.updateTime;
						GM_setValue("PADDF-ckey", JSON.stringify(lastCkeys));
						dealSkillData(response.response);
					}).catch(function(err) {
						// This code runs if there were any errors
						console.log(err);
					});
				},
				onerror: function(response) {
					let isChrome = navigator.userAgent.indexOf("Chrome") >=0;
					if (isChrome && location.host.length==0 && response.response.length>0)
					{
						console.info("因为是Chrome本地打开，正在尝试读取JSON");
						dealSkillData(response.response);
					}else
					{
						console.error("Skills JSON数据获取失败",response);
					}
				}
			});
		}
	}
	function dealSkillData(responseText)
	{
		try
		{
			Skills = JSON.parse(responseText);
		}catch(e)
		{
			console.log("Skills数据JSON解码出错",e);
			return;
		}
		const currentCkey = newCkeys.find(ckey=>ckey.code == currentDataSource.code); 
		const updateTime = controlBox.querySelector(".datasource-updatetime");
		updateTime.innerHTML = new Date(currentCkey.updateTime).toLocaleString();

		initialize();//初始化
		statusLine.classList.remove("loading-skill-info");
		//如果通过的话就载入URL中的怪物数据
		reloadFormationData();
	}
};
//重新读取URL中的Data数据并刷新页面
function reloadFormationData()
{
	let formationData;
	try
	{
		const parameterDataString = getQueryString("d") || getQueryString("data");
		if (parameterDataString)
		{
			formationData = JSON.parse(parameterDataString);
		}
	}catch(e)
	{
		console.error("URL中队伍数据JSON解码出错",e);
		return;
	}
	if (formationData)
	{
		formation.loadObj(formationData);
		refreshAll(formation);
	}
}
window.onpopstate = reloadFormationData; //前进后退时修改页面
//创建新的分享地址
function creatNewUrl(arg){
	if (arg == undefined) arg = {};
	if (!!(window.history && history.pushState))
	{ // 支持History API
		const language_i18n = arg.language || getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
		const datasource = arg.datasource || getQueryString("s");
		const outObj = formation.outObj();
		
		const newSearch = new URLSearchParams();
		if (language_i18n) newSearch.set("l",language_i18n);
		if (datasource && datasource!="ja") newSearch.set("s",datasource);
		if (outObj) newSearch.set("d", JSON.stringify(outObj));

		const newUrl = (arg.url || "") + '?' + newSearch.toString();

		if (!arg.notPushState)
		{
			history.pushState(null, null, newUrl);
		}
		else
		{
			return newUrl;
		}
	}
}
//截图
function capture()
{
	statusLine.classList.add("prepare-cauture");
	const titleBox = formationBox.querySelector(".title-box");
	const detailBox = formationBox.querySelector(".detail-box");
	const txtTitle = titleBox.querySelector(".title");
	const txtDetail = detailBox.querySelector(".detail");
	//去掉可能的空白文字的编辑状态
	titleBox.classList.remove("edit");
	detailBox.classList.remove("edit");
	const downLink = controlBox.querySelector(".down-capture");
	html2canvas(formationBox).then(canvas => {
		canvas.toBlob(function(blob) {
			window.URL.revokeObjectURL(downLink.href);
			downLink.href = URL.createObjectURL(blob);
			downLink.download = `${teamsCount}P formation cauture.png`;
			downLink.click();
			statusLine.classList.remove("prepare-cauture");
			//如果是空白文字，加回编辑状态
			if (txtTitle.value.length==0)
				titleBox.classList.add("edit");
			if (txtDetail.value.length==0)
				detailBox.classList.add("edit");
		  });
		//document.body.appendChild(canvas);
	});
}
//初始化
function initialize()
{
	const monstersList = editBox.querySelector("#monsters-name-list");
	let fragment = document.createDocumentFragment();
	const linkReg = "link:(\\d+)";
	Cards.forEach(function(m){ //添加下拉框候选
		const opt = fragment.appendChild(document.createElement("option"));
		opt.value = m.id;
		opt.label = m.id + " - " +  returnMonsterNameArr(m, currentLanguage.searchlist, currentDataSource.code).join(" | ");

		const linkRes = new RegExp(linkReg,"ig").exec(m.specialAttribute);
		if (linkRes)
		{//每个有链接的符卡，把它们被链接的符卡的进化根修改到链接前的
			let _m = Cards[parseInt(linkRes[1],10)];
			_m.evoRootId = m.evoRootId;
		}
	});
	monstersList.appendChild(fragment);

	//标题和介绍文本框
	const titleBox = formationBox.querySelector(".title-box");
	const detailBox = formationBox.querySelector(".detail-box");
	const txtTitle = titleBox.querySelector(".title");
	const txtDetail = detailBox.querySelector(".detail");
	const txtTitleDisplay = titleBox.querySelector(".title-display");
	const txtDetailDisplay = detailBox.querySelector(".detail-display");
	txtTitle.onchange = function(){
		formation.title = this.value;
		//txtTitleDisplay.innerHTML = "";
		//txtTitleDisplay.appendChild(document.createTextNode(this.value));
		txtTitleDisplay.innerHTML = descriptionToHTML(this.value);
		creatNewUrl();
	};
	txtTitle.onblur = function(){
		if (this.value.length>0)
			titleBox.classList.remove("edit");
	};
	txtDetail.onchange = function(){
		formation.detail = this.value;
		/*txtDetailDisplay.innerHTML = "";
		const txtDetailLines = this.value.split("\n");
		txtDetailLines.forEach((line,idx)=>{
			if (idx>0) txtDetailDisplay.appendChild(document.createElement("br"));
			txtDetailDisplay.appendChild(document.createTextNode(line));
		});*/
		txtDetailDisplay.innerHTML = descriptionToHTML(this.value);
		creatNewUrl();
	};
	txtDetail.onblur = function(){
		if (this.value.length>0)
			detailBox.classList.remove("edit");
		this.style.height = txtDetailDisplay.scrollHeight+"px";
	};
	txtTitleDisplay.onclick = function(){
		titleBox.classList.add("edit");
		txtTitle.focus();
	};
	txtDetailDisplay.onclick = function(){
		detailBox.classList.add("edit");
		txtDetail.focus();
	};

	for (let ti=0,ti_len=formationBox.querySelectorAll(".team-bigbox").length;ti<ti_len;ti++)
	{
		teamBigBoxs.push(formationBox.querySelector(`.teams .team-${ti+1}`));
	}
	
	//将所有怪物头像添加到全局数组
	teamBigBoxs.forEach(teamBigBox=>{
		const teamBox = teamBigBox.querySelector(".team-box");
		const menbers = Array.prototype.slice.call(teamBox.querySelectorAll(".team-members .monster"));
		const assist = Array.prototype.slice.call(teamBox.querySelectorAll(".team-assist .monster"));
		menbers.forEach(m=>{
			allMembers.push(m);
		});
		assist.forEach(m=>{
			allMembers.push(m);
		});
	});
	//所有怪物头像，添加拖动交换的代码
	allMembers.forEach(m=>{
		//点击
		m.onclick = clickMonHead;
		//拖动
		m.draggable = true;
		m.ondragstart = dragStartMonHead;
		m.ondragover = dropOverMonHead;
		m.ondrop = dropMonHead;
		//触摸
		m.ontouchstart = touchstartMonHead;
		m.ontouchmove = touchmoveMonHead;
		m.ontouchend = touchendMonHead;
		m.ontouchcancel = touchcancelMonHead;
	});

	//添加徽章
	const className_ChoseBadges = "show-all-badges";
	teamBigBoxs.forEach(tb=>{
		//徽章
		const teamBadge = tb.querySelector(".team-badge");
		if (!teamBadge) return;
		const badges = Array.prototype.slice.call(teamBadge.querySelectorAll(".badge-bg"));
		badges.forEach((badge,bidx) => {
			badge.onclick = function(){
				if (teamBadge.classList.contains(className_ChoseBadges))
				{
					teamBadge.classList.remove(className_ChoseBadges);
					formation.badge = bidx;
					refreshTotalHP(formation.teams[0]);
					creatNewUrl();
				}else
				{
					teamBadge.classList.add(className_ChoseBadges);
				}
			};
		});
	});

	//编辑框
	editBox.mid = null; //储存怪物id
	editBox.awokenCount = 0; //储存怪物潜觉数量
	editBox.latent = []; //储存潜在觉醒
	editBox.isAssist = false; //储存是否为辅助宠物
	editBox.monsterHead = null;
	editBox.latentBox = null;
	editBox.memberIdx = []; //储存队伍数组下标
	editBox.show = function(){
		this.classList.remove("display-none");
		formationBox.classList.add("blur-bg");
		controlBox.classList.add("blur-bg");
	};
	editBox.hide = function(){
		this.classList.add("display-none");
		formationBox.classList.remove("blur-bg");
		controlBox.classList.remove("blur-bg");
	};

	const smonsterinfoBox = editBox.querySelector(".monsterinfo-box");
	const mSeriesId = smonsterinfoBox.querySelector(".monster-seriesId");
	mSeriesId.onclick = function(){ //搜索系列
		const seriesId = parseInt(this.getAttribute('data-seriesId'),10);
		if (seriesId>0)
		{
			showSearch(Cards.filter(card=>{return card.seriesId == seriesId;}));
		}
	};
	const mCollabId = smonsterinfoBox.querySelector(".monster-collabId");
	mCollabId.onclick = function(){ //搜索合作
		const collabId = parseInt(this.getAttribute('data-collabId'),10);
		if (collabId>0);
		{
			searchColla(collabId);
		}
	};
	const mAltName = smonsterinfoBox.querySelector(".monster-altName");
	mAltName.onclick = function(){ //搜索合作
		const altName = this.getAttribute('data-altName');
		const splitAltName = altName.split("|");
		if (altName.length>0);
		{
			showSearch(Cards.filter(card=>{
				return splitAltName.some(alt=>{
					return alt.length > 0 && (card.altName.indexOf(alt)>=0 || card.name.indexOf(alt)>=0);
				});
			}));
		}
	};
	//创建一个新的怪物头像
	editBox.createCardHead = function(id)
	{
		function clickHeadToNewMon()
		{
			monstersID.value = this.getAttribute("data-cardid");
			monstersID.onchange();
			return false;
		}
		const cli = document.createElement("li");
		const cdom = cli.head = createCardA(id);
		cli.appendChild(cdom);
		changeid({id:id},cdom);
		cdom.onclick = clickHeadToNewMon;
		cli.card = Cards[id];
		return cli;
	};

	const searchBox = editBox.querySelector(".search-box");
	const settingBox = editBox.querySelector(".setting-box");
	const searchOpen = settingBox.querySelector(".row-mon-id .open-search");
	searchOpen.onclick = function(){
		s_includeSuperAwoken.onclick();
		s_canAssist.onclick();
		searchBox.classList.toggle("display-none");
	};

	const s_attr1s = Array.prototype.slice.call(searchBox.querySelectorAll(".attrs .attr-list-1 .attr-radio"));
	const s_attr2s = Array.prototype.slice.call(searchBox.querySelectorAll(".attrs .attr-list-2 .attr-radio"));
	const s_fixMainColor = searchBox.querySelector("#fix-main-color");
	const s_types = Array.prototype.slice.call(searchBox.querySelectorAll(".types-div .type-check"));
	const s_awokensItems = Array.prototype.slice.call(searchBox.querySelectorAll(".awoken-div .awoken-count"));
	const s_awokensIcons = s_awokensItems.map(it=>{
		return it.querySelector(".awoken-icon");
	});
	const s_awokensCounts = s_awokensItems.map(it=>{
		return it.querySelector(".count");
	});
	
	const searchMonList = searchBox.querySelector(".search-mon-list"); //搜索结果列表

	const s_awokensEquivalent = searchBox.querySelector("#consider-equivalent-awoken"); //搜索等效觉醒
	const s_canAssist = searchBox.querySelector("#can-assist"); //只搜索辅助
	s_canAssist.onclick = function(){
		if (this.checked)
		searchMonList.classList.add("only-display-can-assist");
		else
		searchMonList.classList.remove("only-display-can-assist");
	}

	const s_sawokenDiv = searchBox.querySelector(".sawoken-div");
	
	const s_sawokens = Array.prototype.slice.call(s_sawokenDiv.querySelectorAll(".sawoken-check"));
	const s_includeSuperAwoken = searchBox.querySelector("#include-super-awoken"); //搜索超觉醒
	s_includeSuperAwoken.onclick = function(){
		if (this.checked)
		s_sawokenDiv.classList.add("display-none");
		else
		s_sawokenDiv.classList.remove("display-none");
	}

	function search_awokenAdd1()
	{
		const countDom = this.parentNode.querySelector(".count");
		let count = parseInt(countDom.innerHTML,10);
		if (count<9)
		{
			count++;
			countDom.innerHTML = count;
			this.parentNode.classList.remove("zero");
		}
	}
	s_awokensIcons.forEach((b,idx)=>{ //每种觉醒增加1
		b.onclick = search_awokenAdd1;
	});
	function search_awokenSub1()
	{
		let count = parseInt(this.innerHTML,10);
		if (count>0)
		{
			count--;
			this.innerHTML = count;
			if (count === 0)
			{
				this.parentNode.classList.add("zero");
			}
		}
	}
	s_awokensCounts.forEach((b,idx)=>{ //每种觉醒减少1
		b.onclick = search_awokenSub1;
	});

	const awokenClear = searchBox.querySelector(".awoken-div .awoken-clear");
	const sawokenClear = searchBox.querySelector(".sawoken-div .sawoken-clear");
	awokenClear.onclick = function(){ //清空觉醒选项
		s_awokensCounts.forEach(t=>{
			t.innerHTML = 0;
		});
		s_awokensItems.forEach(t=>{
			t.classList.add("zero");
		});
	};
	sawokenClear.onclick = function(){ //清空超觉醒选项
		s_sawokens.forEach(t=>{
			t.checked = false;
		});
	};

	const s_controlDiv = searchBox.querySelector(".control-div");
	const searchStart = s_controlDiv.querySelector(".search-start");
	const searchClose = s_controlDiv.querySelector(".search-close");
	const searchClear = s_controlDiv.querySelector(".search-clear");
	function returnCheckedInput(ipt)
	{
		return ipt.checked == true;
	}
	function returnInputValue(ipt)
	{
		return ipt.value;
	}
	function Str2Int(str)
	{
		return parseInt(str, 10);
	}
	//将搜索结果显示出来（也可用于其他的搜索）
	showSearch = function(searchArr){
		editBox.show();
		searchBox.classList.remove("display-none");
		const createCardHead = editBox.createCardHead;

		searchMonList.classList.add("display-none");
		searchMonList.innerHTML = "";
		if (searchArr.length>0)
		{
			let fragment = document.createDocumentFragment(); //创建节点用的临时空间
			
			const sortIndex = parseInt(s_sortList.value,10);
			const reverse = s_sortReverse.checked;
			const sortFunction = sort_function_list[sortIndex].function;
			searchArr.sort((card_a,card_b)=>{
				let sortNumber = sortFunction(card_a,card_b);
				if (reverse) sortNumber *= -1;
				return sortNumber;
			});
			searchArr.forEach(function(card){
				const cli = createCardHead(card.id);
				fragment.appendChild(cli);
			});
			searchMonList.appendChild(fragment);
		}
		searchMonList.classList.remove("display-none");
	};
	const startSearch = function(cards){
		const attr1Filter = s_attr1s.filter(returnCheckedInput).map(returnInputValue);
		const attr2Filter = s_attr2s.filter(returnCheckedInput).map(returnInputValue);
		let attr1,attr2;
		if (attr1Filter.length>0)
		{
			if (!isNaN(attr1Filter[0]))
			{
				attr1 = parseInt(attr1Filter[0],10);
			}else
			{
				attr1 = null;
			}
		}
		if (attr2Filter.length>0)
		{
			if (!isNaN(attr2Filter[0]))
			{
				attr2 = parseInt(attr2Filter[0],10);
			}else
			{
				attr2 = null;
			}
		}
		const typesFilter = s_types.filter(returnCheckedInput).map(returnInputValue).map(Str2Int);
		const sawokensFilter = s_sawokens.filter(returnCheckedInput).map(returnInputValue).map(Str2Int);
		const awokensFilter = s_awokensCounts.filter(btn=>parseInt(btn.innerHTML,10)>0).map(btn=>{
			return {id:parseInt(btn.value,10),num:parseInt(btn.innerHTML,10)};
		});
		const searchResult = searchCards(cards,
			attr1,attr2,
			s_fixMainColor.checked,
			typesFilter,
			awokensFilter,
			sawokensFilter,
			s_awokensEquivalent.checked,
			s_includeSuperAwoken.checked
			);
		console.debug("搜索条件：属性[%d,%d]，固定主副%s，类型：%o，觉醒：%o，超觉醒：%o，等效觉醒%s，搜超觉醒%s。\n搜索结果：%o",
			attr1,attr2,
			s_fixMainColor.checked,
			typesFilter,
			awokensFilter,
			sawokensFilter,
			s_awokensEquivalent.checked,
			s_includeSuperAwoken.checked,
			searchResult
			);
		showSearch(searchResult);
	};
	searchBox.startSearch = startSearch;
	searchStart.onclick = function(){
		startSearch(Cards);
	};
	searchClose.onclick = function(){
		searchBox.classList.add("display-none");
	};
	searchClear.onclick = function(){ //清空搜索选项
		s_attr1s[0].checked = true;
		s_attr2s[0].checked = true;
		s_types.forEach(t=>{
			t.checked = false;
		});
		s_awokensCounts.forEach(t=>{
			t.innerHTML = 0;
		});
		s_awokensItems.forEach(t=>{
			t.classList.add("zero");
		});
		s_awokensEquivalent.checked = false;
		s_includeSuperAwoken.checked = false;
		
		s_sawokens.forEach(t=>{
			t.checked = false;
		});

		searchMonList.innerHTML = "";
	};

	const s_sortList = s_controlDiv.querySelector(".sort-list");
	const s_sortReverse = s_controlDiv.querySelector("#sort-reverse");
	//对搜索到的Cards重新排序
	function reSortCards()
	{
		const sortIndex = parseInt(s_sortList.value,10);
		const reverse = s_sortReverse.checked;

		searchMonList.classList.add("display-none");
		let fragment = document.createDocumentFragment(); //创建节点用的临时空间
		let headsArray = Array.prototype.slice.call(searchMonList.children);
		headsArray.sort((head_a,head_b)=>{
			let sortNumber = sort_function_list[sortIndex].function(head_a.card,head_b.card);
			if (reverse) sortNumber *= -1;
			return sortNumber;
		});
		headsArray.forEach(h=>fragment.appendChild(h));
		searchMonList.appendChild(fragment);
		searchMonList.classList.remove("display-none");
	}
	s_sortList.onchange = reSortCards;
	s_sortReverse.onchange = reSortCards;
	sort_function_list.forEach((sfunc,idx)=>{
		const newOpt = new Option(sfunc.name,idx);
		newOpt.setAttribute("data-tag",sfunc.tag);
		s_sortList.options.add(newOpt);
	});

	//id搜索
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	monstersID.onchange = function(){
		if (/^\d+$/.test(this.value))
		{
			const newId = parseInt(this.value, 10);
			if (editBox.mid != newId) //避免多次运行oninput、onchange
			{
				editBox.mid = newId;
				editBoxChangeMonId(editBox.mid);
			}
		}
	};
	monstersID.oninput = monstersID.onchange;
	//觉醒
	const monEditAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".row-mon-awoken .awoken-ul .awoken-icon"));
	monEditAwokens.forEach((akDom,idx)=>{
		akDom.onclick = function(){
			editBox.awokenCount = idx;
			editBox.reCalculateAbility();
			editBox.refreshAwokens();
		};
	});
	//刷新觉醒
	editBox.refreshAwokens = ()=>{
		monEditAwokens[0].innerHTML = editBox.awokenCount;
		if (editBox.awokenCount>0 && editBox.awokenCount==(Cards[editBox.mid].awakenings.length))
			monEditAwokens[0].classList.add("full-awoken");
		else
			monEditAwokens[0].classList.remove("full-awoken");
		for(let ai=1;ai<monEditAwokens.length;ai++)
		{
			if(ai<=editBox.awokenCount)
			{
				monEditAwokens[ai].classList.remove("unselected-awoken");
			}
			else
			{
				monEditAwokens[ai].classList.add("unselected-awoken");
			}
		}
	};

	//超觉醒
	let monEditSAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".row-mon-super-awoken .awoken-ul .awoken-icon"));
	monEditSAwokens.forEach((akDom,idx,domArr)=>{
		akDom.onclick = function(){
			for(var ai=0;ai<domArr.length;ai++)
			{
				if(ai==idx)
				{
					domArr[ai].classList.toggle("unselected-awoken");
				}
				else
				{
					domArr[ai].classList.add("unselected-awoken");
				}
			}
		};
	});

	//3个快速设置this.ipt为自己的value
	function setIptToMyValue()
	{
		if (this.ipt.value != this.value)
		{
			this.ipt.value = this.value;
			this.ipt.onchange();
		}
	}
	//等级
	const monEditLv = settingBox.querySelector(".m-level");
	monEditLv.onchange = function(){
		reCalculateExp();
		reCalculateAbility();
	};
	const monEditLvMin = settingBox.querySelector(".m-level-btn-min");
	const monLvExp = settingBox.querySelector(".m-level-exp");
	monEditLvMin.ipt = monEditLv;
	monEditLvMin.onclick = setIptToMyValue;
	const monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.ipt = monEditLv;
	monEditLvMax.onclick = setIptToMyValue;
	const monEditLv110 = settingBox.querySelector(".m-level-btn-110");
	monEditLv110.ipt = monEditLv;
	monEditLv110.onclick = setIptToMyValue;
	//编辑界面重新计算怪物的经验值
	function reCalculateExp(){
		const monid = parseInt(monstersID.value || 0, 10);
		const level = parseInt(monEditLv.value || 0, 10);
		const tempMon = {
			id:monid,
			level:level
		};
		const needExp = calculateExp(tempMon);
		monLvExp.innerHTML = needExp ? parseBigNumber(needExp[0]) + (level>99?` + ${parseBigNumber(needExp[1])}` : "") : "";
	}
	editBox.reCalculateExp = reCalculateExp;
	//三维
	const rowMonAbility = settingBox.querySelector(".row-mon-ability");
	const monEditHpValue = rowMonAbility.querySelector(".m-hp-li .ability-value");
	const monEditAtkValue = rowMonAbility.querySelector(".m-atk-li .ability-value");
	const monEditRcvValue = rowMonAbility.querySelector(".m-rcv-li .ability-value");
	//加蛋
	const rowMonPlus = settingBox.querySelector(".row-mon-plus");
	const monEditAddHpLi = rowMonPlus.querySelector(".m-hp-li");
	const monEditAddAtkLi = rowMonPlus.querySelector(".m-atk-li");
	const monEditAddRcvLi = rowMonPlus.querySelector(".m-rcv-li");
	const monEditAddHp = monEditAddHpLi.querySelector(".m-plus-hp");
	monEditAddHp.onchange = reCalculateAbility;
	const monEditAddAtk = monEditAddAtkLi.querySelector(".m-plus-atk");
	monEditAddAtk.onchange = reCalculateAbility;
	const monEditAddRcv = monEditAddRcvLi.querySelector(".m-plus-rcv");
	monEditAddRcv.onchange = reCalculateAbility;
	//3个快速设置按钮
	const monEditAddHpBtn = monEditAddHpLi.querySelector(".m-plus-btn");
	monEditAddHpBtn.ipt = monEditAddHp;
	monEditAddHpBtn.onclick = setIptToMyValue;
	const monEditAddAtkBtn = monEditAddAtkLi.querySelector(".m-plus-btn");
	monEditAddAtkBtn.ipt = monEditAddAtk;
	monEditAddAtkBtn.onclick = setIptToMyValue;
	const monEditAddRcvBtn = monEditAddRcvLi.querySelector(".m-plus-btn");
	monEditAddRcvBtn.ipt = monEditAddRcv;
	monEditAddRcvBtn.onclick = setIptToMyValue;
	//297按钮
	const monEditAdd297 = rowMonPlus.querySelector(".m-plus-btn-297");
	monEditAdd297.onclick = function(){
		monEditAddHp.value = 99;
		monEditAddAtk.value = 99;
		monEditAddRcv.value = 99;
		reCalculateAbility();
	};
	
	//潜觉
	const monEditLatentUl = settingBox.querySelector(".m-latent-ul");
	const monEditLatents = Array.prototype.slice.call(monEditLatentUl.querySelectorAll("li"));
	const monEditLatentAllowableUl = settingBox.querySelector(".m-latent-allowable-ul");
	const monEditLatentsAllowable = Array.prototype.slice.call(monEditLatentAllowableUl.querySelectorAll("li"));
	editBox.refreshLatent = function(latent,monid) //刷新潜觉
	{
		const maxLatentCount = getMaxLatentCount(monid); //最大潜觉数量
		const usedHoleN = usedHole(latent);
		for (let ai=0;ai<monEditLatents.length;ai++)
		{
			if (latent[ai] != undefined)
			{
				monEditLatents[ai].className = "latent-icon latent-icon-" + latent[ai];
			}
			else if(ai<(maxLatentCount-usedHoleN+latent.length))
			{
				monEditLatents[ai].className = "latent-icon";
			}
			else
			{
				monEditLatents[ai].className = "display-none";
			}
		}
	};

	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");

	skillTitle.onclick = function(){
		const skillId = parseInt(this.getAttribute("data-skillid"),10); //获得当前技能ID
		const s_cards = Cards.filter(card=>card.activeSkillId === skillId); //搜索同技能怪物
		if (s_cards.length > 1)
		{
			showSearch(s_cards); //显示
		}
	}
	skillLevel.onchange = function(){
		const card = Cards[editBox.mid] || Cards[0]; //怪物固定数据
		const skill = Skills[card.activeSkillId];
		skillCD.innerHTML = skill.initialCooldown - this.value + 1;
	};
	skillLevel_1.ipt = skillLevel;
	skillLevel_1.onclick = setIptToMyValue;
	skillLevel_Max.ipt = skillLevel;
	skillLevel_Max.onclick = setIptToMyValue;

	//已有觉醒的去除
	function deleteLatent(){
		const aIdx = parseInt(this.value, 10);
		editBox.latent.splice(aIdx,1);
		editBox.reCalculateAbility(); //重计算三维
		editBox.refreshLatent(editBox.latent,editBox.mid); //刷新潜觉
	}
	monEditLatents.forEach((la)=>{la.onclick = deleteLatent;});
	//可选觉醒的添加
	function addLatent(){
		if (this.classList.contains("unselected-latent")) return; //不能选的觉醒直接退出
		const lIdx = parseInt(this.value); //潜觉的序号
		const usedHoleN = usedHole(editBox.latent); //使用了的格子
		const maxLatentCount = getMaxLatentCount(editBox.mid); //最大潜觉数量
		if (lIdx >= 12 && usedHoleN<=(maxLatentCount-2) || //如果能添加2格的觉醒
			lIdx < 12 && usedHoleN<=(maxLatentCount-1)) //如果能添加1格的觉醒
		{editBox.latent.push(lIdx);}
		else {return;}
		editBox.reCalculateAbility();
		editBox.refreshLatent(editBox.latent,editBox.mid);
	}
	monEditLatentsAllowable.forEach((la)=>{la.onclick = addLatent;});

	//编辑界面重新计算怪物的能力
	function reCalculateAbility(){
		const monid = parseInt(monstersID.value || 0, 10);
		const level = parseInt(monEditLv.value || 0, 10);
		const awoken = editBox.awokenCount;
		const plus = [
			parseInt(monEditAddHp.value || 0, 10),
			parseInt(monEditAddAtk.value || 0, 10),
			parseInt(monEditAddRcv.value || 0, 10)
		];
		const latent = editBox.latent;
		const tempMon = {
			id:monid,
			level:level,
			plus:plus,
			awoken:awoken,
			latent:latent
		};
		const abilitys = calculateAbility(tempMon, null, true) || [0,0,0];

		monEditHpValue.innerHTML = abilitys[0].toLocaleString();
		monEditAtkValue.innerHTML = abilitys[1].toLocaleString();
		monEditRcvValue.innerHTML = abilitys[2].toLocaleString();
	}
	editBox.reCalculateAbility = reCalculateAbility;

	const btnCancel = editBox.querySelector(".button-cancel");
	const btnDone = editBox.querySelector(".button-done");
	const btnNull = editBox.querySelector(".button-null");
	const btnDelay = editBox.querySelector(".button-delay");
	btnCancel.onclick = function(){
		btnDone.classList.remove("cant-assist");
		btnDone.disabled = false;
		editBox.memberIdx = [];
		editBox.hide();
	};
	btnDone.onclick = function(){
		if (parseInt(monEditLv.value,10) == 0)
		{
			btnNull.onclick();
			return;
		}
		const mon = editBox.isAssist ? new MemberAssist() : new MemberTeam();
		const teamData = formation.teams[editBox.memberIdx[0]];
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamBox = teamBigBox.querySelector(".team-box");

		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		mon.id = parseInt(monstersID.value,10);
		const card = Cards[mon.id] || Cards[0];
		const skill = Skills[card.activeSkillId];

		mon.level = parseInt(monEditLv.value,10);
		mon.awoken = editBox.awokenCount;
		if (card.superAwakenings.length) //如果支持超觉醒
		{
			mon.sawoken = -1;
			for (var sai = 0;sai<monEditSAwokens.length;sai++)
			{
				if (
					!monEditSAwokens[sai].classList.contains("unselected-awoken") &&
					!monEditSAwokens[sai].classList.contains("display-none")
				)
				{
					mon.sawoken = sai;
					break;
				}
			}
		}
		
		if (card.types.some(t=>{return t == 0 || t == 12 || t == 14 || t == 15;}) &&
			(!card.overlay || mon.level>= card.maxLevel))
		{ //当4种特殊type的时候是无法297和打觉醒的，但是不能叠加的在未满级时可以
			mon.plus = [0,0,0]; 
		}else
		{
			mon.plus[0] = parseInt(monEditAddHp.value) || 0;
			mon.plus[1] = parseInt(monEditAddAtk.value) || 0;
			mon.plus[2] = parseInt(monEditAddRcv.value) || 0;
			if (!editBox.isAssist)
			{ //如果不是辅助，则可以设定潜觉
				mon.latent = editBox.latent.concat();
			}
		}

		const skillLevelNum = parseInt(skillLevel.value,10);
		if (skillLevelNum < skill.maxLevel)
		{
			mon.skilllevel = skillLevelNum;
		}
		changeid(mon,editBox.monsterHead,editBox.memberIdx[1] ? null : editBox.latentBox);

		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData);
		const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
		if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom,teamData);
		const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
		if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

		//刷新改队员的CD
		refreshMemberSkillCD(teamBox,teamData,editBox.memberIdx[2]); 
		creatNewUrl();
		editBox.hide();
	};
	window.onkeydown = function(e){
		if (!editBox.classList.contains("display-none"))
		{
			if (e.keyCode == 27)
			{ //按下ESC时，自动关闭编辑窗
				btnCancel.onclick();
			}
		}
	};
	btnNull.onclick = function(){ //空位置
		const mon = new Member();
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamData = formation.teams[editBox.memberIdx[0]];
		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		changeid(mon ,editBox.monsterHead, editBox.latentBox);
		
		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData);
		const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
		if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom,teamData);
		const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
		if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

		//刷新改队员的CD
		refreshMemberSkillCD(teamBigBox,teamData,editBox.memberIdx[2]); 

		creatNewUrl();
		editBox.hide();
	};
	btnDelay.onclick = function(){ //应对威吓
		const mon = new MemberDelay();
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamData = formation.teams[editBox.memberIdx[0]];
		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		changeid(mon, editBox.monsterHead, editBox.latentBox);
		
		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData);
		const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
		if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom,teamData);
		const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
		if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

		//刷新改队员的CD
		refreshMemberSkillCD(teamBigBox,teamData,editBox.memberIdx[2]); 

		creatNewUrl();
		editBox.hide();
	};
	
	//语言选择
	const langList = controlBox.querySelector(".languages");
	langList.onchange = function(){
		creatNewUrl({"language":this.value});
		history.go();
	};
	//数据源选择
	const dataList = controlBox.querySelector(".datasource");
	dataList.onchange = function(){
		creatNewUrl({datasource:this.value});
		history.go();
	};

	/*添对应语言执行的JS*/
	const languageJS = document.head.appendChild(document.createElement("script"));
	languageJS.id = "language-js";
	languageJS.type = "text/javascript";
	languageJS.src = "languages/"+currentLanguage.i18n+".js";
}
//编辑界面点击每个怪物的头像的处理
function clickMonHead(e)
{
	let team = parseInt(this.getAttribute("data-team"),10);
	let assist = parseInt(this.getAttribute("data-assist"),10);
	let index = parseInt(this.getAttribute("data-index"),10);
	editMon(team,assist,index);
	return false; //没有false将会打开链接
}
//编辑界面每个怪物的头像的拖动
function dragStartMonHead(e)
{
	let team = parseInt(this.getAttribute("data-team"),10);
	let assist = parseInt(this.getAttribute("data-assist"),10);
	let index = parseInt(this.getAttribute("data-index"),10);
	e.dataTransfer.setData('from',[team,assist,index].join(","));
}
//编辑界面每个怪物的头像的经过，阻止事件发生
function dropOverMonHead(e)
{
	e.preventDefault();
}
//从怪物头像获取队员的队伍编号
function getMemberArrayIndexFromMonHead(headDom)
{
	return [
		parseInt(headDom.getAttribute("data-team"),10),
		parseInt(headDom.getAttribute("data-assist"),10),
		parseInt(headDom.getAttribute("data-index"),10),
	];
}
//编辑界面每个怪物的头像的放下
function dropMonHead(e)
{
	const dataFrom = e.dataTransfer.getData('from').split(",").map((i)=>{return parseInt(i,10);});
	const dataTo = getMemberArrayIndexFromMonHead(this);

	if ((dataTo[0] != dataFrom[0]) ||
		(dataTo[1] != dataFrom[1]) ||
		(dataTo[2] != dataFrom[2]))
	{ //必须有所不同才继续交换
		interchangeCard(dataFrom,dataTo);
	}
	return false; //没有false将会打开链接
}
//移动端编辑界面每个怪物的头像的放下
function touchstartMonHead(e)
{
	e.stopPropagation();
	//console.log("开始触摸",e,this);
	const tc = e.changedTouches[0];
	interchangeSVG.style.display = "none";
	interchangePath.setAttribute("x1",tc.pageX);
	interchangePath.setAttribute("y1",tc.pageY);
	interchangePath.setAttribute("x2",tc.pageX);
	interchangePath.setAttribute("y2",tc.pageY);
}
//移动端编辑界面每个怪物的头像的移动
function touchmoveMonHead(e)
{
	//console.log("移动中",e,this);
	const tc = e.changedTouches[0];
	const pX = tc.pageX, pY = tc.pageY;
	const rect = this.getBoundingClientRect();
	const top = rect.top + document.documentElement.scrollTop;
	const left = rect.left + document.documentElement.scrollLeft;
	if ((pY < top) || (pY > (top + rect.height)) ||
	(pX < left) || (pX > (left + rect.width)))
	{
		interchangeSVG.style.display = "block";
		interchangePath.setAttribute("x2",tc.pageX);
		interchangePath.setAttribute("y2",tc.pageY);
	}else
	{
		interchangeSVG.style.display = "none";
	}
}
//移动端编辑界面每个怪物的头像的结束
function touchendMonHead(e)
{
	const tc = e.changedTouches[0];
	const pX = tc.pageX, pY = tc.pageY;
	//console.log("移动结束",pX,pY,e,this);
	interchangeSVG.style.display = "none";
	interchangePath.setAttribute("x2",pX);
	interchangePath.setAttribute("y2",tc.pageY);
	let targets = allMembers.filter(m=>{
		const rect = m.getBoundingClientRect();
		const top = rect.top + document.documentElement.scrollTop;
		const left = rect.left + document.documentElement.scrollLeft;
		const inRect = (pY > top) && (pY < (top + rect.height)) &&
						(pX > left) && (pX < (left + rect.width));
		return inRect;
	});
	const target = targets.length?targets[0]:null;
	if (this != target)
	{
		//console.log("找到的对象",targets[0]);
		let dataFrom = getMemberArrayIndexFromMonHead(this);
		let dataTo = getMemberArrayIndexFromMonHead(target);
	
		if ((dataTo[0] != dataFrom[0]) ||
			(dataTo[1] != dataFrom[1]) ||
			(dataTo[2] != dataFrom[2]))
		{ //必须有所不同才继续交换
			interchangeCard(dataFrom,dataTo);
		}
	}
}
//移动端编辑界面每个怪物的头像的取消
function touchcancelMonHead(e)
{
	interchangeSVG.style.display = "none";
	console.log("移动取消",e,this);
}
function interchangeCard(formArr,toArr)
{
	function changeType(member,isAssist)
	{
		if (member.id == 0 || (isAssist && member.id == -1))
		{
			return new Member();
		}else
		{
			const newMember = isAssist ? new MemberTeam() : new MemberAssist();
			newMember.loadFromMember(member);
			return newMember;
		}
	}
	const isCopy = changeSwapToCopy.checked;
	let from = formation.teams[formArr[0]][formArr[1]][formArr[2]];
	let to = formation.teams[toArr[0]][toArr[1]][toArr[2]];
	if(formArr[1] != toArr[1]) //从武器拖到非武器才改变类型
	{
		from = changeType(from,formArr[1]);
		if (!isCopy) to = changeType(to,toArr[1]);
	}else if (isCopy)
	{
		const newFrom = new from.constructor();
		newFrom.loadFromMember(from);
		from = newFrom;
	}
	formation.teams[toArr[0]][toArr[1]][toArr[2]] = from;
	if (!isCopy) formation.teams[formArr[0]][formArr[1]][formArr[2]] = to;

	creatNewUrl(); //刷新URL
	refreshAll(formation); //刷新全部
}
//改变一个怪物头像
function changeid(mon,monDom,latentDom)
{
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const parentNode = monDom.parentNode;
	fragment.appendChild(monDom);
	const monId = mon.id;
	const card = Cards[monId] || Cards[0]; //怪物固定数据
	monDom.setAttribute("data-cardid", monId); //设定新的id
	if (monId<0) //如果是延迟
	{
		parentNode.classList.add("delay");
		parentNode.classList.remove("null");
		parentNode.appendChild(fragment);
		if (latentDom) latentDom.classList.add("display-none");
		return;
	}else if (monId==0) //如果是空
	{
		parentNode.classList.add("null");
		parentNode.classList.remove("delay");
		parentNode.appendChild(fragment);
		if (latentDom) latentDom.classList.add("display-none");
		return;
	}else if (monId>-1) //如果提供了id
	{
		parentNode.classList.remove("null");
		parentNode.classList.remove("delay");
		monDom.className = "monster";
		monDom.classList.add("pet-cards-" + Math.ceil(monId/100)); //添加图片编号
		const idxInPage = (monId-1) % 100; //获取当前页面的总序号
		monDom.classList.add("pet-cards-index-x-" + idxInPage % 10); //添加X方向序号
		monDom.classList.add("pet-cards-index-y-" + parseInt(idxInPage / 10)); //添加Y方向序号
		monDom.querySelector(".property").className = "property property-" + card.attrs[0]; //主属性
		monDom.querySelector(".subproperty").className = "subproperty subproperty-" + card.attrs[1]; //副属性
		monDom.title = "No." + monId + " " + (card.otLangName ? (card.otLangName[currentLanguage.searchlist[0]] || card.name) : card.name);
		monDom.href = monId.toString().replace(/^(\d+)$/ig,currentLanguage.guideURL);
		if (card.canAssist)
			monDom.classList.add("allowable-assist");
		else
			monDom.classList.remove("allowable-assist");
		if (card.awakenings.indexOf(49)>=0)//武器
			monDom.classList.add("wepon");
		else
			monDom.classList.remove("wepon");
	}
	const levelDom = monDom.querySelector(".level");
	if (levelDom) //如果提供了等级
	{
		const level = mon.level || 1;
		levelDom.innerHTML = level;
		if (level == card.maxLevel)
		{ //如果等级刚好等于最大等级，则修改为“最大”的字
			levelDom.classList.add("max");
		}else
		{
			levelDom.classList.remove("max");
		}
		if (card.limitBreakIncr && level >= card.maxLevel)
		{ //如果支持超觉，并且等级超过99，就添加支持超觉的蓝色
			levelDom.classList.add("_110");
		}else
		{
			levelDom.classList.remove("_110");
		}
	}
	if (mon.awoken>-1) //如果提供了觉醒
	{
		const awokenIcon = monDom.querySelector(".awoken-count");
		if (mon.awoken == 0 || card.awakenings.length < 1 || !awokenIcon) //没觉醒
		{
			awokenIcon.classList.add("display-none");
			awokenIcon.innerHTML = "";
		}else
		{
			awokenIcon.classList.remove("display-none");
			awokenIcon.innerHTML = mon.awoken;
			if (mon.awoken == card.awakenings.length)
			{
				awokenIcon.classList.add("full-awoken");
			}else
			{
				awokenIcon.classList.remove("full-awoken");
			}
		}
	}
	const sawoken = monDom.querySelector(".super-awoken");
	if (sawoken) //如果存在超觉醒的DOM且提供了超觉醒
	{
		if (mon.sawoken != undefined && mon.sawoken>=0 && card.superAwakenings.length)
		{
			const sawokenIcon = sawoken.querySelector(".awoken-icon");
			sawoken.classList.remove("display-none");
			sawokenIcon.className = "awoken-icon awoken-" + card.superAwakenings[mon.sawoken];
		}else
		{
			sawoken.classList.add("display-none");
		}
	}
	const m_id = monDom.querySelector(".id");
	if (m_id) //怪物ID
	{
		m_id.innerHTML = monId;
	}
	const plusArr = mon.plus || [0,0,0];
	const plusDom = monDom.querySelector(".plus");
	if (plusArr && plusDom) //如果提供了加值，且怪物头像内有加值
	{
		plusDom.querySelector(".hp").innerHTML = plusArr[0];
		plusDom.querySelector(".atk").innerHTML = plusArr[1];
		plusDom.querySelector(".rcv").innerHTML = plusArr[2];
		var plusCount = plusArr[0]+plusArr[1]+plusArr[2];
		if (plusCount >= 297)
		{
			plusDom.classList.add("has297");
			plusDom.classList.remove("zero");
		}else if (plusCount <= 0)
		{
			plusDom.classList.add("zero");
			plusDom.classList.remove("has297");
		}else
		{
			plusDom.classList.remove("zero");
			plusDom.classList.remove("has297");
		}
	}
	if (latentDom)
	{
		let latentDoms = Array.prototype.slice.call(latentDom.querySelectorAll("li"));
		if (mon.latent) //如果提供了潜觉
		{
			let latent = mon.latent.sort(function(a,b){
				if(b>=12 && a<12) {return 1;} //如果大于12，就排到前面
				else if(b<12 && a>=12) {return -1;} //如果小于12就排到后面
				else {return 0;} //其他情况不变
			});
			if (latent.length < 1)
			{
				latentDom.classList.add("display-none");
			}else
			{
				latentDom.classList.remove("display-none");
			}
			let usedHoleN = usedHole(latent); //使用的格子数
			let maxLatentCount = getMaxLatentCount(mon.id); //最大潜觉数量
			for (let ai=0;ai<latentDoms.length;ai++)
			{
				if (latent[ai])
				{
					latentDoms[ai].className = "latent-icon latent-icon-" + latent[ai];
				}
				else if(ai<(maxLatentCount-usedHoleN+latent.length))
				{
					latentDoms[ai].className = "latent-icon";
				}
				else
				{
					latentDoms[ai].className = "display-none";
				}
			}
		}else
		{
			latentDom.classList.add("display-none");
		}
	}

	const skillCdDom = monDom.querySelector(".skill");
	if (skillCdDom) //如果存在技能CD DOM
	{
		//const skill = Skills[card.activeSkillId];
		if (card.activeSkillId == 0)
		{
			skillCdDom.classList.add("display-none");
		}else
		{
			skillCdDom.classList.remove("display-none");
		}
	}

	parentNode.appendChild(fragment);
}
//点击怪物头像，出现编辑窗
function editMon(teamNum,isAssist,indexInTeam)
{
	//数据
	const mon = formation.teams[teamNum][isAssist][indexInTeam];
	const card = Cards[mon.id] || Cards[0];
	//const teamBigBox = 
	const teamBigBox = teamBigBoxs[teamNum];
	const teamBox = teamBigBox.querySelector(".team-box");
	const memberBox = teamBox.querySelector(isAssist?".team-assist":".team-members");
	const memberLi = memberBox.querySelector(`.member-${indexInTeam+1}`);

	const monsterHead = memberLi.querySelector(".monster");

	editBox.show();

	editBox.isAssist = isAssist;
	editBox.monsterHead = monsterHead;
	editBox.memberIdx = [teamNum, isAssist, indexInTeam]; //储存队伍数组下标
	if (!isAssist)
	{
		const latentBox = teamBox.querySelector(".team-latents .latents-"+(indexInTeam+1)+" .latent-ul");
		editBox.latentBox = latentBox;
	}

	const settingBox = editBox.querySelector(".setting-box");
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	monstersID.value = mon.id > 0 ? mon.id : 0;
	monstersID.onchange();
	//觉醒
	const monEditAwokens = settingBox.querySelectorAll(".row-mon-awoken .awoken-ul .awoken-icon");
	if (mon.awoken > 0 && monEditAwokens[mon.awoken]) monEditAwokens[mon.awoken].onclick();
	//超觉醒
	const monEditSAwokens = settingBox.querySelectorAll(".row-mon-super-awoken .awoken-ul .awoken-icon");
	if (mon.sawoken >= 0 && monEditSAwokens[mon.sawoken] && monEditSAwokens[mon.sawoken].classList.contains("unselected-awoken")) monEditSAwokens[mon.sawoken].onclick();
	const monEditLv = settingBox.querySelector(".row-mon-level .m-level");
	monEditLv.value = mon.level || 1;
	const monEditAddHp = settingBox.querySelector(".row-mon-plus .m-plus-hp");
	const monEditAddAtk = settingBox.querySelector(".row-mon-plus .m-plus-atk");
	const monEditAddRcv = settingBox.querySelector(".row-mon-plus .m-plus-rcv");
	if (mon.plus)
	{
		monEditAddHp.value = mon.plus[0];
		monEditAddAtk.value = mon.plus[1];
		monEditAddRcv.value = mon.plus[2];
	}
	const rowMonLatent = settingBox.querySelector(".row-mon-latent");
	const skillLevel = settingBox.querySelector(".row-mon-skill .skill-box .m-skill-level");
	if (mon.skilllevel)
	{
		skillLevel.value = mon.skilllevel;
	}
	skillLevel.onchange();

	const editBoxTitle = editBox.querySelector(".edit-box-title");
	const btnDelay = editBox.querySelector(".button-box .button-delay");
	if (!isAssist)
	{
		editBox.latent = mon.latent ? mon.latent.concat() : [];
		editBox.refreshLatent(editBox.latent, mon.id);
		btnDelay.classList.add("display-none");
		rowMonLatent.classList.remove("display-none");
		editBoxTitle.classList.remove("edit-box-title-assist");
	}else
	{
		btnDelay.classList.remove("display-none");
		rowMonLatent.classList.add("display-none");
		editBoxTitle.classList.add("edit-box-title-assist");
	}
	editBox.reCalculateExp();
	editBox.reCalculateAbility();
}
//编辑窗，修改怪物ID
function editBoxChangeMonId(id)
{
	const card = Cards[id] || Cards[0]; //怪物固定数据
	if (card.id == 0){
		id = 0;
	}
	const skill = Skills[card.activeSkillId];
	const leaderSkill = Skills[card.leaderSkillId];

	let fragment = null;

	const monInfoBox = editBox.querySelector(".monsterinfo-box");
	const settingBox = editBox.querySelector(".setting-box");

	//id搜索
	const monHead = monInfoBox.querySelector(".monster");
	changeid({id:id},monHead); //改变图像
	const mId = monInfoBox.querySelector(".monster-id");
	mId.innerHTML = id;
	const mRare = monInfoBox.querySelector(".monster-rare");
	mRare.className = "monster-rare rare-" + card.rarity;
	const mCost = monInfoBox.querySelector(".monster-cost");
	mCost.innerHTML = card.cost;
	/*const mExp = monInfoBox.querySelector(".monster-exp");
	mExp.innerHTML = card.exp.max;*/
	const mName = monInfoBox.querySelector(".monster-name");
	mName.innerHTML = returnMonsterNameArr(card, currentLanguage.searchlist, currentDataSource.code)[0];
	const mSeriesId = monInfoBox.querySelector(".monster-seriesId");
	mSeriesId.innerHTML = card.seriesId;
	mSeriesId.setAttribute("data-seriesId",card.seriesId);
	if (card.seriesId == 0)
	{
		mSeriesId.classList.add("display-none");
	}else
	{
		mSeriesId.classList.remove("display-none");
	}
	const mCollabId = monInfoBox.querySelector(".monster-collabId");
	mCollabId.innerHTML = card.collabId;
	mCollabId.setAttribute("data-collabId",card.collabId);
	if (card.collabId == 0)
	{
		mCollabId.classList.add("display-none");
	}else
	{
		mCollabId.classList.remove("display-none");
	}
	const mAltName = monInfoBox.querySelector(".monster-altName");
	mAltName.innerHTML = card.altName;
	mAltName.setAttribute("data-altName",card.altName);
	/*const splitAltName = card.altName.split("|"); //取出分段的那种的第一段
	const hasGroup = splitAltName.some(alt=>{ //自己的名称是否只有一个
		return Cards.some(c=>{return c.id != card.id && c.altName.indexOf(alt)>=0;});
	});*/
	if (card.altName.length == 0)
	{ //当没有合作名
		mAltName.classList.add("display-none");
	}else
	{
		mAltName.classList.remove("display-none");
	}

	const evoCardUl = settingBox.querySelector(".row-mon-id .evo-card-list");
	evoCardUl.style.display = "none";
	evoCardUl.innerHTML = ""; //据说直接清空HTML性能更好

	const evoLinkCardsIdArray = Cards.filter(function(m){
		return m.evoRootId == card.evoRootId;
	}).map(function(m){return m.id;}); //筛选出相同进化链的

	const createCardHead = editBox.createCardHead;
	if (evoLinkCardsIdArray.length>1)
	{
		fragment = document.createDocumentFragment(); //创建节点用的临时空间
		evoLinkCardsIdArray.forEach(function(mid){
			const cli = createCardHead(mid);
			if (mid == id)
			{
				cli.classList.add("unable-monster");
			}
			fragment.appendChild(cli);
		});
		evoCardUl.appendChild(fragment);
		evoCardUl.style.display = "block";
	}

	const mType = monInfoBox.querySelectorAll(".monster-type li");
	for (let ti=0;ti<mType.length;ti++)
	{
		if (ti<card.types.length)
		{
			mType[ti].className = "type-name type-name-" + card.types[ti];
			mType[ti].firstChild.className = "type-icon type-icon-" + card.types[ti];
		}else
		{
			mType[ti].className = "display-none";
		}
	}

	const mAwoken = settingBox.querySelectorAll(".row-mon-awoken .awoken-ul li");
	editBox.awokenCount = card.awakenings.length;
	mAwoken[0].innerHTML = editBox.awokenCount ? "★" : "0";
	for (let ai=1;ai<mAwoken.length;ai++)
	{
		if (ai<=card.awakenings.length)
		{
			mAwoken[ai].className = "awoken-icon awoken-" + card.awakenings[ai-1];
		}else
		{
			mAwoken[ai].className = "display-none";
		}
	}

	//超觉醒
	const mSAwokenRow = settingBox.querySelector(".row-mon-super-awoken");
	const mSAwoken = mSAwokenRow.querySelectorAll(".awoken-ul li");
	//if (!editBox.isAssist && card.superAwakenings.length>0)
	if (card.superAwakenings.length>0) //武器上也还是加入超觉醒吧
	{
		for (let ai=0;ai<mSAwoken.length;ai++)
		{
			if (ai < card.superAwakenings.length)
			{
				mSAwoken[ai].className = "awoken-icon unselected-awoken awoken-" + card.superAwakenings[ai];
			}
			else
			{
				mSAwoken[ai].className = "display-none";
			}
		}
		mSAwokenRow.classList.remove("display-none");
	}else
	{
		mSAwokenRow.classList.add("display-none");
	}

	const monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.innerHTML = monEditLvMax.value = card.maxLevel;
	const monEditLv = settingBox.querySelector(".m-level");
	monEditLv.max = monEditLv.value = card.maxLevel + (card.limitBreakIncr ? 11 : 0); //默认等级为110
	const monEditLv110 = settingBox.querySelector(".m-level-btn-110");
	if (card.limitBreakIncr)
	{
		monEditLv110.classList.remove("display-none");
	}else
	{
		monEditLv110.classList.add("display-none");
	}
	const rowPlus =  settingBox.querySelector(".row-mon-plus");
	const rowLatent =  settingBox.querySelector(".row-mon-latent");
	const monLatentAllowUl = rowLatent.querySelector(".m-latent-allowable-ul");
	//该宠Type允许的杀,uniq是去重的自定义函数
	const allowLatent = uniq(card.types.reduce(function (previous, t, index, array) {
		return previous.concat(type_allowable_latent[t]);
	},[]));
	for(let li=17;li<=24;li++) //显示允许的杀，隐藏不允许的杀
	{
		const latentDom = monLatentAllowUl.querySelector(".latent-icon-" + li);
		if (allowLatent.indexOf(li)>=0)
		{
			if(latentDom.classList.contains("unselected-latent"))
				latentDom.classList.remove("unselected-latent");
		}else
		{
			if(!latentDom.classList.contains("unselected-latent"))
				latentDom.classList.add("unselected-latent");
		}
	}
	//怪物主动技能
	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");
	const skillDetail = skillBox.querySelector(".skill-datail");
	
	fragment = document.createDocumentFragment(); //创建节点用的临时空间
	fragment.appendChild(skillBox);

	skillTitle.innerHTML = descriptionToHTML(skill.name);
	skillTitle.setAttribute("data-skillid", skill.id);
	skillDetail.innerHTML = parseSkillDescription(skill);
	const t_maxLevel = card.overlay || card.types.indexOf(15)>=0 ? 1 : skill.maxLevel; //遇到不能升技的，最大等级强制为1
	skillLevel.max = t_maxLevel;
	skillLevel.value = t_maxLevel;
	skillLevel_Max.value = t_maxLevel;
	skillLevel_Max.innerHTML = skill.maxLevel;
	skillCD.innerHTML = skill.initialCooldown - t_maxLevel + 1;

	rowSkill.appendChild(fragment);

	//怪物队长技能
	const rowLederSkill = settingBox.querySelector(".row-mon-leader-skill");
	const lskillBox = rowLederSkill.querySelector(".skill-box");
	const lskillTitle = lskillBox.querySelector(".skill-name");
	const lskillDetail = lskillBox.querySelector(".skill-datail");
	
	fragment = document.createDocumentFragment(); //创建节点用的临时空间
	fragment.appendChild(lskillBox);

	lskillTitle.innerHTML = descriptionToHTML(leaderSkill.name);
	lskillDetail.innerHTML = parseSkillDescription(leaderSkill);

	rowLederSkill.appendChild(fragment);

	if (card.overlay || card.types[0] == 15 && card.types[1] == -1)
	{ //当可以叠加时，不能打297和潜觉
		rowPlus.classList.add("disabled"); 
		rowLatent.classList.add("disabled");
		skillLevel.setAttribute("readonly",true);
	}else
	{
		rowPlus.classList.remove("disabled"); 
		rowLatent.classList.remove("disabled"); 
		skillLevel.removeAttribute("readonly");
	}

	if (editBox.isAssist)
	{
		const btnDone = editBox.querySelector(".button-done");
		if (!card.canAssist)
		{
			btnDone.classList.add("cant-assist");
			btnDone.disabled = true;
		}else
		{
			btnDone.classList.remove("cant-assist");
			btnDone.disabled = false;
		}
	}
	editBox.latent.length = 0;
	editBox.refreshLatent(editBox.latent,id);
	editBox.reCalculateExp();
	editBox.reCalculateAbility();
}
//搜索并显示合作
function searchColla(collabId)
{
	if (typeof(collabId) == "string") collabId = parseInt(collabId,10);
	showSearch(Cards.filter(card=>{return card.collabId == collabId;}));
}
//刷新整个队伍
function refreshAll(formationData){
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const titleBox = fragment.appendChild(formationBox.querySelector(".title-box"));
	const detailBox = formationBox.querySelector(".detail-box");
	const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
	const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计

	while(formationBox.childNodes.length>0)
	{
		fragment.appendChild(formationBox.childNodes[0]);
	}

	const txtTitle = titleBox.querySelector(".title");
	const txtDetail = detailBox.querySelector(".detail");
	txtTitle.value = formationData.title || "";
	txtDetail.value = formationData.detail || "";
	const txtTitleDisplay = titleBox.querySelector(".title-display");
	const txtDetailDisplay = detailBox.querySelector(".detail-display");
	txtTitleDisplay.innerHTML = descriptionToHTML(txtTitle.value);
	txtDetailDisplay.innerHTML = descriptionToHTML(txtDetail.value);
	if (txtTitle.value.length == 0)
		titleBox.classList.add("edit");
	else
		titleBox.classList.remove("edit");
	if (txtDetail.value.length == 0)
		detailBox.classList.add("edit");
	else
		detailBox.classList.remove("edit");
	/*txtTitleDisplay.innerHTML = "";
	txtTitleDisplay.appendChild(document.createTextNode(txtTitle.value));
	txtDetailDisplay.innerHTML = "";
	const txtDetailLines = txtDetail.value.split("\n");
	txtDetailLines.forEach((line,idx)=>{
		if (idx>0) txtDetailDisplay.appendChild(document.createElement("br"));
		txtDetailDisplay.appendChild(document.createTextNode(line));
	});*/
	
	teamBigBoxs.forEach((teamBigBox,teamNum)=>{
		const teamBox = teamBigBox.querySelector(".team-box");
		const teamData = formationData.teams[teamNum];
		const badgeBox = teamBigBox.querySelector(".team-badge");
		if (badgeBox)
		{
			const badge = badgeBox.querySelector(`#team-${teamNum}-badge-${formationData.badge}`);
			badge.checked = true;
		}

		const membersDom = teamBox.querySelector(".team-members");
		const latentsDom = teamBox.querySelector(".team-latents");
		const assistsDom = teamBox.querySelector(".team-assist");
		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		for (let ti=0,ti_len=membersDom.querySelectorAll(".member").length;ti<ti_len;ti++)
		{
			const member = membersDom.querySelector(`.member-${ti+1} .monster`);
			const latent = latentsDom.querySelector(`.latents-${ti+1} .latent-ul`);
			const assist = assistsDom.querySelector(`.member-${ti+1} .monster`);
			changeid(teamData[0][ti],member,latent); //队员
			changeid(teamData[1][ti],assist); //辅助
			refreshMemberSkillCD(teamBox,teamData,ti); //技能CD
			refreshAbility(teamAbilityDom, teamData, ti); //本人能力值
		}
		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
	});
	
	if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

	if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

	formationBox.appendChild(fragment);
	txtDetail.onblur(); //这个需要放在显示出来后再改才能生效
}
//刷新队伍觉醒统计
function refreshTeamAwokenCount(awokenDom,team){
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenUL = fragment.appendChild(awokenDom.querySelector(".awoken-ul"));
	function setCount(aicon,number){
		if (!aicon) return; //没有这个觉醒就撤回 
		const ali = aicon.parentNode;
		const countDom = ali.querySelector(".count");
		countDom.innerHTML = number;
		if (number)
			ali.classList.remove("display-none");
		else
			ali.classList.add("display-none");
	}
	const bigAwoken = [52,53,56,68,69,70]; //等于几个小觉醒的大觉醒
	for (let ai=1;ai<=72;ai++)
	{
		const aicon = awokenUL.querySelector(".awoken-" + ai);
		if (!aicon) continue; //如果没有这个觉醒图，直接跳过
		//搜索等效觉醒
		const equalIndex = equivalent_awoken.findIndex(eak=>eak.small === ai || eak.big === ai);
		if (equalIndex >= 0)
		{
			const equivalentAwoken = equivalent_awoken[equalIndex];
			if (equivalentAwoken.small === ai)
			{
				const totalNum = awokenCountInTeam(team, equivalentAwoken.small, solo) + 
								 awokenCountInTeam(team, equivalentAwoken.big, solo) * equivalentAwoken.times;
				setCount(aicon, totalNum);
			}else
			{
				continue;
			}
		}else
		{
			setCount(aicon,awokenCountInTeam(team,ai,solo));
		}
	}
	awokenDom.appendChild(fragment);
}
//刷新几个队伍觉醒统计
function refreshFormationAwokenCount(awokenDom,teams){
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenUL = fragment.appendChild(awokenDom.querySelector(".awoken-ul"));
	function setCount(aicon,number){
		if (!aicon) return; //没有这个觉醒就撤回 
		const ali = aicon.parentNode;
		const countDom = ali.querySelector(".count");
		countDom.innerHTML = number;
		if (number)
			ali.classList.remove("display-none");
		else
			ali.classList.add("display-none");
	}
	
	for (var ai=1;ai<=72;ai++)
	{
		const aicon = awokenUL.querySelector(".awoken-" + ai);
		if (!aicon) continue; //如果没有这个觉醒图，直接跳过
		//搜索等效觉醒
		const equalIndex = equivalent_awoken.findIndex(eak=>eak.small === ai || eak.big === ai);
		if (equalIndex >= 0)
		{
			const equivalentAwoken = equivalent_awoken[equalIndex];
			if (equivalentAwoken.small === ai)
			{
				const totalNum = awokenCountInFormation(teams, equivalentAwoken.small, solo) + 
								 awokenCountInFormation(teams, equivalentAwoken.big, solo) * equivalentAwoken.times;
				setCount(aicon, totalNum);
			}else
			{
				continue;
			}
		}else
		{
			setCount(aicon,awokenCountInFormation(teams,ai,solo));
		}
	}
	awokenDom.appendChild(fragment);
}
//刷新能力值
function refreshAbility(abilityDom,team,idx){
	const memberData = team[0][idx];
	const assistData = team[1][idx];
	//基底三维，如果辅助是武器，还要加上辅助的觉醒
	const mainAbility = calculateAbility(memberData, assistData, solo);
		if (mainAbility && memberData.ability)
		{
			for (let ai=0;ai<3;ai++)
			{
				memberData.ability[ai] = mainAbility[ai];
			}
		}
	if (!abilityDom) return; //如果没有dom，直接跳过
	const abilityLi = abilityDom.querySelector(".abilitys-" + (idx+1));
	const hpDom = abilityLi.querySelector(".hp");
	const atkDom = abilityLi.querySelector(".atk");
	const rcvDom = abilityLi.querySelector(".rcv");
	[hpDom,atkDom,rcvDom].forEach(function(div,ai){
		if (mainAbility)
		{
			div.classList.remove("display-none");
			div.innerHTML = memberData.ability[ai];
		}else
		{
			div.classList.add("display-none");
			div.innerHTML = 0;
		}
	});
}
//刷新队伍能力值合计
function refreshTeamTotalHP(totalDom,team){
	//计算总的生命值
	if (!totalDom) return;
	const tHpDom = totalDom.querySelector(".tIf-total-hp");
	const tRcvDom = totalDom.querySelector(".tIf-total-rcv");

	if (tHpDom)
	{
		const tHP = team[0].reduce(function(value,mon){ //队伍计算的总HP
			return value += mon.ability ? mon.ability[0] : 0;
		},0);
		const teamHPAwoken = awokenCountInTeam(team,46,solo); //全队大血包个数
		
		let badgeHPScale = 1; //徽章倍率
		if (formation.badge == 4 && solo)
		{
			badgeHPScale = 1.05;
		}else if (formation.badge == 11 && solo)
		{
			badgeHPScale = 1.15;
		}

		tHpDom.innerHTML = tHP.toString() + 
			(teamHPAwoken>0||badgeHPScale!=1 ?
				("("+Math.round(tHP * (1 + 0.05 * teamHPAwoken)*badgeHPScale).toString()+")") :
				"");
	}
	if (tRcvDom)
	{
		const tRCV = team[0].reduce(function(value,mon){ //队伍计算的总回复
			return value += mon.ability ? mon.ability[2] : 0;
		},0);
		const teamRCVAwoken = awokenCountInTeam(team,47,solo); //全队大回复个数
		
		let badgeRCVScale = 1; //徽章倍率
		if (formation.badge == 3 && solo)
		{
			badgeRCVScale = 1.25;
		}else if (formation.badge == 10 && solo)
		{
			badgeRCVScale = 1.35;
		}
		
		tRcvDom.innerHTML = tRCV.toString() + 
			(teamRCVAwoken>0||badgeRCVScale!=1 ?
				("("+Math.round(tRCV * (1 + 0.10 * teamRCVAwoken)*badgeRCVScale).toString()+")") :
				"");
	}
}
//刷新所有队伍能力值合计
function refreshFormationTotalHP(totalDom, teams){
	//计算总的生命值
	if (!totalDom) return;
	const tHpDom = totalDom.querySelector(".tIf-total-hp");
	const tRcvDom = totalDom.querySelector(".tIf-total-rcv");

	if (tHpDom)
	{
		const tHPArr = teams.map(function(team){
			const teamTHP = team[0].reduce(function(value,mon){ //队伍计算的总HP
				return value += mon.ability ? mon.ability[0] : 0;
			},0);
			const teamHPAwoken = awokenCountInTeam(team,46,solo); //全队大血包个数
			return [teamTHP,teamHPAwoken];
		});
		const tHP = tHPArr.reduce(function(value, teamHP){
			return [value[0] + teamHP[0], value[1] + Math.round(teamHP[0] * (1 + 0.05 * teamHP[1]))];
		},[0,0]);

		tHpDom.innerHTML = tHP[0].toString() + 
			(tHP[0] != tHP[1] ? `(${tHP[1]})` : "");
	}
	if (tRcvDom)
	{
		const tRCVArr = teams.map(function(team){
			const teamTRCV = team[0].reduce(function(value,mon){ //队伍计算的总回复
				return value += mon.ability ? mon.ability[2] : 0;
			},0);
			const teamRCVAwoken = awokenCountInTeam(team,47,solo); //全队大回复个数
			return [teamTRCV,teamRCVAwoken];
		},0);
		const tRCV = tRCVArr.reduce(function(value, teamRCV){
			return [value[0] + teamRCV[0], value[1] + Math.round(teamRCV[0] * (1 + 0.10 * teamRCV[1]))];
		},[0,0]);

		tRcvDom.innerHTML = tRCV[0].toString() + 
			(tRCV[0] != tRCV[1] ? `(${tRCV[1]})` : "");
	}
}
//刷新单人技能CD
function refreshMemberSkillCD(teamDom,team,idx){
	const memberMonDom = teamDom.querySelector(`.team-members .member-${idx+1} .monster`);
	const assistMonDom = teamDom.querySelector(`.team-assist .member-${idx+1} .monster`);
	const member = team[0][idx];
	const assist = team[1][idx];

	const memberCard = Cards[member.id] || Cards[0];
	const memberSkill = Skills[memberCard.activeSkillId];
	const assistCard = Cards[assist.id] || Cards[0];
	const assistSkill = Skills[assistCard.activeSkillId];

	const memberSkillCdDom = memberMonDom.querySelector(".skill");
	const assistSkillCdDom = assistMonDom.querySelector(".skill");

	const memberSkillCd = memberSkill ? (memberSkill.initialCooldown - (member.skilllevel||memberSkill.maxLevel) + 1) : 0;
	const assistSkillCd = assistSkill ? (assistSkill.initialCooldown - (assist.skilllevel||assistSkill.maxLevel) + 1) : 0;
	memberSkillCdDom.innerHTML = memberSkillCd;
	assistSkillCdDom.innerHTML = memberSkillCd + assistSkillCd;

	if (member.skilllevel != undefined && member.skilllevel < memberSkill.maxLevel)
	{
		memberSkillCdDom.classList.remove("max-skill");
	}else
	{
		memberSkillCdDom.classList.add("max-skill");
	}
	if (assist.skilllevel != undefined && assist.skilllevel < assistSkill.maxLevel){
		assistSkillCdDom.classList.remove("max-skill");
	}else
	{
		assistSkillCdDom.classList.add("max-skill");
	}
}
function localisation($tra)
{
	if (!$tra) return;
    document.title = $tra.webpage_title;
    formationBox.querySelector(".title-box .title").placeholder = $tra.title_blank;
    formationBox.querySelector(".detail-box .detail").placeholder = $tra.detail_blank;

    const s_sortList = editBox.querySelector(".search-box .sort-div .sort-list");
    const sortOptions = Array.prototype.slice.call(s_sortList.options);
    sortOptions.forEach(opt=>{
        const tag = opt.getAttribute("data-tag");
        const trans = $tra.sort_name[tag];
        if (trans)
        {
            opt.text = trans;
        }
    })
}