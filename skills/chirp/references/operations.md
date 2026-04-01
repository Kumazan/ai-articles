# Chirp — Twitter 操作詳細步驟

> **重要**：每次操作前必須先 snapshot，ref 值每次不同，不可重用舊值。
> 使用 `compact=true` 節省 token。

---

## 1. 讀 Timeline

```
browser action=open profile=openclaw targetUrl="https://x.com/home"
browser action=snapshot profile=openclaw compact=true
```

每個 article 包含：作者、內容、按讚/轉推/回覆數。

---

## 2. 發文

**Step 1：打開首頁，取得輸入框 ref**
```
browser action=open profile=openclaw targetUrl="https://x.com/home"
browser action=snapshot profile=openclaw compact=true
```
→ 找 `textbox "Post text"` 的 ref

**Step 2：輸入內容**
```
browser action=act profile=openclaw request={"kind":"click","ref":"<textbox-ref>"}
browser action=act profile=openclaw request={"kind":"type","ref":"<textbox-ref>","text":"推文內容"}
```

**Step 3：送出**
```
browser action=snapshot profile=openclaw compact=true
```
→ 找 `button "Post"` 的 ref（確認非 disabled）
```
browser action=act profile=openclaw request={"kind":"click","ref":"<post-ref>"}
```

> ⚠️ **務必先讓使用者確認內容再送出。**

---

## 3. 按讚

在 timeline 或推文頁面找 `button "Like"` 或 `button "X Likes. Like"` 的 ref：
```
browser action=act profile=openclaw request={"kind":"click","ref":"<like-ref>"}
```

---

## 4. 轉推

```
browser action=snapshot profile=openclaw compact=true
```
→ 找 `button "Repost"` 或 `button "X reposts. Repost"` 的 ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<repost-ref>"}
browser action=snapshot profile=openclaw compact=true
```
→ 找彈出選單中 `"Repost"` 選項的 ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<repost-option-ref>"}
```

---

## 5. 回覆

### 方法 A：從 Timeline

```
browser action=snapshot profile=openclaw compact=true
```
→ 找推文的 `button "Reply"` ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<reply-button-ref>"}
browser action=snapshot profile=openclaw compact=true
```
→ 找對話框中 `textbox "Post text"` 的 ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<reply-textbox-ref>"}
browser action=act profile=openclaw request={"kind":"type","ref":"<reply-textbox-ref>","text":"回覆內容"}
browser action=snapshot profile=openclaw compact=true
```
→ 找 `button "Reply"` 的 ref（確認非 disabled）
```
browser action=act profile=openclaw request={"kind":"click","ref":"<reply-submit-ref>"}
```

### 方法 B：直接從推文頁面

```
browser action=open profile=openclaw targetUrl="https://x.com/username/status/1234567890"
browser action=snapshot profile=openclaw compact=true
```
→ 找 `textbox "Post your reply"` 的 ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<reply-textbox-ref>"}
browser action=act profile=openclaw request={"kind":"type","ref":"<reply-textbox-ref>","text":"回覆內容"}
browser action=snapshot profile=openclaw compact=true
```
→ 找 `button "Reply"` 的 ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<reply-submit-ref>"}
```

---

## 6. 看個人頁面

```
browser action=open profile=openclaw targetUrl="https://x.com/username"
browser action=snapshot profile=openclaw compact=true
```

---

## 7. 搜尋

```
browser action=open profile=openclaw targetUrl="https://x.com/search?q=關鍵字&src=typed_query"
browser action=snapshot profile=openclaw compact=true
```

可附加篩選：`&f=live`（即時）、`&f=top`（熱門）

---

## 8. 追蹤 / 取消追蹤

在個人頁面 snapshot 後：
```
browser action=snapshot profile=openclaw compact=true
```
→ 找 `button "Follow"` 或 `button "Following"` 的 ref
```
browser action=act profile=openclaw request={"kind":"click","ref":"<follow-ref>"}
```
