const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

test('update a blog', async () => {
    const initialBlogs = await api.get('/api/blogs')
    let blogToUpdate =  initialBlogs.body[0]
    console.log(blogToUpdate.id)

    let blog = {
        title:"Pause innovation now and pay the price later",
        author:"Stephanie",
        url:"https://www.forrester.com/blogs/pause-innovation-now-and-pay-the-price-later-why-ai-readiness-cant-wait/",
        likes:65
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`)
    .send(blog)
    .expect(201)
    .expect('Content-Type',/application\/json/)

    const finalBlogs = await api.get('/api/blogs')
    const updatedBlog = finalBlogs.body[0]

    assert.notStrictEqual(updatedBlog.likes,blogToUpdate.likes)
})

after(async () => {
  await mongoose.connection.close()
})