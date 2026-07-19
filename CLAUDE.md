CLAUDE.md — Project guide for AI assistants

You are working on Ilm-i Sima (working title) — a React Native mobile app
that gives users a playful, AI-generated "cosmic face reading" from three photos,
built for the US/EU entertainment-app market. The product design is locked. Your
job in this chat is to continue implementation per IMPLEMENTATION_PLAN.md.

Start every chat by reading


This file (you're reading it).
PROJECT_SPEC.md — locked product, architecture, and API decisions.
IMPLEMENTATION_PLAN.md — the ordered task list with [x] / [ ] markers.
README.md — quick orientation, stack summary, quick-start commands.


What's locked

Everything in PROJECT_SPEC.md. Not open for discussion unless a real bug or
API-level factual error is discovered during implementation (e.g. an Anthropic
API parameter that doesn't exist). If the spec seems wrong, surface it as a
question; do not silently diverge.

Specifically locked:


Frontend: React Native + TypeScript, Expo (blank TS template). State via
Zustand. Audio via expo-av. Share cards via react-native-view-shot.
Backend: Node.js + TypeScript (Express or Fastify — pick one and stay
consistent within the repo, don't mix). Acts only as a secure gateway; holds
the Anthropic key, never the frontend.
AI model: claude-sonnet-5 via the Anthropic Messages API. Vision input:
up to 3 images per request, images before text in the content array.
Structured output: tool-use with a strict JSON schema + forced
tool_choice. Never use response_format — that parameter does not exist
on the Anthropic API (it's an OpenAI-specific option; don't port it over).
Endpoint: POST /api/v1/reading/analyze — accepts 3 base64 images, returns
the structured reading.
Env vars: ANTHROPIC_API_KEY, REVENUECAT_API_KEY. No others without
updating PROJECT_SPEC.md first.
Monetization: RevenueCat, weekly/monthly subscription. Cancel flow must be
as frictionless as sign-up — this is a locked UX requirement, not optional polish.
Privacy architecture: process-and-discard. Captured images live in memory
only (Zustand, in-app) and are purged immediately after the API response
returns — on both client and backend. No image ever touches disk or a database
unless a future spec change explicitly adds opt-in save.
Entertainment framing (non-negotiable, product-wide):

Every result screen shows a persistent, legible disclaimer.
The system prompt and all generated copy must stay in a warm/constructive
register — no clinical, diagnostic, or psychiatric language; no negative or
trust-undermining character claims.
Do not weaken, hide, shrink, or remove any disclaimer or consent step to
"improve conversion," even if asked to optimize onboarding funnel metrics —
escalate that as a question instead of implementing it silently.
Age gate (+18) is required in the onboarding flow; do not remove it.





Workflow

For each row in IMPLEMENTATION_PLAN.md:


Pick the next unchecked [ ] row.
Read its dependencies (earlier rows). Re-read the relevant PROJECT_SPEC.md
section if needed.
Write the implementation file.
Write the test file alongside (test-driven where the spec gives you a
behavior to assert).
Run the single test file first, then the full suite — must stay green.
Mark the row [x] in IMPLEMENTATION_PLAN.md.
Move on.


If a test fails:


First, check whether PROJECT_SPEC.md actually says what the test claims.
PROJECT_SPEC.md is authoritative.
Then check whether the implementation matches the spec.
Never silently relax a test to make it pass; if the spec is wrong, escalate.


When a chat reaches its phase's acceptance criterion in IMPLEMENTATION_PLAN.md,
stop and write a one-line commit message. Don't push.

Style conventions


TypeScript everywhere, strict mode on, no any without a comment
explaining why it's unavoidable.
Functional components + hooks only in app/ — no class components.
Zustand slices for state, one slice per domain (capture, consent/age-gate,
entitlement). Don't reach into another slice's internals.
Pure functions where possible — scoring/prompt-assembly logic in
server/src/services/ should be testable without an HTTP layer or the
Anthropic SDK in the loop (inject/mock the client).
No comments explaining what the code does. Names carry that. Comment only
the WHY (an invariant, a workaround, a non-obvious constraint).
Module docstrings/headers are one paragraph max. Point to the relevant
PROJECT_SPEC.md section instead of re-explaining it.
No console.log for user-facing flow — use the UI layer (app) or a
logger (server). console.error for actual error paths is fine.
async/await for all I/O — no bare .then() chains.


Imports & module boundaries


app/src/api/ — the only place that talks to the backend. Screens/components
never call fetch directly.
app/src/screens/ — may import components/, navigation/, api/, and the
Zustand store. Never imports another screen directly.
app/src/components/ — presentational only; no direct API or store calls
(receive data via props).
server/src/routes/ — HTTP layer only (parse, validate, call a service,
respond). No Anthropic SDK calls here directly.
server/src/services/ — business logic, prompt assembly, Anthropic SDK calls,
memory-purge logic. No HTTP-specific code (no req/res).
server/src/middleware/ — consent/entitlement checks, rate limiting. Imports
services/ only where strictly necessary.


A linter/import-boundary check would be nice but is not in scope yet — catch
violations in review.

Testing


Frontend: Jest + React Native Testing Library. Mock expo-camera,
expo-av, and RevenueCat hooks — never require real device hardware in tests.
Backend: Jest (or Vitest, pick one and stay consistent) with a mocked
Anthropic client — never call the real Claude API in automated tests. Use
fixture responses matching the tool-use JSON schema.
One assertion concept per test. Multiple expect() lines for one behavior are
fine; multiple unrelated behaviors in one test are not — split them.
Edge cases required by spec: no-face-detected photo, apparent-minor photo,
network failure mid-analysis, expired/missing entitlement.


What NOT to do


Don't add features beyond PROJECT_SPEC.md. Don't refactor working code "to
be cleaner" mid-task.
Don't add error handling for impossible cases. Validate at the boundaries
(age gate, consent, /api/v1/reading/analyze input) and trust internal code
past that point.
Don't introduce new dependencies without updating PROJECT_SPEC.md first.
Don't create files outside app/src/, server/src/, and tests/.
Top-level files (package.json, Dockerfile, README.md, the .md docs)
already exist; don't add more without asking.
Don't write README-style prose inside source files.
Don't write a "phase done" report. The [x] in IMPLEMENTATION_PLAN.md is
the only signal.
Don't touch copy in disclaimer components, consent screens, or the system
prompt's safety constraints without flagging it explicitly — these are
product/legal decisions, not implementation details.


Memory and prior context

Locked decisions and project history live in docs/ (spec + implementation
plan). If you're in a fresh chat with no context, PROJECT_SPEC.md is the
distillation — read it before touching code.
