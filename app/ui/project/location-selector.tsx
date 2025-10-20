"use client";

import { useState } from "react";
import SearchableSelect from "@/app/ui/utils/searchable-select";
import { Location, Country } from "@/app/lib/definitions";
import AddLocationModal from "@/app/ui/location/add-location-modal";

interface LocationSelectorProps {
  locations: Location[];
  countries: Country[];
  name?: string;
  value?: string | number;
  required?: boolean;
}

export default function LocationSelector({
  locations,
  countries,
  name = "location_id",
  value,
  required = true,
}: LocationSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert locations to searchable options
  const options = locations.map((loc) => ({
    value: loc.id,
    label: `${loc.city_en}, ${loc.country_name_en}`,
    searchText: `${loc.city_en} ${loc.city_ku} ${loc.city_ar} ${loc.country_name_en} ${loc.country_name_ku} ${loc.country_name_ar}`,
  }));

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <SearchableSelect
        name={name}
        options={options}
        value={value}
        placeholder="Select a location"
        required={required}
        onAddNew={handleAddNew}
        addNewLabel="Add New Location"
        itemsPerPage={20}
      />

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        countries={countries}
      />
    </>
  );
}
