const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())

/*
morgan.token('host', function(req, res) {
    console.log(res)
    return req.hostname;
});
app.use(morgan(':method :host :status :res[content-length] - :response-time ms'))
*/

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    } 
]

const now = new Date(); 
const amount = persons.length
app.get('/info', (request, response) => {
    response.send('<p> Phonebook has info for ' + amount + ' people </p>' + '<p>' + now + '</p>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

/*
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
}
*/

const randomID = () => { 
    const id = Math.floor(Math.random() * 10000)
    return id
}; 

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'Name missing' 
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'Number missing' 
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: `${body.name} is already added to phonebook.`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: randomID(),
    }

    persons = persons.concat(person)

    response.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
