import { useDispatch, useSelector } from "react-redux";
import { openAssignOrder } from "../store/orderSlice";
import { X } from "lucide-react";
import {
  useAllDeliveryEmpQuery,
  useAssignOrderMutation,
} from "../store/apiSlice/apiSlice";
import { useEffect, useState } from "react";
import { AssignOrderSkeleton } from "../components/skeleton/AssginOrderSkeleton";
import { toast } from "sonner";
import LoadingButton from "../components/LoadingButton";
import EmptySection from "../components/EmptySection";

const AssignOrder = ({ orderID }) => {
  const { assignOrderOpened } = useSelector((state) => state.order);
  const [btnState1, setBtnState1] = useState(null);
  const [btnState2, setBtnState2] = useState(null);
  const [action, setAction] = useState(null);

  const dispatch = useDispatch();

  const {
    data: allDeliveryEmpResponse,
    isLoading: availableDeliveryEmpIsLoading,
    refetch,
  } = useAllDeliveryEmpQuery(undefined, {
    skip: !assignOrderOpened,
  });
  const [assignOrder, { isLoading: assignOrderIsLoading }] =
    useAssignOrderMutation(undefined, {
      skip: !assignOrderOpened,
    });

  const delieveryEmp = allDeliveryEmpResponse?.map((DEmp) => {
    return {
      id: DEmp.id,
      name: DEmp.name,
      is_available: DEmp.is_available,
    };
  });

  const assignOrderHandler = async (DID, action) => {
    setBtnState1(DID);
    setBtnState2(DID);
    setAction(action);
    try {
      const response = await assignOrder({
        order_id: orderID,
        delivery_person_id: DID,
        action,
      }).unwrap();
      toast.success(
        `${
          action === "assign"
            ? "Order has been assigned to delivery employee"
            : "Order has been unassigned to delivery employee"
        }`,
        {
          style: {
            background: "white",
            color: "#A1CA46",
            border: "1px solid hsl(var(--border))",
          },
        }
      );
      console.log(response.message);
    } catch (error) {
      toast.success(error?.data?.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
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
                      {DEmp.is_available === "available" && (
                        <LoadingButton
                          isButton={true}
                          btnClass={`basic-1/2 cursor-pointer  h-10 text-base `}
                          loadingText="Assigning..."
                          text="Assign Order"
                          disabled={
                            assignOrderIsLoading &&
                            btnState1 === DEmp.id &&
                            action === "assign"
                          }
                          click={() => {
                            assignOrderHandler(DEmp.id, "assign");
                          }}
                        />
                      )}
                      {DEmp.is_available === "unavailable" && (
                        <LoadingButton
                          variant="destructive"
                          isButton={true}
                          btnClass={`basic-1/2 cursor-pointer  h-10 text-base `}
                          loadingText="removing..."
                          text="Remove Assigning"
                          disabled={
                            assignOrderIsLoading &&
                            btnState2 === DEmp.id &&
                            action === "unassign"
                          }
                          click={() => {
                            assignOrderHandler(DEmp.id, "unassign");
                          }}
                        />
                      )}
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
