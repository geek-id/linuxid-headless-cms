# 🚀 Setup Guide - Local Development & Production

Complete guide for setting up and running LinuxID Headless CMS in local development and production environments.

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Text Editor**: VS Code recommended

### **Optional Tools**
- **GitHub Account**: For OAuth authentication
- **Google Cloud Account**: For Google OAuth (optional)
- **Cloudflare Account**: For R2 storage and deployment
- **AWS Account**: Alternative cloud storage

## 🛠️ **Local Development Setup**

### **1. Clone & Install**

```bash
# Clone the repository
git clone https://github.com/your-username/linuxid-headless-cms.git
cd linuxid-headless-cms

# Install dependencies
npm install

# Install additional fonts (if needed)
npm install @next/font
```

### **2. Environment Configuration**

Create your environment file:
```bash
cp .env.example .env.local
```

**Basic Local Configuration (`.env.local`):**
```env
# === REQUIRED FOR LOCAL DEVELOPMENT ===

# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long

# Initial Admin Access
ADMIN_EMAILS=your-email@example.com

# === OPTIONAL FOR LOCAL DEVELOPMENT ===

# Site Configuration
SITE_NAME=LinuxID Headless CMS
SITE_URL=http://localhost:3000

# OAuth Providers (optional for local dev)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloud Storage (optional - file system used if not configured)
STORAGE_PROVIDER=local  # or cloudflare_r2, aws_s3, s3_compatible

# Image Processing
MAX_IMAGE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
IMAGE_QUALITY=85
```

### **3. Start Development Server**

```bash
# Start development server
npm run dev

# Alternative: Start with verbose logging
NODE_ENV=development npm run dev

# Your app will be available at:
# http://localhost:3000
```

### **4. Verify Installation**

Open your browser and check:
- **Homepage**: `http://localhost:3000` ✅
- **Admin Panel**: `http://localhost:3000/admin` ✅
- **API Health**: `http://localhost:3000/api/content/post` ✅
- **Blog**: `http://localhost:3000/posts` ✅
- **Dashboard**: `http://localhost:3000/dashboard` ✅

## 🌐 **Production Deployment**

### **Option 1: Cloudflare Pages (Recommended)**

#### **Step 1: Prepare Repository**
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### **Step 2: Create Cloudflare Pages Project**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or `/headless-cms` if subdirectory)
   - **Node.js version**: `18`

#### **Step 3: Environment Variables**
Add these in Cloudflare Pages → Settings → Environment variables:

**Required Variables:**
```env
# Authentication
NEXTAUTH_URL=https://your-domain.pages.dev
NEXTAUTH_SECRET=your-production-secret-key-min-32-chars
ADMIN_EMAILS=admin@yourdomain.com

# Site Configuration
SITE_NAME=Your Production Site Name
SITE_URL=https://your-domain.pages.dev

# Cloud Storage (choose one)
STORAGE_PROVIDER=cloudflare_r2

# Cloudflare R2 Storage
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.your-domain.com
```

**Optional OAuth Variables:**
```env
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### **Step 4: Deploy**
```bash
# Push to main branch triggers automatic deployment
git push origin main

# Or deploy manually with Wrangler
npm install -g wrangler
npm run build
wrangler pages publish out --project-name=your-project
```

### **Option 2: Vercel**

#### **Quick Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to configure your project
```

#### **Environment Variables in Vercel**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the same variables as Cloudflare Pages configuration above
3. Update `NEXTAUTH_URL` to your Vercel domain

### **Option 3: Netlify**

#### **Deploy via Git**
1. Connect your GitHub repository to Netlify
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node.js version**: `18`

#### **Environment Variables**
Add the same production environment variables in Netlify dashboard.

### **Option 4: Self-Hosted (VPS/Dedicated Server)**

#### **Server Setup**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone and setup
git clone https://github.com/your-username/linuxid-headless-cms.git
cd linuxid-headless-cms
npm install
```

#### **Production Build**
```bash
# Create production environment file
cp .env.example .env.production
# Edit .env.production with your production values

# Build for production
NODE_ENV=production npm run build

# Start with PM2
pm2 start npm --name "linuxid-cms" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### **Nginx Configuration** (optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 **Configuration Reference**

### **Environment Variables**

#### **Authentication (Required)**
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Full URL of your site | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | Random secret for JWT | `random-32-char-string` |
| `ADMIN_EMAILS` | Comma-separated admin emails | `admin@site.com,editor@site.com` |

