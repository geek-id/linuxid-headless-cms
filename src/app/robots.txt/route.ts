import { getRobotsConfig, generateRobotsTxt, validateRobotsConfig } from '@/lib/utils/robots';

export async function GET() {
  try {
    // Get the appropriate robots configuration based on environment
    const config = getRobotsConfig();
    
    // Validate the configuration
    if (!validateRobotsConfig(config)) {
      console.error('Invalid robots.txt configuration');
      // Fallback to a basic configuration
      const fallbackConfig = {
        rules: [{ userAgent: '*', disallow: ['/'] }],
      };
      const robotsTxt = generateRobotsTxt(fallbackConfig);
      
      return new Response(robotsTxt, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=300, s-maxage=300', // Shorter cache for fallback
        },
      });
    }
    
    // Generate the robots.txt content
    const robotsTxt = generateRobotsTxt(config);
    
    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex', // Prevent indexing of robots.txt itself
      },
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Return a minimal robots.txt in case of error
    const errorRobotsTxt = `# Error generating robots.txt
User-agent: *
Disallow: /`;
    
    return new Response(errorRobotsTxt, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });
  }
} 