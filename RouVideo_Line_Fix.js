// RouVideo: close unusually thin Radix dialog remnants (no data collection).
(function () {
  var body = $response.body;
  if (typeof body !== 'string' || !/<html[\s>]/i.test(body) || !/<head(?:\s[^>]*)?>/i.test(body)) return $done({});
  function install() {
    if (window.__rouLineFix) return;
    window.__rouLineFix = true;
    var pending = false;
    function scan() {
      pending = false;
      document.querySelectorAll('div[id^="radix-"].bg-background').forEach(function (el) {
        if (el.dataset.rouLineFixed) return;
        var rect = el.getBoundingClientRect();
        if (rect.width < innerWidth * 0.45 || rect.height <= 0 || rect.height > 4) return;
        el.dataset.rouLineFixed = '1';
        var close = el.querySelector('[data-slot="dialog-close"],button[aria-label="Close"],button[aria-label="关闭"],button[aria-label="關閉"]');
        if (close) { close.click(); }
        else { el.style.setProperty('display', 'none', 'important'); }
      });
    }
    function schedule() { if (!pending) { pending = true; requestAnimationFrame(scan); } }
    new MutationObserver(schedule).observe(document, {childList:true, subtree:true, attributes:true});
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
    window.addEventListener('resize', schedule);
    schedule();
  }
  var snippet = '<script>(' + install.toString() + ')();<\/script>';
  $done({body:body.replace(/<head(?:\s[^>]*)?>/i, function (h) { return h + snippet; })});
})();
