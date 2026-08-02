import { useState } from "react"

const Blog = ({ blog, updateBlog, user, removeBlog}) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLike = () => {
    updateBlog(blog.id, {
      user: blog.user.id,
      author: blog.author,
      title: blog.title,
      likes: blog.likes + 1,
      url: blog.url
    })
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }
  
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div style={{display : visible ? '' : 'none'}}>
        {blog.url}
        <br />
        likes {blog.likes}
        <button onClick={increaseLike}>like</button>
        <br />
        {blog.user.name}
        <br />
        <button onClick={deleteBlog} style={{display: blog.user.username === user.username ? '' : 'none'}}>remove</button>
      </div>
    </div>  
)}

export default Blog