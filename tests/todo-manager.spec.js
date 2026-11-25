import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'todo-manager-tasks';

async function resetStorage(page) {
  await page.addInitScript(({ key }) => {
    try { localStorage.removeItem(key); } catch (e) {}
  }, { key: STORAGE_KEY });
}

function taskItem(page, title) {
  return page.locator('li.task-item', {
    has: page.locator('span', { hasText: title })
  });
}

function taskCheckbox(page, title) {
  return taskItem(page, title).locator('input[type="checkbox"]');
}

test.describe('To-Do Manager - Core F2E flows', () => {
  test.beforeEach(async ({ page }) => {
    await resetStorage(page);
    await page.goto('/');
  });

  test('shows empty state when there are no tasks', async ({ page }) => {
    await expect(page.locator('.empty-state')).toContainText('No tasks yet. Add your first task above.');
    await expect(page.locator('li.task-item')).toHaveCount(0);
  });

  test('adds a new task and clears input', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', 'Buy milk');
    await page.click('button:ter
("Add task")');
    await expect(page.locator('.task-item span', { hasText: 'Buy milk' })).toBeVisible();
    await expect(page.locator('input[aria-label="New task"]')).toHaveValue('');
  });

  test('does not add empty or whitespace-only tasks', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', '');
    await page.click('button:text("Add task")');
    await expect(page.locator('li.task-item')).toHaveCount(0);

    await page.fill('input[aria-label="New task"]', '   ');
    await page.click('button:text("Add task")');
    await expect(page.locator('li.task-item')).toHaveCount(0);
  });

  test('toggles a task completed status', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', 'Pay rent');
    await page.click('button:ter
("Add task")');
    const title = page.locator('.task-item span', { hasText: 'Pay rent' });

    await taskCheckbox(page, 'Pay rent').check();
    await expect(title).toHaveClass(/completed/);

    await taskCheckbox(page, 'Pay rent').uncheck();
    await expect(title).not.toHaveClass(/completed/);
  });

  test('deletes a task', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', 'Call the doctor');
    await page.click('button:ter
("Add task")');
    await taskItem(page, 'Call the doctor').locator('button:text("Delete")').click();
    await expect(page.locator('.task-item span', { hasText: 'Call the doctor' })).toHaveCount(0);
  });

  test('filters tasks by Pending and Completed', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', 'Task A');
    await page.click('button:text("Add task")');
    await page.fill('input[aria-label="New task"]', 'Task B');
    await page.click('button:ter
("Add task")');

    await taskCheckbox(page, 'Task B').check();

    await page.click('nav.filters button:ter
("Pending")');
    await expect(page.locator('.task-item span', { hasText: 'Task A' })).toBeVisible();
    await expect(page.locator('.task-item span', { hasText: 'Task B' })).toHaveCount(0);

    await page.click('nav.filters button:text("Completed")');
    await expect(page.locator('.task-item span', { hasText: 'Task B' })).toBeVisible();
    await expect(page.locator('.task-item span', { hasText: 'Task A' })).toHaveCount(0);

    await page.click('nav.filters button:text("All")');
    await expect(page.locator('li.task-item')).toHaveCount(2);
  });

  test('searches and can clear filters', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', 'Walk the dog');
    await page.click('button:text("Add task")');

    await page.fill('input[aria-label="Search tasks"]', 'zzz');
    await expect(page.locator('.empty-state')).toContainText('No tasks match your search.');

    await page.click('button:text("Clear filters")');
    await expect(page.locator('input[aria-label="Search tasks"]')).toHaveValue('');
    await expect(page.locator('nav.filters button.active')).toHaveText(/All/);
    await expect(page.locator('.task-item span', { hasText: 'Walk the dog' })).toBeVisible();
  });

  test('persists tasks to LocalStorage and restores on reload', async ({ page }) => {
    await page.fill('input[aria-label="New task"]', 'Pack lunch');
    await page.click('button:text("Add task")');

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored).toBeTruthy();

    await page.reload();
    await expect(page.locator('.task-item span', { hasText: 'Pack lunch' })).toBeVisible();
  });
});
