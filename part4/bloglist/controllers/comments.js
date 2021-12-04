const commentsRouter = require('express').Router({mergeParams: true})
const blog = require('../models/blog')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
require('../models/blog')

// List all Comments
commentsRouter.get('/', async (request, response) => {
  const comments = await Comment.find({}).populate('blog', { name : 1 })
  response.json(blogs)
})

// Add a Comment
commentsRouter.post('/', async (request, response) => {

  const body = request.body

  const comment = new Comment({
    comment: body.comment,
    blog: request.params.blogId
  })

  const savedComment = await comment.save()
  await Blog.findOneAndUpdate({_id : request.params.blogId}, { $push: { comments : savedComment._id } })

  const returnedBlog = await Blog.findById(request.params.blogId)
    .populate('user', { name : 1 })
    .populate('comments', { comment : 1 })


  /*const blog = await Blog.findById(request.params.blogId)
  const comments = (blog.comments === undefined ? [] : blog.comments)
  console.log(comments)
  const newComments = comments.concat(savedComment._id)
  console.log(newComments)
  const newBlog = {...blog, comments : newComments}
  console.log(newBlog)

  const blogToReturn = await Blog.findOneAndUpdate(newBlog)
*/
  response.status(201).json(returnedBlog)
})




module.exports = commentsRouter