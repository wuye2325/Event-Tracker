# HTML截图工具更新说明

## 功能概述

为了满足项目对高保真原型的截图需求，我们开发了一个基于Node.js和Puppeteer的HTML页面截图工具。该工具能够按照iPhone 13 mini的屏幕尺寸(375x812)截取HTML页面，并自动处理滚动部分，生成完整的页面截图。

## 实现细节

1. **核心技术**：
   - 使用Node.js作为运行环境
   - 使用Puppeteer库控制无头Chrome浏览器
   - 设置视窗大小匹配iPhone 13 mini (375x812)
   - 支持deviceScaleFactor=2以提高截图质量

2. **主要功能**：
   - 单个HTML文件截图
   - 批量处理目录下的所有HTML文件
   - 自动创建输出目录
   - 保持原文件名，以PNG格式保存

3. **文件结构**：
   - `screenshot.js`：主要脚本文件
   - `package.json`：依赖配置文件

## 使用说明

### 截取单个HTML文件

```bash
node screenshot.js --file <HTML文件路径> --output <输出目录>
```

### 批量处理目录下的所有HTML文件

```bash
node screenshot.js --dir <HTML文件目录> --output <输出目录>
```

### 通过npm脚本运行

```bash
# 单个文件
npm run screenshot -- --file <HTML文件路径> --output <输出目录>

# 批量处理
npm run screenshot -- --dir <HTML文件目录> --output <输出目录>
```

## 安装方法

1. 确保已安装Node.js (建议12.0.0或更高版本)
2. 在项目目录中执行：
   ```bash
   npm install
   ```
3. 如遇到Chrome下载问题，可设置环境变量跳过下载：
   ```bash
   SET PUPPETEER_SKIP_DOWNLOAD=true && npm install puppeteer
   ```

## 技术难点解决

1. **完整页面截图**：通过获取页面实际高度，结合fullPage参数实现完整页面的截图
2. **本地文件处理**：自动为本地HTML文件添加file://前缀
3. **网络资源等待**：使用waitUntil: 'networkidle0'确保页面资源加载完成后再截图
4. **环境变量处理**：提供跳过Chrome下载的方案，解决网络问题

## 未来改进方向

1. 增加更多设备尺寸选项
2. 支持JavaScript交互后的页面状态截图
3. 优化图片质量和压缩
4. 添加截图水印或时间戳功能
5. 支持批量截图的并发处理 