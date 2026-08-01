import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

from app import app


ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html",
    "solutions.html",
    "ai-marketing.html",
    "ai-finance.html",
    "ai-hr.html",
    "request-demo.html",
    "book-call.html",
    "contact.html",
    "thank-you.html",
]


class DocumentParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.images = []
        self.labels = set()
        self.controls = []
        self.meta_names = set()
        self.title_seen = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a" and values.get("href"):
            self.links.append(values["href"])
        if tag == "img" and values.get("src"):
            self.images.append(values["src"])
        if tag == "label" and values.get("for"):
            self.labels.add(values["for"])
        if tag in {"input", "select", "textarea"} and values.get("id"):
            self.controls.append(values["id"])
        if tag == "meta" and values.get("name"):
            self.meta_names.add(values["name"])
        if tag == "title":
            self.title_seen = True


class FrontendTests(unittest.TestCase):
    def parse(self, name):
        parser = DocumentParser()
        parser.feed((ROOT / name).read_text(encoding="utf-8"))
        return parser

    def test_all_pages_have_required_document_metadata(self):
        for page in PAGES:
            with self.subTest(page=page):
                parser = self.parse(page)
                self.assertTrue(parser.title_seen)
                self.assertIn("viewport", parser.meta_names)
                self.assertIn("description", parser.meta_names)

    def test_relative_internal_links_resolve(self):
        for page in PAGES:
            parser = self.parse(page)
            for href in parser.links:
                if href == "#" or href.startswith(("http:", "https:")):
                    continue
                target, _, fragment = href.partition("#")
                target = target.split("?", 1)[0]
                target_path = ROOT / (target.removeprefix("./") or page)
                with self.subTest(page=page, href=href):
                    self.assertTrue(target_path.exists())
                    if fragment:
                        self.assertIn(fragment, self.parse(target_path.name).ids)

    def test_every_form_control_has_a_label(self):
        for page in ["request-demo.html", "book-call.html", "contact.html"]:
            parser = self.parse(page)
            self.assertEqual(set(parser.controls), parser.labels, page)

    def test_local_images_exist_and_are_not_empty(self):
        for page in PAGES:
            parser = self.parse(page)
            for source in parser.images:
                if source.startswith(("http:", "https:", "data:")):
                    continue
                image_path = ROOT / source.removeprefix("./")
                with self.subTest(page=page, source=source):
                    self.assertTrue(image_path.exists())
                    self.assertGreater(image_path.stat().st_size, 0)

    def test_no_secrets_or_forbidden_integrations(self):
        source_files = [ROOT / "app.py", ROOT / "js" / "forms.js", ROOT / "js" / "main.js"]
        source_files.extend(ROOT.glob("*.html"))
        text = "\n".join(path.read_text(encoding="utf-8", errors="ignore") for path in source_files).lower()
        for forbidden in ["supabase.co", "formspree", "postgresql://", "service_role", "dev-secret-key"]:
            self.assertNotIn(forbidden, text)
        self.assertNotRegex(text, re.compile(r"(?:api[_-]?key|secret)[\s]*[:=][\s]*['\"][^'\"]+", re.I))

    def test_flask_preview_serves_every_page_and_asset(self):
        client = app.test_client()
        for page in PAGES:
            route = "/" if page == "index.html" else f"/{page}"
            response = client.get(route)
            self.assertEqual(response.status_code, 200)
            response.close()
        for route in ["/css/style.css", "/js/forms.js"]:
            response = client.get(route)
            self.assertEqual(response.status_code, 200)
            response.close()

    def test_forms_target_backend_contract(self):
        forms_script = (ROOT / "js" / "forms.js").read_text(encoding="utf-8")
        self.assertIn("const FORMS_ENABLED = true", forms_script)
        self.assertIn("general_contact: 'contact'", forms_script)
        self.assertIn("strategy_call: 'book_call'", forms_script)
        self.assertIn("demo_request: 'request_demo'", forms_script)
        self.assertIn("payload.consent = formData.has('consent')", forms_script)


if __name__ == "__main__":
    unittest.main()
