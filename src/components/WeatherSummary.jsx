import React from 'react'
import { motion } from 'framer-motion'
import './WeatherSummary.css'

const WeatherSummary = ({ data, units }) => {
  if (!data) return null

  const getUVIndex = (uvi) => {
    if (uvi <= 2) return { level: 'Low', color: '#4ade80', advice: 'No protection required' }
    if (uvi <= 5) return { level: 'Moderate', color: '#fbbf24', advice: 'Wear sunscreen' }
    if (uvi <= 7) return { level: 'High', color: '#f97316', advice: 'Seek shade during midday' }
    if (uvi <= 10) return { level: 'Very High', color: '#dc2626', advice: 'Minimize sun exposure' }
    return { level: 'Extreme', color: '#7c2d12', advice: 'Avoid sun exposure' }
  }

  const getAirQuality = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#4ade80', description: 'Air quality is satisfactory' }
    if (aqi <= 100) return { level: 'Moderate', color: '#fbbf24', description: 'Some pollutants may be present' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#f97316', description: 'May cause health effects' }
    if (aqi <= 200) return { level: 'Unhealthy', color: '#dc2626', description: 'Everyone may experience health effects' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#7c2d12', description: 'Health warnings of emergency conditions' }
    return { level: 'Hazardous', color: '#581c87', description: 'Health alert: everyone may experience serious health effects' }
  }

  const getActivitySuggestions = (temp, weather) => {
    const suggestions = []
    
    if (temp > 25) {
      suggestions.push('Perfect for outdoor activities')
      suggestions.push('Great time for swimming or beach')
      suggestions.push('Consider early morning or evening exercise')
    } else if (temp > 15) {
      suggestions.push('Good for moderate outdoor activities')
      suggestions.push('Comfortable for walking or light exercise')
      suggestions.push('Check for rain before planning outdoor events')
    } else if (temp > 5) {
      suggestions.push('Bundle up for outdoor activities')
      suggestions.push('Indoor activities recommended')
      suggestions.push('Hot drinks and warm clothing advised')
    } else {
      suggestions.push('Stay indoors if possible')
      suggestions.push('Dress in multiple layers')
      suggestions.push('Avoid prolonged outdoor exposure')
    }

    if (weather?.toLowerCase().includes('rain')) {
      suggestions.push('Bring an umbrella or raincoat')
      suggestions.push('Indoor activities recommended')
    }

    return suggestions.slice(0, 3)
  }

  const getMusicVibes = (weather, temp) => {
    const vibes = []
    
    if (weather?.toLowerCase().includes('rain')) {
      vibes.push({ genre: 'Lo-fi', mood: 'Calm and relaxing', artists: 'Nujabes, J Dilla' })
    } else if (temp > 25) {
      vibes.push({ genre: 'Summer Pop', mood: 'Energetic and upbeat', artists: 'Dua Lipa, The Weeknd' })
    } else if (temp > 15) {
      vibes.push({ genre: 'Alternative Rock', mood: 'Thoughtful and introspective', artists: 'Radiohead, The National' })
    } else {
      vibes.push({ genre: 'Indie Folk', mood: 'Cozy and warm', artists: 'Bon Iver, Fleet Foxes' })
    }

    return vibes[0]
  }

  const uvInfo = getUVIndex(data.uvi || 3)
  const aqInfo = getAirQuality(data.main?.aqi || 60)
  const activities = getActivitySuggestions(data.main?.temp, data.weather?.[0]?.main)
  const musicVibe = getMusicVibes(data.weather?.[0]?.main, data.main?.temp)

  return (
    <div className="weather-summary">
      <div className="summary-grid">
        <motion.div 
          className="summary-card uv-index"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card-header">
            <span className="card-icon">☀️</span>
            <h3>UV Index</h3>
          </div>
          <div className="card-content">
            <div className="uv-value" style={{ color: uvInfo.color }}>
              {data.uvi || 3}
            </div>
            <div className="uv-level" style={{ color: uvInfo.color }}>
              {uvInfo.level}
            </div>
            <p className="uv-advice">{uvInfo.advice}</p>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card air-quality"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-header">
            <span className="card-icon">🌬️</span>
            <h3>Air Quality</h3>
          </div>
          <div className="card-content">
            <div className="aq-value" style={{ color: aqInfo.color }}>
              {data.main?.aqi || 60}
            </div>
            <div className="aq-level" style={{ color: aqInfo.color }}>
              {aqInfo.level}
            </div>
            <p className="aq-description">{aqInfo.description}</p>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card activity-suggestions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card-header">
            <span className="card-icon">⚡</span>
            <h3>Activity Suggestions</h3>
          </div>
          <div className="card-content">
            <ul className="activity-list">
              {activities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <span className="activity-icon">✨</span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card music-vibes"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-header">
            <span className="card-icon">🎵</span>
            <h3>Music Vibes</h3>
          </div>
          <div className="card-content">
            <div className="music-genre">{musicVibe.genre}</div>
            <p className="music-mood">{musicVibe.mood}</p>
            <p className="music-artists">{musicVibe.artists}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WeatherSummary 