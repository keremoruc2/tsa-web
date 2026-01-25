const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/images/logo.jpg');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  console.log('Generating favicons from logo.jpg...');
  
  const image = sharp(inputPath);
  
  // Generate favicon.ico (32x32)
  await image
    .clone()
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✓ favicon-32x32.png');

  // Generate 16x16
  await image
    .clone()
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('✓ favicon-16x16.png');

  // Generate apple-touch-icon (180x180)
  await image
    .clone()
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // Generate android-chrome icons
  await image
    .clone()
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log('✓ android-chrome-192x192.png');

  await image
    .clone()
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log('✓ android-chrome-512x512.png');

  // Generate favicon.ico (multi-size ICO using 32x32 PNG as base)
  // For simplicity, we'll just copy the 32x32 as favicon.ico
  // Most modern browsers prefer PNG anyway
  await image
    .clone()
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ favicon.ico');

  console.log('\n✅ All favicons generated successfully!');
}

generateFavicons().catch(console.error);
