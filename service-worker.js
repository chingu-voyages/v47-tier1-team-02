const APP_PREFIX = 'ApplicationName_'     // Identifier for this website
const VERSION = 'version_01'              // Version of the off-line cache
const CACHE_NAME = APP_PREFIX + VERSION
const URLS = ['/v47-tier1-team-02/',
  '/v47-tier1-team-02/index.html',
  '/v47-tier1-team-02/main.js',
  '/v47-tier1-team-02/style.css'
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
      console.log('installing cache : ' + CACHE_NAME)
      e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS)));
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under chingu-voyages.github.io
      // filter out ones that has this wesbite prefix to create white list
      const cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})
