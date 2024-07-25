import React from "react";
import "../Weather/Weather.css";
import { WiHumidity } from "react-icons/wi";
import { IoSearch } from "react-icons/io5";
import sunny from "../../assets/sunny2.webp";
import { LuWind } from "react-icons/lu";

export default function Weather() {

  const search=async()=>{}
  
  return (
    <div className="weather">
      <div className="search-bar">
        <input type="text" placeholder="search"></input>
        <IoSearch className="search-icon" />
      </div>
      <img src={sunny}></img>
      <div className="details">
        <p className="temprature">16°C</p>
        <p className="location">London</p>
      </div>
      <div className="weather-data">
        <div className="col">
          <WiHumidity className="data-img" />
          <div>
            <p>91%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <LuWind className="data-img" />
          <div>
            <p>3.6 km/h</p>
            <span>wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
