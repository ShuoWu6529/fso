const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const { errorHandler } = require('./utils/middleware')
const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json())
app.use('/api/blogs/', blogsRouter)
app.use(errorHandler)

module.exports = app