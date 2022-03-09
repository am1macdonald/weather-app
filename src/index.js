import './stylesheets/reset.css';
import './stylesheets/style.sass';
import {
  barMenu,
  clearAndRenderWeather,
  displayCity,
  displayManager,
  renderToday,
  userInput,
} from './scripts/display';
import { fetchCityName, fetchCityData, fetchWeather } from './scripts/apiCalls';
import {
  handleFormData,
  handlePosition, locationMan, unitMan, weatherMan,
} from './scripts/dataHandler';

const formHandler = () => {
  const formContainer = document.getElementById('content-container')
  const form = document.querySelector('form');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const country = document.getElementById('country');
  const submitBtn = document.getElementById('submit-button');

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (form.checkValidity() === true) {
      const str = `${city.value}, ${state.value}, ${country.value}`;
      await handleFormData(str);
      displayCity(locationMan.getName());
      renderToday(weatherMan.today(), unitMan.getUnitNames())
      console.log('awaited')
      formContainer.remove()
    }
  });
};

const locateUser = () => {
  const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 36000000,
  };

  const success = async (position) => {
    // dataHandler.handlePosition(position);
    const awaited = await handlePosition(position.coords);
    displayCity(locationMan.getName());
    renderToday(weatherMan.today(), unitMan.getUnitNames());
    console.log(awaited);
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

  metricBtn.addEventListener('click', async (e) => {
    unitMan.toggle();
    await weatherMan.setFromCityData();
    displayManager.refresh()(weatherMan.today(), unitMan.getUnitNames());
    e.target.disabled = true;
    imperialBtn.disabled = false;
  });

  imperialBtn.addEventListener('click', async (e) => {
    unitMan.toggle();
    await weatherMan.setFromCityData();
    displayManager.refresh()(weatherMan.today(), unitMan.getUnitNames());
    e.target.disabled = true;
    metricBtn.disabled = false;
  });
})();
