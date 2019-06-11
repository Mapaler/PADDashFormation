var ms = null;
window.onload = function()
{
	GM_xmlhttpRequest({
		method: "GET",
		url:"monsters-info/mon.json",
		onload: function(response) {
			ms = JSON.parse(response.response);
			initialize();//初始化
			test(); //测试代码
		},
		onerror: function(response) {
			console.error("怪物数据获取错误",response);
		}
	});
}
//初始化
function initialize()
{
	var monstersList = document.querySelector("#monsters-list");
	ms.forEach(function(m){
		var opt = monstersList.appendChild(document.createElement("option"));
		opt.value = m.id;
		opt.label = m.id + " | " +  m.name + " | " + m.ename;
	});

	//编辑框
	var editBox = document.querySelector(".edit-box");
	var settingBox = editBox.querySelector(".setting-box")
	//id搜索
	var monstersSearch = editBox.querySelector(".edit-box .m-id");
	monstersSearch.onchange = function(){
		if (/^\d+$/.test(this.value))
		{
			editChangeMonId(parseInt(this.value));
		}
	}
	monstersSearch.oninput = monstersSearch.onchange;
	//觉醒
	var monEditAwokens = Array.prototype.slice.call(settingBox.querySelectorAll(".m-awoken-ul>.awoken-icon"));
	monEditAwokens.forEach(function(akDom,idx,domArr){
		akDom.onclick = function(){
			if (idx >= domArr.filter(function(d){return !d.classList.contains("display-none")}).length-1)
				domArr[0].innerHTML = "★";
			else
				domArr[0].innerHTML = idx;
			for(var ai=1;ai<domArr.length;ai++)
			{
				if(ai<=idx)
				{
					if(domArr[ai].classList.contains("unselected-awoken"))
						domArr[ai].classList.remove("unselected-awoken");
				}
				else
				{
					if(!domArr[ai].classList.contains("unselected-awoken"))
						domArr[ai].classList.add("unselected-awoken");
				}
			}
		}
	})
	//等级
	var monEditLv = settingBox.querySelector(".m-level");
	var monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.onclick = function(){
		monEditLv.value = this.value;
	}
	//加蛋
	var monEditAddHp = settingBox.querySelector(".m-add-hp");
	var monEditAddAtk = settingBox.querySelector(".m-add-atk");
	var monEditAddRcv = settingBox.querySelector(".m-add-rcv");
	var monEditAddHp99 = settingBox.querySelector(".m-add-hp-btn-99");
	monEditAddHp99.onclick = function(){monEditAddHp.value = this.value}
	var monEditAddAtk99 = settingBox.querySelector(".m-add-atk-btn-99");
	monEditAddAtk99.onclick = function(){monEditAddAtk.value = this.value}
	var monEditAddRcv99 = settingBox.querySelector(".m-add-rcv-btn-99");
	monEditAddRcv99.onclick = function(){monEditAddRcv.value = this.value}
	var monEditAdd297 = settingBox.querySelector(".m-add-btn-297");
	monEditAdd297.onclick = function(){monEditAddHp.value = monEditAddAtk.value = monEditAddRcv.value = 99}
	//潜觉
	var monEditLatentUl = settingBox.querySelector(".m-latent-ul");
	var latent = editBox.latent = [];
	var monEditLatents = Array.prototype.slice.call(monEditLatentUl.querySelectorAll("li"));
	var monEditLatentAllowableUl = settingBox.querySelector(".m-latent-allowable-ul");
	var monEditLatentsAllowable = Array.prototype.slice.call(monEditLatentAllowableUl.querySelectorAll("li"));
	function usedHole(latent) //计算用了多少潜觉格子
	{
		return latent.reduce(function(previous,current){
			return previous + (current>= 12?2:1);
		},0);
	}
	function refreshLatent() //刷新潜觉
	{
		if (this.value<0) return;
		var usedHoleN = usedHole(latent);
		for (var ai=0;ai<6;ai++)
		{
			if (latent[ai])
			{
				monEditLatents[ai].className = "latent-icon latent-icon-" + latent[ai];
				monEditLatents[ai].value = ai;
			}
			else if(ai<(6-usedHoleN+latent.length))
			{
				monEditLatents[ai].className = "latent-icon";
				monEditLatents[ai].value = -1;
			}
			else
			{
				monEditLatents[ai].className = "display-none";
				monEditLatents[ai].value = -1;
			}
		}
	}
	editBox.refreshLatent = refreshLatent;
	//已有觉醒的去除
	monEditLatents.forEach(function(l){
		l.onclick = function(){
			var aIdx = parseInt(this.value);
			latent.splice(aIdx,1);
			refreshLatent();
		}
	})
	//可选觉醒的添加
	monEditLatentsAllowable.forEach(function(la){
		la.onclick = function(){
			if (this.classList.contains("unselected-latent")) return;
			var lIdx = parseInt(this.value);
			var usedHoleN = usedHole(latent);
			if (lIdx >= 12 && usedHoleN<=4)
				latent.push(lIdx);
			else if (lIdx < 12 && usedHoleN<=5)
				latent.push(lIdx);
			refreshLatent();
		}
	})
}
function changeid(mon,monDom,awokenDom)
{
	var md = ms[mon.id]; //怪物固定数据
	if (mon.id>-1) //如果提供了id
	{
		monDom.className = "monster";
		monDom.classList.add("pet-cards-" + Math.ceil(mon.id/100)); //添加图片编号
		var idxInPage = (mon.id-1) % 100; //获取当前页面的总序号
		monDom.classList.add("pet-cards-index-x-" + idxInPage % 10); //添加X方向序号
		monDom.classList.add("pet-cards-index-y-" + parseInt(idxInPage / 10)); //添加Y方向序号
		monDom.querySelector(".property").className = "property property-" + md.ppt[0]; //主属性
		monDom.querySelector(".subproperty").className = "subproperty subproperty-" + md.ppt[1]; //副属性
		monDom.title = "No." + mon.id + " " + md.name;
		monDom.href = "http://pad.skyozora.com/pets/" + mon.id;
	}
	if (mon.level>0) //如果提供了等级
	{
		var levelDom = monDom.querySelector(".level");
		if (mon.level == 99 || (mon.level >= md.maxLevel && md.maxLevel <=99))
		{
			//levelDom.innerHTML = "Max";
			levelDom.classList.add("max");
		}else
		{
			levelDom.innerHTML = mon.level;
			levelDom.classList.remove("max");
		}
		if (md.maxLevel>99 && mon.level>=99)
			levelDom.classList.add("_110");
		else
			levelDom.classList.remove("_110");
	}
	if (mon.awoken>-1) //如果提供了觉醒
	{
		var awokenIcon = monDom.querySelector(".awoken-count");
		if (mon.awoken == 0 || md.awoken.length < 1) //没觉醒
		{
			awokenIcon.classList.add("display-none");
			awokenIcon.innerHTML = "";
		}else
		{
			awokenIcon.classList.remove("display-none");
			if (mon.awoken < md.awoken.length) //觉醒没满直接写数字
			{
				awokenIcon.innerHTML = mon.awoken;
				awokenIcon.classList.remove("allowable-assist");
			}else //满觉醒打星星
			{
				awokenIcon.innerHTML = "★";
				if (md.assist)
					awokenIcon.classList.add("allowable-assist");
			}
		}
	}
	if (mon.addition) //如果提供了加值
	{
		monDom.querySelector(".addition .hp").innerHTML = mon.addition[0];
		monDom.querySelector(".addition .atk").innerHTML = mon.addition[1];
		monDom.querySelector(".addition .rcv").innerHTML = mon.addition[2];
		if (mon.addition[0]+mon.addition[1]+mon.addition[2] >= 297)
		{
			monDom.querySelector(".addition").classList.add("has297");
		}else
		{
			monDom.querySelector(".addition").classList.remove("has297");
		}
	}
	if (awokenDom && mon.latent) //如果提供了潜觉
	{
		
	}
}


