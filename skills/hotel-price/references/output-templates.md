# Output Templates — Hotel Price

## Markdown 環境（Claude Code / 一般 chat）

```markdown
## {飯店名} — {checkin}~{checkout} ({n}晚), {m}人

| 房型 | Booking | Agoda | Trip.com | 最低 |
|------|---------|-------|----------|------|
| 豪華公寓 不可退 | TWD 18,263 | TWD 13,467* | — | Agoda |
| 豪華公寓 可免取 | TWD 22,547 | TWD 13,675* | — | Agoda |
| 高級房 不可退 | TWD 17,967 | — | TWD 20,155 | Booking |
| 高級房 可免取 | TWD 22,181 | TWD 15,838* | TWD 21,823 | Agoda |

> 價格為每晚含稅均價（TWD），未登入價格
> *Agoda 不含稅價 × 1.10 估算

連結（Playwright 已驗證）：
- Booking: {url}
- Agoda: {url}
- Trip.com: {url}
```

---

## Discord / Telegram 環境（不支援 markdown table）

```
{飯店名} — {checkin}~{checkout} ({n}晚), {m}人
每晚含稅均價（TWD），未登入價格

豪華公寓 不可退
- Booking: TWD 18,263
- Agoda: ~TWD 13,467（不含稅價×1.1）
- Trip.com: —
→ 最低：Agoda

高級房 可免取
- Booking: TWD 22,181
- Agoda: ~TWD 15,838（不含稅價×1.1）
- Trip.com: TWD 21,823
→ 最低：Agoda

連結（已驗證）：
- Booking: <{url}>
- Agoda: <{url}>
- Trip.com: <{url}>
```

---

## 注意事項

- 輸出**必須**附各平台飯店實際直達連結（Booking / Agoda / Trip.com）
- 找不到直達連結時，降級提供 Fallback 搜尋 URL（見 url-formats.md）
- Agoda 估算含稅價一律標示 `*` 或「不含稅價×1.1」
- 售罄標示「已售罄」；無法查詢標示「無法查詢」
