# Rocket Club Commercial Frontend

A static, conversion-focused Rocket Club website built with HTML5, CSS3 and vanilla JavaScript. It can be hosted directly on GitHub Pages. A lightweight Flask server remains available for local preview and future backend integration.

## Pages

- `index.html`
- `solutions.html`
- `request-demo.html`
- `book-call.html`
- `contact.html`
- `thank-you.html`
- `privacy.html`
- `terms.html`
- `ai-cloud-terms.html`
- `refund-policy.html`
- `cookie-policy.html`
- `service-agreement.html`
- `industries.html`
- `agents.html`
- `how-it-works.html`
- `trust-center.html`

The three forms submit to the Rocket Club API at `POST /api/contact`. In local development, `js/forms.js` uses `http://127.0.0.1:5000`; on public hosts it uses `https://rocket-club-web-backend.onrender.com`.

The backend lives in `C:\Projects\rocket-club-backend` and connects server-side to Supabase PostgreSQL. Supabase credentials must remain in the backend environment and must never be added to this frontend.

Before publishing, deploy the backend, confirm `GET /api/health` returns HTTP 200, and update `API_BASE_URL` in `js/forms.js` if Render assigned a different hostname.

## Run locally

```bash
python app.py
```

The app will start on http://0.0.0.0:5000.

## Payments and Stripe

The public website currently collects quote requests; it does not start a payment. The Flask app contains an optional hosted Stripe Checkout endpoint for the $4,500+ Specialized AI Agent, but it must not be advertised or enabled in production until the production backend route, Stripe account, webhook, domain and end-to-end flow have all been configured and verified. Apple Pay availability depends on Stripe account, domain, device and browser eligibility; Visa is presented as a card network only when enabled by the Stripe account.

Configure these server-side environment variables before enabling production checkout:

```text
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
PUBLIC_BASE_URL=https://your-production-domain.com
```

Install the payment dependency with `pip install -r requirements-stripe.txt`.

Point a Stripe webhook at `POST /api/stripe-webhook` and subscribe to `checkout.session.completed`. Never add Stripe secret keys to HTML or JavaScript. Before launch, verify checkout and webhook behavior in test mode and then live mode. AI Cloud consumption is not included in the installation charge; token, request or processing-minute billing must be separately disclosed and authorized before activation.

You can also use any static file server from the project root. All internal routes and assets are relative for GitHub Pages subdirectory compatibility.
