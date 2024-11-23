import { TimeDurationUnit } from "@kickoffbot.com/types";

export function getParkTimeInMinutes(parkTime: number, unit: TimeDurationUnit): number {
  switch (unit) {
    case TimeDurationUnit.DAYS:
      return Number(parkTime) * 1440;
    case TimeDurationUnit.MINUTES:
      return Number(parkTime);
    case TimeDurationUnit.HOURS:
      return Number(parkTime) * 60;
    default:
      throw new Error("NotImplementedError: " + unit);
  }
}
