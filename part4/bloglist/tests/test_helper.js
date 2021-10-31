const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}