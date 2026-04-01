#!/usr/bin/env python3
"""
bakusai-fetch: 輕量級爆サイ討論串爬蟲（純 HTTP + regex，無需 Playwright）
用法:
  python3 fetch_thread.py <url> [頁碼]
  python3 fetch_thread.py "https://bakusai.com/thr_res/acode=3/ctgid=149/bid=2716/tid=13202997/"
  python3 fetch_thread.py <url> 2        # 第2頁（最新往舊）
  python3 fetch_thread.py <url> 0 --from-start  # 從頭（最舊往新）
  OUTPUT=markdown python3 fetch_thread.py <url>  # 輸出 Markdown
"""

import gzip
import html as html_module
import json
import os
import re
import sys
import urllib.request
import zlib
from urllib.parse import urlparse

# 嘗試匯入 brotli（可能未安裝）
try:
    import brotli
    HAS_BROTLI = True
except ImportError:
    HAS_BROTLI = False


def fetch_html(url: str) -> str:
    """用 urllib 抓取 HTML，帶 Desktop Chrome UA + 自動解壓"""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/146.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja-JP,ja;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            charset = "utf-8"
            content_type = resp.headers.get("Content-Type", "")
            if "charset=" in content_type:
                charset = content_type.split("charset=")[-1].split(";")[0].strip()

            raw = resp.read()

            # 手動解壓（urllib 不會自動解壓 br/gzip）
            encoding = resp.headers.get("Content-Encoding", "").lower()
            if "br" in encoding and HAS_BROTLI:
                raw = brotli.decompress(raw)
            elif "gzip" in encoding:
                raw = gzip.decompress(raw)
            elif "deflate" in encoding:
                try:
                    raw = zlib.decompress(raw)
                except zlib.error:
                    raw = zlib.decompress(raw, -zlib.MAX_WBITS)

            return raw.decode(charset, errors="replace")
    except Exception as e:
        return f"<!-- ERROR: {e} -->"


def extract_posts(html: str) -> list:
    """從 Bakusai HTML 解析留言（data-tipso 屬性）"""
    posts = []
    seen_nums = set()

    # Bakusai 將每篇留言的完整 HTML 藏在 <span data-tipso='...'>
    for tipso_match in re.finditer(r"data-tipso='([^']*)'", html):
        tipso_html = html_module.unescape(tipso_match.group(1))

        # 解析編號：<span class="blue">#58</span>
        num_match = re.search(r'<span class="blue">#?(\d+)</span>', tipso_html)
        if not num_match:
            continue
        post_num = num_match.group(1)

        # 跳過重複（同一篇文可能出現多次）
        if post_num in seen_nums:
            continue
        seen_nums.add(post_num)

        # 解析日期：<span>2026/03/29 23:11</span>（在 res_rotundate 裡）
        date_match = re.search(r'res_rotundate[^>]*>\s*<[^>]*>\s*</[^>]*>\s*<span>([\d/:\s]+)</span>', tipso_html)
        if not date_match:
            # 備用：找第一個 YYYY/MM/DD HH:MM 格式
            date_match = re.search(r'(\d{4}/\d{2}/\d{2}\s+\d{2}:\d{2})</span>', tipso_html)
        if not date_match:
            continue
        post_date = date_match.group(1).strip()

        # 解析正文：<div class="res_body">...</div>
        body_match = re.search(r'class="res_body"[^>]*>(.*)', tipso_html, re.DOTALL)
        if not body_match:
            continue
        body_text = re.sub(r"<[^>]+>", " ", body_match.group(1))
        body_text = re.sub(r"\s+", " ", body_text).strip()

        if len(body_text) < 5:
            continue

        # 清理殘留的 HTML entities 和多餘結尾
        body_text = re.sub(r"&gt;", ">", body_text)
        body_text = re.sub(r"&lt;", "<", body_text)
        body_text = re.sub(r"&amp;", "&", body_text)
        body_text = re.sub(r"&nbsp;", " ", body_text)
        # 移除結尾的 [ 匿名さん ] 返信 移動
        body_text = re.sub(r'\s*\[\s*匿名さん\s*\]\s*返信\s*移動\s*$', '', body_text)
        body_text = re.sub(r'\s*\[\s*匿名さん\s*\]\s*$', '', body_text)
        body_text = body_text.strip()

        posts.append({
            "num": post_num,
            "date": post_date,
            "content": body_text
        })

    # 按編號排序
    posts.sort(key=lambda x: int(x["num"]))
    return posts


