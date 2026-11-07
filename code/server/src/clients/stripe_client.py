import os
import stripe


class StripeClient:
    _instance: stripe.StripeClient | None = None

    def __new__(cls):
        raise TypeError("Use StripeClient.get_sdk() instead")

    @classmethod
    def get_sdk(cls) -> stripe.StripeClient:
        if cls._instance is None:
            secret_key = os.environ.get("STRIPE_SECRET_KEY", "")
            api_version = os.environ.get("STRIPE_API_VERSION")
            if api_version:
                cls._instance = stripe.StripeClient(
                    secret_key,
                    stripe_version=api_version,
                )
            else:
                cls._instance = stripe.StripeClient(secret_key)
        return cls._instance
