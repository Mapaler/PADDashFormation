//带标签的模板字符串
function tp(strings, ...keys) {
	return (function(...values) {
		let dict = values[values.length - 1] || {};
		let fragment = document.createDocumentFragment();
		fragment.appendChild(document.createTextNode(strings[0]));
		//let result = [strings[0]];
		keys.forEach(function(key, i, arr) {
			let value = Number.isInteger(key) ? values[key] : dict[key];
			if (value == undefined)
			{
				console.log("模板字符串中 %s 未找到输入数据",key);
			}else
			{
				if (!(value instanceof Node))
				{
					value = document.createTextNode(value);
				}
				try{
					fragment.appendChild(arr.lastIndexOf(key) == i ? value : value.cloneNode(true));
				}catch(e)
				{
					console.log(value, e);
					console.log(keys, values);
				}
			}
			fragment.appendChild(document.createTextNode(strings[i + 1]));
		});
		return fragment;
	});
}

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
	ScaleAwakenings: 'scale-awakenings',
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
    RandomSkills: "random-skills",
    ChangeAttribute: "change-attr",
    SkillBoost: "skill-boost",
    AddCombo: "add-combo",
    VoidEnemyBuff: "void-enemy-buff",
    Poison: "poison",
    CTW: "ctw",
    Gravity: "gravity",
    FollowAttack: "follow-attack",
    AutoHeal: "auto-heal",
    TimeExtend: "time-extend",
    DropRefresh: "drop-refresh",
    LeaderChange: "leader-change",
    MinMatchLength: "min-match-len",
    FixedTime: "fixed-time",
    Drum: "drum",
    Board7x6: "7x6-board",
    NoSkyfall: "no-skyfall",
}

