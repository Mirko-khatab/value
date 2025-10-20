"use client";

import { useActionState } from "react";
import { createCountry, updateCountry } from "@/app/lib/actions";
import { Country } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/ui/button";

interface CountryFormProps {
  mode: "create" | "edit";
  country?: Country;
}

export default function CountryForm({ mode, country }: CountryFormProps) {
  const isEditMode = mode === "edit";
  const initialState = { message: null, errors: {} };

  const action = isEditMode
    ? updateCountry.bind(null, country!.id)
    : createCountry;

  const [state, dispatch] = useActionState(action, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="rounded-md bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          {isEditMode ? "Edit Country" : "Create Country"}
        </h2>

        {/* Name Kurdish */}
        <div className="mb-4">
          <label
            htmlFor="name_ku"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Name (Kurdish) <span className="text-red-500">*</span>
          </label>
          <input
            id="name_ku"
            name="name_ku"
            type="text"
            required
            defaultValue={isEditMode ? country?.name_ku : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Enter Kurdish country name"
          />
          {state.errors?.name_ku && (
            <p className="mt-2 text-sm text-red-500">{state.errors.name_ku}</p>
          )}
        </div>

        {/* Name Arabic */}
        <div className="mb-4">
          <label
            htmlFor="name_ar"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Name (Arabic) <span className="text-red-500">*</span>
          </label>
          <input
            id="name_ar"
            name="name_ar"
            type="text"
            required
            defaultValue={isEditMode ? country?.name_ar : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Enter Arabic country name"
            dir="rtl"
          />
          {state.errors?.name_ar && (
            <p className="mt-2 text-sm text-red-500">{state.errors.name_ar}</p>
          )}
        </div>

        {/* Name English */}
        <div className="mb-4">
          <label
            htmlFor="name_en"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            id="name_en"
            name="name_en"
            type="text"
            required
            defaultValue={isEditMode ? country?.name_en : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Enter English country name"
          />
          {state.errors?.name_en && (
            <p className="mt-2 text-sm text-red-500">{state.errors.name_en}</p>
          )}
        </div>

        {/* Country Code */}
        <div className="mb-4">
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Country Code (ISO 3166-1 alpha-3)
          </label>
          <input
            id="code"
            name="code"
            type="text"
            maxLength={3}
            defaultValue={isEditMode ? country?.code : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="e.g., IRQ, USA, GBR"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Optional. 3-letter code (e.g., IRQ for Iraq, USA for United States)
          </p>
          {state.errors?.code && (
            <p className="mt-2 text-sm text-red-500">{state.errors.code}</p>
          )}
        </div>

        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/countries"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </Link>
        <Button type="submit">
          {isEditMode ? "Update Country" : "Create Country"}
        </Button>
      </div>
    </form>
  );
}
