# Scheduled Posts & Automated Publishing

This document explains how to implement and use scheduled posts and automated publishing in your headless CMS using only Next.js + Markdown files without a database.

## Overview

The scheduling system provides several approaches to handle scheduled posts:

1. **Build-time Filtering** - Posts are filtered based on publish dates during build
2. **GitHub Actions Automation** - Automated builds triggered by scheduled posts
3. **Local/Server Scripts** - Node.js scripts for automated publishing
4. **Admin Dashboard** - Web interface for managing scheduled posts
5. **API Routes** - Backend endpoints for admin functionality

## How It Works

### Frontmatter Configuration

Posts use frontmatter metadata to control scheduling:

```yaml
---
title: "My Scheduled Post"
slug: "my-scheduled-post"
published: true                    # Must be true for scheduling
publishedAt: "2024-12-25T10:00:00Z" # Future date for scheduling
author: "Linux-ID Team"
# ... other metadata
---
```

### Post States

Posts can be in one of three states:

- **Draft**: `published: false` - Not visible to users
- **Scheduled**: `published: true` + future `publishedAt` - Not yet visible
- **Published**: `published: true` + past `publishedAt` - Visible to users

## Implementation Approaches

### 1. Build-time Filtering (Recommended)

This approach filters posts during the build process based on the current time.

**Files:**
- `src/lib/content/scheduler.ts` - Scheduling utilities
- Updated `src/lib/content/parser.ts` - Enhanced content parsing

**Usage:**
```typescript
import { getPublishedPosts, getScheduledPosts } from '@/lib/content/scheduler';

// Get only posts that should be visible now
const visiblePosts = getPublishedPosts();

// Get posts scheduled for future
const scheduledPosts = getScheduledPosts();
```

**Benefits:**
- ✅ Works with static generation
- ✅ No server required
- ✅ SEO-friendly
- ✅ Fast performance

**Limitations:**
- ❌ Requires rebuild to publish scheduled posts
- ❌ Not real-time

### 2. GitHub Actions Automation

Automatically triggers builds when scheduled posts should be published.

**File:** `.github/workflows/scheduled-publish.yml`

**Features:**
- Runs every hour to check for scheduled posts
- Automatically builds and deploys when posts are ready
- Supports multiple deployment targets (Vercel, Netlify, GitHub Pages)
- Optional notifications (Slack, Discord, etc.)

**Setup:**
1. Enable GitHub Actions in your repository
2. Configure deployment secrets (e.g., `VERCEL_TOKEN`)
3. Customize the deployment commands in the workflow

**Benefits:**
- ✅ Fully automated
- ✅ Works with static hosting
- ✅ No server maintenance
- ✅ Reliable scheduling

**Limitations:**
- ❌ Depends on GitHub Actions
- ❌ Minimum 1-hour intervals
- ❌ Requires repository access

### 3. Local/Server Scripts

Node.js scripts for automated publishing that can run locally or on a server.

**File:** `scripts/publish-scheduler.js`

**Usage:**
```bash
# Check what would be published (dry run)
npm run publish:check

# Publish scheduled posts
npm run publish:scheduled

# Publish and rebuild (for cron jobs)
npm run schedule:cron
```

**Cron Job Example:**
```bash
# Run every 15 minutes
*/15 * * * * cd /path/to/your/project && npm run schedule:cron
```

**Benefits:**
- ✅ Flexible timing
- ✅ Can run on any server
- ✅ Full control over process
- ✅ Detailed logging

**Limitations:**
- ❌ Requires server/cron setup
- ❌ Manual configuration needed

### 4. Admin Dashboard

Web interface for managing scheduled posts.

**File:** `src/app/admin/page.tsx`

**Features:**
- View all posts by status (draft, scheduled, published)
- Publishing calendar
- Manual publish/schedule actions
- Post statistics
- Responsive design

**Access:** Visit `/admin` in your application

**Benefits:**
- ✅ User-friendly interface
- ✅ Visual post management
- ✅ No command line needed
- ✅ Real-time status updates

**Limitations:**
- ❌ Requires authentication (not implemented)
- ❌ Manual intervention needed

### 5. API Routes

Backend endpoints supporting admin functionality.

