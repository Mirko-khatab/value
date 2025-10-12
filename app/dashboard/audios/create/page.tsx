import AudioForm from "@/app/ui/audio/form";
import Breadcrumbs from "@/app/ui/banner/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Audios", href: "/dashboard/audios" },
          {
            label: "Create Audio",
            href: "/dashboard/audios/create",
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Audio
        </h1>
        <AudioForm />
      </div>
    </main>
  );
}
