/**
 * CSV 批量导入资源脚本
 *
 * 用法: npx tsx scripts/import-csv.ts resources.csv
 *
 * CSV 格式（逗号分隔，UTF-8编码）：
 *   标题,简介,分类slug,价格,标签,文件链接,文件大小,文件类型
 *
 * 示例 CSV:
 *   "Python入门教程","适合零基础的Python教程","jiaocheng",0,"Python,教程","https://example.com/file.zip","500 MB","ZIP"
 *   "50套简历模板","精选50套简历模板","muban",19.9,"简历,模板","https://example.com/resume.zip","25 MB","ZIP"
 *
 * 分类 slug 对照:
 *   jiaocheng = 教程课程
 *   muban = 模板素材
 *   ruanjian = 软件工具
 *   sucai = 设计素材
 *   ebook = 电子书库
 */

import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const DB_URL = "file:./prisma/dev.db";

const CSV_HEADERS = ["标题", "简介", "分类slug", "价格", "标签", "文件链接", "文件大小", "文件类型"];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function generateContent(title: string, description: string): string {
  return `## ${title}\n\n${description}\n\n### 资源说明\n- 格式：见文件信息\n- 下载方式：点击下方链接下载\n- 如遇问题请联系管理员\n`;
}

async function main() {
  const csvFile = process.argv[2];
  if (!csvFile) {
    console.log("用法: npx tsx scripts/import-csv.ts <CSV文件路径>");
    console.log("\nCSV格式（UTF-8，逗号分隔）:");
    console.log(`  ${CSV_HEADERS.join(",")}`);
    console.log("\n分类 slug: jiaocheng, muban, ruanjian, sucai, ebook");
    process.exit(1);
  }

  const filePath = path.resolve(csvFile);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    console.log("❌ CSV文件至少需要标题行和一行数据");
    process.exit(1);
  }

  // 解析标题行
  const headerLine = parseCSVLine(lines[0]);
  console.log(`📋 CSV标题: ${headerLine.join(" | ")}`);

  const adapter = new PrismaLibSql({ url: DB_URL });
  const prisma = new PrismaClient({ adapter });

  // 预加载分类
  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));

  let imported = 0;
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < 3) continue;

    const [title, description, catSlug, priceStr, tags, fileUrl, fileSize, fileType] = fields;
    if (!title) continue;

    const categoryId = catMap.get(catSlug?.trim());
    if (!categoryId) {
      console.log(`  ⚠ 第${i + 1}行: 分类 "${catSlug}" 不存在，跳过`);
      skipped++;
      continue;
    }

    const slug = generateSlug(title.trim());

    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) {
      console.log(`  ⏭ 第${i + 1}行: "${title}" 已存在`);
      skipped++;
      continue;
    }

    await prisma.resource.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || "",
        content: generateContent(title.trim(), description?.trim() || ""),
        price: parseFloat(priceStr || "0"),
        categoryId,
        tags: tags?.trim() || "",
        fileUrl: fileUrl?.trim() || "",
        fileSize: fileSize?.trim() || "",
        fileType: fileType?.trim() || "",
        isPublished: true,
        coverImage: "",
      },
    });

    console.log(`  ✅ 已导入: ${title.trim()}`);
    imported++;
  }

  console.log(`\n📊 导入完成: 新增 ${imported} 个, 跳过 ${skipped} 个`);
  process.exit(0);
}

main().catch(console.error);
