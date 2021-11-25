import React from 'react'
import Notification from './components/Notification.js'
import Filter from './components/Filter.js'
import AnecdoteList from './components/Anecdote.js'
import NewAnecdote from './components/NewAnecdote.js'
import './index.css'

const App = () => {

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