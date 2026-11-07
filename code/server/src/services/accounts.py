"""
Milestone 2: Setting up embedded components

Create an AccountSession for the connected account to enable the embedded components
used across the dashboard. Enable the components needed and configure their features.
"""

from src.clients.stripe_client import StripeClient


def create_account_session(stripe_account_id: str):
    # TODO: Integrate Stripe
    pass


class AccountsService:
    create_account_session = staticmethod(create_account_session)
