# 🚀 Deployment Guide

Complete guide for deploying LinuxID Headless CMS to Cloudflare Pages with automated CI/CD.

## 📋 **Prerequisites**

- **GitHub repository** with your LinuxID Headless CMS code
- **Cloudflare account** with Pages enabled
- **OAuth applications** set up (GitHub and/or Google)
- **Cloud storage** configured (Cloudflare R2, AWS S3, or S3-compatible)

## 🔧 **1. Cloudflare Setup**

### **Create Cloudflare Pages Project**
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or `/headless-cms` if in subdirectory)

### **Get API Tokens**
1. Go to **My Profile** → **API Tokens**
2. Create token with **Cloudflare Pages:Edit** permissions
3. Note your **Account ID** from the right sidebar

## 🔐 **2. GitHub Secrets Configuration**

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

### **Required Secrets**

#### **Authentication**
```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

#### **Admin Configuration**
```bash
ADMIN_EMAILS=admin@yourdomain.com,editor@yourdomain.com
```

#### **Site Configuration**
```bash
SITE_NAME=Your Site Name
SITE_URL=https://your-domain.com
```

#### **Cloudflare Deployment**
```bash
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_PROJECT_NAME=your-pages-project-name
```

### **Cloud Storage Secrets**

**Choose ONE of the following providers:**

#### **Option 1: Cloudflare R2 (Recommended)**
```bash
STORAGE_PROVIDER=cloudflare_r2
CLOUDFLARE_R2_ACCOUNT_ID=your-r2-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.your-domain.com
```

#### **Option 2: AWS S3**
```bash
STORAGE_PROVIDER=aws_s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-s3-bucket
AWS_S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com
```

#### **Option 3: S3-Compatible (DigitalOcean, Linode, etc.)**
```bash
STORAGE_PROVIDER=s3_compatible
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_ACCESS_KEY_ID=your-spaces-key
S3_SECRET_ACCESS_KEY=your-spaces-secret
S3_BUCKET_NAME=your-bucket-name
S3_PUBLIC_URL=https://your-bucket.nyc3.digitaloceanspaces.com
S3_REGION=nyc3
```

### **Optional Secrets**
```bash
# Image processing (defaults provided)
MAX_IMAGE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
IMAGE_QUALITY=85

# Custom domain (if using)
CUSTOM_DOMAIN=your-custom-domain.com
```

## 🌐 **3. OAuth Setup**

### **GitHub OAuth Application**
1. Go to GitHub **Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in details:
   - **Application name**: Your Site Name
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`
4. Save **Client ID** and **Client Secret**

### **Google OAuth Application**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `https://your-domain.com/api/auth/callback/google`
6. Save **Client ID** and **Client Secret**

## 📦 **4. Deployment Process**

### **Automatic Deployment**
The CI/CD pipeline automatically triggers when you:
1. **Push to main branch** - Deploys to production
2. **Create pull request** - Builds and tests (no deployment)

### **Build Process**
1. **Install dependencies** - `npm ci`
2. **Run quality checks** - Linting, type checking, tests
3. **Initialize file-based config** - Creates `.config/` directory
4. **Build application** - `npm run build` with all environment variables
5. **Generate sitemap** - If script exists
6. **Deploy to Cloudflare Pages** - Uploads `out/` directory
7. **Performance audit** - Lighthouse CI (optional)

### **Manual Deployment**
You can also deploy manually:
```bash
# Local build and deploy
npm run build
npx wrangler pages publish out --project-name=your-project
```

## 🔍 **5. Verification**

After deployment, verify your website is working:

### **Public Pages**
- **Homepage**: `https://your-domain.com`
- **Blog**: `https://your-domain.com/posts`
- **Reviews**: `https://your-domain.com/reviews`
- **Dashboard**: `https://your-domain.com/dashboard`

### **Admin Access**
1. Visit: `https://your-domain.com/admin`
2. Sign in with GitHub or Google
3. Verify admin access with your configured email

### **Image Upload**
1. Go to admin panel → Upload
2. Test image upload functionality
3. Verify images appear in your cloud storage

## 📊 **6. Performance Monitoring**

### **Lighthouse CI**
The deployment automatically runs Lighthouse audits on:
- Homepage performance and SEO
- Blog listing page
- Dashboard functionality

### **Expected Scores**
- **Performance**: 90+ (optimized static generation)
- **Accessibility**: 90+ (semantic HTML, alt text)
- **Best Practices**: 90+ (security headers, HTTPS)
- **SEO**: 90+ (meta tags, structured data)

## 🛠️ **7. Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check environment variables are set
echo $NEXTAUTH_SECRET

# Verify OAuth configuration
curl -I https://your-domain.com/api/auth/signin
```

#### **Authentication Issues**
1. **Verify callback URLs** in OAuth apps
2. **Check NEXTAUTH_URL** matches your domain
3. **Ensure NEXTAUTH_SECRET** is 32+ characters

#### **Image Upload Issues**
1. **Verify cloud storage credentials**
2. **Check bucket permissions**
3. **Test storage endpoint connectivity**

#### **Font Errors (Geist)**
If you see Geist font errors:
```bash
# Install Geist fonts or update layout.tsx
npm install geist
# Or remove Geist imports and use system fonts
```

### **Debug Build Locally**
```bash
# Build with production environment
NODE_ENV=production npm run build

# Test the build output
npm run start

# Check static export
ls -la out/
```

## 🔄 **8. Continuous Updates**

### **Content Updates**
- **Blog posts** - Add markdown files to `content/posts/`
- **Reviews** - Add markdown files to `content/reviews/`
- **Pages** - Add markdown files to `content/pages/`
- **Images** - Upload via admin panel

### **Configuration Updates**
- **Site settings** - Update via admin panel or `.config/site.json`
- **Admin settings** - Update via admin panel or `.config/admin.json`
- **Environment variables** - Update GitHub secrets as needed

### **Code Updates**
1. **Make changes** to your code
2. **Push to main branch**
3. **Automatic deployment** triggers
4. **Verify changes** on live site

## 📈 **9. Scaling and Optimization**

### **Performance Optimization**
- **Static generation** - All pages pre-built for speed
- **Image optimization** - Automatic resizing and compression
- **CDN delivery** - Global edge distribution via Cloudflare
- **Caching** - Aggressive caching for static assets

### **Security**
- **File-based auth** - No database vulnerabilities
- **OAuth only** - No password-based attacks
- **Environment secrets** - Secure credential management
- **HTTPS everywhere** - Automatic SSL termination

### **Monitoring**
- **Cloudflare Analytics** - Built-in traffic and performance metrics
- **GitHub Actions** - Build and deployment monitoring
- **Lighthouse CI** - Continuous performance auditing

---

**🎉 Your LinuxID Headless CMS is now deployed with enterprise-grade CI/CD!**

**Need help?** Check our [documentation](../README.md) or open an issue on GitHub. 