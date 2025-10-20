import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
  className?: string;
  mobileLabel?: string;
}

export interface ActionButton {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: (id: string) => void;
  className?: string;
  form?: boolean;
}

interface DashboardTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => ActionButton[];
  viewPath?: string; // e.g., "/dashboard/products"
  imageField?: keyof T;
  titleField?: keyof T;
  altTextField?: keyof T;
  mobileView?: (item: T) => ReactNode;
}

export default function DashboardTable<T extends { id: string }>({
  data,
  columns,
  actions,
  viewPath,
  imageField,
  titleField,
  altTextField,
  mobileView,
}: DashboardTableProps<T>) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-2 md:pt-0 transition-colors duration-200">
          {/* Mobile View */}
          <div className="md:hidden">
            {data?.map((item, index) => (
              <div
                key={`mobile-${item.id}-${index}`}
                className="mb-2 w-full rounded-md bg-white dark:bg-gray-800 p-4 transition-colors duration-200"
              >
                {mobileView ? (
                  mobileView(item)
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center">
                          {imageField && (
                            <>
                              {item[imageField] ? (
                                <Image
                                  src={item[imageField] as string}
                                  className="mr-2 rounded-full"
                                  width={28}
                                  height={28}
                                  alt={
                                    altTextField
                                      ? (item[altTextField] as string)
                                      : "Image"
                                  }
                                />
                              ) : (
                                <div className="mr-2 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ?
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                          {titleField && viewPath ? (
                            <Link
                              href={`${viewPath}/${item.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                            >
                              {item[titleField] as string}
                            </Link>
                          ) : (
                            titleField && (
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {item[titleField] as string}
                              </span>
                            )
                          )}
                        </div>
                        {columns
                          .filter((col) => col.key !== titleField)
                          .slice(0, 2)
                          .map((col) => (
                            <p
                              key={col.key}
                              className="text-sm text-gray-500 dark:text-gray-400 truncate"
                            >
                              {col.mobileLabel && `${col.mobileLabel}: `}
                              {col.render
                                ? col.render(item)
                                : (item[col.key as keyof T] as string)}
                            </p>
                          ))}
                      </div>
                    </div>
                    {actions && (
                      <div className="flex w-full items-center justify-end pt-4 gap-2">
                        {actions(item).map((action, actionIndex) =>
                          action.form ? (
                            <form
                              key={actionIndex}
                              action={() => action.onClick?.(item.id)}
                            >
                              <button
                                type="submit"
                                className={
                                  action.className ||
                                  "rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }
                              >
                                {action.icon}
                              </button>
                            </form>
                          ) : action.href ? (
                            <Link
                              key={actionIndex}
                              href={action.href}
                              className={
                                action.className ||
                                "rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            >
                              {action.icon}
                            </Link>
                          ) : (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick?.(item.id)}
                              className={
                                action.className ||
                                "rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            >
                              {action.icon}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <table className="hidden min-w-full text-gray-900 dark:text-gray-100 md:table">
            <thead className="rounded-lg text-left text-sm font-normal bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={
                      col.className || "px-3 py-5 font-medium sm:pl-6"
                    }
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {data?.map((item, index) => (
                <tr
                  key={`table-${item.id}-${index}`}
                  className="w-full border-b border-gray-200 dark:border-gray-700 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key}
                      className={
                        col.className ||
                        `whitespace-nowrap px-3 py-3 ${
                          colIndex === 0 ? "pl-6" : ""
                        }`
                      }
                    >
                      {colIndex === 0 && imageField && titleField ? (
                        <div className="flex items-center gap-3">
                          {item[imageField] ? (
                            <Image
                              src={item[imageField] as string}
                              className="rounded-full"
                              width={28}
                              height={28}
                              alt={
                                altTextField
                                  ? (item[altTextField] as string)
                                  : "Image"
                              }
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ?
                              </span>
                            </div>
                          )}
                          {viewPath ? (
                            <Link
                              href={`${viewPath}/${item.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                            >
                              {col.render
                                ? col.render(item)
                                : (item[col.key as keyof T] as string)}
                            </Link>
                          ) : (
                            <span>
                              {col.render
                                ? col.render(item)
                                : (item[col.key as keyof T] as string)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          className={
                            col.key === "description" || col.key.includes("value")
                              ? "max-w-xs truncate"
                              : ""
                          }
                        >
                          {col.render
                            ? col.render(item)
                            : (item[col.key as keyof T] as string)}
                        </div>
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {actions(item).map((action, actionIndex) =>
                          action.form ? (
                            <form
                              key={actionIndex}
                              action={() => action.onClick?.(item.id)}
                            >
                              <button
                                type="submit"
                                className={
                                  action.className ||
                                  "rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }
                              >
                                <span className="sr-only">{action.label}</span>
                                {action.icon}
                              </button>
                            </form>
                          ) : action.href ? (
                            <Link
                              key={actionIndex}
                              href={action.href}
                              className={
                                action.className ||
                                "rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            >
                              <span className="sr-only">{action.label}</span>
                              {action.icon}
                            </Link>
                          ) : (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick?.(item.id)}
                              className={
                                action.className ||
                                "rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            >
                              <span className="sr-only">{action.label}</span>
                              {action.icon}
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


