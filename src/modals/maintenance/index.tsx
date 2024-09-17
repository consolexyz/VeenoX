import { Dialog, DialogContent } from "@/lib/shadcn/dialog";
import { MaintenanceType } from "@/models";
import { useQuery } from "@orderly.network/hooks";
import { useEffect, useState } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const MaintenanceStatusModal = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { data: maintenance } = useQuery<MaintenanceType>(
    "https://api-evm.orderly.org/v1/public/system_info"
  );
  const [open, setOpen] = useState(maintenance?.status === 2);

  useEffect(() => {
    if (maintenance?.status === 0) return;
    if (maintenance?.scheduled_maintenance) {
      const calculateTimeRemaining = (): TimeRemaining => {
        const now = Date.now();
        const startTimeMs = maintenance?.scheduled_maintenance?.startTime || 0;
        const endTimeMs = maintenance?.scheduled_maintenance?.endTime || 0;

        let totalSeconds = 0;
        if (now < startTimeMs) {
          totalSeconds = Math.max(0, Math.floor((startTimeMs - now) / 1000));
        } else if (now < endTimeMs) {
          totalSeconds = Math.max(0, Math.floor((endTimeMs - now) / 1000));
        }

        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { days, hours, minutes, seconds };
      };

      setTimeRemaining(calculateTimeRemaining());

      const timer = setInterval(() => {
        const remaining = calculateTimeRemaining();
        setTimeRemaining(remaining);
        if (
          remaining.days === 0 &&
          remaining.hours === 0 &&
          remaining.minutes === 0 &&
          remaining.seconds === 0
        ) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const isMaintenanceOngoing =
    timeRemaining.days > 0 ||
    timeRemaining.hours > 0 ||
    timeRemaining.minutes > 0 ||
    timeRemaining.seconds > 0;

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-[360px] w-[90%] flex flex-col gap-4 overflow-auto no-scrollbar"
        close={() => {
          setOpen(false);
        }}
      >
        <div className="text-center text-xl font-semibold">
          {isMaintenanceOngoing
            ? "System under maintenance"
            : "Maintenance completed"}
        </div>
        <div className="flex flex-col items-center justify-center">
          {isMaintenanceOngoing ? (
            <p className="text-base text-font-60 mb-5">Maintenance end in:</p>
          ) : null}
          <div className="flex gap-4 font-bold text-xl">
            {(isMaintenanceOngoing
              ? Object.values(timeRemaining)
              : ["L", "I", "V", "E"]
            )?.map((time, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-[55px] h-[55px] rounded-lg bg-terciary"
              >
                {typeof time === "string" ? (
                  <p>{time}</p>
                ) : (
                  <p>{time >= 10 ? time : `0${time}`}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
