import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const tableLines = (userBlogs) => {

  if(userBlogs === []) {
    return '<tr><td></td><td></td></tr>'
  }
  let returnElements = []
  for(let userName in userBlogs)  {
    const userBlog = userBlogs[userName]
    returnElements = returnElements.concat(<tr key={userBlog.userId}><td><Link to={userBlog.userId}>{userName}</Link></td><td>{userBlog.blogs}</td></tr>)
  }
  return returnElements
}


const UsersBlogs = () => {
  const blogList = useSelector(state => state.blogs)


  // returns a new object with the values at each key mapped using mapFn(value)
  function objectMap(object) {
    return Object.keys(object).reduce(function(result, key) {
      const userName = object[key].user.name
      result[userName] = { blogs : (result[userName] ? result[userName].blogs + 1 : 1) , userId : object[key].user.id }
      return result
    }, [])
  }

  var newObject = blogList.length > 0 ? objectMap(blogList) : []

  console.log(newObject)

  // const userBlogs = blogList.map((blog) => [blog.user.name, blog.user.id])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {tableLines(newObject)}
        </tbody>
      </table>
    </div>
  )
}

/*
const UserBlog = ({ blogUser, id } ) => {
  console.log(blogUser, id)
  return (
    <tr>
      <td>
        <Link>blogUser</Link>
      </td>
      <td>
        Blel
      </td>
    </tr>
  )
}
*/

export { UsersBlogs }