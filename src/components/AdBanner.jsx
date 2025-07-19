import React, { useEffect } from 'react'
import './AdBanner.css'

const AdBanner = ({ position = 'top', className = '' }) => {
  useEffect(() => {
    // Initialize AdSense ads
    if (window.adsbygoogle) {
      window.adsbygoogle.push({})
    }
  }, [])

  return (
    <div className={`ad-banner ${position} ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label="Advertisement"
      />
    </div>
  )
}

export default AdBanner 