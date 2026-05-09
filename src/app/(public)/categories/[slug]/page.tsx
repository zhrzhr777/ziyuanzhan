import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/resource-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug },
    include: { _count: { select: { resources: { where: { isPublished: true } } } } },
  });

  if (!category) notFound();

  const resources = await db.resource.findMany({
    where: { categoryId: category.id, isPublished: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary">首页</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-primary">分类</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">该分类暂无资源</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
