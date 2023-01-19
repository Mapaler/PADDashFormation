// ==UserScript==
// @name         Link Helper for PAD Dash Formation
// @name:zh-CN   智龙急速阵型链接助手
// @name:zh-HK   龍圖急速陣型鏈接助手
// @name:zh-TW   龍圖急速陣型鏈接助手
// @namespace	 http://www.mapaler.com/
// @version      1.0.1
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
		window.GM_xmlhttpRequest = GM.xmlHttpRequest;
	}
	const qrDialog = document.querySelector("#qr-code-frame");
	const actionButtonBox = qrDialog.querySelector(".action-button-box");
	const txtStringInput = actionButtonBox.querySelector(".string-input"); //输入的字符串
	const btnReadString = actionButtonBox.querySelector(".read-string"); //读取字符串按钮

	//新增的按钮
	const btnReadExternalLink = actionButtonBox.appendChild(document.createElement("button"));
	btnReadExternalLink.className = "read-external-link brown-button";

	async function pGM_xmlhttpRequest(options) {
		return new Promise(function(resolve, reject) {
			options.onload = function(response) {
				resolve(response);
			};
			options.onerror = function(response) {
				reject(response);
			};
			GM_xmlhttpRequest(options);
		});
	}
	btnReadExternalLink.readExternalLink = async function(urlStr) {
		const url = new URL(urlStr);
		const paddbPathPrefix = "/team/";
		if (url.host == "paddb.net" && url.pathname.startsWith(paddbPathPrefix)) {
			const teamId = url.pathname.substring(url.pathname.indexOf(paddbPathPrefix) + paddbPathPrefix.length),
				  postBody = JSON.stringify({id: teamId});
			const options = {
				method: "POST",
				url: `https://api2.paddb.net/getTeam`,
				data: postBody,
				headers: {
					"Content-Type": "application/json",
					"User-Agent": "okhttp/4.9.2",
					"Content-Length": postBody.length,
				}
			};
			return pGM_xmlhttpRequest(options);
		} else {
			return false;
		}
	}
	btnReadExternalLink.onclick = function(){
		const request = this.readExternalLink(txtStringInput.value);
		request?.then(response=>{
			txtStringInput.value = response.response;
			btnReadString.click();
		});
	}
	actionButtonBox.appendChild(btnReadExternalLink);
})();