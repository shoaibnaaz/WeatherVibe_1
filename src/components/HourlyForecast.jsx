import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Droplets, Wind, Thermometer } from 'lucide-react'
import './HourlyForecast.css'

const HourlyForecast = ({ data, units }) => {
  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    }
    return iconMap[weatherCode] || '🌤️'
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    })
  }

  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F'

  // Get next 24 hours of forecast (every 3 hours)
  const hourlyData = data?.list?.slice(0, 8) || []

  const getWeatherDescription = (weatherCode) => {
    const descriptions = {
      '01d': 'Clear Sky', '01n': 'Clear Night',
      '02d': 'Partly Cloudy', '02n': 'Partly Cloudy',
      '03d': 'Cloudy', '03n': 'Cloudy',
      '04d': 'Overcast', '04n': 'Overcast',
      '09d': 'Light Rain', '09n': 'Light Rain',
      '10d': 'Rain', '10n': 'Rain',
      '11d': 'Thunderstorm', '11n': 'Thunderstorm',
      '13d': 'Snow', '13n': 'Snow',
      '50d': 'Mist', '50n': 'Mist'
    }
    return descriptions[weatherCode] || 'Unknown'
  }

  return (
    <motion.div 
      className="hourly-forecast"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="forecast-header">
        <Clock className="forecast-icon" />
        <h3 className="forecast-title">24-Hour Forecast</h3>
      </div>

      <div className="hourly-list">
        {hourlyData.map((hour, index) => (
          <motion.div
            key={hour.dt}
            className="hourly-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="hour-time-section">
              <div className="hour-time">
                {index === 0 ? 'Now' : formatTime(hour.dt)}
              </div>
              <div className="hour-date">
                {new Date(hour.dt * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="hour-weather-section">
              <div className="hour-icon">
                {getWeatherIcon(hour.weather[0].icon)}
              </div>
              <div className="hour-description">
                {getWeatherDescription(hour.weather[0].icon)}
              </div>
            </div>
            
            <div className="hour-temp-section">
              <div className="hour-temp">
                {Math.round(hour.main.temp)}{getTemperatureUnit()}
              </div>
              <div className="hour-feels-like">
                Feels like {Math.round(hour.main.feels_like)}{getTemperatureUnit()}
              </div>
            </div>
            
            <div className="hour-details-section">
              <div className="detail-item">
                <Droplets className="detail-icon" />
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{hour.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <Wind className="detail-icon" />
                <span className="detail-label">Wind</span>
                <span className="detail-value">
                  {Math.round(hour.wind.speed)} {units === 'metric' ? 'm/s' : 'mph'}
                </span>
              </div>
              <div className="detail-item">
                <Thermometer className="detail-icon" />
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{hour.main.pressure} hPa</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="forecast-summary">
        <div className="summary-header">
          <h4>Temperature Summary</h4>
        </div>
        <div className="summary-grid">
          <div className="summary-item high">
            <span className="summary-label">High</span>
            <span className="summary-value">
              {Math.round(Math.max(...hourlyData.map(h => h.main.temp)))}{getTemperatureUnit()}
            </span>
          </div>
          <div className="summary-item low">
            <span className="summary-label">Low</span>
            <span className="summary-value">
              {Math.round(Math.min(...hourlyData.map(h => h.main.temp)))}{getTemperatureUnit()}
            </span>
          </div>
          <div className="summary-item avg">
            <span className="summary-label">Average</span>
            <span className="summary-value">
              {Math.round(hourlyData.reduce((sum, h) => sum + h.main.temp, 0) / hourlyData.length)}{getTemperatureUnit()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HourlyForecast 