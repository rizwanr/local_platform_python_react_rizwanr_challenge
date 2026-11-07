import { expect } from '@playwright/test';
import { test, signup } from '../helpers';

// Helper to create prerequisites and a workshop, returns { accountId, instructor, studio, workshop }
async function createWorkshop(page: any, opts: { amount: number; capacity: number; name?: string }) {
  await signup(page);
  await page.waitForURL('/', { timeout: 15000 });

  const accountId = await page.getAttribute('[data-stripe-account-id]', 'data-stripe-account-id');

  const { instructor } = await (await page.request.post('http://localhost:4242/instructors', {
    data: { name: 'Jane Smith', bio: 'Expert instructor' },
  })).json();

  const { studio } = await (await page.request.post('http://localhost:4242/studios', {
    data: { name: 'Downtown Studio', address: '456 Main St', maxCapacity: opts.capacity },
  })).json();

  const { workshop } = await (await page.request.post('http://localhost:4242/workshops', {
    data: {
      name: opts.name ?? 'Morning Flow',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '09:00',
      duration: 60,
      instructorId: instructor.id,
      studioId: studio.id,
      capacity: opts.capacity,
      amount: opts.amount,
    },
  })).json();

  return { accountId, instructor, studio, workshop };
}

test.describe('Milestone 3: Collecting payments for classes', () => {
  let workshop: any;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    ({ workshop } = await createWorkshop(page, { amount: 100, capacity: 15, name: 'Morning Flow' }));
    await page.close();
  });

  test('Workshop and payment link IDs are present:3.1a', async () => {
    expect(workshop.id).toMatch(/^wkshp_/);
    expect(workshop.paymentLinkId).toBeTruthy();
    expect(workshop.paymentLinkUrl).toBeTruthy();
    expect(workshop.paymentLinkUrl).toMatch(/^https:\/\/buy\.stripe\.com\/.+/);
  });

  test('Quick Setup creates multiple workshops with valid payment links:3.2', async ({ page }) => {
    await signup(page);
    await page.goto('/');

    await page.request.post('http://localhost:4242/instructors', { data: { name: 'Quick Instructor 1', bio: 'Test' } });
    await page.request.post('http://localhost:4242/instructors', { data: { name: 'Quick Instructor 2', bio: 'Test' } });
    await page.request.post('http://localhost:4242/studios', { data: { name: 'Quick Studio 1', address: '111 Quick St', maxCapacity: 20 } });
    await page.request.post('http://localhost:4242/studios', { data: { name: 'Quick Studio 2', address: '222 Quick Ave', maxCapacity: 25 } });

    const { workshops: before } = await (await page.request.get('http://localhost:4242/workshops')).json();
    const { workshops: result } = await (await page.request.post('http://localhost:4242/workshops/quickstart', {})).json();

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    for (const workshop of result) {
      expect(workshop.paymentLinkId).toBeTruthy();
      expect(workshop.paymentLinkUrl).toMatch(/^https:\/\/buy\.stripe\.com\/.+/);
    }

    const { workshops: after } = await (await page.request.get('http://localhost:4242/workshops')).json();
    expect(after.length).toBeGreaterThan(before.length);
  });
});
