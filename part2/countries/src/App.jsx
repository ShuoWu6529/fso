import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowCountries = ({showCountry, countries}) => {
  const countryToShow = 
    showCountry === "" 
      ? countries 
      : countries.filter(country => country.name.common.toLowerCase().includes(showCountry.toLowerCase()))

  if (countryToShow.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }
  else if (countryToShow.length > 1) {
    return (
      <div>
        {countryToShow.map(country => <p key={country.name.official}>{country.name.common}</p>)}
      </div>
    )
  }
  else if (countryToShow.length > 0) {
    return (
      <div>
        <Country country={countryToShow[0]}/>
      </div>
    )
  }
  return (
    <div></div>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      {country.capital.map(capital => <p key={capital}>{capital}</p>)}
      <p>{country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png}  />
    </div>
  )
}

const App = () => {
  const [showCountry, setShowCountry] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
    })
  }, [])

  return (
    <div>
      find countries <input value={showCountry} onChange={(event) => setShowCountry(event.target.value)} />
      <ShowCountries showCountry={showCountry} countries={countries}/>
    </div>
  )
}

export default App
