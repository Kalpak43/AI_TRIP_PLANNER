import type React from "react";
import { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sun,
  ShoppingBag,
  Utensils,
  Camera,
  Waves,
  Music,
  Activity,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Itinerary } from "@/lib/utils";
import ActivityModal from "./ActivityModal";
import PlacesImage from "./PlacesImage";
import Accommodation from "./Accomodation";

interface ItineraryActivity {
  time: string;
  location: string;
  description: string;
  type: string;
}

interface ItineraryDisplayProps {
  data: Itinerary;
  isSaved: boolean;
  onSave: (updatedItinerary: Itinerary) => void;
  editable: boolean;
}

const activityIcons: { [key: string]: React.ReactNode } = {
  sightseeing: <Camera className="w-5 h-5" />,
  dining: <Utensils className="w-5 h-5" />,
  shopping: <ShoppingBag className="w-5 h-5" />,
  relaxation: <Sun className="w-5 h-5" />,
  "beach activity": <Waves className="w-5 h-5" />,
  nightlife: <Music className="w-5 h-5" />,
  activity: <Activity className="w-5 h-5" />,
};

const sortActivities = (
  activities: ItineraryActivity[]
): ItineraryActivity[] => {
  const convertTo24HourFormat = (time: string): string => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  return activities.sort((a, b) => {
    const [aStart] = a.time.split(" - ");
    const [bStart] = b.time.split(" - ");
    const aTime24 = convertTo24HourFormat(aStart);
    const bTime24 = convertTo24HourFormat(bStart);
    return aTime24.localeCompare(bTime24);
  });
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  data,
  isSaved,
  onSave,
  editable,
}) => {
  const [itinerary, setItinerary] = useState<Itinerary>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] =
    useState<ItineraryActivity | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    console.log(data.destination);
  }, [data]);

  const handleEditActivity = (dayIndex: number, activityIndex: number) => {
    setCurrentDayIndex(dayIndex);
    setCurrentActivityIndex(activityIndex);
    setCurrentActivity(itinerary.itinerary[dayIndex].activities[activityIndex]);
    setIsModalOpen(true);
  };

  const handleAddActivity = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex);
    setCurrentActivityIndex(null);
    setCurrentActivity(null);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (activity: ItineraryActivity) => {
    const updatedItinerary = { ...itinerary };
    if (currentDayIndex !== null) {
      if (currentActivityIndex !== null) {
        // Edit existing activity
        updatedItinerary.itinerary[currentDayIndex].activities[
          currentActivityIndex
        ] = activity;
      } else {
        // Add new activity
        updatedItinerary.itinerary[currentDayIndex].activities.push(activity);
      }
      // Sort activities after adding or editing
      updatedItinerary.itinerary[currentDayIndex].activities = sortActivities(
        updatedItinerary.itinerary[currentDayIndex].activities
      );
    }
    setItinerary(updatedItinerary);
    onSave(updatedItinerary);
    setIsModalOpen(false);
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    const updatedItinerary = { ...itinerary };
    updatedItinerary.itinerary[dayIndex].activities.splice(activityIndex, 1);
    // Sort activities after deleting
    updatedItinerary.itinerary[dayIndex].activities = sortActivities(
      updatedItinerary.itinerary[dayIndex].activities
    );
    setItinerary(updatedItinerary);
    onSave(updatedItinerary);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
          {itinerary.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSaved && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-center">
            Itinerary Saved
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Weather
          </h3>
          <p className="text-gray-600">{itinerary.info.weather}</p>
        </div>
        <Accordion type="single" collapsible className="mb-6 ">
          {itinerary.itinerary.map((day, dayIndex) => (
            <AccordionItem key={dayIndex} value={`day-${day.day}`}>
              <AccordionTrigger>{day.title}</AccordionTrigger>
              <AccordionContent className="divide-y-2">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="mb-4 py-2 relative py-8">
                    {editable && (
                      <div className="absolute top-0 right-0 md:top-2 md:right-2 flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-1"
                          onClick={() => handleEditActivity(dayIndex, actIndex)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDeleteActivity(dayIndex, actIndex)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center justify-center mb-2">
                      <span className="mr-2">
                        {activityIcons[activity.type] || (
                          <Activity className="w-5 h-5" />
                        )}
                      </span>
                      <span className="font-semibold">{activity.time}</span>
                    </div>
                    <PlacesImage
                      place={activity.location}
                      destination={data.destination || ""}
                      hideTitle={false}
                    />
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleAddActivity(dayIndex)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Activity
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {itinerary.accommodation && (
          <Accommodation accommodations={itinerary.accommodation} />
        )}

        <div className="mt-4 py-4">
          <h3 className="text-xl font-semibold  mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
            Estimated Budget
          </h3>
          <div className="border-2 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="divide-x-2 divide-gray-200 bg-gray-100">
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="divide-x-2">
                  <TableCell>Flights</TableCell>
                  <TableCell>{itinerary.budget.flights}</TableCell>
                </TableRow>
                <TableRow className="divide-x-2">
                  <TableCell>Accommodation</TableCell>
                  <TableCell>{itinerary.budget.accommodation}</TableCell>
                </TableRow>
                <TableRow className="divide-x-2">
                  <TableCell>Daily Expenses</TableCell>
                  <TableCell>{itinerary.budget.daily_expenses}</TableCell>
                </TableRow>
                <TableRow className="divide-x-2">
                  <TableCell className="font-semibold">Total Budget</TableCell>
                  <TableCell className="font-semibold">
                    {itinerary.budget.total_budget}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        activity={currentActivity}
      />
    </div>
  );
};

export default ItineraryDisplay;
