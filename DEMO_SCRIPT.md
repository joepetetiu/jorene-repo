# ThreatTriage WebMCP — Demo Script

Target length: **2:10–2:35**. Keep the final YouTube video under 3 minutes.

## 0:00–0:18 — Problem and hook

**Narration**

“Suspicious messages create two problems at once: people need help quickly, but an AI browser agent should not guess its way through a security workflow. ThreatTriage uses WebMCP to expose narrow defensive tools that both the human and the agent can understand.”

**On screen**

Show the ThreatTriage home page and the green **WebMCP tools registered** status.

## 0:18–0:35 — Human starts the case

Click **Load safe demo sample**.

**Narration**

“This sample imitates a payroll phishing SMS. ThreatTriage does not visit the link and sends no message content to a server. The app is static and stores demo cases locally in the browser.”

## 0:35–1:05 — Agent invokes WebMCP

Give the browser agent this prompt:

> Analyze the suspicious message in this page, create a local incident case for it, and build a high-risk phishing response plan. Do not open any links or send anything.

**Narration while the agent acts**

“Instead of searching the DOM and clicking controls, the agent can discover explicit WebMCP tools registered with `document.modelContext.registerTool()`. The analysis is reflected in the same interface the human sees.”

Show:
- Quick Triage risk result
- the newly created local case
- the Response Plan
- Agent Activity entries

## 1:05–1:30 — Human/agent shared state

**Narration**

“The useful part is not just tool calling. Agent actions update the ordinary human interface, and ThreatTriage keeps a visible activity trail. The human can inspect the case, change its review status, or ask the agent to do that explicitly.”

Ask the agent:

> List the local incident cases and mark the phishing case reviewed.

Show the dashboard status changing to **Reviewed** and the matching Agent Activity entry.

## 1:30–1:52 — Awareness draft

Ask:

> Draft a short awareness notice for staff about suspicious payroll login links. Do not send or publish it.

**Narration**

“The agent can also prepare a safe awareness draft, but ThreatTriage only displays the text. It never posts or sends it automatically.”

Show the Awareness Notice section populate.

## 1:52–2:18 — Safety and architecture

**Narration**

“All six tools are bounded and defensive. Read-only and untrusted-content annotations clarify intent and trust boundaries. State-changing tools affect only local browser data. There is no backend, no API key, and suspicious URLs are never opened.”

Briefly show `app.js` at the `document.modelContext.registerTool()` implementation.

## 2:18–2:30 — Close

**Narration**

“ThreatTriage demonstrates a web where humans keep visibility and control while agents get reliable, structured actions. That is the kind of security workflow WebMCP makes possible.”

End on the full app with the Agent Activity panel visible.
