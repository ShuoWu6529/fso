import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryToShow = ({country}) => {
  const [showInformation, setShowInformation] = useState(false)
  const handleShow = (event) => {
    setShowInformation(!showInformation)
  }

  let info = <div></div>;
  if (showInformation) {
    info = <Country country={country} />
  } 

  return (
    <>
      <p>{country.name.common} <button onClick={handleShow}>{showInformation ? "Hide" : "Show"}</button> </p>
      {info}
    </>
  )
}

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
        {countryToShow.map(country => <CountryToShow key={country.name.official} country={country}/>)}
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

const Weather = ({country}) => {
  const [countryWeather, setCountryWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY
  useEffect(() => {
    axios
      .get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country}/?key=${api_key}`)
      .then(response => {
        setCountryWeather(response.data)
      })
  }, [])

  if (!countryWeather) {
    return (
      <p>Still loading...</p>
    )
  }

  return (
    <>
      <p>Temperature {countryWeather.days[0].temp} Fahrenheit</p>
      <p>Wind {countryWeather.days[0].windspeed} m/s</p>
    </>
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
      <h2>Weather in {country.name.common}</h2>
      <Weather country={country.name.common}/>
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
