import './stylesheets/reset.css';
import './stylesheets/style.sass';
import {
  barMenu, displayCity, todaysWeather, userInput,
} from './scripts/display';
import { fetchCity, fetchWeather } from './scripts/apiCalls';

const dataHandler = (() => {
  let weather = {};
  let location = '';
  let units = 'metric';

  const toggleUnits = () => {
    units = units === 'metric' ? 'standard' : 'metric';
  };

  const getWeatherObj = () => weather;

  const todaysSummary = () => {
    const current = weather.current;
    const summary = {
      temp: Math.round(current.temp),
      feels_like: Math.round(current.feels_like),
      humidity: current.humidity,
      wind: Math.round(current.wind_speed),
      wind_gust: Math.round(current.wind_gust),

    };
    return summary;
  };

  const setWeather = (obj) => {
    weather = obj;
    console.log(weather);
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

  return {
    setWeather,
    setLocation,
    getWeatherObj,
    getLocation,
    todaysSummary,
  };
})();

const locateUser = () => {
  const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 30000,
  };

  const success = (position) => {
    const { latitude, longitude } = position.coords;

    fetchCity(latitude, longitude)
      .then((val) => {
        dataHandler.setLocation(val);
        displayCity(dataHandler.getLocation());
      });
    fetchWeather(latitude, longitude)
      .then((val) => {
        dataHandler.setWeather(val);
        todaysWeather(dataHandler.todaysSummary());
      });
  };

  const error = (err) => {
    if (err.code === 1) {
      console.log('denied location access');
    } else {
      console.log(err.message);
    }
    userInput();
    return err;
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
};

locateUser();

barMenu();
