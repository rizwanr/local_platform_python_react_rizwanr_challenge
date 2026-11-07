# Milestone 1: Onboarding a New Instructor

The first step is getting yoga instructors signed up and ready to accept payments through ZenFlow. We use Stripe Connect to create accounts for each instructor, then set up platform billing so ZenFlow can charge a monthly subscription fee.

## Requirements

### Platform billing plan

Implement `getOrCreatePlatformPriceId()` in `src/services/platform.ts` to lazily set up the shared ZenFlow billing plan. The plan should be a recurring monthly price of $29 attached to a product named `"ZenFlow Platform"`. The price ID should be persisted so it's only created once, no matter how many instructors sign up.

### Instructor onboarding

When a new user signs up, implement `createUser()` in `src/services/users.ts` to:
- Create a Stripe Connect account for the instructor with `card_payments` capability. ZenFlow should be configured as both `fees_collector` and `losses_collector`.
- Create a Stripe Customer on the platform account and subscribe them to the ZenFlow platform plan with a 30-day trial.

### Webhook handler

Complete the webhook handler in `src/routes/webhook.ts` to verify the event signature and handle:
- `v2.core.account.*` events: sync the connected account's status to the database
- `customer.subscription.updated` / `customer.subscription.deleted`: keep the user's subscription status in sync

### Testing your integration

Once you've completed the server implementation, sign up in the app using any name and email address — this is a test environment, so no real credentials are needed. You'll see the connected account ID displayed on the dashboard once Stripe account creation is working. Use the Stripe Dashboard to verify the customer and subscription were created for the instructor's email.

Make sure your `STRIPE_WEBHOOK_SECRET` environment variable matches the signing secret from `stripe listen`. If you restart the webhook listener, update the secret and restart your server.
