import dayjs from "dayjs";

export function getSomeDisabledDates(format: string): string {
  if (format) {
    return `["${dayjs().add(-1, "day").format(format)}", "${dayjs().format(format)}", "${dayjs().add(1, "day").format(format)}"]`;
  }

  return `["date#1 in your format", "date#2 in your format"]`;
}

export function getSomeDisabledDateTimes(format: string): string {
  if (format) {
    return `["${dayjs().add(-1, "day").set("hour", 1).set("minute", 0).set("second", 0).format(format)}", "${dayjs().set("hour", 1).set("minute", 30).set("second", 0).format(format)}", "${dayjs().add(1, "day").set("hour", 2).set("minute", 0).set("second", 0).format(format)}"]`;
  }

  return `["date#1 in your format", "date#2 in your format"]`;
}
