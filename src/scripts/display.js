const content = document.querySelector('main');

const displayCity = (str) => {
  const container = document.createElement('div');

  container.innerHTML = `
  <h2>${str}</h2>
  `;

  content.prepend(container);
};

const userInput = () => {
  const container = document.createElement('div');
  container.id = 'search-window';
  container.innerHTML = `     
  <h2>Your City</h2>
  <form action="">
    <div><label for="city">city</label><input id="city" type="text" /></div>
    <div>
      <label for="state">state</label><input id="state" type="text" />
    </div>
    <div>
      <label for="counrty">country</label><input id="country" type="text" />
    </div>
    <div>
      <input type="submit" value="search" />
    </div>
  </form>
  `;

  content.appendChild(container);
};

const todaysWeather = (obj, cel = 'c') => {
  console.log(obj);
  const container = document.createElement('div');
  container.classList.add('content-container');
  container.innerHTML = `
  <div id="date">
    <h3>Date Today</h3>
  </div>
  <div id="icon-temp">
    <div><img src="#" alt="icon" /></div>
    <div>${obj.temp}°${cel}</div>
  </div>
  <div id="details">
    <div>
      <span>Temp:</span>
      <span> ${obj.temp}°${cel}</span>
    </div>
    <div>
      <span>Feels Like:</span>
      <span>${obj.feels_like}°${cel}</span>
    </div>
    <div>
      <span>Humidity:</span>
      <span>${obj.humidity}%</span>
    </div>
    <div>
      <span>Wind:</span>
      <span>${obj.wind}Km/h</span>
    </div>
    <div>
      <span>Gusts:</span>
      <span>${obj.wind_gust}</span>
    </div>
  </div>
  <div>
    <button>24-hour forecast</button>
  </div>
  `;

  content.appendChild(container);
};
export {
  displayCity,
  userInput,
  todaysWeather,
};
