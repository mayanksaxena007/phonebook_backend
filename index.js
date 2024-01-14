const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())
let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]
app.use((req, res, next) => {
    const timestamp = new Date();
    req.timestamp = timestamp;
    next();
});

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${req.timestamp}</p>`)
})

app.get('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(person=>person.id === id)
    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(person=>person.id!==id)
    res.status(200).end()
})

app.post('/api/persons', (req, res)=>{
    const data = req.body
    if(!data.name || !data.number){
        return res.status(400).json({
            error: "name or number is missing"
        })
    }
    if(persons.find(person=>person.name === data.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    const person = {
        id: uuid.v4(),
        ...data
    }
    persons.push(person)
    res.status(200).end()
})
const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`backend is running on port = ${PORT}`)
})