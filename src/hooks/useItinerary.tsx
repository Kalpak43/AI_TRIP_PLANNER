import { useState } from "react";
import { deleteItineraryById, getItineraryById, Itinerary, storeItinerary, updateItineraryById } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/app/hook";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_AI_API_URL as string;

export const useItinerary = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch itinerary by ID
  const fetchItinerary = async (userId: string, itId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getItineraryById(userId, itId);
      setItinerary(data);
    } catch (err) {
      setError("Failed to fetch itinerary. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate itinerary
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

  // Update itinerary locally
  const updateItinerary = (updatedItinerary: Itinerary) => {
    setItinerary(updatedItinerary);
    setIsSaved(false); // Reset the saved flag since the itinerary has been modified
  };

  // Save itinerary to Firebase
  const saveItinerary = async (itId?: string) => {
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
      if (itId) {
        // Update existing itinerary
        await updateItineraryById(user.uid, itId, itinerary);
      } else {
        // Save new itinerary
        await storeItinerary(user.uid, user.photoURL || "", itinerary);
      }
      setIsSaved(true);
      toast({
        title: "Success",
        description: "Itinerary saved successfully!",
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

  // Delete itinerary
  const deleteItinerary = async (itId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete an itinerary.",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteItineraryById(user.uid, itId);
      toast({
        title: "Itinerary Deleted",
        description: "Your itinerary has been successfully deleted.",
      });
      navigate("/profile"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast({
        title: "Error",
        description: "Failed to delete itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    itinerary,
    isLoading,
    saving,
    isDeleting,
    error,
    isSaved,
    setItinerary,
    fetchItinerary,
    generateItinerary,
    updateItinerary, // Add this function
    saveItinerary,
    deleteItinerary,
  };
};
