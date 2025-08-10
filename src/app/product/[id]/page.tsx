/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faStar,
  faCircleChevronLeft,
  faCheck,
  faPercent,
  faShareAlt,
  faChevronLeft,
  faChevronRight,
  faArrowRightLong,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy, faComment } from "@fortawesome/free-regular-svg-icons";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import type { Product } from "@/store/cartStore";
import { ProductCard } from "@/components/ProductCard";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";

export default function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();
  const router = useRouter();
  const [initialProduct, setInitialProduct] = useState<Product | null>(null);
  const [initialSimilarProducts, setInitialSimilarProducts] = useState<
    Product[]
  >([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [initialVariants, setInitialVariants] = useState<any[]>([]);
  const [initialAvailableColors, setInitialAvailableColors] =
    useState<string[]>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  const [showShareOptions, setShowShareOptions] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const user = useAuthStore((state) => state.user);
  const { formatPrice, currency } = useCurrencyStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      const { data: imagesData } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId);

      const allImages = [
        product.image,
        ...(imagesData?.map((img) => img.image_url) || []),
      ];

      const { data: variantsData } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId);

      const availableColors = [
        ...new Set(variantsData?.map((variant) => variant.color) || []),
      ];

      const { data: similarProduct, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
        .neq("id", product.id)
        .eq("shipping_location", product.shipping_location)
        .order("rating", { ascending: false })
        .limit(4);

      setInitialProduct(product);
      setInitialImages(allImages);
      setInitialVariants(variantsData || []);
      setInitialAvailableColors(availableColors);
      setInitialSimilarProducts(similarProduct || []);
      setLoading(false);
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (initialImages.length > 0) {
      setSelectedImage(initialImages[0]);
    }
  }, [initialImages]);

  useEffect(() => {
    if (selectedColor) {
      const sizes = initialVariants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size);
      setAvailableSizes([...new Set(sizes)]);
      if (!sizes.includes(selectedSize)) {
        setSelectedSize("");
      }
    }
  }, [selectedColor, selectedSize, initialVariants]);

  const handleAddToCart = async () => {
    if (!initialProduct || !selectedImage) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (initialVariants.length > 0 && (!selectedColor || !selectedSize)) {
      return toast.error("Please select color and size options");
    }
    try {
      const selectedVariant = initialVariants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        return toast.error("Selected variant is out of stock");
      }

      const productWithOptions = {
        ...initialProduct,
        image: selectedImage,
        selectedColor,
        selectedSize,
        variantId: selectedVariant?.id,
      };

      const resolveAddToCart = new Promise(async (resolve) => {
        try {
          await addToCart(productWithOptions);
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
    if (!initialProduct || !selectedImage) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (initialVariants.length > 0 && (!selectedColor || !selectedSize)) {
      return toast.error("Please select color and size options");
    }

    try {
      const selectedVariant = initialVariants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        return toast.error("Selected variant is out of stock");
      }

      const productWithOptions = {
        ...initialProduct,
        image: selectedImage,
        selectedColor,
        selectedSize,
        variantId: selectedVariant?.id,
      };

      await Promise.all([
        addToCart(productWithOptions),
        buyNow(productWithOptions),
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
    const newIndex = (currentImageIndex + 1) % initialImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(initialImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex =
      (currentImageIndex - 1 + initialImages.length) % initialImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(initialImages[newIndex]);
  };

  const getProductLink = () => {
    return `https://www.ulishastore.com/product/${productId}`;
  };

  const copyToClipboard = () => {
    const link = getProductLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setLinkCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link");
      });
  };

  const shareToSocial = (platform: "facebook" | "twitter" | "whatsapp") => {
    const link = getProductLink();
    const text = initialProduct
      ? `Check out this product: ${initialProduct.name}`
      : "Check out this product";
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          link
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(link)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${text} ${link}`
        )}`;
        break;
    }

    window.open(shareUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (!initialProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed
          </p>
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-500/90 font-medium"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = formatPrice(initialProduct.price);
  const formattedOriginalPrice = initialProduct.original_price
    ? formatPrice(initialProduct.original_price)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: initialProduct.name,
            image: initialImages,
            description: initialProduct.description,
            sku: initialProduct.id,
            brand: {
              "@type": "Brand",
              name: "Ulisha",
            },
            offers: {
              "@type": "Offer",
              url: `https://www.ulishastore.com/products/${initialProduct.id}`,
              priceCurrency: "NGN",
              price: initialProduct.price,
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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-3">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-orange-500"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 mr-1" />
              <span>Back to products</span>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div>
                <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
                  <Image
                    src={selectedImage || initialProduct.image}
                    alt={initialProduct.name}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />

                  {initialProduct.discount_active &&
                    (initialProduct.discount_percentage ?? 0) > 0 && (
                      <div className="font-bold absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                        {initialProduct.discount_percentage}{" "}
                        <FontAwesomeIcon icon={faPercent} className="w-4 h-4" />
                        OFF
                      </div>
                    )}

                  {initialImages.length > 1 && (
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
                {initialImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {initialImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(img, index)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === img
                            ? "border-primary-orange ring-2 ring-primary-orange/20"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${initialProduct.name} thumbnail ${index + 1}`}
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
                    {initialProduct.category}
                  </span>

                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="hover:bg-gray-200 p-2 rounded-full transition-all ml-2"
                  >
                    <FontAwesomeIcon
                      icon={faShareAlt}
                      className="text-gray-700"
                      size="lg"
                    />
                  </button>

                  {/* Share options dropdown */}
                  {showShareOptions && (
                    <div className="absolute bottom-0 right-0 translate-y-full bg-white rounded-lg shadow-lg p-2 z-20 mt-2">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => shareToSocial("facebook")}
                          className="hover:bg-orange-100 text-gray-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm whitespace-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faFacebook}
                            className="w-7 h-7 p-1 bg-blue-600 text-white flex items-center justify-center rounded-full"
                          />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => shareToSocial("twitter")}
                          className="hover:bg-orange-100 text-gray-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm whitespace-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faTwitter}
                            className="w-7 h-7 p-1 bg-black text-white flex items-center justify-center rounded-full"
                          />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => shareToSocial("whatsapp")}
                          className="hover:bg-orange-100 text-gray-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm whitespace-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faComment}
                            className="w-7 h-7 p-1 bg-green-500 text-white flex items-center justify-center rounded-full"
                          />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="hover:bg-orange-100 text-gray-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm whitespace-nowrap"
                        >
                          {linkCopied ? (
                            <>
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="w-7 h-7 text-green-500"
                              />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faCopy}
                                className="w-7 h-7 text-gray-500"
                              />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <h1 className="text-1xl md:text-3xl font-bold text-gray-900 mb-4">
                  {initialProduct.name}
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
                            initialProduct.rating > i
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  {initialProduct.discount_active &&
                  initialProduct.original_price ? (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">
                        {formattedPrice}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg text-gray-500 line-through">
                          {formattedOriginalPrice}
                        </span>

                        <span className="text-red-500 font-medium">
                          Save {initialProduct.discount_percentage}%
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

                {initialAvailableColors &&
                  initialAvailableColors.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Color
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {initialAvailableColors.map((color) => (
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
                        const variant = initialVariants.find(
                          (v) => v.color === selectedColor && v.size === size
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
                <p className="text-gray-600 mb-6">
                  {initialProduct.description}
                </p>
                <div className="flex-1 flex items-right gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      initialVariants.length > 0 &&
                      (!selectedColor || !selectedSize)
                    }
                    className="flex items-center justify-center w-40 space-x-2 text-orange-500 text-xs hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline border border-orange-500 rounded-lg py-2 px-4 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} size="xl" />
                    <span>
                      {initialVariants.length > 0
                        ? selectedColor && selectedSize
                          ? "Add to Cart"
                          : "Select Options"
                        : "Add to Cart"}
                    </span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={
                      initialVariants.length > 0 &&
                      (!selectedColor || !selectedSize)
                    }
                    className="flex items-center justify-center w-40  space-x-2 bg-orange-500 hover:bg-orange-500/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faArrowRight} size="lg" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {initialSimilarProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Similar Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {initialSimilarProducts.map((similarProduct, idx) => (
                  <ProductCard key={idx} product={similarProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
