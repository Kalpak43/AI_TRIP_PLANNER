import { useAppSelector } from "@/app/hook";
import ItineraryList from "@/components/ItineraryList";
import { Card } from "@/components/ui/card";

function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

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
      <ItineraryList />
    </main>
  );
}

export default ProfilePage;
