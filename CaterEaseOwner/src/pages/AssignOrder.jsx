import { useDispatch, useSelector } from "react-redux";
import { assignOrder, openAssignOrder } from "../store/orderSlice";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AssignOrder = () => {
  const { assignOrderOpened } = useSelector((state) => state.order);
  const dispatch = useDispatch();

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
            <div className="  overflow-hidden max-h-[400px]  hover:overflow-y-scroll custom-scrollbar">
              <div className="flex px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)">
                <div className="flex gap-3 items-start">
                  <img
                    src="/person.png"
                    className="w-30 h-30 rounded-full"
                    alt=""
                  />
                  <h1 className="font-bold mt-5">Jaylon Calzoni</h1>
                </div>
                <div className="self-end">
                  <Button
                    type="submit"
                    className={`w-full cursor-pointer  h-10 text-base `}
                    onClick={() => {
                      dispatch(assignOrder(true));
                      dispatch(openAssignOrder(false));
                    }}
                  >
                    Assign Order
                  </Button>
                </div>
              </div>
              <div className="flex px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)">
                <div className="flex gap-3 items-start">
                  <img
                    src="/person.png"
                    className="w-30 h-30 rounded-full"
                    alt=""
                  />
                  <h1 className="font-bold mt-5">Jaylon Calzoni</h1>
                </div>
                <div className="self-end">
                  <Button
                    type="submit"
                    className={`w-full cursor-pointer  h-10 text-base `}
                  >
                    Assign Order
                  </Button>
                </div>
              </div>
              <div className="flex px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)">
                <div className="flex gap-3 items-start">
                  <img
                    src="/person.png"
                    className="w-30 h-30 rounded-full"
                    alt=""
                  />
                  <h1 className="font-bold mt-5">Jaylon Calzoni</h1>
                </div>
                <div className="self-end">
                  <Button
                    type="submit"
                    className={`w-full cursor-pointer  h-10 text-base `}
                  >
                    Assign Order
                  </Button>
                </div>
              </div>
              <div className="flex px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)">
                <div className="flex gap-3 items-start">
                  <img
                    src="/person.png"
                    className="w-30 h-30 rounded-full"
                    alt=""
                  />
                  <h1 className="font-bold mt-5">Jaylon Calzoni</h1>
                </div>
                <div className="self-end">
                  <Button
                    type="submit"
                    className={`w-full cursor-pointer  h-10 text-base `}
                  >
                    Assign Order
                  </Button>
                </div>
              </div>
              <div className="flex px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)">
                <div className="flex gap-3 items-start">
                  <img
                    src="/person.png"
                    className="w-30 h-30 rounded-full"
                    alt=""
                  />
                  <h1 className="font-bold mt-5">Jaylon Calzoni</h1>
                </div>
                <div className="self-end">
                  <Button
                    type="submit"
                    className={`w-full cursor-pointer  h-10 text-base `}
                  >
                    Assign Order
                  </Button>
                </div>
              </div>
              <div className="flex px-5 py-5 mx-4 my-5 border-2 border-(--border-color) rounded-md  justify-between text-(--primaryFont)">
                <div className="flex gap-3 items-start">
                  <img
                    src="/person.png"
                    className="w-30 h-30 rounded-full"
                    alt=""
                  />
                  <h1 className="font-bold mt-5">Jaylon Calzoni</h1>
                </div>
                <div className="self-end">
                  <Button
                    type="submit"
                    className={`w-full cursor-pointer  h-10 text-base `}
                  >
                    Assign Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AssignOrder;
