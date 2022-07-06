const unsupportFeatures = (()=>{
	const features = [
		{name: "Optional chaining (?.) / 可选链操作符(?.)", url: "https://caniuse.com/mdn-javascript_operators_optional_chaining", test: ()=>!Boolean(eval("undefined?.undefined || true"))},
		{name: "Nullish coalescing operator (??) / 空值合并操作符(??)", url: "https://caniuse.com/mdn-javascript_operators_nullish_coalescing", test: ()=>!Boolean(eval("undefined ?? true"))},
		{name: "BigInt value (1n) / BigInt 数据类型(1n)", url: "https://caniuse.com/bigint", test: ()=>!Boolean(eval("1n"))},
		//{name: "Private class fields (#name) / 类私有域(#name)", url: "https://caniuse.com/mdn-javascript_classes_private_class_fields", test: ()=>!Boolean(eval("class test {#v = 0;}; true;"))},
	]
	return features.filter(feature=>{
		try {
			return feature.test();
		} catch (e) {
			if (e.name !== 'SyntaxError') throw e // Throw the error if it is not a SyntaxError
			return true;
		}
	})
})();

if (unsupportFeatures.length) {
	const browserVersion = ((UA)=>{
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
`🙁浏览器内核版本太老<br>
您的浏览器版本为: ${browserVersion}<br>
您的浏览器内核不支持本程序使用的以下技术
<ol>
${unsupportFeatures.map(feature=>`<li><a href="${feature.url}">${feature.name}</a></li>`).join('')}
</ol>
请更新您的浏览器内核到 Firefox(火狐) ≥ 90 或 Chrome(谷歌) ≥ 80 或 Safari ≥ 14.5。`;
	} else {
		alertStr = 
`🙁Browser kernel is too old<br>
Your browser is: ${browserVersion}<br>
Your browser kernel does not support the following technologies used by this program:
<ol>
${unsupportFeatures.map(feature=>`<li><a href="${feature.url}">${feature.name}</a></li>`).join('')}
</ol>
Please update your browser core to Firefox ≥ 90 or Chrome ≥ 80 or Safari ≥ 14.5`;
	}

//alert(alertStr);
document.write(alertStr);
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