# Platform Gotchas — Hotel Price

## Platform-Specific Gotchas

### Booking.com
- Snapshot 約 95K~130K，只 grep 價格行即可
- URL slug 穩定，可從 web_search 取得
- 日期參數用小寫 `checkin`/`checkout`（非 camelCase）
- 價格**已含稅費**，通常同時顯示原價和折扣價
- 加 `.zh-tw.html` 後綴取得繁中頁面

### Agoda
- 飯店頁必須用 `checkIn` + `los`；用 `checkOut` 會導致價格不載入
- URL slug 不可猜，必須從 web_search 取得
- 顯示價格**不含稅及其他費用**（頁面會標示），稅費約 10%
- Snapshot 約 120K~170K，建議只讀價格區塊
- 會顯示「原始價格」「現金回饋後價格」多層折扣，取「每晚價格（不含稅及其他費用）」旁的數字
- 飯店頁載入失敗時，可改用搜尋頁帶 `selectedproperty` 參數（見 url-formats.md）

### Trip.com
- 需要正確的 `hotelId`（在 URL path 中），不可猜，從 web_search 取得
- 必須用 `tw.trip.com` 域名
- 預設只顯示部分房型，需找「顯示其他X個房型價格」按鈕用 `browser_click` 展開後重新 snapshot
- 價格已含稅（標示「含稅項及費用」）
- 會同時顯示「原價」和「目前價格」

---

## General Gotchas

- 三平台日期參數名不同：Booking `checkin`/`checkout` vs Agoda/Trip.com `checkIn`/`checkOut`
- Agoda 額外用 `los`（住幾晚）取代 `checkOut`
- Booking 自動偵測幣別；Agoda 用 `currency=TWD`；Trip.com 用 `curr=TWD`
- 批量查完要執行 `browser_close` 並清理暫存 snapshot 檔案
- 價格因登入狀態、會員等級而異，輸出務必標示「未登入價格」
- Agoda 價格一律 ×1.10 換算含稅，並在輸出中標註為估算值
