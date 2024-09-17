import { Perp } from "@/feature/perp";
import { formatSymbol, getFormattedAmount } from "@/utils/misc";
import { Metadata, ResolvingMetadata } from "next";
import RealtimePriceTitleUpdater from "./useMarkPrice";

type ParamsProps = {
  params: {
    perp: string[];
  };
};

async function fetchAssetData({ params }: ParamsProps) {
  const options = { method: "GET" };

  const fetching = await fetch(
    `https://api-evm.orderly.org/v1/public/futures/${params?.perp?.[0]}`,
    options
  ).then((response) => response.json());
  if (fetching.error) throw new Error(fetching.error);
  return fetching;
}

export async function generateMetadata(
  { params }: ParamsProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data } = await fetchAssetData({ params });

  const formattedPrice = getFormattedAmount(data?.mark_price);
  const formattedSymbol = formatSymbol(data?.symbol || "PERP_BTC_USDC");

  const title = `${formattedPrice} | ${formattedSymbol} | VeenoX`;
  const description = `Trade ${formatSymbol(
    data?.symbol || "PERP_BTC_USDC",
    true
  )} on VeenoX - Current Price: $${
    data?.mark_price
  }. Experience low-fee perpetual trading on our cutting-edge DEX powered by Orderly Network and Monad. Get real-time market data, advanced charting tools, and seamless order execution. Enhance your trading skills with our 'Learn & Earn' program while enjoying industry-leading security. Start trading ${formatSymbol(
    data?.symbol || "PERP_BTC_USDC",
    true
  )} now and be part of the DeFi revolution with VeenoX.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

async function AssetPage({ params }: ParamsProps) {
  const { data } = await fetchAssetData({ params });

  const baseTitle = `${formatSymbol(data?.symbol || "PERP_BTC_USDC")} | VeenoX`;

  return (
    <>
      <RealtimePriceTitleUpdater
        symbol={params.perp[0]}
        baseTitle={baseTitle}
        initialPrice={data?.mark_price}
      />
      <Perp asset={data} />
    </>
  );
}

export default AssetPage;
