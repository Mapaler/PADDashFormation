let Cards = []; //怪物数据
let Skills = []; //技能数据
let PlayerDatas = []; //玩家数据
let currentLanguage; //当前语言
let currentDataSource; //当前数据
let currentPlayerData; //当前玩家数据
let markedFilter = []; //收藏的特殊搜索
let defaultLevel = 99; //默认等级

const teamBigBoxs = []; //储存全部teamBigBox
const allMembers = []; //储存所有成员，包含辅助

let interchangeSvg; //储存划线的SVG
let controlBox; //储存整个controlBox
let statusLine; //储存状态栏
let formationBox; //储存整个formationBox
let editBox; //储存整个editBox
let showSearch; //整个程序都可以用的显示搜索函数
let qrcodeReader; //二维码读取
let qrcodeWriter; //二维码输出
let selectedDeviceId; //视频源id

const dataStructure = 5; //阵型输出数据的结构版本
const cfgPrefix = "PADDF-"; //设置名称的前缀
const className_displayNone = "display-none";
const dataAttrName = "data-value"; //用于储存默认数据的属性名
const isGuideMod = !unsupportFeatures.length && Boolean(Number(getQueryString("guide"))); //是否以图鉴模式启动
const PAD_PASS_BADGE = 1<<7 | 1; //月卡徽章编号，129

if (location.search.includes('&amp;')) {
	location.search = location.search.replace(/&amp;/ig, '&');
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js', {scope: './'})
	.then(function(registration) {
		console.debug('service worker 注册成功',registration);
	}).catch(function(error) {
		console.error('servcie worker 注册失败',error);
	});
} else {
	console.error('浏览器不支持 servcie worker');
}

//一开始就加载当前语言
if (currentLanguage == undefined)
{
	const parameter_i18n = getQueryString(["l","lang"]); //获取参数指定的语言
	const browser_i18n = navigator.language; //获取浏览器语言
	if (parameter_i18n) //有指定语言的话，只找i18n完全相同的
	{
		currentLanguage = languageList.find(lang => lang.i18n == parameter_i18n) || languageList[0]; 
	}
	if (!currentLanguage) //如果还没有就直接搜索浏览器语言
	{
		currentLanguage = languageList.find(lang => { //筛选出符合的语言
			if (lang.i18n_RegExp)
			{
				return lang.i18n_RegExp.test(browser_i18n); //匹配正则表达式
			}else
			{
				return browser_i18n.includes(lang.i18n); //文字上的搜索包含
			}
		}) || languageList[0]; //没有找到指定语言的情况下，自动用第一个语言（英语）
	}
	//因为Script在Head里面，所以可以这里head已经加载好可以使用
	document.head.querySelector("#language-css").href = `languages/${currentLanguage.i18n}.css`;
}

//一开始就加载当前数据
if (currentDataSource == undefined)
{
	const parameter_dsCode = getQueryString("s"); //获取参数指定的数据来源
	currentDataSource = dataSourceList.find(ds => ds.code == parameter_dsCode) || dataSourceList[0]; //筛选出符合的数据源
}

const dbName = "PADDF";
let db = null;
const DBOpenRequest = indexedDB.open(dbName, 4);

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
	switch (true)
	{
		case event.oldVersion < 2:
			store = db.createObjectStore("cards");
			store = db.createObjectStore("skills");
		case event.oldVersion < 3:
			store = db.createObjectStore("palyer_datas", { keyPath: 'name' });
	}

	// 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
	store.transaction.oncomplete = function(event) {
		console.log("PADDF：数据库建立完毕");
	};
};

/*class Member2
{
	constructor(oldmember, isAssist)
	{
		//this.index = oldmember?.index ?? 0;
		this.id = oldmember?.id ?? 0;
		//this.exp = oldmember?.exp ?? 0;
		this.level = oldmember?.level ?? 1;
		this.plus = oldmember?.plus ?? {hp:0,atk:0,rcv:0};
		this.awoken = oldmember.awoken ?? 0;
		this.superAwoken = oldmember.superAwoken ?? null;
		this.latent = oldmember?.latent.concat() ?? [];
		this.skillLevel = oldmember.skillLevel ?? 0;
		this.assist = oldmember.assist ?? null;
		this.isAssist = Boolean(isAssist !== undefined ? isAssist : oldmember?.isAssist);
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
//让 Member 能直接获取 card
Object.defineProperty(Member.prototype, "card", {
	get() { return Cards[this.id]; }
})
Member.prototype.getAttrsTypesWithWeapon = function(assist) {
	let memberCard = this.card, assistCard = assist?.card;
	if (this.id <= 0 || !memberCard) return null; //跳过 id 0
	let attrs = [...memberCard.attrs]; //属性只有两个，因此用固定的数组
	let types = new Set(memberCard.types); //Type 用Set，确保不会重复
	let changeAttr, appendTypes;
	if (assistCard?.awakenings?.includes(49)) { //如果有武器
		//更改副属性
		changeAttr = assistCard.awakenings.find(ak=>ak >= 91 && ak <= 95);
		if (changeAttr) attrs[1] = changeAttr - 91;
		//添加类型
		appendTypes = assistCard.awakenings.filter(ak=>ak >= 83 && ak <= 90);
		appendTypes = appendTypes.map(type=>
			typekiller_for_type.find(t=>(type - 52) === t.awoken).type);
		appendTypes.forEach(appendType=>types.add(appendType));
	}
	return {
		attrs: attrs, changeAttr: Boolean(changeAttr),
		types: Array.from(types), appendType: Boolean(appendTypes?.length)
	};
}
Member.prototype.outObj = function() {
	const m = this;
	if (m.id == 0) return null;
	let obj = [m.id];
	if (m.level != undefined) obj[1] = m.level;
	if (m.awoken != undefined) obj[2] = m.awoken;
	if (m.plus != undefined && Array.isArray(m.plus) && m.plus.length >= 3 && (m.plus[0] + m.plus[1] + m.plus[2]) != 0) {
		if (m.plus[0] === m.plus[1] && m.plus[0] === m.plus[2]) { //当3个加值一样时只生成第一个减少长度
			obj[3] = m.plus[0];
		} else {
			obj[3] = m.plus;
		}
	}
	if (Array.isArray(m?.latent) && m.latent.length >= 1) obj[4] = m.latent;
	if (m?.sawoken >= 0) obj[5] = m.sawoken;
	const card = Cards[m.id] || Cards[0]; //怪物固定数据
	const skill = Skills[card.activeSkillId];
	//有技能等级，并且技能等级低于最大等级时才记录技能
	if (m.skilllevel != undefined && m.skilllevel < skill.maxLevel) obj[6] = m.skilllevel;
	return obj;
};
Member.prototype.loadObj = function(m, dataVersion) {
	if (m == undefined) //如果没有提供数据，直接返回默认
	{
		this.id = 0;
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
	if (!Array.isArray(this.plus)) this.plus = [0, 0, 0]; //如果加值不是数组，则改变
	this.latent = dataVersion > 1 ? m[4] : m.latent;
	if (Array.isArray(this.latent) && dataVersion <= 2) this.latent = this.latent.map(l => l >= 13 ? l + 3 : l); //修复以前自己编的潜觉编号为官方编号
	if (!Array.isArray(this.latent)) this.latent = []; //如果潜觉不是数组，则改变
	this.sawoken = dataVersion > 1 ?
						(dataVersion < 5 ? 
						Cards[this.id].superAwakenings[m[5]] //第四版前，是超觉醒的顺序
						: m[5] ) //第5版开始，超觉醒使用觉醒编号而不是顺序
					: m.sawoken;
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
	if (m.plus != undefined && Array.isArray(m.plus) && m.plus.length >= 3 && (m.plus[0] + m.plus[1] + m.plus[2]) > 0) this.plus = JSON.parse(JSON.stringify(m.plus));
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
	if (m.plus != undefined && Array.isArray(m.plus) && m.plus.length >= 3 && (m.plus[0] + m.plus[1] + m.plus[2]) > 0) this.plus = JSON.parse(JSON.stringify(m.plus));
	if (m.latent != undefined && Array.isArray(m.latent) && m.latent.length >= 1) this.latent = JSON.parse(JSON.stringify(m.latent));
	if (m.sawoken != undefined) this.sawoken = m.sawoken;
	if (m.ability != undefined && Array.isArray(m.ability) && m.plus.length >= 3) this.ability = JSON.parse(JSON.stringify(m.ability));
	if (m.abilityNoAwoken != undefined && Array.isArray(m.abilityNoAwoken) && m.plus.length >= 3) this.abilityNoAwoken = JSON.parse(JSON.stringify(m.abilityNoAwoken));
	if (m.skilllevel != undefined) this.skilllevel = m.skilllevel;
};

var Formation = function(teamCount, memberCount) {
	this.title = "";
	this.detail = "";
	this.teams = [];
	this.dungeonEnchance = {
		attrs: [],
		types: [],
		rarities: [],
		collabs: [],
		rate: {
			hp: 1,
			atk: 1,
			rcv: 1
		}
	}
	for (let ti = 0; ti < teamCount; ti++) {
		const team = [
			[], //队员
			[], //辅助
			0, //徽章
			0, //队长更换序号
		];
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
		).deleteLatter();
		teamArr[1] = t[1].map(m =>
			m.outObj()
		).deleteLatter();
		if (t[2]) teamArr[2] = t[2];
		if (t[3]) teamArr[3] = t[3];
		return teamArr;
	});
	let dge = this.dungeonEnchance;
	if (Object.values(dge.rate).some(rate => rate != 1)) obj.r = [
		[reflags(dge.types),reflags(dge.attrs),reflags(dge.rarities),dge.collabs.length ? dge.collabs : 0].deleteLatter(0), //类型,属性,星级
		[dge.rate.hp,dge.rate.atk,dge.rate.rcv].deleteLatter(1)
	];
	obj.v = dataStructure;
	/*if (obj.f.every(team=>team[0].length == 0 && team[1].length == 0 && team[2] == undefined) &&
	!obj.t &&
	!obj.d)
		return null;*/
	return obj;
};
Formation.prototype.loadObj = function(f) {
	let dge = this.dungeonEnchance;
	if (f == undefined) //如果没有提供数据，要返回空的
	{
		this.title = "";
		this.detail = "";
		this.teams.forEach(function(t, ti) {
				t[0].forEach(function(m, mi) {
					m.loadObj(null);
				});
				t[1].forEach(function(m, mi) {
					m.loadObj(null);
				});
				t[2] = 1;
				t[3] = 0;
		});
		dge.rarities.length = 0;
		dge.attrs.length = 0;
		dge.types.length = 0;
		dge.rate.hp = 1;
		dge.rate.atk = 1;
		dge.rate.rcv = 1;
		return;
	}
	const dataVeision = f?.v ?? (f.f ? 2 : 1); //是第几版格式
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
			t[2] = dataVeision > 3 ? //徽章
					(dataVeision < 5 && tf[2] == 50 ? PAD_PASS_BADGE : tf[2]) //5版开始月卡徽章用开关1<<7来识别
					: badgeConvert(tf[2]); //1、2版老数据的徽章
			t[3] = tf[3] ?? 0; //队长
		}
	});
	function badgeConvert(old)
	{
		switch (old)
		{
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8: {
				return old + 1;
			}
			case 9: {
				return 11;
			}
			case 10:case 11:case 12: {
				return old + 7;
			}
			case 13: {
				return 21;
			}
			case 14: {
				return 10;
			}
			case 15:case 16:case 17: {
				return old - 3;
			}
			case 18: { //月卡
				return 1<<7 | 1 ;
			}
			default: return 1;
		}
	}
	if (f.r)
	{
		if (Array.isArray(f.r[0])) {
			let effective = f.r[0];
			let rates = f.r[1];
			dge.types = flags(effective[0] ?? 0);
			dge.attrs = flags(effective[1] ?? 0);
			dge.rarities = flags(effective[2] ?? 0);
			dge.collabs = effective[3]?.length ? effective[3] : [];
			dge.rate.hp = rates[0] ?? 1;
			dge.rate.atk = rates[1] ?? 1;
			dge.rate.rcv = rates[2] ?? 1;
		} else {
			dge.attrs = flags(f.r[0] ?? 0);
			dge.types = flags(f.r[1] ?? 0);
			dge.rarities.length = 0;
			dge.rate.hp = f.r[2] ?? 1;
			dge.rate.atk = f.r[3] ?? 1;
			dge.rate.rcv = f.r[4] ?? 1;
		}
	}
	if (f.b)
		this.teams[0][2] = f.b; //原来模式的徽章
};
Formation.prototype.getPdfQrObj = function(keepDataSource = true)
{
	let qrObj = {
		d:this.outObj()
	};
	if (keepDataSource) qrObj.s = currentDataSource.code;
	return qrObj;
}
Formation.prototype.getPdcQrStr = function()
{
	function genMemberMap(m, a, position = 0)
	{
		const o = new Map();
		o.set(0, m.id);
		if (m.latent.length)
			o.set(2, m.latent.map(pdfLtent=>pdcLatentMap.find(latent=>latent.pdf === pdfLtent).pdc.toString(36).padStart(2,'0')).join('')); //潜觉
		o.set(3, m.level);
		o.set(4, m.plus[0]);
		o.set(5, m.plus[1]);
		o.set(6, m.plus[2]);
		o.set(7, (m?.awoken >= Cards[m.id].awakenings.length) ? -1 : m.awoken);
		o.set(8, m?.sawoken ?? 0);
		if (a.id != 0)
		{
			o.set(9, a.id);
			o.set(10, a.level);
			o.set(11, a.plus[0]);
			o.set(12, a.plus[1]);
			o.set(13, a.plus[2]);
			o.set(14, (a.awoken != null && a.awoken >= Cards[a.id].awakenings.length) ? -1 : a.awoken);
		}
		o.set(15, position);
		return o;
	}
	let outArr = [
		[1,this.teams.length - 1]
	];
	
	if (this.teams.length == 2)
	{
		const team1 = this.teams[0];
		const team2 = this.teams[1];
		team1[0].push(team2[0].shift());
		team1[1].push(team2[1].shift());
	}

	let pdcTeamsStr = this.teams.map((t,idx,arr)=>{
		let teamArr = [
			pdcBadgeMap.find(badge=>badge.pdf === t[2])?.pdc || 0 //徽章
		];
		const membersArr = t[0];
		const assistArr = t[1];
		for (let i=0;i<membersArr.length;i++)
		{
			if (membersArr[i].id > 0 || assistArr[i].id > 0)
			{
				let pdcMemberMap = genMemberMap(membersArr[i], assistArr[i], (arr.length == 2 && idx == 1) ? i+1 : i); //2人协力时，队伍2编号0是空的
				let pdcMemberArr = Array.from(pdcMemberMap);
				pdcMemberStr = pdcMemberArr.map(item => {
					if (item[1] == undefined)
					{
						return null;
					}
					return [
					item[0].toString(36).padStart(2,'0'),
					item[1].toString(36).padStart(2,'0')
				].join('')}).filter(item=>item).join(',');
				teamArr.push(pdcMemberStr);
			}
		}
		return teamArr.join('}');
	});
	
	if (this.teams.length == 2)
	{
		const team1 = this.teams[0];
		const team2 = this.teams[1];
		team2[0].splice(0,0,team1[0].pop());
		team2[1].splice(0,0,team1[1].pop());
	}

	outArr = outArr.concat(pdcTeamsStr);
	return outArr.join(']');
}
Formation.prototype.getQrStr = function(type)
{
	if (type == 'pdf' || type == 0)
	{
		return JSON.stringify(this.getPdfQrObj());
	}else
	{
		return this.getPdcQrStr();
	}
}
Formation.prototype.removeAssist = function() {
	this.teams.forEach(team=>{
		const assists = team[1];
		for (let i = 0; i < assists.length; i++) {
			assists[i] = new MemberAssist();
		}
	});
	creatNewUrl();
	refreshAll(formation);
}

class PlayerData
{
	constructor(data)
	{
		Object.assign(this, data);
		this.parsedCards = PlayerDataCard.parseDataArray(data.card);
		this.parsedDecks = PlayerDataDeck.parseDataArray(
			data.decksb.decks,
			data?.decksbs?.decks,
			this.parsedCards);
	}
}
class PlayerDataDeck {
	constructor(data, parsedCards) {
		const e = data.entries();
		this.membersIndex = [
			e.next().value[1],
			e.next().value[1],
			e.next().value[1],
			e.next().value[1],
			e.next().value[1],
		];
		this.badge = e.next().value[1];
		this.membersIndex.push(e.next().value[1]);
		if (parsedCards)
		{
			this.members = this.membersIndex.map(id=>id===0 ? null : parsedCards.find(m=>m.index === id));
		}
		e.next(); //未知
		e.next(); //未知
		if (!e.next().done)
		{
			console.warn("出现未知的用户队伍数据");
		}
	}
	static parseDataArray(decks1, decks2, parsedCards)
	{
		let datas = decks1.concat(decks2 ?? []);
		let decks = datas.map(deck=>new PlayerDataDeck(deck, parsedCards));
		if (Boolean(decks2)) //如果开了月卡
		{
			decks.forEach(deck=>{if (deck.badge === 1) deck.badge |= 1 << 7;}); //觉醒1打开月卡flag
		}
		return decks;
	}
	toFormation()
	{
		const f = new Formation(1, 6);
		const team = f.teams[0];
		team[2] = this.badge;
		const tMembers = team[0];
		const tAssists = team[1];
		this.members.forEach((member, idx)=>{
			const tm = tMembers[idx];
			const ta = tAssists[idx];
			if (member) {
				tm.loadFromMember(member);
				tm.sawoken = member.superAwoken;
				tm.plus = Object.values(member.plus);
				tm.skilllevel = member.skillLevel;
				if (member.assist) {
					ta.loadFromMember(member.assist);
					ta.sawoken = member.assist.superAwoken;
					ta.plus = Object.values(member.assist.plus);
					ta.skilllevel = member.assist.skillLevel;
				}
			}
		});
		return f;
	}
}
class PlayerDataCard {
	constructor(data) {
		const e = data.entries();
		this.index = e.next().value[1];
		this.exp = e.next().value[1];
		this.level = e.next().value[1];
		this.skillLevel = e.next().value[1]; //未知
		e.next(); //未知
		this.id = e.next().value[1];

		//叠加型用他们的经验来表示数量
		const card = Cards[this.id];
		this.count = 1;
		if (card && card.stacking)
		{
			this.count = this.exp;
			this.exp = 0;
		}
		
		this.plus = {
			hp : e.next().value[1],
			atk: e.next().value[1],
			rcv: e.next().value[1]
		};
		this.awoken = e.next().value[1];

		let parsedLatent = this.parseLatent(e.next().value[1]);
		this.latentMaxCount = parsedLatent.latentCount;
		this.latent = this.deleteRepeatLatent(parsedLatent.latent.reverse());

		this.assistIndex = e.next().value[1];
		e.next(); //未知
		this.superAwoken = e.next().value[1];
		e.next(); //未知
		if (!e.next().done)
		{
			console.warn("出现未知的用户箱子卡片数据");
		}
		//console.log(b);
	}
	toOldMember()
	{
		const m = new Member();
		m.id = this.id;
		m.level = this.level;
		m.awoken = this.awoken;
		m.skilllevel = this.skillLevel;
		m.plus = [this.plus.hp,this.plus.atk,this.plus.rcv];
		m.sawoken = this.superAwoken;
		m.latent = this.latent.concat();
		return m;
	}
	static parseDataArray(datas)
	{
		const parsedCards = datas.map(ocard=>new PlayerDataCard(ocard));
		parsedCards.forEach(mon=>{
			mon.assist = mon.assistIndex === 0 ? null : parsedCards.find(m=>m.index === mon.assistIndex);
		});
		return parsedCards;
	}
	parseLatent(number)
	{
		let latentNumber = BigInt(number);
		const obj = {
			latent: [],
			latentCount: 6,
		};
		//console.log("原始数字",latentNumber.toString(2));
		const latentVersion = latentNumber & 0b111n; //记录版本，111是用几位来做记录，也就是最多7位
		latentNumber >>= 3n; //右移3位
		//console.log("读取潜觉记录位数",latentNumber.toString(2));
		const changeLatentCount = Boolean(latentNumber & 1n); //1时就是开孔了
		latentNumber >>= 1n; //右移1位
		//console.log("读取潜觉格子数是否改变",latentNumber.toString(2));
		if (changeLatentCount)
		{
			obj.latentCount = Number(latentNumber & 0b1111n);
			latentNumber >>= 4n;
			//console.log("读取潜觉格子数",latentNumber.toString(2));
		}
		const rightbnum = latentVersion > 6n ? 7n : 5n; //右移的距离
		const getbnum = 2n ** rightbnum - 1n; //逻辑与的数字 //latentVersion > 6 ? 0b1111111n : 0b11111n;
		while (latentNumber > 0n)
		{
			obj.latent.push(Number(latentNumber & getbnum));
			latentNumber >>= rightbnum;
			//console.log("读取一个潜觉",latentNumber.toString(2));
		}
		return obj;
	}
	deleteRepeatLatent(olatents)
	{
		//splice性能太差，改成push一个新的数组
		const latents = [];
		for (let ai = 0; ai < olatents.length;)
		{
			const latent = olatents[ai];
			latents.push(latent);
			const useHole = latentUseHole(latent);
			ai += useHole;
		}
		return latents;
	}
}
//进化树
class EvoTree 
{
	constructor(mid, parent = null)
	{
		if (!mid) return;
		const _this = this;
		this.parent = parent;
		if (parent == null) //如果没有提供父级，则寻找进化根
		{
			function returnRootId(mid)
			{
				mid = Cards[mid].evoRootId;
				const m = Cards[mid];
				if (Array.isArray(m.henshinFrom) && m.henshinFrom[0] < m.id)
				{ //只有变身来源小于目前id的，才继续找base,为了解决黑魔导女孩的问题，将来如果需要要可以改成检测是否能110级
					mid = returnRootId(m.henshinFrom[0]);
				}
				return mid;
			}
			mid = returnRootId(mid);
		}
		const card = Cards[mid];
		
		this.id = mid;
		this.idArr = parent ? parent.idArr.concat() : [];
		this.card = card;
		this.children = [];
		this.evoType = null;

		if (parent == null)
		{
			this.evoType = "Base";
		}
		else if (Array.isArray(card.henshinFrom) && card.henshinFrom.includes(parent.id))
		{
			if (parent.card.henshinTo.length > 1) {
				this.evoType = "Random Henshin";
				//限定最多两层随机变身
				if (parent?.parent?.card?.henshinTo?.length > 1) {
					return this;
				}
			}
			else
				this.evoType = "Henshin";
		}
		else
		{
			if (card.evoMaterials.includes(3826)) //像素进化
			{
				this.evoType = "Pixel Evo";
			}else if (card.awakenings.includes(49)) //武器
			{
				this.evoType = "Assist Evo";
			}else if (card.isUltEvo) //究进
			{
				if (parent.card.isUltEvo) //超究进
				{
					this.evoType = "Super Ult Evo";
				}else
				{
					this.evoType = "Ult Evo";
				}
			}else
			{
				if (parent.card.isUltEvo) //转生
				{
					this.evoType = "Reincarnation";
				}else if(parent.evoType == "Reincarnation")
				{
					this.evoType = "Super Reincarnation";
				}else
				{
					this.evoType = "Evolution";
				}
			}
		}

		if (this.idArr.includes(mid))
		{
			if (Array.isArray(card.henshinFrom) && card.henshinFrom.includes(parent.id))
			{
				this.evoType = "Henshin Loop";
			}
			return this;
		}else
		{
			this.idArr.push(mid);
		}
		if (Array.isArray(card.henshinTo)) {
			card.henshinTo.forEach(toId=>this.children.push(new EvoTree(toId, _this)), this);
		}
		if (this.evoType != "Henshin")
			this.children.push(...Cards.filter(scard=>scard.evoBaseId == mid && scard.id != mid).map(scard=>new EvoTree(scard.id,_this)));
		//this.children = (card.henshinTo && card.henshinTo != card.evoRootId ? [new EvoTree(card.henshinTo,_this)] : []).concat(Cards.filter(scard=>scard.evoBaseId == mid && scard.id != mid).map(scard=>new EvoTree(scard.id,_this)));
	};
	toListNode()
	{
		const createCardHead = editBox.createCardHead;
		const tBox = document.createElement("div");
		tBox.className = "evo-box";
		const evoPanel = tBox.appendChild(document.createElement("div"));
		evoPanel.className = "evo-panel " + this.evoType.toLowerCase().replace(/\s/g,"-");
		const evotPanel_L = evoPanel.appendChild(document.createElement("div"));
		evotPanel_L.className = "evo-panel-left";
		const evotPanel_R = evoPanel.appendChild(document.createElement("div"));
		evotPanel_R.className = "evo-panel-right";

		const evoTypeDiv = evotPanel_L.appendChild(document.createElement("div"));
		evoTypeDiv.className = "evo-type-div";
		const evoType = evoTypeDiv.appendChild(document.createElement("span"));
		evoType.className = "evo-type";
		const monHead = evotPanel_L.appendChild(createCardHead(this.id, {noTreeCount: true}));
		monHead.className = "monster-head";

		const monName = evotPanel_R.appendChild(document.createElement("div"));
		monName.className = "monster-name";
		monName.textContent = returnMonsterNameArr(this.card, currentLanguage.searchlist, currentDataSource.code)[0];

		const evotMaterials = evotPanel_R.appendChild(document.createElement("ul"));
		evotMaterials.className = "evo-materials";
		this.card.evoMaterials.forEach(mid=>{
			//const li = evotMaterials.appendChild(document.createElement("li"));
			evotMaterials.appendChild(createCardHead(mid, {noTreeCount: true}));
		});

		const evoSubEvo = tBox.appendChild(document.createElement("ul"));
		evoSubEvo.className = "evo-subevo";
		this.children.forEach(subEvo=>{
			const li = evoSubEvo.appendChild(document.createElement("li"));
			li.appendChild(subEvo.toListNode());
		});
		return tBox;
	};
}
//进化树
class RequirementTree extends EvoTree
{
	static gemNames = {
		ja: "希石",
		en: "Gem",
		ko: "휘석",
	};
	constructor(mid, parent = null)
	{
		if (!mid) return;
		super();
		const _this = this;
		this.parent = parent;
		const card = Cards[mid];
		
		this.id = mid;
		this.idArr = parent ? parent.idArr.concat() : [];
		this.card = card;
		this.children = [];
		this.evoType = "requirement";
		this.idArr.push(mid);

		let gemName = RequirementTree.gemNames[currentDataSource.code];

		if (card.evoBaseId && card.evoRootId !== mid) {
			let realMaterials = []
			for (const materialId of card.evoMaterials.filter(Boolean)) {
				const materialCard = Cards[materialId];
				if (!materialCard) continue;
				if (materialCard.types.includes(0) && materialCard.name.includes(gemName)) { //必须是进化型，并且有稀石字样
					//console.log("查咨进化素材：", materialCard);
					let maybeCard = Cards.find(_card =>
						!_card.types.includes(0) && //必须不是进化类型
						_card.activeSkillId === materialCard.activeSkillId && //技能一致
						materialCard.name.includes(_card.name) && //稀石名字包含原始名字
						_card.evoRootId != _card.id //忽略原始形态没有进化的
						);
					//console.log("查询结果：", maybeCard);
					if (maybeCard && !_this.idArr.includes(maybeCard.id)) {
						//console.log(card, maybeCard);
						realMaterials.push(maybeCard.id);
					};
				}
			}
			
			let materials = realMaterials.map(materialId=>new RequirementTree(materialId, _this));
			this.children.push(...materials);
			this.children.push(new RequirementTree(card.evoBaseId, _this));
		}
	};
}

