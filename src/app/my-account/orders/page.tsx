/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faSpinner,
  faEye,
  faCheck,
  faXmark,
  faCalendar,
  faMapPin,
  faCreditCard,
  faPhone,
  faTruck,
  faClock,
  faStar,
  faChevronRight,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { OrderReceipt } from "@/components/OrderReceipt";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

interface OrderItem {
  id: string;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  payment_ref?: string;
  payment_method?: string;
  items: OrderItem[];
}

function Orders() {
  const location = { pathname: usePathname() };
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "amount">(
    "newest"
  );
  const user = useAuthStore((state) => state.user);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          items:order_items (
            id,
            product:products (
              name,
              image
            ),
            quantity,
            price
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchLatestOrder = async (txRef: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          items:order_items (
            id,
            product:products (
              name,
              image
            ),
            quantity,
            price
          )
        `
        )
        .eq("payment_ref", txRef)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedOrder(data);
        setShowReceipt(true);
      }
    } catch (error) {
      console.error("Error fetching latest order:", error);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          items:order_items (
            id,
            product:products (
              name,
              image
            ),
            quantity,
            price
          )
        `
        )
        .eq("id", orderId)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedOrder(data);
        setShowReceipt(true);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedOrder(null);
    setTransactionRef(null);
  };

  const handleViewReceipt = (order: Order) => {
    setSelectedOrder(order);
    setTransactionRef(order.payment_ref || null);
    setShowReceipt(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />;
      case "pending":
        return <FontAwesomeIcon icon={faClock} className="w-4 h-4" />;
      case "processing":
        return <FontAwesomeIcon icon={faTruck} className="w-4 h-4" />;
      default:
        return <FontAwesomeIcon icon={faBox} className="w-4 h-4" />;
    }
  };

  const getPaymentStatusBadge = (order: Order) => {
    if (order.payment_ref && order.payment_ref !== "pending") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <FontAwesomeIcon icon={faCheck} className="w-3 h-3 mr-1" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  // Filter and sort orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.delivery_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "amount":
          return b.total - a.total;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery, sortBy]);

  useEffect(() => {
    if (user) {
      fetchOrders();

      // Check for successful order from URL parameters
      const orderSuccess = searchParams.get("order_success");
      const txRef = searchParams.get("tx_ref");
      const orderId = searchParams.get("order_id");

      if (orderSuccess === "true") {
        setShowSuccessMessage(true);

        // Clear URL parameters after 5 seconds
        setTimeout(() => {
          window.history.replaceState({}, document.title, location.pathname);
        }, 5000);

        if (txRef) {
          setTransactionRef(txRef);
          // Find the latest order to show receipt
          setTimeout(() => {
            fetchLatestOrder(txRef);
          }, 1000); // Small delay to ensure the order is in the database
        } else if (orderId) {
          // Find the order by ID
          setTimeout(() => {
            fetchOrderById(orderId);
          }, 1000);
        }
      }
    }
  }, [user, location.pathname, fetchOrders, searchParams]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  const orderStats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    pending: orders.filter((o) => o.status === "pending").length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="h-6 w-6 text-green-400"
                />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-green-800">
                  Order Placed Successfully!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Thank you for shopping with Ulisha Store. Your order is being
                  processed and you&apos;ll receive updates soon.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    My Orders
                  </h1>
                  <p className="text-orange-100">
                    Track and manage your purchases
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {orderStats.total}
                    </div>
                    <div className="text-orange-100 text-sm">Total Orders</div>
                  </div>
                  <div className="w-px h-12 bg-orange-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        notation: "compact",
                      }).format(orderStats.totalSpent)}
                    </div>
                    <div className="text-orange-100 text-sm">Total Spent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards for Mobile */}
            <div className="md:hidden px-6 py-4 bg-gray-50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {orderStats.total}
                </div>
                <div className="text-gray-600 text-sm">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    notation: "compact",
                  }).format(orderStats.totalSpent)}
                </div>
                <div className="text-gray-600 text-sm">Total Spent</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-6 py-4 bg-white border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="w-4 h-4 text-green-600"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">
                      {orderStats.completed}
                    </div>
                    <div className="text-xs text-green-600">Completed</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="w-4 h-4 text-yellow-600"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-900">
                      {orderStats.pending}
                    </div>
                    <div className="text-xs text-yellow-600">Pending</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FontAwesomeIcon
                      icon={faTruck}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">
                      {orders.filter((o) => o.status === "processing").length}
                    </div>
                    <div className="text-xs text-blue-600">Processing</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="w-4 h-4 text-purple-600"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900">
                      {Math.round(
                        (orderStats.completed / orderStats.total) * 100
                      ) || 0}
                      %
                    </div>
                    <div className="text-xs text-purple-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-black pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest" | "amount")
                }
                className="text-black px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon
                icon={faBox}
                className="h-12 w-12 text-gray-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {orders.length === 0
                ? "No orders yet"
                : "No orders match your filters"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {orders.length === 0
                ? "When you make a purchase, your orders will appear here. Start shopping to see your order history!"
                : "Try adjusting your search or filter criteria to find the orders you're looking for."}
            </p>
            {orders.length === 0 && (
              <Link
                href="/"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-500/90 transition-colors font-medium"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faBox}
                            className="w-6 h-6 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              className="w-4 h-4 mr-1"
                            />
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="w-4 h-4 mr-1"
                            />
                            {new Date(order.created_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(order.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} items
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </span>
                        {getPaymentStatusBadge(order)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Delivery Information */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faMapPin}
                        className="w-4 h-4 mr-2 text-primary-orange"
                      />
                      Delivery Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <div className="text-gray-900">
                          {order.delivery_name}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Phone:
                        </span>
                        <div className="text-gray-900 flex items-center">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="w-3 h-3 mr-1"
                          />
                          {order.delivery_phone}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Address:
                        </span>
                        <div className="text-gray-900">
                          {order.delivery_address}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {(order.payment_method || order.payment_ref) && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FontAwesomeIcon
                          icon={faCreditCard}
                          className="w-4 h-4 mr-2 text-blue-600"
                        />
                        Payment Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {order.payment_method && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Method:
                            </span>
                            <div className="text-gray-900 capitalize">
                              {order.payment_method}
                            </div>
                          </div>
                        )}
                        {order.payment_ref &&
                          order.payment_ref !== "pending" && (
                            <div>
                              <span className="font-medium text-gray-700">
                                Reference:
                              </span>
                              <div className="text-gray-900 font-mono text-xs">
                                {order.payment_ref}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                      <FontAwesomeIcon
                        icon={faBox}
                        className="w-4 h-4 mr-2 text-primary-orange"
                      />
                      Order Items
                    </h4>
                    {order.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          width={64}
                          height={64}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h5>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} ×{" "}
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                            }).format(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                            }).format(item.quantity * item.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleViewReceipt(order)}
                      className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-500/90 transition-colors font-medium"
                    >
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      <span>View Receipt</span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Receipt Modal */}
      {showReceipt && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Order Receipt</h2>
              <button
                onClick={closeReceipt}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <OrderReceipt
                order={selectedOrder}
                transactionRef={transactionRef}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <FontAwesomeIcon
          icon={faSpinner}
          className="w-12 h-12 animate-spin text-primary-orange mx-auto mt-20"
        />
      }
    >
      <Orders />
    </Suspense>
  );
}
