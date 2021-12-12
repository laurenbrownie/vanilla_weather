function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let timeOfDay = `a.m.`;
  if (hours > 12) {
    hours = hours - 12;
    timeOfDay = "p.m.";
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  let day = days[date.getDay()];

  return `${day} at ${hours}:${minutes} ${timeOfDay}`;
}
function formatDay(timeStamp) {
  let date = new Date(timeStamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class = "row">`;
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      // append a new column
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
          <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
          <img
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="36"
          />
          <div class="forecast-temperature">
            <span class="forecast-max">${Math.round(
              forecastDay.temp.max
            )}°</span> |
            <span class="forecast-min">${Math.round(
              forecastDay.temp.min
            )}°</span>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "ae55b2734c25897ad68408d12d0a5fb9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemp(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let conditionsElement = document.querySelector("#conditions");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;

  fahrenheitTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name.toLowerCase();
  conditionsElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "ae55b2734c25897ad68408d12d0a5fb9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
  console.log(cityInputElement.value);
}

function displayCelsius(event) {
  event.preventDefault();
  let celsiusTemp = (fahrenheitTemperature - 32) * (5 / 9);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  // change classes
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

function displayFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  // change classes
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let fahrenheitTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheit);

// default on load
search("New York");
