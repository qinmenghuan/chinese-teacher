import Form from "@/app/ui/blogs/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchBlogById, fetchAllBlogs } from "@/app/lib/data";
import { notFound } from "next/navigation";
import BlogDetail from "@/app/ui/blogs/detail";

// 设置ISR，每3600秒重新生成页面
export const revalidate = 3600;

// 为SSG 生成静态参数
export async function generateStaticParams() {
  const blogs = await fetchAllBlogs();
  return blogs.map((blog) => ({
    id: blog.id,
  }));
}

// 生成元数据（用于SEO）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const blog = await fetchBlogById(resolvedParams.id);
  return {
    title: blog?.title || "Blog Detail",
    description: blog?.content.substring(0, 120) || "Blog detail page",
  };
}

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
            label: "BLog Detail",
            href: `/dashboard/blogs/${id}/detail`,
            active: true,
          },
        ]}
      />
      <BlogDetail blog={blog} />
    </main>
  );
}
