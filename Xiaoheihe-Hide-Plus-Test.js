// 小黑盒隐藏加号实验：仅修改已存在的 post_tab；其作用尚需设备验证。
try {
  const data = JSON.parse($response.body);
  const result = data && data.result;
  let changed = false;
  if (result && typeof result === 'object') {
    if (Object.prototype.hasOwnProperty.call(result, 'post_tab')) {
      result.post_tab = 0;
      changed = true;
    }
    if (typeof result.tips_data === 'string') {
      try {
        const nested = JSON.parse(result.tips_data);
        if (nested && typeof nested === 'object' && Object.prototype.hasOwnProperty.call(nested, 'post_tab')) {
          nested.post_tab = 0;
          result.tips_data = JSON.stringify(nested);
          changed = true;
        }
      } catch (e) { console.log('[小黑盒] tips_data 解析失败: ' + e); }
    }
  }
  console.log('[小黑盒] post_tab 测试处理: ' + (changed ? '已更新' : '未找到字段'));
  $done(changed ? {body: JSON.stringify(data)} : {});
} catch (e) {
  console.log('[小黑盒] 响应处理失败: ' + e);
  $done({});
}
