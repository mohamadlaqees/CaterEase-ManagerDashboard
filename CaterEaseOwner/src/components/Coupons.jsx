import TableComponent from "./TableComponent";
import { openCouponsList } from "../store/customersSlice";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";

const Coupons = ({ couponsList }) => {
  const dispatch = useDispatch();
  const tableHeader = [
    {
      name: "Code",
      key: "code",
    },
    {
      name: "Discount Amount",
      key: "discount_amount",
    },
    {
      name: "Number Of Used",
      key: "used",
    },
    {
      name: "Expiration Date",
      key: "expiration_date",
    },
  ];
  const tableBody = couponsList?.map((coupon) => {
    return {
      code: coupon.code,
      discount_amount: coupon.discount_amount,
      used: coupon.used,
      expiration_date: coupon.expiration_date,
    };
  });
  return (
    <>
      <div className="absolute  w-full h-full bg-black opacity-30 z-20" />
      <div
        className={`bg-white text-sm sm:text-base text-(--primaryFont) p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  absolute w-[90%]   h-fit rounded-md  z-30`}
      >
        <header
          className="text-sm sm:text-lg flex justify-between
                      font-bold mb-5"
        >
          Coupons List
          <X
            className="transition-all hover:brightness-20 cursor-pointer"
            size={30}
            onClick={() => {
              dispatch(openCouponsList(false));
            }}
          />
        </header>{" "}
        <TableComponent tableBody={tableBody} tableHeader={tableHeader} />
      </div>
    </>
  );
};

export default Coupons;
