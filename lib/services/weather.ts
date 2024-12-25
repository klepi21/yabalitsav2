export async function getWeatherForecast(date: Date) {
  // Thessaloniki coordinates
  const latitude = 40.6401;
  const longitude = 22.9444;

  // Open-Meteo API is completely free and no API key needed
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_probability_max,weathercode&timezone=auto`
  );
  const data = await response.json();
  
  // Weather codes from Open-Meteo
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
  };

  return {
    temperature: data.daily.temperature_2m_max[0],
    condition: weatherCodes[data.daily.weathercode[0]],
    precipitation: data.daily.precipitation_probability_max[0],
  };
} 