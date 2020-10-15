var Cards = []; //怪物数据
var Skills = []; //技能数据
var currentLanguage; //当前语言
var currentDataSource; //当前数据

const teamBigBoxs = []; //储存全部teamBigBox
const allMembers = []; //储存所有成员，包含辅助

var interchangeSvg; //储存划线的SVG
var controlBox; //储存整个controlBox
var statusLine; //储存状态栏
var formationBox; //储存整个formationBox
var editBox; //储存整个editBox
var showSearch; //整个程序都可以用的显示搜索函数

const dataStructure = 3; //阵型输出数据的结构版本
const className_displayNone = "display-none";
const isGuideMod = Boolean(parseInt(getQueryString("guide"))); //是否以图鉴模式启动

if (location.search.includes('&amp;')) {
	location.search = location.search.replace(/&amp;/ig, '&');
}

//一开始就加载当前语言
if (currentLanguage == undefined)
{
	const parameter_i18n = getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
	const browser_i18n = (navigator.language || navigator.userLanguage); //获取浏览器语言
	currentLanguage = languageList.find(lang => { //筛选出符合的语言
			if (parameter_i18n) //如果已指定就用指定的语言
				return parameter_i18n.includes(lang.i18n);
			else //否则筛选浏览器默认语言
				return browser_i18n.includes(lang.i18n);
		}) ||
		languageList[0]; //没有找到指定语言的情况下，自动用第一个语言（英语）
	//因为Script在Head里面，所以可以这里head已经加载好可以使用
	document.head.querySelector("#language-css").href = `languages/${currentLanguage.i18n}.css`;
}

//一开始就加载当前数据
if (currentDataSource == undefined)
{
	const parameter_dsCode = getQueryString("s"); //获取参数指定的数据来源
	currentDataSource = parameter_dsCode ?
		(dataSourceList.find(ds => ds.code == parameter_dsCode) || dataSourceList[0]) : //筛选出符合的数据源
		dataSourceList[0]; //没有指定，直接使用日服
}

const dbName = "PADDF";
var db = null;
const DBOpenRequest = indexedDB.open(dbName,2);

DBOpenRequest.onsuccess = function(event) {
	db = event.target.result; //DBOpenRequest.result;
	console.log("PADDF：数据库已可使用");
	loadData();
};
DBOpenRequest.onerror = function(event) {
	// 错误处理
	console.log("PADDF：数据库无法启用，删除可能存在的异常数据库。",event);
	indexedDB.deleteDatabase(dbName); //直接把整个数据库删掉
	console.log("也可能是隐私模式导致无法启用数据库，于是尝试不保存的情况下读取数据。");
	loadData();
	//alert('Some errors have occurred, please refresh the page.');
	//history.go(); //直接强制刷新
};
DBOpenRequest.onupgradeneeded = function(event) {
	let db = event.target.result;

	let store;
	// 建立一个对象仓库来存储用户的相关信息，我们选择 id 作为键路径（key path）
	// 因为 id 可以保证是不重复的
	store = db.createObjectStore("cards");
	store = db.createObjectStore("skills");

	// 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
	store.transaction.oncomplete = function(event) {
		console.log("PADDF：数据库建立完毕");
	};
};

/*class Member2
{
	constructor(oldMenber = null,isAssist = false)
	{
		if (oldMenber)
		{ //Copy一个
			this.id = oldMenber.id;
			this.level = oldMenber.level;
			this.plus = [...oldMenber.plus];
			this.awoken = oldMenber.awoken;
			this.sAwoken = oldMenber.sAwoken;
			this.latent = [...oldMenber.latent];
			this.skilllevel = oldMenber.sAwoken;
			this.assist = oldMenber.assist;
		}else
		{ //全新的
			this.id = 0;
			this.level = 1;
			this.plus = [0,0,0];
			this.awoken = 0;
			this.sAwoken = null;
			this.latent = [];
			this.skilllevel = null;
			this.assist = null;
		}
		this.isAssist = isAssist;
	}
	calculateAbility(solo,teamCount){
		const card = Cards[this.id];
		let bonus = null;
		if (!this.isAssist &&
			this.assist &&
			this.assist.id>0 &&
			Cards[this.assist.id].attrs[0] === card.attrs[0]
		){
			bonus = this.assist.calculateAbility(solo,teamCount);
		}
	}
	toJSON(){

	}
}*/
//队员基本的留空
var Member = function() {
	this.id = 0;
	this.ability = [0, 0, 0];
	this.abilityNoAwoken = [0, 0, 0];
};
Member.prototype.outObj = function() {
	const m = this;
	let obj = [m.id];
	if (m.level != undefined) obj[1] = m.level;
	if (m.awoken != undefined) obj[2] = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length >= 3 && (m.plus[0] + m.plus[1] + m.plus[2]) != 0) {
		if (m.plus[0] === m.plus[1] && m.plus[0] === m.plus[2]) { //当3个加值一样时只生成第一个减少长度
			obj[3] = m.plus[0];
		} else {
			obj[3] = m.plus;
		}
	}
	if (m.latent != undefined && m.latent instanceof Array && m.latent.length >= 1) obj[4] = m.latent;
	if (m.sawoken != undefined && m.sawoken >= 0) obj[5] = m.sawoken;
	const card = Cards[m.id] || Cards[0]; //怪物固定数据
	const skill = Skills[card.activeSkillId];
	//有技能等级，并且技能等级低于最大等级时才记录技能
	if (m.skilllevel != undefined && m.skilllevel < skill.maxLevel) obj[6] = m.skilllevel;
	return obj;
};
Member.prototype.loadObj = function(m, dataVersion) {
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	if (dataVersion == undefined) dataVersion = 1;
	this.id = dataVersion > 1 ? m[0] : m.id;
	this.level = dataVersion > 1 ? m[1] : m.level;
	this.awoken = dataVersion > 1 ? m[2] : m.awoken;
	if (dataVersion > 1) {
		if (isNaN(m[3]) || m[3] == null) {
			this.plus = m[3];
		} else {
			const singlePlus = parseInt(m[3], 10); //如果只有一个数字时，复制3份
			this.plus = [singlePlus, singlePlus, singlePlus];
		}
	} else {
		this.plus = m.plus;
	}
	if (!(this.plus instanceof Array)) this.plus = [0, 0, 0]; //如果加值不是数组，则改变
	this.latent = dataVersion > 1 ? m[4] : m.latent;
	if (this.latent instanceof Array && dataVersion <= 2) this.latent = this.latent.map(l => l >= 13 ? l + 3 : l); //修复以前自己编的潜觉编号为官方编号
	if (!(this.latent instanceof Array)) this.latent = []; //如果潜觉不是数组，则改变
	this.sawoken = dataVersion > 1 ? m[5] : m.sawoken;
	this.skilllevel = m[6] || null;
};
Member.prototype.loadFromMember = function(m) {
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	this.id = m.id;
};
//只用来防坐的任何队员
var MemberDelay = function() {
	this.id = -1;
};
MemberDelay.prototype = Object.create(Member.prototype);
MemberDelay.prototype.constructor = MemberDelay;
//辅助队员
var MemberAssist = function() {
	this.level = 0;
	this.awoken = 0;
	this.plus = [0, 0, 0];
	Member.call(this);
};
MemberAssist.prototype = Object.create(Member.prototype);
MemberAssist.prototype.constructor = MemberAssist;
MemberAssist.prototype.loadFromMember = function(m) {
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	this.id = m.id;
	if (m.level != undefined) this.level = m.level;
	if (m.awoken != undefined) this.awoken = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length >= 3 && (m.plus[0] + m.plus[1] + m.plus[2]) > 0) this.plus = JSON.parse(JSON.stringify(m.plus));
	if (m.skilllevel != undefined) this.skilllevel = m.skilllevel;
};
//正式队伍
var MemberTeam = function() {
	this.latent = [];
	MemberAssist.call(this);
	//sawoken作为可选项目，默认不在内
};
MemberTeam.prototype = Object.create(MemberAssist.prototype);
MemberTeam.prototype.constructor = MemberTeam;
MemberTeam.prototype.loadFromMember = function(m) {
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		return;
	}
	this.id = m.id;
	if (m.level != undefined) this.level = m.level;
	if (m.awoken != undefined) this.awoken = m.awoken;
	if (m.plus != undefined && m.plus instanceof Array && m.plus.length >= 3 && (m.plus[0] + m.plus[1] + m.plus[2]) > 0) this.plus = JSON.parse(JSON.stringify(m.plus));
	if (m.latent != undefined && m.latent instanceof Array && m.latent.length >= 1) this.latent = JSON.parse(JSON.stringify(m.latent));
	if (m.sawoken != undefined) this.sawoken = m.sawoken;
	if (m.ability != undefined && m.ability instanceof Array && m.plus.length >= 3) this.ability = JSON.parse(JSON.stringify(m.ability));
	if (m.abilityNoAwoken != undefined && m.abilityNoAwoken instanceof Array && m.plus.length >= 3) this.abilityNoAwoken = JSON.parse(JSON.stringify(m.abilityNoAwoken));
	if (m.skilllevel != undefined) this.skilllevel = m.skilllevel;
};

