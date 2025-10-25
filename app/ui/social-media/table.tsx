import {
  UpdateSocialMedia,
} from "@/app/ui/social-media/buttons";
import { fetchFilteredSocialMedia } from "@/app/lib/data";
import { SocialMediaType } from "@/app/lib/definitions";

// Social media icons mapping
const getSocialMediaIcon = (type: number) => {
  switch (type) {
    case SocialMediaType.Instagram:
      return (
        <svg
          className="w-6 h-6 text-pink-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case SocialMediaType.Facebook:
      return (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case SocialMediaType.X:
      return (
        <svg
          className="w-6 h-6 text-black"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return (
        <svg
          className="w-6 h-6 text-gray-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
  }
};

const getSocialMediaName = (type: number) => {
  switch (type) {
    case SocialMediaType.Instagram:
      return "Instagram";
    case SocialMediaType.Facebook:
      return "Facebook";
    case SocialMediaType.X:
      return "X (Twitter)";
    default:
      return "Unknown";
  }
};

export default async function SocialMediaTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const socialMedia = await fetchFilteredSocialMedia(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 p-2 md:pt-0">
          <div className="md:hidden text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:border-gray-600 [&:hover>td]:bg-gray-100 dark:[&:hover>td]:bg-gray-600 [&:hover>td]:text-gray-900 dark:[&:hover>td]:text-gray-100 ">
            {socialMedia?.map((social) => (
              <div
                key={social.id}
                className="mb-2 w-full rounded-md bg-white text-gray-900 dark:bg-gray-800 p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-3">
                    {getSocialMediaIcon(social.type)}
                    <div>
                      <p className="text-sm font-medium">
                        {getSocialMediaName(social.type)}
                      </p>
                      <p className="text-sm text-gray-500">{social.url}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateSocialMedia id={social.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Platform
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  URL
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-200 dark:border-gray-600 [&:hover>td]:bg-gray-100 dark:[&:hover>td]:bg-gray-600 [&:hover>td]:text-gray-900 dark:[&:hover>td]:text-gray-100   ">
              {socialMedia?.map((social) => (
                <tr
                  key={social.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg text-gray-900 dark:text-gray-100 transition-colors duration-200 dark:border-gray-600 [&:hover>td]:bg-gray-100 dark:[&:hover>td]:bg-gray-600 [&:hover>td]:text-gray-900 dark:[&:hover>td]:text-gray-100   "
                >
                  <td className="whitespace-nowrap px-4 py-3 pl-6">
                    <div className="flex items-center space-x-3">
                      {getSocialMediaIcon(social.type)}
                      <span className="font-medium">
                        {getSocialMediaName(social.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {social.url}
                    </a>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateSocialMedia id={social.id} />
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
