import { useAppSelector } from "@/app/hook";
import ItineraryList from "@/components/ItineraryList";
import { getItineraries, Itinerary } from "@/lib/utils";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="">
      <div className="bg-white h-full rounded-[inherit] overflow-hidden p-8">
        <div className="flex flex-col gap-4 items-center">
          <div className="w-16 aspect-square rounded-full overflow-hidden">
            <img
              src={user?.photoURL || ""}
              className="object-cover h-full w-full block"
            />
          </div>
          <strong className="text-xl">
            Hello,{" "}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {user?.displayName}
            </span>
          </strong>
        </div>
      </div>
      <ItineraryList
        itineraries={itineraries}
        isLoading={loading}
        loadingText="Getting Your Itineraries"
      />
    </main>
  );
}

export default ProfilePage;
