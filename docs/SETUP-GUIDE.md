 # 🚀 LinuxID Setup Guide

Complete setup guide for the LinuxID Modern Static Site Generator with Lucide React icons, full-width featured images, and professional design system.

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

### **Knowledge Requirements**
- Basic Markdown knowledge
- Basic understanding of static sites
- Familiarity with file organization

## 🏁 **Quick Start**

### **1. Clone Repository**
```bash
git clone https://github.com/geek-id/linuxid-project.git
cd linuxid-project/headless-cms
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
```bash
# Copy configuration template
cp env.example .env.local

# Edit with your site details
nano .env.local
```

### **4. Start Development**
```bash
npm run dev
# Visit http://localhost:3000
```

### **5. Build for Production**
```bash
npm run build
# Static site generated in 'out/' directory
```

## ⚙️ **Environment Configuration**

### **Required Variables**
```bash
# Basic Site Information
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description for SEO
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_AUTHOR=Your Name

# SEO & Social
NEXT_PUBLIC_SITE_KEYWORDS=keyword1,keyword2,keyword3
NEXT_PUBLIC_TWITTER_HANDLE=@yourusername
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-repo
```

### **Optional Variables**
```bash
# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=contact@yourdomain.com
```

## 📁 **Project Structure**

```
headless-cms/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage with featured content
│   │   ├── posts/page.tsx        # Blog with random featured selection
│   │   ├── reviews/page.tsx      # Reviews with ratings
│   │   ├── layout.tsx            # Root layout with SEO
│   │   └── globals.css           # Design system & styling
│   ├── components/
│   │   ├── Footer.tsx            # Footer with Lucide icons
│   │   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   │   ├── SearchBox.tsx         # Client-side search
│   │   └── HomePageSearch.tsx    # Homepage search wrapper
│   ├── lib/
│   │   ├── content/parser.ts     # Markdown processing
│   │   ├── config/site.ts        # Site configuration
│   │   └── utils/               # Utility functions
│   └── types/content.ts          # TypeScript definitions
├── content/                      # Markdown content
│   ├── posts/                    # Blog posts with frontmatter
│   ├── pages/                    # Static pages
│   └── reviews/                  # Product reviews with ratings
├── public/
│   ├── static/img/               # Images & assets
│   │   ├── featured/             # Featured images
│   │   ├── gallery/              # Content images
│   │   └── default-post.svg      # SVG fallback image
│   ├── favicon.ico
│   └── robots.txt
├── docs/                         # Documentation
├── out/                          # Generated static site (after build)
├── .env.local                    # Environment configuration
├── package.json                  # Dependencies
└── README.md                     # Project overview
```

## 📝 **Content Creation**

### **Blog Posts** (`content/posts/`)
```yaml
---
title: "Complete Guide to Linux System Administration"
slug: "linux-system-admin-guide"
excerpt: "Comprehensive guide covering essential Linux administration skills"
featured: true                    # Shows in Featured Tutorials
published: true
publishedAt: "2024-05-24T10:00:00Z"
author: 
  name: "LinuxID Team"
  email: "team@linux-id.net"
category: "System Administration"
tags: ["linux", "sysadmin", "tutorials"]

# Featured Image (optional)
featuredImage:
  url: "/static/img/featured/linux-admin.jpg"
  alt: "Linux system administration dashboard"

# SEO Configuration
seo:
  title: "Linux System Administration Guide | LinuxID"
  description: "Learn essential Linux system administration skills"
  keywords: ["linux", "system administration", "devops"]
---

# Your Content Here

Write your content using standard Markdown syntax.
Images automatically display edge-to-edge with fallback support.
```

### **Reviews** (`content/reviews/`)
```yaml
---
title: "CloudVPS Review - Best VPS Hosting for 2024"
slug: "cloudvps-review-2024"
excerpt: "In-depth review of CloudVPS hosting services"
featured: true
published: true
rating: 4.5                      # Star rating (1-5)
productName: "CloudVPS"
category: "VPS Hosting"
tags: ["vps", "hosting", "review"]

# Review-specific fields
pros: ["Excellent performance", "24/7 support", "Competitive pricing"]
cons: ["Limited data centers", "No phone support"]
verdict: "Excellent choice for developers and small businesses"
---

# Detailed Review Content
```

### **Static Pages** (`content/pages/`)
```yaml
---
title: "About LinuxID"
slug: "about"
excerpt: "Learn about LinuxID and our mission"
published: true
layout: "default"

# Page-specific configuration
showInFooter: true
footerOrder: 1
---

