import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router";

// Define the type for each suggestion
interface Suggestion {
  description: string;
  photoUrl: string | null;
}

function SearchBar() {
  // Explicitly type the suggestions state
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input: value, types: ["geocode"] },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          const placesService = new google.maps.places.PlacesService(
            document.createElement("div")
          );
          const detailedSuggestions = predictions.map(
            (prediction) =>
              new Promise<Suggestion>((resolve) => {
                placesService.getDetails(
                  { placeId: prediction.place_id, fields: ["name", "photos"] },
                  (details) => {
                    resolve({
                      description: prediction.description,
                      photoUrl:
                        details?.photos?.[0]?.getUrl({ maxWidth: 100 }) || null,
                    });
                  }
                );
              })
          );

          Promise.all(detailedSuggestions).then((results) =>
            setSuggestions(results)
          );
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleSelect = (place: string) => {
    setInputValue(place);
    navigate(`/plan?tripTo=${encodeURIComponent(place)}`);
    setSuggestions([]);
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-700 text-transparent bg-clip-text">Search for your favorite Destinations</h2>
      <div className="w-full max-w-xl mx-auto relative">
        <Search className="absolute inset-y-0 h-fit my-auto mx-2" size={18} />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="px-10 shadow-md"
          placeholder="Search for your favorite Destinations"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 left-0 w-full bg-white shadow-md z-10 rounded-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelect(suggestion.description)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion.photoUrl && (
                  <img
                    src={suggestion.photoUrl}
                    alt={suggestion.description}
                    className="h-10 aspect-square mr-4 object-cover rounded"
                  />
                )}
                <span>{suggestion.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default SearchBar;
