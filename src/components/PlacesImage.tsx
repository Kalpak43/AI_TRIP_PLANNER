import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PlacesImageProps {
  place: string;
  destination: string;
  hideTitle: boolean;
}

function PlacesImage({ place, destination, hideTitle }: PlacesImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mapsLink, setMapsLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!place) return;

    setLoading(true);
    setError(null);

    // Initialize PlacesService with a dummy element
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    // Search for place details
    service.findPlaceFromQuery(
      {
        query: place + " " + destination,
        fields: ["photos", "geometry", "name"],
      },
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results[0]
        ) {
          console.log(results);
          const placeResult = results[0];

          // Get the first photo URL
          if (placeResult.photos && placeResult.photos.length > 0) {
            const photoUrl = placeResult.photos[0].getUrl({ maxWidth: 800 });
            setImageUrl(photoUrl);
          }

          // Construct Google Maps link using latitude and longitude
          if (placeResult.geometry?.location && placeResult.name) {
            const lat = placeResult.geometry.location.lat();
            const lng = placeResult.geometry.location.lng();
            const encodedName = encodeURIComponent(placeResult.name);
            const googleMapsLink = `https://www.google.com/maps?q=${encodedName}&ll=${lat},${lng}`;
            setMapsLink(googleMapsLink);
          }
        } else {
          console.error(
            "No photos or geometry found, or error fetching place details:",
            status
          );
          setError("Failed to load place details. Please try again later.");
        }
        setLoading(false);
      }
    );
  }, [place]);

  return (
    <div className="w-full max-w-sm mx-auto">
      {!hideTitle && (
        <h4 className="text-lg font-semibold mb-2 text-center">{place}</h4>
      )}
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : imageUrl ? (
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`${place} (Click to enlarge)`}
                className="w-full h-24 object-cover rounded-md cursor-pointer"
              />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={place}
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
      {mapsLink && (
        <div className="mt-2 text-center">
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 inline-flex items-center"
          >
            View on Google Maps
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}

export default PlacesImage;
