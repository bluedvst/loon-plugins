/*
 * AvPlay 广告配置清理器
 * 仅清理 JSON 中的广告位、横幅位和应用推荐位。
 */
const body = $response.body;
const headers = $response.headers || {};
const contentType = String(headers["Content-Type"] || headers["content-type"] || "").toLowerCase();

if (!body || (!contentType.includes("json") && !/^[\s\r\n]*[\[{]/.test(body))) {
  $done({});
} else {
  try {
    const payload = JSON.parse(body);
    let changed = false;

    const clearSlot = (container, key) => {
      if (!Object.prototype.hasOwnProperty.call(container, key)) return;
      const current = container[key];
      if (Array.isArray(current)) container[key] = [];
      else if (current && typeof current === "object") container[key] = {};
      else container[key] = null;
      changed = true;
    };

    const walk = (value) => {
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      if (!value || typeof value !== "object") return;

      // 广告数据有时被包在 data / payload 等下一层，不能假定字段一定同层。
      ["ads", "adIds", "placements", "banners", "appAdBanner", "appRecommendations"].forEach(
        (key) => clearSlot(value, key)
      );

      Object.keys(value).forEach((key) => walk(value[key]));
    };

    walk(payload);
    if (changed && typeof console !== "undefined") {
      console.log(`[AvPlay AdClean] cleaned: ${(typeof $request !== "undefined" && $request.url) || "response"}`);
    }
    $done(changed ? { body: JSON.stringify(payload) } : {});
  } catch (_) {
    $done({});
  }
}
