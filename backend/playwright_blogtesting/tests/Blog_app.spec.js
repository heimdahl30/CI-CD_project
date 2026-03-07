const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe ('Blog app', () => {
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

  test('Login form is shown', async ({ page }) => {
    const locator1 = await page.getByText('username')
    const locator2 = await page.getByText('password')
    await expect(locator1).toBeVisible()
    await expect(locator2).toBeVisible()
  })

   describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('Mozarella')
    await page.getByRole('textbox').last().fill('Milk')
    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Cheese logged in')).toBeVisible()
  })

    test('fails with wrong credentials', async ({ page }) => {
    
    await loginWith(page, 'Mozarella', 'wrong')
    await expect(page.getByText('wrong credentials')).toBeVisible()
      
    })

  describe('When logged in', () => {
  beforeEach(async ({page}) => {

    await loginWith(page, 'Mozarella', 'Milk')

  })

  test('a new blog can be created', async ({ page }) => {

    await page.getByRole('button', {name: 'create blog'}).click()
    await page.getByTestId('title').fill('blog header')
    await page.getByTestId('author').fill('blog author')
    await page.getByTestId('url').fill('http://www.blog-testing.com')
    await page.getByRole('button', { name: 'submit' }).click()
    await expect(page.getByText('blog author')).toBeVisible()

  })

test('blog can be liked', async ({page}) => {
await page.getByRole('button', {name: 'create blog'}).click()
await createBlog(page, 'blog header', 'blog author', 'http://www.blog-testing2.com')
await page.getByRole('button', { name: 'view' }).click()
await page.getByRole('button', { name: 'like' }).click()
await expect(page.getByText('likes 1')).toBeVisible()

})

})
  })
})