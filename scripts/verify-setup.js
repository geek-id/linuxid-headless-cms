#!/usr/bin/env node

/**
 * LinuxID Headless CMS - Setup Verification Script
 * 
 * This script helps verify your local development environment
 * is properly configured before starting development.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark() {
  return `${colors.green}✅${colors.reset}`;
}

function crossmark() {
  return `${colors.red}❌${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠️${colors.reset}`;
}

async function checkNodeVersion() {
  log('\n📋 Checking System Requirements...', 'blue');
  
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      log(`${checkmark()} Node.js ${nodeVersion} (✓ >= 18.x required)`);
      return true;
    } else {
      log(`${crossmark()} Node.js ${nodeVersion} (❌ >= 18.x required)`);
      return false;
    }
  } catch (error) {
    log(`${crossmark()} Failed to check Node.js version`);
    return false;
  }
}

async function checkNpmVersion() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log(`${checkmark()} npm ${npmVersion}`);
    return true;
  } catch (error) {
    log(`${crossmark()} npm not found`);
    return false;
  }
}

async function checkProjectStructure() {
  log('\n📁 Checking Project Structure...', 'blue');
  
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'env.example'
  ];
  
  const requiredDirs = [
    'src/app',
    'src/lib',
    'src/types',
    'content',
    'docs'
  ];
  
  let allExists = true;
  
  // Check files
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      log(`${checkmark()} ${file}`);
    } else {
      log(`${crossmark()} ${file} (missing)`);
      allExists = false;
    }
  }
  
  // Check directories
  for (const dir of requiredDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      log(`${checkmark()} ${dir}/`);
    } else {
      log(`${crossmark()} ${dir}/ (missing)`);
      allExists = false;
    }
  }
  
  return allExists;
}

async function checkDependencies() {
  log('\n📦 Checking Dependencies...', 'blue');
  
  try {
    if (!fs.existsSync('node_modules')) {
      log(`${crossmark()} node_modules not found. Run: npm install`);
      return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'next',
      'react',
      'typescript',
      'tailwindcss',
      '@tailwindcss/typography',
      'date-fns'
    ];
    
    let allInstalled = true;
    
    for (const dep of requiredDeps) {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        log(`${checkmark()} ${dep}`);
      } else {
        log(`${crossmark()} ${dep} (not found in package.json)`);
        allInstalled = false;
      }
    }
    
    return allInstalled;
  } catch (error) {
    log(`${crossmark()} Failed to check dependencies: ${error.message}`);
    return false;
  }
}

async function checkEnvironmentFile() {
  log('\n🔧 Checking Environment Configuration...', 'blue');
  
  if (!fs.existsSync('.env.local')) {
    log(`${warning()} .env.local not found`);
    log(`   Create it by copying: cp env.example .env.local`);
    return false;
  }
  
  log(`${checkmark()} .env.local exists`);
  
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const requiredVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'ADMIN_EMAILS'
    ];
    
    let allSet = true;
    
    for (const varName of requiredVars) {
      if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your-`)) {
        log(`${checkmark()} ${varName} (configured)`);
      } else {
        log(`${warning()} ${varName} (needs configuration)`);
        allSet = false;
      }
    }
    
    return allSet;
  } catch (error) {
    log(`${crossmark()} Failed to read .env.local`);
    return false;
  }
}

async function checkConfigDirectory() {
  log('\n⚙️ Checking Configuration System...', 'blue');
  
  if (fs.existsSync('.config')) {
    log(`${checkmark()} .config/ directory exists`);
    
    if (fs.existsSync('.config/site.json')) {
      log(`${checkmark()} .config/site.json exists`);
    } else {
      log(`${warning()} .config/site.json will be auto-created`);
    }
    
    if (fs.existsSync('.config/admin.json')) {
      log(`${checkmark()} .config/admin.json exists`);
    } else {
      log(`${warning()} .config/admin.json will be auto-created`);
    }
  } else {
    log(`${warning()} .config/ directory will be auto-created on first run`);
  }
  
  return true;
}

async function checkContentDirectory() {
  log('\n📝 Checking Content Structure...', 'blue');
  
  const contentDirs = ['content/posts', 'content/pages', 'content/reviews'];
  let hasContent = false;
  
  for (const dir of contentDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
      log(`${checkmark()} ${dir}/ (${files.length} files)`);
      if (files.length > 0) hasContent = true;
    } else {
      log(`${warning()} ${dir}/ (will be created)`);
    }
  }
  
  if (!hasContent) {
    log(`${warning()} No markdown content found - you can create some via the admin panel`);
  }
  
  return true;
}

async function testBuild() {
  log('\n🔨 Testing Build Process...', 'blue');
  
  try {
    log('Running: npm run build (this may take a moment...)');
    execSync('npm run build', { stdio: 'pipe' });
    log(`${checkmark()} Build successful`);
    
    if (fs.existsSync('out')) {
      const files = fs.readdirSync('out').length;
      log(`${checkmark()} Output generated (${files} files in out/)`);
    }
    
    return true;
  } catch (error) {
    log(`${crossmark()} Build failed`);
    log(`   Error: ${error.message}`);
    return false;
  }
}

async function printSummary(results) {
  log('\n' + '='.repeat(50), 'blue');
  log('📊 SETUP VERIFICATION SUMMARY', 'bold');
  log('='.repeat(50), 'blue');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  if (passed === total) {
    log(`\n🎉 ALL CHECKS PASSED! (${passed}/${total})`, 'green');
    log('\nYour LinuxID Headless CMS is ready!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Start development server: npm run dev');
    log('2. Open http://localhost:3000 in your browser');
    log('3. Visit /admin to access the admin panel');
  } else {
    log(`\n${warning()} ${passed}/${total} checks passed`, 'yellow');
    log('\nIssues found:', 'red');
    
    results.forEach(result => {
      if (!result.passed) {
        log(`- ${result.name}: ${result.message || 'Failed'}`, 'red');
      }
    });
    
    log('\nRecommended actions:', 'blue');
    log('1. Fix the issues above');
    log('2. Run this script again: node scripts/verify-setup.js');
    log('3. Check the setup guide: docs/SETUP-GUIDE.md');
  }
  
  log('\n📚 Documentation:', 'blue');
  log('- Setup Guide: docs/SETUP-GUIDE.md');
  log('- Quick Reference: docs/QUICK-REFERENCE.md');
  log('- Deployment Guide: docs/DEPLOYMENT-GUIDE.md');
  log('- Main README: README.md');
}

async function main() {
  log('🚀 LinuxID Headless CMS - Setup Verification', 'bold');
  log('===============================================', 'blue');
  
  const results = [];
  
  // Run all checks
  results.push({ name: 'Node.js Version', passed: await checkNodeVersion() });
  results.push({ name: 'npm Installation', passed: await checkNpmVersion() });
  results.push({ name: 'Project Structure', passed: await checkProjectStructure() });
  results.push({ name: 'Dependencies', passed: await checkDependencies() });
  results.push({ name: 'Environment File', passed: await checkEnvironmentFile() });
  results.push({ name: 'Configuration System', passed: await checkConfigDirectory() });
  results.push({ name: 'Content Structure', passed: await checkContentDirectory() });
  
  // Optional build test
  log('\n🎯 Optional: Testing build process...', 'blue');
  log('This will verify that your setup can build successfully.');
  
  try {
    const buildResult = await testBuild();
    results.push({ name: 'Build Test', passed: buildResult });
  } catch (error) {
    results.push({ 
      name: 'Build Test', 
      passed: false, 
      message: 'Build test failed - check your configuration' 
    });
  }
  
  // Print summary
  await printSummary(results);
}

// Run the verification
if (require.main === module) {
  main().catch(error => {
    console.error(`${colors.red}❌ Verification failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = { main }; 