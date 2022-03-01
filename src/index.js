import './stylesheets/reset.css';
import './stylesheets/style.sass';
import { async } from 'regenerator-runtime';
import {
  barMenu,
  clearAndRenderWeather,
  displayCity,
  renderWeather,
  todaysWeather,
  userInput,
} from './scripts/display';
import { fetchCityName, fetchCityData, fetchWeather } from './scripts/apiCalls';

const dataHandler = (() => {
  let weather = {};
  let location = '';

  let units = 'metric';

  const toggleUnits = () => {
    units = units === 'metric' ? 'standard' : 'metric';
    console.log(units);
  };

  const todaysSummary = () => {
    const current = weather.current;
    const summary = {
      weather: current.weather[0].main,
      icon: current.weather[0].icon,
      temp: Math.round(current.temp),
      feels_like: Math.round(current.feels_like),
      humidity: current.humidity,
      wind: Math.round(current.wind_speed),
      wind_gust: Math.round(current.wind_gust),

    };
    return summary;
  };

  const hourly = () => {
    for (let i = 0; i < 1; i += 1) {
      console.log(todaysSummary());
    }
  };

  const setWeather = (obj) => {
    weather = obj;
  };

  const getLocation = () => location;

  const setLocation = (obj) => {
    const type = typeof obj;
    // eslint-disable-next-line no-prototype-builtins
    if (type === 'object' && obj.hasOwnProperty('name')) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty('state')) {
        location = `${obj.name}, ${obj.state}`;
      } else {
        location = `${obj.name}`;
      }
    } else {
      console.log(type);
    }
  };

  const fetchAndRelease = (lat, lon) => {
    fetchCityName(lat, lon)
      .then((val) => {
        setLocation(val);
        displayCity(getLocation());
      });
    fetchWeather(lat, lon)
      .then((val) => {
        setWeather(val);
        todaysWeather(todaysSummary());
        hourly();
      });
  };

  const handleFormData = async (cityData) => {
    const lat = cityData.lat;
    const lon = cityData.lon;
    setLocation(cityData);
    fetchWeather(lat, lon)
      .then((val) => {
        setWeather(val);
        clearAndRenderWeather(todaysSummary());
        hourly();
        displayCity(getLocation());
      });
  };

  const handlePosition = (position) => {
    const pos = position;
    const coords = pos.coords;
    const lat = coords.latitude;
    const lon = coords.longitude;
    console.log('lat & lon: ', lat, ' : ', lon);

    fetchAndRelease(lat, lon);
  };

  return {
    handleFormData,
    handlePosition,
    toggleUnits,
  };
})();

const formHandler = () => {
  const form = document.querySelector('form');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const country = document.getElementById('country');
  const submitBtn = document.getElementById('submit-button');

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (form.checkValidity() === true) {
      const str = `${city.value}, ${state.value}, ${country.value}`;
      const cityData = await fetchCityData(str);
      // console.log(cityData);
      if (cityData !== undefined) {
        dataHandler.handleFormData(cityData);
      }
    }
  });
};

const locateUser = () => {
  const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 36000000,
  };

  const success = (position) => {
    dataHandler.handlePosition(position);
  };

  const error = (err) => {
    if (err.code === 1) {
      console.log('denied location access');
    } else {
      console.log(err.message);
    }
    userInput();
    formHandler();
    return err;
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

locateUser();

(() => {
  barMenu();

  const metricBtn = document.getElementById('metric-button');

  const standardBtn = document.getElementById('standard-button');

  metricBtn.addEventListener('click', (e) => {
    dataHandler.toggleUnits();
    e.target.disabled = true;
    standardBtn.disabled = false;
  });

  standardBtn.addEventListener('click', (e) => {
    dataHandler.toggleUnits();
    e.target.disabled = true;
    metricBtn.disabled = false;
  });
})();
