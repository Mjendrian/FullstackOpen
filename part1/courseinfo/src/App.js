import React from 'react'

// Component to show title
const Header = (props) => {
  return (
    <h1>{props.content}</h1>
  )
}

// Component to render course part
const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

// Component to list courses
const Content = (props) => {
  return (
    <div>
      { props.parts.map( p => (
        <Part name={p.name} exercises={p.exercises} />) )
      }
    </div>
  )
}

// Component to render the total of exercises
const Total = (props) => {
  return (
    <p>
      Number of exercises { props.parts.reduce((sum, current) => (sum + current.exercises), 0) }
    </p>
  )
}

const App = () => {
   const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header content={ course.name } />
      <Content parts={ course.parts } />
     
      <Total parts={ course.parts } />
    </div>
  )
}

export default App
