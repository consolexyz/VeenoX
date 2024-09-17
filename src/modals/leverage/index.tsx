"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { useLeverage, useMarginRatio } from "@orderly.network/hooks";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { LeverageContent } from "./leverage";

export const Leverage = () => {
  const { currentLeverage } = useMarginRatio();
  const [showPopup, setShowPopup] = useState(false);
  const [maxLeverage] = useLeverage();

  return (
    <Dialog open={showPopup}>
      <DialogTrigger onClick={() => setShowPopup(true)}>
        <button className="text-white flex flex-col justify-center items-end">
          <p className="text-font-60 text-xs mb-[3px]">Account Leverage</p>
          <div className="flex items-center text-sm text-white hover:text-base_color transition-color duration-150 ease-in-out">
            <p>{currentLeverage.toFixed(2)}x</p>/ <p>{maxLeverage}x</p>{" "}
            <FaRegEdit className="ml-2" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[450px] w-[90%] flex flex-col gap-0 overflow-auto no-scrollbar"
        close={() => {
          setShowPopup(false);
        }}
      >
        <DialogHeader className="text-xl">Edit Max Leverage</DialogHeader>
        <LeverageContent />
      </DialogContent>
    </Dialog>
  );
};
