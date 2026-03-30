// iframe_reader.js
// 注入到 connector_openai_deep_research iframe 裡
// 讀取報告內容並傳回給 background

(function() {
  'use strict';

  // 等待報告內容載入
  function getReportText() {
    const body = document.body;
    if (!body) return null;
    
    const text = body.innerText;
    // 確認是有內容的報告（不是 loading 狀態）
    if (!text || text.length < 200) return null;
    
    // 清理 ChatGPT 的 entity/cite 標記
    return text
      .replace(/\?entity\?\[.*?\]\?/g, '')
      .replace(/\?cite\?[a-z0-9?]+/g, '')
      .trim();
  }

  // 嘗試取得 Markdown 格式（如果頁面有 pre/code 區塊）
  function getReportMarkdown() {
    // ChatGPT Deep Research 報告本身是 Markdown 格式
    // 直接用 innerText 就差不多了
    return getReportText();
  }

  // 等待頁面載入完成後嗅探
  let attempts = 0;
  const MAX_ATTEMPTS = 30;
  const INTERVAL = 2000;

  function tryRead() {
    attempts++;
    const text = getReportMarkdown();
    
    if (text && text.length > 500) {
      // 成功讀到報告，傳給 background
      chrome.runtime.sendMessage({
        type: 'DEEP_RESEARCH_REPORT',
        text: text,
        url: window.location.href,
        timestamp: Date.now()
      });
      return; // 完成，不再 retry
    }
    
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(tryRead, INTERVAL);
    }
  }

  // 監聽 background 的讀取請求
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'READ_IFRAME') {
      const text = getReportMarkdown();
      sendResponse({ 
        success: !!text && text.length > 200,
        text: text || '',
        length: (text || '').length
      });
      return true; // async response
    }
  });

  // 自動嘗試讀取
  // 給頁面一點時間載入
  setTimeout(tryRead, 3000);
})();
