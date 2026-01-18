import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteInvoice } from "@/app/lib/actions";

export function CreateBlog() {
  return (
    <Link
      href="/dashboard/blogs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Blog</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBlog({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/blogs/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBlog({ id }: { id: string }) {
  const deleteBlogWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteBlogWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function BlogDetail({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/blogs/${id}/detail`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <BookOpenIcon className="w-5" />
    </Link>
  );
}
