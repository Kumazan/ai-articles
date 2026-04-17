---
title: "Cloudflare Email Service 公開測試，讓代理直接收發電子郵件"
description: "Cloudflare 把 Email Service 推進公開測試，讓 Workers 與 Agents SDK 直接收發、處理郵件，並提供 MCP、Wrangler 與開源 Inbox 範例，讓 email 變成代理的新介面。"
date: 2026-04-17
author: "Thomas Gauvin and Eric Falcão"
layout: post
permalink: /2026-04-17/cloudflare-email-service-agents-beta.html
image: /2026-04-17/og-cloudflare-email-service-agents-beta.png
---

<div class="hero-badge">AI News · 2026-04-17</div>

![](/ai-articles/2026-04-17/og-cloudflare-email-service-agents-beta.png)

**原文連結：** [Cloudflare Email Service: now in public beta. Ready for your agents](https://blog.cloudflare.com/email-for-agents/)

## 摘要

- Cloudflare Email Service 正式進入公開測試，讓任何應用與 agent 都能透過同一套平台收發郵件。
- 新增 Email Sending binding、Email MCP server、Wrangler email 指令、coding agent skills，以及開源的 Agentic Inbox。
- Agents SDK 的 onEmail 流程補齊後，agent 可以收信、保存狀態、非同步處理，再把結果回信。
- Cloudflare 也把 SPF、DKIM、DMARC、低延遲投遞與全球路由包成一站式能力。
- 這篇真正重要的不是「能寄信」，而是把 email 變成 agent 的工作流入口。

<div class="sep">· · ·</div>

Email 是世界上最容易接近的介面。它無所不在，不需要自訂聊天 App，也不需要替每個渠道各做一套 SDK。每個人都有 email address，代表每個人都已經能和你的應用或 agent 互動，而你的 agent 也能回到任何人身邊。

如果你正在做應用，email 本來就已經用在註冊、通知和發票上。現在需要這個渠道的，不只是應用邏輯，agent 也一樣。Cloudflare 在 private beta 期間訪談了不少開發者，他們正在做的東西非常一致：客服 agent、發票處理流程、帳號驗證流程、多 agent 工作流，全都建立在 email 上。趨勢已經很清楚，email 正在變成 agent 的核心介面，而開發者需要的是專門為這件事打造的基礎設施。

Cloudflare Email Service 就是這塊拼圖。有了 **Email Routing**，可以把 email 收進應用或 agent。透過 **Email Sending**，可以回信，或在 agent 完成工作後發通知給使用者。再加上 Cloudflare 其他開發者平台能力，甚至可以把完整 email client 與 [Agents SDK](https://blog.cloudflare.com/project-think/) 的 onEmail hook 當成原生功能來做。

今天，Cloudflare Email Service 作為 Agents Week 的一部分，正式進入 **public beta**，讓任何應用與任何 agent 都能寄信。他們也同步補齊了打造 email-native agents 需要的工具：

- 可從 Workers 與 Agents SDK 使用的 Email Sending binding
- 新的 Email MCP server
- Wrangler CLI 的 email 指令
- 給 coding agent 用的 skills
- 開源的 agentic inbox 參考應用

## Email Sending：正式進入 public beta

Email Sending 今天從 private beta 升級到 **public beta**。現在可以直接透過 Workers 的原生 binding 傳送交易型 email，不需要 API key，也不需要自己管 secrets。

```js
export default {
  async fetch(request, env, ctx) {
    await env.EMAIL.send({
      to: "user@example.com",
      from: "notifications@your-domain.com",
      subject: "Your order has shipped",
      text: "Your order #1234 has shipped and is on its way."
    });
    return new Response("Email sent");
  },
};
```

或者也可以透過 REST API，再搭配 TypeScript、Python 和 Go SDK 來送信：

```bash
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/email-service/send" \
   --header "Authorization: Bearer <API_TOKEN>" \
   --header "Content-Type: application/json" \
   --data '{
     "to": "user@example.com",
     "from": "notifications@your-domain.com",
     "subject": "Your order has shipped",
     "text": "Your order #1234 has shipped and is on its way."
   }'
```

要讓信真的進收件匣，通常得處理 SPF、DKIM、DMARC 這些設定。把網域加進 Email Service 後，Cloudflare 會自動幫忙處理這些事，讓信件完成驗證並順利送達，而不是進垃圾郵件。由於 Email Service 跑在 Cloudflare 的全球網路上，投遞延遲也能壓得很低。

再加上多年來一直免費提供的 [Email Routing](https://developers.cloudflare.com/email-routing/)，現在就有完整的雙向 email 平台。收信、在 Worker 裡處理、再回信，全都不用離開 Cloudflare。

如果要看 Email Sending 的完整技術細節，可以參考他們的 Birthday Week 公告。這篇文章剩下的部分，重點放在 Email Service 能替 agent 解鎖什麼能力。

## Agents SDK：讓 agent 天生會收信

Cloudflare 的 Agents SDK 本來就有一個第一級的 [onEmail hook](https://developers.cloudflare.com/agents/api-reference/agents-api/)，可以接收與處理 inbound email。不過到現在為止，agent 只能同步回覆，或只能寄給同一個 Cloudflare account 底下的成員。

有了 Email Sending，這個限制就消失了。這就是 chatbot 和 agent 的差別。

_email agent 會收到訊息，在平台上編排工作，然後以非同步方式回應。_

Chatbot 要嘛當下回，要嘛就什麼都做不了。Agent 則是能自己思考、自己行動，並依照自己的時間軸和外界溝通。有了 Email Sending，agent 可以收到一封信，花一小時處理資料、查三個不同系統，最後再寄出完整回覆。它可以安排後續追蹤，也可以在碰到邊界情況時升級處理。換句話說，它真的能做事，不只是回答問題。

下面這段就是完整的 support agent 流程，包含收信、儲存與回信：

```ts
import { Agent, routeAgentEmail } from "agents";
import { createAddressBasedEmailResolver, type AgentEmail } from "agents/email";
import PostalMime from "postal-mime";

export class SupportAgent extends Agent {
  async onEmail(email: AgentEmail) {
    const raw = await email.getRaw();
    const parsed = await PostalMime.parse(raw);

    // Persist in agent state
    this.setState({
      ...this.state,
      ticket: {
        from: email.from,
        subject: parsed.subject,
        body: parsed.text,
        messageId: parsed.messageId,
      },
    });

    // Kick off long running background agent task
    // Or place a message on a Queue to be handled by another Worker
    // Reply here or in other Worker handler, like a Queue handler
    await this.sendEmail({
      binding: this.env.EMAIL,
      fromName: "Support Agent",
      from: "support@yourdomain.com",
      to: this.state.ticket.from,
      inReplyTo: this.state.ticket.messageId,
      subject: `Re: ${this.state.ticket.subject}`,
      text: `Thanks for reaching out. We received your message about "${this.state.ticket.subject}" and will follow up shortly.`
    });
  }
}

export default {
  async email(message, env) {
    await routeAgentEmail(message, env, {
      resolver: createAddressBasedEmailResolver("SupportAgent"),
    });
  },
} satisfies ExportedHandler<Env>;
```

如果剛接觸 Agents SDK 的 email 能力，可以把底層機制拆成三件事看：

**每個 agent 都能從單一網域拿到自己的身分。** address-based resolver 會把 support@yourdomain.com 路由到「support」agent instance，把 sales@yourdomain.com 路由到「sales」instance，依此類推。不需要另外開 inbox，路由本身就內建在地址裡。甚至還能用 sub-addressing（NotificationAgent+user123@yourdomain.com）把不同使用者導到不同的 agent namespace 和 instance。

**狀態會跨 email 持續保存。** 因為 agent 建立在 Durable Objects 上，呼叫 `this.setState()` 就代表 agent 會記住對話歷史、聯絡資訊與跨 session 的上下文。inbox 直接變成 agent 的記憶，不需要另外準備資料庫或 vector store。

**安全的 reply routing 也已經內建。** 當 agent 寄出 email 並預期對方回覆時，可以用 HMAC-SHA256 簽署 routing headers，確保回信會回到原本送出那封信的 agent instance。這可以避免攻擊者偽造 header，把信路由到別的 agent instance，這是很多「email for agents」方案都沒處理好的安全問題。

這其實就是很多團隊自己從零做的完整 email agent 管線，現在 Cloudflare 把它打包成一個 Agent class 就能完成：收信、解析、分類、保存狀態、啟動非同步流程、回覆或升級處理，全都在 Cloudflare 的全球網路上運作。

## 給 agent 用的 email 工具：MCP server、Wrangler CLI、skills

Email Service 不只給跑在 Cloudflare 上的 agent 用。agent 可能跑在任何地方，像 Claude Code、Cursor、Copilot 這類 coding agent 可能在本機，也可能在遠端環境；生產環境的 agent 也可能在 container 或其他雲上。它們都需要從那些環境寄信。Cloudflare 這次一口氣做了三個整合，讓任何地方的 agent 都能用到 Email Service。

Email 現在已經可以透過 [Cloudflare MCP server](https://github.com/cloudflare/mcp) 使用，這就是先前 [Code Mode](https://blog.cloudflare.com/code-mode/) 驅動的那個 server，能讓 agent 存取整個 Cloudflare API。有了這個 MCP server，agent 就能發現並呼叫 Email endpoints，寄信與設定郵件。你甚至可以直接用一段 prompt 來送信：

```text
"Send me a notification email at hello@example.com from my staging domain when the build completes"
```

對有 bash 存取權的電腦或 sandbox 上的 agent 來說，Wrangler CLI 解決了我們在 [Code Mode](https://blog.cloudflare.com/code-mode/) 文章裡提過的 MCP context window 問題，因為工具定義本身就可能在 agent 開始做任何事前吃掉好幾萬 token。用了 Wrangler，agent 幾乎不用先載入大量 context，就能透過 `--help` 按需探索能力。下面就是 agent 透過 Wrangler 寄信的方式：

```bash
wrangler email send \
  --to "teammate@example.com" \
  --from "agent@your-domain.com" \
  --subject "Build completed" \
  --text "The build passed. Deployed to staging."
```

不管你給 agent 的是 Cloudflare MCP 還是 Wrangler CLI，它現在都能只靠一段 prompt 替你寄信。

### Skills

Cloudflare 也發布了一個 [Cloudflare Email Service skill](https://github.com/cloudflare/skills)。裡面提供完整指引，包含如何設定 Workers binding、如何透過 REST API 或 SDK 寄信、如何用 Email Routing 接 inbound email、如何搭配 Agents SDK、以及怎麼透過 Wrangler CLI 或 MCP 管理 email。它也涵蓋寄信可送達性的最佳實務，還有怎麼寫出比較容易進 inbox 的交易型 email。把它丟進專案裡，coding agent 就能直接上手做出 production-ready 的 Cloudflare email 整合。

## 開源 email agents 工具

在 private beta 期間，Cloudflare 也一直在測 email agents。他們很快發現，很多時候還是會想保留 human-in-the-loop，讓人能先看過 email，知道 agent 到底在做什麼。最好的做法，就是做一個功能完整、又內建 agent 自動化的 email client。

所以他們做了 [Agentic Inbox](https://github.com/cloudflare/agentic-inbox)：一個參考應用，支援完整的對話串、email 渲染、收信與儲存附件，還能自動回信。它還內建專用 MCP server，讓外部 agent 可以先幫你起草 email，再由你決定是否從 agentic-inbox 送出。

Cloudflare 把 [Agentic Inbox](https://github.com/cloudflare/agentic-inbox) 開源，當作完整 email application 的參考實作。它結合 Email Routing 做 inbound、Email Sending 做 outbound、Workers AI 做分類、R2 做附件、Agents SDK 做有狀態的 agent 邏輯。現在就能直接部署，幾乎一鍵拿到完整 inbox、email client 與 agent。

他們想讓 email agent 工具可以拼裝、可重用。與其讓每個團隊都自己重寫一次 inbound-classify-reply 管線，不如直接從這個參考應用開始，fork、擴充、改成適合自己流程的版本。

## 立刻可用

對 agent 來說，email 一直是世界上最重要的工作流程之一，但過去卻很難被妥善整合。現在 Email Sending 進入 public beta 之後，Cloudflare Email Service 終於變成一個完整的雙向溝通平台，讓 inbox 成為 agent 的一級介面。

不管是要做會直接在 inbox 裡跟客戶互動的 support agent，還是要做會在工作完成後主動通知團隊的背景流程，現在都可以用更順的方式，在全球規模上完成溝通。inbox 不再是孤島，它只是 agent 又一個可以幫忙的地方。

- 試試 Cloudflare Dashboard 裡的 [Email Sending](https://dash.cloudflare.com/?to=/:account/email-service/sending)
- 閱讀 [Email Service 文件](http://developers.cloudflare.com/email-service/)
- 查看 [Agents SDK email 文件](http://developers.cloudflare.com/agents/api-reference/email)
- 看看 [Email Service MCP server](http://github.com/cloudflare/mcp-server-cloudflare) 和 [Skills](https://github.com/cloudflare/skills)
- 部署開源的 [reference app](https://github.com/cloudflare/agentic-inbox)

## 延伸評論

Cloudflare 這篇最值得注意的，不是把「寄信」做成一個新 API，而是把 email 重新定義成 agent 的通道。這代表真正的競爭點，開始從模型能力往 state、routing、可靠投遞、與 human review 流程移動。對要做真實業務的人來說，這些才是決定 agent 能不能上線的東西。

另一個訊號是，基礎設施平台正在把「agent 會用的周邊能力」一口氣補齊。以前是模型廠商搶發模型，現在是平台廠商直接包 email、MCP、CLI、skills、reference app。這很像雲端時代的 SDK 戰爭，只是這次賣的不只是 compute，而是 agent 工作流的整套管線。

<div class="sep">· · ·</div>
