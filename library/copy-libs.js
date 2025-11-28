// scripts/copy-libs.js
const fs = require('fs');
const path = require('path');

// 定义映射关系：[源路径, 目标路径]
const mappings = [
  ['node_modules/core-js-bundle/minified.js', 'library/core-js.min.js'],
  ['node_modules/@html2canvas/html2canvas/dist/html2canvas.min.js', 'library/html2canvas.min.js'],
  ['node_modules/@zxing/library/umd/index.min.js', 'library/zxing.umd.min.js'],
];

// 确保目标目录存在
const libraryDir = path.resolve('library');
if (!fs.existsSync(libraryDir)) {
  fs.mkdirSync(libraryDir, { recursive: true });
}

let successCount = 0;

for (const [srcRel, destRel] of mappings) {
  const src = path.resolve(srcRel);
  const dest = path.resolve(destRel);

  if (!fs.existsSync(src)) {
    console.error(`❌ 源文件不存在: ${src}`);
    continue;
  }

  try {
    fs.copyFileSync(src, dest);
    console.log(`✅ 已复制: ${path.basename(src)} → ${destRel}`);
    successCount++;
  } catch (err) {
    console.error(`💥 复制失败: ${src} → ${destRel}`, err.message);
  }
}

if (successCount === mappings.length) {
  console.log('\n✨ 所有库已成功更新到 library/ 目录！');
} else {
  console.warn(`\n⚠️ 成功 ${successCount}/${mappings.length} 个，部分文件可能缺失。`);
}