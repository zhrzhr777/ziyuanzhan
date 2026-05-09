import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">📦 资源栈</h3>
            <p className="text-sm text-muted-foreground">
              优质数字资源分享平台，教程、模板、软件、素材一站收录。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/resources" className="hover:text-primary">全部资源</Link></li>
              <li><Link href="/categories" className="hover:text-primary">资源分类</Link></li>
              <li><Link href="/search" className="hover:text-primary">搜索资源</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">关于我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>联系邮箱：admin@ziyuanzhan.com</li>
              <li>ICP备案号：待备案</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 资源栈 ZiyuanZhan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
