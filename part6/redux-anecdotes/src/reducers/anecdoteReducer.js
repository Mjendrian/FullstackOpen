import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {

  switch(action.type) {
    case 'NEW_ANECDOTE' :
      return [...state, action.data]
    case 'INIT_ANECDOTES':      
      return action.data
    case 'VOTE' :
      const returnedAnecdotes = state.map(anecdote =>
        anecdote.id !== action.data.id ? anecdote : action.data 
      )
      return returnedAnecdotes
    default :
      return state
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export const vote = (id) => {
  return async dispatch => {
    const anecdote = await anecdoteService.vote(id)
    dispatch({
      type: 'VOTE',
      data: anecdote
    })
  }
}

export default reducer