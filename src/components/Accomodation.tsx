import React from "react";
import PlacesImage from "./PlacesImage";

interface AccommodationProps {
  accommodations: {
    budget: {
      name: string;
      location: string;
      amenities: string;
    };
    mid_range: {
      name: string;
      location: string;
      amenities: string;
    };
    luxury: {
      name: string;
      location: string;
      amenities: string;
    };
  };
}

function Accommodation({ accommodations }: AccommodationProps) {
  if (!accommodations) {
    return <div>No accommodation details available.</div>;
  }

  const { budget, mid_range, luxury } = accommodations;

  console.log(budget, mid_range, luxury);

  return (
    <div className="p-4 rounded-lg border-2 bg-white">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Accommodation Options
      </h2>
      <div className="space-y-6 divide-y-2">
        <div className="pt-6">
          <h3 className="text-xl font-semibold text-green-600">
            Budget Option
          </h3>
          <p className="text-lg font-bold">{budget.name}</p>
          <p>{budget.location}</p>
          <p className="text-gray-600">{budget.amenities}</p>
          <div className="mt-4">
            <PlacesImage
              place={budget.name}
              destination={budget.location}
              hideTitle={true}
            />
          </div>
        </div>
        <div className="pt-6">
          <h3 className="text-xl font-semibold text-yellow-600">
            Mid-Range Option
          </h3>
          <p className="text-lg font-bold">{mid_range.name}</p>
          <p>{mid_range.location}</p>
          <p className="text-gray-600">{mid_range.amenities}</p>
          <div className="mt-4">
            <PlacesImage
              place={mid_range.name}
              destination={mid_range.location}
              hideTitle={true}
            />
          </div>
        </div>
        <div className="py-6">
          <h3 className="text-xl font-semibold text-red-600">Luxury Option</h3>
          <p className="text-lg font-bold">{luxury.name}</p>
          <p>{luxury.location}</p>
          <p className="text-gray-600">{luxury.amenities}</p>
          <div className="mt-4">
            <PlacesImage
              place={luxury.name}
              destination={luxury.location}
              hideTitle={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accommodation;
