import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AdSlot } from "@/components/ads/ad-slot";
import { DownloadButton } from "@/components/payment/download-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Download, FileIcon, FolderOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;

  const resource = await db.resource.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!resource || !resource.isPublished) {
    notFound();
  }

  const session = await auth();
  let hasPurchased = false;

  if (session?.user?.id) {
    const order = await db.order.findFirst({
      where: {
        userId: session.user.id,
        resourceId: resource.id,
        status: "PAID",
      },
    });
    hasPurchased = !!order;
  }

  const relatedResources = await db.resource.findMany({
    where: {
      categoryId: resource.categoryId,
      id: { not: resource.id },
      isPublished: true,
    },
    include: { category: true },
    take: 4,
    orderBy: { downloadCount: "desc" },
  });

  const tags = resource.tags ? resource.tags.split(",").filter(Boolean) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-primary">资源</Link>
            <span>/</span>
            <Link href={`/categories/${resource.category.slug}`} className="hover:text-primary">
              {resource.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{resource.title}</span>
          </nav>

          {/* Cover Image */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
            {resource.coverImage ? (
              <img src={resource.coverImage} alt={resource.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl">{resource.category.icon || "📁"}</span>
            )}
          </div>

          {/* Title & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary">{resource.category.name}</Badge>
            <Badge variant={resource.price > 0 ? "default" : "outline"}>
              {resource.price > 0 ? `￥${resource.price}` : "免费"}
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{resource.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(resource.createdAt).toLocaleDateString("zh-CN")}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {resource.downloadCount} 次下载
            </span>
            {resource.fileSize && (
              <span className="flex items-center gap-1">
                <FileIcon className="h-4 w-4" />
                {resource.fileSize}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              {resource.fileType}
            </span>
          </div>

          <Separator className="mb-6" />

          {/* Ad: content-top */}
          <AdSlot position="content-top" className="mb-6" />

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {resource.content || resource.description}
            </ReactMarkdown>
          </div>

          {/* Ad: content-bottom */}
          <AdSlot position="content-bottom" className="mb-8" />

          {/* Download Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border-2 border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {resource.price > 0 ? `付费资源 · ￥${resource.price}` : "免费资源"}
                  {resource.externalUrl && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                      网盘下载
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.externalUrl
                    ? "点击下方按钮跳转到外部链接下载（网盘等）"
                    : resource.price > 0
                      ? "购买后即可下载，可随时从用户中心重新下载"
                      : "登录后即可免费下载"}
                </p>
                {resource.externalUrl && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    外部链接: {resource.externalUrl.substring(0, 60)}...
                  </p>
                )}
              </div>
              <DownloadButton
                resourceId={resource.id}
                resourceSlug={resource.slug}
                price={resource.price}
                hasPurchased={hasPurchased}
                fileUrl={resource.fileUrl}
                externalUrl={resource.externalUrl || undefined}
                isLoggedIn={!!session?.user}
              />
            </div>
          </div>

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">相关资源</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedResources.map((r) => (
                  <Link
                    key={r.id}
                    href={`/resources/${r.slug}`}
                    className="flex gap-3 p-3 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center shrink-0">
                      <span className="text-xl">{r.category.icon || "📁"}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{r.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                      <Badge variant={r.price > 0 ? "default" : "outline"} className="text-xs mt-1">
                        {r.price > 0 ? `￥${r.price}` : "免费"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          {/* Download Card (sticky) */}
          <div className="hidden lg:block sticky top-20 space-y-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="text-center mb-3">
                <span className="text-3xl font-bold text-primary">
                  {resource.price > 0 ? `￥${resource.price}` : "免费"}
                </span>
              </div>
              <DownloadButton
                resourceId={resource.id}
                resourceSlug={resource.slug}
                price={resource.price}
                hasPurchased={hasPurchased}
                fileUrl={resource.fileUrl}
                isLoggedIn={!!session?.user}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                {resource.fileSize} · {resource.fileType}
              </p>
            </div>

            <AdSlot position="content-sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
