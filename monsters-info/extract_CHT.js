const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js'); //需要安装
const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });
const tsConverter = OpenCC.CustomConverter([
	['点阵图', '像素画'],
	['魔物猎人', '怪物猎人'],
	['结他', '吉他'],
	['琴键', '键盘'],
	
	//漫威
	['MARVEL', '漫威'],
	['铁甲奇侠', '钢铁侠'],
	['变形侠医', '绿巨人'],
	['变形女侠', '女绿巨人'],
	['毒魔', '毒液'],
	['魁隆', '灭霸'],
	['福瑞', '弗瑞'],
	['末日博士', '毁灭博士'],
	['邪恶史传奇', '邪恶奇异'],
	//奥特曼
	['超人系列', '奥特曼系列'],
	['超人吉田/超人力霸王', '奥特曼【初代】'],
	['贝塔胶囊', 'β魔棒'],
	['超人迪加', '迪迦奥特曼'],
	['超人贝利尔', '贝利亚奥特曼'],
	['超人七号', '赛文奥特曼'],
	['超人之眼', '奥特眼镜'],
	['超人Zero/杰洛', '赛罗奥特曼'],
	['超越Zero/杰洛', '赛罗奥特曼 无限形态'],
	['超人Trigger/特利卡', '特利迦奥特曼'],
	['GUTS 神光海帕枪', '胜利神光棒'],
	['超人捷德', '捷德奥特曼'],
	['Geed Riser', '捷德升华器'],
	['超人太郎', '泰罗奥特曼'],
	['超级炸弹', '奥特炸弹'],
	['超级徽章', '奥特徽章'],
	['超人Ace/卫司', '艾斯奥特曼'],
	['超级戒指', '奥特戒指'],
	['超人帝拿/帝纳', '戴拿奥特曼'],
	['超人佳亚/盖亚', '盖亚奥特曼'],
	['超人之父', '奥特之父'],
	['超人之母', '奥特之母'],
	['哥摩拉', '哥莫拉'],
	['电王兽', '艾雷王'],
	['金古乔', '金古桥'],
	['美特隆', '梅特龙'],
	['卡内贡', '卡尼贡'],
	['超人硬币', '奥特曼硬币'],
	['超人(新・超人)', '奥特曼【新・初代】'],
	['超人梅比斯', '梦比优斯奥特曼'],
	['梅比斯', '梦比优斯'], //注意这个顺序在上面那个之后
	['超人德卡/Decker', '戴卡奥特曼'],
	['超人Z', '泽塔奥特曼'],
	['暗黑特利卡', '暗黑特利迦'],
	['超人尼奥/超人雷欧', '雷欧奥特曼'],
	['阿尔法锋刃', '阿尔法利刃'],
	['德尔塔升华钩爪', '德尔塔升爪'],
	//海贼王
	['ONE PIECE FILM RED', '海贼王'],
	['骗人布', '乌索普'],
	['香吉士', '山治'],
	//三丽鸥
	['SANRIO CHARACTERS', '三丽鸥角色'],
]);

const sourceFolder = "Download-pad.skyozora.com/pad.skyozora.com"; //战友网数据的存储问文件夹
const outJSON_cht = "custom/cht.json"; //输出的繁体JSON文件
const outJSON_chs = "custom/chs.json"; //输出的简体JSON文件

let monArr_cht, monArr_chs;
//读取繁体
try
{
	monArr_cht = fs.existsSync(outJSON_cht) ? JSON.parse(fs.readFileSync(outJSON_cht, 'utf-8')) : [];
}catch(e)
{
	monArr_cht = [];
}
//读取简体
try
{
	monArr_chs = fs.existsSync(outJSON_chs) ? JSON.parse(fs.readFileSync(outJSON_chs, 'utf-8')) : [];
}catch(e)
{
	monArr_chs = [];
}
class monInfo
{
	constructor(id)
	{
		this.id = id;
		this.name = null;
		this.tags = [];
	}
}

//根据文件路径读取文件，返回文件列表
fs.readdir(sourceFolder,function(err,files){
	
	if(err){
		console.warn(err);
	}else{
		//遍历读取到的文件列表
		files.forEach(function(filename){
			const searchID = /^(\d+)\.html$/i.exec(filename);
			const mId = searchID ? parseInt(searchID[1],10) : null;
			if (mId != null && !monArr_cht.some(cn => cn.id == mId)) //有ID，且不繁体数据中不存在时
			{
				const filepath = path.join(sourceFolder, filename);//合并当前文件的路径
				const htmlText = fs.readFileSync(filepath, 'utf-8'); //使用同步读取

				const m = new monInfo(mId);

				//添加分类tag
				const regTags = /<a [^>]+?\s?class="category"\s?[^>]+>\s*<span>\s*#([^<]+?)\s*<\/span>\s*<\/a>/igm;
				let resTags;
				while(resTags = regTags.exec(htmlText))
				{
					let mTag = resTags[1].trim();
					if (mTag.length>0)
					{
						m.tags.push(mTag);
					}
				}
				
				//添加怪物名
				const regName = /<h2 .+>\s*?([\s\S]*)\s*?<\/h2>/igm;
				let resName = regName.exec(htmlText);
				if (resName)
				{
					let mName = resName[1].trim();
					mName = mName.replace(/探偵/g,"偵探"); //把日语的探侦都换成侦探
					if (mName.length>0)
					{
						m.name = mName;
						monArr_cht.push(m);
						if (monArr_cht.length % 100 == 0)
						{
							console.log("已添加 %d 个数据", monArr_cht.length);
							const str = JSON.stringify(monArr_cht);
							fs.writeFileSync(outJSON_cht,str,function(err){
								//每添加一部分就写入一次，避免每次重头再来
								if(err){
									console.error(err);
								}
							});
						}
					}else
					{
						console.log("%s 的中文名为空。", filename);
					}
				}else
				{
					console.log("%s 未找到中文名Node。", filename);
				}
			}
		});

		monArr_cht.forEach(function(m_cht){
			if (monArr_chs.some(cn => cn.id == m_cht.id))
			{
				return;
			}else
			{
				const m = new monInfo(m_cht.id);
				
				m.name = tsConverter(converter(m_cht.name));
				m.tags = m_cht.tags.map(tag=> tsConverter(converter(tag)));
				monArr_chs.push(m);
			}
		});

		monArr_cht.sort(function(a,b){
			return a.id - b.id;
		});
		monArr_chs.sort(function(a,b){
			return a.id - b.id;
		});

		fs.writeFile(outJSON_cht, JSON.stringify(monArr_cht) ,function(err){
			if(err){
				console.error(err);
			}
			console.log("---繁体中文导出成功，共 %d 个名称---", monArr_cht.length);
		});
		fs.writeFile(outJSON_chs, JSON.stringify(monArr_chs) ,function(err){
			if(err){
				console.error(err);
			}
			console.log("---简体中文导出成功，共 %d 个名称---", monArr_cht.length);
		});
	}
});

