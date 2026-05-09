import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// 获取资源列表
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const category = url.searchParams.get("category");
  const price = url.searchParams.get("price");
  const sort = url.searchParams.get("sort") || "newest";
  const pageSize = 12;

  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.categoryId = category;
  if (price === "free") where.price = 0;
  if (price === "paid") where.price = { gt: 0 };

  const orderBy =
    sort === "popular" ? { downloadCount: "desc" } :
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const [resources, total] = await Promise.all([
    db.resource.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.resource.count({ where }),
  ]);

  return NextResponse.json({ resources, total, page, totalPages: Math.ceil(total / pageSize) });
}

// 创建资源（管理员）
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "无权限" }, { status: 403 });
  }

  const data = await req.json();
  const { title, slug, description, content, price, categoryId, tags, fileUrl, fileSize, fileType, coverImage, isPublished } = data;

  if (!title || !categoryId) {
    return NextResponse.json({ message: "标题和分类为必填项" }, { status: 400 });
  }

  const resource = await db.resource.create({
    data: {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      description: description || "",
      content: content || "",
      price: price || 0,
      categoryId,
      tags: tags || "",
      fileUrl: fileUrl || "",
      fileSize: fileSize || "",
      fileType: fileType || "",
      coverImage: coverImage || "",
      isPublished: isPublished || false,
    },
  });

  return NextResponse.json(resource);
}
