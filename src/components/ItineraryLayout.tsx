import { Itinerary } from "@/lib/utils";
import ItineraryDisplay from "./ItineraryDisplay";
import { ScrollArea } from "./ui/scroll-area";
import WeatherComponent from "./WeatherComponent";
import FlightComponent from "./FlightComponent";

interface ItineraryDisplayProps {
  data: Itinerary;
  isSaved: boolean;
  onSave: (updatedItinerary: Itinerary) => void;
  editable: boolean;
}

const ItineraryLayout: React.FC<ItineraryDisplayProps> = ({
  data,
  isSaved,
  onSave,
  editable,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-md">
        <ScrollArea className="md:h-[800px] w-full rounded-md border p-4 bg-white">
          <ItineraryDisplay
            data={data}
            isSaved={isSaved}
            onSave={onSave}
            editable={editable}
          />
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-4">
        <WeatherComponent destination={data.destination || ""} />
        <FlightComponent destination={data.destination || ""} />
      </div>
    </div>
  );
};

export default ItineraryLayout;
