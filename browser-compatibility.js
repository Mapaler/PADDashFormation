let needUpdateBrowser = (()=>{
	try {
		return !Boolean(eval("undefined ?? true"));
	} catch (e) {
		if (e.name !== 'SyntaxError') throw e // Throw the error if it is not a SyntaxError
		return true;
	}
}
)();

if (needUpdateBrowser)
{
	let browserVersion = ((UA)=>{
		let regRes;
		if (regRes = /\b(Firefox|Chrome)\/([\d\.]+)/ig.exec(navigator.userAgent))
		{
			return `${regRes[1]} ${regRes[2]}`;
		}else if (regRes = /\bVersion\/([\d\.]+)\s+.*\b(Safari)\//ig.exec(navigator.userAgent))
		{
			return `${regRes[2]} ${regRes[1]}`;
		}else
		{
			navigator.userAgent;
		}
	})(navigator.userAgent);
	
alert(`你的浏览器 | Your browser:
${browserVersion}

您的浏览器不支持 可选链操作符(?.) 和 空值合并操作符(??)。
Your browser does not support Optional chaining (?.) and Nullish coalescing operator (??).

请更新您的浏览器到 火狐 ≥ 74 或 谷歌 ≥ 80 或 苹果 ≥ 13.1。
Please update your browser to Firefox ≥ 74 or Chrome ≥ 80 or Safari ≥ 13.1.`);
}