import { useCustomLeverage } from "@/hook/useLeverage";
import { cn } from "@/utils/cn";
import { LeverageEditor } from "./editor";

type LeverageContentType = {
  className?: string;
};

export const LeverageContent = ({ className }: LeverageContentType) => {
  const { onSave } = useCustomLeverage();
  return (
    <div className={cn("flex flex-col mt-5", className)}>
      <p className="text-xs text-font-60 mb-1">
        Note that setting a higher leverage increases the risk of liquidation.
      </p>
      <LeverageEditor onSave={onSave} />
    </div>
  );
};
