const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'metadmin',
    name: 'Meta Bergzucker',
    password: 'BcktoSafety',
  }
]

const initialBlogs = [
  {
    title: 'A very interesting blog',
    author: 'Nin Jah Long',
    url: 'https://www.aninterstingblog.com',
    likes: 2
  },
  {
    title: 'A not so interesting blog',
    author: 'Nin Jah Short',
    url: 'https://www.alessinterstingblog.com',
    likes: 0
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ author: 'Will RemOve Thissoon', title: 'No matter', url: 'https://veryshort.su', likes: 10 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUsers, usersInDb
}