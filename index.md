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

{% assign post_articles = site.pages | where: "layout", "post" %}
{% assign raw_articles = site.pages | where: "layout", "raw" %}
{% assign articles = post_articles | concat: raw_articles | sort: "url" | reverse %}
{% assign prev_url_date = "" %}
{% for article in articles %}
{% assign url_date = article.url | slice: 1, 10 %}
{% if url_date != prev_url_date %}
### {{ url_date }}
{% assign prev_url_date = url_date %}
{% endif %}
<div class="article-group">
  <h4 class="article-title" data-title="{{ article.title | downcase | escape }}" data-desc="{{ article.description | downcase | escape | default: '' }}">・ <a href="{{ site.baseurl }}{{ article.url }}">{{ article.title }}</a></h4>
  {% if article.description %}<p class="article-desc">{{ article.description }}</p>{% endif %}
</div>
{% endfor %}

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
    var groups = document.querySelectorAll('.article-group');
    var visible = 0;

    groups.forEach(function(group) {
      var h4 = group.querySelector('.article-title');
      if (!h4) return;
      var title = h4.getAttribute('data-title') || '';
      var desc = h4.getAttribute('data-desc') || '';
      var match = !q || title.includes(q) || desc.includes(q);
      group.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    emptyMsg.style.display = (visible === 0 && q) ? '' : 'none';
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
