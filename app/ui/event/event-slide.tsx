"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import Link from "next/link";

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

interface EventSlideProps {
  autoPlay?: boolean;
  interval?: number;
}

export const EventSlide: React.FC<EventSlideProps> = ({
  autoPlay = true,
  interval = 8000,
}) => {
  const { language, t } = useLanguage();
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

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/event");

        if (response.ok) {
          const eventsData = await response.json();
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && events.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, events.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400 text-xl">
          {t("loading", {
            en: "Loading events...",
            ar: "جاري تحميل الأحداث...",
            ku: "بارکردنی کارو چالاکی...",
          })}
        </div>
      </div>
    );
  }

  // Show empty state if no events
  if (events.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            {t("no_events", {
              en: "No events available",
              ar: "لا توجد أحداث متاحة",
              ku: "هیچ ڕووداوێک بەردەست نییە",
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

  const currentEvent = events[currentIndex];

  // Get background image from current event
  const getBackgroundImage = (event: Event): string => {
    const imageUrl = event.gallery_image_url;
    return imageUrl && imageUrl.trim() !== "" ? imageUrl : "/image/2.jpg";
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getBackgroundImage(currentEvent)}
          alt={getLocalizedField(currentEvent, "title")}
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
                {getLocalizedField(currentEvent, "title")}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed drop-shadow-lg line-clamp-4">
                {getLocalizedField(currentEvent, "description")}
              </p>

              {/* Event Date */}
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <svg
                    className="w-5 h-5 text-white mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                  </svg>
                  <span className="text-white/90 font-medium">
                    {new Date(currentEvent.created_at).toLocaleDateString(
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

              {/* View Details Button */}
              <Link
                href={`/event/${currentEvent.id}`}
                className="inline-flex items-center px-8 py-4 bg-[#2E5A7A] text-white font-semibold rounded-full hover:bg-[#1e3a4a] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("view_details", {
                  en: "View Details",
                  ar: "عرض التفاصيل",
                  ku: "وردەکارییەکان ببینە",
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

            {/* Events Grid */}
            <div className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
              {events.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {events.slice(0, 6).map((event, index) => (
                    <Link key={event.id} href={`/event/${event.id}`}>
                      <div className="group bg-white/10 backdrop-blur-sm dark:bg-gray-800/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 border border-white/20">
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={event.gallery_image_url || "/image/2.jpg"}
                            alt={getLocalizedField(event, "title")}
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

                        {/* Event Info */}
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-white line-clamp-2 drop-shadow-lg mb-1">
                            {getLocalizedField(event, "title")}
                          </h3>
                          <p className="text-xs text-white/70 drop-shadow-sm">
                            {new Date(event.created_at).toLocaleDateString(
                              language === "ar" ? "ar-EG" : "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Navigation Dots */}
      {events.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#2E5A7A] scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={() =>
              goToSlide(
                currentIndex === 0 ? events.length - 1 : currentIndex - 1
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
                currentIndex === events.length - 1 ? 0 : currentIndex + 1
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
        </>
      )}
    </div>
  );
};
