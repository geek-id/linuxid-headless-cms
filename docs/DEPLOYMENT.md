# 🚀 Deployment Guide

## Overview

LinuxID Pure Static Site Generator uses GitHub Actions for automated deployment to Cloudflare Pages (or any static hosting platform). The CI/CD pipeline is optimized for pure static sites with zero server requirements.

## 📋 **Required Repository Secrets**

### **🌐 Basic Site Configuration**

| Secret Name | Description | Example | Required |
|-------------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_NAME` | Site name/title | `LinuxID` | ✅ |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | SEO description | `Modern static site...` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Production URL | `https://linux-id.net` | ✅ |

### **🔍 SEO & Social Media**

| Secret Name | Description | Example | Required |
|-------------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_KEYWORDS` | SEO keywords | `nextjs,blog,reviews` | ✅ |
| `NEXT_PUBLIC_SITE_AUTHOR` | Content author | `LinuxID Team` | ✅ |
| `NEXT_PUBLIC_SITE_EMAIL` | Contact email | `hello@linux-id.net` | ✅ |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Twitter username | `@linuxid` | ❌ |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub repo URL | `https://github.com/...` | ❌ |

### **📊 Analytics (Optional)**

| Secret Name | Description | Example | Required |
|-------------|-------------|---------|----------|
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics | `G-XXXXXXXXXX` | ❌ |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible domain | `yourdomain.com` | ❌ |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google verification | `abc123...` | ❌ |

### **☁️ Cloudflare Pages Deployment**

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | ✅ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | ✅ |
| `CLOUDFLARE_PROJECT_NAME` | Project name (default: `linuxid-static-site`) | ❌ |

## 🔧 **Setup Instructions**

### **1. Configure Repository Secrets**

In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the required secrets listed above

**Example Configuration:**
```bash
# Required Site Settings
NEXT_PUBLIC_SITE_NAME=My Awesome Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A modern blog about technology and programming
NEXT_PUBLIC_SITE_URL=https://myblog.com
NEXT_PUBLIC_SITE_KEYWORDS=technology,programming,web development
NEXT_PUBLIC_SITE_AUTHOR=John Doe
NEXT_PUBLIC_SITE_EMAIL=john@myblog.com

# Optional Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@johndoe
NEXT_PUBLIC_GITHUB_URL=https://github.com/johndoe/myblog

# Cloudflare Deployment
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_PROJECT_NAME=my-blog-site
```

### **2. Create Cloudflare API Token**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Custom Token** template
4. Configure permissions:
   - **Zone:Zone:Read** (for your domain)
   - **Zone:Page Rules:Edit** (for your domain)
   - **Account:Cloudflare Pages:Edit**
5. Add your account/zone restrictions
6. Copy the token to `CLOUDFLARE_API_TOKEN` secret

### **3. Push to Main Branch**

The deployment automatically triggers when you:
```bash
git push origin main
```

## 🔄 **CI/CD Pipeline Overview**

### **Build Process**
1. **Checkout code** and setup Node.js 18
2. **Install dependencies** with `npm ci`
3. **Run quality checks** (linting, type checking, tests)
4. **Verify content structure** (posts, reviews, pages, images)
5. **Build static site** with environment configuration
6. **Verify build output** (pages, assets, size analysis)

### **Deployment Process**
1. **Deploy to Cloudflare Pages** using the built static files
2. **Performance audit** with Lighthouse CI
3. **Post-deployment verification** with feature summary

### **Build Environment Variables**
The pipeline automatically configures:
- All `NEXT_PUBLIC_*` secrets as environment variables
- Content directory: `./content`
- Production build settings

## 📊 **Expected Build Output**

### **Generated Files**
```bash
out/
├── index.html              # Homepage with search
├── posts/
│   ├── index.html         # Blog listing with search
│   └── [slug]/
│       └── index.html     # Individual posts
├── reviews/
│   ├── index.html         # Reviews listing with search
│   └── [slug]/
│       └── index.html     # Individual reviews
├── _next/static/          # Optimized CSS/JS with search
├── static/img/            # Static images
└── 404.html              # Error page
```

### **Performance Metrics**
- **Bundle size**: ~180KB (gzipped) including search
- **Build time**: ~30-60 seconds
- **Lighthouse scores**: Expected 100/100 across all metrics
- **First load**: ~200ms from CDN

## 🌐 **Alternative Deployment Platforms**

### **Vercel**
```yaml
# Update deploy.yml to use Vercel
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    working-directory: ./out
```

### **Netlify**
```yaml
# Update deploy.yml to use Netlify
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './out'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### **GitHub Pages**
```yaml
# Update deploy.yml to use GitHub Pages
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  if: github.ref == 'refs/heads/main'
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./out
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check environment variables are set
echo "Site Name: $NEXT_PUBLIC_SITE_NAME"
echo "Site URL: $NEXT_PUBLIC_SITE_URL"

# Verify content structure
ls -la content/posts/
ls -la content/reviews/
```

#### **Missing Environment Variables**
- Ensure all required `NEXT_PUBLIC_*` secrets are set in GitHub repository
- Check secret names match exactly (case-sensitive)
- Verify Cloudflare tokens have correct permissions

#### **Deployment Failures**
- Verify Cloudflare API token permissions
- Check account ID is correct
- Ensure project name doesn't conflict with existing projects

### **Debug Steps**
1. Check **Actions** tab in GitHub repository for detailed logs
2. Verify build output in "Verify build output" step
3. Check Cloudflare Pages dashboard for deployment status
4. Use Lighthouse CI results for performance insights

## 📈 **Performance Optimization**

### **Automatic Optimizations**
- **Static generation**: All pages pre-rendered at build time
- **Asset optimization**: CSS/JS minification and compression
- **Image optimization**: Next.js Image component with lazy loading
- **CDN distribution**: Global edge deployment via Cloudflare

### **Monitoring**
- **Lighthouse CI**: Automated performance audits on every deployment
- **Build metrics**: Size analysis and bundle optimization tracking
- **Search performance**: Client-side search with sub-millisecond response

## 🔒 **Security**

### **Static Site Benefits**
- **No server attack surface**: Pure static files
- **No database vulnerabilities**: File-based content
- **No authentication risks**: No user accounts or login systems
- **CDN security**: Protected by Cloudflare's security features

### **Best Practices**
- **Environment variables**: Keep sensitive data in GitHub secrets
- **Content validation**: Automated linting and type checking
- **Dependency updates**: Regular npm audit and updates
- **Access control**: GitHub repository permissions 