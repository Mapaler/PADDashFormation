# 如何获取怪物数据 | How to acquire monster data
## 原理 | Principles
* 目前的获取 API 为  
The current acquisition API is

	| 语言 | API |
	| --- | --- |
	| 日语(ja) | https://api-adrv2.padsv.gungho.jp/api.php?action=download_card_data<br>https://api-adrv2.padsv.gungho.jp/api.php?action=download_skill_data |
	| 英语(en) | https://api-na-adrv2.padsv.gungho.jp/api.php?action=download_card_data<br>https://api-na-adrv2.padsv.gungho.jp/api.php?action=download_skill_data |
	| 韩语(ko) | https://api-kr-adrv2.padsv.gungho.jp/api.php?action=download_card_data<br>https://api-kr-adrv2.padsv.gungho.jp/api.php?action=download_skill_data |

* 但是有加密的参数，我不知道如何生成，所以我只能从游戏的下载过程截获。  
But there are encrypted parameters that I don't know how to generate. So I intercepted from the game's download process.

* 使用 [Fiddler Classic](https://api.getfiddler.com/fc/latest)，执行 *HTTPS 中间人攻击*从游戏内抓包获得怪物信息。  
Use [Fiddler Classic](https://api.getfiddler.com/fc/latest), do *HTTPS man-in-the-middle attack* to capture monster information from in-game capture.  

* 安卓 5 可以直接在安卓系统里安装 *CER* 证书，但安卓7开始，系统不再信任用户证书。由于需要安卓 7 才能玩智龙迷城，所以要先创建安卓 7 以上的模拟器，再安装智龙迷城。   
Android 5 can install *CER* certificates directly in Android. Starting with Android 7, the system no longer trusts user certificates. Since Android 7 is required to play PAD, you must create an emulator for Android 7 or above before installing PAD.

## 流程 | Processes
> [!TIP]
> 通过[如何获取用户游戏数据](https://mapaler.github.io/PADDashFormation/doc/export-player-data.html)查看完整图文教程。[^1]  
See the full graphic tutorial via [How to get user game data](https://mapaler.github.io/PADDashFormation/doc/export-player-data.html).[^1]

[^1]: 参考/Reference: https://www.jianshu.com/p/035f7d7a0f7e  

### 转换证书 | Convert certificates
1. 将 Fidder 根证书导出到桌面。  
Export the Fidder Root Certificate to desktop.  

	**Tools** - **Options** - **HTTPS** - **Actions** - **Export Root Certificate to Desktop**

1. 在电脑上找一个 **openssl.exe** 程序（Git 内自带），或者下载安装 [Win32OpenSSL](http://slproweb.com/products/Win32OpenSSL.html)  
Find an **openssl.exe** program on computer (Included within Git), or install [Win32OpenSSL](http://slproweb.com/products/Win32OpenSSL.html)

1. 执行代码，获取证书的 hash 值  
Execute the code to get the hash value of the certificate  
`openssl x509 -inform DER -in FiddlerRoot.cer -subject_hash_old -noout`

1. 执行代码，将证书由 *CER* 转换为 *PEM* 格式  
Execute the code to convert the certificate from *CER* to *PEM* format  
`openssl x509 -inform DER -in FiddlerRoot.cer -outform PEM -out [hash].0`

1. 你也可以用如下的 bat 文件或 PowerShell 来完成，需要自行修改 openssl 程序路径。  
You can also use the following bat file to do this, and you need to modify the OpenSSL program path by yourself.  
	#### bat
	~~~bat
	@echo off
	set OPENSSL="C:\Program Files\Git\usr\bin\openssl.exe"

	REM 从注册表获取桌面路径
	for /f "tokens=3*" %%i in ('reg query "HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" /v Desktop ^| findstr "REG_EXPAND_SZ REG_SZ"') do set DESKTOP_PATH=%%i

	REM 读取证书哈希值
	for /f "delims=" %%k in ('"%OPENSSL% x509 -inform DER -in "%DESKTOP_PATH%\FiddlerRoot.cer" -subject_hash_old -noout"') do set HASH=%%k

	REM 转换为 PEM 格式
	%OPENSSL% x509 -inform DER -in "%DESKTOP_PATH%\FiddlerRoot.cer" -outform PEM -out %HASH%.0

	echo 转换完成！生成的 PEM 文件: %HASH%.0
	pause
	~~~
	#### PowerShell  
	~~~PowerShell
	# 定义 OpenSSL 路径（需替换为你的实际路径）
	$openssl = "C:\Program Files\Git\mingw64\bin\openssl.exe"

	# 获取桌面路径
	$desktopPath = [Environment]::GetFolderPath("Desktop")

	# 证书文件路径
	$cerPath = Join-Path -Path $desktopPath -ChildPath "FiddlerRoot.cer"

	# 步骤1：获取证书的旧版哈希值（用于文件名）
	$hash = & $openssl x509 -inform DER -in $cerPath -subject_hash_old -noout

	# 步骤2：转换为 PEM 格式并保存为 <哈希值>.0
	& $openssl x509 -inform DER -in $cerPath -outform PEM -out "$hash.0"

	# 输出结果
	Write-Host "转换完成！生成的 PEM 文件: $pwd\$hash.0"
	~~~

### 将证书文件放入安卓系统证书文件夹 | Place the certificate file in the Android system certificate folder
将证书文件放入安卓系统证书文件夹`/system/etc/security/cacerts/`  
Place the certificate file in the Android system certificate folder`/system/etc/security/cacerts/`  

#### 蓝叠模拟器 | BlueStacks

1. **关闭**所有安卓模拟器  
**Close** all Android emulators
1. 进入安装时设定的 **BlueStacks_nxt** 位置找到模拟器的系统虚拟磁盘文件。默认为`C:\ProgramData\BlueStacks_nxt\Engine\<模拟器文件夹>\Root.vhd`。  
Go to the **BlueStacks_nxt** location set during installation to locate the emulator's system vDisk file. The default is `C:\ProgramData\BlueStacks_nxt\Engine\<Emulator folder>\Root.vhd`.
1. 双击`Root.vhd`挂载到 Windows 磁盘管理中。  
Double-click `Root.vhd` to mount it into Windows Disk Management.
1. 运行 [Ext4Fsd](http://www.accum.se/~bosse/) 的 **Ext2 Volume Manager**，选中刚刚挂载的 EXT4 格式磁盘，右键菜单选择“加载装配点盘符”或按`F4`快捷键，给虚拟磁盘分配一个盘符。  
Run **Ext2 Volume Manager** of [Ext4Fsd](http://www.accum.se/~bosse/), select the EXT4 format disk you just mounted, right-click the menu and select "Assign Drive Letter" or press the `F4` shortcut key to assign a drive letter to the virtual disk.
1. 在 Windows 下，将证书复制到`[X]:\android\system\etc\security\cacerts\`  
Under Windows, copy the certificate to `[X]:\android\system\etc\security\cacerts\`
1. **Ext2 Volume Manager** 内，在虚拟磁盘的右键菜单选择“保存系统缓冲”或按`F11`快捷键。  
In **Ext2 Volume Manager**, select "Flush Cache to Disk" or press the `F11` shortcut from the context menu of the virtual disk.   
1. 运行 `diskmgmt.msc` 打开系统磁盘管理，在虚拟磁盘上点击右键，选择“分离VHD”。  
Run `diskmgmt.msc` to open System Disk Management, right-click on the virtual disk and select "Detach VHD".

#### 夜神模拟器 | NoxPlayer

1. 打开安卓模拟器的**Root**  
Turn on the **Root** of the Android simulator
1. 在模拟器内，使用支持root读写的文件管理器，将证书复制到`/system/etc/security/cacerts/`，并修改为 **644** 权限  
Within the emulator, use a file manager that supports root reading and writing, to copy the certificate to `/system/etc/security/cacerts/` and modify it to **644** permissions
1. **重启**安卓模拟器  
**Restart** the Android simulator
1. 关闭安卓模拟器的 **Root**  
Turn off the **Root** of the Android simulator
  
### 设置模拟器代理 | Set up the emulator proxy
#### 蓝叠模拟器 | BlueStacks
1. 运行模拟器，在 设置-高级 内打开 Android调试(ADB)，并记下调试 IP 和端口，默认为`127.0.0.1:5555`  
Run the emulator, open Android Debugging (ADB) in Settings-Advanced, and note the debug IP and port, which defaults to `127.0.0.1:5555`
1. 在终端里输入`adb connect 127.0.0.1:5555`连接设备  
Enter `adb connect 127.0.0.1:5555` in the terminal to connect the device
1. 将安卓模拟器内的网络代理设置到 Fidder 上。蓝叠里的真实电脑IP默认为`10.0.2.2`，Fidder 默认端口为`8888`，在终端里输入`adb -s 127.0.0.1:5555 shell settings put global http_proxy 10.0.2.2:8888`  
Set the network proxy in the Android emulator to Fidder. The default real computer IP in BlueStacks is `10.0.2.2`, the default port of Fidder is `8888`, enter in the terminal `adb -s 127.0.0.1:5555 shell settings put global http_proxy 10.0.2.2:8888`

#### 夜神模拟器 | NoxPlayer
1. 将安卓模拟器内的 WiFi 代理设置到 Fidder 上。夜神里的真实电脑IP默认为`172.17.100.2`，Fidder 默认端口为`8888`  
Set up the WiFi proxy in the Android emulator to Fidder. The real computer IP in Nox defaults to `172.17.100.2`, and the Fidder default port is `8888`

### 通过代理解析数据 | Parse data through the proxy

1. 打开 Fidder 的 允许远程计算机连接、HTTPS 解密、流式传输，和 GZIP 解码  
Turn on Fidder's "Allow remote computers to connet", "HTTPS decrypt", "Stream" and "Decode"

1. 现在你运行模拟器内的游戏，Fidder 就能够截获和解密智龙迷城的数据了。将返回的 JSON 数据保存为文件。  
Now that you're running the game inside the simulator, Fidder will be able to intercept and decrypt the data from the PAD. Save the response JSON data as a file.

1. \[可选的\]将以下代码加入 Fidder 的自定义代码的`OnBeforeResponse`中就可以每次自动保存文件了。  
\[Optional\]Add the following code to `OnBeforeResponse` of Fidder's **Customize Rules** to save the file automatically each time.

	```js
	//自动储存智龙迷城数据
	switch (oSession.hostname) {
		case "api-adr.padsv.gungho.jp": //日服域名
		case "api-ht-adr.padsv.gungho.jp":{ //港台服域名
			savePADData("ja");
			break;
		}
		case "api-na-adrv2.padsv.gungho.jp":{ //美服域名
			savePADData("en");
			break;
		}
		case "api-kr-adrv2.padsv.gungho.jp":{ //韩服域名
			savePADData("ko");
			break;
		}
	}
	function savePADData(serverName: String) {
		//智龙迷城数据文件位置
		var PADDataPath: String = "D:\\www\\PADDashFormation\\monsters-info\\official-API\\";
		if (oSession.uriContains("download_card_data")) { //自动保存怪物数据
			oSession.SaveResponseBody(Path.Combine(PADDataPath, serverName + "-card.json"));
		}
		if (oSession.uriContains("download_skill_data")) { //自动保存技能数据
			oSession.SaveResponseBody(Path.Combine(PADDataPath, serverName + "-skill.json"));
		}
	}
	```

1. 运行`提取整合怪物信息.bat`   
Execute the following code in CMD
	```bat
	node.exe extractByNode.js
	```

1. 会将每种语言的信息提取到一个文件内，互相之间也保留有不同语言的怪物名称、标签数据  
Each language's information is extracted into a file, and monster names and tag data in different languages are retained from each other

> [!Note]
> ### Only For 🇨🇳Chinese
> `CHT.json`与`CHS.json`的中文信息来源于战友网，见子项目 https://github.com/Mapaler/Download-pad.skyozora.com
>
> 由于目前战友网已经关闭，后来的很多内容是网友人工添加。
>
> 运行`提取中文数据.bat`，将战友网页面内容抽出，抽出过程使用 [opencc-js](https://github.com/nk2028/opencc-js) 的 NodeJs 模块来繁转简。
>
> 然后再运行一遍 `提取整合怪物信息.bat` 把中文插进去。