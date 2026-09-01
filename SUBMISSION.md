# WebMCP Challenge Submission — ThreatTriage WebMCP

## Project name

ThreatTriage WebMCP

## Tagline

Human-visible, agent-ready defensive cyber triage for schools and public-service teams.

## Live URL

https://joepetetiu.github.io/jorene-repo/

## Public repository

https://github.com/joepetetiu/jorene-repo

## Short description

ThreatTriage is a privacy-first browser app where people and AI agents collaborate on suspicious-message triage, local incident organization, defensive response planning, and awareness drafting. Instead of forcing an agent to infer controls and simulate clicks, the app exposes six bounded WebMCP tools through `document.modelContext.registerTool()`. Agent actions also update the same visible interface the human uses and appear in a human-readable Agent Activity panel.

## Why this use case is a strong fit for WebMCP

Cybersecurity triage is a poor place for a browser agent to guess. A suspicious message may contain unsafe links, urgent language, or untrusted instructions, while the user needs a fast, understandable workflow. WebMCP lets ThreatTriage expose explicit defensive capabilities with constrained JSON schemas and clear tool descriptions. The agent can analyze text, create a local case, generate a defensive plan, draft an unsent awareness notice, review the local case list, and update a case's local review status without searching the DOM or improvising navigation.

This is especially useful for schools, nonprofits, and public-service teams that may not have a dedicated security operations center. The interface remains usable manually, while a compatible agent can accelerate routine triage and organization without taking external action.

## How it creates a better user experience

The human and agent share one visible workspace. When the agent analyzes a message, the risk result appears in Quick Triage. When it creates or updates a case, the Local Incident Dashboard changes. When it builds a response plan or awareness draft, those outputs appear in the normal human UI. A dedicated Agent Activity panel makes tool usage visible instead of hiding agent actions behind a chat transcript.

ThreatTriage also keeps the safety boundary easy to understand: the static MVP has no backend or API key, stores demo cases in localStorage, never opens suspicious links, and never sends or publishes an awareness draft.

## What people and agents can do together that was difficult before

Without WebMCP, an agent has to inspect a security dashboard, infer which controls correspond to the user's intent, and simulate user interaction. That is brittle and potentially risky around untrusted incident content.

With ThreatTriage, the person can say: “Analyze this suspicious message, record it as a local incident, and prepare a high-risk phishing response plan. Do not open links or send anything.” The browser agent can discover purpose-built tools, invoke only those actions, and leave the user with a visible risk assessment, case record, response checklist, and agent activity trail. The human can then review or change the case status and ask the agent for a safe awareness draft.

## How WebMCP was implemented

ThreatTriage uses the WebMCP imperative API on `document.modelContext`. Six tools are registered with `await document.modelContext.registerTool(...)`, each with a name, natural-language description, JSON input schema, execution handler, and relevant `readOnlyHint` / `untrustedContentHint` annotations.

The execution handlers reuse the same application functions as the manual interface. This is intentional: agent actions are reflected in visible page state instead of creating a separate hidden automation path. Read-only tools return local analysis or plans; state-changing tools are limited to local browser case data. User-provided message and incident content is marked untrusted where applicable.

## WebMCP tools

1. `analyze_suspicious_message`
2. `create_incident_case`
3. `build_response_plan`
4. `draft_awareness_notice`
5. `list_incident_cases`
6. `mark_case_reviewed`

## Testing instructions

Open the live URL in ChatGPT's in-app browser or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled and the browser restarted.

The top status card should say **WebMCP tools registered**.

Click **Load safe demo sample**, then ask the browser agent:

> Analyze the suspicious message in this page, create a local incident case for it, and build a high-risk phishing response plan. Do not open any links or send anything.

Confirm that:

- Quick Triage displays an analysis;
- a new case appears in the Local Incident Dashboard;
- the defensive Response Plan populates; and
- the Agent Activity panel records the WebMCP tool calls.

Then ask:

> List the local incident cases and mark the phishing case reviewed.

Finally ask:

> Draft a short awareness notice for staff about suspicious payroll login links. Do not send or publish it.

The case should become Reviewed and the Awareness Notice should populate without any external action.

## Safety / privacy notes

ThreatTriage is defensive-only. It does not create phishing pages, malware, exploit instructions, persistence mechanisms, credential-harvesting flows, or unauthorized-access tooling. The triage score is a simple educational heuristic and should not be treated as a professional security verdict. All demo message and case data stays in the current browser.

## Hackathon provenance

The GitHub repository shell existed before the challenge but contained no application code. ThreatTriage and its WebMCP implementation were created from scratch on September 1, 2026, during the eligible WebMCP Challenge submission period. The dated commit history documents the full build.

## Suggested Devpost tags / Built With

WebMCP, JavaScript, HTML5, CSS, GitHub Pages, cybersecurity, privacy, human-in-the-loop, browser agents, localStorage
