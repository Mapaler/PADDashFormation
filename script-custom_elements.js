const svgNS = "http://www.w3.org/2000/svg"; //svg用的命名空间
// Create a class for the element
class CardAvatar extends HTMLElement {
	// Specify observed attributes so that
	// attributeChangedCallback will work
	static get observedAttributes() {
		return ['iid'];
	}
	#iid = 0;
	get iid() { this.#iid; }
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
			'full',//觉醒打满
			'special',//是否是特殊颜色
		];
	}
	#number = 0;
	#type = 'awoken';
	#iconType = null;
	get number() { this.#number; }
	set number(x) {
		const number = Number(x);
		if (Number.isNaN(number)) throw new Error('传入的 number 不是数字!');
		this.setAttribute('number', number);
		this.#number = number;
	}
	get type() { this.#type; }
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
		// Create a shadow root
		const shadow = this.attachShadow({mode: 'open'});
		// Create some CSS to apply to the shadow dom
		const linkElem = shadow.appendChild(document.createElement('link'));
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'css/svg-icon.css');

		const svg = document.implementation.createDocument(svgNS,'svg');
		const use = svg.createElementNS(svgNS, 'use');
		svg.documentElement.appendChild(use);
		shadow.appendChild(svg.documentElement);
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
		const shadow = this.shadowRoot;
		const svg = shadow.querySelector('svg');
		svg.setAttribute("type", this.#type);
		this.#iconType ? svg.setAttribute("icon-type", this.#iconType) : svg.removeAttribute("icon-type");
		const use = svg.querySelector('use');
		svg.setAttribute("viewBox", "0 0 32 32");
		switch (this.#type) {
			case 'awoken': {
				if (/^(?:en|ko)/.test(lang) && [40,46,47,48].includes(number)) number += '-en'; //英文不一样的觉醒
				if (/^(?:zh)/.test(lang) && [46,47].includes(number)) number += '-zh'; //中文不一样的觉醒
				use.setAttribute("href",`images/icon-awoken.svg#awoken-${number}`);
				break;
			}
			case 'type': {
				if (/^(?:en|ko)/.test(lang) && [9,12].includes(number)) number += '-en'; //英文不一样的类型
				use.setAttribute("href",`images/icon-type.svg#type-${number}`);
				break;
			}
			case 'awoken-count': {
				svg.setAttribute("viewBox", "0 0 34 38");
				use.setAttribute("href",`images/icon-awoken-count.svg#awoken-count-bg`);
				const text = svg.querySelector('text') || svg.appendChild(document.createElementNS(svgNS, 'text'));
				//awoken,latent,8-latent
				//full,enable-assist-full,latent-full,8-latent,8-latent-full
				const full = this.getAttribute('full') != null;
				const special = this.getAttribute('special') != null;
				const style = svg.querySelector('style') || svg.appendChild(document.createElementNS(svgNS, 'style'));
				text.textContent = full ? '★' : number;
				text.setAttribute("x", "50%");
				text.setAttribute("y", "47%");
				text.setAttribute("class", "number");
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