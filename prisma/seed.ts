import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

async function main() {
  const adapter = new PrismaLibSql({ url: "file:./prisma/dev.db" });
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ziyuanzhan.com" },
    update: {},
    create: {
      email: "admin@ziyuanzhan.com",
      password: adminPassword,
      name: "管理员",
      role: "ADMIN",
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash("test123", 10);
  await prisma.user.upsert({
    where: { email: "test@ziyuanzhan.com" },
    update: {},
    create: {
      email: "test@ziyuanzhan.com",
      password: userPassword,
      name: "测试用户",
      role: "USER",
    },
  });

  // Create categories
  const categories = [
    { name: "教程课程", slug: "jiaocheng", description: "编程、设计、办公等各类教程资源", icon: "📚", sortOrder: 1 },
    { name: "模板素材", slug: "muban", description: "PPT模板、简历模板、设计模板等", icon: "📋", sortOrder: 2 },
    { name: "软件工具", slug: "ruanjian", description: "实用软件、效率工具、插件扩展", icon: "🛠️", sortOrder: 3 },
    { name: "设计素材", slug: "sucai", description: "PSD源文件、图标、字体、配色方案", icon: "🎨", sortOrder: 4 },
    { name: "电子书库", slug: "ebook", description: "技术书籍、电子杂志、学习资料", icon: "📖", sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create sample resources
  const resources = [
    {
      title: "2024最新前端面试题合集",
      slug: "qianduan-mianshi-2024",
      description: "涵盖HTML/CSS/JS/React/Vue/算法等全套前端面试题，附详细答案解析。",
      content: `## 内容简介\n\n本资源包含最新前端面试题合集，涵盖以下模块：\n\n### HTML & CSS\n- 盒模型与BFC\n- Flexbox与Grid布局\n- 响应式设计原理\n- CSS动画与性能优化\n\n### JavaScript\n- 闭包、作用域链\n- 原型与继承\n- 事件循环（Event Loop）\n- Promise/async/await\n- ES6+新特性\n\n### React\n- 虚拟DOM原理\n- Hooks深入理解\n- 状态管理方案对比\n- 性能优化技巧\n\n### 算法\n- 常见排序算法\n- 链表/树/图\n- 动态规划入门\n\n> 共200+题目，每题附带详细解答和代码示例。`,
      price: 19.9,
      coverImage: "",
      fileUrl: "/uploads/files/interview-qa.pdf",
      fileSize: "8.5 MB",
      fileType: "PDF",
      categorySlug: "jiaocheng",
      tags: "前端,面试,JavaScript,React",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "50套精美PPT商务模板",
      slug: "ppt-shangwu-muban-50",
      description: "精选50套高端商务PPT模板，适合职场汇报、项目路演、商业计划书等场景。",
      content: `## 模板说明\n\n50套精美商务PPT模板，包含以下风格：\n\n### 风格分类\n- 极简商务风（15套）\n- 科技互联网风（12套）\n- 创意设计风（10套）\n- 教育培训风（8套）\n- 年终总结专用（5套）\n\n### 格式信息\n- 文件格式：PPTX\n- 兼容版本：Office 2016及以上 / WPS\n- 全部可编辑，支持一键换色\n\n### 使用场景\n- 工作汇报 / 年终总结\n- 项目路演 / 商业计划书\n- 产品发布 / 公司介绍\n- 培训课件 / 教学演示`,
      price: 29.9,
      coverImage: "/uploads/covers/ppt-template.jpg",
      fileUrl: "/uploads/files/ppt-templates.zip",
      fileSize: "256 MB",
      fileType: "ZIP",
      categorySlug: "muban",
      tags: "PPT,模板,商务,汇报",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "VS Code高效开发配置包",
      slug: "vscode-config-pack",
      description: "精选插件配置、快捷键大全、主题配色方案，让编辑器效率翻倍。",
      content: `## 包含内容\n\n### 插件推荐清单\n- 必装插件TOP 20（附配置）\n- 语言专用插件（Python/Go/Rust）\n- 效率增强插件\n\n### 配置文件\n- settings.json 优化配置\n- keybindings.json 快捷键绑定\n- 代码片段（snippets）合集\n\n### 主题配色\n- 5款护眼配色方案\n- 字体推荐与配置`,
      price: 9.9,
      coverImage: "/uploads/covers/vscode.jpg",
      fileUrl: "/uploads/files/vscode-config.zip",
      fileSize: "2.3 MB",
      fileType: "ZIP",
      categorySlug: "ruanjian",
      tags: "VSCode,编辑器,插件,配置",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "扁平化图标合集5000+",
      slug: "flat-icons-5000",
      description: "5000+扁平化风格图标，包含SVG/PNG/AI多种格式，商用授权。",
      content: `## 图标合集\n\n### 包含类别\n- 商务办公类（800+）\n- 社交媒体类（600+）\n- 科技数码类（700+）\n- 生活出行类（500+）\n- 美食餐饮类（400+）\n- 医疗健康类（300+）\n- 教育学习类（400+）\n- 其他分类（1300+）\n\n### 文件格式\n- SVG（矢量可缩放）\n- PNG 512px（透明背景）\n- AI 源文件\n\n### 授权说明\n- 个人项目：免费使用\n- 商业项目：免费使用\n- 无需署名`,
      price: 0,
      coverImage: "/uploads/covers/icons.jpg",
      fileUrl: "/uploads/files/flat-icons.zip",
      fileSize: "180 MB",
      fileType: "ZIP",
      categorySlug: "sucai",
      tags: "图标,扁平化,UI,设计",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Python自动化办公实战教程",
      slug: "python-auto-office",
      description: "从零学会用Python处理Excel/Word/PDF/邮件，大幅提升办公效率。",
      content: `## 课程大纲\n\n### 第一章：环境搭建\n- Python安装与IDE配置\n- 虚拟环境与包管理\n- Jupyter Notebook使用\n\n### 第二章：Excel自动化\n- openpyxl读写Excel\n- pandas数据处理\n- 自动化报表生成\n\n### 第三章：Word自动化\n- python-docx操作Word文档\n- 批量生成合同/通知书\n- 邮件合并功能\n\n### 第四章：PDF处理\n- PDF读取与提取\n- PDF生成与合并\n- 表单填写自动化\n\n### 第五章：综合实战\n- 日报自动生成系统\n- 批量文件重命名工具\n- 数据采集与报表输出`,
      price: 39.9,
      coverImage: "/uploads/covers/python-office.jpg",
      fileUrl: "/uploads/files/python-office.zip",
      fileSize: "1.2 GB",
      fileType: "ZIP",
      categorySlug: "jiaocheng",
      tags: "Python,自动化,办公,教程",
      isPublished: true,
      isFeatured: false,
    },
    {
      title: "程序员简历模板20套",
      slug: "coder-resume-20",
      description: "专为程序员设计的简历模板，包含LaTeX/Word/HTML三种格式。",
      content: `## 简历模板\n\n专为技术岗位设计的简历模板：\n\n### 岗位针对性设计\n- 前端开发（4套）\n- 后端开发（4套）\n- 算法工程师（3套）\n- 全栈开发（3套）\n- DevOps（3套）\n- 应届生通用（3套）\n\n### 格式说明\n- LaTeX格式：学术风格，代码高亮\n- Word格式：兼容性好，HR友好\n- HTML格式：可直接部署为在线简历`,
      price: 0,
      coverImage: "/uploads/covers/resume.jpg",
      fileUrl: "/uploads/files/coder-resume.zip",
      fileSize: "45 MB",
      fileType: "ZIP",
      categorySlug: "muban",
      tags: "简历,程序员,求职,模板",
      isPublished: true,
      isFeatured: false,
    },
    {
      title: "2024年Java高级编程指南",
      slug: "java-advanced-2024",
      description: "深入理解JVM、并发编程、Spring框架原理，进阶Java高手。",
      content: `## 内容概要\n\n### JVM深度解析\n- 内存模型与垃圾回收\n- 类加载机制\n- JVM调优实战\n\n### 并发编程\n- synchronized与Lock\n- 线程池原理与实践\n- JUC工具类详解\n\n### Spring框架\n- IoC容器原理\n- AOP实现机制\n- Spring Boot自动配置\n- 微服务架构设计\n\n> 适合2年以上Java开发经验者阅读。`,
      price: 24.9,
      coverImage: "/uploads/covers/java.jpg",
      fileUrl: "/uploads/files/java-advanced.pdf",
      fileSize: "15 MB",
      fileType: "PDF",
      categorySlug: "ebook",
      tags: "Java,JVM,Spring,并发",
      isPublished: true,
      isFeatured: false,
    },
    {
      title: "UI设计配色终极指南",
      slug: "ui-color-guide",
      description: "系统学习配色理论，附赠200+配色方案文件，可直接用于设计项目。",
      content: `## 配色指南\n\n### 理论基础\n- 色彩心理学\n- 色轮与配色规则\n- 对比度与可访问性\n\n### 实战技巧\n- 品牌色选择策略\n- Dark Mode配色方案\n- 数据可视化配色\n\n### 附赠资源\n- 200+配色方案（.colors文件）\n- Sketch/Figma色板文件\n- 渐变配色合集`,
      price: 15.9,
      coverImage: "/uploads/covers/color-guide.jpg",
      fileUrl: "/uploads/files/color-guide.zip",
      fileSize: "32 MB",
      fileType: "ZIP",
      categorySlug: "sucai",
      tags: "配色,UI设计,色彩,设计",
      isPublished: true,
      isFeatured: false,
    },
  ];

  for (const r of resources) {
    const category = await prisma.category.findUnique({ where: { slug: r.categorySlug } });
    if (!category) continue;

    const { categorySlug, ...data } = r;
    await prisma.resource.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, categoryId: category.id },
    });
  }

  // Create ad slots
  const adSlots = [
    { position: "home-banner", name: "首页横幅广告" },
    { position: "home-sidebar-top", name: "首页侧边栏顶部" },
    { position: "home-sidebar-bottom", name: "首页侧边栏底部" },
    { position: "content-top", name: "内容页顶部" },
    { position: "content-inline", name: "内容页文中" },
    { position: "content-bottom", name: "内容页底部" },
    { position: "content-sidebar", name: "内容页侧边栏" },
    { position: "download-interstitial", name: "下载页插屏" },
    { position: "list-inline", name: "列表页文中" },
  ];

  for (const slot of adSlots) {
    await prisma.adSlot.upsert({
      where: { position: slot.position },
      update: {},
      create: slot,
    });
  }

  // Create default site settings
  const settings = [
    { key: "siteName", value: "资源栈" },
    { key: "siteDescription", value: "优质数字资源分享平台，教程、模板、软件、素材一站收录" },
    { key: "seoKeywords", value: "资源下载,教程,模板,软件,素材,PPT模板,编程教程" },
    { key: "logoUrl", value: "" },
    { key: "footerText", value: "© 2024 资源栈 ZiyuanZhan. All rights reserved." },
    { key: "aboutContent", value: "资源栈是一个综合数字资源分享平台，致力于为用户提供优质的教程、模板、软件工具和设计素材。" },
    { key: "contactEmail", value: "admin@ziyuanzhan.com" },
    { key: "paymentEnabled", value: "true" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("Seed complete!");
  console.log("Admin: admin@ziyuanzhan.com / admin123");
  console.log("User: test@ziyuanzhan.com / test123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
