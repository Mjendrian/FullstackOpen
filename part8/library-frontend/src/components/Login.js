import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client' 
import { LOGIN } from '../queries'

const Login = ({show, setPage, token, setToken}) => {

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <LoginForm
        setToken={setToken}
        setPage={setPage}
        token={token}
        />
    </div>
  )
}

const LoginForm = ({ setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN)

  useEffect(() => {    
    if ( result.data ) {      
      const token = result.data.login.value      
      setToken(token)      
      localStorage.setItem('phonenumbers-user-token', token)    
      setPage("authors")
    }  
  }, [result.data]) // eslint-disable-line
  
  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login