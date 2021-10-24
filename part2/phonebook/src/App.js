import React, { useState, useEffect } from 'react'
import personService from './services/persons.js'
import './index.css'

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
const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        { persons.map(person =>
          <li key={ person.id }>{ person.name } : { person.number } <button onClick={ () => deletePerson(person.id) }>Remove</button></li>
        ) }
      </ul>
    </div>
  )
}

const Notification = ({ notification }) => {

  if (notification.message === null) {
    return null
  }

  return (
    <div className={ notification.type }>
      {notification.message}
    </div>
  )
}

// Main App Composant
const App = () => {
  const [ persons, setPersons ] = useState([])

  // State for Name Input Field
  const [ newName, setNewName ] = useState('')
  // State for Number Input Field
  const [ newNumber, setNewNumber ] = useState('')
  // State for Name filter Input Field
  const [ newNameFilter, setNewNameFilter ] = useState('')
  // State for Notification
  const [notification, setNotification] = useState({ message : null, type : 'success' , duration : 3 })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

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
      title : 'Name',
      onChange : handleNameChange,
      value : newName
    },
    { id : 1,
      title : 'Number',
      onChange : handleNumberChange,
      value : newNumber
    }
  ]

  // Function to update a Contact
  const updatePerson = (person, newNumber) => {
    const newPerson = { ...person, number: newNumber }

    personService
      .update(newPerson.id, newPerson)
      .then(returnedPerson => {
        setPersons(persons.map(mappedPerson => mappedPerson.id !== newPerson.id ? mappedPerson : returnedPerson))
        const notification = { message : `The contact information for ${returnedPerson.name} has been updated.`, type : 'success' }
        setNotification(notification)
        setTimeout(() => setNotification({ message : null, type : null }), 3000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error.response)
        if(error.response.status === 400) {
          console.log(error)
          const notification = { message : `The contact ${person.name} has already been deleted from the server.`, type : 'error' }
          setNotification(notification)
          setPersons(persons.filter(mappedPerson => mappedPerson.id !== person.id))
        } else if (error.response.status === 500) {
          const notification = { message : error.response.data.error, type : 'error' }
          setNotification(notification)
        }
        setTimeout(() => setNotification({ message : null, type : null }), 3000)
      })

  }

  // Function to add a new Contact
  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person && person.number === newNumber) {
      alert(`The contact ${newName} with the number ${newNumber} does already exist in the phonebook.`)
      return
    } else if (persons.find(person => person.name === newName) && newNumber !== '') {
      const result = window.confirm(`The contact ${newName} is already present with the number ${person.number}. Do you want to update the number ?`)
      if (result === true) {
        updatePerson(person, newNumber)
        return
      }else{
        return
      }
    }

    if( newName === '' || newNumber === '') return
    const personObject = {
      name: newName,
      number : newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        const notification = { message : `The contact ${returnedPerson.name} has been added to the phonebook.`, type : 'success' }
        setNotification(notification)
        setTimeout(() => setNotification({ message : null, type : null }), 3000)
      })
      .catch( err => {
        console.log(err.response)
        const notification = { message : err.response.data.error, type : 'error' }
        setNotification(notification)
      })

  }

  // Function to delete an existant contact
  const deletePerson = (id) => {
    const personToRemove = persons.find(person => person.id === id)
    const result = window.confirm(`Do you really want to delete the Contact ${personToRemove.name } ?`)
    if(result !== true)
      return
    personService
      .delPerson(id)
      .then(() => {
        const notification = { message : `The contact ${personToRemove.name} has been deleted from the phonebook.`, type : 'success' }
        setNotification(notification)
        setTimeout(() => setNotification({ message : null, type : null }), 3000)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  // Name Filter application
  const personsToShow = newNameFilter === ''
    ? persons
    : persons.filter( person => person.name.toUpperCase().indexOf(newNameFilter.toUpperCase()) !== -1 )

  return (
    <div>
      <Notification notification={notification}/>
      <Form inputFields={ inputFields } submitAction={ addPerson }/>
      <Filter value={ newNameFilter } onChange={ handleNameFilterChange } />
      <Persons persons={ personsToShow } deletePerson={ deletePerson } />

    </div>
  )
}

export default App