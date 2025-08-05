import { useSelector } from "react-redux";

const Profile = () => {
  const {
    restaurantName,
    restaurantAddress,
    restaurantPhoto,
    restaurantPhone,
    restaurantDeliveryRegions,
    restaurantCategories,
    restaurantManagerName,
    restaurantWorkingDays,
  } = useSelector((state) => state.restaurant);

  return (
    <main className="text-(--primaryFont) p-10 ">
      <header className="text-xl sm:text-2xl  font-bold mb-5">
        {restaurantName}
      </header>
      <div className="w-full h-80 sm:h-fit py-5 px-5 rounded-md border-2 border-(--border-color)">
        <img src="./profile.png" className="relative h-20 sm:h-auto" alt="" />
        <div className="sm:flex gap-3   absolute sm:static left-1/2 -translate-x-1/2 sm:left-0 sm:translate-0">
          <img
            className="rounded-full m-auto sm:m-0 relative bottom-10   w-30 h-30   sm:left-0  sm:w-40 sm:h-40 "
            src={restaurantPhoto}
            alt=""
          />
          <div className="sm:mt-8 text-center font-bold  ">
            <h1 className="mb-1 text-xl">{restaurantName}</h1>
            <p className="text-(--secondaryFont) text-sm sm:text-xl">
              Since 2020
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full rounded-md border-2 border-(--border-color)">
        <header className="text-lg sm:text-xl py-5 px-5  pb-5 font-bold mb-4 border-b-2 border-(--border-color) ">
          Restaurant Personal Details
        </header>
        <div className="text-sm sm:text-base flex flex-col gap-10 sm:gap-0  sm:flex-row sm:justify-between items-start  px-5 py-5">
          <div className="space-y-5 sm:space-y-10  text-gray-700">
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
                {restaurantWorkingDays?.map((workingDays) => (
                  <tr className="even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2">{workingDays.day_of_week}</td>
                    <td className="px-4 py-2">
                      {workingDays.open_time}-{workingDays.close_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center text-sm sm:text-base gap-10 justify-between mt-10">
        <div className="items-stretch  sm:self-start w-full sm:w-1/2 rounded-md border-2 border-(--border-color)">
          <header className="text-lg sm:text-xl py-5 px-5  pb-5 font-bold mb-4 border-b-2 border-(--border-color) ">
            Menu Categories
          </header>{" "}
          <ul className="flex flex-wrap  justify-center gap-3 px-5 py-5">
            {restaurantCategories?.map((category) => (
              <li className="rounded-4xl px-6 py-3 bg-(--secondary)">
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className=" text-sm sm:text-base w-full sm:w-1/2 rounded-md border-2 border-(--border-color)">
          <header className="text-lg sm:text-xl py-5 px-5  pb-5 font-bold mb-4 border-b-2 border-(--border-color) ">
            Driver Regions Details
          </header>{" "}
          <div>
            <table className="w-full text-sm text-left text-(--secondaryFont)  overflow-hidden">
              <thead className="bg-gray-100 text-(--primaryFont)">
                <tr>
                  <th className="px-4 py-2">Region</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {restaurantDeliveryRegions?.map((region) => (
                  <tr className="even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2">{region.name}</td>
                    <td className="px-4 py-2">{region.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
