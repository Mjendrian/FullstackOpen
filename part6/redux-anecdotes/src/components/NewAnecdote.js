import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notifyError, notifySuccess } from '../reducers/notificationReducer'

const NewAnecdote = (props) => {

  const addAnecdote = (event) => {
    try {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      props.createAnecdote(content)
      props.notifySuccess(`You created the Anecdote : ${ content }`, 5)
    } catch (exception) {
      const content = event.target.anecdote.value
      props.notifyError(`An error occured while creating : ${ content }`, 5)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const ConnectedNewAnecdote = connect(null, { createAnecdote, notifySuccess, notifyError })(NewAnecdote)

export default ConnectedNewAnecdote