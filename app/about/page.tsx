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

  // Check if language is RTL
  const isRTL = language === "ar" || language === "ku";

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
      <div className="min-h-screen bg-gray-50 dark:bg-black pt-20">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {teams.map((member) => (
                  <Card
                    key={member.id}
                    src={member.image_url || "/image/barham.jpg"}
                    title={getLocalizedField(member, "name")}
                    description={getLocalizedField(member, "position")}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ShowcaseLayout>
  );
}
