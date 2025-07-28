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
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import type { Product } from "@/store/cartStore";
import { ProductCard } from "@/components/ProductCard";
import { useParams } from "next/navigation";
import Image from "next/image";

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
      showNotification("Please select color and size options", "error");
      return;
    }
    try {
      const selectedVariant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        showNotification("Selected variant is out of stock", "error");
        return;
      }

      const productWithOptions = {
        ...product,
        image: selectedImage,
        selectedColor,
        selectedSize,
        variantId: selectedVariant?.id,
      };
      await addToCart(productWithOptions);
      showNotification("Product added to cart!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification(
        "Failed to add product to cart. Please try again.",
        "error"
      );
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedImage) return;

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    if (variants.length > 0 && (!selectedColor || !selectedSize)) {
      showNotification("Please select color and size options", "error");
      return;
    }

    try {
      const selectedVariant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );

      if (selectedVariant && selectedVariant.stock <= 0) {
        showNotification("Selected variant is out of stock", "error");
        return;
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
      showNotification(
        "Failed to proceed to checkout. Please try again.",
        "error"
      );
    }
  };

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.createElement("div");
    notification.className = `fixed bottom-4 right-4 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("animate-fade-out");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
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
        showNotification("Link copied to clipboard!", "success");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        showNotification("Failed to copy link", "error");
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
      showNotification("Thank you for rating this product!", "success");

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
      showNotification("Failed to submit rating. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />{" "}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {" "}
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />{" "}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>{" "}
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed
          </p>{" "}
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-500/90 font-medium"
          >
            Go back to home{" "}
          </Link>{" "}
        </div>{" "}
      </div>
    );
  }

  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = product.original_price
    ? formatPrice(product.original_price)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="mb-6">
          {" "}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-500"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />{" "}
            <span>Back to products</span>{" "}
          </Link>{" "}
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {" "}
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
                      <ChevronLeft className="w-5 h-5 text-gray-800" />{" "}
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
              <div className="mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
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
                  {hasRated ? "Thanks for rating!" : "Click to rate"}{" "}
                </span>
              </div>
              <div className="mb-6">
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
                {/* Currency indicator */}{" "}
                <div className="text-sm text-gray-500 mt-1">
                  {currency === "USD"
                    ? "USD (converted from NGN)"
                    : "Nigerian Naira"}
                </div>
              </div>

              {availableColors.length > 0 && (
                <div className="mb-6">
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
                <div className="mb-6">
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
                          {size} {isOutOfStock && " (Out of Stock)"}{" "}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{product.description}</p>{" "}
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Product Link:
                </p>

                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={getProductLink()}
                    className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none bg-white"
                  />

                  <button
                    onClick={copyToClipboard}
                    className="bg-orange-500 text-white p-2 rounded-r-md hover:bg-orange-500/90"
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mb-6 border-t border-b py-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Share this product:
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => shareToSocial("facebook")}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </button>

                  <button
                    onClick={() => shareToSocial("twitter")}
                    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </button>

                  <button
                    onClick={() => shareToSocial("whatsapp")}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 0 1 7.022 2.91 9.788 9.788 0 0 1 2.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 flex items-right space-x-20">
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      variants.length > 0 && (!selectedColor || !selectedSize)
                    }
                    className="flex items-center space-x-2 text-[#000000] text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
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
                    className="bg-orange-500 hover:bg-orange-500/90 text-white font-medium py-2 px-7 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
