import React, { useState, useEffect } from "react";
import styles from "./Weather.module.css";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaWind } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import Toggle from "./Toggle/Toggle";
import LocationComponent from "./LocationComponent";




const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState();
  const [error, setError] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [isDark, setIsDark] = useState();
  const [temperature, setTemperature] = useState(null);
   const [location, setLocation] = useState({ latitude: null, longitude: null });

  const API_KEY = "f14259f1b3d54a0016a63b9b919f4fd7";
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  function handleOnChange(e) {
    setCity(e.target.value);
    console.log(city);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  async function fetchData() {
    try {
      let response = await fetch(URL);
      let output = await response.json();
      if (response.ok) {
        setWeather(output);
        console.log(output);
        setError("");
      } else {
        setError("No data found. Please enter a valid city name.");
      }
    } catch (error) {}
    setCity("");
  }

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };


    const getTemperature = async (latitude, longitude) => {
          const url = `${URL}&lat=${latitude}&lon=${longitude}`;
  
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTemperature(data.main.temp);
        } catch (error) {
          setError('');
        }
      };

    getLocation();
    getTemperature();
  }, []);

  return (
    <>
      <div className={styles.container} dark-theme={isDark ? "dark" : "light"}>
        <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
        <div className={styles.city}>
          <input
            type="text"
            value={city}
            onChange={handleOnChange}
            placeholder="Enter City"
          />
          <button onClick={() => fetchData()}>
            <HiMagnifyingGlass />
          </button>
        </div>

        {error && <p className={styles.error_message}>{error}</p>}
        {weather && weather.weather && (
          <div className={styles.content}>
            <div className={styles.weather_image}>
              <h3 className={styles.desc}>{weather.weather[0].description}</h3>
            </div>

            <div className={styles.weather_temp}>
              <h2>
                {weather.main.temp}
                <span>&deg;C</span>
              </h2>
            </div>

            <div className={styles.weather_city}>
              <div className={styles.location}>
                <MdLocationOn />
              </div>
              <p style={{ color: "#585858" }}>
                {weather.name},<span>{weather.sys.country}</span>
              </p>
            </div>

            <div className={styles.weather_stats}>
              <div className={styles.wind}>
                <div className={styles.wind_icon}>
                  <FaWind></FaWind>
                </div>
                <h3 className={styles.wind_speed}>
                  {weather.wind.speed}
                  <span>Km/h</span>
                </h3>
                <h3 className={styles.wind_heading}>Wind Speed</h3>
              </div>

              <div className={styles.humidity}>
                <div className={styles.humidity_icon}>
                  <WiHumidity></WiHumidity>
                </div>
                <h3 className={styles.humidity_percent}>
                  {weather.main.humidity}
                  <span>%</span>
                </h3>
                <h3 className={styles.humidity_heading}>Humidity</h3>
              </div>
            </div>
          </div>
        )}
         <div className={styles.current}>
          <div className={styles.currentDate}>
            Current Date/Time <br />
            {dateTime.toLocaleString()}
          </div>
          <div className={styles.currentLocation}>
            <LocationComponent />
            {temperature !== null ? (
            <p>Temperature: {temperature} °C</p>
          ) : (
            <p>Loading temperature...</p>
          )}
          </div>
        </div> 
        
      </div>
    </>
  );
};



export default Weather;
