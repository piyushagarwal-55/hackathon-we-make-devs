/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

// Backend API URL
const BACKEND_URL = process.env.NEXT_PUBLIC_AGENT_BACKEND_URL || 'http://localhost:8000';

// E-commerce components
import { ProductGrid, productGridSchema } from "@/components/tambo/ecommerce/product-grid";
import { ComparisonTable, comparisonTableSchema } from "@/components/tambo/ecommerce/comparison-table";
import { BudgetSlider, budgetSliderSchema } from "@/components/tambo/ecommerce/budget-slider";
import { DealBadgePanel, dealBadgePanelSchema } from "@/components/tambo/ecommerce/deal-badge-panel";
import { TryOnStudio, tryonStudioSchema } from "@/components/tambo/ecommerce/tryon-studio";
import { OutfitBoard, outfitBoardSchema } from "@/components/tambo/ecommerce/outfit-board";
import { BundleBuilder, bundleBuilderSchema } from "@/components/tambo/ecommerce/bundle-builder";
import { CheckoutWizard, checkoutWizardSchema } from "@/components/tambo/ecommerce/checkout-wizard";
import { SmartCartOptimizer, smartCartOptimizerSchema } from "@/components/tambo/ecommerce/smart-cart-optimizer";
import { PriceTrendChart, priceTrendChartSchema } from "@/components/tambo/ecommerce/price-trend-chart";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "searchProducts",
    description:
      "Search for products from Cymbal Shops e-commerce store. Use this EVERY TIME the user asks about products, items to buy, shopping, or wants to browse. Returns real product data with images, prices, and details.",
    tool: async ({ query }: { query: string }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, session_id: 'default' }),
        });
        
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }
        
        const data = await response.json();
        // Backend returns products inside ui_props
        const products = data.ui_props?.products || data.products || [];
        
        return {
          products,
          agent_response: data.agent_response || '',
          ui_component: data.ui_component,
        };
      } catch (error) {
        console.error('Backend call failed:', error);
        return {
          products: [],
          agent_response: 'Sorry, I could not fetch products right now.',
          ui_component: null,
        };
      }
    },
    inputSchema: z.object({
      query: z.string().describe("The user's search query or product request"),
    }),
    outputSchema: z.object({
      products: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        image: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
      })).default([]),
      agent_response: z.string().default(''),
      ui_component: z.string().nullable().optional(),
    }),
  },
  {
    name: "addToCart",
    description:
      "Add product(s) to shopping cart. Use when user says 'add to cart', 'add 3 sunglasses', 'put in cart', etc. Supports quantity specification.",
    tool: async ({ productId, productName, price, image, quantity }: { productId: string; productName: string; price: number; image: string; quantity: number }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: 'default',
            product_id: productId,
            product_name: productName,
            price,
            image,
            quantity,
          }),
        });
        
        const data = await response.json();
        return {
          success: true,
          cart: data.cart || [],
          total_items: data.total_items || 0,
          message: `Added ${quantity} ${productName} to cart`,
        };
      } catch (error) {
        console.error('Add to cart failed:', error);
        return {
          success: false,
          message: 'Failed to add to cart',
        };
      }
    },
    inputSchema: z.object({
      productId: z.string(),
      productName: z.string(),
      price: z.number(),
      image: z.string(),
      quantity: z.number().default(1),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      cart: z.array(z.any()).optional(),
      total_items: z.number().optional(),
      message: z.string(),
    }),
  },
  {
    name: "viewCart",
    description:
      "View shopping cart contents. Use when user says 'show cart', 'what's in my cart', 'view cart', 'my cart', etc.",
    tool: async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/cart/default`);
        const data = await response.json();
        
        return {
          cart: data.cart || [],
          total_items: data.total_items || 0,
          total_price: data.total_price || 0,
          message: data.cart?.length > 0 
            ? `You have ${data.total_items} items in your cart` 
            : 'Your cart is empty',
        };
      } catch (error) {
        console.error('View cart failed:', error);
        return {
          cart: [],
          total_items: 0,
          total_price: 0,
          message: 'Failed to load cart',
        };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({
      cart: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        image: z.string(),
        quantity: z.number(),
      })).default([]),
      total_items: z.number().default(0),
      total_price: z.number().default(0),
      message: z.string(),
    }),
  },
  {
    name: "removeFromCart",
    description:
      "Remove item from cart. Use when user says 'remove from cart', 'delete item', etc.",
    tool: async ({ productId }: { productId: string }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/cart/remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: 'default',
            product_id: productId,
          }),
        });
        
        const data = await response.json();
        return {
          success: true,
          cart: data.cart || [],
          message: 'Item removed from cart',
        };
      } catch (error) {
        console.error('Remove from cart failed:', error);
        return {
          success: false,
          message: 'Failed to remove from cart',
        };
      }
    },
    inputSchema: z.object({
      productId: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      cart: z.array(z.any()).optional(),
      message: z.string(),
    }),
  },
  {
    name: "getRecommendations",
    description:
      "Get personalized product recommendations. Use when user asks for 'recommendations', 'suggest products', 'what should I buy', etc.",
    tool: async ({ query }: { query: string }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            session_id: 'default',
          }),
        });
        
        const data = await response.json();
        return {
          recommendations: data.recommendations || [],
          message: data.message || 'Here are some recommendations for you',
        };
      } catch (error) {
        console.error('Get recommendations failed:', error);
        return {
          recommendations: [],
          message: 'Failed to get recommendations',
        };
      }
    },
    inputSchema: z.object({
      query: z.string().describe("User's preference or criteria for recommendations"),
    }),
    outputSchema: z.object({
      recommendations: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        image: z.string(),
        description: z.string(),
        rating: z.number(),
        reason: z.string(),
      })).default([]),
      message: z.string(),
    }),
  },
  {
    name: "checkout",
    description:
      "Process checkout and place order with shipping information. Extract name, address, city, zip, and email from user's message. Use when user provides shipping details like 'checkout to John Doe, 123 Main St, New York, 10001, john@email.com' or 'ship to Sarah Lee, 456 Oak Ave, Boston, 02101'.",
    tool: async ({ name, address, city, zip, email }: { name: string; address: string; city: string; zip: string; email?: string }) => {
      try {
        const shippingInfo = {
          name,
          address,
          city,
          zip,
          email: email || `${name.toLowerCase().replace(' ', '.')}@email.com`,
        };
        
        const response = await fetch(`${BACKEND_URL}/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: 'default',
            shipping_info: shippingInfo,
          }),
        });
        
        const data = await response.json();
        
        if (data.status === 'error') {
          return {
            success: false,
            message: data.message,
          };
        }
        
        return {
          success: true,
          order_id: data.order?.order_id,
          total: data.order?.total,
          items_count: data.order?.items?.length || 0,
          shipping_info: shippingInfo,
          message: `✅ Order ${data.order?.order_id} confirmed! Shipping to ${name} at ${address}, ${city} ${zip}. Total: $${data.order?.total.toFixed(2)}`,
        };
      } catch (error) {
        console.error('Checkout failed:', error);
        return {
          success: false,
          message: 'Failed to process checkout. Please try again.',
        };
      }
    },
    inputSchema: z.object({
      name: z.string().describe("Full name for shipping (e.g., 'John Doe')"),
      address: z.string().describe("Street address for delivery (e.g., '123 Main Street')"),
      city: z.string().describe("City for delivery (e.g., 'New York')"),
      zip: z.string().describe("ZIP/Postal code (e.g., '10001')"),
      email: z.string().optional().describe("Email address for order confirmation"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      order_id: z.string().optional(),
      total: z.number().optional(),
      items_count: z.number().optional(),
      shipping_info: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        zip: z.string(),
        email: z.string(),
      }).optional(),
      message: z.string(),
    }),
  },
  {
    name: "exportOrders",
    description:
      "Export order to PDF document. Use when user says 'export to PDF', 'download PDF', 'generate PDF', 'export order', etc.",
    tool: async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/export/pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: 'default' }),
        });
        
        if (!response.ok) {
          return {
            success: false,
            message: 'No orders available to export',
          };
        }
        
        // Get PDF blob
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return {
          success: true,
          message: '✅ PDF downloaded successfully! Check your Downloads folder.',
        };
      } catch (error) {
        console.error('Export failed:', error);
        return {
          success: false,
          message: 'Failed to export PDF. Make sure you have placed an order first.',
        };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // E-commerce components for ShopSage
  {
    name: "ProductGrid",
    description:
      "Display products in a responsive grid layout with images, prices, ratings, and add-to-cart buttons. Use this for browsing, search results, or category pages.",
    component: ProductGrid,
    propsSchema: productGridSchema,
  },
  {
    name: "ComparisonTable",
    description:
      "Side-by-side product comparison table with features, prices, and selection buttons. Use when user wants to compare multiple products or asks 'compare them' or 'which is better'.",
    component: ComparisonTable,
    propsSchema: comparisonTableSchema,
  },
  {
    name: "BudgetSlider",
    description:
      "Interactive dual-range price slider with quick presets and product count. Use when user mentions budget, price range, 'cheap', 'affordable', or specific price constraints.",
    component: BudgetSlider,
    propsSchema: budgetSliderSchema,
  },
  {
    name: "DealBadgePanel",
    description:
      "Showcase special deals, discounts, and limited-time offers with countdown timers and savings badges. Use for deals, sales, discounts, or when user asks for best offers.",
    component: DealBadgePanel,
    propsSchema: dealBadgePanelSchema,
  },
  {
    name: "TryOnStudio",
    description:
      "AI-powered virtual try-on studio for apparel and accessories. Use when user wants to try on, see how something looks, or upload their photo.",
    component: TryOnStudio,
    propsSchema: tryonStudioSchema,
  },
  {
    name: "OutfitBoard",
    description:
      "Interactive outfit builder for creating complete looks by mixing and matching items from different categories. Use for outfit creation, style recommendations, or matching items.",
    component: OutfitBoard,
    propsSchema: outfitBoardSchema,
  },
  {
    name: "BundleBuilder",
    description:
      "Create product bundles with automatic discounts and savings calculator. Use when user wants to bundle items, create sets, or buy multiple related products.",
    component: BundleBuilder,
    propsSchema: bundleBuilderSchema,
  },
  {
    name: "CheckoutWizard",
    description:
      "Multi-step checkout wizard with progress tracking and express mode. Use when user is ready to checkout, buy now, or complete purchase. Set expressMode=true for fast checkout.",
    component: CheckoutWizard,
    propsSchema: checkoutWizardSchema,
  },
  {
    name: "SmartCartOptimizer",
    description:
      "AI-powered cart optimization with cheaper alternatives, bundle suggestions, and savings recommendations. Use when user wants to optimize cart, save money, or find better deals.",
    component: SmartCartOptimizer,
    propsSchema: smartCartOptimizerSchema,
  },
  {
    name: "PriceTrendChart",
    description:
      "90-day price history chart with trend analysis and deal alerts. Use when user asks about price history, trends, if it's a good deal, or when prices were lower.",
    component: PriceTrendChart,
    propsSchema: priceTrendChartSchema,
  },
];
