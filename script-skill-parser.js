let merge_skill = false;

const Attributes = {
    /*0: "Fire",
    1: "Water",
    2: "Wood",
    3: "Light",
    4: "Dark",
    5: "Heart",
    6: "Jammer",
    7: "Poison",
    8: "MPoison",
	9: "Bomb",*/
    Fire: 0,
    Water: 1,
    Wood: 2,
    Light: 3,
    Dark: 4,
    Heart: 5,
    Jammer: 6,
    Poison: 7,
    MPoison: 8,
	Bomb: 9,
}
for (let name in Attributes)
{
	Attributes[Attributes[name]] = name;
}
Attributes.all = function () {
	return [
		this.Fire,
		this.Water,
		this.Wood,
		this.Light,
		this.Dark
	];
}
Attributes._6color = function () {
	return [
		this.Fire,
		this.Water,
		this.Wood,
		this.Light,
		this.Dark,
		this.Heart
	];
}
Attributes.orbs = function () {
	return [
		this.Fire,
		this.Water,
		this.Wood,
		this.Light,
		this.Dark,
		this.Heart,
		this.Jammer,
		this.Poison,
		this.MPoison,
		this.Bomb,
	];
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
class Board
{
	#rowCount = 6;
	#columnCount = 7;
	#data = [];
	constructor(def = null)
	{
		for (let ri=0;ri<this.#rowCount;ri++)
		{
			this.#data.push(new Array(this.#columnCount).fill(Array.isArray(def) ? null : def));
		}
		if (Array.isArray(def))
		{
			this.randomFill(def);
		}
	}
	//填充序列
	sequenceFill(sequence, exclude)
	{
		if (!Array.isArray(exclude) && exclude != null)
			exclude = [exclude];
		const o = sequence.entries();
		//65版部分
		for (let ri=0;ri<this.#data.length;ri++)
		{
			if (ri == 2) ri++;
			const row = this.#data[ri];
			for (let ci=0;ci<row.length;ci++)
			{
				if (ci == 3) ci++;
				//从数组中随机取出一个
				if (exclude && exclude.includes(row[ci])) continue;
				row[ci] = o.next().value?.[1] ?? row[ci];
			}
		}
		//填充剩下的部分
		for (let ri=0;ri<this.#data.length;ri++)
		{
			if (ri == 2) ri++;
			const row = this.#data[ri];
			if (exclude && exclude.includes(row[3])) continue;
			row[3] = o.next().value?.[1] ?? row[3] ;
		}
		const row = this.#data[2];
		for (let ci=0;ci<row.length;ci++)
		{
			if (exclude && exclude.includes(row[ci])) continue;
			row[ci] = o.next().value?.[1] ?? row[ci] ;
		}
	}
	//将有序数组转为随机的数组
	sequenceToRandom(valueArray)
	{
		const randomData = [];
		//将65版之后的的提出来
		const maxCount = this.#rowCount * this.#columnCount
		let secondaryData = valueArray.splice((this.#rowCount - 1) * (this.#columnCount - 1) - (maxCount - valueArray.length));
		
		while(valueArray.length > 0)
		{
			randomData.push(valueArray.randomShift());
		}
		while(secondaryData.length > 0)
		{
			randomData.push(secondaryData.randomShift());
		}
		return randomData;
	}
	//洗版的填充
	randomFill(attrs) 
	{
		let valueArray = new Uint8Array(this.#rowCount * this.#columnCount);
		crypto.getRandomValues(valueArray); //获取符合密码学要求的安全的随机值
		valueArray = Array.from(valueArray.map(x => attrs[x % attrs.length])); //用所有宝珠随机填充
		//之后用每种颜色填充前3个
		attrs.forEach((attr,idx)=>{
			valueArray.fill(attr, idx * 3, (idx + 1) * 3);
		});
		//将上方数据重新乱序排列
		const randomData = this.sequenceToRandom(valueArray);
		this.sequenceFill(randomData);
	}
	//生成珠子的填充
	generateOrbs(attrs, count, exclude)
	{
		let space = this.#rowCount * this.#columnCount;
		if (exclude?.length > 0)
		{
			space -= this.#data.flat().filter(o=>exclude.includes(o)).length;
		}
		
		let valueArray = new Array(space);
		attrs.forEach((attr,idx)=>{
			valueArray.fill(attr, idx * count, (idx + 1) * count);
		});
		//将上方数据重新乱序排列
		const randomData = this.sequenceToRandom(valueArray);
		this.sequenceFill(randomData, exclude);
	}
	//设定横行
	setRow(rows, attr = 0)
	{
		for (let row of rows)
		{
			if (row >= 2) row++;
			const rowData = this.#data[row];
			for (let ri=0;ri<rowData.length;ri++)
			{
				rowData[ri] = attr;
			}
		}
	}
	//设定竖列
	setColumn(cols, attr = 0)
	{
		for (let col of cols)
		{
			if (col >= 3) col++;
			for (let row of this.#data)
			{
				row[col] = attr;
			}
		}
	}
	//设定形状
	setShape(matrix, attr = 0)
	{
		function fillRow(rowData, inputRow, attr)
		{
			for (let col of inputRow)
			{
				if (col == 3) rowData[col] = attr;
				if (col >= 3) col++;
				rowData[col] = attr;
			}
		}
		for (let ri=0;ri<matrix.length;ri++)
		{
			if (ri == 2)
			{
				fillRow(this.#data[ri], matrix[ri], attr);
			}
			fillRow(this.#data[ri >= 2 ? ri+1 : ri], matrix[ri], attr);
		}
	}
	//面板叠加
	overlayBoard(board)
	{	
		for (let ri=0;ri<board.length;ri++)
		{
			const rowNew = board[ri];
			const rowOld = this.#data[ri];
			for (let ci=0;ci<rowNew.length;ci++)
			{
				rowOld[ci] = rowNew[ci] ?? rowOld[ci];
			}
		}
	}
	//导出数组
	valueOf()
	{
		return this.#data;
	}
	//输出表格
	toTable()
	{
		const table = document.createElement("table");
		table.className = "board";
		this.#data.forEach((rowData, ri, rArr) => {
			const row = table.insertRow();
			if (ri == 2 && rArr.length > 5) row.classList.add("board-row4");
	
			rowData.forEach((orbType, ci, cArr) => {
				const cell = row.insertCell();
				const orb = cell.appendChild(document.createElement('icon'));
				orb.className = "orb";
				if (orbType != null) orb.setAttribute("data-orb-icon", orbType);
				if (ci == 3 && cArr.length > 6) cell.classList.add("board-cell5");
			});
		});
		if (this.#data.length > 5)
		{
			table.onclick = function() {
				this.classList.toggle("board-76");
			};
		}
		return table;
	}
}

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
	ScaleStateKindCount: 'scale-state-kind-count',
};

const SkillKinds = {
    Unknown: "unknown",
    ActiveTurns: "active-turns",
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
    RandomSkills: "random-skills",
	SkillProviso: "skill-proviso",
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
    Board7x6: "7x6-board",
    NoSkyfall: "no-skyfall",
	Henshin: "henshin",
	VoidPoison: "void-poison",
	SkillProviso: "skill-proviso",
}

function skillParser(skillId)
{
	function merge(skills)
	{
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
		//破吸部分的合并
		let voidBuff = skills.filter(skill=>skill.kind == SkillKinds.ActiveTurns &&
			skill.skill.kind == SkillKinds.VoidEnemyBuff);
		if (voidBuff.length>1 && voidBuff.every((s,i,a)=>s.turns == a[0].turns))
		{ //把后面的全都合并到第一个
			voidBuff[0].skill.buffs = voidBuff.flatMap(s=>s.skill.buffs);
			voidBuff.shift(); //从筛选中去除第一个
			voidBuff.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}
		let fixedDamages = skills.filter(skill=>skill.kind == SkillKinds.DamageEnemy && skill.attr === 'fixed').filter((skill,idx,arr)=>skill.id==arr[0].id);
		if (fixedDamages.length>1)
		{ //把后面的全都合并到第一个
			fixedDamages[0].times = fixedDamages.length;
			fixedDamages.shift(); //从筛选中去除第一个
			fixedDamages.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}
		let skillPowerUp = skills.filter(skill=>skill.kind == SkillKinds.PowerUp);
		if (skillPowerUp.length>1)
		{
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
					//所有值一样
					crosses.reduce((pre,cur)=>{
						pre.attr = pre.attr.concat(cur.attr);
						return pre;
					});
					skill.value.crosses.splice(1);
				}
			}
			//每个十字技能，先把所有属性合并
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
					if (cur.additional?.length) pre.additional = pre.additional.concat(cur.additional);
					if (cur.reduceDamage)
					{
						if (!pre.reduceDamage)
							pre.ReduceDamage = cur.reduceDamage;
						else if (pre.reduceDamage.kind == cur.reduceDamage.kind)
						pre.reduceDamage.value *= cur.reduceDamage.value;
					}
					return pre
				});
				scaleCross.shift(); //从筛选中去除第一个
				scaleCross.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}

			//长串匹配
			let scaleMatchLength = skillPowerUp.filter(skill=>skill.value.kind === SkillPowerUpKind.ScaleMatchLength);	
			scaleMatchLength = scaleMatchLength.filter((skill,idx,arr)=>{
				let s0 = arr[0];
				let v0 = s0.value;
				let v1 = skill.value;
				return isEqual(skill.condition, s0.condition) &&
				isEqual(skill.attrs, s0.attrs) &&
				isEqual(skill.types, s0.types) &&
				v0.min === v1.min &&
				v0.max === v1.max &&
				(v0.matchAll === v1.matchAll || v0.attrs.length <= 1) && isEqual(v0.attrs, v1.attrs)
				;
			});

			if (scaleMatchLength.length > 1)
			{ //把后面的全都合并到第一个
				scaleMatchLength.reduce((pre,cur)=>{
					if (cur.additional?.length) pre.additional = pre.additional.concat(cur.additional);
					if (cur.reduceDamage)
					{
						if (!pre.reduceDamage)
							pre.ReduceDamage = cur.reduceDamage;
						else if (pre.reduceDamage.kind == cur.reduceDamage.kind)
						pre.reduceDamage.value *= cur.reduceDamage.value;
					}
					if (cur.value.baseAtk !== 1) pre.value.baseAtk *= cur.value.baseAtk;
					if (cur.value.baseRcv !== 1) pre.value.baseRcv *= cur.value.baseRcv;
					pre.value.bonusAtk += cur.value.bonusAtk;
					pre.value.bonusRcv += cur.value.bonusRcv;
					return pre
				});
				scaleMatchLength.shift(); //从筛选中去除第一个
				scaleMatchLength.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
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
					if (cur.additional?.length) pre.additional = pre.additional.concat(cur.additional);
					if (cur.reduceDamage)
					{
						if (!pre.reduceDamage)
							pre.ReduceDamage = cur.reduceDamage;
						else if (pre.reduceDamage.kind == cur.reduceDamage.kind)
						pre.reduceDamage.value *= cur.reduceDamage.value;
					}
					if (cur.value.baseAtk !== 1) pre.value.baseAtk *= cur.value.baseAtk;
					if (cur.value.baseRcv !== 1) pre.value.baseRcv *= cur.value.baseRcv;
					pre.value.bonusAtk += cur.value.bonusAtk;
					pre.value.bonusRcv += cur.value.bonusRcv;
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
					if (cur.additional?.length) pre.additional = pre.additional.concat(cur.additional);
					if (cur.reduceDamage)
					{
						if (!pre.reduceDamage)
							pre.ReduceDamage = cur.reduceDamage;
						else if (pre.reduceDamage.kind == cur.reduceDamage.kind)
						pre.reduceDamage.value *= cur.reduceDamage.value;
					}
					if (cur.value.baseAtk !== 1) pre.value.baseAtk *= cur.value.baseAtk;
					if (cur.value.baseRcv !== 1) pre.value.baseRcv *= cur.value.baseRcv;
					pre.value.bonusAtk += cur.value.bonusAtk;
					pre.value.bonusRcv += cur.value.bonusRcv;
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
					if (cur.additional?.length) pre.additional = pre.additional.concat(cur.additional);
					if (cur.reduceDamage)
					{
						if (!pre.reduceDamage)
							pre.ReduceDamage = cur.reduceDamage;
						else if (pre.reduceDamage.kind == cur.reduceDamage.kind)
						pre.reduceDamage.value *= cur.reduceDamage.value;
					}
					if (cur.value.baseAtk !== 1) pre.value.baseAtk *= cur.value.baseAtk;
					if (cur.value.baseRcv !== 1) pre.value.baseRcv *= cur.value.baseRcv;
					pre.value.bonusAtk += cur.value.bonusAtk;
					pre.value.bonusRcv += cur.value.bonusRcv;
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
					if (cur.additional?.length) pre.additional = pre.additional.concat(cur.additional);
					if (cur.reduceDamage)
					{
						if (!pre.reduceDamage)
							pre.ReduceDamage = cur.reduceDamage;
						else if (pre.reduceDamage.kind == cur.reduceDamage.kind)
						pre.reduceDamage.value *= cur.reduceDamage.value;
					}
					pre.value.atk *= cur.value.atk;
					pre.value.hp *= cur.value.hp;
					pre.value.rcv *= cur.value.rcv;
					return pre
				});
				multiplier.shift(); //从筛选中去除第一个
				multiplier.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
			}
		}
	}
	const skill = Skills[skillId];
	if (!skill) return [];
	if (!parsers[skill.type]) {
		return [{ kind: SkillKinds.Unknown }];
	}
	//此处用apply将这个parser传递到后面解析函数的this里，用于递归解析
	const result = parsers[skill.type].apply({ parser: skillParser }, skill.params);
	const skills = (Array.isArray(result) ? result : [result])
		.filter(s => Boolean(s))
		.map(s => ({ id: skillId, type: skill.type, params: skill.params, ...s }));
	if (merge_skill) merge(skills);
	return skills;
}

//返回flag里值为true的数组，如[1,4,7]
function flags(num){
	/*
	return Array.from(new Array(32),(i,n)=>n).filter(n => num & (1 << n)); //性能太差
	return new Array(32).fill(null).map((i,n)=>n).filter(n => num & (1 << n)); //性能比上者好，但还是不够快
	*/
	const arr = [];
	for (let i = 0; i<32;i++)
	{
		if (num & (1<<i))
		{
			arr.push(i);
		}
	}
	return arr;
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
	exact: function (type, value, attrs) {
        if (attrs === void 0) { attrs = Attributes.all(); }
        return { exact: { type: type, value: value, attrs: attrs } };
	},
	compo: function (type, ids) {
        return { compo: { type: type, ids: ids } };
	},
    remainOrbs: function (count) { return { remainOrbs: { count: count } }; },
    useSkill: function () { return { useSkill: true }; },
	multiplayer: function () { return { multiplayer: true }; },
	prob: function (percent) { return { prob: percent }; },
    LShape: function (attrs) { return { LShape: { attrs: attrs } }; },
	heal: function (min) { return { heal: { min: min } }; },
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
        return { kind: SkillPowerUpKind.ScaleMatchLength, attrs: attrs, matchAll: matchAll ,...this.scale(min, max, baseMul, bonusMul) };
    },
    scaleMatchAttrs: function (matches, min, max, baseMul, bonusMul) {
        return { kind: SkillPowerUpKind.ScaleMatchAttrs, matches: matches ,...this.scale(min, max, baseMul, bonusMul) };
    },
    scaleCross: function (crosses) {
        return { kind: SkillPowerUpKind.ScaleCross, crosses: crosses.map(cross => ({ ...cross, atk: ((cross.atk ?? 100) / 100), rcv: ((cross.rcv ?? 100) / 100)})) };
    },
    scaleStateKindCount: function (awakenings, attrs, types, value) {
        return { kind: SkillPowerUpKind.ScaleStateKindCount, awakenings: awakenings, attrs: attrs, types: types, value: value };
    },
}

