var mdata = {ja:null,en:null};
window.onload = function()
{
	GM_xmlhttpRequest({
		method: "GET",
		url:"monsters-info/ja.json",
		onload: function(response) {
			mdata.ja = JSON.parse(response.response);
			GM_xmlhttpRequest({
				method: "GET",
				url:"monsters-info/en.json",
				onload: function(response) {
					mdata.en = JSON.parse(response.response);
					//buildHTML(mdata);
				},
				onerror: function(response) {
					console.error("英文怪物数据获取错误",response);
				}
			})
		},
		onerror: function(response) {
			console.error("日文怪物数据获取错误",response);
		}
	})
}