#### **OAuth Providers (Optional)**
| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GITHUB_ID` | GitHub OAuth App ID | GitHub Developer Settings |
| `GITHUB_SECRET` | GitHub OAuth Secret | GitHub Developer Settings |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Google Cloud Console |

#### **Cloud Storage (Choose One)**
| Provider | Variables Required |
|----------|-------------------|
| **Cloudflare R2** | `CLOUDFLARE_R2_*` |
| **AWS S3** | `AWS_*` |
| **S3-Compatible** | `S3_*` |
| **Local/None** | No variables needed |

### **Directory Structure**
```
linuxid-headless-cms/
├── .config/              # Auto-generated config files
│   ├── site.json         # Site settings
│   └── admin.json        # Admin settings
├── content/              # Markdown content
│   ├── posts/           # Blog posts
│   ├── pages/           # Static pages
│   └── reviews/         # Reviews
├── src/
│   ├── app/             # Next.js app router
│   ├── lib/             # Utilities and configuration
│   └── types/           # TypeScript definitions
├── docs/                # Documentation
├── .env.local           # Local environment variables
├── .env.production      # Production environment variables
└── package.json         # Dependencies and scripts
```

## 🔍 **Health Checks & Monitoring**

### **Application Health**
```bash
# Check if app is running
curl -I http://localhost:3000

# Check API health
curl http://localhost:3000/api/content/post

# Check configuration
curl http://localhost:3000/api/admin/config/site
```

### **Log Monitoring**
```bash
# Development logs
npm run dev

# Production logs (PM2)
pm2 logs linuxid-cms

# System logs
journalctl -u nginx -f  # if using nginx
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Font Errors (Geist not found)**
```bash
# Error: Unknown font 'Geist'
# Solution: Font already fixed in latest version
# If still seeing errors, restart dev server:
npm run dev
```

#### **Build Failures**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

#### **Environment Variables Not Loading**
```bash
# Check file exists
ls -la .env.local

# Check for syntax errors
cat .env.local | grep -v '^#' | grep '='

# Restart development server
npm run dev
```

#### **OAuth Authentication Issues**
1. **Check callback URLs** in OAuth provider settings
2. **Verify environment variables** are correctly set
3. **Ensure NEXTAUTH_URL** matches your domain exactly
4. **Check NEXTAUTH_SECRET** is at least 32 characters

#### **File Upload Issues**
1. **Check cloud storage credentials**
2. **Verify bucket permissions**
3. **Test storage connection**
4. **Check file size limits**

#### **Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### **Performance Optimization**

#### **Local Development**
```bash
# Use faster builds
export NODE_ENV=development
npm run dev

# Enable source maps for debugging
export NEXT_PUBLIC_DEBUG=true
npm run dev
```

#### **Production**
```bash
# Optimize build
export NODE_ENV=production
npm run build

# Enable compression
export COMPRESS=true
npm start

# Monitor performance
export NEXT_PUBLIC_ANALYTICS=true
npm start
```

## 📊 **Scripts Reference**

```bash
# Development
npm run dev          # Start development server
npm run dev:debug    # Start with debugging enabled

# Building
npm run build        # Build for production
npm run build:analyze # Build with bundle analyzer

# Production
npm start            # Start production server
npm run preview      # Preview production build locally

# Quality & Testing
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript validation
npm run test         # Run tests (if configured)

# Utilities
npm run clean        # Clean build artifacts
npm run reset        # Reset node_modules and lockfile
```

## 🚀 **Quick Start Commands**

### **Local Development**
```bash
git clone <your-repo>
cd linuxid-headless-cms
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
# Open http://localhost:3000
```

### **Production Deployment**
```bash
# Cloudflare Pages
git push origin main  # Auto-deploys via GitHub integration

# Manual build & deploy
npm run build
npx wrangler pages publish out

# Self-hosted
npm run build
pm2 start npm --name "cms" -- start
```

---

## 🎉 **You're Ready!**

Your LinuxID Headless CMS is now set up for both local development and production deployment. 

**Need help?** Check our other documentation:
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Detailed CI/CD setup
- [API Documentation](../README.md#api-documentation) - API reference
- [Content Management](../README.md#content-management) - Creating content

**Having issues?** Open an issue on GitHub or check our troubleshooting section above. 