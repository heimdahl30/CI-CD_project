const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {

    const { username, name, password } = request.body

    if (!password || password.length < 3) {
      return response.status(400).send({ error: 'password is too short or missing' })
    }

    else {

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        name,
        passwordHash,
      })

      const savedUser = await user.save()

      response.status(201).json(savedUser)
    }
  }

  catch (error) {
    next(error)
  }

})



usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs')
    return response.json(users)
  }
  catch (error) {
    next(error)
  }
})

module.exports = usersRouter
