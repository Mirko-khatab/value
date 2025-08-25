import Image from "next/image";
import Link from "next/link";
import { UpdateBlog, DeleteBlog } from "@/app/ui/blog/buttons";
import { fetchFilteredBlogs } from "@/app/lib/data";

export default async function BlogsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const blogs = await fetchFilteredBlogs(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {blogs?.map((blog) => (
              <div
                key={blog.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {blog.gallery_image_url && (
                        <Image
                          src={blog.gallery_image_url}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={blog.gallery_alt_text || blog.title_en}
                        />
                      )}
                      <Link
                        href={`/dashboard/blogs/${blog.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {blog.title_en}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      {blog.description_en}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateBlog id={blog.id} />
                    <DeleteBlog id={blog.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Blog
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kurdish Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Arabic Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  English Title
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {blogs?.map((blog) => (
                <tr
                  key={blog.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {blog.gallery_image_url ? (
                        <Image
                          src={blog.gallery_image_url}
                          className="rounded-lg"
                          width={56}
                          height={56}
                          alt={blog.gallery_alt_text || blog.title_en}
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <Link
                          href={`/dashboard/blogs/${blog.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {blog.title_en}
                        </Link>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {blog.description_en}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {blog.title_ku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {blog.title_ar}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {blog.title_en}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBlog id={blog.id} />
                      <DeleteBlog id={blog.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
