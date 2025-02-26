import { getCurrentWeather,  displayCurrentWeather, displayForecast } from '../src/index';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      current: {
        temp_c: 20,
        condition: { text: "Sunny" },
        humidity: 50,
        wind_kph: 10
      }
    })
  })
) as jest.Mock;


describe('Weather App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <select id="citySelect"><option value="Moscow">Moscow</option></select>
      <button id="getWeatherBtn">Get Weather</button>
      <div id="currentWeather"></div>
      <div id="forecast"></div>
    `;
  });

  test('fetch current weather data successfully', async () => {
    const data = await getCurrentWeather('Moscow');
    expect(data).not.toBeNull();
    expect(data!.current.temp_c).toBeDefined();
    expect(data!.current.condition.text).toBeDefined();
  });

  test('display current weather data', () => {
    displayCurrentWeather({ current: { temp_c: 20, condition: { text: 'Sunny' }, humidity: 50, wind_kph: 10 } });
    const currentWeatherDiv = document.getElementById('currentWeather');
    expect(currentWeatherDiv!.innerHTML).toContain('Temperature: 20°C');
    expect(currentWeatherDiv!.innerHTML).toContain('Sunny');
  });

  test('display forecast data', () => {
    displayForecast({
      forecast: {
        forecastday: [
          { date: '2023-10-01', day: { maxtemp_c: 25, mintemp_c: 15, condition: { text: 'Cloudy' } } }
        ]
      }
    });
    const forecastDiv = document.getElementById('forecast');
    expect(forecastDiv!.innerHTML).toContain('Max Temperature: 25°C');
    expect(forecastDiv!.innerHTML).toContain('Cloudy');
  });
});