import React,  { useState, useEffect } from 'react'
import { useLazyQuery, useSubscription, useApolloClient } from '@apollo/client' 
import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from './queries'

import Login from './components/Login'
import Authors from './components/Authors'
import Books from './components/Books'
import RecommendedBooks from './components/RecommendedBooks'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')
  const [getAuthors, resultAuthors] = useLazyQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState([])
  const [getBooks, resultBooks] = useLazyQuery(ALL_BOOKS)
  const [getUser, resultUser] = useLazyQuery(ME)
  const [books, setBooks] = useState([])
  const [user, setUser] = useState([])
  const [token, setToken] = useState(null)
  const [genreFilter, setGenreFilter] = useState('')
  const client = useApolloClient()

  useEffect(() => {  
    console.log(genreFilter)
    getAuthors()
    getBooks({variables : { genre : genreFilter } })
    getUser()
  }, [page, genreFilter])

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

  useEffect(() => {    
    if(resultUser.data) {
      setUser(resultUser.data.me)
    }
  }, [resultUser])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      getBooks({variables : { genre : genreFilter } })
    }
  })

  const logout = () => {
    setToken(null)    
    localStorage.clear()    
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')} >authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token === null ? '' : <button onClick={() => setPage('recommended')}>recommended</button>}
        {token === null ? '' : <button onClick={() => setPage('add')}>add book</button>}
        {token === null ? <button onClick={() => setPage('login')}>login</button> : <button onClick={() => logout()}>logout</button>}
      </div>

      <Login
        show={page === 'login'}
        setPage={setPage}
        setToken={setToken}
        token={token}
      />

      <Authors
        show={page === 'authors'}
        authors={authors}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={books}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
      />

      <RecommendedBooks
        show={page === 'recommended'}
        books={books}
        user={user}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App