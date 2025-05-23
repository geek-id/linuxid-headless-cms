# 🏃‍♂️ Running Guide - LinuxID Headless CMS

Complete instructions for running LinuxID Headless CMS in local development and production environments.

## 🚀 **Quick Start (Local Development)**

### **1. First Time Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/linuxid-headless-cms.git
cd linuxid-headless-cms

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local with minimal required settings:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-32-chars-minimum
# ADMIN_EMAILS=your-email@example.com

# Verify your setup
npm run verify

# Start development server
npm run dev
```

**✅ Your CMS will be available at: `http://localhost:3000`**

### **2. Daily Development**
```bash
# Start development server
npm run dev

# Run in background (optional)
npm run dev > dev.log 2>&1 &

# Stop development server
# Ctrl+C or kill the process
```

## 🌐 **Access Your CMS**

### **Public Pages**
- **🏠 Homepage**: `http://localhost:3000`
- **📝 Blog**: `http://localhost:3000/posts`
- **⭐ Reviews**: `http://localhost:3000/reviews`  
- **📊 Dashboard**: `http://localhost:3000/dashboard`

### **Admin Panel**
- **⚙️ Admin**: `http://localhost:3000/admin`
- **📤 Upload**: `http://localhost:3000/admin/upload`
- **🔧 Settings**: `http://localhost:3000/admin/settings`

### **API Endpoints**
- **📄 Content API**: `http://localhost:3000/api/content/post`
- **🔍 Search API**: `http://localhost:3000/api/search?q=term`
- **🔐 Auth API**: `http://localhost:3000/api/auth/signin`

## ⚙️ **Environment Configuration**

### **Minimal Local Setup (.env.local)**
```env
# Required for local development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
ADMIN_EMAILS=your-email@example.com

# Optional for enhanced features
SITE_NAME=My Awesome CMS
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-app-secret
```

### **Full Configuration (Production Ready)**
```env
# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production-secret-key-32-chars-minimum
ADMIN_EMAILS=admin@yourdomain.com,editor@yourdomain.com

# OAuth Providers
GITHUB_ID=github-oauth-app-id
GITHUB_SECRET=github-oauth-secret
GOOGLE_CLIENT_ID=google-oauth-client-id
GOOGLE_CLIENT_SECRET=google-oauth-secret

# Site Configuration
SITE_NAME=Your Site Name
SITE_URL=https://your-domain.com

# Cloud Storage (Cloudflare R2 - Recommended)
STORAGE_PROVIDER=cloudflare_r2
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.your-domain.com

# Image Processing
MAX_IMAGE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
IMAGE_QUALITY=85
```

## 🌐 **Production Deployment**

### **Option 1: Cloudflare Pages (Recommended)**

#### **Automatic Deployment**
1. **Push to GitHub**: `git push origin main`
2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pages → Create a project → Connect GitHub
   - Build settings: `npm run build`, output: `out`
3. **Add Environment Variables** in Cloudflare dashboard
4. **Deploy**: Automatic on every push

#### **Manual Deployment**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Build and deploy
npm run build
wrangler pages publish out --project-name=your-project
```

### **Option 2: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to configure
```

### **Option 3: Self-Hosted**
```bash
# Server setup
npm install -g pm2
npm run build

# Start with PM2
pm2 start npm --name "linuxid-cms" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🛠️ **Development Commands**

### **Basic Commands**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run verify       # Verify setup
npm run setup        # Install + verify in one command
```

### **Quality & Testing**
```bash
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript validation
```

### **Utilities**
```bash
npm run clean        # Clean build cache
npm run reset        # Reset dependencies
npm run preview      # Build + start locally
npm run dev:debug    # Development with debugger
```

## 🔍 **API Usage Examples**

### **Get All Blog Posts**
```bash
curl http://localhost:3000/api/content/post

# With pagination
curl "http://localhost:3000/api/content/post?page=1&limit=5"

# Filter by category
curl "http://localhost:3000/api/content/post?category=tutorial"
```

### **Search Content**
```bash
curl "http://localhost:3000/api/search?q=nextjs"
```

### **Upload Image (with authentication)**
```bash
curl -X POST \
  -H "Cookie: next-auth.session-token=your-session" \
  -F "file=@image.jpg" \
  http://localhost:3000/api/upload/image
```

## 📁 **Content Management**

### **Adding Content**
1. **Via Admin Panel**: `http://localhost:3000/admin`
2. **Direct File Creation**: 
   - Blog posts: `content/posts/my-post.md`
   - Pages: `content/pages/my-page.md`
   - Reviews: `content/reviews/my-review.md`

### **Content Format**
```markdown
---
title: "My Blog Post"
slug: "my-blog-post"
excerpt: "Brief description"
published: true
featured: false
category: "Tutorial"
tags: ["nextjs", "cms"]
author:
  name: "Your Name"
  email: "you@example.com"
---

# Your Content Here

Write your content in Markdown format.
```

## 🐛 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### **2. Font Errors (Fixed)**
```bash
# Error: Unknown font 'Geist'
# Solution: Already fixed with Inter font
npm run dev  # Just restart
```

#### **3. Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### **4. Environment Variables Not Loading**
```bash
# Check file exists and has content
ls -la .env.local
cat .env.local

# Restart development server
npm run dev
```

#### **5. OAuth Authentication Issues**
- Check callback URLs in GitHub/Google settings
- Ensure `NEXTAUTH_URL` matches your domain exactly
- Verify `NEXTAUTH_SECRET` is at least 32 characters

### **Health Checks**
```bash
# Check if app is running
curl -I http://localhost:3000

# Check API endpoints
curl http://localhost:3000/api/content/post

# Verify build output
npm run build && ls -la out/
```

## 📊 **Performance Tips**

### **Local Development**
```bash
# Faster development builds
export NODE_ENV=development
npm run dev

# Enable debugging
npm run dev:debug
```

### **Production Optimization**
```bash
# Optimized production build
export NODE_ENV=production
npm run build

# Analyze bundle size
npm run build:analyze
```

## 🔧 **Configuration Files**

### **Auto-Generated (No editing needed)**
- `.config/site.json` - Site settings
- `.config/admin.json` - Admin configuration

### **Manual Configuration**
- `.env.local` - Local environment variables
- `content/` - Markdown content files
- `tailwind.config.ts` - Styling configuration

## 📚 **Next Steps**

### **After Setup**
1. **Create Content**: Visit `/admin` to create your first blog post
2. **Configure OAuth**: Set up GitHub/Google authentication
3. **Setup Cloud Storage**: Configure image upload provider
4. **Customize Design**: Modify Tailwind configuration
5. **Deploy to Production**: Follow deployment guide

### **Learn More**
- **[Setup Guide](./SETUP-GUIDE.md)** - Detailed setup instructions
- **[Deployment Guide](./DEPLOYMENT-GUIDE.md)** - Production deployment
- **[Quick Reference](./QUICK-REFERENCE.md)** - Command cheat sheet
- **[Main README](../README.md)** - Complete documentation

---

## 🎉 **You're All Set!**

Your LinuxID Headless CMS is ready to use! 

**🚀 Start developing**: `npm run dev`  
**🌐 Open browser**: `http://localhost:3000`  
**⚙️ Admin panel**: `http://localhost:3000/admin`

**Need help?** Check the troubleshooting section above or open an issue on GitHub. 