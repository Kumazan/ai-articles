---
title: "Cloudflare Email Service 公開測試上線，讓代理直接收發電子郵件"
description: "Cloudflare 把 Email Service 推進公開測試，讓 Workers 與 Agents SDK 直接收發、處理郵件，並補上 MCP、Wrangler 與開源 inbox 範例，讓 email 成為 agent 的原生介面。"
date: 2026-04-16
author: Cloudflare
layout: post
permalink: /2026-04-16/cloudflare-email-service-agents-beta.html
image: /2026-04-16/og-cloudflare-email-service-agents-beta.png
---

<div class="hero-badge">AI News · 2026-04-16</div>

![](/2026-04-16/og-cloudflare-email-service-agents-beta.png)

**原文連結：** [Cloudflare Email Service: now in public beta. Ready for your agents](https://blog.cloudflare.com/email-for-agents/)

## 摘要

- Cloudflare Email Service 進入公開測試，讓應用與 agent 可以原生收、發、處理 email
- 這次不只是寄信功能升級，還把 Email Routing、Workers、Agents SDK 串成完整的雙向 email 流程
- Cloudflare 強調，email 對 agent 來說不只是通知管道，而是可以進行長流程工作的核心介面
- 新增的工具包含 Email MCP server、Wrangler CLI email 指令、Skills，還有開源的 Agentic Inbox 範例
- 對開發者來說，這代表 support、invoice、驗證與多 agent workflow 都能直接落在 inbox 裡完成
- Cloudflare 也把 deliverability、身分驗證與回覆路由一起包進平台，降低自己搭整套 email 基礎設施的成本

<div class="sep">· · ·</div>

Email 是世界上最普及的介面。它無所不在，也不需要為每個 channel 客製一套聊天 app 或 SDK。每個人都已經有 email 地址，這代表每個人都能直接和你的應用或 agent 互動，而你的 agent 也能回頭聯絡任何人。

如果你正在做應用，你早就依賴 email 來處理註冊、通知、發票。現在不只是應用邏輯需要這個 channel，agent 也需要。Cloudflare 在私有測試期間，看到很多開發者就是在做這件事：客服 agent、發票處理流程、帳號驗證、多 agent 工作流，全都建立在 email 上。趨勢很清楚，email 正在變成 agent 的核心介面，而開發者也需要一套為它量身打造的基礎設施。

Cloudflare Email Service 就是這塊拼圖。透過 **Email Routing**，可以把 email 收進你的應用或 agent；透過 **Email Sending**，可以回覆 email，或在 agent 完成工作後寄出通知。再加上 Cloudflare 其他開發平台能力，現在就能把完整的 email client 和 Agents SDK 的 onEmail hook 串成原生功能。

今天，作為 Agents Week 的一部分，Cloudflare Email Service 正式進入 **public beta**，讓任何應用與 agent 都能寄送 email。他們也把建 email-native agent 的工具補齊了：

- Email Sending binding，可從 Workers 與 Agents SDK 直接使用
- 全新的 Email MCP server
- Wrangler CLI 的 email 指令
- 給 coding agents 用的 skills
- 開源的 agentic inbox 參考應用

## Email Sending：正式進入公開測試

Email Sending 今天從 private beta 升級為 **public beta**。現在可以直接在 Workers 裡，用原生 binding 寄交易信，不需要 API key，也不用另外管 secrets。

```js
export default {
  async fetch(request, env, ctx) {
    await env.EMAIL.send({
      to: "user@example.com",
      from: "notifications@your-domain.com",
      subject: "Your order has shipped",
      text: "Your order #1234 has shipped and is on its way.",
    });
    return new Response("Email sent");
  },
};
```

或者也可以用 REST API，搭配 TypeScript、Python、Go SDK 來寄信：

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

真正讓郵件送進收件匣，通常得處理 SPF、DKIM、DMARC 這些麻煩事。把網域接到 Email Service 時，Cloudflare 會自動把這些設定好，讓郵件通過驗證而不是直接進垃圾信箱。因為 Email Service 是建立在 Cloudflare 全球網路上的服務，所以全球各地都能低延遲送達。

再加上多年來已經免費提供的 [Email Routing](https://developers.cloudflare.com/email-routing/)，現在等於有了一套完整的雙向 email 平台。你可以收信、在 Worker 裡處理、再回信，全都不用離開 Cloudflare。

如果想看 Email Sending 的完整技術細節，可以參考他們先前的 [Birthday Week 公告](https://blog.cloudflare.com/email-service/)。這篇文章剩下的重點，則是 email 對 agent 到底能開出什麼能力。

## Agents SDK：讓 agent 真的 email-native

Cloudflare 的 Agents SDK 早就有 first-class 的 [onEmail hook](https://developers.cloudflare.com/agents/api-reference/agents-api/)，可以接收與處理進站 email。但在這次之前，agent 只能同步回覆，或者只能寄信給 Cloudflare 帳號內的人。

有了 Email Sending，這個限制就消失了。這也是 chatbot 和 agent 的差別。

_email agent 會接收訊息、在平台上協調工作，然後用非同步節奏回應。_

chatbot 要嘛當下回，要嘛就沒了。agent 則會思考、執行、再自己找時間溝通。搭配 Email Sending，agent 可以收到訊息、花一小時處理資料、查三個其他系統，最後再寄出完整答案。它可以安排 follow-up，也能在偵測到 edge case 時升級處理。換句話說，它真的能做事，不只是回答問題。

下面是一個客服 agent 的例子，展示完整的接收、保存、回覆流程：

```js
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
    // Reply here or in another Worker handler, like a Queue handler
    await this.sendEmail({
      binding: this.env.EMAIL,
      fromName: "Support Agent",
      from: "support@yourdomain.com",
      to: this.state.ticket.from,
      inReplyTo: this.state.ticket.messageId,
      subject: `Re: ${this.state.ticket.subject}`,
      text: `Thanks for reaching out. We received your message about "${this.state.ticket.subject}" and will follow up shortly.`,
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

如果第一次接觸 Agents SDK 的 email 能力，重點是這幾件事。

**每個 agent 都能從同一個網域拿到自己的身份。** address-based resolver 會把 support@yourdomain.com 導到 "support" agent instance，sales@yourdomain.com 導到 "sales" instance，以此類推。不需要為每個 inbox 另外建一套系統，路由就直接寫在地址裡。甚至可以用 sub-addressing，例如 NotificationAgent+user123@yourdomain.com，把不同使用者導向不同的 agent namespace 或 instance。

**狀態會跨 email 持久保存。** 因為 agent 底層是 Durable Objects，呼叫 this.setState() 就代表 agent 會記住對話歷史、聯絡資訊和上下文，不需要另外再接一個資料庫或 vector store。

**安全的 reply routing 也內建好了。** 當 agent 寄出 email，並且期待對方回覆時，可以用 HMAC-SHA256 簽名 routing headers，讓回信精準回到原本的 agent instance。這可以防止攻擊者偽造 headers，把信路由到別的 agent instance，這也是很多「email for agents」方案沒有處理好的安全問題。

這其實就是團隊在別處自己拼出來的完整 email agent pipeline：收信、解析、分類、保存狀態、啟動非同步工作流程、回覆或升級處理，而且全部都能塞在同一個 Agent class 裡，在 Cloudflare 全球網路上部署。

## 給 agents 用的 email 工具：MCP server、Wrangler CLI、Skills

Email Service 不只給跑在 Cloudflare 上的 agent 用。agent 可能跑在各種地方，像 Claude Code、Cursor、Copilot 這類 coding agents，可能在本機或遠端環境中執行；也可能是跑在 container 或外部雲端的 production agents。它們都需要從那些環境寄信。Cloudflare 這次就補了三種整合，讓任何 agent 都能接上 Email Service。

Email 現在已經可以透過 [Cloudflare MCP server](https://github.com/cloudflare/mcp) 使用。這是同一個由 [Code Mode](https://blog.cloudflare.com/code-mode/) 驅動的 server，讓 agent 能存取整個 Cloudflare API。透過這個 MCP server，agent 可以發現並呼叫 Email endpoints 來寄信與設定郵件。你甚至可以直接用一句 prompt 來寄信：

> Send me a notification email at hello@example.com from my staging domain when the build completes

對於有 bash 權限的電腦或 sandbox 裡的 agents，Wrangler CLI 可以解決 MCP context window 的問題。前面那篇 Code Mode 文章提過，tool definition 可能在 agent 真正開始處理訊息前，就吃掉幾萬個 tokens。用 Wrangler 的話，agent 幾乎不用先載入大量 context，而是透過 `--help` 需要什麼再查什麼。下面就是用 Wrangler 寄信的方式：

```bash
wrangler email send \
  --to "teammate@example.com" \
  --from "agent@your-domain.com" \
  --subject "Build completed" \
  --text "The build passed. Deployed to staging."
```

不管你給 agent 的是 Cloudflare MCP 還是 Wrangler CLI，它現在都可以用一個 prompt 幫你寄信。

### Skills

Cloudflare 也同步釋出了一個 [Cloudflare Email Service skill](https://github.com/cloudflare/skills)。內容包括怎麼設定 Workers binding、怎麼透過 REST API 或 SDK 寄信、怎麼用 Email Routing 收進站信、怎麼搭配 Agents SDK、以及怎麼用 Wrangler CLI 或 MCP 管理 email。它也涵蓋了 deliverability best practices，還有怎麼寫出比較容易進 inbox 的交易信。把它放進專案裡，coding agent 就會有一套完整的 Cloudflare email 生產級指引。

## 開源 email agent 工具

在 private beta 期間，Cloudflare 也嘗試了 email agents。他們很快發現，人類還是常常想保留介入空間，先看過 agent 寫了什麼，再決定要不要送出。要做到這件事，最好的方式就是把完整的 email client 跟 agent automation 做在一起。

這也是他們做出 [Agentic Inbox](https://github.com/cloudflare/agentic-inbox) 的原因：一個參考應用，支援完整 conversation threading、email rendering、收信與儲存附件，還能自動回信。它內建獨立的 MCP server，外部 agents 可以先幫你草擬 email，再由你決定是否從 agentic inbox 送出。

Cloudflare 也把 [Agentic Inbox](https://github.com/cloudflare/agentic-inbox) 開源，當成一個參考範例，示範如何用 Email Routing 做 inbound、用 Email Sending 做 outbound、用 Workers AI 做分類、用 R2 放附件、再用 Agents SDK 處理狀態式 agent 邏輯。你可以直接部署它，立刻拿到完整 inbox、email client 和 agent。

他們希望 email agent 工具能夠可組合、可重用。與其讓每個團隊都重新做一次 inbound-classify-reply pipeline，不如直接從這個參考應用開始，fork、擴充，做成符合自己工作流的 email agents。

## 先試試看

Email 是世界上最重要工作流的所在地，但對 agents 來說，過去一直很難真正碰到這個 channel。現在 **Email Sending** 進入公開測試後，Cloudflare Email Service 終於變成一個完整的雙向通訊平台，讓 inbox 成為 agents 的第一級介面。

不管是做一個在收件匣裡跟客戶互動的 support agent，還是做一個在背景持續更新團隊狀態的流程，agents 現在都能用更自然的方式，在全球尺度上溝通。收件匣不再是孤島，現在只是 agent 又多了一個能提供幫助的地方。

- 在 Cloudflare Dashboard 試用 [Email Sending](https://dash.cloudflare.com/?to=/:account/email-service/sending)
- 閱讀 [Email Service 文件](http://developers.cloudflare.com/email-service/)
- 參考 [Agents SDK email 文件](http://developers.cloudflare.com/agents/api-reference/email)
- 查看 [Email Service MCP server](http://github.com/cloudflare/mcp-server-cloudflare) 與 [Skills](https://github.com/cloudflare/skills)
- 部署開源的 [reference app](https://github.com/cloudflare/agentic-inbox)

<div class="sep">· · ·</div>

## 延伸評論：email 不是舊工具，而是 agent 最務實的工作通道

Cloudflare 這篇最有意思的地方，不是又多了一個「可以用 AI 寄信」的功能，而是它把 email 重新定義成 agent 的工作接口。聊天室很適合即時互動，但真正的商業流程常常不是即時的，像驗證、通知、補件、客服、帳務追蹤，很多都天然是非同步的。email 在這裡反而比聊天框更像 production interface。

對開發者來說，這種平台化的價值很明確。與其自己處理 DNS、deliverability、回覆路由、state persistence、MCP 整合，不如把這些都交給一個系統層服務。下一波 agent 工程，可能不只是在 prompt 裡變聰明，而是誰能把 inbox、queue、workflow、human handoff 這些東西接得最順。
