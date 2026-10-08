export class weatherService {
  static async getWeatherData(city: string): Promise<any> {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response?.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}
