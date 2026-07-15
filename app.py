import os

from dotenv import load_dotenv
from flask import Flask, render_template

load_dotenv()

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config["DEBUG"] = os.getenv("FLASK_DEBUG", "0") == "1"
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=app.config["DEBUG"])
