import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { resources: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>
      <div className="space-y-2">
        {categories.map((cat) => (
          <Card key={cat.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted-foreground">/{cat.slug} · {cat._count.resources} 个资源</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
