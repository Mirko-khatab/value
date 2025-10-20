import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { audiosFormFields } from "@/app/ui/dashboard/config";
import { fetchAudioById } from "@/app/lib/data";
import { updateAudio } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [audio] = await fetchAudioById(id);

  if (!audio) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateAudio(id, { message: null, errors: {} }, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Audios", href: "/dashboard/audios" },
          {
            label: "Edit Audio",
            href: `/dashboard/audios/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Audio
        </h1>
        <DashboardForm
          fields={audiosFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/audios"
          entityName="Audio"
          mode="edit"
          initialData={audio}
        />
      </div>
    </main>
  );
}
