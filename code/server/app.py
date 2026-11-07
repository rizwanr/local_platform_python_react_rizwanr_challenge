import os
import sys

# Load .env before anything else
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS

from src.services.db import db_service
from src.services.errors import ZenFlowError, error_handler

from src.routes.config import config_bp
from src.routes.webhook import webhook_bp
from src.routes.accounts import accounts_bp
from src.routes.account_sessions import account_sessions_bp
from src.routes.users import users_bp
from src.routes.instructors import instructors_bp
from src.routes.studios import studios_bp
from src.routes.workshops import workshops_bp


def create_app() -> Flask:
    app = Flask(__name__)

    session_secret = os.environ.get("SESSION_SECRET")
    if not session_secret:
        raise ZenFlowError("SESSION_SECRET not set")

    app.secret_key = session_secret
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SECURE"] = False
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["PERMANENT_SESSION_LIFETIME"] = 86400  # 24 hours in seconds

    client_port = os.environ.get("CLIENT_PORT", "3000")
    CORS(
        app,
        origins=[f"http://localhost:{client_port}"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
    )

    app.register_blueprint(config_bp)

    # Register webhook blueprint BEFORE the JSON-parsing before_request so it
    # can read the raw body needed for Stripe signature verification.
    app.register_blueprint(webhook_bp)

    # All other blueprints receive parsed JSON via Flask's built-in handling.
    app.register_blueprint(accounts_bp)
    app.register_blueprint(account_sessions_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(instructors_bp)
    app.register_blueprint(studios_bp)
    app.register_blueprint(workshops_bp)

    # Global error handler
    app.register_error_handler(Exception, error_handler)

    return app


def main():
    try:
        db_service.init()
        app = create_app()
        print("Server is listening on port 4242...")
        app.run(host="localhost", port=4242, debug=False)
    except Exception as e:
        print(f"Error during initialization: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
