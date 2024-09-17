import { useLeverage } from "@orderly.network/hooks";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const useCustomLeverage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [maxLeverage, { update }] = useLeverage();
  const nextLeverage = useRef(maxLeverage ?? 0);

  const onSave = async (value: { leverage: number }) => {
    if (value.leverage === maxLeverage) return;
    const id = toast.loading("Please wait...");
    update({ leverage: value.leverage })
      .then(
        () => {
          setShowPopup(false);
          toast.update(id, {
            render: "Max leverage updated",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        },
        (error: { message: string }) => {
          toast.update(id, {
            render: <p className="mb-1">{error.message}</p>,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      )
      .catch((err: { message: string }) => {
        toast.update(id, {
          render: <p className="mb-1">{err.message}</p>,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });

    return Promise.resolve().then(() => {
      nextLeverage.current = value.leverage;
    });
  };

  return { showPopup, setShowPopup, onSave };
};
