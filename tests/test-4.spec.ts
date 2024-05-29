import { test, expect } from '@playwright/test';
import MailosaurClient from "mailosaur";
const https = require("https");

const mailosaur = new MailosaurClient("ZN3j4kC7mNSbpHLZSZhxECzjdA0OP5Sf");


function createNewHTC(length: number): string {
  if (length < 1) {
    throw new Error('Length must be greater than 0');
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit.toString();
  }

  return result;
}

const newHTC = createNewHTC(10);

function generateNewEmail(length: number): string {
  if (length < 1) {
    throw new Error('Length must be greater than 0');
  }

  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

const newEmail = generateNewEmail(10);


test ('Email verification', async ({ page }) => {
  const serverId = "onzczbfc";
  const testEmailAddress = `${newEmail}@${serverId}.mailosaur.net`;

  await page.goto('https://platform-develop.mytomorrows.com/create-account/details-entry?user_type=hcp');
  await page.locator('#mat-input-0').fill(testEmailAddress);
  await page.locator('#mat-input-1').fill(testEmailAddress);
  await page.getByPlaceholder('First name').fill('Test');
  await page.getByPlaceholder('Last name').fill('user');
  await page.getByLabel('By ticking this box, I').check();
  await page.getByRole('button', { name: 'Next: verification' }).click();

  const email = await mailosaur.messages.get(serverId, {
    sentTo: testEmailAddress,
  });
  //expect(email.subject).toBe("Welcome to myTomorrows!");

  await page.goto(email.html.links[0].href);
  await page.getByPlaceholder('Enter your password').fill('20testPASS!');
  await page.getByPlaceholder('Confirm your password').fill('20testPASS!');
  await page.getByRole('button', { name: 'Activate account' }).click();
  await page.locator('mat-form-field').filter({ hasText: 'General' }).locator('mat-icon').click();
  await page.locator('#mat-option-1').getByText('nurse practitioner').click();
  await page.locator('myt-select').filter({ hasText: 'Speciality *' }).locator('mat-icon').click();
  await page.getByRole('option', { name: 'Cardiology' }).locator('span').first().click();
  await page.locator('#mat-select-value-5').click();
  await page.getByRole('option', { name: 'Ukraine' }).locator('span').first().click();
  await page.getByPlaceholder('12345678').fill(newHTC);
  await page.getByLabel('Yes').check();
  await page.getByRole('button', { name: 'Complete setup' }).click();
  await expect (page.locator('p', { hasText: 'Welcome to myTomorrows' })).toHaveText('Welcome to myTomorrows! Your account was successfully created.');
});