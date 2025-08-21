let merge_skill = false;

class Attributes {
	static "0" = "Fire";
	static "1" = "Water";
	static "2" = "Wood";
	static "3" = "Light";
	static "4" = "Dark";
	static "5" = "Heart";
	static "6" = "Jammer";
	static "7" = "Poison";
	static "8" = "MPoison";
	static "9" = "Bomb";
	static Fire = 0;
	static Water = 1;
	static Wood = 2;
	static Light = 3;
	static Dark = 4;
	static Heart = 5;
	static Jammer = 6;
	static Poison = 7;
	static MPoison = 8;
	static Bomb = 9;
	static get all() {
		return [
			Attributes.Fire,
			Attributes.Water,
			Attributes.Wood,
			Attributes.Light,
			Attributes.Dark
		];
	}
	static get _6color() {
		return [
			Attributes.Fire,
			Attributes.Water,
			Attributes.Wood,
			Attributes.Light,
			Attributes.Dark,
			Attributes.Heart
		];
	}
	static get orbs() {
		return [
			Attributes.Fire,
			Attributes.Water,
			Attributes.Wood,
			Attributes.Light,
			Attributes.Dark,
			Attributes.Heart,
			Attributes.Jammer,
			Attributes.Poison,
			Attributes.MPoison,
			Attributes.Bomb
		];
	}
}

//代码来自于 https://www.jianshu.com/p/3644833bca33
function isEqual(obj1,obj2) {
	//判断是否是对象或数组
	function isObject(obj) {
		return typeof obj === 'object' && obj !== null;
	}
	// 两个数据有任何一个不是对象或数组
	if (!isObject(obj1) || !isObject(obj2)) {
		// 值类型(注意：参与equal的一般不会是函数)
		return obj1 === obj2;
	}
	// 如果传的两个参数都是同一个对象或数组
	if (obj1 === obj2) {
		return true;
	}

	// 两个都是对象或数组，而且不相等
	// 1.先比较obj1和obj2的key的个数，是否一样
	const obj1Keys = Object.keys(obj1);
	const obj2Keys = Object.keys(obj2);
	if (obj1Keys.length !== obj2Keys.length) {
		return false;
	}

	// 如果key的个数相等,就是第二步
	// 2.以obj1为基准，和obj2依次递归比较
	for (let key in obj1) {
		// 比较当前key的value  --- 递归
		const res = isEqual(obj1[key], obj2[key]);
		if (!res) {
			return false;
		}
	}

	// 3.全相等
	return true
}
class Orb
{
	attr = null;
	//states = {
	//	enhanced: false, //强化
	//	locked: false, //锁定
	//	unmatchable: false, //禁止消除
	//}
	states = new Set();
	constructor(attr = null)
	{
		this.attr = attr;
	}
	valueOf() {
		return this.attr;
	}
}
class Block
{
	//states = {
	//	cloud: false, //云
	//	roulette: false, //轮盘变化
	//}
	states = new Set();
}
class BoardSet
{
	boards = [];
	boardsLabel = [];
	node = (()=>{
		const div = document.createElement("div");
		div.className = "board-set";
		return div;
	})();
	constructor(...boards) {
		const boardSet = this;

		boardSet.boards.push(...(boards.filter(board=>board instanceof Board)));
		boardSet.boards.forEach((board, idx)=>{
			boardSet.node.appendChild(board.tableNode);
			const span = document.createElement("span");
			span.dataset.columnCount = board.columnCount;
			span.dataset.rowCount = board.rowCount;
			boardSet.boardsLabel.push(span);
			boardSet.node.appendChild(span);
			if (idx > 0) {
				board.tableNode.classList.add(className_displayNone);
			}
		});
		const span = document.createElement("span");
		span.className = "show-all-board";
		span.onclick = function(){
			boardSet.boards.forEach(board=>board.tableNode.classList.remove(className_displayNone));
			this.classList.add(className_displayNone);
		};
		boardSet.node.appendChild(span);
	}
	valueOf() {
		return this.node;
	}
}
class Board
{
	rowCount = 0;
	columnCount = 0;
	orbsData = [];
	blocksData = [];
	tableNode = document.createElement("table");
	constructor(def = null, columnCount = 6, rowCount = 5)
	{
		const intAttr = typeof(def) == "number" ? def : void 0;
		this.rowCount = Number(rowCount);
		this.columnCount = Number(columnCount);

		this.orbsData = new Array(this.rowCount);
		this.blocksData = new Array(this.rowCount);
		for (let ri=0; ri<this.rowCount; ri++)
		{
			const orbCol = new Array(this.columnCount), blockCol = new Array(this.columnCount);
			for (let ci=0; ci<this.columnCount; ci++)
			{
				orbCol[ci] = new Orb(intAttr);
				blockCol[ci] = new Block();
			}
			this.orbsData[ri] = orbCol;
			this.blocksData[ri] = blockCol;
		}
		//如果传入的是数组，直接随机分布
		if (Array.isArray(def))
		{
			this.randomFill(def);
		}
		const table = this.tableNode;
		table.boardData = this;
		table.className = "board";
		for (let ri=0; ri<this.rowCount; ri++)
		{
			const row = table.insertRow();
			for (let ci=0; ci<this.columnCount; ci++)
			{
				const cell = row.insertCell();
				cell.className = "block";
				const orbIcon = cell.appendChild(document.createElement('icon'));
				orbIcon.className = "orb";
			}
		}
	}
	//获取指定行号
	getTargetRowIndex(rowIndex)
	{
		switch (this.rowCount) {
			case 6: return rowIndex >= 2 ? rowIndex + 1 : rowIndex;
			case 4: return rowIndex >= 3 ? rowIndex - 1 : rowIndex;
			case 5: default: return rowIndex;
		}
	}
	//获取指定列号
	getTargetColumnIndex(columnIndex)
	{
		switch (this.columnCount) {
			case 7: return columnIndex >= 3 ? columnIndex + 1 : columnIndex;
			case 5: return columnIndex >= 3 ? columnIndex - 1 : columnIndex;
			case 6: default: return columnIndex;
		}
	}
	setOrbAndBlock(orb, block, attr, state, blockState)
	{
		if (orb instanceof Orb) {
			if (typeof(attr) == 'number' && !orb.states.has('locked'))
				orb.attr = attr;
			if (typeof(state) == 'string')
				orb.states.add(state);
		}
		if (block instanceof Block && typeof(blockState) == 'string')
			block.states.add(blockState);
	}
	//设定横行
	setRows(rows, attrs, state, blockState)
	{
		if (!Array.isArray(attrs)) attrs = [attrs];
		for (let ri of rows)
		{
			ri = this.getTargetRowIndex(ri);
			const orbsRow = this.orbsData[ri], blocksRow = this.blocksData[ri];
			for (let ci=0; ci<this.columnCount; ci++)
			{
				this.setOrbAndBlock(orbsRow[ci], blocksRow[ci], attrs.randomItem(), state, blockState);
			}
		}
	}
	//设定竖列
	setColumns(cols, attrs, state, blockState)
	{
		if (!Array.isArray(attrs)) attrs = [attrs];
		for (let ci of cols)
		{
			ci = this.getTargetColumnIndex(ci);
			for (let ri=0; ri<this.rowCount; ri++)
			{
				const orbsRow = this.orbsData[ri], blocksRow = this.blocksData[ri];

				this.setOrbAndBlock(orbsRow[ci], blocksRow[ci], attrs.randomItem(), state, blockState);
				if (blockState == 'immobility') { //如果是封条，额外添加需要旋转的信息
					this.setOrbAndBlock(orbsRow[ci], blocksRow[ci], attrs.randomItem(), state, 'rotate');
				}
			}
		}
	}
	//设定形状
	setShape(matrix, attrs, state, blockState)
	{
		if (!Array.isArray(attrs)) attrs = [attrs];
		//const setOrb = typeof(state) == 'number';
		function fillRow(ri, inputRow)
		{
			const orbsRow = this.orbsData[ri], blocksRow = this.blocksData[ri];
			for (let ci of inputRow)
			{
				ci = this.getTargetColumnIndex(ci);
				if (this.columnCount >= 7 && ci == 4)
				{
					this.setOrbAndBlock(orbsRow[ci - 1], blocksRow[ci - 1], attrs.randomItem(), state, blockState);
				}
				this.setOrbAndBlock(orbsRow[ci], blocksRow[ci], attrs.randomItem(), state, blockState);
			}
		}
		for (let i=0; i<matrix.length; i++)
		{
			let ri = this.getTargetRowIndex(i);
			if (this.rowCount >= 6 && ri == 3)
			{
				fillRow.call(this, ri - 1, matrix[i]);
			}
			fillRow.call(this, ri, matrix[i]);
		}
	}
	//洗版的填充
	randomFill(attrs)
	{
		if (!Array.isArray(attrs) && typeof(attrs) == 'number')
			attrs = [attrs];
		//获得随机排列的数据
		let attrArray = new Array(this.rowCount * this.columnCount);
		//每种颜色至少3个
		for (let i=0; i<attrs.length; i++) {
			attrArray.fill(attrs[i], i * 3, (i + 1) * 3);
		}
		//随机填充剩下的
		for (let i=attrs.length*3; i<attrArray.length; i++) {
			attrArray[i] = attrs.length == 1 ?
						attrs[0] :
						attrs[Math.floor(Math.random() * attrs.length)];
		}
		attrArray.shuffle(); //整体随机分布一次
		const flatOrbsData = this.orbsData.flat();
		flatOrbsData.forEach((orb, idx)=>{
			if (!orb.states.has('locked'))
				orb.attr = attrArray[idx];
		});
	}
	//生成珠子的填充
	generateOrbs(attrs, count, exclude, state)
	{
		if (!Array.isArray(attrs) && typeof(attrs) == 'number')
			attrs = [attrs];
		if (!Array.isArray(exclude) && typeof(exclude) == 'number')
			exclude = [exclude];

		let flatOrbsData = this.orbsData.flat()
		if (exclude?.length) flatOrbsData = flatOrbsData.filter(orb=>!exclude.includes(orb.attr));
		flatOrbsData.shuffle(); //将所有排除的格子打乱

		if (!state) { //未输入状态时，为产生珠子
			const attrArray = attrs?.length ? attrs.map(attr=>new Array(count).fill(attr)).flat() : [];
			//有属性时，使用产生珠子的长度；如果没有属性时，就保留1个长度，用来添加状态；但是都不能大于排除的宝珠数。
			const maxLength = Math.min(attrArray.length, flatOrbsData.length);
			//直接填充
			for (let i=0; i<maxLength; i++) {
				this.setOrbAndBlock(flatOrbsData[i], null, attrArray[i]);
			}
		} else {
			//在板面上查询符合的颜色
			flatOrbsData = flatOrbsData.filter(orb=>attrs.includes(orb.attr));
			const maxLength = Math.min(count, flatOrbsData.length);
			for (let i=0; i<maxLength; i++) {
				this.setOrbAndBlock(flatOrbsData[i], null, null, state);
			}
		}
	}
	//生成板面状态
	generateBlockStates(blockState, count = 1, size = [1,1], position = [0, 0])
	{
		for (let i=0; i<count; i++) {
			let [width, height] = size, [x, y] = position;
			if (!x) x = Math.randomInteger(this.columnCount - width); else x--;
			if (!y) y = Math.randomInteger(this.rowCount - height); else y--;
			for (let hi=0; hi<height; hi++) {
				for (let wi=0; wi<width; wi++) {
					this.setOrbAndBlock(null, this.blocksData[y+hi][x+wi], null, null, blockState);
				}
			}
		}
	}
	//导出数组
	valueOf()
	{
		return this.orbsData;
	}
	//输出表格
	refreshTable()
	{
		const table = this.tableNode;
		table.dataset.rowCount = this.rowCount;
		table.dataset.columnCount = this.columnCount;
		for (let ri=0; ri<this.rowCount; ri++)
		{
			const orbsRow = this.orbsData[ri], blocksRow = this.blocksData[ri];
			const row = table.rows[ri];
			for (let ci=0; ci<this.columnCount; ci++)
			{
				const cell = row.cells[ci], orbIcon = cell.querySelector("icon");
				const orbObj = orbsRow[ci], blockObj = blocksRow[ci];
				if (orbObj.attr != null)
					orbIcon.setAttribute("data-orb-icon", orbObj.attr);
				else
					orbIcon.removeAttribute("data-orb-icon");

				orbIcon.classList.add(...orbObj.states);
				cell.classList.add(...blockObj.states);
			}
		}
		return table;
	}
}

const SkillTarget = {
	type1: ["self","leader-self","leader-helper","sub-members"],
	type2: ["right-neighbor","left-neighbor","self"],
};

const SkillValue = {
	isLess: function (value) {
		if (value.kind === SkillValueKind.Percent) return value.value < 1;
		if (value.kind === SkillValueKind.Constant) return value.value < 0;
		return false;
	}
};

const SkillValueKind = {
	Percent: 'mul',
	Constant: 'const',
	ConstantTo: 'const-to',
	xMaxHP: 'mul-maxhp',
	xHP: 'mul-hp',
	xCHP: 'mul-chp',
	xATK: 'mul-atk',
	xRCV: 'mul-rcv',
	RandomATK: 'random-atk',
	HPScale: 'hp-scale',
	xTeamHP: 'mul-team-hp',
	xTeamATK: 'mul-team-atk',
	xTeamRCV: 'mul-team-rcv',
	xAwakenings: 'mul-awakenings',
};

const SkillPowerUpKind = {
	Multiplier: 'mul',
	ScaleAttributes: 'scale-attrs',
	ScaleCombos: 'scale-combos',
	ScaleMatchLength: 'scale-match-len',
	ScaleMatchAttrs: 'scale-match-attrs',
	ScaleCross: 'scale-cross',
	ScaleRemainOrbs: 'scale-remain-orbs',
	ScaleStateKind: 'scale-state-kind',
};

const SkillKinds = {
	Error: "error",
	Unknown: "unknown",
	ActiveTurns: "active-turns",
	DelayActiveTurns: "delay-active-turns",
	DamageEnemy: "damage-enemy",
	Vampire: "vampire",
	ReduceDamage: "reduce-damage",
	SelfHarm: "self-harm",
	Heal: "heal",
	AutoHealBuff: "auto-heal-buff",
	ChangeOrbs: "change-orbs",
	GenerateOrbs: "generate-orbs",
	FixedOrbs: "fixed-orbs",
	PowerUp: "power-up",
	SlotPowerUp: "slot-power-up",
	CounterAttack: "counter-attack",
	SetOrbState: "set-orb-state",
	RateMultiply: "rate-mul",
	OrbDropIncrease: "orb-drop-incr",
	Resolve: "resolve",
	Delay: "delay",
	DefenseBreak: "def-break",
	MassAttack: "mass-attack",
	BoardChange: "board-change",
	Unbind: "unbind",
	BindSkill: "bind-skill",
	BindCard: "bind-card",
	RandomSkills: "random-skills",
	EvolvedSkills: "evolved-skills",
	ChangeAttribute: "change-attr",
	SkillBoost: "skill-boost",
	AddCombo: "add-combo",
	VoidEnemyBuff: "void-enemy-buff",
	Poison: "poison",
	CTW: "ctw",
	Gravity: "gravity",
	FollowAttack: "follow-attack",
	FollowAttackFixed: "follow-attack-fixed",
	AutoHeal: "auto-heal",
	TimeExtend: "time-extend",
	DropRefresh: "drop-refresh",
	LeaderChange: "leader-change",
	MinMatchLength: "min-match-len",
	FixedTime: "fixed-time",
	Drum: "drum",
	AutoPath: "auto-path",
	BoardSizeChange: "board-size-change",
	NoSkyfall: "no-skyfall",
	Henshin: "henshin",
	VoidPoison: "void-poison",
	SkillProviso: "skill-proviso",
	ImpartAwakenings: "impart-awakenings",
	ObstructOpponent: "obstruct-opponent",
	IncreaseDamageCapacity: "increase-damage-cap",
	BoardJammingStates: "board-jamming-states",
	RemoveAssist: "remove-assist",
	PredictionFalling: "prediction-falling",
	BreakingShield: "breaking-shield",
	PlayVoice: "play-voice",
	TimesLimit: "times-limit",
	FixedStartingPosition: "fixed-starting-position",
	PartGravity: "part-gravity",
}

