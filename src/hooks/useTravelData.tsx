import { useState } from "react";

export interface TravelData {
  location: string;
  month: string;
  days: number;
  activities: string[];
  type: "solo" | "couple" | "family" | "friends";
}

export const useTravelData = (initialLocation: string) => {
  const [travelData, setTravelData] = useState<TravelData>({
    location: initialLocation,
    month: "",
    days: 1,
    activities: [],
    type: "solo",
  });

  const updateTravelData = (data: Partial<TravelData>) => {
    setTravelData((prev) => ({ ...prev, ...data }));
  };

  return { travelData, updateTravelData };
};
