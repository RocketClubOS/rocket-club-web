> Current scope: additive only. Place Business Growth Software / Rocket Club OS sections immediately above AI Agents, keep a dedicated page and menu entry. Do not reorganize the remaining landing page. Broad architecture changes below are future proposals, not approved implementation scope.

# Rocket Club Web — Product-led growth implementation plan

Status: planning only; no implementation or publication authorized by this document.
Owner: Gerson / Rocket Club. Updated: 2026-10-26.

## 1. Product decision
Primary objective: acquire qualified business registrations for Rocket Club OS, then help those businesses complete a useful first task and return to the product.
Business model: base OS, existing POS and invoicing software are free. Revenue comes from optional configuration, migration, integrations, automation, custom engineering and agreed support.
A registration is not activation. An offer click is not a sale. Free users must remain able to use the promised free functionality without purchasing services.
The prior service-first plan is superseded by this product-first plan.

## 2. Current evidence and gaps
- Website is static HTML/CSS/JavaScript with Flask routes and payment endpoints; it is not the Rocket Club OS application.
- Existing book-call.html / js/plan.js flow creates a service brief, not an OS account. Keep these journeys distinct.
- The real OS registration/login URL and account/onboarding contracts have not been found in this repository. These are dependencies, not permission to invent a signup page that does nothing.
- rocket-club-os.html exists, but app.py's PAGES allowlist does not contain it. Static localhost can succeed while Flask returns 404. Validate both hosts.
- Prices are duplicated across HTML, js/main.js, request form calculations and app.py. Existing $499 agent promotion conflicts with a $4,500 estimate and a separate premium checkout product.
- Proposed new prices are recommendations awaiting catalog decisions; they are not automatically production checkout amounts.
- Images and homepage sections have been revised locally, with many uncommitted files. Preserve unrelated existing work and review scoped diffs before release.
- Eight existing frontend tests passed previously. Node navigation/journey suites did not run because jsdom was missing. HTTP success is not visual or interaction verification.

## 3. Target journey and ownership
1. Discover: a business sees a relevant demonstration. Web owns the landing message and attribution.
2. Understand: it sees real OS capabilities, what is free and optional paid help. Web owns accurate product explanation.
3. Register: primary CTA sends users to the actual OS registration experience. OS owns account creation, authentication and validation.
4. Choose first task: invoice, products or POS, based on released features. OS owns onboarding and task state.
5. Activate: complete a first valid useful action, measured on the backend. OS owns confirmation and persistence.
6. Return: re-open saved work and perform another useful action. OS owns continuity; marketing follow-up requires appropriate consent.
7. Request improvement: offer help in context when a real need appears. OS links to Web's customization brief with a non-sensitive service identifier.
8. Convert: scope, proposal, acceptance and payment. Web/backend own the commercial record; fulfillment starts only according to agreed terms.
9. Retain: verify the delivered improvement, support the client and invite relevant next steps.

## 4. Website information architecture
Top navigation: Product, What's Free, Industries, Customization, Help; secondary Sign In; primary Create Free Account.
- Home: product-first acquisition page.
- Rocket Club OS: capabilities, real demonstrations, included functions, access requirements and FAQ.
- Industries: show relevant starting tasks, with registration as the primary next step and customization secondary.
- Customization: configuration, migration, integrations, AI/automation and engineering. Link the existing brief flow; do not require a quote to access free software.
- Creative/Quick Win services: secondary catalog rather than the main funnel entrance.
- Trust, contact and policy pages: easy to find through Help/footer.
Existing URLs continue to work; any route consolidation requires redirects and link checks.

## 5. Homepage composition
A. Hero: concise free-software promise; Create Free Account and See It in Action. Retain approved Rocket Club character artwork unless a separately reviewed composition requires a change.
B. Actual product demonstration: show creating an invoice or a POS action in the real product. Use a real recording or screenshots with authorized sample data. Generated architectural imagery is decorative, never proof that a product screen or customer result exists.
C. What's free: OS / POS / invoices plus only verified released functions. State any real limitations and external costs clearly near the offer.
D. Three steps: create account, choose first task, complete a useful result. Do not promise an unmeasured completion time.
E. Industry stories: preserve approved photographic direction; connect each story to a specific product use case.
F. Optional help: self-service is free; services tailor or extend it. A concise comparison leads to a detailed service page.
G. Questions: free access, data, existing tools, payment costs, support and optional customization.
H. Final signup CTA; login available for returning users.

## 6. Implementation phases and acceptance gates

### Phase 0 — Verify product and freeze the offer (P0)
Deliverables: feature matrix (released / beta / planned), free-inclusion matrix, real URLs, supported signup modes, onboarding owner, optional service catalog.
Confirm software license/access terms, supported devices, what POS payments actually do, hardware requirements, hosting obligations, usage costs and support boundaries. Do not invent unlimited hosting or unlimited AI usage.
Acceptance: every public capability is demonstrable; signup and login routes are verified; free vs paid distinction is approved; no hidden mandatory service purchase.
Dependencies: access to OS repository or its accountable developer, product environment and owner decisions.

