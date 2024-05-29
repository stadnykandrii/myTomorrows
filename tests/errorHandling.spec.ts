import { test, expect } from '@playwright/test';

const testData = {
  invalidEmail: 'test',
  noDomainEmail: 'test@gmail',
  validEmail: 'test@gmail.com',
  validEmail2: 'test2@gmail.com',
  invalidName: '12345',
  validFirstName: 'John',
  validLastName: 'Doe'
}

test.describe('Registration error handling', () =>{

  test.beforeEach(async ({page})=>{
    await page.goto('https://platform-develop.mytomorrows.com/signup');
    await page.getByRole('button', { name: 'Create account' }).click();
  })

  test('Invalid email error', async ({ page }) => {
    await page.locator('#mat-input-0').fill(testData.invalidEmail);
    await page.locator('#mat-input-1').click();
    await expect(page.locator('mat-error')).toHaveText('Email is in an invalid format');
  });
  
  test('Unmatching emails error', async ({ page }) => {
    await page.locator('#mat-input-0').fill(testData.validEmail);
    await page.locator('#mat-input-1').fill(testData.validEmail2);
    await page.getByPlaceholder('First name').click();
    await expect(page.locator('mat-error')).toHaveText('Fields do not match');
  });
  
  test('Invalid first name error', async ({ page }) => {
    await page.getByPlaceholder('First name').fill(testData.invalidName);
    await page.getByPlaceholder('Last name').click();
    await expect (page.locator('mat-error')).toHaveText('Please enter your firstname with letters');
  });
  
  test('Invalid last name error', async ({ page }) => {
    await page.getByPlaceholder('Last name').fill(testData.invalidName);
    await page.getByPlaceholder('First name').click();
    await expect (page.locator('mat-error')).toHaveText('Please enter your lastname with letters');
  });
  
  // This test is added due to discovered bug described in the next commented test in order
  // to verify that registration process does not start despite missing error messages on email fields and enabled "Next" button
  test ('Pop-up error message for attempting a registration with an invalid email address (no domain)', async ({ page }) => {
    await page.locator('#mat-input-0').fill(testData.noDomainEmail);
    await page.locator('#mat-input-1').fill(testData.noDomainEmail);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(5000);
    await expect (page.locator('p', { hasText: 'Something went wrong' })).toHaveText('Something went wrong. Please try again later, or contact us if the issue persists.');
  });
  
  // THIS TEST WILL FAIL DUE TO THE BUG on the page (that is why it's commented): there is an error message missing for the email with no domain and
  // the "Next: verification" button is enabled despite the invalid email format
  /*test ('Invalid email address (no domain)', async ({ page }) => {
    await page.locator('#mat-input-0').fill(testData.noDomainEmail);
    await page.locator('#mat-input-1').fill(testData.noDomainEmail);
    await page.getByPlaceholder('First name').fill(testData.validFirstName;
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await expect(page.locator('mat-error')).toHaveText('Email is in an invalid format');
  });*/

})




