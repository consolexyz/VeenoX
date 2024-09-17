"use client";
import { usePathname } from "next/navigation";
import { Header } from "../header";
import { LandingHeader } from "../landing-header";

export const DynamicHeader = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return isHomePage ? <LandingHeader /> : <Header />;
};
