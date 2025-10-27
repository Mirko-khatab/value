import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { quotesFormFields, quotesFormHandler } from "@/app/ui/dashboard/config";
import { fetchQuoteById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const quote = await fetchQuoteById(id);

  if (!quote) {
    notFound();
  }

  async function handleSubmit(formData: FormData, data: Record<string, any>) {
    "use server";
    try {
      await quotesFormHandler("edit", id, formData);
    } catch (error) {
      // Let the error bubble up to the form component
      throw error;
    }
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Quotes", href: "/dashboard/quote" },
          {
            label: "Edit Quote",
            href: `/dashboard/quote/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Quote
        </h1>
        <DashboardForm
          fields={quotesFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/quote"
          entityName="Quote"
          mode="edit"
          initialData={quote}
        />
      </div>
    </main>
  );
}
