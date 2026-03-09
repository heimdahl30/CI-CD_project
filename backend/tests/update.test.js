const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../src/app')
const supertest = require('supertest')
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

test('update a blog', async () => {

    const newBlog = {
        title: "Pause innovation now and pay the price later",
        author: "Stephanie",
        url: "https://www.forrester.com/blogs/pause-innovation-now-and-pay-the-price-later-why-ai-readiness-cant-wait/",
        likes: 61
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    const response = await api.get('/api/blogs')

    let blog = {
        title: "Pause innovation now and pay the price later",
        author: "Stephanie",
        url: "https://www.forrester.com/blogs/pause-innovation-now-and-pay-the-price-later-why-ai-readiness-cant-wait/",
        likes: 62
    }

    await api.put(`/api/blogs/${response.body[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const responsePostUpdate = await api.get('/api/blogs')

    assert.notStrictEqual(response.body[0].likes, responsePostUpdate.body[0].likes)
})

after(async () => {
    await mongoose.connection.close()
})