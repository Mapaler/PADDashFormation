//const _localTranslating = {};
//deepMerge(localTranslating, _localTranslating);
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = function() {
	const negative = this < 0;

	let numTemp = negative ? Math.abs(this) : this.valueOf();
	if (!numTemp) return "0";
	const grouping = 1e4;
	const unit = ['', '万', '亿', '兆', '京', '垓'];
	const numParts = [];
	do {
		numParts.push(numTemp % grouping);
		numTemp = Math.floor(numTemp / grouping);
	} while (numTemp > 0 && numParts.length < (unit.length - 1))
	if (numTemp > 0) {
		numParts.push(numTemp);
	}
	let numPartsStr = numParts.map((num, idx) => {
		if (num > 0) {
			return (num < 1e3 ? "零" : "") + num + unit[idx];
		} else
			return "零";
	});

	numPartsStr.reverse(); //反向
	let outStr = numPartsStr.join("");
	outStr = outStr.replace(/(^零+|零+$)/g, ''); //去除开头的零
	outStr = outStr.replace(/零{2,}/g, '零'); //去除多个连续的零
	return (negative ? "-" : "") + outStr;
}