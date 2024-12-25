export async function getWeatherForecast(date: Date) {
  // Thessaloniki coordinates
  const latitude = 40.6401;
  const longitude = 22.9444;

  // Open-Meteo API is completely free and no API key needed
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_probability_max,weathercode&timezone=auto`
  );
  const data = await response.json();
  
  // Weather codes from Open-Meteo (in Greek)
  const weatherCodes: { [key: number]: string } = {
    0: "Καθαρός ουρανός",
    1: "Κυρίως καθαρός",
    2: "Μερικώς συννεφιασμένος",
    3: "Συννεφιασμένος",
    45: "Ομιχλώδης",
    51: "Ασθενής ψιχάλα",
    53: "Μέτρια ψιχάλα",
    55: "Έντονη ψιχάλα",
    61: "Ασθενής βροχή",
    63: "Μέτρια βροχή",
    65: "Έντονη βροχή",
    71: "Ελαφρύ χιόνι",
    73: "Μέτριο χιόνι",
    75: "Έντονο χιόνι",
    95: "Καταιγίδα",
  };

  return {
    temperature: data.daily.temperature_2m_max[0],
    condition: weatherCodes[data.daily.weathercode[0]],
    precipitation: data.daily.precipitation_probability_max[0],
  };
} 