"use strict";

const API = "e1212ac49e0ba625772b0124b4b3ef81"; // Ensure to replace with your actual API key

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Display the current day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Display the current date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;

// Add event listener to the button
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // Check for an empty value in the input field
  if (inputEl.value !== "") {
    const search = inputEl.value.trim();
    inputEl.value = "";
    findLocation(search);
  } else {
    console.log("Please Enter City or Country Name");
  }
});

async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";

  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    console.log(result);

    if (result.cod !== "404") {
      // Display image content
      const imageContent = displayImageContent(result);

      // Display right side content
      const rightSide = rightSideContent(result);

      // Forecast function
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", imageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
      }, 1500);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Display image content and temperature
function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${
    data.weather[0].icon
  }@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 273.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// Display the right side content
function rightSideContent(result) {
  return `<div class="content">
          <p class="title">NAME</p>
          <span class="value">${result.name}</span>
        </div>
        <div class="content">
          <p class="title">TEMP</p>
          <span class="value">${Math.round(result.main.temp - 273.15)}°C</span>
        </div>
        <div class="content">
          <p class="title">HUMIDITY</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
          <p class="title">WIND SPEED</p>
          <span class="value">${result.wind.speed} Km/h</span>
        </div>`;
}

// Fetch and display the forecast
async function displayForeCast(lat, lon) {
  try {
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
    const data = await fetch(forecastAPI);
    const result = await data.json();

    // Filter and display unique forecast days
    const uniqueForecastDays = [];
    const daysForecast = result.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForecastDays.includes(forecastDate)) {
        return uniqueForecastDays.push(forecastDate);
      }
    });

    daysForecast.forEach((content, index) => {
      if (index <= 3) {
        listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
      }
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Forecast HTML element data
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const shortDayName = dayName.substring(0, 3);

  return `<li>
  <img src="https://openweathermap.org/img/wn/${
    frContent.weather[0].icon
  }@2x.png" alt="" />
  <span>${shortDayName}</span>
  <span class="day_temp">${Math.round(frContent.main.temp - 273.15)}°C</span>
</li>`;
}