def fetch_thread(url: str, page: int = 1, from_start: bool = False) -> dict:
    """主抓取函式"""
    parsed = urlparse(url)
    path_parts = parsed.path.strip("/").split("/")
    params = {}
    for part in path_parts:
        if "=" in part:
            k, v = part.split("=", 1)
            params[k] = v

    bid = params.get("bid")
    tid = params.get("tid")
    ctgid = params.get("ctgid")

    result = {
        "url": url,
        "title": None,
        "bid": bid,
        "tid": tid,
        "ctgid": ctgid,
        "page": page,
        "total_posts": 0,
        "view_count": None,
        "posts": [],
        "error": None,
    }

    if not bid or not tid or not ctgid:
        result["error"] = "INVALID_URL: missing bid/tid/ctgid"
        return result

    # 建構 URL
    # 重要：tp 參數必須等於頁碼，p 是分頁參考
    base = f"{parsed.scheme}://{parsed.netloc}/thr_res/acode=3/ctgid={ctgid}/bid={bid}/tid={tid}"
    if from_start:
        actual_url = f"{base}/tp=1/rw=1/"
    elif page > 1:
        actual_url = f"{base}/p={page}/tp={page}/"
    else:
        actual_url = base + "/"

    html = fetch_html(actual_url)

    if html.startswith("<!-- ERROR:"):
        result["error"] = f"fetch_failed: {html}"
        return result

    # 標題（有多行格式，需清理）
    title_match = re.search(r"<title>([^<]+)</title>", html)
    if title_match:
        title = title_match.group(1)
        title = re.sub(r"\s+", " ", title).strip()
        result["title"] = title

    # 瀏覽數 / 留言數
    view_match = re.search(r"閲覧数[^0-9]*([0-9,]+)", html)
    post_match = re.search(r"レス数[^0-9]*([0-9,]+)", html)
    if view_match:
        result["view_count"] = view_match.group(1).replace(",", "")
    if post_match:
        result["total_posts"] = int(post_match.group(1).replace(",", ""))

    # 解析文章
    result["posts"] = extract_posts(html)

    # 檢查會員牆
    if "会員限定" in html and len(result["posts"]) < 2:
        result["error"] = "MEMBERS_ONLY"
        return result

    return result


def format_markdown(data: dict) -> str:
    """格式化為 Markdown"""
    if data["error"] == "MEMBERS_ONLY":
        return (
            f"⚠️ **此串需要會員登入才能查看內容**\n\n"
            f"URL: {data['url']}\n\n"
            f"💡 解決方式:\n"
            f"1. 在瀏覽器登入 bakusai.com，取 cookie 加入 script\n"
            f"2. 用 `web_search` 搜尋「場所名 爆サイ」可獲得部分內容\n"
            f"3. Google 搜尋有時會快取完整內容"
        )
    if data["error"] == "INVALID_THREAD":
        return f"❌ 無效的串 ID\nURL: {data['url']}"
    if data["error"]:
        return f"❌ 錯誤: {data['error']}"

    lines = []
    if data["title"]:
        title = re.sub(r"\s*[-|]\s*爆サイ.*$", "", data["title"])
        lines.append(f"# {title.strip()}")
    lines.append(f"**URL:** {data['url']}")
    if data.get("view_count"):
        lines.append(f"👁 {data['view_count']} 瀏覽 · {data['total_posts']} 留言")
    elif data.get("total_posts"):
        lines.append(f"📝 {data['total_posts']} 留言")
    lines.append("")
    lines.append(f"共抓到 **{len(data['posts'])}** 則留言\n")

    for post in data["posts"]:
        lines.append(f"---\n**#{post['num']}** · {post['date']}\n{post.get('content', '')}\n")

    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("用法: fetch_thread.py <url> [頁碼] [--from-start]", file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]
    page = 1
    from_start = False

    for arg in sys.argv[2:]:
        if arg == "--from-start":
            from_start = True
        elif arg.isdigit():
            page = int(arg)

    data = fetch_thread(url, page, from_start)

    output_format = os.environ.get("OUTPUT", "json")
    if output_format == "markdown":
        print(format_markdown(data))
    else:
        print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
