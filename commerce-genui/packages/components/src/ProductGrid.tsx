/**
 * ProductGrid Component
 * Displays products in a responsive grid layout
 */

import React from 'react';
import type { ProductGridProps } from '@commerce-genui/types';

export default function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  layout = 'grid',
  columns = 3
}: ProductGridProps) {
  return (
    <div 
      className={`
        ${layout === 'grid' ? 'grid' : 'flex flex-col'} 
        gap-4 
        ${layout === 'grid' ? `grid-cols-1 md:grid-cols-${columns}` : ''}
      `}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onProductClick?.(product)}
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            
            {product.discount && (
              <span className="text-sm text-red-500 font-medium">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          {product.rating && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>⭐ {product.rating.toFixed(1)}</span>
              {product.reviews && (
                <span className="ml-2">({product.reviews} reviews)</span>
              )}
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
