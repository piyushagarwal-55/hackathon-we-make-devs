"use client";

import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { Shirt, ShoppingBag, Palette } from "lucide-react";
// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/outfit/200/200";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/outfit/200/200";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/outfit/200/200";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/outfit/200/200";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/outfit/200/200";
  }
};
export const outfitBoardSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().default("Category"),
      items: z.array(
        z.object({
          id: z.string().default(""),
          name: z.string().default("Item"),
          image: z.string().default("https://picsum.photos/seed/outfit/200/200"),
          price: z.number().default(0),
        })
      ).default([]),
    })
  ).default([]),
  selectedOutfit: z
    .array(
      z.object({
        id: z.string().default(""),
        category: z.string().default(""),
        name: z.string().default("Item"),
        image: z.string().default("https://picsum.photos/seed/outfit/200/200"),
        price: z.number().default(0),
      })
    )
    .optional(),
});

type OutfitBoardProps = z.infer<typeof outfitBoardSchema>;

export function OutfitBoard({
  categories = [],
  selectedOutfit = [],
}: OutfitBoardProps) {
  const [outfit, setOutfit] = useState(selectedOutfit);

  const addToOutfit = (
    category: string,
    item: { id: string; name: string; image: string; price: number }
  ) => {
    // Remove existing item from same category
    const filtered = outfit.filter((i) => i.category !== category);
    setOutfit([...filtered, { ...item, category }]);
  };

  const removeFromOutfit = (id: string) => {
    setOutfit(outfit.filter((item) => item.id !== id));
  };

  const totalPrice = outfit.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="w-8 h-8 text-pink-600" />
        <h2 className="text-2xl font-bold text-gray-900">Outfit Board</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Outfit Display */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Outfit
            </h3>

            {outfit.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Shirt className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p>Start building your outfit</p>
              </div>
            ) : (
              <div className="space-y-3">
                {outfit.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm"
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={getValidImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <p className="text-sm font-semibold text-pink-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromOutfit(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {outfit.length > 0 && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Total ({outfit.length} items)
                  </span>
                  <span className="text-2xl font-bold text-pink-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors">
                  Save Outfit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Selections */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-900">
                {category.name}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {category.items.map((item) => {
                  const isSelected = outfit.some((o) => o.id === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => addToOutfit(category.name, item)}
                      className={`border-2 rounded-lg p-2 transition-all ${
                        isSelected
                          ? "border-pink-600 shadow-lg scale-105"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <div className="relative w-full aspect-square mb-2">
                        <Image
                          src={getValidImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-pink-600 font-semibold">
                        ${item.price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
