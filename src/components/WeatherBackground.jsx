import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './WeatherBackground.css'

const WeatherBackground = ({ weatherData }) => {
  const [weatherType, setWeatherType] = useState('default')
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!weatherData) return

    const mainWeather = weatherData.weather[0].main.toLowerCase()
    const description = weatherData.weather[0].description.toLowerCase()
    
    let newWeatherType = 'default'
    
    if (description.includes('rain') || description.includes('drizzle')) {
      newWeatherType = 'rainy'
    } else if (description.includes('snow')) {
      newWeatherType = 'snowy'
    } else if (description.includes('thunderstorm')) {
      newWeatherType = 'stormy'
    } else if (description.includes('cloud')) {
      newWeatherType = 'cloudy'
    } else if (description.includes('clear') || description.includes('sun')) {
      newWeatherType = 'sunny'
    } else if (description.includes('fog') || description.includes('mist')) {
      newWeatherType = 'foggy'
    }

    setWeatherType(newWeatherType)
    
    // Generate particles based on weather type
    const newParticles = []
    const particleCount = weatherType === 'rainy' ? 100 : weatherType === 'snowy' ? 50 : 0
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 2
      })
    }
    
    setParticles(newParticles)
  }, [weatherData])

  const getBackgroundGradient = () => {
    switch (weatherType) {
      case 'sunny':
        return 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd93d 100%)'
      case 'rainy':
        return 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #5d6d7e 100%)'
      case 'snowy':
        return 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 50%, #95a5a6 100%)'
      case 'cloudy':
        return 'linear-gradient(135deg, #7f8c8d 0%, #95a5a6 50%, #bdc3c7 100%)'
      case 'stormy':
        return 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)'
      case 'foggy':
        return 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 50%, #7f8c8d 100%)'
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }

  return (
    <div className="weather-background">
      <div 
        className="background-gradient"
        style={{ background: getBackgroundGradient() }}
      />
      
      {/* Weather-specific elements */}
      {weatherType === 'sunny' && (
        <motion.div 
          className="sun"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {weatherType === 'cloudy' && (
        <>
          <motion.div 
            className="cloud cloud-1"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="cloud cloud-2"
            animate={{ x: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="cloud cloud-3"
            animate={{ x: [0, 25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      
      {weatherType === 'rainy' && (
        <>
          <motion.div 
            className="cloud rain-cloud"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="rain-drop"
              style={{ left: `${particle.x}%` }}
              animate={{ y: [-100, 100] }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </>
      )}
      
      {weatherType === 'snowy' && (
        <>
          <motion.div 
            className="cloud snow-cloud"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="snowflake"
              style={{ left: `${particle.x}%` }}
              animate={{ 
                y: [-100, 100],
                rotate: [0, 360]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </>
      )}
      
      {weatherType === 'stormy' && (
        <>
          <motion.div 
            className="cloud storm-cloud"
            animate={{ 
              x: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="lightning"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
          />
        </>
      )}
      
      {/* Overlay for better text readability */}
      <div className="background-overlay" />
    </div>
  )
}

export default WeatherBackground 