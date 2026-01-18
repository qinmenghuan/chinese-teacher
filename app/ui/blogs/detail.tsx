import { BLogForm } from "@/app/lib/definitions";

export default function BlogDetail({ blog }: { blog: BLogForm }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{blog.title}</h3>
      <p className="text-sm text-gray-700">{blog.content}</p>
    </div>
  );
}
