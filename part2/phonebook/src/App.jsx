import axios from 'axios'
import { useEffect, useState } from 'react'

const Number = ({person}) => {
    return (
      <p> {person.name} {person.number} </p>
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

const Persons = ({personToShow}) => {
  return (
    <>
      {personToShow.map(name => <Number key={name.name} person={name}/>)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFilter, setShowFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  })

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    if (persons.findIndex(person => person.name === newName) != -1) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
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

  const personToShow = showFilter === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(showFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons personToShow={personToShow} />
    </div>
  )
}

export default App