import "./stylesheets/reset.css";
import "./stylesheets/style.sass";
import "simplebar/dist/simplebar.css";
import {
  barMenu,
  displayCity,
  displayManager,
  renderToday,
  userInput
} from "./scripts/display";
import {
  handleFormData,
  handlePosition,
  locationMan,
  unitMan,
  weatherMan
} from "./scripts/dataHandler";

(() => {
  barMenu();

  const unitButton = document.getElementById("unit-button");

  const searchButton = document.getElementById("search-button");

  unitButton.addEventListener("click", async () => {
    unitMan.toggle();
    await weatherMan.setFromCityData();
    displayManager.refresh();
  });

  searchButton.addEventListener("click", async () => {
    displayManager.newSearchWindow();
    formHandler();
    unitButton.disabled = true;
    searchButton.disabled = true;
  });
})();

const formHandler = () => {
  const formContainer = document.getElementById("content-container");
  const form = document.querySelector("form");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const country = document.getElementById("country");
  const submitBtn = document.getElementById("submit-button");

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (form.checkValidity() === true) {
      const str = `${city.value}, ${state.value}, ${country.value}`;

      handleFormData(str)
        .then((result) => {
          if (!result) {
            throw new Error("bad input");
          }
          formContainer.remove();
          displayCity(locationMan.getName());
          renderToday();
          document.getElementById("unit-button").disabled = false;
          document.getElementById("search-button").disabled = false;
        })
        .catch((error) => {
          console.error(error);
          document.getElementById("incorrect-input").style.display = "block";
        });
    } else {
      document.getElementById("incorrect-input").style.display = "block";
    }
  });
};

const locateUser = () => {
  const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 36000000
  };

  const success = async (position) => {
    handlePosition(position.coords)
      .then((res) => {
        if (!res) {
          throw new Error("no response");
        }
        displayCity(locationMan.getName());
        renderToday();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const error = (err) => {
    if (err.code === 1) {
      console.log("denied location access");
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
