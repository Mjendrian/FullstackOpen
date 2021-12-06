import React, {useState} from 'react'

const Books = ({show, books, genreFilter, setGenreFilter}) => {

  if (!show || books.length === 0) {
    return null
  }

  const getGenres = (books) => {
    const genres = books.map(b => (b.genres).join()).join().split(',').filter((x, i, a) => a.indexOf(x) === i).sort((a,b) => a > b)
    console.log(genres)
    return genres
  }

  const booksToShow = ( genreFilter === '') ?  books : books.filter(b => b.genres.includes(genreFilter))


  return (
    <div>
      <h2>books</h2>
      {(genreFilter !== '') ? <p>in Genre <b>{genreFilter}</b></p> : ''}
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
      {getGenres(books).map( (genre) => {
        if(genre !== "") { 
          return <button onClick={() => setGenreFilter(genre)} name={genre} key={genre} >{genre}</button>
        }
      })}
      <button onClick={() => setGenreFilter('')}>all</button>
    </div>
  )
}

export default Books