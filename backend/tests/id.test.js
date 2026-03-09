const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const api = supertest(app)

let token = null

beforeEach(async () => {
  await User.deleteMany({}) // Clear users
  // 1. Create a test user
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })
  const savedUser = await user.save()

  // 2. Generate a fresh token for this specific user
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id.toString(),
  }

  // Ensure process.env.SECRET is defined in your GitHub Workflow!
  token = jwt.sign(userForToken, process.env.SECRET)
})

test('unique identifier is id', async () => {

  const newBlog = {
    title: "ID Test Blog",
    author: "Tester",
    url: "http://www.test.com",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  const blogs = response.body

  const result = typeof blogs[0].id

  assert.strictEqual(result, 'string')

})

after(async () => {
  await mongoose.connection.close()
})

