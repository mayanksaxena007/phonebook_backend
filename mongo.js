const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://mayank:${password}@cluster0.yitccfq.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(process.argv.length===3){
  // find all persons in phonebook
  Phonebook.find({}).then(result=>{
    console.log('phonebook:')
    result.forEach(person=>{
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  return
}

//create a new person
const person = new Phonebook({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(result => {
  console.log(`added ${person.name} number ${person.number} to phonebook`)
  mongoose.connection.close()
})