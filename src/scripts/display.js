import format from 'date-fns/format';

const displayManager = (() => {
  let units = 'metric';

  const toggleUnits = () => {
    units = units === 'metric' ? 'standard' : 'metric';
    console.log(units);
  };

  let state = '';

  const setState = () => {
    state = '';
  };

  const getState = () => state;

  return {
    toggleUnits,
    setState,
    getState,
  };
})();

const content = document.querySelector('main');

const displayCity = (str) => {
  const container = document.createElement('div');
  container.id = 'city-container';

  container.innerHTML = `
  <h2>${str}</h2>
  `;

  content.prepend(container);
};

const displayDateToday = (parent) => {
  const dateToday = format(Date.now(), 'PPP');
  const container = document.createElement('div');
  container.id = 'date-container';
  const date = document.createElement('h3');
  date.innerHTML = `${dateToday}`;

  container.appendChild(date);
  parent.appendChild(container);
};

const userInput = () => {
  const container = document.createElement('div');
  container.id = 'search-window';
  container.classList.add('content-container');
  container.innerHTML = `

  <h3>Find Your City</h3>
  <form id="form" action="javascript:void(0);">
    <div>
      <label for="city">city</label>
      <input id="city" type="text" required 
      pattern="^[A-z]+$"/>
    </div>
    <div>
      <label for="state">state</label>
      <input id="state" type="text" required 
      pattern="^[A-z]+$"/>
    </div>
    <div>
      <label for="counrty">country</label>
      <input id="country" type="text" required 
      pattern="^[A-z]+$"/>
    </div>
    <div id="button-div">
      <button id="submit-button" type="submit" form="form">search</button>
    </div>
  </form>
  `;

  content.appendChild(container);
};

const todaysWeather = (obj, temp = 'c', speed = 'Km/h') => {
  // eslint-disable-next-line new-cap
  console.log(obj);
  const container = document.createElement('div');
  container.classList.add('content-container');
  displayDateToday(container);
  container.insertAdjacentHTML('beforeend', `
  <div id="icon-temp">
    <div id="icon-div"><img src="http://openweathermap.org/img/wn/${obj.icon}@2x.png" alt="icon" />${obj.weather.toLowerCase()}</div>
    <div>${obj.temp}°${temp}</div>
  </div>
  <div id="details">
    <div>
      <span>Temp:</span>
      <span> ${obj.temp}°${temp}</span>
    </div>
    <div>
      <span>Feels Like:</span>
      <span>${obj.feels_like}°${temp}</span>
    </div>
    <div>
      <span>Humidity:</span>
      <span>${obj.humidity}%</span>
    </div>
    <div>
      <span>Wind:</span>
      <span>${Number.isNaN(obj.wind) ? '0' : obj.wind}${speed}</span>
    </div>
    <div>
      <span>Gusts:</span>
      <span>${Number.isNaN(obj.wind_gust) ? '0' : obj.wind_gust}${speed}</span>
    </div>
  </div>

  `);
  const buttonDiv = document.createElement('div');
  buttonDiv.id = 'button-div';
  const button = document.createElement('button');
  button.innerHTML = '24-hour';
  button.addEventListener('click', () => {
    console.log('clicked!!');
  });
  buttonDiv.appendChild(button);
  container.appendChild(buttonDiv);
  content.appendChild(container);
};

const barMenu = () => {
  const container = document.createElement('div');
  container.id = 'bar-menu';

  // buttons to change the units

  const metricBtn = document.createElement('button');
  metricBtn.innerHTML = 'metric';
  metricBtn.disabled = true;

  const standardBtn = document.createElement('button');
  standardBtn.innerHTML = 'standard';

  metricBtn.addEventListener('click', (e) => {
    displayManager.toggleUnits();
    e.target.disabled = true;
    standardBtn.disabled = false;
  });

  standardBtn.addEventListener('click', (e) => {
    displayManager.toggleUnits();
    e.target.disabled = true;
    metricBtn.disabled = false;
  });

  container.appendChild(metricBtn);

  container.appendChild(standardBtn);
  content.appendChild(container);
};
export {
  displayCity,
  userInput,
  todaysWeather,
  barMenu,
};
