# 资源栈 - 部署指南

## 方案一：Vercel 免费部署（推荐，零成本）

Vercel 免费托管 Next.js，自带 SSL 证书和全球 CDN。

### 步骤

1. **注册 Vercel**
   访问 [vercel.com](https://vercel.com)，用 GitHub 账号注册

2. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "资源栈 v1.0"
   git remote add origin https://github.com/你的用户名/ziyuanzhan.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - Framework 选择 Next.js
   - 添加环境变量（见下方）
   - 点击 Deploy

4. **环境变量设置**
   在 Vercel 项目 Settings → Environment Variables 添加：
   ```
   DATABASE_URL        file:./prisma/dev.db
   NEXTAUTH_SECRET     随机生成一串字符（用密码生成器）
   NEXTAUTH_URL        https://你的域名.vercel.app
   MOCK_PAYMENT        true
   ```

5. **绑定域名（可选，但推荐）**
   - Vercel 给的 .vercel.app 域名国内可能打不开
   - 建议绑定自己的域名（Settings → Domains）
   - 买了域名后在 DNS 添加 CNAME 记录指向 cname.vercel-dns.com
   - 绑定后 Vercel 自动配置 SSL 证书

### 限制
- 免费版每月 100GB 带宽
- 服务端函数执行 10 秒超时
- 数据库用 SQLite，Vercel 重启后会丢失新数据（用 Turso 云数据库可解决，也有免费额度）

---

## 方案二：香港轻量服务器（24元/月）

### 1. 购买服务器
- 腾讯云/阿里云 香港轻量应用服务器
- 系统选 Ubuntu 22.04

### 2. 连接服务器
```bash
ssh root@你的服务器IP
```

### 3. 安装环境
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# 安装 PM2
npm install -g pm2
```

### 4. 部署代码
```bash
# 克隆代码（把代码先推送到 GitHub）
git clone https://github.com/你的用户名/ziyuanzhan.git
cd ziyuanzhan

# 安装依赖
npm install

# 初始化数据库
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 构建生产版本
npm run build

# 用 PM2 启动
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. 配置 Nginx
```bash
# 编辑 nginx.conf，替换域名
sudo cp nginx.conf /etc/nginx/sites-available/ziyuanzhan
sudo sed -i 's/YOUR_DOMAIN/你的域名.com/g' /etc/nginx/sites-available/ziyuanzhan
sudo ln -s /etc/nginx/sites-available/ziyuanzhan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. 配置 SSL
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名.com
```

---

## 方案三：Cloudflare Pages + Workers（免费）

适合纯静态 + API 分离的场景。需要改造代码，暂不推荐新手使用。

---

## 省钱建议

| 阶段 | 方案 | 月成本 |
|------|------|--------|
| 起步 | Vercel 免费 + 自己的域名 | ~5元/月（仅域名成本） |
| 有流量后 | 香港轻量服务器 | ~24元/月 |
| 有收入后 | 国内服务器 + CDN | ~100元/月 |

## 注册 PayJS（支付）
1. 访问 [payjs.cn](https://payjs.cn)
2. 注册账号，实名认证
3. 获取商户号（MCHID）和密钥（KEY）
4. 填入 `.env.production`：
   ```
   MOCK_PAYMENT=false
   PAYJS_MCHID=你的商户号
   PAYJS_KEY=你的密钥
   ```
