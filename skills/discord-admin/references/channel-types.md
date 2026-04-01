# Discord Channel Type 對照表

| type | 說明 | 用途 |
|------|------|------|
| 0 | Text channel | 一般文字頻道，最常用 |
| 2 | Voice channel | 語音頻道 |
| 4 | Category | 分類容器，其他頻道的 parent |
| 5 | Announcement channel | 公告頻道，支援 Follow |
| 10 | News Thread | 公告頻道下的 thread |
| 11 | Public Thread | 公開 thread |
| 12 | Private Thread | 私密 thread |
| 13 | Stage Voice | 舞台語音頻道 |
| 15 | Forum channel | 論壇頻道（每則訊息是一個 thread） |
| 16 | Media channel | 媒體頻道（限圖片/影片） |

## 建立頻道時常用的 type

- 一般文字頻道 → `"type": 0`
- 新增分類 → `"type": 4`
- 公告頻道 → `"type": 5`
- 論壇頻道 → `"type": 15`
