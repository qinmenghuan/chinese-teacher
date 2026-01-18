import Image from "next/image";
import { UpdateBlog, DeleteBlog, BlogDetail } from "@/app/ui/blogs/buttons";
import BlogStatus from "@/app/ui/blogs/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
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
                      <p>{blog.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{blog.email}</p>
                  </div>
                  <BlogStatus status={blog.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {/* {formatCurrency(invoice.amount)} */}
                    </p>
                    <p>{formatDateToLocal(blog.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateBlog id={blog.id} />
                    <DeleteBlog id={blog.id} />
                    <BlogDetail id={blog.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  User
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
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
                      <p>{blog.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{blog.title}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(blog.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <BlogStatus status={blog.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBlog id={blog.id} />
                      <DeleteBlog id={blog.id} />
                      <BlogDetail id={blog.id} />
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
