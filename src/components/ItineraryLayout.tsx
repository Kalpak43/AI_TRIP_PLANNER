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
      <ScrollArea className="md:h-[600px] w-full rounded-md border p-4 ">
        <ItineraryDisplay
          data={data}
          isSaved={isSaved}
          onSave={onSave}
          editable={editable}
        />
      </ScrollArea>
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <WeatherComponent destination={data.destination || ""} />
        {/* <FlightComponent destination={data.destination || ""} /> */}
      </ScrollArea>
    </div>
  );
};

export default ItineraryLayout;
