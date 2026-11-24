const CACHE='mimikara-v2';  // 2026-11-24 録音した声(audio/zh/)を足した
const ASSETS=['./','./index.html','./mimikara-chinese-trainer.html','./mimikara-chinese-textbook.html','./mimikara-word-dojo.html','./icon-192.png','./icon-512.png','./icon-180.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
      try{
        const url=new URL(e.request.url);
        const cacheable=url.origin===self.location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(url.host);
        if(cacheable&&res.ok){const cl=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));}
      }catch(err){}
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
