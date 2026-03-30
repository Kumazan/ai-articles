// content.js
// 注入到 chatgpt.com 頁面
// 加入浮動按鈕，讓使用者一鍵複製 Deep Research 報告

(function() {
  'use strict';
  
  let btnContainer = null;
  let isVisible = false;

  // 建立浮動按鈕 UI
  function createButton() {
    if (btnContainer) return;
    
    btnContainer = document.createElement('div');
    btnContainer.id = 'dr-extractor-btn';
    btnContainer.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 999999;
      display: none;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    `;
    
    // 主按鈕
    const mainBtn = document.createElement('button');
    mainBtn.id = 'dr-copy-btn';
    mainBtn.innerHTML = '📋 複製研究報告';
    mainBtn.style.cssText = `
      background: #10a37f;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      transition: all 0.2s;
      white-space: nowrap;
    `;
    mainBtn.addEventListener('mouseover', () => mainBtn.style.transform = 'scale(1.05)');
    mainBtn.addEventListener('mouseout', () => mainBtn.style.transform = 'scale(1)');
    mainBtn.addEventListener('click', copyReport);
    
    // 狀態提示
    const statusDiv = document.createElement('div');
    statusDiv.id = 'dr-status';
    statusDiv.style.cssText = `
      background: rgba(0,0,0,0.7);
      color: white;
      border-radius: 12px;
      padding: 6px 12px;
      font-size: 12px;
      display: none;
    `;
    
    btnContainer.appendChild(statusDiv);
    btnContainer.appendChild(mainBtn);
    document.body.appendChild(btnContainer);
  }

  function showButton() {
    if (!btnContainer) createButton();
    btnContainer.style.display = 'flex';
    isVisible = true;
  }
  
  function hideButton() {
    if (btnContainer) btnContainer.style.display = 'none';
    isVisible = false;
  }
  
  function showStatus(msg, color = '#10a37f') {
    const status = document.getElementById('dr-status');
    if (!status) return;
    status.textContent = msg;
    status.style.background = color;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 3000);
  }

  async function copyReport() {
    const btn = document.getElementById('dr-copy-btn');
    if (btn) {
      btn.innerHTML = '⏳ 讀取中...';
      btn.disabled = true;
    }
    
    try {
      // 請 background 提供報告
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'GET_REPORT' }, resolve);
      });
      
      if (response?.success && response.text) {
        // 複製到剪貼簿
        await navigator.clipboard.writeText(response.text);
        showStatus(`✅ 已複製！共 ${response.text.length} 字`, '#10a37f');
        if (btn) btn.innerHTML = '✅ 已複製！';
        setTimeout(() => {
          if (btn) btn.innerHTML = '📋 複製研究報告';
        }, 3000);
      } else {
        showStatus('❌ 報告尚未就緒', '#e53e3e');
        if (btn) btn.innerHTML = '📋 複製研究報告';
      }
    } catch (err) {
      showStatus('❌ 錯誤：' + err.message, '#e53e3e');
      if (btn) btn.innerHTML = '📋 複製研究報告';
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // 偵測頁面是否有 Deep Research iframe
  function checkForDeepResearch() {
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      if (iframe.src && iframe.src.includes('connector_openai_deep_research')) {
        // 有 Deep Research iframe，顯示按鈕
        if (!isVisible) {
          showButton();
        }
        return true;
      }
    }
    // 沒有 iframe，隱藏按鈕
    if (isVisible) hideButton();
    return false;
  }

  // 監聽 background 傳來的「報告已就緒」
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'REPORT_READY') {
      showStatus(`📥 報告已就緒（${msg.length} 字）`, '#10a37f');
    }
  });

  // 定期檢查（也監聽 DOM 變化）
  const observer = new MutationObserver(() => {
    checkForDeepResearch();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 初始檢查
  checkForDeepResearch();
  
  // 每 5 秒補充檢查一次
  setInterval(checkForDeepResearch, 5000);
  
})();
