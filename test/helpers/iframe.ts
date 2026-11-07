import { Page, FrameLocator } from '@playwright/test';

/**
 * Wait for a Stripe embedded component iframe to load
 * @param page - Playwright page object
 * @param componentName - Name of the component (e.g., 'connect-payments', 'connect-payouts')
 * @param timeout - Maximum time to wait in milliseconds
 * @returns FrameLocator for the iframe
 */
export async function waitForStripeEmbeddedComponent(
  page: Page,
  componentName: string,
  timeout: number = 10000
): Promise<FrameLocator | null> {
  try {
    // Wait for iframe with the component name in the title or name attribute
    const iframeLocator = page.frameLocator(`iframe[title*="${componentName}"], iframe[name*="${componentName}"]`);

    // Wait for iframe to be attached
    await page.waitForSelector(`iframe[title*="${componentName}"], iframe[name*="${componentName}"]`, {
      timeout,
      state: 'attached'
    });

    return iframeLocator;
  } catch (error) {
    console.error(`Failed to find iframe for ${componentName}:`, error);
    return null;
  }
}

/**
 * Check if a Stripe embedded component iframe exists on the page
 * @param page - Playwright page object
 * @param componentName - Name of the component
 * @returns boolean indicating if iframe exists
 */
export async function hasStripeEmbeddedComponent(
  page: Page,
  componentName: string
): Promise<boolean> {
  try {
    const iframe = await page.$(`iframe[title*="${componentName}"], iframe[name*="${componentName}"]`);
    return iframe !== null;
  } catch {
    return false;
  }
}

/**
 * Wait for any Stripe Connect iframe to appear (generic wait)
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait
 */
export async function waitForAnyStripeConnectIframe(
  page: Page,
  timeout: number = 10000
): Promise<boolean> {
  try {
    await page.waitForSelector('iframe[src*="connect-js"]', {
      timeout,
      state: 'attached'
    });
    return true;
  } catch {
    return false;
  }
}
