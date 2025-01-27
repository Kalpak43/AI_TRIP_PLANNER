import { useAppSelector } from "@/app/hook";
import { getItineraries, type Itinerary } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

function ItineraryList() {
  const { user } = useAppSelector((state) => state.auth);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null
  );

  useEffect(() => {
    const fetchItineraries = async () => {
      if (user) {
        setLoading(true);
        try {
          const userItineraries = await getItineraries(user.uid);
          setItineraries(userItineraries);
        } catch (error) {
          console.error("Error fetching itineraries:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchItineraries();
  }, [user]);

  const handleItineraryClick = (itinerary: Itinerary) => {
    setSelectedItinerary(
      selectedItinerary?.title === itinerary.title ? null : itinerary
    );
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
          Your Itineraries
        </CardTitle>
        <CardDescription className="text-center">
          View and manage your saved travel plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        ) : itineraries.length === 0 ? (
          <p className="text-center text-gray-500">
            No itineraries found. Start planning your next adventure!
          </p>
        ) : (
          <AnimatePresence>
            {itineraries.map((itinerary, index) => (
              <motion.div
                key={itinerary.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="mb-4 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleItineraryClick(itinerary)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {itinerary.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {itinerary.info.weather}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            selectedItinerary?.title === itinerary.title
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </Button>
                    </div>
                    {selectedItinerary?.title === itinerary.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <h4 className="font-semibold mb-2">
                          Itinerary Overview:
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {itinerary.itinerary.map((day, dayIndex) => (
                            <li key={dayIndex}>
                              {day.title}: {day.activities.length} activities
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Budget:</h4>
                          <p>Total: {itinerary.budget.total_budget}</p>
                        </div>
                        <Button asChild className="mt-4 w-full">
                          <Link to={`/itinerary/${itinerary.id}-${user?.uid}`}>
                            View Full Itinerary
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}

export default ItineraryList;
