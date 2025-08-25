import Form from "@/app/ui/machine-groups/form";
import Breadcrumbs from "@/app/ui/machine-groups/breadcrumbs";
import { fetchMachineGroupById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const machineGroup = await fetchMachineGroupById(id);

  if (!machineGroup || machineGroup.length === 0) {
    notFound();
  }

  const machineGroupData = machineGroup[0];

  // Convert to plain object to ensure proper serialization
  const serializedMachineGroup = {
    id: machineGroupData.id,
    title_ku: machineGroupData.title_ku,
    title_ar: machineGroupData.title_ar,
    title_en: machineGroupData.title_en,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Machine Groups", href: "/dashboard/machine-groups" },
          {
            label: "Edit Machine Group",
            href: `/dashboard/machine-groups/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form mode="edit" machineGroup={serializedMachineGroup} />
    </main>
  );
}
