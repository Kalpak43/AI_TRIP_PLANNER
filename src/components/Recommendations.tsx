import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import useDestinations from "@/hooks/useDestinations";
import withLoading from "@/hocs/withLoading";

interface Destination {
  destination: string;
  reason: string;
  imageUrl?: string | null; // Optional field for the image URL
}

function Recommendations() {
  const { destinations, loading, error } = useDestinations();

  const DestinationCard = ({ dest }: { dest: Destination }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleRedirect = () => {
      navigate(`/plan?tripTo=${encodeURIComponent(dest.destination)}`, {
        state: {
          from: location.pathname,
        },
      });
    };

    return (
      <Card className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.67rem)] xl:w-[calc(25%-0.75rem)]">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            {dest.imageUrl ? (
              <img
                src={dest.imageUrl || "/placeholder.svg"}
                alt={dest.destination}
                className="w-full h-full object-cover"
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
        </CardHeader>
        <CardContent className="md:p-4 flex flex-col justify-between">
          <CardTitle className="text-lg mb-2">{dest.destination}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {dest.reason}
          </p>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            <Button className="mt-3" onClick={handleRedirect}>
              Plan Trip
            </Button>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const RecommendationsContent = withLoading(() => {
    return (
      <>
        {destinations && (
          <>
            <TabsContent value="domestic">
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-4">
                  {destinations.domesticDestinations.map((dest, index) => (
                    <DestinationCard key={index} dest={dest} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="foreign">
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-4">
                  {destinations?.foreignDestinations?.map((dest, index) => (
                    <DestinationCard key={index} dest={dest} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}
      </>
    );
  });

  return (
    <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-xl">
      <Card className="w-full mx-auto min-h-[500px]">
        <CardHeader className="max-md:px-0">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            Travel Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="max-md:px-0">
          <Tabs defaultValue="domestic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="domestic">Domestic</TabsTrigger>
              <TabsTrigger value="foreign">Foreign</TabsTrigger>
            </TabsList>
            <RecommendationsContent
              isLoading={loading}
              loadingText="Generating Recommendations"
            />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Recommendations;
