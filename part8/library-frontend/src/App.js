import React,  { useState, useEffect } from 'react'
import { useLazyQuery} from '@apollo/client' 
import { ALL_AUTHORS, ALL_BOOKS } from './queries'


import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')
  const [getAuthors, resultAuthors] = useLazyQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState([])
  const [getBooks, resultBooks] = useLazyQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])

  useEffect(() => {  
    getAuthors()
    getBooks()
  }, [page])

  useEffect(() => {    
    if(resultAuthors.data) {
      setAuthors(resultAuthors.data.allAuthors)
    }
  }, [resultAuthors])

  useEffect(() => {    
    if(resultBooks.data) {
      setBooks(resultBooks.data.allBooks)
    }
  }, [resultBooks])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')} >authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        authors={authors}
      />

      <Books
        show={page === 'books'}
        books={books}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App