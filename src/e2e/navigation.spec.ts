import { expect, test } from '@playwright/test';

test('home movie navigation restores the home list on browser back', async ({ page }) => {
  await page.goto('/');

  const firstMovie = page.locator('a[href^="/movie/"]').first();
  await expect(firstMovie).toBeVisible();
  const firstMovieHref = await firstMovie.getAttribute('href');
  expect(firstMovieHref).toMatch(/^\/movie\/.+/);

  await firstMovie.click();
  await expect(page).toHaveURL(/\/movie\/[^/?#]+/);
  await expect(page.getByRole('heading', { name: '放映時刻' })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(`a[href="${firstMovieHref}"]`).first()).toBeVisible();
});
