import Form from "@/app/ui/blogs/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchBlogById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const blog = await fetchBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Blogs", href: "/dashboard/blogs" },
          {
            label: "Edit BLog",
            href: `/dashboard/blogs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form blog={blog} />
    </main>
  );
}
