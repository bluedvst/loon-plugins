/* AvPlay 1.9.1 / v1.5.0: HAR-confirmed configuration endpoint only. */
(function () {
  if (!/^https:\/\/www\.javrocket\.top\/avplayground_config\.json(?:\?|$)/.test($request.url)) {
    $done({}); return;
  }
  if (typeof $response === "undefined") {
    const headers = Object.assign({}, $request.headers);
    Object.keys(headers).forEach(function (key) {
      if (/^(if-none-match|if-modified-since|cache-control|pragma)$/i.test(key)) delete headers[key];
    });
    headers["Cache-Control"] = "no-cache";
    $done({ headers: headers }); return;
  }
  try {
    const config = JSON.parse($response.body);
    if (!config.ads || typeof config.ads !== "object" || Array.isArray(config.ads)) {
      $done({}); return;
    }
    config.ads.data = [];
    const placements = config.ads.placements;
    if (placements && typeof placements === "object") {
      Object.keys(placements).forEach(function (key) {
        if (placements[key] && typeof placements[key] === "object") placements[key].adIds = [];
      });
    }
    console.log("[AvPlay AdClean 1.5.0] cleared ad data and placement IDs");
    $done({ body: JSON.stringify(config) });
  } catch (error) {
    console.log("[AvPlay AdClean 1.5.0] configuration unchanged: " + String(error));
    $done({});
  }
})();