function skillParser(skillId)
{
	function merge(skills)
	{
		//主动技部分的合并
		let activeTurns = skills.filter(skill=>skill.kind == SkillKinds.ActiveTurns);
		if (activeTurns.length>1)
		{ //把后面的全都合并到第一个
			//按回合数拆分组
			let diffTurnsGroup = activeTurns.groupBy((a,b)=>a.turns === b.turns);
			let diffTurnsSkills = diffTurnsGroup.flatMap(group=>{
				if (group.length>1) { //大于一个技能的可以合并
					group[0].skills = group.flatMap(s=>s.skills);
					// group.reduce((pre,cur)=>{
					// 	pre.skills.push(...cur.skills);
					// 	return pre
					// });
					let firstSkill = group.shift(); //从筛选中去除第一个
					group.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
					return [firstSkill];
				} else { //1个技能的跳过
					return group[0];
				}
			});
			//进行具体技能效果的合并
			diffTurnsSkills.forEach(turnsSkill=>{
				//破吸部分的合并
				let voidBuff = turnsSkill.skills.filter(skill=>skill.kind == SkillKinds.VoidEnemyBuff);
				if (voidBuff.length>1)
				{ //把后面的全都合并到第一个
					voidBuff[0].buffs = voidBuff.flatMap(s=>s.buffs);
					voidBuff.shift(); //从筛选中去除第一个
					voidBuff.forEach(skill=>turnsSkill.skills.splice(turnsSkill.skills.indexOf(skill),1)); //去掉所有后面的
				}
			});
		}
		//解封部分的合并
		let unbinds = skills.filter(skill=>skill.kind == SkillKinds.Unbind);
		if (unbinds.length>1)
		{ //把后面的全都合并到第一个
			unbinds.reduce((pre,cur)=>{
				pre.normal = pre.normal || cur.normal;
				pre.awakenings = pre.awakenings || cur.awakenings;
				pre.matches = pre.matches || cur.matches;
				return pre
			});
			unbinds.shift(); //从筛选中去除第一个
			unbinds.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}
		let fixedDamages = skills.filter(skill=>skill.kind == SkillKinds.DamageEnemy && skill.attr === 'fixed').filter((skill,idx,arr)=>skill.id==arr[0].id);
		if (fixedDamages.length>1)
		{ //把后面的全都合并到第一个
			fixedDamages[0].times = fixedDamages.length;
			fixedDamages.shift(); //从筛选中去除第一个
			fixedDamages.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}
		let skillPowerUp = skills.filter(skill=>skill.kind == SkillKinds.PowerUp);
		if (skillPowerUp.length > 1 || (skillPowerUp[0] && skillPowerUp[0]?.value?.kind === SkillPowerUpKind.ScaleCross))
		{
			//合并技能效果
			function combinePowerUp(target, source) {
				if (source?.additional.length)
				{
					if (!Array.isArray(target.additional)) target.additional = [];
					target.additional.push(...source.additional);
				}
				if (source.reduceDamage != undefined)
				{
					if (!target.reduceDamage)
						target.reduceDamage = source.reduceDamage;
					else if (target.reduceDamage.kind === source.reduceDamage.kind)
						target.reduceDamage.value *= source.reduceDamage.value;
				}
				if (target?.value.baseAtk != undefined && source?.value.baseAtk) target.value.baseAtk *= source.value.baseAtk;
				if (target?.value.baseRcv != undefined && source?.value.baseRcv != undefined) target.value.baseRcv *= source.value.baseRcv;

				if (target?.value.bonusAtk != undefined && source?.value.bonusAtk != undefined) target.value.bonusAtk += source.value.bonusAtk;
				if (target?.value.bonusRcv != undefined && source?.value.bonusRcv != undefined) target.value.bonusRcv += source.value.bonusRcv;

				if (target?.value.atk != undefined && source?.value.atk != undefined) target.value.atk *= source.value.atk;
				if (target?.value.hp != undefined && source?.value.hp != undefined) target.value.hp *= source.value.hp;
				if (target?.value.rcv != undefined && source?.value.rcv != undefined) target.value.rcv *= source.value.rcv;
			}

			//十字
			let scaleCross = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.ScaleCross);
			function mergeScaleCrossAttr(skill)
			{
				let crosses = skill.value.crosses;
				let atk = crosses[0].atk;
				let rcv = crosses[0].rcv;
				if (crosses.length >= 2 &&
					crosses.every(cross=>cross.atk === atk && cross.rcv === rcv)
				) {
					crosses[0].attr = Array.from(new Set(crosses.reduce((pre,cur)=>{
						pre.push(...cur.attr);
						return pre;
					}, [])));
					skill.value.crosses.splice(1);
				}
			}
			//每个十字技能，先把所有属性合并到自身
			scaleCross.forEach(mergeScaleCrossAttr);
			//筛选出所有倍率一样的子技能
			scaleCross = scaleCross.filter((skill,idx,arr)=>{
				let atk = arr[0].value.crosses[0].atk;
				let rcv = arr[0].value.crosses[0].rcv;
				let crosses = skill.value.crosses;
				return crosses.every(cross=>cross.atk === atk && cross.rcv === rcv);
			});
			//先合并属性倍率
			if (scaleCross.length >= 1)
			{ //把后面的全都合并到第一个
				scaleCross.reduce((pre,cur)=>{
					combinePowerUp(pre,cur);
					pre.value.crosses = pre.value.crosses.concat(cur.value.crosses);
					return pre
				});
				let _skill = scaleCross.shift(); //从筛选中去除第一个
				scaleCross.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
				mergeScaleCrossAttr(_skill);
			}
			//重新找出来十字，合并附加内容
			scaleCross = skills.filter(skill=>skill.kind == SkillKinds.PowerUp && skill.value.kind === SkillPowerUpKind.ScaleCross);
			scaleCross = scaleCross.filter((skill,idx,arr)=>{
				let s0 = arr[0];
				let attr0 = s0.value.crosses[0].attr.concat().sort();
				let attr1 = skill.value.crosses[0].attr.concat().sort();
				return isEqual(skill.condition, s0.condition) &&
				isEqual(skill.attrs, s0.attrs) &&
				isEqual(skill.types, s0.types) &&
				isEqual(attr0, attr1)
				;
			});
			if (scaleCross.length > 1)
			{ //把后面的全都合并到第一个
				scaleCross.reduce((pre,cur)=>{
					combinePowerUp(pre, cur);
					return pre
				});
				scaleCross.shift(); //从筛选中去除第一个
				scaleCross.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}

			//长串匹配
			let scaleMatchLength = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.ScaleMatchLength);
			scaleMatchLength = scaleMatchLength.groupBy((a,b)=>{
				let av = a.value;
				let bv = b.value;

				return isEqual(a.condition, b.condition) &&
				isEqual(a.attrs, b.attrs) &&
				isEqual(a.types, b.types) &&
				av.min === bv.min &&
				av.max === bv.max &&
				(av.matchAll === bv.matchAll || av.attrs.length <= 1) && isEqual(av.attrs, bv.attrs)
				;
			});
			for (let group of scaleMatchLength)
			{
				if (group.length > 1)
				{ //把后面的全都合并到第一个
					group.reduce((pre,cur)=>{
						combinePowerUp(pre, cur);
						return pre
					});
					group.shift(); //从筛选中去除第一个
					group.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
				}
			}
			
			//多串匹配
			let scaleMatchAttrs = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.ScaleMatchAttrs);	
			scaleMatchAttrs = scaleMatchAttrs.filter((skill,idx,arr)=>{
				let s0 = arr[0];
				let v0 = s0.value;
				let v1 = skill.value;
				return isEqual(skill.condition, s0.condition) &&
				isEqual(skill.attrs, s0.attrs) &&
				isEqual(skill.types, s0.types) &&
				v0.min === v1.min &&
				v0.max === v1.max &&
				isEqual(v0.matches, v1.matches)
				;
			});

			if (scaleMatchAttrs.length > 1)
			{ //把后面的全都合并到第一个
				scaleMatchAttrs.reduce((pre,cur)=>{
					combinePowerUp(pre, cur);
					return pre
				});
				scaleMatchAttrs.shift(); //从筛选中去除第一个
				scaleMatchAttrs.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}
			
			//多色匹配
			let scaleAttributes = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.ScaleAttributes);	
			scaleAttributes = scaleAttributes.filter((skill,idx,arr)=>{
				let s0 = arr[0];
				let v0 = s0.value;
				let v1 = skill.value;
				return isEqual(skill.condition, s0.condition) &&
				isEqual(skill.attrs, s0.attrs) &&
				isEqual(skill.types, s0.types) &&
				v0.min === v1.min &&
				v0.max === v1.max &&
				isEqual(v0.attrs, v1.attrs)
				;
			});

			if (scaleAttributes.length > 1)
			{ //把后面的全都合并到第一个
				scaleAttributes.reduce((pre,cur)=>{
					combinePowerUp(pre, cur);
					return pre
				});
				scaleAttributes.shift(); //从筛选中去除第一个
				scaleAttributes.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}
			
			//连击数
			let scaleCombos = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.ScaleCombos);	
			scaleCombos = scaleCombos.filter((skill,idx,arr)=>{
				let s0 = arr[0];
				let v0 = s0.value;
				let v1 = skill.value;
				return isEqual(skill.condition, s0.condition) &&
				isEqual(skill.attrs, s0.attrs) &&
				isEqual(skill.types, s0.types) &&
				v0.min === v1.min &&
				v0.max === v1.max
				;
			});

			if (scaleCombos.length > 1)
			{ //把后面的全都合并到第一个
				scaleCombos.reduce((pre,cur)=>{
					combinePowerUp(pre, cur);
					return pre
				});
				scaleCombos.shift(); //从筛选中去除第一个
				scaleCombos.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}
			
			//普通倍率
			let multiplier = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.Multiplier
				&& skill.condition?.LShape);	
		
			multiplier = multiplier.filter((skill,idx,arr)=>{
				let s0 = arr[0];
				return !!skill.condition && isEqual(skill.condition, s0.condition) &&
				isEqual(skill.attrs, s0.attrs) &&
				isEqual(skill.types, s0.types)
				;
			});

			if (multiplier.length)
			{ //把后面的全都合并到第一个
				multiplier.reduce((pre,cur)=>{
					combinePowerUp(pre, cur);
					return pre
				});
				multiplier.shift(); //从筛选中去除第一个
				multiplier.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}
		}
		let changeOrbs = skills.filter(skill=>skill.kind == SkillKinds.ChangeOrbs);
		if (changeOrbs.length>1)
		{ //把后面的全都合并到第一个
			changeOrbs.reduce((pre,cur)=>{
				pre.changes.push(...cur.changes);
				return pre
			});
			changeOrbs.shift(); //从筛选中去除第一个
			changeOrbs.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}
		return skills;
	}
	const skill = Skills[skillId];
	if (!skill) return [];
	//此处用apply将这个parser传递到后面解析函数的this里，用于递归解析
	const result = skillObjectParsers?.[skill.type]?.apply({ parser: skillParser }, skill.params) 
		?? { kind: SkillKinds.Unknown }; //没有时返回未知技能
	let skills = (Array.isArray(result) ? result : [result]) //确保技能是数组
		.filter(Boolean) //去除无效技能
		.map(s => ({ id: skillId, type: skill.type, params: skill.params, ...s })); //额外增加技能id、type、原始参数

	function splitProvisoSkill(skills)
	{
		let idx = skills.findIndex(skill=>skill.kind == SkillKinds.SkillProviso); //搜索HP、层数限制技能的位置
		if (idx>=0) //如果找到，就拆分成3份
		{
			return [
				skills.slice(0,idx),
				skills.slice(idx, idx+1),
				skills.slice(idx+1),
			];
		}else
		{
			return [skills];
		}
	}
	//技能原始对象的合并，技能显示效果的合并在“function renderSkillEntry”里
	if (merge_skill)
	{
		//将技能拆分成3部分后分别合并技能
		let skillsSplit = splitProvisoSkill(skills).map(_skills=>merge(_skills));
		//再展平，重新回到一层技能
		skills = skillsSplit.flat(1);
	}
	
	return skills;
}

const v = {
	percent: function(value) {
		return { kind: SkillValueKind.Percent, value: (value / 100) ?? 1 };
	},
	constant: function(value) {
		return { kind: SkillValueKind.Constant, value: value ?? 0 };
	},
	constantTo: function(value) {
		return { kind: SkillValueKind.ConstantTo, value: value ?? 1 };
	},
	xMaxHP: function(value) {
		return { kind: SkillValueKind.xMaxHP, value: (value / 100) ?? 1 };
	},
	xHP: function(value) {
		return { kind: SkillValueKind.xHP, value: (value / 100) ?? 1 };
	},
	xCHP: function(value) {
		return { kind: SkillValueKind.xCHP, value: (value / 100) ?? 1 };
	},
	xShield: function(value) {
		return { kind: SkillValueKind.xShield, value: (value / 100) ?? 1 };
	},
	xATK: function(value) {
		return { kind: SkillValueKind.xATK, value: (value / 100) ?? 1 };
	},
	xRCV: function(value) {
		return { kind: SkillValueKind.xRCV, value: (value / 100) ?? 1 };
	},
	randomATK: function(min, max) {
		return { kind: SkillValueKind.RandomATK, min: (min / 100) ?? 1, max: (max / 100) ?? 1, scale: 1 };
	},
	hpScale: function(min, max, scale) {
		return { kind: SkillValueKind.HPScale, min: (min / 100) ?? 1, max: (max / 100) ?? 1, scale: (scale / 100) ?? 1 };
	},
	xTeamHP: function(value) {
		return { kind: SkillValueKind.xTeamHP, value: (value / 100) ?? 1 };
	},
	xTeamATK: function(attrs, value) {
		return { kind: SkillValueKind.xTeamATK, attrs: attrs, value: (value / 100) ?? 1 };
	},
	xTeamRCV: function(value) {
		return { kind: SkillValueKind.xTeamRCV, value: (value / 100) ?? 1 };
	},
	percentAwakenings: function(awakenings, value) {
		return { kind: SkillValueKind.xAwakenings, awakenings: awakenings, value: value };
	},
};

const c = {
	hp: function (min, max) {
		return { hp: { min: min / 100, max: max / 100 } };
	},
	exact: function (type, value, attrs, multiple = false) {
		if (attrs === void 0) { attrs = Attributes.all; }
		return { exact: { type: type, value: value, attrs: attrs, multiple: multiple} };
	},
	combos: function (min) {
		return { combos: { min } };
	},
	attrs: function (attrs, min) {
		return { attrs: { attrs, min} };
	},
	compo: function (type, ids) {
		return { compo: { type: type, ids: ids } };
	},
	remainOrbs: function (count) { return { remainOrbs: { count: count } }; },
	useSkill: function (times = 1) { return { useSkill: times }; },
	multiplayer: function () { return { multiplayer: true }; },
	prob: function (percent) { return { prob: percent }; },
	LShape: function (attrs) { return { LShape: { attrs } }; },
	heal: function (min) { return { heal: { min } }; },
	stage: function (min=0, max=0) {
		return { stage: { min, max } };
	},
	remainAttrOrbs: function (attrs, min, max) {
		return { remainAttrOrbs: { attrs, min, max} };
	},
	awakeningActivated: function (awakenings) { return { awakeningActivated: { awakenings } }; },
	stateIsActive: function (type, attrs) {
		return { stateIsActive: { type, attrs} };
	},
}

const p = {
	mul: function (values) {
		if (Array.isArray(values)) {
			return {
				kind: SkillPowerUpKind.Multiplier,
				hp: 1,
				atk: values[0] / 100,
				rcv: values[1] / 100
			};
		}
		else {
			return {
				kind: SkillPowerUpKind.Multiplier,
				hp: (values.hp ?? 100) / 100,
				atk: (values.atk ?? 100) / 100,
				rcv: (values.rcv ?? 100) / 100
			};
		}
	},
	stats: function (value) {
		let statTypes = Array.from(arguments).slice(1);
		return [
			statTypes.indexOf(1) >= 0 ? value : 100,
			statTypes.indexOf(2) >= 0 ? value : 100
		];
	},
	scale: function (min, max, baseMul, bonusMul) {
		return {
			min: min,
			max: max ?? min,
			baseAtk: (baseMul[0] / 100) ?? 1,
			baseRcv: (baseMul[1] / 100) ?? 1,
			bonusAtk: (bonusMul[0] / 100) ?? 0,
			bonusRcv: (bonusMul[1] / 100) ?? 0
		};
	},
	scaleAttrs: function (attrs, min, max, baseMul, bonusMul) {
		return { kind: SkillPowerUpKind.ScaleAttributes, attrs: attrs ,...this.scale(min, max, baseMul, bonusMul) };
	},
	scaleCombos: function (min, max, baseMul, bonusMul) {
		return { kind: SkillPowerUpKind.ScaleCombos ,...this.scale(min, max, baseMul, bonusMul) };
	},
	scaleMatchLength: function (attrs, min, max, baseMul, bonusMul, matchAll = false) {
		return { kind: SkillPowerUpKind.ScaleMatchLength, attrs, matchAll,...this.scale(min, max, baseMul, bonusMul) };
	},
	scaleMatchAttrs: function (matches, min, max, baseMul, bonusMul) {
		const flatMatches = matches.flat(); //当匹配的全是不同颜色时，切换成匹配颜色的技能
		if (new Set(flatMatches).size === flatMatches.length)
			return this.scaleAttrs(matches, min, max, baseMul, bonusMul);
		else
			return { kind: SkillPowerUpKind.ScaleMatchAttrs, matches: matches ,...this.scale(min, max, baseMul, bonusMul) };
	},
	scaleCross: function (crosses) {
		return { kind: SkillPowerUpKind.ScaleCross, crosses: crosses.map(cross => ({ ...cross, atk: ((cross.atk ?? 100) / 100), rcv: ((cross.rcv ?? 100) / 100)})) };
	},
	scaleRemainOrbs: function (max, baseMul, bonusMul) {
		return { kind: SkillPowerUpKind.ScaleRemainOrbs ,...this.scale(bonusMul ? 0 : max, max, baseMul, bonusMul) };
	},
	scaleStateKind: function (awakenings, attrs, types, value) {
		return { kind: SkillPowerUpKind.ScaleStateKind, awakenings: awakenings, attrs: attrs, types: types, value: value };
	},
	scaleMatchLengthTimes: function (attrs, min, exact, bonusMul) {
		return { kind: SkillPowerUpKind.ScaleMatchLengthTimes, attrs, min, exact, bonusMul };
	},
}

