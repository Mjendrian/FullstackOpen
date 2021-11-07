import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
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
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  // States for Login control
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // State for Notification
  const [notification, setNotification] = useState({ message : null, type : 'success' , duration : 3 })


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
  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    await blogService.create({
      author, title, url
    })
    .then( blog => {
      setBlogs(blogs.concat(blog))
      setAuthor('')
      setTitle('')
      setUrl('')
      handleNotification(`The blog ${blog.title} has been created.`, 'success')
    })
    .catch( exception => {
      console.log(exception)
      handleNotification(exception.response.data.error, 'error')
    })
    return
  }

  // Notification handler
  const handleNotification = (message, type) => {
    const notification = { message : message, type : type }
        setNotification(notification)
        setTimeout(() => setNotification({ message : null, type : null }), 3000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
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
      <div>
        <h2>Create a new blog</h2>

        <form onSubmit={handleBlogSubmit}>
          <div>
            Author
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            Title
            <input
              type="title"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            Url
            <input
              type="url"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>              
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}


export default App