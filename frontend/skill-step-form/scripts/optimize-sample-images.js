/**
 * Script to optimize sample images for faster loading
 * Resizes images to 400x400 and compresses them
 * 
 * Usage: node scripts/optimize-sample-images.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available (better) or use canvas (fallback)
let sharp;
let canvas;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('sharp not found, trying canvas...');
  try {
    canvas = require('canvas');
  } catch (e2) {
    console.error('Neither sharp nor canvas is available. Please install one:');
    console.error('  npm install sharp');
    console.error('  OR');
    console.error('  npm install canvas');
    process.exit(1);
  }
}

const publicDir = path.join(__dirname, '../public');
const images = [
  'resume-sample-1.png',
  'resume-sample-2.png',
  'resume-sample-3.png',
  'resume-sample-4.png',
];

async function optimizeWithSharp(imagePath, outputPath) {
  await sharp(imagePath)
    .resize(400, 400, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(outputPath);
}

async function optimizeWithCanvas(imagePath, outputPath) {
  const { createCanvas, loadImage } = canvas;
  const img = await loadImage(imagePath);
  
  // Calculate dimensions maintaining aspect ratio
  const maxSize = 400;
  let width = img.width;
  let height = img.height;
  
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    width = width * ratio;
    height = height * ratio;
  }
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
  fs.writeFileSync(outputPath, buffer);
}

async function optimizeImages() {
  console.log('Optimizing sample images...\n');
  
  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    const outputPath = path.join(publicDir, image.replace('.png', '-optimized.jpg'));
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  ${image} not found, skipping...`);
      continue;
    }
    
    try {
      const stats = fs.statSync(inputPath);
      const originalSize = (stats.size / 1024).toFixed(2);
      
      console.log(`Processing ${image} (${originalSize} KB)...`);
      
      if (sharp) {
        await optimizeWithSharp(inputPath, outputPath);
      } else {
        await optimizeWithCanvas(inputPath, outputPath);
      }
      
      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);
      
      console.log(`  ✅ Created ${path.basename(outputPath)} (${newSize} KB, ${reduction}% smaller)\n`);
    } catch (error) {
      console.error(`  ❌ Error processing ${image}:`, error.message);
    }
  }
  
  console.log('Done! Optimized images are ready.');
  console.log('\nNext steps:');
  console.log('1. Update LandingTemplatePreview.tsx to use -optimized.jpg files');
  console.log('2. Or replace the original .png files with optimized versions');
}

optimizeImages().catch(console.error);

