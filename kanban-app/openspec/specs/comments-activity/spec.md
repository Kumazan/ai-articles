# 卡片留言 & Activity Log Spec
- Comment type: `{ id, author, text, createdAt, isSystem? }`
- Card: `comments?: Comment[]`
- Card modal 底部：留言輸入框 + 時間排序列表
- 系統自動記錄：建立、移動欄位、改優先級（isSystem: true, italic 樣式）
