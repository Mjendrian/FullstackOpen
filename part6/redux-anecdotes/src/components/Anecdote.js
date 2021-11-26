import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { notifyError, notifySuccess, notifyHide } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, vote }) => {
  return(
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const compareVotes = (a, b) => {
    if ( a.votes < b.votes ){
      return 1
    }
    return 0
  }

  const voteForAnecdote = (anecdote) => {
    try {
      dispatch(vote(anecdote.id))
      dispatch(notifySuccess(`You voted for : ${ anecdote.content }`, 10))
    } catch(exception) {
      dispatch(notifyError(`An error occured while registrating your vote for : ${ anecdote.content }`, 10))
    }
  }

  const anecdotes = useSelector(state => state.anecdotes.filter(a => a.content.match(state.filter)).sort(compareVotes))
  
  return(
    <div>
        {anecdotes.map(anecdote =>
          <Anecdote 
            key={anecdote.id}
            anecdote={anecdote}
            vote= { () => 
              voteForAnecdote(anecdote)
            }
          />
        )}
    </div>
  )
}

export default AnecdoteList