import React, { useState, useEffect } from 'react'


const weatherIcons = {
    '01d': '☀️', // Cielo despejado (día)
    '01n': '🌙', // Cielo despejado (noche)
    '02d': '🌤️', // Algunas nubes (día)
    '02n': '🌤️', // Algunas nubes (noche)
    '03d': '🌥️', // Nubes dispersas (día)
    '03n': '🌥️', // Nubes dispersas (noche)
    '04d': '☁️', // Nublado (día)
    '04n': '☁️', // Nublado (noche)
    '09d': '🌧️', // Lluvia intensa (día)
    '09n': '🌧️', // Lluvia intensa (noche)
    '10d': '🌦️', // Lluvia ligera (día)
    '10n': '🌦️', // Lluvia ligera (noche)
    '11d': '🌩️', // Tormenta (día)
    '11n': '🌩️', // Tormenta (noche)
    '13d': '❄️', // Nieve (día)
    '13n': '❄️', // Nieve (noche)
    '50d': '🌫️', // Niebla (día)
    '50n': '🌫️', // Niebla (noche)
}

const API_KEY = process.env.API_KEY

const Weather = () => {
    const [locations, setLocations] = useState([])
    const [latLon, setLatLon] = useState(null)
    const [input, setInput] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [enterKey, setEnterKey] = useState(false)

    /* SELECCION DE LOCALIDAD / REGION  OBTENCION DE COORDENADAS*/
    useEffect(() => {
        const searchLocation = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`
                )

                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }

                const data = await response.json()
                setLocations(data)
            } catch (error) {
                console.error('Error', error)
            }
        }
        if (enterKey){
            searchLocation()
        }
    })

    /* LLAMADA A LA API MEDIANTE COORDENADAS */
    const searchLatLon = async (Lat, Lon, Country) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${Lat}&units=metric&lon=${Lon}&appid=${API_KEY}`
            )

            setSelectedCountry(Country)


            if (!response.ok) {
                throw new Error('Error en la solicitud')
            }
            const data = await response.json()
            setLatLon(data)
        } catch (error) {
            console.error('Error', error)
        }
    }

    const handleInputChange = (event) => {
        setInput(event.target.value)
    }

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
          setEnterKey(true)
        }else{
            setEnterKey(false)
        }
      }
    

    return (
        <div className='container'>
            <h1 className='title-page'>Weather App</h1>
            <input
                type='text'
                value={input}
                onChange={handleInputChange}
                placeholder='Enter a location...'
                className='search-input'
                onKeyDown={handleInputKeyDown}
            />

            
            <ul className='ul-select'>
                {locations.length > 0 ? 
                        <div className='select-title'>Select a location...</div> : ""
                }

                {locations.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => searchLatLon(item.lat, item.lon, `${item.name}, ${item.country}`)}
                        className='list-Locations'>
                        {item.name}, {item.country}
                    </li>
                ))}
            </ul>

            {latLon && (
                <div className='container'>
                    <div className='card'>
                        <h3 className='title'>{selectedCountry}</h3>

                        <p className="icon">{weatherIcons[latLon.weather[0].icon]}</p>
                        <p className="description">{latLon.weather[0].description}</p>
                        <p className="temp-item">{latLon.main.temp}º C</p>

                        <div className="item-container">
                            <p className="item">Feels Like: {latLon.main.feels_like}º C</p>
                            <p className="item">Temp Max: {latLon.main.temp_max}º C</p>
                            <p className="item">Temp Min: {latLon.main.temp_min}º C</p>
                            <p className="item">Pressure: {latLon.main.pressure} hPa</p>
                            <p className="item">Humidity: {latLon.main.humidity} %</p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Weather
