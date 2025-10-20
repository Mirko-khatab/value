import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { socialFormFields } from "@/app/ui/dashboard/config";
import { fetchQuoteById } from "@/app/lib/data";
import { updateQuote } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const quote = await fetchQuoteById(id);

  if (!quote || quote.length === 0) {
    notFound();
  }

  const quoteData = quote[0];

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateQuote(id, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Social", href: "/dashboard/social" },
          {
            label: "Edit Social",
            href: `/dashboard/social/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Social
        </h1>
        <DashboardForm
          fields={socialFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/social"
          entityName="Social"
          mode="edit"
          initialData={quoteData}
        />
      </div>
    </main>
  );
}
