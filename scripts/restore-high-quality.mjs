import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = './public/_originals_backup';
const PUBLIC_DIR = './public';
const MAX_WIDTH = 2400;  // High quality
const QUALITY = 90;      // High quality

function getBackupFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getBackupFiles(fullPath, files);
    } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function restoreAndCompress(backupPath) {
  // Calculate the destination path
  const relativePath = path.relative(BACKUP_DIR, backupPath);
  const destPath = path.join(PUBLIC_DIR, relativePath);
  
  // Get original file size
  const originalSize = fs.statSync(backupPath).size;
  
  // Get image metadata
  const metadata = await sharp(backupPath).metadata();
  
  // Calculate new dimensions
  let width = metadata.width;
  let height = metadata.height;
  
  if (width > MAX_WIDTH) {
    height = Math.round((height / width) * MAX_WIDTH);
    width = MAX_WIDTH;
  }
  
  // Compress at high quality
  const outputBuffer = await sharp(backupPath)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer();
  
  // Write to destination
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, outputBuffer);
  
  const newSize = outputBuffer.length;
  console.log(`✓ ${relativePath}`);
  console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024).toFixed(0)}KB`);
  
  return newSize;
}

async function main() {
  console.log('🖼️  Restoring High Quality Images (2400px, 90%)\n');
  
  const backupFiles = getBackupFiles(BACKUP_DIR);
  console.log(`Found ${backupFiles.length} original files in backup\n`);
  
  let totalSize = 0;
  
  for (const file of backupFiles) {
    try {
      totalSize += await restoreAndCompress(file);
    } catch (err) {
      console.error(`✗ Failed: ${file} - ${err.message}`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total output size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
  console.log(`\nHigh quality images restored!`);
}

main().catch(console.error);

