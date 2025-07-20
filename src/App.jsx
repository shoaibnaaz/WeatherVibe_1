import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import WeatherBackground from './components/WeatherBackground'
import CurrentWeather from './components/CurrentWeather'
import HourlyForecast from './components/HourlyForecast'
import FiveDayForecast from './components/FiveDayForecast'
import WeatherDetails from './components/WeatherDetails'
import WeatherSummary from './components/WeatherSummary'
import LocationSearch from './components/LocationSearch'
import LoadingSpinner from './components/LoadingSpinner'
import AdBanner from './components/AdBanner'
import './App.css'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// Debug: Log API key status (without exposing the actual key)
console.log('API Key Status:', API_KEY ? 'Present' : 'Missing')
console.log('API Key Length:', API_KEY ? API_KEY.length : 0)

// Check if API key is available
if (!API_KEY) {
  console.error('❌ VITE_OPENWEATHER_API_KEY is missing! Please add it to your environment variables.')
}

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [location, setLocation] = useState({ lat: 33.6844, lon: 73.0479, name: 'Rawalpindi' }) // Default to Rawalpindi
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [units, setUnits] = useState('metric')
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Function to get city name from coordinates using reverse geocoding
  const getCityNameFromCoords = useCallback(async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      )
      
      if (response.data && response.data.length > 0) {
        const cityData = response.data[0]
        return {
          name: cityData.name,
          state: cityData.state,
          country: cityData.country
        }
      }
      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }, [])

  // Memoize API calls to prevent unnecessary requests
  const fetchWeatherData = useCallback(async (lat, lon, cityName = null) => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if API key is available
      if (!API_KEY) {
        throw new Error('API key is missing. Please check your environment variables.')
      }
      
      // Debug: Log the API call
      console.log('Making API call with key:', API_KEY ? 'Present' : 'Missing')
      console.log('Fetching weather for coordinates:', lat, lon)
      
      // Use Promise.allSettled for better error handling
      const [weatherRes, forecastRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`),
        axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)
      ])
      
      // Check if both requests were successful
      if (weatherRes.status === 'fulfilled' && forecastRes.status === 'fulfilled') {
        setWeatherData(weatherRes.value.data)
        setForecastData(forecastRes.value.data)
        
        // Update location with proper city name if not provided
        if (!cityName) {
          const cityInfo = await getCityNameFromCoords(lat, lon)
          if (cityInfo) {
            setLocation(prev => ({
              ...prev,
              lat,
              lon,
              name: cityInfo.name,
              state: cityInfo.state,
              country: cityInfo.country
            }))
          } else {
            setLocation(prev => ({ ...prev, lat, lon }))
          }
        } else {
          setLocation(prev => ({ ...prev, lat, lon, name: cityName }))
        }
      } else {
        throw new Error('Failed to fetch weather data')
      }
    } catch (err) {
      console.error('Weather fetch error details:', err.response?.data || err.message)
      
      // More specific error messages
      if (err.message.includes('API key is missing')) {
        setError('API key is missing. Please check your environment variables.')
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Please check your OpenWeatherMap API key.')
      } else if (err.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.')
      } else {
        setError('Failed to fetch weather data. Please try again.')
      }
      
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
      setIsInitialLoad(false)
    }
  }, [units, getCityNameFromCoords])

  const handleLocationChange = useCallback((newLocation) => {
    setLocation(newLocation)
    fetchWeatherData(newLocation.lat, newLocation.lon, newLocation.name)
  }, [fetchWeatherData])

  const handleUnitsChange = useCallback((newUnits) => {
    setUnits(newUnits)
    fetchWeatherData(location.lat, location.lon, location.name)
  }, [fetchWeatherData, location.lat, location.lon, location.name])

  // Memoize the initial location fetch
  useEffect(() => {
    const initializeApp = async () => {
      // Get user's location on first load
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 15000, // 15 second timeout
              enableHighAccuracy: true, // Use high accuracy for better location
              maximumAge: 300000 // Cache for 5 minutes
            })
          })
          
          const { latitude, longitude } = position.coords
          console.log('User location detected:', latitude, longitude)
          
          // Get city name from coordinates
          const cityInfo = await getCityNameFromCoords(latitude, longitude)
          if (cityInfo) {
            setLocation({ 
              lat: latitude, 
              lon: longitude, 
              name: cityInfo.name,
              state: cityInfo.state,
              country: cityInfo.country
            })
            console.log('City detected:', cityInfo)
          } else {
            setLocation({ lat: latitude, lon: longitude, name: 'Current Location' })
          }
          
          await fetchWeatherData(latitude, longitude, cityInfo?.name)
        } catch (error) {
          console.log('Geolocation failed, using default location (Rawalpindi)')
          await fetchWeatherData(location.lat, location.lon, location.name)
        }
      } else {
        await fetchWeatherData(location.lat, location.lon, location.name)
      }
    }

    initializeApp()
  }, []) // Empty dependency array for initial load only

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => {
    if (!weatherData) return null

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.lat + location.lon}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentWeather 
            data={weatherData} 
            location={location}
            units={units}
            onUnitsChange={handleUnitsChange}
          />
          
          {/* Weather Summary Cards */}
          <WeatherSummary 
            data={weatherData} 
            units={units}
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
      </AnimatePresence>
    )
  }, [weatherData, forecastData, location, units, handleUnitsChange])

  // Quick info cards for when data is loading
  const quickInfoCards = useMemo(() => (
    <div className="quick-info-section">
      <motion.div 
        className="quick-info-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="quick-info-card">
          <h3>🌡️ Temperature</h3>
          <p>Loading current temperature...</p>
        </div>
        <div className="quick-info-card">
          <h3>💨 Wind</h3>
          <p>Checking wind conditions...</p>
        </div>
        <div className="quick-info-card">
          <h3>💧 Humidity</h3>
          <p>Measuring humidity levels...</p>
        </div>
        <div className="quick-info-card">
          <h3>👁️ Visibility</h3>
          <p>Calculating visibility...</p>
        </div>
      </motion.div>
    </div>
  ), [])

  if (isInitialLoad && loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => fetchWeatherData(location.lat, location.lon, location.name)} aria-label="Retry fetching weather data">
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

        {/* Top Ad Banner */}
        <AdBanner position="top" />

        <main className="main-content">
          {loading && !isInitialLoad ? (
            <div className="loading-overlay">
              <LoadingSpinner />
            </div>
          ) : weatherData ? (
            mainContent
          ) : (
            <div className="content-placeholder">
              <motion.div 
                className="weather-status-banner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2>🌤️ Weather Information</h2>
                <p>Getting the latest weather data for {location.name}...</p>
              </motion.div>
              
              {quickInfoCards}
              
              <motion.div 
                className="feature-highlights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3>✨ App Features</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <span>🌡️</span>
                    <p>Real-time temperature</p>
                  </div>
                  <div className="feature-item">
                    <span>📱</span>
                    <p>Mobile responsive</p>
                  </div>
                  <div className="feature-item">
                    <span>🎵</span>
                    <p>Music recommendations</p>
                  </div>
                  <div className="feature-item">
                    <span>🚗</span>
                    <p>Travel advice</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>

        {/* Bottom Ad Banner */}
        <AdBanner position="bottom" />
      </div>
    </div>
  )
}

export default App 