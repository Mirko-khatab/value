import Breadcrumbs from "@/app/ui/quote/breadcrumbs";
import Form from "@/app/ui/quote/form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Quotes", href: "/dashboard/quote" },
          {
            label: "Create Quote",
            href: "/dashboard/quote/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
