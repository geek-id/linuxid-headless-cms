# Robots.txt Implementation Guide

## Overview

This headless CMS includes a comprehensive robots.txt implementation that provides fine-grained control over search engine crawling behavior. The implementation supports both static and dynamic generation, environment-specific configurations, and WordPress-like admin blocking.

## Features

- ✅ **Environment-aware**: Different configurations for development, staging, and production
- ✅ **WordPress-compatible**: Blocks common WordPress admin paths like `/wp-admin/`
- ✅ **Security-focused**: Blocks access to sensitive files and directories
- ✅ **Flexible configuration**: Easy to customize for different use cases
- ✅ **Type-safe**: Full TypeScript support with proper interfaces
- ✅ **Error handling**: Graceful fallbacks and error recovery
- ✅ **Caching**: Optimized caching headers for performance

## File Structure

```
src/
├── app/robots.txt/
│   └── route.ts              # Dynamic robots.txt route
├── lib/utils/
│   └── robots.ts            # Robots.txt utility functions and configurations
└── public/
    └── robots.txt           # Static fallback robots.txt
```

## Implementation Details

### 1. Static File (`/public/robots.txt`)

A static robots.txt file that serves as a fallback and works even if the dynamic route fails.

### 2. Dynamic Route (`/src/app/robots.txt/route.ts`)

A Next.js API route that generates robots.txt content dynamically based on:
- Environment variables
- Site configuration
- Custom rules

### 3. Utility Functions (`/src/lib/utils/robots.ts`)

Comprehensive utility functions for:
- Configuration management
- Content generation
- Validation
- Environment-specific rules

## Configuration

### Default Configuration (Production)

```typescript
{
  rules: [
    {
      userAgent: '*',
      allow: [
        '/',
        '/posts/',
        '/posts/*',
        '/reviews/',
        '/reviews/*',
        '/about',
        '/sitemap.xml',
        '/rss.xml',
        '/static/',
        '/static/*',
        // ... static assets
      ],
      disallow: [
        '/admin/',
        '/wp-admin/',
        '/dashboard/',
        '/api/',
        '/_next/',
        // ... sensitive paths
      ],
    },
  ],
  sitemap: 'https://linux-id.net/sitemap.xml',
}
```

### Development Configuration

```typescript
{
  rules: [
    {
      userAgent: '*',
      disallow: ['/'], // Block all crawlers in development
    },
  ],
}
```

### Staging Configuration

```typescript
{
  rules: [
    {
      userAgent: '*',
      disallow: ['/'], // Block most crawlers
    },
    {
      userAgent: 'Googlebot',
      allow: ['/'], // Allow only Google for testing
      crawlDelay: 10,
    },
  ],
  sitemap: 'https://staging.linux-id.net/sitemap.xml',
}
```

## Customization

### Adding New Rules

To add custom rules, modify the configuration in `/src/lib/utils/robots.ts`:

```typescript
export const customRobotsConfig: RobotsConfig = {
  rules: [
    {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/private/', '/temp/'],
      crawlDelay: 2,
    },
    {
      userAgent: 'Googlebot',
      allow: ['/'],
      crawlDelay: 1,
    },
  ],
  sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
};
```

### Environment-Specific Rules

Set the `NEXT_PUBLIC_ENVIRONMENT` environment variable to use staging configuration:

```bash
# .env.local
NEXT_PUBLIC_ENVIRONMENT=staging
```

### Custom Configurations

Use predefined custom configurations:

```typescript
import { customConfigs } from '@/lib/utils/robots';

// Block all crawlers
const config = customConfigs.blockAll;

// Allow only major search engines
const config = customConfigs.searchEnginesOnly;

// E-commerce focused rules
const config = customConfigs.ecommerce;
```

## WordPress Compatibility

The robots.txt implementation includes WordPress-compatible blocking rules:

```
# WordPress admin areas
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /wp-content/

# Common WordPress paths
Disallow: /wp-includes/
Disallow: /wp-json/
Disallow: /xmlrpc.php
```

This ensures that if you migrate from WordPress or have WordPress-like admin paths, they'll be properly blocked.

## Security Features

### Blocked Paths

The implementation blocks access to:

- **Admin areas**: `/admin/`, `/wp-admin/`, `/dashboard/`
- **API endpoints**: `/api/` (unless specifically allowed)
- **Build files**: `/_next/`, `/node_modules/`, `/.next/`
- **Configuration files**: `.env`, `package.json`, `tsconfig.json`
- **Version control**: `/.git/`, `/.svn/`
- **Editor files**: `/.vscode/`, `/.idea/`, `*.swp`
- **Backup files**: `*.bak`, `*.backup`, `*.log`
- **Temporary files**: `/tmp/`, `/temp/`, `/cache/`

