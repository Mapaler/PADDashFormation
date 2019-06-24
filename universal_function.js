//类型允许的潜觉杀，前面的数字是官方数据的类型编号，后面的杀是自己做的图片中的潜觉序号
var type_allowable_latent = {
    "0":[], //0进化
    "12":[], //12觉醒
    "14":[], //14强化
    "15":[], //15卖钱
    "1":[17,18,19,20,21,22,23,24], //1平衡
    "2":[20,24],//2体力
    "3":[18,22],//3回复
    "4":[20,24],//4龙
    "5":[19],//5神
    "6":[19,23],//6攻击
    "7":[17],//7恶魔
    "8":[17,20,21,24],//8机械
}
//仿GM_xmlhttpRequest函数v1.3
if (typeof(GM_xmlhttpRequest) == "undefined") {
    var GM_xmlhttpRequest = function(GM_param) {

        var xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
        xhr.open(GM_param.method, GM_param.url, true);
        if (GM_param.responseType) xhr.responseType = GM_param.responseType;
        if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
        xhr.onreadystatechange = function() //设置回调函数
            {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200 && GM_param.onload)
                        GM_param.onload(xhr);
                    if (xhr.status !== 200 && GM_param.onerror)
                        GM_param.onerror(xhr);
                }
            }

        for (var header in GM_param.headers) {
            xhr.setRequestHeader(header, GM_param.headers[header]);
        }

        xhr.send(GM_param.data ? GM_param.data : null);
    }
}
//数字补0
function PrefixInteger(num, length)
{  
	return (Array(length).join('0') + num).slice(-length); 
}
//获取URL参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]); return null;
}
//数组去重
/* https://www.cnblogs.com/baiyangyuanzi/p/6726258.html
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）*/
function uniq(array){
    var temp = [];
    var l = array.length;
    for(var i = 0; i < l; i++) {
        for(var j = i + 1; j < l; j++){
            if (array[i] === array[j]){
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
    }
    return temp;
}
//计算用了多少潜觉格子
function usedHole(latent)
{
	return latent.reduce(function(previous,current){
		return previous + (current>= 12?2:1);
	},0);
}
//计算用了多少潜觉格子
function awokenCountInTeam(formationTeam,ak,solo)
{
    var allAwokenCount = formationTeam.reduce(function(fc,fm){
        var formationAwokenCount = fm.reduce(function(tc,tm,isAssist){
            var teamAwokenCount = tm.reduce(function(c,m){
                if (m.id<=0)
                { //如果是特殊情况的
                    return c;
                }
                var mdAwoken = ms[m.id].awoken; //这个怪物的觉醒数据
                var mdSAwoken = ms[m.id].sAwoken; //这个怪物的超觉醒数据
                if ((!mdAwoken && !mdSAwoken) || (isAssist && mdAwoken[0] != 49))
                { //如果没有觉醒和超觉醒 || （如果是辅助队 &&第一个不是武器觉醒）
                    return c;
                }
                //启用的觉醒数组片段
                var enableAwoken = mdAwoken.slice(0,m.awoken);
                //相同的觉醒数
                var hasAwoken = enableAwoken.filter(function(a){return a == ak;}).length;
                //如果有超觉醒，且超觉醒id和计数的id相同
                if (mdSAwoken && (mdSAwoken[m.sawoken] == ak))
                {
                    hasAwoken++;
                }
                return c + hasAwoken;
            },0);
            return tc + teamAwokenCount;
        },0)
        return fc + formationAwokenCount;
    },0)
    return allAwokenCount;
}