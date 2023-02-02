// ==UserScript==
// @name         Link Helper for PAD Dash Formation
// @name:zh-CN   智龙急速阵型链接助手
// @name:zh-HK   龍圖急速陣型鏈接助手
// @name:zh-TW   龍圖急速陣型鏈接助手
// @namespace	 http://www.mapaler.com/
// @version      1.0.3
// @description  Helps obtain team data from external cross-domain servers such as PADDB
// @description:zh-CN  帮助获取 PADDB 等外部跨域服务器的队伍分享数据
// @description:zh-HK  幫助獲取 PADDB 等外部跨域服務器的隊伍分享數據
// @description:zh-TW  幫助獲取 PADDB 等外部跨域服務器的隊伍分享數據
// @icon         https://paddb.net/assets/logo.bce38008.png
// @match        *://mapaler.github.io/PADDashFormation/*
// @match        *://*.mapaler.com/PADDashFormation/*
// @match        *://localhost/PADDashFormation/*
// @match        *://pad.ideawork.cn/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      api2.paddb.net
// @license      GPLv3
// @author       Mapaler <mapaler@163.com>
// @homepage	 https://mapaler.github.io/PADDashFormation/
// ==/UserScript==

(function() {
	'use strict';
	if (GM?.xmlHttpRequest) { //For Greasemonkey 4.x
		window["GM_xmlhttpRequest"] = GM.xmlHttpRequest;
	}
	//新增的按钮
	const btnExternalSupport = document.querySelector("#external-support");
	if (!btnExternalSupport) return;
	btnExternalSupport.GM_xmlhttpRequest = GM_xmlhttpRequest;
	btnExternalSupport.asyncGM_xmlhttpRequest = async function(options) {
		return new Promise(function(resolve, reject) {
			options.onload = function(response) {
				resolve(response);
			};
			options.onerror = function(response) {
				reject(response);
			};
			GM_xmlhttpRequest(options);
		});
	};
})();