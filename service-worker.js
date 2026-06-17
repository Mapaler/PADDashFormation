"use strict";
const cacheName = 'PDDF-v1';
importScripts('./caches-map.js'); // 引入独立文件，cachesMap 变量即可用

// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function (event) {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
    event.waitUntil(activateHandler());
});

async function activateHandler() {
    console.debug("Service Worker activate");
    const baseUrl = new URL(".", location);
    const baseUrlString = baseUrl.origin + baseUrl.pathname;

    // 1. 立即控制所有客户端
    await self.clients.claim();

    // 2. 获取所有缓存分类名
    const keyList = await caches.keys();

    // 3. 遍历处理每一个缓存分类
    for (const key of keyList) {
        if (cacheName !== key) {
            // 如果缓存分类名不匹配，直接删除
            console.debug("未检测到该缓存分类，删除", key);
            await caches.delete(key);
            continue;
        }

        // 4. 处理当前缓存分类 (cacheName === key)
        const cache = await caches.open(key);
        const requests = await cache.keys();
        console.debug("检测已有缓存分类", key);

        for (const request of requests) {
            const url = new URL(request.url);
            const relativePath = (url.origin + url.pathname).replace(baseUrlString, "");
            const oldVersion = url.searchParams.get("v");
            const newVersion = cachesMap.get(relativePath);

            // 如果缓存中的版本与新的版本不匹配，删除该缓存
            if (newVersion && newVersion !== oldVersion) {
                console.debug("删除版本不匹配的缓存", request);
                await cache.delete(request);
            }
        }
    }
}

self.addEventListener('fetch', function(event) {
	const url = new URL(event.request.url);
	url.search = "";
	const baseUrl = new URL(".", location);
	const baseUrlString = baseUrl.origin + baseUrl.pathname;
	const relativePath = (url.origin + url.pathname).replace(baseUrlString, "");
	const newVersion = cachesMap.get(relativePath);
	
	if (newVersion) {
		url.searchParams.set("v", newVersion);
	}

	event.respondWith(
		(async function() {
			// 1. 先尝试从缓存匹配（精确匹配，带 version）
			let cachedResponse = null;
			if (newVersion) {
				cachedResponse = await caches.match(url, {ignoreSearch: false});
				if (cachedResponse) {
					console.debug("✅ 缓存命中（精确）:", relativePath);
					// 返回缓存，同时后台刷新
					refreshCacheInBackground(event.request, url);
					return cachedResponse;
				}
			}
			
			// 2. 精确匹配失败，尝试忽略 search 参数匹配（兜底）
			cachedResponse = await caches.match(url, {ignoreSearch: true});
			if (cachedResponse) {
				console.debug("✅ 缓存命中（忽略参数）:", relativePath);
				refreshCacheInBackground(event.request, url);
				return cachedResponse;
			}
			
			// 3. 缓存完全未命中，发起网络请求（带重试）
			try {
				console.debug("🌐 发起网络请求（带重试）:", relativePath);
				const networkResponse = await fetchWithRetry(event.request);
				
				// 存入缓存
				const responseForCache = networkResponse.clone();
				caches.open(cacheName).then(cache => {
					const cacheUrl = new URL(event.request.url);
					if (newVersion) {
						cacheUrl.searchParams.set("v", newVersion);
					}
					cache.put(cacheUrl, responseForCache);
					console.debug("💾 缓存已保存:", relativePath);
				});
				
				return networkResponse;
			} catch (error) {
				console.error("❌ 所有网络请求失败:", error.message);
				
				// 最后的兜底：尝试返回任何可用的缓存（即使不匹配）
				const anyCache = await caches.match(url, {ignoreSearch: true});
				if (anyCache) {
					console.debug("⚠️ 返回不匹配的缓存作为降级方案");
					return anyCache;
				}
				
				// 实在没有，返回友好的错误提示
				return new Response(
					`资源加载失败，请刷新重试\n${error.message}`,
					{ status: 503, statusText: "Service Unavailable" }
				);
			}
		})()
	);
});

// 后台刷新缓存（不阻塞当前响应）
function refreshCacheInBackground(request, url) {
	// 不 await，让它在后台执行
	fetchWithRetry(request).then(response => {
		if (response && response.ok) {
			const responseForCache = response.clone();
			caches.open(cacheName).then(cache => {
				cache.put(url, responseForCache);
				console.debug("🔄 后台缓存已更新:", url.pathname);
			});
		}
	}).catch(err => {
		// 后台刷新失败不影响当前页面
		console.debug("ℹ️ 后台刷新失败（不影响使用）:", err.message);
	});
}

// 重试函数：只在失败时重试，不设超时
// 重试函数：带超时控制，只在失败时重试
async function fetchWithRetry(request, maxRetries = 3, timeoutMs = 60000) {
	let lastError = null;
	
	for (let i = 0; i < maxRetries; i++) {
		let controller = null;
		let timeoutId = null;
		
		try {
			// 创建 AbortController 用于超时控制
			controller = new AbortController();
			timeoutId = setTimeout(() => {
				controller.abort();
			}, timeoutMs);
			
			// 发起请求，带上 signal
			const response = await fetch(request, { signal: controller.signal });
			
			// 清除超时定时器
			clearTimeout(timeoutId);
			
			// 2xx 或 3xx 直接返回
			if (response.ok || (response.status >= 300 && response.status < 400)) {
				return response;
			}
			
			// 4xx 客户端错误，重试无意义
			if (response.status >= 400 && response.status < 500) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
			// 5xx 服务器错误，可以重试
			lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
			console.warn(`⚠️ 请求返回 ${response.status}，第 ${i+1}/${maxRetries} 次重试`);
			
		} catch (error) {
			// 清除超时定时器
			if (timeoutId) clearTimeout(timeoutId);
			
			// 判断是否是超时导致的 abort
			if (error.name === 'AbortError') {
				lastError = new Error(`请求超时 (${timeoutMs}ms)`);
				console.warn(`⚠️ 请求超时，第 ${i+1}/${maxRetries} 次重试`);
			} else {
				// 网络层面的错误（连接失败、DNS错误等）
				lastError = error;
				console.warn(`⚠️ 网络错误，第 ${i+1}/${maxRetries} 次重试:`, error.message);
			}
		}
		
		// 如果不是最后一次重试，等待后继续
		if (i < maxRetries - 1) {
			// 退避延迟：1秒、2秒、4秒...
			const delay = 1000 * Math.pow(2, i);
			console.debug(`⏳ 等待 ${delay}ms 后重试...`);
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}
	
	throw lastError || new Error(`请求失败: ${request.url}`);
}