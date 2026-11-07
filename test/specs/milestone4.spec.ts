import { expect } from '@playwright/test';
import { test, signup } from '../helpers';
import { getStripeSDK } from '../helpers/api';

// Helper: fire a signed webhook and return the response
async function fireWebhook(page: any, payload: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const stripe = getStripeSDK();
  const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });
  return page.request.post('http://localhost:4242/webhook', {
    data: payload,
    headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
    failOnStatusCode: false,
  });
}

// Helper: create instructor + studio + workshop, return { accountId, instructor, studio, workshop }
async function createWorkshop(page: any, opts: { capacity?: number; amount?: number } = {}) {
  await signup(page);
  await page.waitForURL('/', { timeout: 15000 });
  const accountId = await page.getAttribute('[data-stripe-account-id]', 'data-stripe-account-id');

  const { instructor } = await (await page.request.post('http://localhost:4242/instructors', {
    data: { name: 'Test Instructor', bio: 'Test bio' },
  })).json();

  const { studio } = await (await page.request.post('http://localhost:4242/studios', {
    data: { name: 'Test Studio', address: '123 Test St', maxCapacity: opts.capacity ?? 10 },
  })).json();

  const { workshop } = await (await page.request.post('http://localhost:4242/workshops', {
    data: {
      name: 'Yoga Class',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '10:00',
      duration: 60,
      instructorId: instructor.id,
      studioId: studio.id,
      capacity: opts.capacity ?? 10,
      amount: opts.amount ?? 50,
    },
  })).json();

  return { accountId, instructor, studio, workshop };
}

// Helper: build a checkout.session.completed payload
function checkoutPayload(accountId: string, metadata: Record<string, string>) {
  return JSON.stringify({
    type: 'checkout.session.completed',
    account: accountId,
    data: {
      object: {
        id: 'cs_test_' + Date.now() + '_' + Math.random(),
        object: 'checkout.session',
        metadata,
      },
    },
  });
}

test.describe('Milestone 4: Tracking payments and handling disputes', () => {
  test.describe('checkout.session.completed handling', () => {
    let accountId: string;
    let workshopId: string;
    let meta: Record<string, string>;
    let checkoutPage: any;

    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage();
      const { accountId: aid, instructor, studio, workshop } = await createWorkshop(page);
      accountId = aid!;
      workshopId = workshop.id;
      meta = { workshopId: workshop.id, instructorId: instructor.id, studioId: studio.id, instructorName: instructor.name, studioName: studio.name };
      checkoutPage = page;

      // Verify core handler works — if this fails, the edge case tests fail too
      const r = await fireWebhook(page, checkoutPayload(accountId, meta));
      expect(r.status()).toBe(200);
      const { workshop: w } = await (await page.request.get(`http://localhost:4242/workshops/${workshopId}`)).json();
      expect(w.attendees).toBe(1);
    });

    test.afterAll(async () => {
      await checkoutPage.close();
    });

    test('checkout.session.completed increments attendee count:4.1', async () => {
      // Fire a second webhook → attendees: 1 → 2 (proves accumulation, not hardcoded)
      const r = await fireWebhook(checkoutPage, checkoutPayload(accountId, meta));
      expect(r.status()).toBe(200);
      const { workshop: w } = await (await checkoutPage.request.get(`http://localhost:4242/workshops/${workshopId}`)).json();
      expect(w.attendees).toBe(2);
    });

    test('checkout.session.completed with unknown workshopId does not crash:4.1', async () => {
      const r = await fireWebhook(checkoutPage, checkoutPayload(accountId, { workshopId: 'wkshp_does_not_exist' }));
      expect(r.status()).toBe(200);
      expect((await r.json()).received).toBe(true);
    });

    test('checkout.session.completed with missing workshopId does not crash:4.1', async () => {
      const r = await fireWebhook(checkoutPage, checkoutPayload(accountId, {}));
      expect(r.status()).toBe(200);
      expect((await r.json()).received).toBe(true);
    });
  });

  test('Workshop capacity is enforced — attendees cannot exceed capacity:4.2', async ({ page }) => {
    const { accountId, instructor, studio, workshop } = await createWorkshop(page, { capacity: 2 });

    test.skip(!workshop?.paymentLinkId, 'payment link not created — complete Milestone 3 first');

    const meta = { workshopId: workshop.id, instructorId: instructor.id, studioId: studio.id, instructorName: instructor.name, studioName: studio.name };

    // Fill to capacity
    await fireWebhook(page, checkoutPayload(accountId!, meta));
    await fireWebhook(page, checkoutPayload(accountId!, meta));
    const { workshop: atCap } = await (await page.request.get(`http://localhost:4242/workshops/${workshop.id}`)).json();
    expect(atCap.attendees).toBe(2);

    // Over-capacity webhook should not increment
    await fireWebhook(page, checkoutPayload(accountId!, meta));
    const { workshop: overCap } = await (await page.request.get(`http://localhost:4242/workshops/${workshop.id}`)).json();
    expect(overCap.attendees).toBe(2);
  });

  test('Refund endpoint validates paymentIntentId:4.3', async ({ page }) => {
    const { workshop } = await createWorkshop(page);

    const r = await page.request.post(`http://localhost:4242/workshops/${workshop.id}/refund`, {
      data: {},
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    });
    expect(r.status()).not.toBe(404);
    expect(r.status()).toBe(400);
    const body = await r.json();
    expect(body.error.message).toContain('paymentIntentId');
  });

  test('Refund endpoint propagates Stripe errors — catches missing await:4.3b', async ({ page }) => {
    const { workshop } = await createWorkshop(page);

    // A non-existent PI causes stripe.refunds.create to throw "No such payment_intent".
    // With await: the error propagates and the endpoint returns non-200 (4xx or 5xx).
    // Without await (fire-and-forget): the endpoint returns 200 before the error surfaces.
    const r = await page.request.post(`http://localhost:4242/workshops/${workshop.id}/refund`, {
      data: { paymentIntentId: 'pi_test_nonexistent' },
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    });
    expect(r.status()).not.toBe(200);
  });

  test('Refund endpoint returns 404 for non-existent workshop:4.4', async ({ page }) => {
    await signup(page);
    await page.waitForURL('/', { timeout: 15000 });

    const r = await page.request.post('http://localhost:4242/workshops/wkshp_does-not-exist/refund', {
      data: { paymentIntentId: 'pi_test_123' },
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    });
    expect(r.status()).toBe(404);
    expect(r.headers()['content-type']).toContain('application/json');
    const body = await r.json();
    expect(body.error.message).toBeTruthy();
  });

  test('Refund endpoint requires authentication:4.5', async ({ request }) => {
    const r = await request.post('http://localhost:4242/workshops/wkshp_any/refund', {
      data: { paymentIntentId: 'pi_test_123' },
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    });
    expect(r.status()).not.toBe(404);
    expect(r.status()).toBe(401);
  });

});
