"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Loader,
  ShoppingCart,
  Star,
  Phone,
  ChevronLeft,
  Copy,
  Check,
  Percent,
  Share2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import type { Product } from "@/store/cartStore";
import { ProductCard } from "@/components/ProductCard";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
}

export default function ProductDetails() {
  const { id: productId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const user = useAuthStore((state) => state.user);
  const { formatPrice, currency } = useCurrencyStore();

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0]);
    }
  }, [productImages]);

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
  }, [selectedColor, variants]);

  useEffect(() => {
    if (product) {
      fetchSimilarProducts();
    }
  }, [product]); // Listen for currency changes

  useEffect(() => {
    const handleCurrencyChange = () => {
      // Force re-render by updating a state
      setLinkCopied(false);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () =>
      window.removeEventListener("currencyChange", handleCurrencyChange);
  }, []);

  const fetchSimilarProducts = async () => {
    if (!product) return;

    try {
      setLoadingSimilar(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
        .neq("id", product.id)
        .eq("shipping_location", product.shipping_location)
        .order("rating", { ascending: false })
        .limit(4);

      if (error) throw error;
      setSimilarProducts(data || []);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      if (productError) throw productError;
      setProduct(productData);
      setRating(productData.rating || 5);
      const { data: imagesData, error: imagesError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId);
      if (imagesError) throw imagesError;
      const allImages = [
        productData.image,
        ...(imagesData?.map((item) => item.image_url) || []),
      ];
      setProductImages(allImages);
      setSelectedImage(allImages[0]);

      const { data: variantsData, error: variantsError } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId);

      if (variantsError) throw variantsError;
      if (variantsData) {
        setVariants(variantsData);
        const colors = [...new Set(variantsData.map((v) => v.color))];
        setAvailableColors(colors);
        if (colors.length > 0) {
          setSelectedColor(colors[0]);
        }
      }
      if (isLoggedIn && user) {
        const { data: userRatings, error: ratingError } = await supabase
          .from("product_ratings")
          .select("rating")
          .eq("product_id", productId)
          .eq("user_id", user.id);
        if (!ratingError && userRatings && userRatings.length > 0) {
          setHasRated(true);
          setRating(userRatings[0].rating);
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedImage) return;
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    if (variants.length > 0 && (!selectedColor || !selectedSize)) {
      return toast.error("Please select color and size options");
    }
    try {
      const selectedVariant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        return toast.error("Selected variant is out of stock");
      }

      const productWithOptions = {
        ...product,
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
    if (!product || !selectedImage) return;

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    if (variants.length > 0 && (!selectedColor || !selectedSize)) {
      return toast.error("Please select color and size options");
    }

    try {
      const selectedVariant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        return toast.error("Selected variant is out of stock");
      }

      const productWithOptions = {
        ...product,
        image: selectedImage,
        selectedColor,
        selectedSize,
        variantId: selectedVariant?.id,
      };

      await addToCart(productWithOptions);
      // Redirect to checkout page after adding to cart
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error in Buy Now:", error);
      toast.error("Failed to proceed to checkout. Please try again.");
    }
  };

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCallSeller = () => {
    if (product?.seller_phone) {
      window.location.href = `tel:${product.seller_phone}`;
    }
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % productImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(productImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex =
      (currentImageIndex - 1 + productImages.length) % productImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(productImages[newIndex]);
  };

  const getProductLink = () => {
    return `https://ulishastore.com/product/${productId}`;
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
    const text = product
      ? `Check out this product: ${product.name}`
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

  const handleRating = async (value: number) => {
    if (!isLoggedIn || !user || !product) {
      window.location.href = "/login";
      return;
    }

    try {
      const { error } = await supabase.from("product_ratings").upsert({
        product_id: product.id,
        user_id: user.id,
        rating: value,
      });

      if (error) throw error;

      setRating(value);
      setHasRated(true);
      toast.success("Thank you for rating this product!");

      const { data: ratings, error: ratingsError } = await supabase
        .from("product_ratings")
        .select("rating")
        .eq("product_id", product.id);

      if (ratingsError) throw ratingsError;

      if (ratings && ratings.length > 0) {
        const avgRating =
          ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;
        await supabase
          .from("products")
          .update({ rating: avgRating })
          .eq("id", product.id);
      }
    } catch (error) {
      console.error("Error rating product:", error);
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = product.original_price
    ? formatPrice(product.original_price)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-500"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to products</span>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                      <Percent className="w-4 h-4" />
                      <span className="font-bold">
                        {product.discount_percentage}% OFF
                      </span>
                    </div>
                  )}

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800 transform rotate-180" />
                    </button>
                  </>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((img, index) => (
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

                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all z-10 ml-2"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>

                {/* Share options dropdown */}
                {showShareOptions && (
                  <div className="absolute bottom-0 right-0 translate-y-full bg-white rounded-lg shadow-lg p-2 z-20 mt-2">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => shareToSocial("facebook")}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
                      >
                        <div className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-full">
                          f
                        </div>
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => shareToSocial("twitter")}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
                      >
                        <div className="w-5 h-5 bg-blue-400 text-white flex items-center justify-center rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </div>
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => shareToSocial("whatsapp")}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
                      >
                        <div className="w-5 h-5 bg-green-500 text-white flex items-center justify-center rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                          </svg>
                        </div>
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm whitespace-nowrap"
                      >
                        {linkCopied ? (
                          <>
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5 text-gray-500" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
                      onClick={() => handleRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverRating || rating) > i
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <span className="text-sm text-gray-500 ml-2">
                  {hasRated ? "Thanks for rating!" : "Click to rate"}
                </span>
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
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="flex-1 flex items-right gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    variants.length > 0 && (!selectedColor || !selectedSize)
                  }
                  className="flex items-center justify-center w-40 space-x-2 text-orange-500 text-xs hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline border border-orange-500 rounded-lg py-2 px-4 transition-colors duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
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
                  className="w-40 bg-orange-500 hover:bg-orange-500/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
