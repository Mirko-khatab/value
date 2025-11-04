"use client";

import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Product } from "@/app/lib/definitions";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import Image from "next/image";
import Link from "next/link";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import { MagnifyingGlassIcon, FolderIcon } from "@heroicons/react/24/outline";

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Check if language is RTL
  const isRTL = language === "ar" || language === "ku";

  // Helper function to get localized field
  const getLocalizedField = (item: any, fieldName: string): string => {
    const field = `${fieldName}_${language}`;
    return item[field] || item[`${fieldName}_en`] || "";
  };

  // Infinite scroll fetch function
  const fetchProducts = useCallback(async (page: number, limit: number) => {
    const response = await fetch(`/api/products/public?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  }, []);

  // Use infinite scroll hook
  const {
    items: products,
    loading,
    hasMore,
    lastElementRef
  } = useInfiniteScroll(fetchProducts, 12);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products as Product[];

    return (products as Product[]).filter((product) => {
      const title = getLocalizedField(product, "title").toLowerCase();
      const description = getLocalizedField(
        product,
        "description"
      ).toLowerCase();
      const query = searchQuery.toLowerCase();

      return title.includes(query) || description.includes(query);
    });
  }, [products, searchQuery, language, getLocalizedField]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
  };

  return (
    <ShowcaseLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black md:pt-60 pt-40">
        {/* Search Section - Full Width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
          {/* Search Bar */}
          <div
            className={`flex gap-4 mb-8 ${
              isRTL ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative flex-1 max-w-md ${
                isRTL ? "order-1" : "order-1"
              }`}
            >
              <div
                className={`absolute inset-y-0 ${
                  isRTL ? "right-0 pr-3" : "left-0 pl-3"
                } flex items-center pointer-events-none`}
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full ${
                  isRTL ? "pr-10 pl-3 text-right" : "pl-10 pr-3 text-left"
                } py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-md`}
                placeholder={t("search", {
                  en: "Search products...",
                  ar: "البحث في المنتجات...",
                  ku: "گەڕان لە بەرهەمەکان...",
                })}
              />
            </div>
          </div>

          {/* Results Summary & Reset */}
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm ${
              isRTL ? "sm:flex-row-reverse sm:justify-end" : "justify-between"
            }`}
          >
            <p
              className={`text-gray-600 dark:text-gray-400 text-base ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("showing_results", {
                en: `Showing ${filteredProducts.length} of ${products.length} products`,
                ar: `عرض ${filteredProducts.length} من ${products.length} منتج`,
                ku: `پیشاندانی ${filteredProducts.length} لە ${products.length} بەرهەم`,
              })}
            </p>
            {searchQuery && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base"
              >
                {t("reset_filters", {
                  en: "Reset Search",
                  ar: "إعادة تعيين البحث",
                  ku: "ڕێکخستنەوەی گەڕان",
                })}
              </button>
            )}
          </div>
        </div>

        {/* Products Grid - Full Width */}
        <div className="w-full py-8 sm:py-12">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  {t("no_products", {
                    en: "No products found",
                    ar: "لم يتم العثور على منتجات",
                    ku: "هیچ بەرهەمێک نەدۆزرایەوە",
                  })}
                </p>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 ${
                  isRTL ? "dir-rtl" : "dir-ltr"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 hover:-translate-y-2"
                    ref={index === filteredProducts.length - 1 ? lastElementRef : null}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      {product.gallery_image_url ? (
                        <Image
                          src={product.gallery_image_url}
                          alt={getLocalizedField(product, "title") || "Product"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <FolderIcon className="h-16 w-16 sm:h-20 sm:w-20" />
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Product Title */}
                    <div className="p-5 sm:p-6">
                      <h3
                        className={`text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getLocalizedField(product, "title")}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            )}
            
            {/* End of results indicator */}
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("no_more_products", {
                    en: "No more products to load",
                    ar: "لا توجد منتجات أخرى للتحميل",
                    ku: "هیچ بەرهەمێکی تر نییە بۆ بارکردن",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ShowcaseLayout>
  );
}
