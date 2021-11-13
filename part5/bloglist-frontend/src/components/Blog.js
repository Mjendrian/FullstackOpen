import React, {useState, useRef} from 'react'
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
    
    const blogLikeIncremented = await incBlogLikes({
      id: blog.id,
      likes : "+1"
    })

  }

  const delBlog = async (blog) => {

    await deleteBlog({
      id: blog.id
    })

  }

  const buttonDelete = () => {
    if (blog.user && user.id === blog.user.id) {
      return <button onClick={() => delBlog(blog)} >Delete Blog</button>
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {' '}
      <Togglable buttonLabel="Show details" cancelButtonLabel="Hide" key={blog.id}>   
        <br/>{blog.url} 
        <br/>{blog.likes}{' '} <button onClick={() => incLikes(blog)}>like</button> 
        <br/>{blog.author}
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
  )
}

export { Blog, BlogForm } 