import React, { useState } from 'react'
import { loginAction, logoutAction } from '../reducers/loginReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  TextField,
  Button
} from '@material-ui/core'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLoginChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  // Login handler
  const handleLogin = (event) => {
    event.preventDefault()
    try {
      dispatch(loginAction(username, password))
    } catch (exception) {
      console.log(exception)
    }
    return true
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          id="username"
          type="text"
          value={username}
          label="Username"
          name="Username"
          onChange={handleLoginChange}
        />
      </div>
      <div>
        <TextField
          id="password"
          type="password"
          value={password}
          label="Password"
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <Button variant="contained" color="primary" id="login" type="submit">login</Button>
    </form>
  )
}

const LogoutForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.login.user)

  const formStyle = {
    width : '40%',
    display : 'inline'
  }

  // Logout handler
  const handleLogout = (event) => {
    event.preventDefault()
    try {
      dispatch(logoutAction())
    } catch (exception) {
      alert('Logout impossible')
    }
    return true
  }

  return (

    <form onSubmit={handleLogout} style={formStyle}>
      <Button variant="contained" color="primary" id="login" type="submit">logout</Button>
      {' '} ({user.name} logged-in)
    </form>

  )
}

export { LoginForm, LogoutForm }