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
<div class="article-group" data-title="gemma 4：google 推出「每位元最強」開源模型，主打推理與 agent 實踐" data-desc="google deepmind 發佈 gemma 4 系列開源模型，包含 2b 到 31b 四種尺寸。憑藉「每參數最高智慧」的架構優化，gemma 4 在推理、agent 工作流及多模態處理上表現卓越，並採 apache 2.0 開放授權。">
  <h4>・ <a href="{{ site.baseurl }}/2026-04-03/gemma-4-release.html">Gemma 4：Google 推出「每位元最強」開源模型，主打推理與 Agent 實踐</a></h4>
  <p class="article-desc">Google DeepMind 發佈 Gemma 4 系列開源模型，包含 2B 到 31B 四種尺寸。憑藉「每參數最高智慧」的架構優化，Gemma 4 在推理、Agent 工作流及多模態處理上表現卓越，並採 Apache 2.0 開放授權。</p>
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
