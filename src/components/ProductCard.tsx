import Link from "next/link";
import Image from "next/image";
import { Database } from "@/supabase-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faStar } from "@fortawesome/free-solid-svg-icons";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductCard({ product }: { product: Product }) {
  function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group overflow-hidden">
        <div className="relative pb-[100%] overflow-hidden rounded-t-lg">
          <Image
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200 cursor-pointer"
            width={500}
            height={500}
            priority
          />

          {/* Discount badge */}
          {product.discount_active &&
            (product.discount_percentage ?? 0) > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{product.discount_percentage}%
              </div>
            )}

          {/* Shipped from abroad badge */}
          {product.shipping_location === "Abroad" && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium flex items-center">
              <FontAwesomeIcon icon={faPlane} className="mr-2" size="sm" />
              <span className="hidden xs:inline">Shipped from abroad</span>
              <span className="xs:hidden">From Abroad</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="mb-1">
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {product.category}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center text-orange-400">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  icon={faStar}
                  key={i}
                  className={`w-3 h-3 ${
                    (product.rating || 5) > i ? "fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </Link>
  );
}
