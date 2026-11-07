import { expect, BrowserContext } from '@playwright/test';
import { test, signup } from '../helpers';
import { getStripeSDK } from '../helpers/api';

test.describe('Milestone 1: Onboarding a new instructor', () => {
  let accountId: string;
  let userId: string;
  let sharedContext: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    sharedContext = await browser.newContext();
    const page = await sharedContext.newPage();

    await signup(page);
    await page.waitForURL('/', { timeout: 15000 });

    accountId = await page.locator('[data-stripe-account-id]').getAttribute('data-stripe-account-id') ?? '';

    const userResponse = await page.request.get('http://localhost:4242/users');
    const user = await userResponse.json();
    userId = user.id;

    await page.close();
  });

  test.afterAll(async () => {
    await sharedContext.close();
  });

  test('Sign-up creates a Connect account with correct configuration:1.1', async ({ request }) => {
    const page = await sharedContext.newPage();
    await page.goto('/');
    await page.waitForURL('/', { timeout: 15000 });

    const accountLocator = page.locator('[data-stripe-account-id]');
    await expect(accountLocator).toBeAttached({ timeout: 15000 });
    const domAccountId = await accountLocator.getAttribute('data-stripe-account-id');
    expect(domAccountId).toMatch(/^acct_/);
    expect(domAccountId).toBe(accountId);

    expect(userId).toBeTruthy();

    await page.close();
  });

  test('Webhook rejects unsigned requests and accepts valid signatures:1.4', async ({ request }) => {
    const stripeSDK = getStripeSDK();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    expect(webhookSecret).toBeTruthy();

    const payload = JSON.stringify({
      id: 'evt_test',
      object: 'event',
      type: 'account.updated',
      data: { object: { id: 'acct_test', object: 'account' } },
    });

    // Unsigned request must be rejected
    const unsignedResponse = await request.post('http://localhost:4242/webhook', {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    });
    expect(unsignedResponse.status()).not.toBe(404);
    expect(unsignedResponse.status()).toBe(400);

    // Correctly signed request must be accepted
    const signature = stripeSDK.webhooks.generateTestHeaderString({ payload, secret: webhookSecret });
    const signedResponse = await request.post('http://localhost:4242/webhook', {
      data: payload,
      headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
      failOnStatusCode: false,
    });
    expect(signedResponse.status()).toBe(200);
    expect((await signedResponse.json()).received).toBe(true);
  });

});
