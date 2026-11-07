"""
Handles Stripe webhook events.

Milestone 1: Verify the webhook signature and construct the event, then handle:
- v2.core.account.* events: sync account status via handle_account_update
- customer.subscription.updated/deleted: sync subscription status via handle_subscription_updated

Milestone 4: Handle checkout.session.completed to track workshop attendees, and
charge.dispute.created/closed to pause and resume payouts on the connected account.
"""

import os
import json
import stripe
from flask import Blueprint, request, jsonify
from src.clients.stripe_client import StripeClient
from src.services.users import (
    handle_account_update,
    handle_dispute_created,
    handle_dispute_closed,
    handle_subscription_updated,
)
from src.services.workshops import increment_event_attendees

webhook_bp = Blueprint("webhook", __name__)


def _has_user_id_metadata(account) -> bool:
    metadata = getattr(account, "metadata", None) or {}
    if isinstance(metadata, dict):
        return bool(metadata.get("userId"))
    return bool(getattr(metadata, "userId", None))


@webhook_bp.route("/webhook", methods=["POST"])
def handle_webhook():
    try:
        payload = request.get_data()
        sig = request.headers.get("stripe-signature")

        if not sig:
            return jsonify({"error": "Stripe signature missing"}), 400

        endpoint_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
        if not endpoint_secret:
            return jsonify({"error": "Stripe webhook secret missing"}), 400

        event = None
        # TODO: Integrate Stripe

        event_type = event.get("type", "") if event else ""
        obj = event.get("data", {}).get("object", {}) if event else {}

        # v2 Connect account events are thin events — data.object only contains the account ID.
        # Fetch the full account before processing.
        if event_type.startswith("v2.core.account."):
            # TODO: Integrate Stripe
            pass
        else:
            if event_type == "checkout.session.completed":
                # TODO: Integrate Stripe
                pass
            elif event_type == "charge.dispute.created":
                # TODO: Integrate Stripe
                pass
            elif event_type == "charge.dispute.closed":
                # TODO: Integrate Stripe
                pass
            elif event_type in ("customer.subscription.updated", "customer.subscription.deleted"):
                # TODO: Integrate Stripe
                pass
            else:
                print(f"Unhandled event type: {event_type}")

        return jsonify({"received": True})

    except stripe.SignatureVerificationError:
        return jsonify({"error": "Invalid signature"}), 400
    except Exception as e:
        print(f"Webhook error: {type(e).__name__}: {e}", flush=True)
        return jsonify({"error": "Webhook error"}), 400
