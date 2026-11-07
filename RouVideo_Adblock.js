// RouVideo Loon HTML response filter v1.1.0
// Page cleanup adapted from luestr/userscripts rou_video_adblock.user.js (v1.2.0).
// Runs in Loon, injects a browser script only into HTML documents.
(function () {
  const body = $response.body;
  if (typeof body !== 'string' || !/<html[\s>]/i.test(body) || !/<head(?:\s[^>]*)?>/i.test(body)) return $done({});
  const pageScript = function () {
    if (window.__rouLoonBlock) return;
    window.__rouLoonBlock = true;
    const style = document.createElement('style');
    style.id = 'rou-loon-adblock';
    style.textContent = '[data-cl-spot],ins[data-zoneid],[id^="ts_ad_"],#exo-ad-provider,#player-container,img[src*="/wm:0/"],img[alt="rou.video-banner"],a[href*="/api/hop/"],div:has(> a[href*="/api/hop/"]),iframe[src*="realsrv"],iframe[src*="magsrv"],iframe[src*="tsyndicate"],iframe[src*="clickadu"]{display:none!important}';
    (document.head || document.documentElement).appendChild(style);
    let pending = false;
    function clean() {
      pending = false;
      document.querySelectorAll('a[href*="/api/hop/"]').forEach(function (a) {
        const dialog = a.closest('[role="dialog"]');
        if (dialog) {
          const close = dialog.querySelector('[data-slot="dialog-close"]');
          if (close) close.click();
        }
        const parent = a.parentElement;
        a.remove();
        if (parent && parent !== document.body && !parent.children.length && !parent.textContent.trim()) parent.remove();
      });
      document.querySelectorAll('[data-cl-spot],ins[data-zoneid],[id^="ts_ad_"],#exo-ad-provider,#player-container,img[src*="/wm:0/"],img[alt="rou.video-banner"],iframe[src*="realsrv"],iframe[src*="magsrv"],iframe[src*="tsyndicate"],iframe[src*="clickadu"]').forEach(function (el) { el.remove(); });
      document.querySelectorAll('.rv-player button').forEach(function (b) { if (/跳過廣告|跳过广告/.test(b.textContent)) b.click(); });
      document.querySelectorAll('.rv-player > video:not(.rv-player-video)').forEach(function (v) {
        if ((v.currentSrc || v.src) && v.style.display !== 'none') {
          v.muted = true; try { v.pause(); v.dispatchEvent(new Event('ended')); } catch (_) {}
        }
      });
    }
    function schedule() { if (!pending) { pending = true; setTimeout(clean, 60); } }
    function start() {
      if (document.documentElement) new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
      document.addEventListener('play', schedule, true);
      schedule();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
    else start();
  };
  const injected = '<script>(' + pageScript.toString() + ')();<\/script>';
  $done({body: body.replace(/<head(?:\s[^>]*)?>/i, function (tag) { return tag + injected; })});
})();
