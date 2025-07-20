import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Eye, 
  Thermometer, 
  Droplets, 
  Gauge,
  Calendar,
  Clock,
  MapPin,
  Activity,
  Music,
  Umbrella,
  Sunglasses,
  Coffee,
  Car,
  Plane,
  Train,
  Ship
} from 'lucide-react'
import './WeatherSummary.css'

const WeatherSummary = ({ data, units }) => {
  if (!data) return null

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return <CloudRain className="weather-icon" />
    if (weatherId >= 300 && weatherId < 500) return <CloudRain className="weather-icon" />
    if (weatherId >= 500 && weatherId < 600) return <CloudRain className="weather-icon" />
    if (weatherId >= 600 && weatherId < 700) return <CloudRain className="weather-icon" />
    if (weatherId >= 700 && weatherId < 800) return <Cloud className="weather-icon" />
    if (weatherId === 800) return <Sun className="weather-icon" />
    return <Cloud className="weather-icon" />
  }

  const getUVIndexLevel = (uv) => {
    if (uv <= 2) return { level: 'Low', color: '#4ade80', advice: 'Safe to be outside' }
    if (uv <= 5) return { level: 'Moderate', color: '#fbbf24', advice: 'Take precautions' }
    if (uv <= 7) return { level: 'High', color: '#f97316', advice: 'Reduce time in sun' }
    if (uv <= 10) return { level: 'Very High', color: '#ef4444', advice: 'Minimize sun exposure' }
    return { level: 'Extreme', color: '#7c3aed', advice: 'Avoid sun exposure' }
  }

  const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#4ade80', description: 'Air quality is satisfactory' }
    if (aqi <= 100) return { level: 'Moderate', color: '#fbbf24', description: 'Some pollutants present' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#f97316', description: 'May affect sensitive groups' }
    if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', description: 'Everyone may be affected' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#7c3aed', description: 'Health warnings' }
    return { level: 'Hazardous', color: '#dc2626', description: 'Health alert' }
  }

  const getActivitySuggestion = (temp, weatherId) => {
    const isRaining = weatherId >= 200 && weatherId < 600
    const isCold = temp < 15
    const isHot = temp > 30
    
    if (isRaining) {
      return {
        activity: 'Indoor Activities',
        icon: <Coffee className="activity-icon" />,
        suggestions: ['Read a book', 'Watch movies', 'Board games', 'Cooking']
      }
    } else if (isCold) {
      return {
        activity: 'Warm Activities',
        icon: <Coffee className="activity-icon" />,
        suggestions: ['Hot drinks', 'Indoor sports', 'Shopping', 'Museums']
      }
    } else if (isHot) {
      return {
        activity: 'Cool Activities',
        icon: <Sunglasses className="activity-icon" />,
        suggestions: ['Swimming', 'Ice cream', 'Shade activities', 'Evening walks']
      }
    } else {
      return {
        activity: 'Outdoor Activities',
        icon: <Activity className="activity-icon" />,
        suggestions: ['Walking', 'Cycling', 'Picnic', 'Sports']
      }
    }
  }

  const getMusicVibe = (weatherId, temp) => {
    const isRaining = weatherId >= 200 && weatherId < 600
    const isCold = temp < 15
    const isHot = temp > 30
    
    if (isRaining) {
      return {
        vibe: 'Cozy & Relaxing',
        icon: <Music className="music-icon" />,
        genres: ['Jazz', 'Lo-fi', 'Classical', 'Acoustic']
      }
    } else if (isCold) {
      return {
        vibe: 'Warm & Uplifting',
        icon: <Music className="music-icon" />,
        genres: ['Pop', 'Rock', 'Electronic', 'Folk']
      }
    } else if (isHot) {
      return {
        vibe: 'Cool & Refreshing',
        icon: <Music className="music-icon" />,
        genres: ['Chill', 'Reggae', 'Smooth Jazz', 'Ambient']
      }
    } else {
      return {
        vibe: 'Energetic & Fun',
        icon: <Music className="music-icon" />,
        genres: ['Pop', 'Dance', 'Hip-hop', 'Rock']
      }
    }
  }

  const getTravelAdvice = (weatherId, windSpeed) => {
    const isBadWeather = weatherId >= 200 && weatherId < 600 || weatherId >= 700 && weatherId < 800
    const isWindy = windSpeed > 10
    
    if (isBadWeather && isWindy) {
      return {
        advice: 'Avoid Travel',
        icon: <Car className="travel-icon" />,
        reason: 'Poor weather conditions',
        alternatives: ['Stay home', 'Use public transport', 'Postpone if possible']
      }
    } else if (isBadWeather) {
      return {
        advice: 'Travel with Caution',
        icon: <Car className="travel-icon" />,
        reason: 'Weather may affect travel',
        alternatives: ['Drive carefully', 'Check routes', 'Allow extra time']
      }
    } else if (isWindy) {
      return {
        advice: 'Windy Conditions',
        icon: <Wind className="travel-icon" />,
        reason: 'Strong winds expected',
        alternatives: ['Secure loose items', 'Avoid high vehicles', 'Check flight status']
      }
    } else {
      return {
        advice: 'Good Travel Conditions',
        icon: <Car className="travel-icon" />,
        reason: 'Clear weather ahead',
        alternatives: ['Roads clear', 'Good visibility', 'Safe travel']
      }
    }
  }

  const uvInfo = getUVIndexLevel(data.main?.temp || 0)
  const aqiInfo = getAirQualityLevel(50) // Default AQI
  const activityInfo = getActivitySuggestion(data.main?.temp, data.weather?.[0]?.id)
  const musicInfo = getMusicVibe(data.weather?.[0]?.id, data.main?.temp)
  const travelInfo = getTravelAdvice(data.weather?.[0]?.id, data.wind?.speed)

  const cards = [
    {
      title: 'UV Index',
      icon: <Sun className="card-icon" />,
      value: `${data.main?.temp ? Math.round(data.main.temp) : 'N/A'}`,
      unit: 'UV',
      color: uvInfo.color,
      description: uvInfo.level,
      advice: uvInfo.advice
    },
    {
      title: 'Air Quality',
      icon: <Eye className="card-icon" />,
      value: '50',
      unit: 'AQI',
      color: aqiInfo.color,
      description: aqiInfo.level,
      advice: aqiInfo.description
    },
    {
      title: 'Visibility',
      icon: <Eye className="card-icon" />,
      value: `${Math.round((data.visibility || 10000) / 1000)}`,
      unit: 'km',
      color: '#3b82f6',
      description: data.visibility > 10000 ? 'Excellent' : 'Good',
      advice: 'Good visibility for outdoor activities'
    },
    {
      title: 'Pressure',
      icon: <Gauge className="card-icon" />,
      value: `${data.main?.pressure || 'N/A'}`,
      unit: 'hPa',
      color: '#8b5cf6',
      description: data.main?.pressure > 1013 ? 'High' : 'Low',
      advice: 'Stable weather conditions'
    },
    {
      title: 'Sunrise',
      icon: <Sun className="card-icon" />,
      value: new Date((data.sys?.sunrise || 0) * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      unit: '',
      color: '#f59e0b',
      description: 'Day starts',
      advice: 'Perfect time for morning activities'
    },
    {
      title: 'Sunset',
      icon: <Sun className="card-icon" />,
      value: new Date((data.sys?.sunset || 0) * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      unit: '',
      color: '#ef4444',
      description: 'Day ends',
      advice: 'Time to wind down'
    }
  ]

  return (
    <div className="weather-summary">
      <motion.h2 
        className="summary-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Weather Summary
      </motion.h2>
      
      <div className="summary-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className="summary-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="card-header">
              {card.icon}
              <h3>{card.title}</h3>
            </div>
            <div className="card-value" style={{ color: card.color }}>
              {card.value}{card.unit}
            </div>
            <div className="card-description">{card.description}</div>
            <div className="card-advice">{card.advice}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity Suggestions */}
      <motion.div 
        className="activity-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="section-title">
          {activityInfo.icon}
          {activityInfo.activity}
        </h3>
        <div className="activity-suggestions">
          {activityInfo.suggestions.map((suggestion, index) => (
            <span key={index} className="activity-tag">{suggestion}</span>
          ))}
        </div>
      </motion.div>

      {/* Music Vibes */}
      <motion.div 
        className="music-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="section-title">
          {musicInfo.icon}
          {musicInfo.vibe}
        </h3>
        <div className="music-genres">
          {musicInfo.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
      </motion.div>

      {/* Travel Advice */}
      <motion.div 
        className="travel-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="section-title">
          {travelInfo.icon}
          Travel Advice
        </h3>
        <div className="travel-info">
          <div className="travel-status">
            <span className="status-badge" style={{ backgroundColor: travelInfo.advice.includes('Good') ? '#4ade80' : '#fbbf24' }}>
              {travelInfo.advice}
            </span>
          </div>
          <p className="travel-reason">{travelInfo.reason}</p>
          <div className="travel-alternatives">
            {travelInfo.alternatives.map((alt, index) => (
              <span key={index} className="alternative-tag">{alt}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WeatherSummary 