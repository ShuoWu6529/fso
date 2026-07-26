const blogsRouter = require('express').Router()
const {userExtractor} = require('../utils/middleware')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username : 1, name : 1})
  return response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
      title : request.body.title,
      author : request.body.author,
      url : request.body.url,
      likes : request.body.likes || 0,
      user: user._id
    }
  )

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)


  if (blog.user.toString() != user._id.toString()) {
    return response.status(401).json({error: 'invalid username'})
  }

  user.blogs = user.blogs.filter(blog => blog != request.params.id)
  await user.save()
  await blog.deleteOne()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)
  blog.likes = likes
  const updatedNote = await blog.save()
  response.json(updatedNote)
})
module.exports = blogsRouter