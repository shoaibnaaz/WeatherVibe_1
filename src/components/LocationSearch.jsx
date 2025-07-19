import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin } from 'lucide-react'
import axios from 'axios'
import './LocationSearch.css'

const LocationSearch = ({ onLocationChange, currentLocation }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const searchLocation = async () => {
    if (!searchTerm.trim()) return

    setSearching(true)
    setError('')

    try {
      // Using OpenWeatherMap Geocoding API
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
      
      // Check if API key is available
      if (!API_KEY) {
        throw new Error('API key is missing. Please check your environment variables.')
      }
      
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchTerm)}&limit=5&appid=${API_KEY}`
      )

      if (response.data && response.data.length > 0) {
        const location = response.data[0]
        onLocationChange({
          lat: location.lat,
          lon: location.lon,
          name: location.name + (location.state ? `, ${location.state}` : '') + (location.country ? `, ${location.country}` : '')
        })
        setSearchTerm('')
      } else {
        setError('Location not found. Please try a different search term.')
      }
    } catch (err) {
      console.error('Location search error details:', err.response?.data || err.message)
      
      // More specific error messages
      if (err.message.includes('API key is missing')) {
        setError('API key is missing. Please check your environment variables.')
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Please check your OpenWeatherMap API key.')
      } else if (err.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.')
      } else {
        setError('Failed to search location. Please try again.')
      }
      
      console.error('Location search error:', err)
    } finally {
      setSearching(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation()
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setSearching(true)
      setError('')
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            
            // Reverse geocoding to get location name
            const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
            
            // Check if API key is available
            if (!API_KEY) {
              throw new Error('API key is missing. Please check your environment variables.')
            }
            
            const response = await axios.get(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            )

            if (response.data && response.data.length > 0) {
              const location = response.data[0]
              onLocationChange({
                lat: latitude,
                lon: longitude,
                name: location.name + (location.state ? `, ${location.state}` : '') + (location.country ? `, ${location.country}` : '')
              })
            } else {
              onLocationChange({
                lat: latitude,
                lon: longitude,
                name: 'Current Location'
              })
            }
          } catch (err) {
            setError('Failed to get location name.')
            console.error('Reverse geocoding error:', err)
          } finally {
            setSearching(false)
          }
        },
        () => {
          setError('Unable to get your location. Please search manually.')
          setSearching(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }

  return (
    <motion.div 
      className="location-search"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="search-container">
        <div className="search-input-group">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
            disabled={searching}
            aria-label="Search for a city"
          />
          <button
            onClick={searchLocation}
            className="search-btn"
            disabled={searching || !searchTerm.trim()}
            aria-label="Search for city"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <button
          onClick={getCurrentLocation}
          className="current-location-btn"
          disabled={searching}
          aria-label="Use current location"
        >
          <MapPin className="location-icon" />
          Current Location
        </button>
      </div>

      {error && (
        <motion.div 
          className="search-error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.div>
      )}

      {currentLocation && (
        <motion.div 
          className="current-location-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MapPin className="current-location-icon" />
          <span className="current-location-text">
            {currentLocation.name}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default LocationSearch 