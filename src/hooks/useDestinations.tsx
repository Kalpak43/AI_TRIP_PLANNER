import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_AI_API_URL as string;

interface Destination {
  destination: string;
  reason: string;
  imageUrl?: string | null; // Optional field for the image URL
}
interface DestinationTypes {
  domesticDestinations: Destination[];
  foreignDestinations: Destination[];
}

function useDestinations() {
  const [destinations, setDestinations] = useState<DestinationTypes | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getPlaceImage = async (destination: string): Promise<string | null> => {
    const unsplashAccessKey = "2uoFjCKyi9A3lRv24viv3sP0Lg8o7LVl9yUonT6N_PA";
    const query = encodeURIComponent(destination);
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashAccessKey}&per_page=1`;

    try {
      const response = await fetch(unsplashUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Get the URL of the first image in the search results
        const imageUrl = data.results[0]?.urls?.regular;
        return imageUrl || null;
      } else {
        return null; // No images found for the destination
      }
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
      return null;
    }
  };

  const getSeason = () => {
    const month = new Date().getMonth(); // 0 = January, 1 = February, ..., 11 = December
    if (month >= 3 && month <= 5) return "Summer";
    if (month >= 6 && month <= 9) return "Monsoon";
    if (month >= 10 && month <= 11) return "Autumn";
    return "Winter";
  };

  // Function to fetch destinations and their images
  const fetchDestinations = async () => {
    const season = getSeason();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ season }),
      });

      const data: DestinationTypes = await response.json();

      // Fetch images for each destination
      const domesticImages: Destination[] = await Promise.all(
        data.domesticDestinations.map(async (destination) => {
          return {
            ...destination,
            imageUrl: await getPlaceImage(destination.destination),
          };
        })
      );

      const foreignImages: Destination[] = await Promise.all(
        data.foreignDestinations.map(async (destination) => {
          return {
            ...destination,
            imageUrl: await getPlaceImage(destination.destination),
          };
        })
      );

      setDestinations({
        domesticDestinations: domesticImages,
        foreignDestinations: foreignImages,
      });
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Failed to fetch destinations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return { destinations, loading, error };
}

export default useDestinations;
