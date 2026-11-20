import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'todo-manager-tasks';

const clearStorage = async (page) => {
  await page.addInitScript(
    ({ key }) => window.localStorage.removeItem(key),
    { key: STORAGE_KEY }
  );
};

const seedTasks = async (page, tasks) => {
  await page.addInitScript(
    ({ key, tasks }) => window.localStorage.setItem(key, JSON.stringify(tasks)),
    { key: STORAGE_KEY, tasks }
  );
};

const addTaskViaUI = async (page, title) => {
  await page.getByLabel('New task').fill(title);
   await page.getByRole('button', { name: /Add task/i }).click();
};

const getTaskItem = (page, title) => page.locator('.task-item').filter( { hasText: title } );

test.describe('To-Do Manager - core flows', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
  });

  test('add task, toggle, delete', async ({ page }) => {
    await addTaskViaUI (page, 'Buy milk');
    await expect(getTaskItem(page, 'Buy milk')).toBeVisible();

    const item = getTaskItem(page, 'Buy milk');
    await item.getByRole('checkbox').check();
    await expect(page.locator('.task-summary')).toContainText('1 completed');

    await item.getByRole('button', { name: /Delete/i }).click();
    await expect(item).toHaveCount(0);
  });

  test('filter and search', async ({ page }) => {
    await addTaskViaUI (page, 'Wash car');
    await addTaskViaUI(page, 'Pay rent');
    await getTaskItem(page, 'Pay rent')).getByRole('checkbox').check();

    await page.getByRole('button', { name: /Pending/i }).click();
    await expect(page.locator('.task-item')).toContainText('Wash car');

    await page.getByLabel('Search tasks').fill('war');
    await expect(page.locator('.task-item')).toHaveCount(1);
  });
});

test.describe('To-Do Manager - LocalStorage', () => {
  test('loads saved tasks', async ({ page }) => {
    await seedTasks(page, [{ id: '1', title: 'Stored task', completed: false }]);
    await page.goto('/');
    await expect(getTaskItem(page, 'Stored task')).toBeVisible();
  });
});
