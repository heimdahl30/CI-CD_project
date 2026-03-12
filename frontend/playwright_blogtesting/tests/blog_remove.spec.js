const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog remove', () => {
  beforeEach(async ({ request, page }) => {
    await request.post('http://127.0.0.1:3003/api/testing/reset')
    await request.post('http://127.0.0.1:3003/api/users', {
      data: {
        name: 'Cheese',
        username: 'Mozarella',
        password: 'Milk'
      }
    })
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()

  })

  test('blog can be removed', async ({ page }) => {

    await loginWith(page, 'Mozarella', 'Milk')
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible({ timeout: 45000 })
    // await expect(page.getByText(/cheese logged in/i)).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: 'create blog' }).waitFor({ state: 'visible', timeout: 30000 })
    await page.getByRole('button', { name: 'create blog' }).click()
    await createBlog(page, 'another blog', 'another author', 'http://www.123.com')
    await page.getByRole('button', { name: 'view' }).click()
    await page.on('dialog', async dialog => dialog.accept())
    await page.getByRole('button', { name: 'remove blog' }).click()
    await expect(page.getByText('another author')).not.toBeVisible()
  })
})