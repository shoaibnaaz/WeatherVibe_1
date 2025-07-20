import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Navigation } from 'lucide-react'
import axios from 'axios'
import './LocationSearch.css'

const LocationSearch = ({ onLocationChange, currentLocation }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const searchLocation = async () => {
    if (!searchTerm.trim()) return

    setSearching(true)
    setError('')
    setShowSuggestions(false)

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
        setSuggestions([])
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

  const handleSearchInput = async (value) => {
    setSearchTerm(value)
    
    if (value.trim().length > 2) {
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
        if (!API_KEY) return
        
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(value)}&limit=3&appid=${API_KEY}`
        )
        
        if (response.data && response.data.length > 0) {
          setSuggestions(response.data)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (err) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    onLocationChange({
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: suggestion.name + (suggestion.state ? `, ${suggestion.state}` : '') + (suggestion.country ? `, ${suggestion.country}` : '')
    })
    setSearchTerm('')
    setSuggestions([])
    setShowSuggestions(false)
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
      setShowSuggestions(false)
      
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
          <div className="search-icon-wrapper">
            <Search className="search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search for a city, country, or location..."
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
            {searching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="loading-spinner"
              />
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        <button
          onClick={getCurrentLocation}
          className="current-location-btn"
          disabled={searching}
          aria-label="Use current location"
        >
          <Navigation className="location-icon" />
          <span>Current Location</span>
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div 
          className="search-suggestions"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="suggestion-icon" />
              <div className="suggestion-text">
                <span className="suggestion-name">{suggestion.name}</span>
                <span className="suggestion-details">
                  {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                </span>
              </div>
            </button>
          ))}
        </motion.div>
      )}

      {error && (
        <motion.div 
          className="search-error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <span className="error-icon">⚠️</span>
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