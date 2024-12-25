"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Thermometer } from "lucide-react";
import { getWeatherForecast } from '@/lib/services/weather';

interface WeatherInfoProps {
  date: Date;
}

interface WeatherData {
  temperature: number;
  condition: string;
  precipitation: number;
}

export function WeatherInfo({ date }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherForecast(date);
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [date]);

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-24" />
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  const getWeatherIcon = () => {
    if (weather.condition.toLowerCase().includes('βροχή') || weather.condition.toLowerCase().includes('ψιχάλα')) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    }
    if (weather.condition.toLowerCase().includes('συννεφ')) {
      return <Cloud className="h-5 w-5 text-gray-500" />;
    }
    return <Sun className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {getWeatherIcon()}
        <div className="flex items-center gap-1">
          <Thermometer className="h-4 w-4" />
          <span>{weather.temperature}°C</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {weather.condition}
          {weather.precipitation > 20 && (
            <span className="ml-2">({weather.precipitation}% πιθανότητα βροχής)</span>
          )}
        </div>
      </div>
    </Card>
  );
} 