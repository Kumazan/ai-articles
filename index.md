---
title: AI News & Articles
---

# AI News & Articles

歡迎來到 Kuma 的 AI 翻譯文章專區

## 文章列表

{% assign post_articles = site.pages | where: "layout", "post" %}
{% assign raw_articles = site.pages | where: "layout", "raw" %}
{% assign articles = post_articles | concat: raw_articles | sort: "date" | reverse %}
{% assign prev_date = "" %}
{% for article in articles %}
{% assign cur_date = article.date | date: "%Y-%m-%d" %}
{% if cur_date != prev_date %}
### {{ cur_date }}
{% assign prev_date = cur_date %}
{% endif %}
#### ・ [{{ article.title }}]({{ article.url }})
{% if article.description %}<p class="article-desc">{{ article.description }}</p>{% endif %}

{% endfor %}
