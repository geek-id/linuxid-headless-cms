# 📝 LinuxID Pure Static Site Generator - Quick Reference

A pure static site generator built with Next.js - **zero APIs, zero database, zero server-side code**.

## 🚀 **Getting Started**

```bash
# Clone and install
git clone https://github.com/geek-id/linuxid-static-site.git
cd linuxid-static-site
npm install

# Configure your site
cp env.example .env.local
# Edit .env.local with your site details

# Start development
npm run dev

# Build static site
npm run build

# Deploy anywhere
# Just upload the 'out/' folder to any static host!
```

## ⚙️ **Site Configuration**

### **Environment Variables (.env.local)**
```bash
# Basic Site Information
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description for SEO
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_KEYWORDS=keyword1,keyword2,keyword3
NEXT_PUBLIC_SITE_AUTHOR=Your Name
NEXT_PUBLIC_SITE_EMAIL=your@email.com

# Social Media (Optional)
NEXT_PUBLIC_TWITTER_HANDLE=@yourusername
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-repo

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

**📖 [Complete Configuration Guide →](CONFIGURATION.md)**

## 🔍 **Search Functionality**

### **Client-Side Search**
- **Homepage Search**: Central search box in hero section
- **Blog Search**: Dedicated search on `/posts` page
- **Review Search**: Specialized search on `/reviews` page
- **Pure Client-Side**: No API calls, instant results
- **Smart Filtering**: Searches titles, excerpts, categories, and tags

### **Search Features**
- **Real-time Results**: Shows results as you type (2+ characters)
- **Multi-Type Search**: Posts, reviews, and pages in one search
- **Visual Icons**: 📝 Posts, ⭐ Reviews, 📄 Pages
- **Rating Display**: Star ratings for reviews in search results
- **Category Tags**: Visual category and content type indicators
- **Quick Navigation**: Click result to go directly to content
- **Responsive UI**: Works perfectly on mobile and desktop

### **Search Behavior**
- **Minimum Query**: 2+ characters to start searching
- **Result Limit**: Shows top 10 most relevant results
- **Empty State**: Helpful message when no results found
- **Clear Function**: Easy clear button (✕) to reset search

## 📁 **Project Structure**

```
linuxid-static-site/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage (with search)
│   │   ├── posts/             # Blog pages (with search)
│   │   ├── reviews/           # Review pages (with search)
│   │   └── layout.tsx         # Root layout + SEO
│   ├── components/
│   │   ├── SearchBox.tsx      # 🔍 Main search component
│   │   └── HomePageSearch.tsx # Homepage search wrapper
│   ├── lib/
│   │   ├── config/
│   │   │   └── site.ts        # ⚙️ Centralized configuration
│   │   ├── content/           # Markdown parsing
│   │   └── utils/             # Utility functions
│   └── types/                 # TypeScript definitions
├── content/                   # Markdown content
│   ├── posts/                 # Blog posts (searchable)
│   ├── pages/                 # Static pages (searchable)
│   └── reviews/               # Product reviews (searchable)
├── public/
│   └── static/
│       └── img/               # Static images
├── env.example                # Environment configuration template
└── out/                       # Generated static site (after build)
```

## 📝 **Content Management**

### **Adding Content**
1. Create `.md` file in appropriate `content/` directory
2. Add frontmatter with metadata
3. Write content in markdown
4. **Content automatically searchable** - appears in search immediately
5. Run `npm run build` - content appears automatically in static site

### **Content Types**
- **Posts** (`content/posts/`) - Blog articles (searchable)
- **Pages** (`content/pages/`) - Static pages (searchable)
- **Reviews** (`content/reviews/`) - Product reviews with ratings (searchable)

### **Frontmatter Structure**
```yaml
---
title: "Your Content Title"          # 🔍 Searchable
slug: "auto-generated-from-title"
excerpt: "Brief description for SEO" # 🔍 Searchable
featured: true
published: true
publishedAt: "2024-01-15T10:00:00Z"
author: 
  name: "Author Name"
  email: "author@example.com"
