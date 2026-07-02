
const apiKey = "f804ccdf11d82f2d51be2cb6cd4f8512"; 
// yaha apni OpenWeather API key paste karni hai

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

let currentCity = "Delhi";

// Current Weather
async function getCurrentWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod != 200) {
      alert("City not found!");
      return;
    }

    currentCity = city;

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    updateDateTime();
  } catch (error) {
    console.log(error);
    alert("Error fetching weather data");
  }
}

// 5 Day Forecast
async function getForecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    forecastContainer.innerHTML = "";

    // Har din ka ek forecast card dikhane ke liye
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.slice(0, 5).forEach(day => {
      const date = new Date(day.dt_txt);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const icon = day.weather[0].icon;
      const card = `
        <div class="forecast-card">
          <h3>${dayName}</h3>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
          <p><strong>${Math.round(day.main.temp)}°C</strong></p>
          <p>${day.weather[0].description}</p>
        </div>
      `;
      forecastContainer.innerHTML += card;
    });
  } catch (error) {
    console.log(error);
  }
}

function updateDateTime() {
  const now = new Date();
  dateTime.textContent = now.toLocaleString();
}

function loadWeather(city) {
  getCurrentWeather(city);
  getForecast(city);
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    loadWeather(city);
    cityInput.value = "";
  } else {
    alert("Please enter a city name");
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// default load
loadWeather(currentCity);

// auto update every 1 minute
setInterval(() => {
  loadWeather(currentCity);
}, 60000);

// live date & time update
setInterval(updateDateTime, 1000);