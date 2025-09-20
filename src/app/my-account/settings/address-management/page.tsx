/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toast } from "react-toastify";
import { Database } from "@/supabase-types";

type Address = Database["public"]["Tables"]["user_addresses"]["Row"];
type AddressUpdate = Database["public"]["Tables"]["user_addresses"]["Update"];

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddEditAddress, setShowAddEditAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const [addressFormData, setAddressFormData] = useState({
    country: "",
    state: "",
    city: "",
    street: "",
    zip: 0,
    notes: "",
    name: "",
    phone_no: "",
    is_primary: false,
  });

  const loadUserAddresses = useCallback(async () => {
    if (!user) return;
    setAddressLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Failed to load addresses.");
    } finally {
      setAddressLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserAddresses();
  }, [loadUserAddresses]);

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddEditAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Please log in to manage addresses.");
    }
    setAddressLoading(true);
    try {
      if (currentAddress) {
        const { error } = await supabase
          .from("user_addresses")
          .update(addressFormData)
          .eq("id", currentAddress.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Address updated successfully!");
      } else {
        const { error } = await supabase
          .from("user_addresses")
          .insert({ ...addressFormData, user_id: user.id });

        if (error) throw error;
        toast.success("Address added successfully!");
      }
      setShowAddEditAddress(false);
      setCurrentAddress(null);
      setAddressFormData({
        country: "",
        state: "",
        city: "",
        street: "",
        zip: 0,
        notes: "",
        name: "",
        phone_no: "",
        is_primary: false,
      });
      loadUserAddresses();
    } catch (error) {
      console.error("Error adding/updating address:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save address. Please try again."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!user) {
      return toast.error("Please log in to delete addresses.");
    }
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setAddressLoading(true);
    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Address deleted successfully!");
      loadUserAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete address."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddressClick = (address: any) => {
    setCurrentAddress(address);
    setAddressFormData(address);
    setShowAddEditAddress(true);
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    if (!user) {
      return toast.error("Please log in to set default address.");
    }
    setAddressLoading(true);
    try {
      await supabase
        .from("user_addresses")
        .update({ is_primary: false })
        .eq("user_id", user.id)
        .neq("id", addressId);

      const { error } = await supabase
        .from("user_addresses")
        .update({ is_primary: true })
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Default address set successfully!");
      loadUserAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to set default address. Please try again."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header with Back Icon + Title */}
        <div className="flex items-center space-x-3 mb-6 sm:mb-8">
          <Link
            href="/my-account/settings"
            className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Address Management
          </h1>
        </div>

        {(success || error) && (
          <div
            className={`p-4 rounded-md mb-4 ${
              success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{success || error}</p>
          </div>
        )}

        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Your Addresses
            </h2>
            <button
              onClick={() => {
                setShowAddEditAddress(true);
                setCurrentAddress(null);
                setAddressFormData({
                  country: "",
                  state: "",
                  city: "",
                  street: "",
                  zip: 0,
                  notes: "",
                  name: "",
                  phone_no: "",
                  is_primary: false,
                });
              }}
              className="w-full sm:w-auto px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-500/90 flex items-center justify-center space-x-2 text-sm shadow-sm"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>

          {/* Addresses List */}
          <div className="p-4 sm:p-6">
            {addressLoading && (
              <div className="text-center text-gray-500 py-6 text-sm">
                Loading addresses...
              </div>
            )}
            {!addressLoading && addresses.length === 0 && (
              <div className="text-center text-gray-500 py-6 text-sm">
                No addresses found. Add your first address!
              </div>
            )}
            {!addressLoading && addresses.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col"
                  >
                    {address.is_primary && (
                      <span className="self-end mb-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Primary
                      </span>
                    )}
                    <p className="font-semibold text-gray-800 break-words">
                      {address.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.state}, {address.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.country}, {address.zip}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm justify-end">
                      <button
                        onClick={() => handleEditAddressClick(address)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                      {!address.is_primary && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Add/Edit Address Modal */}
        {showAddEditAddress && addressFormData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative my-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {currentAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <form onSubmit={handleAddEditAddress} className="space-y-4">
                {/* Street */}
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    id="street"
                    value={addressFormData.street}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                    required
                  />
                </div>
                {/* City + State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={addressFormData.city}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={addressFormData.state}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                </div>
                {/* Zip + Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      value={addressFormData.zip}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      id="notes"
                      value={addressFormData.notes || ""}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                </div>
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={addressFormData.name}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone_no"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone No.
                    </label>
                    <input
                      type="text"
                      name="phone_no"
                      id="phone_no"
                      value={addressFormData.phone_no}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                </div>
                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    id="is_primary"
                    name="is_primary"
                    type="checkbox"
                    checked={addressFormData.is_primary}
                    onChange={handleAddressInputChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_primary"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Set as default address
                  </label>
                </div>
                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddEditAddress(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-500/90 disabled:opacity-50 text-sm"
                  >
                    {addressLoading
                      ? "Saving..."
                      : currentAddress
                      ? "Save Changes"
                      : "Add Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
