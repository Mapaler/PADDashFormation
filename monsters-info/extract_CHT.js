const fs = require('fs');
const path = require('path');//解析需要遍历的文件夹
const sourceFolder = "Download-pad.skyozora.com/pad.skyozora.com"; //战友网数据的存储问文件夹
const outJSON = "custom/cht.json"; //输出的JSON文件

fs.access(outJSON,function(err){
	let monArr;
	if (err)
	{
		monArr = [];
	}else
	{
		try
		{
			monArr = JSON.parse(fs.readFileSync(outJSON, 'utf-8'));//读取繁体中文数据避免重复工作
		}catch(e)
		{
			monArr = [];
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
				if (mId != null && !monArr.some(cn => cn.id == mId))
				{
					const filepath = path.join(sourceFolder, filename);//合并当前文件的路径
					const htmlText = fs.readFileSync(filepath, 'utf-8'); //使用同步读取

					const m = {
						id: mId,
						name: null,
						tags: [],
					};

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
							monArr.push(m);
							if (monArr.length % 100 == 0)
							{
								console.log("已添加 " + monArr.length + " 个数据");
								const str = JSON.stringify(monArr);
								fs.writeFileSync(outJSON,str,function(err){
									//每添加一部分就写入一次，避免每次重头再来
									if(err){
										console.error(err);
									}
								});
							}
						}else
						{
							console.log(filename + " 的中文名为空。");
						}
					}else
					{
						console.log(filename + " 未找到中文名Node。");
					}
				}
			});
			monArr.sort(function(a,b){
				return a.id - b.id;
			});
			const str = JSON.stringify(monArr);
			fs.writeFile(outJSON,str,function(err){
				if(err){
					console.error(err);
				}
				console.log("---繁体中文导出成功，共 " + monArr.length + " 个名称---");
			});
		}
	});
});

