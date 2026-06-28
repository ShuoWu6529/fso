import axios from 'axios'
import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './services/Notification'

const Number = ({person, onClick}) => {
  return (
      <p> {person.name} {person.number} <button id={person.id} onClick={onClick}>delete</button> </p>
  )
}

const Filter = ({showFilter, onChange}) => {
  return (
    <div>
      filter shown with <input value={showFilter} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({onSubmit, name, nameOnChange, number, numberOnChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={nameOnChange} />
      </div>
      <div>
        number: <input value={number} onChange={numberOnChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({personToShow, onClick}) => {
  return (
    <>
      {personToShow.map(name => <Number key={name.id} person={name} onClick={onClick} />)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFilter, setShowFilter] = useState('')
  const [message, setMessage] = useState({message: null, success: null})

  useEffect(() => {
    personService
      .getAll()
      .then(initialData => {
        setPersons(initialData)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const index = persons.findIndex(person => person.name === newName)
    if (index != -1) {
      if (!window.confirm(`${newName} is already added to the phonebook, replace old number with new one?`)) {
        return
      }
      const changedObject =  {...persons[index], number: newNumber}
      personService
        .update(changedObject.id, changedObject)
        .then(data => {
          setPersons(persons.map(person => person.id === changedObject.id ? changedObject : person))
          setMessage({message: `Updated ${newName}'s phone number`, success: true})
          setTimeout(() => {
            setMessage({message: null, success: null})
          }, 5000)
        })
    }
    else {
      const personObject = { name: newName, number: newNumber }
      personService
        .create(personObject)
        .then(initialData => {
          setPersons(persons.concat(initialData))
          setMessage({message: `Added ${newName}`, success: true})
          setTimeout(() => {
            setMessage({message: null, success: null})
          }, 5000)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setShowFilter(event.target.value)
  }

  const handleDelete = (event) => {
    if (!window.confirm("Delete?")) {
      return
    }
    const id = event.target.id
    personService
      .remove(id)
      .then(data => {
        setPersons(persons.filter(person => person.id != id))
        setMessage({message:'Successfully removed', success:true})
        setTimeout(() => {
          setMessage({message: null, success: null})
        }, 5000)
      })
      .catch(data => {
        setPersons(persons.filter(person => person.id != id))
        setMessage({message:`Already removed`, success:false})
        setTimeout(() => {
          setMessage({message: null, success: null})
        }, 5000)
      })
  }

  const personToShow = showFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(showFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.message} success={message.success}/>
      <Filter onChange={handleFilterChange} showFilter={showFilter} />
      <h2>add a new</h2>
      <PersonForm 
        onSubmit={addPerson} 
        name={newName}
        nameOnChange={handlePersonChange} 
        number={newNumber}
        numberOnChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <Persons personToShow={personToShow} onClick={handleDelete} />
    </div>
  )
}

export default App