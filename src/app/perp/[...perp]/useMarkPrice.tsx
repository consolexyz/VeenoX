"use client";

import { getFormattedAmount } from "@/utils/misc";
import { useMarkPrice } from "@orderly.network/hooks";
import { useCallback, useEffect, useRef } from "react";

type RealTimePriceType = {
  symbol: string;
  baseTitle: string;
  initialPrice: number;
};

const RealtimePriceTitleUpdater = ({
  symbol,
  baseTitle,
  initialPrice,
}: RealTimePriceType) => {
  const markPrice = useMarkPrice(symbol);
  const initialRender = useRef(true);

  const updateTitle = useCallback(
    (price: number) => {
      if (price && price !== 0) {
        const formattedPrice = getFormattedAmount(price);
        document.title = `${formattedPrice} | ${baseTitle}`;
      }
    },
    [baseTitle]
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (initialRender.current) {
      updateTitle(initialPrice);
      initialRender.current = false;
    } else if (markPrice?.data && markPrice.data !== 0) {
      timeoutId = setTimeout(() => updateTitle(markPrice.data), 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [markPrice, updateTitle, initialPrice]);

  return null;
};

export default RealtimePriceTitleUpdater;
