import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   

  const [selected, setSelected] = useState(0)
  const [points, updatePoints] = useState(new Array(anecdotes.length).fill(0))
  
  // Highest vote count
  const maxVotes = Math.max.apply(null, points)
  // First Anecdote with highest vote count
  const maxVotedAnecdote = points.indexOf(maxVotes)

  // Function to retrive new Anecdote
  const getNextAnecdote = () => {

    let newSelected = selected

    // We assure that the new anecdote is different from the previous
    do {
      newSelected = Math.floor(Math.random() * anecdotes.length)    
    }
    while (
      newSelected === selected
    )

    setSelected(newSelected)
  }

  // Function to vote for an anecdote
  const voteForAnecdote = () => {
    const pointsVote = [...points]
    pointsVote[selected] += 1
    updatePoints(pointsVote)
  }

  // Button Composant to get next anecdote
  const Button = (props) => {
    const { action, title } = props

    if(action === "next") {
      return (
        <button onClick={() => getNextAnecdote() }>{ title }</button>
      )
    } else if(action === "vote") {
      return (
        <button onClick={() => voteForAnecdote() }>{ title }</button>
      )
    }
  }

  // Composant to show most the Anecdote of the day
  const AnecdoteOfTheDay = () => {
    return (
      <div>
        <h1>Anecdote of the day</h1>
        <p>{ anecdotes[selected] }</p>
        <p>has { points[selected] } votes</p>
      </div>
    )    
  }

  // Composant to show the most voted Anecdote
  // We only show the first anecdote found, when we have a tie
  const MostVotedAnecdotes = () => {
    if (maxVotes === 0) {
      return (
        <div>
          <p>No vote yet</p>
        </div>
      )
    }else {
      return (
        <div>
          <h1>Anecdote with most votes</h1>
          <p>With { points[maxVotedAnecdote] } votes</p>
          <p>{ anecdotes[maxVotedAnecdote] }</p>
        </div>
      )
    }
  }

  console.log("Current Vote : ", points)

  return (
    <div>
      <AnecdoteOfTheDay/>
      <br/>
      <Button action="vote" title="Vote" />
      <Button action="next" title="Next anecdote" />
      <MostVotedAnecdotes/>

    </div>
  )
}

export default App