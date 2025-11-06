"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Quote, TeamField } from "@/app/lib/definitions";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Card } from "../ui/about/card";
import Image from "next/image";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [teams, setTeams] = useState<TeamField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLocationImageOpen, setIsLocationImageOpen] = useState(false);

  // Check if language is RTL
  const isRTL = language === "ar" || language === "ku";

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Helper function to get localized field
  const getLocalizedField = (item: any, fieldName: string): string => {
    const field = `${fieldName}_${language}`;
    return item[field] || item[`${fieldName}_en`] || "";
  };

  // Fetch quotes and stats data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [quotesResponse, statsResponse, teamsResponse] =
          await Promise.all([
            fetch("/api/quotes"),
            fetch("/api/about-stats"),
            fetch("/api/teams"),
          ]);

        if (quotesResponse.ok) {
          const quotesData = await quotesResponse.json();
          setQuotes(quotesData);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          // Fallback data if API fails
          setStats([
            {
              id: "1",
              key: "about_years_experience",
              stat_value: "5+",
              label_ku: "ساڵ ئەزموون",
              label_ar: "سنوات الخبرة",
              label_en: "Years Experience",
            },
            {
              id: "2",
              key: "about_completed_projects",
              stat_value: "150+",
              label_ku: "پڕۆژەی تەواوکراو",
              label_ar: "المشاريع المكتملة",
              label_en: "Completed Projects",
            },
          ]);
        }

        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams(teamsData);
        } else {
          // Fallback data if API fails
          setTeams([
            {
              id: "1",
              name_ku: "بەرهەم عەزیز",
              name_ar: "برهم عزيز",
              name_en: "Barham Aziz",
              position_ku: "دامەزرێنەر و بەڕێوەبەری گشتی",
              position_ar: "المؤسس والرئيس التنفيذي",
              position_en: "Founder & CEO",
              image_url: "/image/barham.jpg",
            },
            {
              id: "2",
              name_ku: "بەرهەم الخطیب",
              name_ar: "برهم الخطيب",
              name_en: "Barham Al-Khatib",
              position_ku: "دامەزرێنەر و بەڕێوەبەری گشتی",
              position_ar: "المؤسس والرئيس التنفيذي",
              position_en: "Founder & CEO",
              image_url: "/image/barham.jpg",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ShowcaseLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black md:pt-60 pt-40">
        {/* Hero Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                isRTL ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              {/* Text Content */}
              <div
                className={`${
                  isRTL ? "lg:col-start-2 text-right" : "text-left"
                }`}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {t("about_us", {
                    en: "About Us",
                    ar: "معلومات عنا",
                    ku: "دەربارەی ئێمە",
                  })}
                </h1>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {t("about_description", {
                      en: "Established in 2020, our engineering office in Sulaymaniyah, Kurdistan Region of Iraq, is registered with the Kurdistan Engineering Union (KEU) under number 308. We are dedicated to providing innovative engineering solutions and exceptional service to our clients across the region.",
                      ar: "تأسس مكتبنا الهندسي في السليمانية، إقليم كردستان العراق عام 2020، وهو مسجل لدى نقابة المهندسين الكردستانية (KEU) تحت الرقم 308. نحن ملتزمون بتقديم حلول هندسية مبتكرة وخدمة استثنائية لعملائنا في جميع أنحاء المنطقة.",
                      ku: "ئۆفیسی ئەندازیاریمان لە ساڵی 2020 لە سلێمانی، هەرێمی کوردستانی عێراق دامەزراوە، لە ژێر ژمارە 308 لە یەکێتی ئەندازیارانی کوردستان (KEU) تۆمارکراوە. ئێمە پابەندین بە پێشکەشکردنی چارەسەرە ئەندازیارییە نوێکان و خزمەتگوزاری تایبەت بۆ کڕیارەکانمان لە سەرانسەری هەرێمدا.",
                    })}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("about_mission", {
                      en: "Our team of experienced engineers and professionals is committed to excellence in every project we undertake. From architectural design to structural engineering, we bring creativity, precision, and technical expertise to deliver results that exceed expectations.",
                      ar: "فريقنا من المهندسين والمهنيين ذوي الخبرة ملتزم بالتميز في كل مشروع نقوم به. من التصميم المعماري إلى الهندسة الإنشائية، نجلب الإبداع والدقة والخبرة التقنية لتحقيق نتائج تفوق التوقعات.",
                      ku: "تیمی ئێمە لە ئەندازیار و پیشەییە بەتەجروبەکان پابەندە بە باشترین لە هەموو پڕۆژەیەک کە دەستی پێ دەکەین. لە دیزاینی تەلارسازییەوە تا ئەندازیاری بیناسازی، داهێنان و وردبینی و شارەزایی تەکنیکی دەهێنین بۆ گەیاندنی ئەنجامێک کە لە چاوەڕوانیەکان زیاتر بێت.",
                    })}
                  </p>
                </div>
              </div>

              {/* Image and Stats */}
              <div
                className={`${
                  isRTL ? "lg:col-start-1" : ""
                } flex flex-col gap-6`}
              >
                <div className="relative">
                  <Image
                    src="/image/2.jpg"
                    alt="Engineering Office"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl w-full h-[300px] object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 4).map((stat, index) => (
                    <div
                      key={stat.id}
                      className={`${
                        index % 2 === 0 ? "bg-[#2E5A7A]" : "bg-gray-600"
                      } rounded-2xl p-6 text-center text-white`}
                    >
                      <div className="text-3xl font-bold mb-2">
                        {stat.stat_value}
                      </div>
                      <div className="text-sm opacity-90">
                        {getLocalizedField(stat, "label")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        {!loading && quotes.length > 0 && (
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 gap-8">
                {quotes.slice(0, 4).map((quote, index) => (
                  <div
                    key={quote.id}
                    className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-visible"
                  >
                    {/* Image Square on Top Edge */}
                    <div
                      className={`absolute -top-10 ${
                        isRTL ? "left-8" : "right-8"
                      } w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-gray-600 z-20 bg-white dark:bg-gray-600`}
                    >
                      <Image
                        src={quote.image_url || "/image/2.jpg"}
                        alt="Quote"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Quote Text */}
                    <div
                      className={`relative z-10 ${
                        isRTL ? "text-right pr-24" : "text-left pr-24"
                      } pt-4`}
                    >
                      <div className="text-4xl text-[#2E5A7A] dark:text-[#2E5A7A] mb-4">
                        {isRTL ? '"' : '"'}
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {getLocalizedField(quote, "title")}
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div
                      className={`absolute top-4 ${
                        isRTL ? "left-4" : "left-4"
                      } w-12 h-12 bg-[#2E5A7A]/10 rounded-full`}
                    ></div>
                    <div
                      className={`absolute top-8 ${
                        isRTL ? "left-8" : "left-8"
                      } w-6 h-6 bg-[#2E5A7A]/20 rounded-full`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Section */}
        {!loading && teams.length > 0 && (
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <h2
                className={`text-3xl font-bold text-gray-900 dark:text-white mb-12 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("our_team", {
                  en: "Our Team",
                  ar: "فريقنا",
                  ku: "تیمەکەمان",
                })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
                {teams.map((member) => (
                  <div key={member.id} className="w-full max-w-sm">
                    <Card
                      src={member.image_url || "/image/barham.jpg"}
                      title={getLocalizedField(member, "name")}
                      description={getLocalizedField(member, "position")}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto">
            <h2
              className={`text-3xl font-bold text-gray-900 dark:text-white mb-12 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("our_location", {
                en: "Our Location",
                ar: "موقعنا",
                ku: "شوێنەکەمان",
              })}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Location Details */}
              <div className={`${isRTL ? "lg:order-2" : ""}`}>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                  <h3
                    className={`text-xl font-semibold text-gray-900 dark:text-white mb-6 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    dir={
                      language === "ar"
                        ? "rtl"
                        : language === "ku"
                        ? "rtl"
                        : "ltr"
                    }
                  >
                    {t("contact_info", {
                      en: "Contact Information",
                      ar: "معلومات الاتصال",
                      ku: "زانیاری پەیوەندی",
                    })}
                  </h3>

                  <div className="space-y-6">
                    {/* Address */}
                    <div
                      className="flex items-start gap-4"
                      dir={
                        language === "ar"
                          ? "rtl"
                          : language === "ku"
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-[#2E5A7A] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div
                        className={`${isRTL ? "text-right" : "text-left"}`}
                        dir={
                          language === "ar"
                            ? "rtl"
                            : language === "ku"
                            ? "rtl"
                            : "ltr"
                        }
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t("address", {
                            en: "Address",
                            ar: "العنوان",
                            ku: "ناونیشان",
                          })}
                        </h4>

                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {t("detailed_address", {
                            en: "Sulaymaniyah - Mix Tower - Behind Sulaymaniyah Governorate Building",
                            ar: "السليمانية- برج مكس- خلف مبنى محافظة السليمانية",
                            ku: "سلێمانی- میکس تاوەر- پشتی بینای پارێزگای سلێمانی",
                          })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("area_info", {
                            en: "(S Tower - 12th Floor - Apartment 9)",
                            ar: "( برج S - الدور 12 - شقة 9 )",
                            ku: "( تاوەریS -نهۆمی١٢ -شوقەی٩ )",
                          })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("region", {
                            en: "Kurdistan Region, Iraq",
                            ar: "إقليم كردستان، العراق",
                            ku: "هەرێمی کوردستان، عێراق",
                          })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">
                          35.56363° N, 45.37964° E
                        </p>
                      </div>
                    </div>

                    {/* Registration */}
                    <div
                      className="flex items-start gap-4"
                      dir={
                        language === "ar"
                          ? "rtl"
                          : language === "ku"
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-[#2E5A7A] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div
                        className={`${isRTL ? "text-right" : "text-left"}`}
                        dir={
                          language === "ar"
                            ? "rtl"
                            : language === "ku"
                            ? "rtl"
                            : "ltr"
                        }
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t("registration", {
                            en: "Registration",
                            ar: "التسجيل",
                            ku: "تۆمارکردن",
                          })}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("keu_license", {
                            en: "Kurdistan Engineering Union (KEU)",
                            ar: "نقابة المهندسين الكردستانية",
                            ku: "یەکێتی ئەندازیارانی کوردستان",
                          })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t("license_number", {
                            en: "License #308",
                            ar: "رخصة رقم ٣٠٨",
                            ku: "مۆڵەت ژمارە ٣٠٨",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Established */}
                    <div
                      className={`flex items-start gap-4 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                      dir={
                        language === "ar"
                          ? "rtl"
                          : language === "ku"
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-[#2E5A7A] rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div
                        className={`${isRTL ? "text-right" : "text-left"}`}
                        dir={
                          language === "ar"
                            ? "rtl"
                            : language === "ku"
                            ? "rtl"
                            : "ltr"
                        }
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {t("established", {
                            en: "Established",
                            ar: "تأسست",
                            ku: "دامەزراوە",
                          })}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t("establishment_year", {
                            en: "2020",
                            ar: "٢٠٢٠",
                            ku: "٢٠٢٠",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Image and Google Map */}
              <div className={`${isRTL ? "lg:order-1" : ""} space-y-6`}>
                {/* Location Area Image */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 shadow-lg">
                  <div
                    className="relative w-full h-64 rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setIsLocationImageOpen(true)}
                  >
                    <Image
                      src="/image/location.png"
                      alt={t("location_area", {
                        en: "Value Architecture Office Location Area",
                        ar: "منطقة مكتب فاليو للمعمار",
                        ku: "ناوچەی ئۆفیسی ڤالیو ئارکیتێکتس",
                      })}
                      fill
                      className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 rounded-xl flex items-end p-4 transition-all duration-300">
                      <div className="text-white flex-1">
                        <h4 className="font-semibold text-lg">
                          {t("office_area", {
                            en: "Office Area",
                            ar: "منطقة المكتب",
                            ku: "ناوچەی ئۆفیس",
                          })}
                        </h4>
                        <p className="text-sm opacity-90">
                          {t("mix_tower_location", {
                            en: "Mix Tower, Sulaymaniyah",
                            ar: "برج مكس، السليمانية",
                            ku: "میکس تاوەر، سلێمانی",
                          })}
                        </p>
                      </div>
                      {/* Click to view icon */}
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Map */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 shadow-lg">
                  <div className="relative w-full h-96 rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d45.378548599999995!3d35.563395330459926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDMzJzQ5LjEiTiA0NcKwMjInNDYuNyJF!5e0!3m2!1sen!2s!4v1635789012345!5m2!1sen!2s&q=Mix+Tower+Sulaymaniyah+Governorate+Building`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                      title={t("office_location", {
                        en: "Value Architects Office Location",
                        ar: "موقع مكتب فاليو للمعمار",
                        ku: "شوێنی ئۆفیسی ڤالیو ئارکیتێکتس",
                      })}
                    />

                    {/* Map overlay for dark mode styling */}
                    <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-gray-200 dark:ring-gray-700"></div>
                  </div>

                  {/* Map Actions */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=35.563395330459926,45.378548599999995`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#2E5A7A] hover:bg-[#1e3a52] text-white px-4 py-3 rounded-lg font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("get_directions", {
                        en: "Get Directions",
                        ar: "احصل على الاتجاهات",
                        ku: "ڕێگا وەربگرە",
                      })}
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=Darwaza+pshw+rest+cafe+Darwaza+city+3+Sulaymaniyah`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-lg font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("view_on_maps", {
                        en: "View on Maps",
                        ar: "عرض على الخرائط",
                        ku: "لە نەخشەدا ببینە",
                      })}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Image Modal */}
        {isLocationImageOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={() => setIsLocationImageOpen(false)}
          >
            <div className="relative w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
              {/* Close button */}
              <button
                onClick={() => setIsLocationImageOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Close"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image container */}
              <div
                className="relative flex-1 rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src="/image/location.png"
                  alt={t("location_area", {
                    en: "Value Architecture Office Location Area",
                    ar: "منطقة مكتب فاليو للمعمار",
                    ku: "ناوچەی ئۆفیسی ڤالیو ئارکیتێکتس",
                  })}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Image caption */}
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold">
                  {t("office_area", {
                    en: "Office Area - Mix Tower",
                    ar: "منطقة المكتب - برج مكس",
                    ku: "ناوچەی ئۆفیس - میکس تاوەر",
                  })}
                </h3>
                <p className="text-sm mt-2 opacity-90">
                  {t("click_to_close", {
                    en: "Click anywhere to close",
                    ar: "انقر في أي مكان للإغلاق",
                    ku: "کرتەکردن لە هەر شوێنێک بۆ داخستن",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ShowcaseLayout>
  );
}
