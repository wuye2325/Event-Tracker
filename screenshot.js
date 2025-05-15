const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const os = require('os');

// iPhone 13 mini 的尺寸
const IPHONE_13_MINI_WIDTH = 375;
const IPHONE_13_MINI_HEIGHT = 812;

/**
 * 获取本地Chrome或Chromium可能的路径
 */
function getChromePath() {
  const platform = os.platform();
  
  if (platform === 'darwin') {  // macOS
    const paths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];
    
    for (const p of paths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
  } else if (platform === 'win32') {  // Windows
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ];
    
    for (const p of paths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
  } else if (platform === 'linux') {  // Linux
    const paths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];
    
    for (const p of paths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
  }
  
  return null;  // 未找到浏览器
}

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

  console.log('准备启动浏览器...');
  
  const chromePath = getChromePath();
  const launchOptions = {
    headless: "new",  // 使用新的headless模式
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',  // 禁用网络安全策略，允许跨域请求
      '--allow-file-access-from-files',  // 允许文件协议加载外部资源
      '--enable-features=NetworkService',
      '--window-size=375,812'
    ],
    ignoreHTTPSErrors: true,
  };
  
  if (chromePath) {
    console.log(`使用本地Chrome: ${chromePath}`);
    launchOptions.executablePath = chromePath;
  } else {
    console.log('未找到本地Chrome，使用Puppeteer自带的浏览器');
  }
  
  let browser = null;
  
  try {
    browser = await puppeteer.launch(launchOptions);
    
    console.log('浏览器启动成功，创建新页面...');
    const page = await browser.newPage();
    
    // 设置视窗大小为iPhone 13 mini
    await page.setViewport({
      width: IPHONE_13_MINI_WIDTH,
      height: IPHONE_13_MINI_HEIGHT,
      deviceScaleFactor: 2, // 设置设备缩放比例，提高截图质量
      isMobile: true,
    });

    // 监听网络请求，用于调试字体加载问题
    page.on('console', msg => console.log('页面日志:', msg.text()));
    
    // 监听字体和样式表请求
    const resourceTypesToLog = ['stylesheet', 'font', 'fetch', 'xhr'];
    page.on('request', request => {
      const resourceType = request.resourceType();
      if (resourceTypesToLog.includes(resourceType)) {
        console.log(`请求资源: ${resourceType} - ${request.url()}`);
      }
    });
    
    page.on('requestfailed', request => {
      const resourceType = request.resourceType();
      if (resourceTypesToLog.includes(resourceType)) {
        console.log(`资源加载失败: ${resourceType} - ${request.url()}`);
        console.log(`失败原因: ${request.failure().errorText}`);
      }
    });
    
    // 设置更长的导航超时
    await page.setDefaultNavigationTimeout(60000);

    // 如果是本地文件，需要加上file://前缀
    const fileUrl = htmlPath.startsWith('http') 
      ? htmlPath 
      : `file://${path.resolve(htmlPath)}`;

    console.log(`正在加载页面: ${fileUrl}`);
    
    // 打开HTML页面
    await page.goto(fileUrl, { 
      waitUntil: 'networkidle2', // 使用networkidle2等待网络活动基本完成
      timeout: 60000 
    });
    
    console.log('页面加载完成，等待字体和样式加载...');
    
    // 等待字体和图标加载
    await page.evaluate(async () => {
      return new Promise((resolve) => {
        // 加载外部FontAwesome脚本
        const checkFontAwesome = () => {
          const icons = document.querySelectorAll('.fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands');
          let allIconsVisible = true;
          
          // 检查图标是否可见
          icons.forEach(icon => {
            const style = window.getComputedStyle(icon);
            // FontAwesome加载后，font-family会包含"Font Awesome"字符串
            if (!style.fontFamily.includes('Font Awesome') && !style.fontFamily.includes('FontAwesome')) {
              allIconsVisible = false;
            }
          });
          
          if (allIconsVisible && icons.length > 0) {
            console.log('FontAwesome图标已加载完成');
            resolve();
          } else {
            console.log('FontAwesome图标还未加载完成，继续等待...');
            setTimeout(checkFontAwesome, 500);
          }
        };
        
        // 如果5秒后仍未加载完成，则无论如何继续执行
        setTimeout(() => {
          console.log('达到最大等待时间，继续执行');
          resolve();
        }, 5000);
        
        checkFontAwesome();
      });
    });
    
    // 额外等待一段时间确保所有资源加载
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('开始修改页面固定元素...');
    // 在截图前修改固定定位的按钮样式，使其在文档流的底部而不是视口固定位置
    await page.evaluate(() => {
      return new Promise((resolve) => {
        try {
          const actionButtons = document.querySelector('.action-buttons');
          if (actionButtons) {
            // 保存原始样式以便后续恢复
            actionButtons.setAttribute('data-original-style', actionButtons.getAttribute('style') || '');
            
            // 修改为静态定位并添加到文档流底部
            actionButtons.style.position = 'static';
            actionButtons.style.bottom = 'auto';
            actionButtons.style.left = 'auto';
            actionButtons.style.transform = 'none';
            actionButtons.style.margin = '20px auto';
            actionButtons.style.maxWidth = '358px';
            actionButtons.style.width = 'calc(100% - 32px)';
            
            // 确保按钮在文档末尾
            const content = document.querySelector('.content');
            if (content) {
              // 创建一个包装容器来容纳底部按钮
              const buttonContainer = document.createElement('div');
              buttonContainer.style.padding = '20px 0';
              buttonContainer.appendChild(actionButtons);
              
              // 将包装容器添加到内容末尾
              content.appendChild(buttonContainer);
            }
          }
          resolve(true);
        } catch (error) {
          console.error('修改固定元素时出错:', error);
          resolve(false);
        }
      });
    });

    // 手动注入FontAwesome样式作为备用方案
    await page.evaluate(() => {
      return new Promise((resolve) => {
        try {
          // 检查FontAwesome是否已经加载
          const testIcon = document.querySelector('.fas, .fa, .far, .fab');
          if (testIcon) {
            const style = window.getComputedStyle(testIcon);
            if (!style.fontFamily.includes('Font Awesome') && !style.fontFamily.includes('FontAwesome')) {
              console.log('FontAwesome未正确加载，尝试手动添加内联样式');
              
              // 创建一个内联样式，为图标添加一些基本样式
              const style = document.createElement('style');
              style.textContent = `
                .fa, .fas, .far, .fab {
                  display: inline-block;
                  width: 1em;
                  text-align: center;
                  font-style: normal;
                }
                .fa-chevron-left:before { content: "←"; }
                .fa-star:before { content: "★"; }
                .fa-plus:before { content: "+"; }
                .fa-times:before { content: "×"; }
                .fa-share-alt:before { content: "↗"; }
                .fa-eye:before { content: "👁"; }
                .fa-comment:before { content: "💬"; }
                .fa-thumbs-up:before { content: "👍"; }
                .fa-thumbs-down:before { content: "👎"; }
                .fa-project-diagram:before { content: "📊"; }
                .fa-circle:before { content: "⬤"; }
                .fa-check-circle:before { content: "✓"; }
                .fa-copy:before { content: "📋"; }
                .fa-arrow-down-wide-short:before { content: "↓"; }
                .fa-arrow-up-wide-short:before { content: "↑"; }
              `;
              document.head.appendChild(style);
            }
          }
          resolve(true);
        } catch (error) {
          console.error('添加备用图标时出错:', error);
          resolve(false);
        }
      });
    });

    console.log('正在截取页面...');
    // 截取完整页面
    const fileName = path.basename(htmlPath, '.html') + '.png';
    const outputPath = path.join(outputDir, fileName);

    await page.screenshot({
      path: outputPath,
      fullPage: true
    });

    console.log(`已保存截图到: ${outputPath}`);
  } catch (error) {
    console.error('截图过程中出错:', error);
  } finally {
    if (browser) {
      console.log('关闭浏览器...');
      await browser.close();
    }
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