# Milestone 3: Collecting Payments for Classes

Now that instructors have verified accounts, they need a way to accept payments for their workshops. Each workshop gets a shareable Stripe Payment Link that students use to register and pay. ZenFlow collects a 10% application fee on every transaction, with the rest going directly to the instructor.

## Requirements

Complete `createWorkshop` in `src/services/workshops.ts` to generate a Price and Payment Link on the connected account for each new workshop. The payment link should enforce the workshop's capacity, always create a customer, collect a 10% application fee, and include metadata that links the payment back to the workshop so webhooks can route it correctly.

### Testing your integration

Once you've completed this milestone, use the **Quick Setup** button on the dashboard to generate sample workshops with payment links. Open a payment link and complete a test purchase using a [Stripe test card number](https://stripe.com/docs/testing#cards) to verify the flow end to end.
