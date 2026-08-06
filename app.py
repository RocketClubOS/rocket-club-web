import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, abort, jsonify, request, send_from_directory

try:
    import stripe
except ImportError:  # Keep the static preview usable before Stripe is installed.
    stripe = None

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent
PAGES = {
    "index.html",
    "solutions.html",
    "ai-marketing.html",
    "ai-finance.html",
    "ai-hr.html",
    "request-demo.html",
    "book-call.html",
    "contact.html",
    "thank-you.html",
    "payment-success.html",
}

CHECKOUT_PRODUCTS = {
    "premium-specialized-agent": {
        "name": "Premium Specialized Agent installation",
        "unit_amount": 49900,
    }
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


@app.post("/api/create-checkout-session")
def create_checkout_session():
    secret_key = os.getenv("STRIPE_SECRET_KEY")
    if stripe is None or not secret_key:
        return jsonify({"error": "Secure checkout is awaiting Stripe account configuration."}), 503

    data = request.get_json(silent=True) or {}
    product = CHECKOUT_PRODUCTS.get(data.get("product_id"))
    email = str(data.get("email", "")).strip()
    specialization = str(data.get("specialization", "")).strip()
    if product is None:
        return jsonify({"error": "This product is not available for direct checkout."}), 400
    if not email or "@" not in email:
        return jsonify({"error": "Enter a valid business email before checkout."}), 400
    if not specialization:
        return jsonify({"error": "Choose the agent specialization before checkout."}), 400

    stripe.api_key = secret_key
    public_base_url = os.getenv("PUBLIC_BASE_URL", request.host_url.rstrip("/"))
    session = stripe.checkout.Session.create(
        mode="payment",
        customer_email=email,
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": product["name"],
                    "description": f"One-time setup - {specialization}",
                },
                "unit_amount": product["unit_amount"],
            },
            "quantity": 1,
        }],
        metadata={"product_id": data["product_id"], "specialization": specialization[:100]},
        success_url=f"{public_base_url}/payment-success.html?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{public_base_url}/request-demo.html?solution=AI%20Agent&payment=cancelled",
    )
    return jsonify({"checkout_url": session.url})


@app.post("/api/stripe-webhook")
def stripe_webhook():
    if stripe is None or not os.getenv("STRIPE_WEBHOOK_SECRET"):
        return jsonify({"error": "Webhook is not configured."}), 503
    try:
        event = stripe.Webhook.construct_event(
            request.get_data(),
            request.headers.get("Stripe-Signature", ""),
            os.environ["STRIPE_WEBHOOK_SECRET"],
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return jsonify({"error": "Invalid webhook signature."}), 400

    if event["type"] == "checkout.session.completed":
        app.logger.info("Paid agent installation checkout: %s", event["data"]["object"].get("id"))
    return jsonify({"received": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=app.config["DEBUG"])
