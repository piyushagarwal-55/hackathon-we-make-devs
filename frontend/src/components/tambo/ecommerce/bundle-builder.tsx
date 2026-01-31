"use client";

import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { Package, Plus, Percent, Sparkles } from "lucide-react";
// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/bundle/300/300";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/bundle/300/300";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/bundle/300/300";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/bundle/300/300";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/bundle/300/300";
  }
};
export const bundleBuilderSchema = z.object({
  mainProduct: z.object({
    id: z.string().default(""),
    name: z.string().default("Main Product"),
    price: z.number().default(0),
    image: z.string().default("https://picsum.photos/seed/main/300/300"),
  }),
  suggestedItems: z.array(
    z.object({
      id: z.string().default(""),
      name: z.string().default("Item"),
      price: z.number().default(0),
      image: z.string().default("https://picsum.photos/seed/bundle/200/200"),
      category: z.string().default("Accessory"),
    })
  ).default([]),
  discountPercent: z.number().default(15),
});

type BundleBuilderProps = z.infer<typeof bundleBuilderSchema>;

export function BundleBuilder({
  mainProduct,
  suggestedItems = [],
  discountPercent = 15,
}: BundleBuilderProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedProducts = suggestedItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  const subtotal = mainProduct.price + selectedProducts.reduce((sum, item) => sum + item.price, 0);
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal - discount;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Bundle Builder</h2>
        <div className="ml-auto bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
          <Percent className="w-4 h-4" />
          Save {discountPercent}%
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Product (Always Included) */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Main Item
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="relative w-full aspect-square mb-3">
                <Image
                  src={getValidImageUrl(mainProduct.image)}
                  alt={mainProduct.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="font-semibold text-gray-900 mb-1">
                {mainProduct.name}
              </p>
              <p className="text-lg font-bold text-indigo-600">
                ${mainProduct.price.toFixed(2)}
              </p>
              <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold text-center">
                ✓ Included
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Add-ons */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">
            Complete Your Bundle
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {suggestedItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`border-2 rounded-lg p-4 text-left transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={getValidImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.category}
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Plus className="w-4 h-4 text-white rotate-45" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bundle Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-lg text-gray-900">Bundle Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Items ({selectedProducts.length + 1})
            </span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Bundle Discount ({discountPercent}%)</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">
                ${total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                You save ${discount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          Add Bundle to Cart
        </button>
      </div>
    </div>
  );
}
