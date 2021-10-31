const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// List all Blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Show one Blog
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Add a Blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.number
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// Delete a Blog
blogsRouter.delete('/:id', async (request, response) => {
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