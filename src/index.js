import './stylesheets/reset.css';
import './stylesheets/style.sass';
import {
  fetchCoordinates, fetchWeather, getUserInput, location,
} from './scripts/dataHandler';

const getWeather = async () => {
  const place = getUserInput();
  console.log(place);

  const geoCoords = await location();

  console.log(geoCoords);
  const coords = await fetchCoordinates(place);

  const lat = String(coords.lat);
  const lon = String(coords.lon);

  console.log(lat, lon);
  console.log(fetchWeather(lat, lon));
};

getWeather();
