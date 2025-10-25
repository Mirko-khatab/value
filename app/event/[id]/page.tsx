"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Gallery } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import ShowcaseLayout from "@/app/ui/showcase-layout";

interface Event {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  gallery_image_url?: string;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const { language, t } = useLanguage();
  const [event, setEvent] = useState<Event | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Check if language is RTL
  const isRTL = language === "ar" || language === "ku";

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      try {
        setLoading(true);

        const [eventRes, galleriesRes, allEventsRes] = await Promise.all([
          fetch(`/api/event/${id}`),
          fetch(`/api/event/${id}/galleries`),
          fetch(`/api/event`),
        ]);

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEvent(eventData[0] || null);
        }

        if (galleriesRes.ok) {
          const galleriesData = await galleriesRes.json();
          setGalleries(galleriesData);
        }

        if (allEventsRes.ok) {
          const allEventsData = await allEventsRes.json();
          // Filter out the current event and limit to 6 more events
          const otherEvents = allEventsData
            .filter((e: Event) => e.id !== id)
            .slice(0, 6);
          setAllEvents(otherEvents);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEventData();
  }, [id]);

  // Auto-slide functionality
  useEffect(() => {
    if (galleries.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleries.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [galleries.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < galleries.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Helper function to get localized field
  const getLocalizedField = (item: any, fieldName: string): string => {
    const field = `${fieldName}_${language}`;
    return item[field] || item[`${fieldName}_en`] || "";
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleries.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleries.length) % galleries.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard navigation for fullscreen modal
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          toggleFullscreen();
          break;
        case "ArrowLeft":
          if (galleries.length > 1) {
            prevSlide();
          }
          break;
        case "ArrowRight":
          if (galleries.length > 1) {
            nextSlide();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, galleries.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2E5A7A] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t("loading", {
              en: "Loading event...",
              ar: "جاري تحميل الحدث...",
              ku: "بارکردنی ڕووداو...",
            })}
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("event_not_found", {
              en: "Event Not Found",
              ar: "الحدث غير موجود",
              ku: "ڕووداو نەدۆزرایەوە",
            })}
          </h1>
          <Link
            href="/event"
            className="inline-flex items-center px-4 py-2 bg-[#2E5A7A] text-white hover:bg-[#1e3a4a] font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg
              className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
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
            {t("back_to_events", {
              en: "Back to Events",
              ar: "العودة إلى الأحداث",
              ku: "گەڕانەوە بۆ کارو چالاکی",
            })}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ShowcaseLayout>
      <div className="min-h-screen bg-gray-50 mt-40 dark:bg-gray-900">
        {/* Fullscreen Gallery Modal */}
        {isFullscreen && galleries.length > 0 && (
          <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-[10000] bg-black/50 rounded-full p-2 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => {
                // Close modal when clicking on the background (not on the image)
                if (e.target === e.currentTarget) {
                  toggleFullscreen();
                }
              }}
            >
              <Image
                src={galleries[currentSlide]?.image_url || "/image/2.jpg"}
                alt={galleries[currentSlide]?.alt_text || "Event image"}
                fill
                className="object-contain cursor-pointer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/image/2.jpg") {
                    target.src = "/image/2.jpg";
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Optional: close on image click too
                  // toggleFullscreen();
                }}
              />

              {galleries.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-colors duration-200 z-[10001]"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/70 hover:bg-black/90 rounded-full p-3 transition-colors duration-200 z-[10001]"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image counter in fullscreen */}
              {galleries.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-[10001]">
                  {currentSlide + 1} / {galleries.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                </svg>
                <span>
                  {new Date(event.created_at).toLocaleDateString(
                    language === "ar"
                      ? "ar-EG"
                      : language === "ku"
                      ? "en-US"
                      : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Event Details */}
            <div className={`${isRTL ? "lg:order-2" : "lg:order-1"}`}>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {getLocalizedField(event, "title")}
              </h1>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {getLocalizedField(event, "description")}
                </p>
              </div>
            </div>

            {/* Gallery */}
            <div className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
              {galleries.length > 0 ? (
                <div className="space-y-6">
                  {/* Main Image */}
                  <div
                    className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={toggleFullscreen}
                    ref={sliderRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <Image
                      src={galleries[currentSlide]?.image_url || "/image/2.jpg"}
                      alt={galleries[currentSlide]?.alt_text || "Event image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== "/image/2.jpg") {
                          target.src = "/image/2.jpg";
                        }
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {galleries.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {galleries.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentSlide + 1} / {galleries.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {galleries.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {galleries.map((gallery, index) => (
                        <button
                          key={gallery.id}
                          onClick={() => setCurrentSlide(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden ${
                            index === currentSlide
                              ? "ring-2 ring-[#2E5A7A] ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900"
                              : "hover:opacity-75"
                          }`}
                        >
                          <Image
                            src={gallery.image_url}
                            alt={gallery.alt_text}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== "/image/2.jpg") {
                                target.src = "/image/2.jpg";
                              }
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-12 h-12 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>
                      {t("no_images", {
                        en: "No images available",
                        ar: "لا توجد صور متاحة",
                        ku: "هیچ وێنەیەک بەردەست نییە",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More Events Section */}
        {allEvents.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t("more_events", {
                  en: "More Events",
                  ar: "المزيد من الأحداث",
                  ku: "ڕووداوی زیاتر",
                })}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("discover_other_events", {
                  en: "Discover other exciting events",
                  ar: "اكتشف أحداث مثيرة أخرى",
                  ku: "ڕووداوی سەرنجڕاکێشی تر بدۆزەرەوە",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((eventItem) => (
                <Link
                  key={eventItem.id}
                  href={`/event/${eventItem.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={eventItem.gallery_image_url || "/image/2.jpg"}
                      alt={getLocalizedField(eventItem, "title")}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== "/image/2.jpg") {
                          target.src = "/image/2.jpg";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Event Date Badge */}
                    <div className="absolute top-4 left-4 bg-[#2E5A7A] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {new Date(eventItem.created_at).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#2E5A7A] transition-colors duration-200">
                      {getLocalizedField(eventItem, "title")}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                      {getLocalizedField(eventItem, "description")}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                        </svg>
                        {new Date(eventItem.created_at).toLocaleDateString(
                          language === "ar"
                            ? "ar-EG"
                            : language === "ku"
                            ? "en-US"
                            : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>

                      <div className="flex items-center text-[#2E5A7A] font-medium group-hover:translate-x-1 transition-transform duration-200">
                        <span className="text-sm mr-1">
                          {t("read_more", {
                            en: "Read More",
                            ar: "اقرأ المزيد",
                            ku: "زیاتر بخوێنەرەوە",
                          })}
                        </span>
                        <svg
                          className="w-4 h-4"
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Events Button */}
            <div className="text-center mt-12">
              <Link
                href="/event"
                className="inline-flex items-center px-8 py-4 bg-[#2E5A7A] text-white hover:bg-[#1e3a4a] font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("view_all_events", {
                  en: "View All Events",
                  ar: "عرض جميع الأحداث",
                  ku: "هەموو کارو چالاکی ببینە",
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
          </div>
        )}
      </div>
    </ShowcaseLayout>
  );
}
