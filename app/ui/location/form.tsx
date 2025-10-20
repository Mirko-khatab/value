"use client";

import { useActionState } from "react";
import { createLocation, updateLocation } from "@/app/lib/actions";
import { Country, Location } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/ui/button";

interface LocationFormProps {
  mode: "create" | "edit";
  location?: Location;
  countries: Country[];
}

export default function LocationForm({
  mode,
  location,
  countries,
}: LocationFormProps) {
  const isEditMode = mode === "edit";
  const initialState = { message: null, errors: {} };

  const action = isEditMode
    ? updateLocation.bind(null, location!.id)
    : createLocation;

  const [state, dispatch] = useActionState(action, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="rounded-md bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          {isEditMode ? "Edit Location" : "Create Location"}
        </h2>

        {/* Country Selection */}
        <div className="mb-4">
          <label
            htmlFor="country_id"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="country_id"
            name="country_id"
            required
            defaultValue={isEditMode ? location?.country_id : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name_en} ({country.name_ku})
              </option>
            ))}
          </select>
          {state.errors?.country_id && (
            <p className="mt-2 text-sm text-red-500">
              {state.errors.country_id}
            </p>
          )}
        </div>

        {/* City Kurdish */}
        <div className="mb-4">
          <label
            htmlFor="city_ku"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            City (Kurdish) <span className="text-red-500">*</span>
          </label>
          <input
            id="city_ku"
            name="city_ku"
            type="text"
            required
            defaultValue={isEditMode ? location?.city_ku : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Enter Kurdish city name"
          />
          {state.errors?.city_ku && (
            <p className="mt-2 text-sm text-red-500">{state.errors.city_ku}</p>
          )}
        </div>

        {/* City Arabic */}
        <div className="mb-4">
          <label
            htmlFor="city_ar"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            City (Arabic) <span className="text-red-500">*</span>
          </label>
          <input
            id="city_ar"
            name="city_ar"
            type="text"
            required
            defaultValue={isEditMode ? location?.city_ar : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Enter Arabic city name"
            dir="rtl"
          />
          {state.errors?.city_ar && (
            <p className="mt-2 text-sm text-red-500">{state.errors.city_ar}</p>
          )}
        </div>

        {/* City English */}
        <div className="mb-4">
          <label
            htmlFor="city_en"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            City (English) <span className="text-red-500">*</span>
          </label>
          <input
            id="city_en"
            name="city_en"
            type="text"
            required
            defaultValue={isEditMode ? location?.city_en : ""}
            className="peer block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Enter English city name"
          />
          {state.errors?.city_en && (
            <p className="mt-2 text-sm text-red-500">{state.errors.city_en}</p>
          )}
        </div>

        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/locations"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </Link>
        <Button type="submit">
          {isEditMode ? "Update Location" : "Create Location"}
        </Button>
      </div>
    </form>
  );
}
