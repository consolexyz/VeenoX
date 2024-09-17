"use client";
import { formatSymbol, getFormattedAmount } from "@/utils/misc";
import { useMarketsStream } from "@orderly.network/hooks";
import {
  MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import React from "react";

export const HeroParallax = () => {
  const { data } = useMarketsStream();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 0", "1.2 1"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 500]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -500]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.35], [0.3, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-700, -100]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-fit pt-[200px] pb-[50px] overflow-hidden bg-[#15171b] antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header assetsNumber={data?.length || 0} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-10">
          {data
            // @ts-ignore
            ?.sort((a, b) => b["24h_amount"] - a["24h_amount"])
            ?.filter((_, i) => i < 8)
            .map((asset) => (
              <AssetCard
                asset={asset}
                translate={translateX}
                key={asset.symbol}
              />
            ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 space-x-20 -ml-[200px]">
          {data
            // @ts-ignore
            ?.sort((a, b) => b["24h_amount"] - a["24h_amount"])
            ?.filter((_, i) => i >= 8 && i < 16)
            .map((asset) => (
              <AssetCard
                asset={asset}
                translate={translateXReverse}
                key={asset.symbol}
              />
            ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {data
            // @ts-ignore
            ?.sort((a, b) => b["24h_amount"] - a["24h_amount"])
            ?.filter((_, i) => i >= 16 && i < 24)
            .map((asset) => (
              <AssetCard
                asset={asset}
                translate={translateX}
                key={asset.symbol}
              />
            ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ assetsNumber }: { assetsNumber: number }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full z-10 left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-white font-gramatika">
        Begin your <br />
        decentralized <br />
        trading journey now
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-white font-hoves-pro-bold">
        Dive into the world of high-volume perpetual trading with access to{" "}
        {assetsNumber} diverse assets. Experience seamless, professional-grade
        trading on our cutting-edge platform designed for both novice and expert
        traders alike.
      </p>
    </div>
  );
};

export const AssetCard = ({
  asset,
  translate,
}: {
  asset: any;
  translate: MotionValue<number>;
}) => {
  const getPercentageChange = (): number => {
    const change =
      (asset?.["24h_close"] - asset?.["24h_open"]) / asset?.["24h_open"];
    return change * 100;
  };
  const dailyChange = getPercentageChange();

  const getContentForChange = () => {
    if (dailyChange > 0)
      return {
        change: `+${dailyChange.toFixed(2)}%`,
        color: "text-green",
        bg: "bg-green-opacity-20",
      };
    else if (dailyChange < 0)
      return {
        change: `${dailyChange.toFixed(2)}%`,
        color: "text-red",
        bg: "bg-red-opacity-20",
      };
    else
      return {
        change: `${dailyChange.toFixed(2)}%`,
        color: "text-font-80",
        bg: "bg-[rgba(255,255,255,0.4)]",
      };
  };

  const changeContent = getContentForChange();

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={asset.title}
      className="group/product h-[250px] w-[25rem] relative flex-shrink-0 overflox-hidden"
    >
      <Link
        href={"asset.url"}
        className="block group-hover/product:shadow-2xl group-hover/product:shadow-black "
      >
        <div
          className="flex p-8 flex-col backdrop-filter backdrop-blur-lg w-[450px] bg-line bg-cover bg-center shadow-xl
         shadow-[rgba(0,0,0,0.2)] rounded-[40px] h-[260px] border-2 border-borderColor-DARK object-cover object-left-top absolute inset-0 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full ">
              <img
                width="80"
                height="80"
                className={`object-cover border border-borderColor shadow-xl shadow-[rgba(0,0,0,0.2)] w-[80px] h-[80px] rounded-full`}
                src={`https://oss.orderly.network/static/symbol_logo/${formatSymbol(
                  asset?.symbol,
                  true
                )}.png`}
                alt={`${asset.title} image`}
                // onError={() => setHasError(true)}
              />
              <div className="ml-5">
                <p className="font-bold text-white text-2xl text-Poppins">
                  {formatSymbol(asset?.symbol, true)}
                </p>{" "}
                <div
                  className={`${changeContent.bg} rounded-lg mt-2 w-fit px-1.5 py-0.5 flex items-center justify-center`}
                >
                  <p
                    className={`font-medium ${changeContent.color} text-lg text-Poppins`}
                  >
                    {changeContent.change}
                  </p>{" "}
                </div>
              </div>
            </div>
            <p className="text-2xl text-white font-bold">{asset.mark_price}</p>
          </div>

          <div className="flex flex-col mt-auto">
            <p className="text-lg text-font-60 font-medium">24h Volume</p>
            <p className="text-2xl text-white font-bold">
              ${getFormattedAmount(asset["24h_amount"])}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
