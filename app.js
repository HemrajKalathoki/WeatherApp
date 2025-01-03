const iconElement = document.querySelector(".weather-icon");
const locationIcon = document.querySelector(".location-icon");
const tempElement = document.querySelector(".temprature-value p");
const descElement = document.querySelector(".temprature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

let input = document.getElementById("search");

let city = "";
let latitude = 0.0;
let longitude = 0.0;

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) { // Listen for Enter key
        event.preventDefault();
        city = input.value;
        getSearchWeather(city);
    }
});

const weather = {
    temperature: {
        unit: "celsius",
    },
};

const KELVIN = 273; // Kelvin to Celsius conversion
const key = "7cba6d8799cb1146bd80fa2068ce658f";

// Check if the browser supports geolocation
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does not support geolocation.</p>";
}

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

locationIcon.addEventListener("click", function () {
    getWeather(latitude, longitude);
});

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// Fetch weather for a searched city
function getSearchWeather(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    fetch(api)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === 200) {
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
                displayWeather();
            } else {
                notificationElement.style.display = "block";
                notificationElement.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch((error) => console.error("Error fetching weather data:", error));
}

// Fetch weather for current location
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === 200) {
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
                displayWeather();
            } else {
                notificationElement.style.display = "block";
                notificationElement.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch((error) => console.error("Error fetching weather data:", error));
}

// Update the DOM with weather information
function displayWeather() {
    const iconUrl = `https://openweathermap.org/img/wn/${weather.iconId}@2x.png`;
    iconElement.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}
