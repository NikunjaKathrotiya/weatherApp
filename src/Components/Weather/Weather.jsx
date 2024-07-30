import React, { useState } from "react";
import "../Weather/Weather.css";
import { WiHumidity } from "react-icons/wi";
import { IoSearch } from "react-icons/io5";
import sunny from "../../assets/sunny2.webp";
import moon from "../../assets/moon.jpg";
import { LuWind } from "react-icons/lu";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const handleSearch = () => {
    if (!city) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=Surat&units=metric&appid=fd69c683d920c977ab77d25393e24cd4

`
      )
      .then((res) => {
        if (res.status === 200) {
          setWeatherData({
            temperature: Math.floor(res.data.main.temp),
            humidity: res.data.main.humidity,
            windspeed: res.data.wind.speed,
            location: res.data.name,
          });
          console.log(res.data, "data print>>>>>>>>>");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            toast.success("City not found. Please enter a valid city", {
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
            console.log("Error response data:", error.response.data);
          }
        } else if (error.request) {
          toast.error("No response received from the server", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log("Error request:", error.request);
        } else {
          toast.error("Error in setting up the request", {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log("Error message:", error.message);
        }
      });
    console.log("weatherData....", weatherData);
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <IoSearch className="search-icon" onClick={handleSearch} />
      </div>

      <img
        src={weatherData && weatherData.temperature < 20 ? moon : sunny}
        alt={weatherData && weatherData.temperature < 20 ? "Moon" : "Sunny"}
      />

      <div className="details">
        {weatherData ? (
          <>
            <p className="temperature">
              {weatherData ? `${weatherData.temperature}°C` : "0.0 °C"}
            </p>
            <p className="location">{weatherData.location}</p>
          </>
        ) : (
          <></>
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
