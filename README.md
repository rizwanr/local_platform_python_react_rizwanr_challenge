# Stripe Connect Platform Challenge: ZenFlow

> _The **ZenFlow Platform Challenge** is a consulting engagement with a client who needs a Stripe Connect integration. Follow these steps to get started:_
> 1. _Start by reading this README and finding the TODO comments in the code._
> 2. _Implement the requirements, run the tests locally to verify, and push when ready._
> 3. _Look at the test output for feedback, then keep iterating._
>
> _If you need assistance, reach out to partner-support@stripe.com._

---

<details>
  <summary>You receive an email from maya@zenflow.dev with subject: "Stripe Integration Help Needed!"</summary>

  <br />

  Hello!

  I'm Maya Chen, founder of ZenFlow, a platform that helps yoga instructors run their businesses online. We're building a marketplace where instructors can create accounts, schedule workshops, and get paid directly — all while we handle the technology and compliance.

  Our platform is growing fast, and we need help integrating Stripe to power our instructor onboarding, payment collection, and payout management. We want to make it seamless for instructors to get started and start earning, while we collect a small platform fee to sustain our business.

  If you can help us build this, please see the attached project brief for details.

  Looking forward to working together!

  Maya

</details>

## Project Brief: Build ZenFlow's Stripe Connect Platform

ZenFlow is a platform that empowers yoga instructors to run their wellness businesses online. Instructors use ZenFlow to schedule workshops, collect payments from students, and receive payouts — without worrying about the technical complexity of payment processing.

We're building on **Stripe Connect** because it lets us create accounts for our instructors, collect payments on their behalf, and manage payouts — all while taking a small platform fee.

### Project context

A contract developer built the foundation of the application but had to leave before completing the Stripe integration. They followed test-driven development practices, so there's a thorough test suite you can use to verify your work.

Your job is to complete the Stripe integration. The existing routes, component structure, and page layout must stay intact — only make the changes needed to satisfy our integration requirements.

### Deliverables

There are four milestones to complete:

1. **Onboarding:** When instructors sign up, they're automatically set up with a Stripe Connect account and a ZenFlow platform subscription.

2. **Account management:** Instructors complete identity verification and manage their account and payout settings from within ZenFlow using embedded Stripe components.

3. **Payments:** Instructors can create workshops that students pay for via Stripe Payment Links. ZenFlow automatically collects a 10% platform fee on every transaction.

4. **Tracking and disputes:** When a student pays, their seat is reserved automatically. Instructors can issue refunds through the platform, and disputes are handled gracefully to protect ZenFlow from financial exposure.

Each milestone has a corresponding doc in the milestone PR with detailed requirements.

### Collaboration process

Work off the `dev` branch and push your changes there. Don't open or close any pull requests — the automation handles that for you. After you push and the tests pass, the system will automatically open the next milestone's PR.

This automation depends on GitHub Actions. If the tests aren't immediately running, check their status page to see if there is an incident.

### Completing the application

To run the application, use the `install.sh` and `start.sh` scripts in both the `client` and `server` directories. Start the server first, then the client.

For these tests to keep being useful, your work cannot change:

- Any of the server's existing routes.
- Any of the classes and IDs from the rendered web page.

If you change any of these, the integration tests fail and you can't proceed with the project.

Please try to only make the changes necessary to satisfy the requirements. We're only concerned about how the site runs on the latest version of Google Chrome.

### Working with Stripe

Use a personal Stripe account in **sandbox mode** for development — this challenge requires the v2 Accounts API, which is only available in sandboxes. To create one, go to the sandbox switcher in the Dashboard and choose **New sandbox**. When prompted, select **New account** (not "Use existing account") to ensure you get a fresh account with v2 support enabled. The sandbox should not be connected to an active business.

This integration uses **API version `2026-02-25.clover`**. Your account must be on the latest API version — you can check and update it from your [request logs dashboard](https://stripe.com/docs/development/dashboard/request-logs#view-your-default-api-version).

The integration tests are designed to run in CI as markers of progress and correctness, and should not be modified. If tests are passing locally but failing in the automated test run, reach out to partner-support@stripe.com before trying anything else.

### Running the tests

From the `test` directory, install dependencies with `npm install`, then run:

```bash
# Run all tests for a specific milestone
npx playwright test ./specs/milestone1.spec.ts

# Or run all milestones
npx playwright test
```

Make sure the client and server are both running before executing tests.
