import React, { useState, useEffect, useRef } from 'react'
import { Blog, BlogForm } from './components/Blog'
// import { LoginForm } from './components/LoginForm'
import { Togglable } from './components/Utils'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

// Notification composant
const Notification = ({ notification }) => {

  if (notification.message === null) {
    return null
  }

  return (
    <div className={ notification.type }>
      {notification.message}
    </div>
  )
}

const App = () => {
  // States for Blog control
  const [blogs, setBlogs] = useState([])
  // States for Login control
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // State for Notification
  const [notification, setNotification] = useState({ message : null, type : 'success' , duration : 3 })

  const blogFormRef = useRef()

  // Login handler
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      alert('Wrong credentials')
    }
    return true
  }

  // Logout handler
  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem(
        'loggedBloglistUser'
      )
      blogService.setToken('')
      setUser(null)
    } catch (exception) {
      alert('Logout impossible')
    }
    return true
  }

  // Blog submit handler
  const addBlog = async (newBlog) => {
    try {
      const blog = await blogService.create({
        ...newBlog
      })
      setSortedBlogs(blogs.concat(blog))
      handleNotification(`The blog ${blog.title} has been created.`, 'success')
      blogFormRef.current.toggleVisibility() // Could have solved this directly in the Blog component with the return value TRUE
      return true
    } catch ( exception ) {
      console.log(exception.response.status)
      handleNotification('Unable to add a Blog', 'error')
      if(exception.response.status === 401) {
        window.localStorage.removeItem(
          'loggedBloglistUser'
        )
        blogService.setToken('')
        setUser(null)
      }
      return false
    }
  }

  const incBlogLikes = async (incBlog) => {
    try {
      console.log(incBlog)
      const blog = await blogService.incLikes({
        ...incBlog
      })
      setSortedBlogs(blogs.map(mappedBlog => mappedBlog.id !== incBlog.id ? mappedBlog : blog))
      return true
    } catch ( exception ) {
      console.log(exception.response.status)
      handleNotification('Unable to add the like', 'error')
      if(exception.response.status === 401) {
        window.localStorage.removeItem(
          'loggedBloglistUser'
        )
        blogService.setToken('')
        setUser(null)
      }
      return false
    }
  }

  const deleteBlog = async (blogToRemove) => {
    try {

      await blogService.remove({
        ...blogToRemove
      })
      handleNotification(`The blog ${blogToRemove.title} has been deleted.`, 'success')
      setSortedBlogs(blogs.filter(blog => blog.id !== blogToRemove.id ))
      return true
    } catch ( exception ) {
      console.log(exception.response.status)
      handleNotification(exception.response.data.error, 'error')
      if(exception.response.status === 401) {
        window.localStorage.removeItem(
          'loggedBloglistUser'
        )
        blogService.setToken('')
        setUser(null)
      }
      return false
    }
  }

  // Notification handler
  const handleNotification = (message, type) => {
    const notification = { message : message, type : type }
    setNotification(notification)
    setTimeout(() => setNotification({ message : null, type : null }), 3000)
  }

  const setSortedBlogs = (blogs) => {
    const sortedBlogs = ( blogs.length > 0 ? blogs.sort((blogA, blogB) => (blogB.likes - blogA.likes)) : [] )

    setBlogs(sortedBlogs)
  }

  useEffect ( async () => {
    try {
      const blogs = await blogService.getAll()
      console.log(blogs)
      setSortedBlogs( blogs )
    } catch( exception ) {
      handleNotification('Unable to fetch the blogs', 'error')
      setSortedBlogs( [] )
    }
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }  }, [])

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />
      <form onSubmit={handleLogout}>
        <p>{user.name} logged-in
          <button type="submit">logout</button>
        </p>
      </form>
      <br/>
      <Togglable buttonLabel="Add a blog" cancelButtonLabel="Cancel" ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} incBlogLikes={incBlogLikes} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}



export default App