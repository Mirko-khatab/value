import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { teamsFormFields } from "@/app/ui/dashboard/config";
import { createTeam } from "@/app/lib/actions";
import TeamImageUpload from "@/app/ui/teams/team-image-upload";

export default async function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createTeam({ message: null, errors: {} }, formData);
  }

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
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Team Member
        </h1>
        <DashboardForm
          fields={teamsFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/teams"
          entityName="Team Member"
          mode="create"
          customContent={<TeamImageUpload />}
        />
      </div>
    </main>
  );
}
