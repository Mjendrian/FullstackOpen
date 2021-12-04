import React, { useState, useRef } from 'react'
import { Togglable } from './Utils'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
// import { notifyError, notifySuccess } from './reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { notifySuccess } from '../reducers/notificationReducer'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button
} from '@material-ui/core'


const Blogs = () => {
  const blogFormRef = useRef()
  const user = useSelector(state => state.login.user)

  return (
    <div>
      <Togglable buttonLabel="Add a blog" cancelButtonLabel="Cancel" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <BlogList user={user} />
    </div>
  )
}

const BlogList = (user) => {
  const blogs = useSelector(state => state.blogs.sort((blogA, blogB) => (blogB.likes - blogA.likes)))
  console.log(blogs)
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Blog = ({ blog }) => {

  return (
    <TableRow>
      <TableCell>
        <Link to={'blogs/' + blog.id}>{blog.title} {' '} {blog.author}</Link>
      </TableCell>
    </TableRow>

  )}

const BlogForm = () => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    const blogToCreate = {
      author: author,
      title: title,
      url: url
    }
    dispatch(createBlog(blogToCreate))
    setAuthor('')
    setTitle('')
    setUrl('')
    dispatch(notifySuccess(`The Blog ${title} was created`, 5))
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <TextField
          type="text"
          value={author}
          name="Author"
          label="Author"
          id="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <TextField
          type="title"
          value={title}
          name="Title"
          label="Title"
          id="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <TextField
          type="url"
          value={url}
          name="Url"
          label="Url"
          id="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <Button variant="contained" color="primary" id="login" type="submit">Create</Button>
    </form>
  )
}

export { Blogs }