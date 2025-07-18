# WeatherVibe - Real-Time Weather App 🌤️

A modern, feature-rich weather application with dynamic backgrounds, real-time weather data, and unique features that set it apart from other weather apps.

## ✨ Features

### 🌍 Real-Time Weather Data
- Current weather conditions with detailed information
- Hourly forecast for the next 24 hours
- 5-day weather forecast with daily averages
- Automatic location detection using GPS
- Manual location search with geocoding

### 🎨 Dynamic Backgrounds
- **Sunny Weather**: Bright orange gradient with animated sun
- **Rainy Weather**: Dark blue gradient with animated rain drops
- **Snowy Weather**: Light gray gradient with falling snowflakes
- **Cloudy Weather**: Gray gradient with floating clouds
- **Stormy Weather**: Dark gradient with lightning effects
- **Foggy Weather**: Misty gradient for fog conditions

### 🎵 Unique Features
- **Weather-Based Music Recommendations**: Get music suggestions based on current weather
- **Activity Suggestions**: Personalized activity recommendations for the weather
- **UV Index**: Real-time UV index with sun protection advice
- **Air Quality Index**: Air quality monitoring with health recommendations
- **Weather Insights**: Weekly trends and weather patterns

### 📱 Modern UI/UX
- Glass morphism design with backdrop blur effects
- Smooth animations using Framer Motion
- Responsive design for all devices
- Dark theme with weather-appropriate color schemes
- Interactive elements with hover effects

### 🔧 Technical Features
- Real-time API integration with OpenWeatherMap
- Geolocation services
- Unit conversion (Celsius/Fahrenheit)
- Error handling and loading states
- Progressive Web App ready

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Weather-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Replace `YOUR_OPENWEATHER_API_KEY` in the following files:
     - `src/App.jsx` (line 12)
     - `src/components/LocationSearch.jsx` (lines 20 and 45)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Allow location access for automatic weather detection

## 🛠️ Built With

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **OpenWeatherMap API** - Weather data provider

## 📱 Usage

### Current Weather
- View current temperature, humidity, wind speed, and visibility
- See sunrise and sunset times
- Toggle between Celsius and Fahrenheit

### Hourly Forecast
- Scrollable timeline of weather predictions
- Temperature, humidity, and wind data for each hour
- Summary statistics (high, low, average)

### 5-Day Forecast
- Daily weather predictions with averages
- Temperature ranges and weather descriptions
- Weekly trend analysis

### Weather Details
- **UV Index**: Current UV level with protection advice
- **Air Quality**: AQI with health recommendations
- **Activity Suggestions**: Weather-appropriate activities
- **Music Recommendations**: Genre and artist suggestions

### Location Search
- Search for any city worldwide
- Use current location with GPS
- Automatic location name resolution

## 🎨 Design System

### Color Palette
- **Sunny**: Orange gradients (#ff6b35, #f7931e, #ffd93d)
- **Rainy**: Blue gradients (#2c3e50, #34495e, #5d6d7e)
- **Snowy**: Gray gradients (#ecf0f1, #bdc3c7, #95a5a6)
- **Cloudy**: Gray gradients (#7f8c8d, #95a5a6, #bdc3c7)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Animations
- Smooth page transitions
- Weather element animations
- Loading states with weather themes
- Hover effects and micro-interactions

## 📱 Responsive Design

The app is fully responsive and optimized for:
- **Desktop**: Full feature set with grid layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Stacked layouts with optimized spacing

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### API Configuration
The app uses OpenWeatherMap API endpoints:
- Current weather: `/weather`
- 5-day forecast: `/forecast`
- Geocoding: `/geo/1.0/direct`
- Reverse geocoding: `/geo/1.0/reverse`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for icons
- [Inter Font](https://rsms.me/inter/) for typography

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Made with ❤️ and ☕ by the WeatherVibe Team** 