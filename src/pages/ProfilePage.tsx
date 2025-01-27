import { useAppSelector } from "@/app/hook";
import ItineraryList from "@/components/ItineraryList";
import { Card } from "@/components/ui/card";

function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card className="w-full  max-w-xl mx-auto p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md">
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
            <div className="w-full space-y-4">
              <div className="bg-gradient-to-r from-pink-300 to-purple-300 pb-[1px]">
                <div className="bg-white p-2">
                  <strong>Email:</strong>
                  <p>{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ItineraryList />
    </main>
  );
}

export default ProfilePage;