function activeTurns(turns, ...skills) {
	return skills.length ? { kind: SkillKinds.ActiveTurns, turns, skills } : null;
}
function delayActiveTurns(turns, ...skills) {
	return skills.length ? { kind: SkillKinds.DelayActiveTurns, turns, skills } : null;
}
function damageEnemy(target, attr, damage) {
	return { kind: SkillKinds.DamageEnemy, target, attr, damage };
}
function vampire(attr, damageValue, healValue) {
	return { kind: SkillKinds.Vampire, attr: attr, damage: damageValue, heal: healValue };
}
function reduceDamage(attrs, percent, condition, prob) {
	return { kind: SkillKinds.ReduceDamage, attrs: attrs, percent: percent, condition: condition, prob: prob || 1 };
}
function selfHarm(value) {
	return { kind: SkillKinds.SelfHarm, value: value };
}
function heal(value) {
	return { kind: SkillKinds.Heal, value: value };
}
function autoHealBuff(value) {
	return { kind: SkillKinds.AutoHealBuff, value: value };
}
function fromTo(from, to) {
	return { from: from, to: to };
}
function changeOrbs(...changes) {
	return { kind: SkillKinds.ChangeOrbs, changes: changes };
}
function generateOrbs(orbs, exclude, count, time) {
	return { kind: SkillKinds.GenerateOrbs, orbs: orbs, exclude: exclude, count: count, time: time};
}
function fixedOrbs(...generates) {
	return { kind: SkillKinds.FixedOrbs, generates: generates };
}
function powerUp(attrs, types, value, condition = null, reduceDamage = null, additional = [], eachTime = false) {
	let targets = attrs?.targets;
	if (targets) {attrs = null; types = null;}
	return { kind: SkillKinds.PowerUp, targets, attrs, types, condition, value, reduceDamage, additional, eachTime};
}
function slotPowerUp(value, targets) {
	return { kind: SkillKinds.SlotPowerUp, value, targets};
}
function counterAttack(attr, prob, value) {
	return { kind: SkillKinds.CounterAttack, attr: attr, prob: prob, value: value };
}
function setOrbState(orbs, state, arg) {
	return { kind: SkillKinds.SetOrbState, orbs, state, arg};
}
function rateMultiply(value, rate) {
	return { kind: SkillKinds.RateMultiply, value: value, rate: rate };
}
function orbDropIncrease(prob, attrs, flag, value) {
	return { kind: SkillKinds.OrbDropIncrease, prob, attrs, flag, value };
}
function resolve(min, max) {
	return { kind: SkillKinds.Resolve, min: min, max: max };
}
function unbind(normal, awakenings, matches) {
	return { kind: SkillKinds.Unbind, normal: normal, awakenings: awakenings , matches: matches};
}
function bindSkill() { return { kind: SkillKinds.BindSkill}; }
function bindCard() { return { kind: SkillKinds.BindCard}; }
function boardChange(attrs) {
	return { kind: SkillKinds.BoardChange, attrs: attrs };
}
function randomSkills(skills) {
	return { kind: SkillKinds.RandomSkills, skills: skills };
}
function evolvedSkills(loop, skills) {
	return { kind: SkillKinds.EvolvedSkills, loop: loop, skills: skills };
}
function changeAttr(target, attr) {
	return { kind: SkillKinds.ChangeAttribute, target: target, attr: attr ?? 0 };
}
function gravity(value, target = "all", isPartGravity = false) {
	return { kind: isPartGravity ? SkillKinds.PartGravity : SkillKinds.Gravity,
		value,
		target
	};
}
function voidEnemyBuff(buffs) {
	return { kind: SkillKinds.VoidEnemyBuff, buffs: buffs };
}
function skillBoost(value1, value2) { return { kind: SkillKinds.SkillBoost, min: value1, max: value2 ?? value1 }; }
function minMatch(value) { return { kind: SkillKinds.MinMatchLength, value: value }; }
function fixedTime(value) { return { kind: SkillKinds.FixedTime, value: v.constant(value) }; }
function addCombo(value) { return { kind: SkillKinds.AddCombo, value: value }; }
function defBreak(value) { return { kind: SkillKinds.DefenseBreak, value: value }; }
function poison(value) { return { kind: SkillKinds.Poison, value: value }; }
function CTW(time, cond, skill) {
	return { kind: SkillKinds.CTW, time, cond, skill };
}
function followAttack(value) { return { kind: SkillKinds.FollowAttack, value: value }; }
function followAttackFixed(value) { return { kind: SkillKinds.FollowAttackFixed, value: v.constant(value) }; }
function autoHeal(value) { return { kind: SkillKinds.AutoHeal, value: value }; }
function timeExtend(value) { return { kind: SkillKinds.TimeExtend, value: value }; }
function delay() { return { kind: SkillKinds.Delay }; }
function massAttack() { return { kind: SkillKinds.MassAttack }; }
function dropRefresh() { return { kind: SkillKinds.DropRefresh }; }
function drum() { return { kind: SkillKinds.Drum }; }
function autoPath(number) { return { kind: SkillKinds.AutoPath, matchesNumber:v.constant(number) }; }
function leaderChange(type = 0) { return { kind: SkillKinds.LeaderChange, type: type }; }
function noSkyfall() { return { kind: SkillKinds.NoSkyfall }; }
function henshin(id, random = false) {
	return {
		kind: SkillKinds.Henshin,
		id: Array.isArray(id) ? id[0] : id, //兼容旧程序
		ids: Array.isArray(id) ? id : [id],
		random: random
	};
}
function skillPlayVoice(skillStage, VoiceId) {
	return { kind: SkillKinds.PlayVoice, stage: skillStage, id: VoiceId };
}
function voidPoison() { return { kind: SkillKinds.VoidPoison }; }
function skillProviso(cond) { return { kind: SkillKinds.SkillProviso, cond: cond }; }
function impartAwakenings(attrs, types, target, awakenings) {
	return { kind: SkillKinds.ImpartAwakenings, attrs, types, target, awakenings };
}
function obstructOpponent(typeName, pos, ids) {
	return { kind: SkillKinds.ObstructOpponent, typeName: typeName, pos: pos, enemy_skills: ids };
}
function increaseDamageCapacity(cap, targets, attrs, types) {
	return { kind: SkillKinds.IncreaseDamageCapacity, cap, targets, attrs, types};
}
function boardJammingStates(state, posType, options) {
	return { kind: SkillKinds.BoardJammingStates, state: state, posType: posType, ...options};
}
function boardSizeChange(width=7, height=6) {
	return { kind: SkillKinds.BoardSizeChange, width, height };
}
function removeAssist() {
	return { kind: SkillKinds.RemoveAssist };
}
function predictionFalling() {
	return { kind: SkillKinds.PredictionFalling };
}
function breakingShield(value) {
	return { kind: SkillKinds.BreakingShield, value };
}
function timesLimit(turns) {
	return { kind: SkillKinds.TimesLimit, turns };
}
function fixedStartingPosition() {
	return { kind: SkillKinds.FixedStartingPosition };
}

