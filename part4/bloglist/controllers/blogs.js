const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('../models/user')
const jwt = require('jsonwebtoken')

// List all Blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name : 1 })
  response.json(blogs)
})

// Show one Blog
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { name : 1 })
  if(blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Add a Blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // We get the User from the Token
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const userObj = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.number,
    user: userObj._id
  })

  const savedBlog = await blog.save()


  userObj.blogs = userObj.blogs.concat(savedBlog._id)
  await userObj.save()

  response.status(201).json(savedBlog)
})

// Delete a Blog
blogsRouter.delete('/:id', async (request, response) => {

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const userObj = request.user

  if(!userObj.blogs.includes(request.params.id)) {
    return response.status(401).json({
      error: 'L\'action est limitée au propriétaire du Blog'
    })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// Update a Blog (likes incriment by 1, if we receive +X)
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = (body.likes[0] === '+')
    ? {
      $inc: { likes: 1 }
    }
    :
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter