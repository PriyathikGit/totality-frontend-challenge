import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/"
test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);
  // get the sign in button
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  // find email textbox and fill the email
  await page.locator("[name=email]").fill("1@1.com")
  await page.locator("[name=password]").fill("password123") // creating new user for the test

  // now click the login button
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Succesful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();

});

test('should allow the user to Register', async ({ page }) => {
  const testEmail = `test_user_${Math.floor(Math.random() * 90000)+10000}@test.com` // creating random email
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
  await page.locator("[name=firstName]").fill("hello")
  await page.locator("[name=lastName]").fill("world")
  await page.locator("[name=email]").fill(testEmail)
  await page.locator("[name=password]").fill("welcome")
  await page.locator("[name=confirmPassword]").fill("welcome")
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Registration Succesfull")).toBeVisible();
});

