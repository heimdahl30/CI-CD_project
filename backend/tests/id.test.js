const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')

const api = supertest(app)

test('unique identifier is id', async () => {
  const blogs = await api.get('/api/blogs')
  console.log(blogs._body)
  let result

  if (blogs._body.length > 0) {
    result = typeof blogs._body[0].id
  }

  console.log(result)

  assert.strictEqual(result, 'string')

})

after(async () => {
  await mongoose.connection.close()
})

