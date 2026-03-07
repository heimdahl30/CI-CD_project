const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe ('Blog remove', () => {
  beforeEach(async ({ request, page }) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
      data: {
        name: 'Cheese',
        username: 'Mozarella',
        password: 'Milk'
      }
    })

  await page.goto('/')
 
  })

test('blog can be removed', async ({page}) => {

await loginWith(page, 'Mozarella', 'Milk')

await page.getByRole('button', {name: 'create blog'}).click()
await createBlog(page, 'another blog', 'another author', 'http://www.123.com')
await page.getByRole('button', { name: 'view' }).click()
await page.on('dialog', async dialog => dialog.accept())
await page.getByRole('button', {name: 'remove blog'}).click()
await expect(page.getByText('another author')).not.toBeVisible()
})
})