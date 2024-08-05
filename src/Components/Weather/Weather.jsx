import React, { useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSearch } from "react-icons/io5";
import { WiHumidity } from "react-icons/wi";
import { LuWind } from "react-icons/lu";
import sunny from "../../assets/sunny2.webp";
import cloud from "../../assets/cloud.jpg";
import "../Weather/Weather.css";

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

  // For chart declaration....
  const chartData = {
    series: [
      {
        name: "Temperature",
        data: dailyWeatherData.map((day) => ({
          x: day.date,
          y: day.temperature,
        })),
      },
      {
        name: "Humidity",
        data: dailyWeatherData.map((day) => ({
          x: day.date,
          y: day.humidity,
        })),
      },
      {
        name: "windspeed",
        data: dailyWeatherData.map((day) => ({
          x: day.date,
          y: day.windspeed,
        })),
      },
    ],
    options: {
      chart: {
        background: "#f4f4f4",
        type: "line",
        height: 350,
      },
      stroke: {
        width: [3, 3, 3],
        height: [2],
      },
      xaxis: {
        type: "category",
        categories: dailyWeatherData.map((day) => day.date),
        title: {
          text: "Date",
        },
      },

      yaxis: [
        {
          title: {
            text: "Temperature (°C)",
          },
          min: 0,
        },
        {
          opposite: true,
          title: {
            text: "Humidity (%)",
          },
          min: 0,
        },
        {
          opposite: true,
          title: {
            text: "windspeed (km/h)",
          },
        },
      ],
      title: {
        text: "Daily Temperature",
        align: "left",
      },
      grid: {
        borderColor: "1921d1",
      },
      colors: ["#F44336", "#E91E63", "#9C27B0"],
    },
  };

  return (
    <div className="main-container">
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
            <p>No weather data available now!</p>
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
      <div className="chart-container">
        {dailyWeatherData.length > 0 && (
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="line"
            width={500}
            height={350}
          />
        )}
        <div className="weekly-forecast">
          {dailyWeatherData.length > 0 ? (
            dailyWeatherData.map((day, index) => (
              <div key={index} className="daily-forecast">
                <p className="date">{day.date}</p>
                <p className="temperature">{`${day.temperature}°C`}</p>
                <p className="humidity">{`${day.humidity}%`}</p>
                <p className="windspeed">{`${day.windspeed.toFixed(
                  0
                )} km/h`}</p>
              </div>
            ))
          ) : (
            <p>No weekly data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
