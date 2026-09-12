# Customer journey

The existing `book-call.html` URL now hosts a three-step implementation brief builder. Existing bookmarks continue to work. Primary navigation and agent/solution links enter this flow; agent and solution query parameters carry into the brief.

## Customer-facing sequence

1. Business details, scale and current tools.
2. Workflow, volume, budget preference, timing and data needs.
3. Rules-based draft scope, editable answers, contact details and consent.
4. Submit an implementation brief and quote request through the existing contact API.
5. Rocket Club reviews feasibility and sends a written scope and quote.
6. Customer approves the proposal and satisfies agreed payment/readiness requirements.
7. Rocket Club schedules implementation.

The form does not generate a binding quote, collect payment, approve a proposal, or book implementation. Steps 5–7 are an operational handoff, not an automated back-office workflow. The older direct checkout page remains in the repository but is not the main acquisition path.

## Delivery dependency

`js/forms.js` sends the brief as a contact request (`form_type: contact`) with a subject and a compiled message, preserving structured answers as additional fields. The existing external contact service must accept and deliver this payload. This repository's Flask preview does not implement `/api/contact`; do not treat a successful static preview or mocked test as proof of live lead delivery. Confirm receipt with an owner-approved end-to-end test before launch.

Answers are kept in the current page only; they are not written to local storage. Reloading clears the form. Unsuccessful submissions retain the current answers for retry. Do not ask customers to enter credentials or sensitive records.

## Verification

- `python -m unittest discover -s tests -v`
- `node --check js/forms.js`
- `node --check js/plan.js`
- `node --test tests/journey.test.cjs` (requires `jsdom` on Node's module path)

Journey tests use simulated responses, never live lead submissions. Coverage includes per-step validation, editing, query context, safe text rendering, payload size, offline retry and errors on earlier steps.
