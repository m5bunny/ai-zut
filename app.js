// const OPEN_CAGE_API_KEY = '7ae2f99aa0ae4cd2bc213c459242763f'
const OPEN_WEATHER_API_KEY = '7ded80d91f2b280ec979100cc8bbba94'

const getLatLong = async (place) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    name: data[0].name,
    lat: data[0].lat,
    lon: data[0].lon
  };
}

const getCurrentWeather = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.onload = () => {
    if (request.status === 200) {
      const data = JSON.parse(request.response);
      console.log(data);
      const div = document.getElementById('currentWeatherData');
      div.innerHTML = `
        <h3>${data.weather[0].main}</h3>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Feels like: ${data.main.feels_like}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
    } else {
      console.log('error', request.status);
    }
  }
}

const getWeatherForecast = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
  fetch(url)
    .then(response => response.json())
    .then(data => { 
      console.log(data) 
      const div = document.getElementById('forecastWeatherData');
      div.innerHTML = '';
      data.list.forEach(item => {
        div.innerHTML += `
          <div>
            <p>${item.dt_txt}</p>
            <h3>${item.weather[0].main}</h3>
            <p>Temperature: ${item.main.temp}°C</p>
            <p>Feels like: ${item.main.feels_like}°C</p>
            <p>Humidity: ${item.main.humidity}%</p>
          </div>
        `;
      });
    })
    .catch(error => console.log(error));
}

const handleSearch = async () => {
  const place = document.getElementById('place').value;
  const { name, lat, lon } = await getLatLong(place);
  console.log(name, lat, lon);
  getCurrentWeather(lat, lon);
  getWeatherForecast(lat, lon);
}