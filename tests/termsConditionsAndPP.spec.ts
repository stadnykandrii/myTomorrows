import { test, expect } from '@playwright/test';

const testData = {
  validEmail: 'test@gmail.com',
  validFirstName: 'John',
  validLastName: 'Doe'
}

test.describe('Terms & Conditions and Privacy Policy', () =>{

  test.beforeEach(async ({page})=>{
    await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  })

test('Next Button is disabled if T&C and PP are not accepted', async ({ page }) => {
  await page.locator('#mat-input-0').fill(testData.validEmail);
  await page.locator('#mat-input-1').fill(testData.validEmail);
  await page.getByPlaceholder('First name').fill(testData.validFirstName);
  await page.getByPlaceholder('Last name').fill(testData.validLastName);
  await expect (page.getByRole('button', { name: 'Next: verification' })).toHaveAttribute('ng-reflect-disabled', 'true');
});

test('Next Button is enabled if T&C and PP are accepted', async ({ page }) => {
  await page.locator('#mat-input-0').fill(testData.validEmail);
  await page.locator('#mat-input-1').fill(testData.validEmail);
  await page.getByPlaceholder('First name').fill(testData.validFirstName);
  await page.getByPlaceholder('Last name').fill(testData.validLastName);
  await page.getByLabel('By ticking this box, I').check();
  await expect (page.getByRole('button', { name: 'Next: verification' })).toHaveAttribute('ng-reflect-disabled', 'false');
});

test('Terms & Conditions page is available', async ({ page }) => {
  await page.getByRole('link', { name: 'terms of use' }).click();
  await expect (page.locator('h1')).toHaveText('Terms & Conditions');
});

test('Privacy Policy page is available', async ({ page }) => {
  await page.getByRole('link', { name: 'privacy policy', exact: true }).click();
  await expect (page.locator('h1')).toHaveText('Privacy Statement');
});
})