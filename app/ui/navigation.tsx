"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/lib/theme-context";
import { useLoading } from "@/app/lib/loading-context";
import ThemeToggle from "./theme-toggle";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const navItems = [
    { name: "Home", href: "/", key: 1 },
    { name: "About", href: "/about", key: 2 },
    { name: "Blog", href: "/blog", key: 3 },
    { name: "Machine", href: "/machine", key: 4 },
  ];

  const toggleMenu = (event: React.MouseEvent) => {
    if (!isMenuOpen) {
      // Get click position relative to viewport
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Ensure menu stays within viewport bounds
      const menuWidth = 320;
      const menuHeight = 250; // Approximate height for the menu
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Adjust if menu would go off-screen
      if (adjustedX + menuWidth > viewportWidth - 20)
        adjustedX = viewportWidth - menuWidth - 20;
      if (adjustedY + menuHeight > viewportHeight - 20)
        adjustedY = viewportHeight - menuHeight - 20;
      if (adjustedX < 20) adjustedX = 20;
      if (adjustedY < 20) adjustedY = 20;

      setClickPosition({ x: adjustedX, y: adjustedY });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full  duration-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] w-full">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/" className="font-bold w-10 h-10">
                  <Image
                    src={
                      theme === "dark" ? "/image/value.png" : "/image/logo.png"
                    }
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </Link>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                  href="/"
                  className="font-bold flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <Image
                    src="/icons/lang.svg"
                    alt="lang"
                    width={20}
                    height={20}
                  />
                  <span>EN</span>
                </Link>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop with fade animation */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        ></div>

        {/* Menu panel with slide animation from button position */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#181818] shadow-xl transform transition-all duration-500 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            transformOrigin: `${clickPosition.x}px ${clickPosition.y}px`,
          }}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-6 py-4">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={closeMenu}
                      className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: isMenuOpen
                          ? "slideInLeft 0.3s ease-out forwards"
                          : "none",
                      }}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
