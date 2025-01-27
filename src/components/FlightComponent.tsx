import React, { useEffect, useState } from "react";
import axios from "axios";

export interface Flight {
  id: string;
  price: number;
  departure: string;
  arrival: string;
  airline: string;
}

export interface ApiResponse {
  flights: Flight[];
}

export interface FlightSearchProps {
  destination: string;
}

const FlightComponent: React.FC<FlightSearchProps> = ({ destination }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        const options = {
          method: "GET",
          url: "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=new",
          params: {
            destination: destination, // Use the destination prop
            origin: "India", // You can make this dynamic or hardcode it
            departure_date: "2023-12-01", // You can make this dynamic or hardcode it
            adults: "1", // You can make this dynamic or hardcode it
          },
          headers: {
            "X-RapidAPI-Key":
              "cecbe51699msh97c07c9d2a9115cp174b2cjsn33474fec279", // Replace with your API key
            "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
          },
        };

        const response = await axios.request<ApiResponse>(options);
        setFlights(response.data.flights);
      } catch (err) {
        setError("Failed to fetch flight data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [destination]); // Re-fetch flights when the destination prop changes

  return (
    <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-md">
      <div className="space-y-4 bg-white rounded-md p-4">
        <h1 className="text-xl text-center font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">Flights to {destination}</h1>

        {loading && <p>Loading flights...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {flights.map((flight) => (
            <li key={flight.id}>
              <p>Flight ID: {flight.id}</p>
              <p>Price: ${flight.price}</p>
              <p>Departure: {flight.departure}</p>
              <p>Arrival: {flight.arrival}</p>
              <p>Airline: {flight.airline}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlightComponent;
