import { test, expect } from '@playwright/test';
import MailosaurClient from "mailosaur";

const mailosaur = new MailosaurClient("ZN3j4kC7mNSbpHLZSZhxECzjdA0OP5Sf");

const testData = {
  validFirstName: 'John',
  validLastName: 'Doe',
  validPassword: '20testPASS!',
  invalidPassword: 'testPASS',
  htcInUse: '5711887014',
  emailInUse: '6pgtqxiezs@onzczbfc.mailosaur.net'
}

function createHCP(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit.toString();
  }

  return result;
}

function generateEmail(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

const htc = createHCP(10);

const serverId = "onzczbfc";


test.describe('Real email verification', () =>{

  test.beforeEach(async ({page})=>{
    await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  })

  test('Verification page is available', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    await expect (page.locator('h1')).toHaveText('Verify your email address');
  });

  test ('Verification email is received', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmailAddress,
    });
    expect(email.subject).toBe("Welcome to myTomorrows!");
  });

  test ('Successfull account verification', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmailAddress,
    });
    await page.goto(email.html.links[0].href);
    await expect (page.locator('p', { hasText: 'Your email' })).toHaveText('Your email has been successfully verified.');
  });

  test ('Invalid password setup', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmailAddress,
    });
    await page.goto(email.html.links[0].href);
    await page.getByPlaceholder('Enter your password').fill(testData.invalidPassword);
    await page.getByPlaceholder('Confirm your password').fill(testData.invalidPassword);
    await expect(page.locator('mat-error')).toHaveText('Please make sure your password matches our requirements');
  });

  test ('Valid password setup', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmailAddress,
    });
    await page.goto(email.html.links[0].href);
    await page.getByPlaceholder('Enter your password').fill(testData.validPassword);
    await page.getByPlaceholder('Confirm your password').fill(testData.validPassword);
    await page.getByRole('button', { name: 'Activate account' }).click();
    await page.waitForTimeout(3000);
    await expect (page.locator('p', { hasText: 'Your account' })).toHaveText('Your account has been activated.');
  });

  test ('Compleating account setup with HPC number that is already in use', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmailAddress,
    });
    await page.goto(email.html.links[0].href);
    await page.getByPlaceholder('Enter your password').fill(testData.validPassword);
    await page.getByPlaceholder('Confirm your password').fill(testData.validPassword);
    await page.getByRole('button', { name: 'Activate account' }).click();
    await page.locator('mat-form-field').filter({ hasText: 'General' }).locator('mat-icon').click();
    await page.locator('#mat-option-1').getByText('nurse practitioner').click();
    await page.locator('myt-select').filter({ hasText: 'Speciality *' }).locator('mat-icon').click();
    await page.getByRole('option', { name: 'Cardiology' }).locator('span').first().click();
    await page.locator('#mat-select-value-5').click();
    await page.getByRole('option', { name: 'Ukraine' }).locator('span').first().click();
    await page.getByPlaceholder('12345678').fill(testData.htcInUse);
    await page.getByLabel('Yes').check();
    await page.getByRole('button', { name: 'Complete setup' }).click();
    await page.waitForTimeout(3000);
    await expect (page.locator('p', { hasText: 'Something went wrong' })).toHaveText('Something went wrong. Please try again later, or contact us if the issue persists.');
  });

  test ('Registration with the email that is already in use', async ({ page }) => {
    await page.locator('#mat-input-0').fill(testData.emailInUse);
    await page.locator('#mat-input-1').fill(testData.emailInUse);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testData.emailInUse,
    });
    await page.goto(email.html.links[0].href);
    await page.getByPlaceholder('Enter your password').fill(testData.validPassword);
    await page.getByPlaceholder('Confirm your password').fill(testData.validPassword);
    await page.getByRole('button', { name: 'Activate account' }).click();
    await page.waitForTimeout(3000);
    await expect (page.locator('p', { hasText: 'Password is already' })).toHaveText('Password is already set.');
  });

  test ('Complete account setup', async ({ page }) => {
    const emailPrefix = generateEmail(10);
    const testEmailAddress = `${emailPrefix}@${serverId}.mailosaur.net`;
    await page.locator('#mat-input-0').fill(testEmailAddress);
    await page.locator('#mat-input-1').fill(testEmailAddress);
    await page.getByPlaceholder('First name').fill(testData.validFirstName);
    await page.getByPlaceholder('Last name').fill(testData.validLastName);
    await page.getByLabel('By ticking this box, I').check();
    await page.getByRole('button', { name: 'Next: verification' }).click();
    await page.waitForTimeout(3000);
    const email = await mailosaur.messages.get(serverId, {
      sentTo: testEmailAddress,
    });
    await page.goto(email.html.links[0].href);
    await page.getByPlaceholder('Enter your password').fill(testData.validPassword);
    await page.getByPlaceholder('Confirm your password').fill(testData.validPassword);
    await page.getByRole('button', { name: 'Activate account' }).click();
    await page.locator('mat-form-field').filter({ hasText: 'General' }).locator('mat-icon').click();
    await page.locator('#mat-option-1').getByText('nurse practitioner').click();
    await page.locator('myt-select').filter({ hasText: 'Speciality *' }).locator('mat-icon').click();
    await page.getByRole('option', { name: 'Cardiology' }).locator('span').first().click();
    await page.locator('#mat-select-value-5').click();
    await page.getByRole('option', { name: 'Ukraine' }).locator('span').first().click();
    await page.getByPlaceholder('12345678').fill(htc);
    await page.getByLabel('Yes').check();
    await page.getByRole('button', { name: 'Complete setup' }).click();
    await page.waitForTimeout(3000);
    await expect (page.locator('p', { hasText: 'Welcome to myTomorrows' })).toHaveText('Welcome to myTomorrows! Your account was successfully created.');
  });
})