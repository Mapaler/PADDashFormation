(()=>{
	function runCodeWithFunction(obj) {
		return Function(`"use strict"; return (${obj})`)();
	}
	function supportsPseudoClass(clazz) {
		const style = document.createElement('style');
		style.innerHTML = clazz + '{}';
		document.head.appendChild(style); // required, or style.sheet === null
		const result = style.sheet.cssRules.length === 1;
		style.remove(); // document.head.removeChild(style);
		return result;
	}

	const features = [
		{name: "Optional chaining (?.) / 可选链操作符(?.)", version:{firefox:74,chrome:80,safari:13.4}, url: "https://caniuse.com/mdn-javascript_operators_optional_chaining", test: ()=>Boolean(runCodeWithFunction("undefined?.undefined || true"))},
		{name: "Nullish coalescing operator (??) / 空值合并操作符(??)", version:{firefox:72,chrome:80,safari:13.4}, url: "https://caniuse.com/mdn-javascript_operators_nullish_coalescing", test: ()=>Boolean(runCodeWithFunction("undefined ?? true"))},
		{name: "BigInt value (1n) / BigInt 数据类型(1n)", version:{firefox:68,chrome:67,safari:14}, url: "https://caniuse.com/bigint", test: ()=>Boolean(runCodeWithFunction("1n"))},
		{name: "CSS selector: :where() / CSS选择器: :where()", version:{firefox:78,chrome:88,safari:14}, url: "https://caniuse.com/mdn-css_selectors_where", test: ()=>supportsPseudoClass(":where()")},
		{name: "CSS selector: :not() / CSS选择器: :not()", version:{firefox:84,chrome:88,safari:9}, url: "https://caniuse.com/css-not-sel-list", test: ()=>supportsPseudoClass(":not(html)")},
		//{name: "CSS selector: :has() / CSS选择器: :has()", version:{firefox:121,chrome:105,safari:15.4}, url: "https://caniuse.com/css-has", test: ()=>supportsPseudoClass(":has(html)")},
		{name: "Private class fields (#name) / 类私有域(#name)", version:{firefox:90,chrome:74,safari:14.5}, url: "https://caniuse.com/mdn-javascript_classes_private_class_fields", test: ()=>Boolean(runCodeWithFunction("class test {#v = 0;}, true"))},
		{name: "Dialog element / Dialog 元素", version:{firefox:98,chrome:37,safari:15.4}, url: "https://caniuse.com/dialog", test: ()=>Boolean(window.HTMLDialogElement)},
		//{name: "Class static initialization blocks / 静态初始化块", version:{firefox:93,chrome:94,safari:16.4}, url: "https://caniuse.com/mdn-javascript_classes_static_initialization_blocks", test: ()=>Boolean(runCodeWithFunction("class test { static { this.staticProperty = true;};}, true"))},
		{name: "Array.prototype.toSorted()", version:{firefox:115,chrome:110,safari:16.0}, url: "https://caniuse.com/mdn-javascript_builtins_array_tosorted", test: ()=>Boolean(Array.prototype.toSorted)},
		{name: "Set.prototype.isDisjointFrom()", version:{firefox:127,chrome:122,safari:17.0}, url: "https://caniuse.com/mdn-javascript_builtins_set_isdisjointfrom", test: ()=>Boolean(Set.prototype.isDisjointFrom)},
	];

	const unsupportFeatures = features.filter(feature=>{
		try {
			return !feature.test();
		} catch (e) {
			if (e.name !== 'SyntaxError')
				console.error(e);
			return true;
		}
	});

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
		//支持的最低版本
		const needBrowserVersion = unsupportFeatures.reduce((pre,{version})=>{
			pre.firefox = Math.max(pre.firefox,version.firefox);
			pre.chrome = Math.max(pre.chrome,version.chrome);
			pre.safari = Math.max(pre.safari,version.safari);
			return pre;
		}, {firefox:0,chrome:0,safari:0});
	
		let alertStr;
		if (/^zh-(?:han(?:s|t)-)?/.test(navigator.language)) {
			alertStr = 
`<p lang="zh">🙁浏览器内核版本太老<br>
您的浏览器版本为: ${browserVersion}<br>
您的浏览器内核不支持本程序使用的以下技术
<ol>
${unsupportFeatures.map(feature=>`<li><a href="${feature.url}">${feature.name}</a></li>`).join('')}
</ol>
请更新您的浏览器内核到 Firefox(火狐) ≥ ${needBrowserVersion.firefox} 或 Chrome(谷歌) ≥ ${needBrowserVersion.chrome} 或 Safari ≥ ${needBrowserVersion.safari}。</p>`;
		} else {
			alertStr = 
`<p lang="en">🙁Browser kernel is too old<br>
Your browser is: ${browserVersion}<br>
Your browser kernel does not support the following technologies used by this program:
<ol>
${unsupportFeatures.map(feature=>`<li><a href="${feature.url}">${feature.name}</a></li>`).join('')}
</ol>
Please update your browser core to Firefox ≥ ${needBrowserVersion.firefox} or Chrome ≥ ${needBrowserVersion.chrome} or Safari ≥ ${needBrowserVersion.safari}</p>`;
		}
	
		//alert(alertStr);
		document.write(alertStr);
	}

	if (/\b(?:MicroMessenger|WeChat|Weixin|QQ|AliApp)\b/.test(navigator.userAgent)) {
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
		alertDiv.className = "alert";
		alertDiv.innerHTML = `请勿使用APP内置浏览器，会有功能缺失<br>点击菜单使用正常浏览器打开↗`;
		const removeMe = mask.appendChild(document.createElement("button"));
		removeMe.append("我知道了");
		removeMe.onclick = ()=>{
			mask.remove();
			delete mask;
		};
	
		const event = window.addEventListener("load", ()=>{
			document.body.appendChild(mask);
			window.removeEventListener(event);
		});
	}
})();