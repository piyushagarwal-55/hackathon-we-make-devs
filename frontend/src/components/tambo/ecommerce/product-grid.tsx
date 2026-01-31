"use client";

import { z } from "zod";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  // Check for empty or clearly invalid URLs
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/default/300/300";
  }
  
  // Check for incomplete Unsplash URLs (common AI truncation issue)
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/default/300/300";
  }
  
  // Check for malformed URLs ending with just domain
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/default/300/300";
  }
  
  try {
    const parsed = new URL(url);
    // Ensure path is not empty for image URLs
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/default/300/300";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/default/300/300";
  }
};

export const productGridSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().default(""),
      name: z.string().default("Unnamed Product"),
      price: z.number().default(0),
      image: z.string().default("https://picsum.photos/seed/default/300/300"),
      rating: z.number().optional(),
      category: z.string().optional(),
      inStock: z.boolean().optional(),
    })
  ).default([]),
  title: z.string().optional(),
  columns: z.number().optional().default(3),
});

type ProductGridProps = z.infer<typeof productGridSchema>;

export function ProductGrid({
  products = [],
  title = "Products",
  columns = 3,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns] || "grid-cols-3";

  const handleAddToCart = async (product: any) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_AGENT_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'default',
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });
      const data = await response.json();
      alert(`Added ${product.name} to cart! (${data.total_items} items total)`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className={`grid ${gridCols} gap-6`}>
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
          >
            <div className="relative h-48 bg-gray-100">
              <Image
                src={getValidImageUrl(product.image)}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.inStock === false && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              {product.category && (
                <p className="text-sm text-gray-500">{product.category}</p>
              )}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={product.inStock === false}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
