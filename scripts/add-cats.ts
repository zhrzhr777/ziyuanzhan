import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

async function main() {
  const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" })
  const prisma = new PrismaClient({ adapter })
  
  const cats = [
    { name: "学习资料", slug: "xuexiziliao", description: "考试资料、课程笔记、学霸整理、学习工具合集", icon: "📝", sortOrder: 6 },
    { name: "技术资讯", slug: "jishuzixun", description: "技术日报、行业报告、开发者周报、热点解读", icon: "📰", sortOrder: 7 },
    { name: "免费专区", slug: "mianfei", description: "完全免费的优质资源，无需付费即可下载使用", icon: "🎁", sortOrder: 0 },
  ]
  for (const cat of cats) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
    console.log("已创建:", cat.name)
  }
  console.log("分类总数:", await prisma.category.count())
  process.exit(0)
}
main()
