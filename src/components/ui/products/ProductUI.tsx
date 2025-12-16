/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faStar,
  faPercent,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { ProductCard } from "@/components/ProductCard";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { Database } from "@/supabase-types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Variant = Database["public"]["Tables"]["product_variants"]["Row"];

export default function ProductUI({
  product,
  images,
  variants,
  similarProducts,
  availableColors,
  isMobile,
}: {
  product: Product;
  images: { image_url: string }[];
  variants: Variant[];
  similarProducts: Product[];
  availableColors: string[];
  isMobile: boolean;
}) {
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  const addToCart = useCartStore((state) => state.addToCart);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const user = useAuthStore((state) => state.user);
  const { formatPrice, currency } = useCurrencyStore();

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0].image_url);
    }
  }, [images]);
  
  useEffect(() => {
    if (selectedColor) {
     const sizes = variants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
     setAvailableSizes([...new Set(sizes)]);
     if (!sizes.includes(selectedSize)) {
      setSelectedSize("");
     }
    }
  }, [selectedColor, selectedSize, variants]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (variants.length > 0 && (!selectedColor || !selectedSize)) {
      return toast.error("Please select color and size options");
    }
    try {
      const selectedVariant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        return toast.error("Selected variant is out of stock");
      }

      const resolveAddToCart = new Promise(async (resolve) => {
        try {
          await addToCart(
            product,
            selectedColor,
            selectedSize,
            selectedVariant?.id,
            1,
          );
          resolve(undefined);
        } catch (error) {
          resolve(error);
        }
      });

      toast.promise(resolveAddToCart, {
        pending: "Adding product to cart...",
        success: "Product added to cart successfully!",
        error: "Failed to add product to cart. Please try again.",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (variants.length > 0 && (!selectedColor || !selectedSize)) {
      return toast.error("Please select color and size options");
    }

    try {
      const selectedVariant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        return toast.error("Selected variant is out of stock");
      }

      await Promise.all([
        addToCart(product, selectedColor, selectedSize, selectedVariant?.id, 1),
        buyNow(product),
      ]);
    } catch (error) {
      console.error("Error in Buy Now:", error);
      toast.error("Failed to proceed to checkout. Please try again.");
    }
  };

  const buyNow = async (product: Product) => {
    try {
      const { data } = await axios.post("/api/paystack/initialize", {
        email: user?.email,
        amount: product.price,
      });

      if (!data.status)
        return toast.error(data.message || "Failed to initialize payment");
      router.push(data.data.authorization_url);
    } catch (error) {
      console.log("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
    }
  };

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex].image_url);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex].image_url);
  };

  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = product.original_price
    ? formatPrice(product.original_price)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: images.map(img => img.image_url),
            description: product.description,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: "Ulisha",
            },
            offers: {
              "@type": "Offer",
              url: `https://www.ulishastore.com/product/${product.id}`,
              priceCurrency: "NGN",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Ulisha Store",
              },
            },
          }),
        }}
      />

      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              className="rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => router.back()}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-gray-700"
                size="lg"
              />
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900 capitalize">
              Back
            </h1>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div>
                <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
                  <Image
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />

                  {product.discount_active &&
                    (product.discount_percentage ?? 0) > 0 && (
                      <div className="font-bold absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                        {product.discount_percentage}{" "}
                        <FontAwesomeIcon icon={faPercent} className="w-4 h-4" />
                        OFF
                      </div>
                    )}

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-300 rounded-full p-2 transition-all"
                      >
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          className="text-gray-800"
                          size="xl"
                        />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-300 rounded-full p-2 transition-all"
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="text-gray-800"
                          size="xl"
                        />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(img.image_url, index)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === img.image_url
                            ? "border-primary-orange ring-2 ring-primary-orange/20"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img.image_url}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={500}
                          height={500}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between relative">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-1xl md:text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className="focus:outline-none"
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={`w-5 h-5 ${
                            (product.rating || 0) > i
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  {product.discount_active && product.original_price ? (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">
                        {formattedPrice}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg text-gray-500 line-through">
                          {formattedOriginalPrice}
                        </span>

                        <span className="text-red-500 font-medium">
                          Save {product.discount_percentage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      {formattedPrice}
                    </div>
                  )}
                  {/* Currency indicator */}
                  <div className="text-sm text-gray-500 mt-1">
                    {currency === "USD"
                      ? "USD (converted from NGN)"
                      : "Nigerian Naira"}
                  </div>
                </div>

                {availableColors.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Color
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`
 px-4 py-2 rounded-full text-sm font-medium
 ${
   selectedColor === color
     ? "bg-gray-900 text-white"
     : "bg-gray-100 text-gray-900 hover:bg-gray-200"
 }
 transition-colors
    `}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableSizes.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Size
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => {
                        const variant = variants.find(
                          (v) => v.color === selectedColor && v.size === size,
                        );
                        const isOutOfStock = variant?.stock === 0;

                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            disabled={isOutOfStock}
                            className={`
  px-4 py-2 rounded-full text-sm font-medium
  ${
    selectedSize === size
      ? "bg-gray-900 text-white"
      : isOutOfStock
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
  }
  transition-colors
 `}
                          >
                            {size} {isOutOfStock && " (Out of Stock)"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <p className="text-gray-600 mb-6">{product.description}</p>
                {!isMobile && (
                  <div className="flex flex-1 items-right gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        variants.length > 0 && (!selectedColor || !selectedSize)
                      }
                      className="flex items-center justify-center w-40 space-x-2 text-orange-500 text-xs hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline border border-orange-500 rounded-lg py-2 px-4 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} size="xl" />
                      <span>
                        {variants.length > 0
                          ? selectedColor && selectedSize
                            ? "Add to Cart"
                            : "Select Options"
                          : "Add to Cart"}
                      </span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={
                        variants.length > 0 && (!selectedColor || !selectedSize)
                      }
                      className="flex items-center justify-center w-40  space-x-2 bg-orange-500 hover:bg-orange-500/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faArrowRight} size="lg" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Similar Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((similarProduct, idx) => (
                  <ProductCard key={idx} product={similarProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/*-- Footer with Add to Cart and Buy Now buttons --*/}
      {isMobile && (
        <div className="flex fixed bottom-16 left-0 right-0 bg-white border-t shadow-md p-1 items-center justify-around z-100">
          <button
            className="text-orange-500 w-full"
            onClick={handleAddToCart}
            disabled={variants.length > 0 && (!selectedColor || !selectedSize)}
          >
            <FontAwesomeIcon icon={faShoppingCart} size="1x" className="me-2" />
            Add to cart
          </button>
          <button
            className="bg-orange-500 text-white w-full py-3 rounded-lg"
            onClick={handleBuyNow}
            disabled={variants.length > 0 && (!selectedColor || !selectedSize)}
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" className="me-2" />
            Buy Now
          </button>
        </div>
      )}
    </>
  );
}
