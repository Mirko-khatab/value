import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import Form from "@/app/ui/event/form";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Events", href: "/dashboard/event" },
          {
            label: "Create Event",
            href: "/dashboard/event/create",
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Event
        </h1>
        <Form mode="create" />
      </div>
    </main>
  );
}
