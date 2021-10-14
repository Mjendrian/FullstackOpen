import React, { useState } from 'react'

const App = () => {

  // Initialisation of the States
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Function to update states
  const setState = (state, value) => {
    if(state==="good") {
      setGood(value + 1)
    }else if(state==="neutral") {
      setNeutral(value + 1) 
    }else if(state==="bad") {
      setBad(value + 1) 
    }
  }

  // Header component : Show title
  const Header = (props) => <h1>{ props.title }</h1>

  // Button component : Button to leave an evaluation
  const Button = (props) => {
    return (
      <button onClick={() => setState(props.state, props.value) }>{ props.title }</button>
    )
  }

  // Statistics Composant : Display a result or statistic    
  const StatisticLine = (props) => {
    const {text, value} = props

    return (
      <tr>
        <td>{ text }</td> 
        <td>{ value }</td>
      </tr>
    )
  }

  const NoFeedback = (props) => {
    return (
      <table>
        <tbody>
          <tr>
            <th>
              <h1 align="left">
                {props.title}
              </h1>
            </th>
          </tr>
          <tr>
            <td>
            {props.text}
            </td>
          </tr>
        </tbody>            
      </table>
    )
  }


  // Results component : Show recap of votes
  const Results = (props) => {
    const { good, neutral, bad } = props.stats

    // Total amount of votes
    const nbVotes = good + neutral + bad

    if(nbVotes === 0) {
      return (
        <NoFeedback title="Results" text="No Feedback given" />
      )
    } else {
      return (
        <table>
          <tbody>
            <tr>
              <th colSpan="2"><h1>Results</h1></th>
            </tr>
            <StatisticLine text="Good" value={good} />
            <StatisticLine text="Neutral" value={neutral} />
            <StatisticLine text="Bad" value={bad} />
          </tbody>            
        </table>
      )
    }
  }

  // Statistics component : Show statistics of votes
  const Statistics = (props) => {
    const { good, neutral, bad } = props.stats
    // Total amount of votes
    const nbVotes = good + neutral + bad
    // Average of votes
    const avVotes = (good * 1 + neutral * 0 + bad * -1) / nbVotes
    // Percentage of positive votes
    const percPositiveVotes = (good / nbVotes) * 100

    if(nbVotes === 0) {
      return (
        <NoFeedback title="Statistics" text="No Feedback given" />
      )
    } else {
      return (
        <table>
          <tbody>
            <tr>
              <th colSpan="2"><h1>Statistics</h1></th>
            </tr>
          <StatisticLine text="Votes total" value={ nbVotes } />
          <StatisticLine text="Average votes" value={ nbVotes === 0 ? "-" : avVotes.toFixed(2) } />
          <StatisticLine text="Part of positive votes" value={ nbVotes === 0 ? "-" : percPositiveVotes.toFixed(2) + " %" } />
          </tbody>            
        </table>
      )
    }
  }  



  return (
    <div>
      <Header title="Give feedback" />
      <Button title="Good" state="good" value={ good } />
      <Button title="Neutral" state="neutral" value={ neutral } />
      <Button title="Bad" state="bad" value={ bad } />
      <Results stats={ { good, neutral, bad } }/>           
      <Statistics stats={ { good, neutral, bad } }/>
    </div>
  )
}

export default App