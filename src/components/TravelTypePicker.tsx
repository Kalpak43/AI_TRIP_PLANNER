import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import type { TravelData } from "@/pages/PlanPage";
import { Button } from "./ui/button";

interface TravelTypePickerProps {
  travelData: TravelData;
  updateTravelData: (data: Partial<TravelData>) => void;
}

export function TravelTypePicker({
  travelData,
  updateTravelData,
}: TravelTypePickerProps) {
  const [type, setType] = useState<TravelData["type"]>(travelData.type);

  useEffect(() => {
    updateTravelData({ type: type });
  }, [type]);

  const travelTypes: TravelData["type"][] = [
    "solo",
    "couple",
    "family",
    "friends",
  ];

  return (
    <div className="p-[1px] max-w-lg mx-auto  bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-xl my-4">
      <div className="p-4 rounded-xl bg-white min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Label className="text-lg font-semibold mb-4 block text-blue-500">
            Travel Type
          </Label>
          <div className="py-4 flex flex-wrap items-center justify-center gap-4">
            {travelTypes.map((t) => (
              <Button
                variant="outline"
                key={t}
                className={`text-gray-400 ${
                  t === type
                    ? "bg-green-600 hover:bg-green-800 text-gray-200 hover:text-gray-300"
                    : ""
                }`}
                onClick={() => setType(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
