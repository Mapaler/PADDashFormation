const fs = require('fs');
const sourceFolder = "Download-pad.skyozora.com/pad.skyozora.com";
const outJSON = "custom/cht.json";
const path = require('path');//解析需要遍历的文件夹

fs.access(outJSON,function(err){
	let monArr;
	if (err)
	{
		monArr = [];
	}else
	{
		monArr = JSON.parse(fs.readFileSync(outJSON, 'utf-8'));//读取繁体中文数据避免重复工作
	}

	//根据文件路径读取文件，返回文件列表
	fs.readdir(sourceFolder,function(err,files){
		if(err){
			console.warn(err);
		}else{
			//遍历读取到的文件列表
			files.forEach(function(filename){
				let searchID = /^(\d+)\.html$/i.exec(filename);
				if (searchID && !monArr.some(function(cn){return cn.id == searchID[1];}))
				{
					const filepath = path.join(sourceFolder, filename);//合并当前文件的路径
					const htmlText = fs.readFileSync(filepath, 'utf-8'); //使用同步读取
					let searchName = /<h2 .+>\s*?([\s\S]*)\s*?<\/h2>/igm.exec(htmlText);
					try
					{
						let mname = searchName[1].trim();
						mname = mname.replace("探偵","偵探"); //把日语的探侦都换成侦探
						if (mname.length>0)
						{
							const m = {
								id:searchID[1],
								name:mname,
							};
							monArr.push(m);
							if (monArr.length % 100 == 0)
							{
								console.log("已添加 " + monArr.length + " 个数据");
							}
						}else
						{
							console.log(filename + "的中文名为空。");
						}
					}catch(e)
					{
						console.log(filename,e);
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

