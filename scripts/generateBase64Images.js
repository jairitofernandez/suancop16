// scripts/generateBase64Images.js
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFilePath = path.join(__dirname, '..', 'lib', 'base64Images.ts');

const imageFiles = fs.readdirSync(imagesDir).filter((file) => file.endsWith('.jpg'));

const imagesBase64 = {};

imageFiles.forEach((file) => {
  const filePath = path.join(imagesDir, file);
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  imagesBase64[file] = `data:image/jpeg;base64,${base64Data}`;
});

const outputContent =
  '// Este archivo es generado automáticamente por scripts/generateBase64Images.js\n' +
  'export const base64Images: { [key: string]: string } = ' +
  JSON.stringify(imagesBase64, null, 2) +
  ';\n';

fs.writeFileSync(outputFilePath, outputContent);

console.log('Imágenes en Base64 generadas exitosamente.');
