import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SIZES = [16, 32, 48];

async function generateFavicon() {
  const svgBuffer = await fs.readFile(path.resolve('public/logo.svg'));

  const buffers = await Promise.all(
    SIZES.map(async (size) => {
      return await sharp(svgBuffer)
        .resize(size, size)
        .toFormat('png')
        .toBuffer();
    }),
  );

  // For ICO, we can just use the largest PNG and the browser will scale it.
  // Or create a multi-size ICO. For simplicity, let's create a simple one from the largest size.
  // A true ICO would bundle multiple sizes. A simple way to create a .ico file
  // is often just renaming a 16x16 or 32x32 png, but that's not robust.
  // Let's create multiple PNGs and then try to create the favicon.ico from one of them.
  // The best way is to use a tool that can bundle multiple sizes into one .ico file.
  // For now, we will generate a 32x32 favicon.ico which is widely supported.

  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(path.resolve('public/favicon.ico'));

  console.log('favicon.ico generated successfully.');
}

generateFavicon();
