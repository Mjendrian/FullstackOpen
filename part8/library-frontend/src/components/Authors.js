  
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { useMutation } from '@apollo/client' 
import { EDIT_AUTHOR, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const Authors = ({show, authors}) => {

  if (!show || authors.length === 0) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <AuthorAgeForm authors={authors} />

    </div>
  )
}

const AuthorAgeForm = ({ authors }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [bornAuthor, setBornAuthor] = useState('');
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]  }
  )

  const authorOptions = authors.map(a => { return { value: a.id, label: a.name, born: (a.born === null ? '' : a.born) } } ).sort((a, b)  => a.label > b.label )

  const handleFormSubmit = (event) => {
    event.preventDefault()
    
    if(selectedAuthor === null) {
      alert('Please choose an author first')
      return
    }

    if(!parseInt(bornAuthor)) {
      alert('Please enter a year')
      return
    }



    console.log('Change author born Year...')
    editAuthor({  variables: { name: selectedAuthor.label, setBornTo : parseInt(bornAuthor)} })
  }

  useEffect(() => {
    if(selectedAuthor !== null ) {
     setBornAuthor(selectedAuthor.born)
    }
  }, [selectedAuthor])

  return (
    <div>
      <h3>Update Age of author</h3>
      <div>
        <form onSubmit={handleFormSubmit}>
          <Select
            defaultValue={selectedAuthor}
            onChange={setSelectedAuthor}
            options={authorOptions}
          />
          <input type="text" name="bornAuthor" value={bornAuthor} onChange={({ target }) => setBornAuthor(target.value)} />
          <button type="submit">Update author</button>
       </form>

      </div>
    </div>
  )}

export default Authors
