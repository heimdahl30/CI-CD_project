const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('blogs arranged by likes', () => {
  beforeEach(async ({ request, page }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
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

  test('blogs arranged by likes in descending order', async ({ page }) => {

    await loginWith(page, 'Mozarella', 'Milk')
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible({ timeout: 15000 })
    // await expect(page.getByText(/cheese logged in/i)).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: 'create blog' }).waitFor({ state: 'visible', timeout: 15000 })
    await page.getByRole('button', { name: 'create blog' }).click()

    await createBlog(page, 'First', 'One', 'http://www.111.com')
    await expect(page.getByText('One')).toBeVisible()

    await createBlog(page, 'Second', 'Two', 'http://www.222.com')
    await expect(page.getByText('Two')).toBeVisible()

    await createBlog(page, 'Third', 'Three', 'http://www.333.com')
    await expect(page.getByText('Three')).toBeVisible()

    await expect(page.getByRole('button', { name: 'view' })).toHaveCount(3)

    await page.getByRole('button', { name: 'view' }).nth(0).click()
    await expect(page.getByRole('button', { name: 'like' })).toHaveCount(1)
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes 1')).toHaveCount(1)

    await page.getByRole('button', { name: 'view' }).nth(0).click()
    await expect(page.getByRole('button', { name: 'like' })).toHaveCount(2)
    await page.getByRole('button', { name: 'like' }).nth(1).click()
    await expect(page.getByText('likes 1')).toHaveCount(2)
    await page.getByRole('button', { name: 'like' }).nth(1).click()
    await expect(page.getByText('likes 2')).toHaveCount(1)


    await page.getByRole('button', { name: 'view' }).nth(0).click()
    await expect(page.getByRole('button', { name: 'like' })).toHaveCount(3)

    const list = page.getByTestId('likes');
    await expect(list).toHaveCount(3); // This forces Playwright to wait until all 3 are visible
    const items = await list.all();
    const likeValues = await Promise.all(items.map(async (item) => {
      const text = await item.textContent()
      const numMatch = text.match(/\d+/g)
      return parseInt(numMatch[0])
    }))

    for (let i = 0; i < likeValues.length - 1; i++) {
      expect(likeValues[i]).toBeGreaterThanOrEqual(likeValues[i + 1])
    }
  })
})