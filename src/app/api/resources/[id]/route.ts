import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// 获取单个资源
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await db.resource.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!resource) {
    return NextResponse.json({ message: "资源不存在" }, { status: 404 });
  }
  return NextResponse.json(resource);
}

// 更新资源
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  const resource = await db.resource.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      price: data.price,
      categoryId: data.categoryId,
      tags: data.tags,
      fileUrl: data.fileUrl,
      fileSize: data.fileSize,
      fileType: data.fileType,
      coverImage: data.coverImage,
      isPublished: data.isPublished,
    },
  });

  return NextResponse.json(resource);
}

// 删除资源
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  await db.resource.delete({ where: { id } });
  return NextResponse.json({ message: "已删除" });
}