category: "Tutorial"                 # 🔍 Searchable
tags: ["nextjs", "static-site"]      # 🔍 Searchable

# SEO Configuration
seo:
  title: "Custom SEO title"
  description: "SEO meta description"
  keywords: ["keyword1", "keyword2"]

# Static Images
featuredImage:
  url: "/static/img/featured.jpg"
  alt: "Image description"
---

# Your Markdown Content Here
```

## 🖼️ **Static Images**

### **File Organization**
```bash
public/static/img/
├── featured-images/
│   ├── post1-featured.jpg
│   └── post2-featured.jpg
├── blog/
│   ├── tutorial-screenshot.png
│   └── example-diagram.jpg
└── reviews/
    ├── product1-photo.jpg
    └── product2-gallery.jpg
```

### **Usage in Content**
```markdown
# In markdown content
![Alt text](/static/img/example.jpg)

# In frontmatter
featuredImage:
  url: "/static/img/featured.jpg"
  alt: "Description"
```

## 🎨 **Styling & Customization**

### **Site Configuration**
All site settings are managed via environment variables in `.env.local`:
```bash
# Centralized configuration - no more hardcoded values!
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your description
# ... see CONFIGURATION.md for complete reference
```

### **Theme Customization**
```typescript
// Edit tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-brand-color',
        secondary: '#your-accent-color',
      },
    },
  },
};
```

## 🚀 **Build & Deployment**

### **Build Process**
```bash
npm run build
# Creates 'out/' directory with:
# ├── index.html              # Homepage (with search)
# ├── posts/                  # Blog pages (with search)
# ├── reviews/                # Review pages (with search)
# ├── _next/                  # Optimized assets
# └── static/                 # Your images
```

### **Deployment Commands**

**Cloudflare Pages**
```bash
# Connect GitHub repo, auto-deploy on push
# Build command: npm run build
# Output directory: out
```

**Vercel**
```bash
npx vercel --prod
```

**Netlify**
```bash
# Drag & drop 'out' folder to Netlify dashboard
```

**GitHub Pages**
```bash
git subtree push --prefix out origin gh-pages
```

**Self-Hosted**
```bash
# Copy to web server
scp -r out/* user@server:/var/www/html/
```

**📖 [Complete Deployment Guide →](DEPLOYMENT.md)**

## 🛠️ **Development**

### **Available Scripts**
```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Generate static site in 'out' directory
npm run start        # Preview production build locally
npm run lint         # ESLint code quality check
npm run type-check   # TypeScript validation
npm run clean        # Clean build cache
```

### **Development Workflow**
1. **Configure site** - Edit `.env.local` with your site details
2. **Write content** - Add `.md` files to `content/` directories
3. **Add images** - Place in `public/static/img/`
4. **Preview** - Run `npm run dev` to see changes (**test search functionality**)
5. **Build** - Run `npm run build` for production
6. **Deploy** - Upload `out/` folder to any static host

## ⚡ **Performance Features**

- **Zero server-side processing** - Everything pre-rendered at build time
- **Instant search** - Client-side filtering with no API calls
- **Minimal JavaScript** - Only essential client-side code + search
- **Perfect SEO** - Auto-generated meta tags from environment config
- **Instant loading** - Static files served from CDN
- **Unlimited scaling** - Static files scale infinitely

## 🔧 **Technical Stack**

- **Framework**: Next.js 14 (App Router) with static export
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown + Gray Matter
- **Rendering**: Marked.js
- **Search**: Pure client-side JavaScript filtering
- **Configuration**: Environment variables with TypeScript interfaces
- **Output**: Pure static HTML/CSS/JS

## 📊 **File Sizes (Typical)**
- **Homepage**: ~99KB (including search functionality)
- **Blog post**: ~93KB (with search)
- **CSS bundle**: ~40KB (gzipped)
- **JS bundle**: ~180KB (gzipped, includes search components)
- **Total build**: <600KB for 50 posts with full search capabilities

---

**🚀 Pure static, environment-configured, instant search, works everywhere!** 