"use client";

import { z } from "zod";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";

export const priceTrendChartSchema = z.object({
  product: z.object({
    id: z.string().default(""),
    name: z.string().default("Product"),
    currentPrice: z.number().default(0),
  }),
  priceHistory: z.array(
    z.object({
      date: z.string().default(""),
      price: z.number().default(0),
    })
  ).default([]),
  lowestPrice: z.number().default(0),
  highestPrice: z.number().default(0),
  averagePrice: z.number().default(0),
  chartType: z.enum(["line", "area"]).optional(),
});

type PriceTrendChartProps = z.infer<typeof priceTrendChartSchema>;

export function PriceTrendChart({
  product,
  priceHistory = [],
  lowestPrice,
  highestPrice,
  averagePrice,
  chartType = "area",
}: PriceTrendChartProps) {
  const priceChange =
    priceHistory.length > 1
      ? product.currentPrice - priceHistory[priceHistory.length - 2].price
      : 0;

  const percentChange =
    priceHistory.length > 1
      ? ((priceChange / priceHistory[priceHistory.length - 2].price) * 100)
      : 0;

  const isGoodDeal = product.currentPrice <= averagePrice;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Price Trend Analysis</h2>
      </div>

      {/* Product Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-4xl font-bold text-blue-600">
              ${product.currentPrice.toFixed(2)}
            </p>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
              priceChange < 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {priceChange < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            {Math.abs(percentChange).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Lowest Price</p>
          <p className="text-2xl font-bold text-green-600">
            ${lowestPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Save ${(product.currentPrice - lowestPrice).toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Average Price</p>
          <p className="text-2xl font-bold text-blue-600">
            ${averagePrice.toFixed(2)}
          </p>
          {isGoodDeal && (
            <p className="text-xs text-green-600 font-medium mt-1">
              ✓ Below average!
            </p>
          )}
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Highest Price</p>
          <p className="text-2xl font-bold text-red-600">
            ${highestPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          90-Day Price History
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "area" ? (
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                formatter={(value: any) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                formatter={(value: any) => [`$${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Deal Alert */}
      {isGoodDeal && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-3">
            <TrendingDown className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg">Great Deal Alert!</p>
            <p className="text-sm text-green-50">
              This price is below the 90-day average. It's a good time to buy!
            </p>
          </div>
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
