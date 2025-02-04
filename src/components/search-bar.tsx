import toast from "react-hot-toast";

export default function SearchBar({
  fetchWeather,
  query,
  setQuery,
  savedLocations,
}: {
  fetchWeather: (location: string) => void;
  query: string;
  setQuery: (query: string) => void;
  savedLocations: string[];
}) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="p-2 rounded-lg text-black dark:text-white dark:bg-gray-700"
        placeholder="Enter city or ZIP code"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <button
        onClick={() => {
          if (savedLocations.length < 3) {
            fetchWeather(query);
            setQuery("");
          } else {
            toast.error("You can only save up to 3 locations");
            setQuery("");
          }
        }}
        className="bg-white dark:bg-gray-800 text-blue-500 dark:text-white px-4 py-2 rounded-lg">
        Search
      </button>
    </div>
  );
}
