const assert = require("node:assert")
const { test, after, beforeEach } = require("node:test")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const { initial } = require("lodash")

const api = supertest(app)

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test("blogs return as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test("id field exists", async () => {
    const response = await api.get("/api/blogs")
    const id = response.body[0].id
    assert.notStrictEqual(id, undefined)
})

test("adding a blog works", async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, blogs.length + 1)
})


test("missing likes property defaults to 0", async () => {
    const newBlog = {
        title: "pokemon",
        author: "china",
        url: "https://www.youtube.com/watch?v=JQbjS0_ZfJ0&list=RDZAz3rnLGthg&index=5",
    }  

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get("/api/blogs")
    const addedBlog = response.body.find(blog => blog.title === "pokemon")
    assert.strictEqual(addedBlog.likes, 0)
})

test("missing field aren't added", async () => {
    const newBlog = {
        url:"youtube.com"
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)

    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, blogs.length)
})

test("deleting a note", async () => {
    const blogToDelete = blogs[0]
    await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204)
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog.id)
    assert(!ids.includes(blogToDelete._id))
    assert.strictEqual(response.body.length, blogs.length - 1)
})

test("updating like counts", async () => {
    const blogToUpdate = blogs[0]
    const updatedBlog = {...blogToUpdate, likes : 67}
    await api
        .put(`/api/blogs/${updatedBlog._id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const { __v, _id, ...rest } = updatedBlog
    const cleanBlog = {
        ...rest,
        id: updatedBlog._id
    }
    assert.deepStrictEqual(response.body.find(r => r.id === updatedBlog._id), cleanBlog)
})
after(async () => {
    await mongoose.connection.close()
})