使用Fidder从游戏内抓包获得怪物信息  
Use Fidder to capture monster information from in-game capture  

目前的获取API为  
The current acquisition API is

| 语言 | API |
| --- | --- |
| 日语(ja) | https://api-adrv2.padsv.gungho.jp/api.php?action=download_card_data<br>https://api-adrv2.padsv.gungho.jp/api.php?action=download_skill_data |
| 英语(en) | https://api-na-adrv2.padsv.gungho.jp/api.php?action=download_card_data<br>https://api-na-adrv2.padsv.gungho.jp/api.php?action=download_skill_data |
| 韩语(ko) | https://api-kr-adrv2.padsv.gungho.jp/api.php?action=download_card_data<br>https://api-kr-adrv2.padsv.gungho.jp/api.php?action=download_skill_data |

2020年8月4日
目前夜神安卓5无法运行智龙迷城，需要使用安卓7，但是安卓7无法信任用户证书，所以需要把证书添加到安卓系统储存区。  
参考 https://www.jianshu.com/p/035f7d7a0f7e
1. 将 Fidder 证书导出成文件，在电脑上找一个 openssl.exe 程序
1. 执行`openssl x509 -inform DER -in cacert.cer -out cacert.pem`将证书转换为pem格式
1. 执行`openssl x509 -inform PEM -subject_hash_old -in cacert.pem`获取证书的hash（第一行）
1. 将证书重命名为`[hash].0`
1. 将证书复制到`/system/etc/security/cacerts/`，并修改为 644 权限
1. 重启系统

将以下代码加入 Fidder 的自定义代码的`OnBeforeResponse`中就可以每次自动保存文件了
```js
//自动储存智龙迷城数据
var PADDataPath = "D:\\PADDashFormation\\monsters-info\\official-API\\";
if (oSession.HostnameIs("api-adr.padsv.gungho.jp") //日服域名
	|| oSession.HostnameIs("api-ht-adr.padsv.gungho.jp") //港台服域名
	|| oSession.HostnameIs("api-na-adrv2.padsv.gungho.jp") //美服域名
	|| oSession.HostnameIs("api-kr-adrv2.padsv.gungho.jp") //韩服域名
) {
	var serverName;
	switch (oSession.hostname)
	{
		case "api-adr.padsv.gungho.jp": //日服域名
		case "api-ht-adr.padsv.gungho.jp": //港台服域名
			serverName = "ja"
			break;
		case "api-na-adrv2.padsv.gungho.jp": //美服域名
			serverName = "en"
			break;
		case "api-kr-adrv2.padsv.gungho.jp": //韩服域名
			serverName = "ko"
			break;
	}
	if (oSession.uriContains("download_card_data")) { //自动保存怪物数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-card.json")
	}
	if (oSession.uriContains("download_skill_data")) { //自动保存技能数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-skill.json")
	}
	/*
	if (oSession.uriContains("download_dungeon_data")) { //自动保存地下城数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-dungeon.json")
	}
	if (oSession.uriContains("download_limited_bonus_data")) { //自动保存limited_bonus数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-limited_bonus.json")
	}
	if (oSession.uriContains("download_enemy_skill_data")) { //自动保存敌人技能数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-enemy_skill.json")
	}
	if (oSession.uriContains("shop_item")) { //自动保存商店数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-shop_item.json")
	}
	if (oSession.uriContains("mdatadl")) { //自动保存交换所数据
		oSession.SaveResponseBody(PADDataPath + serverName + "-mdatadl.json")
	}
	*/
}
```

使用[pad-rikuu](//github.com/kiootic/pad-rikuu)的Card解析代码  
Parse  Using the Card parsing code of the [pad-rikuu](//github.com/kiootic/pad-rikuu).

`CHT.json`与`CHS.json`信息来源于战友网，见子项目 https://github.com/Mapaler/Download-pad.skyozora.com

运行`提取整合怪物信息.bat`   
Execute the following code in CMD
```bat
node.exe extractByNode.js
```
会将几种语言的信息提取到一个文件内  
Extract information from several languages into one file  
`mon_ja.json`

运行`提取中文数据.bat`，将战友网页面内容抽出，再使用Win64版 [OpenCC](https://github.com/BYVoid/OpenCC) 来繁转简。
然后再运行一遍`提取整合怪物信息.bat`把中文插进去。