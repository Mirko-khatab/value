import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
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
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Product
        </h1>
        <Form mode="create" />
      </div>
    </main>
  );
}
