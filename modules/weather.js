// Weather page functionality using Open-Meteo API
let currentWeatherData = null; // Store current weather data for unit conversion
let isFahrenheit = false; // Track current unit

document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const unitToggle = document.getElementById('unitToggle');

  // Use user's location on page load
  getUserLocation();

  // Search button functionality
  searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
      searchCity(city);
    }
  });

  // Allow Enter key to search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = searchInput.value.trim();
      if (city) {
        searchCity(city);
      }
    }
  });

  // Unit toggle functionality
  unitToggle.addEventListener('click', () => {
    isFahrenheit = !isFahrenheit;
    unitToggle.textContent = isFahrenheit ? '°C' : '°F';
    
    // Re-display weather with new unit
    if (currentWeatherData) {
      updateTemperatureDisplay();
    }
  });
});

/**
 * Get user's location using geolocation API
 */
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        showLoading();
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        // If geolocation fails, use default location (New York)
        console.warn('Geolocation error:', error);
        showLoading();
        searchCity('New York');
      }
    );
  } else {
    // If geolocation not supported, use default location
    showLoading();
    searchCity('New York');
  }
}

/**
 * Search for a city and fetch weather
 */
async function searchCity(cityName) {
  showLoading();
  try {
    // First, get coordinates from city name using geocoding
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) throw new Error('Network error');

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError(`City "${cityName}" not found. Please try another city.`);
      hideLoading();
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    fetchWeatherByCoordinates(latitude, longitude, name, country);
  } catch (error) {
    showError('Failed to search for city. Please try again.');
    console.error('Search error:', error);
  }
}

/**
 * Fetch weather data using coordinates
 */
async function fetchWeatherByCoordinates(latitude, longitude, cityName = null, country = null) {
  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    if (!weatherResponse.ok) throw new Error('Network error');

    const weatherData = await weatherResponse.json();

    // If cityName not provided, try to get it from reverse geocoding
    if (!cityName) {
      try {
        const reverseGeoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        if (reverseGeoResponse.ok) {
          const geoData = await reverseGeoResponse.json();
          cityName = geoData.address?.city || geoData.address?.town || 'Unknown Location';
          country = geoData.address?.country || '';
        }
      } catch (e) {
        cityName = 'Your Location';
      }
    }

    displayWeather(weatherData, cityName, country);
  } catch (error) {
    showError('Failed to fetch weather data. Please try again.');
    console.error('Weather fetch error:', error);
  }
}

/**
 * Display weather data on the page
 */
function displayWeather(data, cityName, country) {
  currentWeatherData = data; // Store for unit conversion
  const current = data.current;
  const daily = data.daily;

  // Update current weather
  document.getElementById('cityName').textContent = `${cityName}${country ? ', ' + country : ''}`;
  document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get weather description from weather code
  const weatherDesc = getWeatherDescription(current.weather_code);
  document.getElementById('weatherDesc').textContent = weatherDesc;

  // Display 7-day forecast
  displayForecast(daily);

  // Update temperatures with current unit preference
  updateTemperatureDisplay();

  // Show weather display and hide loading
  hideLoading();
  hideError();
  document.getElementById('weatherDisplay').style.display = 'block';
}

/**
 * Update temperature display based on current unit (C/F)
 */
function updateTemperatureDisplay() {
  const current = currentWeatherData.current;
  const daily = currentWeatherData.daily;

  if (isFahrenheit) {
    // Convert Celsius to Fahrenheit
    const tempF = Math.round((current.temperature_2m * 9/5) + 32);
    const feelsLikeF = Math.round((current.apparent_temperature * 9/5) + 32);
    
    document.getElementById('temperature').textContent = tempF;
    document.getElementById('tempUnit').textContent = '°F';
    document.getElementById('feelsLikeTemp').textContent = feelsLikeF;
    document.getElementById('feelsLikeUnit').textContent = '°F';
    
    // Update forecast cards
    updateForecastDisplay(daily, true);
  } else {
    // Display Celsius
    document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
    document.getElementById('tempUnit').textContent = '°C';
    document.getElementById('feelsLikeTemp').textContent = Math.round(current.apparent_temperature);
    document.getElementById('feelsLikeUnit').textContent = '°C';
    
    // Update forecast cards
    updateForecastDisplay(daily, false);
  }

  // Update other metrics that don't change with unit
  document.getElementById('humidity').textContent = current.relative_humidity_2m;
  document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m);
  document.getElementById('pressure').textContent = Math.round(current.pressure_msl);
  document.getElementById('uvIndex').textContent = current.uv_index.toFixed(1);
}

/**
 * Display 7-day forecast
 */
function displayForecast(daily) {
  updateForecastDisplay(daily, isFahrenheit);
}

/**
 * Update forecast display with correct unit
 */
function updateForecastDisplay(daily, showFahrenheit) {
  const forecastGrid = document.getElementById('forecastGrid');
  forecastGrid.innerHTML = '';

  const days = daily.time.length;
  for (let i = 0; i < Math.min(7, days); i++) {
    const date = new Date(daily.time[i]);
    const weatherCode = daily.weather_code[i];
    let maxTemp = daily.temperature_2m_max[i];
    let minTemp = daily.temperature_2m_min[i];

    // Convert to Fahrenheit if needed
    if (showFahrenheit) {
      maxTemp = Math.round((maxTemp * 9/5) + 32);
      minTemp = Math.round((minTemp * 9/5) + 32);
    } else {
      maxTemp = Math.round(maxTemp);
      minTemp = Math.round(minTemp);
    }

    const card = document.createElement('div');
    card.className = 'forecast-card';

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    card.innerHTML = `
      <p class="forecast-date">${dayName}<br>${dayDate}</p>
      <div class="forecast-icon">${getWeatherEmoji(weatherCode)}</div>
      <p class="forecast-desc">${getWeatherDescription(weatherCode)}</p>
      <div class="forecast-temps">
        <span class="forecast-high">${maxTemp}°</span>
        <span class="forecast-low">${minTemp}°</span>
      </div>
    `;

    forecastGrid.appendChild(card);
  }
}

/**
 * Convert WMO weather codes to descriptions
 * https://www.open-meteo.com/en/docs
 */
function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };

  return weatherCodes[code] || 'Unknown';
}

/**
 * Convert WMO weather codes to emojis
 */
function getWeatherEmoji(code) {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code === 51 || code === 53 || code === 55) return '🌦️';
  if (code === 61 || code === 63 || code === 65 || code === 80 || code === 81 || code === 82) return '🌧️';
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌐';
}

/**
 * UI Helper functions
 */
function showLoading() {
  document.getElementById('loading').style.setProperty('display', 'flex', 'important');
  document.getElementById('weatherDisplay').style.setProperty('display', 'none', 'important');
  hideError();
}

function hideLoading() {
  document.getElementById('loading').style.setProperty('display', 'none', 'important');
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  document.getElementById('weatherDisplay').style.display = 'none';
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}