var Formation = function(teamCount, memberCount) {
	this.title = "";
	this.detail = "";
	this.teams = [];
	for (let ti = 0; ti < teamCount; ti++) {
		const team = [
			[],
			[], 0
		]; //第三个是徽章
		for (let mi = 0; mi < memberCount; mi++) {
			team[0].push(new MemberTeam());
			team[1].push(new MemberAssist());
		}
		this.teams.push(team);
	}
};
Formation.prototype.outObj = function() {
	const obj = {};
	if (this.title != undefined && this.title.length > 0) obj.t = this.title;
	if (this.detail != undefined && this.detail.length > 0) obj.d = this.detail;
	obj.f = this.teams.map(t => {
		const teamArr = [];
		teamArr[0] = t[0].map(m =>
			m.outObj()
		);
		teamArr[1] = t[1].map(m =>
			m.outObj()
		);
		if (t[2]) teamArr[2] = t[2];
		return teamArr;
	});
	obj.v = dataStructure;
	return obj;
};
Formation.prototype.loadObj = function(f) {
	const dataVeision = f.v ? f.v : (f.f ? 2 : 1); //是第几版格式
	this.title = dataVeision > 1 ? f.t : f.title;
	this.detail = dataVeision > 1 ? f.d : f.detail;
	const loadTeamArr = dataVeision > 1 ? f.f : f.team;
	this.teams.forEach(function(t, ti) {
		const tf = loadTeamArr[ti];
		if (tf) {
			t[0].forEach(function(m, mi) {
				const fm = tf[0][mi];
				m.loadObj(fm, dataVeision);
			});
			t[1].forEach(function(m, mi) {
				const fm = tf[1][mi];
				m.loadObj(fm, dataVeision);
			});
			if (tf[2] != undefined) t[2] = tf[2]; //徽章
		}
	});
	if (f.b)
		this.teams[0][2] = f.b; //原来模式的徽章
};
//切换通用的切换className显示的函数
function toggleDomClassName(checkBox, className, checkedAdd = true, dom = document.body) {
	if (!checkBox) return;
	const checked = checkBox.checked;
	if (checked && checkedAdd || !checked && !checkedAdd) {
		dom.classList.add(className);
	} else {
		dom.classList.remove(className);
	}
}
//清除数据
function clearData()
{
	const locationURL = new URL(location);
	locationURL.searchParams.delete('d'); //删除数据
	locationURL.searchParams.delete('l'); //删除语言
	location = locationURL.toString();
}
//轮换ABC队伍
function swapABCteam()
{
	if (formation.teams.length > 1) {
		formation.teams.push(formation.teams.splice(0, 1)[0]); //将队伍1移动到最后
		creatNewUrl();
		refreshAll(formation);
	}
}
function swapHenshin(self)
{
	const backClassName = "henshin-back";
	const back = self.classList.contains(backClassName);
	let shouldChange = formation.teams.some(team=>
		team[0].some(member=>{
			const mid = member.id;
			const card = Cards[mid];
			return card.henshinFrom || card.henshinTo;
		})
	);
	//获得最终变身
	function finalHenshin(card)
	{
		if (card.henshinTo)
		{ //是变身的则返回
			if (card.evoRootId === card.henshinTo)
			{ //应对无限循环变身的问题
				return card;
			}
			return finalHenshin(Cards[card.henshinTo]);
		}
		return card;
	}
	if (shouldChange)
	{
		if (back)
		{ //回到变身前
			formation.teams.forEach(team=>{
				team[0].forEach(member=>{
					const mid = member.id;
					const card = Cards[mid];
					if (card.henshinFrom && member.level <= 99)
					{ //要变身后的才进行操作
						const _card = Cards[card.evoRootId];
						member.id = card.evoRootId;
						member.awoken = _card.awakenings.length;
						member.sawoken = null;
						const allowLatent = getAllowLatent(_card.types);
						member.latent = filterAllowLatent(member.latent,allowLatent);
					}
				});
			});
			self.classList.remove(backClassName);
		}else
		{ //跑到变身后
			formation.teams.forEach(team=>{
				team[0].forEach(member=>{
					const mid = member.id;
					const card = Cards[mid];
					if (card.henshinTo)
					{ //要变身前的才进行操作
						const _card = finalHenshin(card);
						member.id = _card.id;
						member.awoken = _card.awakenings.length;
					}
				});
			});
			self.classList.add(backClassName);
		}
		creatNewUrl();
		refreshAll(formation);
	}
}
//在单人和多人之间转移数据
function turnPage(toPage, e = null) {
	let pagename = null;
	switch (toPage) {
		case 1:
			if (formation.teams[0][0].length < 6) {
				//把第二支队伍的队长添加到最后方
				formation.teams[0][0].push(formation.teams[1][0][0]);
				formation.teams[0][1].push(formation.teams[1][1][0]);
			}
			//删掉第2支开始的队伍
			formation.teams.splice(1);
			pagename = "solo.html";
			break;
		case 2:
			if (formation.teams.length < 2) { //从1人到2人
				formation.teams[1] = [
					[],
					[]
				];
				//把右边的队长加到第二支队伍最后面
				formation.teams[1][0].splice(0, 0, formation.teams[0][0].splice(5, 1)[0]);
				formation.teams[1][1].splice(0, 0, formation.teams[0][1].splice(5, 1)[0]);
			} else { //从3人到2人，直接删除后面两个队伍
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
			if (formation.teams.length < 2) { //从1人到3人
			} else { //从2人到3人
				formation.teams[0][0].push(formation.teams[1][0][0]);
				formation.teams[0][1].push(formation.teams[1][1][0]);
				formation.teams[1][0].push(formation.teams[0][0][0]);
				formation.teams[1][1].push(formation.teams[0][1][0]);
			}
			formation.badge = 0;
			pagename = "triple.html";
			break;
	}
	const newURL = creatNewUrl({ url: pagename, notPushState: true });
	if (e && e.ctrlKey) {
		window.open(newURL);
	} else {
		location.href = newURL;
	}
}
window.onload = function() {
	controlBox = document.body.querySelector(".control-box");
	statusLine = controlBox.querySelector(".status"); //显示当前状态的
	formationBox = document.body.querySelector(".formation-box");
	editBox = document.body.querySelector(".edit-box");

	if (isGuideMod) {
		console.info('现在是 怪物图鉴 模式');
		document.body.classList.add('guide-mod');
	}

	const helpLink = controlBox.querySelector(".help-link");
	if (location.hostname.includes("gitee")) { helpLink.hostname = "gitee.com"; }

	//▼添加语言列表开始
	const langSelectDom = controlBox.querySelector(".languages");
	languageList.forEach(lang =>
		langSelectDom.options.add(new Option(lang.name, lang.i18n))
	);

	const langOptionArray = Array.from(langSelectDom.options);
	langOptionArray.find(langOpt => langOpt.value == currentLanguage.i18n).selected = true;

	//▲添加语言列表结束
	//▼添加数据来源列表开始
	const dataSelectDom = controlBox.querySelector(".datasource");
	dataSourceList.forEach(ds =>
		dataSelectDom.options.add(new Option(ds.source, ds.code))
	);
	
	const dataSourceOptionArray = Array.from(dataSelectDom.options);
	dataSourceOptionArray.find(dataOpt => dataOpt.value == currentDataSource.code).selected = true;
	//添加数据class
	document.body.classList.add("ds-" + currentDataSource.code);
	//▲添加数据来源列表结束

	//设定初始的显示设置
	toggleDomClassName(controlBox.querySelector("#show-mon-id"), 'not-show-mon-id', false);
	toggleDomClassName(controlBox.querySelector("#btn-show-mon-skill-cd"), 'show-mon-skill-cd');
	toggleDomClassName(controlBox.querySelector("#btn-show-awoken-count"), 'not-show-awoken-count', false);

	initialize(); //界面初始化
};

function loadData(force = false)
{
	if (force)
		console.info('强制更新数据。');
	const _time = new Date().getTime();

	//开始读取解析怪物数据
	const sourceDataFolder = "monsters-info";

	if (statusLine) statusLine.classList.add("loading-check-version");
	GM_xmlhttpRequest({
		method: "GET",
		url: `${sourceDataFolder}/ckey.json${force?`?t=${_time}`:''}`, //版本文件
		onload: function(response) {
			dealCkeyData(response.response);
		},
		onerror: function(response) {
			console.error("新的 Ckey JSON 数据获取失败。", response);
			return;
		}
	});
	//处理返回的数据
	function dealCkeyData(responseText)
	{ //处理数据版本
		let newCkeys; //当前的Ckey们
		let lastCkeys; //以前Ckey们
		let currentCkey; //获取当前语言的ckey
		let lastCurrentCkey; //以前的当前语言的ckey

		try {
			newCkeys = JSON.parse(responseText);
		} catch (e) {
			console.error("新的 Ckey 数据 JSON 解码出错。", e);
			return;
		}
		console.debug("目前使用的数据区服是 %s。", currentDataSource.code);
		
		currentCkey = newCkeys.find(ckey => ckey.code == currentDataSource.code); //获取当前语言的ckey
		lastCkeys = localStorage.getItem("PADDF-ckey"); //读取本地储存的原来的ckey
		try {
			lastCkeys = JSON.parse(lastCkeys);
			if (lastCkeys == null || !(lastCkeys instanceof Array))
				lastCkeys = [];
		} catch (e) {
			console.error("旧的 Ckey 数据 JSON 解码出错。", e);
			return;
		}
		lastCurrentCkey = lastCkeys.find(ckey => ckey.code == currentDataSource.code);
		if (!lastCurrentCkey) { //如果未找到上个ckey，则添加个新的
			lastCurrentCkey = {
				code: currentDataSource.code,
				ckey: {},
				updateTime: null
			};
			lastCkeys.push(lastCurrentCkey);
		}

		if (statusLine) statusLine.classList.remove("loading-check-version");
		if (statusLine) statusLine.classList.add("loading-mon-info");
		if (!force && db && currentCkey.ckey.card == lastCurrentCkey.ckey.card) {
			console.debug("Cards ckey相等，直接读取已有的数据。");
			const transaction = db.transaction([`cards`]);
			const objectStore = transaction.objectStore(`cards`);
			const request = objectStore.get(currentDataSource.code);
			request.onerror = function(event) {
				console.error("Cards 数据库内容读取失败。");
			};
			request.onsuccess = function(event) {
				if (request.result instanceof Array)
				{
					Cards = request.result;
					dealCardsData(Cards);
				}else
				{
					console.info("Cards 数据库内容不存在，需重新下载。");
					downloadCardsData();
				}
			};
		} else {
			console.log("Cards 需重新下载。");
			downloadCardsData();
		}
		
		function downloadCardsData()
		{
			GM_xmlhttpRequest({
				method: "GET",
				url: `${sourceDataFolder}/mon_${currentDataSource.code}.json?t=${_time}`, //Cards数据文件
				onload: function(response) {
					try {
						Cards = JSON.parse(response.response);
					} catch (e) {
						console.error("Cards 数据 JSON 解码出错。", e);
						return;
					}
					if (db)
					{
						const transaction = db.transaction([`cards`], "readwrite");
						transaction.oncomplete = function(event) {
							console.log("Cards 数据库写入完毕。");
							lastCurrentCkey.ckey.card = currentCkey.ckey.card;
							lastCurrentCkey.updateTime = currentCkey.updateTime;
							localStorage.setItem("PADDF-ckey", JSON.stringify(lastCkeys)); //储存新的ckey
							dealCardsData(Cards);
						};
						const objectStore = transaction.objectStore(`cards`);
						objectStore.put(Cards,currentDataSource.code);
					}else //隐私模式无法启动数据库
					{
						dealCardsData(Cards);
					}
				},
				onerror: function(response) {
					console.error("Cards JSON 数据获取失败。", response);
				}
			});
		}
		
		function dealCardsData()
		{
			if (editBox)
			{
				const monstersList = editBox.querySelector("#monsters-name-list");
				let fragment = document.createDocumentFragment();
				Cards.forEach(function(m) { //添加下拉框候选
					const opt = fragment.appendChild(document.createElement("option"));
					opt.value = m.id;
					opt.label = m.id + " - " + returnMonsterNameArr(m, currentLanguage.searchlist, currentDataSource.code).join(" | ");
	
					const linkRes = new RegExp("link:(\\d+)", "ig").exec(m.specialAttribute);
					if (linkRes) { //每个有链接的符卡，把它们被链接的符卡的进化根修改到链接前的
						const toId = parseInt(linkRes[1], 10);
						const _m = Cards[toId];
						_m.evoRootId = m.evoRootId;
						m.henshinTo = toId;
						_m.henshinFrom = m.id;
					}
				});
				monstersList.appendChild(fragment);
			}

			if (statusLine) statusLine.classList.remove("loading-mon-info");

			if (statusLine) statusLine.classList.add("loading-skill-info");
			if (!force && db && currentCkey.ckey.skill == lastCurrentCkey.ckey.skill) {
				console.debug("Skills ckey相等，直接读取已有的数据。");
				const transaction = db.transaction([`skills`]);
				const objectStore = transaction.objectStore(`skills`);
				const request = objectStore.get(currentDataSource.code);
				request.onerror = function(event) {
					console.error("Skills 数据库内容读取失败。");
				};
				request.onsuccess = function(event) {
					if (request.result instanceof Array)
					{
						Skills = request.result;
						dealSkillData(Skills);
					}else
					{
						console.info("Skills 数据库内容不存在，需重新下载。");
						downloadSkillData();
					}
				};
			} else {
				console.log("Skills 需重新下载。");
				downloadSkillData();
			}

			function downloadSkillData()
			{
				GM_xmlhttpRequest({
					method: "GET",
					url: `${sourceDataFolder}/skill_${currentDataSource.code}.json?t=${_time}`, //Skills数据文件
					onload: function(response) {
						try {
							Skills = JSON.parse(response.response);
						} catch (e) {
							console.log("Skills 数据 JSON 解码出错", e);
							return;
						}
						if (db)
						{
							const transaction = db.transaction([`skills`], "readwrite");
							transaction.oncomplete = function(event) {
								console.log("Skills 数据库写入完毕。");
								lastCurrentCkey.ckey.skill = currentCkey.ckey.skill;
								lastCurrentCkey.updateTime = currentCkey.updateTime;
								localStorage.setItem("PADDF-ckey", JSON.stringify(lastCkeys)); //储存新的ckey
								dealSkillData(Skills);
							};
							const objectStore = transaction.objectStore(`skills`);
							objectStore.put(Skills,currentDataSource.code);
						}else //隐私模式无法启动数据库
						{
							dealSkillData(Skills);
						}
					},
					onerror: function(response) {
						console.error("Skills JSON 数据获取失败", response);
					}
				});
			}
	
			function dealSkillData()
			{
				const updateTime = controlBox.querySelector(".datasource-updatetime");
				updateTime.textContent = new Date(currentCkey.updateTime).toLocaleString(undefined, { hour12: false });
	
				//initialize(); //初始化
				if (statusLine) statusLine.classList.remove("loading-skill-info");
				//如果通过的话就载入URL中的怪物数据
				reloadFormationData();
			}
		}

	}
}
//重新读取URL中的Data数据并刷新页面
function reloadFormationData() {
	let formationData;
	try {
		let parameterDataString = getQueryString("d") || getQueryString("data");
		formationData = JSON.parse(parameterDataString);
	} catch (e) {
		console.error("URL中队伍数据JSON解码出错", e);
		return;
	}
	if (formationData) {
		formation.loadObj(formationData);
		refreshAll(formation);
	}
	if (isGuideMod)
	{
		const mid = parseInt(getQueryString("id"));
		if (!isNaN(mid))
		{
			editBox.mid = mid;
			editBoxChangeMonId(mid);
		}
	}
}
window.onpopstate = reloadFormationData; //前进后退时修改页面
//创建新的分享地址
function creatNewUrl(arg) {
	if (arg == undefined) arg = {};
	if (!!(window.history && history.pushState)) { // 支持History API
		const language_i18n = arg.language || getQueryString("l") || getQueryString("lang"); //获取参数指定的语言
		const datasource = arg.datasource || getQueryString("s");
		const outObj = formation.outObj();

		const newSearch = new URLSearchParams();
		if (language_i18n) newSearch.set("l", language_i18n);
		if (datasource && datasource != "ja") newSearch.set("s", datasource);
		const dataJsonStr = JSON.stringify(outObj); //数据部分的字符串
		newSearch.set("d", dataJsonStr);

		const newUrl = (arg.url || "") + '?' + newSearch.toString();

		if (!arg.notPushState) {
			history.pushState(null, null, newUrl);
		} else {
			return newUrl;
		}
	}
}
//截图
function capture() {
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
			if (txtTitle.value.length == 0)
				titleBox.classList.add("edit");
			if (txtDetail.value.length == 0)
				detailBox.classList.add("edit");
		});
		//document.body.appendChild(canvas);
	});
}
//初始化
function initialize() {

	//触屏使用的切换显示的线条
	interchangeSVG = document.body.querySelector("#interchange-line");
	interchangeSVG.line = interchangeSVG.querySelector("g line");
	interchangeSVG.changePoint = function(p1, p2) {
		const line = this.line;
		if (p1 && p1.x != undefined)
			line.setAttribute("x1", p1.x);
		if (p1 && p1.y != undefined)
			line.setAttribute("y1", p1.y);
		if (p2 && p2.x != undefined)
			line.setAttribute("x2", p2.x);
		if (p2 && p2.y != undefined)
			line.setAttribute("y2", p2.y);
	};

	const updateTime = controlBox.querySelector(".datasource-updatetime");
	updateTime.onclick = function(){
		loadData(true);
	};

	//标题和介绍文本框
	const titleBox = formationBox.querySelector(".title-box");
	const detailBox = formationBox.querySelector(".detail-box");
	const txtTitle = titleBox.querySelector(".title");
	const txtDetail = detailBox.querySelector(".detail");
	const txtTitleDisplay = titleBox.querySelector(".title-display");
	const txtDetailDisplay = detailBox.querySelector(".detail-display");
	txtTitle.onchange = function() {
		formation.title = this.value;
		txtTitleDisplay.innerHTML = descriptionToHTML(this.value);
		creatNewUrl();
	};
	txtTitle.onblur = function() {
		if (this.value.length > 0)
			titleBox.classList.remove("edit");
	};
	txtDetail.onchange = function() {
		formation.detail = this.value;
		txtDetailDisplay.innerHTML = descriptionToHTML(this.value);
		creatNewUrl();
	};
	txtDetail.onblur = function() {
		if (this.value.length > 0)
			detailBox.classList.remove("edit");
		this.style.height = txtDetailDisplay.scrollHeight + "px";
	};
	txtTitleDisplay.onclick = function() {
		titleBox.classList.add("edit");
		txtTitle.focus();
	};
	txtDetailDisplay.onclick = function() {
		detailBox.classList.add("edit");
		txtDetail.focus();
	};

	//这个写法的目的其实是为了确保添加顺序与1、2、3一致，即便打乱了顺序，也能正确添加
	for (let ti = 0, ti_len = formationBox.querySelectorAll(".team-bigbox").length; ti < ti_len; ti++) {
		teamBigBoxs.push(formationBox.querySelector(`.teams .team-${ti+1}`));
	}

	//将所有怪物头像添加到全局数组
	teamBigBoxs.forEach(teamBigBox => {
		const teamBox = teamBigBox.querySelector(".team-box");
		const menbers = Array.from(teamBox.querySelectorAll(".team-members .monster"));
		const assist = Array.from(teamBox.querySelectorAll(".team-assist .monster"));
		menbers.forEach(m => {
			allMembers.push(m);
		});
		assist.forEach(m => {
			allMembers.push(m);
		});
	});
	//所有怪物头像，添加拖动交换的代码
	allMembers.forEach(m => {
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
	teamBigBoxs.forEach((teamBigBox, teamIdx) => {
		//徽章
		const teamBadge = teamBigBox.querySelector(".team-badge");
		if (!teamBadge) return;
		const badges = Array.from(teamBadge.querySelectorAll(".badge-radio"));

		function setBadge() {
			if (teamBadge.classList.contains(className_ChoseBadges)) {
				const team = formation.teams[teamIdx];
				teamBadge.classList.remove(className_ChoseBadges);
				team[2] = parseInt(this.value, 10);
				const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
				refreshTeamTotalHP(teamTotalInfoDom, team, teamIdx);
				creatNewUrl();
			} else {
				teamBadge.classList.add(className_ChoseBadges);
			}
		}
		badges.forEach(badge => badge.onclick = setBadge);
	});

	//编辑框
	editBox.mid = null; //储存怪物id
	editBox.latent = []; //储存潜在觉醒
	editBox.isAssist = false; //储存是否为辅助宠物
	editBox.monsterHead = null;
	editBox.latentBox = null;
	editBox.memberIdx = []; //储存队伍数组下标
	editBox.show = function() {
		this.classList.remove(className_displayNone);
		formationBox.classList.add("blur-bg");
		controlBox.classList.add("blur-bg");
	};
	editBox.hide = function() {
		this.classList.add(className_displayNone);
		formationBox.classList.remove("blur-bg");
		controlBox.classList.remove("blur-bg");
	};

	const smonsterinfoBox = editBox.querySelector(".monsterinfo-box");
	const mSeriesId = smonsterinfoBox.querySelector(".monster-seriesId");
	mSeriesId.onclick = function() { //搜索系列
		const seriesId = parseInt(this.getAttribute('data-seriesId'), 10);
		if (seriesId > 0) {
			showSearch(Cards.filter(card => card.seriesId == seriesId));
		}
	};
	const mCollabId = smonsterinfoBox.querySelector(".monster-collabId");
	mCollabId.onclick = function() { //搜索合作
		const collabId = parseInt(this.getAttribute('data-collabId'), 10);
		if (collabId > 0); {
			showSearch(Cards.filter(card => card.collabId == collabId));
		}
	};
	const mAltName = smonsterinfoBox.querySelector(".monster-altName");
	mAltName.onclick = function() { //搜索合作
		const altName = this.getAttribute('data-altName');
		if (altName.length > 0)
		{
			const splitAltName = altName.split("|");
			showSearch(Cards.filter(card =>
				splitAltName.some(alt =>
					alt.length > 0 &&
					(card.altName.includes(alt) || card.name.includes(alt))
				)
			));
		}
	};
	//创建一个新的怪物头像
	editBox.createCardHead = function(id, options = {}) {
		function clickHeadToNewMon() {
			monstersID.value = this.card.id;
			monstersID.onchange();
			return false; //取消链接的默认操作
		}
		//产生一个觉醒列表
		function creatAwokenList(awokens) {
			const ul = document.createElement("ul");
			ul.className = "awoken-ul";
			awokens.forEach(ak=>{
				const li = ul.appendChild(document.createElement("li"));
				const icon = li.appendChild(document.createElement("icon"));
				icon.className = "awoken-icon";
				icon.setAttribute("data-awoken-icon",ak);
			});
			return ul;
		}
		const cli = document.createElement("li");
		const cdom = cli.head = createCardA(id);
		cli.appendChild(cdom);
		changeid({ id: id }, cdom);
		const card = Cards[id];
		cli.card = card;
		if (options.showCD)
		{
			const CDPreview = cli.appendChild(document.createElement("div"));
			CDPreview.className = "cd-preview";
			if (card.activeSkillId>0)
			{
				const skill = Skills[card.activeSkillId];
				const CD_Max = skill.initialCooldown;
				const CD_Min = skill.initialCooldown - skill.maxLevel + 1;
				const CD_MinDom = CDPreview.appendChild(document.createElement("span"));
				CD_MinDom.className = "cd-min";
				if (CD_Max !== CD_Min)
				{	
					CD_MinDom.textContent = CD_Min;
				}else
				{
					CD_MinDom.classList.add(className_displayNone);
				}
				const CD_MaxDom = CDPreview.appendChild(document.createElement("span"));
				CD_MaxDom.className = "cd-max";
				CD_MaxDom.textContent = CD_Max;
			}
		}
		if (options.showAbilities || options.showAbilitiesWithAwoken)
		{
			const tempMon = {
				id: id,
				level: card.maxLevel + (card.limitBreakIncr ? 11 : 0),
				plus: [99,99,99],
				awoken: card.awakenings.length,
			};
			const abilities = calculateAbility(tempMon, null, solo, teamsCount);
			if (options.showAbilities && abilities)
			{
				const abilitiesPreview1 = cli.appendChild(document.createElement("ul"));
				abilitiesPreview1.className = "abilities-preview";
				const abilities1 = abilities.map(ab=>ab[1]);
				const hpDom = abilitiesPreview1.appendChild(document.createElement("li"));
				hpDom.className = "hp-preview";
				hpDom.textContent = abilities1[0];
				const atkDom = abilitiesPreview1.appendChild(document.createElement("li"));
				atkDom.className = "atk-preview";
				atkDom.textContent = abilities1[1];
				const rcvDom = abilitiesPreview1.appendChild(document.createElement("li"));
				rcvDom.className = "rcv-preview";
				rcvDom.textContent = abilities1[2];
			}
			if (options.showAbilitiesWithAwoken && abilities)
			{
				const abilitiesPreview2 = cli.appendChild(document.createElement("ul"));
				abilitiesPreview2.className = "abilities-with-awoken-preview";
				const abilities2 = abilities.map(ab=>ab[0]);
				const hpDom = abilitiesPreview2.appendChild(document.createElement("li"));
				hpDom.className = "hp-preview";
				hpDom.textContent = abilities2[0];
				const atkDom = abilitiesPreview2.appendChild(document.createElement("li"));
				atkDom.className = "atk-preview";
				atkDom.textContent = abilities2[1];
				const rcvDom = abilitiesPreview2.appendChild(document.createElement("li"));
				rcvDom.className = "rcv-preview";
				rcvDom.textContent = abilities2[2];
			}
		}
		if (options.showAwoken)
		{
			const awokenPreview = cli.appendChild(document.createElement("div"));
			awokenPreview.className = "awoken-preview";
			if (card.awakenings.length)
			{
				const akUl = awokenPreview.appendChild(creatAwokenList(card.awakenings)); //添加觉醒
				akUl.classList.add("awoken-preview-awakenings");
			}
			if (card.superAwakenings.length)
			{
				const sakUl = awokenPreview.appendChild(creatAwokenList(card.superAwakenings)); //添加超觉醒
				sakUl.classList.add("awoken-preview-superAwakenings");
			}
		}
		cli.onclick = clickHeadToNewMon;
		return cli;
	};

	const searchBox = editBox.querySelector(".search-box");
	const settingBox = editBox.querySelector(".setting-box");
	const searchOpen = settingBox.querySelector(".row-mon-id .open-search");
	searchOpen.onclick = function() {
		s_includeSuperAwoken.onclick();
		s_canAssist.onclick();
		searchBox.classList.toggle(className_displayNone);
	};

	const s_attr1s = Array.from(searchBox.querySelectorAll(".attrs .attr-list-1 .attr-radio"));
	const s_attr2s = Array.from(searchBox.querySelectorAll(".attrs .attr-list-2 .attr-radio"));
	const s_fixMainColor = searchBox.querySelector("#fix-main-color");
	const s_typesDiv = searchBox.querySelector(".types-div");
	const s_types = Array.from(s_typesDiv.querySelectorAll(".type-check"));
	const s_typeAndOr = s_typesDiv.querySelector("#type-and-or");
	const s_typesUl = s_typesDiv.querySelector(".type-list");
	const s_typesLi = Array.from(s_typesUl.querySelectorAll("li"));
	const s_typesCheckBox = s_typesLi.map(li=>li.querySelector(".type-check"));
	s_typesCheckBox.forEach(checkBox=>
		{
			checkBox.onchange = function(){
				const newClassName = `type-killer-${this.value}`;
				if (this.checked && s_typeAndOr.checked) //and的时候才生效
					s_typesUl.classList.add(newClassName);
				else
					s_typesUl.classList.remove(newClassName);
			}
		}
	);

	const s_types_latentUl = s_typesDiv.querySelector(".latent-list");
	const s_types_latentli = Array.from(s_types_latentUl.querySelectorAll("li"));
	s_types_latentli.forEach(latent=>
	{
		latent.onclick = function(){
			const latenttype = parseInt(this.getAttribute("data-latent-icon"));
			const killerTypes = typekiller_for_type.filter(o=>o.allowableLatent.includes(latenttype)).map(o=>o.type);
			s_typesCheckBox.forEach(checkbox=>{
				const type = parseInt(checkbox.value);
				checkbox.checked = killerTypes.includes(type);
			});
		};
	});

	s_typeAndOr.onchange = function(){
		s_typesCheckBox.forEach(checkBox=>checkBox.onchange());
		if (this.checked)
			s_types_latentUl.classList.add(className_displayNone);
		else
			s_types_latentUl.classList.remove(className_displayNone);
	};
	s_typeAndOr.onchange();

	const s_awokensItems = Array.from(searchBox.querySelectorAll(".awoken-div .awoken-count"));
	const s_awokensIcons = s_awokensItems.map(it => it.querySelector(".awoken-icon"));
	const s_awokensCounts = s_awokensItems.map(it => it.querySelector(".count"));

	const searchMonList = searchBox.querySelector(".search-mon-list"); //搜索结果列表
	searchMonList.originalHeads = null; //用于存放原始搜索结果

	const s_awokensEquivalent = searchBox.querySelector("#consider-equivalent-awoken"); //搜索等效觉醒
	const s_canAssist = searchBox.querySelector("#can-assist"); //只搜索辅助
	s_canAssist.onclick = function() {
		toggleDomClassName(this, "only-display-can-assist", true, searchMonList);
	};

	const s_sawokenDiv = searchBox.querySelector(".sawoken-div");

	const s_sawokens = Array.from(s_sawokenDiv.querySelectorAll(".sawoken-check"));
	const s_includeSuperAwoken = searchBox.querySelector("#include-super-awoken"); //搜索超觉醒
	s_includeSuperAwoken.onclick = function() {
		toggleDomClassName(this, className_displayNone, true, s_sawokenDiv);
	};

	function search_awokenAdd1() {
		const countDom = this.parentNode.querySelector(".count");
		let count = parseInt(countDom.value, 10);
		if (count < 9) {
			count++;
			countDom.value = count;
			this.parentNode.classList.remove("zero");
		}
	}
	s_awokensIcons.forEach((b, idx) => { //每种觉醒增加1
		b.onclick = search_awokenAdd1;
	});

	function search_awokenSub1() {
		let count = parseInt(this.value, 10);
		if (count > 0) {
			count--;
			this.value = count;
			if (count === 0) {
				this.parentNode.parentNode.classList.add("zero");
			}
		}
	}
	s_awokensCounts.forEach((b, idx) => { //每种觉醒减少1
		b.onclick = search_awokenSub1;
	});

	const awokenClear = searchBox.querySelector(".awoken-div .awoken-clear");
	const sawokenClear = searchBox.querySelector(".sawoken-div .sawoken-clear");
	awokenClear.onclick = function() { //清空觉醒选项
		s_awokensCounts.forEach(t => {
			t.value = 0;
		});
		s_awokensItems.forEach(t => {
			t.classList.add("zero");
		});
	};
	sawokenClear.onclick = function() { //清空超觉醒选项
		s_sawokens.forEach(t => {
			t.checked = false;
		});
	};

	const s_controlDiv = searchBox.querySelector(".control-div");
	const searchStart = s_controlDiv.querySelector(".search-start");
	const searchClose = s_controlDiv.querySelector(".search-close");
	const searchClear = s_controlDiv.querySelector(".search-clear");

	function returnCheckedInput(ipt) {
		return ipt.checked;
	}

	function returnInputValue(ipt) {
		return ipt.value;
	}

	function Str2Int(str) {
		return parseInt(str, 10);
	}
	//将搜索结果显示出来（也可用于其他的搜索）
	const s_add_show_awoken = searchBox.querySelector("#add-show-awoken"); //是否显示觉醒
	const s_add_show_CD = searchBox.querySelector("#add-show-CD"); //是否显示CD
	const s_add_show_abilities = searchBox.querySelector("#add-show-abilities"); //是否显示三维
	const s_add_show_abilities_with_awoken = searchBox.querySelector("#add-show-abilities-with-awoken"); //是否显示计算觉醒的三维
	showSearch = function(searchArr) {
		editBox.show();
		searchBox.classList.remove(className_displayNone);
		const createCardHead = editBox.createCardHead;

		searchMonList.classList.add(className_displayNone);
		searchMonList.innerHTML = ""; //清空旧的
		if (searchArr.length > 0) {
			let fragment = document.createDocumentFragment(); //创建节点用的临时空间
			//获取原始排序的头像列表
			additionalOption = { //搜索列表的额外选项
				showAwoken: s_add_show_awoken.checked,
				showCD: s_add_show_CD.checked,
				showAbilities: s_add_show_abilities.checked,
				showAbilitiesWithAwoken: s_add_show_abilities_with_awoken.checked,
			};
			searchMonList.originalHeads = searchArr.map(card => createCardHead(card.id, additionalOption));
			//对头像列表进行排序
			const headsArray = sortHeadsArray(searchMonList.originalHeads);
			headsArray.forEach(head => fragment.appendChild(head));
			searchMonList.appendChild(fragment);
		}
		searchMonList.classList.remove(className_displayNone);
	};
	const startSearch = function(cards) {
		const attr1Filter = s_attr1s.filter(returnCheckedInput).map(returnInputValue);
		const attr2Filter = s_attr2s.filter(returnCheckedInput).map(returnInputValue);
		let attr1, attr2;
		if (attr1Filter.length > 0) {
			if (!isNaN(attr1Filter[0])) {
				attr1 = parseInt(attr1Filter[0], 10);
			} else {
				attr1 = null;
			}
		}
		if (attr2Filter.length > 0) {
			if (!isNaN(attr2Filter[0])) {
				attr2 = parseInt(attr2Filter[0], 10);
			} else {
				attr2 = null;
			}
		}
		const typesFilter = s_types.filter(returnCheckedInput).map(returnInputValue).map(Str2Int);
		const sawokensFilter = s_sawokens.filter(returnCheckedInput).map(returnInputValue).map(Str2Int);
		const awokensFilter = s_awokensCounts.filter(btn => parseInt(btn.value, 10) > 0).map(btn => {
			const awokenIndex = parseInt(btn.parentNode.parentNode.querySelector(".awoken-icon").getAttribute("data-awoken-icon"), 10);
			return { id: awokenIndex, num: parseInt(btn.value, 10) };
		});
		const searchResult = searchCards(cards,
			attr1, attr2,
			s_fixMainColor.checked,
			typesFilter,
			s_typeAndOr.checked,
			awokensFilter,
			sawokensFilter,
			s_awokensEquivalent.checked,
			s_includeSuperAwoken.checked
		);
		//console.log("搜索结果", searchResult);
		showSearch(searchResult);
	};
	searchBox.startSearch = startSearch;
	searchStart.onclick = function() {
		startSearch(Cards);
	};
	searchClose.onclick = function() {
		searchBox.classList.add(className_displayNone);
	};
	searchClear.onclick = function() { //清空搜索选项
		s_attr1s[0].checked = true;
		s_attr2s[0].checked = true;
		s_types.forEach(t => {
			t.checked = false;
		});
		s_typeAndOr.onchange();
		s_awokensCounts.forEach(t => {
			t.value = 0;
		});
		s_awokensItems.forEach(t => {
			t.classList.add("zero");
		});
		// 这些觉醒的选项干脆都不清除
		//s_awokensEquivalent.checked = false;
		//if (s_includeSuperAwoken.checked) s_includeSuperAwoken.click();

		s_sawokens.forEach(t => {
			t.checked = false;
		});

		searchMonList.originalHeads = null;
		searchMonList.innerHTML = "";
	};

	const s_sortList = s_controlDiv.querySelector(".sort-list");
	const s_sortReverse = s_controlDiv.querySelector("#sort-reverse");
	//对heads重新排序
	function sortHeadsArray(heads) {
		if (!heads || heads.length === 0) return; //没有数据时，直接返回
		const sortIndex = parseInt(s_sortList.value, 10);
		const reverse = s_sortReverse.checked;
		let headsArray = heads.concat();

		headsArray.sort((head_a, head_b) => {
			const card_a = head_a.card,
				card_b = head_b.card;
			let sortNumber = sort_function_list[sortIndex].function(card_a, card_b);
			//if (reverse) sortNumber *= -1; //会导致默认情况无法逆序
			return sortNumber;
		});
		if (reverse) headsArray.reverse();

		return headsArray;
	}
	//对搜索到的Cards重新排序
	function reSortCards() {
		const headsArray = sortHeadsArray(searchMonList.originalHeads);
		if (!headsArray || headsArray.length === 0) return; //没有数据时，直接返回
		searchMonList.classList.add(className_displayNone);
		let fragment = document.createDocumentFragment(); //创建节点用的临时空间
		headsArray.forEach(head => fragment.appendChild(head));
		searchMonList.appendChild(fragment);
		searchMonList.classList.remove(className_displayNone);
	}
	s_sortList.onchange = reSortCards;
	s_sortReverse.onchange = reSortCards;
	sort_function_list.forEach((sfunc, idx) => {
		const newOpt = new Option(sfunc.name, idx);
		newOpt.setAttribute("data-tag", sfunc.tag);
		s_sortList.options.add(newOpt);
	});

	//id搜索
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	monstersID.onchange = function() {
		if (/^\d+$/.test(this.value)) {
			const newId = parseInt(this.value, 10);
			if (editBox.mid != newId) //避免多次运行oninput、onchange
			{
				editBox.mid = newId;
				
				if (isGuideMod)
				{
					const locationURL = new URL(location);
					if (newId === 0) {
						locationURL.searchParams.delete('id');
						history.pushState(null, null, locationURL);
					}else
					{
						locationURL.searchParams.set('id', newId);
						history.pushState(null, null, locationURL);
					}
				}

				editBoxChangeMonId(newId);
			}
		}
	};
	monstersID.oninput = monstersID.onchange;
	//觉醒
	const monEditAwokensRow = settingBox.querySelector(".row-mon-awoken");
	const awokenCountLabel = monEditAwokensRow.querySelector(".awoken-count");
	const monEditAwokens = Array.from(monEditAwokensRow.querySelectorAll(".awoken-ul input[name='awoken-number']"));

	function checkAwoken() {
		const card = Cards[editBox.mid];
		const value = parseInt(this.value, 10);
		awokenCountLabel.textContent = value;
		if (value > 0 && value == (card.awakenings.length))
			awokenCountLabel.classList.add("full-awoken");
		else
			awokenCountLabel.classList.remove("full-awoken");
		reCalculateAbility();
	}
	monEditAwokens.forEach(akDom => akDom.onclick = checkAwoken);

	const monEditAwokensLabel = Array.from(monEditAwokensRow.querySelectorAll(".awoken-ul .awoken-icon"));

	function playVoiceAwoken() { //点击label才播放语音
		if (parseInt(this.getAttribute("data-awoken-icon"), 10) === 63) {
			const card = Cards[editBox.mid];
			const decoder = new Adpcm(adpcm_wasm, pcmImportObj);
			decoder.resetDecodeState(new Adpcm.State(0, 0));
			decodeAudio(`sound/voice/${currentDataSource.code}/padv${card.voiceId.PrefixInteger(3)}.wav`, decoder.decode.bind(decoder));
		}
	}
	monEditAwokensLabel.forEach(akDom => akDom.onclick = playVoiceAwoken);

	//超觉醒
	const monEditSAwokensRow = settingBox.querySelector(".row-mon-super-awoken");
	monEditSAwokensRow.swaokenIndex = -1;
	const monEditSAwokens = Array.from(monEditSAwokensRow.querySelectorAll(".awoken-ul input[name='sawoken-choice']"));

	function notCheckMyself() {
		const value = parseInt(this.value, 10);
		if (value >= 0 && monEditSAwokensRow.swaokenIndex === value) {
			monEditSAwokens[0].click();
		} else {
			monEditSAwokensRow.swaokenIndex = value;
		}
	}
	monEditSAwokens.forEach(akDom => {
		akDom.onclick = notCheckMyself;
	});
	//3个快速设置this.ipt为自己的value
	function setIptToMyValue() {
		if (this.ipt.value != this.value) {
			this.ipt.value = this.value;
			this.ipt.onchange();
		}
	}
	//等级
	const monEditLv = settingBox.querySelector(".m-level");
	monEditLv.onchange = function() {
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
	function reCalculateExp() {
		const monid = parseInt(monstersID.value || 0, 10);
		const level = parseInt(monEditLv.value || 0, 10);
		const tempMon = {
			id: monid,
			level: level
		};
		const needExp = calculateExp(tempMon);
		monLvExp.textContent = needExp ? parseBigNumber(needExp[0]) + (level > 99 ? ` + ${parseBigNumber(needExp[1])}` : "") : "";
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
	monEditAdd297.onclick = function() {
		monEditAddHp.value = 99;
		monEditAddAtk.value = 99;
		monEditAddRcv.value = 99;
		reCalculateAbility();
	};

	//潜觉
	const monEditLatentUl = settingBox.querySelector(".m-latent-ul");
	const monEditLatents = Array.from(monEditLatentUl.querySelectorAll("li"));
	const monEditLatentAllowableUl = settingBox.querySelector(".m-latent-allowable-ul");
	const monEditLatentsAllowable = Array.from(monEditLatentAllowableUl.querySelectorAll("li"));
	editBox.refreshLatent = function(latent, monid) //刷新潜觉
		{
			refreshLatent(latent, monid, monEditLatents);
		};
	const hideClassName = 'hide-less-use-latent';
	const s_hideLessUseLetent = settingBox.querySelector(`#${hideClassName}`);
	s_hideLessUseLetent.onchange = function() {
		toggleDomClassName(this, hideClassName, true, monEditLatentAllowableUl);
		localStorage.setItem("PADDF-" + hideClassName, this.checked ? 1 : 0);
	}
	s_hideLessUseLetent.checked = Boolean(parseInt(localStorage.getItem("PADDF-" + hideClassName)));
	s_hideLessUseLetent.onchange();

	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");

	skillTitle.onclick = function(event) {
		if (event.ctrlKey) return;
		const skillId = parseInt(this.getAttribute("data-skillid"), 10); //获得当前技能ID
		const s_cards = Cards.filter(card => card.activeSkillId === skillId); //搜索同技能怪物
		if (s_cards.length > 1) {
			showSearch(s_cards); //显示
		}
	};
	

	skillLevel.onchange = function() {
		const card = Cards[editBox.mid] || Cards[0]; //怪物固定数据
		const skill = Skills[card.activeSkillId];
		skillCD.textContent = skill.initialCooldown - this.value + 1;
	};
	skillLevel_1.ipt = skillLevel;
	skillLevel_1.onclick = setIptToMyValue;
	skillLevel_Max.ipt = skillLevel;
	skillLevel_Max.onclick = setIptToMyValue;

	//已有觉醒的去除
	function deleteLatent() {
		const aIdx = monEditLatents.filter(l => !l.classList.contains(className_displayNone)).findIndex(l => l == this);
		editBox.latent.splice(aIdx, 1);
		editBox.reCalculateAbility(); //重计算三维
		editBox.refreshLatent(editBox.latent, editBox.mid); //刷新潜觉
	}
	monEditLatents.forEach(la => la.onclick = deleteLatent);
	//可选觉醒的添加
	function addLatent() {
		if (this.classList.contains("unallowable-latent")) return; //不能选的觉醒直接退出
		const lIdx = parseInt(this.getAttribute("data-latent-icon"), 10); //潜觉的序号
		const maxLatentCount = getMaxLatentCount(editBox.mid); //最大潜觉数量
		const usedHoleN = usedHole(editBox.latent); //已经使用了的格子
		const enabledHole = maxLatentCount - usedHoleN; //还剩余的格子

		if (latentUseHole(lIdx) <= enabledHole)
			editBox.latent.push(lIdx);
		else
			return;

		editBox.reCalculateAbility();
		editBox.refreshLatent(editBox.latent, editBox.mid);
	}
	monEditLatentsAllowable.forEach(la => la.onclick = addLatent);

	//编辑界面重新计算怪物的能力
	function reCalculateAbility() {
		const monid = parseInt(monstersID.value || 0, 10);
		const level = parseInt(monEditLv.value || 0, 10);

		const mAwokenNumIpt = monEditAwokensRow.querySelector("input[name='awoken-number']:checked");
		const awoken = mAwokenNumIpt ? parseInt(mAwokenNumIpt.value, 10) : 0;
		const plus = [
			parseInt(monEditAddHp.value || 0, 10),
			parseInt(monEditAddAtk.value || 0, 10),
			parseInt(monEditAddRcv.value || 0, 10)
		];
		const latent = editBox.latent;
		const tempMon = {
			id: monid,
			level: level,
			plus: plus,
			awoken: awoken,
			latent: latent
		};
		const abilitys = calculateAbility(tempMon, null, solo, teamsCount);

		monEditHpValue.textContent = abilitys ? abilitys[0][0].toLocaleString() : 0;
		monEditAtkValue.textContent = abilitys ? abilitys[1][0].toLocaleString() : 0;
		monEditRcvValue.textContent = abilitys ? abilitys[2][0].toLocaleString() : 0;
	}
	editBox.reCalculateAbility = reCalculateAbility;

	const btnCancel = editBox.querySelector(".button-cancel");
	const btnDone = editBox.querySelector(".button-done");
	const btnNull = editBox.querySelector(".button-null");
	const btnDelay = editBox.querySelector(".button-delay");
	btnCancel.onclick = function() {
		btnDone.classList.remove("cant-assist");
		btnDone.disabled = false;
		editBox.memberIdx = [];
		editBox.hide();
	};
	btnDone.onclick = function() {
		if (parseInt(monEditLv.value, 10) == 0) {
			btnNull.onclick();
			return;
		}
		const mon = editBox.isAssist ? new MemberAssist() : new MemberTeam();
		const teamData = formation.teams[editBox.memberIdx[0]];
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamBox = teamBigBox.querySelector(".team-box");

		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		mon.id = parseInt(monstersID.value, 10);
		const card = Cards[mon.id] || Cards[0];
		const skill = Skills[card.activeSkillId];

		mon.level = parseInt(monEditLv.value, 10);

		const mAwokenNumIpt = monEditAwokensRow.querySelector("input[name='awoken-number']:checked");
		mon.awoken = mAwokenNumIpt ? parseInt(mAwokenNumIpt.value, 10) : 0;
		if (card.superAwakenings.length) //如果支持超觉醒
		{
			const mSAwokenChoIpt = monEditSAwokensRow.querySelector("input[name='sawoken-choice']:checked");
			mon.sawoken = mSAwokenChoIpt ? parseInt(mSAwokenChoIpt.value, 10) : -1;
		}

		if (card.types.some(t => { return t == 0 || t == 12 || t == 14 || t == 15; }) &&
			(!card.overlay || mon.level >= card.maxLevel)) { //当4种特殊type的时候是无法297和打觉醒的，但是不能叠加的在未满级时可以
			mon.plus = [0, 0, 0];
		} else {
			mon.plus[0] = parseInt(monEditAddHp.value) || 0;
			mon.plus[1] = parseInt(monEditAddAtk.value) || 0;
			mon.plus[2] = parseInt(monEditAddRcv.value) || 0;
			if (!editBox.isAssist) { //如果不是辅助，则可以设定潜觉
				mon.latent = editBox.latent.concat()
					.sort((a, b) => latentUseHole(b) - latentUseHole(a)); //并排序
			}
		}

		const skillLevelNum = parseInt(skillLevel.value, 10);
		if (skillLevelNum < skill.maxLevel) {
			mon.skilllevel = skillLevelNum;
		}
		changeid(mon, editBox.monsterHead, editBox.memberIdx[1] ? null : editBox.latentBox);

		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData, editBox.memberIdx[0]);
		const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
		if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
		const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
		if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

		//刷新改队员的CD
		refreshMemberSkillCD(teamBox, teamData, editBox.memberIdx[2]);
		creatNewUrl();
		editBox.hide();
	};
	window.onkeydown = function(e) {
		if (!editBox.classList.contains(className_displayNone)) {
			if (e.keyCode == 27) { //按下ESC时，自动关闭编辑窗
				btnCancel.onclick();
			}
		}
	};
	btnNull.onclick = function() { //空位置
		const mon = new Member();
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamData = formation.teams[editBox.memberIdx[0]];
		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		changeid(mon, editBox.monsterHead, editBox.latentBox);

		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData, editBox.memberIdx[0]);
		const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
		if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
		const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
		if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

		//刷新改队员的CD
		refreshMemberSkillCD(teamBigBox, teamData, editBox.memberIdx[2]);

		creatNewUrl();
		editBox.hide();
	};
	btnDelay.onclick = function() { //应对威吓
		const mon = new MemberDelay();
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamData = formation.teams[editBox.memberIdx[0]];
		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		changeid(mon, editBox.monsterHead, editBox.latentBox);

		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData, editBox.memberIdx[0]);
		const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
		if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
		const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
		if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

		//刷新改队员的CD
		refreshMemberSkillCD(teamBigBox, teamData, editBox.memberIdx[2]);

		creatNewUrl();
		editBox.hide();
	};

	//语言选择
	const langList = controlBox.querySelector(".languages");
	langList.onchange = function() {
		creatNewUrl({ "language": this.value });
		history.go();
	};
	//数据源选择
	const dataList = controlBox.querySelector(".datasource");
	dataList.onchange = function() {
		creatNewUrl({ datasource: this.value });
		history.go();
	};

	/*添对应语言执行的JS*/
	const languageJS = document.head.appendChild(document.createElement("script"));
	languageJS.id = "language-js";
	languageJS.type = "text/javascript";
	languageJS.src = "languages/" + currentLanguage.i18n + ".js";

	if (isGuideMod) //图鉴模式直接打开搜索框
	{
		showSearch([]);
		//if (monstersID.value.length == 0) editBoxChangeMonId(0);
	}
}

//从怪物头像获取队员的队伍编号
function getMemberArrayIndexFromMonHead(headDom) {
	return [
		parseInt(headDom.getAttribute("data-team"), 10), //team
		parseInt(headDom.getAttribute("data-assist"), 10), //assist
		parseInt(headDom.getAttribute("data-index"), 10), //index
	];
}
//编辑界面点击每个怪物的头像的处理
function clickMonHead(e) {
	const arr = getMemberArrayIndexFromMonHead(this);
	editMon(arr[0], arr[1], arr[2]);
	return false; //没有false将会打开链接
}
//编辑界面每个怪物的头像的拖动
function dragStartMonHead(e) {
	e.dataTransfer.setData('from', JSON.stringify(getMemberArrayIndexFromMonHead(this)));
}
//编辑界面每个怪物的头像的经过，阻止事件发生
function dropOverMonHead(e) {
	e.preventDefault();
}
//编辑界面每个怪物的头像的放下
function dropMonHead(e) {
	const dataFrom = JSON.parse(e.dataTransfer.getData('from'));
	const dataTo = getMemberArrayIndexFromMonHead(this);

	if ((dataTo[0] !== dataFrom[0]) ||
		(dataTo[1] !== dataFrom[1]) ||
		(dataTo[2] !== dataFrom[2])) { //必须有所不同才继续交换
		interchangeCard(dataFrom, dataTo);
	}
	return false; //没有false将会打开链接
}
//移动端编辑界面每个怪物的头像的放下
function touchstartMonHead(e) {
	e.stopPropagation();
	//console.log("开始触摸",e,this);
	const tc = e.changedTouches[0];
	const pX = tc.pageX,
		pY = tc.pageY;
	interchangeSVG.style.display = "none";
	interchangeSVG.changePoint({ x: pX, y: pY }, { x: pX, y: pY });
}
//移动端编辑界面每个怪物的头像的移动
function touchmoveMonHead(e) {
	//console.log("移动中",e,this);
	const tc = e.changedTouches[0];
	const pX = tc.pageX,
		pY = tc.pageY;
	const rect = this.getBoundingClientRect();
	const top = rect.top + document.documentElement.scrollTop;
	const left = rect.left + document.documentElement.scrollLeft;
	if ((pY < top) || (pY > (top + rect.height)) ||
		(pX < left) || (pX > (left + rect.width))) {
		interchangeSVG.style.display = "block";
		interchangeSVG.changePoint(null, { x: pX, y: pY });
	} else {
		interchangeSVG.style.display = "none";
	}
}
//移动端编辑界面每个怪物的头像的结束
function touchendMonHead(e) {
	const tc = e.changedTouches[0];
	const pX = tc.pageX,
		pY = tc.pageY;
	//console.log("移动结束",pX,pY,e,this);
	interchangeSVG.style.display = "none";
	interchangeSVG.changePoint(null, { x: pX, y: pY });
	const target = allMembers.find(m => {
		const rect = m.getBoundingClientRect();
		const top = rect.top + document.documentElement.scrollTop;
		const left = rect.left + document.documentElement.scrollLeft;
		const isInRect = (pY > top) && (pY < (top + rect.height)) &&
			(pX > left) && (pX < (left + rect.width));
		return isInRect;
	});
	if (target && this != target) {
		//console.log("找到的对象",targets[0]);
		const dataFrom = getMemberArrayIndexFromMonHead(this);
		const dataTo = getMemberArrayIndexFromMonHead(target);

		if ((dataTo[0] != dataFrom[0]) ||
			(dataTo[1] != dataFrom[1]) ||
			(dataTo[2] != dataFrom[2])) { //必须有所不同才继续交换
			interchangeCard(dataFrom, dataTo);
		}
	}
}
//移动端编辑界面每个怪物的头像的取消
function touchcancelMonHead(e) {
	interchangeSVG.style.display = "none";
	console.log("移动取消", e, this);
}

function interchangeCard(formArr, toArr) {
	function changeType(member, isAssist) {
		if (member.id == 0 || (isAssist && member.id == -1)) {
			return new Member();
		} else {
			const newMember = isAssist ? new MemberTeam() : new MemberAssist();
			newMember.loadFromMember(member);
			return newMember;
		}
	}
	const changeSwapToCopy = controlBox.querySelector("#change-swap-to-copy"); //储存交换“复制”和“替换”
	const isCopy = changeSwapToCopy.checked;
	let from = formation.teams[formArr[0]][formArr[1]][formArr[2]];
	let to = formation.teams[toArr[0]][toArr[1]][toArr[2]];
	if (formArr[1] != toArr[1]) //从武器拖到非武器才改变类型
	{
		from = changeType(from, formArr[1]);
		if (!isCopy) to = changeType(to, toArr[1]);
	} else if (isCopy) {
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
function changeid(mon, monDom, latentDom) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const parentNode = monDom.parentNode;
	fragment.appendChild(monDom);
	const monId = mon.id;
	const card = Cards[monId] || Cards[0]; //怪物固定数据
	monDom.setAttribute("data-cardid", monId); //设定新的id
	if (monId < 0) //如果是延迟
	{
		monDom.removeAttribute("href");
		monDom.removeAttribute("title");
		parentNode.classList.add("delay");
		parentNode.classList.remove("null");
		parentNode.appendChild(fragment);
		if (latentDom) latentDom.classList.add(className_displayNone);
		return;
	} else if (monId == 0) //如果是空
	{
		monDom.removeAttribute("href");
		monDom.removeAttribute("title");
		parentNode.classList.add("null");
		parentNode.classList.remove("delay");
		parentNode.appendChild(fragment);
		if (latentDom) latentDom.classList.add(className_displayNone);
		return;
	} else if (monId > -1) //如果提供了id
	{
		parentNode.classList.remove("null");
		parentNode.classList.remove("delay");

		monDom.setAttribute("data-cards-pic-idx", Math.ceil(monId / 100)); //添加图片编号
		const idxInPage = (monId - 1) % 100; //获取当前页面的总序号
		monDom.setAttribute("data-cards-pic-x", idxInPage % 10); //添加X方向序号
		monDom.setAttribute("data-cards-pic-y", Math.floor(idxInPage / 10)); //添加Y方向序号

		monDom.querySelector(".property").setAttribute("data-property", card.attrs[0]); //主属性
		monDom.querySelector(".subproperty").setAttribute("data-property", card.attrs[1]); //副属性

		monDom.title = "No." + monId + " " + (card.otLangName ? (card.otLangName[currentLanguage.searchlist[0]] || card.name) : card.name);
		monDom.href = currentLanguage.guideURL(monId, card.name);
		if (card.canAssist)
			monDom.classList.add("allowable-assist");
		else
			monDom.classList.remove("allowable-assist");
		if (card.awakenings.includes(49)) //武器
			monDom.classList.add("wepon");
		else
			monDom.classList.remove("wepon");
	}
	const levelDom = monDom.querySelector(".level");
	if (levelDom) //如果提供了等级
	{
		const level = mon.level || 1;
		levelDom.textContent = level;
		if (level == card.maxLevel) { //如果等级刚好等于最大等级，则修改为“最大”的字
			levelDom.classList.add("max");
		} else {
			levelDom.classList.remove("max");
		}
		if (card.limitBreakIncr && level >= card.maxLevel) { //如果支持超觉，并且等级超过99，就添加支持超觉的蓝色
			levelDom.classList.add("_110");
		} else {
			levelDom.classList.remove("_110");
		}
	}
	const awokenIcon = monDom.querySelector(".awoken-count");
	if (awokenIcon) {
		if (card.awakenings.length < 1 || mon.awoken == 0) //没觉醒
		{
			awokenIcon.classList.add(className_displayNone);
			awokenIcon.textContent = "";
		} else if (mon.awoken > 0) //如果提供了觉醒
		{
			awokenIcon.classList.remove(className_displayNone);
			awokenIcon.textContent = mon.awoken;
			if (mon.awoken == card.awakenings.length) {
				awokenIcon.classList.add("full-awoken");
			} else {
				awokenIcon.classList.remove("full-awoken");
			}
		}
	}
	const sawoken = monDom.querySelector(".super-awoken");
	if (sawoken) //如果存在超觉醒的DOM且提供了超觉醒
	{
		if (mon.sawoken != undefined && mon.sawoken >= 0 && card.superAwakenings.length) {
			sawoken.classList.remove(className_displayNone);
			const sawokenIcon = sawoken.querySelector(".awoken-icon");
			sawokenIcon.setAttribute("data-awoken-icon", card.superAwakenings[mon.sawoken]);
		} else {
			sawoken.classList.add(className_displayNone);
		}
	}
	const m_id = monDom.querySelector(".id");
	if (m_id) //怪物ID
	{
		m_id.textContent = monId;
	}
	const plusArr = mon.plus || [0, 0, 0];
	const plusDom = monDom.querySelector(".plus");
	if (plusArr && plusDom) //如果提供了加值，且怪物头像内有加值
	{
		const plusCount = plusArr[0] + plusArr[1] + plusArr[2];
		if (plusCount <= 0) {
			plusDom.classList.add(className_displayNone);
		} else if (plusCount >= 297) {
			plusDom.classList.add("has297");
			plusDom.classList.remove(className_displayNone);
		} else {
			plusDom.querySelector(".hp").textContent = plusArr[0];
			plusDom.querySelector(".atk").textContent = plusArr[1];
			plusDom.querySelector(".rcv").textContent = plusArr[2];
			plusDom.classList.remove("has297");
			plusDom.classList.remove(className_displayNone);
		}
	}
	if (latentDom) {
		if (mon.latent) //如果提供了潜觉
		{
			const latent = mon.latent;
			if (latent.length < 1) {
				latentDom.classList.add(className_displayNone);
			} else {
				const latentDoms = Array.from(latentDom.querySelectorAll("li"));
				refreshLatent(latent, mon.id, latentDoms);
				latentDom.classList.remove(className_displayNone);
			}
		} else {
			latentDom.classList.add(className_displayNone);
		}
	}

	const skillCdDom = monDom.querySelector(".skill");
	if (skillCdDom) //如果存在技能CD DOM
	{
		//const skill = Skills[card.activeSkillId];
		if (card.activeSkillId == 0) {
			skillCdDom.classList.add(className_displayNone);
		} else {
			skillCdDom.classList.remove(className_displayNone);
		}
	}

	parentNode.appendChild(fragment);
}
//刷新潜觉
function refreshLatent(latent, monid, iconArr) {
	const maxLatentCount = getMaxLatentCount(monid); //最大潜觉数量
	let latentIndex = 0,
		usedHoleN = 0;
	for (let ai = 0; ai < iconArr.length; ai++) {
		const icon = iconArr[ai];
		if (latent[latentIndex] != undefined && ai >= usedHoleN && ai < maxLatentCount) //有潜觉
		{
			icon.setAttribute("data-latent-icon", latent[latentIndex]);
			icon.classList.remove(className_displayNone);
			usedHoleN += latentUseHole(latent[latentIndex]);
			latentIndex++;
		} else if (ai < usedHoleN) //多格潜觉后方隐藏
		{
			icon.classList.add(className_displayNone);
		} else if (ai < maxLatentCount) //没有使用的空格觉醒
		{
			icon.removeAttribute("data-latent-icon");
			icon.classList.remove(className_displayNone);
		} else //不需要显示的部分
		{
			icon.classList.add(className_displayNone);
		}
	}
};
//点击怪物头像，出现编辑窗
function editMon(teamNum, isAssist, indexInTeam) {
	//数据
	const mon = formation.teams[teamNum][isAssist][indexInTeam];

	const teamBigBox = teamBigBoxs[teamNum];
	const teamBox = teamBigBox.querySelector(".team-box");
	const memberBox = teamBox.querySelector(isAssist ? ".team-assist" : ".team-members");
	const memberLi = memberBox.querySelector(`.member-${indexInTeam+1}`);

	const monsterHead = memberLi.querySelector(".monster");

	editBox.show();

	editBox.isAssist = isAssist;
	editBox.monsterHead = monsterHead;
	editBox.memberIdx = [teamNum, isAssist, indexInTeam]; //储存队伍数组下标
	if (!isAssist) {
		const latentBox = teamBox.querySelector(".team-latents .latents-" + (indexInTeam + 1) + " .latent-ul");
		editBox.latentBox = latentBox;
	} else {
		editBox.latentBox = null;
	}

	const settingBox = editBox.querySelector(".setting-box");
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	monstersID.value = mon.id > 0 ? mon.id : 0;
	monstersID.onchange();
	//觉醒
	const monEditAwokens = settingBox.querySelectorAll(".row-mon-awoken .awoken-ul input[name='awoken-number']");
	//if (mon.awoken > 0 && monEditAwokens[mon.awoken]) monEditAwokens[mon.awoken].click(); //涉及到觉醒数字的显示，所以需要点一下，为了减少计算次数，把这一条移动到了最后面
	//超觉醒
	const monEditSAwokensRow = settingBox.querySelector(".row-mon-super-awoken");
	const monEditSAwokens = monEditSAwokensRow.querySelectorAll(".awoken-ul input[name='sawoken-choice']"); //单选框，0号是隐藏的
	monEditSAwokens[(mon.sawoken >= 0 && monEditSAwokens[mon.sawoken + 1]) ? mon.sawoken + 1 : 0].checked = true;
	monEditSAwokensRow.swaokenIndex = mon.sawoken;

	const monEditLv = settingBox.querySelector(".row-mon-level .m-level");
	monEditLv.value = mon.level || 1;
	const monEditAddHp = settingBox.querySelector(".row-mon-plus .m-plus-hp");
	const monEditAddAtk = settingBox.querySelector(".row-mon-plus .m-plus-atk");
	const monEditAddRcv = settingBox.querySelector(".row-mon-plus .m-plus-rcv");
	if (mon.plus && mon.id > 0) {
		monEditAddHp.value = mon.plus[0];
		monEditAddAtk.value = mon.plus[1];
		monEditAddRcv.value = mon.plus[2];
	}
	const rowMonLatent = settingBox.querySelector(".row-mon-latent");
	const skillLevel = settingBox.querySelector(".row-mon-skill .skill-box .m-skill-level");
	if (mon.skilllevel) {
		skillLevel.value = mon.skilllevel;
	}
	skillLevel.onchange();

	const editBoxTitle = editBox.querySelector(".edit-box-title");
	const btnDelay = editBox.querySelector(".button-box .button-delay");
	if (!isAssist) {
		editBox.latent = mon.latent ? mon.latent.concat() : [];
		editBox.refreshLatent(editBox.latent, mon.id);
		btnDelay.classList.add(className_displayNone);
		rowMonLatent.classList.remove(className_displayNone);
		editBoxTitle.classList.remove("edit-box-title-assist");
	} else {
		btnDelay.classList.remove(className_displayNone);
		rowMonLatent.classList.add(className_displayNone);
		editBoxTitle.classList.add("edit-box-title-assist");
	}
	editBox.reCalculateExp();
	if (mon.awoken !== undefined && monEditAwokens[mon.awoken])
		monEditAwokens[mon.awoken].click(); //涉及到觉醒数字的显示，所以需要点一下
	else
		editBox.reCalculateAbility();
}
//编辑窗，修改怪物ID
function editBoxChangeMonId(id) {
	const card = Cards[id] || Cards[0]; //怪物固定数据
	if (card.id == 0) {
		id = 0;
	}
	const skill = Skills[card.activeSkillId];
	const leaderSkill = Skills[card.leaderSkillId];

	let fragment = null;

	const monInfoBox = editBox.querySelector(".monsterinfo-box");
	const settingBox = editBox.querySelector(".setting-box");

	//id搜索
	const monHead = monInfoBox.querySelector(".monster");
	changeid({ id: id }, monHead); //改变图像
	const mId = monInfoBox.querySelector(".monster-id");
	mId.textContent = id;
	const mRare = monInfoBox.querySelector(".monster-rare");
	mRare.setAttribute("data-rarity", card.rarity);
	const mMP = monInfoBox.querySelector(".monster-mp");
	mMP.textContent = card.sellMP.toLocaleString();
	const mName = monInfoBox.querySelector(".monster-name");
	mName.textContent = returnMonsterNameArr(card, currentLanguage.searchlist, currentDataSource.code)[0];
	const mSeriesId = monInfoBox.querySelector(".monster-seriesId");
	mSeriesId.textContent = card.seriesId;
	mSeriesId.setAttribute("data-seriesId", card.seriesId);
	if (card.seriesId == 0) {
		mSeriesId.classList.add(className_displayNone);
	} else {
		mSeriesId.classList.remove(className_displayNone);
	}
	const mCollabId = monInfoBox.querySelector(".monster-collabId");
	mCollabId.textContent = card.collabId;
	mCollabId.setAttribute("data-collabId", card.collabId);
	if (card.collabId == 0) {
		mCollabId.classList.add(className_displayNone);
	} else {
		mCollabId.classList.remove(className_displayNone);
	}
	const mAltName = monInfoBox.querySelector(".monster-altName");
	mAltName.textContent = card.altName;
	mAltName.setAttribute("data-altName", card.altName);

	if (card.altName.length == 0) { //当没有合作名
		mAltName.classList.add(className_displayNone);
	} else {
		mAltName.classList.remove(className_displayNone);
	}

	const evoCardUl = settingBox.querySelector(".row-mon-id .evo-card-list");
	evoCardUl.style.display = "none";
	evoCardUl.innerHTML = ""; //据说直接清空HTML性能更好

	const evoLinkCardsIdArray = Cards.filter(function(m) {
		return m.evoRootId == card.evoRootId;
	}).map(function(m) { return m.id; }); //筛选出相同进化链的

	const createCardHead = editBox.createCardHead;
	if (evoLinkCardsIdArray.length > 1) {
		fragment = document.createDocumentFragment(); //创建节点用的临时空间
		evoLinkCardsIdArray.forEach(function(mid) {
			const cli = createCardHead(mid);
			if (mid == id) {
				cli.classList.add("unable-monster");
			}
			fragment.appendChild(cli);
		});
		evoCardUl.appendChild(fragment);
		evoCardUl.style.display = "block";
	}

	const mType = monInfoBox.querySelectorAll(".monster-type li");
	for (let ti = 0; ti < mType.length; ti++) {
		if (ti < card.types.length && card.types[ti] >= 0) {
			mType[ti].setAttribute("data-type-name", card.types[ti]);
			mType[ti].querySelector(".type-icon").setAttribute("data-type-icon", card.types[ti]);
			mType[ti].classList.remove(className_displayNone);
		} else {
			mType[ti].classList.add(className_displayNone);
		}
	}

	const monEditAwokensRow = settingBox.querySelector(".row-mon-awoken .awoken-ul");
	const mAwokenIcon = monEditAwokensRow.querySelectorAll(".awoken-icon");
	const mAwokenIpt = monEditAwokensRow.querySelectorAll("input[name='awoken-number']");
	if (card.canAssist) {
		monEditAwokensRow.classList.add("allowable-assist");
	} else {
		monEditAwokensRow.classList.remove("allowable-assist");
	}
	for (let ai = 0; ai < mAwokenIcon.length; ai++) {
		if (ai < card.awakenings.length) {
			mAwokenIcon[ai].setAttribute("data-awoken-icon", card.awakenings[ai]);
			mAwokenIcon[ai].classList.remove(className_displayNone);
		} else {
			mAwokenIcon[ai].classList.add(className_displayNone);
		}
	}
	mAwokenIpt[card.awakenings.length].click(); //选择最后一个觉醒

	//超觉醒
	const monEditSAwokensRow = settingBox.querySelector(".row-mon-super-awoken");
	const mSAwoken = monEditSAwokensRow.querySelectorAll(".awoken-ul .awoken-icon");
	if (card.superAwakenings.length > 0) //辅助时也还是加入超觉醒吧
	{
		for (let ai = 0; ai < mSAwoken.length; ai++) {
			if (ai < card.superAwakenings.length) {
				mSAwoken[ai].setAttribute("data-awoken-icon", card.superAwakenings[ai]);
				mSAwoken[ai].classList.remove(className_displayNone);
			} else {
				mSAwoken[ai].classList.add(className_displayNone);
			}
		}
		monEditSAwokensRow.classList.remove(className_displayNone);
	} else {
		monEditSAwokensRow.classList.add(className_displayNone);
	}
	monEditSAwokensRow.querySelector("#sawoken-choice--1").click(); //选中隐藏的空超觉

	const monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.textContent = monEditLvMax.value = card.maxLevel;
	const monEditLv = settingBox.querySelector(".m-level");
	monEditLv.max = monEditLv.value = card.maxLevel + (card.limitBreakIncr ? 11 : 0); //默认等级为110
	const monEditLv110 = settingBox.querySelector(".m-level-btn-110");
	if (card.limitBreakIncr) {
		monEditLv110.classList.remove(className_displayNone);
	} else {
		monEditLv110.classList.add(className_displayNone);
	}
	const mCost = settingBox.querySelector(".monster-cost");
	mCost.textContent = card.cost;

	const rowPlus = settingBox.querySelector(".row-mon-plus");
	const rowLatent = settingBox.querySelector(".row-mon-latent");
	const monLatentAllowUl = rowLatent.querySelector(".m-latent-allowable-ul");
	//该宠Type允许的杀，set不会出现重复的
	const allowLatent = getAllowLatent(card.types);

	typekiller_for_type.forEach(type => { //显示允许的杀，隐藏不允许的杀
		const latentDom = monLatentAllowUl.querySelector(`.latent-icon[data-latent-icon='${type.latent}']`);
		if (!latentDom) return;
		if (allowLatent.includes(type.latent)) {
			latentDom.classList.remove("unallowable-latent");
		} else {
			latentDom.classList.add("unallowable-latent");
		}
	})

	//怪物主动技能
	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	//const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");
	const skillDetail = skillBox.querySelector(".skill-datail");

	fragment = document.createDocumentFragment(); //创建节点用的临时空间
	fragment.appendChild(skillBox);

	skillTitle.innerHTML = descriptionToHTML(skill.name);
	skillTitle.setAttribute("data-skillid", skill.id);
	skillDetail.innerHTML = "";
	skillDetail.appendChild(parseSkillDescription(skill));
	const t_maxLevel = card.overlay || card.types.includes(15) ? 1 : skill.maxLevel; //遇到不能升技的，最大等级强制为1
	skillLevel.max = t_maxLevel;
	skillLevel.value = t_maxLevel;
	skillLevel_Max.value = t_maxLevel;
	skillLevel_Max.textContent = skill.maxLevel;
	skillCD.textContent = skill.initialCooldown - t_maxLevel + 1;

	rowSkill.appendChild(fragment);

	//怪物队长技能
	const rowLederSkill = settingBox.querySelector(".row-mon-leader-skill");
	const lskillBox = rowLederSkill.querySelector(".skill-box");
	const lskillTitle = lskillBox.querySelector(".skill-name");
	const lskillDetail = lskillBox.querySelector(".skill-datail");

	fragment = document.createDocumentFragment(); //创建节点用的临时空间
	fragment.appendChild(lskillBox);

	lskillTitle.innerHTML = descriptionToHTML(leaderSkill.name);
	lskillTitle.setAttribute("data-skillid", leaderSkill.id);
	lskillDetail.innerHTML = "";
	lskillDetail.appendChild(parseSkillDescription(leaderSkill));

	rowLederSkill.appendChild(fragment);

	if (card.overlay || card.types[0] == 15 && card.types[1] == -1) { //当可以叠加时，不能打297和潜觉
		rowPlus.classList.add("disabled");
		rowPlus.querySelector(".m-plus-hp").value = 0;
		rowPlus.querySelector(".m-plus-atk").value = 0;
		rowPlus.querySelector(".m-plus-rcv").value = 0;

		rowLatent.classList.add("disabled");
		skillLevel.setAttribute("readonly", true);
	} else {
		rowPlus.classList.remove("disabled");
		rowLatent.classList.remove("disabled");
		skillLevel.removeAttribute("readonly");
	}

	if (editBox.isAssist) {
		const btnDone = editBox.querySelector(".button-done");
		if (!card.canAssist) {
			btnDone.classList.add("cant-assist");
			btnDone.disabled = true;
		} else {
			btnDone.classList.remove("cant-assist");
			btnDone.disabled = false;
		}
	}

	//去除所有不能再打的潜觉
	editBox.latent = filterAllowLatent(editBox.latent,allowLatent);
	editBox.refreshLatent(editBox.latent, id);
	editBox.reCalculateExp();
	editBox.reCalculateAbility();
}
//刷新整个队伍
function refreshAll(formationData) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const titleBox = fragment.appendChild(formationBox.querySelector(".title-box"));
	const detailBox = formationBox.querySelector(".detail-box");
	const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
	const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计

	while (formationBox.childNodes.length > 0) {
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

	teamBigBoxs.forEach((teamBigBox, teamNum) => {
		const teamBox = teamBigBox.querySelector(".team-box");
		const teamData = formationData.teams[teamNum];
		const badgeBox = teamBigBox.querySelector(".team-badge");
		if (badgeBox) {
			const badge = badgeBox.querySelector(`#team-${teamNum+1}-badge-${teamData[2] || 0}`);
			badge.checked = true;
		}

		const membersDom = teamBox.querySelector(".team-members");
		const latentsDom = teamBox.querySelector(".team-latents");
		const assistsDom = teamBox.querySelector(".team-assist");
		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		for (let ti = 0, ti_len = membersDom.querySelectorAll(".member").length; ti < ti_len; ti++) {
			const member = membersDom.querySelector(`.member-${ti+1} .monster`);
			const latent = latentsDom.querySelector(`.latents-${ti+1} .latent-ul`);
			const assist = assistsDom.querySelector(`.member-${ti+1} .monster`);
			changeid(teamData[0][ti], member, latent); //队员
			changeid(teamData[1][ti], assist); //辅助
			refreshMemberSkillCD(teamBox, teamData, ti); //技能CD
			refreshAbility(teamAbilityDom, teamData, ti); //本人能力值
		}
		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData, teamNum);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
	});

	if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

	if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

	formationBox.appendChild(fragment);
	txtDetail.onblur(); //这个需要放在显示出来后再改才能生效
}
//刷新队伍觉醒统计
function refreshTeamAwokenCount(awokenDom, team) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenUL = fragment.appendChild(awokenDom.querySelector(".awoken-ul"));

	function setCount(aicon, number) {
		if (!aicon) return; //没有这个觉醒就撤回 
		const ali = aicon.parentNode;
		const countDom = ali.querySelector(".count");
		countDom.textContent = number;
		if (number)
			ali.classList.remove(className_displayNone);
		else
			ali.classList.add(className_displayNone);
	}
	for (let ai = 1; ai <= 72; ai++) {
		const aicon = awokenUL.querySelector(`.awoken-icon[data-awoken-icon='${ai}']`);
		if (!aicon) continue; //如果没有这个觉醒图，直接跳过
		//搜索等效觉醒
		const equalIndex = equivalent_awoken.findIndex(eak => eak.small === ai || eak.big === ai);
		if (equalIndex >= 0) {
			const equivalentAwoken = equivalent_awoken[equalIndex];
			if (equivalentAwoken.small === ai) {
				const totalNum = awokenCountInTeam(team, equivalentAwoken.small, solo, teamsCount) +
					awokenCountInTeam(team, equivalentAwoken.big, solo, teamsCount) * equivalentAwoken.times;
				setCount(aicon, totalNum);
			} else {
				continue;
			}
		} else {
			setCount(aicon, awokenCountInTeam(team, ai, solo, teamsCount));
		}
	}
	awokenDom.appendChild(fragment);
}
//刷新阵型觉醒统计
function refreshFormationAwokenCount(awokenDom, teams) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenUL = fragment.appendChild(awokenDom.querySelector(".awoken-ul"));

	function setCount(aicon, number) {
		if (!aicon) return; //没有这个觉醒就撤回 
		const ali = aicon.parentNode;
		const countDom = ali.querySelector(".count");
		countDom.textContent = number;
		if (number)
			ali.classList.remove(className_displayNone);
		else
			ali.classList.add(className_displayNone);
	}

	for (let ai = 1; ai <= 72; ai++) {
		const aicon = awokenUL.querySelector(`.awoken-icon[data-awoken-icon='${ai}']`);
		if (!aicon) continue; //如果没有这个觉醒图，直接跳过
		//搜索等效觉醒
		const equalIndex = equivalent_awoken.findIndex(eak => eak.small === ai || eak.big === ai);
		if (equalIndex >= 0) {
			const equivalentAwoken = equivalent_awoken[equalIndex];
			if (equivalentAwoken.small === ai) {
				const totalNum = awokenCountInFormation(teams, equivalentAwoken.small, solo) +
					awokenCountInFormation(teams, equivalentAwoken.big, solo) * equivalentAwoken.times;
				setCount(aicon, totalNum);
			} else {
				continue;
			}
		} else {
			setCount(aicon, awokenCountInFormation(teams, ai, solo));
		}
	}
	awokenDom.appendChild(fragment);
}
//刷新能力值
function refreshAbility(abilityDom, team, idx) {
	const memberData = team[0][idx];
	const assistData = team[1][idx];
	//基底三维，如果辅助是武器，还要加上辅助的觉醒
	const mainAbility = calculateAbility(memberData, assistData, solo, teamsCount);
	if (mainAbility && memberData.ability) {
		for (let ai = 0; ai < 3; ai++) {
			memberData.ability[ai] = mainAbility[ai][0];
			memberData.abilityNoAwoken[ai] = mainAbility[ai][1];
		}
	}
	if (!abilityDom) return; //如果没有dom，直接跳过
	const abilityLi = abilityDom.querySelector(".abilitys-" + (idx + 1));
	const hpDom = abilityLi.querySelector(".hp");
	const atkDom = abilityLi.querySelector(".atk");
	const rcvDom = abilityLi.querySelector(".rcv");
	[hpDom, atkDom, rcvDom].forEach(function(div, ai) {
		if (mainAbility) {
			div.classList.remove(className_displayNone);
			div.textContent = memberData.ability[ai];
		} else {
			div.classList.add(className_displayNone);
			div.textContent = 0;
		}
	});
}
//刷新队伍能力值合计
function refreshTeamTotalHP(totalDom, team, teamIdx) {
	//计算总的生命值
	if (!totalDom) return;
	const tHpDom = totalDom.querySelector(".tIf-total-hp");
	const tRcvDom = totalDom.querySelector(".tIf-total-rcv");
	const tMoveDom = totalDom.querySelector(".tIf-total-move");

	const teams = formation.teams;

	const leader1id = team[0][0].id;
	const leader2id = teamsCount===2 ? (teamIdx === 1 ? teams[0][0][0].id : teams[1][0][0].id) : team[0][5].id;

	if (tHpDom) {

		const teamHPArr = countTeamHp(team[0], leader1id, leader2id, solo);
		const teamHPNoAwokenArr = countTeamHp(team[0], leader1id, leader2id, solo, true);

		const tHP = teamHPArr.reduce((pv, v) => pv + v); //队伍计算的总HP
		const tHPNoAwoken = teamHPNoAwokenArr.reduce((pv, v) => pv + v); //队伍计算的总HP无觉醒

		const teamHPAwoken = awokenCountInTeam(team, 46, solo, teamsCount); //全队大血包个数

		let badgeHPScale = 1; //徽章倍率
		if (team[2] == 4 && (solo || teamsCount === 3)) {
			badgeHPScale = 1.05;
		} else if (team[2] == 11 && (solo || teamsCount === 3)) {
			badgeHPScale = 1.15;
		}

		tHpDom.textContent = Math.round(Math.round(tHP * (1 + 0.05 * teamHPAwoken)) * badgeHPScale) +
			` (${Math.round(Math.round(tHPNoAwoken) * badgeHPScale)})`;
	}

	if (tMoveDom) {
		const moveTime = countMoveTime(team, leader1id, leader2id, teamIdx);
		tMoveDom.textContent = moveTime.duration;
		if (moveTime.fixed)
			tMoveDom.classList.add("fixed-move-time");
		else
			tMoveDom.classList.remove("fixed-move-time");
	}
}
//刷新所有队伍能力值合计
function refreshFormationTotalHP(totalDom, teams) {
	//计算总的生命值
	if (!totalDom) return;
	const tHpDom = totalDom.querySelector(".tIf-total-hp");
	const tRcvDom = totalDom.querySelector(".tIf-total-rcv");

	if (tHpDom) {
		//因为目前仅用于2P，所以直接在外面固定写了
		const leader1id = teams[0][0][0].id;
		const leader2id = teams[1][0][0].id;
		const tHPArr = teams.map(function(team) {
			const teamHPArr = countTeamHp(team[0], leader1id, leader2id, solo);

			const teamTHP = teamHPArr.reduce((pv, v) => pv + v); //队伍计算的总HP
			const teamHPAwoken = awokenCountInTeam(team, 46, solo, teamsCount); //全队大血包个数

			return Math.round(teamTHP * (1 + 0.05 * teamHPAwoken));
		});
		const tHPNoAwokenArr = teams.map(function(team) {
			const teamHPArr = countTeamHp(team[0], leader1id, leader2id, solo, true);

			const teamTHP = teamHPArr.reduce((pv, v) => pv + v); //队伍计算的总HP
			return Math.round(teamTHP);
		});
		const tHP = tHPArr.reduce((pv, v) => pv + v);
		const tHPNoAwoken = tHPNoAwokenArr.reduce((pv, v) => pv + v);

		tHpDom.textContent = tHP.toString() +
			` (${tHPNoAwoken})`;
	}
}
//刷新单人技能CD
function refreshMemberSkillCD(teamDom, team, idx) {
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

	const memberSkillCd = memberSkill ? (memberSkill.initialCooldown - (member.skilllevel || memberSkill.maxLevel) + 1) : 0;
	const assistSkillCd = assistSkill ? (assistSkill.initialCooldown - (assist.skilllevel || assistSkill.maxLevel) + 1) : 0;
	memberSkillCdDom.textContent = memberSkillCd;
	assistSkillCdDom.textContent = memberSkillCd + assistSkillCd;

	if (member.skilllevel != undefined && member.skilllevel < memberSkill.maxLevel) {
		memberSkillCdDom.classList.remove("max-skill");
	} else {
		memberSkillCdDom.classList.add("max-skill");
	}
	if (assist.skilllevel != undefined && assist.skilllevel < assistSkill.maxLevel) {
		assistSkillCdDom.classList.remove("max-skill");
	} else {
		assistSkillCdDom.classList.add("max-skill");
	}
}

function localisation($tra) {
	if (!$tra) return;
	document.title = $tra.webpage_title;
	formationBox.querySelector(".title-box .title").placeholder = $tra.title_blank;
	formationBox.querySelector(".detail-box .detail").placeholder = $tra.detail_blank;
	controlBox.querySelector(".datasource-updatetime").title = $tra.force_reload_data;

	const s_sortList = editBox.querySelector(".search-box .sort-div .sort-list");
	const sortOptions = Array.from(s_sortList.options);
	sortOptions.forEach(opt => {
		const tag = opt.getAttribute("data-tag");
		const trans = $tra.sort_name[tag];
		if (trans) {
			opt.text = trans;
		}
	});
}