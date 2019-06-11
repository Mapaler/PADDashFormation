var ms = null;
window.onload = function()
{
	GM_xmlhttpRequest({
		method: "GET",
		url:"monsters-info/mon.json",
		onload: function(response) {
			ms = JSON.parse(response.response);
			console.log(ms);
		},
		onerror: function(response) {
			console.error("怪物数据获取错误",response);
		}
	})
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
	if (mon.id) //如果提供了id
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
	if (mon.level) //如果提供了等级
	{
		monDom.querySelector(".level").innerHTML = mon.level || 99;
	}
	if (mon.awoken) //如果提供了觉醒
	{
		var awokenIcon = monDom.querySelector(".awoken-icon");
		if (mon.awoken == 0 || md.awoken.length < 1) //没觉醒
		{
			awokenIcon.classList.add("awoken-none");
			awokenIcon.innerHTML = "";
		}else
		{
			awokenIcon.classList.remove("awoken-none");
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

var m1 = document.querySelector(".formation-A-box .formation-team .team-1 .monster");
var a1 = document.querySelector(".formation-A-box .formation-team .team-1 .acquisitus-awoken-ul");
changeid({
id:5209,
level:98,
awoken:8,
addition:[99,99,99],
acquisitusAwoken:[],
},m1,a1)