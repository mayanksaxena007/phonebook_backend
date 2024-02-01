require('dotenv').config()
const express = require('express')
const uuid = require('uuid')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Phonebook = require('./models/persons')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use((req, res, next) => {
    const timestamp = new Date();
    req.timestamp = timestamp;
    next();
});
morgan.token('data', (req, res)=>{
    return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :data'))

app.get('/api/persons',(req,res)=>{
    Phonebook.find({}).then(persons=>{
        res.json(persons)
      })
})

app.post('/api/persons', (req, res)=>{
    const data = req.body
    if(!data.name || !data.number){
        return res.status(400).json({
            error: "name or number is missing"
        })
    }
    const person = new Phonebook({
        ...data
    })
    person.save().then(savedPerson =>{
        res.json(savedPerson)
    })
})

app.get('/api/persons/:id', (req,res)=>{
    Phonebook.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = req.params.id
    Phonebook.deleteOne({id: req.params.id}).then(()=>{
        res.status(200).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`backend is running on port = ${PORT}`)
})