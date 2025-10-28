"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/lib/language-context";
import {
  FooterProperty,
  SocialMedia,
  Product,
  Project,
  SocialMediaType,
} from "@/app/lib/definitions";

export const Fotter = () => {
  const { language, t } = useLanguage();
  const [footerProperties, setFooterProperties] = useState<FooterProperty[]>(
    []
  );
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get localized content
  const getLocalizedContent = (
    item: FooterProperty,
    field: "title" | "content"
  ): string => {
    const fieldName = `${field}_${language}`;
    return (
      (item[fieldName as keyof FooterProperty] as string) ||
      (item[`${field}_en` as keyof FooterProperty] as string) ||
      ""
    );
  };

  // Helper function to get localized field for products/projects
  const getLocalizedField = (item: any, fieldName: string): string => {
    const field = `${fieldName}_${language}`;
    return item[field] || item[`${fieldName}_en`] || "";
  };

  // Get social media icon
  const getSocialIcon = (type: SocialMediaType) => {
    switch (type) {
      case SocialMediaType.Instagram:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case SocialMediaType.Facebook:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19">
            <path
              fillRule="evenodd"
              d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
              clipRule="evenodd"
            />
          </svg>
        );
      case SocialMediaType.X:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 17">
            <path
              fillRule="evenodd"
              d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get social media platform name
  const getSocialName = (type: SocialMediaType) => {
    switch (type) {
      case SocialMediaType.Instagram:
        return "Instagram";
      case SocialMediaType.Facebook:
        return "Facebook";
      case SocialMediaType.X:
        return "X (Twitter)";
      default:
        return "Social Media";
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [footerRes, socialRes, productsRes, projectsRes] =
          await Promise.all([
            fetch("/api/footer-properties"),
            fetch("/api/social-media/public"),
            fetch("/api/products/public?limit=4"),
            fetch("/api/projects/public?limit=4"),
          ]);

        const [footerData, socialData, productsData, projectsData] =
          await Promise.all([
            footerRes.json(),
            socialRes.json(),
            productsRes.json(),
            projectsRes.json(),
          ]);

        setFooterProperties(footerData);
        setSocialMedia(socialData);
        setProducts(productsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get company about content
  const aboutContent = footerProperties.find(
    (prop) => prop.property_key === "company_about"
  );

  if (loading) {
    return (
      <footer className="bg-white border-t border-gray-200 dark:bg-black transition-colors duration-200">
        <div className="mx-auto w-full max-w-screen-xl py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-8">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-black transition-colors duration-200">
      <div className="mx-auto w-full max-w-screen-xl py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 flex flex-col gap-4 md:w-1/2 px-2">
            <div className="flex items-center">
              <Image src="/image/logo.png" alt="Logo" width={50} height={50} />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white transition-colors duration-200">
                Value
              </span>
            </div>
            <div>
              <h3 className="text-sm text-black dark:text-gray-400 sm:text-left transition-colors duration-200">
                   {t("about_description", {
                      en: "Established in 2020, our engineering office in Sulaymaniyah, Kurdistan Region of Iraq, is registered with the Kurdistan Engineering Union (KEU) under number 308. We are dedicated to providing innovative engineering solutions and exceptional service to our clients across the region.",
                      ar: "تأسس مكتبنا الهندسي في السليمانية، إقليم كردستان العراق عام 2020، وهو مسجل لدى نقابة المهندسين الكردستانية (KEU) تحت الرقم 308. نحن ملتزمون بتقديم حلول هندسية مبتكرة وخدمة استثنائية لعملائنا في جميع أنحاء المنطقة.",
                      ku: "ئۆفیسی ئەندازیاریمان لە ساڵی 2020 لە سلێمانی، هەرێمی کوردستانی عێراق دامەزراوە، لە ژێر ژمارە 308 لە یەکێتی ئەندازیارانی کوردستان (KEU) تۆمارکراوە. ئێمە پابەندین بە پێشکەشکردنی چارەسەرە ئەندازیارییە نوێکان و خزمەتگوزاری تایبەت بۆ کڕیارەکانمان لە سەرانسەری هەرێمدا.",
                    })}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4 px-2 md:w-1/2">
            {/* Products Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white transition-colors duration-200">
                Products
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-200">
                {products.slice(0, 4).map((product) => (
                  <li key={product.id} className="mb-4">
                    <Link
                      href={`/product/${product.id}`}
                      className="hover:underline"
                    >
                      {getLocalizedField(product, "title")}
                    </Link>
                  </li>
                ))}
                {products.length === 0 && (
                  <li className="mb-4">
                    <span className="text-gray-400">No products available</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white transition-colors duration-200">
                Projects
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-200">
                {projects.slice(0, 4).map((project) => (
                  <li key={project.id} className="mb-4">
                    <Link
                      href={`/project/${project.id}`}
                      className="hover:underline"
                    >
                      {getLocalizedField(project, "title")}
                    </Link>
                  </li>
                ))}
                {projects.length === 0 && (
                  <li className="mb-4">
                    <span className="text-gray-400">No projects available</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Location Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white transition-colors duration-200">
                {language === "ar"
                  ? "موقعنا"
                  : language === "ku"
                  ? "شوێنەکەمان"
                  : "Location"}
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-200">
                <li className="mb-4">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 mt-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div
                      className={`text-sm ${
                        language === "ar" || language === "ku"
                          ? "text-right"
                          : "text-left"
                      }`}
                      dir={
                        language === "ar"
                          ? "rtl"
                          : language === "ku"
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {language === "ar"
                          ? "مدينة دروازة ٣، السليمانية"
                          : language === "ku"
                          ? "شاری دەروازە ٣، سلێمانی"
                          : "Darwaza city 3, Sulaymaniyah"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {language === "ar"
                          ? "إقليم كردستان العراق"
                          : language === "ku"
                          ? "هەرێمی کوردستانی عێراق"
                          : "Kurdistan Region, Iraq"}
                      </div>
                    </div>
                  </div>
                </li>
                <li className="mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-sm">KEU License #308</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white transition-colors duration-200">
                Follow us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-200">
                {socialMedia.map((social) => (
                  <li key={social.id} className="mb-4">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-2"
                    >
                      {getSocialIcon(social.type)}
                      {getSocialName(social.type)}
                    </a>
                  </li>
                ))}
                {socialMedia.length === 0 && (
                  <li className="mb-4">
                    <span className="text-gray-400">No social media links</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8 transition-colors duration-200" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm text-text sm:text-center dark:text-gray-400 transition-colors duration-200">
              All rights reserved for Value Company 2025
            </h3>
          </div>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {socialMedia.map((social, index) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ${
                  index > 0 ? "ms-5" : ""
                }`}
              >
                {getSocialIcon(social.type)}
                <span className="sr-only">{getSocialName(social.type)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
