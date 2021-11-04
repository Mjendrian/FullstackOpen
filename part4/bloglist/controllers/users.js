const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Creating a new User
usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password) {
    response.status(400).json( { error : 'password is required' } ).end
  }else if (body.password.length < 3) {
    response.status(400).json( { error : 'password is too short (min length: 3)' } ).end
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

// List Users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title : 1, author : 1, url : 1 })
  response.json(users)
})

module.exports = usersRouter