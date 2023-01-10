//const _localTranslating = {};
//deepMerge(localTranslating, _localTranslating);
localisation(localTranslating);

//大数字缩短长度
Number.prototype.bigNumberToString = function() {
	const negative = this < 0;

	let numTemp = negative ? Math.abs(this) : this.valueOf();
	if (!numTemp) return "0";
	if (numTemp == Infinity) return "Infinity";
	const grouping = 1e3;
	const unit = ['', 'K', 'M', 'G', 'T', 'P'];
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
			return num + unit[idx];
		} else
			return "";
	});

	let outStr = numPartsStr.filter(Boolean).reverse().join(" ");
	return (negative ? "-" : "") + outStr;
}