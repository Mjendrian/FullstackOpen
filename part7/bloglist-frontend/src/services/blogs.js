import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

// Get a list with all blogs
const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch ( exception ) {
    return  []
  }
}

// Create a new blog
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// Create a new comment
const addComment = async ( blogId, comment ) => {
  const url = `${baseUrl}/${blogId}/comments`
  const response = await axios.post(url, { comment : comment })
  return response.data
}

// Increment the likes of one blog
// TODO : Need to fix bug on like which removes user from the blog
const incLikes = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${newObject.id}`
  const response = await axios.put(url, newObject, config)

  return response.data
}

// Delete one blog
const remove = async newObject => {
  console.log('Got a delete')
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${newObject.id}`
  console.log(url)
  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, create, setToken, incLikes, remove, addComment  }