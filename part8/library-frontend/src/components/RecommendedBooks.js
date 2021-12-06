import React, {useState} from 'react'

const RecommendedBooks = ({show, books, user}) => {

  if (!show || books.length === 0) {
    return null
  }

  console.log(user)

  const booksToShow = ( user.favoriteGenre === '') ?  books : books.filter(b => b.genres.includes(user.favoriteGenre))


  return (
    <div>
      <h2>books</h2>
      {(user.favoriteGenre !== '') ? <p>in your favotire genre <b>{user.favoriteGenre}</b></p> : ''}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendedBooks