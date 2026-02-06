/**
 * Commerce GenUI - Pre-built Components
 * Export all commerce components for use with the SDK
 */

// Note: These components should be extracted from the ShopSage frontend
// For the SDK, we provide the index and types. Actual implementations
// can be imported from the main ShopSage app.

/**
 * Component exports placeholder
 * 
 * In a real implementation, extract from:
 * frontend/src/components/tambo/ecommerce/
 */

export { default as ProductGrid } from './ProductGrid';
export { default as ComparisonTable } from './ComparisonTable';
export { default as BudgetSlider } from './BudgetSlider';
export { default as CheckoutWizard } from './CheckoutWizard';
export { default as UserProfile } from './UserProfile';
export { default as OrderHistory } from './OrderHistory';
export { default as DealBadgePanel } from './DealBadgePanel';
export { default as BundleBuilder } from './BundleBuilder';
export { default as TryOnStudio } from './TryOnStudio';
export { default as CartSummary } from './CartSummary';

// Export types
export type {
  ProductGridProps,
  ComparisonTableProps,
  BudgetSliderProps,
  CheckoutWizardProps,
  UserProfileProps,
  OrderHistoryProps,
  DealBadgePanelProps,
  BundleBuilderProps,
  TryOnStudioProps,
  CartSummaryProps
} from '@commerce-genui/types';
