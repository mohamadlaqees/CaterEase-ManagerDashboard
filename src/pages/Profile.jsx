import { useSelector } from "react-redux";

const Profile = () => {
  // Retrieve branch information from the Redux store
  const { branchInfo } = useSelector((state) => state.restaurant);

  // Map the retrieved data to a more convenient object structure
  const restaurantInfo = {
    name: branchInfo?.branch?.description,
    photo: branchInfo?.branch?.restaurant_photo,
    address: branchInfo?.branch?.location_note,
    phone: branchInfo?.branch?.phone,
    managerName: branchInfo?.branch?.manager_name,
    workingDays: branchInfo?.branch?.working_days,
    categories: branchInfo?.branch?.categories,
    deliveryRegions: branchInfo?.branch?.delivery_areas, // The raw data
    services: branchInfo?.branch?.service_types,
    occasions: branchInfo?.branch?.occasion_types,
  };

  // Destructure the restaurantInfo object for easier access in the JSX
  const {
    name: restaurantName,
    photo: restaurantPhoto,
    address: restaurantAddress,
    phone: restaurantPhone,
    managerName: restaurantManagerName,
    workingDays: restaurantWorkingDays,
    categories: restaurantCategories,
    deliveryRegions: restaurantDeliveryRegions, // This is the array with potential duplicates
    services: restaurantServices,
    occasions: restaurantOccasions,
  } = restaurantInfo;

  // --- NEW: Logic to process and de-duplicate delivery regions ---

  // 1. Map the raw data to formatted strings (e.g., "Damascus, Syria")
  const formattedRegions =
    restaurantDeliveryRegions?.map(
      (area) => `${area.city_name}, ${area.country}`
    ) || []; // Default to an empty array if data is not yet available

  // 2. Use a Set to get only the unique strings, then convert it back to an array
  const uniqueFormattedRegions = [...new Set(formattedRegions)];

  // --- End of new logic ---

  return (
    <main className="text-(--primaryFont) p-10">
      {/* Page Header */}
      <header className="text-xl sm:text-2xl font-bold mb-5">
        {restaurantName || "Your Restaurant"}
      </header>

      {/* Profile Banner */}
      <div className="w-full h-80 sm:h-fit py-5 px-5 rounded-md border-2 border-(--border-color)">
        <img
          src="./profile.png"
          className="relative h-20 sm:h-auto"
          alt="Profile background"
        />
        <div className="sm:flex gap-3 absolute sm:static left-1/2 -translate-x-1/2 sm:left-0 sm:translate-0">
          <img
            className="rounded-full m-auto sm:m-0 relative bottom-10 w-30 h-30 sm:left-0 sm:w-40 sm:h-40"
            src={restaurantPhoto || "/default-logo.png"} // Fallback image
            alt="Restaurant"
          />
          <div className="sm:mt-8 text-center font-bold">
            <h1 className="mb-1 text-xl">{restaurantName}</h1>
          </div>
        </div>
      </div>

      {/* Restaurant Personal Details & Working Days */}
      <div className="mt-10 w-full rounded-md border-2 border-(--border-color)">
        <header className="text-lg sm:text-xl py-5 px-5 pb-5 font-bold mb-4 border-b-2 border-(--border-color)">
          Restaurant Personal Details
        </header>
        <div className="text-sm sm:text-base flex flex-col gap-10 sm:gap-0 sm:flex-row sm:justify-between items-start px-5 py-5">
          <div className="space-y-5 sm:space-y-10 text-gray-700">
            <p>
              <span className="font-medium text-gray-600">
                Restaurant Name:
              </span>{" "}
              {restaurantName}
            </p>
            <p>
              <span className="font-medium text-gray-600">Address:</span>{" "}
              {restaurantAddress}
            </p>
            <p>
              <span className="font-medium text-gray-600">Phone:</span>{" "}
              {restaurantPhone}
            </p>
            <p>
              <span className="font-medium text-gray-600">Manager Name:</span>{" "}
              {restaurantManagerName}
            </p>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <header className="font-medium text-gray-600">Working days</header>
            <table className="w-full text-sm text-left text-(--secondaryFont) border rounded-md overflow-hidden">
              <thead className="bg-gray-100 text-(--primaryFont)">
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {restaurantWorkingDays?.map((day) => (
                  <tr
                    key={day.day_of_week}
                    className="even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">{day.day_of_week}</td>
                    <td className="px-4 py-2">
                      {day.open_time}-{day.close_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Menu Categories & Driver Regions */}
      <div className="flex flex-col sm:flex-row items-start text-sm sm:text-base gap-10 justify-between mt-10">
        <div className="w-full sm:w-1/2 rounded-md border-2 border-(--border-color)">
          <header className="text-lg sm:text-xl py-5 px-5 pb-5 font-bold mb-4 border-b-2 border-(--border-color)">
            Menu Categories
          </header>
          <ul className="flex flex-wrap justify-center gap-3 px-5 py-5">
            {restaurantCategories?.map((category) => (
              <li
                key={category}
                className="rounded-full px-4 py-2 bg-(--secondary)"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* --- MODIFIED: Driver Regions Section --- */}
        <div className="w-full sm:w-1/2 rounded-md border-2 border-(--border-color)">
          <header className="text-lg sm:text-xl py-5 px-5 pb-5 font-bold mb-4 border-b-2 border-(--border-color)">
            Delivery Regions
          </header>
          {uniqueFormattedRegions.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-3 px-5 py-5">
              {/* Map over the NEW, clean array of unique regions */}
              {uniqueFormattedRegions.map((regionName) => (
                <li
                  key={regionName} // The regionName is now unique and safe to use as a key
                  className="rounded-full px-4 py-2 bg-(--secondary) text-(--primaryFont) font-medium"
                >
                  {regionName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-(--secondaryFont) py-5">
              No delivery regions specified.
            </p>
          )}
        </div>
      </div>

      {/* Occasions & Services */}
      <div className="flex flex-col sm:flex-row items-start text-sm sm:text-base gap-10 justify-between mt-10">
        <div className="w-full sm:w-1/2 rounded-md border-2 border-(--border-color)">
          <header className="text-lg sm:text-xl py-5 px-5 pb-5 font-bold mb-4 border-b-2 border-(--border-color)">
            Occasions
          </header>
          <ul className="flex flex-wrap justify-center gap-3 px-5 py-5">
            {restaurantOccasions?.map((occasion) => (
              <li
                key={occasion.id}
                className="rounded-full px-4 py-2 bg-(--secondary)"
              >
                {occasion.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full sm:w-1/2 rounded-md border-2 border-(--border-color)">
          <header className="text-lg sm:text-xl py-5 px-5 pb-5 font-bold mb-4 border-b-2 border-(--border-color)">
            Services
          </header>
          <ul className="flex flex-wrap justify-center gap-3 px-5 py-5">
            {restaurantServices?.map((service) => (
              <li
                key={service.name}
                className="rounded-full px-4 py-2 bg-(--secondary)"
              >
                {service.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Profile;
