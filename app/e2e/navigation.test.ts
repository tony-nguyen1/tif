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

test('can create an account', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('test-user');
	await page.getByLabel('Password').fill('testPassword');

	await page.getByRole('button', { name: 'Create an account' }).click();

	await expect(page).toHaveURL('/profile');
	await expect(page.getByText('Profile')).toBeVisible();
});

test('can connect with account', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('test-user');
	await page.getByLabel('Password').fill('testPassword');

	await page.getByRole('button', { name: 'Login' }).click();

	await expect(page).toHaveURL('/profile');
	await expect(page.getByText('Profile')).toBeVisible();
});

test('meal page is accessible', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('test-user');
	await page.getByLabel('Password').fill('testPassword');

	await page.getByRole('button', { name: 'Login' }).click();

	await page.getByRole('link', { name: 'Meal' }).click();
	await expect(page).toHaveURL('/meal');
	await expect(page.getByRole('heading', { name: 'Meal', exact: true })).toBeVisible();
});

test('sleep page is accessible', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('test-user');
	await page.getByLabel('Password').fill('testPassword');

	await page.getByRole('button', { name: 'Login' }).click();

	await page.getByRole('link', { name: 'Sleep' }).click();
	await expect(page).toHaveURL('/sleep');
	await expect(page.getByRole('heading', { name: 'Sleep', exact: true })).toBeVisible();
});

test('workout page is accessible', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('test-user');
	await page.getByLabel('Password').fill('testPassword');

	await page.getByRole('button', { name: 'Login' }).click();

	await page.getByRole('link', { name: 'Workout' }).click();
	await expect(page).toHaveURL('/workout');
	await expect(page.getByRole('heading', { name: 'Workout', exact: true })).toBeVisible();
});

test('weight page is accessible', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Username').fill('test-user');
	await page.getByLabel('Password').fill('testPassword');

	await page.getByRole('button', { name: 'Login' }).click();

	await page.getByRole('link', { name: 'Weight' }).click();
	await expect(page).toHaveURL('/weight');
	await expect(page.getByRole('heading', { name: 'Weight', exact: true })).toBeVisible();
});
