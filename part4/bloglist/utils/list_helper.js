const lodash = require('lodash')

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if(!blogs || blogs.length === 0) {
    return {}
  } else {
    return blogs.reduce( (highestBlog, newBlog) => {
      return ( highestBlog.likes >= newBlog.likes ? highestBlog : newBlog )
    })
  }
}

const mostBlogs = (blogs) => {
  if(!blogs || blogs.length === 0) {
    return {}
  } else {
    const authorBlogs = lodash.groupBy( blogs, 'author' )
    const blogCollections = lodash.values(authorBlogs)
    const biggestBlogCollection = blogCollections.reduce( (biggerCollection, newCollection) => {
      return ( biggerCollection.length >= newCollection.length ? biggerCollection : newCollection )
    } )
    return ( { author: biggestBlogCollection[0].author, blogs: biggestBlogCollection.length } )
  }
}

const mostLikes = (blogs) => {
  if(!blogs || blogs.length === 0) {
    return {}
  } else {
    // Create an object with ( "Author1":"likes", "Author2":"likes" )
    const reducer = (authors, blog) => {
      (authors[blog.author] ? authors[blog.author] = authors[blog.author] + blog.likes : authors[blog.author] = blog.likes)
      return authors
    }

    const authors = blogs.reduce(reducer, {})

    const authorWithMaxLikes = Object.keys(authors).reduce((authorA, authorB) => (authors[authorA] >= authors[authorB]) ? authorA : authorB)

    return ( { author: authorWithMaxLikes, likes: authors[authorWithMaxLikes] } )
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}