function editChangeMonId(id)
{
	var md = ms[id]; //怪物固定数据
	if (!md){
		id = 0;
		md = ms[0]
	}
	var editBox = document.querySelector(".edit-box");
	var monInfoBox = editBox.querySelector(".monsterinfo-box");
	var me = monInfoBox.querySelector(".monster");
	changeid({id:id,},me); //改变图像
	var mId = monInfoBox.querySelector(".monster-id");
	mId.innerHTML = id;
	var mRare = monInfoBox.querySelector(".monster-rare");
	mRare.className = "monster-rare rare-" + md.rare;
	var mName = monInfoBox.querySelector(".monster-name");
	mName.innerHTML = md.name;
	var mType = monInfoBox.querySelectorAll(".monster-type li");
	for (var ti=0;ti<mType.length;ti++)
	{
		if (md.type[ti])
		{
			mType[ti].className = "type-name type-name-" + md.type[ti];
			mType[ti].firstChild.className = "type-icon type-icon-" + md.type[ti];
		}else
		{
			mType[ti].className = "display-none";
		}
	}

	var settingBox = editBox.querySelector(".setting-box");
	var mAwoken = settingBox.querySelectorAll(".m-awoken-ul li");
	mAwoken[0].innerHTML = md.awoken.length?"★":"0";
	for (var ai=1;ai<mAwoken.length;ai++)
	{
		if (md.awoken[ai-1])
		{
			mAwoken[ai].className = "awoken-icon awoken-" + md.awoken[ai-1];
		}else
		{
			mAwoken[ai].className = "display-none";
		}
	}

	var monEditLvMax = settingBox.querySelector(".m-level-btn-max");
	monEditLvMax.innerHTML = monEditLvMax.value = md.maxLevel;
	var monEditLv = settingBox.querySelector(".m-level");
	monEditLv.value = md.maxLevel>99?99:md.maxLevel;

	var monLatentAllowUl = editBox.querySelector(".m-latent-allowable-ul");
	//该宠Type允许的杀
	var allowLatent = uniq(md.type.reduce(function (previous, t, index, array) {
		return previous.concat(type_allowable_latent[t]);
	},[]));
	for(var li=17;li<=24;li++)
	{
		var latentDom = monLatentAllowUl.querySelector(".latent-icon-" + li);
		if (allowLatent.indexOf(li)>=0)
		{
			if(latentDom.classList.contains("unselected-latent"))
				latentDom.classList.remove("unselected-latent");
		}else
		{
			if(!latentDom.classList.contains("unselected-latent"))
				latentDom.classList.add("unselected-latent");
		}
	}

	editBox.latent.length = 0;
	editBox.refreshLatent();
}




function test()
{
var m1 = document.querySelector(".formation-A-box .formation-team .team-1 .monster");
var a1 = document.querySelector(".formation-A-box .formation-team .team-1 .acquisitus-awoken-ul");
changeid({
id:5209,
level:99,
awoken:9,
addition:[99,99,99],
latent:[],
},m1,a1)
editChangeMonId(3264);
}