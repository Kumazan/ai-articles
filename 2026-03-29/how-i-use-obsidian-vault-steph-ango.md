---
title: "我如何使用 Obsidian：Obsidian 創辦人的 Vault 系統全解"
date: 2026-03-29
author: Steph Ango
layout: post
permalink: /2026-03-29/how-i-use-obsidian-vault-steph-ango.html
---

<div class="hero-badge">Tools · 2026-03-29</div>

**原文連結：** [https://stephango.com/vault](https://stephango.com/vault)

## 摘要

- Obsidian 創辦人 Steph Ango 分享他個人的 Vault 架構，強調極簡資料夾、大量連結、不依賴 AI 的手動整理哲學
- 他只用 3 個主要資料夾（References、Clippings、Daily），大多數筆記直接放根目錄，以 categories 屬性 + Bases 取代資料夾分類
- 獨創「Fractal Journaling」：每天記碎片想法 → 幾天彙整 → 每月回顧 → 每年回顧，形成可縮放的生命脈絡網
- 採用 7 分制評分（非 5 或 10 分），理由是頂端需要更多粒度，底端不需要
- 整個網站直接從 Obsidian 筆記透過 Jekyll + GitHub + Netlify 發布，完整掌控每一個細節

<div class="sep">· · ·</div>

我用 [Obsidian](https://stephango.com/obsidian) 思考、做筆記、寫文章，也用它來發布這個網站。這是我由下而上整理知識的方式——擁抱混亂與惰性，讓結構自然浮現。

在 Obsidian 裡，「vault」就是一個資料夾，僅此而已。這很重要，因為它符合我的 [file over app](https://stephango.com/file-over-app) 哲學：如果你想讓數位成果長久存在，它必須是你能掌控的檔案，格式要易於讀取與存取。Obsidian 給了你這種自由。

以下內容絕非教條，只是一個使用範例。取你喜歡的部分就好。

## Vault 範本

- [下載我的 vault](https://github.com/kepano/kepano-obsidian/archive/refs/heads/main.zip) 或從 [GitHub repo](https://github.com/kepano/kepano-obsidian) clone。
- 解壓縮到你選擇的資料夾後，在 Obsidian 中以 vault 形式開啟。
- 我使用 [Minimal](https://stephango.com/minimal) 主題搭配 [Flexoki](https://stephango.com/flexoki) 色彩方案。
- [Obsidian Web Clipper](https://stephango.com/obsidian-web-clipper) 用來儲存網路上的文章與頁面，另有我的 [clipper 模板](https://github.com/kepano/clipper-templates)。
- [Obsidian Sync](https://obsidian.md/sync) 同步桌機、手機與平板之間的筆記。
- [Obsidian Bases](https://help.obsidian.md/bases) 依類別瀏覽筆記。
- [Obsidian Maps](https://help.obsidian.md/bases/views/map) 用於部分模板中的地圖功能。

## 個人規則

我在個人 vault 裡遵守以下規則：

- 避免將內容分散到多個 vault
- 避免用資料夾做分類
- 避免非標準 Markdown
- 標籤與類別一律用複數形式
- 大量使用內部連結
- 所有日期統一用 YYYY-MM-DD
- 使用 7 分制評分
- 每週只維護[一份待辦清單](https://stephango.com/todos)

擁有[一致的風格](https://stephango.com/style)能讓幾百個未來的決定變成一個，讓你更專注。例如，標籤一律複數，就不用再煩惱新標籤該怎麼命名。找到適合你的規則，寫下來，做你自己的風格指南——之後隨時可以修改。

## 資料夾與組織方式

我幾乎不用資料夾。原因是許多筆記同時跨越多個思考領域，而我的系統追求速度與惰性——不想為了「這個放哪裡」多費心思。

我不使用巢狀子資料夾，也很少用檔案總管導覽。我主要靠快速切換器、反向連結，或在筆記中點擊連結來移動。

筆記的主要分類方式是透過 `categories` 屬性，搭配 Obsidian 的 [Bases](https://help.obsidian.md/bases) 功能顯示相關筆記概覽。

大多數筆記直接放在 vault 根目錄，不進資料夾。這裡是我的個人世界：日記、文章、[長青筆記](https://stephango.com/evergreen-notes)，以及其他個人紀錄。放在根目錄的筆記，代表那是我寫的，或與我直接相關的事物。

我使用的兩個參考資料夾：

- **References**：記錄存在於我個人世界之外的事物——書籍、電影、地方、人物、播客等。統一用標題命名，例如 `Book title.md` 或 `Movie title.md`。
- **Clippings**：儲存別人寫的內容，主要是文章與隨筆。

三個管理用資料夾（讓內容不出現在檔案導覽中）：

- **Attachments**：圖片、音訊、影片、PDF 等附件
- **Daily**：日記筆記，全部命名為 YYYY-MM-DD.md。日記本身不寫任何東西，只作為被其他筆記連結的節點。
- **Templates**：模板

## 連結

我在筆記中大量使用內部連結，每次第一次提到某件事都會連結過去。日記通常是意識流的紀錄，找出事物之間的連結。很多連結是「尚未解析」的——意思是那個連結指向的筆記還沒建立。未解析的連結很重要，它們是未來思想連結的麵包屑。

根目錄的一篇日記可能長這樣：

> 我跟 [[Aisha]] 去 [[Vidiots]] 看了 [[Perfect Days]]，然後去 [[Little Ongpin]] 吃了菲律賓料理。我很喜歡 Perfect Days 裡的這句話：[[Next time is next time, now is now]]。它讓我想到那篇文章……

電影、電影院和餐廳分別連結到 References 資料夾中的條目。在那些參考筆記裡，我記錄屬性、評分和想法。引號對我很有意義，所以它變成了根目錄裡的一篇[長青筆記](https://stephango.com/evergreen-notes)。

這種重度連結的方式隨著時間越來越有價值——我可以追溯想法如何浮現，以及這些想法又衍生出哪些分支路徑。

## Fractal Journaling 與隨機重訪

Fractal Journaling（碎形日誌）和隨機化，是我馴服這片知識荒野的方法。

我在一天中用 Obsidian 的「建立唯一筆記」快捷鍵，隨時記下浮現的想法。這個快捷鍵會自動建立一個以 `YYYY-MM-DD HHmm` 為前綴的筆記，我再補上描述這個想法的標題。

每隔幾天，我會回顧這些日記碎片，整理出重要的想法；再每月回顧這些整理；每年回顧那些月度回顧（用[這份模板](https://stephango.com/40-questions)）。結果是一張我人生的碎形網絡，可以用不同粒度縮放觀看。我能追溯某個想法的起點，以及它如何升騰成更大的主題。

有人問我能不能用語言模型自動化這個過程——我不想那樣做。我享受這個過程。做這些整理讓我更了解自己的思維模式。[不要把理解外包出去](https://stephango.com/understand)。

## 屬性與模板

我幾乎每一篇筆記都從[模板](https://github.com/kepano/kepano-obsidian/tree/main/Templates)開始。我大量使用模板，因為它讓我能懶洋洋地補上有助於日後查找的資訊。每個類別都有一個模板，頂部帶有[屬性](https://help.obsidian.md/properties)，用來記錄：

- **日期**：建立、開始、結束、發布
- **人物**：作者、導演、藝術家、演員、主持人、嘉賓
- **主題**：以類型、形式、主題、相關筆記分組
- **地點**：街區、城市、座標
- **評分**：詳見下方

幾條屬性規則：

- 屬性名稱與值應盡量跨類別通用。這讓我能跨類別查找，例如 `genre` 在所有媒體類型中共用，讓我可以在同一個地方看到科幻書籍、電影和影集。
- 模板應盡量可組合，例如 `Person` 和 `Author` 是兩個不同的模板，但可以加到同一篇筆記。
- 屬性名稱越短越好，打字更快，例如用 `start` 而非 `start-date`。
- 如果未來有任何可能包含超過一個連結或值，預設使用列表類型屬性。

## 評分系統

所有有評分的事物都用 1 到 7 的整數：

- **7**：完美，必試，改變人生，值得特地去找
- **6**：優秀，值得重複
- **5**：不錯，不用特地找，但令人享受
- **4**：過得去，聊勝於無
- **3**：不好，能避就避
- **2**：糟透了，主動迴避，令人反感
- **1**：邪惡，以不好的方式改變人生

為什麼是 7 分制？比起 4 或 5 分，我更喜歡 7 分制，因為在頂端需要更多粒度來區分好的體驗；10 分又太細了。

## 發布到網路

這個網站直接在 Obsidian 中撰寫、編輯並發布。為此，我打破了上面列的一條規則——為網站單獨建了一個 vault。我使用靜態網站產生器 [Jekyll](https://jekyllrb.com/) 自動把筆記編譯成網站，從 Markdown 轉換為 HTML。

我的發布流程好用，但設置起來有點技術性，因為我想完全掌控網站版面的每一個細節。如果你不需要完全掌控，可以考慮 [Obsidian Publish](https://obsidian.md/publish)，更為友善，也是我用來發布 [Minimal 文件網站](https://minimal.guide/publish/download)的工具。

對於這個站，我用 [Obsidian Git](https://obsidian.md/plugins?id=obsidian-git) 插件把筆記推送到 GitHub repo，再用網頁主機 [Netlify](https://www.netlify.com/) 配合 Jekyll 自動編譯。我也用自己開發的 [Permalink Opener](https://stephango.com/permalink-opener) 插件，快速在瀏覽器中開啟筆記，方便對照草稿與上線版本。

色盤是我為這個站設計的 [Flexoki](https://stephango.com/flexoki)。我的 Jekyll 模板不公開，但你可以從 Maxime Vaillancourt 的[這份模板](https://github.com/maximevaillancourt/digital-garden-jekyll-template)得到類似效果。也有許多 Jekyll 的替代方案，例如 [Quartz](https://quartz.jzhao.xyz/)、[Astro](https://astro.build/)、[Eleventy](https://www.11ty.dev/) 和 [Hugo](https://gohugo.io/)。

---

**延伸閱讀：**
- [File over app](https://stephango.com/file-over-app)
- [簡潔的解釋能加速進步](https://stephango.com/concise)
- [長青筆記把想法變成可操作的物件](https://stephango.com/evergreen-notes)
- [每年問自己的 40 個問題](https://stephango.com/40-questions)
