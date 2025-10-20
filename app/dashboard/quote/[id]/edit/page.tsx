import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { quotesFormFields } from "@/app/ui/dashboard/config";
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
          initialData={quoteData}
        />
      </div>
    </main>
  );
}
