import dayjs from "@/lib/dayjs";

export function generateDateRange(startDate: Date, endDate: Date) {
  const dates: Date[] = [];
  let currentDate = dayjs(startDate);
  const lastDate = dayjs(endDate);

  while (
    currentDate.isBefore(lastDate) ||
    currentDate.isSame(lastDate, "day")
  ) {
    dates.push(currentDate.toDate());
    currentDate = currentDate.add(1, "day");
  }

  return dates;
}
