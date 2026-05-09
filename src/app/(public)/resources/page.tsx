import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/resource-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { Pagination } from "@/components/shared/pagination";

interface Props {
  searchParams: Promise<{ page?: string; category?: string; price?: string; sort?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 12;
  const categorySlug = params.category;
  const priceFilter = params.price;
  const sort = params.sort || "newest";

  const where: Record<string, unknown> = { isPublished: true };

  if (categorySlug) {
    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (priceFilter === "free") {
    where.price = 0;
  } else if (priceFilter === "paid") {
    where.price = { gt: 0 };
  }

  const orderBy: Record<string, string> =
    sort === "popular" ? { downloadCount: "desc" } :
    sort === "price-low" ? { price: "asc" } :
    sort === "price-high" ? { price: "desc" } :
    { createdAt: "desc" };

  const [resources, total, categories] = await Promise.all([
    db.resource.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.resource.count({ where }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { resources: { where: { isPublished: true } } } } },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <ResourceFilters categories={categories} currentCategory={categorySlug} currentPrice={priceFilter} currentSort={sort} />
          <div className="mt-4">
            <AdSlot position="home-sidebar-top" />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">全部资源</h1>
            <span className="text-sm text-muted-foreground">共 {total} 个资源</span>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">暂无资源</p>
              <Link href="/resources" className="text-primary hover:underline text-sm mt-2 inline-block">
                清除筛选
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {resources.map((r, idx) => (
                  <div key={r.id}>
                    <ResourceCard resource={r} />
                    {idx === 5 && <AdSlot position="list-inline" className="mt-4" />}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
