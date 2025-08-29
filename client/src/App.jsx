import React, { useState } from "react";
import { WiDaySunny,  WiCloud,  WiFog,  WiRain,  WiSnow,  WiThunderstorm,  WiDayCloudy } from "react-icons/wi"

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeatherIcon = (code) => {

    if (code === 0) return <WiDaySunny className="text-yellow-400 text-6xl" />

    if (code >= 1 && code <= 3)
      return <WiDayCloudy className="text-blue-400 text-6xl" />;
    if (code === 45 || code === 48)
      return <WiFog className="text-gray-500 text-6xl" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
      return <WiRain className="text-blue-500 text-6xl" />;
    if (code >= 71 && code <= 77)
      return <WiSnow className="text-blue-300 text-6xl" />;
    if (code >= 95 && code <= 99)
      return <WiThunderstorm className="text-purple-600 text-6xl" />;

    return <WiCloud className="text-gray-400 text-6xl" />;
  };

  const getWeather = async () => {
    
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      // Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Get weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      
      setWeather({
        city: `${name}, ${country}`,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        code: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Weather Now
        </h1>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter city name"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={getWeather}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 mt-4">Loading...</p>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {/* Weather Info */}
        {weather && (
          <div className="mt-6 text-center space-y-3">
            <h2 className="text-xl font-semibold">{weather.city}</h2>
            <div className="flex justify-center">
              {getWeatherIcon(weather.code)}
            </div>
            <p className="text-4xl font-bold text-blue-600">{weather.temp}°C</p>
            <p className="text-gray-700">Wind: {weather.wind} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App