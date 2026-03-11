const loginWith = async (page, username, password) => {

  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/login') && response.status() === 200,
    { timeout: 30000 }
  )
  await page.getByRole('textbox').first().fill(username)
  await page.getByRole('textbox').last().fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await responsePromise
}

const createBlog = async (page, title, author, url) => {

  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'save blog' }).click()

}

export { loginWith, createBlog }