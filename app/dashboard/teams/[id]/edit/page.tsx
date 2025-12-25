import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { teamsFormFields } from "@/app/ui/dashboard/config";
import { fetchTeamById } from "@/app/lib/data";
import { updateTeam } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import TeamImageUpload from "@/app/ui/teams/team-image-upload";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const team = await fetchTeamById(id);

  if (!team) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateTeam(id, formData);
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
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Team Member
        </h1>
        <DashboardForm
          fields={teamsFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/teams"
          entityName="Team Member"
          mode="edit"
          initialData={team}
          customContent={
            <TeamImageUpload initialImageUrl={team.image_url} />
          }
        />
      </div>
    </main>
  );
}
