// background.js - Service Worker
// 路由 iframe → content script 的訊息
// 可選：傳送到 OpenClaw local server

const OPENCLAW_ENDPOINT = 'http://localhost:19999/deep-research-report';

// 儲存最新的報告
let latestReport = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  
  // iframe_reader.js 傳來的報告
  if (msg.type === 'DEEP_RESEARCH_REPORT') {
    latestReport = {
      text: msg.text,
      url: msg.url,
      timestamp: msg.timestamp,
      tabId: sender.tab?.id
    };
    
    console.log('[DR Extractor] Received report from iframe, length:', msg.text.length);
    
    // 通知 content.js 報告已準備好
    if (sender.tab?.id) {
      // 找到父 tab（chatgpt.com）
      chrome.tabs.query({ url: 'https://chatgpt.com/*' }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'REPORT_READY',
            length: msg.text.length
          });
        });
      });
    }
    
    // 可選：傳送到 OpenClaw
    sendToOpenClaw(msg.text).catch(e => {
      // OpenClaw server 沒跑也沒關係，靜默失敗
      console.log('[DR Extractor] OpenClaw not available:', e.message);
    });
    
    sendResponse({ success: true });
    return true;
  }
  
  // content.js 請求讀取報告
  if (msg.type === 'GET_REPORT') {
    if (latestReport) {
      sendResponse({ success: true, text: latestReport.text });
    } else {
      // 嘗試主動觸發 iframe 讀取
      chrome.tabs.query({ url: 'https://connector_openai_deep_research.web-sandbox.oaiusercontent.com/*' }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'READ_IFRAME' }, (response) => {
            if (response?.success) {
              latestReport = { text: response.text, timestamp: Date.now() };
              sendResponse({ success: true, text: response.text });
            } else {
              sendResponse({ success: false, error: 'Report not ready yet' });
            }
          });
        } else {
          sendResponse({ success: false, error: 'No iframe tab found' });
        }
      });
    }
    return true; // async
  }
  
  // 清除儲存的報告
  if (msg.type === 'CLEAR_REPORT') {
    latestReport = null;
    sendResponse({ success: true });
    return true;
  }
});

async function sendToOpenClaw(text) {
  const response = await fetch(OPENCLAW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      report: text,
      timestamp: Date.now(),
      source: 'chatgpt-deep-research'
    })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
