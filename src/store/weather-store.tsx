import { Weather } from "@/pages";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WeatherStore {
  weather: Weather | null;
  setWeather: (data: Weather) => void;
  savedLocations: string[];
  addLocation: (location: string) => void;
  clearAllLocations: () => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      weather: null,
      setWeather: (data: Weather) => set({ weather: data }),
      savedLocations: [],
      clearAllLocations: () => set({ savedLocations: [] }),
      addLocation: (location: string) =>
        set((state: { savedLocations: string[] }) => {
          const updated = [
            ...new Set([location, ...state.savedLocations]),
          ].slice(0, 4);
          return { savedLocations: updated };
        }),
    }),
    {
      name: "weather-storage",
      storage: {
        getItem: (name: string) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name: string, value: unknown) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
