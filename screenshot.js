const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// iPhone 13 mini 的尺寸
const IPHONE_13_MINI_WIDTH = 375;
const IPHONE_13_MINI_HEIGHT = 812;

/**
 * 截取HTML页面的完整截图
 * @param {string} htmlPath - HTML文件路径
 * @param {string} outputDir - 输出目录
 */
async function captureScreenshot(htmlPath, outputDir) {
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new', // 使用新的无头模式
  });

  try {
    const page = await browser.newPage();
    
    // 设置视窗大小为iPhone 13 mini
    await page.setViewport({
      width: IPHONE_13_MINI_WIDTH,
      height: IPHONE_13_MINI_HEIGHT,
      deviceScaleFactor: 2, // 设置设备缩放比例，提高截图质量
      isMobile: true,
    });

    // 如果是本地文件，需要加上file://前缀
    const fileUrl = htmlPath.startsWith('http') 
      ? htmlPath 
      : `file://${path.resolve(htmlPath)}`;

    // 打开HTML页面
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // 获取页面全高
    const pageHeight = await page.evaluate(() => {
      return document.documentElement.scrollHeight;
    });

    // 截取完整页面
    const fileName = path.basename(htmlPath, '.html') + '.png';
    const outputPath = path.join(outputDir, fileName);

    await page.screenshot({
      path: outputPath,
      fullPage: true,
      clip: {
        x: 0,
        y: 0,
        width: IPHONE_13_MINI_WIDTH,
        height: pageHeight,
      },
    });

    console.log(`已保存截图到: ${outputPath}`);
  } catch (error) {
    console.error('截图过程中出错:', error);
  } finally {
    await browser.close();
  }
}

/**
 * 批量处理指定目录下的所有HTML文件
 * @param {string} inputDir - 包含HTML文件的目录
 * @param {string} outputDir - 截图输出目录
 */
async function batchProcess(inputDir, outputDir) {
  const files = fs.readdirSync(inputDir);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  for (const file of htmlFiles) {
    const htmlPath = path.join(inputDir, file);
    console.log(`正在处理: ${file}`);
    await captureScreenshot(htmlPath, outputDir);
  }
  
  console.log('所有文件处理完成');
}

// 命令行参数处理
if (require.main === module) {
  const args = process.argv.slice(2);
  const usage = `
使用方法:
  单个文件: node screenshot.js --file <HTML文件路径> --output <输出目录>
  批量处理: node screenshot.js --dir <HTML文件目录> --output <输出目录>
`;

  if (args.length < 4) {
    console.log(usage);
    process.exit(1);
  }

  let mode, target, outputDir;

  for (let i = 0; i < args.length; i += 2) {
    if (args[i] === '--file') {
      mode = 'single';
      target = args[i + 1];
    } else if (args[i] === '--dir') {
      mode = 'batch';
      target = args[i + 1];
    } else if (args[i] === '--output') {
      outputDir = args[i + 1];
    }
  }

  if (!mode || !target || !outputDir) {
    console.log(usage);
    process.exit(1);
  }

  if (mode === 'single') {
    captureScreenshot(target, outputDir).catch(console.error);
  } else if (mode === 'batch') {
    batchProcess(target, outputDir).catch(console.error);
  }
}

module.exports = {
  captureScreenshot,
  batchProcess
}; 