import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { quotesFormFields, quotesFormHandler } from "@/app/ui/dashboard/config";

export default async function Page() {
  async function handleSubmit(formData: FormData, data: Record<string, any>) {
    "use server";
    try {
      await quotesFormHandler("create", undefined, formData);
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
