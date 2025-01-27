import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

function WeatherComponent({ destination }: { destination: string }) {
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );
  console.log(latLng);
  const [weather, setWeather] = useState<any>(null);

  // Fetch coordinates for the destination
  const fetchCoordinates = async (place: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: place }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setLatLng({ lat, lng });
        fetchWeather(lat, lng);
      } else {
        console.error("Error fetching coordinates:", status);
      }
    });
  };

  // Fetch historical weather data for the past 7 days
  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      const endDate = today.toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
      const startDate = new Date(today.setDate(today.getDate() - 7))
        .toISOString()
        .split("T")[0]; // 7 days ago in YYYY-MM-DD format

      const response = await axios.get(
        `https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (destination) {
      fetchCoordinates(destination);
    }
  }, [destination]);

  // Transform weather data for Recharts (daily average temperature)
  const transformWeatherData = () => {
    if (!weather) return [];

    return weather.daily.time.map((time: string, index: number) => ({
      date: new Date(time).toLocaleDateString(), // Format date as MM/DD/YYYY
      temperature: weather.daily.temperature_2m_mean[index],
    }));
  };

  return (
    <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-md">
      <div className="space-y-4 bg-white rounded-md p-4">
        <h1 className="text-xl text-center font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          Current Weather Details
        </h1>

        {weather ? (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={transformWeatherData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherComponent;
