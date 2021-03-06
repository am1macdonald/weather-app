// api call for all

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// geocode API

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

import "regenerator-runtime/runtime";

const key = "1c183ae74954e6337fce73ef79bf0349";

const getUserInput = () => {
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const country = document.getElementById("country").value;

  const inputString = `${city}, ${state}, ${country}`;
  return inputString;
};

const fetchCityData = async (inputString) => {
  try {
    const result = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${inputString}&limit=1&appid=${key}`, { mode: 'cors' });
    if (!result.ok) {
      throw new Error(`HTTP error: ${result.status}`);
    }
    const data = await result.json();
    if (data.length === 0) {
      throw new Error("fetchCityData: No matching city found");
    }

    // console.log('fetchCityData: ', data);

    return data[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const fetchCityName = async (lat, lon) => {
  try {
    const result = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${key}`, { mode: 'cors' });
    if (!result.ok) {
      throw new Error(`HTTP error: ${result.status}`);
    }
    const data = await result.json();
    console.log("fetchCityName", data);

    return data[0];
  } catch (error) {
    return error;
  }
};

const fetchWeather = async (lat, lon, units = "metric") => {
  const result = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`,
    { mode: "cors" }
  );

  const data = await result.json();

  return data;
};

export { fetchCityData, fetchCityName, fetchWeather, getUserInput };