### Allowed Paths

The implementation allows access to:

- **Public content**: `/`, `/posts/`, `/reviews/`, `/about`
- **SEO files**: `/sitemap.xml`, `/rss.xml`
- **Static assets**: `/static/`, images, CSS, JS files
- **Favicon**: `/favicon.ico`

## Testing

### Local Testing

```bash
# Start development server
npm run dev

# Test robots.txt
curl http://localhost:3000/robots.txt

# Should show development configuration (blocks all crawlers)
```

### Production Testing

```bash
# Build and start production server
npm run build
npm start

# Test robots.txt
curl http://localhost:3000/robots.txt

# Should show production configuration
```

### Validation

Use online robots.txt validators:
- [Google Search Console Robots.txt Tester](https://search.google.com/search-console/robots-txt-tester)
- [Robots.txt Validator](https://www.robotstxt.org/robotstxt.html)

## Best Practices

### 1. Regular Updates

- Review and update robots.txt rules regularly
- Monitor for new paths that should be blocked
- Update sitemap URL when it changes

### 2. Testing

- Test robots.txt in all environments
- Validate syntax using online tools
- Monitor search console for crawl errors

### 3. Performance

- Use appropriate cache headers
- Keep rules concise and specific
- Avoid overly complex patterns

### 4. SEO Considerations

- Don't block important content accidentally
- Ensure sitemap is accessible and up-to-date
- Monitor search engine crawling behavior

## Troubleshooting

### Common Issues

1. **Robots.txt not updating**
   - Check cache headers and CDN settings
   - Verify environment variables
   - Clear browser cache

2. **Wrong configuration in production**
   - Verify `NODE_ENV` is set to `production`
   - Check `NEXT_PUBLIC_ENVIRONMENT` variable
   - Review deployment configuration

3. **Search engines ignoring rules**
   - Validate robots.txt syntax
   - Check for conflicting meta tags
   - Monitor search console for errors

### Debugging

Enable debug logging:

```typescript
// In robots.ts utility
console.log('Current environment:', process.env.NODE_ENV);
console.log('Custom environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
console.log('Generated config:', JSON.stringify(config, null, 2));
```

### Fallback Behavior

If the dynamic route fails:
1. Static `/public/robots.txt` serves as fallback
2. Error handling returns minimal blocking rules
3. Logs errors for debugging

## Advanced Usage

### Custom User Agents

Block or allow specific crawlers:

```typescript
{
  rules: [
    {
      userAgent: 'BadBot',
      disallow: ['/'],
    },
    {
      userAgent: 'Googlebot',
      allow: ['/'],
      crawlDelay: 1,
    },
    {
      userAgent: 'Bingbot',
      allow: ['/'],
      crawlDelay: 2,
    },
  ],
}
```

### Conditional Rules

Apply rules based on conditions:

```typescript
const config: RobotsConfig = {
  rules: [
    {
      userAgent: '*',
      allow: ['/'],
      disallow: process.env.MAINTENANCE_MODE === 'true' ? ['/'] : ['/admin/'],
    },
  ],
};
```

### Integration with CMS

If you add a CMS interface, you can make robots.txt configurable:

```typescript
// Example: Load from database or CMS
export async function getRobotsConfigFromCMS(): Promise<RobotsConfig> {
  // Fetch configuration from your CMS
  const cmsConfig = await fetchRobotsConfig();
  return cmsConfig || defaultRobotsConfig;
}
```

## Monitoring and Analytics

### Search Console Integration

1. Submit robots.txt to Google Search Console
2. Monitor crawl stats and errors
3. Review blocked URLs report

### Analytics

Track robots.txt requests:

```typescript
// Add analytics to robots.txt route
export async function GET() {
  // Track request
  analytics.track('robots_txt_request', {
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
  });
  
  // ... rest of implementation
}
```

## Migration from WordPress

If migrating from WordPress:

1. **Export existing robots.txt** from WordPress
2. **Review custom rules** you may have added
3. **Update paths** to match your new site structure
4. **Test thoroughly** to ensure no important content is blocked

### WordPress Plugin Compatibility

Common WordPress SEO plugins and their robots.txt features:

- **Yoast SEO**: Custom robots.txt editor
- **RankMath**: Advanced robots.txt management
- **All in One SEO**: Robots.txt generator

This implementation provides similar functionality with more flexibility and type safety.

## Support and Resources

- [Robots.txt Specification](https://www.robotstxt.org/robotstxt.html)
- [Google Robots.txt Guidelines](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Documentation](https://www.typescriptlang.org/docs) 