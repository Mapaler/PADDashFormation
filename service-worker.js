const CACHES = new Map([
	['font', 'font-cache-v1'],
	['cards_ja', 'card_ja-cache-v1'],
	['cards_en', 'card_en-cache-v1'],
	['cards_ko', 'card_ko-cache-v1'],
	['voice_ja', 'voice_ja-cache-v1'],
	['voice_en', 'voice_en-cache-v1'],
	['voice_ko', 'voice_ko-cache-v1'],
]);

self.addEventListener('install', function(event) {
	console.debug("安装中", ENV);
    self.skipWaiting();
	event.waitUntil(
		cache.open(CACHES.get("font")).then(function(cache) {
			return cache.addAll([
				'/PADDashFormation/fonts/fa-solid-900.woff2',
				'/PADDashFormation/fonts/FOT-KurokaneStd-EB.woff2',
				'/PADDashFormation/fonts/zpix.woff2',
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
// You're good to go!
	var cacheNames = new Set(CACHES.values());
	event.waitUntil(
		caches.keys().then(function(keyList) { //所有的现存的缓存列表
			return Promise.all(keyList.map(function(key) {
				console.debug("删除缓存", key);
				if (!cacheNames.has(key)) { //如果不在当前的缓存列表里就删除
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(resp) {
			if (resp) console.debug("找到缓存", event.request.url);
			return resp || fetch(event.request).then(async function(response) {
				//console.debug("正则测试",/images\/cards\w+\/CARDS_\d+\.PNG/i.test(event.request.url));
				if (event.request.url.includes(".woff2")) { //缓存字体
					console.debug("缓存字体", event.request.url);
					const cache = await caches.open(CACHES.get("font"));
					cache.put(event.request, response.clone());
				} else if (/images\/cards_\w+\/CARDS_\d+\.PNG/i.test(event.request.url)) { //缓存卡片图
					let regRes = /cards_(ja|en|ko)/i.exec(event.request.url);
					let langCode = regRes[1];
					console.debug("缓存Cards-" + langCode, event.request.url);
					const cache = await caches.open(CACHES.get("cards_" + langCode));
					cache.put(event.request, response.clone());
				} else if (/sound\/voice\/\w+\/padv\d+.wav/i.test(event.request.url)) { //缓存音效
					let regRes = /\/(ja|en|ko)\//i.exec(event.request.url);
					let langCode = regRes[1];
					console.debug("缓存Voice-" + langCode, event.request.url);
					const cache = await caches.open(CACHES.get("voice_" + langCode));
					cache.put(event.request, response.clone());
				}
				return response;
			});
		})
	);
});