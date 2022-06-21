let needUpdateBrowser = (()=>{
	try {
		return !Boolean(eval("1n && (undefined?.undefined ?? true)"));
	} catch (e) {
		if (e.name !== 'SyntaxError') throw e // Throw the error if it is not a SyntaxError
		return true;
	}
})();

if (needUpdateBrowser) {
	let browserVersion = ((UA)=>{
		let regRes;
		if (regRes = /\b(Firefox|Chrome)\/([\d\.]+)/ig.exec(UA)) {
			return `${regRes[1]} ${regRes[2]}`;
		} else if (regRes = /\bVersion\/([\d\.]+)\s+.*\b(Safari)\//ig.exec(UA)) {
			return `${regRes[2]} ${regRes[1]}`;
		} else {
			UA;
		}
	})(navigator.userAgent);

	let alertStr;
	if (/^zh-(?:han(?:s|t)-)?/.test(navigator.language)) {
		alertStr = 
`🙁浏览器内核版本太老
您的浏览器版本为:
${browserVersion}

您的浏览器内核不支持本程序使用的 可选链操作符(?.) 和 空值合并操作符(??) 或 BigInt 数据类型。

请更新您的浏览器内核到 Firefox(火狐) ≥ 74 或 Chrome(谷歌) ≥ 80 或 Safari ≥ 14。`;
	} else {
		alertStr = 
`🙁Browser kernel is too old
Your browser is:
${browserVersion}

Your browser core does not support Optional chaining (?.) and Nullish coalescing operator (??) or BigInt value used in this program.

Please update your browser core to Firefox ≥ 74 or Chrome ≥ 80 or Safari ≥ 14`;
	}

alert(alertStr);
document.write(alertStr.replace(/\n/g,'<br />'));
}

let denied = ((UA)=>{
	return /\b(?:MicroMessenger|WeChat|Weixin|QQ|AliApp)\b/.test(UA);
})(navigator.userAgent);
if (denied) {
	const mask = document.createElement("div");
	mask.id = "denied-mask";
	const css = `
	#denied-mask {
		position: fixed;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		background-color: #000A;
	}
	.alert {
		font-size: 2em;
		font-weight: bold;
		color: white;
		text-align: center;
	}
	`;
	const style = mask.appendChild(document.createElement("style"));
	style.appendChild(document.createTextNode(css));
	const alertDiv = mask.appendChild(document.createElement("div"));
	alertDiv.className = "alert"
	alertDiv.appendChild(document.createTextNode("请勿使用内置浏览"));
	alertDiv.appendChild(document.createElement("br"));
	alertDiv.appendChild(document.createTextNode("点击菜单使用正常浏览器打开↗"));

	window.addEventListener("load", ()=>{
		document.body.appendChild(mask);
	});
}