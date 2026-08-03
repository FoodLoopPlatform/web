import { z } from "zod";

export const dayKeys = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export type DayKey = (typeof dayKeys)[number];

export const dayLabelsArabic: Record<DayKey, string> = {
  saturday: "السبت",
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
};

export type DayHours = { openTime: string; closeTime: string; closed: boolean };

export type OperatingHours = Record<DayKey, DayHours>;

export const defaultOperatingHours: OperatingHours = {
  saturday: { openTime: "09:00", closeTime: "22:00", closed: false },
  sunday: { openTime: "09:00", closeTime: "22:00", closed: false },
  monday: { openTime: "09:00", closeTime: "22:00", closed: false },
  tuesday: { openTime: "09:00", closeTime: "22:00", closed: false },
  wednesday: { openTime: "09:00", closeTime: "22:00", closed: false },
  thursday: { openTime: "09:00", closeTime: "22:00", closed: false },
  friday: { openTime: "09:00", closeTime: "22:00", closed: true },
};

const dayHoursSchema = z.object({
  openTime: z.string(),
  closeTime: z.string(),
  closed: z.boolean(),
});

export const operatingHoursSchema = z.object({
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
});

/** Serializes operating hours to the plain string PATCH /stores/me expects for `openingHours`. */
export function serializeOperatingHours(hours: OperatingHours): string {
  return JSON.stringify(hours);
}

/** Parses the `openingHours` string back into structured hours; falls back to defaults on bad input. */
export function parseOperatingHours(
  raw: string | null | undefined,
): OperatingHours {
  if (!raw) return defaultOperatingHours;
  try {
    const parsed = JSON.parse(raw);
    return dayKeys.every((day) => parsed?.[day])
      ? (parsed as OperatingHours)
      : defaultOperatingHours;
  } catch {
    return defaultOperatingHours;
  }
}
