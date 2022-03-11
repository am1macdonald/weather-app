/* eslint-disable no-prototype-builtins */
import { add, format, roundToNearestMinutes } from 'date-fns';
import { fetchCityData, fetchCityName, fetchWeather } from './apiCalls';

const unitMan = (() => {
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

  const toggle = () => {
    units = units === 'metric' ? 'imperial' : 'metric';
    console.log(unitNames[units]);
    // refac => fetchAndRelease();
  };
  const getUnitNames = () => unitNames[units];
  const getUnits = () => units;
  return {
    toggle,
    getUnits,
    getUnitNames,
  };
})();

const locationMan = (() => {
  const coords = {
    lat: '',
    lon: '',
  };
  let locationName = '';

  const setLocation = (obj) => {
    const type = typeof obj;
    if (type !== 'object') {
      console.log(type);
      return;
    }
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty('name')) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty('state')) {
        locationName = `${obj.name}, ${obj.state}`;
      } else {
        locationName = `${obj.name}`;
      }
    }

    if (obj.hasOwnProperty('lat') && obj.hasOwnProperty('lon')) {
      coords.lat = obj.lat;
      coords.lon = obj.lon;
    } else if (obj.hasOwnProperty('latitude') && obj.hasOwnProperty('longitude')) {
      coords.lat = obj.lat;
      coords.lon = obj.lon;
    }
    console.log('location set to: ', locationName, ' ', coords);
  };

  const getName = () => locationName;

  const getCoords = () => coords;

  return {
    setLocation,
    getName,
    getCoords,
  };
})();

const weatherMan = (() => {
  let weatherObj = {};

  const summarize = (obj) => {
    const summary = {
      weather: obj.weather[0].main,
      icon: obj.weather[0].icon,
      temp: Math.round(obj.temp),
      feels_like: Math.round(obj.feels_like),
      humidity: obj.humidity,
      wind: Math.round(obj.wind_speed),
      wind_gust: Math.round(obj.wind_gust),
      pop: obj.pop,
    };
    if (typeof obj.temp === 'object') {
      summary.temp = {
        high: obj.temp.max,
        low: obj.temp.min,
      };
      delete summary.feels_like;
    }
    return summary;
  };

  const week = () => {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      days.push({
        day: format(add(new Date(), { days: i }), 'iiii'),
        weather: summarize(weatherObj.daily[i]),
      });
    }
    console.log(days);
    return days;
  };

  const hourly = () => {
    const hours = [];
    for (let i = 0; i < 24; i += 1) {
      hours.push({
        time: format(roundToNearestMinutes(add(new Date(), { hours: i }), { nearestTo: 30 }), 'p'),
        weather: summarize(weatherObj.hourly[i]),
      });
    }
    console.log(hours);
    return hours;
  };

  const today = () => {
    const current = weatherObj.current;
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

  const setToObj = (obj) => {
    weatherObj = obj;
  };

  const setFromCityData = async () => {
    const units = unitMan.getUnits();
    const coords = locationMan.getCoords();
    weatherObj = await fetchWeather(coords.lat, coords.lon, units);
    console.log('weatherObj: ', weatherObj);
    console.log('today: ', today());
    hourly();
    week();
  };
  const getWeather = () => weatherObj;

  return {
    setToObj,
    setFromCityData,
    getWeather,
    today,
    week,
    hourly,
  };
})();

const handleFormData = async (str) => {
  try {
    const cityData = await fetchCityData(str);

    if (cityData === undefined) {
      throw new Error('cityData is undefined');
    }
    await locationMan.setLocation(cityData);
    await weatherMan.setFromCityData();
    weatherMan.getWeather();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const handlePosition = async (coords) => {
  try {
    const val = await fetchCityName(coords.latitude, coords.longitude);

    if (val === undefined) {
      throw new Error('no name found');
    }
    locationMan.setLocation(val);
    console.log('new sheet', val);
    await weatherMan.setFromCityData();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export {
  handlePosition,
  handleFormData,
  unitMan,
  locationMan,
  weatherMan,
};
