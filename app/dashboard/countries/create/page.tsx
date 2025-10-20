import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CountryForm from "@/app/ui/country/form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Countries", href: "/dashboard/countries" },
          {
            label: "Create Country",
            href: "/dashboard/countries/create",
            active: true,
          },
        ]}
      />
      <CountryForm mode="create" />
    </main>
  );
}



