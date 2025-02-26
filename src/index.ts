const API_KEY = '1f58e37bae99499f9cc125218252602';

function getElements() {
  return {
    citySelect: document.getElementById('citySelect') as HTMLSelectElement,
    getWeatherBtn: document.getElementById('getWeatherBtn'),
    currentWeather: document.getElementById('currentWeather'),
    forecast: document.getElementById('forecast'),
  };
}

export async function getCurrentWeather(city: string) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
}

export async function getForecast(city: string) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
}

export function displayCurrentWeather(data: any) {
  const { currentWeather } = getElements();
  if (data.current) {
    currentWeather!.innerHTML = `
      <p>Temperature: ${data.current.temp_c}°C</p>
      <p>Condition: ${data.current.condition.text}</p>
      <p>Humidity: ${data.current.humidity}%</p>
      <p>Wind Speed: ${data.current.wind_kph} km/h</p>
    `;
  } else {
    currentWeather!.innerHTML = `<p>No data available</p>`;
  }
}

export function displayForecast(data: any) {
  const { forecast } = getElements();
  if (data.forecast) {
    forecast!.innerHTML = data.forecast.forecastday
      .map((day: any) => `
        <div>
          <h3>${day.date}</h3>
          <p>Max Temperature: ${day.day.maxtemp_c}°C</p>
          <p>Min Temperature: ${day.day.mintemp_c}°C</p>
          <p>Condition: ${day.day.condition.text}</p>
        </div>
      `)
      .join('');
  } else {
    forecast!.innerHTML = `<p>No forecast data available</p>`;
  }
}

const { citySelect, getWeatherBtn } = getElements();

getWeatherBtn?.addEventListener('click', async () => {
  const selectedCity = citySelect.value;
  const currentWeatherData = await getCurrentWeather(selectedCity);
  const forecastData = await getForecast(selectedCity);
  if (currentWeatherData && forecastData) {
    displayCurrentWeather(currentWeatherData);
    displayForecast(forecastData);
  } else {
    const { currentWeather, forecast } = getElements();
    currentWeather!.innerHTML = `<p>Error fetching weather data</p>`;
    forecast!.innerHTML = '';
  }
});
