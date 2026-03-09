const { test, after } = require('node:test')
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
        id: savedUser._id.toString(),
    }

    // Ensure process.env.SECRET is defined in your GitHub Workflow!
    token = jwt.sign(userForToken, process.env.SECRET)
})

test('invalid password will not be accepted', async () => {
    const originalUser = await api.get('/api/users')
    const originalUserLength = originalUser.body.length

    let user = {
        username: "rabbit",
        name: "Jojo",
    }

    const response = await api.post('/api/users')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
    await api.post('/api/users').set('Authorization' `Bearer ${token}`).send(initialUser)

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