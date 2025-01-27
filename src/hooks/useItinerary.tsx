import { useState } from "react";
import { Itinerary, storeItinerary } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/app/hook";

const API_URL = import.meta.env.VITE_AI_API_URL as string;

export const useItinerary = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const generateItinerary = async (travelData: {
    location: string;
    month: string;
    days: number;
    activities: string[];
    type: "solo" | "couple" | "family" | "friends";
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/generateItinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...travelData,
          duration: travelData.days,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate itinerary");
      }

      const data = await response.json();
      setItinerary({
        ...data,
        destination: travelData.location,
        month: travelData.month,
      });
    } catch (err) {
      setError(
        "An error occurred while generating the itinerary. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save an itinerary.",
        variant: "destructive",
      });
      return;
    }

    if (!itinerary) {
      toast({
        title: "Error",
        description: "No itinerary to save.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await storeItinerary(user.uid, user.photoURL || "", {
        ...itinerary,
      });
      setIsSaved(true);
      toast({
        title: "Success",
        description:
          "Itinerary saved successfully! Check it out in the profile page.",
      });
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast({
        title: "Error",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    itinerary,
    isLoading,
    saving,
    error,
    isSaved,
    generateItinerary,
    handleSaveItinerary,
    setItinerary,
  };
};
