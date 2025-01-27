import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";

interface Destination {
  destination: string;
  reason: string;
  imageUrl?: string; // Optional field for the image URL
}
interface DestinationTypes {
  domesticDestinations: Destination[];
  foreignDestinations: Destination[];
}
const getSeason = () => {
  const month = new Date().getMonth(); // 0 = January, 1 = February, ..., 11 = December
  if (month >= 3 && month <= 5) return "Spring"; // March to May
  if (month >= 6 && month <= 8) return "Summer"; // June to August
  if (month >= 9 && month <= 11) return "Autumn"; // September to November
  return "Winter"; // December to February
};

const fetchDestinations = async (
  setDestinations: React.Dispatch<React.SetStateAction<DestinationTypes | null>>
) => {
  const season = getSeason();

  try {
    const response = await fetch("http://localhost:3000/api/destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ season }),
    });

    const data = await response.json();
    setDestinations(data);
    console.log("Destinations:", data); // Handle the response data as needed
  } catch (error) {
    console.error("Error fetching destinations:", error);
  }
};

const getPlaceImage = async (destination: string): Promise<string | null> => {
  const unsplashAccessKey = "2uoFjCKyi9A3lRv24viv3sP0Lg8o7LVl9yUonT6N_PA"; // Replace with your Unsplash API key
  const query = encodeURIComponent(destination); // Ensure the destination is URL encoded
  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashAccessKey}&per_page=1`;

  try {
    const response = await fetch(unsplashUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Get the URL of the first image in the search results
      const imageUrl = data.results[0]?.urls?.regular; // 'regular' size is good for general use
      return imageUrl || null; // Return image URL or null if no image found
    } else {
      return null; // No images found for the destination
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
};

function Recommendations() {
  const [destinations, setDestinations] = useState<DestinationTypes | null>(
    null
  );
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchDestinations(setDestinations);
  }, []);

  useEffect(() => {
    if (destinations) {
      console.log(destinations);
      const fetchImages = async () => {
        const images: { [key: string]: string } = {};
        for (const dest of [
          ...destinations.domesticDestinations,
          ...destinations.foreignDestinations,
        ]) {
          try {
            const imageUrl = await getPlaceImage(dest.destination);
            images[dest.destination] = imageUrl || "/placeholder.svg";
          } catch (error) {
            console.error("Error fetching image for", dest.destination, error);
            images[dest.destination] = "/placeholder.svg";
          }
        }
        setImageUrls(images);
      };
      fetchImages();
    }
  }, [destinations]);

  const DestinationCard = ({ dest }: { dest: Destination }) => (
    <Card className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.67rem)] xl:w-[calc(25%-0.75rem)]">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {imageUrls[dest.destination] ? (
            <img
              src={imageUrls[dest.destination] || "/placeholder.svg"}
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
          <Link
            className="mt-3"
            to={`/plan?tripTo=${encodeURIComponent(dest.destination)}`}
          >
            Plan Trip
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-md rounded-xl">
      <Card className="w-full mx-auto ">
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
            {destinations ? (
              <>
                <TabsContent value="domestic">
                  <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                    <div className="flex flex-wrap gap-4">
                      {destinations?.domesticDestinations?.map(
                        (dest, index) => (
                          <DestinationCard key={index} dest={dest} />
                        )
                      )}
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
            ) : (
              <div className="h-[600px] w-full rounded-md border p-4 flex items-center justify-center">
                <Loader2 className="animate-spin" />
                Generating Recommendations
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Recommendations;
