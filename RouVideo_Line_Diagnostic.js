// RouVideo line diagnostic v1.0.0. No data is uploaded.
(function () {
  var body = $response.body;
  if (typeof body !== 'string' || !/<html[\s>]/i.test(body) || !/<head(?:\s[^>]*)?>/i.test(body)) return $done({});
  function diagnostic() {
    if (window.__rouLineDiagnostic) return;
    window.__rouLineDiagnostic = true;
    function mount() {
      if (!document.body || document.getElementById('rou-line-diagnostic')) return;
      var box = document.createElement('div');
      box.id = 'rou-line-diagnostic';
      box.style.cssText = 'position:fixed;z-index:2147483647;left:8px;top:90px;max-width:94vw;background:#101820;color:#fff;padding:8px;border:2px solid #0ff;border-radius:8px;font:12px/1.35 monospace;white-space:pre-wrap;max-height:42vh;overflow:auto';
      box.textContent = '横线检查：点击这里扫描';
      box.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var out = [], nodes = document.querySelectorAll('body *'), vw = innerWidth, vh = innerHeight;
        for (var i = 0; i < nodes.length && out.length < 12; i++) {
          var el = nodes[i]; if (el === box || box.contains(el)) continue;
          var r = el.getBoundingClientRect(), st = getComputedStyle(el);
          if (r.width < vw * 0.45 || r.height < 1 || r.height > 14 || r.top < vh * 0.2 || r.top > vh * 0.8 || st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) continue;
          var name = el.tagName.toLowerCase() + (el.id ? '#' + el.id.slice(0, 28) : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
          out.push(name.slice(0, 65) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + ' y=' + Math.round(r.top) + ' ' + st.position);
        }
        box.textContent = '横线检查（再次点击可重扫）\n视口 ' + Math.round(vw) + 'x' + Math.round(vh) + '\n' + (out.length ? out.join('\n') : '未找到符合尺寸的网页元素；可能是伪元素、iframe 或原生视图。');
      }, true);
      document.body.appendChild(box);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
  }
  var snippet = '<script>(' + diagnostic.toString() + ')();<\/script>';
  $done({body:body.replace(/<head(?:\s[^>]*)?>/i, function (h) {return h + snippet;})});
})();
