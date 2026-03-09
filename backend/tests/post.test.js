const { test, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const api = supertest(app)


test('blog added through post even without likes', async () => {

  const initialBlogs = await api.get('/api/blogs')
  const initialBlogsLength = initialBlogs._body.length
  const initialLikes = initialBlogs.body.map(blog => blog.likes)
  const initialLikesLength = initialLikes.length
  console.log(initialBlogsLength)

  let blog = {
    title: "A Peek At Bank of America's AI Playbook",
    author: "Brian",
    url: "https://www.forrester.com/blogs/a-peek-at-bank-of-americas-ai-playbook/",

  }

  await api.post('/api/blogs')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdvbGEiLCJpZCI6IjY4NmY2MTFhOGJhNzM3MTQyMWYyZWZmNSIsImlhdCI6MTc1MjEyOTk1MX0.SEiZId0GrqtW917Cyj0hRqrlUUb3JZgZ72oHXa5PryA')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  console.log(response.body)

  const contents = response.body.map(r => r.title)
  const likes = response.body.map(r => r.likes)
  const likesLength = likes.length

  console.log(contents)

  assert.strictEqual(response.body.length, initialBlogsLength + 1)
  assert.strictEqual(likesLength, initialLikesLength + 1)
  assert(contents.includes("A Peek At Bank of America's AI Playbook"))
})

test('without title or url, blog will not be added', async () => {

  const initialBlogs = await api.get('/api/blogs')
  const initialBlogsLength = initialBlogs.body.length

  const blog = {
    title: "This should not get web logged.",
    author: "Sin",
    likes: 31
  }

  await api.post('/api/blogs')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdvbGEiLCJpZCI6IjY4NmY2MTFhOGJhNzM3MTQyMWYyZWZmNSIsImlhdCI6MTc1MjEyOTk1MX0.SEiZId0GrqtW917Cyj0hRqrlUUb3JZgZ72oHXa5PryA')
    .send(blog)
    .expect(400)


  const finalBlogs = await api.get('/api/blogs')
  const finalBlogsLength = finalBlogs.body.length

  assert.strictEqual(finalBlogsLength, initialBlogsLength)
})

test("without token, blog can't be added", async () => {

  const initialBlogs = await api.get('/api/blogs')
  const initialBlogsLength = initialBlogs.body.length

  const blog = {
    title: "This should not get web logged.",
    author: "Sin",
    url: "yyyyyyyy",
    likes: 31
  }

  const response = await api.post('/api/blogs')
    .send(blog)
    .expect(401)

  console.log(response.body)


  const finalBlogs = await api.get('/api/blogs')
  const finalBlogsLength = finalBlogs.body.length

  assert.strictEqual(finalBlogsLength, initialBlogsLength)
  assert(response.body.error.includes('token invalid'))


})

after(async () => {
  await mongoose.connection.close()
})


