function getWeather() {
    const apiKey = '297654e8cffe48ec2cb6bf6f6fd1c3a6';
    const city = document.getElementById('city').value; // Get the city input value

    if (!city) {
        alert('Please enter a city'); // Alert if the city input is empty
        return;
    }

    // Construct the API URL to get the city's latitude and longitude
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const { lat, lon } = data.coord;
                getForecast(lat, lon, apiKey); // Fetch the 7-day forecast
                displayWeather(data); // Display the current weather data
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again');
        });
}

function getForecast(lat, lon, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data); // Display the 7-day forecast data
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.createElement('img'); // Create an image element for the weather icon

    // Clear previous content
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Display error message if city not found
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Create HTML content for current weather
        const temperatureHTML = `<p>${temperature}° Celsius</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

        // Update the DOM with the current weather information
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl; // Set the source of the weather icon
        weatherIcon.alt = description; // Set the alt text of the weather icon

        // Append the weather icon to the weather info div
        weatherInfoDiv.appendChild(weatherIcon);
    }
}

function displayForecast(data) {
    const dailyForecastDiv = document.getElementById('daily-forecast');

    // Clear previous content
    dailyForecastDiv.innerHTML = '';

    // Get the 7-day forecast
    const forecastList = data.daily.slice(0, 7);
    forecastList.forEach(day => {
        // Convert the forecast date to a readable format
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
        const temp = Math.round(day.temp.day);
        const description = day.weather[0].description;
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Create HTML content for each forecast item
        const forecastHTML = `
            <div class="forecast-item">
                <p>${date}</p>
                <p><img src="${iconUrl}" alt="${description}"></p>
                <p>${temp}°C</p>
                <p>${description}</p>
            </div>
        `;

        // Append each forecast item to the daily forecast div
        dailyForecastDiv.innerHTML += forecastHTML;
    });
}