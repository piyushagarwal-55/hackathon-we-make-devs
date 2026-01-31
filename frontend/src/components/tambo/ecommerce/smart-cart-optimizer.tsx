"use client";

import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { Sparkles, TrendingDown, X, ShoppingCart } from "lucide-react";

// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/cart/100/100";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/cart/100/100";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/cart/100/100";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/cart/100/100";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/cart/100/100";
  }
};

export const smartCartOptimizerSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string().default(""),
      name: z.string().default("Item"),
      price: z.number().default(0),
      quantity: z.number().default(1),
      image: z.string().default("https://picsum.photos/seed/cart/100/100"),
    })
  ).default([]),
  suggestions: z.array(
    z.object({
      type: z.enum(["cheaper_alternative", "bundle_deal", "remove_suggestion"]),
      message: z.string().default(""),
      savings: z.number().optional(),
      productId: z.string().optional(),
      replacement: z
        .object({
          id: z.string().default(""),
          name: z.string().default("Item"),
          price: z.number().default(0),
          image: z.string().default("https://picsum.photos/seed/alt/100/100"),
        })
        .optional(),
    })
  ).default([]),
});

type SmartCartOptimizerProps = z.infer<typeof smartCartOptimizerSchema>;

export function SmartCartOptimizer({
  cartItems = [],
  suggestions = [],
}: SmartCartOptimizerProps) {
  const [items, setItems] = useState(cartItems);
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);

  const applySuggestion = (index: number, suggestion: any) => {
    if (suggestion.type === "cheaper_alternative" && suggestion.replacement) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === suggestion.productId
            ? { ...suggestion.replacement, quantity: item.quantity }
            : item
        )
      );
    } else if (suggestion.type === "remove_suggestion") {
      setItems((prev) => prev.filter((item) => item.id !== suggestion.productId));
    }
    setAppliedSuggestions((prev) => [...prev, index]);
  };

  const currentTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const potentialSavings = suggestions
    .filter((_, idx) => !appliedSuggestions.includes(idx))
    .reduce((sum, s) => sum + (s.savings || 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-amber-600" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Smart Cart Optimizer
          </h2>
          <p className="text-sm text-gray-600">
            AI-powered savings recommendations
          </p>
        </div>
        {potentialSavings > 0 && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
            Save up to ${potentialSavings.toFixed(2)}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Cart */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">
            Your Cart ({items.length})
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50"
              >
                <div className="relative w-20 h-20">
                  <Image
                    src={getValidImageUrl(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-red-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Total */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-3 border-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">
                Current Total
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${currentTotal.toFixed(2)}
              </span>
            </div>
            {appliedSuggestions.length > 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {appliedSuggestions.length} optimization
                  {appliedSuggestions.length > 1 ? "s" : ""} applied
                </span>
              </div>
            )}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => {
              const isApplied = appliedSuggestions.includes(idx);
              const IconComponent =
                suggestion.type === "cheaper_alternative"
                  ? TrendingDown
                  : suggestion.type === "bundle_deal"
                  ? Sparkles
                  : X;

              const bgColor =
                suggestion.type === "cheaper_alternative"
                  ? "bg-green-50 border-green-200"
                  : suggestion.type === "bundle_deal"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-orange-50 border-orange-200";

              return (
                <div
                  key={idx}
                  className={`border-2 rounded-lg p-4 space-y-3 ${
                    isApplied ? "opacity-50" : bgColor
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 flex-1">
                      {suggestion.message}
                    </p>
                  </div>

                  {suggestion.savings && !isApplied && (
                    <div className="bg-white rounded px-3 py-2 text-center">
                      <p className="text-xs text-gray-500">Potential Savings</p>
                      <p className="text-lg font-bold text-green-600">
                        ${suggestion.savings.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {suggestion.replacement && !isApplied && (
                    <div className="bg-white rounded-lg p-3 flex gap-3">
                      <div className="relative w-16 h-16">
                        <Image
                          src={getValidImageUrl(suggestion.replacement.image)}
                          alt={suggestion.replacement.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 line-clamp-2">
                          {suggestion.replacement.name}
                        </p>
                        <p className="text-sm font-bold text-green-600">
                          ${suggestion.replacement.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => applySuggestion(idx, suggestion)}
                    disabled={isApplied}
                    className="w-full py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isApplied ? "Applied ✓" : "Apply"}
                  </button>
                </div>
              );
            })}
          </div>

          {suggestions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Your cart is already optimized!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
