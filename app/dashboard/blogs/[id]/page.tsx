import { fetchBlogById, fetchBlogGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/blog/breadcrumbs";
import { UpdateBlog, DeleteBlog } from "@/app/ui/blog/buttons";
import GalleryList from "@/app/ui/project/gallery-list";
import Image from "next/image";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [blog, galleries] = await Promise.all([
    fetchBlogById(id),
    fetchBlogGalleries(id),
  ]);

  if (!blog || blog.length === 0) {
    notFound();
  }

  const blogData = blog[0];
  const mainImage = galleries.length > 0 ? galleries[0] : null;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Blogs", href: "/dashboard/blogs" },
          {
            label: blogData.title_en,
            href: `/dashboard/blogs/${id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {blogData.title_en}
          </h1>
          <div className="flex gap-2">
            <UpdateBlog id={id} />
            <DeleteBlog id={id} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blog Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Blog Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Titles</h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Kurdish:</span>{" "}
                      {blogData.title_ku}
                    </p>
                    <p>
                      <span className="font-medium">Arabic:</span>{" "}
                      {blogData.title_ar}
                    </p>
                    <p>
                      <span className="font-medium">English:</span>{" "}
                      {blogData.title_en}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Descriptions
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Kurdish:</span>{" "}
                      {blogData.description_ku}
                    </p>
                    <p>
                      <span className="font-medium">Arabic:</span>{" "}
                      {blogData.description_ar}
                    </p>
                    <p>
                      <span className="font-medium">English:</span>{" "}
                      {blogData.description_en}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Main Image */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Main Image
            </h2>
            {mainImage ? (
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={mainImage.image_url}
                  alt={mainImage.alt_text}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No main image</p>
              </div>
            )}
            {mainImage && (
              <p className="mt-2 text-sm text-gray-600">{mainImage.alt_text}</p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-12">
          <GalleryList galleries={galleries} parentId={id} parentType={1} />
        </div>
      </div>
    </main>
  );
}
