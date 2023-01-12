// ==UserScript==
// @name         Link Helper for PAD Dash Formation
// @name:zh-CN   智龙急速阵型链接助手
// @namespace    mapaler
// @version      0.1
// @description  try to take over the world!
// @author       mapaler
// @match        *://*/PADDashFormation/*
// @match        *://pad.ideawork.cn/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      api2.paddb.net
// ==/UserScript==

(function() {
	'use strict';
	if (GM?.xmlHttpRequest) { //For Greasemonkey 4.x
		window.GM_xmlhttpRequest = GM.xmlHttpRequest;
	}
	GM_xmlhttpRequest({
		method: "POST",
		url: `https://api2.paddb.net/getTeam`, //版本文件
		data: '{"id":"63b287659b239a72f6cc79b1"}',
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "okhttp/4.9.2",
			"Content-Length": "33",
		},
		onload: function(response) {
			console.log(response.response);
		},
		onerror: function(response) {
			console.error(response);
			return;
		}
	})
})();