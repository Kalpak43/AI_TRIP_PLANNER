import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TravelData } from "@/pages/PlanPage";
import { Trash, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ActivityPickerProps {
  travelData: TravelData;
  updateTravelData: (data: Partial<TravelData>) => void;
}

export function ActivityPicker({
  travelData,
  updateTravelData,
}: ActivityPickerProps) {
  const [activities, setActivities] = useState<string[]>(travelData.activities);
  const [newActivity, setNewActivity] = useState("");

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      const updatedActivities = [...activities, newActivity.trim()];
      setActivities(updatedActivities);
      updateTravelData({ activities: updatedActivities });
      setNewActivity("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    console.log(updatedActivities);
    setActivities(updatedActivities);
    updateTravelData({ activities: updatedActivities });
  };

  const predefinedActivities = [
    "Must-see Attractions",
    "Great Food",
    "Hidden Gems",
    "Bike Tours",
    "Historical Landmarks",
  ];

  return (
    <div className="relative overflow-hidden rounded-md">
      <img
        src="/activity.jpg"
        alt=""
        className="absolute max-md:hidden inset-0 z-[-1] blur-sm object-cover object-bottom w-full h-full"
      />

      <div className="p-[1px] max-w-lg mx-auto  bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-xl my-4">
        <div className="p-4 rounded-xl bg-white min-h-[400px] flex items-center justify-center">
          <div className="py-8 space-y-4">
            <Label className="text-lg text-center font-semibold block text-blue-500">
              Preferred Activities
            </Label>
            <div className="py-4 flex flex-wrap items-center justify-center gap-4">
              {predefinedActivities.map((a, i) => (
                <Button
                  variant="outline"
                  key={a}
                  className={`relative text-gray-400 ${
                    activities.includes(a)
                      ? "bg-green-600 hover:bg-green-800 text-gray-200 hover:text-gray-300"
                      : ""
                  }`}
                  onClick={() => {
                    !activities.includes(a) &&
                      setActivities((x) => {
                        return [...x, a];
                      });
                  }}
                >
                  {a}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-4 max-w-md mx-auto">
              <Input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Enter an activity"
              />
              <Button onClick={handleAddActivity}>Add</Button>
            </div>

            <div className="flex justify-center flex-wrap gap-4 pt-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 relative w-fit p-2 border-2 rounded text-xs"
                >
                  <span>{activity}</span>
                  <button
                    className="bg-red-600 rounded-xl absolute top-0 right-0 -translate-y-1/2 translate-x-1/2"
                    onClick={() => handleRemoveActivity(index)}
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
