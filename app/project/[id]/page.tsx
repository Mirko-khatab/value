"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { Project, Gallery } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import {
  MapPinIcon,
  FolderIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
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

    async function fetchProjectData() {
      try {
        setLoading(true);

        const [projectRes, galleriesRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/galleries`),
        ]);

        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData[0] || null);
        }

        if (galleriesRes.ok) {
          const galleriesData = await galleriesRes.json();
          setGalleries(galleriesData);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
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

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleries.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleries.length) % galleries.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get localized field helper
  const getLocalizedField = (obj: any, field: string) => {
    if (!obj) return "";
    return obj[`${field}_${language}`] || obj[`${field}_en`] || "";
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Close fullscreen on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("project_not_found", {
              en: "Project not found",
              ar: "المشروع غير موجود",
              ku: "پڕۆژە نەدۆزرایەوە",
            })}
          </h1>
          <Link
            href="/projects"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("back_to_projects", {
              en: "Back to Projects",
              ar: "العودة إلى المشاريع",
              ku: "گەڕانەوە بۆ پڕۆژەکان",
            })}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ShowcaseLayout>
        <div className="min-h-screen w-full">
          <div className="w-full pt-20">
            {/* Project Content - Desktop: Side by Side, Mobile: Stacked */}
            {galleries.length > 0 && (
              <div className="flex flex-col lg:relative lg:w-full lg:h-screen">
                {/* Mobile: Image Slider (top) */}
                <div className="lg:hidden h-[60vh] w-full relative">
                  <div
                    ref={sliderRef}
                    className="relative w-full h-full"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {galleries.map((gallery, index) => (
                      <div
                        key={gallery.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={toggleFullscreen}
                      >
                        <Image
                          src={gallery.image_url}
                          alt={
                            gallery.alt_text ||
                            getLocalizedField(project, "title")
                          }
                          fill
                          className="object-cover cursor-pointer"
                          priority={index === 0}
                        />
                      </div>
                    ))}

                    {/* Slide Indicators - Mobile */}
                    {galleries.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {galleries.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              index === currentSlide
                                ? "bg-white scale-125"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop: Image Slider Background - slightly under info panel */}
                <div
                  className={`hidden lg:block absolute inset-0 ${
                    isRTL ? "lg:left-8" : "lg:right-8"
                  }`}
                >
                  <div
                    ref={sliderRef}
                    className="relative w-full h-full"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {galleries.map((gallery, index) => (
                      <div
                        key={gallery.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={toggleFullscreen}
                      >
                        <Image
                          src={gallery.image_url}
                          alt={
                            gallery.alt_text ||
                            getLocalizedField(project, "title")
                          }
                          fill
                          className="object-cover cursor-pointer"
                          priority={index === 0}
                        />
                      </div>
                    ))}

                    {/* Slide Indicators - Desktop */}
                    {galleries.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        {galleries.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              index === currentSlide
                                ? "bg-white scale-125"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile: Info Section (below slider) */}
                <div className="lg:hidden bg-white dark:bg-black min-h-[40vh]">
                  <div
                    className={`p-6 space-y-6 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {/* Title with underline - Mobile */}
                    <div className="space-y-4">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-wide">
                        {getLocalizedField(project, "title")}
                      </h1>
                      <div
                        className={`w-24 h-0.5 bg-gray-400 dark:bg-gray-500 ${
                          isRTL ? "ml-auto" : ""
                        }`}
                      ></div>
                    </div>

                    {/* Status - Mobile */}
                    <div
                      className={`flex items-center gap-4 ${
                        isRTL ? "flex-row-reverse justify-end" : ""
                      }`}
                    >
                      {project.project_status === 1 ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      ) : (
                        <ExclamationCircleIcon className="h-8 w-8 text-yellow-600" />
                      )}
                      <span
                        className={`px-6 py-3 rounded-full text-base font-semibold ${
                          project.project_status === 1
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {project.project_status === 1
                          ? t("finished", {
                              en: "Finished",
                              ar: "منتهي",
                              ku: "تەواوبوو",
                            })
                          : t("in_progress", {
                              en: "In Progress",
                              ar: "قيد التنفيذ",
                              ku: "لە جێبەجێکردندا",
                            })}
                      </span>
                    </div>

                    {/* Meta Information - Mobile */}
                    <div className="space-y-4">
                      {project.category_name_en && (
                        <div
                          className={`flex items-center gap-4 text-gray-700 dark:text-gray-300 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <FolderIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="font-medium text-lg">
                            {getLocalizedField(project, "category_name")}
                          </span>
                        </div>
                      )}

                      {(project.location_en ||
                        project.location_ku ||
                        project.location_ar) && (
                        <div
                          className={`flex items-center gap-4 text-gray-700 dark:text-gray-300 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <MapPinIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <span className="font-medium text-lg">
                            {getLocalizedField(project, "location")}
                          </span>
                        </div>
                      )}

                      {project.date && (
                        <div
                          className={`flex items-center gap-4 text-gray-700 dark:text-gray-300 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <span className="font-medium text-lg">
                            {new Date(project.date).toLocaleDateString(
                              language,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description - Mobile */}
                    <div className="space-y-4">
                      <p
                        className={`text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getLocalizedField(project, "description")}
                      </p>
                    </div>

                    {/* Back Button - Mobile */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <Link
                        href="/projects"
                        className={`inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-lg ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <ArrowLeftIcon
                          className={`h-6 w-6 ${
                            isRTL ? "ml-3 rotate-180" : "mr-3"
                          }`}
                        />
                        {t("back_to_projects", {
                          en: "Back to Projects",
                          ar: "العودة إلى المشاريع",
                          ku: "گەڕانەوە بۆ پڕۆژەکان",
                        })}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Desktop: Project Info Overlay - Fixed position, bigger size */}
                <div
                  className={`hidden lg:flex absolute inset-0 ${
                    isRTL ? "justify-end" : "justify-start"
                  } items-center z-20`}
                >
                  <div
                    className={`w-1/2 h-full relative ${
                      isRTL ? "-mr-8" : "-ml-8"
                    }`}
                  >
                    {/* Main gradient background - matches the reference image */}
                    <div
                      className={`absolute inset-0 ${
                        isRTL
                          ? "bg-gradient-to-l from-white/95 via-white/70 to-transparent dark:from-gray-900/95 dark:via-gray-900/70 dark:to-transparent"
                          : "bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-gray-900/95 dark:via-gray-900/70 dark:to-transparent"
                      }`}
                    />

                    <div className="h-full overflow-y-auto relative z-10">
                      <div
                        className={`pt-16 lg:pt-24 px-6 lg:px-12 pb-8 space-y-6 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {/* Title with underline - matching reference image */}
                        <div className="space-y-4">
                          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-wide">
                            {getLocalizedField(project, "title")}
                          </h1>
                          <div className="w-24 h-0.5 bg-gray-400 dark:bg-gray-500"></div>
                        </div>

                        {/* Status */}
                        <div
                          className={`flex items-center gap-4 ${
                            isRTL ? "flex-row-reverse justify-end" : ""
                          }`}
                        >
                          {project.project_status === 1 ? (
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                          ) : (
                            <ExclamationCircleIcon className="h-8 w-8 text-yellow-600" />
                          )}
                          <span
                            className={`px-6 py-3 rounded-full text-base font-semibold ${
                              project.project_status === 1
                                ? "bg-green-100 text-green-800 dark:bg-black/30 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            }`}
                          >
                            {project.project_status === 1
                              ? t("finished", {
                                  en: "Finished",
                                  ar: "منتهي",
                                  ku: "تەواوبوو",
                                })
                              : t("in_progress", {
                                  en: "In Progress",
                                  ar: "قيد التنفيذ",
                                  ku: "لە جێبەجێکردندا",
                                })}
                          </span>
                        </div>

                        {/* Meta Information */}
                        <div className="space-y-6">
                          {project.category_name_en && (
                            <div
                              className={`flex items-center gap-4 text-gray-700 dark:text-gray-300 ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              <FolderIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span className="font-medium text-lg">
                                {getLocalizedField(project, "category_name")}
                              </span>
                            </div>
                          )}

                          {(project.location_en ||
                            project.location_ku ||
                            project.location_ar) && (
                            <div
                              className={`flex items-center gap-4 text-gray-700 dark:text-gray-300 ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              <MapPinIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                              <span className="font-medium text-lg">
                                {getLocalizedField(project, "location")}
                              </span>
                            </div>
                          )}

                          {project.date && (
                            <div
                              className={`flex items-center gap-4 text-gray-700 dark:text-gray-300 ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                              <span className="font-medium text-lg">
                                {new Date(project.date).toLocaleDateString(
                                  language,
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description - Clean layout matching reference */}
                        <div className="space-y-4">
                          <p
                            className={`text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {getLocalizedField(project, "description")}
                          </p>
                        </div>

                        {/* Back Button */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                          <Link
                            href="/projects"
                            className={`inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-lg ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <ArrowLeftIcon
                              className={`h-6 w-6 ${
                                isRTL ? "ml-3 rotate-180" : "mr-3"
                              }`}
                            />
                            {t("back_to_projects", {
                              en: "Back to Projects",
                              ar: "العودة إلى المشاريع",
                              ku: "گەڕانەوە بۆ پڕۆژەکان",
                            })}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ShowcaseLayout>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
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
            className="relative w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {galleries.map((gallery, index) => (
              <div
                key={gallery.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={gallery.image_url}
                  alt={gallery.alt_text || getLocalizedField(project, "title")}
                  fill
                  className="object-contain"
                />
              </div>
            ))}

            {/* Fullscreen Navigation */}
            {galleries.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Fullscreen Indicators */}
            {galleries.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {galleries.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
