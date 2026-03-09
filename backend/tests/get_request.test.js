const { test, describe, after } = require('node:test')
const supertest = require('supertest')
const app = require('../src/app')
const mongoose = require('mongoose')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

