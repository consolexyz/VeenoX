import { cn } from "@/utils/cn";

type LoaderType = {
  className?: string;
};

export const Loader = ({ className = "" }: LoaderType) => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      preload="auto"
      controlsList="nodownload nofullscreen noremoteplayback"
      className={cn("w-[80px] pointer-events-none", className)}
    >
      <source src="/loader/load.mp4" type="video/mp4" />
      Loading...
    </video>
  );
};