const skillObjectParsers = {
	//parser: (() => []), //这个用来解决代码提示的报错问题，不起实际作用
  
	[0](attr, mul) { return damageEnemy('all', attr, v.xATK(mul)); },
	[1](attr, value) { return damageEnemy('all', attr, v.constant(value)); },
	[2](mul, _) { return damageEnemy('single', 'self', v.xATK(mul)); },
	[3](turns, percent) { return activeTurns(turns, reduceDamage('all', v.percent(percent))); },
	[4](mul) { return poison(v.xATK(mul)); },
	[5](time) { return CTW(v.constant(time)); },
	[6](percent) { return gravity(v.xCHP(percent)); },
	[7](mul) { return heal(v.xRCV(mul)); },
	[8](value) { return heal(v.constant(value)); },
	[9](from, to) { return changeOrbs(fromTo([from ?? 0], [to ?? 0])); },
	[10]() { return dropRefresh(); },
	[11](attr, mul) { return powerUp([attr], null, p.mul({ atk: mul })); },
	[12](mul) { return followAttack(v.xATK(mul)); },
	[13](mul) { return autoHeal(v.xRCV(mul)); },
	[14](min, max) { return resolve(v.percent(min), v.percent(max ?? 100)); },
	[15](time) { return timeExtend(v.constant(time / 100)); },
	[16](percent) { return reduceDamage('all', v.percent(percent)); },
	[17](attr, percent) { return reduceDamage([attr], v.percent(percent)); },
	[18](turns) { return activeTurns(turns, delay()); },
	[19](turns, percent) { return activeTurns(turns, defBreak(v.percent(percent))); },
	[20](from1, to1, from2, to2) { 
		if ((to1 ?? 0) == (to2 ?? 0))
			return changeOrbs(fromTo([from1 ?? 0, from2 ?? 0], [to1 ?? 0]));
		else
			return changeOrbs(
				fromTo([from1 ?? 0], [to1 ?? 0]),
				fromTo([from2 ?? 0], [to2 ?? 0])
			);
	},
	[21](turns, attr, percent) { return activeTurns(turns, reduceDamage([attr], v.percent(percent))); },
	[22](type, mul) { return powerUp(null, [type], p.mul({ atk: mul })); },
	[23](type, mul) { return powerUp(null, [type], p.mul({ hp: mul })); },
	[24](type, mul) { return powerUp(null, [type], p.mul({ rcv: mul })); },
  
	[26](mul) { return powerUp(null, null, p.mul({ atk: mul })); },
  
	[28](attr, mul) { return powerUp([attr], null, p.mul({ atk: mul, rcv: mul })); },
	[29](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul, atk: mul, rcv: mul })); },
	[30](type1, type2, mul) { return powerUp(null, [type1, type2], p.mul({ hp: mul })); },
	[31](type1, type2, mul) { return powerUp(null, [type1, type2], p.mul({ atk: mul })); },
  
	[33]() { return drum(); },
  
	[35](mul, percent) { return vampire('self', v.xATK(mul), v.percent(percent)); },
	[36](attr1, attr2, percent) { return reduceDamage([attr1, attr2], v.percent(percent)); },
	[37](attr, mul) { return damageEnemy('single', attr, v.xATK(mul)); },
	[38](max, prob, percent) { return reduceDamage('all', v.percent(percent), max === 100 ? c.hp(max, max) : c.hp(0, max), v.percent(prob)); },
	[39](percent, stats1, stats2, mul) { return powerUp(null, null, p.mul(p.stats(mul, stats1, stats2)), c.hp(0, percent)); },
	[40](attr1, attr2, mul) { return powerUp([attr1, attr2], null, p.mul({ atk: mul })); },
	[41](prob, mul, attr) { return counterAttack(attr ?? 0, v.percent(prob), v.percent(mul)); },
	[42](targetAttr, dmgAttr, value) { return damageEnemy(targetAttr, dmgAttr, v.constant(value)); },
	[43](min, prob, percent) { return reduceDamage('all', v.percent(percent), c.hp(min, 100), v.percent(prob)); },
	[44](percent, stats1, stats2, mul) { return powerUp(null, null, p.mul(p.stats(mul, stats1, stats2)), c.hp(percent, 100)); },
	[45](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul, atk: mul })); },
	[46](attr1, attr2, mul) { return powerUp([attr1, attr2], null, p.mul({ hp: mul })); },
  
	[48](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul })); },
	[49](attr, mul) { return powerUp([attr], null, p.mul({ rcv: mul })); },
	[50](turns, attr, mul) { return activeTurns(turns, powerUp([attr], null, p.mul({ atk: mul ?? 0  }))); },
	[51](turns) { return activeTurns(turns, massAttack()); },
	[52](attr, mul) { return setOrbState([attr], 'enhanced', {enhance: v.percent(mul)}); },
	[53](mul) { return rateMultiply(v.percent(mul), 'drop'); },
	[54](mul) { return rateMultiply(v.percent(mul), 'coin'); },
	[55](value) { return damageEnemy('single', 'fixed', v.constant(value)); },
	[56](value) { return damageEnemy('all', 'fixed', v.constant(value)); },
  
	[58](attr, min, max) { return damageEnemy('all', attr, v.randomATK(min, max)); },
	[59](attr, min, max) { return damageEnemy('single', attr, v.randomATK(min, max)); },
	[60](turns, mul, attr) { return activeTurns(turns, counterAttack(attr, v.percent(100), v.percent(mul))); },
	[61](attrs, min, base, bonus, stage) { return powerUp(null, null, p.scaleAttrs(Bin.unflags(attrs), min, min + (stage ?? 0), [base, 100], [bonus, 0])); },
	[62](type, mul) { return powerUp(null, [type], p.mul({ hp: mul, atk: mul })); },
	[63](type, mul) { return powerUp(null, [type], p.mul({ hp: mul, rcv: mul })); },
	[64](type, mul) { return powerUp(null, [type], p.mul({ atk: mul, rcv: mul })); },
	[65](type, mul) { return powerUp(null, [type], p.mul({ hp: mul, atk: mul, rcv: mul })); },
	[66](combo, mul) { return powerUp(null, null, p.scaleCombos(combo, combo, [mul, 100], [0, 0])); },
	[67](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul, rcv: mul })); },
  
	[69](attr, type, mul) { return powerUp([attr], [type], p.mul({ atk: mul })); },
  
	[71](...attrs) { return boardChange(attrs.filter(attr => attr >= 0)); },
	//据说是破除敌人的守护盾，但是因为重来没有实装过，所以不知道实际效果
	[72](turns) { return activeTurns(turns, voidEnemyBuff(['guard'])); },
	[73](attr, type, mul) { return powerUp([attr], [type], p.mul({ hp: mul, atk: mul })); },
  
	[75](attr, type, mul) { return powerUp([attr], [type], p.mul({ atk: mul, rcv: mul })); },
	[76](attr, type, mul) { return powerUp([attr], [type], p.mul({ hp: mul, atk: mul, rcv: mul })); },
	[77](type1, type2, mul) { return powerUp(null, [type1, type2], p.mul({ hp: mul, atk: mul })); },
  
	[79](type1, type2, mul) { return powerUp(null, [type1, type2], p.mul({ atk: mul, rcv: mul })); },
  
	[84](attr, min, max, percent) {
		return [
			selfHarm(percent ? v.xCHP(100 - percent) : v.constantTo(1)),
			damageEnemy('single', attr, v.randomATK(min, max))
		];
	},
	[85](attr, min, max, percent) {
		return [
			selfHarm(percent ? v.xCHP(100 - percent) : v.constantTo(1)),
			damageEnemy('all', attr, v.randomATK(min, max))
		];
	},
	[86](attr, value, _, percent) {
		return [
			selfHarm(percent ? v.xCHP(100 - percent) : v.constantTo(1)),
			damageEnemy('single', attr, v.constant(value))
		];
	},
	[87](attr, value, _, percent) {
		return [
			selfHarm(percent ? v.xCHP(100 - percent) : v.constantTo(1)),
			damageEnemy('all', attr, v.constant(value))
		];
	},
	[88](turns, type, mul) { return activeTurns(turns, powerUp(null, [type], p.mul({ atk: mul }))); },
  
	[90](turns, attr1, attr2, mul) { return activeTurns(turns, powerUp([attr1, attr2], null, p.mul({ atk: mul }))); },
	[91](attr1, attr2, mul) { return setOrbState([attr1, attr2], 'enhanced', {enhance: v.percent(mul)}); },
	[92](turns, type1, type2, mul) { return activeTurns(turns, powerUp(null, [type1, type2], p.mul({ atk: mul }))); },
	[93]() { return leaderChange(); },
	[94](percent, attr, stats1, stats2, mul) { return powerUp([attr], null, p.mul(p.stats(mul, stats1, stats2)), c.hp(0, percent)); },
	[95](percent, type, stats1, stats2, mul) { return powerUp(null, [type], p.mul(p.stats(mul, stats1, stats2)), c.hp(0, percent)); },
	[96](percent, attr, stats1, stats2, mul) { return powerUp([attr], null, p.mul(p.stats(mul, stats1, stats2)), c.hp(percent, 100)); },
	[97](percent, type, stats1, stats2, mul) { return powerUp(null, [type], p.mul(p.stats(mul, stats1, stats2)), c.hp(percent, 100)); },
	[98](min, base, bonus, max) { return powerUp(null, null, p.scaleCombos(min, max, [base, 100], [bonus, 0])); },
  
	[100](stats1, stats2, mul) { return powerUp(null, null, p.mul(p.stats(mul, stats1, stats2)), c.useSkill()); },
	[101](combo, mul) { return powerUp(null, null, p.mul({ atk: mul }), c.exact('combo', combo)); },
  
	[103](combo, stats1, stats2, mul) { return powerUp(null, null, p.scaleCombos(combo, combo, p.stats(mul, stats1, stats2), [0, 0])); },
	[104](combo, attrs, stats1, stats2, mul) { return powerUp(Bin.unflags(attrs), null, p.scaleCombos(combo, combo, p.stats(mul, stats1, stats2), [0, 0])); },
	[105](rcv, atk) { return powerUp(null, null, p.mul({ rcv, atk })); },
	[106](hp, atk) { return powerUp(null, null, p.mul({ hp, atk })); },
	[107](hp, attrs, atk) {
		return [
			powerUp(null, null, p.mul({ hp })),
			attrs && powerUp(Bin.unflags(attrs), null, p.mul({ atk: atk ?? 100 })) || null,
		].filter(Boolean);
	},
	[108](hp, type, atk) { return [powerUp(null, null, p.mul({ hp })), powerUp(null, [type], p.mul({ atk }))]; },
	[109](attrs, len, mul) { return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), len, len, [mul, 100], [0, 0])); },
	[110](single, attr, min, max, scale) { return damageEnemy(single ? 'single' : 'all', attr, v.hpScale(min, max, scale)); },
	[111](attr1, attr2, mul) { return powerUp([attr1, attr2], null, p.mul({ hp: mul, atk: mul })); },
  
	[114](attr1, attr2, mul) { return powerUp([attr1, attr2], null, p.mul({ hp: mul, atk: mul, rcv: mul })); },
	[115](attr, mul, percent) { return vampire(attr, v.xATK(mul), v.percent(percent)); },
	[116](...ids) { return ids.flatMap(id => this.parser(id)); },
	[117](bind, rcv, constant, hp, awokenBind) {
	  return [
		rcv ? heal(v.xRCV(rcv)) : hp ? heal(v.xMaxHP(hp)) : constant ? heal(v.constant(constant)) : null,
		(bind || awokenBind) ? unbind(bind ?? 0, awokenBind ?? 0) : null,
	  ].filter(Boolean);
	},
	[118](...ids) { return randomSkills(ids.map(id => this.parser(id))); },
	[119](attrs, min, base, bonus, max) { return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), min, max, [base || 100, 100], [bonus, 0])); },
  
	[121](attrs, types, hp, atk, rcv) { return powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })); },
	[122](percent, attrs, types, atk, rcv) { return powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk || 100, rcv: rcv || 100 }), c.hp(0, percent)); },
	[123](percent, attrs, types, atk, rcv) { return powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk || 100, rcv: rcv || 100 }), c.hp(percent, 100)); },
	[124](attrs1, attrs2, attrs3, attrs4, attrs5, min, mul, bonus) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4, attrs5].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.flatMap(Bin.unflags), min, bonus ? attrs.length : min, [mul, 100], [bonus, 0]));
	},
	[125](mon1, mon2, mon3, mon4, mon5, hp, atk, rcv) { return powerUp(null, null, p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }), c.compo('card', [mon1, mon2, mon3, mon4, mon5].filter(Boolean))); },
	[126](attrs, turns, turns2, percent) { return activeTurns(turns === turns2 ? turns : [turns, turns2], orbDropIncrease(v.percent(percent), Bin.unflags(attrs))); },
	[127](...params) { //cols1, attrs1, cols2, attrs2 ...
		const generates = [];
		for (let i = 0; i < params.length; i+=2) {
			generates.push({
				orbs: Bin.unflags(params[i+1]),
				type: 'col',
				positions: Bin.unflags(params[i])
			});
		}
		return fixedOrbs.apply(null, generates);
	},
	[128](...params) { //rows1, attrs1, rows2, attrs2 ...
		const generates = [];
		for (let i = 0; i < params.length; i+=2) {
			generates.push({
				orbs: Bin.unflags(params[i+1]),
				type: 'row',
				positions: Bin.unflags(params[i])
			});
		}
		return fixedOrbs.apply(null, generates);
	},
	[129](attrs, types, hp, atk, rcv, rAttrs, rPercent) {
		return [
			(hp || atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })) || null,
			rPercent && reduceDamage(Bin.unflags(rAttrs), v.percent(rPercent)) || null
		].filter(Boolean);
	},
	[130](percent, attrs, types, atk, rcv, rAttrs, rPercent) {
		return [
			(atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk || 100, rcv: rcv || 100 }), c.hp(0, percent)) || null,
			rPercent && reduceDamage(Bin.unflags(rAttrs), v.percent(rPercent), c.hp(0, percent)) || null
		].filter(Boolean);
	},
	[131](percent, attrs, types, atk, rcv, rAttrs, rPercent) {
		return [
			(atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk || 100, rcv: rcv || 100 }), c.hp(percent, 100)) || null,
			rPercent && reduceDamage(Bin.unflags(rAttrs), v.percent(rPercent), c.hp(percent, 100)) || null
		].filter(Boolean);
	},
	[132](turns, time, percent) { return activeTurns(turns, timeExtend(time ? v.constant(time / 10) : v.percent(percent))); },
	[133](attrs, types, atk, rcv) { return powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk || 100, rcv: rcv || 100 }), c.useSkill()); },
	[136](attrs1, hp1, atk1, rcv1, attrs2, hp2, atk2, rcv2) {
		return [
			powerUp(Bin.unflags(attrs1), null, p.mul({ hp: hp1 || 100, atk: atk1 || 100, rcv: rcv1 || 100 })),
			powerUp(Bin.unflags(attrs2), null, p.mul({ hp: hp2 || 100, atk: atk2 || 100, rcv: rcv2 || 100 })),
		];
	},
	[137](types1, hp1, atk1, rcv1, types2, hp2, atk2, rcv2) {
		return [
			powerUp(null, Bin.unflags(types1), p.mul({ hp: hp1 || 100, atk: atk1 || 100, rcv: rcv1 || 100 })),
			powerUp(null, Bin.unflags(types2), p.mul({ hp: hp2 || 100, atk: atk2 || 100, rcv: rcv2 || 100 })),
		];
	},
	[138](...ids) { return ids.flatMap(id => this.parser(id)); },
	[139](attrs, types, percent1, less1, mul1, percent2, less2, mul2) {
		return [
			powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: mul1 || 100 }), less1 ? c.hp(0, percent1) : c.hp(percent1, 100)),
			powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: mul2 || 100 }), less1 ?
				(less2 ? c.hp(percent1, percent2) : c.hp(percent2, 100)) :
				(less2 ? c.hp(0, percent2) : c.hp(percent2, percent1 - 1))
			),
		];
	},
	[140](attrs, mul) { return setOrbState(Bin.unflags(attrs), 'enhanced', {enhance: v.percent(mul)}); },
	[141](count, to, exclude) { return generateOrbs(Bin.unflags(to), Bin.unflags(exclude), count); },
	[142](turns, attr) { return activeTurns(turns, changeAttr('self', attr)); },
  
	[143](mul, dmgAttr) { return damageEnemy('all', dmgAttr ?? 0, v.xTeamHP(mul)); },

	[144](teamAttrs, mul, single, dmgAttr) { return damageEnemy(single ? 'single' : 'all', dmgAttr ?? 0, v.xTeamATK(Bin.unflags(teamAttrs), mul)); },
	[145](mul) { return heal(v.xTeamRCV(mul)); },
	[146](turns1, turns2) { return skillBoost(v.constant(turns1), turns2 ? v.constant(turns2) : undefined); },
  
	[148](percent) { return rateMultiply(v.percent(percent), 'exp'); },
	[149](mul) { return powerUp(null, null, p.mul({ rcv: mul }), c.exact('match-length', 4, [Attributes.Heart])); },
	[150](_, mul) { return powerUp({targets: ['the-attr']}, null, p.mul({ atk: mul }), c.exact('match-length', 5, 'enhanced')); },
	[151](mul1, mul2, percent) {
		return powerUp(null, null, p.scaleCross([{ single: true, attr: [Attributes.Heart], atk: mul1 || 100, rcv: mul2 || 100 }]), null, v.percent(percent));
	},
	[152](attrs, count) { return setOrbState(Bin.unflags(attrs), 'locked', {count: v.constant(count)}); },
	[153](attr, _) { return changeAttr('opponent', attr); },
	[154](from, to) { return changeOrbs(fromTo(Bin.unflags(from), Bin.unflags(to))); },
	[155](attrs, types, hp, atk, rcv) { return powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }), c.multiplayer()); },
	[156](turns, awoken1, awoken2, awoken3, type, mul) {
		if (type == 1)
		{
			return heal(v.percentAwakenings([awoken1, awoken2, awoken3].filter(Boolean), v.xRCV(mul)));
		}else
		{
			return activeTurns(turns, type === 2 ?
				powerUp(null, null, p.scaleStateKind([awoken1, awoken2, awoken3].filter(Boolean), null, null, p.mul({atk: mul - 100, hp:0, rcv:0}))) :
				reduceDamage('all', v.percentAwakenings([awoken1, awoken2, awoken3].filter(Boolean), v.percent(mul)))
			);
		}
	},
	[157](attr1, mul1, attr2, mul2, attr3, mul3) {
		let crosses = [
			{ single: false, attr: [attr1], atk: mul1 },
			{ single: false, attr: [attr2], atk: mul2 },
			{ single: false, attr: [attr3], atk: mul3 }
		].filter(cross => cross.atk);
	  	return powerUp(null, null, p.scaleCross(crosses));
	},
	[158](len, attrs, types, atk, hp, rcv) {
	  return [
		minMatch(len),
		powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }))
	  ];
	},
	[159](attrs, min, base, bonus, max) { return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), min, max, [base, 100], [bonus, 0])); },
	[160](turns, combo) { return activeTurns(turns, addCombo(combo)); },
	[161](percent) { return gravity(v.xMaxHP(percent)); },
	[162]() { return boardSizeChange(); },
	[163](attrs, types, hp, atk, rcv, rAttrs, rPercent) {
	  return [
		noSkyfall(),
		(hp || atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })) || null,
		rPercent && reduceDamage(Bin.unflags(rAttrs), v.percent(rPercent)) || null,
	  ].filter(Boolean);
	},
	[164](attrs1, attrs2, attrs3, attrs4, min, atk, rcv, bonus) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.flatMap(Bin.unflags), min, attrs.length, [atk, rcv], [bonus, bonus]));
	},
	[165](attrs, min, baseAtk, baseRcv, bonusAtk, bonusRcv, incr) {
		const attrsArr = Bin.unflags(attrs);
		return powerUp(null, null, p.scaleAttrs(attrsArr, min, min + (min < attrsArr.length ? (incr ?? 0) : 0), [baseAtk || 100, baseRcv || 100], [bonusAtk, bonusRcv]));
	},
	[166](min, baseAtk, baseRcv, bonusAtk, bonusRcv, max) { return powerUp(null, null, p.scaleCombos(min, max, [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[167](attrs, min, baseAtk, baseRcv, bonusAtk, bonusRcv, max) { return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), min, max, [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[168](turns, awoken1, awoken2, awoken3, awoken4, awoken5, awoken6, mul) {
		return activeTurns(turns, 
			powerUp(null, null, p.scaleStateKind([awoken1, awoken2, awoken3, awoken4, awoken5, awoken6].filter(Boolean), null, null, p.mul({atk: mul, hp:0, rcv:0})))
		);
	},
	[169](min, base, percent, bonus, max) { return powerUp(null, null, p.scaleCombos(min, max ?? min, [base || 100, 100], [bonus, 0]), null, v.percent(percent)); },
	//stage的真实用法目前不知道，缺少样本来判断，不知道到底是直接算数(stage-1)还是算二进制个数(Bin.unflags(stage).length)。 2022年5月23日
	//按 瘦鹅 的说法，也可能是因为暗牛头限制了5色， 所以就算是3级到了6色，也只算5色。
	[170](attrs, min, base, percent, bonus, stage) {
		let attrsArr = Bin.unflags(attrs);
		return powerUp(null, null, p.scaleAttrs(attrsArr, min, Math.min(min + (stage || 0), attrsArr.length), [base, 100], [bonus ?? 0, 0]), null, v.percent(percent));
	},
	[171](attrs1, attrs2, attrs3, attrs4, min, mul, percent, bonus) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.flatMap(Bin.unflags), min, bonus ? attrs.length : min, [mul, 100], [bonus ?? 0, 0]), null, v.percent(percent));
	},
	[172]() { return setOrbState(Attributes.orbs, 'unlocked'); },
	[173](turns, attrAbsorb, comboAbsorb, damageAbsorb) {
	  return activeTurns(turns, voidEnemyBuff(
		[
		  attrAbsorb && 'attr-absorb',
		  comboAbsorb && 'combo-absorb',
		  damageAbsorb && 'damage-absorb'
		].filter((buff) => typeof buff === 'string')
	  ));
	},
	[175](series1, series2, series3, hp, atk, rcv) { return powerUp(null, null, p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }), c.compo('series', [series1, series2, series3].filter(Boolean))); },
	[176](row1, row2, row3, row4, row5, attrs) {
		return fixedOrbs(
			{ orbs: [attrs ?? 0], type: 'shape', positions: [row1, row2, row3, row4, row5].map(Bin.unflags) }
		);
	},
	[177](attrs, types, hp, atk, rcv, remains, baseAtk, bonusAtk) {
	  return [
		noSkyfall(),
		(hp || atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })) || null,
		baseAtk && powerUp(null, null, p.scaleRemainOrbs(remains, [baseAtk ?? 100, 100], [bonusAtk ?? 0, 0])) || null
	  ].filter(Boolean);
	},
	[178](time, attrs, types, hp, atk, rcv, attrs2, percent) {
		return [
			fixedTime(time),
			(hp || atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })),
			percent && reduceDamage(Bin.unflags(attrs2), v.percent(percent)) || null,
		].filter(Boolean);
		/*const reduceAttrs = Bin.unflags(attrs2);
		const isAllAttr = isEqual(reduceAttrs, Attributes.attr);
		return [
			fixedTime(time),
			(hp || atk || rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }), null, isAllAttr ? v.percent(percent) : null),
			percent && !isAllAttr && reduceDamage(reduceAttrs, v.percent(percent)) || null,
		].filter(Boolean);*/
	},
	[179](turns, value, percent, bind, awokenBind) {
		return [
			(bind || awokenBind) ? unbind(bind ?? 0, awokenBind ?? 0) : null,
			activeTurns(turns, autoHealBuff(value ? v.constant(value) : v.xMaxHP(percent)))
		].filter(Boolean);
	},
	[180](turns, percent) { return activeTurns(turns, orbDropIncrease(v.percent(percent), [], 'enhanced')); },
  
	[182](attrs, len, mul, percent) { return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), len, len, [mul || 100, 100], [0, 0]), null, v.percent(percent)); },
	[183](attrs, types, percent1, atk1, reduce, percent2, atk2, rcv2) {
	  return [
		(percent1 > 0) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk1 || 100 }), c.hp(percent1, 100), v.percent(reduce)) || null,
		(atk2 || rcv2) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ atk: atk2 || 100, rcv: rcv2 || 100 }), c.hp(0, percent2 || percent1)) || null
	  ].filter(Boolean);
	},
	[184](turns) { return activeTurns(turns, noSkyfall()); },
	[185](time, attrs, types, hp, atk, rcv) {
	  return [
		timeExtend(v.constant(time / 100)),
		powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })),
	  ];
	},
	[186](attrs, types, hp, atk, rcv) {
	  return [
		boardSizeChange(),
		(hp || atk ||rcv) && powerUp(Bin.unflags(attrs), Bin.unflags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })) || null,
	  ].filter(Boolean);
	},

	[188](value) {
	  return damageEnemy('single', 'fixed', v.constant(value));
	},
	[189]() {
	  return [
		setOrbState(Attributes.orbs, 'unlocked'),
		boardChange([0,1,2,3]),
		autoPath(3),
	  ];
	},
	[190](attrs, count) { return setOrbState(Bin.unflags(attrs), 'combo-drop', {count: v.constant(count)}); },

	[191](turns) {
	  return activeTurns(turns, voidEnemyBuff(['damage-void']));
	},
	[192](attrs, len, mul, combo) {
		return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), len, len, [mul || 100, 100], [0, 0], true), null, null, combo ? [addCombo(combo)] : null);
	},
	[193](attrs, atk, rcv, percent) {
		return powerUp(null, null, p.mul([atk || 100, rcv || 100]), c.LShape(Bin.unflags(attrs)), v.percent(percent));
	},
	[194](attrs, min, mul, combo) {
		return powerUp(null, null, p.scaleAttrs(Bin.unflags(attrs), min, min, [mul || 100, 100], [0, 0]), null, null, combo ? [addCombo(combo)] : null);
	},
	[195](percent) {
	  return selfHarm(percent ? v.xCHP(100 - percent) : v.constantTo(1));
	},
	[196](matches) {
	  return unbind(0,0,matches);
	},
	[197]() {
	  return voidPoison();
	},
	[198](heal, atk, percent, awokenBind) {
		return powerUp(null, null, p.mul([atk || 100, 100]), c.heal(heal), percent && v.percent(percent), awokenBind && [unbind(0, awokenBind ?? 0)]);
	},
	[199](attrs, min, damage) {
		return powerUp(null, null, p.scaleAttrs(Bin.unflags(attrs), min, min, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[200](attrs, len, damage) {
		return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), len, len, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[201](attrs1, attrs2, attrs3, attrs4, min, damage) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.flatMap(Bin.unflags), min, min, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[202](id) {
		return henshin(id);
	},
	[203](evotypeid, hp, atk, rcv) {
		let evotype = (type=>{
			switch (type) {
				case 0: return "pixel-evo";
				case 2: return "reincarnation-evo";
				default: return type;
			}
		})(evotypeid);
		return powerUp(null, null, p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }),
		c.compo('evolution', [evotype]));
	},

	[205](attrs, turns) { return activeTurns(turns, orbDropIncrease(null, Bin.unflags(attrs == -1 ? 0b1111111111: attrs), 'locked')); },
	[206](attrs1, attrs2, attrs3, attrs4, attrs5, min, combo) {
		const attrs = [attrs1, attrs2, attrs3, attrs4, attrs5].filter(Boolean);
		return powerUp(null, null, p.scaleMatchAttrs(attrs.flatMap(Bin.unflags), min, min, [100, 100], [0, 0]), null, null, combo ? [addCombo(combo)] : null);
	},
	[207](turns, time, row1, row2, row3, row4, row5, count) {
		/*return activeTurns(turns, count ?
			generateOrbs( ['variation'], null, count, time/100):
			fixedOrbs( { orbs: ['variation'], time: time/100, type: 'shape', positions: [row1, row2, row3, row4, row5].map(row=>Bin.unflags(row)) })
		);*/
		const options = { time: time/100};
		if (count) {
			options.count = count;
		} else {
			options.positions = [row1, row2, row3, row4, row5].map(Bin.unflags);
		}
		return activeTurns(turns, 
			boardJammingStates('roulette', count ? 'random' : 'shape', options)
		);
	},
	[208](count1, to1, exclude1, count2, to2, exclude2) {
		return [
			generateOrbs(Bin.unflags(to1), Bin.unflags(exclude1), count1),
			generateOrbs(Bin.unflags(to2), Bin.unflags(exclude2), count2),
		];
	},
	[209](combo) {
		return powerUp(null, null, p.scaleCross([{ single: true, attr: [Attributes.Heart], atk: 100, rcv: 100}]), null, null, combo ? [addCombo(combo)] : null);
	},
	[210](attrs, reduce, combo) {
		return powerUp(null, null, p.scaleCross([{ single: false, attr: Bin.unflags(attrs), atk: 100, rcv: 100}]), null, v.percent(reduce), combo ? [addCombo(combo)] : null);
	},
	[213](attrs, types, ...awakenings) { //赋予觉醒的队长技
	  return impartAwakenings(Bin.unflags(attrs), Bin.unflags(types), null, awakenings);
	},
	[214](turns) { return activeTurns(turns, bindSkill()); },
	[215](turns, attrs) { return activeTurns(turns, setOrbState(Bin.unflags(attrs), 'bound')); },

	[217](rarity, hp, atk, rcv) {
		return powerUp(null, null, p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }),
		c.compo('team-total-rarity', rarity));
	},
	[218](turns) { return skillBoost(v.constant(-turns)); },

	[219](attrs, len, combo) {
		return powerUp(null, null, p.scaleMatchLength(Bin.unflags(attrs), len, len, [100, 100], [0, 0]), null, null, combo ? [addCombo(combo)] : null);
	},
	[220](attrs, combo) {
		var skill = powerUp(null, null, p.mul([100,100]), c.LShape(Bin.unflags(attrs)), null, combo ? [addCombo(combo)] : null);
		return skill;
	},
	[221](attrs, damage) {
		return powerUp(null, null, p.mul([100,100]), c.LShape(Bin.unflags(attrs)), null, damage ? [followAttackFixed(damage)] : null);
	},

	[223](combo, damage) {
		return powerUp(null, null, p.scaleCombos(combo, combo, [100, 100], [0, 0]), null, null, damage ? [followAttackFixed(damage)] : null);
	},
	[224](turns, attr) { return activeTurns(turns, changeAttr('opponent', attr)); },
	[225](min, max) { return skillProviso(c.hp(min ?? 0, max ?? 100)); },
	[226](turns, percent) { return activeTurns(turns, orbDropIncrease(v.percent(percent), [], 'nail')); },
	[227]() { return leaderChange(1); },
	[228](turns, attrs, types, atk, rcv) {
		return activeTurns(turns,
			powerUp(null, null, p.scaleStateKind(null, Bin.unflags(attrs), Bin.unflags(types), p.mul({atk: atk, rcv: rcv ?? 0, hp:0})))
		);
	},
	[229](attrs, types, hp, atk, rcv) {
		return powerUp(null, null, p.scaleStateKind(null, Bin.unflags(attrs), Bin.unflags(types), p.mul({hp: hp || 0, atk: atk || 0, rcv: rcv || 0})));
	},
	//按位置增伤主动技1
	[230](turns, target, mul) {
		const targetTypes = SkillTarget.type1;
		const typeArr = Bin.unflags(target).map(n => targetTypes[n]);
		return activeTurns(turns,
			slotPowerUp(p.mul({ atk: mul }), typeArr)
		);
	},
	[231](turns, awoken1, awoken2, awoken3, awoken4, awoken5, atk, rcv) {
		return activeTurns(turns, powerUp(null, null, p.scaleStateKind([awoken1, awoken2, awoken3, awoken4, awoken5].filter(Boolean), null, null, p.mul({atk: atk, hp:0, rcv: rcv ?? 0}))));
	},
	[232](...ids) { return evolvedSkills(false, ids.map(id => this.parser(id))); },
	[233](...ids) { return evolvedSkills(true, ids.map(id => this.parser(id))); },
	[234](min, max) { return skillProviso(c.stage(min ?? 0, max ?? 0)); },
	[235](attrs, lenMin, lenExact, atk, reducePercent, combo, damage, rcv) {
		// const len = lenMin || lenExact; //宝珠长度
		// const ee = Boolean(lenExact); //是否为刚好等于
		//第二个参数为多少以上就算，第三个参数为多少以上才算
		//return powerUp(null, null, p.mul({ atk: atk || 100}), c.exact('match-length', lenExact, Bin.unflags(attr)), v.percent(percent), [combo ? addCombo(combo) : null, damage ? followAttackFixed(damage) : null].filter(Boolean), true);
		//let powerup, condition;
		let powerup = Boolean(lenMin)
			? p.scaleMatchLength(Bin.unflags(attrs), lenMin, lenMin, [atk || 100, rcv || 100], [0, 0])
			: p.mul({ atk: atk || 100});
		let condition = Boolean(lenExact)
			? c.exact('match-length', lenExact, Bin.unflags(attrs))
			: null;
		let additional = [combo ? addCombo(combo) : null, damage ? followAttackFixed(damage) : null].filter(Boolean);
		const eachTime = true;
		return powerUp(null, null, powerup, condition, v.percent(reducePercent), additional, eachTime);
	},
	[236](...ids) { //随机变身
		return henshin(ids.distinct(), true);
	},
	[237](turns, hp) { //改变HP上限
		return activeTurns(turns,
			powerUp(null, null, p.mul({ hp: hp }))
		);
	},
	[238](turns, width, height, pos1, pos2) { //产云
		return activeTurns(turns,
			boardJammingStates('clouds', (pos1 && pos2) ? 'fixed' : 'random', { size: [width, height], positions: [pos1, pos2] })
		);
	},
	[239](colum, turns, row) { //产封条
		//const colums = Bin.unflags(colum), rows = Bin.unflags(row);
		return activeTurns(turns,
			boardJammingStates('immobility', 'fixed', { positions: {colums: Bin.unflags(colum), rows: Bin.unflags(row)} })
		);
	},
	[241](turns, cap) { //改变伤害上限主动技
		// const targetTypes = SkillTarget.type1;
		// const typeArr = Bin.unflags(target).map(n => targetTypes[n]);
		return activeTurns(turns,
			increaseDamageCapacity(cap * 1e8, ["self"])
		);
	},
	[243](turns, attrs, hpPercent, probPercent) { //掉落荆棘珠
		return activeTurns(turns, orbDropIncrease(v.percent(probPercent), Bin.unflags(attrs), 'thorn', v.xMaxHP(hpPercent)));
	},
	[244](turns, type) { //改变板面大小主动技
		let width, height;
		switch (type) {
			case 1: {
				width = 7;
				height = 6;
				break;
			}
			case 2: {
				width = 5;
				height = 4;
				break;
			}
			case 3: {
				width = 6;
				height = 5;
				break;
			}
			default: {
				width = 6;
				height = 5;
			}
		}
		return activeTurns(turns, boardSizeChange(width, height));
	},
	[245](rarity, _2, _3, hp, atk, rcv) { //全员满足某种情况，现在是全部星级不一样
 		return powerUp(Bin.unflags(_2), Bin.unflags(_3), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 }), c.compo('team-same-rarity', rarity)); 
	},
	[246](time, combo, cap) { //限定时间内转出多少C提高伤害上限
 		return CTW(v.constant(time), c.combos(combo) , increaseDamageCapacity(cap * 1e8, ["self"]));
	},
	[247](time, attr, min, cap) { //限定时间内转出多少色提高伤害上限
 		return CTW(v.constant(time), c.attrs(Bin.unflags(attr), min) , increaseDamageCapacity(cap * 1e8, ["self"]));
	},
	[248](turns, ...ids) { //几回合后才生效的技能
		return delayActiveTurns(turns,
			...ids.flatMap(id => this.parser(id))
		);
	},
	[249](turns, attr, row1, row2, row3, row4, row5, count) {
		const options = {
			attrs: Bin.unflags(attr),
		};
		if (count) {
			options.count = count;
		} else {
			options.positions = [row1, row2, row3, row4, row5].map(Bin.unflags);
		}
		return activeTurns(turns, 
			boardJammingStates('roulette', count ? 'random' : 'shape', options)
		);
	},
	[250](...awakenings) { //去除自身辅助，如果有参数则是赋予觉醒
		const skillEffects = [removeAssist()];
		if (awakenings.length) {
			skillEffects.unshift(impartAwakenings(null, null, SkillTarget.type1[0], awakenings));
		}
		return skillEffects;
	},
	[251](turns, min, max) { //产超暗暗珠
		return activeTurns(turns,
			boardJammingStates('deep-dark', 'random', { min, max })
		);
	},
	[253](turns) { //预测掉落主动技
		return activeTurns(turns, predictionFalling());
	},
	[254](turns) { //预测掉落队长技
		return predictionFalling();
	},
	//剩余多少个属性珠才能使用技能
	[255](attr, min, max) { return skillProviso(c.remainAttrOrbs(Bin.unflags(attr), min ?? 0, max ?? 0)); },
	
	[257]() {
		return [
		  setOrbState(Attributes.orbs, 'unlocked'),
		  boardChange([0,1,2,3,4,5]),
		  autoPath(5),
		];
	},
	//按位置改变伤害上限主动技1
	[258](turns, cap, target) { //改变伤害上限主动技
		const targetTypes = SkillTarget.type1;
		const typeArr = Bin.unflags(target).map(n => targetTypes[n]);
		return activeTurns(turns,
			increaseDamageCapacity(cap * 1e8, typeArr)
		);
	},
	[259](percent) { return breakingShield(v.xShield(percent)); },
	[260](skillStage, voiceId) { return skillPlayVoice(skillStage, voiceId); },
	[261](percent) { return gravity(v.xCHP(percent), 'single'); },
	[262](count) { return setOrbState(Attributes.orbs, 'nail', {count: v.constant(count)}); },
	[263](turns, cap, attr, type) { //按属性改变伤害上限主动技
		return activeTurns(turns,
			increaseDamageCapacity(cap * 1e8, void 0, Bin.unflags(attr), Bin.unflags(type))
		);
	},
	[264](mul) { return rateMultiply(v.percent(mul), 'plus_point'); },
	[265](mul) { return rateMultiply(v.percent(mul), 'part_break'); },
	//按位置改变伤害上限主动技2
	[266](turns, cap, target) {
		const targetTypes = SkillTarget.type2;
		const typeArr = Bin.unflags(target).map(n => targetTypes[n]);
		return activeTurns(turns,
			increaseDamageCapacity(cap * 1e8, typeArr)
		);
	},
	//卡片自绑定
	[267](turns) {return activeTurns(turns, bindCard()); },
	//限制技能使用次数
	[268](turns) { return timesLimit(turns); },
	//按位置增伤主动技2
	[269](turns, target, mul) {
		const targetTypes = SkillTarget.type2;
		const typeArr = Bin.unflags(target).map(n => targetTypes[n]);
		return activeTurns(turns,
			slotPowerUp(p.mul({ atk: mul }), typeArr)
		);
	},
	//一回合内使用几次技能才有倍率的队长技。
	[270](times, atk, rcv) { { return powerUp(Bin.unflags(31), null, p.mul({ atk: atk || 100, rcv: rcv || 100 }), c.useSkill(times)); } },
	//同时发动觉醒时强化
	[271](awakeningsFlag, atk, reducePercent, combo, damage, rcv) {
		const awakeningsType = [
			27, //U
			48, //九宫
			60, //L字
			78, //十字

			126,//T字
			22, //横排-火
			23, //横排-水
			24, //横排-木

			25, //横排-光
			26, //横排-暗
			79, //三色
			80, //四色

			81, //五色
			0,
			0,
			73, //串串-火

			74, //串串-水
			75, //串串-木
			76, //串串-光
			77, //串串-暗

			0,
			82, //饼干
		];
		const awakeningsArr = Bin.unflags(awakeningsFlag).map(n => awakeningsType[n] || 0);
		let additional = [combo ? addCombo(combo) : null, damage ? followAttackFixed(damage) : null].filter(Boolean);
		return powerUp(null, null, p.mul({ atk: atk || 100, rcv: rcv || 100}), c.awakeningActivated(awakeningsArr), v.percent(reducePercent), additional);
	},
	//固定起手位置
	[273](turns) {return activeTurns(turns, fixedStartingPosition()); },
	//宝珠掉落率提高时才能使用技能
	[275](typeNum, attrFlag) {
		const typeNames = [
			null,
			"orb-drop-increase",
		]
		let type = typeNames[typeNum];
		return skillProviso(c.stateIsActive(type, Bin.unflags(attrFlag)));
	},
	//部位的重力
	[276](percent) { return gravity(v.xCHP(percent), void 0, true); },

	[1000](type, pos, ...ids) {
		const posType = (type=>{
			switch (type) {
				case 1: return "after-me";
				case 2: return "designated-position";
				case 3: return "before-me";
				default: return type;
			}
		})(type);
		return obstructOpponent(posType, Bin.unflags(pos), ids);
	},
};

