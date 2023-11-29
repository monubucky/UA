import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const App = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [dailyWeather, setDailyWeather] = useState([]);



  useEffect(() => {
    if (city) {
      axios.get(`${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => {
          console.log(response.data)
          setCityData(response.data.city)

          const dailyData = response.data.list.filter((item, index, array) => {
            const date = new Date(item.dt * 1000);
            const nextDate = index < array.length - 1 ? new Date(array[index + 1].dt * 1000) : null;

            // Keep the item if it's the first of the day or the last item
            return !nextDate || date.getDate() !== nextDate.getDate();
          });
          setForecast(dailyData.slice(0, 5));
          console.log(dailyData)
          // setDailyWeather(dailyData);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Trigger fetching data when the search button is clicked
    setCity(e.target.elements.city.value);
  };

  const renderForecastCard = (day) => {
    return (
      <div>
        <p className='date'>{new Date(day.dt * 1000).toLocaleDateString()}</p>
        <div key={day.dt} className="forecast-card">
          <div className='weather'>
            <img
              className='img'
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            /><p>{day.weather[0].main}</p></div>
          <hr></hr>
          <p>{day.main.temp_max}°C</p>
          <p>{day.main.temp_min}°C</p>
          <p>{day.main.humidity}%</p>
          <p>{new Date(cityData.sunrise * 1000).toLocaleTimeString()}</p>
          <p>{new Date(cityData.sunset * 1000).toLocaleTimeString()}</p>

        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className='header'>
        <p>Weather 99</p>
      </div>
      <div className='cityNsearch'>
        <div className='interCity'>
          <h2>{cityData.name}, {cityData.country}</h2>
          {/* <p>{cityData.coord.lat} & {cityData.coord.lon}</p> */}
        </div>
        <div className='searchBox'>
          <form onSubmit={handleSearch} className='search'>
            <input type="text" className="searchInput" name="city" placeholder="Search your city here..." />
            <button type="submit" className='searchIcon'><img src="https://cdn3.iconfinder.com/data/icons/feather-5/24/search-512.png" /></button>
          </form>
        </div>
      </div><hr></hr>
      <div className="forecast-container">
        <div className='forecast-card-1'>
          <div>Select Date:
            <form >
              <input type="date" name="calender" />
            </form>
          </div>
          <div><p>High&nbsp;Temperature </p></div>
          <div><p>Low&nbsp;Temperature </p></div>
          <div><p>Humidity </p></div>
          <div><p>Sunrise </p></div>
          <div><p>Sunset </p></div>
        </div>
        {forecast.map(renderForecastCard)}
      </div>
    </div>
  );
};

export default App;
