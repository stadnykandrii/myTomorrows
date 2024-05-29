import { test, expect } from '@playwright/test';

test('Get to the Verification screen', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill('test@test.com');
  await page.locator('#mat-input-1').fill('test@test.com');
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('user');
  await page.getByLabel('By ticking this box, I').check();
  await page.getByRole('button', { name: 'Next: verification' }).click();
  await expect (page.locator('h1')).toHaveText('Verify your email address');
});

test('Next Button is disabled if T&C and PP are not accepted', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill('test@test.com');
  await page.locator('#mat-input-1').fill('test@test.com');
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('User');
  await expect (page.getByRole('button', { name: 'Next: verification' })).toHaveAttribute('ng-reflect-disabled', 'true');
});

test('Next Button is enabled if T&C and PP are accepted', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill('test@test.com');
  await page.locator('#mat-input-1').fill('test@test.com');
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('user');
  await page.getByLabel('By ticking this box, I').check();
  await expect (page.getByRole('button', { name: 'Next: verification' })).toHaveAttribute('ng-reflect-disabled', 'false');
});

test('Terms & Conditions page is accessible', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.getByRole('link', { name: 'terms of use' }).click();
  await expect (page.locator('h1')).toHaveText('Terms & Conditions');
});

test('Privacy Policy page is accessible', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.getByRole('link', { name: 'privacy policy', exact: true }).click();
  await expect (page.locator('h1')).toHaveText('Privacy Statement');
});