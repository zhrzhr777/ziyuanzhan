import Link from "next/link";
import { db } from "@/lib/db";
import { ResourceCard } from "@/components/resources/resource-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { ParticleBackground } from "@/components/shared/particle-bg";
import { AnimatedTitle } from "@/components/shared/animated";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Sparkles, Gift } from "lucide-react";

export default async function HomePage() {
  const [featuredResources, freeResources, latestResources, categories, stats] = await Promise.all([
    db.resource.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true },
      orderBy: { downloadCount: "desc" },
      take: 4,
    }),
    db.resource.findMany({
      where: { isPublished: true, price: 0 },
      include: { category: true },
      orderBy: { downloadCount: "desc" },
      take: 8,
    }),
    db.resource.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { resources: { where: { isPublished: true } } } } },
    }),
    {
      total: db.resource.count({ where: { isPublished: true } }),
      free: db.resource.count({ where: { isPublished: true, price: 0 } }),
      users: db.user.count(),
      downloads: db.download.count(),
    },
  ]);

  const [total, free, users, downloads] = await Promise.all([stats.total, stats.free, stats.users, stats.downloads]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-primary/5 to-background py-16 md:py-24 relative overflow-hidden">
        <ParticleBackground />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
            <Gift className="h-3 w-3 mr-1" /> {free} 个免费资源已收录
          </Badge>
          <AnimatedTitle className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            优质资源 · 免费下载
          </AnimatedTitle>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            教程课程、学习资料、模板素材、软件工具、设计资源、技术资讯 ——
            绝大多数资源完全免费，精品内容付费解锁
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/resources?price=free">
                <Gift className="mr-2 h-4 w-4" /> 免费资源
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/resources">全部资源 <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
            {[
              { label: "资源总数", value: total, icon: "📦" },
              { label: "免费资源", value: free, icon: "🎁" },
              { label: "注册用户", value: users, icon: "👥" },
              { label: "累计下载", value: downloads, icon: "📥" },
            ].map((s) => (
              <div key={s.label} className="bg-background/80 rounded-lg p-3 border">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad: home-banner */}
      <section className="container mx-auto px-4 py-4">
        <AdSlot position="home-banner" />
      </section>

      {/* Free Resources (最重要的引流区) */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            <h2 className="text-2xl font-bold">免费资源</h2>
            <Badge variant="outline" className="ml-2">{free}个</Badge>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resources?price=free">
              查看全部 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {freeResources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">资源分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center p-6 bg-background rounded-lg border hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3">{cat.icon}</span>
                <span className="font-medium group-hover:text-primary">{cat.name}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {cat._count.resources} 个资源
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">精选推荐</h2>
            <span className="text-sm text-muted-foreground">下载量最高</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredResources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-bold">最新入库</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resources?sort=newest">
              查看全部 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestResources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
