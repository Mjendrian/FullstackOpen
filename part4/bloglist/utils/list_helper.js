const { forEach } = require('lodash')
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
    const authorBlogs = lodash.groupBy( blogs, 'author' )
    const blogCollections = lodash.values(authorBlogs)
    console.log(blogCollections)
    // To Do
    // const likesByAuthor = blogCollections.map(blog => { return { author: blog.author, likes: blog.likes }})
    // const likesByAuthor = blogCollections
    return ( { author: '', likes: 12 } )
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}