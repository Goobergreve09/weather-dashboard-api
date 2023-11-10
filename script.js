//weather API base funcntionality
document.addEventListener("DOMContentLoaded", function() {
    const theDate = document.getElementById("currentDate");
    theDate.textContent = dayjs().format('MMM D, YYYY');

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
    const forecastTitle = document.getElementById("forecastcityName")

    searchButton.addEventListener("click", function(event) {
       event.preventDefault();
        var apiKey = "a1c24f9ef9bb705299a22d8524be3474";

        const location = locationInput.value;

        // Make the API request to OpenWeatherMap's Geocoding API
        const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${location}'&limit=50&appid=${apiKey}`;

        fetch(geocodingUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                var latitude = data[0].lat;
                var longitude = data[0].lon;
                console.log(longitude);

                const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
                console.log(weatherURL);

                // Continue with the API request for weather data
                return fetch(weatherURL);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(weatherData) {
                console.log(weatherData);
                currentCity.textContent = "Current Weather in " + weatherData.name;
                const forecastTitle = document.getElementById("forecastcityName")
                forecastTitle.textContent = "5 -Day Weather Forecast in " + weatherData.name;

                currentHumidity.textContent = "Humidity: " + weatherData.main.humidity + "%";

                let tempInt = Math.round(weatherData.main.temp)
                currentTemperature.textContent = "Temperature: " + tempInt + "℉";

                let feelslikeInt = Math.round(weatherData.main.feels_like)
                feelsLike.textContent ="but feels like " + feelslikeInt + "℉" ;

                let currentwindInt = Math.round(weatherData.wind.speed)
                currentWind.textContent = "Wind Speed: " + currentwindInt + " mph";

                const timestamp = [weatherData.sys.sunset,weatherData.sys.sunrise];
                const date = new Date(timestamp[0] * 1000); // Convert from seconds to milliseconds

                const sunsettimeClock = dayjs(date).format('h:mm:ss A');
                sunsetTime.textContent = "Time of Sunset: " + sunsettimeClock;

                const date2 = new Date(timestamp[1] * 1000);
                const sunrisetimeClock = dayjs(date2).format('h:mm:ss A');
                sunriseTime.textContent = "Time of Sunrise: " + sunrisetimeClock;

                const imgCode = weatherData.weather[0].icon
                const icon = document.createElement("img")
                icon.setAttribute('src',`https://openweathermap.org/img/wn/${imgCode}@2x.png`);
                icon.style.position = 'absolute';
                icon.style.top = '45px';
                icon.style.left = '50%';
                icon.style.width = '250px';

                iconContainer.appendChild(icon);

                descriptionCurrent.textContent = "SKIES SHOW //   " + weatherData.weather[0].description.toUpperCase();
            })
            .catch(function(error) {
                console.error("Error:", error);
            });

        getforecastData(location, apiKey);
        
    });

    function getforecastData(location, apiKey) {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;

        fetch(forecastUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);

                const dayOne = data.list[4];
                const dayTwo = data.list[12];
                const dayThree = data.list[20];
                const dayFour = data.list[28];
                const dayFive = data.list[36];

                let fiveDays = [dayOne, dayTwo, dayThree, dayFour, dayFive];

                console.log(fiveDays);

                for (let i = 0; i < fiveDays.length; i++) {
                    if (fiveDays[i] && fiveDays[i].dt) {
                        const dtValue = fiveDays[i].dt * 1000;
                        const forecastDates = dayjs(dtValue).format('MM/DD');
                        console.log(forecastDates);
                        const forecastTemp = Math.round(1.8 *(fiveDays[i].main.temp -273) + 32);
                        console.log(forecastTemp);
                        const forecastfeelsLike = Math.round(1.8 *(fiveDays[i].main.feels_like -273) + 32);
                        console.log(forecastfeelsLike)
                        const forecastHumid = fiveDays[i].main.humidity;
                        console.log(forecastHumid);
                        const forecastwindSpeed  = fiveDays[i].wind.speed;
                        console.log(forecastwindSpeed)
                       

                    } else {
                        console.log(`Invalid data for day ${i}`);
                    }
                }
            });
    
    }
    function forecastText (weatherData) {
        const forecastTitle = document.getElementById("forecastcityName")
        forecastTitle.textContent = "5 -Day Weather Forecast in" + weatherData.name;
        console.log(weatherData.name)
    }
    
});


    const forecastTitle = document.getElementById("forecastcityName")
    forecastTitle.textContent = "5 -Day Weather Forecast in" + weatherData.name;
   


forecastText(weather);

console.log("greg");




            
      

