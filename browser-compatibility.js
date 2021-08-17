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
	
alert(`🙁浏览器内核版本太老 | Browser kernel is too old
您的浏览器版本为 | Your browser is:
${browserVersion}

您的浏览器不支持本程序使用的 可选链操作符(?.) 和 空值合并操作符(??)。
Your browser does not support Optional chaining (?.) and Nullish coalescing operator (??) used in this program.

请更新您的浏览器到 Firefox(火狐) ≥ 74 或 Chrome(谷歌) ≥ 80 或 Safari(苹果) ≥ 13.1。
Please update your browser to Firefox ≥ 74 or Chrome ≥ 80 or Safari ≥ 13.1.`);
}