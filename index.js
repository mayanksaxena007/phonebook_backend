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

app.post('/api/persons', async (req, res) => {
    const data = req.body;

    // Check if name or number is missing
    if (!data.name || !data.number) {
        return res.status(400).json({
            error: "name or number is missing"
        });
    }

    try {
        // Check if person with the same name already exists
        const existingPerson = await Phonebook.findOne({ name: data.name });

        if (existingPerson) {
            return res.status(400).json({
                error: `${data.name} is already in the phonebook`
            });
        }

        // If person doesn't exist, create and save new person
        const person = new Phonebook(data);
        const savedPerson = await person.save();
        
        res.json(savedPerson);
    } catch (error) {
        // Handle any errors that occur during database operations
        console.error("Error:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
})

app.get('/api/persons/:id', (req,res)=>{
    Phonebook.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error=>{
        console.log(error)
        res.status(400).send({error: "malformatted id"})
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
  // handler of requests with unknown endpoint
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`backend is running on port = ${PORT}`)
})