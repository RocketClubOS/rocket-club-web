import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, abort, send_from_directory

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent
PAGES = {
    "index.html",
    "solutions.html",
    "request-demo.html",
    "book-call.html",
    "contact.html",
    "thank-you.html",
}

app = Flask(__name__, static_folder=None)
app.config["DEBUG"] = os.getenv("FLASK_DEBUG", "0") == "1"


@app.route("/")
def index():
    return send_from_directory(PROJECT_ROOT, "index.html")


@app.route("/<page>")
def page(page):
    if page not in PAGES:
        abort(404)
    return send_from_directory(PROJECT_ROOT, page)


@app.route("/<directory>/<path:filename>")
def asset(directory, filename):
    if directory not in {"css", "js", "static"}:
        abort(404)
    return send_from_directory(PROJECT_ROOT / directory, filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=app.config["DEBUG"])
