# 🔧 Site Configuration Guide

## Overview

LinuxID Pure Static Site Generator uses **environment variables** for centralized site configuration. This provides a clean, secure, and flexible way to manage your site's settings without hardcoding values.

## 🚀 **Quick Setup**

### 1. Copy Environment Template
```bash
# Copy the example configuration
cp env.example .env.local

# Edit with your site details
nano .env.local  # or your preferred editor
```

### 2. Configure Your Site
```bash
# Basic site information
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description for SEO
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# SEO keywords (comma-separated)
NEXT_PUBLIC_SITE_KEYWORDS=keyword1,keyword2,keyword3

# Author information
NEXT_PUBLIC_SITE_AUTHOR=Your Name
NEXT_PUBLIC_SITE_EMAIL=your@email.com
```

## 📝 **Environment Variables Reference**

### **🌐 Basic Site Information**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_NAME` | Site name/title | `LinuxID` | ✅ |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | SEO description | `Modern static site...` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Production URL | `https://linux-id.net` | ✅ |

### **🔍 SEO Configuration**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_KEYWORDS` | SEO keywords | `nextjs,blog,reviews` | ✅ |
| `NEXT_PUBLIC_SITE_AUTHOR` | Content author | `LinuxID Team` | ✅ |
| `NEXT_PUBLIC_SITE_EMAIL` | Contact email | `hello@linux-id.net` | ✅ |

### **📱 Social Media**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_TWITTER_HANDLE` | Twitter username | `@linuxid` | ❌ |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub repository | `https://github.com/...` | ❌ |

### **🖼️ Open Graph / Social Sharing**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_OG_IMAGE` | Social share image | `/static/img/og-image.jpg` | ✅ |
| `NEXT_PUBLIC_OG_TYPE` | OpenGraph type | `website` | ✅ |
| `NEXT_PUBLIC_OG_LOCALE` | Content locale | `en_US` | ✅ |

### **📊 Analytics (Optional)**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics | `G-XXXXXXXXXX` | ❌ |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible domain | `yourdomain.com` | ❌ |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google verification | `abc123...` | ❌ |

### **🛠️ Development Settings**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `CONTENT_DIR` | Content directory | `./content` | ✅ |
| `NODE_ENV` | Environment | `development` | ✅ |

## 🎯 **Configuration Examples**

### **Personal Blog Configuration**
```bash
# Personal Blog Setup
NEXT_PUBLIC_SITE_NAME=John's Tech Blog
NEXT_PUBLIC_SITE_DESCRIPTION=Personal thoughts on web development and technology
NEXT_PUBLIC_SITE_URL=https://johnsmith.dev
NEXT_PUBLIC_SITE_KEYWORDS=javascript,react,nextjs,web development,programming
NEXT_PUBLIC_SITE_AUTHOR=John Smith
NEXT_PUBLIC_SITE_EMAIL=john@johnsmith.dev
NEXT_PUBLIC_TWITTER_HANDLE=@johnsmith_dev
NEXT_PUBLIC_GITHUB_URL=https://github.com/johnsmith
```

### **Business/Company Site**
```bash
# Company Website Setup
NEXT_PUBLIC_SITE_NAME=TechCorp Solutions
NEXT_PUBLIC_SITE_DESCRIPTION=Leading technology solutions for modern businesses
NEXT_PUBLIC_SITE_URL=https://techcorp.com
NEXT_PUBLIC_SITE_KEYWORDS=technology,business solutions,consulting,software development
NEXT_PUBLIC_SITE_AUTHOR=TechCorp Team
NEXT_PUBLIC_SITE_EMAIL=contact@techcorp.com
NEXT_PUBLIC_TWITTER_HANDLE=@techcorp
NEXT_PUBLIC_GITHUB_URL=https://github.com/techcorp
```

### **Review/Magazine Site**
```bash
# Product Review Site
NEXT_PUBLIC_SITE_NAME=TechReviews Pro
NEXT_PUBLIC_SITE_DESCRIPTION=Honest reviews of the latest tech products and gadgets
NEXT_PUBLIC_SITE_URL=https://techreviews.pro
NEXT_PUBLIC_SITE_KEYWORDS=reviews,technology,gadgets,smartphones,laptops,gaming
NEXT_PUBLIC_SITE_AUTHOR=TechReviews Team
NEXT_PUBLIC_SITE_EMAIL=editors@techreviews.pro
NEXT_PUBLIC_TWITTER_HANDLE=@techreviewspro
```

