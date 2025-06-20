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
    <div className="">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Accommodation Options
      </h2>
      <div className="space-y-6 divide-y-2 md:p-4 md:rounded-lg md:border-2 bg-white">
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-green-600">
            Budget Option
          </h3>
          <p className="text-md font-bold">{budget.name}</p>
          <p>{budget.location}</p>
          <p className="text-gray-600 text-sm">{budget.amenities}</p>
          <div className="mt-4">
            <PlacesImage
              place={budget.name}
              destination={budget.location}
              hideTitle={true}
            />
          </div>
        </div>
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-yellow-600">
            Mid-Range Option
          </h3>
          <p className="text-md font-bold">{mid_range.name}</p>
          <p>{mid_range.location}</p>
          <p className="text-gray-600 text-sm">{mid_range.amenities}</p>
          <div className="mt-4">
            <PlacesImage
              place={mid_range.name}
              destination={mid_range.location}
              hideTitle={true}
            />
          </div>
        </div>
        <div className="py-6">
          <h3 className="text-lg font-semibold text-red-600">Luxury Option</h3>
          <p className="text-md font-bold">{luxury.name}</p>
          <p>{luxury.location}</p>
          <p className="text-gray-600 text-sm">{luxury.amenities}</p>
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
