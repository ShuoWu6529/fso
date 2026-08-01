import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import login from './services/login'
import Notification from "./components/Notification";
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState({ message: null, success: null });

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem("loggedInUser", JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch {
      setMessage({ message: `Wrong username or password`, success: false });
      setTimeout(() => {
        setMessage({ message: null, success: null });
      }, 5000);
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem("loggedInUser")
    setUser(null)
  }

  const createBlog = async event => {
    event.preventDefault()
    const blog = {
      title,
      author,
      url,
      likes : 0
    }
    try {
      const response = await blogService.create(blog)
      const newBlogs = blogs.concat(response)
      setMessage({ message: `a new blog ${title} by ${author}`, success: true });
      setTimeout(() => {
        setMessage({ message: null, success: null });
      }, 5000);
      setBlogs(newBlogs)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch {
      setMessage({ message: `Malformed data field`, success: false });
      setTimeout(() => {
        setMessage({ message: null, success: null });
      }, 5000);
    }
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
                onChange={({target}) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({target}) => setPassword(target.value)}
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
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <label>
          title:
          <input 
            type="text" 
            value={title}
            onChange={({target}) => setTitle(target.value)}
          />
        </label>
        <br />
        <label>
          author:
          <input 
            type="text" 
            value={author}
            onChange={({target}) => setAuthor(target.value)}
          />
        </label>
        <br />
        <label>
          url:
          <input 
            type="url" 
            value={url}
            onChange={({target}) => setUrl(target.value)}
          />
        </label>
        <br />
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App