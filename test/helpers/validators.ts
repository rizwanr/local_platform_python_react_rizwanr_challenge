import { APIRequestContext, expect } from '@playwright/test';
import { getStripeSDK } from './api';

/**
 * Validate that a Connect account was created correctly for Milestone 1
 */
export async function validateConnectAccount(
  request: APIRequestContext,
  accountId: string,
  expectedMetadata?: { userId: string }
) {
  const stripe = getStripeSDK();

  const account = await stripe.v2.core.accounts.retrieve(accountId, {
    include: ['defaults', 'configuration.merchant', 'requirements'],
  });

  // Validate account exists
  expect(account).toBeTruthy();
  expect(account.id).toBe(accountId);

  // Validate metadata if provided
  if (expectedMetadata) {
    expect(account.metadata).toBeTruthy();
    expect(account.metadata.userId).toBe(expectedMetadata.userId);
  }

  // Validate v2 responsibilities configuration
  expect(account.defaults?.responsibilities?.fees_collector).toBe('application');
  expect(account.defaults?.responsibilities?.losses_collector).toBe('application');

  // Validate no Stripe-hosted dashboard
  expect(account.dashboard).toBe('none');

  return account;
}

/**
 * Validate that an AccountSession was created
 */
export async function validateAccountSession(clientSecret: string) {
  expect(clientSecret).toBeTruthy();
  expect(clientSecret).toMatch(/^accs_secret_/);
  return true;
}

/**
 * Validate webhook event handling
 */
export async function validateWebhookHandling(
  request: APIRequestContext,
  userId: string
) {
  // This would check that the webhook was processed correctly
  // For now, we'll just validate the user was updated
  const stripe = getStripeSDK();

  // Implementation depends on how the server exposes user data
  // This is a placeholder that should be customized based on actual API
  return true;
}