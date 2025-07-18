import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
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

      <div className="hourly-timeline">
        {hourlyData.map((hour, index) => (
          <motion.div
            key={hour.dt}
            className="hourly-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="hour-time">
              {index === 0 ? 'Now' : formatTime(hour.dt)}
            </div>
            
            <div className="hour-icon">
              {getWeatherIcon(hour.weather[0].icon)}
            </div>
            
            <div className="hour-temp">
              {Math.round(hour.main.temp)}{getTemperatureUnit()}
            </div>
            
            <div className="hour-details">
              <div className="hour-humidity">
                💧 {hour.main.humidity}%
              </div>
              <div className="hour-wind">
                💨 {Math.round(hour.wind.speed)} {units === 'metric' ? 'm/s' : 'mph'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="forecast-summary">
        <div className="summary-item">
          <span className="summary-label">High</span>
          <span className="summary-value">
            {Math.round(Math.max(...hourlyData.map(h => h.main.temp)))}{getTemperatureUnit()}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Low</span>
          <span className="summary-value">
            {Math.round(Math.min(...hourlyData.map(h => h.main.temp)))}{getTemperatureUnit()}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg</span>
          <span className="summary-value">
            {Math.round(hourlyData.reduce((sum, h) => sum + h.main.temp, 0) / hourlyData.length)}{getTemperatureUnit()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default HourlyForecast 