var ms = null;
var language = null;
var memberTeamObj = function(){
	return {id:0,level:0,awoken:0,plus:[0,0,0],latent:[]};
}
var memberAssistObj = function(){
	return {id:0,level:0,awoken:0,plus:[0,0,0]};
}
var teamObj = function(){
	return [
		[
			{id:0},
			{id:0},
			{id:0},
			{id:0},
			{id:0},
		],
		[
			{id:0},
			{id:0},
			{id:0},
			{id:0},
			{id:0},
		],
	];
}
var formation = {
	title:"",
	detail:"",
	team:[
		new teamObj(),//队伍A
		new teamObj(),//队伍B
	]
};
window.onload = function()
{
	//添加语言列表
	var controlBox = document.body.querySelector(".control-box");
	var langList = controlBox.querySelector(".languages");
	languageList.forEach(function(l){
		var langOpt = new Option(l.name,l.i18n);
		langList.options.add(langOpt);
	})

	var language_i18n = getQueryString("lang"); //获取参数指定的语言
	var browser_i18n = (navigator.language||navigator.userLanguage); //获取浏览器语言
	var hasLanguage = languageList.filter(function(l){
		if (language_i18n) //如果已指定就用指定的语言
			return language_i18n.indexOf(l.i18n)>=0;
		else
			return browser_i18n.indexOf(l.i18n)>=0;
	});
	language = hasLanguage.length?hasLanguage[hasLanguage.length-1]:languageList[0];
	document.head.querySelector("#language-css").href = "languages/"+language.i18n+".css";
	Array.prototype.slice.call(langList.options).some(function(lOpt){
		if (lOpt.value == language.i18n)
		{
			lOpt.selected = true;
			return true;
		}
	});

	GM_xmlhttpRequest({
		method: "GET",
		url:"monsters-info/mon.json",
		onload: function(response) {
			ms = JSON.parse(response.response);
			initialize();//初始化
			try
			{
				var idataQer = getQueryString("data");
				if (idataQer)
				{
					var idata = JSON.parse(idataQer);
					formation = idata;
					refreshAll(formation);
				}
			}catch(e)
			{
				console.log("初始数据解码出错",e);
			}
		},
		onerror: function(response) {
			console.error("怪物数据获取错误",response);
			try
			{
				ms = JSON.parse(response.response);
				initialize();//初始化

				var idataQer = getQueryString("data");
				if (idataQer)
				{
					var idata = JSON.parse(idataQer);
					formation = idata;
					refreshAll(formation);
				}
			}catch(e)
			{
				console.log("尝试解码Chrome错误返回失败。或初始数据解码出错。",e);
			}
		}
	});
}
window.onpopstate = function()
{ //前进后退时修改页面
	try
	{
		var idataQer = getQueryString("data");
		if (idataQer)
		{
			var idata = JSON.parse(idataQer);
			formation = idata;
			refreshAll(formation);
		}
	}catch(e)
	{
		console.log("初始数据解码出错",e);
	}
}
//创建新的分享地址
function creatNewUrl(lang){
	if (!!(window.history && history.pushState)) {
		// 支持History API
		var language_i18n = lang || getQueryString("lang"); //获取参数指定的语言
		history.pushState(null, null, '?' + (language_i18n?'lang=' + language_i18n + '&':'') + 'data=' + encodeURIComponent(JSON.stringify(formation)));
	}
}
//初始化
function initialize()
{
	var monstersList = document.querySelector("#monsters-list");
	ms.forEach(function(m){
		var opt = monstersList.appendChild(document.createElement("option"));
		opt.value = m.id;
		opt.label = m.id + " - " +  language.searchlist.map(function(lc){ //取出每种语言
			return m.name[lc];
		}).filter(function(ln){ //去掉空值
			return ln.length>0;
		}).join(" | ");
	});

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
	formationBox.formationBox = formation;

	//编辑框
	var editBox = document.querySelector(".edit-box");
	editBox.latent = []; //储存潜在觉醒
	editBox.assist = false; //储存是否为辅助宠物
	editBox.monsterBox = null;
	editBox.latentBox = null;
	editBox.memberIdx = []; //储存队伍数组下标
	editBox.show = function(){
		editBox.classList.remove("display-none");
		formationBox.classList.add("blur-bg");
	}
	editBox.hide = function(){
		editBox.classList.add("display-none");
		formationBox.classList.remove("blur-bg");
	}

	var settingBox = editBox.querySelector(".setting-box")
	//id搜索
	var monstersSearch = editBox.querySelector(".edit-box .m-id");
	monstersSearch.onchange = function(){
		if (/^\d+$/.test(this.value))
		{
			editBoxChangeMonId(parseInt(this.value));
		}
	}
	monstersSearch.oninput = monstersSearch.onchange;
	//觉醒
	var monEditAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".m-awoken-ul>.awoken-icon"));
	monEditAwokens.forEach(function(akDom,idx,domArr){
		akDom.onclick = function(){
			if (idx>0 && idx>=domArr.filter(function(d){return !d.classList.contains("display-none")}).length-1)
				domArr[0].innerHTML = "★";
			else
				domArr[0].innerHTML = idx;
			for(var ai=1;ai<domArr.length;ai++)
			{
				if(ai<=idx)
				{
					if(domArr[ai].classList.contains("unselected-awoken"))
						domArr[ai].classList.remove("unselected-awoken");
				}
				else
				{
					if(!domArr[ai].classList.contains("unselected-awoken"))
						domArr[ai].classList.add("unselected-awoken");
				}
			}
		}
	})
	//等级
	var monEditLv = settingBox.querySelector(".m-level");
	var monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.onclick = function(){
		monEditLv.value = this.value;
	}
	//加蛋
	var monEditAddHp = settingBox.querySelector(".m-plus-hp");
	var monEditAddAtk = settingBox.querySelector(".m-plus-atk");
	var monEditAddRcv = settingBox.querySelector(".m-plus-rcv");
	var monEditAddHp99 = settingBox.querySelector(".m-plus-hp-btn-99");
	monEditAddHp99.onclick = function(){monEditAddHp.value = this.value}
	var monEditAddAtk99 = settingBox.querySelector(".m-plus-atk-btn-99");
	monEditAddAtk99.onclick = function(){monEditAddAtk.value = this.value}
	var monEditAddRcv99 = settingBox.querySelector(".m-plus-rcv-btn-99");
	monEditAddRcv99.onclick = function(){monEditAddRcv.value = this.value}
	var monEditAdd297 = settingBox.querySelector(".m-plus-btn-297");
	monEditAdd297.onclick = function(){monEditAddHp.value = monEditAddAtk.value = monEditAddRcv.value = 99}
	//潜觉
	var monEditLatentUl = settingBox.querySelector(".m-latent-ul");
	var monEditLatents = Array.prototype.slice.call(monEditLatentUl.querySelectorAll("li"));
	var monEditLatentAllowableUl = settingBox.querySelector(".m-latent-allowable-ul");
	var monEditLatentsAllowable = Array.prototype.slice.call(monEditLatentAllowableUl.querySelectorAll("li"));
	function refreshLatent(latent) //刷新潜觉
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
	editBox.refreshLatent = refreshLatent;
	//已有觉醒的去除
	monEditLatents.forEach(function(l){
		l.onclick = function(){
			var aIdx = parseInt(this.value);
			editBox.latent.splice(aIdx,1);
			refreshLatent(editBox.latent);
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
			refreshLatent(editBox.latent);
		}
	})
	
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
		var mD = formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = editBox.assist?new memberAssistObj():new memberTeamObj();
		mD.id = parseInt(monstersSearch.value);
		mD.level = parseInt(monEditLv.value);
		mD.awoken = monEditAwokens.filter(function(akDom){
			return !akDom.classList.contains("unselected-awoken") && !akDom.classList.contains("display-none") 
		}).length - 1;
		mD.plus[0] = parseInt(monEditAddHp.value) || 0;
		mD.plus[1] = parseInt(monEditAddAtk.value) || 0;
		mD.plus[2] = parseInt(monEditAddRcv.value) || 0;
		if (!editBox.assist)
		{
			mD.latent = editBox.latent.concat();
		}

		changeid(mD,editBox.monsterBox,editBox.latentBox);
		creatNewUrl();
		editBox.hide();
	}
	btnNull.onclick = function(){
		var mD = formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = {id:0};
		changeid(mD,editBox.monsterBox,editBox.latentBox);
		creatNewUrl();
		editBox.hide();
	}
	btnDelay.onclick = function(){ //应对威吓
		var mD = formation.team[editBox.memberIdx[0]][editBox.memberIdx[1]][editBox.memberIdx[2]] = {id:-1};
		changeid(mD,editBox.monsterBox,editBox.latentBox);
		creatNewUrl();
		editBox.hide();
	}
	
	var controlBox = document.body.querySelector(".control-box");
	var langList = controlBox.querySelector(".languages");
	langList.onchange = function(){
		creatNewUrl(this.value);
		history.go();
	}

	/*添对应语言执行的JS*/
	var languageJS = document.head.appendChild(document.createElement("script"));
	languageJS.id = "language-js";
	languageJS.type = "text/javascript";
	languageJS.src = "languages/"+language.i18n+".js";
}
//计算用了多少潜觉格子
function usedHole(latent)
{
	return latent.reduce(function(previous,current){
		return previous + (current>= 12?2:1);
	},0);
}
//改变一个怪物头像
function changeid(mon,monDom,latentDom)
{
	var md = ms[mon.id]; //怪物固定数据
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
		var idxInPage = (mon.id-1) % 100; //获取当前页面的总序号
		monDom.classList.add("pet-cards-index-x-" + idxInPage % 10); //添加X方向序号
		monDom.classList.add("pet-cards-index-y-" + parseInt(idxInPage / 10)); //添加Y方向序号
		monDom.querySelector(".property").className = "property property-" + md.ppt[0]; //主属性
		monDom.querySelector(".subproperty").className = "subproperty subproperty-" + md.ppt[1]; //副属性
		monDom.title = "No." + mon.id + " " + md.name[language.searchlist[0]] || md.name["ja"];
		monDom.href = mon.id.toString().replace(/^(\d+)$/ig,language.guideURL);
	}
	if (mon.level>0) //如果提供了等级
	{
		var levelDom = monDom.querySelector(".level");
		levelDom.innerHTML = mon.level;
		if (mon.level == 99 || (mon.level >= md.maxLevel && md.maxLevel <=99))
		{
			levelDom.classList.add("max");
		}else
		{
			levelDom.classList.remove("max");
		}
		if (md.maxLevel>99 && mon.level>=99)
			levelDom.classList.add("_110");
		else
			levelDom.classList.remove("_110");
	}
	if (mon.awoken>-1) //如果提供了觉醒
	{
		var awokenIcon = monDom.querySelector(".awoken-count");
		if (mon.awoken == 0 || md.awoken.length < 1) //没觉醒
		{
			awokenIcon.classList.add("display-none");
			awokenIcon.innerHTML = "";
		}else
		{
			awokenIcon.classList.remove("display-none");
			if (mon.awoken < md.awoken.length) //觉醒没满直接写数字
			{
				awokenIcon.innerHTML = mon.awoken;
				awokenIcon.classList.remove("allowable-assist");
			}else //满觉醒打星星
			{
				awokenIcon.innerHTML = "★";
				if (md.assist)
					awokenIcon.classList.add("allowable-assist");
				else
					awokenIcon.classList.remove("allowable-assist");
			}
		}
	}
	if (mon.plus) //如果提供了加值
	{
		monDom.querySelector(".plus .hp").innerHTML = mon.plus[0];
		monDom.querySelector(".plus .atk").innerHTML = mon.plus[1];
		monDom.querySelector(".plus .rcv").innerHTML = mon.plus[2];
		if (mon.plus[0]+mon.plus[1]+mon.plus[2] >= 297)
		{
			monDom.querySelector(".plus").classList.add("has297");
			monDom.querySelector(".plus").classList.remove("zero");
		}else if (mon.plus[0]+mon.plus[1]+mon.plus[2] <= 0)
		{
			monDom.querySelector(".plus").classList.add("zero");
			monDom.querySelector(".plus").classList.remove("has297");
		}else
		{
			monDom.querySelector(".plus").classList.remove("zero");
			monDom.querySelector(".plus").classList.remove("has297");
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
//点击怪物头像，出现编辑框
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

	var monstersSearch = editBox.querySelector(".search-box .m-id");
	monstersSearch.value = mD.id>0?mD.id:0;
	monstersSearch.onchange();
	var settingBox = editBox.querySelector(".setting-box");
	var monEditAwokens = settingBox.querySelectorAll(".m-awoken-ul .awoken-icon");
	if (mD.awoken>0) monEditAwokens[mD.awoken].onclick();
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
		editBox.latent = mD.latent || [];
		editBox.refreshLatent(editBox.latent);
		btnDelay.classList.add("display-none");
		settingBox.querySelector(".row-mon-latent").classList.remove("display-none");
		editBox.querySelector(".edit-box-title").classList.remove("edit-box-title-assist");
	}else
	{
		btnDelay.classList.remove("display-none");
		settingBox.querySelector(".row-mon-latent").classList.add("display-none");
		editBox.querySelector(".edit-box-title").classList.add("edit-box-title-assist");
	}
}

