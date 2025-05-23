# ⚡ Quick Reference - LinuxID Headless CMS

## 🚀 **Local Development**

### **First Time Setup**
```bash
git clone <your-repo>
cd linuxid-headless-cms
npm install
cp .env.example .env.local
npm run dev
```

### **Daily Development**
```bash
# Start development server
npm run dev
# → http://localhost:3000

# Build for testing
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Environment Variables (Minimal)**
```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars
ADMIN_EMAILS=your-email@example.com
```

## 🌐 **Production Deployment**

### **Cloudflare Pages (Recommended)**
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo to Cloudflare Pages
# 3. Set build settings:
# - Command: npm run build
# - Output: out
# - Node: 18

# 4. Add environment variables in dashboard
```

### **Manual Deploy**
```bash
# Build and deploy
npm run build
npx wrangler pages publish out
```

### **Self-Hosted**
```bash
# Server setup
npm install -g pm2
npm run build
pm2 start npm --name "cms" -- start
```

## 🔗 **Important URLs**

### **Local Development**
- **Homepage**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
- **Blog**: `http://localhost:3000/posts`
- **Dashboard**: `http://localhost:3000/dashboard`
- **API**: `http://localhost:3000/api/content/post`

### **API Endpoints**
```bash
# Content
GET /api/content/post        # All posts
GET /api/content/post/slug   # Single post
GET /api/content/review      # All reviews
GET /api/search?q=term       # Search

# Admin (auth required)
GET /api/admin/config/site   # Site config
POST /api/upload/image       # Upload image
```

## 🛠️ **Troubleshooting**

### **Common Issues**
```bash
# Port in use
lsof -i :3000
kill -9 <PID>

# Clear cache
rm -rf .next node_modules
npm install

# Font errors (fixed)
npm run dev  # Just restart

# Environment not loading
ls -la .env.local
npm run dev
```

### **Health Checks**
```bash
# App running?
curl -I http://localhost:3000

# API working?
curl http://localhost:3000/api/content/post

# Build successful?
npm run build && ls -la out/
```

## 📁 **File Structure**
```
headless-cms/
├── src/app/page.tsx          # Homepage
├── src/app/posts/            # Blog pages
├── src/app/admin/            # Admin panel
├── src/app/api/              # API routes
├── content/posts/            # Blog content
├── .env.local               # Environment vars
└── docs/                    # Documentation
```

## 🔧 **Configuration Files**

### **Auto-Generated**
- `.config/site.json` - Site settings
- `.config/admin.json` - Admin settings

### **Manual**
- `.env.local` - Local environment
- `.env.production` - Production environment

## 📦 **Package Scripts**
| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | Code linting |
| `npm run type-check` | TypeScript validation |

## 🚀 **Production Environment Variables**
```env
# Required
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production-secret
ADMIN_EMAILS=admin@yourdomain.com

# OAuth (optional)
GITHUB_ID=github-app-id
GITHUB_SECRET=github-secret

# Storage (choose one)
STORAGE_PROVIDER=cloudflare_r2
CLOUDFLARE_R2_ACCOUNT_ID=account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=secret-key
CLOUDFLARE_R2_BUCKET_NAME=bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://bucket.domain.com
```

---

**🎯 Need detailed guides?**
- [Complete Setup Guide](./SETUP-GUIDE.md)
- [Deployment Guide](./DEPLOYMENT-GUIDE.md)
- [Main Documentation](../README.md) 