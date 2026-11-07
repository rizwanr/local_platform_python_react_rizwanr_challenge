from flask import Blueprint, jsonify, request
from src.services import users as UserService
from src.services.sessions import get_user_id, set_user_id, clear_session, require_auth
from src.clients.stripe_client import StripeClient
from src.services.errors import (
    ZenFlowError,
    ZenFlowBadRequestError,
    ZenFlowUnauthorizedError,
)

users_bp = Blueprint("users", __name__)


@users_bp.route("/users/login", methods=["POST"])
def login():
    email = (request.json or {}).get("email", "").strip().lower()
    user = UserService.find_user_by_email(email)
    if not user:
        raise ZenFlowUnauthorizedError("Error logging in, user not found")

    set_user_id(user["id"])
    return jsonify(UserService.load_user_or_throw(user["id"]))


@users_bp.route("/users/logout", methods=["POST"])
def logout():
    clear_session()
    return jsonify(None)


@users_bp.route("/users", methods=["POST"])
def create_user():
    body = request.json or {}
    values = body.get("values", {})
    email = values.get("email", "").strip()
    name = values.get("name", "").strip()

    if not email:
        raise ZenFlowBadRequestError("Error creating user, missing email")
    if not name:
        raise ZenFlowBadRequestError("Error creating user, missing name")

    user = UserService.create_user(email, name)
    if not user:
        raise ZenFlowError(f"Error creating user, user not created {{'email': '{email}', 'name': '{name}'}}")

    set_user_id(user["id"])
    return jsonify(UserService.load_user_or_throw(user["id"]))


@users_bp.route("/users", methods=["GET"])
@require_auth
def get_user():
    user_id = get_user_id()
    user = UserService.load_user_or_throw(user_id)
    return jsonify(user)


@users_bp.route("/users/sync-account", methods=["POST"])
@require_auth
def sync_account():
    user_id = get_user_id()
    user = UserService.load_user_or_throw(user_id)

    stripe_client = StripeClient.get_sdk()
    account = stripe_client.v2.core.accounts.retrieve(
        user["stripeAccount"],
        {"include": ["configuration.merchant", "requirements"]},
    )

    # Only update if the account has a userId in metadata
    metadata = getattr(account, "metadata", None) or {}
    if isinstance(metadata, dict):
        has_user_id = bool(metadata.get("userId"))
    else:
        has_user_id = bool(getattr(metadata, "userId", None))

    if has_user_id:
        UserService.handle_account_update(account)

    updated_user = UserService.load_user_or_throw(user_id)
    return jsonify(updated_user)
