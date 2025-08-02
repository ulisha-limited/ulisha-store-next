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
import {
  faMapMarkerAlt,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { toast } from "react-toastify";

export interface Address {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddEditAddress, setShowAddEditAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    is_default: false,
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const loadUserAddresses = useCallback(async () => {
    if (!user) return;
    setAddressLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

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
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        is_default: false,
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

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) {
      return toast.error("Please log in to delete addresses.");
    }
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

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

  const handleEditAddressClick = (address: Address) => {
    setCurrentAddress(address);
    setAddressFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      is_default: address.is_default,
    });
    setShowAddEditAddress(true);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) {
      return toast.error("Please log in to set default address.");
    }
    setAddressLoading(true);
    try {
      // First, unset all other default addresses for this user
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", addressId); // Exclude the one we're about to set as default

      // Then, set the chosen address as default
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Default address set successfully!");
      loadUserAddresses(); // Reload addresses to reflect changes
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-8">
          <Link
            href="/settings"
            className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back to settings"
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} className="w-6 h-6 text-gray-700" />
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900">
            Address Management
          </h1>
        </div>

        {(success || error) && (
          <div
            className={`p-4 rounded-md mb-4 ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{success || error}</p>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-bold text-gray-900">Your Addresses</h2>
            <button
              onClick={() => {
                setShowAddEditAddress(true);
                setCurrentAddress(null);
                setAddressFormData({
                  street: "",
                  city: "",
                  state: "",
                  zip: "",
                  country: "",
                  is_default: false,
                });
              }}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-500/90 flex items-center space-x-1.5 text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>
          <div className="p-6">
            {addressLoading && (
              <div className="text-center text-gray-500 py-4">
                Loading addresses...
              </div>
            )}
            {!addressLoading && addresses.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No addresses found. Add your first address!
              </div>
            )}
            {!addressLoading && addresses.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4 relative bg-gray-50 flex flex-col"
                  >
                    {address.is_default && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <p className="font-semibold text-gray-800 break-words">
                      {address.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.zip}, {address.country}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm justify-end">
                      <button
                        onClick={() => handleEditAddressClick(address)}
                        className="text-primary-orange hover:text-primary-orange/80 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                      {!address.is_default && (
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

            {showAddEditAddress && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative my-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {currentAddress ? "Edit Address" : "Add New Address"}
                  </h3>
                  <form onSubmit={handleAddEditAddress} className="space-y-4">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                        required
                      />
                    </div>
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                          required
                        />
                      </div>
                    </div>
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          id="country"
                          value={addressFormData.country}
                          onChange={handleAddressInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-orange focus:ring-primary-orange sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="is_default"
                        name="is_default"
                        type="checkbox"
                        checked={addressFormData.is_default}
                        onChange={handleAddressInputChange}
                        className="h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
                      />
                      <label
                        htmlFor="is_default"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Set as default address
                      </label>
                    </div>
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
        </section>
      </div>
    </div>
  );
}
