import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain } from 'lucide-react'
import './LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <motion.div 
          className="loading-icon"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Sun className="sun-icon" />
          <motion.div 
            className="cloud cloud-1"
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud />
          </motion.div>
          <motion.div 
            className="cloud cloud-2"
            animate={{ x: [20, -20, 20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud />
          </motion.div>
          <motion.div 
            className="rain"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudRain />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="loading-title"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          WeatherVibe
        </motion.h2>
        
        <motion.p 
          className="loading-text"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          Loading weather data...
        </motion.p>
        
        <div className="loading-dots">
          <motion.div 
            className="dot"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="dot"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            className="dot"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner 