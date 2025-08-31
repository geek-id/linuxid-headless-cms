import { siteConfig } from '@/lib/config/site';

export interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules: RobotsRule[];
  sitemap?: string;
  host?: string;
}

/**
 * Default robots.txt configuration for the headless CMS
 */
export const defaultRobotsConfig: RobotsConfig = {
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
      ],
      disallow: [
        '/admin/',
        '/admin/*',
        '/wp-admin/',
        '/wp-login.php',
        '/wp-content/',
        '/dashboard/',
        '/dashboard/*',
      ],
    },
  ],
  sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
};

/**
 * Development environment robots.txt configuration
 * Blocks all crawlers in development
 */
export const developmentRobotsConfig: RobotsConfig = {
  rules: [
    {
      userAgent: '*',
      disallow: ['/'],
    },
  ],
};

/**
 * Staging environment robots.txt configuration
 * Allows only specific crawlers for testing
 */
export const stagingRobotsConfig: RobotsConfig = {
  rules: [
    {
      userAgent: '*',
      disallow: ['/'],
    },
    {
      userAgent: 'Googlebot',
      allow: ['/'],
      crawlDelay: 10,
    },
  ],
  sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
};

/**
 * Generate robots.txt content from configuration
 */
export function generateRobotsTxt(config: RobotsConfig): string {
  const lines: string[] = [];
  
  // Add header comment
  lines.push(`# Robots.txt for ${siteConfig.siteName}`);
  lines.push('# Generated dynamically for headless CMS built with Next.js');
  lines.push('');

  // Add rules for each user agent
  config.rules.forEach((rule, index) => {
    if (index > 0) lines.push('');
    
    lines.push(`User-agent: ${rule.userAgent}`);
    
    // Add allow rules
    if (rule.allow && rule.allow.length > 0) {
      rule.allow.forEach(path => {
        lines.push(`Allow: ${path}`);
      });
    }
    
    // Add disallow rules
    if (rule.disallow && rule.disallow.length > 0) {
      rule.disallow.forEach(path => {
        lines.push(`Disallow: ${path}`);
      });
    }
    
    // Add crawl delay if specified
    if (rule.crawlDelay) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }
  });

  // Add sitemap if specified
  if (config.sitemap) {
    lines.push('');
    lines.push(`Sitemap: ${config.sitemap}`);
  }

  // Add host if specified
  if (config.host) {
    lines.push('');
    lines.push(`Host: ${config.host}`);
  }

  return lines.join('\n');
}

/**
 * Get robots.txt configuration based on environment
 */
export function getRobotsConfig(): RobotsConfig {
  const env = process.env.NODE_ENV;
  const customEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
  
  // Check for custom staging environment
  if (customEnv === 'staging') {
    return stagingRobotsConfig;
  }
  
  switch (env) {
    case 'development':
      return developmentRobotsConfig;
    case 'production':
    default:
      return defaultRobotsConfig;
  }
}

/**
 * Validate robots.txt configuration
 */
export function validateRobotsConfig(config: RobotsConfig): boolean {
  // Check if at least one rule exists
  if (!config.rules || config.rules.length === 0) {
    console.warn('Robots.txt config must have at least one rule');
    return false;
  }

  // Validate each rule
  for (const rule of config.rules) {
    if (!rule.userAgent) {
      console.warn('Each robots.txt rule must have a userAgent');
      return false;
    }
    
    if (!rule.allow && !rule.disallow) {
      console.warn('Each robots.txt rule must have either allow or disallow directives');
      return false;
    }
  }

  return true;
}

/**
 * Custom robots.txt configurations for specific use cases
 */
export const customConfigs = {
  // Block all crawlers completely
  blockAll: {
    rules: [{ userAgent: '*', disallow: ['/'] }],
  } as RobotsConfig,

  // Allow only Google and Bing
  searchEnginesOnly: {
    rules: [
      { userAgent: '*', disallow: ['/'] },
      { userAgent: 'Googlebot', allow: ['/'] },
      { userAgent: 'Bingbot', allow: ['/'] },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  } as RobotsConfig,

  // E-commerce focused (if you add shop functionality)
  ecommerce: {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products/', '/categories/'],
        disallow: ['/cart/', '/checkout/', '/account/', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  } as RobotsConfig,
}; 