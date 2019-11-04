var ms = null; //怪物数据
var language = null; //当前语言
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
//队员基本的留空
var Member = function(){
	this.id=0;
}
Member.prototype.outObj = function(){
	var m = this;
	var obj = [
		m.id
	];
	if (m.level != undefined) obj.push(m.level);
	if (m.awoken != undefined) obj.push(m.awoken);
	if (m.plus != undefined) obj.push(m.plus);
	if (m.latent != undefined) obj.push(m.latent);
	if (m.sawoken != undefined) obj.push(m.sawoken);
	return obj;
}
Member.prototype.loadObj = function(m,dataVersion){
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	if (dataVersion == undefined) dataVersion = 1;
	this.id = dataVersion>1 ? m[0] : m.id;
	this.level = dataVersion>1 ? m[1] : m.level;
	this.awoken = dataVersion>1 ? m[2] : m.awoken;
	this.plus = dataVersion>1 ? m[3] : m.plus;
	if (!(this.plus instanceof Array)) this.plus = [0,0,0]; //如果潜觉不是数组，则改变
	this.latent = dataVersion>1 ? m[4] : m.latent;
	if (!(this.latent instanceof Array)) this.latent = []; //如果潜觉不是数组，则改变
	this.sawoken = dataVersion>1 ? m[5] : m.sawoken;
}
//只用来防坐的任何队员
var MemberDelay = function(){
	this.id=-1;
}
MemberDelay.prototype = Object.create(Member.prototype);
MemberDelay.prototype.constructor = MemberDelay;
//辅助队员
var MemberAssist = function(){
	this.level = 0;
	this.awoken = 0;
	this.plus = [0,0,0];
	Member.call(this);
}
MemberAssist.prototype = Object.create(Member.prototype);
MemberAssist.prototype.constructor = MemberAssist
//正式队伍
var MemberTeam = function(){
	this.latent = [];
	this.ability = [0,0,0];
	MemberAssist.call(this);
	//sawoken作为可选项目，默认不在内
}
MemberTeam.prototype = Object.create(MemberAssist.prototype);
MemberTeam.prototype.constructor = MemberTeam;

