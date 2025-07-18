import React from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import './FiveDayForecast.css'

const FiveDayForecast = ({ data, units }) => {
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F'

  // Group forecast data by day and get daily averages
  const getDailyForecast = () => {
    if (!data?.list) return []
    
    const dailyData = {}
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString()
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt,
          temps: [],
          humidity: [],
          wind: [],
          weather: item.weather[0],
          icon: item.weather[0].icon
        }
      }
      
      dailyData[date].temps.push(item.main.temp)
      dailyData[date].humidity.push(item.main.humidity)
      dailyData[date].wind.push(item.wind.speed)
    })
    
    return Object.values(dailyData).slice(0, 5)
  }

  const dailyForecast = getDailyForecast()

  return (
    <motion.div 
      className="five-day-forecast"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="forecast-header">
        <Calendar className="forecast-icon" />
        <h3 className="forecast-title">5-Day Forecast</h3>
      </div>

      <div className="daily-forecast">
        {dailyForecast.map((day, index) => {
          const avgTemp = Math.round(day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length)
          const minTemp = Math.round(Math.min(...day.temps))
          const maxTemp = Math.round(Math.max(...day.temps))
          const avgHumidity = Math.round(day.humidity.reduce((sum, h) => sum + h, 0) / day.humidity.length)
          const avgWind = Math.round(day.wind.reduce((sum, w) => sum + w, 0) / day.wind.length)
          
          return (
            <motion.div
              key={day.date}
              className="daily-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="day-header">
                <div className="day-date">
                  {index === 0 ? 'Today' : formatDate(day.date)}
                </div>
                <div className="day-icon">
                  {getWeatherIcon(day.icon)}
                </div>
              </div>
              
              <div className="day-temps">
                <div className="temp-main">
                  {avgTemp}{getTemperatureUnit()}
                </div>
                <div className="temp-range">
                  <span className="temp-min">{minTemp}°</span>
                  <span className="temp-separator">/</span>
                  <span className="temp-max">{maxTemp}°</span>
                </div>
              </div>
              
              <div className="day-details">
                <div className="detail-row">
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{avgHumidity}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Wind</span>
                  <span className="detail-value">
                    {avgWind} {units === 'metric' ? 'm/s' : 'mph'}
                  </span>
                </div>
              </div>
              
              <div className="day-description">
                {day.weather.description.charAt(0).toUpperCase() + 
                 day.weather.description.slice(1)}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="forecast-insights">
        <div className="insight-item">
          <span className="insight-icon">📊</span>
          <div className="insight-content">
            <span className="insight-title">Weekly Trend</span>
            <span className="insight-text">
              {dailyForecast.length > 1 ? 
                `Average temperature: ${Math.round(dailyForecast.reduce((sum, day) => 
                  sum + day.temps.reduce((s, t) => s + t, 0) / day.temps.length, 0) / dailyForecast.length
                )}${getTemperatureUnit()}` : 
                'Loading trend data...'
              }
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FiveDayForecast 