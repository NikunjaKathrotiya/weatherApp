import React, { useState } from "react";
import "../Weather/Weather.css";
import { WiHumidity } from "react-icons/wi";
import { IoSearch } from "react-icons/io5";
import sunny from "../../assets/sunny2.webp";
import cloud from "../../assets/cloud.jpg";
import { LuWind } from "react-icons/lu";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [dailyWeatherData, setDailyWeatherData] = useState([]);
  const [mode, setMode] = useState("light");

  const handleSearch = (event) => {
    event.preventDefault();

    if (!city) {
      toast.warning("Please enter a city name", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=fd69c683d920c977ab77d25393e24cd4`
      )
      .then((res) => {
        if (res.status === 200) {
          const {lat,lon} = res.data.city.coord;
          const dailyData = res.data.list
            .filter((entry) => entry.dt_txt.includes("12:00:00")) 
            .map((entry) => ({
              temperature: Math.floor(entry.main.temp),
              humidity: entry.main.humidity,
              windspeed: entry.wind.speed,
              date: new Date(entry.dt * 1000).toLocaleDateString(),
            }));
          const temperature = Math.floor(dailyData[0].temperature);
          const newMode = temperature < 22 ? "dark" : "light";
          setWeatherData({
            temperature,
            humidity: dailyData[0].humidity,
            windspeed: dailyData[0].windspeed,
            location: city,
          });
          setDailyWeatherData(dailyData);
          setMode(newMode);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {

            toast.error("City not found. Please enter a valid city", {
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast.error(
              `Error: ${error.response.status} - ${error.response.data.message}`,
              {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        } else if (error.request) {
          toast.error("No response received from the server", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Error in setting up the request", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
  };

  return (
    <div className={mode === "light" ? "weather" : "weather-dark"}>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="search-icon">
          <IoSearch />
        </button>
      </form>
      <img
        className="son-moon-images"
        src={weatherData && weatherData.temperature < 20 ? cloud : sunny}
        alt={weatherData && weatherData.temperature < 20 ? "cloud" : "Sunny"}
      />

      <div className="details">
        {weatherData ? (
          <>
            <p className="temperature">{`${weatherData.temperature}°C`}</p>
            <p className="location">{weatherData.location}</p>
          </>
        ) : (
          <p>No weather data available</p>
        )}
      </div>

      <div className="weather-data">
        <div className="col">
          <WiHumidity className="data-img" />
          <div>
            <p>{weatherData ? `${weatherData.humidity}%` : "0.0%"}</p>
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <LuWind className="data-img" />
          <div>
            <p>
              {weatherData
                ? `${weatherData.windspeed.toFixed(0)} km/h`
                : "0.0 km/h"}
            </p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>

      <div className="weekly-forecast">
        {dailyWeatherData.length > 0 ? (
          dailyWeatherData.map((day, index) => (
            <div key={index} className="daily-forecast">
              <p className="date">{day.date}</p>
              <p className="temperature">{`${day.temperature}°C`}</p>
              <p className="humidity">{`${day.humidity}%`}</p>
              <p className="windspeed">{`${day.windspeed.toFixed(0)} km/h`}</p>
            </div>
          ))
        ) : (
          <p>No weekly data available</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