## 🔧 **Advanced Configuration**

### **Custom Configuration Object**

The configuration is centralized in `src/lib/config/site.ts`:

```typescript
// src/lib/config/site.ts
export const siteConfig: SiteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Default Name',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Default description',
  // ... other settings with fallbacks
};
```

### **Adding New Configuration Options**

1. **Add to interface** in `src/lib/config/site.ts`:
```typescript
export interface SiteConfig {
  // ... existing fields
  newField: string;
}
```

2. **Add to configuration object**:
```typescript
export const siteConfig: SiteConfig = {
  // ... existing fields
  newField: process.env.NEXT_PUBLIC_NEW_FIELD || 'default value',
};
```

3. **Add to `env.example`**:
```bash
# New Configuration
NEXT_PUBLIC_NEW_FIELD=your-value-here
```

### **Environment-Specific Configurations**

#### **Development (.env.local)**
```bash
NEXT_PUBLIC_SITE_NAME=LinuxID (Dev)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

#### **Production (.env.production)**
```bash
NEXT_PUBLIC_SITE_NAME=LinuxID
NEXT_PUBLIC_SITE_URL=https://linux-id.net
NODE_ENV=production
```

#### **Staging (.env.staging)**
```bash
NEXT_PUBLIC_SITE_NAME=LinuxID (Staging)
NEXT_PUBLIC_SITE_URL=https://staging.linux-id.net
NODE_ENV=production
```

## 📊 **SEO Integration**

The configuration automatically integrates with:

### **Meta Tags**
- `<title>` - Uses `NEXT_PUBLIC_SITE_NAME`
- `<meta name="description">` - Uses `NEXT_PUBLIC_SITE_DESCRIPTION`
- `<meta name="keywords">` - Uses `NEXT_PUBLIC_SITE_KEYWORDS`
- `<meta name="author">` - Uses `NEXT_PUBLIC_SITE_AUTHOR`

### **Open Graph Tags**
```html
<meta property="og:title" content="Your Site Name" />
<meta property="og:description" content="Your site description" />
<meta property="og:url" content="https://yourdomain.com" />
<meta property="og:image" content="/static/img/og-image.jpg" />
```

### **Twitter Cards**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@yourusername" />
<meta name="twitter:title" content="Your Site Name" />
<meta name="twitter:description" content="Your site description" />
```

## 🚀 **Deployment Configuration**

### **Cloudflare Pages**
1. Set environment variables in Cloudflare dashboard
2. Deploy with standard build settings

### **Vercel**
1. Set environment variables in Vercel dashboard
2. Deploy via GitHub integration

### **Netlify**
1. Set environment variables in Netlify dashboard
2. Use drag-and-drop or Git integration

### **Environment Variables in CI/CD**
```yaml
# GitHub Actions example
env:
  NEXT_PUBLIC_SITE_NAME: ${{ secrets.SITE_NAME }}
  NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
  # ... other variables
```

## 🔍 **Best Practices**

### **✅ Do's**
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Provide sensible defaults in the config object
- ✅ Keep sensitive data in deployment environment only
- ✅ Use consistent naming conventions
- ✅ Document any custom configuration additions

### **❌ Don'ts**
- ❌ Don't put API keys or secrets in `NEXT_PUBLIC_` variables
- ❌ Don't hardcode values in components
- ❌ Don't forget to update `env.example` for new variables
- ❌ Don't use conflicting variable names

## 🛠️ **Troubleshooting**

### **Variables Not Loading**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify variable syntax (no spaces around =)
cat .env.local | grep NEXT_PUBLIC_SITE_NAME

# Restart development server
npm run dev
```

### **Build Issues**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### **Production Deployment Issues**
1. Verify environment variables are set in hosting platform
2. Check variable names match exactly
3. Ensure `NEXT_PUBLIC_` prefix for client-side variables

## 📚 **Migration from Hardcoded Config**

If you have hardcoded configuration in your components:

### **Before (Hardcoded)**
```typescript
const siteConfig = {
  siteName: 'LinuxID',
  description: 'Static site generator'
};
```

### **After (Environment Variables)**
```typescript
import { siteConfig } from '@/lib/config/site';

// Use siteConfig.siteName, siteConfig.description, etc.
```

This provides a much cleaner, more maintainable, and deployment-friendly configuration system! 