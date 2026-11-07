## React Client

This is the React (Next.js) client for ZenFlow's web app.

## How to run

1. Install dependencies

```
npm install
```

2. Copy `.env.example` to `.env`, then add your Stripe publishable key from the [Dashboard](https://dashboard.stripe.com/test/apikeys)

3. Start the client

```
. start.sh
```

The client runs on `localhost:3000`. Make sure the server is running on `localhost:4242` first.

When you first visit the app before completing any milestones, the server will log `handling error User not found in session` — that's expected. It means the app is running correctly and you're ready to start on Milestone 1.

## Project structure

As you work through the milestones, here are the key places you'll need to make client-side changes:

<details>
<summary>Milestone 1: Onboarding</summary>

No client-side changes required — account creation is handled server-side.
</details>

<details>
<summary>Milestone 2: Setting up embedded components</summary>

Initialize the Stripe Connect instance in `src/contexts/EmbeddedComponentContext.tsx` so embedded components can render throughout the dashboard. Then add the embedded onboarding, account management, notification banner, and tax components to the account page; the payments component to the payments page; and the payouts component to the payouts page.
</details>

<details>
<summary>Milestone 3: Collecting payments for classes</summary>

No client-side changes required — payment links are generated server-side.
</details>

<details>
<summary>Milestone 4: Tracking payments and handling disputes</summary>

No client-side changes required — attendance tracking, refunds, and dispute handling are managed server-side.
</details>
