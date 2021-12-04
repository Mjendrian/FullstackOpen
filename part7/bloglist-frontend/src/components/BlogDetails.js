import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { like, deleteBlog, createComment } from '../reducers/blogReducer'
import { notifySuccess } from '../reducers/notificationReducer'
import {
  Button,
  TextField
} from '@material-ui/core'

const BlogDetails = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  const user = useSelector(state => state.login.user)
  const blog = useSelector(state => state.blogs.filter(blog => blog.id === id))[0]

  if(blog === undefined) {
    return (
      <p>No blog found</p>
    )
  }

  const incLikes = async (blog) => {

    try {
      dispatch(like({
        id: blog.id,
        likes : '+1'
      }))
      dispatch(notifySuccess('The like was added', 5))

    } catch (exception) {
      console.log(exception)
    }

  }

  const delBlog = async (blog) => {

    const confirm = window.confirm(`Do you really wnt to delete the blog ${blog.title}`)
    if(confirm === false) return true
    dispatch(deleteBlog(
      {
        id: blog.id
      })
    )
    dispatch(notifySuccess(`The blog ${blog.title} was deleted`, 5))

  }

  const buttonDelete = (blog, user) => {
    console.log(blog, user)
    if (blog.user && user && user.id === blog.user.id) {
      return <Button variant="contained" color="primary" onClick={() => delBlog(blog)}>Delete</Button>
    }
  }

  const commentSubmitHandler = (event) => {
    event.preventDefault()
    dispatch(createComment(blog.id, comment))
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  console.log(blog)

  return (
    <div>
      <h2>{blog.title}</h2>
      <br/><a href={blog.url} rel="noreferrer" target="_blank">{blog.url}</a>
      <br/>Likes : {blog.likes}{' '} <Button variant="contained" color="primary" onClick={() => incLikes(blog)}>Like</Button>
      <br/>{blog.user ? blog.user.name: ''}
      {buttonDelete(blog, user)}
      <h3>Comments : </h3>
      <form onSubmit={commentSubmitHandler}>
        <TextField type="text" label="Comment" name="comment" value={comment} onChange={handleCommentChange}/>
        <Button variant="contained" color="primary" type="submit">Post the comment</Button>
      </form>
      <ul>
        {blog.comments.map(comment =>
          <li key={comment.id}>{comment.comment}</li>
        )}
      </ul>
    </div>
  )

}

export { BlogDetails }