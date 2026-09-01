# ThreatTriage WebMCP

**Human-visible, agent-ready defensive cyber triage for schools, nonprofits, and public-service teams.**

ThreatTriage is a privacy-first browser app that lets people and AI browser agents collaborate on suspicious-message triage, incident organization, defensive response planning, and awareness guidance. It uses the emerging **WebMCP** standard so agents can invoke explicit, bounded browser tools instead of guessing how to operate the page.

> Built for the OpenAI WebMCP Challenge 2026.

## Live demo

https://joepetetiu.github.io/jorene-repo/

## Why this is a strong fit for WebMCP

Security incidents are stressful and time-sensitive. A conventional browser agent must infer intent from page text, locate controls, and simulate clicks. ThreatTriage exposes purpose-built defensive actions through `document.modelContext.registerTool()`. The same actions update the normal human interface, so the user can see what the agent did and remain in the loop.

This makes the collaboration explicit:

1. A human provides a suspicious message or describes an incident.
2. An agent invokes a narrow WebMCP tool rather than navigating the UI by guesswork.
3. ThreatTriage performs the action locally and reflects the result in the visible dashboard.
4. The Agent Activity panel records the browser-agent action for human awareness.
5. State-changing actions are limited to local browser data; the app never sends messages, clicks suspicious links, changes accounts, or posts notices.

## WebMCP tools

ThreatTriage registers six tools:

- `analyze_suspicious_message` — locally evaluates suspicious-message indicators and displays risk, evidence, and safe guidance.
- `create_incident_case` — creates a local incident case in the visible dashboard.
- `build_response_plan` — generates defensive next steps for common incident scenarios and displays them in the page.
- `draft_awareness_notice` — prepares a concise safety notice and displays the draft without sending it.
- `list_incident_cases` — lets the agent and human review the same local case list.
- `mark_case_reviewed` — changes a case's local review status and updates the visible dashboard.

The implementation awaits each `registerTool()` call and uses WebMCP annotations including `readOnlyHint` and `untrustedContentHint` to make tool intent and trust boundaries clearer.

## Privacy and safety model

- No backend.
- No API key.
- Message and case data remain in browser `localStorage`.
- The triage engine never visits URLs found in suspicious messages.
- The project is defensive-only and does not provide malware, exploitation, persistence, credential-harvesting, or unauthorized-access functionality.
- User-provided incident text is treated as untrusted content in relevant WebMCP tools.
- Risk scoring is a simple educational heuristic, not a professional security verdict.

## Run locally

This is a dependency-free static app. From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Test WebMCP

Use either:

- ChatGPT's in-app browser, which supports WebMCP for the challenge; or
- Google Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled, followed by a browser restart.

When WebMCP is available, the status card at the top changes to **WebMCP tools registered**.

Suggested test prompt for a browser agent:

> Analyze the suspicious message in this page, create a local incident case for it, and build a high-risk phishing response plan. Do not open any links or send anything.

Then confirm that the results appear in Quick Triage, the Local Incident Dashboard, Response Plan, and Agent Activity.

## Demo flow

1. Open the live site in a WebMCP-capable browser.
2. Click **Load safe demo sample**.
3. Ask the agent to analyze the sample with `analyze_suspicious_message`.
4. Ask it to create a case using `create_incident_case`.
5. Ask it to build a defensive plan with `build_response_plan`.
6. Ask it to draft a staff awareness notice with `draft_awareness_notice`.
7. Show the visible Agent Activity log and local dashboard.

A <3-minute recording script is in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md).

## Hackathon provenance

The GitHub repository container existed before the hackathon but contained no application code. **ThreatTriage itself was created from scratch during the WebMCP Challenge submission period on September 1, 2026.** The dated commit history shows the addition of the entire application, WebMCP implementation, documentation, and challenge-specific improvements during the eligible period.

## Tech

- HTML5
- CSS
- Vanilla JavaScript
- WebMCP imperative API: `document.modelContext.registerTool()`
- Browser `localStorage`
- GitHub Pages

## License

MIT — see [`LICENSE`](LICENSE).
