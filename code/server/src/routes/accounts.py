from flask import Blueprint, jsonify
from src.clients.stripe_client import StripeClient

accounts_bp = Blueprint("accounts", __name__)


@accounts_bp.route("/accounts/<account_id>", methods=["GET"])
def get_account(account_id: str):
    # Using v2 Accounts API with include parameter for explicit field retrieval
    stripe_client = StripeClient.get_sdk()
    account = stripe_client.v2.core.accounts.retrieve(
        account_id,
        {"include": ["configuration.merchant", "identity", "requirements"]},
    )
    return jsonify(account.to_dict() if hasattr(account, "to_dict") else dict(account)), 200
