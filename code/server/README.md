## Requirements

- Python 3.12 or later (run `python3 --version` to check)
- [Stripe CLI](https://stripe.com/docs/stripe-cli#install) v1.40.6 or later (run `stripe --version` to check; upgrade with `brew upgrade stripe/stripe-cli/stripe` or your package manager if needed)

## How to run

1. Install dependencies

```
. install.sh
```

2. Copy `.env.example` to `.env`, then add your Stripe API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)

3. After installing the Stripe CLI and logging in, start a local listener to get your webhook secret:

```
stripe listen --forward-to localhost:4242/webhook --forward-connect-to localhost:4242/webhook --thin-events v2.core.account.updated
```

4. Add the webhook secret from the CLI output to `.env`

5. Start the server

```
. start.sh
```

The server runs on `localhost:4242`. Start the React client from its directory and visit `localhost:3000`.
