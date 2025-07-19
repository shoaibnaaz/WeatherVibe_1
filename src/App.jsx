import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import WeatherBackground from './components/WeatherBackground'
import CurrentWeather from './components/CurrentWeather'
import HourlyForecast from './components/HourlyForecast'
import FiveDayForecast from './components/FiveDayForecast'
import WeatherDetails from './components/WeatherDetails'
import LocationSearch from './components/LocationSearch'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// Debug: Log API key status (without exposing the actual key)
console.log('API Key Status:', API_KEY ? 'Present' : 'Missing')
console.log('API Key Length:', API_KEY ? API_KEY.length : 0)

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [location, setLocation] = useState({ lat: 40.7128, lon: -74.0060, name: 'New York' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [units, setUnits] = useState('metric')

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true)
      setError(null)
      
      // Debug: Log the API call
      console.log('Making API call with key:', API_KEY ? 'Present' : 'Missing')
      
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`),
        axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)
      ])
      
      setWeatherData(weatherRes.data)
      setForecastData(forecastRes.data)
    } catch (err) {
      console.error('Weather fetch error details:', err.response?.data || err.message)
      setError('Failed to fetch weather data. Please try again.')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
    fetchWeatherData(newLocation.lat, newLocation.lon)
  }

  const handleUnitsChange = (newUnits) => {
    setUnits(newUnits)
    fetchWeatherData(location.lat, location.lon)
  }

  useEffect(() => {
    // Get user's location on first load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude, name: 'Current Location' })
          fetchWeatherData(latitude, longitude)
        },
        () => {
          // Fallback to default location
          fetchWeatherData(location.lat, location.lon)
        }
      )
    } else {
      fetchWeatherData(location.lat, location.lon)
    }
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => fetchWeatherData(location.lat, location.lon)} aria-label="Retry fetching weather data">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <WeatherBackground weatherData={weatherData} />
      
      <div className="app-content">
        <header className="app-header">
          <motion.h1 
            className="app-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            WeatherVibe
          </motion.h1>
          
          <LocationSearch 
            onLocationChange={handleLocationChange}
            currentLocation={location}
          />
        </header>

        <main className="main-content">
          <AnimatePresence mode="wait">
            {weatherData && (
              <motion.div
                key={location.lat + location.lon}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CurrentWeather 
                  data={weatherData} 
                  location={location}
                  units={units}
                  onUnitsChange={handleUnitsChange}
                />
                
                <div className="forecast-section">
                  <HourlyForecast 
                    data={forecastData} 
                    units={units}
                  />
                  
                  <FiveDayForecast 
                    data={forecastData} 
                    units={units}
                  />
                </div>
                
                <WeatherDetails 
                  data={weatherData} 
                  forecastData={forecastData}
                  units={units}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App 