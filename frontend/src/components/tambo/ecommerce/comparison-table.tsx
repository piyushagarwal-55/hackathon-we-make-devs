"use client";

import { z } from "zod";
import Image from "next/image";
import { Check, X, ShoppingCart } from "lucide-react";
// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/default/200/200";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/default/200/200";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/default/200/200";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/default/200/200";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/default/200/200";
  }
};
export const comparisonTableSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().nullable().default(""),
      name: z.string().nullable().default("Product"),
      price: z.number().nullable().default(0),
      image: z.string().nullable().default("https://picsum.photos/seed/default/200/200"),
      features: z.array(
        z.object({
          key: z.string().nullable().default(""),
          value: z.union([z.string(), z.boolean(), z.number()]).nullable().default(""),
        })
      ).nullable().default([]),
    })
  ).nullable().default([]),
  title: z.string().nullable().optional(),
});

type ComparisonTableProps = z.infer<typeof comparisonTableSchema>;

export function ComparisonTable({
  products = [],
  title = "Product Comparison",
}: ComparisonTableProps) {
  // Get all unique feature keys from the array-based structure
  const allFeatures = Array.from(
    new Set(products.flatMap((p) => p.features.map((f) => f.key)))
  );

  const renderFeatureValue = (value: string | boolean | number | undefined) => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">-</span>;
    }
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-600 mx-auto" />
      );
    }
    return <span>{value}</span>;
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xl">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left font-semibold text-gray-700 border-b">
                Feature
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-4 border-b">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-24 h-24">
                      <Image
                        src={getValidImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 text-center">
                      {product.name}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, idx) => (
              <tr
                key={feature}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-4 font-medium text-gray-700 border-b capitalize">
                  {feature.replace(/([A-Z])/g, " $1").trim()}
                </td>
                {products.map((product) => {
                  const featureObj = product.features.find((f) => f.key === feature);
                  return (
                    <td
                      key={product.id}
                      className="p-4 text-center text-gray-600 border-b"
                    >
                      {renderFeatureValue(featureObj?.value)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-blue-50">
              <td className="p-4 font-semibold text-gray-700">Action</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                    <ShoppingCart className="w-4 h-4" />
                    Select
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