function renderSkillEntry(skills)
{
	//按住Ctrl点击技能在控制台输出技能的对象
	function showParsedSkill(event) {
		if (event.ctrlKey) {
			//const skillId = parseInt(this.getAttribute("data-skill-id"));
			console.log(this.skill);
		}
	}
	const ul = document.createElement("ul");
	ul.className = "card-skill-list";
	skills.forEach(skill=>{
		const li = ul.appendChild(document.createElement("li"));
		li.className = skill.kind;
		li.appendChild(renderSkill(skill));
		//li.setAttribute("data-skill-id", skill.id);
		li.skill = skill;
		li.addEventListener("click", showParsedSkill);
	});

	//技能显示效果的合并，技能原始对象的合并在“function skillParser”里
	if (merge_skill)
	{
		const searchKind = [ //需要配合并的技能类型
			SkillKinds.SetOrbState,
			SkillKinds.BoardChange,
			SkillKinds.GenerateOrbs,
			SkillKinds.FixedOrbs,
			SkillKinds.BoardJammingStates,
		];
		let boardChange = skills.filter(skill=>{
			if (skill.kind == SkillKinds.ActiveTurns) {
				//如果是主动技，任一子技能属于这个范围就可以了
				return skill.skills.some(subSkill=>searchKind.includes(subSkill.kind))
			} else {
				return searchKind.includes(skill.kind);
			}
		}).flatMap(skill=>skill.kind == SkillKinds.ActiveTurns ?
			//主动技还需要再筛选一遍子技能
			skill.skills.filter(subSkill=>searchKind.includes(subSkill.kind)) :
			skill);
		if (boardChange.filter(skill=>skill.kind != SkillKinds.SetOrbState).length > 0)
		{
			const boardsBar = new BoardSet(new Board(), new Board(null,7,6), new Board(null,5,4));
			for (const skill of boardChange)
			{
				switch (skill.kind)
				{
					case SkillKinds.BoardChange: { //洗版
						const attrs = skill.attrs;
						boardsBar.boards.forEach(board=>board.randomFill(attrs));
						break;
					}
					case SkillKinds.GenerateOrbs: { //产生珠子
						const { orbs, exclude, count } = skill;
						boardsBar.boards.forEach(board=>board.generateOrbs(orbs, count, exclude));
						break;
					}
					case SkillKinds.FixedOrbs: { //固定位置产生珠子
						for (const generate of skill.generates)
						{
							const orbs = generate.orbs;
							if (generate.type == 'shape') {
								boardsBar.boards.forEach(board=>board.setShape(generate.positions, orbs));
							} else {
								if (generate.type == 'row')
									boardsBar.boards.forEach(board=>board.setRows(generate.positions, orbs));
								else
									boardsBar.boards.forEach(board=>board.setColumns(generate.positions, orbs));
							}
						}
						break;
					}
					case SkillKinds.BoardJammingStates: { //产生板面干扰
						const { state, posType, size, positions, count, time } = skill;
						if (state == 'roulette') { //轮盘位
							boardsBar.boards.forEach(board=>{
								if (posType == 'random')
									board.generateBlockStates('roulette', count);
								else
									board.setShape(positions, null, null, 'roulette');
							});
						}
						if (state == 'clouds') { //云
							boardsBar.boards.forEach(board=>{
								board.generateBlockStates('clouds', count, size, positions);
							});
						}
						if (state == 'immobility') { //封条
							const {colums, rows} = skill.positions;
							boardsBar.boards.forEach(board=>{
								board.setColumns(colums, null, null, 'immobility');
								board.setRows(rows, null, null, 'immobility');
							});
						}
						if (state == 'deep-dark') { //超暗暗
							const { min, max } = skill;
							boardsBar?.boards?.forEach(board=>{
								if (posType == 'random')
									board.generateBlockStates('deep-dark', min == max ? min : Math.randomInteger(max, min));
								else
									board.setShape(positions, null, null, 'deep-dark');
							});
						}
						break;
					}
					case SkillKinds.SetOrbState: { //修改珠子状态
						const { orbs, state } = skill;
						const count = skill?.arg?.count?.value ?? 99;
						boardsBar.boards.forEach(board=>{
							board.generateOrbs(orbs, count, null, state);
						});
						break;
					}
				}
			}
			const li = ul.appendChild(document.createElement("li"));
			boardsBar.boards.forEach(board=>board.refreshTable());
			li.appendChild(boardsBar.node);
			li.className = "merge-board";
		}
	}

	return ul;
}
//行列拆分成顺序和逆序的正常数字
function posSplit(pos, axis = 'row')
{
	const max = axis == 'row' ? 5 : 6;
	return [
		pos.filter(n=>n<=2).map(n=>n+1),
		pos.filter(n=>n>=3).reverse().map(n=>max-n),
	];
	//return {sequence: pos.filter(n=>n<=2).map(n=>n+1), reverse: pos.filter(n=>n>=3).reverse().map(n=>max-n)};
}

function createSkillIcon(iconType, className){
	const idoc = document.createElement("icon");
	idoc.className = `icon-skill${className ? ` ${className}` : ''}`;
	idoc.setAttribute("data-icon-type", iconType);
	return idoc;
}

