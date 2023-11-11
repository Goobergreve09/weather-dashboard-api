//weather API base funcntionality
document.addEventListener("DOMContentLoaded", function () {
  const theDate = document.getElementById("currentDate");
  theDate.textContent = dayjs().format("MMM D, YYYY");

  const searchButton = document.getElementById("btn");
  const locationInput = document.getElementById("location");
  const currentCity = document.getElementById("cityName");
  const currentHumidity = document.getElementById("currentHumidity");
  const currentTemperature = document.getElementById("currentTemperature");
  const feelsLike = document.getElementById("feelsLike");
  const currentWind = document.getElementById("currentWind");
  const sunsetTime = document.getElementById("sunsetTime");
  const sunriseTime = document.getElementById("sunriseTime");
  const iconContainer = document.getElementById("iconContainer");
  const descriptionCurrent = document.getElementById("descriptionCurrent");
  const forecastTitle = document.getElementById("forecastcityName");

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    var apiKey = "a1c24f9ef9bb705299a22d8524be3474";

    const location = locationInput.value;

    // Make the API request to OpenWeatherMap's Geocoding API
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${location}'&limit=50&appid=${apiKey}`;

    fetch(geocodingUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        console.log(longitude);

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
        console.log(weatherURL);

        // Continue with the API request for weather data
        return fetch(weatherURL);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (weatherData) {
        console.log(weatherData);
        currentCity.textContent = "Current Weather in " + weatherData.name;
        const forecastTitle = document.getElementById("forecastcityName");
        forecastTitle.textContent =
          "5 -Day Weather Forecast in " + weatherData.name;

        currentHumidity.textContent =
          "Humidity: " + weatherData.main.humidity + "%";

        let tempInt = Math.round(weatherData.main.temp);
        currentTemperature.textContent = "Temperature: " + tempInt + "℉";

        let feelslikeInt = Math.round(weatherData.main.feels_like);
        feelsLike.textContent = "but feels like " + feelslikeInt + "℉";

        let currentwindInt = Math.round(weatherData.wind.speed);
        currentWind.textContent = "Wind Speed: " + currentwindInt + " mph";

        const timestamp = [weatherData.sys.sunset, weatherData.sys.sunrise];
        const date = new Date(timestamp[0] * 1000); // Convert from seconds to milliseconds

        const sunsettimeClock = dayjs(date).format("h:mm:ss A");
        sunsetTime.textContent = "Time of Sunset: " + sunsettimeClock;

        const date2 = new Date(timestamp[1] * 1000);
        const sunrisetimeClock = dayjs(date2).format("h:mm:ss A");
        sunriseTime.textContent = "Time of Sunrise: " + sunrisetimeClock;

        const imgCode = weatherData.weather[0].icon;
        const icon = document.createElement("img");
        icon.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${imgCode}@2x.png`
        );
        icon.style.position = "absolute";
        icon.style.top = "45px";
        icon.style.left = "50%";
        icon.style.width = "250px";

        iconContainer.appendChild(icon);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });

    getforecastData(location, apiKey);
    ifskiesShow(forecastIcon, pEl, descriptionCurrent);
  });

  function getforecastData(location, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;

    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        const dayOne = data.list[4];
        const dayTwo = data.list[12];
        const dayThree = data.list[20];
        const dayFour = data.list[28];
        const dayFive = data.list[36];

        let fiveDays = [dayOne, dayTwo, dayThree, dayFour, dayFive]; // array of json indexes chosen

        console.log(fiveDays);

        for (let i = 0; i < fiveDays.length; i++) {
          if (fiveDays[i] && fiveDays[i].dt) {
            const dtValue = fiveDays[i].dt * 1000;
            const forecastDates = dayjs(dtValue).format("MM/DD");
            console.log(forecastDates);
            const forecastTemp = Math.round(
              1.8 * (fiveDays[i].main.temp - 273) + 32
            );
            console.log(forecastTemp);
            const forecastfeelsLike = Math.round(
              1.8 * (fiveDays[i].main.feels_like - 273) + 32
            );
            console.log(forecastfeelsLike);
            const forecastHumid = fiveDays[i].main.humidity;
            console.log(forecastHumid);
            const forecastwindSpeed = fiveDays[i].wind.speed;
            console.log(forecastwindSpeed);
            const forecastIcon = fiveDays[i].weather[0].icon;
            console.log(forecastIcon);

            createEl(
              forecastDates,
              forecastTemp,
              forecastfeelsLike,
              forecastHumid,
              forecastwindSpeed,
              [i],
              forecastIcon,
              descriptionCurrent
            );
          } else {
            console.log(`Invalid data for day ${i}`);
          }
        }
      });
  }
});

console.log("greg");

function createEl( // function creating elements for 5 day forecast
  date,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  index,
  forecastIcon,
  descriptionCurrent
) {
  const divEl = document.createElement("div");
  divEl.className = "forecastContainer";
  const h3El = document.createElement("h3");
  const imgEl = document.createElement("img");
  const pEl = document.createElement("p");

  const ulEl = document.createElement("ul");

  const variables = [ // used for list items of the weather card
    temperature + " F°",
    feelsLike + " F°",
    humidity + "%",
    windSpeed + " mph",
    forecastIcon,
  ];
  const dateVariable = [date];
  const titles = ["Temperature", "Feels Like", "Humidity", "Wind Speed"];

  h3El.textContent = `${dateVariable}`;

  for (let i = 0; i <= 3; i++) { // creates 4 total li element for each index card
    const liEl = document.createElement("li");
    liEl.textContent = `${titles[i]}: ${variables[i]}`;
    liEl.style.color = "white";
    liEl.style.fontFamily = "Titillium Web, sans-serif";
    liEl.style.marginBottom = "10px";
    ulEl.appendChild(liEl);
  }

  imgEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`
  );
  imgEl.style.position = "absolute";
  imgEl.style.top = "5px";
  imgEl.style.left = "10%";
  imgEl.style.width = "50px";

  divEl.appendChild(pEl);
  divEl.appendChild(h3El);
  divEl.appendChild(imgEl);
  divEl.appendChild(ulEl);

  document.body.appendChild(divEl);
  console.log("George");

  cardAttributes(divEl, h3El, ulEl, pEl, index);
  ifskiesShow(forecastIcon, pEl, descriptionCurrent);
}

function cardAttributes(divEl, h3El, ulEl, pEl, index) { // creates attributes for cards and card content
  divEl.style.backgroundColor = "#2980B9";
  divEl.style.width = "225px";
  divEl.style.height = "300px";
  divEl.style.borderRadius = "60px";
  divEl.style.position = "absolute";
  divEl.style.left = `${400 + index * 315}px`; // Adjust the spacing between cards
  divEl.style.top = "550px";
  divEl.style.boxShadow = "5px 10px 10px rgba(1, 0.5, 0.5, 0.5)";
  divEl.style.display = "flex";
  divEl.style.justifyContent = "center";

  h3El.style.color = "white";
  h3El.style.position = "absolute";
  h3El.style.top = "20px";
  h3El.style.fontFamily = "Titillium Web, sans-serif";

  ulEl.style.position = "absolute";
  ulEl.style.top = "65px";

  pEl.style.fontsize = "50px";
  pEl.style.position = "absolute";
  pEl.style.fontFamily = "Titillium Web, sans-serif";
  pEl.style.color = "white";
  pEl.style.fontStyle = "italic";
  pEl.style.top = "80%";
  pEl.style.textAlign = "center";
}

function ifskiesShow(forecastIcon, pEl, descriptionCurrent) { //creates a unique return for description of weather
  if (forecastIcon === "13d") {
    pEl.textContent = "// Expect sleet or snow";
    descriptionCurrent.textContent =
      "// Expect sleet or snow precipitation today.";
  } else if (forecastIcon === "11d") {
    pEl.textContent = "// Thunderstorm incoming!";
    descriptionCurrent.textContent = "// Thunderstorm warning! Enjoy the show!";
  } else if (forecastIcon === "09d") {
    pEl.textContent = "// Expect a drizzle";
    descriptionCurrent.textContent = "// There is a bit of a drizzle today.";
  } else if (forecastIcon === "10d") {
    pEl.textContent = "// Heavy Rain Showers";
    descriptionCurrent.textContent =
      "// Heavy Rain Showers Today - Bring an umbrella!";
  } else if (forecastIcon === "50d") {
    pEl.textContent = "Visibility low";
  } else if (forecastIcon === "01d" || forecastIcon === "01n") {
    pEl.textContent = "// Clear Skies";
    descriptionCurrent.textContent = "Clear Sky Today - Enjoy the Sun!";
  } else if (forecastIcon === "02d" || forecastIcon === "02n") {
    pEl.textContent = "// Expect a few clouds";
    descriptionCurrent.textContent = "// Expect a Few Clouds Today";
  } else if (forecastIcon === "03d" || forecastIcon === "03n") {
    pEl.textContent = "// Scattered Clouds";
    descriptionCurrent.textContent = "// Scattered Clouds in the Skies Today.";
  } else if (forecastIcon === "04d" || forecastIcon === "04n") {
    pEl.textContent = "// Overcast";
    descriptionCurrent.textContent = "// Very Cloudy and Overcast Today";
  }
}
