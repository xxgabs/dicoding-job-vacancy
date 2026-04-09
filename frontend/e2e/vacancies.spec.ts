import { test, expect } from "@playwright/test";

// Requirement 9.1
test("vacancies list page shows at least one JobCard", async ({ page }) => {
  await page.goto("/vacancies");

  // Wait for loading to finish
  await page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });

  const cards = page.locator('[data-testid="job-card"]');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
});

// Requirement 9.2 / Property 7
test("search input filters displayed JobCards by title", async ({ page }) => {
  await page.goto("/vacancies");

  // Wait for initial cards to load
  await page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });

  // Grab the title of the first card to use as a search term
  const firstCardTitle = await page
    .locator('[data-testid="job-card"] h2')
    .first()
    .textContent();
  expect(firstCardTitle).toBeTruthy();

  // Use a partial search term (first word of the title)
  const searchTerm = firstCardTitle!.split(" ")[0];

  const searchInput = page.locator('[data-testid="search-input"]');
  await searchInput.fill(searchTerm);

  // Wait for the filtered results to settle
  await page.waitForTimeout(500);

  const cards = page.locator('[data-testid="job-card"]');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Every visible card title must contain the search term (case-insensitive)
  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).locator("h2").textContent();
    expect(title?.toLowerCase()).toContain(searchTerm.toLowerCase());
  }
});

// Requirement 9.3 / Property 8
test("clicking a vacancy navigates to detail page with correct information", async ({
  page,
}) => {
  await page.goto("/vacancies");

  // Wait for cards to load
  await page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });

  // Capture the first card's displayed title, company, and location
  const firstCard = page.locator('[data-testid="job-card"]').first();
  const expectedTitle = await firstCard.locator("h2").textContent();
  const expectedCompany = await firstCard.locator("p").first().textContent();
  const expectedLocation = await firstCard.locator("p").nth(1).textContent();

  // Click the card (wrapped in an anchor by JobCard or the list page)
  await firstCard.click();

  // Wait for the detail page to load
  await page.waitForSelector("article", { timeout: 10000 });

  // Verify the detail page shows the correct vacancy information
  await expect(page.locator("h1")).toHaveText(expectedTitle!);
  await expect(page.getByText(expectedCompany!)).toBeVisible();
  await expect(page.getByText(expectedLocation!)).toBeVisible();
});
