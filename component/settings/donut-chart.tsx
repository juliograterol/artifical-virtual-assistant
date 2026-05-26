"use client";

import React from "react";

type DonutItem = {
  label?: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutItem[];
  size?: number;
  thickness?: number;
  centerText?: string;
  showLegend?: boolean;
  className?: string;
};

export default function DonutChart({
  data,
  size = 220,
  thickness = 28,
  centerText,
  showLegend = true,
  className = "",
}: DonutChartProps) {
  // Limit to max 6 items
  const chartData = data.slice(0, 6);

  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  let currentAngle = 0;

  const gradients = chartData
    .map((item) => {
      const percentage = (item.value / total) * 100;

      const start = currentAngle;
      const end = currentAngle + percentage;

      currentAngle = end;

      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  const innerSize = size - thickness * 2;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full transition-all duration-500"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${gradients})`,
        }}
      >
        {/* Inner circle */}
        <div
          className="absolute flex items-center justify-center rounded-full bg-[#282828] text-center"
          style={{
            width: innerSize,
            height: innerSize,
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {centerText ?? `${total}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-sm text-white">
                {item.label ?? `Item ${index + 1}`} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
