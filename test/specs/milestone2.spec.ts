import { expect } from '@playwright/test';
import { test, signup, waitForAnyStripeConnectIframe } from '../helpers';

test.describe('Milestone 2: Setting up embedded components', () => {
  test('Account sessions endpoint returns a valid client_secret:2.1', async ({ page }) => {
    await signup(page);
    await page.waitForURL('/', { timeout: 15000 });

    // Use page.request so the auth session cookie is included
    const response = await page.request.post('http://localhost:4242/account-sessions', {
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.client_secret).toBeTruthy();
    expect(body.client_secret).toMatch(/^accs_secret_/);
  });

  test('Account sessions endpoint rejects unauthenticated requests:2.2', async ({ request }) => {
    // Use bare request fixture (no auth cookie)
    const response = await request.post('http://localhost:4242/account-sessions', {
      failOnStatusCode: false,
    });

    expect(response.status()).not.toBe(404);
    expect(response.status()).toBe(401);
  });

  test('Account page renders notification banner and onboarding component:2.3', async ({ page }) => {
    await signup(page);
    await page.goto('/account');

    const notificationBanner = page.locator('stripe-connect-notification-banner');
    await expect(notificationBanner).toBeAttached({ timeout: 10000 });

    const onboardingOrManagement = page.locator(
      'stripe-connect-account-onboarding, stripe-connect-account-management'
    );
    await expect(onboardingOrManagement.first()).toBeAttached({ timeout: 15000 });

    const hasIframe = await waitForAnyStripeConnectIframe(page, 15000);
    expect(hasIframe, 'Stripe Connect iframe did not render on /account — check ConnectComponentsProvider setup').toBeTruthy();
  });

  test('Account page renders tax components:2.4', async ({ page }) => {
    await signup(page);
    await page.goto('/account');

    await expect(page.locator('stripe-connect-tax-settings')).toBeAttached({ timeout: 10000 });
    await expect(page.locator('stripe-connect-tax-registrations')).toBeAttached({ timeout: 10000 });

    const hasIframe = await waitForAnyStripeConnectIframe(page, 15000);
    expect(hasIframe, 'Stripe Connect iframe did not render on /account — check ConnectComponentsProvider setup').toBeTruthy();
  });

  test('Payments and payouts pages render embedded components:2.5', async ({ page }) => {
    await signup(page);

    await page.goto('/payments');
    await expect(page.getByRole('heading', { name: 'Payments', exact: true })).toBeVisible();
    await expect(page.locator('stripe-connect-payments')).toBeAttached({ timeout: 10000 });
    const hasPaymentsIframe = await waitForAnyStripeConnectIframe(page, 15000);
    expect(hasPaymentsIframe, 'Stripe Connect iframe did not render on /payments — check ConnectComponentsProvider setup').toBeTruthy();

    await page.goto('/payouts');
    await expect(page.getByRole('heading', { name: 'Payouts', level: 1 })).toBeVisible();
    await expect(page.locator('stripe-connect-payouts')).toBeAttached({ timeout: 10000 });
    const hasPayoutsIframe = await waitForAnyStripeConnectIframe(page, 15000);
    expect(hasPayoutsIframe, 'Stripe Connect iframe did not render on /payouts — check ConnectComponentsProvider setup').toBeTruthy();
  });

});
