//分析卡片的函数,Code From https://github.com/kiootic/pad-rikuu
class Card{
	static fixId(id, reverse = false){
		return reverse ? (id >= 9900 ? id + 100 : id) : (id >= 10000 ? id - 100 : id);
	}
    constructor(data){
		let card = this;
		card.attrs=[];
		card.types=[];
		let i = 0;
		function readCurve() {
			return {
				min: data[i++],
				max: data[i++],
				scale: data[i++],
			};
		}
		card.id = Card.fixId(data[i++]); //ID
		card.name = data[i++]; //名字
		card.attrs.push(data[i++]); //属性1
		card.attrs.push(data[i++]); //属性2
		card.isUltEvo = data[i++] !== 0; //是否究极进化
		card.types.push(data[i++]); //类型1
		card.types.push(data[i++]); //类型2
		card.rarity = data[i++]; //星级
		card.cost = data[i++]; //cost
		card.unk01 = data[i++]; //未知01
		card.maxLevel = data[i++]; //最大等级
		card.feedExp = data[i++]; //1级喂食经验，需要除以4
		card.isEmpty = data[i++] === 1; //空卡片？
		card.sellPrice = data[i++]; //1级卖钱，需要除以10
		card.hp = readCurve(); //HP增长
		card.atk = readCurve(); //攻击增长
		card.rcv = readCurve(); //回复增长
		card.exp = { min: 0, max: data[i++], scale: data[i++] }; //经验增长
		card.activeSkillId = data[i++]; //主动技
		card.leaderSkillId = data[i++]; //队长技
		card.enemy = { //作为怪物的数值
			countdown: data[i++],
			hp: readCurve(),
			atk: readCurve(),
			def: readCurve(),
			maxLevel: data[i++],
			coin: data[i++],
			exp: data[i++]
		};
		card.evoBaseId = Card.fixId(data[i++]); //进化基础ID
		card.evoMaterials = [data[i++], data[i++], data[i++], data[i++], data[i++]].map(Card.fixId); //进化素材
		card.unevoMaterials = [data[i++], data[i++], data[i++], data[i++], data[i++]].map(Card.fixId); //退化素材
		card.unk02 = data[i++]; //未知02
		card.unk03 = data[i++]; //未知03
		card.unk04 = data[i++]; //未知04
		card.unk05 = data[i++]; //未知05
		card.unk06 = data[i++]; //未知06
		card.unk07 = data[i++]; //未知07
		const numSkills = data[i++]; //几种敌人技能
		card.enemy.skills = Array.from(new Array(numSkills)).map(() => ({
			id: data[i++],
			ai: data[i++],
			rnd: data[i++]
		}));
		const numAwakening = data[i++]; //觉醒个数
		card.awakenings = new Array(numAwakening);
		for (let ai=0; ai<numAwakening; ai++) {
			card.awakenings[ai] = data[i++];
		}
		card.superAwakenings = data[i++].split(',').filter(Boolean).map(strN=>parseInt(strN,10)); //超觉醒
		card.evoRootId = Card.fixId(data[i++]); //进化链根ID
		card.seriesId = data[i++]; //系列ID
		card.types.push(data[i++]); //类型3
		card.sellMP = data[i++]; //卖多少MP
		card.latentAwakeningId = data[i++]; //潜在觉醒ID
		card.collabId = data[i++]; //合作ID
		const flags = data[i++]; //一个旗子？
		card.flags = flags;
		card.canAssist = Boolean(flags & 1<<0); //是否能当二技
		card.enabled = Boolean(flags & 1<<1); //是否已启用
		card.stacking = !Boolean(flags & 1<<3) && //flag有1<<3时，不合并占一格，没有时则根据类型进行合并（目前合并已经不占格子）
			card.types.some(t=>[0,12,14,15].includes(t)); //0進化用;12能力覺醒用;14強化合成用;15販賣用默认合并
		//card.onlyAssist = Boolean(flags & 1<<4); //是否只能当二技
		card.is8Latent = Boolean(flags & 1<<5); //是否支持8个潜觉
		card.skillBanner = Boolean(flags & 1<<6); //是否有技能横幅

		card.altName = data[i++].split("|").filter(Boolean); //替换名字（分类标签）
		card.limitBreakIncr = data[i++]; //110级增长
		card.voiceId = data[i++]; //语音觉醒的ID
		card.blockSkinOrBgmId = data[i++]; //珠子皮肤ID
		card.specialAttribute = data[i++]; //特别属性，比如黄龙
		card.searchFlags = [data[i++], data[i++]]; //队长技搜索类型，解析写在这里会导致文件太大，所以写到前端去了
		card.gachaId = data[i++]; //目前猜测是桶ID
		card.unk08 = data[i++]; //未知08
		card.attrs.push(data[i++]); //属性3
		
		card.attrs = card.attrs.filter(Number.isInteger);
		if (card.attrs.indexOf(-1)>0)
			card.attrs = card.attrs.slice(0,card.attrs.indexOf(-1)); //attr里面去掉-1之后的
		card.types = card.types.filter(Number.isInteger);
		if (card.types.indexOf(-1)>0)
			card.types = card.types.slice(0,card.types.indexOf(-1)); //type里面去掉-1
		if (i < data.length)
			console.log(`有新增数据/residue data for #${card.id}: ${i} ${data[i]}`);
	}
}
//对于Nodejs输出成模块
if (typeof(module) != "undefined") module.exports = Card;