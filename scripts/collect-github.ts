/**
 * GitHub 自动资源采集脚本
 *
 * 用法:
 *   npx tsx scripts/collect-github.ts              # 采集所有分类
 *   npx tsx scripts/collect-github.ts --dry-run    # 仅预览，不入库
 *   npx tsx scripts/collect-github.ts --topic=ai   # 指定搜索主题
 *
 * 无需 GitHub Token，公开API限制60次/小时
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const DB_URL = "file:./prisma/dev.db";
const DRY_RUN = process.argv.includes("--dry-run");

// 搜索配置：按分类对应 GitHub 搜索关键词
const SEARCH_CONFIG: { categorySlug: string; topics: string[]; price: number }[] = [
  {
    categorySlug: "ruanjian",
    topics: ["developer-tools", "productivity-tools", "open-source-tools", "windows-tools"],
    price: 0,
  },
  {
    categorySlug: "jiaocheng",
    topics: ["awesome-list", "tutorial", "learn-programming", "coding-interview"],
    price: 0,
  },
  {
    categorySlug: "sucai",
    topics: ["design-resources", "icons", "fonts", "color-palette"],
    price: 0,
  },
  {
    categorySlug: "muban",
    topics: ["website-templates", "resume-template", "boilerplate", "starter-kit"],
    price: 0,
  },
  {
    categorySlug: "ebook",
    topics: ["free-programming-books", "cheatsheet", "documentation", "knowledge-base"],
    price: 0,
  },
  {
    categorySlug: "xuexiziliao",
    topics: [
      "exam-preparation", "interview-preparation", "study-notes", "computer-science-notes",
      "algorithm-visualization", "leetcode-solutions", "course-materials", "open-courses",
      "machine-learning-tutorials", "deep-learning-tutorials", "web-development-course",
      "python-tutorial", "java-tutorial", "golang-tutorial", "rust-tutorial",
      "data-structures", "operating-system", "computer-network", "database-tutorial",
    ],
    price: 0,
  },
  {
    categorySlug: "jishuzixun",
    topics: [
      "weekly", "tech-news", "developer-news", "changelog", "awesome-newsletters",
      "tech-blog", "devops-trends", "frontend-trends", "ai-news", "open-source-news",
    ],
    price: 0,
  },
];

interface Repo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

function httpGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const { get } = require("https");
    get(url, { headers: { "User-Agent": "ziyuanzhan-collector", Accept: "application/vnd.github.v3+json" } }, (res: any) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function searchGitHub(topic: string): Promise<Repo[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(topic)}+stars:>50&sort=stars&order=desc&per_page=5`;
  console.log(`  搜索: ${topic}`);

  try {
    const body = await httpGet(url);
    const data = JSON.parse(body);
    return data.items || [];
  } catch (e) {
    console.log(`  ⚠ 网络错误: ${e}`);
    return [];
  }
}

function generateMarkdown(repo: Repo): string {
  const topicTags = repo.topics?.slice(0, 5).join("、") || "";
  return `## ${repo.name}

### 项目简介
${repo.description || "优秀的开源项目"}

### 项目信息
- ⭐ Stars: ${repo.stargazers_count.toLocaleString()}
- 🔧 语言: ${repo.language || "多语言"}
- 📅 最近更新: ${repo.updated_at?.split("T")[0] || "未知"}
- 🏷 标签: ${topicTags || "无"}

### 项目地址
[GitHub - ${repo.full_name}](${repo.html_url})

### 使用说明
1. 访问项目 GitHub 页面
2. 按照 README 文档安装使用
3. 可 Fork 项目进行二次开发

> 本资源为开源项目整理，遵守项目原始开源协议。
`;
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pickFileInfo(language: string | null) {
  if (!language) return { fileType: "多格式", fileSize: "不定" };
  const map: Record<string, { fileType: string; fileSize: string }> = {
    TypeScript: { fileType: "TS源码", fileSize: "~5 MB" },
    JavaScript: { fileType: "JS源码", fileSize: "~3 MB" },
    Python: { fileType: "Python源码", fileSize: "~4 MB" },
    Rust: { fileType: "Rust源码", fileSize: "~8 MB" },
    Go: { fileType: "Go源码", fileSize: "~6 MB" },
    Java: { fileType: "Java源码", fileSize: "~10 MB" },
    HTML: { fileType: "Web源码", fileSize: "~2 MB" },
    CSS: { fileType: "样式文件", fileSize: "~1 MB" },
  };
  return map[language] || { fileType: "源码包", fileSize: "~5 MB" };
}

async function main() {
  console.log("🚀 GitHub 资源自动采集器\n");
  console.log(`模式: ${DRY_RUN ? "预览模式（不入库）" : "正常模式"}\n`);

  const adapter = new PrismaLibSql({ url: DB_URL });
  const prisma = new PrismaClient({ adapter });

  let totalCollected = 0;
  let totalSkipped = 0;

  for (const config of SEARCH_CONFIG) {
    // 查找分类
    const category = await prisma.category.findUnique({
      where: { slug: config.categorySlug },
    });
    if (!category) {
      console.log(`⚠ 分类 ${config.categorySlug} 不存在，跳过`);
      continue;
    }

    console.log(`\n📂 分类: ${category.name}`);

    for (const topic of config.topics) {
      // 检查限流
      await new Promise((r) => setTimeout(r, 2000));

      const repos = await searchGitHub(topic);

      for (const repo of repos) {
        const slug = generateSlug(repo.name);
        if (slug.length < 2) continue;

        // 检查是否已存在
        const existing = await prisma.resource.findUnique({ where: { slug } });
        if (existing) {
          console.log(`  ⏭ 已存在: ${repo.name}`);
          totalSkipped++;
          continue;
        }

        const { fileType, fileSize } = pickFileInfo(repo.language);

        if (DRY_RUN) {
          console.log(`  📋 [预览] ${repo.name} (⭐${repo.stargazers_count}) → ￥${config.price}`);
          totalCollected++;
          continue;
        }

        await prisma.resource.create({
          data: {
            title: repo.name,
            slug,
            description: repo.description || `${repo.name} - 优秀的开源项目`,
            content: generateMarkdown(repo),
            price: config.price,
            categoryId: category.id,
            tags: repo.topics?.slice(0, 5).join(",") || "",
            fileUrl: repo.html_url,
            fileSize,
            fileType,
            isPublished: true,
            isFeatured: repo.stargazers_count > 1000,
            coverImage: "",
          },
        });

        console.log(`  ✅ 已添加: ${repo.name} (⭐${repo.stargazers_count})`);
        totalCollected++;
      }
    }
  }

  console.log(`\n📊 采集完成: 新增 ${totalCollected} 个, 跳过 ${totalSkipped} 个`);
  if (DRY_RUN) console.log("💡 预览模式，未实际写入。去掉 --dry-run 参数可入库。");
  process.exit(0);
}

main().catch(console.error);
