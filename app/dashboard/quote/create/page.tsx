import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { quotesFormFields } from "@/app/ui/dashboard/config";
import { createQuote } from "@/app/lib/actions";

export default async function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createQuote({ message: null, errors: {} }, formData);
  }

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
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Quote
        </h1>
        <DashboardForm
          fields={quotesFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/quote"
          entityName="Quote"
          mode="create"
        />
      </div>
    </main>
  );
}
