# Rocket Club Commercial Frontend

A static, conversion-focused Rocket Club website built with HTML5, CSS3 and vanilla JavaScript. It can be hosted directly on GitHub Pages. A lightweight Flask server remains available for local preview and future backend integration.

## Pages

- `index.html`
- `solutions.html`
- `request-demo.html`
- `book-call.html`
- `contact.html`
- `thank-you.html`

The three forms submit to the Rocket Club API at `POST /api/contact`. In local development, `js/forms.js` uses `http://127.0.0.1:5000`; on public hosts it uses `https://rocket-club-web-backend.onrender.com`.

The backend lives in `C:\Projects\rocket-club-backend` and connects server-side to Supabase PostgreSQL. Supabase credentials must remain in the backend environment and must never be added to this frontend.

Before publishing, deploy the backend, confirm `GET /api/health` returns HTTP 200, and update `API_BASE_URL` in `js/forms.js` if Render assigned a different hostname.

## Run locally

```bash
python app.py
```

The app will start on http://0.0.0.0:5000.

You can also use any static file server from the project root. All internal routes and assets are relative for GitHub Pages subdirectory compatibility.
