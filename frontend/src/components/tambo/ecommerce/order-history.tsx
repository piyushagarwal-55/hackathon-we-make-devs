"use client";

import React from "react";
import { z } from "zod";
import Image from "next/image";
import { Package, Calendar, CheckCircle2, Download } from "lucide-react";

// Helper to validate and provide fallback for image URLs
const getValidImageUrl = (url: string): string => {
  if (!url || url === "https://" || url === "http://" || url.length < 15) {
    return "https://picsum.photos/seed/order/100/100";
  }
  if (url.includes('unsplash.com') && url.length < 50) {
    return "https://picsum.photos/seed/order/100/100";
  }
  if (url.match(/\.(com|org|net|io)\/?$/)) {
    return "https://picsum.photos/seed/order/100/100";
  }
  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      return "https://picsum.photos/seed/order/100/100";
    }
    return url;
  } catch {
    return "https://picsum.photos/seed/order/100/100";
  }
};

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional(),
}).nullable();

const shippingInfoSchema = z.object({
  fullName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
}).nullable();

const orderSchema = z.object({
  orderId: z.string(),
  date: z.string(),
  items: z.array(orderItemSchema),
  total: z.number(),
  status: z.string(),
  shipping_info: shippingInfoSchema.optional(),
}).nullable();

export const orderHistorySchema = z.object({
  orders: z.array(orderSchema).optional().default([]),
});

type OrderHistoryProps = z.infer<typeof orderHistorySchema>;

// Wrapper component that accepts any props (including empty object)
export function OrderHistoryWrapper(props: Partial<OrderHistoryProps> = {}) {
  return <OrderHistory orders={props.orders || []} />;
}

export function OrderHistory({ orders = [] }: OrderHistoryProps) {
  const [ordersState, setOrders] = React.useState(orders);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch orders on mount if not provided in props
  React.useEffect(() => {
    const fetchOrders = async () => {
      // Only fetch if no orders were provided in props
      if (orders && orders.length > 0) {
        setOrders(orders);
        return;
      }

      console.log('📥 [OrderHistory] No orders in props, fetching from backend...');
      setLoading(true);
      setError(null);

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message: 'show order history',
            session_id: 'default'
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [OrderHistory] Fetched orders:', data.ui_props?.orders);
        
        if (data.ui_props?.orders) {
          setOrders(data.ui_props.orders);
        }
      } catch (err) {
        console.error('❌ [OrderHistory] Failed to fetch orders:', err);
        setError('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orders]);

  // PDF Export functionality
  const [exportingAll, setExportingAll] = React.useState(false);
  const [exportingOrderId, setExportingOrderId] = React.useState<string | null>(null);

  const handleExportAll = async () => {
    console.log('📤 [Export] Exporting all orders...');
    setExportingAll(true);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        alert('Please login to export orders');
        return;
      }

      const response = await fetch('http://localhost:8000/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: 'default',
          export_all: true
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Export failed' }));
        throw new Error(error.detail || 'Failed to export orders');
      }

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_orders_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ [Export] All orders exported successfully');
    } catch (error) {
      console.error('❌ [Export] Failed:', error);
      alert(`Failed to export orders: ${(error as Error).message}`);
    } finally {
      setExportingAll(false);
    }
  };

  const handleExportOrder = async (orderId: string) => {
    console.log(`📤 [Export] Exporting order ${orderId}...`);
    setExportingOrderId(orderId);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        alert('Please login to export order');
        return;
      }

      const response = await fetch('http://localhost:8000/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: 'default',
          order_id: orderId
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Export failed' }));
        throw new Error(error.detail || 'Failed to export order');
      }

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log(`✅ [Export] Order ${orderId} exported successfully`);
    } catch (error) {
      console.error('❌ [Export] Failed:', error);
      alert(`Failed to export order: ${(error as Error).message}`);
    } finally {
      setExportingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-12">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Loading your orders...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-12">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (ordersState.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-12">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="text-gray-500">
            Start shopping to see your orders here!
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 mt-4">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
              <p className="text-sm text-gray-500">
                {ordersState.length} order{ordersState.length !== 1 ? 's' : ''} • Total: $
                {ordersState.reduce((sum, order) => sum + (order?.total || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
          <button 
            onClick={handleExportAll}
            disabled={exportingAll}
            className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {exportingAll ? 'Exporting...' : 'Export All'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {ordersState.map((order) => {
        if (!order) return null;

        const totalItems = order.items.reduce(
          (sum, item) => sum + (item?.quantity || 0),
          0
        );

        return (
          <div
            key={order.orderId}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Order Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Order #{order.orderId}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {order.status}
                  </span>
                  <button 
                    onClick={() => handleExportOrder(order.orderId)}
                    disabled={exportingOrderId === order.orderId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {exportingOrderId === order.orderId ? 'Exporting...' : 'Receipt'}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 space-y-3">
              {order.items.map((item, idx) => {
                if (!item) return null;

                return (
                  <div
                    key={`${order.orderId}-${item.id}-${idx}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={getValidImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-500">
                          Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Unit Price: <span className="font-medium text-gray-700">${item.price.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="font-semibold text-gray-900">{totalItems}</p>
                  </div>
                  {order.shipping_info && (
                    <div className="border-l pl-6">
                      <p className="text-sm text-gray-500">Shipping</p>
                      <p className="text-sm text-gray-700">
                        {order.shipping_info.fullName || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
