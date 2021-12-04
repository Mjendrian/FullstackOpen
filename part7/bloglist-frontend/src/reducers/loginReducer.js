import loginService from '../services/login'
import blogService from '../services/blogs'

const initialLogin = {
  username : '',
  name : '',
  token : '',
  id : ''
}

const loginReducer = (state = initialLogin, action) => {
  switch (action.type) {
  case 'LOGIN':
    console.log(action)
    return action
  case 'LOGOUT':
    return initialLogin
  case 'SET_USER':
    return action
  case 'GET_USER':
    return state
  default:
    return state
  }
}

export const loginAction = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({ username : username, password : password })
    window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      user
    })
  }
}

export const logoutAction = () => {
  return async dispatch => {
    window.localStorage.removeItem(
      'loggedBloglistUser'
    )
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export const getUser = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER'
    })
  }
}

export const getUserFromLocalStorage = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'SET_USER',
        user
      })
    }
  }
}

export default loginReducer