var Formation = function(teamCount,memberCount){
	this.title = "",
	this.detail = "",
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
}
Formation.prototype.outObj= function(){
	var obj = {
		t:this.title,
		d:this.detail,
		f:this.team.map(function(t){
			return t.map(function(st){
				return st.map(function(m){
					return m.outObj();
				})
			})
		})
	}
	if (this.badge>0) obj.b = this.badge; //徽章
	return obj;
}
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
			})
		})
	});
}
//创建一个新的怪物头像
function createCardHead(id)
{
	var cli = document.createElement("li");
	var cdom = cli.mon = cli.appendChild(document.createElement("a"));
	cdom.class = "monster";
	var property = cdom.appendChild(document.createElement("div"));
	property.className = "property";
	var subproperty = cdom.appendChild(document.createElement("div"));
	subproperty.className = "subproperty";
	var cid = cdom.appendChild(document.createElement("div"));
	cid.className = "id";
	changeid({id:id},cdom);
	return cli;
}
//切换怪物ID显示
function toggleShowMonId()
{
	document.body.classList.toggle('not-show-mon-id');
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
			Array.from(new Array(4)).map(()=>{return new MemberTeam()}),
			Array.from(new Array(4)).map(()=>{return new MemberAssist()})
		];
		//把右边的队长加到第二支队伍最后面
		formation.team[1][0].push(formation.team[0][0].splice(5,1)[0])
		formation.team[1][1].push(formation.team[0][1].splice(5,1)[0])
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
	var controlBox = document.body.querySelector(".control-box");
	//添加语言列表
	var langList = controlBox.querySelector(".languages");
	languageList.forEach(function(l){
		var langOpt = new Option(l.name,l.i18n);
		langList.options.add(langOpt);
	})

	var language_i18n =  getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
	var browser_i18n = (navigator.language||navigator.userLanguage); //获取浏览器语言
	var hasLanguage = languageList.filter(function(l){ //筛选出符合的语言
		if (language_i18n) //如果已指定就用指定的语言
			return language_i18n.indexOf(l.i18n)>=0;
		else
			return browser_i18n.indexOf(l.i18n)>=0;
	});
	language = hasLanguage.length?hasLanguage[hasLanguage.length-1]:languageList[0]; //没有找到指定语言的情况下，自动用默认的语言
	document.head.querySelector("#language-css").href = "languages/"+language.i18n+".css";
	Array.prototype.slice.call(langList.options).some(function(lOpt){
		if (lOpt.value == language.i18n)
		{
			lOpt.selected = true;
			return true;
		}
	});

	//添加数据来源列表
	let dataList = controlBox.querySelector(".datasource");
	dataSourceList.forEach(function(ds){
		let dsOpt = new Option(ds.source,ds.code);
		dataList.options.add(dsOpt);
	})
	let dataSourceCode =  getQueryString("s"); //获取参数指定的数据来源
	let hasDataSource = dataSourceList.filter(function(ds){ //筛选出符合的数据源
		return ds.code == dataSourceCode;
	});
	let dataSource = hasDataSource.length ? hasDataSource[0]: dataSourceList[0];
	document.body.classList.add("ds-"+dataSource.code);
	Array.prototype.slice.call(dataList.options).some(function(dOpt){
		if (dOpt.value == dataSource.code)
		{
			dOpt.selected = true;
			return true;
		}
	});

	GM_xmlhttpRequest({
		method: "GET",
		url:"monsters-info/mon_"+dataSource.code+".json",
		onload: function(response) {
			ms = JSON.parse(response.response);
			initialize();//初始化
			var idata;
			try
			{
				var idataQer = getQueryString("d") || getQueryString("data");
				if (idataQer)
				{
					idata = JSON.parse(idataQer);
				}
			}catch(e)
			{
				console.log("初始数据JSON解码出错",e);
				return;
			}
			if (idata)
			{
				//formation = idata;
				formation.loadObj(idata);
				refreshAll(formation);
			}
		},
		onerror: function(response) {
			console.error("怪物数据获取错误",response);
			var idata;
			try
			{
				ms = JSON.parse(response.response);
				initialize();//初始化

				var idataQer = getQueryString("d") || getQueryString("data");
				if (idataQer)
				{
					idata = JSON.parse(idataQer);
				}
			}catch(e)
			{
				console.log("网络请求返回错误，尝试解码仍错误。",e);
				return;
			}
			if (idata)
			{
				//formation = idata;
				formation.loadObj(idata);
				refreshAll(formation);
			}
		}
	});
}
window.onpopstate = function()
{ //前进后退时修改页面
	var idata;
	try
	{
		var idataQer = getQueryString("d") || getQueryString("data");
		if (idataQer)
		{
			idata = JSON.parse(idataQer);
		}
	}catch(e)
	{
		console.log("初始数据JSON解码出错",e);
		return;
	}
	if (idata)
	{
		//formation = idata;
		formation.loadObj(idata);
		refreshAll(formation);
	}
}
//创建新的分享地址
function creatNewUrl(arg){
	if (arg == undefined) arg = {};
	if (!!(window.history && history.pushState)) {
		// 支持History API
		let language_i18n = arg.language || getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
		let datasource = arg.datasource || getQueryString("s");
		let outObj = formation.outObj();
		
		let newUrl = (arg.url?arg.url:"")
		+ '?' 
		+ (language_i18n?'l=' + language_i18n + '&':'') 
		+ (datasource&&datasource!="ja"?'s=' + datasource + '&':'') 
		+ 'd=' + encodeURIComponent(JSON.stringify(outObj));

		if (!arg.notPushState) history.pushState(null, null, newUrl);
		return newUrl;
	}
}
//初始化
function initialize()
{
	var monstersList = document.querySelector("#monsters-list");
	ms.forEach(function(m){
		var opt = monstersList.appendChild(document.createElement("option"));
		opt.value = m.id;
		opt.label = m.id + " - " +  returnMonsterNameArr(m,language.searchlist).join(" | ");
	});
	//控制框
	var controlBox = document.querySelector(".control-box");

	//标题和介绍文本框
	var txtTitle = document.querySelector(".title-box .title");
	var txtDetail = document.querySelector(".detail-box .detail");
	txtTitle.onchange = function(){
		formation.title = this.value;
		creatNewUrl();
	}
	txtDetail.onchange = function(){
		formation.detail = this.value;
		creatNewUrl();
	}
	txtDetail.onblur = function(){
		this.style.height=this.scrollHeight+"px";
	}

	//队伍框
	var formationBox = document.querySelector(".formation-box");
	formationBox.formation = formation;
	
	//徽章
	var badges = Array.prototype.slice.call(formationBox.querySelectorAll(".formation-badge .badge-bg"));
	badges.forEach(function(badge,bidx){
		badge.onclick = function(){
			if (badges.some(function(b){return b.classList.contains("display-none");}))
			{ //未展开时
				badges.forEach(function(b,idx){if (idx!=bidx)b.classList.remove("display-none");})
			}else
			{ //展开时
				badges.forEach(function(b,idx){if (idx!=bidx)b.classList.add("display-none");})
				formation.badge = bidx;
				refreshTotalAbility(formation.team[0]);
				creatNewUrl();
			}
		}
	})

	//编辑框
	var editBox = document.querySelector(".edit-box");
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
	}
	editBox.hide = function(){
		editBox.classList.add("display-none");
		formationBox.classList.remove("blur-bg");
		controlBox.classList.remove("blur-bg");
	}

	var settingBox = editBox.querySelector(".setting-box")
	//id搜索
	var monstersID = editBox.querySelector(".edit-box .m-id");
	monstersID.onchange = function(){
		if (/^\d+$/.test(this.value))
		{
			editBox.mid = parseInt(this.value);
			editBoxChangeMonId(editBox.mid);
		}
	}
	monstersID.oninput = monstersID.onchange;
	//觉醒
	var monEditAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".row-mon-awoken .awoken-ul .awoken-icon"));
	monEditAwokens.forEach(function(akDom,idx,domArr){
		akDom.onclick = function(){
			editBox.awokenCount = idx;
			editBox.reCalculateAbility();
			editBox.refreshAwokens();
		};
	});
	//刷新觉醒
	editBox.refreshAwokens = function(){
		monEditAwokens[0].innerHTML = editBox.awokenCount;
		if (editBox.awokenCount>0 && editBox.awokenCount==(ms[editBox.mid].awoken.length))
			monEditAwokens[0].classList.add("full-awoken");
		else
			monEditAwokens[0].classList.remove("full-awoken");
		for(var ai=1;ai<monEditAwokens.length;ai++)
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
	}

	//超觉醒
	var monEditSAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".row-mon-super-awoken .awoken-ul .awoken-icon"));
	monEditSAwokens.forEach(function(akDom,idx,domArr){
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
		}
	})

	//等级
	var monEditLv = settingBox.querySelector(".m-level");
	monEditLv.onchange = function(){editBox.reCalculateAbility();};
	var monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.onclick = function(){
		var ipt = monEditLv;
		if (ipt.value != this.value)
		{
			ipt.value = this.value;
			ipt.onchange();
		}
	};
	//加蛋
	var monEditAddHpLi = settingBox.querySelector(".row-mon-plus .m-plus-hp-li");
	var monEditAddAtkLi = settingBox.querySelector(".row-mon-plus .m-plus-atk-li");
	var monEditAddRcvLi = settingBox.querySelector(".row-mon-plus .m-plus-rcv-li");
	var monEditAddHp = monEditAddHpLi.querySelector(".m-plus-hp");
	monEditAddHp.onchange = function(){editBox.reCalculateAbility();};
	var monEditAddAtk = monEditAddAtkLi.querySelector(".m-plus-atk");
	monEditAddAtk.onchange = function(){editBox.reCalculateAbility();};
	var monEditAddRcv = monEditAddRcvLi.querySelector(".m-plus-rcv");
	monEditAddRcv.onchange = function(){editBox.reCalculateAbility();};
	//3个快速设置按钮
	var monEditAddHpBtn = monEditAddHpLi.querySelector(".m-plus-btn");
	monEditAddHpBtn.onclick = function(){
		var ipt = monEditAddHp;
		if (ipt.value != this.value)
		{
			ipt.value = this.value;
			ipt.onchange();
		}
	};
	var monEditAddAtkBtn = monEditAddAtkLi.querySelector(".m-plus-btn");
	monEditAddAtkBtn.onclick = function(){
		var ipt = monEditAddAtk;
		if (ipt.value != this.value)
		{
			ipt.value = this.value;
			ipt.onchange();
		}
	};
	var monEditAddRcvBtn = monEditAddRcvLi.querySelector(".m-plus-btn");
	monEditAddRcvBtn.onclick = function(){
		var ipt = monEditAddRcv;
		if (ipt.value != this.value)
		{
			ipt.value = this.value;
			ipt.onchange();
		}
	};
	//297按钮
	var monEditAdd297 = settingBox.querySelector(".row-mon-plus .m-plus-btn-297");
	monEditAdd297.onclick = function(){monEditAddHp.value = monEditAddAtk.value = monEditAddRcv.value = 99;editBox.reCalculateAbility();}
	//三维的计算值
	var monEditHpValue = monEditAddHpLi.querySelector(".ability-value");
	var monEditAtkValue = monEditAddAtkLi.querySelector(".ability-value");
	var monEditRcvValue = monEditAddRcvLi.querySelector(".ability-value");
	
	//潜觉
	var monEditLatentUl = settingBox.querySelector(".m-latent-ul");
	var monEditLatents = Array.prototype.slice.call(monEditLatentUl.querySelectorAll("li"));
	var monEditLatentAllowableUl = settingBox.querySelector(".m-latent-allowable-ul");
	var monEditLatentsAllowable = Array.prototype.slice.call(monEditLatentAllowableUl.querySelectorAll("li"));
	editBox.refreshLatent = function(latent) //刷新潜觉
	{
		if (this.value<0) return;
		var usedHoleN = usedHole(latent);
		for (var ai=0;ai<6;ai++)
		{
			if (latent[ai])
			{
				monEditLatents[ai].className = "latent-icon latent-icon-" + latent[ai];
				monEditLatents[ai].value = ai;
			}
			else if(ai<(6-usedHoleN+latent.length))
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
	}
	//已有觉醒的去除
	monEditLatents.forEach(function(l){
		l.onclick = function(){
			var aIdx = parseInt(this.value);
			editBox.latent.splice(aIdx,1);
			editBox.reCalculateAbility();
			editBox.refreshLatent(editBox.latent);
		}
	})
	//可选觉醒的添加
	monEditLatentsAllowable.forEach(function(la){
		la.onclick = function(){
			if (this.classList.contains("unselected-latent")) return;
			var lIdx = parseInt(this.value);
			var usedHoleN = usedHole(editBox.latent);
			if (lIdx >= 12 && usedHoleN<=4)
				editBox.latent.push(lIdx);
			else if (lIdx < 12 && usedHoleN<=5)
				editBox.latent.push(lIdx);

			editBox.reCalculateAbility();
			editBox.refreshLatent(editBox.latent);
		}
	})

	//重新计算怪物的能力
	editBox.reCalculateAbility = function(){
		var monid = parseInt(monstersID.value || 0);
		var level = parseInt(monEditLv.value || 0);
		var awoken = editBox.awokenCount;
		var plus = [
			parseInt(monEditAddHp.value || 0),
			parseInt(monEditAddAtk.value || 0),
			parseInt(monEditAddRcv.value || 0)
		];
		var latent = editBox.latent;
		var abilitys = calculateAbility(monid,level,plus,awoken,latent);

		[monEditHpValue,monEditAtkValue,monEditRcvValue].forEach(function(div,idx){
			if (abilitys)
				div.innerHTML = abilitys[idx];
			else
				div.innerHTML = 0;
		})
	}

	var btnCancel = editBox.querySelector(".button-cancel");
	var btnDone = editBox.querySelector(".button-done");
	var btnNull = editBox.querySelector(".button-null");
	var btnDelay = editBox.querySelector(".button-delay");
	btnCancel.onclick = function(){
		btnDone.classList.remove("cant-assist");
		btnDone.disabled = false;
		editBox.memberIdx = [];
		editBox.hide();
	}
	btnDone.onclick = function(){
		if (parseInt(monEditLv.value) == 0)
		{
			btnNull.onclick();
			return;
		}
		var mD = formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = editBox.assist?new MemberAssist():new MemberTeam();
		mD.id = parseInt(monstersID.value);
		mD.level = parseInt(monEditLv.value);
		mD.awoken = editBox.awokenCount;
		if (ms[mD.id].sAwoken) //如果支持超觉醒
		{
			mD.sawoken = -1;
			for (var sai = 0;sai<monEditSAwokens.length;sai++)
			{
				
				if (
					!monEditSAwokens[sai].classList.contains("unselected-awoken") &&
					!monEditSAwokens[sai].classList.contains("display-none")
				)
				{
					mD.sawoken = sai;
					break;
				}
			}
		}
		
		if (ms[mD.id].type.some(function(t){return t == 0 || t == 12 || t == 14 || t == 15;}) && [303,305,307,600,602].indexOf(mD.id)<0)
		{ //当4种特殊type的时候是无法297和打觉醒的，但是5种小企鹅可以
			mD.plus = [0,0,0]; 
		}else
		{
			mD.plus[0] = parseInt(monEditAddHp.value) || 0;
			mD.plus[1] = parseInt(monEditAddAtk.value) || 0;
			mD.plus[2] = parseInt(monEditAddRcv.value) || 0;
			if (!editBox.assist)
			{ //如果不是辅助，则可以设定潜觉
				mD.latent = editBox.latent.concat();
			}
		}

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
	}
	window.onkeydown = function(e){
		if (!editBox.classList.contains("display-none"))
		{
			if (e.keyCode == 27)
			{ //按下ESC时，自动关闭编辑窗
				btnCancel.onclick();
			}
		}
	}
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
	}
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
	}
	
	//控制栏
	var controlBox = document.body.querySelector(".control-box");
	//语言选择
	var langList = controlBox.querySelector(".languages");
	langList.onchange = function(){
		creatNewUrl({language:this.value});
		history.go();
	}
	//数据源选择
	let dataList = controlBox.querySelector(".datasource");
	dataList.onchange = function(){
		creatNewUrl({datasource:this.value});
		history.go();
	}

	/*添对应语言执行的JS*/
	var languageJS = document.head.appendChild(document.createElement("script"));
	languageJS.id = "language-js";
	languageJS.type = "text/javascript";
	languageJS.src = "languages/"+language.i18n+".js";
}
//改变一个怪物头像
function changeid(mon,monDom,latentDom)
{
	var md = ms[mon.id]; //怪物固定数据
	monDom.setAttribute("data-cardid",mon.id); //设定新的id
	if (mon.id<0) //如果是延迟
	{
		monDom.parentNode.classList.add("delay");
		monDom.parentNode.classList.remove("null");
		return;
	}else if (mon.id==0) //如果是空
	{
		monDom.parentNode.classList.add("null");
		monDom.parentNode.classList.remove("delay");
		return;
	}else (mon.id>-1) //如果提供了id
	{
		monDom.parentNode.classList.remove("null");
		monDom.parentNode.classList.remove("delay");
		monDom.className = "monster";
		monDom.classList.add("pet-cards-" + Math.ceil(mon.id/100)); //添加图片编号
		/*if (md.name["ja"] == undefined || /^\?+/.test(md.name["ja"])) //如果没日文或日文是问号，就改为英文的图片
			monDom.classList.add("en-only");
		else
			monDom.classList.remove("en-only");*/
		var idxInPage = (mon.id-1) % 100; //获取当前页面的总序号
		monDom.classList.add("pet-cards-index-x-" + idxInPage % 10); //添加X方向序号
		monDom.classList.add("pet-cards-index-y-" + parseInt(idxInPage / 10)); //添加Y方向序号
		monDom.querySelector(".property").className = "property property-" + md.ppt[0]; //主属性
		monDom.querySelector(".subproperty").className = "subproperty subproperty-" + md.ppt[1]; //副属性
		monDom.title = "No." + mon.id + " " + md.name[language.searchlist[0]] || md.name["ja"];
		monDom.href = mon.id.toString().replace(/^(\d+)$/ig,language.guideURL);
	}
	var levelDom = monDom.querySelector(".level");
	if (levelDom) //如果提供了等级
	{
		var level = mon.level || 1;
		levelDom.innerHTML = level;
		if (level == md.maxLv)
		{ //如果等级刚好等于最大等级，则修改为“最大”的字
			levelDom.classList.add("max");
		}else
		{
			levelDom.classList.remove("max");
		}
		if (md.a110 && level >= md.maxLv)
		{ //如果支持超觉，并且等级超过99，就添加支持超觉的蓝色
			levelDom.classList.add("_110");
		}else
		{
			levelDom.classList.remove("_110");
		}
	}
	if (mon.awoken>-1) //如果提供了觉醒
	{
		var awokenIcon = monDom.querySelector(".awoken-count");
		if (mon.awoken == 0 || md.awoken.length < 1 || !awokenIcon) //没觉醒
		{
			awokenIcon.classList.add("display-none");
			awokenIcon.innerHTML = "";
		}else
		{
			awokenIcon.classList.remove("display-none");
			awokenIcon.innerHTML = mon.awoken;
			if (mon.awoken == md.awoken.length)
			{
				awokenIcon.classList.add("full-awoken");
				if (md.assist)
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
	var sawoken = monDom.querySelector(".super-awoken");
	if (sawoken) //如果存在超觉醒的DOM且提供了超觉醒
	{
		if (mon.sawoken != undefined && mon.sawoken>=0 && md.sAwoken)
		{
			var awokenIcon = sawoken.querySelector(".awoken-icon");
			sawoken.classList.remove("display-none");
			awokenIcon.className = "awoken-icon awoken-" + md.sAwoken[mon.sawoken];
		}else
		{
			sawoken.classList.add("display-none");
		}
	}
	var m_id = monDom.querySelector(".id");
	if (m_id) //怪物ID
	{
		m_id.innerHTML = mon.id;
	}
	var plusArr = mon.plus || [0,0,0];
	var plusDom = monDom.querySelector(".plus");
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
	if (latentDom && mon.latent) //如果提供了潜觉
	{
		var latent = mon.latent.sort(function(a,b){return b-a;});
		if (latent.length < 1)
			latentDom.classList.add("display-none");
		else
			latentDom.classList.remove("display-none");
		var latentDoms = Array.prototype.slice.call(latentDom.querySelectorAll("li"));
		var usedHoleN = usedHole(latent);
		for (var ai=0;ai<6;ai++)
		{
			if (latent[ai])
			{
				latentDoms[ai].className = "latent-icon latent-icon-" + latent[ai];
			}
			else if(ai<(6-usedHoleN+latent.length))
			{
				latentDoms[ai].className = "latent-icon";
			}
			else
			{
				latentDoms[ai].className = "display-none";
			}
		}
	}
}
//点击怪物头像，出现编辑窗
function editMon(AorB,isAssist,tempIdx)
{
	//数据
	var mD = formation.team[AorB][isAssist][tempIdx];

	//对应的Dom
	var formationBox = AorB?document.querySelector(".formation-box .formation-B-box"):document.querySelector(".formation-box .formation-A-box");
	
	var teamBox = isAssist?formationBox.querySelector(".formation-assist"):formationBox.querySelector(".formation-team");
	var memberBox = teamBox.querySelector(".member-" + (tempIdx+1));

	var editBox = document.querySelector(".edit-box");
	var monsterBox = memberBox.querySelector(".monster");

	editBox.show();

	editBox.assist = isAssist;
	editBox.monsterBox = monsterBox;
	editBox.memberIdx = [AorB,isAssist,tempIdx]; //储存队伍数组下标
	editBox.assist = isAssist;
	if (!isAssist)
	{
		var latentBox = formationBox.querySelector(".formation-latents .latents-"+(tempIdx+1)+" .latent-ul");
		editBox.latentBox = latentBox;
	}

	var monstersID = editBox.querySelector(".search-box .m-id");
	monstersID.value = mD.id>0?mD.id:0;
	monstersID.onchange();
	var settingBox = editBox.querySelector(".setting-box");
	//觉醒
	var monEditAwokens = settingBox.querySelectorAll(".row-mon-awoken .awoken-ul .awoken-icon");
	if (mD.awoken>0 && monEditAwokens[mD.awoken]) monEditAwokens[mD.awoken].onclick();
	//超觉醒
	var monEditSAwokens = settingBox.querySelectorAll(".row-mon-super-awoken .awoken-ul .awoken-icon");
	if (mD.sawoken>=0 && monEditSAwokens[mD.sawoken]) monEditSAwokens[mD.sawoken].onclick();
	var monEditLv = settingBox.querySelector(".m-level");
	monEditLv.value = mD.level || 1;
	var monEditAddHp = settingBox.querySelector(".m-plus-hp");
	var monEditAddAtk = settingBox.querySelector(".m-plus-atk");
	var monEditAddRcv = settingBox.querySelector(".m-plus-rcv");
	if (mD.plus)
	{
		monEditAddHp.value = mD.plus[0];
		monEditAddAtk.value = mD.plus[1];
		monEditAddRcv.value = mD.plus[2];
	}
	var btnDelay = editBox.querySelector(".button-delay");
	if (!isAssist)
	{
		editBox.latent = mD.latent?mD.latent.concat():[];
		editBox.refreshLatent(editBox.latent);
		btnDelay.classList.add("display-none");
		settingBox.querySelector(".row-mon-latent").classList.remove("display-none");
		if (ms[mD.id].sAwoken)settingBox.querySelector(".row-mon-super-awoken").classList.remove("display-none");
		editBox.querySelector(".edit-box-title").classList.remove("edit-box-title-assist");
	}else
	{
		btnDelay.classList.remove("display-none");
		settingBox.querySelector(".row-mon-latent").classList.add("display-none");
		settingBox.querySelector(".row-mon-super-awoken").classList.add("display-none");
		editBox.querySelector(".edit-box-title").classList.add("edit-box-title-assist");
	}
	editBox.reCalculateAbility();
}
//编辑窗，修改怪物ID
function editBoxChangeMonId(id)
{
	var md = ms[id]; //怪物固定数据
	if (!md){
		id = 0;
		md = ms[0]
	}
	var editBox = document.querySelector(".edit-box");
	//id搜索
	var monstersID = editBox.querySelector(".edit-box .m-id");
	var monInfoBox = editBox.querySelector(".monsterinfo-box");
	var me = monInfoBox.querySelector(".monster");
	changeid({id:id,},me); //改变图像
	var mId = monInfoBox.querySelector(".monster-id");
	mId.innerHTML = id;
	var mRare = monInfoBox.querySelector(".monster-rare");
	mRare.className = "monster-rare rare-" + md.rare;
	var mName = monInfoBox.querySelector(".monster-name");
	mName.innerHTML = returnMonsterNameArr(md,language.searchlist)[0];

	var evoCardUl = document.querySelector(".edit-box .search-box .evo-card-list");
	//var evoRootId = parseInt(evoCardUl.getAttribute("data-evoRootId")); //读取旧的id
	//evoCardUl.setAttribute("data-evoRootId",md.evoRootId); //设定新的id
	var evoLinkCardsId = ms.filter(function(m){
		return m.evoRootId == md.evoRootId && m.id != md.id;
	}).map(function(m){return m.id;});
	for (var ci=evoCardUl.childNodes.length-1;ci>=0;ci--)
	{ //删除所有旧内容
		var childN = evoCardUl.childNodes[ci];
		//if (evoLinkCardsId.indexOf(parseInt(childN.getAttribute("data-cardid")))<0)
		//{
		childN.remove();
		childN = null;
		//}
	}
	evoLinkCardsId.forEach(function(mid){
		var cli = createCardHead(mid);
		cli.mon.onclick = function(){
			monstersID.value = this.getAttribute("data-cardid");
			monstersID.onchange();
			return false;
		}
		evoCardUl.appendChild(cli);
	});

	var mType = monInfoBox.querySelectorAll(".monster-type li");
	for (var ti=0;ti<mType.length;ti++)
	{
		if (md.type[ti]>=0)
		{
			mType[ti].className = "type-name type-name-" + md.type[ti];
			mType[ti].firstChild.className = "type-icon type-icon-" + md.type[ti];
		}else
		{
			mType[ti].className = "display-none";
		}
	}

	var settingBox = editBox.querySelector(".setting-box");
	var mAwoken = settingBox.querySelectorAll(".row-mon-awoken .awoken-ul li");
	editBox.awokenCount = md.awoken.length;
	mAwoken[0].innerHTML = editBox.awokenCount?"★":"0";
	for (var ai=1;ai<mAwoken.length;ai++)
	{
		if (md.awoken[ai-1])
		{
			mAwoken[ai].className = "awoken-icon awoken-" + md.awoken[ai-1];
		}else
		{
			mAwoken[ai].className = "display-none";
		}
	}

	//超觉醒
	var mSAwokenRow = settingBox.querySelector(".row-mon-super-awoken");
	var mSAwoken = mSAwokenRow.querySelectorAll(".awoken-ul li");
	if (!editBox.assist && md.sAwoken && md.sAwoken.length>0)
	{
		mSAwokenRow.classList.remove("display-none");
		for (var ai=0;ai<mSAwoken.length;ai++)
		{
			if (ai < md.sAwoken.length)
				mSAwoken[ai].className = "awoken-icon unselected-awoken awoken-" + md.sAwoken[ai];
			else
				mSAwoken[ai].className = "display-none";
		}
	}else
	{
		mSAwokenRow.classList.add("display-none");
	}

	var monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.innerHTML = monEditLvMax.value = md.a110?110:md.maxLv; //最大等级按钮
	var monEditLv = settingBox.querySelector(".m-level");
	monEditLv.value = md.maxLv; //默认等级为最大等级而不是110

	var rowPlus =  settingBox.querySelector(".row-mon-plus");
	var rowLatent =  settingBox.querySelector(".row-mon-latent");
	if (ms[id].type.some(function(t){return t == 0 || t == 12 || t == 14 || t == 15;}) && [303,305,307,600,602].indexOf(id)<0)
	{ //当4种特殊type的时候是无法297和打觉醒的，但是5种小企鹅可以
		rowPlus.classList.add("disabled"); 
		rowLatent.classList.add("disabled"); 
	}else
	{
		rowPlus.classList.remove("disabled"); 
		rowLatent.classList.remove("disabled"); 
	}
	var monLatentAllowUl = rowLatent.querySelector(".m-latent-allowable-ul");
	//该宠Type允许的杀
	var allowLatent = uniq(md.type.reduce(function (previous, t, index, array) {
		return previous.concat(type_allowable_latent[t]);
	},[]));
	for(var li=17;li<=24;li++)
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

	if (editBox.assist)
	{
		var btnDone = editBox.querySelector(".button-done");
		if (!md.assist)
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
	editBox.refreshLatent(editBox.latent);
	editBox.reCalculateAbility();
}
//刷新整个队伍
function refreshAll(fmt){
	var txtTitle = document.querySelector(".title-box .title");
	var txtDetail = document.querySelector(".detail-box .detail");
	txtTitle.value = fmt.title || "";
	txtDetail.value = fmt.detail || "";
	txtDetail.onblur();
	
	var badges = Array.prototype.slice.call(document.querySelectorAll(".formation-box .formation-badge .badge-bg"));
	badges.forEach(function(b,idx){if (idx==fmt.badge) b.classList.remove("display-none"); else b.classList.add("display-none");})

	var formationA = document.querySelector(".formation-box .formation-A-box");
	var formationB = document.querySelector(".formation-box .formation-B-box");
	
	var fATeam = formationA.querySelectorAll(".formation-team .monster");
	var fALatents = formationA.querySelectorAll(".formation-latents .latent-ul");
	var fAAssist = formationA.querySelectorAll(".formation-assist .monster");
	if (formationB)
	{
		var fBTeam = formationB.querySelectorAll(".formation-team .monster");
		var fBLatents = formationB.querySelectorAll(".formation-latents .latent-ul");
		var fBAssist = formationB.querySelectorAll(".formation-assist .monster");
	}
	var formationAbilityDom = document.querySelector(".formation-box .formation-ability");
	for (var ti=0;ti<(formationB?5:6);ti++)
	{
		changeid(fmt.team[0][0][ti],fATeam[ti],fALatents[ti]);
		changeid(fmt.team[0][1][ti],fAAssist[ti]);
		if (formationAbilityDom)
		{
			refreshAbility(
				formationAbilityDom,
				fmt.team[0],
				ti);
			refreshTotalAbility(fmt.team[0]);
		}
		if (formationB)
		{
			changeid(fmt.team[1][0][ti],fBTeam[ti],fBLatents[ti]);
			changeid(fmt.team[1][1][ti],fBAssist[ti]);
		}
	}
	refreshAwokenCount(fmt.team);
}
//刷新觉醒总计
function refreshAwokenCount(teams){
	var awokenUL = document.querySelector(".awoken-total-box .awoken-ul");
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
}
//刷新能力值
function refreshAbility(dom,team,idx){
	var ali = dom.querySelector(".abilitys-" + (idx+1));
	var mainMD = team[0][idx];
	var assistMD = team[1][idx];
	var bonusScale = [0.1,0.05,0.15]; //辅助宠物附加的属性
	//基底三维，如果辅助是武器，还要加上辅助的觉醒
	var mainAbility = calculateAbility(mainMD.id,mainMD.level,mainMD.plus,mainMD.awoken,mainMD.latent,assistMD.id,assistMD.awoken);
	//辅助增加的三维，如果辅助的主属性相等，辅助宠物只计算等级和加值，不计算觉醒
	var assistAbility = (assistMD.id > 0 && ms[mainMD.id].ppt[0]==ms[assistMD.id].ppt[0])
		?calculateAbility(assistMD.id,assistMD.level,assistMD.plus,null,null)
		:[0,0,0];
	if (mainAbility && mainMD.ability)
	{
		for (let ai=0;ai<3;ai++)
		{
			mainMD.ability[ai] = mainAbility[ai] + Math.round(assistAbility[ai]*bonusScale[ai]);
		}
	}
	var hpDom = ali.querySelector(".hp");
	var atkDom = ali.querySelector(".atk");
	var rcvDom = ali.querySelector(".rcv");
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
	let tHpDom = document.querySelector(".formation-box .team-info .tIf-total-hp");
	let tRcvDom = document.querySelector(".formation-box .team-info .tIf-total-rcv");
	let tHP = team[0].reduce(function(value,mon){ //队伍计算的总HP
		return value += mon.ability ? mon.ability[0] : 0;
	},0);
	let teamHPAwoken = awokenCountInTeam(team,46,solo); //全队血包个数
	//let tHPwithAwoken = Math.round(tHP * (1 + awokenCountInTeam(team,46,solo) * 0.05)); //全队血包
	let badgeHPScale = 1; //徽章倍率
	if (formation.badge == 4)
	{
		badgeHPScale = 1.05;
	}else if (formation.badge == 11)
	{
		badgeHPScale = 1.15;
	}
	let tRCV = team[0].reduce(function(value,mon){ //队伍计算的总回复
		return value += mon.ability ? mon.ability[2] : 0;
	},0);
	let teamRCVAwoken = awokenCountInTeam(team,47,solo); //全队回复个数
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
		(teamHPAwoken>0||badgeHPScale>1 
			? ("("+Math.round(tHP * (1 + 0.05 * teamHPAwoken)*badgeHPScale).toString()+")")
			: "");
	tRcvDom.innerHTML = tRCV.toString() + 
		(teamRCVAwoken>0||badgeRCVScale>1 
			? ("("+Math.round(tRCV * (1 + 0.10 * teamRCVAwoken)*badgeRCVScale).toString()+")")
			: "");
}