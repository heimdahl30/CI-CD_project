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
    await loginWith(page, 'Mozarella', 'Milk')
    await page.getByRole('button', {name: 'create blog'}).click()
    await createBlog(page, 'random blog', 'myself', 'http://www.bbb.com')
    await page.getByRole('button', { name: 'logout'}).click()

  })

test('remove button visible only to the user who created the blog', async ({request, page}) => {

  await request.post('/api/users', {
      data: {
        name: 'Mumbai',
        username: 'India',
        password: 'City'
      }
    })

   await loginWith(page, 'India', 'City')
   await page.getByRole('button', { name: 'view' }).click()
   await expect(page.getByText('random blog')).toBeVisible()
   await expect(page.getByText('myself')).toBeVisible()
   await expect(page.getByRole('button', {name: 'remove blog'})).not.toBeVisible()

})
  })