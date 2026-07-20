"use client";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import {
  dayKeys,
  dayLabelsArabic,
  type DayKey,
  type StoreProfileInput,
} from "../lib/schemas";

type ProfileHoursSectionProps = {
  operatingHours: StoreProfileInput["operatingHours"];
  errors: Partial<Record<string, string>>;
  onHourChange: (
    day: DayKey,
    field: "openTime" | "closeTime",
    value: string,
  ) => void;
  onClosedToggle: (day: DayKey) => void;
};

export function ProfileHoursSection({
  operatingHours,
  errors,
  onHourChange,
  onClosedToggle,
}: ProfileHoursSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
      {/* Right Column: Title & Description */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <Heading level="md" className="text-[#003820] font-bold">
          ساعات العمل الرسمية
        </Heading>
        <Text
          variant="body-md"
          className="text-on-surface-variant leading-relaxed"
        >
          حدد مواعيد العمل الرسمية التي يتاح فيها متجرك لاستقبال طلبات
          المستهلكين وتسليم الفائض الغذائي.
        </Text>
      </div>

      {/* Left Column: Input Card */}
      <div className="lg:col-span-2">
        <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
          <Card.Body className="gap-stack-sm p-6">
            <div className="flex flex-col gap-3">
              {dayKeys.map((day) => {
                const hours = operatingHours[day];
                if (!hours) return null;

                const dayLabel = dayLabelsArabic[day];
                const dayError = errors[`hours_${day}`];

                return (
                  <div
                    key={day}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border transition-all ${
                      hours.closed
                        ? "bg-surface-container-low/50 border-outline-variant/40"
                        : "bg-surface-container-lowest border-outline-variant/60"
                    }`}
                  >
                    <span className="text-body-md font-semibold text-on-surface min-w-[100px]">
                      {dayLabel}
                    </span>

                    <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center justify-between sm:justify-end gap-3 sm:gap-6">
                      {!hours.closed ? (
                        <div className="flex items-center justify-between sm:justify-start gap-3 flex-1 sm:flex-none">
                          <input
                            type="time"
                            value={hours.openTime}
                            onChange={(e) =>
                              onHourChange(day, "openTime", e.target.value)
                            }
                            className="rounded-lg border border-outline-variant p-2 text-body-md text-on-surface bg-surface-container-lowest outline-none focus:border-[#003820] focus:ring-1 focus:ring-[#003820]/30 transition-all"
                          />
                          <span className="text-label-md text-outline font-medium">
                            إلى
                          </span>
                          <input
                            type="time"
                            value={hours.closeTime}
                            onChange={(e) =>
                              onHourChange(day, "closeTime", e.target.value)
                            }
                            className="rounded-lg border border-outline-variant p-2 text-body-md text-on-surface bg-surface-container-lowest outline-none focus:border-[#003820] focus:ring-1 focus:ring-[#003820]/30 transition-all"
                          />
                        </div>
                      ) : (
                        <div className="text-center py-2 bg-surface-container-high text-outline text-label-md font-bold rounded-lg border border-outline-variant/30 w-full sm:w-[204px]">
                          مغلق
                        </div>
                      )}

                      <label className="flex items-center justify-between sm:justify-end gap-2 cursor-pointer select-none mt-2 sm:mt-0">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={() => onClosedToggle(day)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003820]" />
                        <span
                          className={`text-label-md font-semibold ${!hours.closed ? "text-[#003820]" : "text-outline"}`}
                        >
                          {!hours.closed ? "مفتوح" : "مغلق"}
                        </span>
                      </label>
                    </div>
                    {dayError && (
                      <div className="text-label-md text-error font-semibold mt-1">
                        {dayError}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
