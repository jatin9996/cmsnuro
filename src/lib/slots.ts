export type SlotSettings = {
  dayStart: string;
  dayEnd: string;
  lunchStart: string;
  lunchEnd: string;
  slotMinutes: number;
  closedWeekdays: string;
};

export type Slot = { time: string; available: boolean };

function toMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function fromMinutes(value: number) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function weekdayIndex(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

export function isClosedDay(settings: SlotSettings, date: string) {
  const closed = settings.closedWeekdays.split(",").map((item) => item.trim()).filter(Boolean);
  return closed.includes(String(weekdayIndex(date)));
}

export function isPastSlot(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute).getTime() <= Date.now();
}

export function buildSlots(settings: SlotSettings, date: string, taken: string[]): Slot[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isClosedDay(settings, date)) return [];
  const start = toMinutes(settings.dayStart);
  const end = toMinutes(settings.dayEnd);
  const lunchStart = toMinutes(settings.lunchStart);
  const lunchEnd = toMinutes(settings.lunchEnd);
  const step = Math.min(180, Math.max(10, settings.slotMinutes || 30));
  const slots: Slot[] = [];
  for (let cursor = start; cursor + step <= end; cursor += step) {
    if (cursor >= lunchStart && cursor < lunchEnd) continue;
    const time = fromMinutes(cursor);
    slots.push({ time, available: !isPastSlot(date, time) && !taken.includes(time) });
  }
  return slots;
}
