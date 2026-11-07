# Milestone 2: Setting Up Embedded Components

Now that instructors have Connect accounts, they need an embedded UI to complete onboarding, manage their account, and view their payments and payouts — without leaving ZenFlow. Use Stripe's embedded components to provide this experience.

## Requirements

Complete `createAccountSession` in `src/services/accounts.ts` to generate client secrets for the dashboard's embedded components. Initialize the Stripe Connect instance in `src/contexts/EmbeddedComponentContext.tsx` so components across the app can render. Then place the embedded components on the relevant pages: the account page needs onboarding/management, a notification banner, and tax components; the payments page needs the payments component; and the payouts page needs the payouts component.

### Testing your integration

Once you've completed this milestone, sign up in the app and go to the **Account** page. You'll see the embedded onboarding component — complete it using [Stripe's test verification data](https://stripe.com/docs/connect/testing#identity-verification) to simulate a verified identity without real documents.

The dashboard's workshop schedule and **Quick Setup** button only appear after your account is fully verified (`chargesEnabled: true`). If the schedule isn't showing, return to the Account page and check for any remaining requirements in the notification banner.
