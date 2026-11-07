import { APIRequestContext } from '@playwright/test';
import Stripe from 'stripe';

/**
 * Make a request to the server API
 */
export async function serverRequest(
  request: APIRequestContext,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:4242';
  const url = `${baseUrl}/${endpoint}`;

  const options: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.data = data;
  }

  const response = await request.fetch(url, options);

  if (!response.ok()) {
    throw new Error(`Server request failed: ${response.status()} ${response.statusText()}`);
  }

  return response.json();
}

/**
 * Make a request to the Stripe API
 */
export async function stripeRequest(
  request: APIRequestContext,
  method: 'GET' | 'POST' | 'DELETE',
  endpoint: string,
  data?: any
) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY not found in environment');
  }

  const url = `https://api.stripe.com/v1/${endpoint}`;
  const auth = Buffer.from(`${stripeKey}:`).toString('base64');

  const options: any = {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (data && (method === 'POST')) {
    // Convert to form-encoded data
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    options.body = formData.toString();
  }

  const response = await request.fetch(url, options);

  if (!response.ok()) {
    const errorText = await response.text();
    throw new Error(`Stripe request failed: ${response.status()} ${errorText}`);
  }

  return response.json();
}

/**
 * Get Stripe SDK instance (for v2 API calls)
 */
export function getStripeSDK(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY not found in environment');
  }
  return new Stripe(stripeKey, {
    apiVersion: (process.env.STRIPE_API_VERSION as any) || '2026-01-28.clover',
  });
}