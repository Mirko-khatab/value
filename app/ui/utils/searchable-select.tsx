"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Option {
  value: string | number;
  label: string;
  searchText?: string;
}

interface SearchableSelectProps {
  name: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  onAddNew?: () => void;
  addNewLabel?: string;
  itemsPerPage?: number;
}

export default function SearchableSelect({
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  onAddNew,
  addNewLabel = "Add New",
  itemsPerPage = 20,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(itemsPerPage);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) => {
    const searchText = option.searchText || option.label;
    return searchText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get visible options with pagination
  const visibleOptions = filteredOptions.slice(0, displayCount);
  const hasMore = filteredOptions.length > displayCount;

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value == selectedValue);
  const selectedLabel = selectedOption?.label || placeholder;

  // Handle scroll for infinite loading
  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && hasMore) {
      setDisplayCount((prev) => prev + itemsPerPage);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(itemsPerPage);
  }, [searchQuery, itemsPerPage]);

  const handleSelect = (optionValue: string | number) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    setSearchQuery("");
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedValue || ""}
        required={required}
      />

      {/* Selected value display / trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full rounded-md border ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500 dark:border-blue-400"
            : "border-gray-200 dark:border-gray-600"
        } bg-white dark:bg-gray-700 py-2 px-3 text-left text-sm text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none`}
      >
        <span
          className={selectedValue ? "" : "text-gray-500 dark:text-gray-400"}
        >
          {selectedLabel}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Options list with scroll */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto py-1"
          >
            {visibleOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                No results found
              </div>
            ) : (
              visibleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    option.value == selectedValue
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}

            {/* Load more indicator */}
            {hasMore && (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-600">
                Scroll for more... ({filteredOptions.length - displayCount}{" "}
                more)
              </div>
            )}
          </div>

          {/* Add new button */}
          {onAddNew && (
            <div className="border-t border-gray-200 dark:border-gray-600 p-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAddNew();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                {addNewLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
