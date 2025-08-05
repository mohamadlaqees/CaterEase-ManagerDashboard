import { Outlet } from "react-router";
import HeaderBar from "../components/HeaderBar";
import LeftSideBar from "../components/LeftSideBar";
import { useEffect, useRef } from "react";
import {
  useBranchInfoQuery,
  useWorkingDaysQuery,
} from "../store/apiSlice/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddress,
  setDeliveryRegions,
  setManagerName,
  setName,
  setPhone,
  setPhoto,
  setWorkingDays,
  setCategories,
} from "../store/restaurantSlice";

const Layout = () => {
  const { data: workingDaysResponse } = useWorkingDaysQuery(
    localStorage.getItem("branchID")
  );
  const { data: branchInfoResponse } = useBranchInfoQuery(
    localStorage.getItem("branchID")
  );
  const burgerRef = useRef();
  const dispatch = useDispatch();
  const { restaurantName, restaurantPhoto } = useSelector(
    (state) => state.restaurant
  );

  useEffect(() => {
    dispatch(setName(branchInfoResponse?.branch.original.branch.description));
    dispatch(
      setAddress(branchInfoResponse?.branch.original.branch.location_note)
    );
    dispatch(
      setPhoto(branchInfoResponse?.branch.original.branch.restaurant_photo)
    );
    dispatch(setPhone(branchInfoResponse?.branch.original.branch.phone));
    dispatch(
      setDeliveryRegions(
        branchInfoResponse?.branch.original.branch.delivery_regions
      )
    );
    dispatch(
      setManagerName(branchInfoResponse?.branch.original.branch.manager_name)
    );
    dispatch(
      setCategories(branchInfoResponse?.branch.original.branch.categories)
    );
    dispatch(setWorkingDays(workingDaysResponse));
  }, [
    branchInfoResponse?.branch.original.branch.delivery_regions,
    branchInfoResponse?.branch.original.branch.description,
    branchInfoResponse?.branch.original.branch.location_note,
    branchInfoResponse?.branch.original.branch.manager_name,
    branchInfoResponse?.branch.original.branch.phone,
    branchInfoResponse?.branch.original.branch.restaurant_photo,
    workingDaysResponse,
  ]);

  return (
    <>
      <main>
        <LeftSideBar sidebarRef={burgerRef} />
        <section>
          <HeaderBar
            sidebarRef={burgerRef}
            restaurantName={restaurantName}
            restaurantPhoto={restaurantPhoto}
          />
          <main className="  lg:pl-56 pt-[65px] ">
            <Outlet />
          </main>
        </section>
      </main>
    </>
  );
};

export default Layout;
