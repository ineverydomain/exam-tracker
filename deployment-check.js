#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running deployment health check...\n');

const checks = [];
let hasErrors = false;

// Check 1: Required files exist
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  '.env.local.example',
  'lib/firebase.ts',
  'contexts/AuthContext.tsx'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ Missing required file: ${file}`);
    hasErrors = true;
  }
});

// Check 2: Environment variables format
if (fs.existsSync('.env.local.example')) {
  const envContent = fs.readFileSync('.env.local.example', 'utf8');
  const envLines = envContent.split('\n').filter(line => line.trim());
  
  console.log('\n📋 Environment Variables Check:');
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} defined`);
    } else {
      console.log(`❌ Missing environment variable: ${envVar}`);
      hasErrors = true;
    }
  });
}

// Check 3: Package.json structure
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('\n📦 Package.json Check:');
  
  const requiredScripts = ['dev', 'build', 'start', 'lint'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script "${script}" defined`);
    } else {
      console.log(`❌ Missing script: ${script}`);
      hasErrors = true;
    }
  });

  const requiredDeps = ['react', 'react-dom', 'next', 'firebase'];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ Dependency "${dep}" installed`);
    } else {
      console.log(`❌ Missing dependency: ${dep}`);
      hasErrors = true;
    }
  });
}

// Check 4: Firebase configuration
if (fs.existsSync('lib/firebase.ts')) {
  const firebaseContent = fs.readFileSync('lib/firebase.ts', 'utf8');
  
  console.log('\n🔥 Firebase Configuration Check:');
  
  if (firebaseContent.includes('process.env.NEXT_PUBLIC_FIREBASE')) {
    console.log('✅ Environment variables properly referenced');
  } else {
    console.log('❌ Firebase config not using environment variables');
    hasErrors = true;
  }

  if (firebaseContent.includes('getApps().length === 0')) {
    console.log('✅ Firebase app initialization is safe');
  } else {
    console.log('⚠️  Firebase app might be initialized multiple times');
  }
}

// Check 5: Build configuration
if (fs.existsSync('next.config.mjs')) {
  console.log('\n⚙️ Next.js Configuration:');
  console.log('✅ next.config.mjs exists');
} else {
  console.log('\n❌ next.config.mjs missing');
  hasErrors = true;
}

// Check 6: Vercel configuration
if (fs.existsSync('vercel.json')) {
  console.log('\n🌐 Vercel Configuration:');
  console.log('✅ vercel.json exists');
  
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  if (vercelConfig.buildCommand) {
    console.log('✅ Build command specified');
  }
} else {
  console.log('\n⚠️  vercel.json not found (optional but recommended)');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ DEPLOYMENT CHECK FAILED');
  console.log('Please fix the issues above before deploying.');
  process.exit(1);
} else {
  console.log('✅ DEPLOYMENT CHECK PASSED');
  console.log('Your project is ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Push your code to your repository');
  console.log('2. Connect your repository to Vercel');
  console.log('3. Add environment variables in Vercel dashboard');
  console.log('4. Deploy!');
}