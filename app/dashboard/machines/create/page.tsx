import Breadcrumbs from "@/app/ui/machines/breadcrumbs";
import Form from "@/app/ui/machines/create-form";
import { fetchMachineGroups } from "@/app/lib/data";

export default async function Page() {
  const machineGroups = await fetchMachineGroups();

  // Convert to plain objects to ensure proper serialization
  const serializedMachineGroups = machineGroups.map((group) => ({
    id: group.id,
    title_ku: group.title_ku,
    title_ar: group.title_ar,
    title_en: group.title_en,
  }));

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Machines", href: "/dashboard/machines" },
          {
            label: "Create Machine",
            href: "/dashboard/machines/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" machineGroups={serializedMachineGroups} />
    </main>
  );
}
