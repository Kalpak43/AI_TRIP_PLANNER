import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import type { TravelData } from "@/pages/PlanPage";
import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "motion/react";

interface TravelDatePickerProps {
  travelData: TravelData;
  updateTravelData: (data: Partial<TravelData>) => void;
}

const animationVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export function TravelDatePicker({
  travelData,
  updateTravelData,
}: TravelDatePickerProps) {
  const [month, setMonth] = useState(travelData.month);
  const [days, setDays] = useState(travelData.days);

  useEffect(() => {
    updateTravelData({ month, days });
  }, [month, days]);

  const months = [
    "January",
    "Februrary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="relative overflow-hidden rounded-md"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={animationVariants}
      >
        <img
          src="/date.jpg"
          alt=""
          className="absolute max-md:hidden inset-0 z-[-1] blur-sm "
        />
        <div className="p-[1px] max-w-lg mx-auto  bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-xl my-4">
          <div className="p-4 rounded-xl bg-white min-h-[400px] flex items-center justify-center">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <Label
                  htmlFor="month"
                  className="text-lg font-semibold text-blue-500"
                >
                  Select a Travel Month
                </Label>
                <div className="flex flex-wrap gap-4 justify-center py-2 ">
                  {months.map((m) => (
                    <Button
                      type="button"
                      variant="outline"
                      key={m}
                      className={`text-gray-400 ${
                        m === month
                          ? "bg-green-600 hover:bg-green-800 text-gray-200 hover:text-gray-300"
                          : ""
                      }`}
                      onClick={() => {
                        setMonth(m);
                      }}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>
              <div className=" text-center">
                <Label
                  htmlFor="days"
                  className="text-lg font-semibold text-blue-500"
                >
                  Number of Days
                </Label>
                <div className="py-4 flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDays((x) => Number(x - 1))}
                  >
                    <Minus />
                  </Button>
                  <strong>{days}</strong>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDays((x) => Number(x + 1))}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
