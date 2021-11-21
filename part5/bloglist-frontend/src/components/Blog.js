import React, { useState } from 'react'
import { Togglable } from './Utils'

const Blog = ({ blog, incBlogLikes, user, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const incLikes = async (blog) => {
    try {
      await incBlogLikes({
        id: blog.id,
        likes : '+1'
      })

    } catch (exception) {
      console.log(exception)
    }

  }

  const delBlog = async (blog) => {

    const confirm = window.confirm(`Do you really wnt to delete the blog ${blog.setTitle}`)
    if(confirm === false) return true
    await deleteBlog({
      id: blog.id
    })

  }

  const buttonDelete = () => {

    if (blog.user && user && user.id === blog.user.id) {
      return <button onClick={() => delBlog(blog)} >Delete Blog</button>
    }
  }

  return (
    <div style={blogStyle} className='blogList'>
      {blog.title} {' '} {blog.author}
      <Togglable buttonLabel="Show details" cancelButtonLabel="Hide" key={blog.id}>
        <br/>{blog.url}
        <br/>Likes : {blog.likes}{' '} <button onClick={() => incLikes(blog)}>like</button>
        <br/>{blog.user ? blog.user.name: ''} {blog.user ? blog.user.name : ''}
        {buttonDelete()}
      </Togglable>
    </div>

  )}

const BlogForm = ({
  createBlog
}) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogCreated = await createBlog({
      author: author,
      title: title,
      url: url
    })

    if(blogCreated === true) {
      setAuthor('')
      setTitle('')
      setUrl('')
    }
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Author
        <input
          type="text"
          value={author}
          name="Author"
          id="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        Title
        <input
          type="title"
          value={title}
          name="Title"
          id="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Url
        <input
          type="url"
          value={url}
          name="Url"
          id="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export { Blog, BlogForm }