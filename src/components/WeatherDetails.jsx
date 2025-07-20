import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Music, Sun, Wind, Droplets, Thermometer, Eye, Compass, CloudRain, Sunrise, Sunset } from 'lucide-react'
import './WeatherDetails.css'

const WeatherDetails = ({ data, forecastData, units }) => {
  const getUVIndex = (temp, humidity, weather) => {
    // Simplified UV index calculation based on weather conditions
    let uvIndex = 3 // Base moderate UV
    
    if (weather.includes('clear') || weather.includes('sun')) {
      uvIndex = Math.min(10, Math.max(1, Math.floor(temp / 10) + 2))
    } else if (weather.includes('cloud')) {
      uvIndex = Math.min(7, Math.max(1, Math.floor(temp / 15) + 1))
    } else if (weather.includes('rain') || weather.includes('snow')) {
      uvIndex = Math.min(3, Math.max(1, Math.floor(temp / 20)))
    }
    
    return uvIndex
  }

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Low', color: '#4ade80', advice: 'No protection required' }
    if (uvIndex <= 5) return { level: 'Moderate', color: '#fbbf24', advice: 'Wear sunscreen' }
    if (uvIndex <= 7) return { level: 'High', color: '#f97316', advice: 'Reduce sun exposure' }
    if (uvIndex <= 10) return { level: 'Very High', color: '#dc2626', advice: 'Avoid sun exposure' }
    return { level: 'Extreme', color: '#7c2d12', advice: 'Take all precautions' }
  }

  const getAirQuality = (temp, humidity, wind) => {
    // Simplified air quality calculation
    let aqi = 50 // Base moderate
    
    if (wind > 10) aqi -= 20 // Good wind improves air quality
    if (humidity > 80) aqi += 15 // High humidity can worsen air quality
    if (temp > 30) aqi += 10 // High temperature can affect air quality
    
    return Math.max(0, Math.min(500, aqi))
  }

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#4ade80', description: 'Air quality is satisfactory' }
    if (aqi <= 100) return { level: 'Moderate', color: '#fbbf24', description: 'Some pollutants may be present' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#f97316', description: 'May cause health effects' }
    if (aqi <= 200) return { level: 'Unhealthy', color: '#dc2626', description: 'Everyone may experience health effects' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#7c2d12', description: 'Health warnings of emergency conditions' }
    return { level: 'Hazardous', color: '#581c87', description: 'Health alert: everyone may experience serious health effects' }
  }

  const getActivitySuggestions = (temp, weather, humidity) => {
    const suggestions = []
    
    if (weather.includes('clear') || weather.includes('sun')) {
      if (temp >= 20 && temp <= 30) {
        suggestions.push('Perfect for outdoor activities!')
        suggestions.push('Great time for a picnic')
        suggestions.push('Ideal for hiking or cycling')
      } else if (temp > 30) {
        suggestions.push('Stay hydrated and avoid peak sun hours')
        suggestions.push('Consider indoor activities')
        suggestions.push('Early morning or evening exercise recommended')
      }
    } else if (weather.includes('rain')) {
      suggestions.push('Indoor activities recommended')
      suggestions.push('Perfect for reading or movies')
      suggestions.push('Consider indoor sports or gym')
    } else if (weather.includes('snow')) {
      suggestions.push('Great for winter sports!')
      suggestions.push('Bundle up for outdoor activities')
      suggestions.push('Hot chocolate weather!')
    } else if (weather.includes('cloud')) {
      suggestions.push('Good for moderate outdoor activities')
      suggestions.push('Comfortable for walking or light exercise')
      suggestions.push('Check for rain before planning outdoor events')
    }
    
    return suggestions
  }

  const getMusicRecommendations = (weather, temp) => {
    const recommendations = []
    
    if (weather.includes('rain')) {
      recommendations.push({ genre: 'Jazz', mood: 'Cozy and relaxing', example: 'Norah Jones, Billie Holiday' })
      recommendations.push({ genre: 'Lo-fi', mood: 'Perfect for rainy days', example: 'Chillhop, Lo-fi beats' })
    } else if (weather.includes('sun') || weather.includes('clear')) {
      if (temp > 25) {
        recommendations.push({ genre: 'Pop', mood: 'Upbeat and energetic', example: 'Dua Lipa, The Weeknd' })
        recommendations.push({ genre: 'Reggae', mood: 'Summer vibes', example: 'Bob Marley, UB40' })
      } else {
        recommendations.push({ genre: 'Indie Folk', mood: 'Peaceful and uplifting', example: 'Mumford & Sons, The Lumineers' })
      }
    } else if (weather.includes('snow')) {
      recommendations.push({ genre: 'Classical', mood: 'Elegant and peaceful', example: 'Tchaikovsky, Debussy' })
      recommendations.push({ genre: 'Ambient', mood: 'Calming winter atmosphere', example: 'Brian Eno, Sigur Rós' })
    } else if (weather.includes('cloud')) {
      recommendations.push({ genre: 'Alternative Rock', mood: 'Thoughtful and introspective', example: 'Radiohead, The National' })
    }
    
    return recommendations
  }

  const getVisibilityDescription = (visibility) => {
    if (visibility >= 10000) return 'Excellent visibility'
    if (visibility >= 5000) return 'Good visibility'
    if (visibility >= 2000) return 'Moderate visibility'
    if (visibility >= 1000) return 'Poor visibility'
    return 'Very poor visibility'
  }

  const getPressureDescription = (pressure) => {
    if (pressure > 1020) return 'High pressure - generally fair weather'
    if (pressure > 1010) return 'Normal pressure - stable conditions'
    return 'Low pressure - unsettled weather possible'
  }

  const uvIndex = getUVIndex(data.main.temp, data.main.humidity, data.weather[0].main.toLowerCase())
  const uvLevel = getUVLevel(uvIndex)
  const aqi = getAirQuality(data.main.temp, data.main.humidity, data.wind.speed)
  const aqiLevel = getAQILevel(aqi)
  const activities = getActivitySuggestions(data.main.temp, data.weather[0].main.toLowerCase(), data.main.humidity)
  const music = getMusicRecommendations(data.weather[0].main.toLowerCase(), data.main.temp)

  return (
    <motion.div 
      className="weather-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="details-grid">
        {/* UV Index */}
        <motion.div 
          className="detail-card uv-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="card-header">
            <Sun className="card-icon" />
            <h3>UV Index</h3>
          </div>
          <div className="uv-content">
            <div className="uv-index" style={{ color: uvLevel.color }}>
              {uvIndex}
            </div>
            <div className="uv-level" style={{ color: uvLevel.color }}>
              {uvLevel.level}
            </div>
            <div className="uv-advice">
              {uvLevel.advice}
            </div>
          </div>
        </motion.div>

        {/* Air Quality */}
        <motion.div 
          className="detail-card aqi-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="card-header">
            <Wind className="card-icon" />
            <h3>Air Quality</h3>
          </div>
          <div className="aqi-content">
            <div className="aqi-index" style={{ color: aqiLevel.color }}>
              {aqi}
            </div>
            <div className="aqi-level" style={{ color: aqiLevel.color }}>
              {aqiLevel.level}
            </div>
            <div className="aqi-description">
              {aqiLevel.description}
            </div>
          </div>
        </motion.div>

        {/* Visibility */}
        <motion.div 
          className="detail-card visibility-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="card-header">
            <Eye className="card-icon" />
            <h3>Visibility</h3>
          </div>
          <div className="visibility-content">
            <div className="visibility-value">
              {data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A'}
            </div>
            <div className="visibility-description">
              {data.visibility ? getVisibilityDescription(data.visibility) : 'Data unavailable'}
            </div>
          </div>
        </motion.div>

        {/* Atmospheric Pressure */}
        <motion.div 
          className="detail-card pressure-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="card-header">
            <Thermometer className="card-icon" />
            <h3>Pressure</h3>
          </div>
          <div className="pressure-content">
            <div className="pressure-value">
              {data.main.pressure} hPa
            </div>
            <div className="pressure-description">
              {getPressureDescription(data.main.pressure)}
            </div>
          </div>
        </motion.div>

        {/* Wind Direction */}
        <motion.div 
          className="detail-card wind-direction-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="card-header">
            <Compass className="card-icon" />
            <h3>Wind Direction</h3>
          </div>
          <div className="wind-direction-content">
            <div className="wind-direction-value">
              {data.wind.deg}°
            </div>
            <div className="wind-direction-arrow" style={{ transform: `rotate(${data.wind.deg}deg)` }}>
              ↑
            </div>
            <div className="wind-direction-text">
              {data.wind.deg >= 337.5 || data.wind.deg < 22.5 ? 'North' :
               data.wind.deg >= 22.5 && data.wind.deg < 67.5 ? 'Northeast' :
               data.wind.deg >= 67.5 && data.wind.deg < 112.5 ? 'East' :
               data.wind.deg >= 112.5 && data.wind.deg < 157.5 ? 'Southeast' :
               data.wind.deg >= 157.5 && data.wind.deg < 202.5 ? 'South' :
               data.wind.deg >= 202.5 && data.wind.deg < 247.5 ? 'Southwest' :
               data.wind.deg >= 247.5 && data.wind.deg < 292.5 ? 'West' : 'Northwest'}
            </div>
          </div>
        </motion.div>

        {/* Precipitation Probability */}
        <motion.div 
          className="detail-card precipitation-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="card-header">
            <CloudRain className="card-icon" />
            <h3>Precipitation</h3>
          </div>
          <div className="precipitation-content">
            <div className="precipitation-value">
              {data.rain ? `${data.rain['1h'] || data.rain['3h'] || 0} mm` : '0 mm'}
            </div>
            <div className="precipitation-description">
              {data.rain && (data.rain['1h'] || data.rain['3h']) ? 'Rain in the last hour' : 'No recent precipitation'}
            </div>
          </div>
        </motion.div>

        {/* Activity Suggestions */}
        <motion.div 
          className="detail-card activity-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="card-header">
            <Activity className="card-icon" />
            <h3>Activity Suggestions</h3>
          </div>
          <div className="activity-content">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                ✨ {activity}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Music Recommendations */}
        <motion.div 
          className="detail-card music-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="card-header">
            <Music className="card-icon" />
            <h3>Music Vibes</h3>
          </div>
          <div className="music-content">
            {music.map((rec, index) => (
              <div key={index} className="music-item">
                <div className="music-genre">{rec.genre}</div>
                <div className="music-mood">{rec.mood}</div>
                <div className="music-example">{rec.example}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WeatherDetails 