# About Our Mission
```

## 🖼️ **Image Management**

### **Directory Structure**
```bash
public/static/img/
├── featured/              # Featured images for posts
│   ├── linux-guide.jpg
│   ├── docker-tutorial.jpg
│   └── security-tips.jpg
├── gallery/               # Content images
│   ├── screenshots/
│   │   ├── terminal-1.jpg
│   │   └── dashboard-2.jpg
│   └── diagrams/
│       ├── network-flow.svg
│       └── system-arch.png
├── icons/                 # Custom icons (if needed)
└── default-post.svg       # Automatic fallback image
```

### **Image Usage**
```markdown
# In Markdown content
![Linux Terminal](/static/img/gallery/screenshots/terminal-1.jpg)

# In frontmatter
featuredImage:
  url: "/static/img/featured/linux-guide.jpg"
  alt: "Linux system administration guide"
```

### **Image Optimization**
- **Recommended formats**: JPG (photos), PNG (screenshots), SVG (diagrams)
- **Optimal sizes**: 800px width for featured images
- **Compression**: Use tools like TinyPNG before uploading
- **Alt text**: Always provide descriptive alt text for accessibility

## 🎨 **Design System**

### **Current Features**
- **Lucide React Icons**: Consistent iconography throughout
- **Full-Width Images**: Edge-to-edge featured image display
- **Color-Coded Sections**: Featured (#F38181) vs Solutions (#08D9D6→#252A34)
- **Responsive Design**: Mobile-first with adaptive layouts
- **Professional Typography**: Inter font with proper weights

### **Icon Usage**
Icons are automatically included via Lucide React:
```typescript
import { Search, Calendar, ArrowRight } from 'lucide-react';
```

### **Color Schemes**
- **Featured Tutorials**: Solid coral background (#F38181)
- **All Solutions & Insights**: Teal-to-dark gradient
- **Footer Tags**: Hover effects with font weight changes

## 🔍 **Search Functionality**

### **Client-Side Search**
- **Real-time filtering**: Results as you type (2+ characters)
- **Multi-content search**: Posts, reviews, pages
- **Search fields**: Title, excerpt, category, tags
- **Visual indicators**: Content type icons and ratings

### **Search Locations**
- **Homepage**: Central search in hero section
- **Posts Page**: Dedicated blog search
- **Reviews Page**: Review-specific search with ratings

## 🚀 **Development Workflow**

### **Available Scripts**
```bash
npm run dev          # Development server with hot reload
npm run build        # Generate static site in 'out/'
npm run start        # Preview production build locally
npm run lint         # ESLint code quality check
npm run type-check   # TypeScript validation
```

### **Adding New Content**
1. **Create markdown file** in appropriate `content/` directory
2. **Add frontmatter** with required metadata
3. **Write content** using Markdown syntax
4. **Add images** to `public/static/img/` if needed
5. **Test locally** with `npm run dev`
6. **Build** with `npm run build` to verify

### **Customizing Design**
1. **Colors**: Edit CSS variables in `src/app/globals.css`
2. **Typography**: Modify font imports and CSS
3. **Icons**: Add/remove Lucide React icons as needed
4. **Layout**: Edit component files in `src/components/`

## 📊 **Performance Optimization**

### **Built-in Optimizations**
- **Static generation**: All pages pre-rendered
- **Image optimization**: Next.js Image component
- **Code splitting**: Minimal JavaScript bundles
- **Tree shaking**: Only used icons included
- **CSS optimization**: Purged unused styles

### **Performance Targets**
- **Build time**: ~30 seconds for typical content
- **Bundle size**: ~180KB (gzipped) with icons
- **Page load**: ~200ms from CDN
- **Lighthouse score**: 100/100 potential

## 🔧 **Troubleshooting**

### **Common Issues**

**Build Errors**
```bash
# Clear build cache
rm -rf .next out

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run type-check
```

**Image Loading Issues**
- Verify image paths start with `/static/img/`
- Check file extensions are lowercase
- Ensure images exist in `public/static/img/`

**Search Not Working**
- Verify content has proper frontmatter
- Check published status is `true`
- Ensure content is in correct directory

### **Development Tips**
- Use `npm run dev` for hot reload during development
- Always test build with `npm run build` before deployment
- Check browser console for JavaScript errors
- Validate Markdown frontmatter syntax

## 📚 **Next Steps**

### **After Setup**
1. **Customize site configuration** in `.env.local`
2. **Add your content** to `content/` directories
3. **Upload images** to `public/static/img/`
4. **Test thoroughly** with development server
5. **Build and deploy** to your hosting platform

### **Advanced Configuration**
- **[Configuration Guide](CONFIGURATION.md)** - Detailed environment setup
- **[Design System](DESIGN-SYSTEM.md)** - Colors, typography, icons
- **[Deployment Guide](DEPLOYMENT.md)** - Hosting and CI/CD
- **[Content Guide](CONTENT-GUIDE.md)** - Advanced content features

---

**🐧 Ready to build your Linux-focused static site!**  
📚 **Check the other documentation files for advanced features**  
🚀 **Deploy anywhere - it's just static files!**