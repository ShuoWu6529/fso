import { useState } from 'react'

const Number = ({name}) => {
    return (
      <p> {name.name} </p>
    )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName }
    if (persons.findIndex(person => person.name === newName) != -1) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
        <div>debug: {newName}</div>
      </form>
      <h2>Numbers</h2>
      {persons.map(name => <Number key={name.name} name={name}/>)}
    </div>
  )
}

export default App