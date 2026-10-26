/*
 * AvPlay 广告配置清理器
 * 仅修改含 homeLink / urls / ads 特征的 AvPlay 配置 JSON。
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

    const walk = (value) => {
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      if (!value || typeof value !== "object") return;

      // AppConfigData 的字段结构来自 AvPlay 1.9.1：homeLink、version、urls、ads。
      const isAvPlayConfig = Array.isArray(value.ads) &&
        (Object.prototype.hasOwnProperty.call(value, "homeLink") ||
         Object.prototype.hasOwnProperty.call(value, "urls") ||
         Object.prototype.hasOwnProperty.call(value, "version"));

      if (isAvPlayConfig) {
        value.ads = [];
        if (Object.prototype.hasOwnProperty.call(value, "adIds")) value.adIds = {};
        if (Array.isArray(value.placements)) value.placements = [];
        changed = true;
      }

      Object.keys(value).forEach((key) => walk(value[key]));
    };

    walk(payload);
    $done(changed ? { body: JSON.stringify(payload) } : {});
  } catch (_) {
    $done({});
  }
}
