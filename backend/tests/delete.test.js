const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const api = supertest(app)
const User = require('../src/models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        id: savedUser._id.toString()
    }

    // Ensure process.env.SECRET is defined in your GitHub Workflow!
    token = jwt.sign(userForToken, process.env.SECRET)
})

test('delete a blog', async () => {

    console.log("Debug token", token)

    const newBlog = {
        title: "Test Blog for Deletion",
        author: "Test Author",
        url: "http://www.test.com",
        likes: 0
    }

    const postResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    const blogToDelete = postResponse.body

    const initialBlogs = await api.get('/api/blogs')
    const initialBlogsLength = initialBlogs.body.length


    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const finalBlogs = await api.get('/api/blogs')
    const finalBlogsLength = finalBlogs.body.length

    assert.strictEqual(finalBlogsLength, initialBlogsLength - 1)
})

after(async () => {
    await mongoose.connection.close()
})