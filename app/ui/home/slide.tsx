"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/app/lib/language-context";
import Link from "next/link";

interface Project {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  gallery_image_url?: string;
}

interface Product {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  gallery_image_url?: string;
}

interface Graphic {
  id: string;
  image_url: string;
  created_at: string;
}

interface Event {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  gallery_image_url?: string;
}

interface SlideItem {
  type: "projects" | "products" | "graphics" | "events";
  title_ku: string;
  title_en: string;
  title_ar: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  items: (Project | Product | Graphic | Event)[];
  link: string;
}

interface SlideProps {
  autoPlay?: boolean;
  interval?: number;
}

export const Slide: React.FC<SlideProps> = ({
  autoPlay = true,
  interval = 8000,
}) => {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [graphics, setGraphics] = useState<Graphic[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper function to get localized field
  const getLocalizedField = (item: any, fieldName: string): string => {
    const field = `${fieldName}_${language}`;
    return item[field] || item[`${fieldName}_en`] || "";
  };

  // Check if language is RTL
  const isRTL = language === "ar" || language === "ku";

  // Fetch latest content from all sections
  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        setLoading(true);
        const [
          projectsResponse,
          productsResponse,
          graphicsResponse,
          eventsResponse,
        ] = await Promise.all([
          fetch("/api/projects/public?limit=6"),
          fetch("/api/products/public?limit=6"),
          fetch("/api/graphics?limit=6"),
          fetch("/api/event?limit=6"),
        ]);

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.slice(0, 6));
        }

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.slice(0, 6));
        }

        if (graphicsResponse.ok) {
          const graphicsData = await graphicsResponse.json();
          setGraphics(graphicsData.slice(0, 6));
        }

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching latest content:", error);
        // Set fallback data
        setProjects([]);
        setProducts([]);
        setGraphics([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestContent();
  }, []);

  // Create slide items from fetched data (only if items exist)
  const slideItems: SlideItem[] = [];

  if (projects.length > 0) {
    slideItems.push({
      type: "projects",
      title_ku: "پڕۆژەکان",
      title_en: "Projects",
      title_ar: "المشاريع",
      description_ku: "دوایین پڕۆژە ئەندازیارییەکانمان ببینن",
      description_en: "Explore our latest engineering projects",
      description_ar: "استكشف أحدث مشاريعنا الهندسية",
      items: projects,
      link: "/projects",
    });
  }

  if (products.length > 0) {
    slideItems.push({
      type: "products",
      title_ku: "بەرهەمەکان",
      title_en: "Products",
      title_ar: "المنتجات",
      description_ku: "دوایین بەرهەمەکانمان ببینن",
      description_en: "Discover our latest products",
      description_ar: "اكتشف أحدث منتجاتنا",
      items: products,
      link: "/product",
    });
  }

  if (graphics.length > 0) {
    slideItems.push({
      type: "graphics",
      title_ku: "گرافیکەکان",
      title_en: "Graphics",
      title_ar: "الرسوميات",
      description_ku: "دوایین دیزاینە داهێنەرەکانمان ببینن",
      description_en: "Discover our latest creative graphic designs",
      description_ar: "اكتشف أحدث تصاميمنا الجرافيكية الإبداعية",
      items: graphics,
      link: "/graphics",
    });
  }

  if (events.length > 0) {
    slideItems.push({
      type: "events",
      title_ku: "ڕووداوەکان",
      title_en: "Events",
      title_ar: "الأحداث",
      description_ku: "دوایین ڕووداوە گرنگەکانمان ببینن",
      description_en: "Check out our latest important events",
      description_ar: "تحقق من أحدث أحداثنا المهمة",
      items: events,
      link: "/event",
    });
  }

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && slideItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === slideItems.length - 1 ? 0 : prev + 1
        );
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, slideItems.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400 text-xl">
          {t("loading", {
            en: "Loading content...",
            ar: "جاري تحميل المحتوى...",
            ku: "بارکردنی ناوەڕۆک...",
          })}
        </div>
      </div>
    );
  }

  // Show empty state if no content
  if (slideItems.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            {t("no_content", {
              en: "No content available",
              ar: "لا يوجد محتوى متاح",
              ku: "هیچ ناوەڕۆکێک بەردەست نییە",
            })}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("check_back", {
              en: "Please check back later",
              ar: "يرجى المراجعة لاحقاً",
              ku: "تکایە دواتر بگەڕێوە",
            })}
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slideItems[currentIndex];

  // Get background image from the first item of current slide
  const getBackgroundImage = (slide: SlideItem): string => {
    if (slide.items.length === 0) return "/image/2.jpg";

    const firstItem = slide.items[0];
    if (slide.type === "graphics") {
      const imageUrl = (firstItem as Graphic).image_url;
      return imageUrl && imageUrl.trim() !== "" ? imageUrl : "/image/2.jpg";
    } else {
      const galleryImageUrl = (firstItem as Project | Product | Event)
        .gallery_image_url;
      return galleryImageUrl && galleryImageUrl.trim() !== ""
        ? galleryImageUrl
        : "/image/2.jpg";
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getBackgroundImage(currentSlide)}
          alt={getLocalizedField(currentSlide, "title")}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/image/2.jpg") {
              target.src = "/image/2.jpg";
            }
          }}
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div
              className={`${
                isRTL ? "lg:order-2 text-right" : "lg:order-1 text-left"
              }`}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                {getLocalizedField(currentSlide, "title")}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed drop-shadow-lg">
                {getLocalizedField(currentSlide, "description")}
              </p>

              {/* View All Button */}
              <Link
                href={currentSlide.link}
                className="inline-flex items-center px-8 py-4 bg-[#2E5A7A] text-white font-semibold rounded-full hover:bg-[#1e3a4a] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("explore_more", {
                  en: "Explore More",
                  ar: "استكشف المزيد",
                  ku: "زیاتر بگەڕێ",
                })}
                <svg
                  className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                  />
                </svg>
              </Link>
            </div>

            {/* Items Grid */}
            <div className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
              {currentSlide.items.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentSlide.items.slice(0, 6).map((item, index) => (
                    <Link
                      key={item.id}
                      href={
                        currentSlide.type === "projects"
                          ? `/project/${item.id}`
                          : currentSlide.type === "products"
                          ? `/product/${item.id}`
                          : currentSlide.type === "events"
                          ? `/event/${item.id}`
                          : "#"
                      }
                    >
                      <div className="group bg-white/10 backdrop-blur-sm dark:bg-gray-800/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 border border-white/20">
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={
                              currentSlide.type === "graphics"
                                ? (item as Graphic).image_url || "/image/2.jpg"
                                : (item as Project | Product | Event)
                                    .gallery_image_url || "/image/2.jpg"
                            }
                            alt={
                              currentSlide.type === "graphics"
                                ? "Graphic Design"
                                : getLocalizedField(item, "title")
                            }
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== "/image/2.jpg") {
                                target.src = "/image/2.jpg";
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Show title for projects, products and events */}
                        {currentSlide.type !== "graphics" && (
                          <div className="p-3">
                            <h3 className="text-sm font-semibold text-white line-clamp-2 drop-shadow-lg">
                              {getLocalizedField(item, "title")}
                            </h3>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Boxes */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2 md:gap-4 z-20 px-4">
        {slideItems.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group relative px-3 md:px-6 py-2 md:py-3 rounded-xl backdrop-blur-sm border transition-all duration-500 transform ${
              index === currentIndex
                ? "bg-[#2E5A7A]/90 border-[#2E5A7A] text-white scale-110 -translate-y-2 shadow-2xl"
                : "bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 hover:-translate-y-1 shadow-lg"
            }`}
          >
            {/* Icon */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div
                className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                  index === currentIndex ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {slide.type === "projects" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="drop-shadow-sm"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
                  </svg>
                )}
                {slide.type === "products" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="drop-shadow-sm"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                )}
                {slide.type === "graphics" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="drop-shadow-sm"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                )}
                {slide.type === "events" && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="drop-shadow-sm"
                  >
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <span
                className={`font-semibold text-xs md:text-sm transition-all duration-300 whitespace-nowrap ${
                  index === currentIndex ? "text-white" : "text-white/90"
                }`}
              >
                {getLocalizedField(slide, "title")}
              </span>
            </div>

            {/* Active indicator line */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ${
                index === currentIndex ? "w-full" : "w-0 group-hover:w-1/2"
              }`}
            />

            {/* Glow effect for active state */}
            {index === currentIndex && (
              <div className="absolute inset-0 rounded-xl bg-[#2E5A7A]/20 blur-xl -z-10 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          goToSlide(
            currentIndex === 0 ? slideItems.length - 1 : currentIndex - 1
          )
        }
        className={`absolute top-1/2 transform -translate-y-1/2 ${
          isRTL ? "right-4" : "left-4"
        } z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
          />
        </svg>
      </button>

      <button
        onClick={() =>
          goToSlide(
            currentIndex === slideItems.length - 1 ? 0 : currentIndex + 1
          )
        }
        className={`absolute top-1/2 transform -translate-y-1/2 ${
          isRTL ? "left-4" : "right-4"
        } z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>
    </div>
  );
};
