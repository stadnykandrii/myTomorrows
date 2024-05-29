import { test, expect } from '@playwright/test';

/*test('TO DO - Journey from the home page', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/home');
  await page.getByText('Log in').click();
  await page.getByRole('link', { name: 'Create one here.' }).click();
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.locator('#mat-input-6').fill('test@email.com');
  await page.locator('#mat-input-7').fill('test@email.cdsofsd');
  await page.getByPlaceholder('First name').click();
  await expect(page.locator('#mat-mdc-error-7')).toHaveText('Fields do not match');
});*/

test('Using invalid email during the registration', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/signup');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.locator('#mat-input-0').fill('test');
  await page.locator('#mat-input-1').click();
  await expect(page.locator('mat-error')).toHaveText('Email is in an invalid format');
});

test('Unmatching emails during the registration - WORKING', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/signup');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.locator('#mat-input-0').fill('test@email.com');
  await page.locator('#mat-input-1').fill('test@email.cdsofsd');
  await page.getByPlaceholder('First name').click();
  await expect(page.locator('mat-error')).toHaveText('Fields do not match');
});

test('Invalid name provided - WORKING', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/signup');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.locator('#mat-input-0').fill('test@gmail.com');
  await page.locator('#mat-input-1').fill('test@gmail.com');
  await page.getByPlaceholder('First name').fill('1234');
  await page.getByPlaceholder('Last name').click();
  await expect (page.locator('mat-error')).toHaveText('Please enter your firstname with letters');
});

test('Invalid last name provided - WORKING', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/signup');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.locator('#mat-input-0').fill('test@gmail.com');
  await page.locator('#mat-input-1').fill('test@gmail.com');
  await page.getByPlaceholder('Last name').fill('1234');
  await page.getByPlaceholder('First name').click();
  await expect (page.locator('mat-error')).toHaveText('Please enter your lastname with letters');
});

test ('Next Button is enabled if T&C and PP are accepted', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill('test@test.com');
  await page.locator('#mat-input-1').fill('test@test.com');
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('user');
  await page.getByLabel('By ticking this box, I').check();
  await expect (page.getByRole('button', { name: 'Next: verification' })).toHaveAttribute('ng-reflect-disabled', 'false');
});


// THIS TEST WILL FAIL DUE TO THE BUG on the page: there is no error message for the invalid email format (email with no domain) and
// the "Next: verification" button is enabled despite the invalid email format
test ('Invalid email adress (no domain)', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill('test@test');
  await page.locator('#mat-input-1').fill('test@test');
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('user');
  await page.getByLabel('By ticking this box, I').check();
  await expect(page.locator('mat-error')).toHaveText('Email is in an invalid format');
  // As an option we can use the following assertion in order to check if the the button is disabled
  //await expect (page.getByRole('button', { name: 'Next: verification' })).toHaveAttribute('ng-reflect-disabled', 'true');
});

// This test is added due to discovered bug described in the previous test in order
// to verify that registration process does not start go further despite missing error messages on the form and enabled "Next" button
test ('Triggering a pop-up error message while attempting a registration with an invalid email adress (no domain)', async ({ page }) => {
  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill('test@test');
  await page.locator('#mat-input-1').fill('test@test');
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('user');
  await page.getByLabel('By ticking this box, I').check();
  await page.getByRole('button', { name: 'Next: verification' }).click();
  await expect (page.locator('p', { hasText: 'Something went wrong' })).toHaveText('Something went wrong. Please try again later, or contact us if the issue persists.');
});
