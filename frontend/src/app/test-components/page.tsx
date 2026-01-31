"use client";

import { ProductGrid } from "@/components/tambo/ecommerce/product-grid";
import { ComparisonTable } from "@/components/tambo/ecommerce/comparison-table";
import { BudgetSlider } from "@/components/tambo/ecommerce/budget-slider";
import { DealBadgePanel } from "@/components/tambo/ecommerce/deal-badge-panel";

export default function TestComponents() {
  const sampleProducts = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 79.99,
      image: "https://picsum.photos/seed/headphones/300/300",
      rating: 4.5,
      reviews: 128,
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      image: "https://picsum.photos/seed/watch/300/300",
      rating: 4.8,
      reviews: 256,
    },
    {
      id: "3",
      name: "Laptop Backpack",
      price: 49.99,
      image: "https://picsum.photos/seed/backpack/300/300",
      rating: 4.2,
      reviews: 89,
    },
  ];

  const comparisonProducts = [
    {
      id: "1",
      name: "Basic Plan",
      price: 9.99,
      image: "https://picsum.photos/seed/plan1/200/200",
      features: [
        { key: "Storage", value: "10GB" },
        { key: "Users", value: 5 },
        { key: "Support", value: "Email" },
        { key: "Analytics", value: false },
      ],
    },
    {
      id: "2",
      name: "Pro Plan",
      price: 29.99,
      image: "https://picsum.photos/seed/plan2/200/200",
      features: [
        { key: "Storage", value: "100GB" },
        { key: "Users", value: 25 },
        { key: "Support", value: "Priority" },
        { key: "Analytics", value: true },
      ],
    },
  ];

  const deals = [
    {
      id: "1",
      name: "Gaming Mouse",
      salePrice: 29.99,
      originalPrice: 49.99,
      discount: 40,
      image: "https://picsum.photos/seed/mouse/300/300",
      badge: "HOT" as const,
      expiresIn: "2 hours",
    },
    {
      id: "2",
      name: "Mechanical Keyboard",
      salePrice: 89.99,
      originalPrice: 129.99,
      discount: 31,
      image: "https://picsum.photos/seed/keyboard/300/300",
      badge: "FLASH" as const,
      expiresIn: "45 minutes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">E-commerce Components Test</h1>
        <p className="text-gray-600 mb-8">
          Testing all components without Tambo AI (while backend is down)
        </p>

        {/* Product Grid */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Product Grid</h2>
          <ProductGrid
            products={sampleProducts}
            title="Featured Products"
            columns={3}
          />
        </section>

        {/* Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Comparison Table</h2>
          <ComparisonTable
            products={comparisonProducts}
            title="Compare Plans"
          />
        </section>

        {/* Budget Slider */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Budget Slider</h2>
          <BudgetSlider
            minPrice={0}
            maxPrice={500}
            currentMin={50}
            currentMax={200}
            matchingProducts={42}
          />
        </section>

        {/* Deal Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Deal Badge Panel</h2>
          <DealBadgePanel deals={deals} />
        </section>

        {/* Empty State Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Empty States (Default Values)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Empty Product Grid</h3>
              <ProductGrid />
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Empty Comparison Table</h3>
              <ComparisonTable />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
