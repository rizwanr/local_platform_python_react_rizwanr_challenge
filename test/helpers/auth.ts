import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Sign up a new user (passwordless auth - email only)
 */
export async function signup(page: Page, userData?: { name?: string; email?: string }) {
  const name = userData?.name || faker.person.fullName();
  const email = userData?.email || faker.internet.email();

  await page.goto('/signup');

  // Wait for form to load (extended timeout for CI cold-start of Next.js dev server)
  await page.waitForSelector('input[name="email"]', { timeout: 60000 });

  // Fill in the signup form (email and name only - no password)
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="name"]', name);

  // Click the submit button
  await page.click('button[type="submit"]');

  // Wait for redirect after successful signup (redirects to "/" which is the dashboard)
  await page.waitForURL('/', { timeout: 30000 });

  return { name, email };
}

/**
 * Log in an existing user (passwordless auth - email only)
 */
export async function login(page: Page, email: string) {
  await page.goto('/login');

  // Wait for form to load
  await page.waitForSelector('input[name="email"]', { timeout: 5000 });

  // Fill in email (no password needed)
  await page.fill('input[name="email"]', email);

  // Click the submit button
  await page.click('button[type="submit"]');

  // Wait for redirect after successful login
  await page.waitForURL('/', { timeout: 15000 });
}

/**
 * Log out the current user
 */
export async function logout(page: Page) {
  // Look for logout button in the navigation
  await page.click('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]');
  await page.waitForURL('**/login', { timeout: 5000 });
}