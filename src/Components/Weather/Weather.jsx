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

export default function Weather(props) {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
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
    console.log("print weatherData....", weatherData);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=fd69c683d920c977ab77d25393e24cd4`
      )
      .then((res) => {
        if (res.status === 200) {
          const temperature = Math.floor(res.data.main.temp);
          const newMode = temperature < 22 ? "dark" : "light";
          setWeatherData({
            temperature,
            humidity: res.data.main.humidity,
            windspeed: res.data.wind.speed,
            location: res.data.name,
          });
          setMode(newMode);
          console.log(newMode);
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

      <ToastContainer />
    </div>
  );
}
