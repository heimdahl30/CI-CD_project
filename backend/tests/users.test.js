const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const api = supertest(app)

test('invalid password will not be accepted', async () => {
    const originalUser = await api.get('/api/users')
    const originalUserLength = originalUser.body.length

    let user = {
        username: "rabbit",
        name: "Jojo",
    }

    const response = await api.post('/api/users')
        .send(user)
        .expect(400)

    const finalUser = await api.get('/api/users')
    const finalUserLength = finalUser.body.length

    assert.strictEqual(finalUserLength, originalUserLength)
    assert(response.body.error.includes('password is too short or missing'))

})

test('invalid username will not be accepted', async () => {
    const originalUser = await api.get('/api/users')
    const originalUserLength = originalUser.body.length

    let user = {
        username: "ra",
        name: "Jojo",
        password: "123456yhn"
    }

    const response = await api.post('/api/users')
        .send(user)
        .expect(400)

    const finalUser = await api.get('/api/users')
    const finalUserLength = finalUser.body.length

    assert.strictEqual(finalUserLength, originalUserLength)
    assert(response.body.error.includes("User validation failed:"))

})

test('duplicate username will not be accepted', async () => {
    const initialUser = {
        username: "Paquito",
        name: "Manny",
        password: "first-password"
    }
    await api.post('/api/users').send(initialUser)

    const usersAtStart = await api.get('/api/users')

    const duplicateUser = {
        username: "Paquito",
        name: "different name",
        password: "second-password"
    }

    const response = await api.post('/api/users')
        .send(duplicateUser)
        .expect(400)

    const userAtEnd = await api.get('/api/users')

    assert.strictEqual(usersAtStart.body.length, userAtEnd.body.length)
    assert.deepStrictEqual(response.body, { "error": "`username` should be unique" })

})


after(async () => {
    await mongoose.connection.close()
})