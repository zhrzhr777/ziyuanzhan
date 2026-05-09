import Link from "next/link";
import { db } from "@/lib/db";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { resources: { where: { isPublished: true } } } },
      resources: {
        where: { isPublished: true },
        orderBy: { downloadCount: "desc" },
        take: 4,
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">资源分类</h1>
      <p className="text-muted-foreground mb-8">按分类浏览你感兴趣的资源</p>

      <div className="space-y-8">
        {categories.map((cat) => (
          <section key={cat.id} className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </div>
              </div>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-sm text-primary hover:underline shrink-0"
              >
                查看全部 ({cat._count.resources})
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cat.resources.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.slug}`}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-medium truncate">{r.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {r.price > 0 ? `￥${r.price}` : "免费"}
                  </span>
                </Link>
              ))}
              {cat._count.resources === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">暂无资源</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
