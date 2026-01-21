import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const BACKUP_DIR = './public/_originals_backup';
const MAX_WIDTH = 2400;
const QUALITY = 90;

// Get all image files recursively
function getImageFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip backup directory
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
  const backupPath = path.join(BACKUP_DIR, relativePath);
  
  // Create backup directory structure
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  
  // Copy original to backup
  fs.copyFileSync(filePath, backupPath);
  
  // Get image metadata
  const metadata = await sharp(filePath).metadata();
  
  // Calculate new dimensions (maintain aspect ratio)
  let width = metadata.width;
  let height = metadata.height;
  
  if (width > MAX_WIDTH) {
    height = Math.round((height / width) * MAX_WIDTH);
    width = MAX_WIDTH;
  }
  
  // Compress and resize
  const outputBuffer = await sharp(filePath)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer();
  
  // Write compressed image
  fs.writeFileSync(filePath, outputBuffer);
  
  const newSize = outputBuffer.length;
  const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
  
  console.log(`✓ ${relativePath}`);
  console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
  
  return { original: originalSize, compressed: newSize };
}

async function main() {
  console.log('🖼️  Image Compression Script');
  console.log(`   Max width: ${MAX_WIDTH}px, Quality: ${QUALITY}%`);
  console.log(`   Backup location: ${BACKUP_DIR}\n`);
  
  // Create backup directory
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  
  // Find large images
  const images = getImageFiles(PUBLIC_DIR);
  console.log(`Found ${images.length} images larger than 500KB\n`);
  
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
  console.log(`Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalCompressed / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Saved: ${((totalOriginal - totalCompressed) / 1024 / 1024).toFixed(1)}MB (${((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1)}%)`);
  console.log(`\nOriginals backed up to: ${BACKUP_DIR}`);
}

main().catch(console.error);

