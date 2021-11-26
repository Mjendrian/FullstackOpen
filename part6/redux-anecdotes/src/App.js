import React, {useEffect} from 'react'
import Notification from './components/Notification.js'
import Filter from './components/Filter.js'
import AnecdoteList from './components/Anecdote.js'
import NewAnecdote from './components/NewAnecdote.js'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import './index.css'

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  return ( 
    [
      <h2 key="title">Anecdotes</h2>,
      <Notification key="notification"/>,
      <Filter key="filter" />,
      <AnecdoteList key="anecdotes" />,
      <NewAnecdote key="newanecdote" />
    ]
  )
}

export default App