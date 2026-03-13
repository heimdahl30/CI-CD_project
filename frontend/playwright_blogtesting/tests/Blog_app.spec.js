const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
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

  test('Login form is shown', async ({ page }) => {
    const locator1 = await page.getByText('username')
    const locator2 = await page.getByText('password')
    await expect(locator1).toBeVisible()
    await expect(locator2).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Mozarella', 'Milk')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible({ timeout: 60000 })
      await expect(page.getByText(/cheese logged in/i)).toBeVisible({ timeout: 15000 })
    })

    test('fails with wrong credentials', async ({ page }) => {

      await loginWith(page, 'Mozarella', 'wrong')
      await page.waitForTimeout(1000)
      await expect(page.getByText(/wrong credentials/i)).toBeVisible({ timeout: 30000 })

    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {

        await loginWith(page, 'Mozarella', 'Milk')


      })

      test('a new blog can be created', async ({ page }) => {

        await page.getByRole('button', { name: 'create blog' }).waitFor({ state: 'visible', timeout: 30000 })
        await page.getByRole('button', { name: 'create blog' }).click();
        await page.getByTestId('title').fill('blog header')
        await page.getByTestId('author').fill('blog author')
        await page.getByTestId('url').fill('http://www.blog-testing.com')
        await page.getByRole('button', { name: 'save blog' }).click()
        await expect(page.getByText('blog author')).toBeVisible()

      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'create blog' }).waitFor({ state: 'visible', timeout: 30000 })
        await page.getByRole('button', { name: 'create blog' }).click();
        await createBlog(page, 'blog header', 'blog author', 'http://www.blog-testing2.com')
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()

      })

    })
  })
})