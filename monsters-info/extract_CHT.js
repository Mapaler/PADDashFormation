const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc');
const converter = new OpenCC('t2s.json');

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
console.log(monArr_chs);
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
				m.name = converter.convertSync(m_cht.name);
				m_cht.tags.forEach(tag=> m.tags.push(converter.convertSync(tag)) );
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

