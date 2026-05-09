import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/resource-card";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Number(params.page) || 1;
  const pageSize = 12;

  let resources: Awaited<ReturnType<typeof db.resource.findMany>> = [];
  let total = 0;

  if (query) {
    [resources, total] = await Promise.all([
      db.resource.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.resource.count({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } },
          ],
        },
      }),
    ]);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">搜索结果</h1>

      {!query ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">请输入搜索关键词</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">未找到与 &quot;{query}&quot; 相关的资源</p>
          <Link href="/resources" className="text-primary hover:underline text-sm mt-2 inline-block">
            浏览全部资源
          </Link>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            找到 {total} 个与 &quot;{query}&quot; 相关的结果
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
