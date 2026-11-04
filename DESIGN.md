# Rocket Club design context

## Accepted direction
Restore and preserve the original homepage hero from before this session: its existing copy, layout, capabilities and `static/images/hero/rocket-cyber-gorilla-v6.webp`. The user rejected the replacement hero, generated replacement artwork, Three.js presentation, model controls and rendering experiments. Do not reintroduce them without a new explicit request. Shared styles remain owned by `css/style.css`.

## Floating assistant
Keep Victoria as the accepted change: the natural smartphone-style adult portrait `static/images/agents/victoria-avatar-v2.png`, her name, and the launcher subtitle "Customer Service". Preserve the clear AI identity in the chat. Widget code and styles live in `js/rocket-widget.js` and `css/rocket-widget.css`. Keep the existing API/session contract, accessible controls and connection states. This is a frontend identity; do not claim the backend persona was changed.

## Scope
Preserve changes that were already present before this session in `app.py`, `css/style.css` and `js/main.js`. Unused generated images and the uploaded model are retained as assets; they must not be requested or displayed by the restored homepage.

## Capability artwork
Use three NEW generated artworks in capability-collection.png: cinema lens for Create, ascending glass pillars for Grow, titanium robot arm for Automate. Display the three equal panels independently through scoped CSS background positioning. Do not reuse the agent portraits. Preserve current palette pending user evaluation.

## Industry preview
User rejected text-heavy directory. Use four large photographic industry panels in two columns, stacking on mobile: dental clinic, legal office, modern property, local services workshop. Generated photography lives in static/images/industries/industry-collection.png; four quadrant positions show separate scenes. Keep copy short, white text over a dark bottom gradient, lime on hover, visible focus and reduced-motion support. Preserve all industry destinations and global palette.

## Sitewide editorial images
Extend the approved warm architectural photography across industries, Quick Wins, service pages, solutions categories, implementation and trust. Use real-world illustrative scenes, never fabricated client testimonials or screenshots of nonexistent software. Six new industry scenes and six new business scenes supplement the first four industries. Export individual JPEGs to static/images/editorial; use descriptive alt text, lazy loading, fixed aspect ratios and responsive hero crops. Existing agent portraits, Victoria, homepage hero and global palette stay intact. Legal and transactional forms remain uncluttered.

Verification: 33 image placements on nine pages; 16 individual JPEG assets served successfully from localhost. Existing frontend suite: eight tests pass. Source photography is illustrative generated imagery.

## Sales journey
Two clear buying routes precede Quick Wins: focused product catalog or custom implementation brief. Native details/summary FAQs precede the final CTA and explain existing terms. No invented results, deadlines or pricing. Company links go to the visible contact page because the legacy About section is hidden. Plan: DEVELOPMENT-PLAN.md.

## Business model — owner decision
Rocket Club OS base software, POS and invoicing are FREE. Revenue comes from scoped personalization, configuration, integrations and engineering. Lead with this offer on homepage and dedicated rocket-club-os.html. No invented subscription limits, hosting commitments or universal custom-work prices. Access URL is not in this repository; use honest contact-for-access CTA until owner supplies it. Existing creative-product checkout is separate. Legacy quote calculator/agent promotion needs a separate pricing review before changing charges.

## Scope correction — additive OS promotion
Owner requests dedicated Business Growth Software sections immediately above AI Agents, a dedicated page at rocket-club-os.html and a menu entry. Keep the other landing sections and their relative order. The previous whole-site product-first reorganization is not approved for implementation. Real OS signup URL remains pending; access links currently lead to an honest contact flow.

## Billing & Pricing — additive catalog
Owner requested all proposed pricing in a dedicated menu section. billing.html is a public marketing catalog, not an account portal or active checkout. Shared navigation links to Billing & Pricing; collapse the expanded menu through 1440px. Reuse existing home-hub colors and Space Grotesk / Oxanium tokens. css/billing.css owns page-specific layouts: paired free OS and scoped $499 agent offers, native expandable catalog tables, optional care cards, usage explanation and payment journey.
The $499 promotion covers customer service on one existing landing page plus Rocket Club OS, not Meta/SMS or action automation. Catalog prices require written scope. No invented automatic billing, rate unit, spending-limit implementation or signup endpoint. Internal API proposal remains cost times 19/12; units and rate schedule must be verified in OS before publication. The earlier $100/7-day cadence is a proposal, not an implemented promise. Legacy pages/checkouts need a separately coordinated catalog migration; this page sends only quote requests to book-call.html.

Billing value emphasis: the owner wants free administration software to lead the offer. Give Rocket Club OS a full-width lead panel, three concrete benefits (administration, POS, invoices), $0 software pricing and access CTA before the optional agent. Do not invent savings, unlimited usage, additional modules or a trial deadline.

Owner clarification: Finance, Marketing, HR and Operations are FREE standard OS modules, together with POS and invoicing. Show all six on billing and the OS page. Any finance/HR/marketing/operations prices refer to custom professional implementations, never access fees for standard modules. Do not invent detailed module capabilities beyond confirmed information.
