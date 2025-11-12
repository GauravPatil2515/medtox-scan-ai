#!/usr/bin/env node

/**
 * Update API URLs in frontend for deployment
 * Run before building for production
 */

const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('🔧 Updating API configuration...');
console.log(`📡 Backend URL: ${BACKEND_URL}`);

// Files to update
const filesToUpdate = [
  'src/pages/Dashboard.jsx',
  'src/pages/Predictions.jsx',
  'src/pages/Chat.jsx',
  'src/pages/BatchProcessing.jsx',
  'src/components/ImageAnalysis.jsx',
];

const rootDir = path.join(__dirname, 'frontend');

filesToUpdate.forEach(file => {
  const filePath = path.join(rootDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded localhost URLs with environment variable
    const originalContent = content;
    content = content.replace(
      /['"]http:\/\/localhost:5000/g,
      `process.env.REACT_APP_API_URL || 'http://localhost:5000`
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
    } else {
      console.log(`ℹ️  No changes needed: ${file}`);
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('✨ API configuration update complete!');
console.log('📝 Note: Make sure to set REACT_APP_API_URL in your environment');
