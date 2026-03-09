const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)

test('update a blog', async () => {

    const newBlog = {
        title: "Pause innovation now and pay the price later",
        author: "Stephanie",
        url: "https://www.forrester.com/blogs/pause-innovation-now-and-pay-the-price-later-why-ai-readiness-cant-wait/",
        likes: 61
    }

    await api.post('/api/blogs').send(newBlog)

    const response = await api.get('/api/blogs')

    let blog = {
        title: "Pause innovation now and pay the price later",
        author: "Stephanie",
        url: "https://www.forrester.com/blogs/pause-innovation-now-and-pay-the-price-later-why-ai-readiness-cant-wait/",
        likes: 62
    }

    await api.put(`/api/blogs/${response.body[0].id}`)
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const responsePostUpdate = await api.get('/api/blogs')

    assert.notStrictEqual(response.body[0].likes, responsePostUpdate.body[0].likes)
})

after(async () => {
    await mongoose.connection.close()
})