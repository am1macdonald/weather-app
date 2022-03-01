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
  const pos = {
    lat: '',
    lon: '',
  };

  let units = 'metric';

  const unitNames = {
    imperial: {
      speed: 'mph',
      temp: 'f',
    },
    metric: {
      speed: 'm/s',
      temp: 'C',
    },
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

  const fetchAndRelease = async () => {
    fetchWeather(pos.lat, pos.lon, units)
      .then((val) => {
        setWeather(val);
        todaysWeather(todaysSummary(), unitNames[units]);
        hourly();
        clearAndRenderWeather(todaysSummary(), unitNames[units]);
        displayCity(getLocation());
      });
  };

  const handleFormData = async (cityData) => {
    pos.lat = cityData.lat;
    pos.lon = cityData.lon;
    setLocation(cityData);
    fetchAndRelease();
  };

  const handlePosition = async (position) => {
    pos.lat = position.coords.latitude;
    pos.lon = position.coords.longitude;
    fetchCityName(pos.lat, pos.lon)
      .then((val) => {
        setLocation(val);
      });
    fetchAndRelease();
  };

  const toggleUnits = () => {
    units = units === 'metric' ? 'imperial' : 'metric';
    console.log(unitNames[units]);
    fetchAndRelease();
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

  const imperialBtn = document.getElementById('imperial-button');

  metricBtn.addEventListener('click', (e) => {
    dataHandler.toggleUnits();
    e.target.disabled = true;
    imperialBtn.disabled = false;
  });

  imperialBtn.addEventListener('click', (e) => {
    dataHandler.toggleUnits();
    e.target.disabled = true;
    metricBtn.disabled = false;
  });
})();
