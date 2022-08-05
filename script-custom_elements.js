/*
 * Detail: 仿照 DOMTokenList 功能实现的自定义 CustomTokenList
 */
class CustomTokenList extends Array {
	//Reference: https://stackoverflow.com/questions/49349195/using-splice-method-in-subclass-of-array-in-javascript/56181665#56181665 让splice能够用
	static get [Symbol.species]() { return Array; }
	static #illegalTokenRegRex = /\s/;
	#node = null;
	#attributeName = null;
	#refreshAttribute = true;
	#observer = null;
	#observerOptions = {
		attributeFilter: [],
		attributeOldValue: true,
		subtree: true
	};
	get #attribute() { //获取绑定的参数
		return this.#node.getAttributeNode(this.#attributeName);
	}
	set #attribute(node) { //直接设定绑定的参数AttrNode
		if (node instanceof Attr) {
			this.#node = node.ownerElement;
			this.#attributeName = node.nodeName;
			this.#observerOptions.attributeFilter = [this.#attributeName];
		} else {
			throw new TypeError(`${CustomTokenList.name}.#attribute: Argument 1 is not an Attr.\n参数 1 不是 Attr。`);
		}
	}
	constructor(node, attributeName){ //传入 HTMLElement 和需要绑定的 参数名称
		super();
		if (node instanceof Attr) {
			this.#attribute = node;
		} else if (node instanceof HTMLElement) {
			this.#node = node;
			this.#attributeName = attributeName.toString().toLowerCase(); //attributeName 只支持小写
			this.#observerOptions.attributeFilter = [this.#attributeName];
		} else {
			throw new TypeError(`${CustomTokenList.name}.constructor: Argument 1 is not an Attr or HTMLElement.\n参数 1 不是 Attr 或 HTMLElement。`);
		}
		let initializeValue = this.#attribute.nodeValue;
		if (initializeValue) { //如果值已经存在，则先添加到TokenList
			this.value = initializeValue;
		}
		const _this = this;
		this.#observer = new MutationObserver(function(mutationList) {
			for (const mutation of mutationList) {
				if (mutation.type == 'attributes' && mutation.attributeName == _this.#attributeName) {
					//因为可能是删除属性，所以i需要重新取得属性
					_this.#attribute = _this.#node.getAttributeNode(_this.#attributeName);
					//清空旧值
					_this.length = 0;
					if (_this.#attribute) {
						_this.#refreshAttribute = false; //外部属性变化时，添加内容不再循环进行属性的更新
						_this.add(...new Set(_this.#attribute.nodeValue.split(/\s+/g)));
						_this.#refreshAttribute = true;
					}
					break;
				}
			}
		});
		this.#observer.observe(this.#node, this.#observerOptions);
	}
	
	static #InvalidCharacterError(functionName) {
		return new DOMException(`${CustomTokenList.name}.${functionName}:The token can not contain whitespace.\bToken 不允许包含空格。`, "InvalidCharacterError");
	}

	#refreshAttributeValue() {
		if (this.#refreshAttribute) {
			this.#observer.disconnect(); //解除绑定
			if (!this.#attribute) {
				this.#node.setAttributeNode(document.createAttribute(this.#attributeName));
			}
			this.#attribute.value = this.value;
			this.#observer.observe(this.#node, this.#observerOptions); //恢复绑定
		}
	}

	add(...tokens){
		//全部强制转换为字符串
		tokens = tokens.map(token=>token.toString());
		//如果任何 token 里存在空格，就直接抛出错误
		if (tokens.some(token=>CustomTokenList.#illegalTokenRegRex.test(token)))
			throw CustomTokenList.#InvalidCharacterError('add');

		//经过测试普通循环push性能最高，并且由于需要去重，需要每次判断是否存在
		tokens.forEach(token => {
			if (!this.includes(token)) this.push(...token);
		});

		this.#refreshAttributeValue();
		return;
	}

	remove(...tokens){
		//全部强制转换为字符串
		tokens = tokens.map(token=>token.toString());
		//如果任何 token 里存在空格，就直接抛出错误
		if (tokens.some(token=>CustomTokenList.#illegalTokenRegRex.test(token)))
			throw CustomTokenList.#InvalidCharacterError('remove');

		//splice性能特别低，但是这里只能用这个
		tokens.forEach(token => {
			const index = this.indexOf(token);
			if (index>=0) this.valueOf().splice(index,1);
		});

		this.#refreshAttributeValue();
		return;
	}

	contains(token){
		return this.includes(token.toString());
	}

	toggle(token, force){
		if (CustomTokenList.#illegalTokenRegRex.test(token))
			throw CustomTokenList.#InvalidCharacterError('toggle');
		if (force !== undefined) {
			if(Boolean(force)) {
				this.add(token);
				return true;
			}else{
				this.remove(token);
				return false;
			}
		} else {
			if (this.contains(token)) {
				this.remove(token);
				return false;
			} else {
				this.add(token);
				return true;
			}
		}

	}

	get value() {
		return this.join(' ');
	}
	set value(attrValue) {
		//将值确保转为字符串，然后以空格拆分，并加入Set确保唯一性
		const inputTokens = [...new Set(attrValue.toString().split(/\s+/g))];
		this.length = 0;
		this.push(...inputTokens);
		
		this.#refreshAttributeValue();
	}

	replace(oldToken, newToken){
		oldToken = oldToken.toString();
		newToken = newToken.toString();
		if (CustomTokenList.#illegalTokenRegRex.test(oldToken) || CustomTokenList.#illegalTokenRegRex.test(newToken))
			throw CustomTokenList.#InvalidCharacterError('replace');
		const index = this.indexOf(oldToken);
		if (index>=0) {
			this.splice(index,1, this.includes(newToken) ? undefined : newToken);
			if (this.#refreshAttribute) {
				this.#observer.disconnect(); //解除绑定
				this.#attribute.value = this.value;
				this.#observer.observe(this.#node, this.#observerOptions); //恢复绑定
			}
			return true;
		} else {
			return false;
		}
	}

	item(index) {
		return this[index];
	}
};

const svgNS = "http://www.w3.org/2000/svg"; //svg用的命名空间

// Create a class for the element
class CardAvatar extends HTMLElement {
	// Specify observed attributes so that
	// attributeChangedCallback will work
	static get observedAttributes() {
		return ['iid'];
	}
	#iid = 0;
	get iid() { 
		return this.#iid;
	}
	/**
	 * @param {string | number} x
	 */
	set iid(x) {
		//this.#iid = x; //在属性改变的内容里已经写入了
		this.setAttribute('iid', x);
	}
	//#member = new Member();
	/**
	 * @param {Member} m
	 */
	/*get member() {
		return this.#member;
	}*/
	/**
	 * @param {Member} m
	 */
	/*set member(m) {
		this.#member = m;
		console.log("设定新的Member",m);
		this.setAttribute('id', m.id);
	}*/

	constructor() {
		// Always call super first in constructor
		super();

		// Create a shadow root
		const shadow = this.attachShadow({mode: 'open'});

		// Create some CSS to apply to the shadow dom
		const linkElem = shadow.appendChild(document.createElement('link'));
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/card-avatar.css');
		// Create spans
		const wrapper = shadow.appendChild(document.createElement('a'));
		wrapper.className = 'wrapper';
		wrapper.target = '_blank';
		const dAttr1 = wrapper.appendChild(document.createElement('div'));
		dAttr1.className = 'attribute attribute-main';
		const dAttr2 = wrapper.appendChild(document.createElement('div'));
		dAttr2.className = 'attribute attribute-sub';

		const dLeftTop = wrapper.appendChild(document.createElement('div'));
		dLeftTop.className = "flex-box flex-left-top";
		const dLeftBottom = wrapper.appendChild(document.createElement('div'));
		dLeftBottom.className = "flex-box flex-left-bottom";
		const dRightTop = wrapper.appendChild(document.createElement('div'));
		dRightTop.className = "flex-box flex-right-top";
		const dRightBottom = wrapper.appendChild(document.createElement('div'));
		dRightBottom.className = "flex-box flex-right-bottom";

		const dId = dLeftBottom.appendChild(document.createElement('div'));
		dId.className = 'card-id';
		const dLevel = dLeftBottom.appendChild(document.createElement('div'));
		dLevel.className = 'level';
		dLevel.textContent = "110";

		const dEnhancement = dLeftTop.appendChild(document.createElement('div'));
		dEnhancement.className = 'enhancement';
		dEnhancement.textContent = "297";

		const dActiveSkillCD = dRightBottom.appendChild(document.createElement('div'));
		dActiveSkillCD.className = 'active-skill-cd';
		dActiveSkillCD.textContent = "99";
	}
	connectedCallback() {
		console.log('自定义标签添加到页面');
		this.update();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		console.log('自定义标签属性改变', name, oldValue, newValue);
		//if (name == 'id') this.#id = parseInt(this.getAttribute('id'));
		if (name == 'iid') this.#iid = parseInt(newValue);
		this.update();
	}
	update() {
		//得到怪物ID
		const id = this.#iid || 0;
		this.iid = id;
		const card = Cards[id] || Cards[0];
		const dataSource = this.getAttribute('source') || currentDataSource.code;
		const shadow = this.shadowRoot;
		
		const wrapper = shadow.querySelector('.wrapper');
		wrapper.href = currentLanguage.guideURL(id, card.name);
		wrapper.style.backgroundImage = `url(images/cards_${dataSource.toLowerCase()}/CARDS_${Math.ceil(id / 100).toString().padStart(3,"0")}.PNG)`;
		const idxInPage = (id - 1) % 100; //获取当前页面内的序号
		wrapper.setAttribute("data-cards-pic-x", idxInPage % 10); //添加X方向序号
		wrapper.setAttribute("data-cards-pic-y", Math.floor(idxInPage / 10)); //添加Y方向序号
		const dAttr1 = wrapper.querySelector('.attribute-main');
		dAttr1.setAttribute('data-attr', card.attrs[0]);
		const dAttr2 = wrapper.querySelector('.attribute-sub');
		dAttr2.setAttribute('data-attr', card.attrs[1]);
		const dId = wrapper.querySelector('.card-id');
		dId.setAttribute('data-id', id);
	}
}

// Define the new element
customElements.define('card-avatar', CardAvatar);

class PadIcon extends HTMLElement {
	// Specify observed attributes so that
	// attributeChangedCallback will work
	static get observedAttributes() {
		return [
			'type', //图标类型
			'number', //编号或数字，必须是数字
			'lang', //英语、中文特殊图标的设定
			'icon-type',//子图标类型
			//'icon-value',//子图标的值
			'flags', //各种选项开关，类似className
		];
	}
	static ELEMENT_TYPE_AWOKEN = 'awoken';
	static ELEMENT_TYPE_TYPE = 'type';
	static ELEMENT_TYPE_AWOKEN_COUNT = 'awoken-count';
	#svg = document.createElementNS(svgNS,'svg');
	#flags = null;
	get flagsList() { return this.#flags; }
	#number = 0;
	#type = PadIcon.ELEMENT_TYPE_AWOKEN;
	#iconType = null;
	get number() { return this.#number; }
	set number(x) {
		const number = Number(x);
		if (Number.isNaN(number)) throw new Error('传入的 number 不是数字!');
		this.setAttribute('number', number);
		this.#number = number;
	}
	get type() { return this.#type; }
	set type(x) {
		if (x == null) {
			this.removeAttribute('type');
		} else {
			this.setAttribute('type', x);
		}
		this.#type = x;
	}
	get iconType() { this.#iconType; }
	set iconType(x) {
		if (x == null) {
			this.removeAttribute('icon-type');
		} else {
			this.setAttribute('icon-type', x);
		}
		this.#iconType = x;
	}

	constructor() {
		// Always call super first in constructor
		super();
		this.#flags = new CustomTokenList(this, "flags");
		// Create a shadow root
		const shadow = this.attachShadow({mode: 'open'});
		// Create some CSS to apply to the shadow dom
		const linkElem = shadow.appendChild(document.createElement('link'));
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/svg-icon.css');

		const svg = this.#svg;
		const use = document.createElementNS(svgNS, 'use');
		svg.appendChild(use);
		shadow.appendChild(svg);
	}
	connectedCallback() { //自定义标签添加到页面
		this.update();
	}
	attributeChangedCallback(name, oldValue, newValue) { //自定义标签属性改变
		const svg = this.shadowRoot.querySelector('svg');
		if (name == 'type') {
			this.#type = newValue;
			//如果更换类型，删除use以外的其他node
			const use = svg.querySelector('use');
			[...svg.childNodes].forEach(child=>{if(child!=use) child.remove();});
		}
		if (name == 'number') {
			const number = Number(newValue);
			this.#number = Number.isNaN(number) ? 0 : number;
		}
		if (name == 'icon-type') this.#iconType = newValue;
		//将这些属性全都复制到svg上去
		if (newValue == null) {
			svg.removeAttribute(name);
		} else {
			svg.setAttribute(name, newValue);
		}
		this.update();
	}
	update() {
		const number = this.#number;
		const lang = this.getAttribute('lang') || currentLanguage.i18n;
		//const shadow = this.shadowRoot;
		const svg = this.#svg;
		//svg.setAttribute("type", this.#type);
		//this.#iconType ? svg.setAttribute("icon-type", this.#iconType) : svg.removeAttribute("icon-type");
		const use = svg.querySelector(':scope>use');
		svg.setAttribute("viewBox", "0 0 32 32");
		switch (this.#type) {
			case PadIcon.ELEMENT_TYPE_AWOKEN: {
				if (/^(?:en|ko)/.test(lang) && [40,46,47,48].includes(number)) number += '-en'; //英文不一样的觉醒
				if (/^(?:zh)/.test(lang) && [46,47].includes(number)) number += '-zh'; //中文不一样的觉醒
				use.href.baseVal = `images/icon-awoken.svg#awoken-${number}`;
				break;
			}
			case PadIcon.ELEMENT_TYPE_TYPE: {
				if (/^(?:en|ko)/.test(lang) && [9,12].includes(number)) number += '-en'; //英文不一样的类型
				use.href.baseVal = `images/icon-type.svg#type-${number}`;
				break;
			}
			case PadIcon.ELEMENT_TYPE_AWOKEN_COUNT: {
				const full = this.flagsList.contains("full");
				const weapon = this.flagsList.contains("weapon");
				const canAssist = this.flagsList.contains("can-assist");
				//svg.setAttribute("viewBox", "0 0 34 38");
				svg.viewBox.baseVal.width = 34;
				svg.viewBox.baseVal.height = 38;
				if (full && weapon && canAssist) {
					use.href.baseVal = `images/icon-awoken.svg#awoken-49`;
					svg.querySelector('text')?.remove();
					break;
				}
				use.href.baseVal = `images/icon-awoken-count.svg#awoken-count-bg`;
				const text = svg.querySelector('text') || svg.appendChild(document.createElementNS(svgNS, 'text'));
				text.textContent = full ? '★' : number;
				//text.setAttribute("x", "50%");
				const lengthX = svg.createSVGLength();
				lengthX.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 50);
				text.x.baseVal.initialize(lengthX);
				//text.setAttribute("y", "47%");
				const lengthY = svg.createSVGLength();
				lengthY.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 47);
				text.y.baseVal.initialize(lengthY);
				text.classList.add("number");

				text.textLength.baseVal.newValueSpecifiedUnits(
					full ? SVGLength.SVG_LENGTHTYPE_EMS : SVGLength.SVG_LENGTHTYPE_PERCENTAGE,
					full ? 0.9 : 100);
				text.lengthAdjust.baseVal = full ? SVGTextElement.LENGTHADJUST_SPACINGANDGLYPHS : SVGTextElement.LENGTHADJUST_SPACING;
				break;
			}
			case 'latent':
			case 'badge':
			case 'attr':
			case 'orb':
			case 'common':
			case 'skill':
			default:
				break;
		}
	}
}

// Define the new element
customElements.define('pad-icon', PadIcon);