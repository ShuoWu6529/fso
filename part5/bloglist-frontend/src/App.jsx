import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({ message: null, success: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch {
      setMessage({ message: 'Wrong username or password', success: false })
      setTimeout(() => {
        setMessage({ message: null, success: null })
      }, 5000)
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const createBlog = async blogObject => {
    try {
      const response = await blogService.create(blogObject)
      const newBlogs = blogs.concat(response)
      setMessage({ message: `a new blog ${response.title} by ${response.author}`, success: true })
      setTimeout(() => {
        setMessage({ message: null, success: null })
      }, 5000)
      setBlogs(newBlogs)
      blogFormRef.current.toggleVisibility()
    } catch {
      setMessage({ message: 'Malformed data field', success: false })
      setTimeout(() => {
        setMessage({ message: null, success: null })
      }, 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    const response = await blogService.update(id, blogObject)
    const newBlogs = blogs.map(blog => blog.id === id ? response : blog)
    setBlogs(newBlogs)
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)
    const newBlogs = blogs.filter(blog => blog.id !== id)
    setBlogs(newBlogs)
  }

  if (user === null) {
    return(
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.message} success={message.success} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} removeBlog={removeBlog}/>
      )}
    </div>
  )
}

export default App