//队长技能类型的翻译
class LeaderSkillType{
	constructor(flags1, flags2){
		this.matchMode = {
			multipleAttr: Boolean(flags1 & 1 << 0),
			rowMatch: Boolean(flags1 & 1 << 1),
			combo: Boolean(flags1 & 1 << 2),
			sameColor: Boolean(flags1 & 1 << 3),
			LShape: Boolean(flags1 & 1 << 4),
			crossMatch: Boolean(flags1 & 1 << 5),
			heartCrossMatch: Boolean(flags1 & 1 << 6),
			remainOrbs: Boolean(flags1 & 1 << 7),
			enhanced5Orbs: Boolean(flags1 & 1 << 8),
		};
		this.restriction = {
			attrEnhance: Boolean(flags1 & 1 << 9),
			typeEnhance: Boolean(flags1 & 1 << 10),
			board7x6: Boolean(flags1 & 1 << 11),
			noSkyfall: Boolean(flags1 & 1 << 12),
			HpRange: Boolean(flags1 & 1 << 13),
			useSkill: Boolean(flags1 & 1 << 14),
			moveTimeDecrease_Fixed: Boolean(flags1 & 1 << 15),
			minMatchLen: Boolean(flags1 & 1 << 16),
			specialTeam: Boolean(flags1 & 1 << 17),
			effectWhenRecover: Boolean(flags1 & 1 << 18),
		};
		this.appendEffects = {
			addCombo: Boolean(flags1 & 1 << 21),
			fixedFollowAttack: Boolean(flags1 & 1 << 22),
			scaleFollowAttack: Boolean(flags1 & 1 << 23),
			reduce49down: Boolean(flags1 & 1 << 24),
			reduce50: Boolean(flags1 & 1 << 25),
			reduce51up: Boolean(flags1 & 1 << 26),
			moveTimeIncrease: Boolean(flags1 & 1 << 20),
			rateMultiplyExp_Coin: Boolean(flags1 & 1 << 27),
			rateMultiplyDrop: Boolean(flags1 & 1 << 28),
			voidPoison: Boolean(flags1 & 1 << 29),
			counterAttack: Boolean(flags1 & 1 << 30),
			autoHeal: Boolean(flags1 & 1 << 31),
			unbindAwokenBind: Boolean(flags1 & 1 << 19),
			resolve: Boolean(flags2 & 1 << 0),
		};
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
function henshinStep(step)
{
	if (step == 0) return;

	function gotoHenshin(card, nstep)
	{
		if (nstep > 0 && Array.isArray(card.henshinTo))
		{
			let max = Math.randomInteger(card.henshinTo.length - 1);
			return gotoHenshin(Cards[card.henshinTo[max]], --nstep);
		}
		else if (nstep < 0 && Array.isArray(card.henshinFrom))
		{
			return gotoHenshin(Cards[card.henshinFrom[0]], ++nstep);
		}
		else
		{
			return card;
		}
	}
	formation.teams.forEach(team=>{
		team[0].forEach(member=>{
			const mid = member.id;
			const card = Cards[mid];
			if (step > 0 ? Array.isArray(card.henshinTo) : (Array.isArray(card.henshinFrom) && member.level <= 99))
			{ //要变身前的才进行操作
				const _card = gotoHenshin(card, step);
				member.id = _card.id;
				member.awoken = _card.awakenings.length;
			}
		});
	});
	
	creatNewUrl();
	refreshAll(formation);
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
		try {
			lastCkeys = JSON.parse(localStorage.getItem(cfgPrefix + "ckey")); //读取本地储存的原来的ckey
			if (!Boolean(lastCkeys) || !Array.isArray(lastCkeys))
				lastCkeys = [];
		} catch (e) {
			console.error("旧的 Ckey 数据 JSON 解码出错。", e);
			lastCkeys = [];
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
				console.error("Cards 数据库内容读取失败，需重新下载。");
				downloadCardsData();
			};
			request.onsuccess = function(event) {
				if (Array.isArray(request.result))
				{
					Cards = loadExtraCardsData(request.result);
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
						Cards = loadExtraCardsData(JSON.parse(response.response));
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
							localStorage.setItem(cfgPrefix + "ckey", JSON.stringify(lastCkeys)); //储存新的ckey
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
		function loadExtraCardsData(_cards)
		{
			let splitIdx = _cards.findIndex((card, id)=>card?.id !== id);
			let cards = _cards.slice(0, splitIdx);
			for (let i = splitIdx + 1; i < _cards.length; i++)
			{
				const card = _cards[i];
				if (card.searchFlags) card.leaderSkillTypes = new LeaderSkillType(...card.searchFlags);
				/*card.unk01p = flags(card.unk01);
				card.unk02p = flags(card.unk02);
				card.unk03p = flags(card.unk03);
				card.unk04p = flags(card.unk04);
				card.unk05p = flags(card.unk05);
				card.unk06p = flags(card.unk06);
				card.unk07p = flags(card.unk07);
				card.unk08p = flags(card.unk08);*/
				cards[card?.id] = card;
			}
			return cards;
		}
		function dealCardsData(_cards)
		{
			if (editBox)
			{
				const monstersList = editBox.querySelector("#monsters-name-list");
				let fragment = document.createDocumentFragment();
				_cards.forEach(function(card, idx, arr) { //添加下拉框候选
					const opt = fragment.appendChild(document.createElement("option"));
					opt.value = card.id;
					opt.label = card.id + " - " + returnMonsterNameArr(card, currentLanguage.searchlist, currentDataSource.code).join(" | ");
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
					if (Array.isArray(request.result))
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
								localStorage.setItem(cfgPrefix + "ckey", JSON.stringify(lastCkeys)); //储存新的ckey
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
	
			function dealSkillData(_skills)
			{
				//显示数据更新时间
				let controlBoxHook = setInterval(checkControlBox, 500); //循环检测controlBox
				checkControlBox();
				function checkControlBox()
				{
					if (controlBox)
					{
						const updateTime = controlBox.querySelector(".datasource-updatetime");
						updateTime.textContent = new Date(currentCkey.updateTime).toLocaleString(undefined, { hour12: false });
						clearInterval(controlBoxHook);
					}
				}
	
				//initialize(); //初始化
				if (statusLine) statusLine.classList.remove("loading-skill-info");

				//如果通过的话就载入URL中的怪物数据
				let formationBoxHook = setInterval(checkFormationBox, 500); //循环检测formationBox
				checkFormationBox();
				function checkFormationBox()
				{
					if (formationBox?.querySelector('.teams'))
					{
						reloadFormationData();
						clearInterval(formationBoxHook);
					}
				}

				//读取储存的所有玩家数据
				if (db) dbReadAll(db, "palyer_datas").then(datas=>{
					PlayerDatas = datas.map(data=>new PlayerData(data));
					currentPlayerData = PlayerDatas.find(data=>data.name == localStorage.getItem(cfgPrefix + "default-player-name"));
					//document.body.querySelector("#player-data-frame").show(); //debug用显示
				});
			}
		}

	}
}
//重新读取URL中的Data数据并刷新页面
function reloadFormationData(event) {
	let formationData;
	if (!(formationData = event?.state?.outForm))
	{
		//如果没有现有数据
		try {
			const parameterDataString = getQueryString(["d","data"]);
			formationData = JSON.parse(parameterDataString);
			//console.log("从URL读取",formationData);

		} catch (e) {
			console.error("URL中队伍数据JSON解码出错", e);
			return;
		}
	}
	formation.loadObj(formationData);
	
	//编辑模式直接打开编辑框
	let editingTarget = ((str)=>{
		try {
			const arr = JSON.parse(str);
			return (Array.isArray(arr) && arr.length >= 3 && arr.slice(0,3).every(n=>typeof n == "number")) ? arr : null;
		} catch (error) {
			return null;
		}
	})(sessionStorage.getItem('editing'));
	if (!editingTarget && isGuideMod) editingTarget = [0,0,0];
	if (editingTarget)
	{
		const mid = event?.state?.mid ?? parseInt(getQueryString("id"), 10);
		const searchArr = event?.state?.searchArr ?? (str=>{
			try {
				const arr = JSON.parse(str);
				if (Array.isArray(arr) && arr.every(item=>Number.isInteger(item))) {
					return arr;
				} else return;
			} catch (error) {
				return;
			}
		})(getQueryString("show-search")); //显示指定的ID数组
		if (isGuideMod && !isNaN(mid)) {
			formation.teams[editingTarget[0]][editingTarget[1]][editingTarget[2]].id = mid;
		}
		editBox.editMon(editingTarget[0], editingTarget[1], editingTarget[2]);
		if (editingTarget && searchArr)
		{
			showSearch(searchArr);
		}
	} else {
		editBox.hide();
	}
	
	//恢复上一次的搜索状态
	const searchOptions = ((str)=>{
		try {
			const obj = JSON.parse(str);
			return obj.attrs ? obj : null;
		} catch (error) {
			return null;
		}
	})(getQueryString('search-options') || sessionStorage.getItem('search-options'));
	if (searchOptions) {
		editBox?.querySelector(".search-box")?.recoverySearchStatus(searchOptions);
	}
	
	refreshAll(formation);
}
window.addEventListener('popstate',reloadFormationData); //前进后退时修改页面
//创建新的分享地址
function creatNewUrl(arg) {
	if (arg == undefined) arg = {};
	if (!!(window.history && history.pushState)) { // 支持History API
		const language_i18n = arg.language || getQueryString(["l","lang"]); //获取参数指定的语言
		const datasource = arg.datasource || getQueryString("s");
		const outObj = formation.outObj();

		const newSearch = new URLSearchParams();
		if (language_i18n) newSearch.set("l", language_i18n);
		if (datasource && datasource != "ja") newSearch.set("s", datasource);
		if (getQueryString("guide")) newSearch.set("guide", getQueryString("guide"));
		if (getQueryString("id")) newSearch.set("id", getQueryString("id"));
		if (outObj)
		{
			const dataJsonStr = JSON.stringify(outObj); //数据部分的字符串
			newSearch.set("d", dataJsonStr);
		}

		const newUrl = (arg.url || "") + (newSearch.toString().length > 0 ? '?' + newSearch.toString() : "");

		if (!arg.notPushState) {
			history.pushState({outForm: outObj}, null, newUrl.length > 0 ? newUrl : location.pathname);
		} else {
			return newUrl;
		}
	}
}

function ObjToUrl(obj)
{
	let fileName;
	switch (obj.d.f.length)
	{
		case 1:{
			fileName = "solo.html";
			break;
		}
		case 2:{
			fileName = "multi.html";
			break;
		}
		case 3:{
			fileName = "triple.html";
			break;
		}
	}
	const newUrl = new URL(fileName, location);
	newUrl.searchParams.set("d",JSON.stringify(obj.d));
	if (!obj.s || obj.s == "ja")
	{
		newUrl.searchParams.delete("s");
	}else
	{
		newUrl.searchParams.set("s", obj.s);
	}
	let l = getQueryString("l");
	if (l)
	{
		newUrl.searchParams.set("l", l);
	}
	return newUrl;
}
//解析从QR图里获取的字符串
function inputFromQrString(string)
{
	const re = {code: 0, message: null};
	//code 1~99 为各种编码
	if (string[0] === "{" && string[string.length-1] === "}")
	{
		try{
			let jo = JSON.parse(string);
			if (jo.d && typeof jo.d == "object")
			{
				re.code = 1;
				re.message = "发现队伍数据 | Formation data founded";
				re.url = ObjToUrl(jo);
			}else
			{
				re.code = 100;
				re.message = "无队伍数据 | No formation data";
			}
		}catch(e)
		{
			re.code = 111;
			re.message = "错误的 JSON 格式 | The illegal JSON format";
		}
	}
	else if (/^(https?|file):\/\//i.test(string))
	{
		let url = new URL(string);
		if (url.searchParams.get('d'))
		{
			try{
				let jo = {
					d: JSON.parse(url.searchParams.get('d')),
					s: url.searchParams.get('s'),
				}
				re.code = 1;
				re.message = "发现队伍数据 | Formation data founded";
				re.url = ObjToUrl(jo);
			}catch(e)
			{
				re.code = 112;
				re.message = "错误的 网址 格式 | The illegal URL format";
			}
		}
		else
		{
			re.code = 100;
			re.message = "无队伍数据 | No formation data";
		}
	}
	else if(/^\d[\d\-\w,\]}]+}/.test(string))
	{ //PDC
		re.code = 2;
		re.message = "发现 PDC 格式 | PDC format found";
		const newFotmation = pdcFotmationToPdfFotmation(string);
		re.url = ObjToUrl(newFotmation.getPdfQrObj(false));
	}
	else
	{
		re.code = 110;
		re.message = "不支持的格式 | Unsupported format";
	}
	return re;
}

//解析PDC的数据
function pdcFotmationToPdfFotmation(inputString)
{
	function readPDC(string)
	{
		let teamsStr = string.split(']');
		let baseInfo = teamsStr.shift().split(',');
		let teamsArr = teamsStr.map(teamStr=>
			{
				let membersStr = teamStr.split('}').filter(Boolean);
				const team = {
					badge: parseInt(membersStr.shift(),10) //第一个元素是徽章，是10进制。读取并从数组内删掉，剩下的都是队员
				}
				team.members = membersStr.map(memberStr=>{
					let memberArr = memberStr.split(',').map(valueStr=>{
						let idx = parseInt(valueStr.substring(0,2),36);
						let value = valueStr.substring(2);
						if (idx !== 2)
						{
							value = parseInt(value,36);
						}else
						{
							value = value.match(/\w{2}/g).map(v=>parseInt(v,36));
						}
						return [idx, value];
					});
					return new Map(memberArr);
				});
				return team;
			}
		);
		let pdcFotmation = {
			version: parseInt(baseInfo[0],10),
			teamCount: parseInt(baseInfo[1],10)+1,
			teams: teamsArr
		}
		return pdcFotmation;
	}
	let pdcFotmation = readPDC(inputString);
	const f = new Formation(pdcFotmation.teamCount, pdcFotmation.teamCount == 2 ? 5 : 6);
	if (pdcFotmation.teamCount == 2)
	{
		const team1 = pdcFotmation.teams[0].members;
		const team2 = pdcFotmation.teams[1].members;
		let team2Leader = team1.find(member=>member.get(15) == 5);
		if (team2Leader)
		{
			team2Leader.set(15,0);
			team2.unshift(team2Leader);
			team1.splice(team1.indexOf(team2Leader),1);
		}
	}
	pdcFotmation.teams.forEach((pdcTeam,ti)=>{
		const t = f.teams[ti];
		const membersArr = t[0];
		const assistArr = t[1];
		//队伍徽章
		t[2] = pdcTeam.badge === 0 ? 0 : pdcBadgeMap.find(badge=>badge.pdc === pdcTeam.badge).pdf;
		pdcTeam.members.forEach((member)=>{
			const m = membersArr[member.get(15) || 0];
			const a = assistArr[member.get(15) || 0];
			m.id = member.get(0) || 0;
			a.id = member.get(9) || 0; //延迟是-1刚好一样
			if (member.get(2))
			{
				m.latent = member.get(2).map(pdcLatent=>pdcLatentMap.find(latent=>latent.pdc === pdcLatent)?.pdf ?? 0);
			}
			m.level = member.get(3) || 1;
			a.level = member.get(10) || 1;
			m.plus[0] = member.get(4) || 0;
			m.plus[1] = member.get(5) || 0;
			m.plus[2] = member.get(6) || 0;
			a.plus[0] = member.get(11) || 0;
			a.plus[1] = member.get(12) || 0;
			a.plus[2] = member.get(13) || 0;

			m.awoken = member.get(7) >= 0 ? member.get(7) : Cards[m.id].awakenings.length;
			a.awoken = member.get(14) >= 0 ? member.get(14) : (a.id > 0 ? Cards[a.id].awakenings.length : 0);
			m.sawoken = member.get(8);
		});
	});
	return f;
}
//截图
function capture() {
	statusLine.classList.add("prepare-capture");
	const titleBox = formationBox.querySelector(".title-box");
	const detailBox = formationBox.querySelector(".detail-box");
	const txtTitle = titleBox.querySelector(".title-code");
	const txtDetail = detailBox.querySelector(".detail-code");
	//去掉可能的空白文字的编辑状态
	formationBox.classList.remove("edit-code");
	const downLink = controlBox.querySelector(".down-capture");
	html2canvas(formationBox, {backgroundColor: null}).then(canvas => {
		canvas.toBlob(function(blob) {
			window.URL.revokeObjectURL(downLink.href);
			downLink.href = URL.createObjectURL(blob);
			downLink.download = `${document.title}.png`;
			downLink.click();
			statusLine.classList.remove("prepare-capture");
		});
		//document.body.appendChild(canvas);
	});
}

window.onload = initialize; //界面初始化

//初始化
function initialize() {
	document.body.lang = currentLanguage.i18n;

	qrcodeReader = new ZXing.BrowserQRCodeReader(); //二维码读取
	qrcodeWriter = new ZXing.BrowserQRCodeSvgWriter(); //二维码生成

	controlBox = document.body.querySelector(".control-box");
	statusLine = controlBox.querySelector(".status"); //显示当前状态的
	formationBox = document.body.querySelector(".formation-box");
	editBox = document.body.querySelector(".edit-box");
	editBox.editMon = editMember;

	formationBox.refreshDocumentTitle = function() {
		let titleStr = txtTitleDisplay.textContent.trim();
		document.title = titleStr.length > 0 ? `${titleStr.trim()} - ${localTranslating.webpage_title}` : localTranslating.webpage_title;
	}

	if (isGuideMod) {
		console.info('现在是 怪物图鉴 模式');
		document.body.classList.add('guide-mod');
	}

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
	document.body.dataset.gameSource = currentDataSource.code;
	//document.body.classList.add("ds-" + currentDataSource.code);
	//▲添加数据来源列表结束

	//设定初始的显示设置
	//显示ID开关
	const btnShowMonId = document.getElementById("show-mon-id");
	btnShowMonId.checked = localStorage_getBoolean(cfgPrefix + btnShowMonId.id, true);
	btnShowMonId.onchange = function(e){
		document.body.classList.toggle(this.id, this.checked);
		if (e) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
	};
	btnShowMonId.onchange(false);

	//显示CD开关
	const btnShowMonSkillCd = document.getElementById("show-mon-skill-cd");
	btnShowMonSkillCd.checked = localStorage_getBoolean(cfgPrefix + btnShowMonSkillCd.id, true);
	btnShowMonSkillCd.onchange = function(e){
		document.body.classList.toggle(this.id, this.checked);
		if (e) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
	};
	btnShowMonSkillCd.onchange(false);

	//显示卡片觉醒开关
	const btnShowMonAwoken = document.getElementById("show-mon-awoken");
	btnShowMonAwoken.checked = localStorage_getBoolean(cfgPrefix + btnShowMonAwoken.id);
	btnShowMonAwoken.onchange = function(e){
		document.body.classList.toggle(this.id, this.checked);
		if (e) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
	};
	btnShowMonAwoken.onchange(false);
	
	//3P显示觉醒统计开关
	const btnShowAwokenCount = document.getElementById("show-awoken-count");
	if (btnShowAwokenCount) {
		btnShowAwokenCount.checked = localStorage_getBoolean(cfgPrefix + btnShowAwokenCount.id, true);
		btnShowAwokenCount.onchange = function(e){
			document.body.classList.toggle(this.id, this.checked);
			if (e) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
		};
		btnShowAwokenCount.onchange(false);
	}

	//默认等级
	const iptDefaultLevel = document.getElementById("default-level");
	iptDefaultLevel.value = localStorage.getItem(cfgPrefix + iptDefaultLevel.id);
	iptDefaultLevel.onchange = function(e){
		let num = Number(this.value);
		defaultLevel = num || this.placeholder;
		if (e) localStorage.setItem(cfgPrefix + this.id, this.value);
	}
	iptDefaultLevel.onchange(false);

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

	//初始化所有mask的关闭按钮
	const masks = document.body.querySelectorAll(".mask");
	masks.forEach(mask=>{
		mask.show = function(arg){
			this?.initialize?.(arg);
			this.classList.remove(className_displayNone);
		};
		mask.btnClose = mask.querySelector(".mask-close");
		mask.btnClose.onclick = function(){
			mask?.hide?.();
			mask.classList.add(className_displayNone);
		};
	});
	const qrCodeFrame = document.body.querySelector("#qr-code-frame");
	const btnQrCode = controlBox.querySelector(`.btn-qrcode`);
	btnQrCode.onclick = function(){
		qrCodeFrame.show();
	};
	qrCodeFrame.initialize = function(){
		const saveBox = this.content.saveBox;
		const readBox = this.content.readBox;
		readBox.info.textContent  = "";

		readBox.videoBox.classList.add(className_displayNone);
		
		let qrTypeRadio = saveBox.qrDataType.find(radio=>radio.checked);
		if (qrTypeRadio) qrTypeRadio.onclick(); //打开二维码窗口就先产生二维码
	};
	qrCodeFrame.hide = function(){qrcodeReader.reset();};

	const qrContent = qrCodeFrame.content = qrCodeFrame.querySelector(".mask-content");
	const qrReadBox = qrContent.readBox = qrContent.querySelector(".read-qr-box");
	const qrSaveBox = qrContent.saveBox = qrContent.querySelector(".save-qr-box");
	qrReadBox.readString = qrReadBox.querySelector(".read-string");
	qrReadBox.readQrCamera = qrReadBox.querySelector(".read-qr-camera");
	qrReadBox.readQrFile = qrReadBox.querySelector(".read-qr-file");
	qrReadBox.filePicker = qrReadBox.querySelector(".file-select");
	qrReadBox.info = qrReadBox.querySelector(".info");
	qrReadBox.video = qrReadBox.querySelector("#video");
	qrReadBox.videoBox = qrReadBox.querySelector(".video-box");
	qrReadBox.sourceSelect = qrReadBox.querySelector("#sourceSelect");
	qrReadBox.qrStr = qrReadBox.querySelector(".string-input");
	qrReadBox.readString.onclick = function()
	{
		let inputResult = inputFromQrString(qrReadBox.qrStr.value);
		if (inputResult.code < 100)
		{
			qrReadBox.info.textContent = 'Code ' + inputResult.code + ':' + inputResult.message;
			const newLink = document.createElement("a");
			newLink.className = "formation-from-string";
			newLink.href = inputResult.url;
			newLink.target = "_blank";
			qrReadBox.info.appendChild(newLink);
		}else
		{
			qrReadBox.info.textContent = 'Code ' + inputResult.code + ':' + inputResult.message;
		}
	}

	qrSaveBox.qrImage = qrSaveBox.querySelector(".qr-code-image");
	qrSaveBox.qrStr = qrSaveBox.querySelector(".string-output");
	qrSaveBox.qrStr.onchange = function()
	{
		qrCodeFrame.refreshQrCode(this.value);
	}
	qrSaveBox.qrDataType = Array.from(qrSaveBox.querySelectorAll(".qr-data-type-radio"));
	qrSaveBox.qrDataType.forEach(radio=>radio.onclick = function(){
		let qrstr = formation.getQrStr(this.value);
		qrSaveBox.qrStr.value = qrstr;
		qrSaveBox.qrStr.onchange();
	});
	qrSaveBox.saveQrImg = qrSaveBox.querySelector(".save-qr-img");

	qrCodeFrame.ondragenter = ()=>false;
	qrCodeFrame.ondragover =  ()=>false;
	qrCodeFrame.ondrop = function(e)
	{
		imagesSelected(e.dataTransfer.files); 
		e.stopPropagation();  
		e.preventDefault();   
	}

	qrCodeFrame.refreshQrCode = function(string)
	{
		const qrImg = this.content.saveBox.qrImage;
		URL.revokeObjectURL(qrImg.src);

		const EncodeHintType = ZXing.EncodeHintType;
		const hints = new Map();
		hints.set(EncodeHintType.MARGIN, 0);
		//hints.set(EncodeHintType.CHARACTER_SET, "UTF8");
		const qrWidth = 500,qrHeight = 500;
		let svgElement = qrcodeWriter.write(string, qrWidth, qrHeight, hints);
		let svgData = new XMLSerializer().serializeToString(svgElement);
		let blob = new Blob([svgData], {type : 'image/svg+xml'});
		let svgUrl = URL.createObjectURL(blob);
		qrImg.src = svgUrl;


		loadImage(svgUrl).then(function(img) {
			let cavansWidth = qrWidth * 2, cavansHeight = qrHeight * 2;
			let cavans = document.createElement("canvas");
			cavans.width = cavansWidth;
			cavans.height = cavansHeight;
			let ctx = cavans.getContext('2d');

			ctx.fillStyle="white";
			ctx.fillRect(0, 0, cavansWidth, cavansHeight)
			ctx.drawImage(img, 0, 0, cavansWidth, cavansHeight);

			cavans.toBlob(function(blob) {
				const saveQrImg = qrSaveBox.saveQrImg;
				URL.revokeObjectURL(saveQrImg.href);
				const downLink = URL.createObjectURL(blob);
				saveQrImg.download = formation.title || "PAD Dash Formation QR";
				saveQrImg.href = downLink;
			});

			svgElement = null;
			svgData = null;
			blob = null;
			img = null;
			cavans = null;
			ctx = null;
		}, function(err) {
			console.log(err);
		});

	}
	qrReadBox.readQrFile.onclick = function()
	{
		qrReadBox.filePicker.click();
	}
	qrReadBox.filePicker.onchange = function()
	{
		imagesSelected(this.files);
	}
	function imagesSelected(myFiles) {
		if (myFiles.length < 1) return;
		const file = myFiles[0];
		loadImage(URL.createObjectURL(file)).then(function(img) {
			qrcodeReader.decodeFromImage(img).then((result) => {
				console.debug('Found QR code!', result);
				qrReadBox.qrStr.value = result.text;
				qrReadBox.readString.onclick();
			}).catch((err) => {
				console.error(err);
				if (err) {
					if (err instanceof ZXing.NotFoundException) {
						qrReadBox.info.textContent = 'No QR code found.';
						// console.debug('Try crop PDC original QR');
						// let cropLeft = 0, cropTop = 0, cropWidth = 300, cropHeight = 300, //裁剪尺寸
						// 	scale = 3, //放大倍率
						// 	extraLeft = 100, extraTop = 100, extraRight = 100, extraBottom = 100; //额外增加的宽度
						// let cavans = document.createElement("canvas");
						// cavans.width = cropWidth * scale + extraLeft + extraRight;
						// cavans.height = cropHeight * scale + extraTop + extraBottom;
						// let ctx = cavans.getContext('2d');
						// ctx.fillStyle="white";
						// ctx.fillRect(0, 0, cavans.width, cavans.height);

						// ctx.drawImage(img, cropLeft, cropTop, cropWidth, cropHeight, extraLeft, extraTop, cropWidth * scale, cropHeight * scale);
						// //qrReadBox.appendChild(cavans);

						// qrcodeReader.decodeFromImageUrl(cavans.toDataURL()).then((result2) => {
						// 	console.debug('Found QR code!', result2);
						// 	qrReadBox.qrStr.value = result2.text;
						// 	qrReadBox.readString.onclick();
						// }).catch((err2) => {
						// 	console.error(err2);
						// 	if (err2) {
						// 		if (err2 instanceof ZXing.NotFoundException) {
						// 			qrReadBox.info.textContent = 'No QR code found.';
						// 		}
					
						// 		if (err2 instanceof ZXing.ChecksumException) {
						// 			qrReadBox.info.textContent = 'A code was found, but it\'s read value was not valid.';
						// 		}
					
						// 		if (err2 instanceof ZXing.FormatException) {
						// 			qrReadBox.info.textContent = 'A code was found, but it was in a invalid format.';
						// 		}
						// 	}
						// });
					}
		
					if (err instanceof ZXing.ChecksumException) {
						qrReadBox.info.textContent = 'A code was found, but it\'s read value was not valid.';
					}
		
					if (err instanceof ZXing.FormatException) {
						qrReadBox.info.textContent = 'A code was found, but it was in a invalid format.';
					}
				}
			});
			console.debug(`Started decode for image from ${img.src}`)
		}, function(err) {
			console.debug(err);
		});
	}

	if (location.protocol == "http:" && location.host != "localhost" && location.host != "127.0.0.1")
	{ //http不支持攝像頭
		//qrReadBox.readQrCamera.classList.add(className_displayNone);
		qrReadBox.readQrCamera.onclick = function()
		{
			if(confirm("需要 https 环境下才支持调用摄像头，是否跳转？\nCalling the camera is required in an https environment, do you want to jump?"))
				location.protocol = "https:" //跳到https
		}
	}else
	{
		function scanContinuously()
		{
			qrcodeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
				if (result) {
					// properly decoded qr code
					console.debug('Found QR code!', result);
					qrReadBox.qrStr.value = result.text;
					qrReadBox.readString.onclick();
				}
		
				if (err) {
					if (err instanceof ZXing.NotFoundException) {
					console.debug('No QR code found.')
					}
		
					if (err instanceof ZXing.ChecksumException) {
					console.debug('A code was found, but it\'s read value was not valid.')
					}
		
					if (err instanceof ZXing.FormatException) {
					console.debug('A code was found, but it was in a invalid format.')
					}
				}
			});
		}

		qrcodeReader.getVideoInputDevices()
		.then((videoInputDevices) => {
			const sourceSelect_id = "selected-device-id";
			selectedDeviceId = localStorage.getItem(cfgPrefix + sourceSelect_id);
			if (videoInputDevices.every(device=>device.deviceId != selectedDeviceId))
			{
				selectedDeviceId = videoInputDevices[0].deviceId;
			}
			if (videoInputDevices.length >= 1) {
				videoInputDevices.forEach((element) => {
					const sourceOption = document.createElement('option');
					sourceOption.text = element.label
					sourceOption.value = element.deviceId
					qrReadBox.sourceSelect.appendChild(sourceOption)
				});
				qrReadBox.sourceSelect.selectedIndex = videoInputDevices.findIndex(device=>device.deviceId == selectedDeviceId);
	
				qrReadBox.sourceSelect.onchange = function() {
					selectedDeviceId = this.value;
					localStorage.setItem(cfgPrefix + sourceSelect_id, this.value);
					if (qrReadBox.readQrCamera.classList.contains("running"))
					{
						qrcodeReader.reset();
						scanContinuously();
					}
				};
			}
			qrReadBox.readQrCamera.onclick = function()
			{
				if (this.classList.contains("running"))
				{
					qrcodeReader.reset();
					qrReadBox.videoBox.classList.add(className_displayNone);
					qrReadBox.info.textContent  = "";
	
				}else
				{
					qrReadBox.videoBox.classList.remove(className_displayNone);
					scanContinuously();
				}
				this.classList.toggle("running");
			}
		})
		.catch((err) => {
			console.error(err)
		});
	}
	
	const playerDataFrame = document.body.querySelector("#player-data-frame");
	const btnPlayerData = controlBox.querySelector(`.btn-player-data`);
	btnPlayerData.onclick = function(){
		playerDataFrame.show();
	};
	playerDataFrame.uploadData = playerDataFrame.querySelector(".upload-data");
	playerDataFrame.filePicker = playerDataFrame.querySelector(".file-select");
	playerDataFrame.playerList = playerDataFrame.querySelector(".player-datas-list");
	playerDataFrame.uploadData.onclick = function(){ playerDataFrame.filePicker.click(); };
	playerDataFrame.filePicker.onchange = function(){ uploadPlayerData(this.files); };
	
	playerDataFrame.initialize = function(){
		this.playerList.innerHTML = '';
		for (const playerData of PlayerDatas)
		{
			this.playerList.add(playerData);
		}
	};
	function deletPlayerData(e)
	{
		const table = this.parentNode.parentNode.parentNode.parentNode;
		table.parentNode.remove();
		if (currentPlayerData == table.data) currentPlayerData = null;
		PlayerDatas.splice(PlayerDatas.indexOf(table.data), 1);
		const name = table.getAttribute("data-player-name");
		dbDelete(db, "palyer_datas", name);
	}
	function setPlayerDataDefault(e)
	{
		const table = this.parentNode.parentNode.parentNode.parentNode;
		const cfgName = cfgPrefix + "default-player-name";
		const dataPlayerName = table.getAttribute("data-player-name");
		const checkInput = table.parentNode.querySelector("[name=default-player-data]");
		if (localStorage.getItem(cfgName) === dataPlayerName || e === true) {
			currentPlayerData = null;
			localStorage.removeItem(cfgName);
			checkInput.checked = false;
		} else {
			currentPlayerData = table.data;
			localStorage.setItem(cfgName, dataPlayerName);
			checkInput.checked = true;
		}
	}
	function openShowBox(e)
	{
		const table = this.parentNode.parentNode.parentNode.parentNode;
		table.querySelector(".set-default").onclick(); //打开箱子前先绑定这个数据
		showSearch(table.data.parsedCards.map(m=>m.toOldMember()));
		playerDataFrame.btnClose.onclick(true);
	}
	playerDataFrame.playerList.add = function(data) {
		this.appendChild(this.newPlayerData(data));
	}
	playerDataFrame.playerList.newPlayerData = function(data) {
		const t = playerDataFrame.querySelector('#template-player-datas');
		const clone = document.importNode(t.content, true);
		const table = clone.querySelector("table");
		table.data = data;
		if (currentPlayerData == table.data) table.parentNode.querySelector("[name=default-player-data]").checked = true;
		table.setAttribute("data-player-name", data.name);

		const tbody = table.tBodies[0];

		tbody.querySelector(".set-default").onclick = setPlayerDataDefault;
		tbody.querySelector(".delete").onclick = deletPlayerData;
		tbody.querySelector(".open-show-box").onclick = openShowBox;

		changeid({id: data.vs_icon}, tbody.querySelector(".avatar .monster"));

		
		tbody.querySelector(".avatar .monster").onclick = function (){
		}

		let name = tbody.querySelector(".name");
		name.textContent = data.name;
		name.setAttribute("data-camp", data.camp);

		let lvexp = tbody.querySelector(".lvexp");
		lvexp.querySelector(".progress-bar .bar").style.width = `${(data.exp - data.curLvExp) / (data.nextLvExp - data.curLvExp) * 100}%`;
		lvexp.querySelector(".level").textContent = data.lv;

		let stama = tbody.querySelector(".stama");
		//第一管体力
		stama.querySelector(".progress-bar .bar").style.width = `${Math.min(data.sta / data.sta_max, 1) * 100}%`;
		//第二管体力
		stama.querySelector(".progress-bar .bar2").style.width = `${Math.max(data.sta - data.sta_max, 0) / data.sta_max * 100}%`;
		let sta_cur = stama.querySelector(".sta_number .sta_cur");
		sta_cur.textContent = data.sta;
		if (data.sta > data.sta_max) sta_cur.classList.add("stama-beyond");
		stama.querySelector(".sta_number .sta_max").textContent = data.sta_max;

		tbody.querySelector(".gold").textContent = data.gold.bigNumberToString();
		tbody.querySelector(".coin").textContent = data.coin.bigNumberToString();

		const deckList = tbody.querySelector(".decks .deck");
		const teamLink = tbody.querySelector(".decks .team-link");
		const radioList = tbody.querySelector(".decks .deck-radio-list");
		data.parsedDecks.forEach((deck,idx)=>{
			const li = radioList.appendChild(document.createElement("li"));
			const ipt = li.appendChild(document.createElement("input"));
			ipt.className = "deck-choose";
			ipt.type = "radio";
			ipt.name = `decks-${data.name}`;
			ipt.value = idx;
			ipt.onclick = changeDeck;
			ipt.deck = deck;
		});
		radioList.querySelectorAll(".deck-choose")[data.curDeck < 100 ? (data.curDeck || 0) : (data.curDeck - 100 + data.decksb.decks.length)]?.click();

		function changeDeck(e)
		{
			const deck = this.deck;
			const lis = Array.from(deckList.querySelectorAll(":scope>li"));
			lis.forEach((li,idx)=>{
				changeid(deck.members[idx] ?? {id: 0}, li.querySelector(".monster:not(.assist)"));
				changeid(deck.members[idx]?.assist ?? {id: 0}, li.querySelector(".monster.assist"));
			});
			const newFotmation = deck.toFormation();
			teamLink.href = ObjToUrl(newFotmation.getPdfQrObj(true));
		}
		return clone;
	}

	async function uploadPlayerData(myFiles) {
		if (myFiles.length < 1) return;
		
		for (const myFile of myFiles) {
			try {
				const reader = await fileReader(myFile, {readType: "text"});
				const data = JSON.parse(reader.result);
				const playerData = new PlayerData(data);

				let dataCount = 0;
				if (db) {
					dataCount = await dbCount(db, "palyer_datas", data.name);
					await dbWrite(db, "palyer_datas", data);
				}
				let oldIdx = PlayerDatas.findIndex(dt=>dt.name == data.name);
				if (dataCount && oldIdx >= 0) { //如果已经存在，就更新旧的数据
					PlayerDatas.splice(oldIdx, 1, playerData);
					const liArr = playerDataFrame.playerList.querySelectorAll(":scope>li");
					liArr[oldIdx] && liArr[oldIdx].remove();
					playerDataFrame.playerList.insertBefore(playerDataFrame.playerList.newPlayerData(playerData), liArr[oldIdx+1]);
				} else {
					PlayerDatas.push(playerData);
					playerDataFrame.playerList.add(playerData);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	let docSelection = document.getSelection();
	//标题和介绍文本框
	const titleBox = formationBox.querySelector(".title-box");
	const detailBox = formationBox.querySelector(".detail-box");
	const txtTitle = titleBox.querySelector(".title-code");
	const txtDetail = detailBox.querySelector(".detail-code");
	const txtTitleDisplay = titleBox.querySelector(".title-display");
	const txtDetailDisplay = detailBox.querySelector(".detail-display");

	const richTextTools = document.getElementById("rich-text-tools");
	const siwtchCodeMode = document.getElementById("siwtch-code-mode");
	const setFontColor = document.getElementById("set-font-color");
	const colorChooser = document.getElementById("color-chooser");
	const insertCardAvatar = document.getElementById("insert-card-avatar");
	const insertAwokenIcon = document.getElementById("insert-awoken-icon");
	const insertLatentIcon = document.getElementById("insert-latent-icon");
	const insertTypeIcon = document.getElementById("insert-type-icon");
	const insertOrbIcon = document.getElementById("insert-orb-icon");

	const insertAwokenIconList = insertAwokenIcon.list = document.createElement("ul");
	insertAwokenIconList.className = "awoken-ul " + className_displayNone;
	const insertLatentIconList = insertLatentIcon.list = document.createElement("ul");
	insertLatentIconList.className = "m-latent-allowable-ul " + className_displayNone;
	const insertTypeIconList = insertTypeIcon.list = document.createElement("ul");
	insertTypeIconList.className = "types-ul " + className_displayNone;
	const insertOrbList = insertOrbIcon.list = document.createElement("ul");
	insertOrbList.className = "orb-ul " + className_displayNone;

	for (let id of official_awoken_sorting) {
		const li = document.createElement("li");
		const icon = li.appendChild(createIndexedIcon('awoken', id));
		icon.onclick = insertIconToText;
		insertAwokenIconList.appendChild(li);
	}
	for (let id of new Set(pdcLatentMap.map(obj=>obj.pdf))) {
		const li = document.createElement("li");
		const icon = li.appendChild(createIndexedIcon('latent', id));
		icon.onclick = insertIconToText;
		insertLatentIconList.appendChild(li);
	}
	for (let obj of typekiller_for_type) {
		const li = document.createElement("li");
		const icon = li.appendChild(createIndexedIcon('type', obj.type));
		icon.onclick = insertIconToText;
		insertTypeIconList.appendChild(li);
	}
	for (let i=0;i<10;i++) {
		const li = document.createElement("li");
		const icon = li.appendChild(createIndexedIcon('orb', i));
		icon.onclick = insertIconToText;
		insertOrbList.appendChild(li);
	}
	richTextTools.append(
		insertTypeIconList,
		insertAwokenIconList,
		insertLatentIconList,
		insertOrbList
	);

	//切换代码模式
	siwtchCodeMode.onclick = function(){
		if (this.checked) txtDetail.style.height = txtDetailDisplay.scrollHeight + "px";
		formationBox.classList.toggle("edit-code", this.checked);
	}
	siwtchCodeMode.checked = false;
	//设置文字颜色
	function setSelectionFontColor(color) {
		//如果并没有任何选择区，则返回
		if (docSelection.rangeCount < 1) return;
		const range = docSelection.getRangeAt(0);
		//如果并没有选中文字，则返回
		if (range.startOffset === range.endOffset) return;
		let target;
		if (target = (txtTitleDisplay.contains(range.commonAncestorContainer) && txtTitleDisplay)
			|| (txtDetailDisplay.contains(range.commonAncestorContainer) && txtDetailDisplay))
		{
			const docObj = range.extractContents(); //移动了Range 中的内容从文档树到DocumentFragment（文档片段对象)。
			let dom
			if (color === "#000000") {
				dom = document.createTextNode(docObj);
			} else {
				dom = document.createElement('span');
				dom.style.color = color;
				dom.append(docObj.textContent);
			}
			range.insertNode(dom);
			target.onblur();
		} else if (color !== "#000000" &&
			(target = (txtTitle.contains(range.commonAncestorContainer) && txtTitle)
			|| (txtDetail.contains(range.commonAncestorContainer) && txtDetail)))
		{
			let str = target.value.substring(target.selectionStart, target.selectionEnd)
			.replace(/\^(\w+?)\^([^\^]+?)\^p/igm, "$2");
			let colorStr = `^${color.substring(1)}^${str}^p`;
			target.setRangeText(colorStr);
			target.onchange();
		}
	}
	setFontColor.onclick = function(){
		setSelectionFontColor(colorChooser.value);
	}
	colorChooser.onchange = function(){
		setFontColor.style.color = this.value;
	}
	setFontColor.style.color = colorChooser.value;
	//添加头像图标
	insertCardAvatar.onclick = function(){
		if (docSelection.rangeCount < 1) return;
		const range = docSelection.getRangeAt(0);
		//优先获取选中部分的数字
		let id = parseInt(range.toString().trim(), 10);
		if (!Number.isInteger(id)) {
			id = prompt(localTranslating.request_input({info: localTranslating.sort_name.sort_id}).textContent);
			id = parseInt(id,10);
		}
		if (Number.isInteger(id)) {
			let target;
			if (target = (txtTitleDisplay.contains(range.commonAncestorContainer) && txtTitleDisplay)
				|| (txtDetailDisplay.contains(range.commonAncestorContainer) && txtDetailDisplay))
			{
				let dom = createIndexedIcon('card', id);
				range.deleteContents();
				range.insertNode(dom);
				target.onblur();
			} else if (target = (txtTitle.contains(range.commonAncestorContainer) && txtTitle)
				|| (txtDetail.contains(range.commonAncestorContainer) && txtDetail))
			{
					let str = `%{m${id}}`;
				target.setRangeText(str);
				target.onchange();
			}
		}
	}
	//添加其他序号图标
	function insertIconToText() {
		if (docSelection.rangeCount < 1) return;
		let type, stype, id;
		if(this.classList.contains("awoken-icon")) { //觉醒
			type = 'awoken';
			stype = 'a';
			id = this.getAttribute("data-awoken-icon");
		}
		else if(this.classList.contains("type-icon")) { //类型
			type = 'type';
			stype = 't';
			id = this.getAttribute("data-type-icon");
		}
		else if(this.classList.contains("orb")) { //宝珠
			type = 'orb';
			stype = 'o';
			id = this.getAttribute("data-orb-icon");
		}
		else if(this.classList.contains("latent-icon")) { //潜觉
			type = 'latent';
			stype = 'l';
			id = this.getAttribute("data-latent-icon");
		}
		const range = docSelection.getRangeAt(0);
		let target;
		console.log(range);
		if (target = (txtTitleDisplay.contains(range.commonAncestorContainer) && txtTitleDisplay)
			|| (txtDetailDisplay.contains(range.commonAncestorContainer) && txtDetailDisplay))
		{
			let dom = createIndexedIcon(type, id);
			range.insertNode(dom);
			console.log(target);
			target.onblur();
		} else if (target = (txtTitle.contains(range.commonAncestorContainer) && txtTitle)
			|| (txtDetail.contains(range.commonAncestorContainer) && txtDetail))
		{
				let str = `%{${stype}${id}}`;
			target.setRangeText(str);
			target.onchange();
		}
	}
	function showInsertIconList() {
		//如果自身的列表已经打开了，则隐藏
		if (!this.list.classList.contains(className_displayNone)) {
			this.list.classList.add(className_displayNone);
			return;
		}
		//否则隐藏其他的列表
		[
			insertAwokenIcon.list,
			insertLatentIcon.list,
			insertTypeIcon.list,
			insertOrbIcon.list,
		].forEach(ul=>ul.classList.toggle(className_displayNone, ul != this.list));
	}
	insertAwokenIcon.onclick = showInsertIconList;
	insertLatentIcon.onclick = showInsertIconList;
	insertTypeIcon.onclick = showInsertIconList;
	insertOrbIcon.onclick = showInsertIconList;

	function richTextToCode(parentElement){
		let code = [];
		for (let node of parentElement.childNodes) {
			if (node.nodeName == "#text"){
				code.push(node.nodeValue);
				continue;
			}
			let type, id;
			if(node.classList.contains("detail-mon")) { //卡片头像
				const mon = node.querySelector(".monster");
				if (!mon) continue;
				type = 'm';
				id = mon.getAttribute("data-cardid");
			}
			else if(node.classList.contains("awoken-icon")) { //觉醒
				type = 'a';
				id = node.getAttribute("data-awoken-icon");
			}
			else if(node.classList.contains("type-icon")) { //类型
				type = 't';
				id = node.getAttribute("data-type-icon");
			}
			else if(node.classList.contains("orb")) { //宝珠
				type = 'o';
				id = node.getAttribute("data-orb-icon");
			}
			else if(node.classList.contains("latent-icon")) { //潜觉
				type = 'l';
				id = node.getAttribute("data-latent-icon");
			}
			code.push(`%{${type}${id}}`);
		}
		return code.join('');
	}
	txtTitleDisplay.onblur = function(){
		formation.title = txtTitle.value = richTextToCode(this);
		formationBox.refreshDocumentTitle();
		creatNewUrl();
	}
	txtDetailDisplay.onblur = function(){
		formation.detail = txtDetail.value = richTextToCode(this);
		creatNewUrl();
	}
	txtTitle.onchange = function() {
		formation.title = this.value;
		txtTitleDisplay.innerHTML = '';
		txtTitleDisplay.append(descriptionToHTML(this.value));
		formationBox.refreshDocumentTitle();
		creatNewUrl();
	};
	txtDetail.onchange = function() {
		formation.detail = this.value;
		txtDetailDisplay.innerHTML = '';
		txtDetailDisplay.append(descriptionToHTML(this.value));
		creatNewUrl();
	};

	// txtTitle.onchange = function() {
	// 	formation.title = this.value;
	// 	//txtTitleDisplay.innerHTML = descriptionToHTML(this.value);
	// 	txtTitleDisplay.innerHTML = '';
	// 	txtTitleDisplay.appendChild(descriptionToHTML(this.value));
	// 	let titleStr = txtTitleDisplay.textContent.trim();
	// 	document.title = titleStr.length > 0 ? `${titleStr.trim()} - ${localTranslating.webpage_title}` : localTranslating.webpage_title;
	// 	creatNewUrl();
	// };
	// txtTitle.onblur = function() {
	// 	if (this.value.length > 0)
	// 		titleBox.classList.remove("edit");
	// };
	// txtDetail.onchange = function() {
	// 	formation.detail = this.value;
	// 	//txtDetailDisplay.innerHTML = descriptionToHTML(this.value);
	// 	txtDetailDisplay.innerHTML = '';
	// 	txtDetailDisplay.appendChild(descriptionToHTML(this.value));
	// 	creatNewUrl();
	// };
	// txtDetail.onblur = function() {
	// 	if (this.value.length > 0)
	// 		detailBox.classList.remove("edit");
	// 	this.style.height = txtDetailDisplay.scrollHeight + "px";
	// };
	// txtTitleDisplay.onclick = function() {
	// 	titleBox.classList.add("edit");
	// 	txtTitle.focus();
	// };
	// txtDetailDisplay.onclick = function() {
	// 	detailBox.classList.add("edit");
	// 	txtDetail.focus();
	// };

	//这个写法的目的其实是为了确保添加顺序与1、2、3一致，即便打乱了顺序，也能正确添加
	for (let ti = 0, ti_len = formationBox.querySelectorAll(".team-bigbox").length; ti < ti_len; ti++) {
		teamBigBoxs.push(formationBox.querySelector(`.teams .team-${ti+1}`));
	}

	//将所有怪物头像添加到全局数组
	teamBigBoxs.forEach(teamBigBox => {
		const teamBox = teamBigBox.querySelector(".team-box");
		const members = Array.from(teamBox.querySelectorAll(".team-members .monster"));
		const assist = Array.from(teamBox.querySelectorAll(".team-assist .monster"));
		members.forEach(m => {
			allMembers.push(m);
		});
		assist.forEach(m => {
			allMembers.push(m);
		});
	});
	
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
		editBox.editMon(arr[0], arr[1], arr[2]);
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
	function dropMonHead(event) {
		const dataFrom = JSON.parse(event.dataTransfer.getData('from'));
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
		const [fromTeamNum, fromIsAssist, fromIndexInTeam] = formArr;
		const [toTeamNum, toIsAssist, toIndexInTeam] = toArr;

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
		let from = formation.teams[fromTeamNum][fromIsAssist][fromIndexInTeam];
		let to = formation.teams[toTeamNum][toIsAssist][toIndexInTeam];
		let fromCard = from.card, toCard = to.card;
		if (toIsAssist && !fromCard?.canAssist && from.id > 0 ||
			fromIsAssist && !toCard?.canAssist && to.id > 0) {
			[formArr, toArr].filter(([teamNum, isAssist, indexInTeam])=>{
				const member = formation.teams[teamNum][isAssist][indexInTeam];
				const card = member.card;
				if (member.id>0 && !card?.canAssist) {
					const teamBigBox = teamBigBoxs[teamNum];
					const teamBox = teamBigBox.querySelector(".team-box");
					const memberBox = teamBox.querySelector(isAssist ? ".team-assist" : ".team-members");
					const memberLi = memberBox.querySelector(`.member-${indexInTeam+1}`);
					const monsterHead = memberLi.querySelector(".monster");
					monsterHead.classList.add("show-disabled-action");
					monsterHead.onanimationend = function() {
						this.classList.remove("show-disabled-action");
						this.onanimationend = null;
					}
					console.warn("该角色不能作为辅助 %o", card);
				} else {
					return false;
				}
			})

			return;
		}
		if (fromIsAssist != toIsAssist) //从武器拖到非武器才改变类型
		{
			from = changeType(from, fromIsAssist);
			if (!isCopy) to = changeType(to, toIsAssist);
		} else if (isCopy) {
			const newFrom = new from.constructor();
			newFrom.loadFromMember(from);
			from = newFrom;
		}
		formation.teams[toTeamNum][toIsAssist][toIndexInTeam] = from;
		if (!isCopy) formation.teams[fromTeamNum][fromIsAssist][fromIndexInTeam] = to;
	
		creatNewUrl(); //刷新URL
		refreshAll(formation); //刷新全部
	}
	function switchLeader(e)
	{
		const headDom = this.parentNode;
		const arr = getMemberArrayIndexFromMonHead(headDom);
		const team = formation.teams[arr[0]];
		const member = team[arr[1]][arr[2]];
		const card = Cards[member.id] || Cards[0];
		const skills = getCardActiveSkills(card, [93, 227]); //更换队长的技能
		if (skills.length < 1) return;
		const skill = skills[0];

		if (team[3] > 0) //如果队伍已经换了队长
		{
			if (skill.type == 227 //固定与右侧换队长
				|| team[3] == arr[2]) //点的就是换的队长
			{
				team[3] = 0; //还原
			}else
			{
				team[3] = arr[2]; //改变成任何能点的换队长
			}
		}else //如果队伍没有换队长
		{
			if (skill.type == 227) //固定与右侧换队长
			{
				let myTeam = team.slice(0,5);
				team[3] = myTeam.length - 1 - team.slice(0,5).reverse().findIndex(m=>m.id>0);
			}
			else if(arr[2] > 0) //如果点的不是原队长
			{
				team[3] = arr[2]; //接换成新队长
			}
		}
		creatNewUrl(); //刷新URL
		refreshAll(formation); //刷新全部

		e.stopPropagation();
		e.preventDefault();
	}
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
		//子元素
		m.querySelector(".switch-leader").onclick = switchLeader;
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

	//显示HP的详细值
	const hpDetailDialog = formationBox.querySelector(".dialog-hp-detail");
	hpDetailDialog.initialing = function(reduceAttrRanges, tHP, tHPNoAwoken)
	{
		const dialogContent = this.querySelector(".dialog-content");
		const fragment = document.createDocumentFragment();
		
		function insertHpRangeTable(reduceRanges, tHP, tHPNoAwoken, attr)
		{
			const table = document.createElement("table");
			table.className = "hp-range-table";
			table.setAttribute("data-attr", attr);
			table.createCaption();
			const tHead = table.createTHead();
			const tBody = table.createTBody();
			const rangeRow = tHead.insertRow();
			rangeRow.className = "hp-range";
			rangeRow.appendChild(document.createElement("th"));
			const rageHpRow = tBody.insertRow();
			rageHpRow.className = "general";
			rageHpRow.appendChild(document.createElement("th"));
			const rageHpNoAwokenRow = tBody.insertRow();
			rageHpNoAwokenRow.className = "awoken-bind";
			rageHpNoAwokenRow.appendChild(document.createElement("th"));
			const reduceRow = tBody.insertRow();
			reduceRow.className = "reduce-scale";
			reduceRow.appendChild(document.createElement("th"));
			const reduceHpRow = tBody.insertRow();
			reduceHpRow.className = "reduce-general";
			reduceHpRow.appendChild(document.createElement("th"));
			const reduceHpNoAwokenRow = tBody.insertRow();
			reduceHpNoAwokenRow.className = "reduce-awoken-bind";
			reduceHpNoAwokenRow.appendChild(document.createElement("th"));
			reduceRanges.forEach(range=>{
				const hpRange = rangeRow.insertCell();
				const hpRangeMin = hpRange.appendChild(document.createElement("span"));
				hpRangeMin.className = "hp-range-min";
				hpRangeMin.textContent = range.min;
				hpRange.append(" ~ ");
				const hpRangeMax = hpRange.appendChild(document.createElement("span"));
				hpRangeMax.className = "hp-range-max";
				hpRangeMax.textContent = range.max;

				const hpGeneral = rageHpRow.insertCell();
				hpGeneral.textContent = `${Math.round(tHP * (range.min / 100))} ~ ${Math.round(tHP * (range.max/100))}`;

				const hpAwokenBind = rageHpNoAwokenRow.insertCell();
				hpAwokenBind.textContent = `${Math.round(tHPNoAwoken * (range.min / 100))} ~ ${Math.round(tHPNoAwoken * (range.max/100))}`;

				const reduce = reduceRow.insertCell();
				const reduceScale = reduce.appendChild(document.createElement("span"));
				reduceScale.textContent = `${parseFloat((range.scale * 100).toFixed(2))}`;

				if (range.probability < 1)
				{
					reduce.append("(");
					const reduceProb = reduce.appendChild(document.createElement("span"));
					reduceProb.className = "reduce-probability";
					reduceProb.textContent = `${(range.probability * 100).toFixed(0)}`;
					reduce.append(")");
				}

				const reduceGeneral = reduceHpRow.insertCell();
				reduceGeneral.textContent = `${Math.round(tHP * (range.min / 100) / (1 - range.scale))} ~ ${Math.round(tHP * (range.max/100) / (1 - range.scale))}`;
				
				const reduceAwokenBind = reduceHpNoAwokenRow.insertCell();
				reduceAwokenBind.textContent = `${Math.round(tHPNoAwoken * (range.min / 100) / (1 - range.scale))} ~ ${Math.round(tHPNoAwoken * (range.max/100) / (1 - range.scale))}`;
			});
			return table;
		}
		if (reduceAttrRanges.some(r=>r != reduceAttrRanges[0])) //有指定属性减伤
		{
			reduceAttrRanges.forEach((reduceRanges, ridx)=>fragment.appendChild(insertHpRangeTable(reduceRanges, tHP, tHPNoAwoken, ridx)));
		}
		else //只有阶梯盾
		{
			const reduceRanges = reduceAttrRanges[0];
			fragment.appendChild(insertHpRangeTable(reduceRanges, tHP, tHPNoAwoken, 31));
		}
		
		dialogContent.innerHTML = "";
		dialogContent.appendChild(fragment);
	}
	//初始化Dialog
	dialogInitialing(hpDetailDialog);

	const reduceDetailsBars = Array.from(formationBox.querySelectorAll(".tIf-total-hp .reduce-details"));
	reduceDetailsBars.forEach(bar => {
		bar.onclick = function(){
			hpDetailDialog.show(this.reduceAttrRanges, this.tHP, this.tHPNoAwoken);
		};
	});
	
	//设置地下城倍率
	const dungeonEnchanceDialog = document.body.querySelector(".dialog-dungeon-enchance");
	dungeonEnchanceDialog.initialing = function(formation)
	{
		const dialogContent = this.querySelector(".dialog-content");
		const rareDoms = Array.from(dialogContent.querySelectorAll(".rare-list .rare-check"));
		const attrDoms = Array.from(dialogContent.querySelectorAll(".attr-list .attr-check"));
		const typeDoms = Array.from(dialogContent.querySelectorAll(".type-list .type-check"));
		const collabIdIpt = dialogContent.querySelector("#dungeon-collab-id");

		const dge = formation.dungeonEnchance;
		function runCheck(checkBox){
			checkBox.checked = this.includes(parseInt(checkBox.value));
		}
		rareDoms.forEach(runCheck,dge.rarities);
		attrDoms.forEach(runCheck,dge.attrs);
		typeDoms.forEach(runCheck,dge.types);
		collabIdIpt.value = dge.collabs.join();

		const {hp, atk, rcv} = dge.rate;
		dialogContent.querySelector("#dungeon-hp").value = hp;
		dialogContent.querySelector("#dungeon-atk").value = atk;
		dialogContent.querySelector("#dungeon-rcv").value = rcv;

		this.classList.remove(className_displayNone);
	}
	//初始化Dialog
	dialogInitialing(dungeonEnchanceDialog);
	const dungeonEnchanceDialogConfirm = dungeonEnchanceDialog.querySelector(".dialog-confirm");
	dungeonEnchanceDialogConfirm.onclick = function(){
		const dialogContent = dungeonEnchanceDialog.querySelector(".dialog-content");
		const rareDoms = Array.from(dialogContent.querySelectorAll(".rare-list .rare-check"));
		const attrDoms = Array.from(dialogContent.querySelectorAll(".attr-list .attr-check"));
		const typeDoms = Array.from(dialogContent.querySelectorAll(".type-list .type-check"));
		const rarities = returnCheckBoxsValues(rareDoms).map(Str2Int);
		const attrs = returnCheckBoxsValues(attrDoms).map(Str2Int);
		const types = returnCheckBoxsValues(typeDoms).map(Str2Int);
		const collabIdIpt = dialogContent.querySelector("#dungeon-collab-id");
		
		const dge = formation.dungeonEnchance;
		dge.rarities = rarities;
		dge.attrs = attrs;
		dge.types = types;
		dge.rate.hp = Number(dialogContent.querySelector("#dungeon-hp").value);
		dge.rate.atk = Number(dialogContent.querySelector("#dungeon-atk").value);
		dge.rate.rcv = Number(dialogContent.querySelector("#dungeon-rcv").value);
		dge.collabs = collabIdIpt.value.split(',').map(str=>Number(str)).filter(Boolean);
		dungeonEnchanceDialog.close();
		creatNewUrl();
		refreshAll(formation);
	};
	const dungeonEnchanceDialogClear = dungeonEnchanceDialog.querySelector(".dialog-clear");
	dungeonEnchanceDialogClear.onclick = function(){
		const dialogContent = dungeonEnchanceDialog.querySelector(".dialog-content");
		const rareDoms = Array.from(dialogContent.querySelectorAll(".rare-list .rare-check"));
		const attrDoms = Array.from(dialogContent.querySelectorAll(".attr-list .attr-check"));
		const typeDoms = Array.from(dialogContent.querySelectorAll(".type-list .type-check"));
		const collabIdIpt = dialogContent.querySelector("#dungeon-collab-id");
		function unchecked(checkBox) {
			checkBox.checked = false;
		}
		rareDoms.forEach(unchecked);
		attrDoms.forEach(unchecked);
		typeDoms.forEach(unchecked);
		collabIdIpt.value = '';
		dialogContent.querySelector("#dungeon-hp").value = 1;
		dialogContent.querySelector("#dungeon-atk").value = 1;
		dialogContent.querySelector("#dungeon-rcv").value = 1;
	};
	const dungeonEnchanceDialogOpen = controlBox.querySelector("#btn-set-dungeon-enchance");
	dungeonEnchanceDialogOpen.onclick = function(){
		dungeonEnchanceDialog.show(formation);
	};

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
		// if (isGuideMod) {
		// 	const url = new URL(location);
		// 	url.searchParams.delete("guide");
		// 	url.searchParams.delete("id");
		// 	history.replaceState(null,null,url);
		// }
		//删除编辑模式
		sessionStorage.removeItem('editing');
	};

	const smonsterinfoBox = editBox.querySelector(".monsterinfo-box");
	const searchBox = editBox.querySelector(".search-box");
	const settingBox = editBox.querySelector(".setting-box");

	const mSeriesId = smonsterinfoBox.querySelector(".monster-seriesId");
	mSeriesId.onclick = function() { //搜索系列
		const seriesId = parseInt(this.getAttribute(dataAttrName), 10);
		if (seriesId > 0) {
			showSearch(Cards.filter(card => card.seriesId == seriesId));
		}
	};
	const mCollabId = smonsterinfoBox.querySelector(".monster-collabId");
	mCollabId.onclick = function() { //搜索合作
		const collabId = parseInt(this.getAttribute(dataAttrName), 10);
		if (collabId > 0); {
			showSearch(Cards.filter(card => card.collabId == collabId));
		}
	};
	//以字符串搜索窗口
	const stringSearchDialog = settingBox.querySelector(".dialog-search-string");
	function searchByString(str)
	{ // 考虑了一下onlyInTag被废弃了，因为和游戏内搜索不符
		str = str.trim();
		if (str.length>0)
		{
			return Cards.filter(card =>
				{
					const names = [card.name];
					if (card.otLangName)
					{
						names.push(...Object.values(card.otLangName));
					}
					const tags = card.altName.concat();
					if (card.otTags)
					{
						tags.push(...card.otTags);
					}
					return tags.some(astr=>astr.toLowerCase().includes(str.toLowerCase())) ||
					names.some(astr=>astr.toLowerCase().includes(str.toLowerCase()));
				}
			);
		}else
		{
			return [];
		}
	}
	function copyString(input)
	{
		input.focus(); //设input为焦点
		input.select(); //选择全部
		if (navigator?.clipboard?.writeText) { //优先使用新API
			navigator.clipboard.writeText(input.value);
		} else if (document.execCommand('copy')) {
			document.execCommand('copy');
		}
		//input.blur(); //取消焦点
	}
	stringSearchDialog.initialing = function(originalStrArr = [], additionalStrArr = [])
	{
		const stringSearchContent = this.querySelector(".dialog-content");
		const fragment = document.createDocumentFragment();
		if (originalStrArr.length > 0 && originalStrArr[0].length > 0)
		{
			const ul_original = document.createElement("ul");
			ul_original.className = "original-string";
			originalStrArr.forEach(str=>{
				const li = ul_original.appendChild(document.createElement("li"));
				const ipt = li.appendChild(document.createElement("input"));
				ipt.className = "string-value";
				ipt.value = str;
				ipt.readOnly = true;
				const copyBtn = li.appendChild(document.createElement("button"));
				copyBtn.className = "string-copy";
				copyBtn.onclick = function(){copyString(ipt)};
				const searchBtn = li.appendChild(document.createElement("button"));
				searchBtn.className = "string-search";
				searchBtn.onclick = function(){showSearch(searchByString(ipt.value))};
			});
			fragment.appendChild(ul_original);
		}
		if (additionalStrArr.length > 0 && additionalStrArr[0].length > 0)
		{
			const ul_additional = document.createElement("ul");
			ul_additional.className = "additional-string";
			additionalStrArr.forEach(str=>{
				const li = ul_additional.appendChild(document.createElement("li"));
				const ipt = li.appendChild(document.createElement("input"));
				ipt.className = "string-value";
				ipt.value = str;
				ipt.readOnly = true;
				const searchBtn = li.appendChild(document.createElement("button"));
				searchBtn.className = "string-search";
				searchBtn.onclick = function(){showSearch(searchByString(ipt.value))};
			});
			fragment.appendChild(ul_additional);
		}
		stringSearchContent.innerHTML = "";
		stringSearchContent.appendChild(fragment);
	}
	stringSearchDialog.close = function()
	{
		this.classList.add(className_displayNone);
	}

	function dialogShowFunction(...arg){
		this?.initialing(...arg); //自身初始化
		this.classList.remove(className_displayNone);
	};
	function dialogCloseFunction(){
		this.classList.add(className_displayNone);
	};
	function dialogCloseButtonFunction(){
		this.parentElement.parentElement.close();
	};
	function dialogInitialing(dialog){
		dialog.show = dialogShowFunction;
		dialog.close = dialogCloseFunction;
		const closeButton = dialog.querySelector(".dialog-close");
		closeButton.onclick = dialogCloseButtonFunction;
	}
	//初始化Dialog
	dialogInitialing(stringSearchDialog);

	const mAltName = smonsterinfoBox.querySelector(".monster-altName");
	mAltName.onclick = function() { //搜索合作
		//const mid = parseInt(this.getAttribute('data-monId'));
		const card = Cards[editBox.mid];
		if (card)
		{
			stringSearchDialog.show(card.altName, card.otTags);
		}
	};
	//创建一个新的怪物头像
	editBox.createCardHead = function(id, options = {}) {
		function clickHeadToNewMon() {
			monstersID.value = this.card.id;
			monstersID.onchange();
			return false; //取消链接的默认操作
		}
		const cli = document.createElement("li");
		const cdom = cli.head = createCardA(options);
		cli.appendChild(cdom);
		let card;
		if (id instanceof Member) {
			changeid(id, cdom);
			card = id.card;
		} else {
			changeid({ id: id }, cdom);
			card = Cards[id];
		}
		cli.card = card;
		if (card?.canAssist)
			cli.classList.add("allowable-assist");
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
				if (skill.type === 232 || skill.type === 233) {
					CDPreview.appendChild(document.createElement("br"));
					const CD_EvoDom = CDPreview.appendChild(document.createElement("span"));
					CD_EvoDom.className = "cd-evo";
					CD_EvoDom.textContent = skill.params.slice(1).map(id=>Skills[id].initialCooldown).join('➔');
					if (skill.type === 233) CD_EvoDom.classList.add("loop-evo-skill");
				}
			}
		}
		//产生一个能力值列表
		function creatAbilitiesList(abilities) {
			const abilitiesPreview = document.createElement("ul");
			abilitiesPreview.className = "abilities-preview";
			const hpDom = abilitiesPreview.appendChild(document.createElement("li"));
			hpDom.className = "hp-preview";
			hpDom.textContent = abilities.hp;
			const atkDom = abilitiesPreview.appendChild(document.createElement("li"));
			atkDom.className = "atk-preview";
			atkDom.textContent = abilities.atk;
			const rcvDom = abilitiesPreview.appendChild(document.createElement("li"));
			rcvDom.className = "rcv-preview";
			rcvDom.textContent = abilities.rcv;
			const indexDom = abilitiesPreview.appendChild(document.createElement("li"));
			indexDom.className = "index-preview";
			indexDom.textContent = Math.round(abilities.hp/10 + abilities.atk/5 + abilities.rcv/3);
			return abilitiesPreview;
		}
		if (options.showAbilities || options.showAbilitiesWithAwoken)
		{
			const abilities_2status = calculateAbility_max(id, solo, teamsCount, 120);
			if (options.showAbilities && abilities_2status)
			{
				const abilitiesPreview = cli.appendChild(creatAbilitiesList(abilities_2status.noAwoken));
			} 
			if (options.showAbilitiesWithAwoken && abilities_2status)
			{
				const abilitiesPreview = cli.appendChild(creatAbilitiesList(abilities_2status.withAwoken));
				abilitiesPreview.classList.add("abilities-with-awoken-preview");
			}
		}
		if (options.showAwoken)
		{
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
		
		if (options.customAddition)
		{
			options.customAddition.forEach(func=>{
				const c_addition = cli.appendChild(document.createElement("div"));
				c_addition.className = "custom-addition";
				let content = func(card);
				content && c_addition.append(content);
			});
		}

		cli.onclick = clickHeadToNewMon;
		return cli;
	};

	//显示进化树
	const evolutionaryTreeMask = settingBox.querySelector(".mask-evolutionary-tree");

	evolutionaryTreeMask.initialize = function(monid)
	{
		const maskContent = this.querySelector(".mask-content");
		const fragment = document.createDocumentFragment();
		const evoTree = new EvoTree(monid);

		fragment.appendChild(evoTree.toListNode());
		maskContent.innerHTML = "";
		maskContent.appendChild(fragment);
	}
	const openEvolutionaryTree = settingBox.querySelector(".row-mon-id .open-evolutionary-tree");
	openEvolutionaryTree.onclick = function(event) {
		if (event.ctrlKey) { //显示进化需求树，不是常用功能，就不做额外的按钮了，所以按住Ctrl点击生效
			evolutionaryTreeMask.showRequirementTree(editBox.mid);
		} else {
			evolutionaryTreeMask.show(editBox.mid);
		}
	};
	//显示进化需求树
	evolutionaryTreeMask.showRequirementTree = function(monid)
	{
		const maskContent = this.querySelector(".mask-content");
		const fragment = document.createDocumentFragment();
		const evoTree = new RequirementTree(monid);

		fragment.appendChild(evoTree.toListNode());
		maskContent.innerHTML = "";
		maskContent.appendChild(fragment);
		this.classList.remove(className_displayNone);
	}
	const searchEvolutionByThis = settingBox.querySelector(".row-mon-id .search-evolution-by-this");
	searchEvolutionByThis.onclick = function() {showSearch(Cards.filter(card=>card.evoMaterials.includes(editBox.mid)))};

	const s_attr1s = Array.from(searchBox.querySelectorAll(".attrs-div .attr-list-1 [name=\"attr-1\"]"));
	const s_attr2s = Array.from(searchBox.querySelectorAll(".attrs-div .attr-list-2 [name=\"attr-2\"]"));
	const s_fixMainColor = searchBox.querySelector("#fix-main-color");
	const s_typesDiv = searchBox.querySelector(".types-div");
	const s_typeAndOr = s_typesDiv.querySelector("#type-and-or");
	const s_typesUl = s_typesDiv.querySelector(".type-list");
	const s_typesLi = Array.from(s_typesUl.querySelectorAll("li"));
	const s_types = s_typesLi.map(li=>li.querySelector(".type-check")); //checkbox集合

	function s_types_onchange(){
		const newClassName = `type-killer-${this.value}`;
		s_typesUl.classList.toggle(newClassName, this.checked && s_typeAndOr.checked);
	}
	s_types.forEach(checkBox=>checkBox.onchange = s_types_onchange);

	const s_types_latentUl = s_typesDiv.querySelector(".latent-list");
	const s_types_latentli = Array.from(s_types_latentUl.querySelectorAll("li"));
	function s_types_latentli_onclick(){
		const latenttype = parseInt(this.getAttribute("data-latent-icon"));
		const killerTypes = typekiller_for_type.filter(o=>o.allowableLatent.includes(latenttype)).map(o=>o.type);
		s_types.forEach(checkbox=>{
			const type = parseInt(checkbox.value);
			checkbox.checked = killerTypes.includes(type);
		});
	}
	s_types_latentli.forEach(latent=>latent.onclick = s_types_latentli_onclick);

	s_typeAndOr.onchange = function(){
		s_types.forEach(checkBox=>checkBox.onchange());
		s_types_latentUl.classList.toggle(className_displayNone, this.checked);;
	};
	s_typeAndOr.onchange();

	//稀有度筛选
	const s_rareDiv = searchBox.querySelector(".rare-div");
	const s_rareLst = s_rareDiv.querySelector(".rare-list");
	const s_rareIcons = Array.from(s_rareLst.querySelectorAll(".rare-icon"));
	const s_rareLows = Array.from(s_rareLst.querySelectorAll("input[name='rare-low']"));
	const s_rareHighs = Array.from(s_rareLst.querySelectorAll("input[name='rare-high']"));
	function s_rareIcons_onclick()
	{
		const thisValue = parseInt(this.getAttribute("data-rare-icon"),10);
		const radioLow = s_rareLows.find(radio=>radio.checked);
		const radioHigh = s_rareHighs.find(radio=>radio.checked);
		const rangeLow = radioLow ? parseInt(radioLow.value,10) : 1;
		const rangeHigh = radioHigh ? parseInt(radioHigh.value,10) : 10;
		
		s_rareLows.find(radio=>parseInt(radio.value,10) == (
			rangeLow != rangeHigh ?
			thisValue :
			(
				thisValue == rangeLow ?
				1 :
				Math.min(thisValue,rangeLow)
			)
		)).checked = true;
		s_rareHighs.find(radio=>parseInt(radio.value,10) == (
			rangeLow != rangeHigh ?
			thisValue :
			(
				thisValue == rangeLow ?
				10 :
				Math.max(thisValue,rangeHigh)
			)
		)).checked = true;
	}
	s_rareIcons.forEach(icon=>icon.onclick = s_rareIcons_onclick);
	const s_rareClear = s_rareDiv.querySelector(".rare-clear");
	s_rareClear.onclick = function(){
		s_rareLows[0].checked = true;
		s_rareHighs[s_rareHighs.length-1].checked = true;
	}

	//const s_rare = s_rareLi.map(li=>li.querySelector(".rare-check"));  //checkbox集合

	const s_awokensDiv = searchBox.querySelector(".awoken-div");
	const s_awokensUl = s_awokensDiv.querySelector(":scope .all-awokens .awoken-ul");
	const s_awokensLi = Array.from(s_awokensUl.querySelectorAll(".awoken-count"));
	const s_awokensIcons = s_awokensLi.map(li => li.querySelector(".awoken-icon"));
	s_awokensUl.originalSorting = s_awokensIcons.map(icon => parseInt(icon.getAttribute("data-awoken-icon"), 10)); //储存觉醒列表的原始排序

	const searchMonList = searchBox.querySelector(".search-mon-list"); //搜索结果列表
	searchMonList.originalHeads = null; //用于存放原始搜索结果

	const s_awokensEquivalent = searchBox.querySelector("#consider-equivalent-awoken"); //搜索等效觉醒
	const s_canAssist = searchBox.querySelector("#can-assist"); //只搜索辅助
	const s_canLevelLimitBreakthrough = searchBox.querySelector("#can-level-limit-breakthrough"); //可以突破等级上限
	const s_have8LatentSlot = searchBox.querySelector("#have-8-latent-slot"); //有8格潜觉

	//强调箱子拥有开关
	const s_boxHave = document.getElementById("box-have");
	s_boxHave.checked = localStorage_getBoolean(cfgPrefix + s_boxHave.id);
	s_boxHave.onchange = function(e) {
		document.body.classList.toggle("emphasize-box-have", this.checked);;
		if (e) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
	};
	s_boxHave.onchange(false);

	const s_sawokensDetail = searchBox.querySelector(".sawoken-detail");
	s_sawokensDetail.open = localStorage_getBoolean(cfgPrefix + 'hide-sawoken');
	s_sawokensDetail.querySelector("summary").onclick = function(event) {
		if (event instanceof MouseEvent) localStorage.setItem(cfgPrefix + 'hide-sawoken', Number(!s_sawokensDetail.open));
	}
	const s_sawokensUl = s_sawokensDetail.querySelector(".awoken-ul");
	const s_sawokensLi = Array.from(s_sawokensUl.querySelectorAll(".awoken-count"));
	s_sawokensUl.originalSorting = s_sawokensLi.map(li => parseInt(li.querySelector(".awoken-icon").getAttribute("data-awoken-icon"), 10));

	const s_sawokens = s_sawokensLi.map(li => li.querySelector(".sawoken-check"));
	const s_includeSuperAwoken = searchBox.querySelector("#include-super-awoken"); //搜索超觉醒
	s_includeSuperAwoken.onchange = function() {
		s_sawokensDetail.classList.toggle(className_displayNone, this.checked);;
	};
	s_includeSuperAwoken.onchange();

	//显示官方觉醒排序开关
	const s_showOfficialAwokenSorting = document.getElementById("show-official-awoken-sorting");
	s_showOfficialAwokenSorting.checked = localStorage_getBoolean(cfgPrefix + s_showOfficialAwokenSorting.id);
	s_showOfficialAwokenSorting.onchange = function(e){
		const checked = this.checked;
		if (e) localStorage.setItem(cfgPrefix + this.id, Number(checked));
		const fragmentAwoken = document.createDocumentFragment();
		const fragmentSawoken = document.createDocumentFragment();
		const awokenSorting = checked ? official_awoken_sorting : s_awokensUl.originalSorting;
		const sawokenSorting = checked ? official_awoken_sorting : s_sawokensUl.originalSorting;


		function appendLi(id) {
			const li = this.iconLis.find(li=>
				parseInt(li.querySelector(".awoken-icon").getAttribute("data-awoken-icon"), 10) === id
			);
			li && this.fragment.appendChild(li);
		}
		awokenSorting.forEach(appendLi, {iconLis: s_awokensLi, fragment: fragmentAwoken});
		sawokenSorting.forEach(appendLi, {iconLis: s_sawokensLi, fragment: fragmentSawoken});
		
		const className = "official-awoken-sorting";
		s_awokensDiv.classList.toggle(className, checked);

		s_awokensUl.appendChild(fragmentAwoken);
		s_sawokensUl.appendChild(fragmentSawoken);
	};
	s_showOfficialAwokenSorting.onchange(false);

	const s_selectedAwokensUl = searchBox.querySelector(".selected-awokens");
	function search_awokenAdd1() {
		let count = parseInt(this.getAttribute("data-awoken-count") || 0, 10);
		const maxCount = parseInt(this.getAttribute("data-max-count") || 9, 10);
		if (count < maxCount) {
			count++;
			this.setAttribute("data-awoken-count", count);

			const iconLi = document.createElement("li");
			const icon = iconLi.appendChild(document.createElement("icon"))
			icon.className = "awoken-icon";
			icon.setAttribute("data-awoken-icon", this.getAttribute("data-awoken-icon"));
			icon.onclick = search_awokenSub1;
			s_selectedAwokensUl.appendChild(iconLi);
		}
	}
	function search_awokenSub1() {
		const awokenId = this.getAttribute("data-awoken-icon");
		const awokenIcon = s_awokensIcons.find(icon=>icon.getAttribute("data-awoken-icon") == awokenId);
		let count = parseInt(awokenIcon.getAttribute("data-awoken-count") || 0, 10);
		if (count > 0) {
			count--;
			awokenIcon.setAttribute("data-awoken-count", count);
		}
		this.parentNode.remove();
	}
	s_awokensIcons.forEach(b => {
		b.onclick = search_awokenAdd1; //每种觉醒增加1
	});

	const awokenClear = searchBox.querySelector(".awoken-clear");
	awokenClear.onclick = function() { //清空觉醒选项
		s_awokensIcons.forEach(t => {
			t.setAttribute("data-awoken-count", 0);
		});
		s_sawokens.forEach(t => {
			t.checked = false;
		});
		s_selectedAwokensUl.innerHTML = "";
	};

	//特殊搜索部分
	const s_specialDiv = searchBox.querySelector(".special-div");
	const specialAdd = s_specialDiv.querySelector(".special-add");
	const specialClear = s_specialDiv.querySelector(".special-clear");
	const specialStar = s_specialDiv.querySelector(".special-star");
	const specialFilterUl = s_specialDiv.querySelector(".special-filter-list");
	const specialFilterFirstLi = specialFilterUl.querySelector("li");
	const specialFirstSelect = specialFilterFirstLi.querySelector(".special-filter");
	
	function newSpecialSearchOption(func, idx1, idx2)
	{
		const funcName = returnMonsterNameArr(func, currentLanguage.searchlist, currentDataSource.code)[0];
		return new Option(
			funcName + (func.addition ? " " + localTranslating.addition_display : ""), //有附加显示的，名称增加一个附加显示图标
			idx1 + (idx2 != null ? "|" + idx2 : "") //值为 组序号|组内序号
			);
	}
	//读取储存的筛选收藏列表
	const strMakedConfig = JSON.parse(localStorage.getItem(cfgPrefix + "marked-filter"));
	if (Array.isArray(strMakedConfig)) {
		strMakedConfig.forEach(([groupName, filterName])=>{
			const idx1 = specialSearchFunctions.findIndex(group=>group.name == groupName);
			if (idx1 < 0 ) return;
			if (filterName !== undefined) {
				const idx2 = specialSearchFunctions[idx1].functions.findIndex(func=>func.name == filterName);
				if (idx2 < 0 ) return;
				markedFilter.push([idx1, idx2]);
			} else {
				markedFilter.push([idx1]);
			}
		});
	}
	specialFirstSelect.refreshList = function() {
		const _this = specialFirstSelect;
		function addNewOption(sfunc, groudIndex){
			if (sfunc.group)
			{
				const groupName = returnMonsterNameArr(sfunc, currentLanguage.searchlist, currentDataSource.code)[0];
				const optgroup = _this.appendChild(document.createElement("optgroup"));
				optgroup.label = groupName;
				if (sfunc.functions)
				{
					sfunc.functions.forEach((_sfunc, filterIndex)=>{
						optgroup.appendChild(newSpecialSearchOption(_sfunc, groudIndex, filterIndex));
					});
				}
			}else
			{
				_this.options.add(newSpecialSearchOption(sfunc, groudIndex));
			}
		}
		_this.innerHTML = '';
		addNewOption(specialSearchFunctions[0], 0);
		if (markedFilter.length > 0) {
			const groupName = "=====★=====";
			const optgroup = _this.appendChild(document.createElement("optgroup"));
			optgroup.label = groupName;
			markedFilter.forEach(([groudIndex, filterIndex])=>{
				const funcObj = filterIndex !== undefined ? specialSearchFunctions[groudIndex].functions[filterIndex] : specialSearchFunctions[groudIndex];
				optgroup.appendChild(newSpecialSearchOption(funcObj, groudIndex, filterIndex));
			});
		}
		for (let idx = 1; idx < specialSearchFunctions.length; idx++) {
			addNewOption(specialSearchFunctions[idx], idx);
		}
	}
	specialFirstSelect.onchange = function() {
		const [selectGroudIndex, selectFilterIndex] = specialFirstSelect.value.split("|").map(Number);
		let markIdx = markedFilter.findIndex(([groudIndex, filterIndex])=>groudIndex === selectGroudIndex && filterIndex === selectFilterIndex);
		if (markIdx >= 0) {//已经存在的收藏
			specialStar.classList.add("marked");
		} else {
			specialStar.classList.remove("marked");
		}
	}
	//只添加第一个列表，后面的全部通过克隆的方式复现
	specialFirstSelect.refreshList();
	specialAdd.onclick = function(event) {
		const specialFilterLi = specialFilterFirstLi.cloneNode(true);
		const specialFilterSelection = specialFilterLi.querySelector(".special-filter");
		specialFilterUl.appendChild(specialFilterLi);
		return specialFilterSelection;
	}
	//specialAdd.onclick(); //先运行一次产生两个
	specialClear.onclick = function() {
		searchMonList.customAddition = null;
		specialFilterUl.innerHTML = "";
		specialFilterUl.appendChild(specialFilterFirstLi);
		specialFirstSelect.selectedIndex = 0;
	}
	specialStar.onclick = function() {
		const indexs = specialFirstSelect.value.split("|").map(Number);
		let markIdx = markedFilter.findIndex(arr=>arr[0] === indexs[0] && arr[1] === indexs[1]);
		if (markIdx >= 0) {//已经存在的收藏
			markedFilter.splice(markIdx,1);
		} else {
			markedFilter.push(indexs);
		}
		specialFirstSelect.refreshList(); //刷新列表
		specialStar.classList.remove("marked"); //去掉自身的收藏标记
		//储存设置
		let strMakedConfig = markedFilter.map(indexs=>{
			let arr = [specialSearchFunctions[indexs[0]].name];
			if (indexs.length > 1) arr.push(specialSearchFunctions[indexs[0]].functions[indexs[1]].name);
			return arr;})
		localStorage.setItem(cfgPrefix + "marked-filter", JSON.stringify(strMakedConfig));
	}

	const s_controlDiv = searchBox.querySelector(".control-div");
	const searchStart = s_controlDiv.querySelector(".search-start");
	const searchClose = s_controlDiv.querySelector(".search-close");
	const searchClear = s_controlDiv.querySelector(".search-clear");
	const searchShare = s_controlDiv.querySelector(".search-share");
	searchShare.onclick = function() {
		const options = searchBox.getSearchOptions();
		const optionJSON = JSON.stringify(options);
		const locationURL = new URL(location);
		locationURL.searchParams.set('search-options', optionJSON);
		const idArr = searchMonList.originalHeads?.map(head=>head.card.id) ?? [];
		locationURL.searchParams.set('show-search', JSON.stringify(idArr));
		showAnyStringDialog.show(locationURL.toString());
	}
	const showAnyStringDialog = settingBox.querySelector(".dialog-show-any-string");
	showAnyStringDialog.initialing = function(str) {
		const ipt = this.querySelector(".string-value");
		ipt.value = str;
	}
	showAnyStringDialog.querySelector('.string-copy').onclick = function(){
		copyString(showAnyStringDialog.querySelector(".string-value"));
	}
	//初始化Dialog
	dialogInitialing(showAnyStringDialog);

	function returnCheckedInput(ipt) {
		return ipt.checked;
	}

	function returnInputValue(ipt) {
		return ipt.value;
	}

	function returnRadiosValue(radioArr) {
		const checkedRadio = radioArr.find(returnCheckedInput);
		const firstCheckedValue = checkedRadio ? returnInputValue(checkedRadio) : undefined;
		return firstCheckedValue;
	}
	function returnCheckBoxsValues(checkBoxsArr) {
		const checkedCheckBoxs = checkBoxsArr.filter(returnCheckedInput);
		const checkedValues = checkedCheckBoxs.map(returnInputValue);
		return checkedValues;
	}

	function Str2Int(str) {
		return parseInt(str, 10);
	}
	//将搜索结果显示出来（也可用于其他的搜索）
	const s_add_show_awoken = searchBox.querySelector("#add-show-awoken"); //是否显示觉醒
	const s_add_show_CD = searchBox.querySelector("#add-show-CD"); //是否显示CD
	const s_add_show_abilities = searchBox.querySelector("#add-show-abilities"); //是否显示三维
	const s_add_show_abilities_with_awoken = searchBox.querySelector("#add-show-abilities-with-awoken"); //是否显示计算觉醒的三维
	
	const searchResultCount = searchBox.querySelector(".search-list-length");
	showSearch = function(searchArr, customAdditionalFunction)
	{
		if (typeof(searchArr) === "number") {
			searchArr = [searchArr];
		} else if (Array.isArray(searchArr)) { //如果传入的内容是数字，就转成card对象
			searchArr = searchArr.map(id=>typeof(id) === "object" ? id : Cards[id]);
		} else {
			return; //如果不是数组就直接取消下一步
		}
		//如果之前打开了附加显示，继续沿用
		if (customAdditionalFunction === undefined && searchMonList?.customAddition?.length) {
			customAdditionalFunction = searchMonList.customAddition;
		}

		searchBox.classList.remove(className_displayNone);
		editBox.show();
		const createCardHead = editBox.createCardHead;

		searchMonList.classList.add(className_displayNone);
		searchMonList.innerHTML = ""; //清空旧的
		//辅助回收内存
		if (Array.isArray(searchMonList.originalHeads))
		{
			searchMonList.originalHeads.forEach(item=>item = null);
			searchMonList.originalHeads = null;
		}

		if (searchArr.length > 0) {
			const fragment = document.createDocumentFragment(); //创建节点用的临时空间
			//获取原始排序的头像列表
			const additionalOption = { //搜索列表的额外选项
				showAwoken: s_add_show_awoken.checked,
				showCD: s_add_show_CD.checked,
				showAbilities: s_add_show_abilities.checked,
				showAbilitiesWithAwoken: s_add_show_abilities_with_awoken.checked,
				customAddition: Array.isArray(customAdditionalFunction) ? customAdditionalFunction : (typeof customAdditionalFunction == "function" ? [customAdditionalFunction] : [])
			};
			searchMonList.originalHeads = searchArr.map(card => {
				if (card instanceof Member) {
					return createCardHead(card, additionalOption);
				} else {
					return createCardHead(card.id, additionalOption);
				}
			});
			searchMonList.customAddition = additionalOption.customAddition;
			//对头像列表进行排序
			const headsArray = sortHeadsArray(searchMonList.originalHeads);
			headsArray.forEach(head => fragment.appendChild(head));
			searchMonList.appendChild(fragment);

			//目前这里添加会导致无限循环，无法后退
			//const idArr = searchMonList.originalHeads.map(head=>head.card.id);
			//const state = {searchArr:idArr,mid:editBox.mid};
			//history.pushState(state, null, location);
		}
		searchResultCount.setAttribute("data-search-result-count", searchArr.length);
		searchMonList.classList.remove(className_displayNone);
	};
	//对已经搜索到的Cards重新附加显示
	function reShowSearch()
	{
		if (Array.isArray(searchMonList.originalHeads))
		{
			const oldArr = searchMonList.originalHeads.map(head=>head.card);
			showSearch(oldArr, searchMonList.customAddition);
		}
	}
	s_add_show_awoken.onchange = reShowSearch;
	s_add_show_CD.onchange = reShowSearch;
	s_add_show_abilities.onchange = reShowSearch;
	s_add_show_abilities_with_awoken.onchange = reShowSearch;

	//恢复搜索状态
	searchBox.recoverySearchStatus = function({attrs:[attr1, attr2], fixMainColor, types, typeAndOr, rares:[rareLow, rareHigh], awokens, sawokens, equalAk, incSawoken, canAssist, canLv110, is8Latent, specialFilters}) {
		//属性这里是用的2进制写
		(s_attr1s.find(opt=>parseInt(opt.value,2) == attr1) || s_attr1s[0]).checked = true;
		(s_attr2s.find(opt=>parseInt(opt.value,2) == attr2) || s_attr2s[0]).checked = true;
		s_fixMainColor.checked = fixMainColor;
		s_types.filter(opt=>types.includes(parseInt(opt.value,10))).forEach(opt=>opt.checked = true);
		s_typeAndOr.checked = typeAndOr;
		(s_rareLows.find(opt=>parseInt(opt.value,10) == rareLow) || s_rareLows[0]).checked = true;
		(s_rareHighs.find(opt=>parseInt(opt.value,10) == rareHigh) || s_rareHighs[s_rareHighs.length-1]).checked = true;

		s_selectedAwokensUl.innerHTML = "";
		//添加觉醒
		awokens.forEach(ak=>{
			const btn = s_awokensIcons.find(_btn=>parseInt(_btn.getAttribute("data-awoken-icon"), 10) == ak.id);

			for (let i = 0; i < ak.num; i++) {
				btn.onclick();
			}
		});

		s_sawokens.filter(opt=>sawokens.includes(parseInt(opt.value,10))).forEach(opt=>opt.checked = true);
		s_awokensEquivalent.checked = equalAk;
		s_includeSuperAwoken.checked = incSawoken;
		s_canAssist.checked = canAssist;
		s_canLevelLimitBreakthrough.checked = canLv110;
		s_have8LatentSlot.checked = is8Latent;

		//保留之前的特殊搜索，不需要完全新增
		const specialFilterSelections = Array.from(specialFilterUl.querySelectorAll(".special-filter"));
		//将筛选个数增加到需要的个数
		for (let i = specialFilterSelections.length; i < specialFilters.length; i++) {
			specialFilterSelections.push(specialAdd.onclick());
		}
		//将每一个搜索都设置好
		for (let i = 0; i < specialFilters.length; i++) {
			const filterSelection = specialFilterSelections[i];
			const filter = specialFilters[i];
			filterSelection.value = filter.join("|");
		}
	}
	//导出当前的搜索状态
	searchBox.getSearchOptions = function(){
		const attrs = [
			parseInt(returnRadiosValue(s_attr1s), 2) || 0,
			parseInt(returnRadiosValue(s_attr2s), 2) || 0
		];
		const types = returnCheckBoxsValues(s_types).map(Str2Int);
		const rares = [
			parseInt(returnRadiosValue(s_rareLows), 10),
			parseInt(returnRadiosValue(s_rareHighs), 10),
		];
		const sawokens = returnCheckBoxsValues(s_sawokens).map(Str2Int);
		const awokens = s_awokensIcons.filter(btn => parseInt(btn.getAttribute("data-awoken-count"), 10) > 0).map(btn => {
			return {
				id: parseInt(btn.getAttribute("data-awoken-icon"), 10),
				num: parseInt(btn.getAttribute("data-awoken-count"), 10)
			};
		});
		//储存设置用于页面刷新的状态恢复
		const specialFilters = Array.from(specialFilterUl.querySelectorAll(".special-filter"))
			.map(select=>select.value.split("|").map(Number)) //将字符串"1|2"转换成数组[1,2]
			.filter(([f1, f2])=>!(f1===0&&f2===undefined)); //去掉0号筛选
		
		const options = {
			attrs,
			fixMainColor: s_fixMainColor.checked,
			types,
			typeAndOr: s_typeAndOr.checked,
			rares,
			awokens,
			sawokens,
			equalAk: s_awokensEquivalent.checked,
			incSawoken: s_includeSuperAwoken.checked,
			canAssist: s_canAssist.checked,
			canLv110: s_canLevelLimitBreakthrough.checked,
			is8Latent: s_have8LatentSlot.checked,
			specialFilters,
		};
		return options;
	}
	searchStart.onclick = function(event) {
		let customAdditionalFunction = [];

		const options = searchBox.getSearchOptions();

		let searchResult = searchCards(Cards, options);

		//进行特殊附加搜索
		const specialFilters = options.specialFilters.map(([name1, name2])=>
			name2 !== undefined ? specialSearchFunctions[name1].functions[name2] : specialSearchFunctions[name1]
		);
		searchResult = specialFilters.reduce((pre,funcObj)=>
		{
			if (!funcObj) return pre;
			if (funcObj.addition && !customAdditionalFunction.includes(funcObj.addition)) customAdditionalFunction.push(funcObj.addition); //如果有附加显示，则添加到列表
			return funcObj.function(pre); //结果进一步筛选
		}, searchResult);

		const optionJSON = JSON.stringify(options);
		sessionStorage.setItem('search-options', optionJSON);
		
		//显示搜索结果
		showSearch(searchResult, customAdditionalFunction);
		
		if (location.search.includes("search-options=")) {
			//去掉URL内的搜索内容分享，避免干扰
			const locationURL = new URL(location);
			locationURL.searchParams.delete('search-options');
			locationURL.searchParams.delete('show-search');
			history.replaceState(null, null, locationURL);
		}
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
		s_rareClear.onclick();
		
		awokenClear.onclick();
		specialClear.onclick();

		s_canAssist.checked = false;
		s_canLevelLimitBreakthrough.checked = false;
		s_have8LatentSlot.checked = false;
		
		searchMonList.originalHeads = null;
		searchResultCount.setAttribute("data-search-result-count", 0);
		searchMonList.innerHTML = "";

		sessionStorage.removeItem('search-options');
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
	//对已经搜索到的Cards重新排序
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
	editBox.changeMonId = editBoxChangeMonId;
	const monstersID = settingBox.querySelector(".row-mon-id .m-id");
	const btnSearchByString = settingBox.querySelector(".row-mon-id .search-by-string");
	function idChange(event)
	{
		if (/^\d+$/.test(this.value)) {
			const newId = parseInt(this.value, 10);
			if (editBox.mid != newId) //避免多次运行oninput、onchange
			{
				editBox.mid = newId;
				
				//图鉴模式记录上一次的内容
				if (isGuideMod)
				{
					const idArr = searchMonList.originalHeads?.map(head=>head.card.id) ?? [];
					const state = {searchArr:idArr,mid:newId};
					const locationURL = new URL(location);
					if (newId === 0) {
						locationURL.searchParams.delete('id');
					}else
					{
						locationURL.searchParams.set('id', newId);
					}
					history.pushState(state, null, locationURL);
				}

				editBox.changeMonId(newId);
			}
			return true;
		}else
		{
			return false;
		}
	}
	monstersID.onchange = idChange;
	monstersID.onkeydown = function(event) {
		//如果键入回车，字符串长度大于0，且不是数字，则执行字符串搜索
		if (event.key === "Enter" && this.value.length > 0 && !/^\d+$/.test(this.value))
		{
			showSearch(searchByString(this.value));
		}
	}
	//输入id数字即时更新的开关
	const realTimeClassName = 'real-time-change-card';
	const s_realTimeChangeCard = settingBox.querySelector(`#${realTimeClassName}`);
	s_realTimeChangeCard.onchange = function(e) {
		monstersID.oninput = this.checked ? idChange : null;
		if (e) localStorage.setItem(cfgPrefix + realTimeClassName, Number(this.checked));
	}
	s_realTimeChangeCard.checked = Boolean(Number(localStorage.getItem(cfgPrefix + realTimeClassName)));
	s_realTimeChangeCard.onchange(false);

	//字符串搜索
	btnSearchByString.onclick = function() {
		showSearch(searchByString(monstersID.value));
	};
	//觉醒
	const monEditAwokensRow = settingBox.querySelector(".row-mon-awoken");
	const awokenCountLabel = monEditAwokensRow.querySelector(".awoken-count-num");
	const monEditAwokens = Array.from(monEditAwokensRow.querySelectorAll(".awoken-ul input[name='awoken-number']"));

	function checkAwoken() {
		const card = Cards[editBox.mid ?? 0];
		const value = parseInt(this.value, 10);
		awokenCountLabel.setAttribute(dataAttrName, value);
		awokenCountLabel.classList.toggle("full-awoken", value > 0 && value == card.awakenings.length);;

		reCalculateAbility();
	}
	monEditAwokens.forEach(akDom => akDom.onclick = checkAwoken);

	const monEditAwokensLabel = Array.from(monEditAwokensRow.querySelectorAll(".awoken-ul .awoken-icon"));

	function playVoiceAwoken() { //点击label才播放语音
		if (parseInt(this.getAttribute("data-awoken-icon"), 10) === 63) {
			const card = Cards[editBox.mid];
			const sndURL = `sound/voice/${currentDataSource.code}/padv${card.voiceId.toString().padStart(3,'0')}.wav`;
			const decoder = new Adpcm(adpcm_wasm, pcmImportObj);
			decoder.resetDecodeState(new Adpcm.State(0, 0));
			decodeAudio(sndURL, decoder.decode.bind(decoder));
		}
	}
	monEditAwokensLabel.forEach(akDom => akDom.onclick = playVoiceAwoken);

	//超觉醒
	const monEditSAwokensRow = settingBox.querySelector(".row-mon-super-awoken");

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
	const monEditLv120 = settingBox.querySelector(".m-level-btn-120");
	monEditLv120.ipt = monEditLv;
	monEditLv120.onclick = setIptToMyValue;
	//编辑界面重新计算怪物的经验值
	function reCalculateExp() {
		const monid = editBox.mid;
		const level = parseInt(monEditLv.value || 0, 10);
		const tempMon = {
			id: monid,
			level: level
		};
		const needExpArr = calculateExp(tempMon);
		monLvExp.textContent = needExpArr ? needExpArr.map(exp=>exp.bigNumberToString()).join(" + ") : "";
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
	//297按钮
	const monEditPlusFastSettings = Array.from(rowMonPlus.querySelectorAll(".m-plus-fast-setting"));
	monEditPlusFastSettings.forEach(btn=>btn.onclick=plusFastSetting);
	function plusFastSetting(){
		const sumPlus = parseInt(this.value, 10);
		let one_plus = Math.floor(sumPlus / 3);
		monEditAddHp.value = one_plus;
		monEditAddAtk.value = one_plus;
		monEditAddRcv.value = one_plus;
		reCalculateAbility();
	}

	//潜觉
	const monEditLatentUl = settingBox.querySelector(".row-mon-latent .latent-ul");
	const monEditLatents = Array.from(monEditLatentUl?.querySelectorAll("li"));
	const monEditLatentAllowableDetail = settingBox.querySelector(".row-mon-latent details");
	const monEditLatentAllowableUl = monEditLatentAllowableDetail.querySelector(".m-latent-allowable-ul");
	const monEditLatentsAllowable = Array.from(monEditLatentAllowableUl.querySelectorAll("li"));
	monEditLatentAllowableDetail.open = localStorage_getBoolean(cfgPrefix + 'hide-latent');
	monEditLatentAllowableDetail.onclick = function(event) {
		if (event instanceof MouseEvent) localStorage.setItem(cfgPrefix + 'hide-latent', Number(!this.open));
	}
	editBox.refreshLatent = function(latent, monid) {//刷新潜觉
		refreshLatent(latent, monid, monEditLatentUl);
	};

	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");

	skillTitle.onclick = fastShowSkill;

	skillLevel.onchange = function() {
		const card = Cards[editBox.mid] || Cards[0]; //怪物固定数据
		const skill = Skills[card.activeSkillId];
		skillCD.textContent = skill?.initialCooldown - this.value + 1;
	};
	skillLevel_1.ipt = skillLevel;
	skillLevel_1.onclick = setIptToMyValue;
	skillLevel_Max.ipt = skillLevel;
	skillLevel_Max.onclick = setIptToMyValue;

	const rowLeaderSkill = settingBox.querySelector(".row-mon-leader-skill");
	const leaderSkillBox = rowLeaderSkill.querySelector(".skill-box");
	const lskillTitle = leaderSkillBox.querySelector(".skill-name");
	lskillTitle.onclick = fastShowSkill;

	//显示原文开关
	const showSkillOriginal = document.getElementById("show-skill-original");
	showSkillOriginal.checked = localStorage_getBoolean(cfgPrefix + showSkillOriginal.id);
	showSkillOriginal.onchange = function(event) {
		if (event instanceof MouseEvent) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
		skillBox.classList.toggle(this.id, this.checked);;
		leaderSkillBox.classList.toggle(this.id, this.checked);;
	};
	showSkillOriginal.onchange(false);

	editBox.refreshSkillParse = function(skp, lskp){
		const skillDetailParsed = skp ?? skillBox.querySelector(".skill-datail-parsed");
		const lskillDetailParsed = lskp ?? leaderSkillBox.querySelector(".skill-datail-parsed");
		
		const card = Cards[this.mid] || Cards[0];
		if (!card) return;
		
		try {
			skillDetailParsed.innerHTML = "";
			const parsedActiveSkill = skillParser(card.activeSkillId);
			const isEvolvedSkill = parsedActiveSkill.some(skill=>skill.kind == SkillKinds.EvolvedSkills);
			skillBox.classList.toggle("evolved-skill", isEvolvedSkill);
			skillDetailParsed.appendChild(renderSkillEntry(parsedActiveSkill));
		} catch (error) {
			console.error("%o 主动技 %d 解析出错", card, card.activeSkillId, error);
			skillDetailParsed.appendChild(renderSkillEntry([{kind: SkillKinds.Error}]));
		}
		try {
			lskillDetailParsed.innerHTML = "";
			const parsedLeaderSkill = skillParser(card.leaderSkillId);
			lskillDetailParsed.appendChild(renderSkillEntry(parsedLeaderSkill));
		} catch (error) {
			console.error("%o 队长技 %d 解析出错", card, card.leaderSkillId, error);
			lskillDetailParsed.appendChild(renderSkillEntry([{kind: SkillKinds.Error}]));
		}
	};

	//合并技能开关
	const mergeSill = document.getElementById("merge-skill");
	mergeSill.checked = localStorage_getBoolean(cfgPrefix + mergeSill.id);
	mergeSill.onchange = function(event){
		if (event) localStorage.setItem(cfgPrefix + this.id, Number(this.checked));
		merge_skill = this.checked;
		editBox.refreshSkillParse();
	};
	mergeSill.onchange(false);


	//已有觉醒的去除
	function deleteLatent(e) {
		const lIdx = parseInt(this.getAttribute("data-latent-icon"), 10); //潜觉的序号
		const aIdx = editBox.latent.indexOf(lIdx);
		if (aIdx >= 0)
		{
			editBox.latent.splice(aIdx, 1);
			editBox.reCalculateAbility(); //重计算三维
			editBox.refreshLatent(editBox.latent, editBox.mid); //刷新潜觉
		}
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
		const monid = editBox.mid;
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
		monEditLatentUl.classList.toggle("level-super-break", level > 110);; //切换潜觉为120级

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

		mon.id = editBox.mid;
		const card = mon.card || Cards[0];
		const skill = Skills[card.activeSkillId];

		mon.level = parseInt(monEditLv.value, 10);

		const mAwokenNumIpt = monEditAwokensRow.querySelector("input[name='awoken-number']:checked");
		mon.awoken = mAwokenNumIpt ? parseInt(mAwokenNumIpt.value, 10) : 0;
		if (card.superAwakenings.length) //如果支持超觉醒
		{
			const mSAwokenChoIpt = monEditSAwokensRow.querySelector("input[name='sawoken-choice']:checked");
			mon.sawoken = parseInt(mSAwokenChoIpt?.value, 10) || 0;
		}

		if (card.stacking || card.types.some(t=>[0,12,14,15].includes(t)) &&
			mon.level >= card.maxLevel) { //当4种特殊type的时候是无法297和打觉醒的，但是不能叠加的在未满级时可以
			mon.plus = [0, 0, 0];
		} else {
			mon.plus[0] = parseInt(monEditAddHp.value) || 0;
			mon.plus[1] = parseInt(monEditAddAtk.value) || 0;
			mon.plus[2] = parseInt(monEditAddRcv.value) || 0;
			if (!editBox.isAssist) { //如果不是辅助，则可以设定潜觉
				mon.latent = editBox.latent.concat();
			}
		}

		const skillLevelNum = parseInt(skillLevel.value, 10);
		if (skillLevelNum < skill.maxLevel) {
			mon.skilllevel = skillLevelNum;
		}
		changeid(mon, editBox.monsterHead, editBox.memberIdx[1] ? null : editBox.latentBox);

		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		let changeAttrTypeWeapon = false;
		let awokens = card.awakenings;
		if (!editBox.isAssist) {//如果改的不是辅助
			awokens = teamData[editBox.memberIdx[1] + 1][editBox.memberIdx[2]].card.awakenings;
		}
		if (awokens.includes(49) && awokens.some(ak => ak >= 83 && ak <= 95)) changeAttrTypeWeapon = true;

		//如果是2人协力，且修改的是队长的情况，为了刷新另一个队伍时间计算，直接刷新整个队形
		if (teamsCount === 2 && editBox.memberIdx[2] === 0 || changeAttrTypeWeapon) {
			refreshAll(formation);
		} else {
			const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
			if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData, editBox.memberIdx[0]);
			const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
			if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);
	
			const teamMemberTypesDom = teamBigBox.querySelector(".team-member-types"); //队员类型
			if (teamMemberTypesDom) refreshmemberTypes(teamMemberTypesDom, teamData, editBox.memberIdx[2]); //刷新本人觉醒

			const teamMemberAwokenDom = teamBigBox.querySelector(".team-member-awoken"); //队员觉醒
			const teamAssistAwokenDom = teamBigBox.querySelector(".team-assist-awoken"); //辅助觉醒
			if (teamMemberAwokenDom && teamAssistAwokenDom) refreshmemberAwoken(teamMemberAwokenDom, teamAssistAwokenDom, teamData, editBox.memberIdx[2]); //刷新本人觉醒

			const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
			if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
			const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
			if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);
	
			//刷新该队员的CD
			refreshMemberSkillCD(teamBox, teamData, editBox.memberIdx[2]);
		}

		creatNewUrl();
		editBox.hide();
	};
	window.addEventListener("keydown",function(event) {
		if (!editBox.classList.contains(className_displayNone))
		{ //编辑窗打开
			if (event.key === "Escape") { //按下ESC时，自动关闭编辑窗
				btnCancel.onclick();
			}
		}
		else
		{
			let selection = window.getSelection(), selectNodes = selection?.focusNode?.childNodes;
			//如果正在编辑文本，则不执行快捷键操作
			if (selectNodes && Array.from(selectNodes).some(node=>node?.nodeName === "TEXTAREA" || node?.nodeName === "INPUT"))
				return;
			//如果按Ctrl+左右方向键，或者是小键盘上的左右方向键（关闭Num），快速切换变身
			if (event.key === "ArrowLeft"
				&& (event.code == "Numpad4" || event.ctrlKey))
			{ //变身后退
				henshinStep(-1);
			}
			else if (event.key === "ArrowRight"
				&& (event.code == "Numpad6" || event.ctrlKey))
			{ //变身前进
				henshinStep(+1);
			}
		}
	});
	btnNull.onclick = function() { //空位置
		const mon = new Member();
		const teamBigBox = teamBigBoxs[editBox.memberIdx[0]];
		const teamData = formation.teams[editBox.memberIdx[0]];
		teamData[editBox.memberIdx[1]][editBox.memberIdx[2]] = mon;

		changeid(mon, editBox.monsterHead, editBox.latentBox);

		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		refreshAbility(teamAbilityDom, teamData, editBox.memberIdx[2]); //本人能力值

		refreshAll(formation);
		
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

		const teamMemberTypesDom = teamBigBox.querySelector(".team-member-types"); //队员类型
		if (teamMemberTypesDom) refreshmemberTypes(teamMemberTypesDom, teamData, editBox.memberIdx[2]); //刷新本人觉醒

		const teamMemberAwokenDom = teamBigBox.querySelector(".team-member-awoken"); //队员觉醒
		const teamAssistAwokenDom = teamBigBox.querySelector(".team-assist-awoken"); //辅助觉醒
		if (teamMemberAwokenDom && teamAssistAwokenDom) refreshmemberAwoken(teamMemberAwokenDom, teamAssistAwokenDom, teamData, editBox.memberIdx[2]); //刷新本人觉醒

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

//搜出一个卡片包含变身的的完整进化树，用于平铺显示
function buildEvoTreeIdsArray(card, includeHenshin = true) {

	function idToCard(id) {return Cards[id]}
	function loopAddHenshin(card, cardSet)
	{
		function filterCard(_card) {
			return _card && !cardSet.has(_card);
		}
		function addCard(_card) {
			cardSet.add(_card);
			loopAddHenshin(_card, cardSet);
		}
		//从本卡片变身到的
		if (Array.isArray(card.henshinFrom)) {
			const cardTo = card.henshinFrom.map(idToCard).filter(filterCard);
			cardTo.forEach(addCard);
		}
		//变身到本卡片的（多个）
		if (Array.isArray(card.henshinTo)) {
			const cardsFrom = card.henshinTo.map(idToCard).filter(filterCard);
			cardsFrom.forEach(addCard);
		}
		//如果本角色可以变身为其他人，则继续搜索进化链，被变身的就不需要了。
		const evoCards = Cards.filter(_card=>_card.evoRootId == card.evoRootId && !cardSet.has(_card));
		evoCards.forEach(addCard);
	}
	let evoLinkCardsArray = card.evoRootId ? Cards.filter(m=>m.evoRootId == card.evoRootId) : []; //筛选出相同进化链的 Card
	//let evoLinkCardsIdArray = evoLinkCardsArray.map(m=>m.id); //相同进化链的ID
	const evoLinkCardsSet = new Set(evoLinkCardsArray);
	if (includeHenshin) {
		evoLinkCardsArray.forEach(card=>{
			loopAddHenshin(card, evoLinkCardsSet);
		});
	}
	let evoLinkCardsIdArray = [...evoLinkCardsSet].map(card=>card.id); //只保留id
	evoLinkCardsIdArray.sort((a,b)=>a-b); //按ID大小排序
	return evoLinkCardsIdArray;
}

//改变一个怪物头像
function changeid(mon, monDom, latentDom, assist) {
	//let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	//const parentNode = monDom.parentNode;
	//fragment.appendChild(monDom);
	const monId = mon.id;
	const card = Cards[monId] || Cards[0]; //怪物固定数据
	if (!card) { //如果搜不到怪物就退出操作
		parentNode.appendChild(fragment);
		return;
	}

	monDom.setAttribute("data-cardid", monId); //设定新的id
	if (monId < 0) //如果是延迟
	{
		monDom.removeAttribute("href");
		monDom.removeAttribute("title");
		monDom.classList.add("delay");
		monDom.classList.remove("null");
		//parentNode.appendChild(fragment);
		if (latentDom) latentDom.classList.add(className_displayNone);
		return;
	} else if (monId == 0) //如果是空
	{
		monDom.removeAttribute("href");
		monDom.removeAttribute("title");
		monDom.classList.add("null");
		monDom.classList.remove("delay");
		//parentNode.appendChild(fragment);
		if (latentDom) latentDom.classList.add(className_displayNone);
		return;
	} else if (monId > -1) //如果提供了id
	{
		monDom.classList.remove("null");
		monDom.classList.remove("delay");

		monDom.setAttribute("data-cards-pic-idx", Math.ceil(monId % 1e5 / 100)); //添加图片编号
		const idxInPage = (monId - 1) % 100; //获取当前页面的总序号
		monDom.setAttribute("data-cards-pic-x", idxInPage % 10); //添加X方向序号
		monDom.setAttribute("data-cards-pic-y", Math.floor(idxInPage / 10)); //添加Y方向序号

		monDom.querySelector(".property").setAttribute("data-property", card.attrs[0]); //主属性
		let subAttribute = card.attrs[1] ?? 6; //正常的副属性
		let assistCard = Cards[assist?.id];
		let changeAttr;
		if (assistCard && assistCard.awakenings.includes(49) &&  //如果传入了辅助武器
			(changeAttr = assistCard.awakenings.find(ak=>ak >= 91 && ak <= 95)) //搜索改副属性的觉醒
		) {
			subAttribute = changeAttr - 91; //更改副属性
		}
		const subAttrDom = monDom.querySelector(".subproperty"); //副属性
		subAttrDom.setAttribute("data-property", subAttribute); //副属性
		subAttrDom.classList.toggle("changed-sub-attr", Boolean(changeAttr));

		monDom.title = "No." + monId + " " + (card.otLangName ? (card.otLangName[currentLanguage.searchlist[0]] || card.name) : card.name);
		monDom.href = currentLanguage.guideURL(monId, card.name);
		monDom.classList.toggle("allowable-assist", card.canAssist);; //可作为辅助

		monDom.classList.toggle("wepon", card.awakenings.includes(49));; //武器
	}
	const levelDom = monDom.querySelector(".level");
	if (levelDom) { //如果提供了等级
		if (mon.level) {
			const level = mon.level ?? 1;
			levelDom.setAttribute(dataAttrName, level);
	
			levelDom.classList.toggle("max", level === card.maxLevel);;
			//如果等级刚好等于最大等级，则修改为“最大”的字
			if (level >= 111 && level <= 120 && card.limitBreakIncr) {
				levelDom.setAttribute("data-level-range", "120");
			} else if (level >= 99 && level <= 110 && card.limitBreakIncr) {
				levelDom.setAttribute("data-level-range", "110");
			} else if (level > card.maxLevel) {
				levelDom.setAttribute("data-level-range", "error");
			} else {
				levelDom.setAttribute("data-level-range", "99");
			}
			levelDom.classList.remove(className_displayNone);
		} else {
			levelDom.classList.add(className_displayNone);
		}
	}
	const awokenIcon = monDom.querySelector(".awoken-count-num");
	if (awokenIcon) {
		awokenIcon.setAttribute(dataAttrName, mon.awoken || 0);
		if (mon.awoken != null) { //如果提供了觉醒
			awokenIcon.classList.toggle("full-awoken", card.awakenings.length > 0 && mon.awoken >= card.awakenings.length);;
		}else if(card.awakenings.length) {
			awokenIcon.classList.add("full-awoken");
		}
	}
	const sawoken = monDom.querySelector(".super-awoken");
	if (sawoken) { //如果存在超觉醒的DOM
		if (mon?.sawoken > 0 && //怪物超觉醒编号大于0
			//card.superAwakenings.length && //卡片有超觉醒
			mon.level >= 100 && //怪物大于100级
			mon.plus.every(p=>p>=99) //怪物297了
		) {
			sawoken.classList.remove(className_displayNone);
			const sawokenIcon = sawoken.querySelector(".awoken-icon");
			sawokenIcon.setAttribute("data-awoken-icon", mon.sawoken);
		} else {
			sawoken.classList.add(className_displayNone);
		}
	}
	const m_id = monDom.querySelector(".id");
	if (m_id) { //怪物ID
		m_id.textContent = monId;
	}
	const plusDom = monDom.querySelector(".plus");
	if (plusDom) //如果提供了加值，且怪物头像内有加值
	{
		const plusArr = {
			hp: mon?.plus?.[0] ?? 0,
			atk: mon?.plus?.[1] ?? 0,
			rcv: mon?.plus?.[2] ?? 0,
		};
		const plusCount = plusArr.hp + plusArr.atk + plusArr.rcv;
		if (plusCount <= 0) {
			plusDom.classList.add(className_displayNone);
		} else if (plusCount === 297) {
			plusDom.classList.add("has297");
			plusDom.classList.remove(className_displayNone);
		} else {
			plusDom.querySelector(".hp").textContent = plusArr.hp;
			plusDom.querySelector(".atk").textContent = plusArr.atk;
			plusDom.querySelector(".rcv").textContent = plusArr.rcv;
			plusDom.classList.remove("has297");
			plusDom.classList.remove(className_displayNone);
		}
	}
	if (latentDom) {
		if (mon.latent) //如果提供了潜觉
		{
			const level = mon.level ?? 1;
			const latent = mon.latent;
			if (latent.length < 1) {
				latentDom.classList.add(className_displayNone);
			} else {
				refreshLatent(latent, mon.id, latentDom, {sort:true});
				latentDom.classList.remove(className_displayNone);
			}
			latentDom.classList.toggle("level-super-break", level > 110);; //切换潜觉为120级
		} else {
			latentDom.classList.add(className_displayNone);
		}
	}

	const skillCdDom = monDom.querySelector(".skill-cd");
	if (skillCdDom) //如果存在技能CD DOM
	{
		skillCdDom.classList.toggle(className_displayNone, !card.activeSkillId);;
	}

	const switchLeaderDom = monDom.querySelector(".switch-leader");
	if (switchLeaderDom) //如果存在队长交换 DOM
	{
		const skills = getCardActiveSkills(card, [93, 227]); //更换队长的技能
		
		switchLeaderDom.classList.toggle(className_displayNone, !skills.length);;
	}

	const m_rarity = monDom.querySelector(".rarity");
	if (m_rarity) { //怪物ID
		m_rarity.setAttribute(dataAttrName,card.rarity);
	}

	const countInBox = monDom.querySelector(".count-in-box");
	if (countInBox && currentPlayerData) { //如果存在当前绑定用户数据
		function cardsCount(pre,cur) {
			return pre + cur.count;
		}
		let sameIdCount = currentPlayerData.parsedCards.filter(mon=>mon.id === monId).reduce(cardsCount, 0);
		
		monDom.setAttribute("data-box-have", sameIdCount === 0 ? 0 : 1);

		const countSameId = countInBox.querySelector(".same-id");
		if (countSameId) {
			countSameId.setAttribute("data-same-id", sameIdCount);
		}
		const countEvoTree = countInBox.querySelector(".evo-tree");
		if (countEvoTree) {
			let evoLinkCardsIdArray = buildEvoTreeIdsArray(card);
			let evoTreeCount = currentPlayerData.parsedCards.filter(mon=>evoLinkCardsIdArray.includes(mon.id)).reduce(cardsCount, 0);
			if (sameIdCount === 0 && evoTreeCount > 0) {
				monDom.setAttribute("data-box-have", 2);
			}
			countEvoTree.setAttribute("data-evo-tree", evoTreeCount - sameIdCount);
		}
	}

	//parentNode.appendChild(fragment);
}
//刷新潜觉
function refreshLatent(latents, monid, latentsNode, option) {
	const maxLatentCount = getMaxLatentCount(monid); //最大潜觉数量
	const iconArr = latentsNode.querySelectorAll('.latent-icon');
	latentsNode.classList.toggle("block-8", maxLatentCount>6);
	latents = latents.concat();
	if (option?.sort) latents.sort((a, b) => latentUseHole(b) - latentUseHole(a));
	let latentIndex = 0,
		usedHoleN = 0;
	for (let ai = 0; ai < iconArr.length; ai++) {
		const icon = iconArr[ai], latent = latents[latentIndex];
		if (latent != undefined && ai >= usedHoleN && ai < maxLatentCount) //有潜觉
		{
			const thisHoleN = latentUseHole(latent);
			icon.setAttribute("data-latent-icon", latent);
			icon.setAttribute("data-latent-hole", thisHoleN);
			usedHoleN += thisHoleN;
			latentIndex++;
		} else {
			icon.removeAttribute("data-latent-icon");
			icon.removeAttribute("data-latent-hole");
		}
	}
};
//点击怪物头像，出现编辑窗
function editMember(teamNum, isAssist, indexInTeam) {
	//数据
	const mon = formation.teams[teamNum][isAssist][indexInTeam];

	//设定编辑模式
	sessionStorage.setItem('editing',JSON.stringify([teamNum, isAssist, indexInTeam]));

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
	const monEditSAwokens = Array.from(monEditSAwokensRow.querySelectorAll(".awoken-ul input[name='sawoken-choice']")); //单选框，0号是隐藏的
	const noSAwokenRadio = settingBox.querySelector("#sawoken-choice-nosawoken"); //不选超觉醒的选项
	(monEditSAwokens.find(ipt=>mon.sawoken === parseInt(ipt.value,10)) || noSAwokenRadio).checked = true;
	monEditSAwokensRow.swaoken = mon.sawoken;

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
	skillLevel?.onchange();

	const editBoxTitle = editBox.querySelector(".edit-box-title");
	const btnDelay = editBox.querySelector(".button-box .button-delay");
	if (!isAssist) {
		editBox.latent = mon.latent ? mon.latent.concat() : [];
		editBox.refreshLatent(editBox.latent, mon.id);
	}
	rowMonLatent.classList.toggle(className_displayNone, isAssist);;
	editBoxTitle.classList.toggle("edit-box-title-assist", isAssist);;
	btnDelay.classList.toggle(className_displayNone, !isAssist);;

	editBox.reCalculateExp();
	if (mon.awoken !== undefined && monEditAwokens[mon.awoken])
		monEditAwokens[mon.awoken].click(); //涉及到觉醒数字的显示，所以需要点一下
	else
		editBox.reCalculateAbility();
}
//编辑窗，修改怪物ID
function editBoxChangeMonId(id) {
	const card = Cards[id] ?? Cards[0]; //怪物固定数据
	if (!card) { //如果搜不到怪物就直接返回，不做任何操作
		const errorMsg = "The game data has not been loaded successfully.\n游戏数据尚未加载成功。";
		alert(errorMsg);
		console.error(errorMsg);
		return;
	}
	if (card?.id === 0) {
		id = 0;
	}
	//const skill = Skills[card.activeSkillId];
	//const leaderSkill = Skills[card.leaderSkillId];

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
	mName.title = card.name;
	const mSeriesId = monInfoBox.querySelector(".monster-seriesId");
	mSeriesId.textContent = card.seriesId;
	mSeriesId.setAttribute(dataAttrName, card.seriesId);

	mSeriesId.classList.toggle(className_displayNone, !card.seriesId);;

	const mCollabId = monInfoBox.querySelector(".monster-collabId");
	mCollabId.textContent = card.collabId;
	mCollabId.setAttribute(dataAttrName, card.collabId);

	mCollabId.classList.toggle(className_displayNone, !card.collabId);;

	const mAltName = monInfoBox.querySelector(".monster-altName");
	//没有合作名就隐藏
	mAltName.classList.toggle(className_displayNone, card.altName.length < 1 && card?.otTags?.length < 1);;

	const evoLinkCardsIdArray = buildEvoTreeIdsArray(card);

	const createCardHead = editBox.createCardHead;
	const evoCardUl = settingBox.querySelector(".row-mon-id .evo-card-list");
	evoCardUl.classList.add(className_displayNone);
	evoCardUl.innerHTML = ""; //据说直接清空HTML性能更好
	const openEvolutionaryTree = settingBox.querySelector(".row-mon-id .open-evolutionary-tree");
	if (evoLinkCardsIdArray.length > 1) {
		let fragment = document.createDocumentFragment(); //创建节点用的临时空间
		evoLinkCardsIdArray.forEach(function(mid) {
			const cli = createCardHead(mid, {noTreeCount: true});
			if (mid == id) {
				cli.classList.add("unable-monster");
			}
			fragment.appendChild(cli);
		});
		evoCardUl.appendChild(fragment);
		evoCardUl.classList.remove(className_displayNone);
		openEvolutionaryTree.classList.remove(className_displayNone); //显示进化树按钮
	}else
	{
		openEvolutionaryTree.classList.add(className_displayNone); //隐藏进化树按钮
	}
	const searchEvolutionByThis = settingBox.querySelector(".row-mon-id .search-evolution-by-this");
	//对于进化型才显示
	searchEvolutionByThis.classList.toggle(className_displayNone, !card.types.includes(0));;

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
	monEditAwokensRow.classList.toggle("allowable-assist", card.canAssist);;
	for (let ai = 0; ai < mAwokenIcon.length; ai++) {
		if (ai < card.awakenings.length) {
			mAwokenIcon[ai].setAttribute("data-awoken-icon", card.awakenings[ai]);
		}
		mAwokenIcon[ai].classList.toggle(className_displayNone, ai >= card.awakenings.length);;
	}
	mAwokenIpt[card.awakenings.length].click(); //选择最后一个觉醒

	//超觉醒
	const monEditSAwokensRow = settingBox.querySelector(".row-mon-super-awoken");
	const monEditSAwokensUl = monEditSAwokensRow.querySelector(".awoken-ul");
	const monEditSAwokensIcons = Array.from(monEditSAwokensUl.querySelectorAll(".awoken-icon"));
	const noSAwokenRadio = settingBox.querySelector("#sawoken-choice-nosawoken"); //不选超觉醒的选项
	//获得之前的所有超觉醒
	const prevSAwokens = monEditSAwokensIcons.map(icon=>parseInt(icon.getAttribute("data-awoken-icon") || 0, 10)).filter(Boolean);

	function notCheckMyself() {
		const sawoken = parseInt(this.value, 10);
		if (monEditSAwokensUl.swaoken === sawoken && this != noSAwokenRadio) {
			noSAwokenRadio.click();
			monEditSAwokensUl.swaoken = 0;
			return false;
		} else {
			monEditSAwokensUl.swaoken = sawoken;
			const level = settingBox.querySelector(".row-mon-level .m-level");
			const plusArr = [...settingBox.querySelectorAll(".row-mon-plus input[type='number']")];
			if (sawoken > 0)
			{
				let recalFlag = false;
				//自动100级
				if (parseInt(level.value, 10)<100)
				{
					console.debug("点亮超觉醒，自动设定100级");
					level.value = 100;
					recalFlag = true;
				}
				//自动打上297
				if (plusArr.some(ipt=>parseInt(ipt.value, 10)<99))
				{
					console.debug("点亮超觉醒，自动设定297");
					plusArr.forEach(ipt=>ipt.value=99);
					recalFlag = true;
				}
				if (recalFlag) editBox.reCalculateAbility();
			}
		}
	}
	//怪物没有超觉醒时隐藏超觉醒
	monEditSAwokensRow.classList.toggle(className_displayNone, card.superAwakenings.length == 0);
	if (card.superAwakenings.length == prevSAwokens.length &&
		card.superAwakenings.every((sak, idx)=>sak===prevSAwokens[idx])
		)
	{
		//切换前后超觉相同，什么都不做
		//console.debug('与上一个超觉醒完全相同，不用修改超觉醒');
	} else {
		const optionIconTemplate = settingBox.querySelector('#sawoken-option-icon');
		monEditSAwokensUl.innerHTML = ''; //清空旧的超觉醒
		monEditSAwokensUl.swaoken = 0;
		card.superAwakenings.forEach((sak,idx)=>{
			const clone = document.importNode(optionIconTemplate.content, true);
			const input = clone.querySelector('input');
			const label = clone.querySelector('label');
			input.value = sak;
			input.onclick = notCheckMyself;
			label.setAttribute("data-awoken-icon", sak);
			const id = `sawoken-choice-${idx}`;
			input.id = id;
			label.setAttribute('for', id);
			monEditSAwokensUl.append(clone);
		});
		noSAwokenRadio.click(); //选中隐藏的空超觉
	}

	const monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	//monEditLvMax.textContent = monEditLvMax.value = card.maxLevel;
	monEditLvMax.value = card.maxLevel;
	const monEditLv = settingBox.querySelector(".m-level");
	monEditLv.max = card.limitBreakIncr ? 120 : card.maxLevel; //最大可设定等级
	monEditLv.value = Math.min(defaultLevel, card.limitBreakIncr ? 120 : card.maxLevel); //默认等级
	const monEditLv110 = settingBox.querySelector(".m-level-btn-110");
	const monEditLv120 = settingBox.querySelector(".m-level-btn-120");

	monEditLv110.setAttribute("data-limit-break-incr",card.limitBreakIncr);
	monEditLv110.classList.toggle(className_displayNone, !card.limitBreakIncr);;
	monEditLv120.classList.toggle(className_displayNone, !card.limitBreakIncr);;

	const mCost = settingBox.querySelector(".monster-cost");
	mCost.textContent = card.cost;

	const rowPlus = settingBox.querySelector(".row-mon-plus");
	const rowLatent = settingBox.querySelector(".row-mon-latent");
	const monLatentAllowUl = rowLatent.querySelector(".m-latent-allowable-ul");
	//该宠Type允许的杀，set不会出现重复的
	const allowLatent = getAllowLatent(card);

	const latentIcons = Array.from(monLatentAllowUl.querySelectorAll(`.latent-icon[data-latent-icon]`));
	latentIcons.forEach(icon => { //显示允许的潜觉，隐藏不允许的潜觉
		const ltId = parseInt(icon.getAttribute("data-latent-icon"),10);
		icon.classList.toggle("unallowable-latent", !allowLatent.includes(ltId));;
	});

	//怪物主动技能
	const rowSkill = settingBox.querySelector(".row-mon-skill");
	const skillBox = rowSkill.querySelector(".skill-box");
	const skillTitle = skillBox.querySelector(".skill-name");
	const skillCD = skillBox.querySelector(".skill-cd");
	const skillLevel = skillBox.querySelector(".m-skill-level");
	//const skillLevel_1 = skillBox.querySelector(".m-skill-lv-1");
	const skillLevel_Max = skillBox.querySelector(".m-skill-lv-max");
	const skillDetailParsed = skillBox.querySelector(".skill-datail-parsed");
	const skillDetailOriginal = skillBox.querySelector(".skill-datail-original");

	const activeskill = Skills[card.activeSkillId];
	const leaderSkill = Skills[card.leaderSkillId];
	let frg1 = document.createDocumentFragment(); //创建节点用的临时空间
	frg1.appendChild(skillBox);

	skillTitle.textContent = activeskill?.name;
	skillTitle.setAttribute("data-skillid", activeskill?.id);
	skillDetailOriginal.innerHTML = "";
	skillDetailOriginal.appendChild(parseSkillDescription(activeskill));

	const t_maxLevel = card.stacking ? 1 : activeskill?.maxLevel; //遇到不能升技的，最大等级强制为1
	skillLevel.max = t_maxLevel;
	skillLevel.value = t_maxLevel;
	skillLevel_Max.value = t_maxLevel;
	//skillLevel_Max.textContent = activeskill.maxLevel;
	skillCD.textContent = activeskill?.initialCooldown - t_maxLevel + 1;

	//怪物队长技能
	const rowLederSkill = settingBox.querySelector(".row-mon-leader-skill");
	const lskillBox = rowLederSkill.querySelector(".skill-box");
	const lskillTitle = lskillBox.querySelector(".skill-name");
	const lskillDetailParsed = lskillBox.querySelector(".skill-datail-parsed");
	const lskillDetailOriginal = lskillBox.querySelector(".skill-datail-original");

	let frg2 = document.createDocumentFragment(); //创建节点用的临时空间
	frg2.appendChild(lskillBox);

	lskillTitle.textContent = leaderSkill?.name;
	lskillTitle.setAttribute("data-skillid", leaderSkill?.id);
	lskillDetailOriginal.innerHTML = "";
	lskillDetailOriginal.appendChild(parseSkillDescription(leaderSkill));

	editBox.refreshSkillParse(skillDetailParsed, lskillDetailParsed);
	rowSkill.appendChild(frg1);
	rowLederSkill.appendChild(frg2);

	if (card.stacking || card.types.some(t=>[0,12,14,15].includes(t)) &&
		card.maxLevel <= 1) { //当可以叠加时，不能打297和潜觉
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
	editBox.latent = editBox.latent.filter(lat => allowLatent.includes(lat));
	editBox.refreshLatent(editBox.latent, id);
	editBox.reCalculateExp();
	editBox.reCalculateAbility();
}
//刷新整个队伍
function refreshAll(formationData) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const titleBox = formationBox.querySelector(".title-box");
	const detailBox = formationBox.querySelector(".detail-box");
	const formationTotalInfoDom = formationBox.querySelector(".formation-total-info"); //所有队伍能力值合计
	const formationAwokenDom = formationBox.querySelector(".formation-awoken"); //所有队伍觉醒合计
	const dungeonEnchanceDom = formationBox.querySelector(".dungeon-enchance"); //地下城强化

	fragment.append(...formationBox.childNodes);

	const txtTitle = titleBox.querySelector(".title-code");
	const txtDetail = detailBox.querySelector(".detail-code");
	txtTitle.value = formationData.title || "";
	txtDetail.value = formationData.detail || "";
	const txtTitleDisplay = titleBox.querySelector(".title-display");
	const txtDetailDisplay = detailBox.querySelector(".detail-display");
	txtTitleDisplay.innerHTML = '';
	txtTitleDisplay.append(descriptionToHTML(txtTitle.value));
	formationBox.refreshDocumentTitle();
	txtDetailDisplay.innerHTML = '';
	txtDetailDisplay.append(descriptionToHTML(txtDetail.value));
	
	//地下城强化的显示，稀有度没有现成的，所以这里来循环生成
	const dge = formationData.dungeonEnchance;
	if (Object.values(dge.rate).some(rate => rate != 1)) //如果有任何一个属性的比率不为1，才产生强化图标
	{
		dungeonEnchanceDom.innerHTML = '';
		if (dge.rarities.length > 0) {
			dge.rarities.forEach(rarity=>{
				const icon = dungeonEnchanceDom.appendChild(document.createElement("icon"));
				icon.className = "rare-icon";
				icon.setAttribute("data-rare-icon", rarity);
			})
		}
		if (dge.collabs.length) { //添加合作的ID名称
			dungeonEnchanceDom.appendChild(localTranslating?.skill_parse?.target?.collab_id({id:dge.collabs.join()}));
		}
		
		let skill = powerUp(dge.attrs, dge.types, p.mul({hp: dge.rate.hp * 100, atk: dge.rate.atk * 100, rcv: dge.rate.rcv * 100}));
		dungeonEnchanceDom.appendChild(renderSkill(skill));
		dungeonEnchanceDom.classList.remove(className_displayNone);
	}else
	{
		dungeonEnchanceDom.classList.add(className_displayNone);
	}

	teamBigBoxs.forEach((teamBigBox, teamNum) => {
		const teamBox = teamBigBox.querySelector(".team-box");
		const teamData = formationData.teams[teamNum];
		const badgeBox = teamBigBox.querySelector(".team-badge");
		if (badgeBox) {

			const badge = badgeBox.querySelector(`#team-${teamNum+1}-badge-${teamData[2] || 0}`);
			if (badge)
			{
				//为了解决火狐在代码片段里无法正确修改checked的问题，所以事先把所有的都切换到false
				const badges = Array.from(badgeBox.querySelectorAll(`.badge-radio`));
				badges.forEach(badge=>badge.checked = false);
				badge.checked = true;
			}
			
		}

		const membersDom = teamBox.querySelector(".team-members");
		const latentsDom = teamBox.querySelector(".team-latents");
		const assistsDom = teamBox.querySelector(".team-assist");
		const teamAbilityDom = teamBigBox.querySelector(".team-ability");
		const teamMemberTypesDom = teamBigBox.querySelector(".team-member-types"); //队员类型
		const teamMemberAwokenDom = teamBigBox.querySelector(".team-member-awoken"); //队员觉醒
		const teamAssistAwokenDom = teamBigBox.querySelector(".team-assist-awoken"); //辅助觉醒
		
		for (let ti = 0, ti_len = membersDom.querySelectorAll(".member").length; ti < ti_len; ti++) {
			const leaderIdx = teamData[3]; //开始设置换队长
			const memberLi = membersDom.querySelector(`.member-${ti+1}`);
			const latentLi = latentsDom.querySelector(`.latents-${ti+1}`);
			const assistsLi = assistsDom.querySelector(`.member-${ti+1}`);
			const teamAbilityLi = teamAbilityDom ? teamAbilityDom.querySelector(`.abilitys-${ti+1}`) : undefined;
			const teamMemberAwokenLi = teamAbilityDom ? teamMemberAwokenDom.querySelector(`.member-awoken-${ti+1}`) : undefined;
			const teamAssistAwokenLi = teamAbilityDom ? teamAssistAwokenDom.querySelector(`.member-awoken-${ti+1}`) : undefined;
			[memberLi,latentLi,assistsLi,teamAbilityLi,teamMemberAwokenLi,teamAssistAwokenLi].forEach(dom=>{
				if (!dom) return;
				if (leaderIdx > 0 && ti == 0) //队长
				{
					dom.style.transform = formation.teams.length == 2 && teamNum == 1 ? `translateX(${(5-leaderIdx)*-108}px)` : `translateX(${leaderIdx*108}px)`;
				}
				else if (leaderIdx > 0 && ti == leaderIdx) //队长员
				{
					dom.style.transform = formation.teams.length == 2 && teamNum == 1 ? `translateX(${(5-ti)*108}px)` : `translateX(${ti*-108}px)`;
				}else
				{
					dom.style.transform = null;
				}
			});
			//修改显示内容
			const memberDom = memberLi.querySelector(`.monster`);
			const assistDom = assistsLi.querySelector(`.monster`);
			const latentDom = latentLi.querySelector(`.latent-ul`);
			const member = teamData[0][ti], assist = teamData[1][ti];
			const memberCard = member.card, assistCard = assist.card;
			changeid(member, memberDom, latentDom, assist); //队员
			changeid(assist, assistDom); //辅助
			const enableBouns = member.id > 0 && assist.id > 0 && ( //基底和武器都不是空
				memberCard.attrs[0] === assistCard.attrs[0] || //如果主属性相等
				memberCard.attrs[0]===6 || assistCard.attrs[0]===6 //或任一为仅副属性
			);
			teamAbilityLi?.classList?.toggle("enable-bouns", enableBouns);

			//隐藏队长的自身换为换队长的技能
			if (ti == 5 || //好友队长永远隐藏
				leaderIdx == 0 && ti == 0 ) //当没换队长时，自身队长的欢队长技能隐藏
			{
				const skills_m = getCardActiveSkills(memberCard, [93, 227]); //更换队长的技能
				const skills_a = getCardActiveSkills(assistCard, [93, 227]); //更换队长的技能
				if (skills_m.length == 0 || skills_m[0].type != 227)
				{
					memberDom.querySelector(".switch-leader").classList.add(className_displayNone);
				}
				if (skills_a.length == 0 || skills_a[0].type != 227)
				{
					assistDom.querySelector(".switch-leader").classList.add(className_displayNone);
				}
			}
			refreshMemberSkillCD(teamBox, teamData, ti); //技能CD
			refreshAbility(teamAbilityDom, teamData, ti); //本人能力值
			refreshmemberAwoken(teamMemberAwokenDom, teamAssistAwokenDom, teamData, ti); //本人觉醒
			refreshmemberTypes(teamMemberTypesDom, teamData, ti); //本人类型

		}
		const teamTotalInfoDom = teamBigBox.querySelector(".team-total-info"); //队伍能力值合计
		if (teamTotalInfoDom) refreshTeamTotalHP(teamTotalInfoDom, teamData, teamNum);

		const teamAwokenDom = teamBigBox.querySelector(".team-awoken"); //队伍觉醒合计
		if (teamAwokenDom) refreshTeamAwokenCount(teamAwokenDom, teamData);
	});

	if (formationTotalInfoDom) refreshFormationTotalHP(formationTotalInfoDom, formation.teams);

	if (formationAwokenDom) refreshFormationAwokenCount(formationAwokenDom, formation.teams);

	formationBox.appendChild(fragment);
	// txtDetail.onblur(); //这个需要放在显示出来后再改才能生效
}

function awokenSetCount(aicon, number) {
	if (!aicon) return; //没有这个觉醒就撤回 
	const ali = aicon.parentNode;
	const countDom = ali.querySelector(".count");
	countDom.textContent = number;
	if (number)
		ali.classList.remove(className_displayNone);
	else
		ali.classList.add(className_displayNone);
}
//刷新队伍觉醒统计
function refreshTeamAwokenCount(awokenDom, team) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenUL = fragment.appendChild(awokenDom.querySelector(".awoken-ul"));

	const aicons = Array.from(awokenUL.querySelectorAll(`.awoken-icon[data-awoken-icon]`));
	const acs = aicons.map(aicon=>{
		const ai = parseInt(aicon.getAttribute("data-awoken-icon"),10);
		let totalNum = 0;
		//搜索等效觉醒
		const equivalentAwoken = equivalent_awoken.find(eak => eak.small === ai || eak.big === ai);
		if (equivalentAwoken)
		{
			if (equivalentAwoken.small === ai)
			{
				totalNum = awokenCountInTeam(team, equivalentAwoken.small, solo, teamsCount) +
					awokenCountInTeam(team, equivalentAwoken.big, solo, teamsCount) * equivalentAwoken.times;
			}
		} else
		{
			totalNum = awokenCountInTeam(team, ai, solo, teamsCount);
		}
		awokenSetCount(aicon, totalNum);
		return {a:ai,c:totalNum};
	});
	if (acs.every(ac=>ac.c==0))
	{
		awokenDom.classList.add(className_displayNone);
	} else
	{
		awokenDom.classList.remove(className_displayNone);
	}
	awokenDom.appendChild(fragment);
}
//刷新阵型觉醒统计
function refreshFormationAwokenCount(awokenDom, teams) {
	let fragment = document.createDocumentFragment(); //创建节点用的临时空间
	const awokenUL = fragment.appendChild(awokenDom.querySelector(".awoken-ul"));

	const aicons = Array.from(awokenUL.querySelectorAll(`.awoken-icon[data-awoken-icon]`));
	const acs = aicons.map(aicon=>{
		const ai = parseInt(aicon.getAttribute("data-awoken-icon"),10);
		let totalNum = 0;
		//搜索等效觉醒
		const equivalentAwoken = equivalent_awoken.find(eak => eak.small === ai || eak.big === ai);
		if (equivalentAwoken)
		{
			if (equivalentAwoken.small === ai)
			{
				totalNum = awokenCountInFormation(teams, equivalentAwoken.small, solo) +
					awokenCountInFormation(teams, equivalentAwoken.big, solo) * equivalentAwoken.times;
			}
		} else
		{
			totalNum = awokenCountInFormation(teams, ai, solo);
		}
		awokenSetCount(aicon, totalNum);
		return {a:ai,c:totalNum};
	});
	if (acs.every(ac=>ac.c==0))
	{
		awokenDom.classList.add(className_displayNone);
	} else
	{
		awokenDom.classList.remove(className_displayNone);
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
//刷新队员
function refreshmemberTypes(memberTypesDom, team, idx) {
	if (!memberTypesDom) return; //如果没有dom，直接跳过
	const member = team[0][idx];
	const assist = team[1][idx];
	const {types = [], appendType = false} = member.getAttrsTypesWithWeapon(assist) || {};
	const memberTypesUl = memberTypesDom.querySelector(`.member-types-${idx + 1} .types-ul`);
	memberTypesUl.innerHTML = '';
	for (let i = 0;i < types.length; i++) {
		const iconLi = document.createElement("li");
		const icon = iconLi.appendChild(document.createElement("icon"))
		icon.className = "type-icon";
		if (appendType && i == (types.length - 1)) icon.classList.add('append-type');
		icon.setAttribute("data-type-icon", types[i]);
		memberTypesUl.appendChild(iconLi);
	}
}
//刷新队员觉醒
function refreshmemberAwoken(memberAwokenDom, assistAwokenDom, team, idx) {
	if (!memberAwokenDom) return; //如果没有dom，直接跳过

	const memberData = team[0][idx];
	const assistData = team[1][idx];

	const memberCard = Cards[memberData.id] || Cards[0];
	const assistCard = Cards[assistData.id] || Cards[0];
	//队员觉醒
	let memberAwokens = memberCard?.awakenings?.slice(0,memberData.awoken) || [];
	//单人和三人为队员增加超觉醒
	if ((solo || teamsCount === 3) &&
		memberData.sawoken > 0 && //怪物超觉醒编号大于0
		//memberCard?.superAwakenings?.length > 0 && //卡片有超觉醒
		memberData.level >= 100 && //怪物大于100级
		memberData.plus.every(p=>p>=99) //怪物297了
	) {
		memberAwokens.push(memberData.sawoken);
	}
	//memberAwokens.sort();
	//武器觉醒
	let assistAwokens = assistCard?.awakenings?.slice(0,assistData?.awoken);
	if (!assistAwokens?.includes(49)) assistAwokens = []; //清空非武器的觉醒
	//assistAwokens.sort();
	/*if (assistAwokens.includes(49))
	{
		memberAwokens = memberAwokens.concat(assistAwokens);
	}*/

	const memberAwokenUl = memberAwokenDom.querySelector(`.member-awoken-${idx + 1} .awoken-ul`);
	const assistAwokenUl = assistAwokenDom.querySelector(`.member-awoken-${idx + 1} .awoken-ul`);
	/* //通用的
	function countNum(arr) {
		const map = arr.reduce(function(preMap, value){
			return preMap.set(value, (preMap.get(value) || 0) + 1);
		}, new Map());
		return Array.from(map);
	};*/
	function countAwokenNum(arr) {
		const map = arr.reduce(function(preMap, value){
			const eak = equivalent_awoken.find(eako => eako.big === value);
			if (eak)
			{
				return preMap.set(eak.small, (preMap.get(eak.small) || 0) + eak.times);
			}else
			{
				return preMap.set(value, (preMap.get(value) || 0) + 1);
			}
		}, new Map());
		return Array.from(map);
	};
	/*const hideAwokens = [49,1,2,3,63];
	if (solo) hideAwokens.push(30); //协力觉醒
	if (!solo) hideAwokens.push(63); //掉落觉醒
	memberAwokens = memberAwokens.filter(ak=>!hideAwokens.includes(ak));*/
	let memberAwokensCount = countAwokenNum(memberAwokens);
	memberAwokenUl.innerHTML = '';
	memberAwokensCount.forEach(akc=>{
		const iconLi = document.createElement("li");
		const icon = iconLi.appendChild(document.createElement("icon"))
		icon.className = "awoken-icon";
		icon.setAttribute("data-awoken-icon", akc[0]);
		icon.setAttribute("data-awoken-count", akc[1]);
		memberAwokenUl.appendChild(iconLi);
	});
	let assistAwokensCount = countAwokenNum(assistAwokens);
	assistAwokenUl.innerHTML = '';
	assistAwokensCount.forEach(akc=>{
		const iconLi = document.createElement("li");
		const icon = iconLi.appendChild(document.createElement("icon"))
		icon.className = "awoken-icon";
		icon.setAttribute("data-awoken-icon", akc[0]);
		icon.setAttribute("data-awoken-count", akc[1]);
		assistAwokenUl.appendChild(iconLi);
	});
}

function setTextContentAndAttribute(dom,str)
{
	if (!dom) return;
	dom.textContent = str;
	dom.setAttribute(dataAttrName, str);
}

function drawHpInfo(hpBarDom, reduceAttrRanges)
{
	const width = hpBarDom.width, height = hpBarDom.height;

	let ctx = hpBarDom.getContext("2d");
	if (reduceAttrRanges.some(r=>r != reduceAttrRanges[0])) //有指定属性减伤
	{
		const attrColors = ['crimson','cornflowerblue','green','goldenrod','purple'];
		reduceAttrRanges.forEach((reduceRanges, ridx)=>{
			//console.table(reduceRanges);
			ctx.fillStyle = attrColors[ridx];
			ctx.fillRect(0, height / 5 * ridx, width, height / 5 * (ridx + 1));

			reduceRanges.forEach(range=>{
				ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
				ctx.fillRect(width * (range.min / 100), height / 5 * ridx, width * (range.max / 100), height / 5 * (1 - range.scale));
			});
		});
	}
	else //只有阶梯盾
	{
		const reduceRanges = reduceAttrRanges[0];
		//创建线性颜色渐变对象
		const canvasGradient = ctx.createLinearGradient(0, 0, 0, height);
		canvasGradient.addColorStop(0, "#EE99AA");
		canvasGradient.addColorStop(0.4, "#FFDDEE");
		canvasGradient.addColorStop(1, "#EE9999");
		ctx.fillStyle = canvasGradient;
		ctx.fillRect(0, 0, width, height);
		
		reduceRanges.forEach(range=>{
			ctx.fillStyle = `rgba(204, 0 ,85, 0.7)`;
			ctx.fillRect(width * (range.min / 100), 0, width * ((range.max - range.min) / 100), height * (1 - range.scale));
		});
	}
}
//刷新队伍能力值合计
function refreshTeamTotalHP(totalDom, team, teamIdx) {
	//计算总的生命值
	if (!totalDom) return;
	const tHpDom = totalDom.querySelector(".tIf-total-hp");
	const tSBDom = totalDom.querySelector(".tIf-total-skill-boost");
	const tMoveDom = totalDom.querySelector(".tIf-total-move");
	const tEffectDom = totalDom.querySelector(".tIf-effect");

	const teams = formation.teams;

	const leader1id = team[0][team[3] || 0].id;
	const leader2id = teamsCount===2 ? (teamIdx === 1 ? teams[0][0][teams[0][3] || 0].id : teams[1][0][teams[1][3] || 0].id) : team[0][5].id;

	//计算当前队伍，2P时则是需要特殊处理
	const team_2p = teamsCount===2 ? team[0].concat((teamIdx === 1 ? teams[0][0][0] : teams[1][0][0])) : team[0];
	const assistTeam_2p = teamsCount===2 ? team[1].concat((teamIdx === 1 ? teams[0][1][0] : teams[1][1][0])) : team[1];

	if (tHpDom) {
		const reduceScales1 = getReduceScales(leader1id);
		const reduceScales2 = getReduceScales(leader2id);
		const reduceAttrRanges = getReduceRange(reduceScales1.concat(reduceScales2));
		//将所有范围平铺，然后选择盾最少那个作为基础盾值
		const leastScale = reduceAttrRanges.flat().sort((a,b)=>a.scale-b.scale)[0];

		const hpBar = totalDom.querySelector(".reduce-details");

		if (reduceAttrRanges.some(r=>r != reduceAttrRanges[0]) || reduceAttrRanges[0].length > 1 || reduceAttrRanges[0][0].probability < 1) //有阶梯盾或者有指定属性减伤或者减伤比例不是100%
		{
			drawHpInfo(hpBar, reduceAttrRanges);
			hpBar.classList.remove(className_displayNone);
		}else
		{
			hpBar.classList.add(className_displayNone);
		}

		const totalReduce = leastScale.scale;

		const teamHPArr = countTeamHp(team, leader1id, leader2id, solo);
		const teamHPNoAwokenArr = countTeamHp(team, leader1id, leader2id, solo, true);


		let tHP = teamHPArr.reduce((pv, v) => pv + v); //队伍计算的总HP
		let tHPNoAwoken = teamHPNoAwokenArr.reduce((pv, v) => pv + v); //队伍计算的总HP无觉醒

		const teamHPAwoken = awokenCountInTeam(team, 46, solo, teamsCount); //全队大血包个数

		let badgeHPScale = 1; //徽章倍率
		if (team[2] == 5 && (solo || teamsCount === 3)) {
			badgeHPScale = 1.05;
		} else if (team[2] == 18 && (solo || teamsCount === 3)) {
			badgeHPScale = 1.15;
		} else if (team[2] == 20 && (solo || teamsCount === 3)) {
			badgeHPScale = 1.10;
		}

		tHP = Math.round(Math.round(tHP * (1 + 0.05 * teamHPAwoken)) * badgeHPScale);
		tHPNoAwoken = Math.round(Math.round(tHPNoAwoken) * badgeHPScale);

		//记录到bar中，方便打开详情时调用
		hpBar.reduceAttrRanges = reduceAttrRanges;
		hpBar.tHP = tHP;
		hpBar.tHPNoAwoken = tHPNoAwoken;

		const tReduceHP = Math.floor(tHP / (1 - totalReduce)); //队伍正常满血加上盾能承受的最大伤害
		const tReduceHPNoAwoken = Math.floor(tHPNoAwoken / (1 - totalReduce)); //队伍封觉醒满血加上盾能承受的最大伤害

		const tHpDom_general = tHpDom.querySelector(".general");
		const tHpDom_noAwoken = tHpDom.querySelector(".awoken-bind");
		const tHpDom_reduce = tHpDom.querySelector(".reduce");

		setTextContentAndAttribute(tHpDom_general, tHP.bigNumberToString());
		setTextContentAndAttribute(tHpDom_noAwoken, tHPNoAwoken.bigNumberToString());
		if (totalReduce > 0)
			tHpDom_reduce.classList.remove("no-reduce");
		else
			tHpDom_reduce.classList.add("no-reduce");
		setTextContentAndAttribute(tHpDom_reduce.querySelector(".reduce-scale"), (totalReduce * 100).toFixed(2));
		setTextContentAndAttribute(tHpDom_reduce.querySelector(".general"), tReduceHP.bigNumberToString());
		setTextContentAndAttribute(tHpDom_reduce.querySelector(".awoken-bind"), tReduceHPNoAwoken.bigNumberToString());
	}

	if (tSBDom) {
		const sbn = countTeamSB(team, solo);
		const tSBDom_general = tSBDom.querySelector(".general");
		
		setTextContentAndAttribute(tSBDom_general, sbn);
	}

	if (tMoveDom) {
		const moveTime = countMoveTime(team, leader1id, leader2id, teamIdx);
		const tMoveDom_general = tMoveDom.querySelector(".general");
		const tMoveDom_noAwoken = tMoveDom.querySelector(".awoken-bind");
		
		if (moveTime.fixed) //固定时间的
		{
			tMoveDom.classList.add("fixed-move-time");
			setTextContentAndAttribute(tMoveDom_general, moveTime.duration.leader);
			setTextContentAndAttribute(tMoveDom_noAwoken, moveTime.duration.leader);
		} else
		{
			tMoveDom.classList.remove("fixed-move-time");
			setTextContentAndAttribute(tMoveDom_general, (moveTime.duration.default + moveTime.duration.leader + moveTime.duration.badge + moveTime.duration.awoken).keepCounts());
			setTextContentAndAttribute(tMoveDom_noAwoken, (moveTime.duration.default + moveTime.duration.leader + moveTime.duration.badge).keepCounts());
		}
	}

	const tRarityDom = totalDom.querySelector(".tIf-rarity");
	const tAttrsDom = totalDom.querySelector(".tIf-attrs");
	const tTypesDom = totalDom.querySelector(".tIf-types");
	//统计队伍稀有度总数
	if (tRarityDom)
	{
		const rarityDoms = tRarityDom.querySelector(".rarity");
		const rarityCount = team[0].slice(0,5).reduce((pre,member)=>{
			if (member.id <= 0) return pre;
			const card = Cards[member.id] || Cards[0];
			return pre + (card?.rarity ?? 0);
		},0);
		rarityDoms.setAttribute(dataAttrName, rarityCount);
	}
	//统计队伍属性/类型个数
	if (tAttrsDom || tTypesDom)
	{
		const {attrs, types} = countTeamTotalAttrsTypes(team_2p, assistTeam_2p);
		if (tAttrsDom) {
			const attrDoms = Array.from(tAttrsDom.querySelectorAll(".attr"));
			attrDoms.forEach(attrDom=>{
				const attrId = parseInt(attrDom.getAttribute("data-attr-icon"));
				attrDom.setAttribute(dataAttrName, attrs[attrId] || 0);
			});
		}
		if (tTypesDom) {
			const typeDoms = Array.from(tTypesDom.querySelectorAll(".type-icon"));
			typeDoms.forEach(typeDom=>{
				const typeId = parseInt(typeDom.getAttribute("data-type-icon"));
				typeDom.setAttribute(dataAttrName, types[typeId] || 0);
			});
		}
	}

	if (tEffectDom)	{
		const _76board = tEffectDom.querySelector("._76board");
		//76版队长技能不被欢队长所影响
		const leader1id_original = team[0][0].id;
		const leader2id_original = teamsCount===2 ? (teamIdx === 1 ? teams[0][0][0].id : teams[1][0][0].id) : team[0][5].id;
		if (tIf_Effect_76board(leader1id_original,leader2id_original))
		{
			_76board.classList.remove(className_displayNone);
		}else
		{
			_76board.classList.add(className_displayNone);
		}
		const noSkyfall = tEffectDom.querySelector(".no-skyfall");
		if (tIf_Effect_noSkyfall(leader1id,leader2id))
		{
			noSkyfall.classList.remove(className_displayNone);
		}else
		{
			noSkyfall.classList.add(className_displayNone);
		}
		const poisonNoEffect = tEffectDom.querySelector(".poison-no-effect");
		if (tIf_Effect_poisonNoEffect(leader1id,leader2id))
		{
			poisonNoEffect.classList.remove(className_displayNone);
		}else
		{
			poisonNoEffect.classList.add(className_displayNone);
		}
		const addCombo = tEffectDom.querySelector(".add-combo");
		const addComboValue = tIf_Effect_addCombo(leader1id,leader2id);
		if ((addComboValue[0] | addComboValue[1]) > 0)
		{
			addCombo.classList.remove(className_displayNone);
			addCombo.setAttribute("data-add-combo", addComboValue.filter(v=>v).join("/"));
		}else
		{
			addCombo.classList.add(className_displayNone);
		}
		const inflicts = tEffectDom.querySelector(".inflicts");
		const inflictsValue = tIf_Effect_inflicts(leader1id,leader2id);
		if ((inflictsValue[0] | inflictsValue[1]) > 0)
		{
			inflicts.classList.remove(className_displayNone);
			inflicts.setAttribute("data-inflicts", inflictsValue.filter(v=>v).map(v=>v.bigNumberToString()).join("/"));
		}else
		{
			inflicts.classList.add(className_displayNone);
		}
	}
}
//刷新所有队伍能力值合计
function refreshFormationTotalHP(totalDom, teams) {
	//计算总的生命值
	if (!totalDom) return;
	const tHpDom = totalDom.querySelector(".tIf-total-hp");
	const tSBDom = totalDom.querySelector(".tIf-total-skill-boost");
	const tEffectDom = totalDom.querySelector(".tIf-effect");
	
	//因为目前仅用于2P，所以直接在外面固定写了
	const leader1id = teams[0][0][teams[0][3] || 0].id;
	const leader2id = teams[1][0][teams[1][3] || 0].id;

	if (tHpDom) {

		const reduceScales1 = getReduceScales(leader1id);
		const reduceScales2 = getReduceScales(leader2id);
		const reduceAttrRanges = getReduceRange(reduceScales1.concat(reduceScales2));
		//将所有范围平铺，然后选择盾最少那个作为基础盾值
		const leastScale = reduceAttrRanges.flat().sort((a,b)=>a.scale-b.scale)[0];

		const hpBar = totalDom.querySelector(".reduce-details");

		if (reduceAttrRanges.some(r=>r != reduceAttrRanges[0]) || reduceAttrRanges[0].length > 1 || reduceAttrRanges[0][0].probability < 1) //有阶梯盾或者有指定属性减伤或者减伤比例不是100%
		{
			drawHpInfo(hpBar, reduceAttrRanges);
			hpBar.classList.remove(className_displayNone);
		}else
		{
			hpBar.classList.add(className_displayNone);
		}

		const totalReduce = leastScale.scale;

		const tHPArr = teams.map(function(team) {
			const teamHPArr = countTeamHp(team, leader1id, leader2id, solo);


			const teamTHP = teamHPArr.reduce((pv, v) => pv + v); //队伍计算的总HP
			const teamHPAwoken = awokenCountInTeam(team, 46, solo, teamsCount); //全队大血包个数

			return Math.round(teamTHP * (1 + 0.05 * teamHPAwoken));
		});
		const tHPNoAwokenArr = teams.map(function(team) {
			const teamHPArr = countTeamHp(team, leader1id, leader2id, solo, true);

			const teamTHP = teamHPArr.reduce((pv, v) => pv + v); //队伍计算的总HP
			return Math.round(teamTHP);
		});
		const tHP = tHPArr.reduce((pv, v) => pv + v);
		const tHPNoAwoken = tHPNoAwokenArr.reduce((pv, v) => pv + v);

		//记录到bar中，方便打开详情时调用
		hpBar.reduceAttrRanges = reduceAttrRanges;
		hpBar.tHP = tHP;
		hpBar.tHPNoAwoken = tHPNoAwoken;

		const tReduceHP = Math.floor(tHP / (1 - totalReduce)); //队伍正常满血加上盾能承受的最大伤害
		const tReduceHPNoAwoken = Math.floor(tHPNoAwoken / (1 - totalReduce)); //队伍封觉醒满血加上盾能承受的最大伤害

		const tHpDom_general = tHpDom.querySelector(".general");
		const tHpDom_noAwoken = tHpDom.querySelector(".awoken-bind");
		const tHpDom_reduce = tHpDom.querySelector(".reduce");

		setTextContentAndAttribute(tHpDom_general, tHP.bigNumberToString());
		setTextContentAndAttribute(tHpDom_noAwoken, tHPNoAwoken.bigNumberToString());
		if (totalReduce > 0)
			tHpDom_reduce.classList.remove("no-reduce");
		else
			tHpDom_reduce.classList.add("no-reduce");
		setTextContentAndAttribute(tHpDom_reduce.querySelector(".reduce-scale"), (totalReduce * 100).toFixed(2));
		setTextContentAndAttribute(tHpDom_reduce.querySelector(".general"), tReduceHP.bigNumberToString());
		setTextContentAndAttribute(tHpDom_reduce.querySelector(".awoken-bind"), tReduceHPNoAwoken.bigNumberToString());
	}
	
	if (tSBDom) {
		const sbn1 = countTeamSB(teams[0], solo);
		const sbn2 = countTeamSB(teams[1], solo);
		const tSBDom_general = tSBDom.querySelector(".general");
		
		setTextContentAndAttribute(tSBDom_general, sbn1 + sbn2);
	}

	if (tEffectDom)	{
		const _76board = tEffectDom.querySelector("._76board");
		//76版队长技能不被欢队长所影响
		const leader1id_original = teams[0][0][0].id;
		const leader2id_original = teams[1][0][0].id;
		if (tIf_Effect_76board(leader1id_original,leader2id_original))
		{
			_76board.classList.remove(className_displayNone);
		}else
		{
			_76board.classList.add(className_displayNone);
		}
		const noSkyfall = tEffectDom.querySelector(".no-skyfall");
		if (tIf_Effect_noSkyfall(leader1id,leader2id))
		{
			noSkyfall.classList.remove(className_displayNone);
		}else
		{
			noSkyfall.classList.add(className_displayNone);
		}
		const poisonNoEffect = tEffectDom.querySelector(".poison-no-effect");
		if (tIf_Effect_poisonNoEffect(leader1id,leader2id))
		{
			poisonNoEffect.classList.remove(className_displayNone);
		}else
		{
			poisonNoEffect.classList.add(className_displayNone);
		}
		const addCombo = tEffectDom.querySelector(".add-combo");
		const addComboValue = tIf_Effect_addCombo(leader1id,leader2id);
		if ((addComboValue[0] | addComboValue[1]) > 0)
		{
			addCombo.classList.remove(className_displayNone);
			addCombo.setAttribute("data-add-combo", addComboValue.filter(v=>v).join("/"));
		}else
		{
			addCombo.classList.add(className_displayNone);
		}
		const inflicts = tEffectDom.querySelector(".inflicts");
		const inflictsValue = tIf_Effect_inflicts(leader1id,leader2id);
		if ((inflictsValue[0] | inflictsValue[1]) > 0)
		{
			inflicts.classList.remove(className_displayNone);
			inflicts.setAttribute("data-inflicts", inflictsValue.filter(v=>v).map(v=>v.bigNumberToString()).join("/"));
		}else
		{
			inflicts.classList.add(className_displayNone);
		}
	}
}
//刷新单人技能CD
function refreshMemberSkillCD(teamDom, team, idx) {
	const memberMonDom = teamDom.querySelector(`.team-members .member-${idx+1} .monster`);
	const assistMonDom = teamDom.querySelector(`.team-assist .member-${idx+1} .monster`);
	const member = team[0][idx];
	const assist = team[1][idx];

	const memberCard = Cards[member.id] || Cards[0];
	const memberSkill = Skills[memberCard?.activeSkillId];
	const assistCard = Cards[assist.id] || Cards[0];
	const assistSkill = Skills[assistCard?.activeSkillId];

	const memberSkillCdDom = memberMonDom.querySelector(".skill-cd");
	const assistSkillCdDom = assistMonDom.querySelector(".skill-cd");

	const memberSkillCd = memberSkill ? (memberSkill.initialCooldown - (member.skilllevel || memberSkill.maxLevel) + 1) : 0;
	const assistSkillCd = assistSkill ? (assistSkill.initialCooldown - (assist.skilllevel || assistSkill.maxLevel) + 1) : 0;
	memberSkillCdDom.textContent = memberSkillCd;
	assistSkillCdDom.textContent = memberSkillCd + assistSkillCd;

	if (member?.skilllevel != undefined && member?.skilllevel < memberSkill?.maxLevel) {
		memberSkillCdDom.classList.remove("max-skill");
	} else {
		memberSkillCdDom.classList.add("max-skill");
	}
	if (assist?.skilllevel != undefined && assist?.skilllevel < assistSkill?.maxLevel) {
		assistSkillCdDom.classList.remove("max-skill");
	} else {
		assistSkillCdDom.classList.add("max-skill");
	}
}

//按住Ctrl点击技能在控制台输出技能的对象
function fastShowSkill(event) {
	const skillId = parseInt(this.getAttribute("data-skillid"), 10); //获得当前技能ID
	if (event.ctrlKey) {
		const skillId = parseInt(this.getAttribute("data-skillid"), 10);
		console.debug(Skills[skillId]);
		return;
	};
	const s_cards = Cards.filter(card => card.activeSkillId === skillId || card.leaderSkillId === skillId); //搜索同技能怪物
	if (s_cards.length > 1) {
		showSearch(s_cards); //显示
	}
}

function localisation($tra) {
	if (!$tra) return;
	document.title = $tra.webpage_title;
	formationBox.querySelector(".title-box .title-code").placeholder = $tra.title_blank;
	formationBox.querySelector(".detail-box .detail-code").placeholder = $tra.detail_blank;
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