function editBoxChangeMonId(id)
{
	var md = ms[id]; //怪物固定数据
	if (!md){
		id = 0;
		md = ms[0]
	}
	var editBox = document.querySelector(".edit-box");
	var monInfoBox = editBox.querySelector(".monsterinfo-box");
	var me = monInfoBox.querySelector(".monster");
	changeid({id:id,},me); //改变图像
	var mId = monInfoBox.querySelector(".monster-id");
	mId.innerHTML = id;
	var mRare = monInfoBox.querySelector(".monster-rare");
	mRare.className = "monster-rare rare-" + md.rare;
	var mName = monInfoBox.querySelector(".monster-name");
	mName.innerHTML = md.name[language.searchlist[0]] || md.name["ja"];
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
	var mAwoken = settingBox.querySelectorAll(".m-awoken-ul li");
	mAwoken[0].innerHTML = md.awoken.length?"★":"0";
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

	var monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.innerHTML = monEditLvMax.value = md.maxLevel;
	var monEditLv = settingBox.querySelector(".m-level");
	monEditLv.value = md.maxLevel>99?99:md.maxLevel;

	var monLatentAllowUl = settingBox.querySelector(".m-latent-allowable-ul");
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
}

function refreshAll(fmt){
	var txtTitle = document.querySelector(".title-box .title");
	var txtDetail = document.querySelector(".detail-box .detail");
	txtTitle.value = fmt.title || "";
	txtDetail.value = fmt.detail || "";
	txtDetail.onblur();

	var formationA = document.querySelector(".formation-box .formation-A-box");
	var formationB = document.querySelector(".formation-box .formation-B-box");
	
	var fATeam = formationA.querySelectorAll(".formation-team .monster");
	var fALatents = formationA.querySelectorAll(".formation-latents .latent-ul");
	var fAAssist = formationA.querySelectorAll(".formation-assist .monster");
	var fBTeam = formationB.querySelectorAll(".formation-team .monster");
	var fBLatents = formationB.querySelectorAll(".formation-latents .latent-ul");
	var fBAssist = formationB.querySelectorAll(".formation-assist .monster");
	for (var ti=0;ti<5;ti++)
	{
		changeid(fmt.team[0][0][ti],fATeam[ti],fALatents[ti]);
		changeid(fmt.team[0][1][ti],fAAssist[ti]);
		changeid(fmt.team[1][0][ti],fBTeam[ti],fBLatents[ti]);
		changeid(fmt.team[1][1][ti],fBAssist[ti]);
	}
}