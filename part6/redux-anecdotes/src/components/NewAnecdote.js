import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notifyError, notifySuccess, notifyHide } from '../reducers/notificationReducer'

const NewAnecdote = (props) => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    try {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      dispatch(createAnecdote(content))
      dispatch(notifySuccess(`You created the Anecdote : ${ content }`))
      setTimeout(() => dispatch(notifyHide()), 5000)
    } catch (exception) {
      const content = event.target.anecdote.value
      dispatch(notifyError(`An error occured while creating : ${ content }`))
      setTimeout(() => dispatch(notifyHide()), 5000)
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

export default NewAnecdote