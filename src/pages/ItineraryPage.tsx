import { useAppSelector } from "@/app/hook";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ItineraryLayout from "@/components/ItineraryLayout";
import { useItinerary } from "@/hooks/useItinerary";
import withLoading from "@/hocs/withLoading";

function ItineraryPage() {
  const { completeId } = useParams();
  const itId = completeId ? completeId.split("-")[0] : null;
  const userId = completeId ? completeId.split("-")[1] : null;
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  // Use the custom hook
  const {
    itinerary: data,
    isLoading,
    saving,
    isDeleting,
    isSaved,
    fetchItinerary,
    updateItinerary,
    saveItinerary,
    deleteItinerary,
  } = useItinerary();

  // Fetch itinerary on mount
  useEffect(() => {
    if (userId && itId) {
      fetchItinerary(userId, itId);
    }
  }, [userId, itId]);

  // Handle copying the link
  const handleCopyLink = () => {
    const pageLink = window.location.href;
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

  const ItineraryWithLoading = withLoading(() => (
    <>
      {data ? (
        <ItineraryLayout
          data={data}
          isSaved={isSaved}
          onSave={updateItinerary} // Pass the handleSave function
          editable={!!(user && user.uid === data.createdBy)}
        />
      ) : (
        <p className="text-center">No itinerary found.</p>
      )}
    </>
  ));

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
                onClick={() => saveItinerary(itId!)} // Use saveItinerary from the hook
                disabled={isSaved || saving}
                className="text-green-500 disabled:text-gray-400"
                variant={"ghost"}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => deleteItinerary(itId!)} // Use deleteItinerary from the hook
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
        <ItineraryWithLoading
          isLoading={isLoading}
          loadingText="Fetching Saved Itinerary"
        />
      </div>
    </main>
  );
}

export default ItineraryPage;
