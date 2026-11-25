import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'todo-manager-tasks';

async function clearTodoStorage(page) {
  await page.addInitScript((key) => {
    window.localStorage.removeItem(key);
  }, STORAGE_KEY);
}

async function addTask(page, title) {
  await page.getByLabel('New task').fill(title);
  await page.getByRole('button', { name: /add task/i }).click();
}

async function taskItem(page, title) {
  return page.locator('li.task-item').filter( { has: page.getByText(title, { exact: true }) }).first();
}

test.describe('To-Do Manager – core flows', () => {
  test.beforeEach(async ({ page }) => {
    await clearTodoStorage(page);
    await page.goto('/');
  });

  test('Can add a new task and see it in the list', async ({ page }) => {
    await addTask(page, 'Buy milk');
    await expect(page.getByText('Buy milk', { exact: true })).toBeVisible();
   });
});
