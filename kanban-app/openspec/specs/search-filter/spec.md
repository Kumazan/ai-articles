# 搜尋 & 篩選 Spec
- SearchFilter 元件：搜尋輸入框 + 優先級 chips (P0-P3 多選 toggle) + 標籤 chips (自動收集)
- KanbanBoard 管理 filter state，傳 `filterCard` fn 給 Column
- Column 過濾後顯示卡片，空結果顯示「無符合條件的卡片」
- 即時更新，不需 debounce
