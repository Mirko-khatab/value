import AudioForm from "@/app/ui/audio/form";
import Breadcrumbs from "@/app/ui/banner/breadcrumbs";
import { fetchAudioById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [audio] = await fetchAudioById(id);

  if (!audio) {
    notFound();
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
        <AudioForm audio={audio} />
      </div>
    </main>
  );
}
