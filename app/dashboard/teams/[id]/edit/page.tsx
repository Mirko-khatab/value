import Form from "@/app/ui/teams/form";
import Breadcrumbs from "@/app/ui/project/breadcrumbs";
import { fetchTeamById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const team = await fetchTeamById(id);

  if (!team || team.length === 0) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Teams", href: "/dashboard/teams" },
          {
            label: "Edit Team",
            href: `/dashboard/teams/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form team={team[0]} mode="edit" />
    </main>
  );
}
