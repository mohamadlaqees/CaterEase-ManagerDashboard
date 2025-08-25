import { useDispatch, useSelector } from "react-redux";
import { openAssignOrder } from "../store/orderSlice";
import { X } from "lucide-react";
import { useAllDeliveryEmpQuery } from "../store/apiSlice/apiSlice";
import { useEffect } from "react";
import { AssignOrderSkeleton } from "../components/skeleton/AssginOrderSkeleton";
import LoadingButton from "../components/LoadingButton";
import EmptySection from "../components/EmptySection";

const AssignOrder = ({ assignOrder, assignOrderIsLoading }) => {
  const { assignOrderOpened } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  const {
    data: allDeliveryEmpResponse,
    isLoading: availableDeliveryEmpIsLoading,
    refetch,
  } = useAllDeliveryEmpQuery(undefined, {
    skip: !assignOrderOpened,
  });

  const delieveryEmp = allDeliveryEmpResponse?.available_delivery_persons.map(
    (DEmp) => {
      return {
        id: DEmp.id,
        name: DEmp.name,
        is_available: DEmp.is_available,
      };
    }
  );

  const assignOrderHandler = async (DID) => {
    assignOrder(DID);
  };

  useEffect(() => {
    if (assignOrderOpened) {
      refetch();
    }
  }, [assignOrderOpened]);
  return (
    <>
      {assignOrderOpened && (
        <>
          <div className="absolute  w-full h-full bg-black opacity-30 z-20" />
          <div
            className={`bg-white text-sm sm:text-base text-(--primaryFont)  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  absolute w-[90%] sm:w-[50%] h-fit rounded-md  z-30`}
          >
            <header
              className="text-sm p-8 border-b-2 border-(--border-color) pb-4 sm:text-lg flex justify-between
              font-bold mb-5"
            >
              Available Delivery Employees
              <X
                className="transition-all hover:brightness-20 cursor-pointer"
                size={30}
                onClick={() => dispatch(openAssignOrder(false))}
              />
            </header>{" "}
            {availableDeliveryEmpIsLoading ? (
              <AssignOrderSkeleton />
            ) : delieveryEmp?.length > 0 ? (
              <div className="  overflow-hidden max-h-[500px]  hover:overflow-y-scroll custom-scrollbar">
                {delieveryEmp.map((DEmp) => (
                  <div
                    key={DEmp.id}
                    className="px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)"
                  >
                    <div className="flex items-center gap-3 ">
                      <img
                        src="/person.png"
                        className="w-30 h-30 rounded-full"
                        alt=""
                      />
                      <h1 className="font-bold  mt-5">{DEmp.name}</h1>
                    </div>
                    <div className="flex flex-col mt-5 lg:mt-0 lg:flex-row gap-3 justify-end">
                      <LoadingButton
                        isButton={true}
                        btnClass={`basic-1/2 cursor-pointer  h-10 text-base `}
                        loadingText="Assigning..."
                        text="Assign Order"
                        disabled={assignOrderIsLoading}
                        click={() => {
                          assignOrderHandler(DEmp.id, "assign");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-2 py-4">
                <EmptySection
                  message={"There is no Delivery Employees"}
                  title={"Delivery Employees"}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AssignOrder;
