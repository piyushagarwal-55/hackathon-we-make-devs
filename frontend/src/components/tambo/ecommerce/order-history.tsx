"use client";

import { z } from "zod";

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
  orders: z.array(orderSchema).default([]),
}).nullable();

type OrderHistoryProps = z.infer<typeof orderHistorySchema>;

export function OrderHistory(props: OrderHistoryProps) {
  const orders = props?.orders || [];

    if (orders.length === 0) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Order History</h2>
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground text-lg">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start shopping to see your orders here!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Order History</h2>
        <div className="space-y-4">
          {orders.map((order) => {
            if (!order) return null;
            
            return (
              <div
                key={order.orderId}
                className="bg-card rounded-lg border border-border p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => {
                    if (!item) return null;
                    
                    return (
                      <div key={`${order.orderId}-${item.id}-${idx}`} className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md border border-border"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {order.shipping_info && Object.keys(order.shipping_info).length > 0 && (
                  <div className="border-t border-border pt-4 mb-4">
                    <h4 className="font-medium text-foreground mb-2">Shipping Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {order.shipping_info.fullName && (
                        <p>{order.shipping_info.fullName}</p>
                      )}
                      {order.shipping_info.address && (
                        <p>{order.shipping_info.address}</p>
                      )}
                      {order.shipping_info.city && order.shipping_info.state && order.shipping_info.zip && (
                        <p>
                          {order.shipping_info.city}, {order.shipping_info.state}{" "}
                          {order.shipping_info.zip}
                        </p>
                      )}
                      {order.shipping_info.phone && (
                        <p>Phone: {order.shipping_info.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {order.items.reduce((sum, item) => sum + (item?.quantity || 0), 0)} item(s)
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    Total: ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