function renderSkill(skill, option = {})
{
	function renderSkillTitle(skillId, { showTurns } = {}) {
		const skill = Skills[skillId];
		const div = document.createElement("summary");
		div.className = "evolved-skill-title";
		const name = div.appendChild(document.createElement("span"));
		name.className = "skill-name";
		name.textContent = skill.name;
		name.setAttribute("data-skillid", skillId);
		//name.onclick = fastShowSkill;
		if (showTurns) {
			const cd = div.appendChild(document.createElement("span"));
			cd.className = "skill-cd";
			cd.textContent = skill.initialCooldown - skill.maxLevel + 1;
			if (skill.maxLevel > 1) {
				const level = div.appendChild(document.createElement("span"));
				level.className = "skill-level-label";
				level.textContent = skill.maxLevel;
			}
		}
		const originalSkill = document.createElement("div");
		originalSkill.className = "skill-datail-original";
		originalSkill.append(parseSkillDescription(skill));

		return [div, originalSkill].nodeJoin();
	}

	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	const tsp = localTranslating.skill_parse;
	const createIcon = createSkillIcon;
	
	if (Array.isArray(skill))
	{
		frg.ap(skill.map(_skill=>renderSkill(_skill)));
		return frg;
	}
	switch (skill.kind) {
		case SkillKinds.Error: {
			let dict = { type: skill.kind };
			frg.ap(tsp.skill.error(dict));
			break;
		}
		case SkillKinds.Unknown: {
			console.log(skill);
			let dict = {
				type: skill.kind
			};
			frg.ap(tsp.skill.unknown(dict));
			break;
		}
		case SkillKinds.ActiveTurns: { //有回合的行动
			let { turns, skills } = skill;
			let dict = {
				turns: Array.isArray(turns) ? turns.join(tsp.word.range_hyphen().textContent) : turns,
				skills: skills?.map(renderSkill)?.nodeJoin(tsp.word.semicolon()),
			};
			frg.ap(tsp.skill.active_turns(dict));
			break;
		}
		case SkillKinds.DelayActiveTurns: { //有推迟回合的行动
			let { turns, skills } = skill;
			let dict = {
				turns: Array.isArray(turns) ? turns.join(tsp.word.range_hyphen().textContent) : turns,
				icon: createIcon(SkillKinds.Delay),
				skills: renderSkillEntry(skills),
			};
			
			frg.ap(tsp.skill.delay_active_turns(dict));
			//独立出来
			//frg.ap();
			break;
		}
		case SkillKinds.RandomSkills: { //随机技能
			let skills = skill.skills;
			const ul = document.createElement("ul");
			ul.className = "random-active-skill";
			skills.forEach((subSkill, idx)=>{
				const li = ul.appendChild(document.createElement("li"));
				const details = li.appendChild(document.createElement("details"));
				details.open = false; //随机类技能默认关闭
				details.className = "skill-details";
				details.appendChild(renderSkillTitle(skill.params[idx]));
				details.appendChild(renderSkillEntry(subSkill));
			});
			let dict = {
				skills: ul,
			};
			frg.ap(tsp.skill.random_skills(dict));
			break;
		}
		case SkillKinds.EvolvedSkills: { //技能进化
			let {skills, loop} = skill;
			const ul = document.createElement("ul");
			ul.className = "evolved-active-skill";
			skills.forEach((subSkill, idx)=>{
				const li = ul.appendChild(document.createElement("li"));
				const details = li.appendChild(document.createElement("details"));
				details.open = true; //进化类技能默认打开
				details.className = "skill-details";
				details.appendChild(renderSkillTitle(skill.params[idx], { showTurns:true }));
				details.appendChild(renderSkillEntry(subSkill));
			});
			let dict = {
				skills: ul,
			};
			frg.ap(tsp.skill.evolved_skills(dict));
			if (loop) frg.ap(tsp.skill.evolved_skills_loop({icon: createIcon("evolved-skill-loop")}));
			break;
		}
		case SkillKinds.Delay: { //威吓
			let dict = {
				icon: createIcon(skill.kind),
			};
			frg.ap(tsp.skill.delay(dict));
			break;
		}
		case SkillKinds.MassAttack: { //全体攻击
			let dict = {
				icon: createIcon(skill.kind),
			};
			frg.ap(tsp.skill.mass_attack(dict));
			break;
		}
		case SkillKinds.LeaderChange: { //切换队长
			let type = skill.type;
			let dict = {
				icon: createIcon(skill.kind),
				target: type ? tsp.target.team_last() : tsp.target.self(),
			};
			frg.ap(tsp.skill.leader_change(dict));
			break;
		}
		case SkillKinds.NoSkyfall: { //无天降
			let dict = {
				icon: createIcon(skill.kind),
			};
			frg.ap(tsp.skill.no_skyfall(dict));
			break;
		}
		case SkillKinds.SelfHarm: { //主动自残
			let value = skill.value;
			let dict = {
				icon: createIcon("heal", "hp-decr"),
				value: renderValue(value, {percent: true}),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.self_harm(dict));
			break;
		}
		case SkillKinds.Heal: { //主动回血buff
			let value = skill.value;
			let dict = {
				icon: createIcon("heal", "hp-incr"),
				//icon: createIcon("auto-heal"),
				value: renderValue(value, {unit: tsp.unit.point, percent: value.kind == SkillValueKind.xRCV ? false : true}),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.heal(dict));
			break;
		}
		case SkillKinds.AutoHealBuff: { //自动回血buff
			let dict = {
				icon: createIcon("auto-heal"),
				value: renderValue(skill.value, {unit: tsp.unit.point, percent: true}),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.auto_heal_buff(dict));
			break;
		}
		case SkillKinds.DefenseBreak: { //破防
			let dict = {
				icon: createIcon(skill.kind),
				value: renderValue(skill.value, {percent: true}),
			};
			frg.ap(tsp.skill.defense_break(dict));
			break;
		}
		case SkillKinds.Poison: { //毒
			let dict = {
				icon: createIcon(skill.kind),
				belong_to: tsp.target.self(),
				target: tsp.target.enemy_all(),
				stats: tsp.stats.hp(),
				value: renderValue(skill.value),
			};
			frg.ap(tsp.skill.poison(dict));
			break;
		}
		case SkillKinds.TimeExtend: { //时间变化buff
			let value = skill.value;
			let dict = {
				icon: createIcon("status-time", SkillValue.isLess(value) ? "time-decr" : "time-incr"),
				value: renderValue(value, { unit:tsp.unit.seconds, plusSign: value.kind != SkillValueKind.Percent, percent: SkillValue.isLess(value) }),
				
			};
			frg.ap(tsp.skill.time_extend(dict));
			break;
		}
		case SkillKinds.FollowAttack: { //队长技倍率追打
			let dict = {
				//icon: createIcon("follow_attack"),
				belong_to: tsp.target.self(),
				target: tsp.target.enemy(),
				value: renderValue(skill.value),
			};
			frg.ap(tsp.skill.follow_attack(dict));
			break;
		}
		case SkillKinds.FollowAttackFixed: { //队长技固伤追打
			let damage = skill.value;
			let dict = {
				damage: renderValue(damage, {unit: tsp.unit.point}),
				attr: renderAttrs('fixed'),
			};
			frg.ap(tsp.skill.follow_attack_fixed(dict));
			break;
		}
		case SkillKinds.AutoHeal: { //队长技自动回血
			let dict = {
				icon: createIcon(skill.kind),
				belong_to: tsp.target.self(),
				value: renderValue(skill.value),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.auto_heal(dict));
			break;
		}
		case SkillKinds.CTW: { //时间暂停
			let {time, cond, skill: subSkill} = skill;
			let dict = {
				icon: createIcon(skill.kind),
				time: renderValue(time, { unit: tsp.unit.seconds }),
			};
			if (cond) {
				let dict2 = {
					cond: renderCondition(cond),
					skill: renderSkill(subSkill)
				}
				dict.addition = tsp.skill.ctw_addition(dict2);
			}
			frg.ap(tsp.skill.ctw(dict));
			break;
		}
		case SkillKinds.Gravity: { //重力
			let {value, target} = skill;
			let dict = {
				icon: createIcon(skill.kind),
				target: target === 'all' ? tsp.target.enemy_all() : tsp.target.enemy_one(),
				value: renderValue(value, { percent:true }),
			};
			frg.ap(tsp.skill.gravity(dict));
			break;
		}
		case SkillKinds.PartGravity: { //部位重力
			let {value, target} = skill;
			let dict = {
				icon: createIcon("rate-mul-part_break"), //直接用重力的
				part: tsp.target.enemy_part(),
				target: target === 'all' ? tsp.target.enemy_all() : tsp.target.enemy_one(),
				value: renderValue(value, { percent:true }),
			};
			frg.ap(tsp.skill.gravity(dict));
			break;
		}
		case SkillKinds.Resolve: { //根性
			let prob = skill.prob;
			let dict = {
				icon: createIcon(skill.kind),
				stats: renderStat('chp'),
				min: renderValue(skill.min, { percent:true }),
				max: renderValue(skill.max, { percent:true }),
			};
			frg.ap(tsp.skill.resolve(dict));
			break;
		}
		
		case SkillKinds.DamageEnemy: { //大炮和固伤
			let attr = skill.attr, target = skill.target, damage = skill.damage, times = skill.times;
			if (attr == null) break; //没有属性时，编号为0的空技能
			let dict = {
				target: target === 'all' ? tsp.target.enemy_all() : target === 'single' ? tsp.target.enemy_one() : tsp.target.enemy_attr({attr: renderAttrs(target, {affix: true})}),
				damage: renderValue(damage, {unit: tsp.unit.point}),
				attr: renderAttrs(attr, {affix: (attr === 'self' || attr === 'fixed') ? false : true}),
			};
			if (times)
			{
				dict.times = tsp.skill.damage_enemy_times({
					times: renderValue(v.constant(times), {unit: tsp.unit.times})
				});
				dict.totalDamage = tsp.skill.damage_enemy_count({
					damage: renderValue(v.constant(damage.value * times), {unit: tsp.unit.point})
				});
			}
			frg.ap(tsp.skill.damage_enemy(dict));
			break;
		}
		case SkillKinds.Unbind: { //解封
			let normal = skill.normal, awakenings = skill.awakenings, matches = skill.matches;
			let effects = [];
			let enabledStats = [normal, awakenings, matches].filter(Boolean);
			if (merge_skill && enabledStats.length >= 2 && enabledStats.every((s,i,arr)=>s==arr[0]))
			{
				if (normal)
				{
					effects.push(tsp.skill.unbind_normal({icon: createIcon("unbind-normal")}));
				}
				if (awakenings)
				{
					effects.push(tsp.skill.unbind_awakenings({icon: createIcon("unbind-awakenings")}));
				}
				if (matches)
				{
					effects.push(tsp.skill.unbind_matches({icon: createIcon("unbind-matches")}));
				}
				let dict = {
					turns: enabledStats[0],
					stats: effects.nodeJoin(tsp.word.slight_pause()),
				}
				frg.ap(tsp.skill.unbind(dict));
			}
			else
			{
				if (normal)
				{
					let dict = {
						turns: normal,
						stats: tsp.skill.unbind_normal({icon: createIcon("unbind-normal")}),
					}
					effects.push(tsp.skill.unbind(dict));
				}
				if (awakenings)
				{
					let dict = {
						turns: awakenings,
						stats: tsp.skill.unbind_awakenings({icon: createIcon("unbind-awakenings")}),
					}
					effects.push(tsp.skill.unbind(dict));
				}
				if (matches)
				{
					let dict = {
						turns: matches,
						stats: tsp.skill.unbind_matches({icon: createIcon("unbind-matches")}),
					}
					effects.push(tsp.skill.unbind(dict));
				}
				frg.ap(effects.nodeJoin(tsp.word.comma()));
			}
			break;
		}
		case SkillKinds.BindSkill: {
			let dict = {
				icon: createIcon(skill.kind)
			};
			frg.ap(tsp.skill.bind_skill(dict));
			break;
		}
		case SkillKinds.BindCard: {
			let dict = {
				icon: createIcon(skill.kind)
			};
			frg.ap(tsp.skill.bind_card(dict));
			break;
		}
		case SkillKinds.BoardChange: { //洗版
			const attrs = skill.attrs;
			let dict = {
				orbs: renderOrbs(attrs),
			};
			frg.ap(tsp.skill.board_change(dict));
			if (!merge_skill)
			{
				const boardsBar = new BoardSet(new Board(attrs), new Board(attrs,7,6), new Board(attrs,5,4));
				boardsBar.boards.forEach(board=>{
					board.refreshTable();
				});
				frg.ap(boardsBar.node);
			}
			break;
		}
		case SkillKinds.SkillBoost: { //溜
			const min = skill.min, max = skill.max;
			let dict = {
				icon: createIcon(skill.kind, SkillValue.isLess(min) ? "boost-decr" : "boost-incr"),
				turns_min: renderValue(min, { unit:tsp.unit.turns, plusSign:true }),
			};
			if (max.value !== min.value) {
				dict.turns_max = tsp.skill.skill_boost_range(
					{turns: renderValue(max, { unit:tsp.unit.turns, plusSign:true })}
				);
			}
			frg.ap(tsp.skill.skill_boost(dict));
			break;
		}
		case SkillKinds.AddCombo: { //+C
			const value = skill.value;
			let icon = createIcon(skill.kind);
			icon.setAttribute("data-add-combo", value);
			let dict = {
				icon: icon,
				value: value,
			};
			frg.ap(tsp.skill.add_combo(dict));
			break;
		}
		case SkillKinds.FixedTime: { //固定手指
			const value = skill.value;
			let dict = {
				icon: createIcon(skill.kind),
				value: renderValue(value, { unit: tsp.unit.seconds }),
			};
			frg.ap(tsp.skill.fixed_time(dict));
			break;
		}
		case SkillKinds.MinMatchLength: { //最低匹配长度
			const value = skill.value;
			let dict = {
				icon: createIcon(skill.kind),
				unmatchable: value - 1,
				matchable: value,
			};
			frg.ap(tsp.skill.min_match_length(dict));
			break;
		}
		case SkillKinds.DropRefresh: { //刷版
			let dict = {
				icon: createIcon(skill.kind),
			};
			frg.ap(tsp.skill.drop_refresh(dict));
			break;
		}
		case SkillKinds.Drum: { //太鼓达人音效
			frg.ap(tsp.skill.drum());
			break;
		}
		case SkillKinds.AutoPath: { //自动路径，小龙的萌新技能
			const {matchesNumber} = skill;
			frg.ap(tsp.skill.auto_path({
				icon: createIcon(skill.kind),
				matchesNumber: renderValue(matchesNumber),
			}));
			break;
		}
		case SkillKinds.Vampire: { //吸血
			let attr = skill.attr, damage = skill.damage, heal = skill.heal;
			let _dict = {
				target: tsp.target.enemy_one(),
				damage: renderValue(damage),
				attr: renderAttrs(attr, {affix: (attr === 'self' || attr === 'fixed') ? false : true}),
			};
			let dict = {
				icon: createIcon("heal", "hp-incr"),
				damage_enemy: tsp.skill.damage_enemy(_dict),
				heal: renderValue(heal, {percent: true}),
			};
			frg.ap(tsp.skill.vampire(dict));
			break;
		}
		case SkillKinds.CounterAttack: { //反击
			let attr = skill.attr, prob = skill.prob, value = skill.value;
			let dict = {
				icon: createIcon(skill.kind),
				target: tsp.target.enemy(),
				chance: prob.value < 1 ? tsp.value.prob({value: renderValue(prob, { percent:true })}) : null,
				value: renderValue(value),
				attr: renderAttrs(attr, {affix: true}),
			};
			frg.ap(tsp.skill.counter_attack(dict));
			break;
		}
		case SkillKinds.ChangeOrbs: { //珠子变换
			let changes = skill.changes;
			let subDocument = [];
			for (const change of changes)
			{
				let dict = {
					from: renderOrbs(change.from),
					to: renderOrbs(change.to),
				};
				subDocument.push(tsp.skill.change_orbs(dict));
			}
			frg.ap(subDocument.nodeJoin(tsp.word.comma()));
			break;
		}
		case SkillKinds.GenerateOrbs: { //产生珠子
			let orbs = skill.orbs, exclude = skill.exclude, count = skill.count;
			let dict = {
				exclude: exclude?.length ? tsp.word.affix_exclude({cotent: renderOrbs(exclude)}) : void 0,
				orbs: renderOrbs(orbs),
				value: count,
			};
			frg.ap(tsp.skill.generate_orbs(dict));
			if (!merge_skill)
			{
				const boardsBar = new BoardSet(new Board(), new Board(null,7,6), new Board(null,5,4));
				boardsBar.boards.forEach(board=>{
					board.generateOrbs(orbs, count, exclude);
					board.refreshTable();
				});
				frg.ap(boardsBar.node);
			}
			break;
		}
		case SkillKinds.FixedOrbs: { //固定位置产生珠子
			let generates = skill.generates;
			let slight_pause = tsp.word.slight_pause().textContent;
			let subDocument = [];
			const boardsBar = merge_skill ? null : new BoardSet(new Board(), new Board(null,7,6), new Board(null,5,4));

			for (const generate of generates)
			{
				const orbs = generate.orbs;
				const dict = {
					orbs: renderOrbs(orbs),
				};
				if (generate.type == 'shape')
				{
					dict.position = tsp.position.shape();
					boardsBar?.boards?.forEach(board=>board.setShape(generate.positions, orbs));
				}else
				{
					let posFrgs = [];
					if (generate.positions.length == 0) continue;
					if (generate.type == 'row')
					{
						const [sequence, reverse] = posSplit(generate.positions, 'row');
						if (sequence.length) posFrgs.push(tsp.position.top({pos: sequence.join(slight_pause)}));
						if (reverse.length) posFrgs.push(tsp.position.bottom({pos: reverse.join(slight_pause)}));
						boardsBar?.boards?.forEach(board=>board.setRows(generate.positions, orbs));
					}else
					{
						const [sequence, reverse] = posSplit(generate.positions, 'colum');
						if (sequence.length) posFrgs.push(tsp.position.left({pos: sequence.join(slight_pause)}));
						if (reverse.length) posFrgs.push(tsp.position.right({pos: reverse.join(slight_pause)}));
						boardsBar?.boards?.forEach(board=>board.setColumns(generate.positions, orbs));
					}
					dict.position = posFrgs.nodeJoin(tsp.word.slight_pause());
				}
				subDocument.push(tsp.skill.fixed_orbs(dict));
			}
			frg.ap(subDocument.nodeJoin(tsp.word.comma()));
			if (boardsBar) {
				boardsBar.boards.forEach(board=>board.refreshTable());
				frg.ap(boardsBar.node);
			}
			
			break;
		}
		case SkillKinds.OrbDropIncrease: { //增加天降
			let {prob, attrs, flag, value} = skill;
			prob = prob || v.percent(100);
			let dict = {
				prob: renderValue(prob, {percent: true}),
				orbs: renderOrbs(attrs, {className: "drop", affix: true}),
				flag: flag && tsp.orbs[flag]({icon: createIcon("orb-" + flag)}) || null,
			};
			if (value?.kind == SkillValueKind.xMaxHP) {
				dict.value = tsp.skill.orb_thorn({value: renderValue(value, {percent: true})})
			}
			frg.ap(flag ? tsp.skill.orb_drop_increase_flag(dict) : tsp.skill.orb_drop_increase(dict));
			break;
		}
		case SkillKinds.VoidEnemyBuff: {
			let buffs = skill.buffs;
			let subDocument = [];
			for (const buff of buffs)
			{
				let dict = {
					icon: createIcon(buff),
				};
				subDocument.push(tsp.skill[buff.replace(/\-/g,'_')](dict));
			}
			let dict = {
				buff: subDocument.nodeJoin(tsp.word.slight_pause()),
			};
			frg.ap(tsp.skill.void_enemy_buff(dict));
			break;
		}
		case SkillKinds.ChangeAttribute: {
			let attr = skill.attr, target = skill.target;
			let dict = {
				attrs: renderAttrs(attr, {affix: true}),
				target: target === 'opponent' ? tsp.target.enemy_all() : tsp.target.self(),
			};
			frg.ap(tsp.skill.change_attribute(dict));
			break;
		}
		case SkillKinds.SetOrbState: {
			const {orbs, state, arg} = skill;
			let dict = {
				orbs: renderOrbs(orbs, {
					//有的时候附加效果限制个数，这个附加图标加到文字里面的图标上面的去不好看也不准确，应该只加到面板里。
					//className: state,
					affix: true
				}),
				icon: createIcon('orb-' + state),
			};
			switch (state)
			{
				case "enhanced":{
					dict.value = renderValue(arg.enhance, {percent: true});
					frg.ap(tsp.skill.set_orb_state_enhanced(dict));
					break;
				}
				case "locked":{
					if (arg.count.value < 42)
						dict.value = renderValue(arg.count, {unit: tsp.unit.orbs});
					frg.ap(tsp.skill.set_orb_state_locked(dict));
					break;
				}
				case "unlocked":{
					frg.ap(tsp.skill.set_orb_state_unlocked(dict));
					break;
				}
				case "bound":{
					frg.ap(tsp.skill.set_orb_state_bound(dict));
					break;
				}
				case "combo-drop":{
					if (arg.count.value < 42)
						dict.value = renderValue(arg.count, {unit: tsp.unit.orbs});
					frg.ap(tsp.skill.set_orb_state_combo_drop(dict));
					break;
				}
				case "nail":{
					if (arg.count.value < 42)
						dict.value = renderValue(arg.count, {unit: tsp.unit.orbs});
					frg.ap(tsp.skill.set_orb_state_nail(dict));
					break;
				}
			}
			break;
		}
		case SkillKinds.RateMultiply: {
			let rate = skill.rate, value = skill.value;
			let dict = {
				rate: tsp.skill["rate_multiply_" + rate]({icon: createIcon(skill.kind + "-" + rate)}),
				value: renderValue(value),
			};
			frg.ap(tsp.skill.rate_multiply(dict));
			break;
		}
		case SkillKinds.ReduceDamage: {
			let attrs = skill.attrs, percent = skill.percent, condition = skill.condition, prob = skill.prob;
			let dict = {
				icon: createIcon(skill.kind),
				attrs: renderAttrs(attrs, {affix: true}),
				value: renderValue(percent, {percent: true}),
				condition: condition ? renderCondition(condition) : null,
				chance: prob.value < 1 ? tsp.value.prob({value: renderValue(prob, { percent:true })}) : null,
			};
			frg.ap(tsp.skill.reduce_damage(dict));
			break;
		}
		case SkillKinds.PowerUp: {
			let { attrs, types, targets, condition, value, reduceDamage, additional, eachTime } = skill;
			let dict = {
				icon: createIcon(skill.kind),
			};
			let comma = tsp.word.comma;
			if (condition) dict.condition = renderCondition(condition);
			
			let targetDict = {}, attrs_types = [];
			if (attrs?.length && !isEqual(attrs, Attributes.all))
			{
				targetDict.attrs = renderAttrs(attrs || [], {affix: attrs?.filter(attr=> attr !== 5)?.length});
				attrs_types.push(targetDict.attrs);
			}
			if (types?.length)
			{
				targetDict.types = renderTypes(types || [], {affix: true});
				attrs_types.push(targetDict.types);
			}
			if (targets != undefined)
			{
				targetDict.target = document.createDocumentFragment();

				//增加队员伤害的技能的目标，删选出来，其他的目标则不显示
				const targetTypes = SkillTarget.type1.concat(SkillTarget.type2);
				let atkUpTarget = targets.filter(n=>targetTypes.includes(n));
				if (atkUpTarget.length) {
					targetDict.target.appendChild(createTeamFlags(atkUpTarget));
				}
				
				targetDict.target.appendChild(targets.map(target=>
					tsp?.target[target.replaceAll("-","_")]?.())
					.nodeJoin(tsp.word.slight_pause()));

				attrs_types.push(targetDict.target);
			}
			if (attrs_types.length)
			{
				targetDict.attrs_types = attrs_types.nodeJoin(tsp.word.slight_pause());
				dict.targets = tsp.skill.power_up_targets(targetDict);
			}

			if (value){
				/*if (attrs?.includes(5) && value.kind == SkillPowerUpKind.Multiplier)
				{ //如果属性有5，则是回复力
					let _value = Object.assign({}, value);
					_value.rcv = value.atk;
					_value.atk = value.rcv;
					value = _value;
				}*/
				if (value.kind == SkillPowerUpKind.Multiplier && Boolean(value.hp || value.atk || value.rcv) == false)
				{
					//不显示 value
				}else
				{
					dict.value = renderPowerUp(value);
				}
			}
			if (reduceDamage && reduceDamage.value > 0) {
				let reduceDamageNode = tsp.skill.reduce_damage({
					value: renderValue(reduceDamage, {percent: true}),
					icon: createIcon("reduce-damage"),
				});
				dict.reduceDamage = [comma(), reduceDamageNode].nodeJoin();
			}
			if (additional?.length) {
				let additionalNode = additional.filter(Boolean).map(subSkill=>renderSkill(subSkill, option));
				dict.additional = [comma(), additionalNode.nodeJoin(comma())].nodeJoin();
			}
			if (eachTime) {
				dict.each_time = tsp.word.each_time();
			}
			frg.ap(tsp.skill.power_up(dict));
			break;
		}
		case SkillKinds.SlotPowerUp: { //增加卡槽伤害倍率
			const {value, targets} = skill;
			
			let dict = {
				icon: createIcon(skill.kind, value.atk > 1 ? "atk-incr" : "atk-decr"),
				targets: document.createDocumentFragment(),
				value: renderPowerUp(value),
			};
			
			dict.targets.append(createTeamFlags(targets));
			dict.targets.append(targets.map(target=>
				tsp?.target[target.replaceAll("-","_")]?.())
				.nodeJoin(tsp.word.slight_pause()));

			frg.ap(tsp.skill.slot_power_up(dict));
			break;
		}
		case SkillKinds.Henshin: { //变身
			let ids = skill.ids, random = skill.random;
			let doms = ids.map(id=>{
				let dom = cardN(id);
				//dom.monDom.onclick = changeToIdInSkillDetail;
				return dom;	})
			let dict = {
				cards: doms.nodeJoin(),
			}
			frg.ap(random ? 
				tsp.skill.random_henshin(dict) :
				tsp.skill.henshin(dict)
				);
			break;
		}
		case SkillKinds.VoidPoison: { //毒无效
			let dict = {
				poison: renderOrbs([7,8], {affix: true})
			}
			frg.ap(tsp.skill.void_poison(dict));
			break;
		}
		case SkillKinds.SkillProviso: { //条件限制才能用技能
			let cond = skill.cond;
			let dict = {
				condition: renderCondition(cond)
			}
			frg.ap(tsp.skill.skill_proviso(dict));
			break;
		}
		case SkillKinds.ImpartAwakenings: { //赋予队员觉醒
			let {attrs, types, target, awakenings} = skill;
			let dict = {
				awakenings: renderAwakenings(awakenings, {affix: true}),
			}
			
			let attrs_types = [];
			if (attrs?.length && !isEqual(attrs, Attributes.all))
			{
				dict.attrs = renderAttrs(attrs || [], {affix: attrs?.filter(attr=> attr !== 5)?.length});
				attrs_types.push(dict.attrs);
			}
			if (types?.length)
			{
				dict.types = renderTypes(types || [], {affix: true});
				attrs_types.push(dict.types);
			}
			if (target)
			{
				dict.target = tsp?.target[target.replaceAll("-","_")]?.();
				attrs_types.push(dict.target);
			}
			if (attrs_types.length)
			{
				dict.attrs_types = attrs_types.nodeJoin(tsp.word.slight_pause());
			}

			frg.ap(tsp.skill.impart_awoken(dict));
			break;
		}
		case SkillKinds.ObstructOpponent: { //条件限制才能用技能
			let type = skill.type, pos = skill.pos, enemy_skills = skill.enemy_skills;
			let slight_pause = tsp.word.slight_pause().textContent;
			let dict = {
				skills: enemy_skills.join(slight_pause)
			}
			let targetDict = { positions: pos?.map(p=>p+1).join(slight_pause)}
			switch (type)
			{
				case "after-me": {
					dict.target = tsp.skill.obstruct_opponent_after_me(targetDict);
					break;
				}
				case "designated-position": {
					dict.target = tsp.skill.obstruct_opponent_designated_position(targetDict);
					break;
				}
				case "before-me": {
					dict.target = tsp.skill.obstruct_opponent_before_me(targetDict);
					break;
				}
				default: {
					dict.target = tsp.cond.unknown();
					break;
				}
			}
			frg.ap(tsp.skill.obstruct_opponent(dict));
			break;
		}
		case SkillKinds.IncreaseDamageCapacity: { //增加伤害上限
			const {cap, targets, attrs, types} = skill;
			let dict = {
				icon: createIcon(skill.kind, cap > 0x7FFFFFFF ? "cap-incr" : "cap-decr"),
				targets: document.createDocumentFragment(),
				cap: cap.bigNumberToString(),
			};

			let targetDict = {}, attrs_types = [];
			if (attrs?.length && !isEqual(attrs, Attributes.all))
			{
				targetDict.attrs = renderAttrs(attrs || [], {affix: attrs?.filter(attr=> attr !== 5)?.length});
				attrs_types.push(targetDict.attrs);
			}
			if (types?.length)
			{
				targetDict.types = renderTypes(types || [], {affix: true});
				attrs_types.push(targetDict.types);
			}
			if (targets != undefined)
			{
				targetDict.target = document.createDocumentFragment();

				//增加队员伤害的技能的目标，删选出来，其他的目标则不显示
				// const targetTypes = SkillTarget.type1;
				// let atkUpTarget = targets.filter(n=>targetTypes.includes(n));
				// if (atkUpTarget.length) {
					targetDict.target.appendChild(createTeamFlags(targets));
				// }
				
				targetDict.target.appendChild(targets.map(target=>
					tsp?.target[target.replaceAll("-","_")]?.())
					.nodeJoin(tsp.word.slight_pause()));

				attrs_types.push(targetDict.target);
			}
			if (attrs_types.length)
			{
				targetDict.attrs_types = attrs_types.nodeJoin(tsp.word.slight_pause());
				dict.targets = tsp.skill.power_up_targets(targetDict);
			}

			frg.ap(tsp.skill.increase_damage_cap(dict));
			break;
		}
		case SkillKinds.BoardJammingStates: { //板面产生干扰状态
			const { state, posType, positions, count, time, attrs } = skill;
			const boardsBar = merge_skill ? null : new BoardSet(new Board(), new Board(null,7,6), new Board(null,5,4));
			const slight_pause = tsp.word.slight_pause().textContent;

			let dict = {
				icon: createIcon('board-' + state),
				state: tsp.board[state.replaceAll("-","_")](),
				position: posType == 'random' ? tsp.position.random() : tsp.position.shape(),
			};
			if (state == 'roulette') { //轮盘位
				const commentContent = [];
				time && commentContent.push(tsp.board.roulette_time({duration: renderValue(v.constant(time), {unit: tsp.unit.seconds})}));
				Array.isArray(attrs) && attrs.length && commentContent.push(tsp.board.roulette_attrs({orbs: renderOrbs(attrs)}));
				dict.comment = tsp.word.comment({content: commentContent.nodeJoin(tsp.word.slight_pause())});
				
				dict.count = renderValue(v.constant(count || positions.flat().length), {unit: tsp.unit.orbs});
				boardsBar?.boards?.forEach(board=>{
					if (posType == 'random')
						board.generateBlockStates('roulette', count);
					else
						board.setShape(positions, null, null, 'roulette');
				});
			}
			if (state == 'clouds') { //云
				const [width, height] = skill.size;
				dict.size = tsp.value.size({ width, height});
				boardsBar?.boards?.forEach(board=>{
					board.generateBlockStates('clouds', count, [width, height], positions);
				});
			}
			if (state == 'immobility') { //封条
				const {colums, rows} = skill.positions;

				let posFrgs = [];
				const [sequenceCols, reverseCols] = posSplit(colums, 'colum');
				if (sequenceCols.length) posFrgs.push(tsp.position.left({pos: sequenceCols.join(slight_pause)}));
				if (reverseCols.length) posFrgs.push(tsp.position.right({pos: reverseCols.join(slight_pause)}));

				const [sequenceRows, reverseRows] = posSplit(rows, 'row');
				if (sequenceRows.length) posFrgs.push(tsp.position.top({pos: sequenceRows.join(slight_pause)}));
				if (reverseRows.length) posFrgs.push(tsp.position.bottom({pos: reverseRows.join(slight_pause)}));
				
				boardsBar?.boards?.forEach(board=>{
					board.setColumns(colums, null, null, 'immobility');
					board.setRows(rows, null, null, 'immobility');
				});

				dict.position = posFrgs.nodeJoin(tsp.word.slight_pause());
			}
			if (state == 'deep-dark') { //超暗暗
				const { min, max } = skill;

				dict.count = renderValue(v.constant(min), {unit: tsp.unit.orbs});
				if (min !== max) {
					dict.count.append(tsp.word.range_hyphen(),renderValue(v.constant(max), {unit: tsp.unit.orbs}));
				}
				boardsBar?.boards?.forEach(board=>{
					if (posType == 'random')
						board.generateBlockStates('deep-dark', min == max ? min : Math.randomInteger(max, min));
					else
						board.setShape(positions, null, null, 'deep-dark');
				});
			}
			frg.ap(tsp.skill.board_jamming_state(dict));

			if (boardsBar) {
				boardsBar.boards.forEach(board=>board.refreshTable());
				frg.ap(boardsBar.node);
			}
			break;
		}
		case SkillKinds.BoardSizeChange: { //改变板面大小
			const { width, height } = skill;

			let dict = {
				icon: createIcon(skill.kind),
				size: tsp.value.size({ width, height}),
			};
			frg.ap(tsp.skill.board_size_change(dict));
			break;
		}
		case SkillKinds.RemoveAssist: { //去除武器
			let dict = {
				icon: createIcon(skill.kind)
			};
			frg.ap(tsp.skill.remove_assist(dict));
			break;
		}
		case SkillKinds.PredictionFalling: { //预知掉落
			let dict = {
				icon: createIcon(skill.kind)
			};
			frg.ap(tsp.skill.prediction_falling(dict));
			break;
		}
		case SkillKinds.BreakingShield: { //破白盾
			let dict = {
				icon: createIcon(skill.kind),
				target: tsp.target.enemy(),
				value: renderValue(skill.value, { percent:true }),
			};
			frg.ap(tsp.skill.gravity(dict));
			break;
		}
		case SkillKinds.PlayVoice: { //播放技能语音
			const { stage, id } = skill;
			const icon = document.createElement("icon");
			icon.className = "awoken-icon";
			icon.setAttribute("data-awoken-icon", 63);
			icon.dataset.voiceId = id || Cards[editBox.mid].voiceId;
			icon.onclick = playOwnVoiceId;

			let dict = {
				stage,
				id,
				icon,
			};
			frg.ap(tsp.skill.play_voice(dict));
			break;
		}
		case SkillKinds.TimesLimit: { //使用次数限制
			const { turns } = skill;
			let dict = {
				turns
			};
			frg.ap(tsp.skill.times_limit(dict));
			break;
		}
		case SkillKinds.FixedStartingPosition: { //固定起手位置
			let dict = {
				icon: createIcon(skill.kind)
			};
			frg.ap(tsp.skill.fixed_starting_position(dict));
			break;
		}
		
		default: {
			console.log("未处理的技能类型",skill.kind, skill);
			frg.ap(skill.kind);
		}
	}
	return frg;
};
function playOwnVoiceId(){
	playVoiceById(parseInt(this.dataset.voiceId,10));
}

