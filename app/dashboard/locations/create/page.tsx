import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { createLocation } from "@/app/lib/actions";
import { fetchCountries } from "@/app/lib/data";
import LocationForm from "@/app/ui/location/form";

export default async function Page() {
  const countries = await fetchCountries();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Locations", href: "/dashboard/locations" },
          {
            label: "Create Location",
            href: "/dashboard/locations/create",
            active: true,
          },
        ]}
      />
      <LocationForm mode="create" countries={countries} />
    </main>
  );
}



