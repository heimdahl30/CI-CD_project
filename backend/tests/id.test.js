const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')

const api = supertest(app)

test('unique identifier is id', async () => {

  const newBlog = {
    title: "ID Test Blog",
    author: "Tester",
    url: "http://www.test.com",
    likes: 1
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')

  const blogs = response.body

  console.log(blogs)

  const result = typeof blogs[0].id

  assert.strictEqual(result, 'string')

})

after(async () => {
  await mongoose.connection.close()
})

