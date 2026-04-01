gstack nails the planning and evaluation roles.

/plan-ceo-review and /plan-eng-review are your head chefs. One asks "is this worth building?" from a product angle, the other asks "will this blow up later?" from an architecture angle. Both gates must pass before work begins.

Here's a practical tip. Before running /office-hours, use this prompt to clarify requirements:
"I'm about to start this project. Interview me until you have 95% confidence about what I actually want, not what I think I should want."
Let AI ask YOU questions instead of you asking AI. Most projects fail not because they were built wrong, but because nobody clarified what to build in the first place. AI interviewing you is 10x more effective than you prompting AI.

Claude Opus 4.6 has a 1 million token context window (currently in beta on the Claude Platform). For projects that fit within that window, you can load the full codebase and docs in one pass instead of feeding it piecemeal. That said, Anthropic's own harness post still emphasizes external state files (feature-list, init.sh, claude-progress.txt) as the primary coordination mechanism, not just raw context.

/qa is the independent taster. It opens a real browser, clicks through your site like an actual user. Not "the code looks fine," actually using it. In their web app testing scenario, Anthropic found that explicitly requiring browser-based end-to-end testing significantly improved performance compared to relying on code-level checks alone.

Garry Tan says he shipped 600K lines of production code in 60 days with this setup, 10-20K lines per day, while running YC full-time (these are his own numbers from his retro, your mileage may vary). For decisions and QA, gstack is still the strongest.

But gstack is like a restaurant with a great chef and a great taster, but no recipe binder. Nobody writes down what went wrong tonight. Tomorrow's team starts fresh, making the same mistakes. Note: gstack does have its own /review and /ship commands, so there is some overlap with CE's review capabilities. The distinction is emphasis, not hard boundaries.

## Superpowers: Process Without Memory

Superpowers' 121K stars prove its quality. Brainstorm → plan → execute → review upgraded many people from "chatting randomly with AI" to "using AI with a process."

Like going from a kitchen where everyone improvises to one with an actual recipe book and prep checklist. That's a huge step forward. It also includes subagent-driven development with separate spec and code-quality reviewers.

But Superpowers doesn't treat knowledge accumulation as a first-class feature the way CE does. Every session's context stays in that session. Next session starts without the lessons from the last one.

That's what led me to add CE on top.

## Compound Engineering: The Missing Layer

CE's cycle: brainstorm → plan → work → review → compound.
The first four steps are similar to Superpowers but go deeper.

Plan phase: instead of writing a plan from scratch in the current conversation, it spawns parallel research agents that dig through your project's history, scan codebase patterns, and read git commit logs. Like a new cook reading every dish return complaint from the past three months before designing tomorrow's menu, instead of guessing.

Review phase: not one taster saying "tastes fine." It runs a dynamic reviewer ensemble, minimum 6 always-on reviewers plus conditional ones based on the diff: correctness, security, performance, testing, maintainability, adversarial, each producing an independent report. Like having a food critic, a health inspector, and a customer panel all taste the same dish separately.

But the real watershed is step five: /ce:compound.
This is where CE gets its name.

After fixing a bug or completing a feature, run this one command. It spawns five Phase 1 subagents in parallel:

- Context Analyzer: traces the entire conversation, extracts problem type and components involved
- Solution Extractor: captures what didn't work, what worked, root cause, and the final fix
- Related Docs Finder: searches existing knowledge base for duplicates. If a similar bug was fixed before, it updates the old doc instead of creating a new one
- Prevention Strategist: identifies how to prevent this class of problem in the future
- Category Classifier: tags and categorizes the learning for structured retrieval

All five finish, results merge into docs/solutions/. Structured documents, categorized, searchable.

In plain English: your agent writes a closing summary after every shift. Next time any agent starts a new task, it reads through all those summaries first.

Example: you fix an edge runtime compatibility bug, takes hours of debugging. Compound auto-records it: problem, symptoms, what you tried that didn't work, final solution, prevention steps. Three weeks later a similar issue surfaces during another feature. The plan-phase researcher automatically finds that note: "we hit this before, solution's here." Hours of debugging compressed to minutes.

Key difference: Anthropic's progress file is tonight's closing notes left for the morning shift, linear, one shift to the next. CE's docs/solutions/ is the restaurant's recipe binder that every employee reads on day one and every day after, searchable by anyone, anytime.

Closing notes solve continuity. A recipe binder solves accumulation. One is linear. One is exponential.

That's what "compound" means here. Not composite, but compound interest. Every task's output isn't just code, it's reusable experience. The longer you use it, the more your agent understands your project.

## The Three Layers Stacked

```text
Layer                         Tool                     Restaurant Version
──────────────────────────────────────────────────────────────────────────────────
Decisions (build or not)      gstack                   Head chef sets the menu
Planning (how to build)       CE /ce:plan             Researcher reviews past complaints
Execution                     CE /ce:work             Kitchen team cooks
Review (built correctly?)     CE /ce:review + gstack /qa  Food critic + inspector + panel
Knowledge (remember)          CE /ce:compound         Recipe binder everyone reads
```

These tools have different centers of gravity, not hard boundaries. gstack's strength is in decisions and real-world QA. Superpowers brings structured workflow discipline. CE's strength is in research-driven planning, deep review, and knowledge compounding. There's some overlap in review, and that's fine.

## How to Actually Use Them

If you're just getting started, pick one main framework first (gstack or CE) and get comfortable with it. Combining all three works, but multiple skill packs can have process conflicts and command overlaps. Get the workflow right with one, then layer.

For experienced users, here's the combined flow:

1. Clarify what you want. Use the 95% confidence prompt: "Interview me until you have 95% confidence about what I actually want, not what I think I should want."
2. /office-hours (gstack). Describe what you're building. Get challenged.
3. /plan-ceo-review (gstack). Product gate: is this worth building?
4. /plan-eng-review (gstack). Architecture gate: will this blow up later?
5. /ce:brainstorm (CE). Explore requirements and approaches, refine into a spec.
6. /ce:plan (CE). Research agents scan your project history, then produce a detailed implementation plan.
7. /ce:work (CE). Execute the plan with task tracking.
8. /ce:review (CE). Dynamic reviewer ensemble, minimum 6, scales with diff complexity.
9. /qa (gstack). Real browser, real clicks, real user testing on staging.
10. /ce:compound (CE). Record what you learned. Five subagents extract the lessons, write them to docs/solutions/.
11. Ship it. Next time you start at step 1, your plan phase already knows everything you learned this time.

Steps 1-4 make sure you build the right thing. Steps 5-9 make sure you build it well. Step 10 makes sure next time is faster.

Your agent writes code, fixes bugs, runs tests every day. After it's done, where does the knowledge go?

If the answer is "scattered across sessions, stepping on the same mines next time," compound is the layer you're missing.
