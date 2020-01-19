var Cards = null; //怪物数据
var Skills = null; //技能数据
var currentLanguage = null; //当前语言
var currentDataSource = null; //当前数据
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
var allMembers = [];
var interchangeSvg; //储存划线的SVG
var interchangePath; //储存划线的线
/*var cardInterchange = { //记录DOM交换
	from:null,
	to:null,
	members:[]
};*/
//队员基本的留空
var Member = function(){
	this.id=0;
};
Member.prototype.outObj = function(){
	const m = this;
	let obj = [m.id];
	if (m.level != undefined) obj[1] = m.level;
	if (m.awoken != undefined) obj[2] = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length>=3 && (m.plus[0]+m.plus[1]+m.plus[2])!==0)
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
	if (m[6] != undefined) this.skilllevel = m[6];
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
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length>=3 && (m.plus[0]+m.plus[1]+m.plus[2])>0) this.plus = m.plus;
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
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length>=3 && (m.plus[0]+m.plus[1]+m.plus[2])>0) this.plus = m.plus;
	if (m.latent != undefined && m.latent instanceof Array && m.latent.length>=1) this.latent = m.latent;
	if (m.sawoken != undefined) this.sawoken = m.sawoken;
	if (m.ability != undefined && m.ability instanceof Array && m.plus.length>=3) this.ability = m.ability;
};

