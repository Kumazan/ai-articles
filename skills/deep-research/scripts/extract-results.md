# Extract Results Scripts — Deep Research

## Gemini：複製研究報告

### 點擊「複製內容」按鈕（JavaScript evaluate）
```javascript
// 找到「複製內容」按鈕並點擊
(function(){
  var btn = Array.from(document.querySelectorAll("button")).find(function(b){
    return b.textContent.trim() === "複製內容";
  });
  if(btn){ btn.click(); return "clicked!"; }
  return "not found";
})()
```

用法：
```bash
openclaw browser evaluate --fn '<上方 JS>'
```

---

## pbpaste 讀取剪貼簿（macOS）

```python
import subprocess
result = subprocess.run(['pbpaste'], capture_output=True)
text = result.stdout.decode('utf-8', errors='replace')
print(text[:500])  # 先確認內容
```

用法（exec）：
```bash
python3 -c "
import subprocess
result = subprocess.run(['pbpaste'], capture_output=True)
print(result.stdout.decode('utf-8', errors='replace'))
"
```

---

## Claude：點開 Artifact 卡片並複製

### Step 1：點開 Document Artifact 卡片
```javascript
// 找到 Document artifact 卡片並點擊
(function(){
  var divs = document.querySelectorAll("div");
  var card = Array.from(divs).find(function(el){
    return el.children.length < 5 &&
           el.textContent.includes("Document") &&
           el.textContent.length < 200;
  });
  if(card){ card.click(); return "clicked card"; }
  return "not found";
})()
```

### Step 2：找 Copy 按鈕 ref
```bash
openclaw browser snapshot --efficient | grep -E "Copy|Close artifact"
# 範例輸出：Copy = e43, Copy options = e44
```

### Step 3：點 Copy（非 Copy options）
```bash
openclaw browser click <Copy-ref>
```

### Step 4：讀取剪貼簿
```bash
python3 -c "
import subprocess
result = subprocess.run(['pbpaste'], capture_output=True)
print(result.stdout.decode('utf-8', errors='replace'))
"
```
