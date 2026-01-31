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
      id: z.string().default(""),
      name: z.string().default("Product"),
      price: z.number().default(0),
      image: z.string().default("https://picsum.photos/seed/default/200/200"),
      features: z.array(
        z.object({
          key: z.string(),
          value: z.union([z.string(), z.boolean(), z.number()]),
        })
      ).default([]),
    })
  ).default([]),
  title: z.string().optional(),
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
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
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
