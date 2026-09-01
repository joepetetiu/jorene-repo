# CivicGuard AI — WebMCP Challenge Demo Script

Target length: ~2 minutes 15 seconds.

## 0:00–0:15 — Problem

“Security incidents often start with one suspicious message. In schools, nonprofits, and public-service teams, the person receiving it may not have a security specialist beside them. CivicGuard AI gives both humans and browser agents a structured, defensive workflow.”

## 0:15–0:35 — Show the app

Open CivicGuard AI. Point out the WebMCP status card and the privacy-first local dashboard.

“Everything in this MVP runs in the browser. No suspicious-message content is uploaded by the app.”

## 0:35–1:00 — Tool 1: analyze

Load the sample suspicious SMS.

Ask a compatible agent:

> Analyze the suspicious message on this page using CivicGuard’s WebMCP tool. Do not open any link.

Show the structured risk result and evidence.

“Instead of guessing which buttons to click, the agent calls `analyze_suspicious_message` directly.”

## 1:00–1:20 — Tool 2: create a case

Ask:

> Create an incident case titled “Payroll phishing SMS” with the analysis context and detected risk.

Show the new case appearing in the Local Incident Dashboard.

“This is a side-effecting action, so the tool description tells the agent to use it only when the user asks to record the incident.”

## 1:20–1:40 — Tool 3: response plan

Ask:

> Build a defensive response plan for a phishing incident at this risk level.

Show the returned containment and verification steps.

“CivicGuard stays defensive-only: preserve evidence, verify independently, protect accounts, and escalate safely.”

## 1:40–1:58 — Tool 4: awareness

Ask:

> Draft a short awareness notice for staff about suspicious login links.

Show the notice.

“This turns one incident into reusable prevention guidance without exposing private case data.”

## 1:58–2:15 — Close

“CivicGuard AI demonstrates why WebMCP matters for high-stakes workflows: explicit tools, bounded actions, human control, and a UI that remains useful even without an agent. It is open source and designed to grow into a practical defensive assistant for resource-constrained community organizations.”
