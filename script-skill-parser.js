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

const SkillValueKind = {
	Percent: 'mul',
	Constant: 'const',
	xMaxHP: 'mul-maxhp',
	xHP: 'mul-hp',
	xATK: 'mul-atk',
	xRCV: 'mul-rcv',
	RandomATK: 'random-atk',
	HPScale: 'hp-scale',
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
    Heal: "heal",
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

function parser(skillId)
{
	const skill = Skills[skillId];
	if (!skill) return [];
	if (!parsers[skill.type]) {
		return [{ kind: SkillKinds.Unknown }];
	}
	//此处用apply将这个parser传递到后面解析函数的this里，用于递归解析
	const result = parsers[skill.type].apply({ parser }, skill.params);
	const skills = (Array.isArray(result) ? result : [result])
		.filter(s => Boolean(s))
		.map(s => ({ id: skillId, type: skill.type, params: skill.params, ...s }));
	return skills;
}

const v = {
    percent: function(value) {
        return { kind: SkillValueKind.Percent, value: (value / 100) || 1 };
    },
    constant: function(value) {
        return { kind: SkillValueKind.Constant, value: value || 0 };
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
        if (attrs === void 0) { attrs = models_1.Attributes.all(); }
        return { exact: { type: type, value: value, attrs: attrs } };
	},
	compo: function (type, ids) {
        return { compo: { type: type, ids: ids } };
	},
    remainOrbs: function (count) { return { remainOrbs: { count: count } }; },
    useSkill: function () { return { useSkill: true }; },
    multiplayer: function () { return { multiplayer: true }; },
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
        return __assign({ kind: SkillPowerUpKind.ScaleAttributes, attrs: attrs }, scale(min, max, baseMul, bonusMul));
    },
    scaleCombos: function (min, max, baseMul, bonusMul) {
        return __assign({ kind: SkillPowerUpKind.ScaleCombos }, scale(min, max, baseMul, bonusMul));
    },
    scaleMatchLength: function (attrs, min, max, baseMul, bonusMul) {
        return __assign({ kind: SkillPowerUpKind.ScaleMatchLength, attrs: attrs }, scale(min, max, baseMul, bonusMul));
    },
    scaleMatchAttrs: function (matches, min, max, baseMul, bonusMul) {
        return __assign({ kind: SkillPowerUpKind.ScaleMatchAttrs, matches: matches }, scale(min, max, baseMul, bonusMul));
    },
    scaleCross: function (crosses) {
        return { kind: SkillPowerUpKind.ScaleCross, crosses: crosses.map(function (cross) { return (__assign(__assign({}, cross), { mul: (cross.mul / 100) || 1 })); }) };
    },
    scaleAwakenings: function (awakenings, value) {
        return { kind: SkillPowerUpKind.ScaleAwakenings, awakenings: awakenings, value: value / 100 };
    },
}
function activeTurns(turns, skill) {
    return skill ? { kind: SkillKinds.ActiveTurns, turns: turns, skill: skill } : null;
}
function damageEnemy(target, attr, damage, selfHP) {
    return { kind: SkillKinds.DamageEnemy, target: target, attr: attr, damage: damage, selfHP: selfHP };
}
function vampire(attr, damageValue, healValue) {
    return { kind: SkillKinds.Vampire, attr: attr, damage: damageValue, heal: healValue };
}
function reduceDamage(attrs, percent, condition) {
    return { kind: SkillKinds.ReduceDamage, attrs: attrs, percent: percent, condition: condition };
}
function heal(value) {
    return { kind: SkillKinds.Heal, value: value };
}
function changeOrbs() {
    return { kind: SkillKinds.ChangeOrbs, changes: Array.from(arguments) };
}
function powerUp(attrs, types, value, condition, reduceDamageValue) {
    if (value.kind === SkillPowerUpKind.Multiplier) {
        var _a = value, hp = _a.hp, atk = _a.atk, rcv = _a.rcv;
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
function resolve(min, max) {
    return { kind: SkillKinds.Resolve, min: min, max: max };
}
function unbind(normal, awakenings) {
    return { kind: SkillKinds.Unbind, normal: normal, awakenings: awakenings };
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
	[14](min, max) { return resolve(v.percent(min), v.percent(max)); },
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
  
	[84](attr, min, max, percent) { return damageEnemy('single', attr, v.randomATK(min, max), percent ? v.xHP(percent) : v.constant(1)); },
	[85](attr, min, max, percent) { return damageEnemy('all', attr, v.randomATK(min, max), percent ? v.xHP(percent) : v.constant(1)); },
	[86](attr, value, _, percent) { return damageEnemy('single', attr, v.constant(value), percent ? v.xHP(percent) : v.constant(1)); },
	[87](attr, value, _, percent) { return damageEnemy('all', attr, v.constant(value), percent ? v.xHP(percent) : v.constant(1)); },
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
	[179](turns, value, percent) { return activeTurns(turns, heal(value ? v.constant(value) : v.xMaxHP(percent))); },
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
};