var Formation = function(teamCount,memberCount){
	this.title = "";
	this.detail = "";
	this.team = [];
	this.badge = 0;
	for (var ti=0;ti<teamCount;ti++)
	{
		var team = [[],[]];
		for (var mi=0;mi<memberCount;mi++)
		{
			team[0].push(new MemberTeam());
			team[1].push(new MemberAssist());
		}
		this.team.push(team);
	}
};
Formation.prototype.outObj= function(){
	let obj = {};
	if (this.title != undefined && this.title.length>0) obj.t = this.title;
	if (this.detail != undefined && this.detail.length>0) obj.d = this.detail;
	obj.f = this.team.map(function(t){
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
	var dataVeision = f.f?2:1; //是第几版格式
	this.title = dataVeision>1 ? f.t : f.title;
	this.detail = dataVeision>1 ? f.d : f.detail;
	this.badge = f.b ? f.b : 0; //徽章
	var teamArr = dataVeision>1 ? f.f : f.team;
	this.team.forEach(function(t,ti){
		var tf = teamArr[ti] || [];
		t.forEach(function(st,sti){
			var fst = tf[sti] || [];
			st.forEach(function(m,mi){
				var fm = fst[mi];
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
	document.body.classList.toggle('not-show-mon-id');
}
//切换怪物技能CD显示
function toggleShowMonSkillCd()
{
	document.body.classList.toggle('show-mon-skill-cd');
}
//清除数据
function clearData()
{
	location.href=location.href.replace(location.search,'');
}
//交换AB队
function swapABteam()
{
	if (formation.team.length>0)
	{
		formation.team[0][0].splice(4, 0, formation.team[0][0].splice(0,1)[0]); //第1个数组基底删掉0并移动到4
		formation.team[0][1].splice(4, 0, formation.team[0][1].splice(0,1)[0]); //第1个数组辅助删掉0并移动到4
		formation.team[1][0].splice(0, 0, formation.team[1][0].splice(4,1)[0]); //第2个数组基底删掉4并移动到0
		formation.team[1][1].splice(0, 0, formation.team[1][1].splice(4,1)[0]); //第2个数组辅助删掉4并移动到0
		formation.team.splice(0,0,formation.team.splice(1,1)[0]); //交换AB队
	}
	creatNewUrl();
	history.go();
}
//在单人和多人之间转移数据
function swapSingleMulitple()
{
	if (solo)
	{
		//创建第二支队伍，各4个空的
		formation.team[1] = [
			Array.from(new Array(4)).map(()=>{return new MemberTeam();}),
			Array.from(new Array(4)).map(()=>{return new MemberAssist();})
		];
		//把右边的队长加到第二支队伍最后面
		formation.team[1][0].push(formation.team[0][0].splice(5,1)[0]);
		formation.team[1][1].push(formation.team[0][1].splice(5,1)[0]);
		formation.badge = 0;
	}else
	{
		//把第二支队五的队长添加到最后方
		formation.team[0][0].push(formation.team[1][0][4]);
		formation.team[0][1].push(formation.team[1][1][4]);
		//删掉第二支队伍
		formation.team.splice(1,1);
	}
	location.href = creatNewUrl({url:solo?"multi.html":"solo.html",notPushState:true});
}
window.onload = function()
{
	interchangeSVG = document.querySelector("#interchange-line");
	interchangePath = interchangeSVG.querySelector("g line");
	const controlBox = document.querySelector(".control-box");
	const statusLine = controlBox.querySelector(".status"); //显示当前状态的

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

	let langOptionArray = Array.prototype.slice.call(langSelectDom.options);
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
	statusLine.classList.add("loading-mon-info");
	GM_xmlhttpRequest({
		method: "GET",
		url:`monsters-info/mon_${currentDataSource.code}.json`, //Cards数据文件
		onload: function(response) {
			dealCardsData(response.response);
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
	//处理返回的数据
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
		GM_xmlhttpRequest({
			method: "GET",
			url:`monsters-info/skill_${currentDataSource.code}.json`, //Skills数据文件
			onload: function(response) {
				dealSkillData(response.response);
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
		var parameter_data = getQueryString("d") || getQueryString("data");
		if (parameter_data)
		{
			formationData = JSON.parse(parameter_data);
		}
	}catch(e)
	{
		console.log("URL中队伍数据JSON解码出错",e);
		return;
	}
	if (formationData)
	{
		//formation = idata;
		formation.loadObj(formationData);
		refreshAll(formation);
	}
}
window.onpopstate = reloadFormationData; //前进后退时修改页面
//创建新的分享地址
function creatNewUrl(arg){
	if (arg == undefined) arg = {};
	if (!!(window.history && history.pushState)) {
		// 支持History API
		let language_i18n = arg.language || getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
		let datasource = arg.datasource || getQueryString("s");
		let outObj = formation.outObj();
		
		let newUrl = (arg.url?arg.url:"") +
			'?' +
			(language_i18n?'l=' + language_i18n + '&':'') +
			(datasource&&datasource!="ja"?'s=' + datasource + '&':'') +
			'd=' + encodeURIComponent(JSON.stringify(outObj));

		if (!arg.notPushState) history.pushState(null, null, newUrl);
		return newUrl;
	}
}
//初始化
function initialize()
{
	let monstersList = document.querySelector("#monsters-list");
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

	//控制框
	const controlBox = document.querySelector(".control-box");

	//标题和介绍文本框
	const txtTitle = document.querySelector(".title-box .title");
	const txtDetail = document.querySelector(".detail-box .detail");
	txtTitle.onchange = function(){
		formation.title = this.value;
		creatNewUrl();
	};
	txtDetail.onchange = function(){
		formation.detail = this.value;
		creatNewUrl();
	};
	txtDetail.onblur = function(){
		this.style.height=this.scrollHeight+"px";
	};

	//队伍框
	const formationBox = document.querySelector(".formation-box");

	const formationA = formationBox.querySelector(".formation-box .formation-A-box");
	const formationB = formationBox.querySelector(".formation-box .formation-B-box");
	
	const fATeam = formationA.querySelectorAll(".formation-team .monster");
	const fAAssist = formationA.querySelectorAll(".formation-assist .monster");

	const fBTeam = formationB ? formationB.querySelectorAll(".formation-team .monster") : null;
	const fBAssist = formationB ? formationB.querySelectorAll(".formation-assist .monster") : null;

	for (let ti=0;ti<fATeam.length;ti++)
	{
		allMembers.push(fATeam[ti]);
		allMembers.push(fAAssist[ti]);
		if (formationB)
		{
			allMembers.push(fBTeam[ti]);
			allMembers.push(fBAssist[ti]);
		}
	}
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

	//徽章
	let badges = Array.prototype.slice.call(formationBox.querySelectorAll(".formation-badge .badge-bg"));
	badges.forEach((badge,bidx) => {
		badge.onclick = function(){
			if (badges.some(b=>{return b.classList.contains("display-none");}))
			{ //未展开时
				badges.forEach((b,idx) => {if (idx!=bidx)b.classList.remove("display-none");});
			}else
			{ //展开时
				badges.forEach((b,idx) => {if (idx!=bidx)b.classList.add("display-none");});
				formation.badge = bidx;
				refreshTotalAbility(formation.team[0]);
				creatNewUrl();
			}
		};
	});

	//编辑框
	const editBox = document.querySelector(".edit-box");
	editBox.mid = 0; //储存怪物id
	editBox.awokenCount = 0; //储存怪物潜觉数量
	editBox.latent = []; //储存潜在觉醒
	editBox.assist = false; //储存是否为辅助宠物
	editBox.monsterBox = null;
	editBox.latentBox = null;
	editBox.memberIdx = []; //储存队伍数组下标
	editBox.show = function(){
		editBox.classList.remove("display-none");
		formationBox.classList.add("blur-bg");
		controlBox.classList.add("blur-bg");
	};
	editBox.hide = function(){
		editBox.classList.add("display-none");
		formationBox.classList.remove("blur-bg");
		controlBox.classList.remove("blur-bg");
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
		const cdom = cli.head = cli.appendChild(document.createElement("a"));
		cdom.class = "monster";
		cdom.onclick = clickHeadToNewMon;
		const property = cdom.appendChild(document.createElement("div"));
		property.className = "property";
		const subproperty = cdom.appendChild(document.createElement("div"));
		subproperty.className = "subproperty";
		const cid = cdom.appendChild(document.createElement("div"));
		cid.className = "id";
		changeid({id:id},cdom);
		return cli;
	};

	const searchBox = editBox.querySelector(".search-box");
	let s_attr1s = Array.prototype.slice.call(searchBox.querySelectorAll(".attrs .attr-list-1 .attr-radio"));
	let s_attr2s = Array.prototype.slice.call(searchBox.querySelectorAll(".attrs .attr-list-2 .attr-radio"));
	let s_fixMainColor = searchBox.querySelector(".attrs .fix-main-color");
	let s_types = Array.prototype.slice.call(searchBox.querySelectorAll(".types-div .type-check"));
	let s_awokensItem = Array.prototype.slice.call(searchBox.querySelectorAll(".awoken-div .awoken-count"));
	let s_awokensIcon = s_awokensItem.map(it=>{
		return it.querySelector(".awoken-icon");
	});
	let s_awokensCount = s_awokensItem.map(it=>{
		return it.querySelector(".count");
	});
	/*let s_awokensIcon = Array.prototype.slice.call(searchBox.querySelectorAll(".awoken-div .awoken-icon"));
	let s_awokensCount = Array.prototype.slice.call(searchBox.querySelectorAll(".awoken-div .count"));*/
	let s_sawokens = Array.prototype.slice.call(searchBox.querySelectorAll(".sawoken-div .sawoken-check"));
	s_awokensIcon.forEach((b,idx)=>{ //每种觉醒增加1
		b.onclick = function(){
			const countDom = s_awokensCount[idx];
			let count = parseInt(countDom.innerHTML,10);
			if (count<9)
			{
				count++;
				countDom.innerHTML = count;
				b.parentNode.classList.remove("zero");
			}
		};
	});
	function searchSubAwoken()
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
	s_awokensCount.forEach((b,idx)=>{ //每种觉醒减少1
		b.onclick = searchSubAwoken;
	});

	const awokenClear = searchBox.querySelector(".awoken-div .awoken-clear");
	const sawokenClear = searchBox.querySelector(".sawoken-div .sawoken-clear");
	awokenClear.onclick = function(){ //清空觉醒选项
		s_awokensCount.forEach(t=>{
			t.innerHTML = 0;
		});
		s_awokensItem.forEach(t=>{
			t.classList.add("zero");
		});
	};
	sawokenClear.onclick = function(){ //清空超觉醒选项
		s_sawokens.forEach(t=>{
			t.checked = false;
		});
	};

	const searchStart = searchBox.querySelector(".control-div .search-start");
	const searchClose = searchBox.querySelector(".control-div .search-close");
	const searchClear = searchBox.querySelector(".control-div .search-clear");
	const searchMonList = searchBox.querySelector(".search-mon-list");
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
	searchStart.onclick = function(){
		const attr1Filter = s_attr1s.filter(returnCheckedInput).map(returnInputValue);
		const attr2Filter = s_attr2s.filter(returnCheckedInput).map(returnInputValue);
		const fixMainColor = s_fixMainColor.checked;
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
		const awokensFilter = s_awokensCount.filter(btn=>{return parseInt(btn.innerHTML,10)>0;}).map(btn=>{
			return {id:parseInt(btn.value,10),num:parseInt(btn.innerHTML,10)};
		});
		console.log("搜索条件",attr1,attr2,fixMainColor,typesFilter,awokensFilter,sawokensFilter);
		let searchResult = searchCards(Cards,attr1,attr2,fixMainColor,typesFilter,awokensFilter,sawokensFilter);
		console.log("搜索结果",searchResult);
		const createCardHead = editBox.createCardHead;

		searchMonList.classList.add("display-none");
		searchMonList.innerHTML = "";
		if (searchResult.length>0)
		{
			let fragment = document.createDocumentFragment(); //创建节点用的临时空间
			searchResult.forEach(function(card){
				const cli = createCardHead(card.id);
				fragment.appendChild(cli);
			});
			searchMonList.appendChild(fragment);
		}
		searchMonList.classList.remove("display-none");
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
		s_awokensCount.forEach(t=>{
			t.innerHTML = 0;
		});
		s_awokensItem.forEach(t=>{
			t.classList.add("zero");
		});
		s_sawokens.forEach(t=>{
			t.checked = false;
		});
		searchMonList.innerHTML = "";
	};
	const settingBox = editBox.querySelector(".setting-box");
	const searchOpen = settingBox.querySelector(".row-mon-id .open-search");
	searchOpen.onclick = function(){
		searchBox.classList.remove("display-none");
	};

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
	let monEditAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".row-mon-awoken .awoken-ul .awoken-icon"));
	monEditAwokens.forEach((akDom,idx,domArr)=>{
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
	monEditLv.onchange = editBox.reCalculateAbility;
	const monEditLvMin = settingBox.querySelector(".m-level-btn-min");
	monEditLvMin.ipt = monEditLv;
	monEditLvMin.onclick = setIptToMyValue;
	const monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.ipt = monEditLv;
	monEditLvMax.onclick = setIptToMyValue;
	//加蛋
	const monEditAddHpLi = settingBox.querySelector(".row-mon-plus .m-plus-hp-li");
	const monEditAddAtkLi = settingBox.querySelector(".row-mon-plus .m-plus-atk-li");
	const monEditAddRcvLi = settingBox.querySelector(".row-mon-plus .m-plus-rcv-li");
	const monEditAddHp = monEditAddHpLi.querySelector(".m-plus-hp");
	monEditAddHp.onchange = editBox.reCalculateAbility;
	const monEditAddAtk = monEditAddAtkLi.querySelector(".m-plus-atk");
	monEditAddAtk.onchange = editBox.reCalculateAbility;
	const monEditAddRcv = monEditAddRcvLi.querySelector(".m-plus-rcv");
	monEditAddRcv.onchange = editBox.reCalculateAbility;
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
	const monEditAdd297 = settingBox.querySelector(".row-mon-plus .m-plus-btn-297");
	monEditAdd297.onclick = function(){
		monEditAddHp.value = 
		monEditAddAtk.value = 
		monEditAddRcv.value = 99;
		editBox.reCalculateAbility();
	};
	//三维的计算值
	const monEditHpValue = monEditAddHpLi.querySelector(".ability-value");
	const monEditAtkValue = monEditAddAtkLi.querySelector(".ability-value");
	const monEditRcvValue = monEditAddRcvLi.querySelector(".ability-value");
	
	//潜觉
	const monEditLatentUl = settingBox.querySelector(".m-latent-ul");
	let monEditLatents = Array.prototype.slice.call(monEditLatentUl.querySelectorAll("li"));
	const monEditLatentAllowableUl = settingBox.querySelector(".m-latent-allowable-ul");
	let monEditLatentsAllowable = Array.prototype.slice.call(monEditLatentAllowableUl.querySelectorAll("li"));
	editBox.refreshLatent = function(latent,monid) //刷新潜觉
	{
		let maxLatentCount = getMaxLatentCount(monid); //最大潜觉数量
		let usedHoleN = usedHole(latent);
		for (var ai=0;ai<monEditLatents.length;ai++)
		{
			if (latent[ai] !== undefined)
			{
				monEditLatents[ai].className = "latent-icon latent-icon-" + latent[ai];
				monEditLatents[ai].value = ai;
			}
			else if(ai<(maxLatentCount-usedHoleN+latent.length))
			{
				monEditLatents[ai].className = "latent-icon";
				monEditLatents[ai].value = -1;
			}
			else
			{
				monEditLatents[ai].className = "display-none";
				monEditLatents[ai].value = -1;
			}
		}
	};

	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");

	skillLevel.onchange = function(){
		const card = Cards[editBox.mid] || Cards[0]; //怪物固定数据
		const skill = Skills[card.activeSkillId];
		skillCD.innerHTML = skill.initialCooldown - this.value + 1;
	};
	skillLevel_1.ipt = skillLevel;
	skillLevel_1.onclick = setIptToMyValue;
	skillLevel_Max.ipt = skillLevel;
	skillLevel_Max.onclick = setIptToMyValue;

	function deleteLatent(){
		let aIdx = parseInt(this.value, 10);
		editBox.latent.splice(aIdx,1);
		editBox.reCalculateAbility(); //重计算三维
		editBox.refreshLatent(editBox.latent,editBox.mid); //刷新潜觉
	}
	//已有觉醒的去除
	monEditLatents.forEach(function(l){
		l.onclick = deleteLatent;
	});
	//可选觉醒的添加
	monEditLatentsAllowable.forEach(function(la){
		la.onclick = function(){
			if (this.classList.contains("unselected-latent")) return;
			var lIdx = parseInt(this.value);
			var usedHoleN = usedHole(editBox.latent);
			let maxLatentCount = getMaxLatentCount(editBox.mid); //最大潜觉数量
			if (lIdx >= 12 && usedHoleN<=(maxLatentCount-2))
				editBox.latent.push(lIdx);
			else if (lIdx < 12 && usedHoleN<=(maxLatentCount-1))
				editBox.latent.push(lIdx);

			editBox.reCalculateAbility();
			editBox.refreshLatent(editBox.latent,editBox.mid);
		};
	});

	//重新计算怪物的能力
	editBox.reCalculateAbility = function(){
		const monid = parseInt(monstersID.value || 0, 10);
		const level = parseInt(monEditLv.value || 0, 10);
		const awoken = editBox.awokenCount;
		const plus = [
			parseInt(monEditAddHp.value || 0, 10),
			parseInt(monEditAddAtk.value || 0, 10),
			parseInt(monEditAddRcv.value || 0, 10)
		];
		const latent = editBox.latent;
		const abilitys = calculateAbility(monid,level,plus,awoken,latent) || [0,0,0];

		monEditHpValue.innerHTML = abilitys[0];
		monEditAtkValue.innerHTML = abilitys[1];
		monEditRcvValue.innerHTML = abilitys[2];
	};

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
		let mon = editBox.assist?new MemberAssist():new MemberTeam();
		formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

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
			if (!editBox.assist)
			{ //如果不是辅助，则可以设定潜觉
				mon.latent = editBox.latent.concat();
			}
		}

		const skillLevelNum = parseInt(skillLevel.value,10);
		if (skillLevelNum < skill.maxLevel)
		{
			mon.skilllevel = skillLevelNum;
		}
		changeid(mon,editBox.monsterBox,editBox.memberIdx[1] ? null : editBox.latentBox);

		const formationAbilityDom = document.querySelector(".formation-box .formation-ability");
		if (formationAbilityDom)
		{
			refreshAbility(
				formationAbilityDom,
				formation.team[editBox.memberIdx[0]],
				editBox.memberIdx[2]);
			refreshTotalAbility(formation.team[editBox.memberIdx[0]]);
		}
		refreshAwokenCount(formation.team);

		//刷新改队员的CD
		const teamDom = document.querySelector(".formation-box .formation-" + (editBox.memberIdx[0]?"B":"A") + "-box");
		refreshSkillCD(teamDom,formation.team[editBox.memberIdx[0]],editBox.memberIdx[2]); 
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
	btnNull.onclick = function(){
		var mD = formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = new Member();
		changeid(mD,editBox.monsterBox,editBox.latentBox);
		var formationAbilityDom = document.querySelector(".formation-box .formation-ability");
		if (formationAbilityDom)
		{
			refreshAbility(
				formationAbilityDom,
				formation.team[editBox.memberIdx[0]],
				editBox.memberIdx[2]);
			refreshTotalAbility(formation.team[editBox.memberIdx[0]]);
		}
		refreshAwokenCount(formation.team);
		creatNewUrl();
		editBox.hide();
	};
	btnDelay.onclick = function(){ //应对威吓
		var mD = formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = new MemberDelay();
		changeid(mD,editBox.monsterBox,editBox.latentBox);
		var formationAbilityDom = document.querySelector(".formation-box .formation-ability");
		if (formationAbilityDom)
		{
			refreshAbility(
				formationAbilityDom,
				formation.team[editBox.memberIdx[0]],
				editBox.memberIdx[2]);
			refreshTotalAbility(formation.team[editBox.memberIdx[0]]);
		}
		refreshAwokenCount(formation.team);
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
			let newMember = isAssist ? new MemberTeam() : new MemberAssist();
			newMember.loadFromMember(member);
			return newMember;
		}
	}
	let from = formation.team[formArr[0]][formArr[1]][formArr[2]];
	let to = formation.team[toArr[0]][toArr[1]][toArr[2]];
	if(formArr[1] != toArr[1]) //从武器拖到非武器才改变类型
	{
		from = changeType(from,formArr[1]);
		to = changeType(to,toArr[1]);
	}
	formation.team[toArr[0]][toArr[1]][toArr[2]] = from;
	formation.team[formArr[0]][formArr[1]][formArr[2]] = to;

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
				if (card.canAssist)
				{//可以辅助的满觉醒打黄色星星
					awokenIcon.classList.add("allowable-assist");
				}else 
				{
					awokenIcon.classList.remove("allowable-assist");
				}
			}else
			{
				awokenIcon.classList.remove("full-awoken");
				awokenIcon.classList.remove("allowable-assist");
			}
			
		}
	}
	const sawoken = monDom.querySelector(".super-awoken");
	if (sawoken) //如果存在超觉醒的DOM且提供了超觉醒
	{
		if (mon.sawoken !== undefined && mon.sawoken>=0 && card.superAwakenings.length)
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
function editMon(AorB,isAssist,tempIdx)
{
	//数据
	const mon = formation.team[AorB][isAssist][tempIdx];
	const card = Cards[mon.id] || Cards[0];

	//对应的Dom
	const formationBox = document.querySelector(".formation-box .formation-"+(AorB?"B":"A")+"-box");
	
	const teamBox = formationBox.querySelector(isAssist?".formation-assist":".formation-team");
	const memberBox = teamBox.querySelector(".member-" + (tempIdx+1));

	const editBox = document.querySelector(".edit-box");
	const monsterBox = memberBox.querySelector(".monster");

	editBox.show();

	editBox.assist = isAssist;
	editBox.monsterBox = monsterBox;
	editBox.memberIdx = [AorB, isAssist, tempIdx]; //储存队伍数组下标
	editBox.assist = isAssist;
	if (!isAssist)
	{
		var latentBox = formationBox.querySelector(".formation-latents .latents-"+(tempIdx+1)+" .latent-ul");
		editBox.latentBox = latentBox;
	}

	var settingBox = editBox.querySelector(".setting-box");
	var monstersID = settingBox.querySelector(".row-mon-id .m-id");
	monstersID.value = mon.id>0?mon.id:0;
	monstersID.onchange();
	//觉醒
	var monEditAwokens = settingBox.querySelectorAll(".row-mon-awoken .awoken-ul .awoken-icon");
	if (mon.awoken>0 && monEditAwokens[mon.awoken]) monEditAwokens[mon.awoken].onclick();
	//超觉醒
	var monEditSAwokens = settingBox.querySelectorAll(".row-mon-super-awoken .awoken-ul .awoken-icon");
	if (mon.sawoken>=0 && monEditSAwokens[mon.sawoken]) monEditSAwokens[mon.sawoken].onclick();
	var monEditLv = settingBox.querySelector(".m-level");
	monEditLv.value = mon.level || 1;
	var monEditAddHp = settingBox.querySelector(".m-plus-hp");
	var monEditAddAtk = settingBox.querySelector(".m-plus-atk");
	var monEditAddRcv = settingBox.querySelector(".m-plus-rcv");
	if (mon.plus)
	{
		monEditAddHp.value = mon.plus[0];
		monEditAddAtk.value = mon.plus[1];
		monEditAddRcv.value = mon.plus[2];
	}
	const btnDelay = editBox.querySelector(".button-delay");
	const skillLevel = editBox.querySelector(".row-mon-skill .skill-box .m-skill-level");
	if (mon.skilllevel)
	{
		skillLevel.value = mon.skilllevel;
	}
	skillLevel.onchange();

	if (!isAssist)
	{
		editBox.latent = mon.latent ? mon.latent.concat() : [];
		editBox.refreshLatent(editBox.latent, mon.id);
		btnDelay.classList.add("display-none");
		settingBox.querySelector(".row-mon-latent").classList.remove("display-none");
		//if (card.superAwakenings.length)
		//{
		//	settingBox.querySelector(".row-mon-super-awoken").classList.remove("display-none");
		//}
		editBox.querySelector(".edit-box-title").classList.remove("edit-box-title-assist");
	}else
	{
		btnDelay.classList.remove("display-none");
		settingBox.querySelector(".row-mon-latent").classList.add("display-none");
		//settingBox.querySelector(".row-mon-super-awoken").classList.add("display-none");
		editBox.querySelector(".edit-box-title").classList.add("edit-box-title-assist");
	}
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

	const editBox = document.querySelector(".edit-box");
	const monInfoBox = editBox.querySelector(".monsterinfo-box");
	const searchBox = editBox.querySelector(".search-box");
	const settingBox = editBox.querySelector(".setting-box");

	//id搜索
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	const monHead = monInfoBox.querySelector(".monster");
	changeid({id:id},monHead); //改变图像
	const mId = monInfoBox.querySelector(".monster-id");
	mId.innerHTML = id;
	const mRare = monInfoBox.querySelector(".monster-rare");
	mRare.className = "monster-rare rare-" + card.rarity;
	const mName = monInfoBox.querySelector(".monster-name");
	mName.innerHTML = returnMonsterNameArr(card, currentLanguage.searchlist, currentDataSource.code)[0];

	const evoCardUl = settingBox.querySelector(".row-mon-id .evo-card-list");
	evoCardUl.style.display = "none";
	evoCardUl.innerHTML = ""; //据说直接清空HTML性能更好

	let evoLinkCardsIdArray = Cards.filter(function(m){
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

	let mType = monInfoBox.querySelectorAll(".monster-type li");
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
	let mSAwoken = mSAwokenRow.querySelectorAll(".awoken-ul li");
	//if (!editBox.assist && card.superAwakenings.length>0)
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
	monEditLvMax.innerHTML = monEditLvMax.value = card.maxLevel + (card.limitBreakIncr ? 11 : 0); //最大等级按钮
	const monEditLv = settingBox.querySelector(".m-level");
	monEditLv.value = card.maxLevel; //默认等级为最大等级而不是110

	const rowPlus =  settingBox.querySelector(".row-mon-plus");
	const rowLatent =  settingBox.querySelector(".row-mon-latent");
	const monLatentAllowUl = rowLatent.querySelector(".m-latent-allowable-ul");
	//该宠Type允许的杀
	let allowLatent = uniq(card.types.reduce(function (previous, t, index, array) {
		return previous.concat(type_allowable_latent[t]);
	},[]));
	for(let li=17;li<=24;li++) //显示允许的杀，隐藏不允许的杀
	{
		var latentDom = monLatentAllowUl.querySelector(".latent-icon-" + li);
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
	skillDetail.innerHTML = parseSkillDescription(skill);
	skillLevel.max = card.overlay ? 1 : skill.maxLevel;
	skillLevel.value = card.overlay ? 1 : skill.maxLevel;
	skillLevel_Max.value = card.overlay ? 1 : skill.maxLevel;
	skillLevel_Max.innerHTML = skill.maxLevel;
	skillCD.innerHTML = skill.initialCooldown - skill.maxLevel + 1;

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

	if (card.overlay)
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

	if (editBox.assist)
	{
		var btnDone = editBox.querySelector(".button-done");
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
	editBox.reCalculateAbility();
}
//刷新整个队伍
function refreshAll(formationData){
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const formationBox = document.querySelector(".formation-box");
	const titleBox = fragment.appendChild(formationBox.querySelector(".title-box"));
	const formationA_bigbox = fragment.appendChild(formationBox.querySelector(".formation-A-bigbox"));
	const formationB_bigbox = formationBox.querySelector(".formation-B-bigbox");
	if (formationB_bigbox)
	{fragment.appendChild(formationB_bigbox);}
	const awokenTotalBox = fragment.appendChild(formationBox.querySelector(".awoken-total-box"));
	const detailBox = fragment.appendChild(formationBox.querySelector(".detail-box"));

	const txtTitle = titleBox.querySelector(".title");
	const txtDetail = detailBox.querySelector(".detail");
	txtTitle.value = formationData.title || "";
	txtDetail.value = formationData.detail || "";
	
	const badges = Array.prototype.slice.call(formationA_bigbox.querySelectorAll(".formation-badge .badge-bg"));
	badges.forEach((b,idx)=>{
		if (idx==formationData.badge)
		{
			b.classList.remove("display-none");
		}else
		{
			b.classList.add("display-none");
		}
	});

	const formationA = formationA_bigbox.querySelector(".formation-A-box");
	const formationB = formationB_bigbox ? formationB_bigbox.querySelector(".formation-B-box") : null;
	
	const fATeam = formationA.querySelectorAll(".formation-team .monster");
	const fALatents = formationA.querySelectorAll(".formation-latents .latent-ul");
	const fAAssist = formationA.querySelectorAll(".formation-assist .monster");
	
	const fBTeam = formationB ? formationB.querySelectorAll(".formation-team .monster") : null;
	const fBLatents = formationB ? formationB.querySelectorAll(".formation-latents .latent-ul") : null;
	const fBAssist = formationB ? formationB.querySelectorAll(".formation-assist .monster") : null;

	const formationAbilityDom = formationA.querySelector(".formation-ability");
	for (let ti=0;ti<(formationB?5:6);ti++)
	{
		changeid(formationData.team[0][0][ti],fATeam[ti],fALatents[ti]);
		changeid(formationData.team[0][1][ti],fAAssist[ti]);
		if (formationAbilityDom)
		{
			refreshAbility(
				formationAbilityDom,
				formationData.team[0],
				ti);
		}
		refreshSkillCD(formationA,formationData.team[0],ti);
		if (formationB)
		{
			changeid(formationData.team[1][0][ti],fBTeam[ti],fBLatents[ti]);
			changeid(formationData.team[1][1][ti],fBAssist[ti]);
			refreshSkillCD(formationB,formationData.team[1],ti);
		}
	}
	formationBox.appendChild(fragment);
	refreshTotalAbility(formationData.team[0]);
	refreshAwokenCount(formationData.team);
	txtDetail.onblur(); //这个需要放在显示出来后再改才能生效
}
//刷新觉醒总计
function refreshAwokenCount(teams){
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenTotalBox = document.querySelector(".formation-box .awoken-total-box");
	const awokenUL = fragment.appendChild(awokenTotalBox.querySelector(".awoken-ul"));
	function setCount(idx,number){
		var aicon = awokenUL.querySelector(".awoken-" + idx);
		if (!aicon) return; //没有这个觉醒就撤回 
		var ali = aicon.parentNode;
		var countDom = ali.querySelector(".count");
		countDom.innerHTML = number;
		if (number)
			ali.classList.remove("display-none");
		else
			ali.classList.add("display-none");
	}
	var bigAwoken = [52,53,56,68,69,70]; //等于几个小觉醒的大觉醒
	for (var ai=1;ai<=72;ai++)
	{
		if (ai == 10) //防封
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo)+awokenCountInFormation(teams,52,solo)*2);
		}else if (ai == 11) //防暗
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo)+awokenCountInFormation(teams,68,solo)*5);
		}else if (ai == 12) //防废
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo)+awokenCountInFormation(teams,69,solo)*5);
		}else if (ai == 13) //防毒
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo)+awokenCountInFormation(teams,70,solo)*5);
		}else if (ai == 19) //手指
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo)+awokenCountInFormation(teams,53,solo)*2);
		}else if (ai == 21) //SB
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo)+awokenCountInFormation(teams,56,solo)*2);
		}else if (bigAwoken.indexOf(ai)>=0) //属于大觉醒
		{
			continue;
		}else
		{
			setCount(ai,awokenCountInFormation(teams,ai,solo));
		}
	}
	awokenTotalBox.appendChild(awokenUL);
}
//刷新能力值
function refreshAbility(abilityDom,team,idx){
	const ali = abilityDom.querySelector(".abilitys-" + (idx+1));
	const mainMD = team[0][idx];
	const assistMD = team[1][idx];
	const bonusScale = [0.1,0.05,0.15]; //辅助宠物附加的属性倍率
	//基底三维，如果辅助是武器，还要加上辅助的觉醒
	const mainAbility = calculateAbility(mainMD.id,mainMD.level,mainMD.plus,mainMD.awoken,mainMD.latent,assistMD.id,assistMD.awoken);
	//辅助增加的三维，如果辅助的主属性相等，辅助宠物只计算等级和加值，不计算觉醒
	const memberCard = Cards[mainMD.id] || Cards[0];
	const assistCard = Cards[assistMD.id] || Cards[0];

	const assistAbility = (assistMD.id > 0 && memberCard.attrs[0]==assistCard.attrs[0]) ?
			calculateAbility(assistMD.id,assistMD.level,assistMD.plus,null,null) :
			[0,0,0];
	if (mainAbility && mainMD.ability)
	{
		for (let ai=0;ai<3;ai++)
		{
			mainMD.ability[ai] = mainAbility[ai] + Math.round(assistAbility[ai]*bonusScale[ai]);
		}
	}
	const hpDom = ali.querySelector(".hp");
	const atkDom = ali.querySelector(".atk");
	const rcvDom = ali.querySelector(".rcv");
	[hpDom,atkDom,rcvDom].forEach(function(div,ai){
		if (mainAbility)
		{
			div.classList.remove("display-none");
			div.innerHTML = mainMD.ability[ai];
		}else
		{
			div.classList.add("display-none");
			div.innerHTML = 0;
		}
	});
}
//刷新能力值合计
function refreshTotalAbility(team){
	//计算总的生命值
	const formationBox = document.querySelector(".formation-box");
	const teamInfo = formationBox.querySelector(".team-info");
	if (!teamInfo) return;
	const tHpDom = teamInfo.querySelector(".tIf-total-hp");
	const tRcvDom = teamInfo.querySelector(".tIf-total-rcv");
	const tHP = team[0].reduce(function(value,mon){ //队伍计算的总HP
		return value += mon.ability ? mon.ability[0] : 0;
	},0);
	const teamHPAwoken = awokenCountInTeam(team,46,solo); //全队血包个数
	//let tHPwithAwoken = Math.round(tHP * (1 + awokenCountInTeam(team,46,solo) * 0.05)); //全队血包
	let badgeHPScale = 1; //徽章倍率
	if (formation.badge == 4)
	{
		badgeHPScale = 1.05;
	}else if (formation.badge == 11)
	{
		badgeHPScale = 1.15;
	}
	const tRCV = team[0].reduce(function(value,mon){ //队伍计算的总回复
		return value += mon.ability ? mon.ability[2] : 0;
	},0);
	const teamRCVAwoken = awokenCountInTeam(team,47,solo); //全队回复个数
	//let tRCVwithAwoken = Math.round(tRCV * (1 + awokenCountInTeam(team,47,solo) * 0.10)); //全队回复
	let badgeRCVScale = 1; //徽章倍率
	if (formation.badge == 3)
	{
		badgeRCVScale = 1.25;
	}else if (formation.badge == 10)
	{
		badgeRCVScale = 1.35;
	}
	tHpDom.innerHTML = tHP.toString() + 
		(teamHPAwoken>0||badgeHPScale>1 ?
			("("+Math.round(tHP * (1 + 0.05 * teamHPAwoken)*badgeHPScale).toString()+")") :
			"");
	tRcvDom.innerHTML = tRCV.toString() + 
		(teamRCVAwoken>0||badgeRCVScale>1 ?
			("("+Math.round(tRCV * (1 + 0.10 * teamRCVAwoken)*badgeRCVScale).toString()+")") :
			"");
}
//刷新能力值合计
function refreshTotalAbility(team){
	//计算总的生命值
	const formationBox = document.querySelector(".formation-box");
	const teamInfo = formationBox.querySelector(".team-info");
	if (!teamInfo) return;
	const tHpDom = teamInfo.querySelector(".tIf-total-hp");
	const tRcvDom = teamInfo.querySelector(".tIf-total-rcv");
	const tHP = team[0].reduce(function(value,mon){ //队伍计算的总HP
		return value += mon.ability ? mon.ability[0] : 0;
	},0);
	const teamHPAwoken = awokenCountInTeam(team,46,solo); //全队血包个数
	//let tHPwithAwoken = Math.round(tHP * (1 + awokenCountInTeam(team,46,solo) * 0.05)); //全队血包
	let badgeHPScale = 1; //徽章倍率
	if (formation.badge == 4)
	{
		badgeHPScale = 1.05;
	}else if (formation.badge == 11)
	{
		badgeHPScale = 1.15;
	}
	const tRCV = team[0].reduce(function(value,mon){ //队伍计算的总回复
		return value += mon.ability ? mon.ability[2] : 0;
	},0);
	const teamRCVAwoken = awokenCountInTeam(team,47,solo); //全队回复个数
	//let tRCVwithAwoken = Math.round(tRCV * (1 + awokenCountInTeam(team,47,solo) * 0.10)); //全队回复
	let badgeRCVScale = 1; //徽章倍率
	if (formation.badge == 3)
	{
		badgeRCVScale = 1.25;
	}else if (formation.badge == 10)
	{
		badgeRCVScale = 1.35;
	}
	tHpDom.innerHTML = tHP.toString() + 
		(teamHPAwoken>0||badgeHPScale>1 ?
			("("+Math.round(tHP * (1 + 0.05 * teamHPAwoken)*badgeHPScale).toString()+")") :
			"");
	tRcvDom.innerHTML = tRCV.toString() + 
		(teamRCVAwoken>0||badgeRCVScale>1 ?
			("("+Math.round(tRCV * (1 + 0.10 * teamRCVAwoken)*badgeRCVScale).toString()+")") :
			"");
}
//刷新技能CD
function refreshSkillCD(teamDom,team,idx){
	const memberMonDom = teamDom.querySelector(".formation-team .member-" + (idx+1) + " .monster");
	const assistMonDom = teamDom.querySelector(".formation-assist .member-" + (idx+1) + " .monster");
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

	if (member.skilllevel < memberSkill.maxLevel)
	{
		memberSkillCdDom.classList.remove("max-skill");
		assistSkillCdDom.classList.remove("max-skill");
	}else if (assist.skilllevel < assistSkill.maxLevel){
		memberSkillCdDom.classList.add("max-skill");
		assistSkillCdDom.classList.remove("max-skill");
	}else
	{
		memberSkillCdDom.classList.add("max-skill");
		assistSkillCdDom.classList.add("max-skill");
	}
}
