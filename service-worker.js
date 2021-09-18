const CACHES = new Map([
	['program', 'program-cache-v1'],
	['data', 'data-cache-v1'],
	['document', 'document-cache-v1'],
	['font', 'font-cache-v1'],
	['cards_ja', 'card_ja-cache-v1'],
	['cards_en', 'card_en-cache-v1'],
	['cards_ko', 'card_ko-cache-v1'],
	['voice_ja', 'voice_ja-cache-v1'],
	['voice_en', 'voice_en-cache-v1'],
	['voice_ko', 'voice_ko-cache-v1'],
]);

self.addEventListener('install', function(event) {
	console.debug("Service Worker 安装中");
	const preCache = () => {
		return Promise.all([
			cache.open(CACHES.get("font")).then(function(cache) {
				return cache.addAll([
					'fonts/fa-solid-900.woff2',
					'fonts/FOT-KurokaneStd-EB.woff2',
					'fonts/zpix.woff2',
				]);
			}),
			cache.open(CACHES.get("library")).then(function(cache) {
				return cache.addAll([
					'library/html2canvas.min.js',
					'library/zxing.umd.min.js',
					'library/jy4340132-aaa/adpcm.js',
					'library/jy4340132-aaa/adpcm.wasm',
					'library/jy4340132-aaa/pcm_player.js',
					'library/jy4340132-aaa/std.js',
				]);
			}),
		]);
	};
	event.waitUntil(preCache());
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
			const url = new URL(event.request.url);
			const path = url.pathname;
			if (/\.json$/i.test(path)) { //json数据优先通过网络获取
				return fetch(event.request).then(async function(response) {
					console.debug("缓存数据", url);
					const cache = await caches.open(CACHES.get("data"));
					cache.put(url.origin + path, response.clone());
					return response;
				}).catch((err)=>resp);
			} else { //其他的优先使用缓存
				if (resp) console.debug("找到缓存", event.request.url);
				return resp || fetch(event.request).then(async function(response) {
					//console.debug("正则测试",/images\/cards\w+\/CARDS_\d+\.PNG/i.test(event.request.url));
					if (/\.(html|js|css|wasm)$/i.test(path) ||
						/\/images\/[\w\-]+\.(png|svg)/i.test(path)) { //缓存程序
						console.debug("缓存程序", url);
						const cache = await caches.open(CACHES.get("program"));
						cache.put(event.request, response.clone());
					} else if (/\/doc\//i.test(path)) { //缓存文档
						console.debug("缓存文档", url);
						const cache = await caches.open(CACHES.get("document"));
						cache.put(event.request, response.clone());
					} else if (/\.woff2$/i.test(path)) { //缓存字体
						console.debug("缓存字体", url);
						const cache = await caches.open(CACHES.get("font"));
						cache.put(event.request, response.clone());
					} else if (/images\/cards_\w+\/CARDS_\d+\.PNG/i.test(path)) { //缓存卡片图
						let regRes = /cards_(\w+)/i.exec(path);
						let langCode = regRes[1];
						console.debug("缓存Cards-" + langCode, url);
						const cache = await caches.open(CACHES.get("cards_" + langCode));
						cache.put(event.request, response.clone());
					} else if (/sound\/voice\/\w+\/padv\d+.wav/i.test(path)) { //缓存音效
						let regRes = /\/(\w+)\//i.exec(path);
						let langCode = regRes[1];
						console.debug("缓存Voice-" + langCode, url);
						const cache = await caches.open(CACHES.get("voice_" + langCode));
						cache.put(event.request, response.clone());
					}
					return response;
				});
			}
		})
	);
});