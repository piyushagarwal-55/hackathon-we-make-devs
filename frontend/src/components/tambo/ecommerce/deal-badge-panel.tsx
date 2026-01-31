"use client";

import { z } from "zod";
import Image from "next/image";
import { Tag, Clock, TrendingDown } from "lucide-react";

// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/deal/300/300";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/deal/300/300";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/deal/300/300";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/deal/300/300";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/deal/300/300";
  }
};

export const dealBadgePanelSchema = z.object({
  deals: z.array(
    z.object({
      id: z.string().default(""),
      name: z.string().default("Deal"),
      originalPrice: z.number().default(0),
      salePrice: z.number().default(0),
      image: z.string().default("https://picsum.photos/seed/deal/300/300"),
      discount: z.number().default(0),
      expiresIn: z.string().optional(),
      badge: z.enum(["HOT", "NEW", "LIMITED", "FLASH"]).optional(),
    })
  ).default([]),
  title: z.string().optional(),
});

type DealBadgePanelProps = z.infer<typeof dealBadgePanelSchema>;

export function DealBadgePanel({
  deals,
  title = "🔥 Hot Deals",
}: DealBadgePanelProps) {
  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "HOT":
        return "bg-red-500";
      case "NEW":
        return "bg-green-500";
      case "LIMITED":
        return "bg-orange-500";
      case "FLASH":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <Tag className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const discountPercent = Math.round(
            ((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100
          );

          return (
            <div
              key={deal.id}
              className="relative border-2 border-red-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white"
            >
              {/* Badge */}
              {deal.badge && (
                <div
                  className={`absolute top-3 left-3 ${getBadgeColor(
                    deal.badge
                  )} text-white px-3 py-1 rounded-full text-xs font-bold z-10`}
                >
                  {deal.badge}
                </div>
              )}

              {/* Discount Badge */}
              <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg z-10">
                -{discountPercent}%
              </div>

              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={getValidImageUrl(deal.image)}
                  alt={deal.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {deal.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-600">
                    ${deal.salePrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Savings */}
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Save ${(deal.originalPrice - deal.salePrice).toFixed(2)}
                  </span>
                </div>

                {/* Expiration */}
                {deal.expiresIn && (
                  <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Ends {deal.expiresIn}
                    </span>
                  </div>
                )}

                {/* CTA Button */}
                <button className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                  Grab Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