**File:** `src/app/api/admin/posts/route.ts`

**Endpoints:**
- `GET /api/admin/posts` - List all posts with status
- `GET /api/admin/posts?status=scheduled` - Filter by status
- `POST /api/admin/posts/[id]/publish` - Publish immediately
- `POST /api/admin/posts/[id]/schedule` - Schedule for later

## Usage Examples

### Creating a Scheduled Post

1. Create a new markdown file in `content/posts/`
2. Set the frontmatter:

```yaml
---
title: "My Future Post"
slug: "my-future-post"
published: true
publishedAt: "2024-12-25T10:00:00Z"  # Future date
# ... other metadata
---
```

3. The post will automatically become visible when the date arrives (depending on your chosen approach)

### Checking Scheduled Posts

```bash
# See what posts are scheduled
npm run publish:check
```

### Manual Publishing

```bash
# Publish all ready posts
npm run publish:scheduled
```

### Using the Admin Dashboard

1. Visit `/admin` in your browser
2. View posts by status
3. Use "Publish Now" or "Schedule" buttons
4. Monitor the publishing calendar

## Best Practices

### 1. Consistent Time Zones

Always use UTC timestamps in `publishedAt` to avoid timezone confusion:

```yaml
publishedAt: "2024-12-25T10:00:00Z"  # ✅ UTC
publishedAt: "2024-12-25T10:00:00"   # ❌ Ambiguous
```

### 2. Content Preparation

Prepare content in advance:
- Write posts as drafts first (`published: false`)
- Review and test before scheduling
- Set realistic publish dates

### 3. Automation Strategy

Choose the right approach for your needs:
- **Static sites**: Use GitHub Actions
- **Server hosting**: Use cron jobs with scripts
- **Manual control**: Use admin dashboard
- **Hybrid**: Combine multiple approaches

### 4. Monitoring

Monitor your scheduling system:
- Check logs regularly
- Set up notifications for failures
- Test with future dates close to now
- Verify posts appear as expected

## Troubleshooting

### Posts Not Appearing

1. Check the `publishedAt` date is in the past
2. Verify `published: true` is set
3. Ensure the build process ran after the scheduled time
4. Check for syntax errors in frontmatter

### GitHub Actions Not Running

1. Verify the workflow file is in `.github/workflows/`
2. Check repository permissions for Actions
3. Review the Actions tab for error logs
4. Ensure secrets are properly configured

### Script Errors

1. Check Node.js version compatibility
2. Verify file paths are correct
3. Ensure proper permissions for file writing
4. Review error logs for specific issues

## Advanced Configuration

### Custom Scheduling Logic

Extend the scheduler with custom logic:

```typescript
// Custom scheduling rules
export function getPostsForSpecialEvent(): BlogPost[] {
  const posts = getAllContent('post') as BlogPost[];
  return posts.filter(post => {
    // Custom logic here
    return post.tags?.includes('special-event') && isPostVisible(post);
  });
}
```

### Integration with External Services

Connect with external services:

```javascript
// Webhook notification when posts are published
async function notifyWebhook(posts) {
  await fetch('https://your-webhook-url.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publishedPosts: posts })
  });
}
```

### Multiple Publishing Channels

Publish to multiple platforms:

```javascript
// Publish to social media when posts go live
async function publishToSocial(post) {
  // Twitter API
  await postToTwitter(post.title, post.url);
  
  // LinkedIn API
  await postToLinkedIn(post.excerpt, post.url);
}
```

## Security Considerations

### Admin Dashboard Protection

Implement authentication for the admin dashboard:

```typescript
// Add authentication middleware
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check authentication
    const token = request.cookies.get('auth-token');
    if (!token || !isValidToken(token)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}
```

### API Route Security

Protect API endpoints:

```typescript
// Add API key validation
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of the handler
}
```

## Conclusion

The scheduled posting system provides flexible options for automating content publication without requiring a database. Choose the approach that best fits your hosting environment and workflow requirements.

For most static sites, the GitHub Actions approach provides the best balance of automation and simplicity. For sites with server hosting, cron jobs with the Node.js scripts offer more control and flexibility.

The admin dashboard provides a user-friendly interface for content managers, while the API routes enable integration with external tools and services. 