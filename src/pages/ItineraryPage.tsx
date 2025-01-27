import { useAppSelector } from "@/app/hook";
import {
  getItineraryById,
  type Itinerary,
  updateItineraryById,
  deleteItineraryById, // Import the delete function
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Import useNavigate for redirection
import { Button } from "@/components/ui/button";
import { Loader2, Save, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ItineraryLayout from "@/components/ItineraryLayout";

function ItineraryPage() {
  const { completeId } = useParams();
  const itId = completeId ? completeId.split("-")[0] : null;
  const userId = completeId ? completeId.split("-")[1] : null;
  const { user } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<Itinerary | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading
  const { toast } = useToast();
  const navigate = useNavigate(); // For redirection after deletion

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

  const handleCopyLink = () => {
    const pageLink = window.location.href; // Get the current page URL
    navigator.clipboard
      .writeText(pageLink)
      .then(() => {
        toast({
          title: "Link Copied to Clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  const handleDelete = async () => {
    if (user && itId) {
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
          duration: 3000,
        });
        navigate("/profile"); // Redirect to the home page or another route after deletion
      } catch (error) {
        console.error("Error deleting itinerary:", error);
        toast({
          title: "Error",
          description: "Failed to delete the itinerary. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <main className="container mx-auto py-8 space-y-4">
      <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-md sticky top-4 z-50">
        <div className="w-full mx-auto border-2 px-4 py-2 rounded-md flex flex-row items-center justify-between gap-4 sm:gap-0 bg-white">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span className="max-md:hidden">Created By</span>
            <img
              src={data?.creatorProfile || "/placeholder.svg"}
              alt=""
              className="w-6 sm:w-8 rounded-full"
            />
          </div>

          {user?.uid === data?.createdBy && (
            <div className="flex">
              <Button
                onClick={handleCopyLink}
                className="text-blue-500 disabled:text-gray-400"
                variant={"ghost"}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={saveToFirebase}
                disabled={isSaved || isSaving}
                className="text-green-500 disabled:text-gray-400"
                variant={"ghost"}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleDelete} // Updated onClick handler
                disabled={isDeleting}
                className="text-red-500 disabled:text-gray-400"
                variant={"ghost"}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="px-1">
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
      </div>
    </main>
  );
}

export default ItineraryPage;
