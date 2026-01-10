import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
	await expect(page.locator('h1')).toHaveText('Nyx');
});

test('can go to login page', async ({ page }) => {
	await page.goto('/login');

	await expect(page.locator('label[for=username]')).toHaveText('Username');
	await expect(page.locator('input#username')).toBeVisible();

	await expect(page.locator('label[for=password]')).toHaveText('Password');
	await expect(page.locator('input#password')).toBeVisible();
});
