import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const MAX_WIDTH = 1600;  // Smaller max width
const QUALITY = 80;      // Lower quality but still good
const TARGET_SIZE = 400 * 1024; // Target ~400KB

// Get all image files recursively
function getImageFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!fullPath.includes('_originals_backup')) {
        getImageFiles(fullPath, files);
      }
    } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
      // Only process images larger than 500KB
      if (stat.size > 500 * 1024) {
        files.push({ path: fullPath, size: stat.size });
      }
    }
  }
  
  return files;
}

async function compressImage(filePath, originalSize) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  
  // Get image metadata
  const metadata = await sharp(filePath).metadata();
  
  // Calculate new dimensions
  let width = metadata.width;
  let height = metadata.height;
  
  if (width > MAX_WIDTH) {
    height = Math.round((height / width) * MAX_WIDTH);
    width = MAX_WIDTH;
  }
  
  // Try progressively lower quality until under target size
  let quality = QUALITY;
  let outputBuffer;
  
  do {
    outputBuffer = await sharp(filePath)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toBuffer();
    
    if (outputBuffer.length > TARGET_SIZE && quality > 60) {
      quality -= 5;
    } else {
      break;
    }
  } while (quality >= 60);
  
  // Write compressed image
  fs.writeFileSync(filePath, outputBuffer);
  
  const newSize = outputBuffer.length;
  const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
  
  console.log(`✓ ${relativePath}`);
  console.log(`  ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (q=${quality}, ${savings}% smaller)`);
  
  return { original: originalSize, compressed: newSize };
}

async function main() {
  console.log('🖼️  Aggressive Image Compression');
  console.log(`   Max width: ${MAX_WIDTH}px, Target: <${TARGET_SIZE/1024}KB\n`);
  
  const images = getImageFiles(PUBLIC_DIR);
  console.log(`Found ${images.length} images still over 500KB\n`);
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const img of images) {
    try {
      const result = await compressImage(img.path, img.size);
      totalOriginal += result.original;
      totalCompressed += result.compressed;
    } catch (err) {
      console.error(`✗ Failed: ${img.path} - ${err.message}`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${(totalOriginal / 1024).toFixed(0)}KB → ${(totalCompressed / 1024).toFixed(0)}KB`);
  console.log(`Saved: ${((totalOriginal - totalCompressed) / 1024).toFixed(0)}KB more`);
}

main().catch(console.error);

