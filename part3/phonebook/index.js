require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
const data = (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    } else {
        return ""
    }
}
morgan.token("data", data)
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :data`))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `)
})

app.get("/api/persons/:id", (request, response) => {
    const id  = request.params.id
    Person.findById(id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            response.status(404).end()
        })
})

app.delete("/api/persons/:id", (request, response) => {
    const id  = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(person)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)