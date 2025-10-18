import Breadcrumbs from "@/app/ui/products/breadcrumbs";
import Form from "@/app/ui/products/create-form";
// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products" },
          {
            label: "Create Product",
            href: "/dashboard/products/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
