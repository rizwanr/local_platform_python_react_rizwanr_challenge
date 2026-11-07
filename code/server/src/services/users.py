"""
Milestone 1: Onboarding a new user

In `create_user`, create a Stripe Connect account for the new instructor and set up
platform billing by creating a Stripe Customer and subscribing them to the ZenFlow
platform plan with a 30-day trial using `get_or_create_platform_price_id`.
"""

import uuid
from datetime import datetime, timezone

from src.services.db import db_service
from src.clients.stripe_client import StripeClient
from src.services.platform import get_or_create_platform_price_id
from src.services.errors import ZenFlowError, ZenFlowBadRequestError


def load_user_or_throw(user_id: str) -> dict:
    user = db_service.load_data("users", user_id)
    if not user:
        raise ZenFlowError(f"User {user_id} not found")
    return user


def user_exists(user_id: str) -> bool:
    return db_service.load_data("users", user_id) is not None


def find_user_by_email(email: str):
    results = db_service.search_data("users", lambda u: u.get("email") == email)
    if len(results) > 1:
        raise ZenFlowError(
            "Multiple users found with this email, please adjust your database"
        )
    return results[0] if results else None


def update_user(user_id: str, updates: dict) -> dict:
    user = load_user_or_throw(user_id)
    user.update(updates)
    db_service.save_data("users", user_id, user)
    return user


def create_user(email: str, name: str) -> dict:
    """
    Milestone 1: Onboarding a new user
    Create a Stripe Connect v2 account, platform Customer, and platform subscription.
    """
    existing = find_user_by_email(email)
    if existing:
        raise ZenFlowBadRequestError(f"User with email {email} already exists")

    user_id = f"usr_{uuid.uuid4()}"
    now = datetime.now(timezone.utc).isoformat()

    # TODO: Integrate Stripe

    new_user = {
        "id": user_id,
        "name": name,
        "email": email,
        "createdAt": now,
        "updatedAt": now,
        "stripeAccount": stripe_account.id,
        "chargesEnabled": False,
        "disabledReason": None,
        "detailsSubmitted": False,
        "stripeCustomerId": customer.id,
        "subscriptionId": subscription.id,
        "subscriptionStatus": subscription.status,
    }

    db_service.save_data("users", user_id, new_user)
    return new_user


def handle_account_update(account) -> None:
    """Sync a v2 Connect account to the local DB."""
    metadata = getattr(account, "metadata", None) or {}
    if isinstance(metadata, dict):
        user_id = metadata.get("userId")
    else:
        user_id = getattr(metadata, "userId", None)

    if not user_id:
        return

    # v2 accounts use configuration.merchant.applied instead of charges_enabled
    try:
        charges_enabled = account.configuration.merchant.applied is True
    except AttributeError:
        charges_enabled = False

    # Derive details_submitted: no requirement entries are awaiting action from user
    try:
        entries = account.requirements.entries or []
        details_submitted = all(
            getattr(e, "awaiting_action_from", None) != "user" for e in entries
        )
    except AttributeError:
        details_submitted = False

    update_user(user_id, {
        "chargesEnabled": charges_enabled,
        "disabledReason": None,
        "detailsSubmitted": details_submitted,
    })


"""
Milestone 4: Tracking payments and handling disputes

Pause automatic payouts on the connected account to protect ZenFlow while the dispute is open.
"""


def handle_dispute_created(dispute, connected_account_id: str) -> None:
    # TODO: Integrate Stripe
    pass


"""
Milestone 4: Tracking payments and handling disputes

Resume automatic payouts once the dispute is resolved.
"""


def handle_dispute_closed(dispute, connected_account_id: str) -> None:
    # TODO: Integrate Stripe
    pass


def handle_subscription_updated(subscription) -> None:
    """Sync subscription status to the matching user record."""
    if isinstance(subscription, dict):
        metadata = subscription.get("metadata") or {}
        user_id = metadata.get("userId")
        status = subscription.get("status")
    else:
        metadata = getattr(subscription, "metadata", None) or {}
        user_id = metadata.get("userId") if isinstance(metadata, dict) else getattr(metadata, "userId", None)
        status = getattr(subscription, "status", None)

    if not user_id:
        return

    update_user(user_id, {"subscriptionStatus": status})
