import { useAppSelector } from "@/app/hook";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import {
  getItineraryById,
  type Itinerary,
  updateItineraryById,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ItineraryLayout from "@/components/ItineraryLayout";

function ItineraryPage() {
  const { completeId } = useParams();
  const itId = completeId ? completeId.split("-")[0] : null;
  const userId = completeId ? completeId.split("-")[1] : null;
  console.log(itId, userId, completeId);
  const { user } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<Itinerary | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function getItinerary() {
      if (userId && itId) {
        const res = await getItineraryById(userId, itId);
        setData(res);
      }
    }

    getItinerary();
  }, [user, itId]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  async function handleSave(iti: Itinerary) {
    setData(iti);
    setIsSaved(false);
  }

  async function saveToFirebase() {
    if (user && itId && data) {
      setIsSaving(true);
      try {
        await updateItineraryById(user.uid, itId, data);
        setIsSaved(true);
        toast({
          title: "Itinerary Saved",
          description: "Your itinerary has been successfully saved.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error saving itinerary:", error);
        toast({
          title: "Error",
          description: "Failed to save the itinerary. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsSaving(false);
      }
    }
  }

  return (
    <main className="container mx-auto py-8 space-y-4">
      <div className="w-full mx-auto border-2 px-4 py-3 sm:px-8 sm:py-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          Created By
          <img
            src={data?.creatorProfile || "/placeholder.svg"}
            alt=""
            className="w-6 sm:w-8 rounded-full"
          />
        </div>
        {user?.uid === data?.createdBy && (
          <Button
            onClick={saveToFirebase}
            disabled={isSaving || isSaved}
            className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            <span className="text-sm sm:text-base">
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Changes"}
            </span>
          </Button>
        )}
      </div>
      {data ? (
        <ItineraryLayout
          data={data}
          isSaved={isSaved}
          onSave={handleSave}
          editable={!!(user && user.uid == data.createdBy)}
        />
      ) : (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
    </main>
  );
}

export default ItineraryPage;
