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
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h2>
      </div>
      <div className={`grid ${gridCols} gap-6`}>
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-1"
          >
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <Image
                src={getValidImageUrl(product.image)}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {product.inStock === false && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-gray-900 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              {product.category && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">{product.category}</span>
              )}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400 ml-1">(4.5K reviews)</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all font-medium"
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
