const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    let passwordHash = await bcrypt.hash( user.password, 10)
    let userObject = new User({ username: user.username, name: user.name, passwordHash })

    await userObject.save()
  }

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

})

describe('reading blogs', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('One blog is very interesting', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    expect(title).toContain(
      'A very interesting blog'
    )
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('the returned blogs have a referenced user', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'NaSy Goreng',
      url: 'https://somewhereelse.io',
      likes: 10
    }

    const credentials = {
      username : helper.initialUsers[0].username,
      password : helper.initialUsers[0].password
    }

    const loginData = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    const authToken = `bearer ${loginData.body.token}`

    const responseCreate = await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get(`/api/blogs/${responseCreate.body.id}`)
      .set('Authorization', authToken)
      .expect(200)

    console.log(response.body)

    // The test only works when using the API to crete blogs.
    expect(response.body.user.name).toBe( helper.initialUsers[0].name)
  })

})

describe('adding blogs', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'NaSy Goreng',
      url: 'https://somewhereelse.io',
      likes: 10
    }

    const credentials = {
      username : helper.initialUsers[0].username,
      password : helper.initialUsers[0].password
    }

    const loginData = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    const authToken = `bearer ${loginData.body.token}`

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const title = blogsAtEnd.map(n => n.title)

    expect(title).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('a new blog entry is added with a user_id', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'NaSy Goreng',
      url: 'https://somewhereelse.io',
      likes: 10
    }

    const credentials = {
      username : helper.initialUsers[0].username,
      password : helper.initialUsers[0].password
    }

    const loginData = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    const authToken = `bearer ${loginData.body.token}`

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const dbUserId = await User.findOne({})

    expect(response.body.user).toBe(dbUserId._id.toString())
  })

  test('missing likes default to 0', async () => {
    const newBlog = {
      title: 'I d\'ont like missing likes',
      author: 'Sas Ziki',
      url: 'https://givememorelikes.com'
    }

    const credentials = {
      username : helper.initialUsers[0].username,
      password : helper.initialUsers[0].password
    }

    const loginData = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    const authToken = `bearer ${loginData.body.token}`

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(response.body.likes).toBe(0)
  })

  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: 'NaSy Goreng',
      likes: 10
    }

    const credentials = {
      username : helper.initialUsers[0].username,
      password : helper.initialUsers[0].password
    }

    const loginData = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    const authToken = `bearer ${loginData.body.token}`

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('manipulating blogs', () => {
  test('a blog can be deleted', async () => {

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'NaSy Goreng',
      url: 'https://somewhereelse.io',
      likes: 10
    }

    const credentials = {
      username : helper.initialUsers[0].username,
      password : helper.initialUsers[0].password
    }

    const loginData = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)

    const authToken = `bearer ${loginData.body.token}`

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${response.body.id}`)
      .set('Authorization', authToken)
      .send()
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(newBlog.title)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'async/await simplifies making async calls',
      author: 'NaSy Goreng',
      url: 'https://somewhereelse.io',
      likes: 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const title = blogsAtEnd.map(n => n.title)

    expect(title).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('likes do increment by one', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: '+1'
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.likes).toBe(blogToUpdate.likes + 1)
  })

})

afterAll(() => {
  mongoose.connection.close()
})