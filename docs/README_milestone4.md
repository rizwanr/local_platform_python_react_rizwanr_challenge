# Milestone 4: Tracking Payments and Handling Disputes

When a student pays for a workshop, their seat should be reserved automatically and the attendee count updated. Instructors can also issue refunds through the platform. Because ZenFlow is configured as `losses_collector`, the platform is financially responsible when disputes arise — so we pause payouts on disputed accounts to protect ZenFlow's balance.

## Requirements

Handle `checkout.session.completed` webhook events to increment the workshop's attendee count when a payment is completed. Add a refund endpoint that issues a refund on the instructor's connected account while keeping ZenFlow's 10% application fee. Handle `charge.dispute.created` and `charge.dispute.closed` events to pause and resume automatic payouts on the connected account.

### Testing your integration

After completing Milestone 3, use the **Quick Setup** button to generate sample workshops. Open a payment link and complete a test purchase using a [Stripe test card number](https://stripe.com/docs/testing#cards). Check the workshop in your dashboard to confirm the attendee count incremented.
