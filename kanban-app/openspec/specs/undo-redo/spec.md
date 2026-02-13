# Undo/Redo Spec
- 全域 undo/redo stack (ref)，最多 20 步
- persist() 自動推 undo stack 並清空 redo
- Header ↩/↪ 按鈕 + ⌘Z/⌘⇧Z 全域快捷鍵
- 支援所有卡片操作撤銷
