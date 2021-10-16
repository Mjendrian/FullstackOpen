import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Composant to show the Filter
const Filter = (props) => {
  const handleCountryFilterChange = props.onChange
  const newCountryFilter = props.value 
  return (
    <div>
      <h2>Filter the Countries by Name</h2>
      <input value={ newCountryFilter } onChange={ handleCountryFilterChange } />
    </div>
  )
}

// Composant for Weather information
const Weather = (props) => {
  const weatherInfo = props.weatherInfo
  const country = props.country

  if(!weatherInfo) {
    return (
      <div>
        <p>Weather-Information not available.</p>
      </div>
    )
  }
  return (
    <div>
      <h3>Current weather in { country.capital } :</h3>
      <ul>
        <li>Temperature : { weatherInfo ? weatherInfo.current.temperature : ""}</li>
        <li>Weather : {  weatherInfo ? weatherInfo.current.weather_descriptions[0] : "" }</li>
      </ul>
      {  weatherInfo && !weatherInfo.code ? <p><img src={weatherInfo.current.weather_icons[0] } alt="Weather Icon" /></p> : "" }
      </div>
  )
}

// Composant to show the Countries
const Countries = (props) => {
  const countries = props.countries

  // We show one Country
  if(countries.length === 1) {
    const country = countries[0]
    const weatherInfo = props.weatherInfo
    let currencies = []
    let languages = []

    for(const [, value] of Object.entries(country.currencies)) {
      currencies.push(value)
    } 

    for(const [, value] of Object.entries(country.languages)) {
      languages.push(value)
    }   
    console.log(weatherInfo);

    return (
      <div>
        <h2>{ country.name.common }</h2>
        <p>Capital : { country.capital }</p>
        <h3>Currencies :</h3>
        <ul>
        { currencies.map(currency => 
          <li key={ currency.name }> { currency.name }</li>
        )}
        </ul>
        <h3>Languages :</h3>
        <ul>
        { languages.map(language => 
          <li key={ language }> { language } </li>
        )}
        </ul>
        <p>
          <img src={ country.flags.svg } alt="Country flag" size="128" width="128" />
        </p>
        <Weather />

      </div>
    )

  // We show have too many countries to list
  } else if(countries.length > 10) {
    return (
      <div>
      <h2>Countries :</h2>
      <p>The search returns too many results. Please use a more specific filter.</p>
    </div>
    )
  }
  
  // We show a list of 10 or less countries
  const setNewCountryFilter = props.setNewCountryFilter

  return (
    <div>
      <h2>Countries :</h2>
      <ul>
        { countries.map(country => 
          <li key={country.cca3}>{country.name.common} <input type="button" value="Show details" onClick={() => setNewCountryFilter(country.name.common) } /></li>
        ) }
      </ul>
    </div>
  )
}

// Main App Composant
const App = () => {  
  const [ countries, setCountries ] = useState([])
  // State for Name filter Input Field
  const [ newCountryFilter, setNewCountryFilter ] = useState('')
  const [ weatherInfo, setNewWeatherInfo ] = useState([])

  // Loading countries list (ALL)
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  // Loading weather for capital, if we only show one country
  useEffect(() => {
    const countriesToShow = countries.filter( country => country.name.common.toUpperCase().indexOf(newCountryFilter.toUpperCase()) !== -1 )
    if(countriesToShow.length === 1) {
      const country = countriesToShow[0]
      try {
        axios
          .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_WEATHER_KEY}&query=${country.capital}`)
          .then(response => {
            setNewWeatherInfo(response.data)
          })
        } catch (err) {
          console.log( err )
        }
    }else{
      setNewWeatherInfo([])
    }
  }, [countries, newCountryFilter])


  // Handler for Country Filter Field
  const handleCountryFilterChange = (event) => {
    setNewCountryFilter(event.target.value)     
  }

   // Name Filter application
  const countriesToShow = newCountryFilter === ""
    ? countries
    : countries.filter( country => country.name.common.toUpperCase().indexOf(newCountryFilter.toUpperCase()) !== -1 )

  return (
    <div>
      <Filter value={ newCountryFilter } onChange={ handleCountryFilterChange } />
      <Countries countries={ countriesToShow } weatherInfo={weatherInfo} setNewCountryFilter={ setNewCountryFilter } />
      
    </div>
  )
}

export default App
