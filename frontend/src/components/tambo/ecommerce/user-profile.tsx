"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional(),
}).nullable();

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional(),
}).nullable();

const orderSchema = z.object({
  orderId: z.string(),
  date: z.string(),
  items: z.array(orderItemSchema),
  total: z.number(),
  status: z.string(),
}).nullable();

const userDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  created_at: z.string().optional(),
}).nullable();

export const userProfileSchema = z.object({
  user: userDataSchema,
  cart_items: z.array(cartItemSchema).default([]),
  orders: z.array(orderSchema).default([]),
  total_cart_items: z.number().default(0),
  total_orders: z.number().default(0),
}).nullable();

type UserProfileProps = z.infer<typeof userProfileSchema>;

export function UserProfile(props: UserProfileProps) {
  // State for profile data
  const [profileData, setProfileData] = useState<UserProfileProps | null>(props);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const user = profileData?.user;
  const cartItems = profileData?.cart_items || [];
  const orders = profileData?.orders || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch profile data if not provided in props
  useEffect(() => {
    const fetchProfile = async () => {
      // If we have user data in props, use it
      if (props?.user) {
        setProfileData(props);
        return;
      }

      console.log('📥 [UserProfile] No user data in props, fetching from backend...');
      setFetchLoading(true);
      setFetchError(null);

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) {
          setFetchError('Please login to view your profile');
          return;
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message: 'show my profile',
            session_id: 'default'
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [UserProfile] Fetched profile data:', data.ui_props);
        
        if (data.ui_props) {
          setProfileData(data.ui_props);
        }
      } catch (err) {
        console.error('❌ [UserProfile] Failed to fetch profile:', err);
        setFetchError('Failed to load profile data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, [props]);

  // Update edit form when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg border border-red-300 p-6 text-center">
          <p className="text-red-600">{fetchError}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <p className="text-muted-foreground">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Please login again");
        return;
      }

      const response = await fetch("http://localhost:8000/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Update failed");
      }

      setMessage("✅ Profile updated successfully!");
      setIsEditing(false);

      // Update local storage user data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({ ...userObj, ...data.user }));
      }

      // Reload the page to show updated data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setMessage("❌ " + (err.message || "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  const totalCartValue = cartItems.reduce(
    (sum, item) => sum + (item ? item.price * item.quantity : 0),
    0
  );

  const totalOrderValue = orders.reduce(
    (sum, order) => sum + (order ? order.total : 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-foreground">My Profile</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.includes("✅")
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, full_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your shipping address"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        full_name: user.full_name || user.username,
                        email: user.email,
                        phone: user.phone || "",
                        address: user.address || "",
                      });
                    }}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="text-foreground font-medium">
                    {user.full_name || user.username}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-foreground font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground font-medium">
                    {user.address || "Not provided"}
                  </p>
                </div>
                {user.created_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-foreground font-medium">{user.created_at}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Items Section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Current Cart ({cartItems.length} items)
            </h3>
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, idx) => {
                  if (!item) return null;
                  return (
                    <div
                      key={`cart-${item.id}-${idx}`}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-md"
                    >
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
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-foreground">Total Cart Value:</p>
                    <p className="text-xl font-bold text-primary">
                      ${totalCartValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order History Section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Order History ({orders.length} orders)
            </h3>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  if (!order) return null;
                  return (
                    <div
                      key={order.orderId}
                      className="border border-border rounded-md p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            Order #{order.orderId}
                          </p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          if (!item) return null;
                          return (
                            <div
                              key={`order-${order.orderId}-${item.id}-${idx}`}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-foreground">
                                {item.name} x {item.quantity}
                              </span>
                              <span className="text-muted-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border flex justify-between">
                        <span className="font-semibold text-foreground">Total:</span>
                        <span className="font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <h4 className="text-sm font-medium opacity-90 mb-2">Total Orders</h4>
            <p className="text-4xl font-bold">{orders.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <h4 className="text-sm font-medium opacity-90 mb-2">Total Spent</h4>
            <p className="text-4xl font-bold">${totalOrderValue.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <h4 className="text-sm font-medium opacity-90 mb-2">Cart Items</h4>
            <p className="text-4xl font-bold">{cartItems.length}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
            <h4 className="text-sm font-medium opacity-90 mb-2">Cart Value</h4>
            <p className="text-4xl font-bold">${totalCartValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
