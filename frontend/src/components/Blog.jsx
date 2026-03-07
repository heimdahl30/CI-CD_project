import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, increaseLike, deleteBlog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const delButton = {
    background: 'blue'
  }


  const [visible, setVisible] = useState(false)
  const view = { display: visible ? '' : 'none' }
  const toggle = visible ? 'hide' : 'view'


  const visibility = () => visible ? setVisible(false) : setVisible(true)

  console.log(blog.users.length)


  if (blog.users.length !== 0 && user.name === blog.users[0].name){


    return (

      <div style = {blogStyle} className = "blog">
        {blog.title} {'\n'} {blog.author} {'\n'}
        <button onClick = {visibility}>{toggle}</button>
        <div style = {view} className = 'toggle'>
          {blog.url}
        </div>
        <div style = {view} className = 'toggle' data-testid = 'likes'>
    likes {blog.likes} {'\n'}
          <button onClick = {() => increaseLike(blog)}>like</button>
        </div>
        <div style = {view} className = 'toggle'>
          {blog.users[0].name}
          </div>
          <div style = {view} className = 'toggle'>
            <button onClick = {() => deleteBlog(blog)} style = {delButton}>remove blog</button>
          </div>
        </div>
    )
  }
  else  if (blog.users.length !== 0){

    return (

      <div style = {blogStyle} className = "blog">
        {blog.title} {'\n'} {blog.author} {'\n'}
        <button onClick = {visibility}>{toggle}</button>
        <div style = {view} className = 'toggle'>
          {blog.url}
        </div>
        <div style = {view} className = 'toggle' data-testid = 'likes'>
    likes {blog.likes} {'\n'}
          <button onClick = {() => increaseLike(blog)}>like</button>
        </div>
        <div style = {view} className = 'toggle'>
          {blog.users[0].name}
        </div>
      </div>
    )

  }

  else {
    return (

      <div style = {blogStyle} className = 'blog'>
        {blog.title} {'\n'} {blog.author} {'\n'}
        <button onClick = {visibility}>{toggle}</button>
        <div style = {view} className = 'toggle'>
          {blog.url}
        </div>
        <div style = {view} className = 'toggle' data-testid = 'likes'>
    likes {blog.likes} {'\n'}
          <button onClick = {() => increaseLike(blog)}>like</button>
        </div>
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}
export default Blog