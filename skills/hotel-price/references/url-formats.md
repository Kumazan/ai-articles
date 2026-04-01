# URL Formats — Hotel Price

## 帶日期參數的平台 URL

### Booking.com
```
{base_url}.zh-tw.html?checkin={YYYY-MM-DD}&checkout={YYYY-MM-DD}&group_adults={n}
```
- 日期參數小寫 `checkin`/`checkout`（非 camelCase）
- 加 `.zh-tw.html` 後綴取繁中頁面
- 若 URL 已有 query string，用 `&` 接上

### Agoda
```
{base_url}?checkIn={YYYY-MM-DD}&los={住幾晚}&rooms=1&adults={n}&children=0&currency=TWD
```
- 必須用 `los`（length of stay），不可用 `checkOut`，否則價格不載入
- 加繁中 locale：URL path 加 `/zh-tw/` 前綴
- 替代（搜尋頁）：
  ```
  https://www.agoda.com/zh-tw/search?cid=-1&city={cityId}&checkIn={YYYY-MM-DD}&los={晚數}&rooms=1&adults={n}&children=0&selectedproperty={propertyId}
  ```
  東京 cityId = `5085`，其他城市從搜尋結果 URL 取得

### Trip.com
```
{base_url}?checkIn={YYYY-MM-DD}&checkOut={YYYY-MM-DD}&adult={n}&curr=TWD
```
- 必須使用 `tw.trip.com` 域名（非 `www.trip.com`）取 TWD 幣別

---

## Fallback 搜尋 URL 格式

找不到飯店頁 URL 時，改用搜尋頁：

```
Booking:  https://www.booking.com/searchresults.html?ss={飯店名}&checkin={YYYY-MM-DD}&checkout={YYYY-MM-DD}
Agoda:    https://www.agoda.com/search?textToSearch={飯店名}&checkIn={YYYY-MM-DD}&checkOut={YYYY-MM-DD}
Trip.com: https://tw.trip.com/hotels/list?keyword={飯店名}&checkIn={YYYY-MM-DD}&checkOut={YYYY-MM-DD}&curr=TWD
```
