import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {  
  token = `bearer ${newToken}`
}

// Get a list with all blogs
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// Create a new blog
const create = async newObject => {
  const config = {    
    headers: { Authorization: token },  
  }
  const response = await axios.post(baseUrl, newObject, config)  
  return response.data
}

// Increment the likes of one blog
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

export default { getAll, create, setToken, incLikes, remove  }