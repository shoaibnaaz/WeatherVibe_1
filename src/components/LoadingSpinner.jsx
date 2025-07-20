import React from 'react'
import { motion } from 'framer-motion'
import './LoadingSpinner.css'

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <motion.div 
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear",
          repeatDelay: 0
        }}
      >
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </motion.div>
      
      <motion.div 
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Loading Weather Data</h2>
        <p>Getting the latest forecast for your location...</p>
      </motion.div>
      
      <motion.div 
        className="loading-progress"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="progress-bar"></div>
      </motion.div>
    </div>
  )
}

export default LoadingSpinner 