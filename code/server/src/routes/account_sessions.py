"""
Milestone 2: Setting up embedded components

Return an AccountSession client secret for the connected account.
"""

from flask import Blueprint, jsonify
from src.services.sessions import get_user_id
from src.services.users import load_user_or_throw
from src.services.accounts import create_account_session
from src.services.errors import ZenFlowNotFoundError

account_sessions_bp = Blueprint("account_sessions", __name__)


@account_sessions_bp.route("/account-sessions", methods=["POST"])
def post_account_session():
    # TODO: Integrate Stripe
    pass
