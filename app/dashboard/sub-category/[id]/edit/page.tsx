import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { subCategoryFormFields } from "@/app/ui/dashboard/config";
import {
  fetchSubCategoryById,
  fetchProjectCategories,
} from "@/app/lib/data";
import { updateSubCategory } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [subCategories, categories] = await Promise.all([
    fetchSubCategoryById(id),
    fetchProjectCategories(),
  ]);

  if (!subCategories || subCategories.length === 0) {
    notFound();
  }

  const subCategoryData = subCategories[0];

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
    await updateSubCategory(id, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Sub Categories", href: "/dashboard/sub-category" },
          {
            label: "Edit Sub Category",
            href: `/dashboard/sub-category/${id}/edit`,
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={fieldsWithOptions}
        mode="edit"
        initialData={subCategoryData}
        onSubmit={handleSubmit}
        cancelPath="/dashboard/sub-category"
        entityName="Sub Category"
      />
    </main>
  );
}

