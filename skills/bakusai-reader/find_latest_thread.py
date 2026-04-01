#!/usr/bin/env python3
"""
find_latest_thread.py - 從爆サイ搜尋結果找出指定場所的最新串

用法:
  python3 find_latest_thread.py "body breath"
  OUTPUT=markdown python3 find_latest_thread.py "池袋 JINYA"
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from html import unescape

SEARCH_BASE = "https://bakusai.com/sch_all/acode=3/word={query}/"


def fetch_html(url: str) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 "
            "Mobile/15E148 Safari/604.1"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja-JP,ja;q=0.9",
        "Accept-Encoding": "identity",
        "Connection": "keep-alive",
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp:
        charset = "utf-8"
        content_type = resp.headers.get("Content-Type", "")
        if "charset=" in content_type:
            charset = content_type.split("charset=")[-1].split(";")[0].strip()
        return resp.read().decode(charset, errors="replace")


def normalize_text(s: str) -> str:
    s = unescape(s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s.lower()


def score_match(query: str, title: str) -> int:
    q = normalize_text(query)
    t = normalize_text(title)
    score = 0
    for token in q.split():
        if token and token in t:
            score += 10
    if q in t:
        score += 30
    return score


def parse_search_results(html: str, query: str) -> list:
    results = []
    item_pat = re.compile(r'<li>\s*<a href="(?P<href>/thr_res/[^"]+tid=(?P<tid>\d+)/(?:p=\d+/)?)">(?P<body>.*?)</a>\s*<div class="clear2"></div>\s*</li>', re.I | re.S)

    for m in item_pat.finditer(html):
        href = m.group("href")
        tid = m.group("tid")
        body = m.group("body")

        title_match = re.search(r'title="([^"]+)"', body)
        if not title_match:
            title_match = re.search(r'<div class="thr_status_icon[^"]*">(.*?)</div>', body, re.S)
        if not title_match:
            continue
        raw_title = title_match.group(1)
        title = unescape(re.sub(r'<[^>]+>', '', raw_title)).strip()

        updated_match = re.search(r'更新時間：\s*([0-9/]{10}\s*[0-9:]{5})', body)
        spans = re.findall(r'<span>([0-9,]+)</span>', body)
        views = int(spans[0].replace(',', '')) if len(spans) >= 1 else None
        responses = int(spans[1].replace(',', '')) if len(spans) >= 2 else None

        results.append({
            "title": title,
            "tid": tid,
            "url": "https://bakusai.com" + href,
            "views": views,
            "responses": responses,
            "updated_at": updated_match.group(1).strip() if updated_match else None,
            "score": score_match(query, title),
        })

    results = [r for r in results if r["score"] > 0 or query.lower().replace(' ', '') in normalize_text(r["title"]).replace(' ', '')]
    results.sort(key=lambda x: (x["score"], x["updated_at"] or "", x["responses"] or 0), reverse=True)
    return results


def find_latest_thread(query: str) -> dict:
    encoded = urllib.parse.quote_plus(query)
    url = SEARCH_BASE.format(query=encoded)
    html = fetch_html(url)
    matches = parse_search_results(html, query)
    return {
        "query": query,
        "search_url": url,
        "matches": matches[:10],
        "best_match": matches[0] if matches else None,
        "error": None if matches else "NO_MATCH",
    }


def format_markdown(data: dict) -> str:
    if data["error"]:
        return f"❌ 找不到 `{data['query']}` 的爆サイ串\n搜尋頁：{data['search_url']}"
    lines = [
        f"# `{data['query']}` 搜尋結果",
        f"搜尋頁：{data['search_url']}",
        "",
        "## 最佳匹配",
        f"- 標題：{data['best_match']['title']}",
        f"- tid：{data['best_match']['tid']}",
        f"- URL：{data['best_match']['url']}",
    ]
    if data['best_match'].get('updated_at'):
        lines.append(f"- 更新：{data['best_match']['updated_at']}")
    if data['best_match'].get('responses') is not None:
        lines.append(f"- 留言數：{data['best_match']['responses']}")
    lines += ["", "## 候選串"]
    for m in data["matches"][:5]:
        lines.append(f"- {m['title']} | tid={m['tid']} | {m.get('updated_at') or '?'} | レス={m.get('responses') or '?'}")
    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("用法: find_latest_thread.py <query>", file=sys.stderr)
        sys.exit(1)
    query = " ".join(sys.argv[1:]).strip()
    data = find_latest_thread(query)
    if os.environ.get("OUTPUT") == "markdown":
        print(format_markdown(data))
    else:
        print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
