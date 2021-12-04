import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserDetails = () => {
  const id = useParams().id
  console.log(id)
  const blogList = useSelector(state => state.blogs.filter(blog => blog.user.id === id))
  console.log(blogList)

  if(blogList.length === 0 ) {
    return (
      <p>No blog added</p>
    )
  }

  return (
    <div>
      <h2>{blogList[0].user.name}</h2>
      <p>Added blogs : </p>
      <ul>
        {blogList.map(blog =>
          <UserBlog key={blog.id} blog={blog} />
        )}
      </ul>
    </div>
  )

}

const UserBlog = ({ blog }) => {
  return (
    <li key={blog.id}>{blog.title}</li>
  )
}
export { UserDetails }