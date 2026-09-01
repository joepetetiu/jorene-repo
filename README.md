# CivicGuard AI

**Agent-ready defensive cyber triage for schools, nonprofits, and public-service teams.**

CivicGuard AI is a privacy-first browser app that helps people and AI agents work together to assess suspicious messages, organize incident details, generate safe response plans, and prepare awareness guidance. It uses the emerging **WebMCP** standard so browser agents can call structured tools instead of guessing how to operate the interface.

> Built for the OpenAI WebMCP Challenge 2026.

## Why WebMCP matters here

Security incidents are stressful and time-sensitive. Traditional agents must inspect page text and simulate clicks. CivicGuard exposes explicit, bounded tools through `document.modelContext.registerTool()` so an agent can reliably help with defensive workflows while the user remains in control.

## WebMCP tools

CivicGuard registers these tools when WebMCP is available:

- `analyze_suspicious_message` — locally evaluates suspicious-message indicators and returns a risk tier plus evidence.
- `create_incident_case` — creates a local incident case in the visible dashboard.
- `build_response_plan` — generates defensive next steps based on scenario and risk.
- `draft_awareness_notice` — prepares a concise, non-alarmist safety notice for a chosen audience.
- `list_incident_cases` — returns cases currently stored in the browser.
- `mark_case_reviewed` — marks a case reviewed and updates the visible UI.

All demo data stays in the browser via `localStorage`. No message content is uploaded by this static MVP.

## Run locally

Because this is a static app, you can serve the repository with any local HTTP server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Test WebMCP

The 2026 WebMCP draft exposes the producer API on `document.modelContext`. In a compatible Chromium build, enable the WebMCP testing/experimental feature if required, reload CivicGuard, and check the status badge in the app.

From DevTools, a supporting browser can inspect tools with:

```js
await document.modelContext.getTools()
```

## GitHub Pages

This repository is intentionally dependency-free and can be deployed directly from the repository root using GitHub Pages.

## Demo flow

1. Paste a suspicious SMS/email into **Quick Triage** or load the sample.
2. Ask an agent to use `analyze_suspicious_message`.
3. Ask it to create a case with `create_incident_case`.
4. Ask for a defensive response plan using `build_response_plan`.
5. The human reviews the dashboard and marks the case reviewed, or the agent uses `mark_case_reviewed` when asked.
6. Ask for an awareness notice tailored to staff, students, volunteers, or the public.

A short submission script is available in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md).

## Safety boundaries

CivicGuard is defensive-only. It does not generate phishing kits, credential-harvesting pages, malware, exploit chains, persistence techniques, or instructions for unauthorized access. Risk scoring is heuristic and educational, not a substitute for a professional security investigation.

## Tech

- HTML5
- CSS
- Vanilla JavaScript
- WebMCP imperative API (`document.modelContext.registerTool`)
- Browser `localStorage`
- No backend and no API keys required

## License

MIT
