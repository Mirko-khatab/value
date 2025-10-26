import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { createLocation } from "@/app/lib/actions";
import { fetchCountries } from "@/app/lib/data";
import LocationForm from "@/app/ui/location/form";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
