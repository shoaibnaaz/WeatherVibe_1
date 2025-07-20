import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './AdBanner.css'

const AdBanner = ({ position = 'top', format = 'banner' }) => {
  const adRef = useRef(null)

  useEffect(() => {
    // Initialize Google AdSense
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({})
        console.log(`AdSense ad loaded for ${position} position`)
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [position])

  const getAdFormat = () => {
    switch (format) {
      case 'banner':
        return {
          className: 'ad-banner',
          adUnit: 'ca-pub-XXXXXXXXXXXXXXXX',
          adSlot: position === 'top' ? '1234567890' : '0987654321',
          adFormat: 'auto',
          responsive: true
        }
      case 'rectangle':
        return {
          className: 'ad-rectangle',
          adUnit: 'ca-pub-XXXXXXXXXXXXXXXX',
          adSlot: position === 'top' ? '1122334455' : '5544332211',
          adFormat: 'rectangle',
          responsive: false
        }
      case 'sidebar':
        return {
          className: 'ad-sidebar',
          adUnit: 'ca-pub-XXXXXXXXXXXXXXXX',
          adSlot: '6677889900',
          adFormat: 'vertical',
          responsive: false
        }
      default:
        return {
          className: 'ad-banner',
          adUnit: 'ca-pub-XXXXXXXXXXXXXXXX',
          adSlot: position === 'top' ? '1234567890' : '0987654321',
          adFormat: 'auto',
          responsive: true
        }
    }
  }

  const adConfig = getAdFormat()

  return (
    <motion.div
      className={`ad-container ${adConfig.className} ${position}`}
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="ad-label">
        <span>📢 Advertisement</span>
      </div>
      
      <div className="ad-content" ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adConfig.adUnit}
          data-ad-slot={adConfig.adSlot}
          data-ad-format={adConfig.adFormat}
          data-full-width-responsive={adConfig.responsive}
        />
      </div>
      
      <div className="ad-footer">
        <span>Support our app</span>
      </div>
    </motion.div>
  )
}

export default AdBanner 