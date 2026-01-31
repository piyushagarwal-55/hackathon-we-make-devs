"use client";

import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  CreditCard,
  Package,
  CheckCircle2,
  ChevronRight,
  Truck,
} from "lucide-react";

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

export const checkoutWizardSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string().nullable().default(""),
      name: z.string().nullable().default("Item"),
      price: z.number().nullable().default(0),
      quantity: z.number().nullable().default(1),
      image: z.string().nullable().default("https://picsum.photos/seed/cart/100/100"),
    })
  ).default([]),
  expressMode: z.boolean().nullable().optional(),
  shippingCost: z.number().nullable().default(0),
});

type CheckoutWizardProps = z.infer<typeof checkoutWizardSchema>;

export function CheckoutWizard({
  cartItems = [],
  expressMode = false,
  shippingCost = 0,
}: CheckoutWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const steps = [
    { id: 1, name: "Review", icon: ShoppingCart },
    { id: 2, name: "Shipping", icon: Truck },
    { id: 3, name: "Payment", icon: CreditCard },
    { id: 4, name: "Confirm", icon: CheckCircle2 },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = expressMode ? 0 : shippingCost;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-600">
          Your order has been successfully placed. We'll send you a confirmation
          email shortly.
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-2xl font-bold text-gray-900">
            #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Track Order
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      {/* Express Mode Badge */}
      {expressMode && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-lg flex items-center gap-3">
          <Package className="w-6 h-6" />
          <div>
            <p className="font-bold">Express Checkout</p>
            <p className="text-sm">Free shipping • Fast processing</p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-blue-200" : ""}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Review Your Items
            </h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border rounded-lg p-4"
                >
                  <div className="relative w-20 h-20">
                    <Image
                      src={getValidImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Shipping Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-lg px-4 py-3"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded-lg px-4 py-3"
              />
              <input
                type="text"
                placeholder="Address"
                className="md:col-span-2 border rounded-lg px-4 py-3"
              />
              <input
                type="text"
                placeholder="City"
                className="border rounded-lg px-4 py-3"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="border rounded-lg px-4 py-3"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Payment Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border rounded-lg px-4 py-3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="border rounded-lg px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="border rounded-lg px-4 py-3"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="bg-blue-100 px-3 py-1 rounded text-sm">
                  🔒 Secure
                </div>
                <div className="bg-green-100 px-3 py-1 rounded text-sm">
                  ✓ Verified
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Confirm Your Order
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {expressMode ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (currentStep === 4) {
              handlePlaceOrder();
            } else {
              setCurrentStep(Math.min(4, currentStep + 1));
            }
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          {currentStep === 4 ? "Place Order" : "Continue"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
