"use client";

import React, { useMemo } from 'react';
import { useUIPanel } from '@/contexts/ui-panel-context';
import { Package, Sparkles, AlertCircle } from 'lucide-react';

// Import ORIGINAL components (not wrapped versions)
import { ProductGrid } from "@/components/tambo/ecommerce/product-grid";
import { ComparisonTable } from "@/components/tambo/ecommerce/comparison-table";
import { BudgetSlider } from "@/components/tambo/ecommerce/budget-slider";
import { DealBadgePanel } from "@/components/tambo/ecommerce/deal-badge-panel";
import { TryOnStudio } from "@/components/tambo/ecommerce/tryon-studio";
import { OutfitBoard } from "@/components/tambo/ecommerce/outfit-board";
import { BundleBuilder } from "@/components/tambo/ecommerce/bundle-builder";
import { CheckoutWizard } from "@/components/tambo/ecommerce/checkout-wizard";
import { SmartCartOptimizer } from "@/components/tambo/ecommerce/smart-cart-optimizer";
import { PriceTrendChart } from "@/components/tambo/ecommerce/price-trend-chart";
import { LoginForm } from "@/components/tambo/ecommerce/login-form";
import { SignupForm } from "@/components/tambo/ecommerce/signup-form";
import { OrderHistory } from "@/components/tambo/ecommerce/order-history";
import { UserProfile } from "@/components/tambo/ecommerce/user-profile";
import { VirtualTryOnUploader } from "@/components/tambo/ecommerce/virtual-tryon";

// Map of component names to ORIGINAL components
const originalComponents: Record<string, React.ComponentType<any>> = {
  ProductGrid,
  ComparisonTable,
  BudgetSlider,
  DealBadgePanel,
  TryOnStudio,
  OutfitBoard,
  BundleBuilder,
  CheckoutWizard,
  SmartCartOptimizer,
  PriceTrendChart,
  LoginForm,
  SignupForm,
  OrderHistory,
  UserProfile,
  VirtualTryOnUploader,
};

export function UIPanel() {
  const { currentComponent, clearComponent } = useUIPanel();

  console.log('🖼️ [UIPanel] Render - currentComponent:', currentComponent);

  const ComponentToRender = useMemo(() => {
    console.log('🔍 [UIPanel] useMemo - Looking for component:', currentComponent?.name);
    
    if (!currentComponent) {
      console.log('⚠️ [UIPanel] No current component');
      return null;
    }
    
    // Get the ORIGINAL component (not wrapped)
    const OriginalComponent = originalComponents[currentComponent.name];
    
    if (OriginalComponent) {
      console.log('✅ [UIPanel] Original component found:', currentComponent.name);
      console.log('📦 [UIPanel] Component type:', typeof OriginalComponent);
    } else {
      console.log('❌ [UIPanel] Component not found:', currentComponent.name);
    }
    
    return OriginalComponent || null;
  }, [currentComponent]);

  if (!currentComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border-l border-slate-200">
        <div className="text-center p-8 space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700">UI Preview Panel</h2>
            <p className="text-sm text-slate-500">
              Interactive components will appear here when you interact with the shopping assistant.
              Try asking about products, cart, or your profile.
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center text-xs text-slate-400">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Tambo AI</span>
          </div>
        </div>
      </div>
    );
  }

  if (!ComponentToRender) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white border-l border-slate-200">
        <div className="text-center p-8 space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700">Component Not Found</h2>
            <p className="text-sm text-slate-500">
              The component <code className="px-2 py-1 bg-slate-100 rounded">{currentComponent.name}</code> is not registered.
            </p>
          </div>
          <button
            onClick={clearComponent}
            className="text-sm text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Clear Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white border-l border-slate-200">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{currentComponent.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live preview</p>
            </div>
          </div>
          <button
            onClick={clearComponent}
            className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="p-6">
        <ComponentToRender {...currentComponent.props} />
      </div>
    </div>
  );
}
