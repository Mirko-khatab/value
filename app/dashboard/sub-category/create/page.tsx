import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { subCategoryFormFields } from "@/app/ui/dashboard/config";
import { createSubCategory } from "@/app/lib/actions";
import { fetchProjectCategories } from "@/app/lib/data";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  // Fetch categories for the dropdown
  const categories = await fetchProjectCategories();

  // Populate the category_id select field with options
  const fieldsWithOptions = subCategoryFormFields.map((field) => {
    if (field.name === "category_id") {
      return {
        ...field,
        options: categories.map((cat) => ({
          value: cat.id,
          label: cat.title_en,
        })),
      };
    }
    return field;
  });

  async function handleSubmit(formData: FormData) {
    "use server";
    await createSubCategory({ message: null, errors: {} }, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Sub Categories", href: "/dashboard/sub-category" },
          {
            label: "Create Sub Category",
            href: "/dashboard/sub-category/create",
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={fieldsWithOptions}
        mode="create"
        onSubmit={handleSubmit}
        cancelPath="/dashboard/sub-category"
        entityName="Sub Category"
      />
    </main>
  );
}

