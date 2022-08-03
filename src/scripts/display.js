import format from "date-fns/format";
import SimpleBar from "simplebar";
import { unitMan, weatherMan } from "./dataHandler";

const content = document.querySelector("main");
const body = document.querySelector("body");

const displayCity = (str) => {
  const container = document.createElement("div");
  container.id = "city-container";

  const truncate = str.length > 25 ? `${str.substr(0, 25 - 1)}...` : str;

  container.innerHTML = `
  <h2>${truncate}</h2>
  `;

  content.prepend(container);
};

const displayDateToday = (parent) => {
  const dateToday = format(Date.now(), "PPP");
  const container = document.createElement("div");
  container.id = "date-container";
  const date = document.createElement("h3");
  date.innerHTML = `${dateToday}`;

  container.appendChild(date);
  parent.appendChild(container);
};

const userInput = () => {
  const regex = "[a-zA-Z.'-]+( [a-zA-Z.'-]+)*";
  const container = document.createElement("div");
  container.id = "search-window";
  container.id = "content-container";
  container.insertAdjacentHTML("beforeend", `

  <h3>Find Your City</h3>
  <span id="incorrect-input">Try Again!</span>
  <form id="form" action="javascript:void(0);">
    <div>
      <label for="city">city</label>
      <input id="city" type="text" required 
      pattern="${regex}"/>
    </div>
    <div>
      <label for="state">state</label>
      <input id="state" type="text"  
      pattern="${regex}"/>
    </div>
    <div>
      <label for="counrty">country</label>
      <input id="country" type="text"  
      pattern="${regex}"/>
    </div>
    <div id="button-div">
      <button id="submit-button" type="submit" form="form">search</button>
      <button id="cancel-button" type="cancel" form="form">cancel</button>

    </div>
    
  </form>
  `);

  content.appendChild(container);
};

const pageButtons = (parent, opt) => {
  const buttonDiv = document.createElement("div");
  buttonDiv.id = "button-div";
  const hourlyButton = document.createElement("button");
  hourlyButton.innerHTML = "24-hour";

  const weekButton = document.createElement("button");
  weekButton.innerHTML = "7-day";

  const todayButton = document.createElement("button");
  todayButton.innerHTML = "today";

  hourlyButton.addEventListener("click", () => {
    parent.remove();
    hourly();
    displayManager.update(hourly);
  });

  weekButton.addEventListener("click", () => {
    parent.remove();
    sevenDay();
    displayManager.update(sevenDay);
  });

  todayButton.addEventListener("click", () => {
    parent.remove();
    renderToday();
    displayManager.update(renderToday);
  });

  switch (typeof opt === "number") {
    case opt === 1:
      buttonDiv.appendChild(weekButton);
      buttonDiv.appendChild(hourlyButton);
      break;
    case opt === 2:
      buttonDiv.appendChild(weekButton);
      buttonDiv.appendChild(todayButton);
      break;
    case opt === 3:
      buttonDiv.appendChild(todayButton);
      buttonDiv.appendChild(hourlyButton);
      break;
    default:
      buttonDiv.appendChild(todayButton);
  }
  parent.appendChild(buttonDiv);
};

const sevenDay = () => {
  const obj = weatherMan.week();
  const units = unitMan.getUnitNames();

  const container = document.createElement("div");
  container.id = "content-container";

  const weekContainer = document.createElement("div");
  weekContainer.id = "list-container";

  const list = document.createElement("ul");

  const scroll = new SimpleBar(list);

  const target = scroll.getContentElement();

  obj.forEach((day) => {
    const daysWeather = day.weather;
    const dayDiv = document.createElement("li");
    dayDiv.classList.add("day-div");
    dayDiv.insertAdjacentHTML(
      "beforeend",
      `
      <div>
        <span class="li-title">${day.day}</span>
      </div>
      <div>
        <span>Weather:</span>
        <span> ${daysWeather.weather}</span>
      </div>
      <div>
        <span>High:</span>
        <span> ${daysWeather.temp.high}°${units.temp}</span>
      </div>
      <div>
        <span>Low:</span>
        <span>${daysWeather.temp.low}°${units.temp}</span>
      </div>
      <div>
        <span>Humidity:</span>
        <span>${daysWeather.humidity}%</span>
      </div>
      <div>
        <span>pop:</span>
        <span>${Math.round(daysWeather.pop * 100)}%</span>
      </div>
      <div>
        <span>Wind:</span>
        <span>${Number.isNaN(daysWeather.wind) ? "0" : daysWeather.wind} ${units.speed}</span>
      </div>
      <div>
        <span>Gusts:</span>
        <span>${Number.isNaN(daysWeather.wind_gust) ? "0" : daysWeather.wind_gust} ${
        units.speed
      }</span>
      </div>
    `
    );

    target.appendChild(dayDiv);
  });

  weekContainer.appendChild(list);
  container.appendChild(weekContainer);
  pageButtons(container, 3);
  content.appendChild(container);
};

