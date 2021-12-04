import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Blogs } from './components/Blog'
import { LoginForm, LogoutForm } from './components/LoginForm'
import { UsersBlogs } from './components/UsersBlogs'
import { UserDetails } from './components/UserDetails'
import { BlogDetails } from './components/BlogDetails'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'
import { getUserFromLocalStorage } from './reducers/loginReducer.js'
import Container from '@material-ui/core/Container'
import {
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@material-ui/core'
import './index.css'

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button variant="contained" color="primary" component={Link} to="/">
          blogs
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/users">
          users
        </Button>
        <LogoutForm />
      </Toolbar>
    </AppBar>
  )}

const App = () => {
  // States for Login control
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserFromLocalStorage())
    dispatch(initializeBlogs())
  }, [dispatch])

  const user = useSelector(store => store.login.user)


  if (!user) {
    return (
      <Container>
        <span>
          <h2>Log in to application</h2>
          <LoginForm />
        </span>
      </Container>
    )
  }

  return (
    <Container>
      <div>
        <Router>
          <Navigation/>
          <h2>Blogs</h2>
          <Notification />

          <Routes>
            <Route path="/users" element={<UsersBlogs />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/" element={<Blogs />} />
          </Routes>
        </Router>
      </div>
    </Container>
  )
}



export default App