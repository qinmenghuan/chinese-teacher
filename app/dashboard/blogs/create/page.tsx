import Form from "@/app/ui/blogs/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

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
      <Form />
    </main>
  );
}
