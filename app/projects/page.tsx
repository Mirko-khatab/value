"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Project, ProjectCategory, SubCategory } from "@/app/lib/definitions";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";
import Image from "next/image";
import Link from "next/link";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  FolderIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [locations, setLocations] = useState<
    Array<{ city_en: string; city_ku: string; city_ar: string }>
  >([]);
  const [metaDataLoading, setMetaDataLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Infinite scroll fetch function
  const fetchProjects = useCallback(async (page: number, limit: number) => {
    const response = await fetch(`/api/projects/public?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  }, []);

  // Use infinite scroll hook
  const {
    items: projects,
    loading,
    hasMore,
    lastElementRef,
    reset: resetProjects
  } = useInfiniteScroll(fetchProjects, 12);

  // Fetch metadata (categories, sub-categories, locations) on mount
  useEffect(() => {
    async function fetchMetaData() {
      try {
        setMetaDataLoading(true);

        // Fetch metadata in parallel
        const [categoriesRes, subCategoriesRes, locationsRes] =
          await Promise.all([
            fetch("/api/project-categories"),
            fetch("/api/sub-categorys"),
            fetch("/api/projects/locations"),
          ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (subCategoriesRes.ok) {
          const subCategoriesData = await subCategoriesRes.json();
          console.log("✅ Sub-categories fetched:", subCategoriesData);
          setSubCategories(subCategoriesData);
        }

        if (locationsRes.ok) {
          const locationsData = await locationsRes.json();
          setLocations(locationsData);
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setMetaDataLoading(false);
      }
    }

    fetchMetaData();
  }, []);

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return (projects as Project[]).filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          project.title_en?.toLowerCase().includes(query) ||
          project.title_ku?.toLowerCase().includes(query) ||
          project.title_ar?.toLowerCase().includes(query) ||
          project.description_en?.toLowerCase().includes(query) ||
          project.description_ku?.toLowerCase().includes(query) ||
          project.description_ar?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Location filter
      if (selectedLocation) {
        const matchesLocation =
          project.location_city_en?.includes(selectedLocation) ||
          project.location_city_ku?.includes(selectedLocation) ||
          project.location_city_ar?.includes(selectedLocation);

        if (!matchesLocation) return false;
      }

      // Sub-category filter (takes priority over category filter)
      if (selectedSubCategory) {
        if (project.project_sub_category !== parseInt(selectedSubCategory))
          return false;
      }
      // Category filter (only if no sub-category is selected)
      else if (selectedCategory) {
        if (project.project_category !== parseInt(selectedCategory))
          return false;
      }

      // Status filter
      if (selectedStatus !== "") {
        if (project.project_status !== parseInt(selectedStatus)) return false;
      }

      return true;
    });
  }, [
    projects,
    searchQuery,
    selectedLocation,
    selectedCategory,
    selectedSubCategory,
    selectedStatus,
  ]);

  // Get localized field helper
  const getLocalizedField = (obj: any, field: string) => {
    if (!obj) return "";
    return obj[`${field}_${language}`] || obj[`${field}_en`] || "";
  };

  // Check if current language is RTL
  const isRTL = language === "ar" || language === "ku";

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedStatus("");
    setShowFilters(false);
  };

  // Get sub-categories for a specific category
  const getSubCategoriesForCategory = (categoryId: string) => {
    // Convert both to strings for comparison
    const filtered = subCategories.filter(
      (sub) => String(sub.category_id) === String(categoryId)
    );
    return filtered;
  };

  return (
    <ShowcaseLayout>
      <div
        className={`min-h-screen w-full ${isRTL ? "rtl" : "ltr"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header Section - Full Screen Width */}
        <div className="w-full bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-700 md:pt-60 pt-40">
          {/* Title */}
          {/* <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white text-center">
              {t("projects", {
                en: "Our Projects",
                ar: "مشاريعنا",
                ku: "پڕۆژەکانمان",
              })}
            </h1>
          </div> */}

          {/* Search and Filters - Full Width Container */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
            {/* Search Bar and Filter Toggle */}
            <div className="flex gap-3 mb-4">
              {isRTL ? (
                <>
                  {/* Filter Toggle Button - Mobile Only (RTL: appears first/left) */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center justify-center px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  </button>

                  {/* Search Bar - RTL: positioned on the right */}
                  <div className="relative flex-1 max-w-md ml-auto">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm text-right"
                      placeholder={t("search", {
                        en: "Search projects...",
                        ar: "البحث في المشاريع...",
                        ku: "گەڕان لە پڕۆژەکان...",
                      })}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Search Bar - LTR: positioned on the left */}
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm text-left"
                      placeholder={t("search", {
                        en: "Search projects...",
                        ar: "البحث في المشاريع...",
                        ku: "گەڕان لە پڕۆژەکان...",
                      })}
                    />
                  </div>

                  {/* Filter Toggle Button - Mobile Only (LTR: appears second/right) */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center justify-center px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Filters - Responsive Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 transition-all duration-300 ${
                showFilters ? "grid" : "hidden lg:grid"
              }`}
            >
              {/* Location Filter */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {isRTL ? (
                    <>
                      {t("location", {
                        en: "Location",
                        ar: "الموقع",
                        ku: "شوێن",
                      })}
                      <MapPinIcon className="inline-block h-4 w-4 mr-2" />
                    </>
                  ) : (
                    <>
                      <MapPinIcon className="inline-block h-4 w-4 mr-2" />
                      {t("location", {
                        en: "Location",
                        ar: "الموقع",
                        ku: "شوێن",
                      })}
                    </>
                  )}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm appearance-none ${
                    isRTL
                      ? "text-right bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:left_12px_center] bg-no-repeat"
                      : "text-left bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:right_12px_center] bg-no-repeat"
                  }`}
                >
                  <option value="">
                    {t("all_locations", {
                      en: "All Locations",
                      ar: "جميع المواقع",
                      ku: "هەموو شوێنەکان",
                    })}
                  </option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc.city_en}>
                      {getLocalizedField(loc, "city")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter - Dropdown */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {isRTL ? (
                    <>
                      {t("category", {
                        en: "Category",
                        ar: "الفئة",
                        ku: "جۆر",
                      })}
                      <FolderIcon className="inline-block h-4 w-4 mr-2" />
                    </>
                  ) : (
                    <>
                      <FolderIcon className="inline-block h-4 w-4 mr-2" />
                      {t("category", {
                        en: "Category",
                        ar: "الفئة",
                        ku: "جۆر",
                      })}
                    </>
                  )}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("");
                  }}
                  className={`block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm appearance-none ${
                    isRTL
                      ? "text-right bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:left_12px_center] bg-no-repeat"
                      : "text-left bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:right_12px_center] bg-no-repeat"
                  }`}
                >
                  <option value="">
                    {t("all_categories", {
                      en: "All Categories",
                      ar: "جميع الفئات",
                      ku: "هەموو جۆرەکان",
                    })}
                  </option>
                  {categories.map((cat) => {
                    const hasSubCategories =
                      getSubCategoriesForCategory(cat.id).length > 0;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {hasSubCategories ? "+ " : ""}
                        {getLocalizedField(cat, "title")}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Sub-Category Filter - Only show when category with sub-categories is selected */}
              {selectedCategory &&
                getSubCategoriesForCategory(selectedCategory).length > 0 && (
                  <div className="w-full">
                    <label
                      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? (
                        <>
                          {t("sub_category", {
                            en: "Sub Category",
                            ar: "الفئة الفرعية",
                            ku: "ژێرجۆر",
                          })}
                          <FolderIcon className="inline-block h-4 w-4 mr-2" />
                        </>
                      ) : (
                        <>
                          <FolderIcon className="inline-block h-4 w-4 mr-2" />
                          {t("sub_category", {
                            en: "Sub Category",
                            ar: "الفئة الفرعية",
                            ku: "ژێرجۆر",
                          })}
                        </>
                      )}
                    </label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className={`block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm appearance-none ${
                        isRTL
                          ? "text-right bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:left_12px_center] bg-no-repeat"
                          : "text-left bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:right_12px_center] bg-no-repeat"
                      }`}
                    >
                      <option value="">
                        {t("all_sub_categories", {
                          en: "All Sub Categories",
                          ar: "جميع الفئات الفرعية",
                          ku: "هەموو ژێرجۆرەکان",
                        })}
                      </option>
                      {getSubCategoriesForCategory(selectedCategory).map(
                        (subCat) => (
                          <option key={subCat.id} value={subCat.id}>
                            {getLocalizedField(subCat, "title")}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

              {/* Status Filter */}
              <div className="w-full">
                <label
                  className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {isRTL ? (
                    <>
                      {t("status", { en: "Status", ar: "الحالة", ku: "دۆخ" })}
                      <ClockIcon className="inline-block h-4 w-4 mr-2" />
                    </>
                  ) : (
                    <>
                      <ClockIcon className="inline-block h-4 w-4 mr-2" />
                      {t("status", { en: "Status", ar: "الحالة", ku: "دۆخ" })}
                    </>
                  )}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm appearance-none ${
                    isRTL
                      ? "text-right bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:left_12px_center] bg-no-repeat"
                      : "text-left bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[length:12px_8px] bg-[position:right_12px_center] bg-no-repeat"
                  }`}
                >
                  <option value="">
                    {t("all_statuses", {
                      en: "All Statuses",
                      ar: "جميع الحالات",
                      ku: "هەموو دۆخەکان",
                    })}
                  </option>
                  <option value="0">
                    {t("in_progress", {
                      en: "In Progress",
                      ar: "قيد التنفيذ",
                      ku: "لە جێبەجێکردندا",
                    })}
                  </option>
                  <option value="1">
                    {t("finished", {
                      en: "Finished",
                      ar: "منتهي",
                      ku: "تەواوبوو",
                    })}
                  </option>
                </select>
              </div>
            </div>

            {/* Filter Summary & Reset - Full Width */}
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm transition-all duration-300 ${
                showFilters ? "block" : "hidden lg:flex"
              } ${
                isRTL ? "sm:flex-row-reverse sm:justify-end" : "justify-between"
              }`}
            >
              <p
                className={`text-gray-600 dark:text-gray-400 text-sm ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("showing_results", {
                  en: `Showing ${filteredProjects.length} of ${projects.length} projects`,
                  ar: `عرض ${filteredProjects.length} من ${projects.length} مشروع`,
                  ku: `پیشاندانی ${filteredProjects.length} لە ${projects.length} پڕۆژە`,
                })}
              </p>
              {(searchQuery ||
                selectedLocation ||
                selectedCategory ||
                selectedSubCategory ||
                selectedStatus !== "") && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  {t("reset_filters", {
                    en: "Reset Filters",
                    ar: "إعادة تعيين الفلاتر",
                    ku: "ڕێکخستنەوەی فلتەرەکان",
                  })}
                </button>
              )}
            </div>

            {/* Mobile Results Summary - Always Visible */}
            <div
              className={`lg:hidden flex items-center mb-4 ${
                isRTL ? "flex-row-reverse justify-end" : "justify-between"
              }`}
            >
              <p
                className={`text-gray-600 dark:text-gray-400 text-sm ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("showing_results", {
                  en: `${filteredProjects.length} of ${projects.length} projects`,
                  ar: `${filteredProjects.length} من ${projects.length} مشروع`,
                  ku: `${filteredProjects.length} لە ${projects.length} پڕۆژە`,
                })}
              </p>
              {(searchQuery ||
                selectedLocation ||
                selectedCategory ||
                selectedSubCategory ||
                selectedStatus !== "") && (
                <button
                  onClick={resetFilters}
                  className={`px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm ${
                    isRTL ? "mr-4" : "ml-4"
                  }`}
                >
                  {t("reset_filters", {
                    en: "Reset",
                    ar: "إعادة تعيين",
                    ku: "ڕێکخستنەوە",
                  })}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Projects Grid - Full Width */}
        <div className="w-full  py-8 sm:py-12">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  {t("no_projects", {
                    en: "No projects found",
                    ar: "لم يتم العثور على مشاريع",
                    ku: "هیچ پڕۆژەیەک نەدۆزرایەوە",
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
                {filteredProjects.map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="group bg-white dark:bg-black rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-105 hover:-translate-y-2"
                    ref={index === filteredProjects.length - 1 ? lastElementRef : null}
                  >
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      {project.gallery_image_url ? (
                        <Image
                          src={project.gallery_image_url}
                          alt={getLocalizedField(project, "title") || "Project"}
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

                    {/* Project Title */}
                    <div className="p-5 sm:p-6">
                      <h3
                        className={`text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getLocalizedField(project, "title")}
                      </h3>

                      {/* Category and Type */}
                      <div className={`flex flex-col gap-2 mt-3 ${
                        isRTL ? "items-end" : "items-start"
                      }`}>
                        {/* Category */}
                        {project.category_name_en && (
                          <p
                            className={`text-sm text-gray-500 dark:text-gray-400 ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {getLocalizedField(project, "category_name")}
                          </p>
                        )}
                        
                        {/* Project Type Badge */}
                        {project.project_type !== undefined && project.project_type !== null && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              Number(project.project_type) === 0
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : Number(project.project_type) === 1
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            }`}
                          >
                            {Number(project.project_type) === 0
                              ? t("design", {
                                  en: "Design",
                                  ar: "تصميم",
                                  ku: "دیزاین",
                                })
                              : Number(project.project_type) === 1
                              ? t("implement", {
                                  en: "Implement",
                                  ar: "تنفيذ",
                                  ku: "جێبەجێکردن",
                                })
                              : t("both", {
                                  en: "Design & Implement",
                                  ar: "تصميم وتنفيذ",
                                  ku: "دیزاین و جێبەجێکردن",
                                })}
                          </span>
                        )}
                      </div>
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
            {!hasMore && filteredProjects.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("no_more_projects", {
                    en: "No more projects to load",
                    ar: "لا توجد مشاريع أخرى للتحميل",
                    ku: "هیچ پڕۆژەیەکی تر نییە بۆ بارکردن",
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
