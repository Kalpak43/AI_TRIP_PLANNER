import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export interface Flight {
  id: string;
  price: number;
  departure: string;
  arrival: string;
  airline: string;
}

interface Trace {
  [key: string]: string;
}

interface IndirectFlight {
  Price: number;
  TraceRefs: string[];
}

interface PriceGrid {
  DirectOutboundAvailable: boolean;
  Indirect?: IndirectFlight;
  IndirectOutbound?: {
    Price: number;
  };
}

interface ApiResponse {
  data: {
    Outbound: string;
    Traces: Trace;
    PriceGrids: {
      Grid: PriceGrid[][];
    };
  };
  status: boolean;
  message: string;
}

export interface FlightSearchProps {
  destination: string;
  month: string | null;
}

const FlightComponent: React.FC<FlightSearchProps> = ({
  destination,
  month,
}) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const monthStringToNumber = (month: string | null): string => {
    const months: { [key: string]: string } = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    console.log(months[month || "January"]);

    return month ? months[month] || "01" : "01"; // Default to January if the month is not found
  };

  // Function to fetch entity ID using Skyscanner's Autosuggest API
  const fetchEntityId = async (query: string): Promise<string | null> => {
    try {
      const options = {
        method: "GET",
        url: "https://sky-scanner3.p.rapidapi.com/flights/auto-complete",
        params: {
          query: query, // User input (e.g., "Mumbai")
        },
        headers: {
          "x-rapidapi-key":
            "84beb02be0msh0441c73bcf11748p10c4dbjsna8465523b1bf", // Replace with your Skyscanner API key
          "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const results =
        response.data.data[0].navigation.relevantFlightParams.skyId;

      // if (results.length > 0) {
      //   return results[0].PlaceId; // Return the first result's entity ID
      // }
      return results;
    } catch (err) {
      console.error("Failed to fetch entity ID:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the entity ID for the destination
        const toEntityId = await fetchEntityId(destination);

        console.log(toEntityId);

        if (!toEntityId) {
          throw new Error("Destination not found");
        }
        const options = {
          method: "GET",
          url: "https://sky-scanner3.p.rapidapi.com/flights/price-calendar-web", // Updated for India and INR
          params: {
            fromEntityId: "BOM",
            toEntityId: toEntityId,
            yearMonth: `2025-${monthStringToNumber(month)}`,
          },
          headers: {
            "x-rapidapi-key":
              "84beb02be0msh0441c73bcf11748p10c4dbjsna8465523b1bf",
            "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
          },
        };

        const response = await axios.request<ApiResponse>(options);

        const parsedFlights = parseFlights(response.data);
        setFlights(parsedFlights.slice(0, 5)); // Limit to 5 flights
      } catch (err) {
        setError("Failed to fetch flight data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [destination]); // Re-fetch flights when the destination prop changes

  const parseFlights = (response: ApiResponse): Flight[] => {
    const flights: Flight[] = [];

    response.data.PriceGrids.Grid.forEach((row) => {
      row.forEach((gridItem) => {
        if (gridItem.Indirect) {
          const traceRef = gridItem.Indirect.TraceRefs[0];
          const trace = response.data.Traces[traceRef];

          if (trace) {
            const [_, airline, departure, arrival] = trace.split("*");

            flights.push({
              id: traceRef,
              price: gridItem.Indirect.Price,
              departure,
              arrival,
              airline,
            });
          }
        }
      });
    });

    return flights;
  };

  return (
    <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-md">
      <div className="space-y-4 bg-white rounded-md p-4">
        <h1 className="text-xl text-center font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          Travel Recommendations
        </h1>

        {/* {loading && <p>Loading flights...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {flights.length > 0 ? (
            flights.map((flight) => (
              <li
                key={flight.id}
                className="mb-4 p-4 border rounded-lg shadow-sm"
              >
                <p>
                  <strong>Flight ID:</strong> {flight.id}
                </p>
                <p>
                  <strong>Price:</strong> ₹{flight.price} INR
                </p>
                <p>
                  <strong>Departure:</strong> {flight.departure}
                </p>
                <p>
                  <strong>Arrival:</strong> {flight.arrival}
                </p>
                <p>
                  <strong>Airline:</strong> {flight.airline}
                </p>
              </li>
            ))
          ) : (
            <p>No flights found</p>
          )}
        </ul> */}

        {loading && (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!loading && !error && flights.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight ID</TableHead>
                <TableHead>Price (INR)</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Airline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.id}</TableCell>
                  <TableCell>₹{flight.price.toLocaleString()}</TableCell>
                  <TableCell>{flight.departure}</TableCell>
                  <TableCell>{flight.arrival}</TableCell>
                  <TableCell>{flight.airline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !loading && !error && <p className="text-center">No flights found</p>
        )}
      </div>
    </div>
  );
};

export default FlightComponent;
