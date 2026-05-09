import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "无权限" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ message: "没有文件" }, { status: 400 });
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return NextResponse.json({ message: "文件不能超过100MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "bin";
  const type = formData.get("type") as string; // "cover" or "resource"
  const dir = type === "cover" ? "covers" : "files";
  const filename = `${nanoid(12)}.${ext}`;
  const relativePath = `/uploads/${dir}/${filename}`;
  const absoluteDir = path.join(process.cwd(), "public", "uploads", dir);
  const absolutePath = path.join(absoluteDir, filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  return NextResponse.json({
    url: relativePath,
    size: file.size,
    type: file.type,
    name: file.name,
  });
}