### Phase 1 — Implement the acquisition website (P0)
Deliverables: approved homepage composition, updated OS page, simplified navigation, accurate free offer, actual product demo and contextual industry CTAs.
Correct Flask allowlist, add explicit registration/login configuration and validate allowed redirect destinations. Use ordinary links for external signup; never send credentials through the marketing website.
Acceptance: all primary CTAs reach functional registration, login is separate, keyboard/mobile layouts work, the free offer is consistent across pages, both Flask and static hosting resolve supported routes.
Gate: review one desktop and one narrow-screen preview before propagating the design across pages.

### Phase 2 — Activate users inside OS (P0, separate app work)
Deliverables: minimal onboarding, first-task choice, progress persisted, sample-data path clearly marked, useful empty states and help from Victoria where supported.
Make configuration skippable where it does not block correctness. Do not count demo records as real customer activity. Show recovery for duplicate email, expired confirmation, interrupted onboarding, unavailable APIs and failed saves.
Acceptance: a new account completes a valid first task and can return to it; an existing user signs in without repeating onboarding; basic use never depends on paid customization.
Do not claim this phase completed through HTML changes alone.

### Phase 3 — Sell relevant optional improvements (P1)
Deliverables: service catalog, context-aware help links, shorter customization brief and proposal handoff.
Examples: import difficulty -> migration service; connecting a tool -> integration service; new business workflow -> scoped engineering.
Use the agreed price only for a bounded deliverable. Avoid fake discounts and generic prices that conceal incompatible scopes. Do not show all upsells immediately or obstruct free tasks.
Centralize product IDs, descriptions, payment type, scope, amount and currency. Server owns checkout amounts; frontend renders the matching catalog. Define one-time vs recurring services explicitly.
Audit the legacy premium-agent endpoint and existing payment/session compatibility before retiring it. Never change historical orders by changing a display price.
Acceptance: no contradictory quote totals; paid services are optional; stored requests include source service and need; checkout can only use allowed server-side products; success is based on confirmed backend/payment state.

### Phase 4 — Measurement and release (P0/P1)
Define privacy-aware first-party events before selecting analytics tooling. No passwords, invoice contents, phone numbers, email addresses or sensitive business data in analytics payloads.
Instrument successful account creation and activation in OS/backend, not inferred from CTA clicks. Establish a baseline before setting numerical conversion targets or running A/B tests.
Release with a scoped diff, staging checks, test payment mode, production configuration review, a rollback reference and a post-release smoke test. Publish only within explicit release authorization.

## 7. Measurement contract
- signup_cta_clicked: Web action, include placement and campaign identifiers where permitted.
- signup_completed: OS backend confirms creation; deduplicate per account.
- onboarding_started / first_task_selected: OS event, allowed task identifier only.
- business_activated: one agreed non-demo successful task; define whether a draft invoice is sufficient before instrumenting.
- meaningful_return: another useful action on a later day, not just a login.
- customization_requested: backend confirms saved request.
- proposal_accepted and payment_confirmed: commercial/backend records.
Primary early metrics: signup conversion = completed signups / eligible visitors; activation rate = activated businesses / completed signups; time to first value; week-one meaningful return; activated-to-customization request rate.
Report date windows, cohorts and sample sizes; do not invent rates or interpret small samples as proof.

## 8. Quality and release checks
- Restore reproducible Node test dependencies in a project-owned package manifest/lockfile; execute existing navigation and journey tests plus frontend suite.
- Add meaningful tests for the new OS route, correct signup destinations, consistent catalog amounts and preserving intent through the customization flow.
- Real browser coverage at 390px, 768px and desktop widths, keyboard navigation, FAQ, menu, return/back behavior, reduced motion and image loading failures.
- Check product demo crops, real-image legibility and focus visibility. Existing eight static tests cannot establish these properties.
- Measure performance before claiming targets; aim for good Core Web Vitals, compress imagery, use srcset where needed and reserve layout space.
- Check form success and failure paths without sending test messages to real customers. Test payments in test mode.
- No tracking or contact follow-up without the required policy/consent basis.

## 9. Work order and dependencies
Start with Phase 0, then homepage/navigation and signup handoff. OS activation work can proceed once the separate application is available. Paid catalog consolidation follows the confirmed product boundary. Measure the complete journey before expanding acquisition campaigns.
Do not give a fixed delivery date until the OS integration and available modules are inspected. The largest uncertainty is the product handoff, not the marketing page styling.

## 10. Definition of done
A visitor understands the free offer, creates a real account, completes a real first task, returns to saved work and can request a clearly priced optional improvement. No broken host-specific routes, fake screenshots, conflicting prices or payment requirement to unlock promised free functionality. Release evidence includes real browser checks and end-to-end verification, not only asset HTTP responses.
