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
  const listContainer = document.getElementById("cityStorage");

  displaySavedLocations();

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    var apiKey = "a1c24f9ef9bb705299a22d8524be3474";

    const location = locationInput.value;

    if (!location || !isNaN(location)) {
      //!isNaN means if the input is numbers fire the alert
      alert("Invalid Location");
    } else {
      saveLocationToLocalStorage(location);
    }
    clearForecast();
    clearIcons();
    backgroundClear();

    allData(location, apiKey);
  });

  input.addEventListener("keyup", function(event) {
    // 13 is the keycode for the Enter key
    if (event.keyCode === 13) {
        // Trigger a click event on the button
        search.click();
    }
});

  function allData(location, apiKey) {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${location}'&limit=50&appid=${apiKey}`;

    fetch(geocodingUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var latitude = data[0].lat;
        var longitude = data[0].lon;

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

        return fetch(weatherURL);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (weatherData) {
        currentCity.textContent = "Current Weather in " + weatherData.name;
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
        const date = new Date(timestamp[0] * 1000);
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
  }

  function getforecastData(location, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;

    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const dayOne = data.list[4];
        const dayTwo = data.list[12];
        const dayThree = data.list[20];
        const dayFour = data.list[28];
        const dayFive = data.list[36];

        let fiveDays = [dayOne, dayTwo, dayThree, dayFour, dayFive];

        for (let i = 0; i < fiveDays.length; i++) {
          console.log(`Processing Day ${i + 1}`);
          if (fiveDays[i] && fiveDays[i].dt) {
            const dtValue = fiveDays[i].dt * 1000;
            const forecastDates = dayjs(dtValue).format("MM/DD");
            const forecastTemp = Math.round(
              1.8 * (fiveDays[i].main.temp - 273) + 32
            );
            const forecastfeelsLike = Math.round(
              1.8 * (fiveDays[i].main.feels_like - 273) + 32
            );
            const forecastHumid = fiveDays[i].main.humidity;
            const forecastwindSpeed = fiveDays[i].wind.speed;
            const forecastIcon = fiveDays[i].weather[0].icon;

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

  function createEl(
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
    divEl.style.backgroundSize = "cover"; 
    divEl.style.backgroundRepeat = "no-repeat";
    divEl.style.backgroundPosition = "center";


    const h3El = document.createElement("h3");
    const imgEl = document.createElement("img");
    const pEl = document.createElement("p");
    const ulEl = document.createElement("ul");

    const variables = [
      temperature + " F°",
      feelsLike + " F°",
      humidity + "%",
      windSpeed + " mph",
      forecastIcon,
    ];

    const dateVariable = [date];
    const titles = ["Temperature", "Feels Like", "Humidity", "Wind Speed"];

    h3El.textContent = `${dateVariable}`;

    for (let i = 0; i <= 3; i++) {
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

    cardAttributes(divEl, h3El, ulEl, pEl, index);
    ifskiesShow(forecastIcon, pEl, descriptionCurrent,divEl);
  }

  function cardAttributes(divEl, h3El, ulEl, pEl, index) {
    divEl.style.backgroundColor = "#2980B9";
    divEl.style.width = "225px";
    divEl.style.height = "300px";
    divEl.style.borderRadius = "60px";
    divEl.style.position = "absolute";
    divEl.style.left = `${400 + index * 315}px`;
    divEl.style.top = "550px";
    divEl.style.boxShadow = "5px 10px 10px rgba(1, 0.5, 0.5, 0.8)";
    divEl.style.display = "flex";
    divEl.style.justifyContent = "center";
    divEl.style.border = '3px solid white';

    h3El.style.color = "white";
    h3El.style.position = "absolute";
    h3El.style.top = "20px";
    h3El.style.fontFamily = "Titillium Web, sans-serif";
    h3El.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';; 
    h3El.style.width = '175px';
    h3El.style.padding = '5px';
    h3El.style.borderRadius = '10px';
    h3El.style.textAlign = 'center';

    ulEl.style.position = "absolute";
    ulEl.style.top = "75px";
    ulEl.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';; 
   ulEl.style.width = '175px';
    ulEl.style.padding = '5px';
    ulEl.style.borderRadius = '10px';

    pEl.style.fontsize = "50px";
    pEl.style.position = "absolute";
    pEl.style.fontFamily = "Titillium Web, sans-serif";
    pEl.style.color = "white";
    pEl.style.fontStyle = "italic";
    pEl.style.top = "80%";
    pEl.style.textAlign = "center";
    pEl.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';; 
    pEl.style.width = '175px';
    pEl.style.padding = '5px';
    pEl.style.borderRadius = '10px';
  }

  function ifskiesShow(forecastIcon, pEl, descriptionCurrent, divEl) {
    const heroBackground = document.getElementById('hero');
    heroBackground.style.backgroundSize = "cover"; 
    heroBackground.style.backgroundRepeat = "no-repeat";
    heroBackground.style.backgroundPosition = "center";
    if (forecastIcon === "13d" || forecastIcon === "13n") {
      pEl.textContent = "// Expect sleet or snow";
      descriptionCurrent.textContent =
        "// Expect sleet or snow precipitation today.";
        divEl.style.backgroundImage = 'url("assets/images/iceBckground.jpg")';
        heroBackground.style.backgroundImage = 'url("assets/images/iceBckground.jpg")';

    } else if (forecastIcon === "11d" || forecastIcon === "11n") {
      pEl.textContent = "// Thunderstorm incoming!";
      descriptionCurrent.textContent =
        "// Thunderstorm warning! Enjoy the show!";
        divEl.style.backgroundImage = 'url("assets/images/thunderStorm.jpg")';
        heroBackground.style.backgroundImage = 'url("assets/images/thunderStorm.jpg")';

    } else if (forecastIcon === "09d" || forecastIcon === "09n") {
      pEl.textContent = "// Expect a drizzle";
      descriptionCurrent.textContent = "// There is a bit of a drizzle today.";
      divEl.style.backgroundImage = 'url("assets/images/rainCity.jpg")';
      heroBackground.style.backgroundImage = 'url("assets/images/rainCity.jpg")';

    } else if (forecastIcon === "10d" || forecastIcon === "10n") {
      pEl.textContent = "// Heavy Rain Showers";
      descriptionCurrent.textContent =
        "// Heavy Rain Showers Today - Bring an umbrella!";
        divEl.style.backgroundImage = 'url("assets/images/rainCity.jpg")';
        heroBackground.style.backgroundImage = 'url("assets/images/rainCity.jpg")';

    } else if (forecastIcon === "50d" || forecastIcon === "50n") {
      pEl.textContent = "Visibility low";
      divEl.style.backgroundImage = 'url("assets/images/foggy.jpg")';
      heroBackground.style.backgroundImage = 'url("assets/images/foggy.jpg")';
      
    } else if (forecastIcon === "01d" || forecastIcon === "01n") {
      pEl.textContent = "// Clear Skies";
      descriptionCurrent.textContent = "Clear Sky Today - Enjoy the Sun!";
      divEl.style.backgroundImage = 'url("assets/images/skyClear.webp")';
      heroBackground.style.backgroundImage = 'url("assets/images/skyClear.webp")';

    } else if (forecastIcon === "02d" || forecastIcon === "02n") {
      pEl.textContent = "// Expect a few clouds";
      descriptionCurrent.textContent = "// Expect a Few Clouds Today";
      divEl.style.backgroundImage = 'url("assets/images/fewClouds.jpg")';
      heroBackground.style.backgroundImage = 'url("assets/images/fewClouds.jpg")';

    } else if (forecastIcon === "03d" || forecastIcon === "03n") {
      pEl.textContent = "// Scattered Clouds";
      descriptionCurrent.textContent =
        "// Scattered Clouds in the Skies Today.";
       divEl.style.backgroundImage = 'url("assets/images/Scattered.webp")';
       heroBackground.style.backgroundImage = 'url("assets/images/Scattered.webp")';

    } else if (forecastIcon === "04d" || forecastIcon === "04n") {
      pEl.textContent = "// Overcast";
      descriptionCurrent.textContent = "// Very Cloudy and Overcast Today";
      divEl.style.backgroundImage = 'url("assets/images/overCast.jpg")';
      heroBackground.style.backgroundImage = 'url("assets/images/overCast.jpg")';
     
    }
  }

  function clearForecast() {
    let forecastContainers = document.querySelectorAll(".forecastContainer");
    forecastContainers.forEach(function (container) {
      container.remove();
    });
  }

  function saveLocationToLocalStorage(location) {
    let savedLocations =
      JSON.parse(localStorage.getItem("savedLocations")) || [];

    // Add the new location to the beginning of the array
    savedLocations.unshift({ location });

    // Limit the array to 10 elements
    savedLocations = savedLocations.slice(0, 10);

    localStorage.setItem("savedLocations", JSON.stringify(savedLocations));

    // After saving, re-render the saved locations
    displaySavedLocations();
  }

  function displaySavedLocations() {
    let savedLocations =
      JSON.parse(localStorage.getItem("savedLocations")) || [];

    listContainer.innerHTML = "";

    const recentSearches = document.createElement("h3");
    recentSearches.textContent = "Recent Searches:";
    recentSearches.style.color = "white";
    recentSearches.style.position = "absolute";
    recentSearches.style.bottom = "750px";
    recentSearches.style.fontSize = "24px";
    recentSearches.style.fontFamily = "Poppins, sans-serif";
    recentSearches.style.left = "70px";

    const ulElement = document.createElement("ul");

    ulElement.style.marginRight = "25px";

    for (let i = 0; i < savedLocations.length; i++) {
      if (i >= 10) {
        break; // Stop the iteration once it hits 10 total
      }
      const liElement = document.createElement("li");
      liElement.textContent =
        typeof savedLocations[i].location === "string"
          ? savedLocations[i].location.toUpperCase()
          : "Invalid Location"; // handles error for invalid locations in local storage
      liElement.style.color = "white";
      liElement.style.backgroundColor = "#616A6B";
      liElement.style.marginBottom = "25px";
      liElement.style.padding = "5px";
      liElement.style.width = "275px";
      liElement.style.textAlign = "center";
      liElement.style.borderRadius = "10px";
      liElement.style.fontFamily = "Poppins, sans-serif";

      liElement.addEventListener("mouseover", function () {
        liElement.style.backgroundColor = "#3498db";
        liElement.style.fontWeight = "bold";
        liElement.style.cursor = "pointer";
      });

      liElement.addEventListener("mouseout", function () {
        liElement.style.backgroundColor = "#616A6B";
        liElement.style.fontWeight = "normal";
      });

      liElement.addEventListener("click", function () {
        handleLocationClick(savedLocations[i]);
        clearForecast();
        clearIcons();
        backgroundClear();
      });

      ulElement.appendChild(liElement);
    }

    listContainer.appendChild(ulElement);
    listContainer.appendChild(recentSearches);
  }

  function handleLocationClick(weatherDetails) {
    const location = weatherDetails.location;
    const apiKey = "a1c24f9ef9bb705299a22d8524be3474";

    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${location}'&limit=50&appid=${apiKey}`;

    fetch(geocodingUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var latitude = data[0].lat;
        var longitude = data[0].lon;

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

        return fetch(weatherURL);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (weatherData) {
        console.log(weatherData);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });

 
    allData(location, apiKey);
  }
});

function clearIcons() {
  // Remove all existing img elements in the iconContainer
  while (iconContainer.firstChild) {
    iconContainer.removeChild(iconContainer.firstChild);
  }
}

function backgroundClear() {
  const background = document.getElementById("homepageBackground");

  background.style.display = "none";
}

function forecastBackground () {
  const forecastBackgrounds = document.getElementById ('forecastBackground')
  forecastBackgrounds.style.backgroundImage = 'url("assets/images/a-starry-night-wallpaper-2.jpg")';
  forecastBackgrounds.style.backgroundSize = "cover"; 
   forecastBackgrounds.style.backgroundRepeat = "no-repeat";
    forecastBackgrounds.style.backgroundPosition = "center";
}

forecastBackground ();