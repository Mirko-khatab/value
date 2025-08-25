import Breadcrumbs from "@/app/ui/project/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";
import Form from "@/app/ui/teams/form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Teams", href: "/dashboard/teams" },
          {
            label: "Create Team",
            href: "/dashboard/teams/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
