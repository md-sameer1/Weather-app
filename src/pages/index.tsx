"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ThemeProvider, useTheme } from "next-themes";
import { Sun, Moon, Droplets, Wind, Thermometer } from "lucide-react";
import { useWeatherStore } from "@/store/weather-store";
import toast from "react-hot-toast";
import SearchBar from "@/components/search-bar";
import ForecastCard from "@/components/forecast-card";
import DataCard from "@/components/data-card";

export interface Weather {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    humidity: number;
    wind_kph: number;
    wind_mph: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }[];
  };
}

export default function Home({ initialWeather }: { initialWeather: Weather }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const { weather, setWeather, savedLocations, addLocation } =
    useWeatherStore();
  const [isOffline, setIsOffline] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = useCallback(
    async (location: string) => {
      if (!location) return;
      try {
        const res = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5`
        );
        const data = await res.json();
        if (data?.location?.name !== weather?.location?.name) {
          setWeather(data);
          addLocation(data.location.name);
        }
      } catch (error) {
        toast.error("Error fetching weather");

        console.error("Error fetching weather:", error);
      }
    },
    [API_KEY, addLocation, setWeather, weather]
  );

  useEffect(() => {
    setMounted(true);
    if (!weather) setWeather(initialWeather);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(`${lat},${lon}`);
      },
      (error) => {
        toast.error("Error getting location");
        console.error("Geolocation error:", error);
      }
    );

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [fetchWeather, initialWeather, setWeather]);

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md mb-4">
          {mounted && theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <h1 className="text-3xl font-bold mb-4">Weather Forecast App</h1>

        {isOffline ? (
          <div className="p-4 bg-red-500 text-white rounded-lg">
            No Internet Connection
          </div>
        ) : (
          <>
            <SearchBar
              fetchWeather={fetchWeather}
              query={query}
              setQuery={setQuery}
            />

            <div className="mt-4 flex felx-row items-center justify-center">
              <h2 className="text-lg font-semibold">Saved Locations:</h2>

              {savedLocations.map((loc: string) => (
                <div
                  key={loc}
                  className="cursor-pointer bg-gray-200 dark:bg-gray-700 p-2 rounded-md mx-1"
                  onClick={() => fetchWeather(loc)}>
                  {loc}
                </div>
              ))}
            </div>

            {weather && (
              <div className="flex flex-col items-center justify-center mt-6 p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg w-50 text-center">
                <h2 className="text-xl font-semibold">
                  {weather?.location?.name}, {weather?.location?.country}
                </h2>

                <div>
                  <Image
                    src={`https:${weather?.current?.condition?.icon}`}
                    alt="Weather Icon"
                    className="mx-auto mt-2"
                    width={64}
                    height={64}
                  />
                  <p className="text-lg">
                    {weather?.current?.temp_c}°C / {weather?.current?.temp_f}°F
                  </p>
                </div>

                <p className="text-lg">{weather?.current?.condition?.text}</p>

                <div className="flex flex-row justify-center mt-2">
                  <DataCard
                    icon={<Thermometer size={24} />}
                    name={"Real Feel"}
                    data={`${weather?.current?.temp_c} °C`}
                  />

                  <DataCard
                    icon={<Droplets size={24} />}
                    name={"Humidity"}
                    data={`${weather?.current?.humidity} %`}
                  />

                  <DataCard
                    icon={<Wind size={24} />}
                    name={"Wind Speed"}
                    data={`${weather?.current?.wind_kph} kph`}
                  />
                </div>

                <h3 className="text-lg font-semibold mt-4">5-Day Forecast</h3>
                <div className="flex flex-row justify-center ">
                  {weather?.forecast?.forecastday.map(
                    (day: {
                      date: string;
                      day: {
                        maxtemp_c: number;
                        maxtemp_f: number;
                        mintemp_c: number;
                        mintemp_f: number;
                        condition: {
                          text: string;
                          icon: string;
                        };
                      };
                    }) => (
                      <div key={day.date} className="mx-1 mt-4">
                        <ForecastCard day={day} />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export async function getServerSideProps() {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const defaultLocation = "Bengaluru, India";
  const res = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultLocation}&days=5`
  );
  const initialWeather = await res.json();

  return { props: { initialWeather } };
}
