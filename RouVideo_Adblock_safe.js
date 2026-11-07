// RouVideo conservative cosmetic filter v1.2.0
// Only hides ad links and their ad images; never modifies the player or requests.
(function () {
  var body = $response.body;
  if (typeof body !== 'string' || !/<html[\s>]/i.test(body) || !/<head(?:\s[^>]*)?>/i.test(body)) return $done({});
  var css = '<style id="rou-loon-adblock-safe">a[href^="/api/hop/"],a[href^="https://rouvmo.com/api/hop/"],a[href^="https://rou.video/api/hop/"],a[href^="https://roumanw.com/api/hop/"]{display:none!important}</style>';
  $done({body:body.replace(/<head(?:\s[^>]*)?>/i, function (tag) {return tag + css;})});
})();