const hourly = () => {
  const hours = weatherMan.hourly();
  const units = unitMan.getUnitNames();

  const container = document.createElement("div");
  container.id = "content-container";

  const hoursContainer = document.createElement("div");
  hoursContainer.id = "list-container";

  const list = document.createElement("ul");

  const scroll = new SimpleBar(list, { autoHide: false });

  const target = scroll.getContentElement();
  hours.forEach((hour) => {
    const obj = hour.weather;
    const dayDiv = document.createElement("li");
    dayDiv.classList.add("day-div");
    dayDiv.insertAdjacentHTML(
      "beforeend",
      `
      <div>
        <span class="li-title">${hour.time}</span>
      </div>
      <div>
        <span>Weather:</span>
        <span> ${obj.weather}</span>
      </div>
      <div>
        <span>Temp:</span>
        <span> ${obj.temp}°${units.temp}</span>
      </div>
      <div>
        <span>Feels Like:</span>
        <span>${obj.feels_like}°${units.temp}</span>
      </div>
      <div>
        <span>Humidity:</span>
        <span>${obj.humidity}%</span>
      </div>
      <div>
        <span>pop:</span>
        <span>${Math.round(obj.pop * 100)}%</span>
      </div>
      <div>
        <span>Wind:</span>
        <span>${Number.isNaN(obj.wind) ? "0" : obj.wind} ${units.speed}</span>
      </div>
      <div>
        <span>Gusts:</span>
        <span>${Number.isNaN(obj.wind_gust) ? "0" : obj.wind_gust} ${
        units.speed
      }</span>
      </div>
    `
    );

    target.appendChild(dayDiv);
  });

  hoursContainer.appendChild(list);
  container.appendChild(hoursContainer);
  pageButtons(container, 2);
  content.appendChild(container);
};
const renderToday = () => {
  const obj = weatherMan.today();
  const units = unitMan.getUnitNames();
  // eslint-disable-next-line new-cap
  const container = document.createElement("div");
  container.id = "content-container";
  displayDateToday(container);
  container.insertAdjacentHTML(
    "beforeend",
    `
  <div id="icon-temp">
    <div id="icon-div"><img src="http://openweathermap.org/img/wn/${
      obj.icon
    }@2x.png" alt="icon" />${obj.weather.toLowerCase()}</div>
    <div>${obj.temp}°${units.temp}</div>
  </div>
  <div id="details">
    <div>
      <span>Temp:</span>
      <span> ${obj.temp}°${units.temp}</span>
    </div>
    <div>
      <span>Feels Like:</span>
      <span>${obj.feels_like}°${units.temp}</span>
    </div>
    <div>
      <span>Humidity:</span>
      <span>${obj.humidity}%</span>
    </div>
    <div>
      <span>Wind:</span>
      <span>${Number.isNaN(obj.wind) ? "0" : obj.wind} ${units.speed}</span>
    </div>
    <div>
      <span>Gusts:</span>
      <span>${Number.isNaN(obj.wind_gust) ? "0" : obj.wind_gust} ${
      units.speed
    }</span>
    </div>
  </div>

  `
  );

  pageButtons(container, 1);
  content.appendChild(container);
};

const barMenu = () => {
  const container = document.createElement("div");
  container.id = "bar-menu";

  // buttons to change the units

  const unitButton = document.createElement("button");
  unitButton.id = "unit-button";
  unitButton.innerHTML = "units";

  const newSearch = document.createElement("button");
  newSearch.id = "search-button";
  newSearch.innerHTML = "search";

  container.appendChild(unitButton);
  container.appendChild(newSearch);
  body.appendChild(container);
};

const displayManager = (() => {
  let state = renderToday;

  const update = (func) => {
    state = func;
  };
  // removes the content from the screen and returns whatever function
  // displayed data last
  const refresh = () => {
    document.getElementById("content-container").remove();
    state();
  };
  const newSearchWindow = () => {
    content.innerHTML = "";
    userInput();
  };
  return {
    update,
    refresh,
    newSearchWindow
  };
})();

export {
 displayCity, userInput, renderToday, barMenu, displayManager
};
