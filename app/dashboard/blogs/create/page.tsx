import Breadcrumbs from "@/app/ui/blog/breadcrumbs";
import Form from "@/app/ui/blog/form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Blogs", href: "/dashboard/blogs" },
          {
            label: "Create Blog",
            href: "/dashboard/blogs/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
