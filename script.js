var ms = null;
window.onload = function()
{
	GM_xmlhttpRequest({
		method: "GET",
		url:"monsters-info/mon.json",
		onload: function(response) {
			ms = JSON.parse(response.response);
			initialize();//初始化
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
	var monstersSearch = editBox.querySelector(".edit-box .m-id");
	monstersSearch.onchange = function(){
		if (/^\d+$/.test(this.value))
		{
			editChangeMonId(parseInt(this.value));
		}
	}
	monstersSearch.oninput = monstersSearch.onchange;
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
					domArr[ai].classList.remove("unselected-awoken");
				else
					domArr[ai].classList.add("unselected-awoken");
			}
		}
	})
	var monEditLv = settingBox.querySelector(".m-level");
	var monEditLv99 = settingBox.querySelector(".m-level-btn-99");
	var monEditLv110 = settingBox.querySelector(".m-level-btn-110");
	monEditLv99.onclick = function(){
		monEditLv.value = this.value;
	}
	monEditLv110.onclick = monEditLv99.onclick;
	
	var monEditAddHp = settingBox.querySelector(".m-add-hp");
	var monEditAddAtk = settingBox.querySelector(".m-add-atk");
	var monEditAddDef = settingBox.querySelector(".m-add-def");
	var monEditAddHp99 = settingBox.querySelector(".m-add-hp-btn-99");
	monEditAddHp99.onclick = function(){monEditAddHp.value = this.value}
	var monEditAddAtk99 = settingBox.querySelector(".m-add-atk-btn-99");
	monEditAddAtk99.onclick = function(){monEditAddAtk.value = this.value}
	var monEditAddDef99 = settingBox.querySelector(".m-add-def-btn-99");
	monEditAddDef99.onclick = function(){monEditAddDef.value = this.value}
	var monEditAdd297 = settingBox.querySelector(".m-add-btn-297");
	monEditAdd297.onclick = function(){monEditAddHp.value = monEditAddAtk.value = monEditAddDef.value = 99}

	test();
}
function changeid(mon,monDom,awokenDom)
{
	var md = ms[mon.id]; //怪物固定数据
	/*
	mon.id
	mon.level
	mon.awoken
	mon.addition
	mon.acquisitusAwoken
	*/
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
		monDom.querySelector(".level").innerHTML = mon.level || 99;
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
				awokenIcon.innerHTML = mon.awoken;
			else //满觉醒打星星
				awokenIcon.innerHTML = "★";
		}
	}
	if (mon.addition) //如果提供了加值
	{
		monDom.querySelector(".addition .hp").innerHTML = mon.addition[0];
		monDom.querySelector(".addition .atk").innerHTML = mon.addition[1];
		monDom.querySelector(".addition .def").innerHTML = mon.addition[2];
		if (mon.addition[0]+mon.addition[1]+mon.addition[2] >= 297)
		{
			monDom.querySelector(".addition").classList.add("has297");
		}else
		{
			monDom.querySelector(".addition").classList.remove("has297");
		}
	}
	if (awokenDom && mon.acquisitusAwoken) //如果提供了潜觉
	{
		
	}
}

function test()
{
var m1 = document.querySelector(".formation-A-box .formation-team .team-1 .monster");
var a1 = document.querySelector(".formation-A-box .formation-team .team-1 .acquisitus-awoken-ul");
changeid({
id:5209,
level:98,
awoken:8,
addition:[99,99,99],
acquisitusAwoken:[],
},m1,a1)
editChangeMonId(3264);
}

function editChangeMonId(id)
{
	var md = ms[id]; //怪物固定数据
	if (!md){
		id = 0;
		md = ms[0]
	}
	var monInfoBox = document.querySelector(".edit-box .monsterinfo-box");
	var me = monInfoBox.querySelector(".monster");
	changeid({id:id,},me); //改变图像
	var mId = monInfoBox.querySelector(".monster-id");
	mId.innerHTML = id;
	var mRare = monInfoBox.querySelector(".monster-rare");
	mRare.className = "monster-rare rare-" + md.rare;
	var mName = monInfoBox.querySelector(".monster-name");
	mName.innerHTML = md.name;
	var mType = monInfoBox.querySelector(".monster-type").children;
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

	var monSettingBox = document.querySelector(".edit-box .setting-box");
	var mAwoken = monSettingBox.querySelector(".m-awoken-ul").children;
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
}