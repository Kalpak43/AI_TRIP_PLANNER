import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TravelDatePicker } from "@/components/TravelDatePicker";
import { TravelTypePicker } from "@/components/TravelTypePicker";
import { ActivityPicker } from "@/components/ActivityPicker";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import ItineraryLayout from "@/components/ItineraryLayout";
import { useTravelData } from "@/hooks/useTravelData";
import { useItinerary } from "@/hooks/useItinerary";

export interface TravelData {
  location: string;
  month: string;
  days: number;
  activities: string[];
  type: "solo" | "couple" | "family" | "friends";
}

function PlanPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tripTo = queryParams.get("tripTo");

  // Use the custom hook
  const { travelData, updateTravelData } = useTravelData(tripTo || "");

  const {
    itinerary,
    isLoading,
    saving,
    error,
    isSaved,
    generateItinerary,
    saveItinerary,
  } = useItinerary();

  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const steps = [
    { title: "Travel Dates", component: TravelDatePicker },
    { title: "Travel Type", component: TravelTypePicker },
    { title: "Activities", component: ActivityPicker },
  ];

  useEffect(() => {
    if (step === 4) {
      generateItinerary(travelData);
    }
  }, [step]);

  return (
    <main className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
          Plan Your Trip
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[500px] flex flex-col justify-between">
        {tripTo ? (
          <>
            <p className="text-center mb-6">
              You're planning a trip to{" "}
              <strong className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                {tripTo}
              </strong>
            </p>
            <div className="mb-6">
              <Stepper
                currentStep={step}
                steps={[...steps.map((s) => s.title), "Generate Itinerary"]}
              />
            </div>
            <div className="mt-6">
              {step < 4 ? (
                steps.map((s, index) => (
                  <div
                    key={s.title}
                    className={step === index + 1 ? "block" : "hidden"}
                  >
                    <s.component
                      travelData={travelData}
                      updateTravelData={updateTravelData}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center">
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center w-full h-[800px] animated-bg rounded-md"
                    >
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <p className="mt-4">
                        {isSaved
                          ? "Saving your itinerary..."
                          : "Generating your itinerary..."}
                      </p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500"
                    >
                      {error}
                    </motion.div>
                  ) : itinerary ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex py-2 justify-end w-full">
                        {step === 4 && itinerary && !isSaved && (
                          <Button
                            onClick={() => saveItinerary()}
                            className=""
                            disabled={isLoading}
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Save Itinerary
                          </Button>
                        )}
                      </div>
                      <ItineraryLayout
                        data={itinerary}
                        isSaved={isSaved}
                        onSave={() => console.log("saved")}
                        editable={true}
                      />
                    </motion.div>
                  ) : null}
                </div>
              )}
            </div>
            <div className="flex justify-between mt-6">
              {step < 4 && (
                <>
                  <Button
                    variant={"outline"}
                    onClick={handleBack}
                    disabled={step === 1}
                    className="gradient-hover"
                  >
                    <span>Back</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={handleNext}
                    className="gradient-hover"
                  >
                    <span>{step === 3 ? "Generate Itinerary" : "Next"}</span>
                  </Button>
                </>
              )}

              {step === 4 && itinerary && isSaved && (
                <p className="text-green-500 font-semibold mx-auto">
                  Itinerary Saved!
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center">No destination selected.</p>
        )}
      </CardContent>
    </main>
  );
}

export default PlanPage;

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                index + 1 <= currentStep
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                  : "bg-gray-200 text-gray-400"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {index + 1}
            </motion.div>
          </div>
          {index < steps.length - 1 && (
            <motion.div
              className="h-1 flex-1 mx-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              <div
                className={`h-full ${
                  index + 1 < currentStep
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                    : "bg-gray-200"
                }`}
              />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
