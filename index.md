---
title: AI News & Articles
---

# AI News & Articles

歡迎來到 Kuma 的 AI 翻譯文章專區

<div class="search-wrap">
  <input type="text" id="search-input" placeholder="搜尋標題或描述..." autocomplete="off" />
  <button id="search-clear" aria-label="清除搜尋">&times;</button>
</div>
<div id="search-empty" class="search-empty" style="display:none">找不到符合的文章</div>

## 文章列表

<div class="date-section">
<h3>2026-04-03</h3>
<div class="article-group" data-title="prismml 發布全球首款商用 1-bit llm：bonsai 8b 讓 ai 模型縮小 14 倍、速度提升 8 倍" data-desc="prismml 推出首款商用 1-bit llm『bonsai 8b』，將 80 億參數模型壓縮至 1.15gb，速度提升 8 倍且能耗降低 80%，實現邊緣裝置運行強大 ai 的突破。">
  <h4>・ <a href="/ai-articles/2026-04-03/prismml-1-bit-bonsai-llm.html">PrismML 發布全球首款商用 1-Bit LLM：Bonsai 8B 讓 AI 模型縮小 14 倍、速度提升 8 倍</a></h4>
  <p class="article-desc">PrismML 推出首款商用 1-bit LLM『Bonsai 8B』，將 80 億參數模型壓縮至 1.15GB，速度提升 8 倍且能耗降低 80%，實現邊緣裝置運行強大 AI 的突破。</p>
</div>
<div class="article-group" data-title="google 發布 gemma 4 開放模型：從樹莓派到工作站，每參數智慧再創新高" data-desc="google deepmind 推出 gemma 4 系列四款開放模型，基於 gemini 3 研究技術，支援多模態輸入、256k 上下文視窗、140 種語言，首次採用 apache 2.0 授權，覆蓋從手機邊緣裝置到伺服器的完整部署場景。">
  <h4>・ <a href="/ai-articles/2026-04-03/google-gemma-4-open-models.html">Google 發布 Gemma 4 開放模型：從樹莓派到工作站，每參數智慧再創新高</a></h4>
  <p class="article-desc">Google DeepMind 推出 Gemma 4 系列四款開放模型，基於 Gemini 3 研究技術，支援多模態輸入、256K 上下文視窗、140 種語言，首次採用 Apache 2.0 授權，覆蓋從手機邊緣裝置到伺服器的完整部署場景。</p>
</div>
<div class="article-group" data-title="微軟發佈三款 mai 多模態模型：看、聽、說一站式解決方案" data-desc="微軟正式推出 mai-transcribe-1、mai-voice-1 與 mai-image-2 三款模型，專攻語音轉文字、文字轉語音及圖像生成，主打企業級精準度與極高成本效益，全面佈局多模態 ai 應用生態。">
  <h4>・ <a href="/ai-articles/2026-04-03/microsoft-mai-multimedia-models.html">微軟發佈三款 MAI 多模態模型：看、聽、說一站式解決方案</a></h4>
  <p class="article-desc">微軟正式推出 MAI-Transcribe-1、MAI-Voice-1 與 MAI-Image-2 三款模型，專攻語音轉文字、文字轉語音及圖像生成，主打企業級精準度與極高成本效益，全面佈局多模態 AI 應用生態。</p>
</div>
</div>

{% assign post_articles = site.pages | where: "layout", "post" %}
{% assign raw_articles = site.pages | where: "layout", "raw" %}
{% assign articles = post_articles | concat: raw_articles | sort: "url" | reverse %}
{% assign prev_url_date = nil %}
{% for article in articles %}
{% assign url_date = article.url | slice: 1, 10 %}
{% if prev_url_date == nil %}
<div class="date-section">
<h3>{{ url_date }}</h3>
{% elsif url_date != prev_url_date %}
</div>
<div class="date-section">
<h3>{{ url_date }}</h3>
{% endif %}
<div class="article-group" data-title="{{ article.title | downcase | escape }}" data-desc="{{ article.description | downcase | escape | default: '' }}">
  <h4>・ <a href="{{ site.baseurl }}{{ article.url }}">{{ article.title }}</a></h4>
  {% if article.description %}<p class="article-desc">{{ article.description }}</p>{% endif %}
</div>
{% assign prev_url_date = url_date %}
{% endfor %}
{% if prev_url_date != nil %}</div>
{% endif %}

<script>
(function() {
  var input = document.getElementById('search-input');
  var clearBtn = document.getElementById('search-clear');
  var emptyMsg = document.getElementById('search-empty');

  function normalize(str) {
    return (str || '').toLowerCase();
  }

  function filter() {
    var q = normalize(input.value.trim());
    var sections = document.querySelectorAll('.date-section');
    var totalVisible = 0;

    sections.forEach(function(section) {
      var groups = section.querySelectorAll('.article-group');
      var sectionVisible = 0;

      groups.forEach(function(group) {
        var title = group.getAttribute('data-title') || '';
        var desc = group.getAttribute('data-desc') || '';
        var match = !q || title.includes(q) || desc.includes(q);
        group.style.display = match ? '' : 'none';
        if (match) sectionVisible++;
      });

      section.style.display = (q && sectionVisible === 0) ? 'none' : '';
      totalVisible += sectionVisible;
    });

    emptyMsg.style.display = (totalVisible === 0 && q) ? '' : 'none';
  }

  input.addEventListener('input', function() {
    clearBtn.classList.toggle('visible', input.value.length > 0);
    filter();
  });

  clearBtn.addEventListener('click', function() {
    input.value = '';
    clearBtn.classList.remove('visible');
    input.focus();
    filter();
  });

  filter();
})();
</script>