function skillParser(skillId)
{
	/*function merge(skills)
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
			unbinds.shift(); //去除第一个
			unbinds.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}
		let fixedDamages = skills.filter(skill=>skill.kind == SkillKinds.DamageEnemy && skill.attr === 'fixed').filter((skill,idx,arr)=>skill.id==arr[0].id);
		if (fixedDamages.length>1)
		{ //把后面的全都合并到第一个
			fixedDamages[0].times = 5;
			fixedDamages.shift(); //去除第一个
			fixedDamages.forEach(skill=>skills.splice(skills.indexOf(skill),1)); //去掉所有后面的
		}

	}*/
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
	//merge(skills);
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
        return { kind: SkillValueKind.Percent, value: (value / 100) || 1 };
    },
    constant: function(value) {
        return { kind: SkillValueKind.Constant, value: value || 0 };
    },
    constantTo: function(value) {
        return { kind: SkillValueKind.ConstantTo, value: value || 1 };
    },
    xMaxHP: function(value) {
        return { kind: SkillValueKind.xMaxHP, value: (value / 100) || 1 };
    },
    xHP: function(value) {
        return { kind: SkillValueKind.xHP, value: (value / 100) || 1 };
    },
    xATK: function(value) {
        return { kind: SkillValueKind.xATK, value: (value / 100) || 1 };
    },
    xRCV: function(value) {
        return { kind: SkillValueKind.xRCV, value: (value / 100) || 1 };
    },
    randomATK: function(min, max) {
        return { kind: SkillValueKind.RandomATK, min: (min / 100) || 1, max: (max / 100) || 1, scale: 1 };
    },
    hpScale: function(min, max, scale) {
        return { kind: SkillValueKind.HPScale, min: (min / 100) || 1, max: (max / 100) || 1, scale: (scale / 100) || 1 };
    },
    xTeamHP: function(value) {
        return { kind: SkillValueKind.xTeamHP, value: (value / 100) || 1 };
    },
    xTeamATK: function(attrs, value) {
        return { kind: SkillValueKind.xTeamATK, attrs: attrs, value: (value / 100) || 1 };
    },
    xTeamRCV: function(value) {
        return { kind: SkillValueKind.xTeamRCV, value: (value / 100) || 1 };
    },
    percentAwakenings: function(awakenings, value) {
        return { kind: SkillValueKind.xAwakenings, awakenings: awakenings, value: value / 100 };
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
	probability: function (percent) { return { probability: percent }; },
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
                hp: (values.hp || 100) / 100,
                atk: (values.atk || 100) / 100,
                rcv: (values.rcv || 100) / 100
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
            max: max || min,
            baseAtk: (baseMul[0] / 100) || 1,
            baseRcv: (baseMul[1] / 100) || 1,
            bonusAtk: (bonusMul[0] / 100) || 0,
            bonusRcv: (bonusMul[1] / 100) || 0
        };
    },
    scaleAttrs: function (attrs, min, max, baseMul, bonusMul) {
        return { kind: SkillPowerUpKind.ScaleAttributes, attrs: attrs ,...this.scale(min, max, baseMul, bonusMul) };
    },
    scaleCombos: function (min, max, baseMul, bonusMul) {
        return { kind: SkillPowerUpKind.ScaleCombos ,...this.scale(min, max, baseMul, bonusMul) };
    },
    scaleMatchLength: function (attrs, min, max, baseMul, bonusMul) {
        return { kind: SkillPowerUpKind.ScaleMatchLength, attrs: attrs ,...this.scale(min, max, baseMul, bonusMul) };
    },
    scaleMatchAttrs: function (matches, min, max, baseMul, bonusMul) {
        return { kind: SkillPowerUpKind.ScaleMatchAttrs, matches: matches ,...this.scale(min, max, baseMul, bonusMul) };
    },
    scaleCross: function (crosses) {
        return { kind: SkillPowerUpKind.ScaleCross, crosses: crosses.map(cross => ({ ...cross, mul: (cross.mul / 100) || 1 })) };
    },
    scaleAwakenings: function (awakenings, value) {
        return { kind: SkillPowerUpKind.ScaleAwakenings, awakenings: awakenings, value: value / 100 };
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
function changeOrbs() {
    return { kind: SkillKinds.ChangeOrbs, changes: Array.from(arguments) };
}
function powerUp(attrs, types, value, condition, reduceDamageValue) {
    if (value.kind === SkillPowerUpKind.Multiplier) {
        let hp = value.hp, atk = value.atk, rcv = value.rcv;
        if (hp === 1 && atk === 1 && rcv === 1 && !reduceDamage)
            return null;
    }
    return { kind: SkillKinds.PowerUp, attrs: attrs, types: types, condition: condition, value: value, reduceDamage: reduceDamageValue };
}
function counterAttack(attr, prob, value) {
    return { kind: SkillKinds.CounterAttack, attr: attr, prob: prob, value: value };
}
function setOrbState(orbs, state) {
    return { kind: SkillKinds.SetOrbState, orbs: orbs, state: state };
}
function rateMultiply(value, rate) {
    return { kind: SkillKinds.RateMultiply, value: value, rate: rate };
}
function orbDropIncrease(value, attrs) {
    return { kind: SkillKinds.OrbDropIncrease, value: value, attrs: attrs };
}
function resolve(min, condition) {
    return { kind: SkillKinds.Resolve, min: min, max: 1, condition: condition };
}
function unbind(normal, awakenings, matches) {
    return { kind: SkillKinds.Unbind, normal: normal, awakenings: awakenings , matches: matches};
}
function boardChange(attrs) {
    return { kind: SkillKinds.BoardChange, attrs: attrs };
}
function randomSkills(skills) {
    return { kind: SkillKinds.RandomSkills, skills: skills };
}
function changeAttr(target, attr) {
    return { kind: SkillKinds.ChangeAttribute, target: target, attr: attr || 0 };
}
function gravity(value) {
    return { kind: SkillKinds.Gravity, value: value };
}
function voidEnemyBuff(buffs) {
    return { kind: SkillKinds.VoidEnemyBuff, buffs: buffs };
}
function skillBoost(value) { return { kind: SkillKinds.SkillBoost, value: value }; }
function minMatch(value) { return { kind: SkillKinds.MinMatchLength, value: value }; }
function fixedTime(value) { return { kind: SkillKinds.FixedTime, value: value }; }
function addCombo(value) { return { kind: SkillKinds.AddCombo, value: value }; }
function defBreak(value) { return { kind: SkillKinds.DefenseBreak, value: value }; }
function poison(value) { return { kind: SkillKinds.Poison, value: value }; }
function CTW(value) { return { kind: SkillKinds.CTW, value: value }; }
function followAttack(value) { return { kind: SkillKinds.FollowAttack, value: value }; }
function autoHeal(value) { return { kind: SkillKinds.AutoHeal, value: value }; }
function timeExtend(value) { return { kind: SkillKinds.TimeExtend, value: value }; }
function delay() { return { kind: SkillKinds.Delay }; }
function massAttack() { return { kind: SkillKinds.MassAttack }; }
function dropRefresh() { return { kind: SkillKinds.DropRefresh }; }
function drum() { return { kind: SkillKinds.Drum }; }
function leaderChange() { return { kind: SkillKinds.LeaderChange }; }
function board7x6() { return { kind: SkillKinds.Board7x6 }; }
function noSkyfall() { return { kind: SkillKinds.NoSkyfall }; }

const parsers = {
	parser: (() => []), //这个用来解决代码提示的报错问题，不起实际作用
  
	[0](attr, mul) { return damageEnemy('all', attr, v.xATK(mul)); },
	[1](attr, value) { return damageEnemy('all', attr, v.constant(value)); },
	[2](mul) { return damageEnemy('single', 'self', v.xATK(mul)); },
	[3](turns, percent) { return activeTurns(turns, reduceDamage('all', v.percent(percent))); },
	[4](mul) { return poison(v.xATK(mul)); },
	[5](time) { return CTW(v.constant(time)); },
	[6](percent) { return gravity(v.xHP(percent)); },
	[7](mul) { return heal(v.xRCV(mul)); },
	[8](value) { return heal(v.constant(value)); },
	[9](from, to) { return changeOrbs({ kind: 'from', from: [from || 0], to: [to || 0] }); },
	[10]() { return dropRefresh(); },
	[11](attr, mul) { return powerUp([attr], null, p.mul({ atk: mul })); },
	[12](mul) { return followAttack(v.xATK(mul)); },
	[13](mul) { return autoHeal(v.xRCV(mul)); },
	[14](min, percent) { return resolve(v.percent(min), c.probability(percent)); },
	[15](time) { return timeExtend(v.constant(time / 100)); },
	[16](percent) { return reduceDamage('all', v.percent(percent)); },
	[17](attr, percent) { return reduceDamage([attr], v.percent(percent)); },
	[18](turns) { return activeTurns(turns, delay()); },
	[19](turns, percent) { return activeTurns(turns, defBreak(v.percent(percent))); },
	[20](from1, to1, from2, to2) { return changeOrbs({ kind: 'from', from: [from1 || 0], to: [to1 || 0] }, { kind: 'from', from: [from2 || 0], to: [to2 || 0] }); },
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
	[41](prob, mul, attr) { return counterAttack(attr || 0, v.percent(prob), v.percent(mul)); },
	[42](targetAttr, dmgAttr, value) { return damageEnemy(targetAttr, dmgAttr, v.constant(value)); },
	[43](min, max, percent) { return reduceDamage('all', v.percent(percent), c.hp(min, max)); },
	[44](percent, stats1, stats2, mul) { return powerUp(null, null, p.mul(p.stats(mul, stats1, stats2)), c.hp(percent, 100)); },
	[45](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul, atk: mul })); },
	[46](attr1, attr2, mul) { return powerUp([attr1, attr2], null, p.mul({ hp: mul })); },
  
	[48](attr, mul) { return powerUp([attr], null, p.mul({ hp: mul })); },
	[49](attr, mul) { return powerUp([attr], null, p.mul({ rcv: mul })); },
	[50](turns, attr, mul) { return activeTurns(turns, powerUp([attr], null, p.mul({ atk: mul }))); },
	[51](turns) { return activeTurns(turns, massAttack()); },
	[52](attr) { return setOrbState([attr], 'enhanced'); },
	[53](mul) { return rateMultiply(v.percent(mul), 'drop'); },
	[54](mul) { return rateMultiply(v.percent(mul), 'coin'); },
	[55](value) { return damageEnemy('single', 'fixed', v.constant(value)); },
	[56](value) { return damageEnemy('all', 'fixed', v.constant(value)); },
  
	[58](attr, min, max) { return damageEnemy('all', attr, v.randomATK(min, max)); },
	[59](attr, min, max) { return damageEnemy('single', attr, v.randomATK(min, max)); },
	[60](turns, mul, attr) { return activeTurns(turns, counterAttack(attr, v.percent(100), v.percent(mul))); },
	[61](attrs, min, base, bonus, incr) { return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min + (incr || 0), [base, 100], [bonus, 0])); },
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
			selfHarm(percent ? v.xHP(100 - percent) : v.constantTo(1)),
			damageEnemy('single', attr, v.randomATK(min, max))
		];
	},
	[85](attr, min, max, percent) {
		return [
			selfHarm(percent ? v.xHP(100 - percent) : v.constantTo(1)),
			damageEnemy('all', attr, v.randomATK(min, max))
		];
	},
	[86](attr, value, _, percent) {
		return [
			selfHarm(percent ? v.xHP(100 - percent) : v.constantTo(1)),
			damageEnemy('single', attr, v.constant(value))
		];
	},
	[87](attr, value, _, percent) {
		return [
			selfHarm(percent ? v.xHP(100 - percent) : v.constantTo(1)),
			damageEnemy('all', attr, v.constant(value))
		];
	},
	[88](turns, type, mul) { return activeTurns(turns, powerUp(null, [type], p.mul({ atk: mul }))); },
  
	[90](turns, attr1, attr2, mul) { return activeTurns(turns, powerUp([attr1, attr2], null, p.mul({ atk: mul }))); },
	[91](attr1, attr2) { return setOrbState([attr1, attr2], 'enhanced'); },
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
		(bind || awokenBind) ? unbind(bind || 0, awokenBind || 0) : null,
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
	[126](attrs, turns, _, percent) { return activeTurns(turns, orbDropIncrease(v.percent(percent), flags(attrs))); },
	[127](cols1, attrs1, cols2, attrs2) {
	  return changeOrbs(
		{ kind: 'fixed', to: flags(attrs1), type: 'col', positions: flags(cols1) },
		{ kind: 'fixed', to: flags(attrs2), type: 'col', positions: flags(cols2) }
	  );
	},
	[128](rows1, attrs1, rows2, attrs2) {
	  return changeOrbs(
		{ kind: 'fixed', to: flags(attrs1), type: 'row', positions: flags(rows1) },
		{ kind: 'fixed', to: flags(attrs2), type: 'row', positions: flags(rows2) }
	  );
	},
	[129](attrs, types, hp, atk, rcv, rAttrs, rPercent) {
	  return [
		powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })),
		rPercent && reduceDamage(flags(rAttrs), v.percent(rPercent)) || null
	  ];
	},
	[130](percent, attrs, types, atk, rcv, rAttrs, rPercent) {
	  return [
		powerUp(flags(attrs), flags(types), p.mul({ atk, rcv }), c.hp(0, percent)),
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
	[140](attrs) { return setOrbState(flags(attrs), 'enhanced'); },
	[141](count, to, exclude) { return changeOrbs({ kind: 'gen', to: flags(to), exclude: flags(exclude), count }); },
	[142](turns, attr) { return activeTurns(turns, changeAttr('self', attr)); },
  
	[143](mul, dmgAttr) { return damageEnemy('all', dmgAttr || 0, v.xTeamHP(mul)); },

	[144](teamAttrs, mul, single, dmgAttr) { return damageEnemy(single ? 'single' : 'all', dmgAttr, v.xTeamATK(flags(teamAttrs), mul)); },
	[145](mul) { return heal(v.xTeamRCV(mul)); },
	[146](turns) { return skillBoost(turns); },
  
	[148](percent) { return rateMultiply(v.percent(percent), 'exp'); },
	[149](mul) { return powerUp(null, null, p.mul({ rcv: mul }), c.exact('match-length', 4, [Attributes.Heart])); },
	[150](_, mul) { return powerUp(null, null, p.mul({ atk: mul }), c.exact('match-length', 5, 'enhanced')); },
	[151](mul, _, percent) {
	  return [
		powerUp(null, null, p.scaleCross([{ single: true, attr: Attributes.Heart, mul }]), undefined, v.percent(percent)),
	  ];
	},
	[152](attrs) { return setOrbState(flags(attrs), 'locked'); },
	[153](attr) { return changeAttr('opponent', attr); },
	[154](from, to) { return changeOrbs({ kind: 'from', to: flags(to), from: flags(from) }); },
	[155](attrs, types, hp, atk, rcv) { return powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv }), c.multiplayer()); },
	[156](turns, awoken1, awoken2, awoken3, type, mul) {
	  return activeTurns(turns, type === 2 ?
		powerUp(null, null, p.scaleAwakenings([awoken1, awoken2, awoken3].filter(Boolean), mul)) :
		reduceDamage('all', v.percentAwakenings([awoken1, awoken2, awoken3].filter(Boolean), mul))
	  );
	},
	[157](attr1, mul1, attr2, mul2, attr3, mul3) {
	  return powerUp(null, null, p.scaleCross([
		{ single: false, attr: attr1, mul: mul1 },
		{ single: false, attr: attr2, mul: mul2 },
		{ single: false, attr: attr3, mul: mul3 }
	  ].filter(cross => cross.mul)));
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
		powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })),
		rPercent && reduceDamage(flags(rAttrs), v.percent(rPercent)) || null,
	  ];
	},
	[164](attrs1, attrs2, attrs3, attrs4, min, atk, rcv, bonus) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, attrs.length, [atk, rcv], [bonus, bonus]));
	},
	[165](attrs, min, baseAtk, baseRcv, bonusAtk, bonusRcv, incr) { return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min + (incr || 0), [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[166](min, baseAtk, baseRcv, bonusAtk, bonusRcv, max) { return powerUp(null, null, p.scaleCombos(min, max, [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
	[167](attrs, min, baseAtk, baseRcv, bonusAtk, bonusRcv, max) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), min, max, [baseAtk, baseRcv], [bonusAtk, bonusRcv])); },
  
	[169](combo, mul, percent) { return powerUp(null, null, p.scaleCombos(combo, combo, [mul, 100], [0, 0]), undefined, v.percent(percent)); },
	[170](attrs, min, mul, percent) { return powerUp(null, null, p.scaleAttrs(flags(attrs), min, min, [mul, 100], [0, 0]), undefined, v.percent(percent)); },
	[171](attrs1, attrs2, attrs3, attrs4, min, mul, percent) {
	  const attrs = [attrs1, attrs2, attrs3, attrs4].filter(Boolean);
	  return powerUp(null, null, p.scaleMatchAttrs(attrs.map(flags), min, min, [mul, 0], [0, 0]), undefined, v.percent(percent));
	},
	[172]() { return setOrbState(null, 'unlocked'); },
	[173](turns, attrAbsorb, _, damageAbsorb) {
	  return activeTurns(turns, voidEnemyBuff(
		[
		  attrAbsorb && 'attr-absorb',
		  damageAbsorb && 'damage-absorb'
		].filter((buff) => typeof buff === 'string')
	  ));
	},
	[175](series1, series2, series3, hp, atk, rcv) { return powerUp(null, null, p.mul({ hp, atk, rcv }), c.compo('series', [series1, series2, series3].filter(Boolean))); },
  
	[177](_0, _1, _2, _3, _4, remains, mul) {
	  return [
		noSkyfall(),
		powerUp(null, null, p.mul({ atk: mul }), c.remainOrbs(remains))
	  ];
	},
	[178](time, attrs, types, hp, atk, rcv) {
	  return [
		fixedTime(time),
		powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv }))
	  ];
	},
	[179](turns, value, percent, bind, awokenBind) {
		return [
			(bind || awokenBind) ? unbind(bind || 0, awokenBind || 0) : null,
			activeTurns(turns, autoHealBuff(value ? v.constant(value) : v.xMaxHP(percent)))
		].filter(Boolean);
	},
	[180](turns, percent) { return activeTurns(turns, orbDropIncrease(v.percent(percent), 'enhanced')); },
  
	[182](attrs, len, mul, percent) { return powerUp(null, null, p.scaleMatchLength(flags(attrs), len, len, [mul, 100], [0, 0]), undefined, v.percent(percent)); },
	[183](attrs, types, percent1, atk1, rcv1, percent2, atk2, rcv2) {
	  return [
		powerUp(flags(attrs), flags(types), p.mul({ atk: atk1, rcv: rcv1 }), c.hp(percent1, 100)),
		powerUp(flags(attrs), flags(types), p.mul({ atk: atk2, rcv: rcv2 }), c.hp(0, percent2 || percent1)),
	  ];
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
		powerUp(flags(attrs), flags(types), p.mul({ hp, atk, rcv })),
	  ];
	},
	[188](value) {
	  return damageEnemy('single', 'fixed', v.constant(value));
	},
	[195](percent) {
	  return selfHarm(percent ? v.xHP(percent) : v.constantTo(1));
	},
	[196](matches) {
	  return unbind(0,0,matches);
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
		if (idx < (arr.length - 1))
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
	let dict;
	switch (skill.kind) {
		case SkillKinds.Unknown: {
			dict = {
				type: skill.kind
			};
			frg.ap(tsp.skill.unknown(dict));
			break;
		}
		case SkillKinds.ActiveTurns: { //有回合的行动
			let turns = skill.turns, actionSkill = skill.skill;
			dict = {
				turns: turns,
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
			dict = {
				skills: ul,
			};
			frg.ap(tsp.skill.random_skills(dict));
			break;
		}
		case SkillKinds.Delay: { //威吓
			dict = {
				icon: createIcon("delay"),
			};
			frg.ap(tsp.skill.delay(dict));
			break;
		}
		case SkillKinds.MassAttack: { //全体攻击
			dict = {
				icon: createIcon("mass-attack"),
			};
			frg.ap(tsp.skill.mass_attack(dict));
			break;
		}
		case SkillKinds.LeaderChange: { //切换队长
			dict = {
				icon: createIcon("leader-change"),
			};
			frg.ap(tsp.skill.leader_change(dict));
			break;
		}
		case SkillKinds.NoSkyfall: { //无天降
			dict = {
				icon: createIcon("no-skyfall"),
			};
			frg.ap(tsp.skill.no_skyfall(dict));
			break;
		}
		case SkillKinds.SelfHarm: { //主动自残
			let value = skill.value;
			dict = {
				icon: createIcon("heal", "hp-decr"),
				value: renderValue(value, {percent: true}),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.self_harm(dict));
			break;
		}
		case SkillKinds.Heal: { //主动回血buff
			let value = skill.value;
			dict = {
				icon: createIcon("heal", "hp-incr"),
				//icon: createIcon("auto-heal"),
				value: renderValue(value, {unit: tsp.unit.point, percent: value.kind == SkillValueKind.xRCV ? false : true}),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.heal(dict));
			break;
		}
		case SkillKinds.AutoHealBuff: { //自动回血buff
			dict = {
				icon: createIcon("auto-heal"),
				value: renderValue(skill.value, {unit: tsp.unit.point, percent: true}),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.auto_heal_buff(dict));
			break;
		}
		case SkillKinds.DefenseBreak: { //破防
			dict = {
				icon: createIcon("defense-break"),
				value: renderValue(skill.value, {percent: true}),
			};
			frg.ap(tsp.skill.defense_break(dict));
			break;
		}
		case SkillKinds.Poison: { //毒
			dict = {
				icon: createIcon("poison"),
				belong_to: tsp.target.self(),
				target: tsp.target.enemy(),
				stats: tsp.stats.hp(),
				value: renderValue(skill.value),
			};
			frg.ap(tsp.skill.poison(dict));
			break;
		}
		case SkillKinds.TimeExtend: { //时间变化buff
			dict = {
				icon: createIcon("status-time", SkillValue.isLess(skill.value) ? "time-decr" : "time-incr"),
				value: renderValue(skill.value, { unit:tsp.unit.seconds, plusSign:true, percent:true }),
			};
			frg.ap(tsp.skill.time_extend(dict));
			break;
		}
		case SkillKinds.FollowAttack: { //队长技追打
			dict = {
				//icon: createIcon("follow_attack"),
				belong_to: tsp.target.self(),
				target: tsp.target.enemy(),
				value: renderValue(skill.value),
			};
			frg.ap(tsp.skill.follow_attack(dict));
			break;
		}
		case SkillKinds.AutoHeal: { //队长技自动回血
			dict = {
				icon: createIcon("auto-heal"),
				belong_to: tsp.target.self(),
				value: renderValue(skill.value),
				stats: tsp.stats.hp(),
			};
			frg.ap(tsp.skill.auto_heal(dict));
			break;
		}
		case SkillKinds.CTW: { //时间暂停
			frg.ap(createIcon("ctw"));
			frg.ap(tsp.skill.ctw(renderValue(skill.value, { unit: tsp.unit.seconds })));
			break;
		}
		case SkillKinds.Gravity: { //重力
			frg.ap(tsp.skill.gravity({
				icon: createIcon("gravity"),
				target: tsp.target.enemy(),
				value: renderValue(skill.value, { percent:true }),
			}));
			break;
		}
		case SkillKinds.Resolve: { //根性
			frg.ap(createIcon("resolve"));
			frg.ap(tsp.skill.resolve(renderStat('hp'), renderValue(skill.min, { percent:true }), skill.condition.probability));
			break;
		}
		
		case SkillKinds.DamageEnemy: { //大炮和固伤
			let attr = skill.attr, target = skill.target, damage = skill.damage;
			if (attr == null) break; //没有属性时，编号为0的空技能
			dict = {
				target: target === 'all' ? tsp.target.enemy_all() : target === 'single' ? tsp.target.enemy_one() : tsp.target.enemy_attr({attr: renderAttrs(target)}),
				damage: renderValue(damage, {unit: tsp.unit.point}),
				attr: renderAttrs(attr, {affix: (attr === 'self' || attr === 'fixed') ? false : true})
			};
			frg.ap(tsp.skill.damage_enemy(dict));
			break;
		}
		case SkillKinds.Vampire: {
			let attr = skill.attr, damage = skill.damage, heal = skill.heal;
			dict = {
				icon: createIcon("heal", "hp-incr"),
				target: tsp.target.enemy_one(),
				damage: renderValue(damage),
				attr: renderAttrs(attr, {affix: (attr === 'self' || attr === 'fixed') ? false : true}),
				heal: renderValue(heal, {percent: true}),
			};
			frg.ap(tsp.skill.vampire(dict));
			break;
		}
		case SkillKinds.Unbind: {
			let normal = skill.normal, awakenings = skill.awakenings, matches = skill.matches;
			console.log(normal,awakenings)
			let effects = [];
			if (normal)
				effects.push(tsp.skill.unbind_normal({icon: createIcon("unbind-normal"), value: normal}));
			if (awakenings)
				effects.push(tsp.skill.unbind_awakenings({icon: createIcon("unbind-awakenings"), value: awakenings}));
			if (matches)
				effects.push(tsp.skill.unbind_matches({icon: createIcon("unbind-matches"), value: matches}));
			frg.ap(effects.nodeJoin(tsp.word.comma()));
			break;
		}
		/*

		case SkillKinds.BoardChange: {
		const { attrs } = skill as Skill.BoardChange;
		return (
			<span className="CardSkill-skill">
			<AssetBox className="CardSkill-icon-box" title="Board change">
				<Asset assetId="status-combo" className="CardSkill-icon" />
				<Asset assetId="overlay-drop" className="CardSkill-icon" />
			</AssetBox>
			{renderOrbs(attrs)}
			</span>
		);
		}
		case SkillKinds.SkillBoost: {
		const { value } = skill as Skill.WithValue<number>;
		return (
			<span className="CardSkill-skill">
			<Asset assetId="skill-boost" className="CardSkill-icon" title="Skill boost" />
			{value} turns
			</span>
		);
		}
		case SkillKinds.AddCombo: {
		const { value } = skill as Skill.WithValue<number>;
		return (
			<span className="CardSkill-skill">
			<Asset assetId={`status-combo-p${value}`} className="CardSkill-icon" title={`Add ${value} combo`} />
			</span>
		);
		}
		case SkillKinds.FixedTime: {
		const { value } = skill as Skill.WithValue<number>;
		return (
			<span className="CardSkill-skill">
			<AssetBox className="CardSkill-icon-box" title="Fixed movement time">
				<Asset assetId="status-time-incr" className="CardSkill-icon" />
				<Asset assetId="orb-locked" className="CardSkill-icon" />
			</AssetBox>
			{value} seconds
			</span>
		);
		}
		case SkillKinds.MinMatchLength: {
		const { value } = skill as Skill.WithValue<number>;
		return <span className="CardSkill-skill">minimum match length {value}</span>;
		}
		case SkillKinds.DropRefresh: {
		return <span className="CardSkill-skill">drop refresh</span>;
		}
		case SkillKinds.Drum: {
		return <span className="CardSkill-skill">drum sound</span>;
		}
		case SkillKinds.Board7x6: {
		return <span className="CardSkill-skill">7x6 board</span>;
		}

		case SkillKinds.Vampire: {
		const { attr, damage, heal } = skill as Skill.Vampire;
		return (
			<span className="CardSkill-skill">
			<Asset assetId="skill-attack" className="CardSkill-icon" />
			single enemy &rArr; {renderValue(damage)}
			{typeof attr === 'number' && renderAttrs(attr)}
			&nbsp;&rArr;
			<Asset assetId="status-heal" className="CardSkill-icon" />
			{renderValue(heal)} damage
			</span>
		);
		}
		case SkillKinds.CounterAttack: {
		const { attr, prob, value } = skill as Skill.CounterAttack;
		return (
			<span className="CardSkill-skill">
			<Asset assetId="status-counter" className="CardSkill-icon" />
			{renderValue(prob)} &rArr; {renderValue(value)} damage
			{typeof attr === 'number' && renderAttrs(attr)}
			</span>
		);
		}
		case SkillKinds.ChangeOrbs: {
		const { changes } = skill as Skill.ChangeOrbs;
		return (
			<span className="CardSkill-skill">
			<AssetBox className="CardSkill-icon-box" title="Change orbs">
				<Asset assetId="status-all-attrs" className="CardSkill-icon" />
				<Asset assetId="overlay-heal" className="CardSkill-icon" />
			</AssetBox>
			<span className="CardSkill-item-list">
				{changes.map((change, i) => {
				switch (change.kind) {
					case 'from':
					return (
						<span key={i}>
						{renderOrbs(change.from)} &rArr; {renderOrbs(change.to)}
						</span>
					);
					case 'gen':
					return (
						<span key={i}>
						{renderOrbs(change.exclude).map((orb, j) => (
							<AssetBox className="CardSkill-icon-box" key={j}>
							{orb}
							<Asset assetId="overlay-cross" className="CardSkill-icon" />
							</AssetBox>
						))} &rArr; {renderOrbs(change.to)} &times; {change.count}
						</span>
					);
					case 'fixed':
					return (change.positions.length > 0 &&
						<span key={i}>
						{change.type === 'col' ? 'column' : 'row'}&nbsp;
						{change.positions.map(p => p + 1).join(', ')}
						&nbsp;&rArr; {renderOrbs(change.to)}
						</span>
					);
				}
				})}
			</span>
			</span>
		);
		}
		case SkillKinds.Unbind: {
		const { normal, awakenings } = skill as Skill.Unbind;
		return (
			<span className="CardSkill-skill CardSkill-item-list">
			{!!normal && <span>
				<Asset assetId="skill-unbind" className="CardSkill-icon" />
				{normal} turns
			</span>}
			{!!awakenings && <span>
				<AssetBox className="CardSkill-icon-box">
				<Asset assetId="status-bind-awakenings" className="CardSkill-icon" />
				<Asset assetId="overlay-heal" className="CardSkill-icon" />
				</AssetBox>
				{awakenings} turns
			</span>}
			</span>
		);
		}
		case SkillKinds.OrbDropIncrease: {
		const { attrs, value } = skill as Skill.OrbDropIncrease;
		let attrElems: React.ReactNode[];
		if (attrs === 'enhanced')
			attrElems = [<Asset assetId="status-orb-enhanced" className="CardSkill-icon" key="enhanced" />];
		else
			attrElems = renderOrbs(attrs);

		attrElems = attrElems.map((elem, i) => (
			<AssetBox className="CardSkill-icon-box" key={i}>
			{elem}
			<Asset assetId="overlay-drop" className="CardSkill-icon" />
			</AssetBox>
		));

		return (
			<span className="CardSkill-skill">
			{attrElems}
			{renderValue(value)}
			</span>
		);
		}
		case SkillKinds.VoidEnemyBuff: {
		const { buffs } = skill as Skill.VoidEnemyBuff;
		return (
			<span className="CardSkill-skill">{
			buffs.map(buff => {
				switch (buff) {
				case 'attr-absorb': return (
					<AssetBox className="CardSkill-icon-box" key={buff}>
					<Asset assetId="status-all-attrs" className="CardSkill-icon" />
					<Asset assetId="overlay-heal" className="CardSkill-icon" />
					<Asset assetId="overlay-cross" className="CardSkill-icon" style={{ opacity: 0.75 }} />
					</AssetBox>
				);
				case 'damage-absorb': return (
					<AssetBox className="CardSkill-icon-box" key={buff}>
					<Asset assetId="status-damage-absorb" className="CardSkill-icon" />
					<Asset assetId="overlay-cross" className="CardSkill-icon" style={{ opacity: 0.75 }} />
					</AssetBox>
				);
				}
			})
			} </span>
		);
		}
		case SkillKinds.ChangeAttribute: {
		const { attr, target } = skill as Skill.ChangeAttribute;

		return (
			<span className="CardSkill-skill">
			{target === 'self' && 'Self'}
			{target === 'opponent' && 'enemy'}
			&nbsp;&rArr; {renderAttrs(attr)}
			</span>
		);
		}
		case SkillKinds.SetOrbState: {
		const { orbs, state } = skill as Skill.SetOrbState;
		let orbElems: React.ReactNode[];
		if (!orbs) {
			orbElems = [<Asset assetId="orb-blind" className="CardSkill-icon" key="all" />];
		} else {
			orbElems = renderOrbs(orbs);
		}

		return (
			<span className="CardSkill-skill">
			{(state === 'enhanced' || state === 'locked') && orbElems}
			{state === 'unlocked' && orbElems.map((elem, i) => (
				<AssetBox className="CardSkill-icon-box" key={i}>
				{elem}
				<Asset assetId="orb-locked" className="CardSkill-icon" />
				</AssetBox>
			))}
			&rArr;
			{state === 'enhanced' && orbElems.map((elem, i) => (
				<AssetBox className="CardSkill-icon-box" key={i}>
				{elem}
				<Asset assetId="orb-enhanced" className="CardSkill-icon" />
				</AssetBox>
			))}
			{state === 'locked' && orbElems.map((elem, i) => (
				<AssetBox className="CardSkill-icon-box" key={i}>
				{elem}
				<Asset assetId="orb-locked" className="CardSkill-icon" />
				</AssetBox>
			))}
			{state === 'unlocked' && orbElems}
			</span>
		);
		}
		case SkillKinds.RateMultiply: {
		const { rate, value } = skill as Skill.RateMultiply;

		return (
			<span className="CardSkill-skill">
			{rate === 'drop' && 'drop rate'}
			{rate === 'coin' && 'coins'}
			{rate === 'exp' && 'EXP'}
			&nbsp;&times;&nbsp;
			{renderValue(value)}
			</span>
		);
		}

		case SkillKinds.ReduceDamage: {
		const { attrs, percent, condition } = skill as Skill.ReduceDamage;

		return (
			<span className="CardSkill-skill">
			{!!condition && <>{renderCondition(condition)} &rArr; </>}
			<Asset assetId="status-def" className="CardSkill-icon" />
			{(Array.isArray(attrs) && !isEqual(attrs, Attributes.all())) && renderAttrs(attrs)}
			{renderValue(percent)}
			</span>
		);
		}
		case SkillKinds.PowerUp: {
		const { attrs, types, condition, value, reduceDamage } = skill as Skill.PowerUp;
		const targets: React.ReactNode[] = [];
		if (attrs && !isEqual(attrs, Attributes.all())) targets.push(...renderAttrs(attrs || []));
		if (types) targets.push(...renderTypes(types || []));

		return (
			<span className="CardSkill-skill">
			{condition && <>{renderCondition(condition)} &rArr; </>}
			{targets.length > 0 && <>{targets}</>}
			{!!value && renderPowerUp(value)}
			{!!reduceDamage && <>
				<Asset assetId="status-def" className="CardSkill-icon" />
				{renderValue(reduceDamage)}
			</>}
			</span>
		);
		}
		*/
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
	attrs = [attrs || 0];
	const frg = document.createDocumentFragment();
	if (typeof localTranslating == "undefined") return frg;
	
	const tsp = localTranslating.skill_parse;
	const contentFrg = attrs.map(attr => {
		const icon = document.createElement("icon");
		icon.className = "attr";
		icon.setAttribute("data-attr-icon",attr);
		return tsp.attrs[attr]({icon: icon});
	})
	.nodeJoin(tsp.word.slight_pause());
	frg.ap(option.affix ? tsp.word.affix_attr({cotent: contentFrg}) : contentFrg);
	return frg;
}
/*

function renderOrbs(attrs: Attributes | Attributes[]) {
	if (!Array.isArray(attrs))
	attrs = [attrs];
	return attrs.map(attr => <Asset assetId={`orb-${attr}`} key={attr} className="CardSkill-icon" />);
}

function renderTypes(types: Types | Types[]) {
	if (!Array.isArray(types))
	types = [types];
	return types.map(type => <Asset assetId={`type-${type}`} key={type} className="CardSkill-icon" />);
}


function renderCondition(cond: SkillCondition) {
	if (cond.hp) {
	if (cond.hp.min === cond.hp.max)
		return <>{renderStat('hp')} = {formatNumber(cond.hp.min * 100)}%</>;
	else if (cond.hp.min === 0)
		return <>{renderStat('hp')} &le; {formatNumber(cond.hp.max * 100)}%</>;
	else if (cond.hp.max === 1)
		return <>{renderStat('hp')} &ge; {formatNumber(cond.hp.min * 100)}%</>;
	else
		return <>{renderStat('hp')} &in; [{formatNumber(cond.hp.min * 100)}%, {formatNumber(cond.hp.max * 100)}%]</>;
	} else if (cond.useSkill) {
	return <>use skill</>;
	} else if (cond.multiplayer) {
	return <>in multiplayer</>;
	} else if (cond.remainOrbs) {
	return <>&le; {cond.remainOrbs.count} orbs remain</>;
	} else if (cond.exact) {
	if (cond.exact.type === 'combo') {
		return <>= {cond.exact.value} combos</>;
	} else if (cond.exact.type === 'match-length') {
		return <>= {cond.exact.value} {cond.exact.attrs === 'enhanced' ? 'Enhanced' : renderAttrs(cond.exact.attrs)} orbs</>;
	}
	} else if (cond.compo) {
	return <>{cond.compo.type} [{cond.compo.ids.join()}] in team</>;
	}
	return <>[ unknown condition ]</>;
}

function renderPowerUp(powerUp: SkillPowerUp) {
	function renderStats(hp: number, atk: number, rcv: number, mul = true) {
	const operator = mul ? <>&times;</> : <>+</>;
	let list: Array<['hp' | 'atk' | 'rcv', number]> = [['hp', hp], ['atk', atk], ['rcv', rcv]];
	list = list.filter(([, value]) => value !== (mul ? 1 : 0));
	if (list.length === 0) return null;

	if (list.every(([, value]) => value === list[0][1])) {
		return <>
		{list.map(([name], i) => <React.Fragment key={name}>{i !== 0 && ', '}{renderStat(name)}</React.Fragment>)}
		&nbsp;{operator} {formatNumber(list[0][1])}
		</>;
	} else {
		return <>
		{list.map(([name, value], i) => (
			<React.Fragment key={name}>
			{i !== 0 ? '; ' : ''}
			{renderStat(name)}
			&nbsp;{operator} {formatNumber(value)}
			</React.Fragment>
		))}
		</>;
	}
	}

	switch (powerUp.kind) {
	case SkillPowerUpKind.Multiplier: {
		const { hp, atk, rcv } = powerUp as SkillPowerUp.Mul;
		return renderStats(hp, atk, rcv);
	}
	case SkillPowerUpKind.ScaleAttributes: {
		const { attrs, min, max, baseAtk, baseRcv, bonusAtk, bonusRcv } = powerUp as SkillPowerUp.ScaleAttrs;
		return <>
		&ge; {min} of [{renderAttrs(attrs)}] &rArr; {renderStats(1, baseAtk, baseRcv)}
		{max !== min && <> for each &le; {max} attributes: {renderStats(0, bonusAtk, bonusRcv, false)}</>}
		</>;
	}
	case SkillPowerUpKind.ScaleCombos: {
		const { min, max, baseAtk, baseRcv, bonusAtk, bonusRcv } = powerUp as SkillPowerUp.Scale;
		return <>
		&ge; {min} combos &rArr; {renderStats(1, baseAtk, baseRcv)}
		{max !== min && <> for each &le; {max} combos: {renderStats(0, bonusAtk, bonusRcv, false)}</>}
		</>;
	}
	case SkillPowerUpKind.ScaleMatchAttrs: {
		const { matches, min, max, baseAtk, baseRcv, bonusAtk, bonusRcv } = powerUp as SkillPowerUp.ScaleMultiAttrs;
		return <>
		&ge; {min} matches of [{matches.map((attrs, i) =>
			<React.Fragment key={i}>{i !== 0 && ', '}{renderAttrs(attrs)}</React.Fragment>
		)}] &rArr; {renderStats(1, baseAtk, baseRcv)}
		{max !== min && <> for each &le; {max} matches: {renderStats(0, bonusAtk, bonusRcv, false)}</>}
		</>;
	}
	case SkillPowerUpKind.ScaleMatchLength: {
		const { attrs, min, max, baseAtk, baseRcv, bonusAtk, bonusRcv } = powerUp as SkillPowerUp.ScaleAttrs;
		return <>
		&ge; {min} &times; {renderAttrs(attrs)} &rArr; {renderStats(1, baseAtk, baseRcv)}
		{max !== min && <> for each &le; {max} orbs: {renderStats(0, bonusAtk, bonusRcv, false)}</>}
		</>;
	}
	case SkillPowerUpKind.ScaleCross: {
		const { crosses } = powerUp as SkillPowerUp.ScaleCross;
		return crosses.map(({ single, attr, mul }, i) => <React.Fragment key={i}>
		{i !== 0 && ', '}
		{mul !== 1 && <>{renderStat('atk')} &times; {formatNumber(mul)} </>}
		{single ? 'when' : 'for each'} cross of {renderAttrs(attr)}
		</React.Fragment>);
	}
	case SkillPowerUpKind.ScaleAwakenings: {
		const { awakenings, value } = powerUp as SkillPowerUp.ScaleAwakenings;
		return <>
		{renderStat('atk')} &times; {formatNumber(value - 1)} for each {awakenings.map(id =>
			<Asset assetId={`awakening-${id}`} className="CardSkill-icon" key={id} />
		)}
		</>;
	}
	default:
		return <>[ unknown power up ]</>;
	}
}
*/
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
				unit: option.unit ? option.unit() : undefined,
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
		/*
		case SkillValueKind.RandomATK: {
			const { min, max } = _value as SkillValue.Scale;
			if (min === max) {
			return <span>{formatNumber(min)} &times; {renderStat('atk')}</span>;
			} else {
			return <span>(random &times; {formatNumber(min)} &hArr; {formatNumber(max)}) &times; {renderStat('atk')}</span>;
			}
		}
		case SkillValueKind.xAwakenings: {
			const { value, awakenings } = _value as SkillValue.WithAwakenings;
			return <span>{formatNumber(value * 100)}% &times; each of {awakenings.map(id =>
			<Asset assetId={`awakening-${id}`} className="CardSkill-icon" key={id} />
			)}</span>;
		}
		*/
		default: {
			console.log("未知数值类型",_value.kind, _value);
			frg.ap(tspv.unknown({ type: _value.kind }));
		}
	}
	return frg;
  }