// background.js - Service Worker
// 路由 iframe → content script 的訊息
// 自動 POST 報告到 OpenClaw /hooks/agent

const OPENCLAW_GATEWAY = 'http://localhost:18789';
const OPENCLAW_HOOKS_TOKEN = 'dr-extractor-2026';
const OPENCLAW_DISCORD_CHANNEL = '1488030449123983360'; // #深度研究 channel

// 儲存最新的報告與 context
let latestReport = null;
let currentDiscordThreadId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // content.js 設定當前 Discord thread ID（從 URL 或 storage 取得）
  if (msg.type === 'SET_THREAD_CONTEXT') {
    currentDiscordThreadId = msg.threadId;
    sendResponse({ ok: true });
    return true;
  }

  // iframe_reader.js 傳來的報告
  if (msg.type === 'DEEP_RESEARCH_REPORT') {
    latestReport = {
      text: msg.text,
      url: msg.url,
      timestamp: msg.timestamp,
      tabId: sender.tab?.id
    };

    console.log('[DR Extractor] Received report, length:', msg.text.length);

    // 通知 content.js 報告已就緒
    chrome.tabs.query({ url: 'https://chatgpt.com/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'REPORT_READY',
          length: msg.text.length
        });
      });
    });

    // 自動發送到 OpenClaw
    sendToOpenClaw(msg.text, msg.url).then(result => {
      console.log('[DR Extractor] Sent to OpenClaw:', result);
    }).catch(e => {
      console.warn('[DR Extractor] OpenClaw send failed:', e.message);
    });

    sendResponse({ success: true });
    return true;
  }

  // content.js 手動請求讀取報告（按按鈕時）
  if (msg.type === 'GET_REPORT') {
    if (latestReport) {
      sendResponse({ success: true, text: latestReport.text });
    } else {
      // 嘗試主動觸發 iframe 讀取
      chrome.tabs.query({
        url: 'https://connector_openai_deep_research.web-sandbox.oaiusercontent.com/*'
      }, (tabs) => {
        if (tabs.length > 0) {
          // iframe 是 tab 型，可以直接 sendMessage
          chrome.tabs.sendMessage(tabs[0].id, { type: 'READ_IFRAME' }, (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({ success: false, error: 'iframe not ready' });
              return;
            }
            if (response?.success && response.text) {
              latestReport = { text: response.text, timestamp: Date.now() };
              sendResponse({ success: true, text: response.text });
              // 也自動發送到 OpenClaw
              sendToOpenClaw(response.text, '').catch(() => {});
            } else {
              sendResponse({ success: false, error: 'Report not ready' });
            }
          });
        } else {
          sendResponse({ success: false, error: 'No iframe tab found' });
        }
      });
    }
    return true; // async
  }

  if (msg.type === 'CLEAR_REPORT') {
    latestReport = null;
    sendResponse({ success: true });
    return true;
  }
});

async function sendToOpenClaw(reportText, sourceUrl) {
  // 取得當前 ChatGPT 對話的 tab 資訊
  const chatTabs = await chrome.tabs.query({ url: 'https://chatgpt.com/c/*' });
  const chatUrl = chatTabs[0]?.url || sourceUrl || '';
  const chatTitle = chatTabs[0]?.title || 'Deep Research 報告';

  // 構建發送給 isolated agent 的 prompt
  const prompt = `以下是剛完成的 ChatGPT Deep Research 報告。
請直接輸出這份報告的整理摘要，格式如下：

1. 標題（5字以內）
2. 執行摘要（2-3句）
3. 民調數據（如有，用表格）
4. 核心結論（3-5點）

原始報告連結：${chatUrl}

---報告全文---
${reportText.slice(0, 8000)}
${reportText.length > 8000 ? '\n（報告較長，已截取前 8000 字）' : ''}`;

  const payload = {
    message: prompt,
    name: 'ChatGPT Deep Research',
    agentId: 'main',
    wakeMode: 'now',
    deliver: true,
    channel: 'discord',
    to: OPENCLAW_DISCORD_CHANNEL
  };

  const response = await fetch(`${OPENCLAW_GATEWAY}/hooks/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENCLAW_HOOKS_TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HTTP ${response.status}: ${err}`);
  }

  return response.json();
}
