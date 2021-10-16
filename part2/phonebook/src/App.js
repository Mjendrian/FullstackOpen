import React, { useState } from 'react'

// Composant to Show the input Form to add new Contacts
const Form = (params) => {
  const inputFields = params.inputFields
  const submitAction = params.submitAction

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={ submitAction }>
        
        { inputFields.map(inputField => 
          <div key={ inputField.id }>
            { inputField.title } : <input value={ inputField.value } onChange={ inputField.onChange }/>
          </div>
        ) }
        
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  </div>
  )
}

// Composant to show the Filter
const Filter = (props) => {
  const handleNameFilterChange = props.onChange
  const newNameFilter = props.value 
  return (
    <div>
      <h2>Filter the Contacts by Name</h2>
      <input value={ newNameFilter } onChange={ handleNameFilterChange } />
    </div>
  )
}

// Composant to Show the Number list
const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        { persons.map(person => 
          <li key={ person.id }>{ person.name } : { person.number }</li>
        ) }
      </ul>
    </div>     
  )
}

// Main App Composant
const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number : "0123456789", id : 0 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 1 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 2 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 3 }
  ]) 

  // State for Name Input Field
  const [ newName, setNewName ] = useState('')
  // State for Number Input Field
  const [ newNumber, setNewNumber ] = useState('')
  // State for Name filter Input Field
  const [ newNameFilter, setNewNameFilter ] = useState('')

  // Handler for Name Input Field
  const handleNameChange = (event) => {
    setNewName(event.target.value)     
  }

  // Handler for Number Input Field
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)     
  }

  // Handler for Name Filter Field
  const handleNameFilterChange = (event) => {
    setNewNameFilter(event.target.value)     
  }

  // Array containing the input field definitions
  const inputFields = [
    { id : 0,
      title : "Name",
      onChange : handleNameChange,
      value : newName
    },
    { id : 1,
      title : "Number",
      onChange : handleNumberChange,
      value : newNumber
    }
  ]

  // Function to add a new Contact
  const addPerson = (event) => {    
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      alert(`The name ${newName} is already added to phonebook`)
      return 
    }
    if (persons.find(person => person.number === newNumber)) {
      alert(`The number ${newNumber} does already exist in the phonebook`)
      return 
    }

    if( newName === "" || newNumber === "") return
    const personObject = {
      name: newName,
      number : newNumber,
      id: persons.length + 1,
    }
  
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }  

  // Name Filter application
  const personsToShow = newNameFilter === ""
    ? persons
    : persons.filter( person => person.name.toUpperCase().indexOf(newNameFilter.toUpperCase()) !== -1 )

  return (
    <div>
      <Form inputFields={ inputFields } submitAction={ addPerson }/>
      <Filter value={ newNameFilter } onChange={ handleNameFilterChange } />
      <Persons persons={ personsToShow } />
      
    </div>
  )
}

export default App