function renderStat(stat, option) {
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	const tspt = localTranslating.skill_parse.stats;
	if (tspt[stat])
		frg.ap(tspt[stat](option));
	else
	{
		console.log("未知状态类型",stat);
		frg.ap(tspt.unknown({ type: stat }));
	}
	return frg;
}

function renderAttrs(attrs, option = {}) {
	if (!Array.isArray(attrs))
		attrs = [attrs ?? 0];
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	
	const tsp = localTranslating.skill_parse;
	let contentFrg;
	if (isEqual(attrs, Attributes.all))
	{
		contentFrg = tsp.attrs.all();
	}
	else
	{
		contentFrg = attrs.map(attr => {
			const icon = document.createElement("icon");
			icon.className = "attr-icon";
			icon.setAttribute("data-attr-icon",attr);
			return tsp.attrs?.[attr]({icon: icon});
		})
		.nodeJoin(tsp.word.slight_pause());
	}
	if (option.affix)
		contentFrg = tsp.word.affix_attr({cotent: contentFrg});
	frg.ap(contentFrg);
	return frg;
}

function renderOrbs(attrs, option = {}) {
	if (!Array.isArray(attrs))
		attrs = [attrs ?? 0];
	else
		attrs = [...attrs];

	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;

	const tsp = localTranslating.skill_parse;
	let contentFrg;
	
	if (attrs.every(a=>Number.isInteger(a))) {
		let attrBin = new Bin(attrs);
		if ((attrBin.int & 0b1111111111) == 0b1111111111) { //十种珠子
			frg.ap(tsp.orbs.all());
			attrs.length = 0; //之前是引用，这里会导致数组被清空的错误
		} else if ((attrBin.int & 0b11111) == 0b11111) { //基础5色
			frg.ap(renderOrbs('_5color'));
			attrBin = new Bin(attrBin.int & 0b1111100000);
			attrs = [...attrBin];
			if (attrs.length > 0) { //如果5色以上还有剩的，就增加一个加号
				frg.ap(' + ');
			}
		}
	}
	contentFrg = attrs.map(attr => {
		const icon = document.createElement("icon");
		icon.className = "orb";
		if (option.className) icon.className += " " + option.className;
		icon.setAttribute("data-orb-icon",attr);
		let dict = {
			icon: icon,
		}
		return tsp.orbs?.[attr](dict);
	})
	.nodeJoin(tsp.word.slight_pause());
	frg.ap(contentFrg);
		
	if (option.affix)
		contentFrg = tsp.word.affix_orb({cotent: contentFrg});
	if (option.any && attrs.length >= 2)
		contentFrg = tsp.orbs.any({cotent: contentFrg});
	frg.ap(contentFrg);
	return frg;
}

function renderTypes(types, option = {}) {
	if (!Array.isArray(types))
		types = [types ?? 0];
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	
	const tsp = localTranslating.skill_parse;
	let contentFrg = types.map(type => {
		const icon = document.createElement("icon");
		icon.className = "type-icon";
		icon.setAttribute("data-type-icon",type);
		return tsp.types?.[type]({icon: icon});
	})
	.nodeJoin(tsp.word.slight_pause());
	if (option.affix)
		contentFrg = tsp.word.affix_type({cotent: contentFrg});
	frg.ap(contentFrg);
	return frg;
}

