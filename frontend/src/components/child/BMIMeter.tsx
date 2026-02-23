"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

// BMI Categories untuk anak (berdasarkan WHO BMI-for-age)
const BMI_ZONES = [
  {
    label: "Gizi Buruk",
    labelShort: "Buruk",
    range: "< 14.0",
    color: "#DC2626",
    bgColor: "bg-red-500",
    bgLight: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    min: 0,
    max: 14.0,
  },
  {
    label: "Gizi Kurang",
    labelShort: "Kurang",
    range: "14.0 – 15.9",
    color: "#F97316",
    bgColor: "bg-orange-400",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    min: 14.0,
    max: 16.0,
  },
  {
    label: "Normal",
    labelShort: "Normal",
    range: "16.0 – 18.4",
    color: "#22C55E",
    bgColor: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    min: 16.0,
    max: 18.5,
  },
  {
    label: "Gizi Lebih",
    labelShort: "Lebih",
    range: "18.5 – 19.9",
    color: "#EAB308",
    bgColor: "bg-yellow-400",
    bgLight: "bg-yellow-50",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    min: 18.5,
    max: 20.0,
  },
  {
    label: "Obesitas",
    labelShort: "Obesitas",
    range: "≥ 20.0",
    color: "#7C3AED",
    bgColor: "bg-violet-500",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    borderColor: "border-violet-200",
    min: 20.0,
    max: 30.0,
  },
];

function getBMICategory(bmi: number) {
  for (const zone of BMI_ZONES) {
    if (bmi < zone.max) return zone;
  }
  return BMI_ZONES[BMI_ZONES.length - 1];
}

// Normalize BMI to a 0-100% position on the meter (clamped 10-30 range)
function bmiToPercent(bmi: number): number {
  const MIN_BMI = 10;
  const MAX_BMI = 28;
  const clamped = Math.min(Math.max(bmi, MIN_BMI), MAX_BMI);
  return ((clamped - MIN_BMI) / (MAX_BMI - MIN_BMI)) * 100;
}

interface BMIMeterProps {
  weightKg: number | null;
  heightCm: number | null;
  compact?: boolean;
}

export default function BMIMeter({
  weightKg,
  heightCm,
  compact = false,
}: BMIMeterProps) {
  const bmiData = useMemo(() => {
    if (!weightKg || !heightCm || heightCm <= 0) return null;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const category = getBMICategory(bmi);
    const percent = bmiToPercent(bmi);

    return { bmi: Math.round(bmi * 10) / 10, category, percent };
  }, [weightKg, heightCm]);

  if (!bmiData) {
    return (
      <div className="bg-slate-50/50 rounded-[20px] p-4 md:p-5 border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Indeks Massa Tubuh
          </span>
        </div>
        <p className="text-[9px] text-slate-300 font-bold text-center py-3 uppercase">
          Butuh data BB & TB untuk menghitung BMI
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] md:rounded-[25px] p-4 md:p-5 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center",
              bmiData.category.bgLight,
            )}
          >
            <svg
              className={cn("w-3.5 h-3.5", bmiData.category.textColor)}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">
              BMI Anak
            </span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "text-lg font-black leading-none",
              bmiData.category.textColor,
            )}
          >
            {bmiData.bmi}
          </span>
          <span className="text-[8px] font-bold text-slate-400 ml-0.5">
            kg/m²
          </span>
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="relative mb-3">
        {/* Background Track */}
        <div className="h-3 rounded-full flex overflow-hidden gap-[2px]">
          {BMI_ZONES.map((zone, i) => (
            <div
              key={i}
              className="h-full flex-1 first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: zone.color, opacity: 0.2 }}
            />
          ))}
        </div>

        {/* Active Fill */}
        <div className="absolute inset-0 h-3 rounded-full flex overflow-hidden gap-[2px]">
          {BMI_ZONES.map((zone, i) => {
            const zoneStartPercent = bmiToPercent(zone.min);
            const zoneEndPercent = bmiToPercent(zone.max);
            const fillPercent = bmiData.percent;

            let opacity = 0;
            if (fillPercent >= zoneEndPercent) {
              opacity = 1;
            } else if (fillPercent > zoneStartPercent) {
              opacity =
                (fillPercent - zoneStartPercent) /
                (zoneEndPercent - zoneStartPercent);
            }

            return (
              <div
                key={i}
                className="h-full flex-1 first:rounded-l-full last:rounded-r-full transition-all duration-700"
                style={{
                  backgroundColor: zone.color,
                  opacity: opacity > 0 ? 0.3 + opacity * 0.7 : 0,
                }}
              />
            );
          })}
        </div>

        {/* Needle Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ left: `${bmiData.percent}%` }}
        >
          <div
            className="w-4 h-4 rounded-full border-[3px] border-white shadow-lg -ml-2"
            style={{ backgroundColor: bmiData.category.color }}
          />
        </div>
      </div>

      {/* Status Badge */}
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl mb-4",
          bmiData.category.bgLight,
        )}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: bmiData.category.color }}
        />
        <span
          className={cn(
            "text-[9px] font-black uppercase tracking-widest",
            bmiData.category.textColor,
          )}
        >
          {bmiData.category.label}
        </span>
      </div>

      {/* Legend */}
      <div
        className={cn(
          "border-t border-slate-50 pt-3",
          compact ? "space-y-1.5" : "space-y-2",
        )}
      >
        <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-2">
          Legenda BMI
        </p>
        <div className={cn("grid gap-1.5", compact ? "grid-cols-3" : "grid-cols-5")}>
          {BMI_ZONES.map((zone, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 p-1.5 rounded-lg transition-all",
                bmiData.category.label === zone.label
                  ? `${zone.bgLight} ${zone.borderColor} border`
                  : "bg-slate-50/50",
              )}
              style={
                bmiData.category.label === zone.label
                  ? { outline: `2px solid ${zone.color}`, outlineOffset: "1px" }
                  : {}
              }
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: zone.color }}
              />
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[7px] font-black uppercase leading-none truncate",
                    bmiData.category.label === zone.label
                      ? zone.textColor
                      : "text-slate-500",
                  )}
                >
                  {compact ? zone.labelShort : zone.label}
                </p>
                <p className="text-[6px] font-bold text-slate-300 leading-tight mt-0.5">
                  {zone.range}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
