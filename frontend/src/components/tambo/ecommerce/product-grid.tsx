"use client";

import { z } from "zod";
import Image from "next/image";
import { ShoppingCart, Star, Camera } from "lucide-react";
import { useUIPanel } from "@/contexts/ui-panel-context";

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
  columns: z.number().optional().default(2), // Default to 2 columns
});

type ProductGridProps = z.infer<typeof productGridSchema>;

export function ProductGrid({
  products = [],
  title = "Products",
  columns = 2, // Default to 2 columns
}: ProductGridProps) {
  // Force 2 columns for better appearance
  const gridCols = "grid-cols-1 md:grid-cols-2";

  const { setComponent } = useUIPanel();

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

  const handleTryOn = (product: any) => {
    // Trigger VirtualTryOnUploader component with product details
    setComponent('VirtualTryOnUploader', {
      productId: product.id,
      productName: product.name,
      productImage: getValidImageUrl(product.image),
    });
  };

  // Check if product is suitable for virtual try-on (ONLY sunglasses/eyewear)
  const canTryOn = (product: any): boolean => {
    const tryOnKeywords = ['sunglasses', 'glasses', 'eyewear'];
    const nameAndCategory = `${product.name} ${product.category || ''}`.toLowerCase();
    return tryOnKeywords.some(keyword => nameAndCategory.includes(keyword));
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-slate-700 to-slate-900 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className={`grid ${gridCols} gap-6`}>
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-1"
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
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg group-hover:text-slate-700 transition-colors">
                {product.name}
              </h3>
              {product.category && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">{product.category}</span>
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
                  <span className="text-2xl font-bold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {canTryOn(product) && (
                    <button
                      className="px-3 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 active:bg-slate-950 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
                      onClick={() => handleTryOn(product)}
                      title="Virtual Try-On"
                    >
                      <Camera className="w-4 h-4" />
                      Try On
                    </button>
                  )}
                  <button
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
                    disabled={product.inStock === false}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
