import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { fetchLocationById, fetchCountries } from "@/app/lib/data";
import { notFound } from "next/navigation";
import LocationForm from "@/app/ui/location/form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [locationResult, countries] = await Promise.all([
    fetchLocationById(id),
    fetchCountries(),
  ]);

  if (!locationResult || locationResult.length === 0) {
    notFound();
  }

  const location = locationResult[0];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Locations", href: "/dashboard/locations" },
          {
            label: "Edit Location",
            href: `/dashboard/locations/${id}/edit`,
            active: true,
          },
        ]}
      />
      <LocationForm mode="edit" location={location} countries={countries} />
    </main>
  );
}
