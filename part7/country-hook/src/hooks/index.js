import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState({})

  useEffect(() => {
    if(name !== '' && name !== null) {
      (async () => {
        try {
          const result = await axios.get(`https://restcountries.com/v3.1/name/${name}`)
        
          if(result.data && result.data.length > 0) {
            const countyObject = 
            {
              name : result.data[0].name.common,
              capital : result.data[0].capital,
              population : result.data[0].population,
              flag : result.data[0].flags.png,
              found : true
            }
            setCountry(countyObject)
          }
        } catch(err) {
          const countyObject = 
          {
            found : false
          }
          setCountry(countyObject)
          console.log(err)
        }
      })()
      
    }
  }, [name])

  return country
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}