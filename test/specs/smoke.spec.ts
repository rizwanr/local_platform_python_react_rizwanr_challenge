import { expect } from '@playwright/test';
import { test } from '../helpers';
import config from '../playwright.config';

test.describe('Smoke Test', () => {
  test('Login page loads and signup link works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText('Login')).toBeVisible();
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page.getByText('Sign up')).toBeVisible();
  });
});