function activeTurns(turns, skill) {
    return skill ? { kind: SkillKinds.ActiveTurns, turns: turns, skill: skill } : null;
}
function damageEnemy(target, attr, damage) {
    return { kind: SkillKinds.DamageEnemy, target: target, attr: attr, damage: damage };
}
function vampire(attr, damageValue, healValue) {
    return { kind: SkillKinds.Vampire, attr: attr, damage: damageValue, heal: healValue };
}
function reduceDamage(attrs, percent, condition) {
    return { kind: SkillKinds.ReduceDamage, attrs: attrs, percent: percent, condition: condition };
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
function changeOrbs() {
    return { kind: SkillKinds.ChangeOrbs, changes: Array.from(arguments) };
}
function generateOrbs(orbs, exclude, count, time) {
    return { kind: SkillKinds.GenerateOrbs, orbs: orbs, exclude: exclude, count: count, time: time};
}
function fixedOrbs() {
    return { kind: SkillKinds.FixedOrbs, generates: Array.from(arguments) };
}
function powerUp(attrs, types, value, condition = null, reduceDamageValue = null, additional = []) {
    if (value.kind === SkillPowerUpKind.Multiplier) {
        let hp = value.hp, atk = value.atk, rcv = value.rcv;
        if (hp === 1 && atk === 1 && rcv === 1 && !reduceDamage)
            return null;
    }
    return { kind: SkillKinds.PowerUp, attrs: attrs, types: types, condition: condition, value: value, reduceDamage: reduceDamageValue, additional: additional};
}
function counterAttack(attr, prob, value) {
    return { kind: SkillKinds.CounterAttack, attr: attr, prob: prob, value: value };
}
function setOrbState(orbs, state, arg) {
    return { kind: SkillKinds.SetOrbState, orbs: orbs, state: state, arg: arg};
}
function rateMultiply(value, rate) {
    return { kind: SkillKinds.RateMultiply, value: value, rate: rate };
}
function orbDropIncrease(value, attrs, flag) {
    return { kind: SkillKinds.OrbDropIncrease, value: value, attrs: attrs, flag: flag };
}
function resolve(min, max) {
    return { kind: SkillKinds.Resolve, min: min, max: max };
}
function unbind(normal, awakenings, matches) {
    return { kind: SkillKinds.Unbind, normal: normal, awakenings: awakenings , matches: matches};
}
function bindSkill() { return { kind: SkillKinds.BindSkill}; }
function boardChange(attrs) {
    return { kind: SkillKinds.BoardChange, attrs: attrs };
}
function randomSkills(skills) {
    return { kind: SkillKinds.RandomSkills, skills: skills };
}
function changeAttr(target, attr) {
    return { kind: SkillKinds.ChangeAttribute, target: target, attr: attr ?? 0 };
}
function gravity(value) {
    return { kind: SkillKinds.Gravity, value: value };
}
function voidEnemyBuff(buffs) {
    return { kind: SkillKinds.VoidEnemyBuff, buffs: buffs };
}
function skillBoost(value) { return { kind: SkillKinds.SkillBoost, value: value }; }
function minMatch(value) { return { kind: SkillKinds.MinMatchLength, value: value }; }
function fixedTime(value) { return { kind: SkillKinds.FixedTime, value: v.constant(value) }; }
function addCombo(value) { return { kind: SkillKinds.AddCombo, value: value }; }
function defBreak(value) { return { kind: SkillKinds.DefenseBreak, value: value }; }
function poison(value) { return { kind: SkillKinds.Poison, value: value }; }
function CTW(value) { return { kind: SkillKinds.CTW, value: value }; }
function followAttack(value) { return { kind: SkillKinds.FollowAttack, value: value }; }
function followAttackFixed(value) { return { kind: SkillKinds.FollowAttackFixed, value: v.constant(value) }; }
function autoHeal(value) { return { kind: SkillKinds.AutoHeal, value: value }; }
function timeExtend(value) { return { kind: SkillKinds.TimeExtend, value: value }; }
function delay() { return { kind: SkillKinds.Delay }; }
function massAttack() { return { kind: SkillKinds.MassAttack }; }
function dropRefresh() { return { kind: SkillKinds.DropRefresh }; }
function drum() { return { kind: SkillKinds.Drum }; }
function autoPath() { return { kind: SkillKinds.AutoPath }; }
function leaderChange(type = 0) { return { kind: SkillKinds.LeaderChange, type: type }; }
function board7x6() { return { kind: SkillKinds.Board7x6 }; }
function noSkyfall() { return { kind: SkillKinds.NoSkyfall }; }
function henshin(id) { return { kind: SkillKinds.Henshin, id: id }; }
function voidPoison() { return { kind: SkillKinds.VoidPoison }; }
function skillProviso(cond) { return { kind: SkillKinds.SkillProviso, cond: cond }; }

const parsers = {
	parser: (() => []), //这个用来解决代码提示的报错问题，不起实际作用
  
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
	[38](max, _, percent) { return reduceDamage('all', v.percent(percent), max === 100 ? c.hp(max, max) : c.hp(0, max)); },
	[39](percent, stats1, stats2, mul) { return powerUp(null, null, p.mul(p.stats(mul, stats1, stats2)), c.hp(0, percent)); },
	[40](attr1, attr2, mul) { return powerUp([attr1, attr2], null, p.mul({ atk: mul })); },
	[41](prob, mul, attr) { return counterAttack(attr ?? 0, v.percent(prob), v.percent(mul)); },
	[42](targetAttr, dmgAttr, value) { return damageEnemy(targetAttr, dmgAttr, v.constant(value)); },
	[43](min, max, percent) { return reduceDamage('all', v.percent(percent), c.hp(min, max)); },
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
	[61](attrs, min, base, bonus, incr) { return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min + (incr ?? 0), [base, 100], [bonus, 0])); },
	[62](type, mul) { return powerUp(null, [type], p.mul({ hp: mul, atk: mul })); },
	[63](type, mul) { return powerUp(null, [type], p.mul({ hp: mul, rcv: mul })); },
	[64](type, mul) { return powerUp(null, [type], p.mul({ atk: mul, rcv: mul })); },
	[65](type, mul) { return powerUp(null, [type], p.mul({ hp: mul, atk: mul, rcv: mul })); },
	[66](combo, mul) { return powerUp(null, null, p.scaleCombos(combo, combo, [mul, 100], [0, 0])); },
	[67](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul, rcv: mul })); },
  
	[69](attr, type, mul) { return powerUp([attr], [type], p.mul({ atk: mul })); },
  
	[71](...attrs) { return boardChange(attrs.filter(attr => attr >= 0)); },
  
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
	[104](combo, attrs, stats1, stats2, mul) { return powerUp(flags(attrs), null, p.scaleCombos(combo, combo, p.stats(mul, stats1, stats2), [0, 0])); },
	[105](rcv, atk) { return powerUp(null, null, p.mul({ rcv, atk })); },
	[106](hp, atk) { return powerUp(null, null, p.mul({ hp, atk })); },
	[107](hp) { return powerUp(null, null, p.mul({ hp })); },
	[108](hp, type, atk) { return [powerUp(null, null, p.mul({ hp })), powerUp(null, [type], p.mul({ atk }))]; },
	[109](attrs, len, mul) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), len, len, [mul, 100], [0, 0])); },
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
	[119](attrs, min, base, bonus, max) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), min, max, [base, 100], [bonus, 0])); },
  
	[121](attrs, types, hp, atk, rcv) { return powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })); },
	[122](percent, attrs, types, atk, rcv) { return powerUp(flags(attrs), flags(types), p.mul({ atk, rcv }), c.hp(0, percent)); },
	[123](percent, attrs, types, atk, rcv) { return powerUp(flags(attrs), flags(types), p.mul({ atk, rcv }), c.hp(percent, 100)); },
	[124](attrs1, attrs2, attrs3, attrs4, attrs5, min, mul, bonus) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4, attrs5].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, bonus ? attrs.length : min, [mul, 100], [bonus, 0]));
	},
	[125](mon1, mon2, mon3, mon4, mon5, hp, atk, rcv) { return powerUp(null, null, p.mul({ hp, atk, rcv }), c.compo('card', [mon1, mon2, mon3, mon4, mon5].filter(Boolean))); },
	[126](attrs, turns, turns2, percent) { return activeTurns(turns === turns2 ? turns : [turns, turns2], orbDropIncrease(v.percent(percent), flags(attrs))); },
	[127](cols1, attrs1, cols2, attrs2) {
	  return fixedOrbs(
		{ orbs: flags(attrs1), type: 'col', positions: flags(cols1) },
		{ orbs: flags(attrs2), type: 'col', positions: flags(cols2) }
	  );
	},
	[128](rows1, attrs1, rows2, attrs2) {
	  return fixedOrbs(
		{ orbs: flags(attrs1), type: 'row', positions: flags(rows1) },
		{ orbs: flags(attrs2), type: 'row', positions: flags(rows2) }
	  );
	},
	[129](attrs, types, hp, atk, rcv, rAttrs, rPercent) {
	  return [
		powerUp(flags(attrs), flags(types), p.mul({ hp: hp || 100, atk: atk || 100, rcv: rcv || 100 })),
		rPercent && reduceDamage(flags(rAttrs), v.percent(rPercent)) || null
	  ];
	},
	[130](percent, attrs, types, atk, rcv, rAttrs, rPercent) {
	  return [
		(atk || rcv) && powerUp(flags(attrs), flags(types), p.mul({ atk, rcv }), c.hp(0, percent)) || null,
		rPercent && reduceDamage(flags(rAttrs), v.percent(rPercent), c.hp(0, percent)) || null
	  ];
	},
	[131](percent, attrs, types, atk, rcv, rAttrs, rPercent) {
	  return [
		powerUp(flags(attrs), flags(types), p.mul({ atk, rcv }), c.hp(percent, 100)),
		rPercent && reduceDamage(flags(rAttrs), v.percent(rPercent), c.hp(percent, 100)) || null
	  ];
	},
	[132](turns, time, percent) { return activeTurns(turns, timeExtend(time ? v.constant(time / 10) : v.percent(percent))); },
	[133](attrs, types, atk, rcv) { return powerUp(flags(attrs), flags(types), p.mul({ atk, rcv }), c.useSkill()); },
	[136](attrs1, hp1, atk1, rcv1, attrs2, hp2, atk2, rcv2) {
	  return [
		powerUp(flags(attrs1), null, p.mul({ hp: hp1, atk: atk1, rcv: rcv1 })),
		powerUp(flags(attrs2), null, p.mul({ hp: hp2, atk: atk2, rcv: rcv2 })),
	  ];
	},
	[137](types1, hp1, atk1, rcv1, types2, hp2, atk2, rcv2) {
	  return [
		powerUp(null, flags(types1), p.mul({ hp: hp1, atk: atk1, rcv: rcv1 })),
		powerUp(null, flags(types2), p.mul({ hp: hp2, atk: atk2, rcv: rcv2 })),
	  ];
	},
	[138](...ids) { return ids.flatMap(id => this.parser(id)); },
	[139](attrs, types, percent1, less1, mul1, percent2, less2, mul2) {
	  return [
		powerUp(flags(attrs), flags(types), p.mul({ atk: mul1 }), less1 ? c.hp(0, percent1) : c.hp(percent1, 100)),
		powerUp(flags(attrs), flags(types), p.mul({ atk: mul2 }), less1 ?
		  (less2 ? c.hp(percent1, percent2) : c.hp(percent2, 100)) :
		  (less2 ? c.hp(0, percent2) : c.hp(percent2, percent1))
		),
	  ];
	},
	[140](attrs, mul) { return setOrbState(flags(attrs), 'enhanced', {enhance: v.percent(mul)}); },
	[141](count, to, exclude) { return generateOrbs(flags(to), flags(exclude), count); },
	[142](turns, attr) { return activeTurns(turns, changeAttr('self', attr)); },
  
	[143](mul, dmgAttr) { return damageEnemy('all', dmgAttr ?? 0, v.xTeamHP(mul)); },

	[144](teamAttrs, mul, single, dmgAttr) { return damageEnemy(single ? 'single' : 'all', dmgAttr, v.xTeamATK(flags(teamAttrs), mul)); },
	[145](mul) { return heal(v.xTeamRCV(mul)); },
	[146](turns) { return skillBoost(v.constant(turns)); },
  
	[148](percent) { return rateMultiply(v.percent(percent), 'exp'); },
	[149](mul) { return powerUp(null, null, p.mul({ rcv: mul }), c.exact('match-length', 4, [Attributes.Heart])); },
	[150](_, mul) { return powerUp(null, null, p.mul({ atk: mul }), c.exact('match-length', 5, 'enhanced')); },
	[151](mul1, mul2, percent) {
	  return [
		powerUp(null, null, p.scaleCross([{ single: true, attr: [Attributes.Heart], atk: mul1 || 100, rcv: mul2 || 100 }]), null, v.percent(percent)),
	  ];
	},
	[152](attrs, count) { return setOrbState(flags(attrs), 'locked', {count: v.constant(count)}); },
	[153](attr, _) { return changeAttr('opponent', attr); },
	[154](from, to) { return changeOrbs(fromTo(flags(from), flags(to))); },
	[155](attrs, types, hp, atk, rcv) { return powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv }), c.multiplayer()); },
	[156](turns, awoken1, awoken2, awoken3, type, mul) {
		if (type == 1)
		{
			return heal(v.percentAwakenings([awoken1, awoken2, awoken3].filter(Boolean), v.xRCV(mul)));
		}else
		{
			return activeTurns(turns, type === 2 ?
				powerUp(null, null, p.scaleStateKindCount([awoken1, awoken2, awoken3].filter(Boolean), null, null, p.mul({atk: mul - 100, hp:0, rcv:0}))) :
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
		powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv }))
	  ];
	},
	[159](attrs, min, base, bonus, max) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), min, max, [base, 100], [bonus, 0])); },
	[160](turns, combo) { return activeTurns(turns, addCombo(combo)); },
	[161](percent) { return gravity(v.xMaxHP(percent)); },
	[162]() { return board7x6(); },
	[163](attrs, types, hp, atk, rcv, rAttrs, rPercent) {
	  return [
		noSkyfall(),
		(hp || atk || rcv) && powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })) || null,
		rPercent && reduceDamage(flags(rAttrs), v.percent(rPercent)) || null,
	  ].filter(Boolean);
	},
	[164](attrs1, attrs2, attrs3, attrs4, min, atk, rcv, bonus) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, attrs.length, [atk, rcv], [bonus, bonus]));
	},
	[165](attrs, min, baseAtk, baseRcv, bonusAtk, bonusRcv, incr) { return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min + (incr ?? 0), [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[166](min, baseAtk, baseRcv, bonusAtk, bonusRcv, max) { return powerUp(null, null, p.scaleCombos(min, max, [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[167](attrs, min, baseAtk, baseRcv, bonusAtk, bonusRcv, max) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), min, max, [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[168](turns, awoken1, awoken2, awoken3, awoken4, awoken5, awoken6, mul) {
		return activeTurns(turns, 
			powerUp(null, null, p.scaleStateKindCount([awoken1, awoken2, awoken3, awoken4, awoken5, awoken6].filter(Boolean), null, null, p.mul({atk: mul, hp:0, rcv:0})))
		);
	},
	[169](combo, mul, percent) { return powerUp(null, null, p.scaleCombos(combo, combo, [mul, 100], [0, 0]), null, v.percent(percent)); },
	[170](attrs, min, mul, percent) { return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min, [mul, 100], [0, 0]), null, v.percent(percent)); },
	[171](attrs1, attrs2, attrs3, attrs4, min, mul, percent) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, min, [mul, 100], [0, 0]), null, v.percent(percent));
	},
	[172]() { return setOrbState(null, 'unlocked'); },
	[173](turns, attrAbsorb, comboAbsorb, damageAbsorb) {
	  return activeTurns(turns, voidEnemyBuff(
		[
		  attrAbsorb && 'attr-absorb',
		  comboAbsorb && 'combo-absorb',
		  damageAbsorb && 'damage-absorb'
		].filter((buff) => typeof buff === 'string')
	  ));
	},
	[175](series1, series2, series3, hp, atk, rcv) { return powerUp(null, null, p.mul({ hp, atk, rcv }), c.compo('series', [series1, series2, series3].filter(Boolean))); },
	[176](row1, row2, row3, row4, row5, attrs) {
		return fixedOrbs(
			{ orbs: [attrs ?? 0], type: 'shape', positions: [row1, row2, row3, row4, row5].map(row=>flags(row)) }
		);
	},
	[177](attrs, types, hp, atk, rcv, remains, mul) {
	  return [
		noSkyfall(),
		(hp || atk || rcv) && powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })) || null,
		mul && powerUp(null, null, p.mul({ atk: mul }), c.remainOrbs(remains)) || null
	  ].filter(Boolean);
	},
	[178](time, attrs, types, hp, atk, rcv, attrs2, percent) {
	  return [
		fixedTime(time),
		(hp || atk || rcv) && powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })),
		percent && reduceDamage(flags(attrs2), v.percent(percent)) || null,
	  ].filter(Boolean);
	},
	[179](turns, value, percent, bind, awokenBind) {
		return [
			(bind || awokenBind) ? unbind(bind ?? 0, awokenBind ?? 0) : null,
			activeTurns(turns, autoHealBuff(value ? v.constant(value) : v.xMaxHP(percent)))
		].filter(Boolean);
	},
	[180](turns, percent) { return activeTurns(turns, orbDropIncrease(v.percent(percent), [], 'enhanced')); },
  
	[182](attrs, len, mul, percent) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), len, len, [mul, 100], [0, 0]), null, v.percent(percent)); },
	[183](attrs, types, percent1, atk1, reduce, percent2, atk2, rcv2) {
	  return [
		(percent1 > 0) && powerUp(flags(attrs), flags(types), p.mul({ atk: atk1 || 100 }), c.hp(percent1, 100), v.percent(reduce)) || null,
		(atk2 || rcv2) && powerUp(flags(attrs), flags(types), p.mul({ atk: atk2 || 100, rcv: rcv2 || 100 }), c.hp(0, percent2 || percent1)) || null
	  ].filter(Boolean);
	},
	[184](turns) { return activeTurns(turns, noSkyfall()); },
	[185](time, attrs, types, hp, atk, rcv) {
	  return [
		timeExtend(v.constant(time / 100)),
		powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })),
	  ];
	},
	[186](attrs, types, hp, atk, rcv) {
	  return [
		board7x6(),
		(hp || atk ||rcv) && powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })) || null,
	  ].filter(Boolean);
	},

	[188](value) {
	  return damageEnemy('single', 'fixed', v.constant(value));
	},
	[189]() {
	  return [
		setOrbState(null, 'unlocked'),
		boardChange([0,1,2,3]),
		autoPath(),
	  ];
	},

	[191](turns) {
	  return activeTurns(turns, voidEnemyBuff(['damage-void']));
	},
	[192](attrs, len, mul, combo) {
		return powerUp(null, null, p.scaleMatchLength(flags(attrs), len, len, [mul || 100, 100], [0, 0], true), null, null, [addCombo(combo)]);
	},
	[193](attrs, atk, rcv, percent) {
		return powerUp(null, null, p.mul([atk || 100, rcv || 100]), c.LShape(flags(attrs)), v.percent(percent));
	},
	[194](attrs, min, mul, combo) {
		return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min, [mul, 100], [0, 0]), null, null, [addCombo(combo)]);
	},
	[195](percent) {
	  return selfHarm(percent ? v.xCHP(percent) : v.constantTo(1));
	},
	[196](matches) {
	  return unbind(0,0,matches);
	},
	[197]() {
	  return voidPoison();
	},
	[198](heal, atk, percent, awokenBind) {
		return powerUp(null, null, p.mul([atk, 0]), c.heal(heal), percent && v.percent(percent), awokenBind && [unbind(0, awokenBind ?? 0)]);
	},
	[199](attrs, min, damage) {
		return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[200](attrs, len, damage) {
		return powerUp(null, null, p.scaleMatchLength(flags(attrs), len, len, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[201](attrs1, attrs2, attrs3, attrs4, min, damage) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, attrs.length, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[202](id) {
	  return henshin(id);
	},
	[203](evotype, hp, atk, rcv) { return powerUp(null, null, p.mul({ hp, atk, rcv }), c.compo('evolution', [evotype])); },

	[205](attrs, turns) { return activeTurns(turns, orbDropIncrease(null, flags(attrs == -1 ? 1023: attrs), 'locked')); },
	[206](attrs1, attrs2, attrs3, attrs4, attrs5, min, combo) {
		const attrs = [attrs1, attrs2, attrs3, attrs4, attrs5].filter(Boolean);
		return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, attrs.length, [100, 100], [0, 0]), null, null, [addCombo(combo)]);
	},
	[207](turns, time, row1, row2, row3, row4, row5, count) {
		return activeTurns(turns, count ?
			generateOrbs( ['variation'], null, count, time/100):
			fixedOrbs( { orbs: ['variation'], time: time/100, type: 'shape', positions: [row1, row2, row3, row4, row5].map(row=>flags(row)) })
		);
	},
	[208](count1, to1, exclude1, count2, to2, exclude2) {
		return [
			generateOrbs(flags(to1), flags(exclude1), count1),
			generateOrbs(flags(to2), flags(exclude2), count2),
		];
	},
	[209](combo) {
		return powerUp(null, null, p.scaleCross([{ single: true, attr: [Attributes.Heart], atk: 100, rcv: 100}]), null, null, [addCombo(combo)]);
	},
	[210](attrs, _, combo) {
		return powerUp(null, null, p.scaleCross([{ single: false, attr: flags(attrs), atk: 100, rcv: 100}]), null, null, [addCombo(combo)]);
	},
	[214](turns) { return activeTurns(turns, bindSkill()); },
	[215](turns, attrs) { return activeTurns(turns, setOrbState(flags(attrs), 'bound')); },

	[218](turns) { return skillBoost(v.constant(-turns)); },

	[219](attrs, len, combo) {
		return powerUp(null, null, p.scaleMatchLength(flags(attrs), len, len, [100, 100], [0, 0]), null, null, [addCombo(combo)]);
	},
	[220](attrs, combo) {
		return powerUp(null, null, p.mul([100,100]), c.LShape(flags(attrs)), null, [addCombo(combo)]);
	},

	[223](combo, damage) {
		return powerUp(null, null, p.scaleCombos(combo, combo, [100, 100], [0, 0]), null, null, [followAttackFixed(damage)]);
	},
	[224](turns, attr) { return activeTurns(turns, changeAttr('opponent', attr)); },
	[225](min, max) { return skillProviso(c.hp(min ?? 0, max ?? 100)); },
	[226](turns, percent) { return activeTurns(turns, orbDropIncrease(v.percent(percent), [], 'nail')); },
	[227]() { return leaderChange(1); },
	[228](turns, attrs, types, atk, rcv) {
		return activeTurns(turns,
			powerUp(null, null, p.scaleStateKindCount(null, flags(attrs), flags(types), p.mul({atk: atk, rcv: rcv, hp:0})))
		);
	},
	[229](attrs, types, hp, atk, rcv) {
		return powerUp(null, null, p.scaleStateKindCount(null, flags(attrs), flags(types), p.mul({hp: hp, atk: atk, rcv: rcv})));
	},
};

//将内容添加到代码片段
DocumentFragment.prototype.ap = function(arg)
{
	if (Array.isArray(arg)) //数组，递归自身
	{
		arg.forEach(element=>this.ap(element));
	}
	else if (arg instanceof Node) //属于Node的直接添加
	{
		this.appendChild(arg);
	}
	else //其他内容的转换为文字添加
	{
		this.appendChild(document.createTextNode(arg));
	}
	return this;
}

//将数组和分隔符添加到一个代码片段，类似join
Array.prototype.nodeJoin = function(separator)
{
	const frg = document.createDocumentFragment();
	this.forEach((item, idx, arr)=>{
		frg.ap(item);
		if (idx < (arr.length - 1) && separator != null)
			frg.ap(separator instanceof Node ? separator.cloneNode(true) : separator);
	});
	return frg;
}
//按住Ctrl点击技能在控制台输出技能的对象
function showParsedSkill(event) {
    if (event.ctrlKey) {
        console.log(this.skill);
    }
}

function renderSkillEntry(skills)
{
	const ul = document.createElement("ul");
	ul.className = "card-skill-list";
	skills.forEach(skill=>{
		const li = ul.appendChild(document.createElement("li"));
		li.className = skill.kind;
		li.appendChild(renderSkill(skill));
		li.skill = skill;
		li.addEventListener("click", showParsedSkill);
	});

	if (merge_skill)
	{
		let boardChange = skills.filter(skill=>
			skill.kind == SkillKinds.BoardChange ||
			skill.kind == SkillKinds.GenerateOrbs ||
			skill.kind == SkillKinds.FixedOrbs
		);
		if (boardChange.length > 0)
		{
			const board = new Board();
			for (let skill of boardChange)
			{
				switch (skill.kind)
				{
					case SkillKinds.BoardChange: { //洗版
						const attrs = skill.attrs;
						board.randomFill(attrs);
						break;
					}
					case SkillKinds.GenerateOrbs: { //产生珠子
						let orbs = skill.orbs, exclude = skill.exclude, count = skill.count;
						board.generateOrbs(orbs, count, exclude);
						break;
					}
					case SkillKinds.FixedOrbs: { //固定位置产生珠子
						let generates = skill.generates;
						for (const generate of generates)
						{
							let orb = generate.orbs?.[0];
							if (generate.type == 'shape') {
								board.setShape(generate.positions, orb);
							} else {
								if (generate.type == 'row')
									board.setRow(generate.positions, orb);
								else
									board.setColumn(generate.positions, orb);
							}
						}
						break;
					}
				}
			}
			const li = ul.appendChild(document.createElement("li"));
			li.appendChild(board.toTable());
			li.className = "merge-board";
		}
	}

	return ul;
}
function renderSkill(skill, option = {})
{
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	const tsp = localTranslating.skill_parse;

	function createIcon(iconType, className){
		const idoc = document.createElement("icon");
		idoc.className = `icon-skill${className ? ` ${className}` : ''}`;
		idoc.setAttribute("data-icon-type", iconType);
		return idoc;
	}
	
	if (Array.isArray(skill))
	{
		frg.ap(skill.map(_skill=>renderSkill(_skill)));
		return frg;
	}
	switch (skill.kind) {
		case SkillKinds.Unknown: {
			let dict = {
				type: skill.kind
			};
			frg.ap(tsp.skill.unknown(dict));
			break;
		}
		case SkillKinds.ActiveTurns: { //有回合的行动
			let turns = skill.turns, actionSkill = skill.skill;
			let dict = {
				turns: Array.isArray(turns) ? turns.join(tsp.word.range_hyphen().textContent) : turns,
				actionSkill: renderSkill(actionSkill),
			};
			frg.ap(tsp.skill.active_turns(dict));
			break;
		}
		case SkillKinds.RandomSkills: { //随机技能
			let skills = skill.skills;
			const ul = document.createElement("ul");
			ul.className = "random-active-skill";
			skills.forEach(subSkills=>{
				const li = ul.appendChild(document.createElement("li"));
				li.appendChild(renderSkillEntry(subSkills));
			});
			let dict = {
				skills: ul,
			};
			frg.ap(tsp.skill.random_skills(dict));
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
		case SkillKinds.FollowAttack: { //队长技追打
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
			let dict = {
				icon: createIcon(skill.kind),
				value: renderValue(skill.value, { unit: tsp.unit.seconds }),
			};
			frg.ap(tsp.skill.ctw(dict));
			break;
		}
		case SkillKinds.Gravity: { //重力
			let dict = {
				icon: createIcon(skill.kind),
				target: tsp.target.enemy(),
				value: renderValue(skill.value, { percent:true }),
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
			dict = {
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
			if (normal)
				effects.push(tsp.skill.unbind_normal({icon: createIcon("unbind-normal"), turns: normal}));
			if (awakenings)
				effects.push(tsp.skill.unbind_awakenings({icon: createIcon("unbind-awakenings"), turns: awakenings}));
			if (matches)
				effects.push(tsp.skill.unbind_matches({icon: createIcon("unbind-matches"), turns: matches}));
			frg.ap(effects.nodeJoin(tsp.word.comma()));
			break;
		}
		case SkillKinds.BindSkill: {
			dict = {
				icon: createIcon(skill.kind)
			};
			frg.ap(tsp.skill.bind_skill(dict));
			break;
		}
		case SkillKinds.BoardChange: { //洗版
			const attrs = skill.attrs;
			dict = {
				orbs: renderOrbs(attrs),
			};
			frg.ap(tsp.skill.board_change(dict));
			if (!merge_skill)
			{
				let board = new Board(attrs);
				frg.ap(board.toTable());
			}
			break;
		}
		case SkillKinds.SkillBoost: { //溜
			const value = skill.value;
			let dict = {
				icon: createIcon(skill.kind, SkillValue.isLess(skill.value) ? "boost-decr" : "boost-incr"),
				turns: renderValue(value, { unit:tsp.unit.turns, plusSign:true }),
			};
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
		case SkillKinds.AutoPath: { //小龙的萌新技能
			frg.ap(tsp.skill.auto_path());
			break;
		}
		case SkillKinds.Board7x6: { //76版
			let dict = {
				icon: createIcon(skill.kind),
			};
			frg.ap(tsp.skill.board7x6(dict));
			break;
		}
		case SkillKinds.Vampire: { //吸血
			let attr = skill.attr, damage = skill.damage, heal = skill.heal;
			let _dict = {
				target: tsp.target.enemy_one(),
				damage: renderValue(damage),
				attr: renderAttrs(attr, {affix: (attr === 'self' || attr === 'fixed') ? false : true}),
			};
			dict = {
				icon: createIcon("heal", "hp-incr"),
				damage_enemy: tsp.skill.damage_enemy(_dict),
				heal: renderValue(heal, {percent: true}),
			};
			frg.ap(tsp.skill.vampire(dict));
			break;
		}
		case SkillKinds.CounterAttack: { //反击
			let attr = skill.attr, prob = skill.prob, value = skill.value;
			dict = {
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
				dict = {
					from: renderOrbs(change.from),
					to: renderOrbs(change.to),
				};
				subDocument.push(tsp.skill.change_orbs(dict));
			}
			frg.ap(subDocument.nodeJoin(tsp.word.comma()));
			break;
		}
		case SkillKinds.GenerateOrbs: { //产生珠子
			let orbs = skill.orbs, exclude = skill.exclude, count = skill.count, time = skill.time;
			dict = {
				exclude: exclude?.length ? tsp.word.affix_exclude({cotent: renderOrbs(exclude)}) : void 0,
				orbs: renderOrbs(orbs, {time}),
				value: count,
			};
			frg.ap(tsp.skill.generate_orbs(dict));
			if (!merge_skill)
			{
				let board = new Board();
				board.generateOrbs(orbs, count, exclude);
				frg.ap(board.toTable());
			}
			break;
		}
		case SkillKinds.FixedOrbs: { //固定位置产生珠子
			let generates = skill.generates;
			let slight_pause = tsp.word.slight_pause().textContent;
			let subDocument = [];
			let board = merge_skill ? null : new Board();
			function posSplit(pos, max)
			{
				return {sequence: pos.filter(n=>n<=2).map(n=>n+1), reverse: pos.filter(n=>n>=3).reverse().map(n=>max-n)};
			}
			for (const generate of generates)
			{
				let orb = generate.orbs?.[0], time = generate.time;
				dict = {
					orbs: renderOrbs(orb, {time}),
				};
				if (generate.type == 'shape')
				{
					dict.position = tsp.position.shape();
					if (!merge_skill) board.setShape(generate.positions, orb);
				}else
				{
					let posFrgs = [];
					if (generate.positions.length == 0) continue;
					if (generate.type == 'row')
					{
						const pos = posSplit(generate.positions, 5);
						if (pos.sequence.length) posFrgs.push(tsp.position.top({pos: pos.sequence.join(slight_pause)}));
						if (pos.reverse.length) posFrgs.push(tsp.position.bottom({pos: pos.reverse.join(slight_pause)}));
						if (!merge_skill) board.setRow(generate.positions, orb);
					}else
					{
						const pos = posSplit(generate.positions, 6);
						if (pos.sequence.length) posFrgs.push(tsp.position.left({pos: pos.sequence.join(slight_pause)}));
						if (pos.reverse.length) posFrgs.push(tsp.position.right({pos: pos.reverse.join(slight_pause)}));
						if (!merge_skill) board.setColumn(generate.positions, orb);
					}
					dict.position = posFrgs.nodeJoin(tsp.word.slight_pause());
				}
				subDocument.push(tsp.skill.fixed_orbs(dict));
			}
			frg.ap(subDocument.nodeJoin(tsp.word.comma()));
			if (!merge_skill) frg.ap(board.toTable());
			
			break;
		}
		case SkillKinds.OrbDropIncrease: { //增加天降
			let attrs = skill.attrs, value = skill.value, flag = skill.flag;
			
			dict = {
				chance: value && tsp.value.prob({
					value: renderValue(value, {percent: true})
				}) || null,
				orbs: renderOrbs(attrs, {className: "drop", affix: true}),
				flag: flag && tsp.orbs[flag]({icon: createIcon("orb-" + flag)}) || null,
			};
			frg.ap(flag ? tsp.skill.orb_drop_increase_flag(dict) : tsp.skill.orb_drop_increase(dict));
			break;
		}
		case SkillKinds.VoidEnemyBuff: {
			let buffs = skill.buffs;
			let subDocument = [];
			for (let buff of buffs)
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
			dict = {
				attrs: renderAttrs(attr, {affix: true}),
				target: target === 'opponent' ? tsp.target.enemy_all() : tsp.target.self(),
			};
			frg.ap(tsp.skill.change_attribute(dict));
			break;
		}
		case SkillKinds.SetOrbState: {
			let orbs = skill.orbs, state = skill.state, arg = skill.arg;
			dict = {
				orbs: renderOrbs(orbs, {className: state, affix: true}),
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
			}
			break;
		}
		case SkillKinds.RateMultiply: {
			let rate = skill.rate, value = skill.value;
			dict = {
				rate: tsp.skill["rate_multiply_" + rate]({icon: createIcon(skill.kind + "-" + rate)}),
				value: renderValue(value),
			};
			frg.ap(tsp.skill.rate_multiply(dict));
			break;
		}
		case SkillKinds.ReduceDamage: {
			let attrs = skill.attrs, percent = skill.percent, condition = skill.condition;
			dict = {
				icon: createIcon(skill.kind),
				attrs: renderAttrs(attrs, {affix: true}),
				value: renderValue(percent, {percent: true}),
			};
			if (condition) dict.condition = renderCondition(condition);
			frg.ap(tsp.skill.reduce_damage(dict));
			break;
		}
		case SkillKinds.PowerUp: {
			let attrs = skill.attrs, types = skill.types, condition = skill.condition, value = skill.value, reduceDamage = skill.reduceDamage, additional = skill.additional;
			dict = {
				icon: createIcon(skill.kind),
			};
			if (condition) dict.condition = renderCondition(condition);
			
			let targetDict = {};
			if (attrs?.filter(attr=> attr !== 5)?.length && !isEqual(attrs, Attributes.all())) targetDict.attrs = renderAttrs(attrs || [], {affix: true});
			if (types?.length) targetDict.attrs = renderTypes(types || [], {affix: true});
			
			if (targetDict.attrs || targetDict.types) dict.targets = tsp.skill.power_up_targets(targetDict);

			let subDocument = [];
			if (value){
				if (attrs?.includes(5) && value.kind == SkillPowerUpKind.Multiplier)
				{ //如果属性有5，则是回复力
					let _value = Object.assign({}, value);
					_value.rcv = value.atk;
					_value.atk = value.rcv;
					value = _value;
				}
				if (value.kind == SkillPowerUpKind.Multiplier && Boolean(value.hp || value.atk || value.rcv) == false)
				{
					//不显示 value
				}else
				{
					subDocument.push(renderPowerUp(value));
				}
			}
			if (reduceDamage && reduceDamage.value > 0) {
				subDocument.push(tsp.skill.reduce_damage({
					value: renderValue(reduceDamage, {percent: true}),
					icon: createIcon("reduce-damage"),
				}));
			}
			if (additional?.length) {
				for (let subSkill of additional.filter(Boolean))
				{
					subDocument.push(renderSkill(subSkill, option));
				}
			}
			dict.value = subDocument.filter(Boolean).nodeJoin(tsp.word.comma());
			frg.ap(tsp.skill.power_up(dict));
			break;
		}
		case SkillKinds.Henshin: { //变身
			let id = skill.id;
			const dom = cardN(id);
			dom.monDom.onclick = changeToIdInSkillDetail;
			dict = {
				card: dom,
			}
			frg.ap(tsp.skill.henshin(dict));
			break;
		}
		case SkillKinds.VoidPoison: { //毒无效
			dict = {
				poison: renderOrbs([7,8], {affix: true})
			}
			frg.ap(tsp.skill.void_poison(dict));
			break;
		}
		case SkillKinds.SkillProviso: { //条件限制才能用技能
			let cond = skill.cond;
			dict = {
				condition: renderCondition(cond)
			}
			frg.ap(tsp.skill.skill_proviso(dict));
			break;
		}
		
		default: {
			console.log("未处理的技能类型",skill.kind, skill);
			frg.ap(skill.kind);
		}
	}
	return frg;
};

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
	if (isEqual(attrs, Attributes.all()))
	{
		contentFrg = tsp.attrs.all();
	}
	else
	{
		contentFrg = attrs.map(attr => {
			const icon = document.createElement("icon");
			icon.className = "attr";
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
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;

	const tsp = localTranslating.skill_parse;
	let contentFrg;
	
	if (isEqual(attrs, Attributes.orbs()))
	{
		contentFrg = tsp.orbs.all();
	}
	else if (isEqual(attrs, Attributes.all()))
	{
		contentFrg = renderOrbs('_5color');
	}
	else if (isEqual(attrs, Attributes._6color()))
	{
		contentFrg = tsp.orbs._6color({
			_5color: renderOrbs('_5color'),
			orb_rcv: renderOrbs(5),
		});
	}
	else
	{
		contentFrg = attrs.map(attr => {
			const icon = document.createElement("icon");
			icon.className = "orb";
			if (option.className) icon.className += " " + option.className;
			icon.setAttribute("data-orb-icon",attr);
			let dict = {
				icon: icon,
			}
			if (attr == 'variation') dict.time = renderValue(v.constant(option.time), {unit: tsp.unit.seconds}) ;
			return tsp.orbs?.[attr](dict);
		})
		.nodeJoin(tsp.word.slight_pause());
	}
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
		icon.className = "type";
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
		frg.ap(tsp.cond.use_skill());
	} else if (cond.multiplayer) {
		frg.ap(tsp.cond.multi_player());
	} else if (cond.remainOrbs) {
		let dict = {
			value: renderValue(v.constant(cond.remainOrbs.count), {unit: tsp.unit.orbs}),
		};
		frg.ap(tsp.cond.remain_orbs(dict));
	} else if (cond.exact) {
		if (cond.exact.type === 'combo') {
			let dict = {value: cond.exact.value};
			frg.ap(tsp.cond.exact_combo(dict));
		} else if (cond.exact.type === 'match-length') {
			let dict = {
				value: renderValue(v.constant(cond.exact.value), {unit: tsp.unit.orbs}),
				orbs: cond.exact.attrs === 'enhanced' ? tsp.cond.exact_match_enhanced() : renderOrbs(cond.exact.attrs, {affix: true})
			};
			frg.ap(tsp.cond.exact_match_length(dict));
		}
	} else if (cond.compo) {
		let dict = {};
		switch (cond.compo.type)
		{
			case 'card':{
				dict.ids = cond.compo.ids.map(mid=>{
					const dom = cardN(mid);
					dom.monDom.onclick = changeToIdInSkillDetail;
					return dom;
				}).nodeJoin();
				frg.ap(tsp.cond.compo_type_card(dict));
				break;
			}
			case 'series':{
				dict.ids = cond.compo.ids.map(cid=>{
					const lnk = document.createElement("a");
					lnk.className ="detail-search monster-collabId";
					lnk.setAttribute("data-collabId",cid);
					lnk.onclick = searchCollab;
					lnk.textContent = (cid == 10001 ? Cards[5435] : Cards.find(card=>card.collabId == cid))?.altName?.[0] ?? `No.${cid}`;
					return lnk;
				}).nodeJoin(tsp.word.slight_pause());
				frg.ap(tsp.cond.compo_type_series(dict));
				break;
			}
			case 'evolution':{
				dict.ids = cond.compo.ids.map(eid=>{
					const lnk = document.createElement("a");
					lnk.className ="detail-search";
					switch (eid)
					{
						case 0:{ //像素进化
							lnk.appendChild(tsp.word.evo_type_pixel());
							lnk.onclick = function(){
								showSearch(Cards.filter(card=>card.evoMaterials.includes(3826)));
							};
							break;
						}
						case 2:{ //转生或超转生
							lnk.appendChild(tsp.word.evo_type_reincarnation());
							lnk.onclick = function(){
								showSearch(Cards.filter(card=>isReincarnated(card)));
							};
							break;
						}
						default:{ //转生或超转生
							return tsp.word.evo_type_unknow();
						}
					}
					return lnk;
				}).nodeJoin(tsp.word.slight_pause());
				frg.ap(tsp.cond.compo_type_evolution(dict));
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
		let list = [['hp', hp], ['atk', atk], ['rcv', rcv]];
		//去除不改变的值
		list = list.filter(([, value]) => value !== (mul ? 1 : 0));
		//&&!(name === 'hp' && value === 0));

		if (list.length === 0) return frg;

		if (list.every(([, value]) => value === list[0][1])) {
			let value = list[0][1];
			//三个值一样
			frg.ap(list.map(([name]) => renderStat(name)).nodeJoin(tsp.word.slight_pause()));
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
			let matches = powerUp.matches, min = powerUp.min, max = powerUp.max, baseAtk = powerUp.baseAtk, baseRcv = powerUp.baseRcv, bonusAtk = powerUp.bonusAtk, bonusRcv = powerUp.bonusRcv;
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
					}
					return cross.single ? tsp.power.scale_cross_single(dict) : tsp.power.scale_cross(dict);
				});
				frg.ap(subDocument.nodeJoin(tsp.word.comma()));
			//}
			break;
		}
		case SkillPowerUpKind.ScaleStateKindCount: {
			let awakenings = powerUp.awakenings, attrs = powerUp.attrs, types = powerUp.types, value = powerUp.value;
			let dict = {
				stats: renderStats(value.hp, value.atk, value.rcv, {mul: false, percent: true}),
				awakenings: awakenings?.length && renderAwakenings(awakenings, {affix: true}) || null,
				attrs: attrs?.length && renderAttrs(attrs, {affix: true}) || null,
				types: types?.length && renderTypes(types, {affix: true}) || null,
			}
			frg.ap(tsp.power.scale_state_kind_count(dict));
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
				unit: option.unit ? option.unit() : null,
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