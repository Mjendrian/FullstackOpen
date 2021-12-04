import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {

  switch(action.type) {
  case 'NEW_BLOG' :
    return [...state, action.data]
  case 'DELETE_BLOG' :
    return state.filter(blog => blog.id !== action.id)
  case 'INIT_BLOGS':
    return action.data
  case 'LIKE' :
    return state.map(blog =>
      blog.id !== action.data.id ? blog : action.data
    )
  case 'UPDATE_COMMENT' :
    return state.map(blog =>
      blog.id !== action.data.id ? blog : action.data
    )
  default :
    return state
  }
}

export const createBlog = ( { author, title, url } ) => {
  return async dispatch => {
    const newBlog = await blogService.create({ author, title, url })
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const deleteBlog = ( { id } ) => {
  return async dispatch => {
    await blogService.remove({ id })
    dispatch({
      type: 'DELETE_BLOG',
      id: id
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const like = (id) => {
  return async dispatch => {
    const blog = await blogService.incLikes(id)
    dispatch({
      type: 'LIKE',
      data: blog
    })
  }
}

export const createComment = (blogId, comment) => {
  return async dispatch => {
    const blog = await blogService.addComment(blogId, comment)
    dispatch({
      type: 'UPDATE_COMMENT',
      data: blog
    })
  }
}

export default blogReducer