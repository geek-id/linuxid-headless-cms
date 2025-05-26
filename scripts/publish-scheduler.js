#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Automated Post Publishing Script
 * 
 * This script checks for scheduled posts and publishes them by updating
 * their frontmatter when their scheduled time has arrived.
 * 
 * Usage:
 * - node scripts/publish-scheduler.js
 * - npm run publish:scheduled
 */

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function getScheduledPosts() {
  if (!fs.existsSync(CONTENT_DIR)) {
    log(`Content directory not found: ${CONTENT_DIR}`, 'error');
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
  const scheduledPosts = [];
  const now = new Date();

  files.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);

      // Check if post is scheduled for publication
      if (frontmatter.published && frontmatter.publishedAt) {
        const publishDate = new Date(frontmatter.publishedAt);
        
        if (publishDate <= now) {
          scheduledPosts.push({
            file,
            filePath,
            frontmatter,
            content,
            publishDate,
            title: frontmatter.title || file
          });
        }
      }
    } catch (error) {
      log(`Error reading file ${file}: ${error.message}`, 'error');
    }
  });

  return scheduledPosts;
}

function updatePostStatus(post) {
  try {
    // Update frontmatter to mark as published
    const updatedFrontmatter = {
      ...post.frontmatter,
      published: true,
      publishedAt: post.frontmatter.publishedAt, // Keep original scheduled time
      lastModified: new Date().toISOString()
    };

    // Reconstruct the markdown file
    const updatedContent = matter.stringify(post.content, updatedFrontmatter);

    if (DRY_RUN) {
      log(`[DRY RUN] Would publish: ${post.title}`, 'info');
      return true;
    }

    // Write the updated content back to file
    fs.writeFileSync(post.filePath, updatedContent, 'utf8');
    log(`Published: ${post.title}`, 'success');
    return true;
  } catch (error) {
    log(`Error publishing ${post.title}: ${error.message}`, 'error');
    return false;
  }
}

function generateReport(posts) {
  const published = posts.filter(p => p.success);
  const failed = posts.filter(p => !p.success);

  console.log('\n📊 Publishing Report');
  console.log('='.repeat(50));
  console.log(`Total scheduled posts: ${posts.length}`);
  console.log(`Successfully published: ${published.length}`);
  console.log(`Failed to publish: ${failed.length}`);

  if (published.length > 0) {
    console.log('\n✅ Published Posts:');
    published.forEach(post => {
      console.log(`  - ${post.title} (${post.publishDate.toISOString()})`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed Posts:');
    failed.forEach(post => {
      console.log(`  - ${post.title}`);
    });
  }

  if (DRY_RUN) {
    console.log('\n🔍 This was a dry run. No files were modified.');
    console.log('Run without --dry-run to actually publish posts.');
  }
}

function main() {
  log('Starting scheduled post publisher...', 'info');
  
  if (DRY_RUN) {
    log('Running in DRY RUN mode - no files will be modified', 'info');
  }

  const scheduledPosts = getScheduledPosts();

  if (scheduledPosts.length === 0) {
    log('No posts scheduled for publication at this time.', 'info');
    return;
  }

  log(`Found ${scheduledPosts.length} posts ready for publication`, 'info');

  if (VERBOSE) {
    console.log('\n📋 Posts to be published:');
    scheduledPosts.forEach(post => {
      console.log(`  - ${post.title} (scheduled: ${post.publishDate.toISOString()})`);
    });
  }

  // Process each scheduled post
  const results = scheduledPosts.map(post => ({
    ...post,
    success: updatePostStatus(post)
  }));

  generateReport(results);

  // Exit with error code if any posts failed to publish
  const failedCount = results.filter(r => !r.success).length;
  if (failedCount > 0) {
    process.exit(1);
  }

  log('Scheduled publishing completed successfully!', 'success');
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📅 Scheduled Post Publisher

Usage: node scripts/publish-scheduler.js [options]

Options:
  --dry-run     Show what would be published without making changes
  --verbose     Show detailed information about posts being processed
  --help, -h    Show this help message

Examples:
  node scripts/publish-scheduler.js                    # Publish scheduled posts
  node scripts/publish-scheduler.js --dry-run          # Preview what would be published
  node scripts/publish-scheduler.js --verbose          # Show detailed output
  node scripts/publish-scheduler.js --dry-run --verbose # Preview with details

Environment:
  Content directory: ${CONTENT_DIR}
  
This script checks for markdown posts with:
  - published: true
  - publishedAt: [date in the past]

And ensures they are properly published.
  `);
  process.exit(0);
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  getScheduledPosts,
  updatePostStatus,
  main
}; 