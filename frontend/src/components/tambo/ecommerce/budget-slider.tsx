"use client";

import { z } from "zod";
import { useState } from "react";
import { DollarSign } from "lucide-react";

export const budgetSliderSchema = z.object({
  minPrice: z.number(),
  maxPrice: z.number(),
  currentMin: z.number().optional(),
  currentMax: z.number().optional(),
  matchingProducts: z.number().optional(),
  presets: z
    .array(
      z.object({
        label: z.string(),
        min: z.number(),
        max: z.number(),
      })
    )
    .optional(),
});

type BudgetSliderProps = z.infer<typeof budgetSliderSchema>;

export function BudgetSlider({
  minPrice,
  maxPrice,
  currentMin = minPrice,
  currentMax = maxPrice,
  matchingProducts = 0,
  presets = [
    { label: "Budget", min: 0, max: 50 },
    { label: "Mid-range", min: 50, max: 100 },
    { label: "Premium", min: 100, max: 200 },
    { label: "Luxury", min: 200, max: 500 },
  ],
}: BudgetSliderProps) {
  const [rangeMin, setRangeMin] = useState(currentMin);
  const [rangeMax, setRangeMax] = useState(currentMax);

  const handlePresetClick = (preset: { min: number; max: number }) => {
    setRangeMin(preset.min);
    setRangeMax(preset.max);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Budget Filter</h2>
      </div>

      {/* Price Display */}
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Min Price</p>
          <p className="text-3xl font-bold text-green-600">
            ${rangeMin.toFixed(0)}
          </p>
        </div>
        <div className="text-2xl text-gray-400">—</div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Max Price</p>
          <p className="text-3xl font-bold text-green-600">
            ${rangeMax.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="space-y-4">
        <div className="relative pt-6">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={rangeMin}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < rangeMax) setRangeMin(value);
            }}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{ zIndex: rangeMin > rangeMax - 10 ? 5 : 3 }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={rangeMax}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > rangeMin) setRangeMax(value);
            }}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <p className="font-semibold text-gray-900">{preset.label}</p>
            <p className="text-xs text-gray-500">
              ${preset.min}-${preset.max}
            </p>
          </button>
        ))}
      </div>

      {/* Matching Products */}
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-lg">
          <span className="font-bold text-blue-600">{matchingProducts}</span>{" "}
          <span className="text-gray-700">
            products match your budget
          </span>
        </p>
      </div>

      {/* Apply Button */}
      <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
        Apply Filter
      </button>
    </div>
  );
}
