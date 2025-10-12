import Form from "@/app/ui/banner/form";
import Breadcrumbs from "@/app/ui/banner/breadcrumbs";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Banners", href: "/dashboard/banners" },
          {
            label: "Create Banner",
            href: "/dashboard/banners/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
