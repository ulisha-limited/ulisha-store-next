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

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTrash,
  faEdit,
  faXmark,
  faBox,
  faPlus,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { v4 as uuidv4 } from "uuid";
import { Database } from "@/supabase-types";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

type Product = Database["public"]["Tables"]["products"]["Row"];
interface AnalyticsData {
  totalUsers: number;
  todayVisitors: number;
  todayPageViews: number;
  todayNewUsers: number;
  todayOrders: number;
  todayRevenue: number;
  weeklyStats: Array<{
    date: string;
    unique_visitors: number;
    page_views: number;
    new_users: number;
    orders_count: number;
    revenue: number;
  }>;
}

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const productImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const adImageRef = useRef<HTMLInputElement>(null);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "Clothes",
    description: "",
    image: null as File | null,
    additionalImages: [] as File[],
    original_price: "",
    discount_price: "",
    discount_active: false,
    shipping_location: "Nigeria",
  });

  const [adData, setAdData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    button_text: "",
    button_link: "",
    active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData.image && !editingProduct) {
      alert("Please select a product image");
      return;
    }

    try {
      setFormLoading(true);

      const productToSave = {
        name: productData.name,
        category: productData.category,
        description: productData.description,
        price: parseFloat(productData.original_price),
        discount_price: productData.discount_active
          ? parseFloat(productData.discount_price)
          : null,
        discount_active: productData.discount_active,
        shipping_location: productData.shipping_location,
      };

      if (editingProduct) {
        const updates: {
          name: string;
          category: string;
          description: string;
          price: number;
          discount_price: number | null;
          discount_active: boolean;
          shipping_location: string;
          image?: string;
        } = { ...productToSave };

        if (productData.image) {
          const imageName = `${uuidv4()}-${productData.image.name}`;
          const compressedImage = await imageCompression(
            productData.image,
            options,
          );

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(imageName, compressedImage, {
              cacheControl: "3600",
              upsert: false,
              contentType: compressedImage.type,
            });

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl: imageUrl },
          } = supabase.storage.from("product-images").getPublicUrl(imageName);

          updates.image = imageUrl;
        }

        const { error: updateError } = await supabase
          .from("products")
          .update(updates)
          .eq("id", editingProduct.id);

        if (updateError) throw updateError;

        if (productData.additionalImages.length > 0) {
          const additionalImagePromises = productData.additionalImages.map(
            async (file) => {
              const fileName = `${uuidv4()}-${file.name}`;
              const { error: additionalUploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, file, {
                  contentType: "image/jpeg",
                  cacheControl: "2592000", // TTL 30 days in seconds
                  upsert: false,
                });

              if (additionalUploadError) throw additionalUploadError;

              const {
                data: { publicUrl: additionalImageUrl },
              } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

              return {
                product_id: editingProduct.id,
                image_url: additionalImageUrl,
              };
            },
          );

          const additionalImageData = await Promise.all(
            additionalImagePromises,
          );

          const { error: additionalImagesError } = await supabase
            .from("product_images")
            .insert(additionalImageData);

          if (additionalImagesError) throw additionalImagesError;
        }

        pingIndexNow(editingProduct.id);
      } else {
        if (!productData.image) {
          throw new Error("Product image is required");
        }

        const imageName = `${uuidv4()}-${productData.image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(imageName, productData.image, {
            contentType: "image/jpeg",
            cacheControl: "2592000", // TTL 30 days in seconds
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl: imageUrl },
        } = supabase.storage.from("product-images").getPublicUrl(imageName);

        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert([
            {
              ...productToSave,
              image: imageUrl,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        if (productData.additionalImages.length > 0) {
          const additionalImagePromises = productData.additionalImages.map(
            async (file) => {
              const fileName = `${uuidv4()}-${file.name}`;
              const { error: additionalUploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, file, {
                  contentType: "image/jpeg",
                  cacheControl: "2592000", // TTL 30 days in seconds
                  upsert: false,
                });

              if (additionalUploadError) throw additionalUploadError;

              const {
                data: { publicUrl: additionalImageUrl },
              } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName);

              return {
                product_id: newProduct.id,
                image_url: additionalImageUrl,
              };
            },
          );

          const additionalImageData = await Promise.all(
            additionalImagePromises,
          );

          const { error: additionalImagesError } = await supabase
            .from("product_images")
            .insert(additionalImageData);

          if (additionalImagesError) throw additionalImagesError;
        }

        pingIndexNow(newProduct.id);
      }

      setProductData({
        name: "",
        price: "",
        category: "Clothes",
        description: "",
        image: null,
        additionalImages: [],
        original_price: "",
        discount_price: "",
        discount_active: false,
        shipping_location: "Nigeria",
      });

      if (productImageRef.current) productImageRef.current.value = "";
      if (additionalImagesRef.current) additionalImagesRef.current.value = "";

      setShowProductForm(false);
      setEditingProduct(null);
      fetchProducts();

      toast.success(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!",
      );
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error saving product. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const pingIndexNow = (productId: string) => {
    try {
      fetch(`/api/webmasters/bing/indexnow?productId=${productId}`);
    } catch (error) {
      console.error("Error pinging IndexNow:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeleteLoading(true);

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      fetchProducts();
      setDeleteConfirmation(null);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleProductImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductData({ ...productData, image: e.target.files[0] });
    }
  };

  const handleAdditionalImagesSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setProductData({
        ...productData,
        additionalImages: [...productData.additionalImages, ...newFiles],
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    const updatedImages = [...productData.additionalImages];
    updatedImages.splice(index, 1);
    setProductData({ ...productData, additionalImages: updatedImages });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="w-8 h-8 animate-spin text-primary-orange"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link
                href="/my-account"
                className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Go back to admin panel"
              >
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="w-6 h-6 text-gray-700"
                />
              </Link>

              <h1 className="text-2xl font-extrabold text-gray-900">
                Products
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-orange-500 text-white px-2 py-1 rounded-md hover:bg-orange-500/90 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Form */}
        {showProductForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productData.name}
                    onChange={(e) =>
                      setProductData({ ...productData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black-700">
                    Original Price (NGN)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={productData.original_price}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        original_price: e.target.value,
                      })
                    }
                    className=" text-gray-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="discount_active"
                      checked={productData.discount_active}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          discount_active: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
                    />
                    <label
                      htmlFor="discount_active"
                      className="text-sm font-medium text-gray-700"
                    >
                      Apply Discount
                    </label>
                  </div>

                  {productData.discount_active && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Discount Price (NGN)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={productData.discount_price}
                        onChange={(e) =>
                          setProductData({
                            ...productData,
                            discount_price: e.target.value,
                          })
                        }
                        className="  text-gray-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    required
                    value={productData.category}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        category: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                  >
                    <option value="Clothes">Clothes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Smart Watches">Smart Watches</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Perfumes & Body Spray">
                      Perfumes Body Spray
                    </option>
                    <option value="Phones">Phones</option>
                    <option value="Handbags">Handbags</option>
                    <option value="Jewelries">Jewelries</option>
                    <option value="Gym Wear">Gym Wear</option>
                    <option value="Kids toy">Kids toy</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Female clothings">Female clothings</option>
                    <option value="Computer and gaming">
                      Computer and gaming
                    </option>
                    <option value="E bikes">E-bikes</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shipping Location
                </label>
                <select
                  required
                  value={productData.shipping_location}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      shipping_location: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Abroad">Abroad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  className=" text-gray-500 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Main Product Image
                  </label>
                  <input
                    type="file"
                    ref={productImageRef}
                    accept="image/*"
                    onChange={handleProductImageSelect}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-orange-500 file:text-white
                      file:hover:bg-orange-500/90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images
                  </label>
                  <input
                    type="file"
                    ref={additionalImagesRef}
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesSelect}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-orange-500 file:text-white
                      file:hover:bg-orange-500/90"
                  />
                </div>
              </div>

              {/* Preview of additional images */}
              {productData.additionalImages.length > 0 && (
                <div className="grid grid-cols-6 gap-2">
                  {productData.additionalImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Additional image ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                        width={80}
                        height={80}
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-500/90 transition-colors flex items-center space-x-2"
                >
                  {formLoading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="h-5 w-5 animate-spin"
                      />
                      <span>
                        {editingProduct ? "Updating..." : "Adding..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                      <span>
                        {editingProduct ? "Update Product" : "Add Product"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        {products.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Products ({products.length})
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.image}
                                alt=""
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                            }).format(product.price)}
                          </div>
                          {product.discount_active &&
                            product.original_price && (
                              <div className="text-xs text-gray-500">
                                <span className="line-through">
                                  {new Intl.NumberFormat("en-NG", {
                                    style: "currency",
                                    currency: "NGN",
                                  }).format(product.original_price)}
                                </span>
                                <span className="ml-1 text-green-600">
                                  -{product.discount_percentage}%
                                </span>
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.shipping_location}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setProductData({
                                  name: product.name,
                                  price: product.price.toString(),
                                  category: product.category,
                                  description: product.description,
                                  image: null,
                                  additionalImages: [],
                                  original_price:
                                    product.original_price?.toString() ||
                                    product.price.toString(),
                                  discount_price:
                                    product.discount_price?.toString() || "",
                                  discount_active:
                                    product.discount_active || false,
                                  shipping_location: product.shipping_location,
                                });
                                setShowProductForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="h-4 w-4"
                              />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="h-4 w-4"
                              />
                            </button>
                          </div>
                          {deleteConfirmation === product.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                              <div className="px-4 py-2 text-sm text-gray-700">
                                Delete this product?
                              </div>
                              <div className="border-t border-gray-100"></div>
                              <div className="flex justify-end px-4 py-2 space-x-2">
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  disabled={deleteLoading}
                                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                                >
                                  {deleteLoading ? (
                                    <FontAwesomeIcon
                                      icon={faSpinner}
                                      className="h-4 w-4 animate-spin"
                                    />
                                  ) : (
                                    "Delete"
                                  )}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmation(null)}
                                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FontAwesomeIcon
              icon={faBox}
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No products yet
            </h2>
            <p className="text-gray-600 mb-6">
              Add your first product to get started
            </p>
            <button
              onClick={() => setShowProductForm(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-500/90 transition-colors flex items-center mx-auto"
            >
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
              <span>Add Product</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