function renderAwakenings(awakenings, option = {}) {
	if (!Array.isArray(awakenings))
		awakenings = [awakenings ?? 0];
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	
	const tsp = localTranslating.skill_parse;
	let contentFrg = awakenings.map(awoken => {
		const icon = document.createElement("icon");
		icon.className = "awoken-icon";
		icon.setAttribute("data-awoken-icon",awoken);
		return tsp.awokens?.[awoken]({icon: icon});
	})
	.nodeJoin(tsp.word.slight_pause());
	if (option.affix)
		contentFrg = tsp.word.affix_awakening({cotent: contentFrg});
	frg.ap(contentFrg);
	return frg;
}

function renderCondition(cond) {
	const frg = document.createDocumentFragment();
	const tsp = localTranslating.skill_parse;
	if (cond.hp) {
		let dict = {
			hp: renderStat('chp'),
			min: renderValue(v.percent(cond.hp.min * 100), {percent: true}),
			max: renderValue(v.percent(cond.hp.max * 100), {percent: true}),
		};
		if (cond.hp.min === cond.hp.max)
			frg.ap(tsp.cond.hp_equal(dict));
		else if (cond.hp.min === 0)
			frg.ap(tsp.cond.hp_less_or_equal(dict));
		else if (cond.hp.max === 1)
			frg.ap(tsp.cond.hp_greater_or_equal(dict));
		else
			frg.ap(tsp.cond.hp_belong_to_range(dict));
	} else if (cond.useSkill) {
		frg.ap(tsp.cond.use_skill(
			cond.useSkill > 1
			? {times: tsp.cond.use_skill_times({times: cond.useSkill})}
			: null
		));
	} else if (cond.multiplayer) {
		frg.ap(tsp.cond.multi_player());
	} else if (cond.remainOrbs) {
		let dict = {
			value: renderValue(v.constant(cond.remainOrbs.count), {unit: tsp.unit.orbs}),
		};
		frg.ap(tsp.cond.remain_orbs(dict));
	} else if (cond.combos) {
		const { min } = cond.combos;
		let dict = { min };
		frg.ap(tsp.power.scale_combos(dict));
	} else if (cond.attrs) {
		const { attrs, min} = cond.attrs;
		let dict = {
			min,
			orbs: renderOrbs(attrs, {affix: true})
		};
		frg.ap(tsp.power.scale_attributes(dict));
	} else if (cond.exact) {
		const { type, attrs , value} = cond.exact;
		if (type === 'combo') {
			let dict = { value };
			frg.ap(tsp.cond.exact_combo(dict));
		} else if (type === 'match-length') {
			let dict = {
				orbs: attrs === 'enhanced' ? tsp.cond.exact_match_enhanced() : renderOrbs(attrs, {affix: true})
			};
			if (value) {
				dict.length = tsp.cond.exact_length({value:renderValue(v.constant(value), {unit: tsp.unit.orbs})});
			}

			frg.ap(tsp.cond.exact_match_length(dict));
		}
	} else if (cond.compo) {
		let dict = {};
		switch (cond.compo.type)
		{
			case 'card':{
				dict.ids = cond.compo.ids.map(mid=>{
					const dom = cardN(mid);
					//dom.monDom.onclick = changeToIdInSkillDetail;
					return dom;
				}).nodeJoin();
				frg.ap(tsp.cond.compo_type_card(dict));
				break;
			}
			case 'series':{
				//搜索并显示合作
				function searchCollab(event) {
					const collabId = parseInt(this.getAttribute('data-collabId'), 10);
					showSearchBySeriesId(collabId, "collab");
					return false;
				}
				dict.ids = cond.compo.ids.map(cid=>{
					const lnk = document.createElement("a");
					lnk.className ="series-search card-collabId";
					lnk.setAttribute("data-collabId",cid);
					lnk.onclick = searchCollab;
					lnk.textContent = cid;
					return lnk;
				}).nodeJoin(tsp.word.slight_pause());
				frg.ap(tsp.cond.compo_type_series(dict));
				break;
			}
			case 'evolution':{
				dict.ids = cond.compo.ids.map(type=>{
					const lnk = document.createElement("a");
					lnk.className ="series-search";
					switch (type)
					{
						case "pixel-evo":{ //像素进化
							lnk.appendChild(tsp.word.evo_type_pixel());
							lnk.onclick = function(){
								showSearch(Cards.filter(card=>card.evoMaterials.includes(3826)));
							};
							break;
						}
						case "reincarnation-evo":{ //转生或超转生
							lnk.appendChild(tsp.word.evo_type_reincarnation());
							lnk.onclick = function(){
								showSearch(Cards.filter(card=>isReincarnated(card)));
							};
							break;
						}
						default:{ //转生或超转生
							return tsp.word.evo_type_unknow({ type });
						}
					}
					return lnk;
				}).nodeJoin(tsp.word.slight_pause());
				frg.ap(tsp.cond.compo_type_evolution(dict));
				break;
			}
			case 'team-total-rarity':{
				dict.rarity = cond.compo.ids;
				frg.ap(tsp.cond.compo_type_team_total_rarity(dict));
				break;
			}
			case 'team-same-rarity':{
				let rarity = cond.compo.ids;
				switch (rarity) {
					case -1:
						dict.rarity = tsp.word.different();
						break;
					case -2:
						dict.rarity = tsp.word.same();
						break;
					default:
						dict.rarity = rarity;
				}
				frg.ap(tsp.cond.compo_type_team_same_rarity(dict));
				break;
			}
		}
	} else if (cond.LShape) {
		let dict = {
			orbs: renderOrbs(cond.LShape.attrs, {affix: true, any: true}),
		};
		frg.ap(tsp.cond.L_shape(dict));
	} else if (cond.heal) {
		let dict = {
			orbs: renderOrbs(5, {affix: true}),
			heal: renderValue(v.constant(cond.heal.min), {unit: tsp.unit.point}),
			stats: renderStat('hp'),
		};
		frg.ap(tsp.cond.heal(dict));
	} else if (cond.stage) {
		let dict = {
			stage: renderStat('cstage'),
			min: renderValue(v.constant(cond.stage.min)),
			max: renderValue(v.constant(cond.stage.max)),
		};
		if (cond.stage.min > 0)
			frg.ap(tsp.cond.stage_greater_or_equal(dict));
		else if (cond.stage.max > 0)
			frg.ap(tsp.cond.stage_less_or_equal(dict));
	} else if (cond.remainAttrOrbs) {
		let dict = {
			orbs: renderOrbs(cond.remainAttrOrbs.attrs, {affix: true}),
			min: renderValue(v.constant(cond.remainAttrOrbs.min)),
			max: renderValue(v.constant(cond.remainAttrOrbs.max)),
		};
		if (cond.remainAttrOrbs.min > 0)
			frg.ap(tsp.cond.orbs_greater_or_equal(dict));
		else if (cond.remainAttrOrbs.max > 0)
			frg.ap(tsp.cond.orbs_less_or_equal(dict));
	} else if (cond.awakeningActivated) {
		let dict = {
			awakenings: renderAwakenings(cond.awakeningActivated.awakenings, {affix: true}),
		};
		frg.ap(tsp.cond.awakening_activated(dict));
	} else if (cond.stateIsActive) {
		const {	type, attrs} = cond.stateIsActive;
		let state;
		switch (type) {
			case "orb-drop-increase": {
				state = tsp.buffs.orb_drop_increase({
					orbs:renderOrbs(attrs, {className: "drop", affix: true})
				});
				break;
			}
		}
		let dict = {
			state: state,
		};
		frg.ap(tsp.cond.state_is_active(dict));
	} else {
		frg.ap(tsp.cond.unknown());
	}
	return frg;
}

function renderPowerUp(powerUp) {
	const frg = document.createDocumentFragment();
	const tsp = localTranslating.skill_parse;
	function renderStats(hp, atk, rcv, option = {}) {
		const mul = option.mul ?? true;
		option.percent = !mul;
		const frg = document.createDocumentFragment();
		const operator = mul ? ' ' : '+';
		let list = [['maxhp', hp], ['atk', atk], ['rcv', rcv]];
		//去除不改变的值
		list = list.filter(([, value]) => value !== (mul ? 1 : 0));
		//&&!(name === 'hp' && value === 0));

		if (list.length === 0) return frg;

		if (list.every(([, value]) => value === list[0][1])) {
			let value = list[0][1];
			//三个值一样
			frg.ap(list.map(([name]) => renderStat(name,name=='maxhp'?{icon:createSkillIcon("maxhp-locked")}:null)).nodeJoin(tsp.word.slight_pause()));
			frg.ap(operator);
			frg.ap(renderValue(v.percent(value * 100), option));
		} else {
			//三个值不一样
			let subDocument = list.map(([name, value]) => {
				let _frg = document.createDocumentFragment();
				_frg.ap(renderStat(name));
				_frg.ap(operator);
				_frg.ap(renderValue(v.percent(value * 100), option));
				return _frg;
			});
			frg.ap(subDocument.nodeJoin(tsp.word.comma()));
		}
		return frg;
	}

	switch (powerUp.kind) {
		case SkillPowerUpKind.Multiplier: {
			let hp = powerUp.hp, atk = powerUp.atk, rcv = powerUp.rcv;
			frg.ap(renderStats(hp, atk, rcv));
			break;
		}
		case SkillPowerUpKind.ScaleAttributes: {
			let attrs = powerUp.attrs, min = powerUp.min, max = powerUp.max, baseAtk = powerUp.baseAtk, baseRcv = powerUp.baseRcv, bonusAtk = powerUp.bonusAtk, bonusRcv = powerUp.bonusRcv;
			
			let dict = {
				orbs: renderOrbs(attrs, {affix: true}),
				min: min,
				stats: renderStats(1, baseAtk, baseRcv),
			}
			if (max !== min)
			{
				let _dict = {
					max: max,
					bonus: renderStats(0, bonusAtk, bonusRcv, {mul: false}),
					stats_max: renderStats(1, baseAtk + bonusAtk * (max-min), baseRcv + bonusRcv * (max-min)),
				}
				dict.bonus = frg.ap(tsp.power.scale_attributes_bonus(_dict));
			}
			frg.ap(tsp.power.scale_attributes(dict));
			
			break;
		}
		case SkillPowerUpKind.ScaleCombos: {
			let min = powerUp.min, max = powerUp.max, baseAtk = powerUp.baseAtk, baseRcv = powerUp.baseRcv, bonusAtk = powerUp.bonusAtk, bonusRcv = powerUp.bonusRcv;
			let dict = {
				min: min,
				stats: renderStats(1, baseAtk, baseRcv),
			}
			if (max !== min)
			{
				let _dict = {
					max: max,
					bonus: renderStats(0, bonusAtk, bonusRcv, {mul: false}),
					stats_max: renderStats(1, baseAtk + bonusAtk * (max-min), baseRcv + bonusRcv * (max-min)),
				}
				dict.bonus = frg.ap(tsp.power.scale_combos_bonus(_dict));
			}
			frg.ap(tsp.power.scale_combos(dict));
			
			break;
		}
		case SkillPowerUpKind.ScaleMatchAttrs: {
			let { matches, min, max, baseAtk, baseRcv, bonusAtk, bonusRcv } = powerUp;
			let dict = {
				matches: matches.map(orbs=>renderOrbs(orbs)).nodeJoin(tsp.word.slight_pause()),
				min: min,
				stats: renderStats(1, baseAtk, baseRcv),
			}
			if (max !== min)
			{
				let _dict = {
					max: max,
					bonus: renderStats(0, bonusAtk, bonusRcv, {mul: false}),
					stats_max: renderStats(1, baseAtk + bonusAtk * (max-min), baseRcv + bonusRcv * (max-min)),
				}
				dict.bonus = frg.ap(tsp.power.scale_match_attrs_bonus(_dict));
			}
			frg.ap(tsp.power.scale_match_attrs(dict));
			
			break;
		}
		case SkillPowerUpKind.ScaleMatchLength: {
			let attrs = powerUp.attrs, min = powerUp.min, max = powerUp.max, baseAtk = powerUp.baseAtk, baseRcv = powerUp.baseRcv, bonusAtk = powerUp.bonusAtk, bonusRcv = powerUp.bonusRcv, matchAll = powerUp.matchAll;
			
			let dict = {
				orbs: renderOrbs(attrs, {affix: true}),
				min: min,
				stats: renderStats(1, baseAtk, baseRcv),
				in_once: matchAll && attrs.length>1 && tsp.word.in_once() || null,
			}
			if (max !== min)
			{
				let _dict = {
					max: max,
					bonus: renderStats(0, bonusAtk, bonusRcv, {mul: false}),
					stats_max: renderStats(1, baseAtk + bonusAtk * (max-min), baseRcv + bonusRcv * (max-min)),
				}
				dict.bonus = frg.ap(tsp.power.scale_match_length_bonus(_dict));
			}
			frg.ap(tsp.power.scale_match_length(dict));
			
			break;
		}
		case SkillPowerUpKind.ScaleCross: {
			let crosses = powerUp.crosses;
			
			/*if (crosses.length >= 2 && crosses.every(cross => cross.atk === crosses[0].atk)) {
				//所有值一样
				let cross = crosses[0];
				let dict = {
					orbs: renderOrbs(crosses.map(cross => cross.attr), {affix: true, any: true}),
					stats: renderStats(1, cross.atk, cross.rcv),
				}
				frg.ap(cross.single ? tsp.power.scale_cross_single(dict) : tsp.power.scale_cross(dict));
			} else {*/
				let subDocument = crosses.map(cross=>{
					let dict = {
						orbs: renderOrbs(cross.attr, {affix: true, any: true}),
						stats: renderStats(1, cross.atk, cross.rcv),
						each_time: cross.single ? null : tsp.word.each_time(),
					}
					return tsp.power.scale_cross(dict);
				});
				frg.ap(subDocument.nodeJoin(tsp.word.comma()));
			//}
			break;
		}
		case SkillPowerUpKind.ScaleRemainOrbs: {
			let min = powerUp.min, max = powerUp.max, baseAtk = powerUp.baseAtk, baseRcv = powerUp.baseRcv, bonusAtk = powerUp.bonusAtk, bonusRcv = powerUp.bonusRcv;
			
			let dict = {
				max: max,
				stats: renderStats(1, baseAtk, baseRcv),
			}
			if (max !== min)
			{
				let _dict = {
					min: min,
					bonus: renderStats(0, bonusAtk, bonusRcv, {mul: false}),
					stats_max: renderStats(1, baseAtk + bonusAtk * (max-min), baseRcv + bonusRcv * (max-min)),
				}
				dict.bonus = frg.ap(tsp.power.scale_remain_orbs_bonus(_dict));
			}
			frg.ap(tsp.power.scale_remain_orbs(dict));
			
			break;
		}
		case SkillPowerUpKind.ScaleStateKind: {
			let awakenings = powerUp.awakenings, attrs = powerUp.attrs, types = powerUp.types, value = powerUp.value;
			let dict = {
				stats: renderStats(value.hp, value.atk, value.rcv, {mul: false, percent: true}),
				awakenings: awakenings?.length && renderAwakenings(awakenings, {affix: true}) || null,
				attrs: attrs?.length && renderAttrs(attrs, {affix: true}) || null,
				types: types?.length && renderTypes(types, {affix: true}) || null,
			}
			frg.ap(tsp.power.scale_state_kind(dict));
			break;
		}
		default:
			frg.ap(tsp.power.unknown({type: powerUp.kind}));
	}
	return frg;
}

function renderValue(_value, option = {}) {
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	const tsp = localTranslating.skill_parse
	const tspv = tsp.value;
	const od = option.decimalDigits, os = option.plusSign;
	let dict;
	switch (_value.kind) {
		case SkillValueKind.Percent: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_percent(dict) :
				tspv.mul_times(dict)
			);
			break;
		}
		case SkillValueKind.Constant: {
			dict = {
				value: _value.value.keepCounts(od,os),
				unit: option.unit ? option.unit() : void 0,
			};
			frg.ap(tspv.const(dict));
			break;
		}
		case SkillValueKind.ConstantTo: {
			dict = {
				value: _value.value.keepCounts(od,os)
			};
			frg.ap(tspv.const_to(dict));
			break;
		}
		case SkillValueKind.xMaxHP: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('maxhp'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xHP: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('hp'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xCHP: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('chp'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xShield: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('shield'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xATK: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('atk'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xRCV: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('rcv'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xTeamHP: {
			let value = _value.value;
			dict = {
				value: option.percent ? (value * 100).keepCounts(od,os) : value.keepCounts(od,os),
				stats: renderStat('teamhp'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xTeamRCV: {
			dict = {
				value: option.percent ? (_value.value * 100).keepCounts(od,os) : _value.value.keepCounts(od,os),
				stats: renderStat('teamrcv'),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.xTeamATK: {
			let attrs = _value.attrs, value = _value.value;
			dict = {
				value: option.percent ? (value * 100).keepCounts(od,os) : value.keepCounts(od,os),
				stats: renderStat('teamatk', {attrs: renderAttrs(attrs, {affix: true})}),
			};
			frg.ap(
				option.percent ? 
				tspv.mul_of_percent(dict) :
				tspv.mul_of_times(dict)
			);
			break;
		}
		case SkillValueKind.HPScale: {
			let min = _value.min, max = _value.max;
			dict = {
				min: tspv.mul_of_times({value: min.keepCounts(od,os), stats:renderStat('atk')}),
				max: tspv.mul_of_times({value: max.keepCounts(od,os), stats:renderStat('atk')}),
				hp: renderStat('hp'),
			};
			
			frg.ap(tspv.hp_scale(dict));
			break;
		}
		case SkillValueKind.RandomATK: {
			let min = _value.min, max = _value.max;
			dict = {
				min: min.keepCounts(od,os),
				atk: renderStat('atk'),
			};
			if (max != min)
			{
				dict.max = tsp.word.range_hyphen().ap(max.keepCounts(od,os));
			}
			
			frg.ap(tspv.random_atk(dict));
			break;
		}
		case SkillValueKind.xAwakenings: {
			let value = _value.value, awakenings = _value.awakenings;
			let dict = {
				value: renderValue(value,{percent : true}),
				awakenings: renderAwakenings(awakenings, {affix: true}),
			}
			frg.ap(tsp.value.x_awakenings(dict));
			break;
		}
		default: {
			console.log("未知数值类型",_value.kind, _value);
			frg.ap(tspv.unknown({ type: _value.kind }));
		}
	}
	return frg;
  }