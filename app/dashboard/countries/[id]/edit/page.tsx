import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { fetchCountryById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import CountryForm from "@/app/ui/country/form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const country = await fetchCountryById(id);

  if (!country) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Countries", href: "/dashboard/countries" },
          {
            label: "Edit Country",
            href: `/dashboard/countries/${id}/edit`,
            active: true,
          },
        ]}
      />
      <CountryForm mode="edit" country={country} />
    </main>
  );
}
