import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react'
import './CurrentWeather.css'

const CurrentWeather = ({ data, location, units, onUnitsChange }) => {
  const getWeatherIcon = (weatherCode) => {
    // Weather icon mapping based on OpenWeatherMap codes
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
      minute: '2-digit',
      hour12: true
    })
  }

  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F'
  const getSpeedUnit = () => units === 'metric' ? 'm/s' : 'mph'

  const [voiceLang, setVoiceLang] = useState('en-US'); // default to English
  const [availableVoices, setAvailableVoices] = useState([]);

  // List of supported languages
  const languages = [
    { code: 'en-US', label: 'English' },
    { code: 'ur-PK', label: 'Urdu' },
    { code: 'ps-PK', label: 'Pashto' },
    { code: 'zh-CN', label: 'Chinese (Mandarin)' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'bn-BD', label: 'Bengali' },
    { code: 'es-ES', label: 'Spanish' },
    { code: 'de-DE', label: 'German' },
    { code: 'ru-RU', label: 'Russian' },
    { code: 'tr-TR', label: 'Turkish' },
    { code: 'ar-SA', label: 'Arabic' },
    { code: 'fr-FR', label: 'French' },
    // Add more as needed
  ];

  // Voice feedback handler
  const handleSpeakWeather = () => {
    if (!data) return;
    
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const city = location.name;
    const unit = getTemperatureUnit();
    
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a voice for the selected language
    let selectedVoice = voices.find(voice => 
      voice.lang.startsWith(voiceLang.split('-')[0]) || 
      voice.lang === voiceLang
    );
    
    // If no voice found for selected language, try to find any available voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      if (selectedVoice) {
        alert(`Voice for ${languages.find(lang => lang.code === voiceLang)?.label} not available. Using ${selectedVoice.name} instead.`);
      } else {
        alert('No voices available. Please try a different browser or language.');
        return;
      }
    }

    let message;
    if (voiceLang === 'ur-PK') {
      message = `اس وقت ${city} میں موسم ${desc} ہے اور درجہ حرارت ${temp} ${unit} ہے۔`;
    } else if (voiceLang === 'ps-PK') {
      message = `اوس مهال په ${city} کې هوا ${desc} ده او تودوخه ${temp} ${unit} ده.`;
    } else if (voiceLang === 'zh-CN') {
      message = `${city}的天气是${desc}，温度是${temp}${unit}。`;
    } else if (voiceLang === 'hi-IN') {
      message = `${city} में मौसम ${desc} है और तापमान ${temp} ${unit} है।`;
    } else if (voiceLang === 'bn-BD') {
      message = `${city} এ আবহাওয়া ${desc} এবং তাপমাত্রা ${temp} ${unit}।`;
    } else if (voiceLang === 'es-ES') {
      message = `El clima en ${city} es ${desc} con una temperatura de ${temp} ${unit}.`;
    } else if (voiceLang === 'de-DE') {
      message = `Das Wetter in ${city} ist ${desc} mit einer Temperatur von ${temp} ${unit}.`;
    } else if (voiceLang === 'ru-RU') {
      message = `Погода в ${city} ${desc} с температурой ${temp} ${unit}.`;
    } else if (voiceLang === 'tr-TR') {
      message = `${city} şehrinde hava ${desc} ve sıcaklık ${temp} ${unit}.`;
    } else if (voiceLang === 'ar-SA') {
      message = `الطقس في ${city} ${desc} ودرجة الحرارة ${temp} ${unit}.`;
    } else if (voiceLang === 'fr-FR') {
      message = `Le temps à ${city} est ${desc} avec une température de ${temp} ${unit}.`;
    } else {
      message = `The current weather in ${city} is ${desc} with a temperature of ${temp} ${unit}.`;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = selectedVoice;
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Stop any currently speaking
    window.speechSynthesis.cancel();
    
    // Speak the message
    window.speechSynthesis.speak(utterance);
  };

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      if (voices.length > 0) {
        // Check if default language voice is available
        const defaultVoice = voices.find(voice => 
          voice.lang.startsWith(voiceLang.split('-')[0]) || 
          voice.lang === voiceLang
        );
        if (!defaultVoice) {
          console.log(`Voice for ${voiceLang} not available. Available voices:`, voices.map(v => `${v.name} (${v.lang})`));
        }
      }
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also load when voices change
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceLang]);

  // Check if voice is available for selected language
  const isVoiceAvailable = (langCode) => {
    return availableVoices.some(voice => 
      voice.lang.startsWith(langCode.split('-')[0]) || 
      voice.lang === langCode
    );
  };

  const getWeatherTextColor = () => {
    if (!data) return 'var(--text-default)';
    const desc = data.weather[0].description.toLowerCase();
    if (desc.includes('rain')) return 'var(--text-rainy)';
    if (desc.includes('cloud')) return 'var(--text-cloudy)';
    if (desc.includes('snow')) return 'var(--text-snowy)';
    if (desc.includes('storm')) return 'var(--text-stormy)';
    if (desc.includes('fog') || desc.includes('mist')) return 'var(--text-foggy)';
    if (desc.includes('clear') || desc.includes('sun')) return 'var(--text-sunny)';
    return 'var(--text-default)';
  };

  return (
    <motion.div 
      className="current-weather"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="weather-header">
        <div className="location-info">
          <MapPin className="location-icon" />
          <h2 className="location-name">{location.name}</h2>
        </div>
        
        <div className="units-toggle">
          <button 
            className={`unit-btn ${units === 'metric' ? 'active' : ''}`}
            onClick={() => onUnitsChange('metric')}
            aria-label="Switch to Celsius"
          >
            °C
          </button>
          <button 
            className={`unit-btn ${units === 'imperial' ? 'active' : ''}`}
            onClick={() => onUnitsChange('imperial')}
            aria-label="Switch to Fahrenheit"
          >
            °F
          </button>
        </div>
        {/* Voice controls group */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '0.5rem' }}>
          <label htmlFor="voice-lang" style={{ marginRight: '0.25rem', color: 'var(--sunny-primary)', fontWeight: 600 }}>
            Voice:
          </label>
          <select
            id="voice-lang"
            value={voiceLang}
            onChange={e => setVoiceLang(e.target.value)}
            aria-label="Select voice language"
            style={{ padding: '0.25rem', borderRadius: '0.5rem', fontSize: '1rem' }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label} {isVoiceAvailable(lang.code) ? '✅' : '❌'}
              </option>
            ))}
          </select>
          <button
            onClick={handleSpeakWeather}
            aria-label="Speak current weather"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sunny-primary)',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.25rem'
            }}
          >
            <span role="img" aria-label="Speaker">🔊</span>
            <span style={{ marginLeft: '0.3rem', fontWeight: 600 }}>Speak</span>
          </button>
        </div>
      </div>

      <div className="weather-main">
        <div className="weather-icon-section">
          <div className="weather-icon">
            {getWeatherIcon(data.weather[0].icon)}
          </div>
          <p className="weather-description">
            {data.weather[0].description.charAt(0).toUpperCase() + 
             data.weather[0].description.slice(1)}
          </p>
        </div>

        <div className="temperature-section">
          <div className="current-temp">
            <span className="temp-value">
              {Math.round(data.main.temp)}
            </span>
            <span className="temp-unit">{getTemperatureUnit()}</span>
          </div>
          
          <div className="temp-range">
            <span className="temp-min">
              {Math.round(data.main.temp_min)}°
            </span>
            <span className="temp-separator">/</span>
            <span className="temp-max">
              {Math.round(data.main.temp_max)}°
            </span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <Thermometer className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">
              {Math.round(data.main.feels_like)}{getTemperatureUnit()}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <Droplets className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.main.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <Wind className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value">
              {Math.round(data.wind.speed)} {getSpeedUnit()}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <Eye className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">
              {(data.visibility / 1000).toFixed(1)} km
            </span>
          </div>
        </div>
      </div>

      <div className="sun-times">
        <div className="sun-item">
          <Sunrise className="sun-icon sunrise" />
          <div className="sun-content">
            <span className="sun-label">Sunrise</span>
            <span className="sun-time">
              {formatTime(data.sys.sunrise)}
            </span>
          </div>
        </div>

        <div className="sun-item">
          <Sunset className="sun-icon sunset" />
          <div className="sun-content">
            <span className="sun-label">Sunset</span>
            <span className="sun-time">
              {formatTime(data.sys.sunset)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CurrentWeather 