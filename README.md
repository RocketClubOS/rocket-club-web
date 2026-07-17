# Rocket Club Commercial Frontend

A static, conversion-focused Rocket Club website built with HTML5, CSS3 and vanilla JavaScript. It can be hosted directly on GitHub Pages. A lightweight Flask server remains available for local preview and future backend integration.

## Pages

- `index.html`
- `solutions.html`
- `request-demo.html`
- `book-call.html`
- `contact.html`
- `thank-you.html`

Forms are intentionally disabled in `js/forms.js` until a real `POST /api/contact` backend is available. The disabled state preserves entered data and communicates that online submission is still being connected.

## Run locally

```bash
python app.py
```

The app will start on http://0.0.0.0:5000.

You can also use any static file server from the project root. All internal routes and assets are relative for GitHub Pages subdirectory compatibility.
